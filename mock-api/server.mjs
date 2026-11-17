// Sunday mock backend. Dependency-free Node server that stands in for the real
// API so the web app can be exercised end to end. State is in memory and resets
// on restart. Port 8080 (what INTERNAL_URL points at).
import http from "node:http";
import { randomUUID } from "node:crypto";
import { seed } from "./seed.mjs";
import { extraRoutes } from "./routes-extra.mjs";
import { tick, docsForSource, sourceName } from "./connectors.mjs";

const PORT = Number(process.env.MOCK_PORT || 8080);
const COOKIE = process.env.AUTH_COOKIE_NAME || "fastapiusersauth";
const VERBOSE = process.env.MOCK_VERBOSE === "1";

const db = seed();
const routes = [];
const unhandled = new Map();

export function route(method, pattern, handler) {
  const keys = [];
  const re = new RegExp(
    "^" +
      pattern.replace(/:([a-zA-Z_]+)/g, (_, k) => {
        keys.push(k);
        return "([^/]+)";
      }) +
      "/?$"
  );
  routes.push({ method, re, keys, handler });
}

const json = (res, data, status = 200, headers = {}) => {
  const body = JSON.stringify(data ?? null);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(body),
    ...headers,
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", () => resolve(Buffer.alloc(0)));
  });

