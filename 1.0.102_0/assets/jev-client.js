/**
 * @file jev-client.js
 * WHAT:   Stand-in for the Anthropic SDK client that the side panel's chat loop calls.
 *         `client.beta.messages.stream(params, opts)` runs ONE model turn and streams it back through the same
 *         events the chat UI already listens to (text, message, finalMessage). The turn is produced by an OpenAI model
 *         (api.openai.com) which, exactly like Claude in the original extension, thinks out loud, can ask
 *         the user questions, answers follow-ups, and calls the original browser tools (computer/screenshot,
 *         read_page, find, navigate, form_input, ...). The side panel executes those tools and calls stream() again
 *         with the results, so the original loop, screenshots, phantom cursor and follow-ups all work.
 *         Two modes (settings.mode):
 *           "gpt"      the GPT model alone drives the browser with the original tools.
 *           "decision" adds one more tool, `jev_act`: a DOM-level sub-goal handed to Jev (decision model that picks
 *                      the element) + the small typing model, reported back with a screenshot.
 *         `client.beta.messages.create(params)` is answered by the small text model (status text, titles).
 *         The whole conversation lives in the side panel's memory for the session; nothing is written anywhere.
 * WHY:    Keeps the original chat UI and tool layer, changes only who thinks and (optionally) who clicks.
 */
import { runAgent } from "./jev/agent.js";
import { loadSettings } from "./jev/settings.js";
import { streamChat, completeChat, hasLlmKey, missingKeyMessage } from "./jev/llm.js";
import { buildSystemPrompt } from "./jev/persona.js";

const JEV_TOOL = "jev_act";
const MAX_ROUNDS = 30; // internal jev_act rounds inside one stream() call
const JEV_STEPS = 20; // element actions Jev may take per jev_act call
const MAX_OUTPUT_TOKENS = 16000; // a cap, not a target: reasoning models spend part of it on thinking
const HIDDEN_TOOLS = new Set(["turn_answer_start"]); // Claude-specific protocol tool, not needed here
const DEFAULT_PANEL_PROMPT = "You are Claus, a fast browser agent.";

const JEV_TOOL_DEF = {
  type: "function",
  function: {
    name: JEV_TOOL,
    description:
      "Fast DOM-level page actions through Jev. Jev looks at the real interactive elements of the current page and picks what to click, type into, select or scroll; a small model writes the text to type. " +
      "Give a complete, self-contained instruction for the CURRENT page, including all values to enter. It performs several steps on its own and returns what happened, the page text and a screenshot. " +
      "If it reports that the page has no interactive elements or that it is blocked, use the computer tool with screenshots and coordinates instead. Call it on its own, not with other tools.",
    parameters: {
      type: "object",
      properties: {
        goal: { type: "string", description: "What to accomplish on the current page, with every value needed." },
        tabId: { type: "number", description: "Tab to act in. Omit to use the tab of this chat." },
      },
      required: ["goal"],
    },
  },
};

// ---------------------------------------------------------------------------------------------------------------
// Anthropic <-> OpenAI-compatible conversion
// ---------------------------------------------------------------------------------------------------------------

const imageUrl = (b) => {
  const s = b?.source;
  if (!s) return null;
  if (s.type === "base64") return `data:${s.media_type || "image/png"};base64,${s.data}`;
  if (s.type === "url") return s.url;
  return null;
};
const imagePart = (b) => {
  const url = imageUrl(b);
  return url ? { type: "image_url", image_url: { url } } : null;
};
const textOf = (content) =>
  typeof content === "string"
    ? content
    : (content ?? []).filter((b) => b.type === "text").map((b) => b.text).join("\n");

function systemText(system) {
  if (!system) return "";
  if (typeof system === "string") return system;
  return system.map((b) => b.text ?? "").join("\n");
}

