// Connector behaviour for the mock backend: connection checks, simulated
// indexing, and a small per-source document catalogue that chat search uses.

const NAMES = {
  sharepoint: "SharePoint", confluence: "Confluence", google_drive: "Google Drive", slack: "Slack", github: "GitHub",
  jira: "Jira", notion: "Notion", zendesk: "Zendesk", salesforce: "Salesforce", hubspot: "HubSpot", gong: "Gong",
  web: "Web", file: "Files", onedrive: "OneDrive", teams: "Microsoft Teams", dropbox: "Dropbox", box: "Box",
  gmail: "Gmail", linear: "Linear", asana: "Asana", bitbucket: "Bitbucket", gitlab: "GitLab", discourse: "Discourse",
  coda: "Coda", slab: "Slab", guru: "Guru", outline: "Outline", gitbook: "GitBook", bookstack: "BookStack",
};
export const sourceName = (s) => NAMES[s] || s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

// ------------------------------------------------------------ documents ----
// Source-flavoured sample content. Titles, blurbs and links are made up.
const CATALOG = {
  sharepoint: [
    ["Employee Handbook 2026.docx", "Working hours, leave policy, expense rules and the code of conduct for all staff.", "HR/Policies"],
    ["Security Awareness Training.pptx", "Annual phishing and password-hygiene training; completion is mandatory by March.", "IT/Security"],
    ["Vendor Contract Template.docx", "Standard MSA with data-processing addendum; legal review required for changes.", "Legal/Templates"],
    ["Quarterly Business Review - Q3.xlsx", "Revenue by region, churn and pipeline coverage for the Q3 business review.", "Finance/Reports"],
    ["IT Onboarding Checklist.docx", "Laptop, SSO, VPN and MFA setup steps for new joiners, with owner per step.", "IT/Onboarding"],
  ],
  confluence: [
    ["Incident Response Runbook", "Severity levels, paging policy and the post-incident review template.", "ENG"],
    ["Architecture Overview", "Services, queues and data stores, with the request flow for search and chat.", "ENG"],
    ["Release Process", "Weekly release train, freeze windows and the rollback checklist.", "ENG"],
  ],
  google_drive: [
    ["Q3 Product Roadmap", "Q3 priorities: search quality, connector reliability, refreshed admin experience.", "Product"],
    ["Customer Interview Notes", "Twelve interviews synthesised into five themes; onboarding friction ranks first.", "Research"],
    ["OKRs - Q3", "Company and team objectives with key results and owners.", "Company"],
  ],
  slack: [
    ["#support escalations", "Escalations fell 18% quarter over quarter after the new triage workflow.", "#support"],
    ["#launch-room", "Launch checklist status, owner updates and the go/no-go thread.", "#launch-room"],
  ],
  github: [
    ["platform: README.md", "Local setup, service layout and the contribution guide for the platform repo.", "sunday-labs/platform"],
    ["platform: connectors/retry.py", "Exponential backoff with jitter used by all polling connectors.", "sunday-labs/platform"],
  ],
  jira: [["PLAT-482: Connector sync stalls", "Syncs stall when the source rate-limits; backoff fix in review.", "PLAT"]],
  notion: [["Product Principles", "Calm by default, fast always, explain what happened.", "Product"]],
  zendesk: [["Refund policy for annual plans", "Annual plans are refundable within 30 days of purchase, pro-rated afterwards.", "Help Center"]],
};

export function docsForSource(source, ccPairId) {
  const name = sourceName(source);
  const base = CATALOG[source] || [
    [`${name} overview`, `Top-level overview content indexed from ${name}.`, name],
    [`${name} team notes`, `Meeting notes and decisions pulled from ${name}.`, name],
    [`${name} playbook`, `Operating playbook and process documentation from ${name}.`, name],
  ];
  return base.map(([title, blurb, where], i) => ({
    document_id: `${source}-${ccPairId}-${i}`,
    semantic_identifier: title,
    link: `https://${source.replace(/_/g, "-")}.sunday.dev/${encodeURIComponent(where)}/${i + 1}`,
    source_type: source,
    blurb,
    boost: 0,
    hidden: false,
    score: 0.9 - i * 0.04,
    chunk_ind: 0,
    match_highlights: [],
    metadata: { location: where },
    updated_at: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    is_internet: false,
  }));
}

// Fill in every field the UI reads from an index attempt.
export function normAttempt(a) {
  if (!a) return a;
  const done = a.status && a.status !== "in_progress" && a.status !== "not_started";
  return {
    open_error_count: 0, open_doc_error_count: 0, is_new_model: false, is_backfill: false,
    time_finished: done ? a.time_updated ?? null : null,
    ...a,
  };
}

// -------------------------------------------------------------- indexing ----
const INDEX_MS = 14000;
export function startIndexing(c, targetDocs) {
  c.sim = { started: Date.now(), target: targetDocs };
  applySim(c);
}

