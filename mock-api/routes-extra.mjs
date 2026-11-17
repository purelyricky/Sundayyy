// Secondary routes: projects, notifications, tools, connectors, users, groups,
// document sets, search settings and the rest of the admin surface.
import { checkPlan, startRun, runSnapshot, startIndexing, normAttempt } from "./connectors.mjs";

export function extraRoutes({ db, route, json, nextId, now }) {
  const ok = (res) => json(res, {});

  // ---------------------------------------------------------- projects ----
  const projectWithChats = (p) => ({
    ...p,
    chat_sessions: db.chats
      .filter((c) => c.project_id === p.id)
      .map((c) => ({
        id: c.id,
        name: c.name,
        persona_id: c.persona_id,
        time_created: c.time_created,
        time_updated: c.time_updated,
        shared_status: c.shared_status,
        project_id: p.id,
        current_alternate_model: "",
        current_temperature_override: null,
        current_reasoning_effort_override: null,
      })),
  });
  route("GET", "/user/projects", (q, res) => json(res, db.projects.map(projectWithChats)));
  route("POST", "/user/projects/create", (q, res) => {
    const p = { id: nextId("project"), name: q.query.get("name") || "Untitled", description: null, created_at: now(), user_id: db.me.id, instructions: null, chat_sessions: [] };
    db.projects.push(p);
    json(res, p);
  });
  route("GET", "/user/projects/file/statuses", (q, res) => json(res, []));
  route("POST", "/user/projects/file/statuses", (q, res) => json(res, []));
  route("GET", "/user/files/recent", (q, res) => json(res, []));
  route("GET", "/user/projects/files/:id", (q, res) => json(res, []));
  route("GET", "/user/projects/session/:id/files", (q, res) => json(res, []));
  route("GET", "/user/projects/:id/token-count", (q, res) => json(res, 1200));
  route("GET", "/user/projects/:id/instructions", (q, res) =>
    json(res, { instructions: db.projects.find((p) => String(p.id) === q.params.id)?.instructions ?? null })
  );
  route("POST", "/user/projects/:id/instructions", (q, res) => {
    const p = db.projects.find((x) => String(x.id) === q.params.id);
    if (p) p.instructions = q.body.instructions ?? null;
    json(res, { instructions: p?.instructions ?? null });
  });
  route("GET", "/user/projects/:id/details", (q, res) => {
    const p = db.projects.find((x) => String(x.id) === q.params.id);
    json(res, { project: p ? projectWithChats(p) : null, files: [] });
  });
  route("GET", "/user/projects/:id", (q, res) => {
    const p = db.projects.find((x) => String(x.id) === q.params.id);
    json(res, p ? projectWithChats(p) : {}, p ? 200 : 404);
  });
  route("PATCH", "/user/projects/:id", (q, res) => {
    const p = db.projects.find((x) => String(x.id) === q.params.id);
    if (p) Object.assign(p, { name: q.body.name ?? p.name });
    json(res, p ? projectWithChats(p) : {});
  });
  route("DELETE", "/user/projects/:id", (q, res) => {
    db.projects = db.projects.filter((p) => String(p.id) !== q.params.id);
    json(res, {});
  });
  route("POST", "/user/projects/:id/move_chat_session", (q, res) => {
    const c = db.chats.find((x) => x.id === q.body.chat_session_id);
    if (c) c.project_id = Number(q.params.id);
    ok(res);
  });
  route("POST", "/user/projects/remove_chat_session", (q, res) => {
    const c = db.chats.find((x) => x.id === q.body.chat_session_id);
    if (c) c.project_id = null;
    ok(res);
  });
  route("POST", "/user/projects/file/upload", (q, res) => json(res, { user_files: [], rejected_files: [] }));

  // ----------------------------------------------------- notifications ----
  route("GET", "/notifications", (q, res) =>
    json(res, {
      notifications: db.notifications,
      total_items: db.notifications.length,
      undismissed_count: db.notifications.filter((n) => !n.dismissed).length,
      page_num: 0,
      page_size: 20,
      has_more: false,
    })
  );
  route("GET", "/notifications/summary", (q, res) =>
    json(res, { total_items: db.notifications.length, undismissed_count: db.notifications.filter((n) => !n.dismissed).length })
  );
  route("POST", "/notifications/:id/dismiss", (q, res) => {
    const n = db.notifications.find((x) => String(x.id) === q.params.id);
    if (n) n.dismissed = true;
    ok(res);
  });
  route("POST", "/notifications/dismiss-all", (q, res) => {
    db.notifications.forEach((n) => (n.dismissed = true));
    ok(res);
  });

  // -------------------------------------------------------------- tools ----
  route("GET", "/tool", (q, res) => json(res, db.tools));
  route("GET", "/tool/openapi", (q, res) => json(res, db.tools.filter((t) => t.definition)));
  route("PATCH", "/tool/:id/preferences", (q, res) => ok(res));
  route("GET", "/user-oauth-token/status", (q, res) => json(res, []));
  route("GET", "/mcp/servers", (q, res) => json(res, { mcp_servers: [] }));
  route("GET", "/admin/mcp/servers", (q, res) => json(res, { mcp_servers: [] }));

  // ---------------------------------------------------- prompt shortcuts ----
  route("GET", "/input_prompt", (q, res) => json(res, db.promptShortcuts));
  route("POST", "/input_prompt", (q, res) => {
    const s = { id: nextId("shortcut"), active: true, is_public: false, ...q.body };
    db.promptShortcuts.push(s);
    json(res, s);
  });
  route("PATCH", "/input_prompt/:id", (q, res) => {
    const s = db.promptShortcuts.find((x) => String(x.id) === q.params.id);
    if (s) Object.assign(s, q.body);
    json(res, s || {});
  });
  route("DELETE", "/input_prompt/:id", (q, res) => {
    db.promptShortcuts = db.promptShortcuts.filter((x) => String(x.id) !== q.params.id);
    ok(res);
  });

  // ------------------------------------------------------- connectors ----
  const basic = (c) => ({ cc_pair_id: c.cc_pair_id, name: c.name, connector: c.connector, credential: c.credential, access_type: c.access_type, groups: c.groups });
  route("GET", "/manage/connector-status", (q, res) =>
    json(res, db.connectors.map((c) => ({ cc_pair_id: c.cc_pair_id, has_successful_run: c.last_status === "success", source: c.connector.source, status: c.cc_pair_status })))
  );
  route("GET", "/manage/admin/connector/status", (q, res) => json(res, db.connectors.map(basic)));
  const lite = (c) => ({
    cc_pair_id: c.cc_pair_id, name: c.name, source: c.connector.source, access_type: c.access_type,
    in_progress: !!c.in_progress, cc_pair_status: c.cc_pair_status, last_finished_status: c.last_finished_status,
    last_status: c.last_status, last_success: c.last_success, is_editable: true,
    permissions: { operate: true, edit: true, delete: true, publish: true },
    docs_indexed: c.docs_indexed, in_repeated_error_state: c.in_repeated_error_state,
    latest_index_attempt_docs_indexed: c.latest_index_attempt?.total_docs_indexed ?? null,
  });
  route("POST", "/manage/admin/connector/indexing-status", (q, res) => {
    const bySource = {};
    for (const c of db.connectors) (bySource[c.connector.source] ||= []).push(c);
    json(res, Object.entries(bySource).map(([source, list]) => ({
      source,
      summary: {
        total_connectors: list.length,
        active_connectors: list.filter((c) => c.cc_pair_status === "ACTIVE").length,
        public_connectors: list.filter((c) => c.access_type === "public").length,
        total_docs_indexed: list.reduce((a, c) => a + c.docs_indexed, 0),
      },
      current_page: 1, total_pages: 1,
      indexing_statuses: list.map(lite),
    })));
  });
  route("GET", "/manage/admin/credential", (q, res) => json(res, db.connectors.map((c) => c.credential)));
  route("GET", "/manage/connector", (q, res) => json(res, db.connectors.map((c) => c.connector)));
  route("GET", "/manage/admin/cc-pair/:id", (q, res) => {
    const c = db.connectors.find((x) => String(x.cc_pair_id) === q.params.id);
    if (!c) return json(res, { detail: "Not found" }, 404);
    json(res, {
      id: c.cc_pair_id,
      name: c.name,
      status: c.cc_pair_status,
      in_repeated_error_state: c.in_repeated_error_state,
      num_docs_indexed: c.docs_indexed,
      connector: c.connector,
      credential: c.credential,
      number_of_index_attempts: 1 + (c.last_finished_status ? 11 : 0),
      last_index_attempt_status: c.last_status,
      latest_deletion_attempt: null,
      access_type: c.access_type,
      is_editable_for_current_user: true,
      permissions: { operate: true, edit: true, delete: true, publish: true },
      deletion_failure_message: null,
      indexing: !!c.in_progress,
      creator: db.me.id,
      creator_email: db.me.email,
      last_indexed: c.last_success,
      last_pruned: null,
      last_full_permission_sync: null,
      last_time_perm_sync: null,
      last_time_external_group_sync: null,
      overall_indexing_speed: 4.2,
      latest_checkpoint_description: null,
      last_permission_sync_attempt_status: null,
      permission_syncing: false,
      last_permission_sync_attempt_finished: null,
      last_permission_sync_attempt_error_message: null,
      supports_doc_permission_sync: false,
      supports_targeted_reindex: false,
      pending_backfills: [],
      has_named_checks: true,
      indexing_hold: null,
      queue_position: null,
    });
  });
  const attemptsFor = (c) => {
    const latest = c.latest_index_attempt && c.latest_index_attempt.status ? [c.latest_index_attempt] : [];
    const past = c.last_finished_status && !c.in_progress ? [] : [];
    const history = [3, 2, 1].map((n) => normAttempt({
      id: c.cc_pair_id * 10 - n, status: "success", from_beginning: false, new_docs_indexed: 6 + n * 3, docs_removed_from_index: 0,
      total_docs_indexed: Math.max(0, c.docs_indexed - n * 5), error_msg: null,
      time_started: new Date(Date.now() - n * 6 * 3600000).toISOString(), time_updated: new Date(Date.now() - n * 6 * 3600000 + 240000).toISOString(),
      error_count: 0, full_exception_trace: null, poll_range_start: null, poll_range_end: null, is_resume: false,
    }));
    return c.sim ? latest.map(normAttempt) : [...latest.map(normAttempt), ...history, ...past];
  };
  route("GET", "/manage/admin/cc-pair/:id/index-attempts", (q, res) => {
    const c = db.connectors.find((x) => String(x.cc_pair_id) === q.params.id);
    const items = c ? attemptsFor(c) : [];
    json(res, { items, total_items: items.length });
  });
  route("GET", "/manage/admin/cc-pair/:id/runs", (q, res) => {
    const c = db.connectors.find((x) => String(x.cc_pair_id) === q.params.id);
    const all = (c ? attemptsFor(c) : []).map((a) => ({ kind: "indexing", time_created: a.time_started, attempt: a, resolved_at: null, superseded: false }));
    const group = (i) => { const st = i.attempt.status; return st === "in_progress" || st === "not_started" ? "running" : st === "failed" ? "failed" : st === "canceled" ? "canceled" : "succeeded"; };
    const counts = { running: 0, succeeded: 0, failed: 0, canceled: 0 };
    all.forEach((i) => counts[group(i)]++);
    const wanted = q.query.getAll("status_groups");
    let items = wanted.length ? all.filter((i) => wanted.includes(group(i))) : all;
    // "errors=unresolved" asks for runs with open document errors; the mock has none.
    if (q.query.get("errors") === "unresolved") items = [];
    json(res, { items, total_items: items.length, kinds: ["indexing"], status_counts: counts });
  });
  route("GET", "/manage/admin/cc-pair/:id/runs/resolvable-count", (q, res) => json(res, { count: 0 }));
  route("GET", "/manage/admin/cc-pair/:id/hierarchy-breakdown", (q, res) => {
    const c = db.connectors.find((x) => String(x.cc_pair_id) === q.params.id);
    const sites = (c?.connector.connector_specific_config.sites || []).filter(Boolean);
    const per = c ? Math.floor(c.docs_indexed / Math.max(1, sites.length || 1)) : 0;
    json(res, { nodes_by_type: sites.length ? { site: sites.map((u) => ({ raw_node_id: u, display_name: u.split("/").pop() || u, link: u, doc_count: per })) } : {}, other_doc_count: sites.length ? 0 : (c?.docs_indexed || 0), config_fields: sites.length ? ["sites"] : [] });
  });
  route("GET", "/manage/admin/cc-pair/:id/manage-access", (q, res) => json(res, []));
  route("GET", "/manage/admin/cc-pair/:id/data-access", (q, res) => json(res, []));
  route("GET", "/manage/admin/cc-pair/:id/document-types", (q, res) => {
    const c = db.connectors.find((x) => String(x.cc_pair_id) === q.params.id);
    const n = c?.docs_indexed || 0;
    const split = [["application/vnd.openxmlformats-officedocument.wordprocessingml.document", 0.42], ["application/pdf", 0.31], ["text/html", 0.17], ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 0.1]];
    json(res, { types: split.map(([mime_type, f]) => ({ mime_type, count: Math.round(n * f), sized_count: Math.round(n * f), size_bytes: Math.round(n * f) * 84000 })), untyped_count: 0, timed_out: false });
  });
  route("GET", "/manage/admin/cc-pair/:id/errors", (q, res) => json(res, { items: [], total_items: 0 }));
  route("GET", "/manage/connector-group-restrictions", (q, res) => json(res, {}));
  route("GET", "/federated", (q, res) => json(res, []));
  route("GET", "/federated/oauth-status", (q, res) => json(res, []));
  route("GET", "/mcp/servers/persona/:id", (q, res) => json(res, { mcp_servers: [] }));
  route("GET", "/chat/max-selected-document-tokens", (q, res) => json(res, 128000));
  route("POST", "/manage/admin/opensearch-health/popup", (q, res) => json(res, {}));
  route("GET", "/manage/document-set", (q, res) => json(res, db.documentSets));
  route("POST", "/manage/admin/document-set", (q, res) => {
    const d = { id: nextId("docset"), name: q.body.name, description: q.body.description || "", cc_pair_summaries: [], is_up_to_date: true, is_public: !!q.body.is_public, users: [], groups: [], permissions: { edit: true, delete: true, manage_access: true, publish: true }, federated_connector_summaries: [] };
    db.documentSets.push(d);
    json(res, d.id);
  });
  route("DELETE", "/manage/admin/document-set/:id", (q, res) => {
    db.documentSets = db.documentSets.filter((d) => String(d.id) !== q.params.id);
    ok(res);
  });
  route("GET", "/query/valid-tags", (q, res) => json(res, { tags: [] }));
  route("GET", "/manage/get-document-sets", (q, res) => json(res, db.documentSets));

  // ------------------------------------------------------------- users ----
  const fullUser = (u, i) => ({
    id: u.id,
    email: u.email,
    account_type: "STANDARD",
    is_admin: u.role === "admin",
    is_active: u.is_active,
    password_configured: true,
    personal_name: u.personal_name || (u.email === db.me.email ? "Alex" : null),
    created_at: new Date(Date.now() - (60 - i * 9) * 86400000).toISOString(),
    updated_at: new Date(Date.now() - (3 + i) * 86400000).toISOString(),
    last_active: u.is_active ? new Date(Date.now() - (i * 7 + 1) * 3600000).toISOString() : null,
    groups: db.groups.filter((g) => g.users.some((m) => m.id === u.id)).map((g) => ({ id: g.id, name: g.name })),
    is_scim_synced: false,
    craft_enabled: null,
  });
  const fullUsers = () => db.users.map(fullUser);
  route("GET", "/manage/users", (q, res) =>
    json(res, { accepted: fullUsers(), invited: [], slack_users: [], accepted_pages: 1, invited_pages: 1, slack_users_pages: 1 })
  );
  route("GET", "/manage/users/accepted/all", (q, res) => json(res, fullUsers()));
  route("GET", "/manage/users/invited", (q, res) => json(res, []));
  route("GET", "/manage/users/counts", (q, res) =>
    json(res, {
      account_type_counts: { STANDARD: db.users.length },
      status_counts: { active: db.users.filter((u) => u.is_active).length, inactive: db.users.filter((u) => !u.is_active).length, invited: 0, requested: 0 },
    })
  );
  route("POST", "/manage/admin/deactivate-user", (q, res) => { const u = db.users.find((x) => x.email === q.body.user_email); if (u) u.is_active = false; json(res, {}); });
  route("POST", "/manage/admin/activate-user", (q, res) => { const u = db.users.find((x) => x.email === q.body.user_email); if (u) u.is_active = true; json(res, {}); });
  route("POST", "/manage/admin/delete-user", (q, res) => { db.users = db.users.filter((x) => x.email !== q.body.user_email); json(res, {}); });
  route("PUT", "/manage/admin/users", (q, res) => {
    for (const email of q.body.emails || []) if (!db.users.some((u) => u.email === email))
      db.users.push({ id: "u-" + nextId("user"), email, is_active: true, is_superuser: false, is_verified: true, role: "basic", account_type: "STANDARD" });
    json(res, { invited: (q.body.emails || []).length });
  });
  route("GET", "/manage/admin/permissions/registry", (q, res) => json(res, []));
  route("GET", "/manage/admin/user-group", (q, res) => json(res, db.groups));
  route("GET", "/manage/user-groups/minimal", (q, res) => json(res, db.groups.map((g) => ({ id: g.id, name: g.name }))));
  route("POST", "/manage/admin/user-group", (q, res) => {
    const g = { id: nextId("group"), name: q.body.name, users: [], curator_ids: [], cc_pairs: [], document_sets: [], personas: [], is_up_to_date: true, is_up_for_deletion: false, is_default: false };
    db.groups.push(g);
    json(res, g);
  });
  route("GET", "/admin/api-key", (q, res) => json(res, db.apiKeys));
  route("GET", "/user/pats", (q, res) => json(res, db.pats));
  route("GET", "/user/pats/scopes", (q, res) => json(res, []));
  route("GET", "/user/usage", (q, res) => json(res, {}));

  // ------------------------------------------------------ search settings ----
  const searchSettings = {
    model_name: "nomic-ai/nomic-embed-text-v1",
    model_dim: 768,
    normalize: true,
    query_prefix: "search_query: ",
    passage_prefix: "search_document: ",
    provider_type: null,
    index_name: "danswer_chunk_nomic_ai_nomic_embed_text_v1",
    multipass_indexing: true,
    embedding_precision: "float",
    reduced_dimension: null,
    enable_contextual_rag: false,
    contextual_rag_llm_name: null,
    contextual_rag_llm_provider: null,
    switchover_type: "reindex",
  };
  route("GET", "/search-settings/get-current-search-settings", (q, res) => json(res, searchSettings));
  route("GET", "/search-settings/get-secondary-search-settings", (q, res) => json(res, null));
  route("GET", "/search-settings/reindex-progress", (q, res) => json(res, null));
  route("GET", "/search-settings/vector-quantization-support", (q, res) => json(res, { opensearch_version: "3.0", levels: [{ vector_quantization: "none", supported: true, min_opensearch_version: null }, { vector_quantization: "scalar_7_bit", supported: true, min_opensearch_version: "3.0" }, { vector_quantization: "scalar_1_bit", supported: true, min_opensearch_version: "3.0" }] }));
  route("GET", "/search-settings/unstructured-api-key-set", (q, res) => json(res, { unstructured_api_key_set: false }));
  route("GET", "/admin/embedding/embedding-provider", (q, res) => json(res, []));

  // ------------------------------------------------------------- admin ----
  route("GET", "/admin/cost-overrides", (q, res) => json(res, []));
  route("GET", "/admin/banner", (q, res) => json(res, null));
  const security = {
    user_directory_admin_only: false, incognito_availability: "everyone", incognito_record_mode: "full_history",
    allow_connector_group_restrictions: true, track_external_idp_expiry: false, allow_same_provider_subject_relink: false,
    allow_renamed_account_claim: false, ssrf_protection_level: "validate_all", mask_credential_prefix: true,
    llm_custom_config_env_injection: false, valid_email_domains: ["sunday.dev"], password_min_length: 8, password_max_length: 64,
    password_require_uppercase: false, password_require_lowercase: false, password_require_digit: false, password_require_special_char: false,
    password_auth_enabled: true, jwt_public_key_url: null, jwt_expected_audience: null, jwt_expected_issuer: null,
  };
  route("GET", "/admin/security", (q, res) => json(res, security));
  route("PUT", "/admin/security", (q, res) => { Object.assign(security, q.body); json(res, security); });
  route("PATCH", "/admin/security", (q, res) => { Object.assign(security, q.body); json(res, security); });
  route("GET", "/license", (q, res) => json(res, { has_license: true, tier: "enterprise", seats: 100, used_seats: 5, expires_at: now() }));
  route("GET", "/admin/billing/billing-information", (q, res) => json(res, {}));
  route("GET", "/admin/web-search/search-providers", (q, res) => json(res, []));
  route("GET", "/admin/web-search/content-providers", (q, res) => json(res, []));
  route("GET", "/admin/tracing/providers", (q, res) => json(res, []));
  route("GET", "/admin/voice/providers", (q, res) => json(res, []));
  route("GET", "/voice/status", (q, res) => json(res, { stt_enabled: false, tts_enabled: false }));
  route("GET", "/admin/image-generation/config", (q, res) => json(res, []));
  route("GET", "/admin/image-generation/llm-providers", (q, res) => json(res, []));
  route("GET", "/admin/usage-report", (q, res) => json(res, []));
  route("GET", "/admin/spending-limits", (q, res) => json(res, {}));
  route("GET", "/admin/hooks", (q, res) => json(res, []));
  route("GET", "/admin/hooks/specs", (q, res) => json(res, []));
  route("GET", "/manage/admin/slack-app/bots", (q, res) => json(res, []));
  route("GET", "/manage/admin/slack-app/channel", (q, res) => json(res, []));
  route("GET", "/manage/admin/standard-answer", (q, res) => json(res, []));
  route("GET", "/manage/admin/standard-answer/category", (q, res) => json(res, []));

  // ---------------------------------------------- admin shell + monitoring ----
  route("GET", "/manage/admin/opensearch-health", (q, res) => json(res, { issues: [] }));
  route("GET", "/chat/available-context-tokens/:id", (q, res) => json(res, { available_tokens: 180000 }));
  route("GET", "/admin/enterprise-settings/scim/token", (q, res) => json(res, { detail: "No token" }, 404));
  route("GET", "/admin/security/pinned-fields", (q, res) => json(res, []));
  route("GET", "/admin/sso/provider", (q, res) => json(res, []));
  route("GET", "/admin/sso/provider-type", (q, res) => json(res, []));
  route("GET", "/admin/sso/domain", (q, res) => json(res, []));

  const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString();
  const rowStatus = (c) => (c.in_progress ? "indexing" : c.last_status === "failed" ? "failed" : "indexed");
  const row = (c) => ({
    cc_pair_id: c.cc_pair_id, name: c.name, source: c.connector.source, access_type: c.access_type,
    cc_pair_status: c.in_progress ? "INITIAL_INDEXING" : c.cc_pair_status, status: rowStatus(c), creator_email: db.me.email, creator_name: "Alex",
    docs_indexed: c.docs_indexed, last_success: c.last_success, latest_index_attempt: c.latest_index_attempt,
    open_error_count: c.last_status === "failed" ? 3 : 0, group_count: 0, group_names: [], queue_position: null,
    permissions: { operate: true, edit: true, delete: true, publish: true },
  });
  route("GET", "/manage/admin/index-monitoring/connectors", (q, res) => {
    const items = db.connectors.map(row);
    const counts = { indexing: 0, syncing: 0, failed: 0, deleting: 0, scheduled: 0, indexed: 0, paused: 0 };
    items.forEach((i) => counts[i.status]++);
    const source_counts = {};
    items.forEach((i) => (source_counts[i.source] = (source_counts[i.source] || 0) + 1));
    json(res, { items, total_items: items.length, status_counts: counts, source_counts, federated_connectors: [] });
  });
  route("GET", "/manage/admin/index-monitoring/overview", (q, res) => {
    const bins = Number(q.query.get("bins") || 24);
    const start = Date.now() - 24 * 3600000;
    const step = (24 * 3600000) / bins;
    const slices = Array.from({ length: bins }, (_, i) => ({
      start: new Date(start + i * step).toISOString(),
      end: new Date(start + (i + 1) * step).toISOString(),
      docs_indexed: 20 + Math.round(30 * Math.abs(Math.sin(i / 3))) + (i % 5) * 4,
      runs: [{ attempt_id: 100 + i, status: "success", resolved: true }],
    }));
    json(res, {
      indexing_connectors: db.connectors.length,
      active_connectors: db.connectors.length,
      recent_docs_indexed: slices.reduce((a, x) => a + x.docs_indexed, 0),
      total_docs_indexed: db.connectors.reduce((a, c) => a + c.docs_indexed, 0),
      paused_connectors: 0,
      throughput: {
        window_start: new Date(start).toISOString(),
        window_end: now(),
        docs_indexed: slices.map((x) => x.docs_indexed),
        runs: slices.map((x, i) => ({ started: x.start, ended: x.end, status: "success" })),
        slices,
      },
    });
  });
  route("GET", "/manage/admin/index-monitoring/runs", (q, res) =>
    json(res, { items: [], total_items: 0, status_counts: { running: 0, queued: 0, succeeded: 0, failed: 0, canceled: 0 } })
  );
  route("GET", "/manage/admin/index-monitoring/runs/resolvable-count", (q, res) => json(res, { count: 0 }));

  route("GET", "/admin/chat-session-history", (q, res) => {
    const items = db.chats.map((c, i) => ({
      id: i + 1, user_email: db.me.email, name: c.name,
      first_user_message: c.messages[0]?.message || "", first_ai_message: c.messages[1]?.message?.slice(0, 120) || "",
      assistant_id: c.persona_id, assistant_name: (db.personas.find((p) => p.id === c.persona_id) || {}).name || "Sunday",
      time_created: c.time_created, feedback_type: null, flow_type: "chat", conversation_length: c.messages.length,
    }));
    json(res, { items, total_items: items.length });
  });
  route("GET", "/admin/usage/export", (q, res) =>
    json(res, { totals: { input_tokens: 482000, output_tokens: 126000, cache_read_tokens: 90000, cache_creation_tokens: 12000, cost_cents: 1840 }, records: [] })
  );
  route("GET", "/admin/usage/system", (q, res) =>
    json(res, { start: hoursAgo(24 * 30), end: now(), categories: [] })
  );

  // ------------------------------------------ connector creation workflow ----
  route("POST", "/manage/admin/connector-checks/plan", (q, res) => json(res, checkPlan(q.body.source, q.body.access_type)));
  route("POST", "/manage/admin/connector-checks/runs", (q, res) => json(res, startRun(db, q.body, nextId)));
  route("GET", "/manage/admin/connector-checks/runs/:id", (q, res) => {
    const snap = runSnapshot(db, q.params.id);
    json(res, snap || { detail: "Run not found" }, snap ? 200 : 404);
  });
  route("POST", "/manage/admin/connector-checks/runs/:id/cancel", (q, res) => json(res, {}));
  route("GET", "/manage/admin/similar-credentials/:source", (q, res) =>
    json(res, db.connectors.filter((c) => c.connector.source === q.params.source).map((c) => ({ ...c.credential, usages: [{ cc_pair_id: c.cc_pair_id, name: c.name }], user_email: db.me.email, user_personal_name: "Alex", is_owner: true })))
  );
  route("POST", "/manage/admin/credential/:id/binding-check", (q, res) => json(res, { field_errors: {}, rejection: null }));
  route("GET", "/connector/oauth/details/:source", (q, res) => json(res, { oauth_enabled: false }));
  route("POST", "/manage/credential", (q, res) => {
    const id = nextId("cred");
    db.pendingCreds ||= {};
    db.pendingCreds[id] = { id, name: q.body.name || `Credential ${id}`, source: q.body.source, user_id: db.me.id, time_created: now(), time_updated: now(), credential_json: {}, admin_public: !!q.body.admin_public };
    json(res, { id, success: true, message: "Credential created" });
  });
  route("POST", "/manage/admin/connector", (q, res) => {
    const id = nextId("connector");
    const b = q.body;
    db.pendingConns ||= {};
    db.pendingConns[id] = { id, name: b.name || `Connector ${id}`, source: b.source, input_type: b.input_type || "poll", connector_specific_config: b.connector_specific_config || {}, refresh_freq: b.refresh_freq ?? 1800, prune_freq: b.prune_freq ?? null, credential_ids: [], indexing_start: b.indexing_start ?? null, time_created: now(), time_updated: now() };
    json(res, db.pendingConns[id]);
  });
  route("PUT", "/manage/connector/:cid/credential/:crid", (q, res) => {
    const conn = db.pendingConns?.[q.params.cid];
    const cred = db.pendingCreds?.[q.params.crid] || db.connectors.map((c) => c.credential).find((c) => String(c.id) === q.params.crid);
    if (!conn || !cred) return json(res, { detail: "Connector or credential not found" }, 404);
    const id = nextId("ccpair");
    const target = 180 + Math.floor(Math.random() * 900);
    const pair = {
      cc_pair_id: id, name: q.body.name || conn.name, connector: { ...conn, credential_ids: [cred.id] }, credential: { ...cred, name: cred.name },
      access_type: q.body.access_type || "public", groups: q.body.groups || [],
      last_success: null, last_status: "in_progress", last_finished_status: null, cc_pair_status: "INITIAL_INDEXING", in_repeated_error_state: false,
      latest_index_attempt: { id: id * 10 }, docs_indexed: 0, in_progress: true, created: now(),
    };
    startIndexing(pair, target);
    db.connectors.push(pair);
    json(res, { success: true, message: "Connector created", data: id });
  });
  route("POST", "/manage/admin/connector-with-credential", (q, res) => {
    const b = q.body;
    const c = b.connector || {};
    const pairing = b.pairing || {};
    const connectorId = nextId("connector");
    let cred = b.credential_id != null
      ? db.pendingCreds?.[b.credential_id] || db.connectors.map((x) => x.credential).find((x) => x.id === b.credential_id)
      : null;
    if (!cred) {
      const id = nextId("cred");
      cred = { id, name: `${c.source} account`, source: c.source, user_id: db.me.id, time_created: now(), time_updated: now(), credential_json: {}, admin_public: false };
    }
    if (b.credential_sharing?.name) cred = { ...cred, name: b.credential_sharing.name, admin_public: !!b.credential_sharing.admin_public };
    cred = { ...cred, credential_json: Object.fromEntries(Object.entries(cred.credential_json || {}).map(([k, v]) => [k, /secret|password|token|key/i.test(k) ? "••••••••" : v])) };
    const id = nextId("ccpair");
    const conn = {
      id: connectorId, name: c.name || `Connector ${id}`, source: c.source, input_type: c.input_type || "poll",
      connector_specific_config: c.connector_specific_config || {}, refresh_freq: c.refresh_freq ?? 1800, prune_freq: c.prune_freq ?? null,
      credential_ids: [cred.id], indexing_start: c.indexing_start ?? null, check_freq: c.check_freq ?? 86400, time_created: now(), time_updated: now(),
    };
    const pair = {
      cc_pair_id: id, name: pairing.name || c.name || conn.name, connector: conn, credential: cred,
      access_type: pairing.access_type || c.access_type || "public", groups: pairing.groups || [],
      last_success: null, last_status: "in_progress", last_finished_status: null, cc_pair_status: "INITIAL_INDEXING",
      in_repeated_error_state: false, latest_index_attempt: { id: id * 10 }, docs_indexed: 0, in_progress: true,
    };
    startIndexing(pair, 180 + Math.floor(Math.random() * 900));
    db.connectors.push(pair);
    json(res, { success: true, message: "Connector created", data: id });
  });
  route("POST", "/manage/admin/connector-with-mock-credential", (q, res) => {
    const id = nextId("ccpair");
    const b = q.body;
    const connectorId = nextId("connector");
    const conn = { id: connectorId, name: b.name || `Connector ${id}`, source: b.source, input_type: b.input_type || "load_state", connector_specific_config: b.connector_specific_config || {}, refresh_freq: null, prune_freq: null, credential_ids: [0], indexing_start: null, time_created: now(), time_updated: now() };
    db.connectors.push({
      cc_pair_id: id, name: conn.name, connector: conn, credential: { id: 0, name: "Mock", source: b.source, user_id: db.me.id, time_created: now(), time_updated: now(), credential_json: {}, admin_public: true },
      access_type: b.access_type || "public", groups: [], last_success: now(), last_status: "success", last_finished_status: "success", cc_pair_status: "ACTIVE", in_repeated_error_state: false,
      latest_index_attempt: { id: id * 10 }, docs_indexed: 0,
    });
    startIndexing(db.connectors[db.connectors.length - 1], 40);
    json(res, { success: true, message: "ok", data: id });
  });
  route("POST", "/manage/admin/connector/file/upload", (q, res) => json(res, { file_paths: ["file-1"], file_names: ["upload"], zip_metadata_file_id: null }));
  route("DELETE", "/manage/admin/cc-pair/:id", (q, res) => { db.connectors = db.connectors.filter((c) => String(c.cc_pair_id) !== q.params.id); json(res, {}); });
  route("PUT", "/manage/admin/cc-pair/:id/status", (q, res) => {
    const c = db.connectors.find((x) => String(x.cc_pair_id) === q.params.id);
    if (c) c.cc_pair_status = q.body.status || c.cc_pair_status;
    json(res, {});
  });
  route("POST", "/manage/admin/connector/run-once", (q, res) => {
    const c = db.connectors.find((x) => x.connector.id === q.body.connector_id);
    if (c) startIndexing(c, Math.max(40, c.docs_indexed + Math.floor(Math.random() * 30)));
    json(res, { success: true, message: "Indexing started" });
  });
  route("POST", "/manage/admin/deletion-attempt", (q, res) => {
    db.connectors = db.connectors.filter((x) => x.connector.id !== q.body.connector_id);
    json(res, {});
  });
}