const parseBody = (buf, type = "") => {
  if (!buf.length) return {};
  const s = buf.toString("utf8");
  if (type.includes("json")) {
    try {
      return JSON.parse(s);
    } catch {
      return {};
    }
  }
  if (type.includes("x-www-form-urlencoded"))
    return Object.fromEntries(new URLSearchParams(s));
  try {
    return JSON.parse(s);
  } catch {
    return { _raw: s };
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();
const nextId = (k) => (db.counters[k] = (db.counters[k] || 1000) + 1);

const ctx = { db, route, json, sleep, now, nextId, randomUUID };

// ---------------------------------------------------------------- auth ----
const authed = (req) =>
  (req.headers.cookie || "").split(/;\s*/).some((c) => c.startsWith(COOKIE + "="));

route("GET", "/health", (q, res) => json(res, { success: true, message: "ok" }));
route("GET", "/version", (q, res) => json(res, { backend_version: "sunday-1.0.0" }));

route("GET", "/auth/type", (q, res) =>
  json(res, {
    auth_type: "basic",
    multi_tenant: false,
    requires_verification: false,
    anonymous_user_enabled: false,
    password_min_length: 8,
    password_max_length: 64,
    password_require_uppercase: false,
    password_require_lowercase: false,
    password_require_digit: false,
    password_require_special_char: false,
    has_users: true,
    oauth_enabled: false,
    password_auth_enabled: true,
    sso_providers: [],
    default_language: "en",
  })
);

route("POST", "/auth/login", (q, res) => {
  const { username } = q.body;
  if (!username) return json(res, { detail: "LOGIN_BAD_CREDENTIALS" }, 400);
  db.me.email = username;
  res.writeHead(204, {
    "set-cookie": `${COOKIE}=sunday-session; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
  });
  res.end();
});
route("POST", "/auth/register", (q, res) => {
  db.me.email = q.body.email || db.me.email;
  json(res, { ...db.me }, 201);
});
route("POST", "/auth/logout", (q, res) => {
  res.writeHead(204, {
    "set-cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly`,
  });
  res.end();
});
route("POST", "/auth/refresh", (q, res) => json(res, {}));
route("POST", "/auth/forgot-password", (q, res) => json(res, null, 202));
route("POST", "/auth/reset-password", (q, res) => json(res, null));
route("POST", "/auth/request-verify-token", (q, res) => json(res, null, 202));
route("POST", "/auth/verify", (q, res) => json(res, db.me));

route("GET", "/me", (q, res) => {
  if (!authed(q)) return json(res, { detail: "Unauthorized" }, 401);
  json(res, db.me);
});
route("PATCH", "/user/theme-preference", (q, res) => {
  db.me.preferences.theme_preference = q.body.theme_preference;
  json(res, {});
});
route("PATCH", "/user/default-model", (q, res) => {
  db.me.preferences.default_model = q.body.default_model;
  json(res, {});
});
route("PATCH", "/user/personalization", (q, res) => {
  db.me.personalization = { ...db.me.personalization, ...q.body };
  json(res, db.me.personalization);
});
route("PATCH", "/user/preferences", (q, res) => {
  Object.assign(db.me.preferences, q.body);
  json(res, {});
});

// ------------------------------------------------------------ settings ----
route("GET", "/settings", (q, res) => json(res, db.settings));
route("PUT", "/admin/settings", (q, res) => {
  Object.assign(db.settings, q.body);
  json(res, {});
});
route("GET", "/enterprise-settings", (q, res) => json(res, db.enterprise));
route("PUT", "/admin/enterprise-settings", (q, res) => {
  Object.assign(db.enterprise, q.body);
  json(res, {});
});
route("GET", "/enterprise-settings/custom-analytics-script", (q, res) =>
  json(res, null)
);

// ------------------------------------------------------------- agents ----
const personaList = () => db.personas;
route("GET", "/persona", (q, res) => json(res, personaList()));
route("GET", "/persona/labels", (q, res) => json(res, db.labels));
route("GET", "/persona/:id", (q, res) => {
  const p = db.personas.find((x) => String(x.id) === q.params.id);
  if (!p) return json(res, { detail: "Not found" }, 404);
  json(res, {
    ...p,
    user_file_ids: [],
    users: [],
    groups: [],
    system_prompt: p.system_prompt ?? "",
    replace_base_system_prompt: false,
    task_prompt: "",
    datetime_aware: true,
    search_start_date: null,
    permissions: { edit: true, share: true, delete: true, view_stats: true, publish: true, feature: true, list: true, reorder: true },
    user_shares: [],
    group_shares: [],
    public_permission: "VIEWER",
    sharing_status: p.is_public ? "PUBLIC" : "PRIVATE",
    admin_count: 1,
    ownership_vacant: false,
  });
});
route("POST", "/persona", (q, res) => {
  const b = q.body;
  const p = {
    id: nextId("persona"),
    name: b.name,
    description: b.description || "",
    tools: db.tools.filter((t) => (b.tool_ids || []).includes(t.id)),
    starter_messages: b.starter_messages || [],
    document_sets: [],
    is_public: b.is_public ?? true,
    is_listed: true,
    display_priority: null,
    is_featured: !!b.is_featured,
    builtin_persona: false,
    labels: [],
    owner: db.minimalUser,
    permissions: { edit: true, share: true, delete: true, view_stats: true },
    owner_group: null,
    user_permission: "OWNER",
    icon_name: b.icon_name || null,
    system_prompt: b.system_prompt || "",
  };
  db.personas.push(p);
  json(res, p);
});
route("PATCH", "/persona/:id", (q, res) => {
  const p = db.personas.find((x) => String(x.id) === q.params.id);
  if (p) Object.assign(p, q.body, { id: p.id });
  json(res, p || {});
});
route("DELETE", "/persona/:id", (q, res) => {
  db.personas = db.personas.filter((x) => String(x.id) !== q.params.id);
  json(res, {});
});
route("GET", "/admin/agents", (q, res) => json(res, db.personas));
route("GET", "/admin/persona", (q, res) => json(res, db.personas));
route("GET", "/admin/default-assistant/configuration", (q, res) =>
  json(res, {
    tool_ids: db.tools.map((t) => t.id),
    system_prompt: "You are Sunday, a helpful assistant for the team.",
    default_system_prompt: "You are Sunday, a helpful assistant for the team.",
  })
);

// ---------------------------------------------------------- LLM models ----
const llmResponse = () => ({
  providers: db.llmProviders.map(({ api_key, groups, personas, ...p }) => p),
  default_text: db.llmDefaults.text,
  default_vision: db.llmDefaults.vision,
  default_search_selection: null,
  default_chat_naming: null,
  default_craft: null,
});
route("GET", "/llm/provider", (q, res) => json(res, llmResponse()));
route("GET", "/llm/persona/:id/providers", (q, res) => json(res, llmResponse()));
route("GET", "/admin/llm/provider", (q, res) =>
  json(res, {
    ...llmResponse(),
    providers: db.llmProviders,
  })
);
route("GET", "/admin/llm/provider/:id", (q, res) =>
  json(res, db.llmProviders.find((p) => String(p.id) === q.params.id) || {})
);
route("GET", "/admin/llm/built-in/options", (q, res) => json(res, db.wellKnownLlm));
route("GET", "/admin/llm/built-in/options/:name", (q, res) =>
  json(res, db.wellKnownLlm.find((p) => p.name === q.params.name) || {})
);
route("GET", "/admin/llm/custom-provider-names", (q, res) => json(res, []));
route("GET", "/admin/llm/decision-model", (q, res) => json(res, null));
route("GET", "/admin/llm/router-models", (q, res) => json(res, []));
route("GET", "/admin/llm/provider-contextual-cost", (q, res) => json(res, []));
route("PUT", "/admin/llm/provider", (q, res) => {
  const b = q.body;
  const id = nextId("llm");
  const p = {
    id,
    name: b.name || b.provider,
    provider: b.provider,
    api_key: b.api_key ? "••••••••" : null,
    api_base: b.api_base ?? null,
    api_version: null,
    custom_config: null,
    is_public: true,
    is_auto_mode: false,
    groups: [],
    personas: [],
    deployment_name: null,
    provider_display_name: b.provider,
    model_configurations: (b.model_configurations || []).map((m, i) => ({
      ...m,
      id: id * 100 + i,
      supports_image_input: !!m.supports_image_input,
    })),
  };
  db.llmProviders.push(p);
  if (!db.llmDefaults.text && p.model_configurations[0])
    db.llmDefaults.text = { provider_id: p.id, model_name: p.model_configurations[0].name };
  json(res, p);
});
route("POST", "/admin/llm/test", (q, res) => json(res, {}));
route("POST", "/admin/llm/test/default", (q, res) => json(res, {}));
route("DELETE", "/admin/llm/provider/:id", (q, res) => {
  db.llmProviders = db.llmProviders.filter((p) => String(p.id) !== q.params.id);
  json(res, {});
});
route("POST", "/admin/llm/default", (q, res) => {
  db.llmDefaults.text = { provider_id: q.body.provider_id, model_name: q.body.model_name };
  json(res, {});
});

// ------------------------------------------------------- chat sessions ----
const sessionSummary = (s) => ({
  id: s.id,
  name: s.name,
  persona_id: s.persona_id,
  time_created: s.time_created,
  time_updated: s.time_updated,
  shared_status: s.shared_status,
  project_id: s.project_id ?? null,
  current_alternate_model: "",
  current_temperature_override: null,
  current_reasoning_effort_override: null,
});

route("GET", "/chat/get-user-chat-sessions", (q, res) => {
  const list = db.chats
    .slice()
    .sort((a, b) => b.time_updated.localeCompare(a.time_updated))
    .map(sessionSummary);
  json(res, { sessions: list, has_more: false });
});
route("GET", "/chat/incognito-availability", (q, res) => json(res, { available: true }));
route("GET", "/chat/search", (q, res) => {
  const term = (q.query.get("query") || q.query.get("q") || "").toLowerCase();
  const hits = db.chats.filter(
    (c) =>
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.messages.some((m) => m.message.toLowerCase().includes(term))
  );
  json(res, { groups: [{ date_range: "Recent", chat_sessions: hits.map(sessionSummary) }], has_more: false, next_page: null });
});
route("POST", "/chat/create-chat-session", (q, res) => {
  const id = randomUUID();
  db.chats.push({
    id,
    name: "New Chat",
    persona_id: q.body.persona_id ?? 0,
    project_id: q.body.project_id ?? null,
    time_created: now(),
    time_updated: now(),
    shared_status: "private",
    messages: [],
    incognito: !!q.body.incognito,
  });
  json(res, { chat_session_id: id, incognito: !!q.body.incognito });
});
route("GET", "/chat/get-chat-session/:id", (q, res) => {
  const s = db.chats.find((c) => c.id === q.params.id);
  if (!s) return json(res, { detail: "Chat session not found" }, 404);
  const persona = db.personas.find((p) => p.id === s.persona_id) || db.personas[0];
  json(res, {
    chat_session_id: s.id,
    description: s.name,
    persona_id: s.persona_id,
    persona_name: persona.name,
    messages: s.messages,
    time_created: s.time_created,
    time_updated: s.time_updated,
    shared_status: s.shared_status,
    current_temperature_override: null,
    current_reasoning_effort_override: null,
    current_alternate_model: "",
    owner_name: db.me.email.split("@")[0],
    packets: s.messages.map(() => []),
    current_stream: null,
    is_processing: false,
    incognito: !!s.incognito,
    has_older_messages: false,
  });
});
route("PUT", "/chat/rename-chat-session", (q, res) => {
  const s = db.chats.find((c) => c.id === q.body.chat_session_id);
  if (s) s.name = q.body.name || s.name;
  json(res, { new_name: s?.name });
});
route("DELETE", "/chat/delete-chat-session/:id", (q, res) => {
  db.chats = db.chats.filter((c) => c.id !== q.params.id);
  json(res, {});
});
route("DELETE", "/chat/delete-all-chat-sessions", (q, res) => {
  db.chats = [];
  json(res, {});
});
route("POST", "/chat/end-incognito-session/:id", (q, res) => {
  db.chats = db.chats.filter((c) => c.id !== q.params.id);
  json(res, {});
});
route("PUT", "/chat/update-chat-session-temperature", (q, res) => json(res, {}));
route("PUT", "/chat/update-chat-session-reasoning", (q, res) => json(res, {}));
route("PUT", "/chat/update-chat-session-model", (q, res) => json(res, {}));
route("POST", "/chat/chat-session/:id/generate-name", (q, res) => {
  const s = db.chats.find((c) => c.id === q.params.id);
  json(res, { new_name: s?.name || "New Chat" });
});
route("PUT", "/chat/chat-session/:id", (q, res) => json(res, {}));
route("PATCH", "/chat/chat-session/:id", (q, res) => json(res, {}));
route("POST", "/chat/create-chat-message-feedback", (q, res) => {
  for (const c of db.chats)
    for (const m of c.messages)
      if (m.message_id === q.body.chat_message_id)
        m.current_feedback = q.body.is_positive ? "like" : "dislike";
  json(res, {});
});
route("DELETE", "/chat/remove-chat-message-feedback", (q, res) => json(res, {}));
route("PUT", "/chat/set-message-as-latest", (q, res) => json(res, {}));
route("POST", "/chat/seed-chat-session", (q, res) => json(res, { redirect_url: "/app" }));
route("GET", "/chat/chat-session/:id/resume-stream", (q, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  res.end();
});
route("GET", "/chat/chat-session/:id/status", (q, res) => json(res, { is_processing: false }));
route("POST", "/chat/stop-chat-session/:id", (q, res) => json(res, {}));
route("PATCH", "/chat/chat-session/:id/share", (q, res) => json(res, {}));
route("PATCH", "/chat/chat-session/:id/unshare", (q, res) => json(res, {}));

// ------------------------------------------------- streaming chat reply ----
const writeLine = (res, obj) => res.write(JSON.stringify(obj) + "\n");

// Pull documents from whatever sources are connected, newest connection first,
// and rank by simple word overlap with the question.
function searchConnected(query) {
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const live = db.connectors.filter((c) => c.last_status !== "failed").slice().reverse();
  const pool = live.flatMap((c) => docsForSource(c.connector.source, c.cc_pair_id));
  const scored = pool.map((d, i) => ({
    d,
    score: words.reduce((a, w) => a + (`${d.semantic_identifier} ${d.blurb}`.toLowerCase().includes(w) ? 2 : 0), 0) - i * 0.01,
  }));
  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter((x) => x.score > 0);
  return (relevant.length ? relevant : scored).slice(0, 3).map((x) => x.d);
}

function craftAnswer(prompt, docs) {
  const p = prompt.trim();
  const lower = p.toLowerCase();
  const cite = (n) => (docs.length >= n ? ` [[${n}]](${docs[n - 1].link})` : "");
  if (/^(hi|hello|hey)\b/.test(lower))
    return `Hello! I'm **Sunday**. I can search your connected sources, summarize documents and help you draft things.\n\nTry asking about the *Q3 roadmap* or *onboarding checklist*.`;
  if (/code|function|script|python|typescript|sql/.test(lower))
    return `Here's a small example you can adapt:\n\n\`\`\`python\nfrom datetime import date\n\ndef days_until(target: date) -> int:\n    \"\"\"Return the number of days from today until target.\"\"\"\n    return (target - date.today()).days\n\nprint(days_until(date(2026, 12, 25)))\n\`\`\`\n\nLet me know if you want it extended or ported to another language.`;
  if (docs.length) {
    const lines = docs.map((d, i) => `- **${d.semantic_identifier}** (${sourceName(d.source_type)}): ${d.blurb}${cite(i + 1)}`);
    const names = [...new Set(docs.map((d) => sourceName(d.source_type)))].join(", ");
    return `I searched your connected sources (${names}) and found ${docs.length} relevant ${docs.length === 1 ? "document" : "documents"} for **${p.replace(/[?.!]+$/, "")}**:\n\n${lines.join("\n")}\n\nWant me to summarise any of these, or compare them?`;
  }
  return `Here's a quick take on "${p}":\n\n1. Start by clarifying the goal and who it's for.\n2. Break the work into small, reviewable steps.\n3. Check in on progress weekly and adjust.\n\nIf you share more context, I can make this much more specific.`;
}

route("POST", "/chat/send-chat-message", async (q, res) => {
  const b = q.body;
  const s = db.chats.find((c) => c.id === b.chat_session_id);
  if (!s) return json(res, { detail: "Chat session not found" }, 404);

  const userId = nextId("msg");
  const asstId = nextId("msg");
  const userMsg = mkMessage(userId, "user", b.message, b.parent_message_id ?? lastId(s), s.id);
  s.messages.push(userMsg);
  link(s, userMsg);

  const useSearch = !/^(hi|hello|hey)/i.test(b.message) && !/code|function|script|python|sql/i.test(b.message);
  const docs = useSearch ? searchConnected(b.message) : [];
  const text = craftAnswer(b.message, docs);

  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    "x-accel-buffering": "no",
  });
  writeLine(res, { user_message_id: userId, reserved_assistant_message_id: asstId });

  let turn = 0;
  const pl = (obj, t = turn) => writeLine(res, { placement: { turn_index: t, tab_index: 0 }, obj });
  const started = Date.now();

  await sleep(250);
  if (docs.length) {
    pl({ type: "search_tool_start", is_internet_search: false });
    await sleep(250);
    pl({ type: "search_tool_queries_delta", queries: [b.message.slice(0, 80)] });
    await sleep(350);
    pl({ type: "search_tool_documents_delta", documents: docs });
    await sleep(250);
    pl({ type: "section_end" });
    turn++;
  }
  pl({ type: "message_start", id: String(asstId), content: "", final_documents: docs.length ? docs : null });
  const tokens = text.match(/\S+\s*|\n+/g) || [text];
  let sent = "";
  for (let i = 0; i < tokens.length; i += 2) {
    const chunk = tokens.slice(i, i + 2).join("");
    sent += chunk;
    pl({ type: "message_delta", content: chunk });
    await sleep(35);
    if (res.destroyed) break;
  }
  docs.forEach((d, i) => pl({ type: "citation_info", citation_number: i + 1, document_id: d.document_id }));

  // Save the reply before closing the stream so the client's follow-up refresh sees it.
  const asst = mkMessage(asstId, "assistant", sent, userId, s.id);
  asst.context_docs = docs.length ? docs : null;
  asst.citations = docs.length ? Object.fromEntries(docs.map((d, i) => [i + 1, d.document_id])) : null;
  asst.processing_duration_seconds = Math.round((Date.now() - started) / 100) / 10;
  s.messages.push(asst);
  link(s, asst);
  s.time_updated = now();
  if (s.name === "New Chat") s.name = b.message.slice(0, 48) || "New Chat";

  pl({ type: "section_end" });
  pl({ type: "stop", stop_reason: "finished" });
  res.end();
});

