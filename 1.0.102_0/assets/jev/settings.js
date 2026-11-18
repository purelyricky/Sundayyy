// Claus settings, kept in chrome.storage.local. Shared by the side panel and the settings page.

export const SETTINGS_DEFAULTS = {
  // "gpt": the OpenAI model does everything (reads the page, reasons, clicks with the original browser tools). Jev is off.
  // "decision": the same OpenAI model plus Jev, a separate fast decision model that picks the exact element to click.
  mode: "gpt",
  // OpenAI (api.openai.com) and Jev (api.typesafe.ai) are separate services with separate keys.
  openaiKey: "",
  jevKey: "",
  // The model that thinks, talks to the user, looks at screenshots and calls the browser tools.
  // Must support tool calling and image input.
  agentModel: "gpt-5-mini",
  // Small, fast OpenAI model for typing text into fields (Jev mode) and for the panel's helper text (status line, titles).
  textModel: "gpt-4.1-mini",
  // How hard the agent model thinks before it answers or acts: off | low | medium | high.
  thinking: "low",
  // "mean": rude, swears, still gets the job done. "polite": plain and professional.
  personality: "mean",
  jevModel: "jev-latest",
  // "on" attaches a screenshot to Jev requests (only if your Jev endpoint accepts images).
  jevImages: "off",
};

// What a stored value must be for the dropdown-style settings; anything else falls back to the default.
export const SETTING_CHOICES = {
  mode: ["gpt", "decision"],
  thinking: ["off", "low", "medium", "high"],
  personality: ["mean", "polite"],
  jevImages: ["on", "off"],
};

const storageKey = (name) => `claus_${name}`;

function clean(name, value) {
  const v = String(value ?? "").trim();
  const choices = SETTING_CHOICES[name];
  if (choices) return choices.includes(v.toLowerCase()) ? v.toLowerCase() : SETTINGS_DEFAULTS[name];
  return v || SETTINGS_DEFAULTS[name];
}

export async function loadSettings() {
  const names = Object.keys(SETTINGS_DEFAULTS);
  let stored = {};
  try {
    stored = await chrome.storage.local.get(names.map(storageKey));
  } catch {}
  const settings = Object.fromEntries(names.map((n) => [n, clean(n, stored[storageKey(n)])]));
  return settings;
}

export async function saveSettings(values) {
  const out = {};
  for (const name of Object.keys(SETTINGS_DEFAULTS)) {
    if (name in values) out[storageKey(name)] = String(values[name] ?? "").trim();
  }
  await chrome.storage.local.set(out);
}
