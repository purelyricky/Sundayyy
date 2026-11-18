// The small typing model (a GPT model on the configured provider). Called only when Jev picks TYPE_TEXT.
// Port of field_context()/field_text() from jev_ultrafast/model.py.

import { completeChat } from "./llm.js";
import { TEXT_VALUE } from "./prompts.js";

export function fieldContext(goal, action, page, history) {
  return {
    goal,
    field: { label: action.label ?? null, role: action.role ?? null, value: action.value ?? null },
    page: { title: page.title, text: page.text.slice(0, 6000) },
    recent_actions: history.slice(-6).map((h) => ({ action: h.action ?? null, text: h.text ?? null })),
  };
}

export async function fieldText(context, settings) {
  const { textModel, signal } = settings;
  const started = performance.now();
  const result = await completeChat(
    settings,
    {
      model: textModel,
      maxTokens: 1024,
      json: true,
      effort: "off",
      messages: [
        { role: "system", content: TEXT_VALUE },
        { role: "user", content: JSON.stringify(context) },
      ],
    },
    { signal },
  );
  let value;
  try {
    const output = JSON.parse(result.text);
    value = output.text;
    if (Object.keys(output).length !== 1 || typeof value !== "string" || !value.trim() || value.length > 2000) {
      throw new Error();
    }
  } catch {
    throw new Error("Typing model returned no valid field value; nothing typed.");
  }
  return {
    text: value,
    helper: { model: textModel, latency_ms: Math.round(performance.now() - started), usage: result.usage ?? {} },
  };
}