function applySim(c) {
  const sim = c.sim;
  if (!sim) return;
  const t = Date.now() - sim.started;
  const done = t >= INDEX_MS;
  const docs = done ? sim.target : Math.floor((sim.target * t) / INDEX_MS);
  const attempt = c.latest_index_attempt || {};
  c.docs_indexed = docs;
  c.in_progress = !done;
  c.cc_pair_status = done ? "ACTIVE" : "INITIAL_INDEXING";
  c.last_status = done ? "success" : "in_progress";
  c.last_finished_status = done ? "success" : c.last_finished_status ?? null;
  c.last_success = done ? new Date(sim.started + INDEX_MS).toISOString() : null;
  c.latest_index_attempt = normAttempt({
    id: attempt.id ?? 1,
    status: c.last_status,
    from_beginning: true,
    new_docs_indexed: docs,
    docs_removed_from_index: 0,
    total_docs_indexed: docs,
    error_msg: null,
    time_started: new Date(sim.started).toISOString(),
    time_updated: new Date().toISOString(),
    error_count: 0,
    full_exception_trace: null,
    poll_range_start: null,
    poll_range_end: null,
    is_resume: false,
  });
  if (done) delete c.sim;
}

export function tick(db) {
  for (const c of db.connectors) {
    if (c.sim) applySim(c);
    else if (c.latest_index_attempt && c.latest_index_attempt.open_error_count === undefined) c.latest_index_attempt = normAttempt(c.latest_index_attempt);
    if (c.connector && (c.connector.check_freq === undefined || c.connector.check_freq === null)) c.connector.check_freq = 86400;
  }
}

// ---------------------------------------------------------------- checks ----
function checkDefs(source) {
  const n = sourceName(source);
  const defs = {
    sharepoint: [
      ["authenticate", "Sign in with Microsoft Entra", true, true, "Token acquired for the app registration."],
      ["graph_access", "Reach SharePoint through Microsoft Graph", true, false, "Graph API responded; Sites.Read.All granted."],
      ["read_libraries", "Read document libraries", true, false, "Found 7 document libraries across the listed sites."],
      ["permission_sync", "Read site permissions", false, false, "Permissions are readable; document-level sync available."],
    ],
  };
  const list = defs[source] || [
    ["authenticate", `Sign in to ${n}`, true, true, `Credentials accepted by ${n}.`],
    ["read_content", `Read content from ${n}`, true, false, `Readable content found in ${n}.`],
    ["discover", `List what Sunday can reach in ${n}`, false, false, `Listed accessible spaces and folders in ${n}.`],
  ];
  return list.map(([id, display, required, binds, summary]) => ({ id, display, required, binds, summary }));
}

const baseCheck = (d, state, extra = {}) => ({
  check_id: d.id,
  display_name: d.display,
  capability: d.id === "permission_sync" ? "doc_permission_sync" : "indexing",
  required: d.required,
  state,
  message: "",
  summary: state === "passed" ? d.summary : null,
  description: null,
  error_kind: null,
  not_run_reason: null,
  missing_fields: [],
  invalid_fields: [],
  remediation: null,
  docs_link: null,
  duration_ms: state === "passed" ? 600 + Math.floor(Math.random() * 900) : null,
  from_cache: false,
  validates_binding: d.binds,
  is_fallback: false,
  findings: state === "passed" && d.id === "read_libraries" ? [{ type: "count", key: "readable_drives", field_name: null, count: 7, at_least: false }] : [],
  reports_field: null,
  ...extra,
});

export function checkPlan(source, accessType) {
  return {
    source, access_type: accessType ?? null, form_errors: {}, unknown_fields: [],
    checks: checkDefs(source).map((d) => baseCheck(d, "pending")),
  };
}

export function startRun(db, body, nextId) {
  const run_id = `run-${nextId("run")}`;
  let credential_id = body.credential_id;
  if (credential_id == null) {
    credential_id = nextId("cred");
    db.pendingCreds ||= {};
    db.pendingCreds[credential_id] = {
      id: credential_id, name: `Draft ${body.source} account`, source: body.source, user_id: db.me.id,
      time_created: new Date().toISOString(), time_updated: new Date().toISOString(),
      credential_json: body.credential_json || {}, admin_public: false,
    };
  }
  db.runs ||= {};
  db.runs[run_id] = { run_id, started: Date.now(), source: body.source, access_type: body.access_type ?? null, draft_key: body.draft_key, credential_id };
  return runSnapshot(db, run_id);
}

const STEP_MS = 1300;
export function runSnapshot(db, run_id) {
  const r = db.runs?.[run_id];
  if (!r) return null;
  const defs = checkDefs(r.source);
  const elapsed = Date.now() - r.started;
  const checks = defs.map((d, i) => {
    const doneAt = (i + 1) * STEP_MS;
    if (elapsed >= doneAt) return baseCheck(d, "passed");
    if (elapsed >= i * STEP_MS) return baseCheck(d, "running");
    return baseCheck(d, "pending");
  });
  const completed = elapsed >= defs.length * STEP_MS;
  return {
    run_id, draft_key: r.draft_key, source: r.source, credential_id: r.credential_id, access_type: r.access_type,
    status: completed ? "completed" : "running", form_errors: {}, unknown_fields: [], checks,
  };
}
