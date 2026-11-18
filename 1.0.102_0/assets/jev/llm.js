// One place that talks to the OpenAI models, directly (api.openai.com). Jev is a separate service (jev/jev.js).
// Nothing here stores anything: no history, no database, no account. Keys come from the extension's settings.

const OPENAI = {
  name: "OpenAI",
  url: "https://api.openai.com/v1/chat/completions",
  keyName: "OpenAI API key",
};

export const hasLlmKey = (settings) => !!settings.openaiKey;
export const missingKeyMessage = () => `Add your ${OPENAI.keyName} in Claus settings, then send your message again.`;

/** GPT-5 and o-series models reason before answering and take a reasoning effort instead of a temperature. */
const isReasoningModel = (model) => /(^|\/)(gpt-5|o\d)/i.test(model || "");

/** Reasoning knobs for a model. `effort` is off | low | medium | high. */
function reasoningParams(model, effort) {
  return isReasoningModel(model) ? { reasoning_effort: effort === "off" ? "minimal" : effort } : {};
}

function buildBody({ model, messages, maxTokens, effort = "off", tools, json = false, stream = false }) {
  const body = { model, messages, max_completion_tokens: maxTokens, ...reasoningParams(model, effort) };
  if (tools?.length) Object.assign(body, { tools, tool_choice: "auto" });
  if (json) body.response_format = { type: "json_object" };
  if (stream) Object.assign(body, { stream: true, stream_options: { include_usage: true } });
  return body;
}

/** A 400 about a parameter some model does not take: return a corrected body to retry once, or null. */
function adaptBody(body, detail) {
  const d = String(detail || "");
  if (/reasoning/i.test(d) && body.reasoning_effort) {
    const next = { ...body };
    if (next.reasoning_effort === "minimal") next.reasoning_effort = "low";
    else delete next.reasoning_effort;
    return next;
  }
  return null;
}

async function request(settings, body, signal) {
  const key = settings.openaiKey;
  if (!key) throw new Error(missingKeyMessage());
  let adapted = 0;
  for (let attempt = 0; ; attempt++) {
    let response;
    try {
      response = await fetch(OPENAI.url, {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify(body),
      });
    } catch (e) {
      if (e.name === "AbortError") throw e;
      throw new Error(`${OPENAI.name} connection failed.`);
    }
    if ([429, 500, 502, 503, 529].includes(response.status) && attempt < 2) {
      await new Promise((r) => setTimeout(r, 600 * 2 ** attempt));
      continue;
    }
    if (response.ok) return response;
    const detail = (await response.text().catch(() => "")).slice(0, 400);
    if (response.status === 400 && adapted < 2) {
      const next = adaptBody(body, detail);
      if (next) {
        body = next;
        adapted++;
        continue;
      }
    }
    const hint =
      response.status === 401 || response.status === 403
        ? ` Check the ${OPENAI.keyName} in Claus settings.`
        : response.status === 404
          ? " That model was not found for this key; check the model name in Claus settings."
          : "";
    throw new Error(`${OPENAI.name} returned HTTP ${response.status}.${hint} ${detail}`.trim());
  }
}

function parseArgs(raw) {
  if (!raw || !raw.trim()) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

/**
 * One streamed model turn. Calls onText(delta) as the answer arrives and returns
 * { text, toolCalls: [{id,name,args,input}], finish, usage }.
 */
export async function streamChat(settings, params, { signal, onText = () => {}, onActivity = () => {} } = {}) {
  const response = await request(settings, buildBody({ ...params, stream: true }), signal);
  const calls = new Map(); // index -> {id,name,args}
  let text = "", finish = null, usage = null;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const handle = async (line) => {
    if (!line.startsWith("data:")) return;
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    let chunk;
    try {
      chunk = JSON.parse(data);
    } catch {
      return;
    }
    if (chunk.error) throw new Error(`Model error: ${chunk.error.message ?? JSON.stringify(chunk.error)}`);
    if (chunk.usage) usage = chunk.usage;
    const choice = chunk.choices?.[0];
    if (!choice) return;
    const delta = choice.delta ?? {};
    if (typeof delta.content === "string" && delta.content) {
      text += delta.content;
      await onText(delta.content);
    }
    for (const tc of delta.tool_calls ?? []) {
      const slot = calls.get(tc.index ?? 0) ?? { id: "", name: "", args: "" };
      if (tc.id) slot.id = tc.id;
      if (tc.function?.name) slot.name += tc.function.name;
      if (tc.function?.arguments) slot.args += tc.function.arguments;
      calls.set(tc.index ?? 0, slot);
    }
    if (choice.finish_reason) finish = choice.finish_reason;
    onActivity();
  };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      await handle(line);
    }
    onActivity();
  }
  if (buffer.trim()) await handle(buffer.trim());

  const toolCalls = [...calls.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, c]) => ({
      id: c.id || `toolu_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
      name: c.name,
      args: c.args,
      input: parseArgs(c.args),
    }))
    .filter((c) => c.name);
  return { text, toolCalls, finish, usage };
}

/** One non-streamed completion from the small text model. Returns { text, usage }. */
export async function completeChat(settings, params, { signal } = {}) {
  const response = await request(settings, buildBody(params), signal);
  const result = await response.json();
  return { text: result.choices?.[0]?.message?.content ?? "", usage: result.usage ?? {} };
}
