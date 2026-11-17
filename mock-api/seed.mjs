// Seed data for the Sunday mock backend.
const daysAgo = (n, h = 10) => {
  const d = new Date(Date.now() - n * 86400000);
  d.setHours(h, 7, 0, 0);
  return d.toISOString();
};

export function seed() {
  const me = {
    id: "9a1f3c52-7b1e-4c1a-9a55-3f5d2f0e1a01",
    email: "admin@sunday.dev",
    is_active: true,
    is_superuser: true,
    is_verified: true,
    role: "admin",
    account_type: "STANDARD",
    preferences: {
      chosen_assistants: null,
      visible_assistants: [],
      hidden_assistants: [],
      pinned_assistants: [0, 1],
      default_model: null,
      recent_assistants: [0, 1],
      auto_scroll: true,
      shortcut_enabled: true,
      temperature_override_enabled: true,
      theme_preference: "system",
      language: "en",
      chat_background: null,
      default_app_mode: "CHAT",
      paste_as_tile: true,
    },
    team_name: "Sunday Labs",
    is_anonymous_user: false,
    password_configured: true,
    tenant_info: null,
    personalization: {
      name: "Alex",
      role: "Head of Operations",
      memories: [
        { id: 1, content: "Prefers concise answers with bullet points." },
        { id: 2, content: "Works on the Q3 roadmap and onboarding revamp." },
      ],
      use_memories: true,
      enable_memory_tool: true,
      user_preferences: "",
    },
    is_admin: true,
    is_group_manager: false,
    effective_permissions: ["admin"],
    admin_capabilities: ["admin"],
    token_expires_at: daysAgo(-30),
  };

  const minimalUser = { id: me.id, email: me.email };

  const settings = {
    anonymous_user_enabled: false,
    invite_only_enabled: false,
    maximum_chat_retention_days: null,
    company_name: "Sunday Labs",
    company_description: "Sunday Labs builds calm tools for busy teams.",
    notifications: [],
    needs_reindexing: false,
    gpu_enabled: false,
    application_status: "active",
    auto_scroll: true,
    temperature_override_enabled: true,
    reasoning_override_enabled: true,
    query_history_type: "normal",
    deep_research_enabled: true,
    multi_model_chat_enabled: true,
    search_ui_enabled: true,
    auto_detect_search_filters: true,
    image_extraction_and_analysis_enabled: true,
    user_knowledge_enabled: true,
    user_file_max_upload_size_mb: 100,
    file_token_count_threshold_k: 200,
    show_extra_connectors: true,
    disable_default_assistant: false,
    onyx_craft_enabled: false,
    onyx_craft_available: false,
    default_language: "en",
    ee_features_enabled: true,
    hide_onyx_branding: true,
    tier: "enterprise",
    vector_db_enabled: true,
    hooks_enabled: false,
    version: "1.0.0-sunday",
    max_allowed_upload_size_mb: 250,
    default_user_file_max_upload_size_mb: 100,
    default_refresh_freq: 1800,
    default_pruning_freq: 86400,
    default_file_token_count_threshold_k: 200,
    is_containerized: false,
    posthog_key: null,
    posthog_host: null,
  };

  const enterprise = {
    application_name: "Sunday",
    use_custom_logo: false,
    use_custom_logotype: false,
    logo_display_style: "logo_and_name",
    custom_nav_items: [],
    custom_lower_disclaimer_content: null,
    custom_header_content: null,
    two_lines_for_chat_header: null,
    custom_popup_header: null,
    custom_popup_content: null,
    enable_consent_screen: null,
    consent_screen_prompt: null,
    show_first_visit_notice: null,
    custom_greeting_message: null,
    custom_login_subtitle: null,
    custom_help_link_url: null,
    custom_help_link_label: null,
  };

  const tools = [
    { id: 1, name: "internal_search", display_name: "Internal Search", description: "Search across all connected company knowledge.", definition: null, custom_headers: null, in_code_tool_id: "SearchTool", passthrough_auth: false, user_id: null, enabled: true },
    { id: 2, name: "web_search", display_name: "Web Search", description: "Search the public web for fresh information.", definition: null, custom_headers: null, in_code_tool_id: "WebSearchTool", passthrough_auth: false, user_id: null, enabled: true },
    { id: 3, name: "generate_image", display_name: "Image Generation", description: "Generate images from a text description.", definition: null, custom_headers: null, in_code_tool_id: "ImageGenerationTool", passthrough_auth: false, user_id: null, enabled: true },
    { id: 4, name: "python", display_name: "Code Interpreter", description: "Run Python to analyse data and make charts.", definition: null, custom_headers: null, in_code_tool_id: "PythonTool", passthrough_auth: false, user_id: null, enabled: true },
    { id: 5, name: "open_url", display_name: "Open URL", description: "Read the contents of a web page.", definition: null, custom_headers: null, in_code_tool_id: "OpenURLTool", passthrough_auth: false, user_id: null, enabled: true },
  ];

  const mkPersona = (id, name, description, extra = {}) => ({
    id,
    name,
    description,
    tools: tools.slice(0, 3),
    starter_messages: [],
    document_sets: [],
    hierarchy_node_count: 0,
    attached_document_count: 0,
    knowledge_sources: [],
    default_model_configuration_id: null,
    icon_name: null,
    is_public: true,
    is_listed: true,
    display_priority: id,
    is_featured: false,
    builtin_persona: false,
    labels: [],
    owner: minimalUser,
    permissions: { edit: true, share: true, delete: true, view_stats: true, publish: true, feature: true, list: true, reorder: true },
    owner_group: null,
    user_permission: "OWNER",
    system_prompt: "",
    ...extra,
  });

  const personas = [
    mkPersona(0, "Sunday", "Your everyday assistant with access to company knowledge.", {
      builtin_persona: true,
      display_priority: 0,
      starter_messages: [
        { name: "Summarize the roadmap", message: "Give me an overview of the Q3 roadmap." },
        { name: "Draft an update", message: "Help me draft a weekly status update for my team." },
        { name: "Find a document", message: "Find the latest onboarding checklist." },
        { name: "Explain a concept", message: "Explain how our connector sync works in simple terms." },
      ],
    }),
    mkPersona(1, "Support Copilot", "Answers customer questions using help-center articles and past tickets.", {
      is_featured: true,
      icon_name: "headset",
      starter_messages: [{ name: "Refund policy", message: "What is our refund policy for annual plans?" }],
    }),
    mkPersona(2, "Engineering Helper", "Helps with code review, architecture notes and incident write-ups.", {
      is_featured: true,
      icon_name: "code",
    }),
    mkPersona(3, "HR Onboarding Buddy", "Guides new hires through benefits, tools and first-week tasks.", {
      icon_name: "users",
    }),
  ];

  const labels = [
    { id: 1, name: "Support" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "People" },
  ];

  const mc = (id, name, display, extra = {}) => ({
    id,
    name,
    is_visible: true,
    max_input_tokens: 200000,
    supports_image_input: true,
    supports_reasoning: false,
    supports_chat: true,
    display_name: display,
    ...extra,
  });

  const llmProviders = [
    {
      id: 1,
      name: "Anthropic",
      provider: "anthropic",
      provider_display_name: "Anthropic",
      api_key: "••••••••",
      api_base: null,
      api_version: null,
      custom_config: null,
      is_public: true,
      is_auto_mode: false,
      groups: [],
      personas: [],
      deployment_name: null,
      model_configurations: [
        mc(11, "claude-sonnet-5-5", "Claude Sonnet 5.5", { supports_reasoning: true, is_recommended_default: true, supported_reasoning_efforts: ["low", "medium", "high"] }),
        mc(12, "claude-opus-5-5", "Claude Opus 5.5", { supports_reasoning: true, supported_reasoning_efforts: ["low", "medium", "high"] }),
        mc(13, "claude-haiku-5-5", "Claude Haiku 5.5"),
      ],
    },
    {
      id: 2,
      name: "OpenAI",
      provider: "openai",
      provider_display_name: "OpenAI",
      api_key: "••••••••",
      api_base: null,
      api_version: null,
      custom_config: null,
      is_public: true,
      is_auto_mode: false,
      groups: [],
      personas: [],
      deployment_name: null,
      model_configurations: [
        mc(21, "gpt-5", "GPT-5", { max_input_tokens: 400000, supports_reasoning: true, supported_reasoning_efforts: ["low", "medium", "high"] }),
        mc(22, "gpt-5-mini", "GPT-5 mini", { max_input_tokens: 400000 }),
      ],
    },
  ];

  const wellKnownLlm = [
    { name: "anthropic", known_models: llmProviders[0].model_configurations, recommended_default_model: { name: "claude-sonnet-5-5", display_name: "Claude Sonnet 5.5" } },
    { name: "openai", known_models: llmProviders[1].model_configurations, recommended_default_model: { name: "gpt-5", display_name: "GPT-5" } },
  ];

  const documents = [
    { document_id: "doc-roadmap", semantic_identifier: "Q3 Product Roadmap", link: "https://docs.sunday.dev/roadmap-q3", source_type: "google_drive", blurb: "Q3 priorities: search quality, connector reliability, refreshed admin experience.", boost: 0, hidden: false, score: 0.93, chunk_ind: 0, match_highlights: [], metadata: { owner: "Platform" }, updated_at: daysAgo(3), is_internet: false },
    { document_id: "doc-onboarding", semantic_identifier: "New Hire Onboarding Checklist", link: "https://wiki.sunday.dev/onboarding", source_type: "confluence", blurb: "Day-one accounts, laptop setup, first-week meetings and 30/60/90 goals.", boost: 0, hidden: false, score: 0.88, chunk_ind: 0, match_highlights: [], metadata: { space: "People" }, updated_at: daysAgo(6), is_internet: false },
    { document_id: "doc-support", semantic_identifier: "Support Escalation Report", link: "https://sunday.slack.com/archives/C01/p1", source_type: "slack", blurb: "Escalations fell 18% QoQ after the new triage workflow rolled out.", boost: 0, hidden: false, score: 0.81, chunk_ind: 0, match_highlights: [], metadata: { channel: "#support" }, updated_at: daysAgo(1), is_internet: false },
  ];

  const mkMsg = (id, type, message, parent, chat, extra = {}) => ({
    message_id: id,
    message_type: type,
    research_type: null,
    parent_message: parent,
    latest_child_message: null,
    message,
    rephrased_query: null,
    context_docs: null,
    time_sent: daysAgo(2),
    overridden_model: "",
    alternate_assistant_id: null,
    chat_session_id: chat,
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
    ...extra,
  });

  const chat1 = "11111111-1111-4111-8111-111111111111";
  const chat2 = "22222222-2222-4222-8222-222222222222";
  const chat3 = "33333333-3333-4333-8333-333333333333";
  const m1 = mkMsg(1, "user", "Summarize the Q3 roadmap for me", null, chat1);
  const m2 = mkMsg(2, "assistant", "Here's the **Q3 roadmap** at a glance:\n\n- **Search quality**: better ranking and filters [[1]](https://docs.sunday.dev/roadmap-q3)\n- **Connector reliability**: fewer failed syncs\n- **Admin revamp**: shipped last sprint\n\nWant a version for leadership?", 1, chat1, {
    context_docs: [documents[0]],
    citations: { 1: "doc-roadmap" },
    processing_duration_seconds: 2.4,
  });
  m1.latest_child_message = 2;
  const m3 = mkMsg(3, "user", "Draft a weekly status update for the platform team", null, chat2);
  const m4 = mkMsg(4, "assistant", "**Weekly update: Platform**\n\n**Shipped**\n- Connector retry logic\n- Admin dashboard refresh\n\n**In progress**\n- Search ranking experiments\n\n**Risks**\n- Slack connector rate limits", 3, chat2, { processing_duration_seconds: 1.8 });
  m3.latest_child_message = 4;
  const m5 = mkMsg(5, "user", "What do new hires need on day one?", null, chat3);
  const m6 = mkMsg(6, "assistant", "On day one every new hire gets their accounts, a laptop, and a buddy [[1]](https://wiki.sunday.dev/onboarding).", 5, chat3, { context_docs: [documents[1]], citations: { 1: "doc-onboarding" }, processing_duration_seconds: 1.5 });
  m5.latest_child_message = 6;

  const chats = [
    { id: chat1, name: "Q3 roadmap summary", persona_id: 0, project_id: 1, time_created: daysAgo(2), time_updated: daysAgo(2), shared_status: "private", messages: [m1, m2] },
    { id: chat2, name: "Weekly platform status", persona_id: 0, project_id: null, time_created: daysAgo(1), time_updated: daysAgo(1), shared_status: "private", messages: [m3, m4] },
    { id: chat3, name: "Day-one checklist", persona_id: 3, project_id: null, time_created: daysAgo(5), time_updated: daysAgo(5), shared_status: "private", messages: [m5, m6] },
  ];

  const projects = [
    { id: 1, name: "Q3 Planning", description: "Roadmap and OKR work for Q3", created_at: daysAgo(14), user_id: me.id, instructions: "Keep answers short and tie them to OKRs.", chat_sessions: [] },
    { id: 2, name: "Customer Research", description: "Interview notes and synthesis", created_at: daysAgo(9), user_id: me.id, instructions: null, chat_sessions: [] },
  ];

  const mkConnector = (id, source, name, docs, status = "success", extraCfg = {}) => ({
    cc_pair_id: id,
    name,
    connector: {
      id,
      name,
      source,
      input_type: "poll",
      connector_specific_config: extraCfg,
      refresh_freq: 1800,
      prune_freq: null,
      credential_ids: [id],
      indexing_start: null,
      time_created: daysAgo(40),
      time_updated: daysAgo(1),
      from_beginning: false,
    },
    credential: {
      id,
      name: `${name} credential`,
      source,
      user_id: me.id,
      time_created: daysAgo(40),
      time_updated: daysAgo(40),
      credential_json: {},
      admin_public: true,
    },
    access_type: "public",
    groups: [],
    last_success: daysAgo(0, 8),
    last_status: status,
    last_finished_status: status,
    cc_pair_status: "ACTIVE",
    in_repeated_error_state: status === "failed",
    latest_index_attempt: {
      id: id * 10,
      status,
      from_beginning: false,
      new_docs_indexed: 12,
      docs_removed_from_index: 0,
      total_docs_indexed: docs,
      error_msg: status === "failed" ? "Rate limit exceeded (429)" : null,
      time_started: daysAgo(0, 7),
      time_updated: daysAgo(0, 8),
      error_count: status === "failed" ? 3 : 0,
      full_exception_trace: null,
      poll_range_start: null,
      poll_range_end: null,
      is_resume: false,
    },
    docs_indexed: docs,
  });

  const connectors = [
    mkConnector(1, "google_drive", "Company Drive", 1842),
    mkConnector(2, "confluence", "Engineering Wiki", 963, "success", { wiki_base: "https://wiki.sunday.dev" }),
    mkConnector(3, "slack", "Slack Workspace", 5210, "failed"),
    mkConnector(4, "github", "sunday-labs/platform", 412),
    mkConnector(5, "notion", "Product Notion", 288),
    mkConnector(6, "zendesk", "Help Center", 677),
  ];

  const users = [
    { ...me, role: "admin" },
    { id: "u-2", email: "priya@sunday.dev", is_active: true, is_superuser: false, is_verified: true, role: "basic", account_type: "STANDARD", personal_name: "Priya Shah" },
    { id: "u-3", email: "marco@sunday.dev", is_active: true, is_superuser: false, is_verified: true, role: "basic", account_type: "STANDARD", personal_name: "Marco Rossi" },
    { id: "u-4", email: "lena@sunday.dev", is_active: true, is_superuser: false, is_verified: true, role: "curator", account_type: "STANDARD", personal_name: "Lena Kowalski" },
    { id: "u-5", email: "tom@sunday.dev", is_active: false, is_superuser: false, is_verified: true, role: "basic", account_type: "STANDARD", personal_name: "Tom Okafor" },
  ];

  const groups = [
    { id: 1, name: "Engineering", users: users.slice(0, 3), curator_ids: [], cc_pairs: [], document_sets: [], personas: [], is_up_to_date: true, is_up_for_deletion: false, is_default: false },
    { id: 2, name: "Support", users: users.slice(2, 4), curator_ids: [], cc_pairs: [], document_sets: [], personas: [], is_up_to_date: true, is_up_for_deletion: false, is_default: false },
  ];

  const documentSets = [
    { id: 1, name: "Engineering Docs", description: "Wiki and repos for the engineering team", cc_pair_summaries: [{ id: 2, name: "Engineering Wiki", source: "confluence", access_type: "public" }, { id: 4, name: "sunday-labs/platform", source: "github", access_type: "public" }], is_up_to_date: true, is_public: true, users: [], groups: [], permissions: { edit: true, delete: true, manage_access: true, publish: true }, federated_connector_summaries: [] },
    { id: 2, name: "Customer Support", description: "Help center and Slack support channels", cc_pair_summaries: [{ id: 6, name: "Help Center", source: "zendesk", access_type: "public" }, { id: 3, name: "Slack Workspace", source: "slack", access_type: "public" }], is_up_to_date: true, is_public: true, users: [], groups: [], permissions: { edit: true, delete: true, manage_access: true, publish: true }, federated_connector_summaries: [] },
  ];

  const notifications = [
    { id: 1, notif_type: "release_notes", severity: "info", title: "Welcome to Sunday", description: "Take a look around. Everything here runs on demo data.", dismissed: false, first_shown: daysAgo(1), last_shown: daysAgo(0), additional_data: { version: "1.0.0" } },
  ];

  return {
    counters: { persona: 100, llm: 10, msg: 100, project: 10, connector: 10, user: 10, group: 10, docset: 10 },
    me,
    minimalUser,
    settings,
    enterprise,
    tools,
    personas,
    labels,
    llmProviders,
    llmDefaults: { text: { provider_id: 1, model_name: "claude-sonnet-5-5" }, vision: { provider_id: 1, model_name: "claude-sonnet-5-5" } },
    wellKnownLlm,
    documents,
    chats,
    projects,
    connectors,
    users,
    groups,
    documentSets,
    notifications,
    promptShortcuts: [
      { id: 1, prompt: "tldr", content: "Summarize the following in three bullet points:", active: true, is_public: false },
    ],
    apiKeys: [],
    pats: [],
  };
}