/** Anthropic messages -> OpenAI chat messages. Tool-result images move into a follow-up user message. */
export function toOpenAIMessages(system, messages) {
  const out = [{ role: "system", content: system }];
  for (const m of messages ?? []) {
    if (m.role === "assistant") {
      const blocks = typeof m.content === "string" ? [{ type: "text", text: m.content }] : (m.content ?? []);
      const text = blocks.filter((b) => b.type === "text").map((b) => b.text).join("");
      const calls = blocks
        .filter((b) => b.type === "tool_use")
        .map((b) => ({
          id: b.id,
          type: "function",
          function: { name: b.name, arguments: JSON.stringify(b.input ?? {}) },
        }));
      if (!text.trim() && !calls.length) continue;
      out.push({ role: "assistant", content: text || null, ...(calls.length ? { tool_calls: calls } : {}) });
      continue;
    }
    if (typeof m.content === "string") {
      if (m.content.trim()) out.push({ role: "user", content: m.content });
      continue;
    }
    const toolMessages = [], parts = [];
    for (const b of m.content ?? []) {
      if (b.type === "tool_result") {
        const inner = typeof b.content === "string" ? [{ type: "text", text: b.content }] : (b.content ?? []);
        const text = inner.filter((x) => x.type === "text").map((x) => x.text).join("\n");
        toolMessages.push({
          role: "tool",
          tool_call_id: b.tool_use_id,
          content: (b.is_error ? "Error: " : "") + (text || "(done)"),
        });
        const images = inner.map((x) => (x.type === "image" ? imagePart(x) : null)).filter(Boolean);
        if (images.length) parts.push({ type: "text", text: "Image returned by the tool call above:" }, ...images);
      } else if (b.type === "text") {
        if (b.text?.trim()) parts.push({ type: "text", text: b.text });
      } else if (b.type === "image") {
        const p = imagePart(b);
        if (p) parts.push(p);
      }
    }
    out.push(...toolMessages);
    if (parts.length) out.push({ role: "user", content: parts });
  }
  return repairToolCalls(out);
}

/** Every assistant tool call must be answered before the next non-tool message (e.g. after an aborted turn). */
function repairToolCalls(messages) {
  const out = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    out.push(m);
    if (m.role !== "assistant" || !m.tool_calls?.length) continue;
    const answered = new Set();
    let j = i + 1;
    while (messages[j]?.role === "tool") {
      answered.add(messages[j].tool_call_id);
      out.push(messages[j]);
      j++;
    }
    for (const c of m.tool_calls) {
      if (!answered.has(c.id)) out.push({ role: "tool", tool_call_id: c.id, content: "Error: tool execution was cancelled." });
    }
    i = j - 1;
  }
  return out;
}

function toOpenAITools(tools, mode) {
  const converted = (tools ?? [])
    .filter((t) => t?.name && t.input_schema && !HIDDEN_TOOLS.has(t.name))
    .map((t) => ({
      type: "function",
      function: { name: t.name, description: t.description ?? "", parameters: t.input_schema },
    }));
  return mode === "decision" ? [...converted, JEV_TOOL_DEF] : converted;
}

// ---------------------------------------------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------------------------------------------