function lastId(s) {
  return s.messages.length ? s.messages[s.messages.length - 1].message_id : null;
}
function link(s, msg) {
  const parent = s.messages.find((m) => m.message_id === msg.parent_message);
  if (parent) parent.latest_child_message = msg.message_id;
}
function mkMessage(id, type, message, parent, chatId) {
  return {
    message_id: id,
    message_type: type,
    research_type: null,
    parent_message: parent,
    latest_child_message: null,
    message,
    rephrased_query: null,
    context_docs: null,
    time_sent: now(),
    overridden_model: "",
    alternate_assistant_id: null,
    chat_session_id: chatId,
    citations: null,
    files: [],
    tool_call: null,
    current_feedback: null,
    sub_questions: [],
    comments: null,
    parentMessageId: parent,
    refined_answer_improvement: null,
    is_agentic: null,
    preferred_response_id: null,
    model_display_name: null,
    error: null,
  };
}

// ------------------------------------------------ everything else (misc) ----
Object.assign(ctx, { authed, mkMessage, link, lastId });
extraRoutes(ctx);

// ------------------------------------------------------------- dispatcher ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const buf = await readBody(req);
  req.body = parseBody(buf, req.headers["content-type"] || "");
  req.rawBody = buf;
  req.query = url.searchParams;
  const path = url.pathname.replace(/^\/api(?=\/)/, "");
  tick(db);

  try {
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = r.re.exec(path);
      if (!m) continue;
      req.params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      if (VERBOSE) console.log(req.method, req.url);
      await r.handler(req, res);
      return;
    }
  } catch (e) {
    console.error("handler error", req.method, req.url, e);
    if (!res.headersSent) json(res, { detail: String(e) }, 500);
    return;
  }

  // Fallback so unknown screens render empty instead of crashing.
  const key = `${req.method} ${path}`;
  unhandled.set(key, (unhandled.get(key) || 0) + 1);
  if (unhandled.get(key) === 1) console.log("[unhandled]", key);
  if (req.method === "GET") return json(res, path.match(/(s|list|all|history|status)$/) ? [] : {});
  return json(res, {});
});

server.listen(PORT, () => console.log(`Sunday mock API listening on http://localhost:${PORT}`));