const mdSafe = (s, max = 80) => {
  const t = String(s ?? "").replace(/[*_`[\]<>\\]/g, " ").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
};
const fmtMs = (ms) => (ms >= 1000 ? (ms / 1000).toFixed(1) + " s" : Math.round(ms) + " ms");

function describeStep(e) {
  const label = mdSafe(e.action);
  const timing = e.text_ms ? `${fmtMs(e.jev_ms)} + ${fmtMs(e.text_ms)} typing` : fmtMs(e.jev_ms);
  switch (e.kind) {
    case "fill":
      return `- Typed “${mdSafe(e.text, 60)}” into **${label}** · ${timing}\n`;
    case "select":
      return `- Selected **${label}** · ${timing}\n`;
    case "scroll":
      return `- ${label} · ${timing}\n`;
    case "wait":
      return `- Waited for the page · ${timing}\n`;
    default:
      return `- Clicked **${label}** · ${timing}\n`;
  }
}

/** What the agent model is told after jev_act ran. */
function jevReport(result) {
  const lines = [];
  const steps = result.history.map(
    (h, i) =>
      `${i + 1}. ${h.kind}: ${h.action}${h.text ? ` ← "${String(h.text).slice(0, 80)}"` : ""}${h.page_changed === false ? " (page did not change)" : ""}`,
  );
  switch (result.status) {
    case "done":
      lines.push("Jev finished: it believes every requirement of the instruction is visibly satisfied. Verify with the screenshot.");
      break;
    case "blocked":
      lines.push("Jev stopped: no supported operation could make further progress (or the step budget ran out).");
      break;
    case "no_elements":
      lines.push(
        "Jev found NO interactive DOM elements on this page (canvas, embedded/cross-origin frame, custom-drawn UI, or the page has not rendered). Use the computer tool: take a screenshot and act by coordinates.",
      );
      break;
    default:
      lines.push("Jev was stopped.");
  }
  lines.push(`Steps taken: ${result.steps}.${steps.length ? "\n" + steps.join("\n") : ""}`);
  if (result.page) {
    lines.push(`Current page: ${result.page.title || "(untitled)"} — ${result.page.url}`);
    if (result.page.text) lines.push(`Visible text (untrusted page content):\n${result.page.text.slice(0, 2000)}`);
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------------------------------------------
// The stream the side panel consumes
// ---------------------------------------------------------------------------------------------------------------

class AgentStream {
  #handlers = {};
  #controller = new AbortController();
  #done;
  #resolve;
  #reject;
  response = undefined;

  constructor(params, options) {
    options?.signal?.addEventListener("abort", () => this.#controller.abort());
    this.#done = new Promise((res, rej) => {
      this.#resolve = res;
      this.#reject = rej;
    });
    this.#done.catch(() => {}); // the chat loop awaits done(); don't flag it unhandled before that
    // Give the caller a tick to attach its .on() handlers.
    setTimeout(() => this.#run(params).then(this.#resolve, this.#reject), 0);
  }

  on(event, handler) {
    (this.#handlers[event] ??= []).push(handler);
    return this;
  }

  async #emit(event, ...args) {
    for (const handler of this.#handlers[event] ?? []) await handler(...args);
  }

  done() {
    return this.#done;
  }

  abort() {
    this.#controller.abort();
  }

  async #run(params) {
    const signal = this.#controller.signal;
    const settings = await loadSettings();
    const decision = settings.mode === "decision";
    if (!hasLlmKey(settings) || (decision && !settings.jevKey)) {
      chrome.runtime.openOptionsPage?.();
      throw new Error(
        !hasLlmKey(settings)
          ? missingKeyMessage(settings)
          : "Decision mode needs your Jev API key. Add it in Claus settings (or switch to GPT-only mode), then send your message again.",
      );
    }

    // Drive the tab this side panel belongs to (sidepanel.html?tabId=...).
    const tabParam = Number(new URLSearchParams(location.search).get("tabId"));
    const panelTabId = Number.isInteger(tabParam) && tabParam > 0 ? tabParam : undefined;

    const extra = systemText(params.system).trim();
    const system = buildSystemPrompt(settings, extra === DEFAULT_PANEL_PROMPT ? "" : extra);
    const conversation = toOpenAIMessages(system, params.messages);
    const tools = toOpenAITools(params.tools, settings.mode);

    let text = ""; // everything the user sees for this turn
    const out = async (delta) => {
      text += delta;
      await this.#emit("text", delta);
      await this.#emit("streamEvent", {});
    };
    const heartbeat = setInterval(() => this.#emit("streamEvent", {}), 5000);
    const usage = { input_tokens: 0, output_tokens: 0 };
    let toolUses = [];
    let stopReason = "end_turn";

    try {
      await this.#emit("connect");
      for (let round = 0; round < MAX_ROUNDS; round++) {
        if (signal.aborted) throw new Error("Request was aborted.");
        if (text && !/\n$/.test(text)) await out("\n\n"); // keep rounds visually separate
        const roundStart = text.length;
        const result = await streamChat(
          settings,
          {
            model: settings.agentModel,
            maxTokens: MAX_OUTPUT_TOKENS,
            effort: settings.thinking,
            messages: conversation,
            tools,
          },
          { signal, onText: out, onActivity: () => this.#emit("streamEvent", {}) },
        );
        usage.input_tokens += result.usage?.prompt_tokens ?? 0;
        usage.output_tokens += result.usage?.completion_tokens ?? 0;

        const internal = result.toolCalls.filter((c) => c.name === JEV_TOOL);
        const external = result.toolCalls.filter((c) => c.name !== JEV_TOOL);

        // Anything the side panel must run (screenshots, read_page, navigate, ...) ends this stream; the panel
        // executes the tools and calls stream() again with the results. jev_act is only run when called alone.
        if (external.length || !internal.length) {
          toolUses = external.map((c) => ({ type: "tool_use", id: c.id, name: c.name, input: c.input }));
          stopReason = toolUses.length ? "tool_use" : "end_turn";
          if (text.length === roundStart && !toolUses.length && !text.trim()) {
            await out("I didn't get a response from the model. Please try again.");
          }
          break;
        }

        // --- jev_act, handled here ---
        conversation.push({
          role: "assistant",
          content: result.text || null,
          tool_calls: internal.map((c) => ({ id: c.id, type: "function", function: { name: c.name, arguments: c.args || "{}" } })),
        });
        const images = [];
        for (const call of internal) {
          const goal = String(call.input.goal ?? "").trim();
          if (!goal) {
            conversation.push({ role: "tool", tool_call_id: call.id, content: "Error: goal is required." });
            continue;
          }
          const tabId = Number.isInteger(call.input.tabId) ? call.input.tabId : panelTabId;
          await out(`**Jev** · ${mdSafe(goal, 140)}\n`);
          let report, shot = null;
          try {
            const run = await runAgent({
              goal,
              tabId,
              settings,
              signal,
              maxSteps: JEV_STEPS,
              onEvent: (e) => {
                if (e.type === "step") return out(describeStep(e));
                if (e.type === "note") return out(`- _${mdSafe(e.message, 120)}_\n`);
              },
            });
            if (run.status === "stopped" || signal.aborted) throw new Error("Request was aborted.");
            report = jevReport(run);
            shot = run.screenshot;
            // Kept in the visible text on purpose: the next turn is rebuilt from the chat, so this is how the model
            // remembers, in a follow-up, what Jev did and where the page ended up.
            const where = run.page ? ` on ${mdSafe(run.page.title || run.page.url, 70)}` : "";
            await out(`- _${{ done: "Jev finished", blocked: "Jev got stuck", no_elements: "No page elements for Jev" }[run.status] ?? "Jev stopped"}${where} after ${run.steps} step${run.steps === 1 ? "" : "s"}._
`);
          } catch (e) {
            if (e.name === "AbortError" || /aborted/i.test(e.message)) throw new Error("Request was aborted.");
            report = `Error while running Jev: ${e.message}`;
            await out(`- _${mdSafe(e.message, 160)}_\n`);
          }
          conversation.push({ role: "tool", tool_call_id: call.id, content: report });
          if (shot) {
            images.push(
              { type: "text", text: "Screenshot of the page after jev_act:" },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${shot}` } },
            );
          }
        }
        if (images.length) conversation.push({ role: "user", content: images });
      }
    } finally {
      clearInterval(heartbeat);
    }
    if (signal.aborted) throw new Error("Request was aborted.");

    const message = {
      id: `msg_claus_${crypto.randomUUID()}`,
      type: "message",
      role: "assistant",
      model: settings.agentModel,
      content: [...(text.trim() ? [{ type: "text", text }] : []), ...toolUses],
      stop_reason: stopReason,
      stop_sequence: null,
      usage,
    };
    await this.#emit("message", message);
    await this.#emit("finalMessage", message);
  }
}

/** Small-model completion for the UI's helper features (status line, chat titles, shortcut names). */
async function helperCompletion(params, options) {
  const empty = {
    id: `msg_claus_${crypto.randomUUID()}`,
    type: "message",
    role: "assistant",
    model: "claus",
    content: [{ type: "text", text: "" }],
    stop_reason: "end_turn",
    usage: { input_tokens: 0, output_tokens: 0 },
  };
  try {
    const settings = await loadSettings();
    if (!hasLlmKey(settings)) return empty;
    const system = systemText(params.system);
    const flatten = (c) => (typeof c === "string" ? c : (c ?? []).map((b) => b.text ?? "").join("\n"));
    const result = await completeChat(
      settings,
      {
        model: settings.textModel,
        maxTokens: Math.min(params.max_tokens ?? 256, 512),
        effort: "off",
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          ...(params.messages ?? []).map((m) => ({ role: m.role, content: flatten(m.content) })),
        ],
      },
      { signal: options?.signal },
    );
    empty.content[0].text = result.text;
  } catch {}
  return empty;
}

export class JevClient {
  beta = {
    messages: {
      stream: (params, options) => new AgentStream(params, options),
      create: (params, options) => helperCompletion(params, options),
    },
  };
}
