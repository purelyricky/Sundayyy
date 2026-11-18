/**
 * @readable-header
 * FILE:      assets/service-worker.js
 * WAS:       service-worker.ts-jNvObEJy.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     anthropic-extension
 * WHAT:      Background service worker: bridge WebSocket to claude.ai, pairing crypto, native messaging, skills/scheduling alarms, event wiring.
 * USED BY:   service-worker-loader.js (static import)
 * NEEDS:     assets/auth-and-saved-prompts.js (static import)
 *            assets/browser-tools-and-permissions.js (static import)
 *            assets/onboarding-prompts.js (static import)
 *            assets/react-vendor-and-language-list.js (static import)
 *            assets/skill-text.js (static import)
 *            icon-128.png (named in code)
 *            options.html (named in code)
 *            pairing.html (named in code)
 *            ... and 1 more (full list in FILE_INDEX.md)
 */
/**
 * service-worker (background, MV3 module)
 *
 * The extension's brain. Everything below is organised in the order it appears in the original bundle:
 *
 *  1. Bridge WebSocket     - connects to wss://bridge.claudeusercontent.com so claude.ai can send "tool_call"s
 *                            (click, type, screenshot, ...) to this browser; sends results back.
 *  2. External extensions  - relays messages to other allow-listed extensions on request.
 *  3. Local pairing crypto - helpers for the Claude Desktop pairing handshake: base64url, ES256 JWT checks,
 *                            JWKS cache, ECDH + HKDF + AES-GCM "sealed channel".
 *  4. Native messaging     - optional connection to a locally installed Claude Desktop / Claude Code host.
 *  5. Skills & scheduling  - migrating saved prompts to skills, scheduled tasks via chrome.alarms.
 *  6. Event wiring         - install/startup hooks, side-panel opening, notifications, keyboard command,
 *                            runtime messages from the extension's own pages/content scripts, and
 *                            external messages from https://claude.ai.
 *
 * Names were reconstructed from usage. Helpers imported from other chunks whose purpose could not be
 * determined are named imported_<exportName>. Behaviour is unchanged from the minified original.
 */
import {
  i as getDefaultLocale,
  r as LOCALE_DISPLAY_NAMES,
  t as SUPPORTED_LOCALES,
} from "./react-vendor-and-language-list.js";
import {
  $ as handleOAuthRedirect,
  Bt as onFeatureFlagsChanged,
  Dn as bindSessionToTabGroup,
  G as imported_G,
  Ht as refreshFeatureGates,
  It as isGateOverrideActive,
  J as checkAndRefreshOAuth,
  Lt as getFeatureValue,
  M as DISPLAY_NAME_STRIP_PATTERN_A,
  Mn as getEnvConfig,
  N as DISPLAY_NAME_STRIP_PATTERN_B,
  Q as getAccountUuid,
  Qt as postureStore,
  Sn as resetAccountCaches,
  Ut as clearStoredValue,
  Vt as onPostureChangedExternal,
  X as getAccessToken,
  Xt as PROFILE_KEY,
  Y as clearAuthState,
  Zt as profileResource,
  _n as removeStorageKeys,
  a as parseDevMigrationMode,
  an as identityChanged,
  at as imported_at,
  bn as setStorageValues,
  c as SkillNameConflictError,
  cn as loadPosture,
  d as SkillRejectedError,
  en as MESSAGE_TYPE_en,
  et as onFirstInstall,
  fn as subscribeToPosture,
  gn as getStorageValues,
  h as fetchSkillDetail,
  hn as getStorageValue,
  ht as buildTaskExecutedSuccessProps,
  i as resolveSkillMigrationMode,
  in as imported_in,
  it as initRequestContext,
  jn as createBackoffTimer,
  l as SkillHttpError,
  ln as getPostureForUi,
  m as findSkillByName,
  mn as STORAGE_KEYS,
  mt as buildTaskExecutedFailureProps,
  n as scheduledSkillsStore,
  nn as initPosture,
  nt as registerStartupListeners,
  o as isScheduledPrompt,
  on as setPostureReducer,
  ot as trackEvent,
  p as createSkill,
  pn as PERMISSION_CONSENT_KEYS,
  r as SKILL_MIGRATION_FEATURE_KEY,
  rn as getPosture,
  rt as imported_rt,
  st as imported_st,
  t as savedPromptsService,
  tn as updatePosture,
  tt as isOAuthFlowInProgress,
  u as SkillBlockingError,
  un as listsEqual,
  vn as imported_vn,
  yn as setStorageValue,
  zt as isGateEnabled,
} from "./auth-and-saved-prompts.js";
import {
  $ as TOOLS_WITHOUT_TAB,
  $t as clearPermissionRequests,
  At as imported_At,
  Bt as ge,
  Dt as SIDEPANEL_CAPABILITY,
  Gt as COWORK_IFRAME_GATE,
  Ht as _e,
  Mt as imported_Mt,
  Nt as imported_Nt,
  Pt as imported_Pt,
  Qt as debuggerSessionManager,
  R as ensureOffscreenDocument,
  Tn as sleep,
  Ut as imported_Ut,
  Vt as imported_Vt,
  Wt as SIDEPANEL_IFRAME_TOOLS,
  Xt as tabGroupManager,
  Yt as tabNotFoundMessage,
  a as imported_a,
  c as toolErrorResult,
  d as cleanupClosedTab,
  en as imported_en,
  et as PERMISSION_DENIED_HINT,
  i as imported_i,
  in as configureExternalExtensions,
  kt as handlePortConnection,
  l as executeTool,
  n as stopAgentOnTab,
  nn as getExternalConfigOrigin,
  o as handleCicPanelConnection,
  r as onIframeAgentStopped,
  rn as sendToExternalExtension,
  s as QUIET_TOOLS,
  t as imported_t,
  tn as getExternalAllowlist,
  tt as toolErrorMessage,
  u as runTaskInTab,
  zt as IFRAME_MESSAGE_TYPES,
} from "./browser-tools-and-permissions.js";
import { n as toSkillName, t as truncateText } from "./skill-text.js";
import { t as getOnboardingPrompt } from "./onboarding-prompts.js";
var inflightExternalRequests = 0,
  MAX_EXTERNAL_RESPONSE_BYTES = 16777216;
/** Forwards a payload from the Claude backend to another *allow-listed* extension (chrome.runtime messaging) and returns its reply. Replies over 16 MiB are refused. */
async function relayExternalMessage(e, t) {
  if (inflightExternalRequests >= 8)
    return {
      ok: !1,
      error: "send_failed",
    };
  inflightExternalRequests++;
  try {
    const n = await getExternalAllowlist(),
      r = new Set(n?.extensionIds ?? []),
      i = Array.isArray(e.extensionIds)
        ? e.extensionIds.filter((e) => "string" == typeof e)
        : [],
      o = i.filter((e) => r.has(e));
    if (i.length > 0 && 0 === o.length)
      return t()
        ? {
            ok: !1,
            error: "no_target",
            detail: "not_allowlisted",
          }
        : void 0;
    const a = "number" == typeof e.timeoutMs ? e.timeoutMs : void 0,
      s = await sendToExternalExtension(o, e.payload, a);
    if (!t()) return;
    return s.ok &&
      (function (e, t) {
        try {
          const n = JSON.stringify(e) ?? "";
          return n.length > t
            ? 1 / 0
            : 3 * n.length <= t
              ? n.length
              : new TextEncoder().encode(n).length;
        } catch {
          return 1 / 0;
        }
      })(s.response, MAX_EXTERNAL_RESPONSE_BYTES) > MAX_EXTERNAL_RESPONSE_BYTES
      ? {
          ok: !1,
          error: "send_failed",
        }
      : s;
  } catch {
    return t()
      ? {
          ok: !1,
          error: "send_failed",
        }
      : void 0;
  } finally {
    inflightExternalRequests--;
  }
}
var connectionActive = {
  bridge: !1,
  native: !1,
};
/** Tracks whether the claude.ai bridge or the native host is connected and stores the combined flag. */
function setMcpConnectionState(e, t) {
  connectionActive[e] = t;
  const n = connectionActive.bridge || connectionActive.native;
  return setStorageValue(STORAGE_KEYS.MCP_CONNECTED, n), n;
}
var connectedAccountUuid,
  lastCloseCode,
  lastSentDisplayName,
  bridgeSocket = null,
  isConnecting = !1,
  reconnectTimer = null,
  reconnectAt = null,
  reconnectAttempt = 0,
  pingInterval = null,
  cachedDeviceId = null,
  lastOAuthRefreshAt = 0,
  deviceId = null,
  serviceWorkerStartedAt = Date.now(),
  consecutive1008Count = 0,
  forceTokenRefresh = !1,
  tokenClearStreak = 0,
  lastPongAt = 0,
  connectStartedAt = 0;
async function readBridgeNames() {
  const { bridgeDisplayName: e, bridgeDefaultDisplayName: t } =
    await chrome.storage.local.get([
      "bridgeDisplayName",
      "bridgeDefaultDisplayName",
    ]);
  return {
    userSet: "string" == typeof e && e ? e : void 0,
    default: "string" == typeof t && t ? t : void 0,
  };
}
async function getBridgeDisplayName() {
  const e = await readBridgeNames();
  return e.userSet ?? e.default;
}
async function updateDefaultDisplayName(e) {
  if ("string" != typeof e) return;
  const t = e
      .replace(DISPLAY_NAME_STRIP_PATTERN_A, " ")
      .replace(DISPLAY_NAME_STRIP_PATTERN_B, " ")
      .replace(/\s+/g, " ")
      .trim(),
    n = Array.from(t).slice(0, 64).join("").trim();
  n &&
    (await readBridgeNames()).default !== n &&
    (await chrome.storage.local.set({
      bridgeDefaultDisplayName: n,
    }),
    await (async function () {
      const e = bridgeSocket;
      if (!e || !isSocketOpenOrConnecting(e)) return;
      const t = await readBridgeNames();
      if (t.userSet || t.default === lastSentDisplayName) return;
      if (bridgeSocket !== e || !isSocketOpenOrConnecting(e)) return;
      if (pendingPermissionRequests.size > 0 || activeToolCalls > 0) return;
      e.close(4004, "display-name-changed");
    })());
}
var activeToolCalls = 0;
function isSocketOpenOrConnecting(e) {
  return (
    e.readyState === WebSocket.CONNECTING || e.readyState === WebSocket.OPEN
  );
}
var lastReconnectGeneration,
  EXTERNAL_MESSAGE_TYPES = new Set([
    "external_message",
    "external_message_result",
    "external_config",
  ]),
  KEEPALIVE_ALARM = "bridge-keepalive",
  MAX_RECONNECT_DELAY_MS = 3e5,
  pendingPermissionRequests = new Map();
function getOsPlatform() {
  try {
    return navigator.userAgentData?.platform ?? navigator.platform ?? "Unknown";
  } catch {
    return navigator.platform ?? "Unknown";
  }
}
async function getBridgeDeviceId() {
  return loadOrCreateDeviceId();
}
/** Random per-install UUID kept in chrome.storage.local ('bridgeDeviceId'). */
async function loadOrCreateDeviceId() {
  if (cachedDeviceId) return cachedDeviceId;
  const e = await chrome.storage.local.get("bridgeDeviceId");
  return e.bridgeDeviceId
    ? (cachedDeviceId = e.bridgeDeviceId)
    : ((cachedDeviceId = crypto.randomUUID()),
      await chrome.storage.local.set({
        bridgeDeviceId: cachedDeviceId,
      }),
      cachedDeviceId);
}
function startPingInterval() {
  stopPingInterval(),
    (pingInterval = setInterval(() => {
      bridgeSocket?.readyState === WebSocket.OPEN &&
        bridgeSocket.send(
          JSON.stringify({
            type: "ping",
          }),
        );
    }, 2e4));
}
function stopPingInterval() {
  pingInterval && (clearInterval(pingInterval), (pingInterval = null));
}
/** NETWORK: opens the 'bridge' WebSocket (wss://bridge.claudeusercontent.com, or ws://localhost:8765 in local-dev mode,
 * or the staging host) at /chrome/<account uuid>, and sends a 'connect' message with the OAuth token, device id, OS,
 * extension version and display name. Everything after that is a message loop: the claude.ai side sends tool_call /
 * permission / pairing messages, and results go back through sendToBridge(). */
async function connectBridge() {
  return !1; // Claus: never opens a websocket to claude.ai / claudeusercontent.com. Nothing remote can drive this browser.
  if (bridgeSocket?.readyState === WebSocket.OPEN || isConnecting) return !1;
  const e = getPosture();
  if (
    ((isConnecting = !0),
    reconnectTimer && (clearTimeout(reconnectTimer), (reconnectTimer = null)),
    (reconnectAt = null),
    !e || !isBridgeEligible(e))
  )
    return (isConnecting = !1), !1;
  const t = (function () {
      const e = getEnvConfig();
      return e.localBridge
        ? "ws://localhost:8765"
        : "https://api.anthropic.com" === e.apiBaseUrl
          ? "wss://bridge.claudeusercontent.com"
          : "wss://bridge-staging.claudeusercontent.com";
    })(),
    n = getEnvConfig().localBridge;
  let r, i;
  if (n) r = "dev_user_local";
  else {
    if (((i = await getAccessToken()), !i))
      return (isConnecting = !1), scheduleReconnect(), !1;
    const e = forceTokenRefresh;
    if (
      ((forceTokenRefresh = !1),
      (r = await getAccountUuid(i, {
        forceRefresh: e,
      })),
      !r &&
        e &&
        ((forceTokenRefresh = !0),
        (r = await getStorageValue(STORAGE_KEYS.ACCOUNT_UUID).catch(() => {}))),
      !r)
    )
      return (isConnecting = !1), scheduleReconnect(), !1;
  }
  if (isBridgeStale(e, n ? void 0 : r))
    return (isConnecting = !1), reconnectIfPostureChanged(), !1;
  try {
    const o = await loadOrCreateDeviceId();
    deviceId = o;
    const a = await getBridgeDisplayName();
    lastSentDisplayName = a;
    const s = `${t}/chrome/${r}`;
    bridgeSocket && ((bridgeSocket.onclose = null), bridgeSocket.close());
    const c = new WebSocket(s);
    return (
      (bridgeSocket = c),
      (namedBridgeSupported = void 0),
      imported_en(),
      debuggerSessionManager.forgetAttachOrigins(),
      (connectedAccountUuid = n ? void 0 : r),
      (lastPongAt = 0),
      (connectStartedAt = Date.now()),
      (c.onopen = () => {
        if (bridgeSocket !== c) return;
        if (isBridgeStale(e, connectedAccountUuid))
          return disconnectBridge(), void reconnectIfPostureChanged();
        (connectStartedAt = 0), (lastPongAt = Date.now());
        const t = {
          type: "connect",
          client_type: "chrome-extension",
          device_id: o,
          os_platform: getOsPlatform(),
          extension_version: chrome.runtime.getManifest().version,
          ...(a && {
            display_name: a,
          }),
          scoped_peer_disconnect: !0,
        };
        n ? (t.dev_user_id = r) : (t.oauth_token = i),
          c.send(JSON.stringify(t));
      }),
      (c.onmessage = async (e) => {
        if (bridgeSocket === c)
          try {
            await (async function (e) {
              if (imported_in()) return void disconnectBridge();
              EXTERNAL_MESSAGE_TYPES.has(e.type);
              switch (e.type) {
                case "paired":
                  (namedBridgeSupported ??= !0 === e.scoped_peer_disconnect),
                    trackEvent("claude_chrome.bridge.connected", {
                      status: "paired",
                      sw_uptime_ms: Date.now() - serviceWorkerStartedAt,
                      previous_close_code: lastCloseCode ?? null,
                      reconnect_attempt: reconnectAttempt,
                    }),
                    startPingInterval(),
                    (isConnecting = !1),
                    (reconnectAttempt = 0),
                    (consecutive1008Count = 0),
                    (tokenClearStreak = 0),
                    (lastPongAt = Date.now()),
                    flushQueuedExternalResults(),
                    flushQueuedToolResults();
                  break;
                case "waiting":
                  void 0 === namedBridgeSupported &&
                    !0 === e.scoped_peer_disconnect &&
                    (setMcpConnectionState("bridge", !1) ||
                      tabGroupManager.stopTabGroupChangeListener(),
                    rejectPendingPermissions(),
                    clearPermissionRequests("bridge")),
                    (namedBridgeSupported ??= !0 === e.scoped_peer_disconnect),
                    trackEvent("claude_chrome.bridge.connected", {
                      status: "waiting",
                      sw_uptime_ms: Date.now() - serviceWorkerStartedAt,
                      previous_close_code: lastCloseCode ?? null,
                      reconnect_attempt: reconnectAttempt,
                    }),
                    startPingInterval(),
                    (isConnecting = !1),
                    (reconnectAttempt = 0),
                    (consecutive1008Count = 0),
                    (tokenClearStreak = 0),
                    (lastPongAt = Date.now());
                  break;
                case "ping":
                  sendToBridge({
                    type: "pong",
                  });
                  break;
                case "pong":
                  lastPongAt = Date.now();
                  break;
                case "peer_connected":
                  trackEvent("claude_chrome.bridge.peer_connected"),
                    flushQueuedExternalResults(),
                    flushQueuedToolResults(),
                    setMcpConnectionState("bridge", !0),
                    await tabGroupManager.initialize(),
                    tabGroupManager.startTabGroupChangeListener();
                  break;
                case "peer_disconnected": {
                  const t = getConnectionId(e),
                    n = e.mcp_peer_count,
                    r =
                      void 0 !== t && Number.isInteger(n) && Number(n) > 0
                        ? Number(n)
                        : 0;
                  if (
                    (trackEvent("claude_chrome.bridge.peer_disconnected", {
                      named: void 0 !== t,
                      mcp_peer_count:
                        void 0 !== t && Number.isInteger(n) ? n : null,
                    }),
                    void 0 !== t &&
                      ((function (e) {
                        for (const t of inFlightByConnection.get(e) ?? [])
                          t.dead = !0;
                        inFlightByConnection.delete(e);
                      })(t),
                      (function (e) {
                        for (const [t, n] of pendingPermissionRequests)
                          n.origin === e &&
                            (pendingPermissionRequests.delete(t),
                            n.resolve(!1));
                      })(t)),
                    0 !== r ||
                      setMcpConnectionState("bridge", !1) ||
                      tabGroupManager.stopTabGroupChangeListener(),
                    void 0 === t ||
                      0 === r ||
                      queuedToolResults.length > 0 ||
                      queuedExternalResults.length > 0)
                  ) {
                    !(function () {
                      resultEpoch++,
                        (queuedExternalResults.length = 0),
                        (queuedToolResults.length = 0),
                        !0 === namedBridgeSupported &&
                          rejectPendingPermissions();
                      clearPermissionRequests("bridge"),
                        debuggerSessionManager.detachAll("bridge");
                    })();
                    break;
                  }
                  const i = getExternalConfigOrigin();
                  void 0 === i || i === t
                    ? (clearPermissionRequests("bridge"),
                      debuggerSessionManager.detachAll("bridge"))
                    : debuggerSessionManager.detachAll("bridge", t);
                  break;
                }
                case "tool_call": {
                  activeToolCalls++;
                  const t = trackCallContext(e);
                  try {
                    await (async function (e, t) {
                      const n = e.target_device_id;
                      if (n && n !== deviceId) return;
                      const r = e.tool_use_id,
                        i = e.tool,
                        o = e.client_type || "desktop",
                        a = e.args ?? {},
                        s = e.permission_mode,
                        c = e.allowed_domains,
                        d = !0 === e.handle_permission_prompts,
                        u = e.session_scope,
                        l = !0 === e.supports_tool_result_notices,
                        p = !0 === e.supports_tool_result_error_code,
                        h = (e) =>
                          p && e
                            ? {
                                error_code: ERROR_CODE_ALIASES.get(e) ?? e,
                              }
                            : {};
                      if (!r || !i) return;
                      const f = QUIET_TOOLS.has(i);
                      f ||
                        trackEvent("claude_chrome.bridge.tool_received", {
                          tool_name: i,
                          client_type: o,
                          tool_use_id: r,
                        });
                      const m = {
                          tool_name: i,
                          client_type: o,
                          tool_use_id: r,
                        },
                        g = () =>
                          !t.stillWanted() &&
                          (f ||
                            trackEvent(
                              "claude_chrome.bridge.tool_result_dropped",
                              {
                                ...m,
                                reason: t.dropReason(),
                              },
                            ),
                          !0);
                      if (
                        "session_expired" ===
                        (await getStorageValue(
                          STORAGE_KEYS.LAST_AUTH_FAILURE_REASON,
                        ))
                      ) {
                        if (g()) return;
                        return (
                          f ||
                            trackEvent("claude_chrome.bridge.tool_call", {
                              ...m,
                              success: !1,
                              error: "session_expired",
                            }),
                          void sendToolResult({
                            type: "tool_result",
                            tool_use_id: r,
                            error: {
                              content: [
                                {
                                  type: "text",
                                  text: "Authentication failed. The extension may need to be re-authenticated. Open the Claus side panel and sign in again.",
                                },
                              ],
                            },
                            ...h("session_expired"),
                          })
                        );
                      }
                      const w =
                          "browser_batch" === i && Array.isArray(a.actions)
                            ? a.actions.find(
                                (e) =>
                                  "number" == typeof e?.input?.tabId &&
                                  !(
                                    "string" == typeof e?.name &&
                                    TOOLS_WITHOUT_TAB.has(e.name)
                                  ),
                              )?.input?.tabId
                            : void 0,
                        y = TOOLS_WITHOUT_TAB.has(i)
                          ? void 0
                          : "number" == typeof a.tabId
                            ? a.tabId
                            : "number" == typeof w
                              ? w
                              : void 0;
                      if (void 0 !== y)
                        try {
                          await chrome.tabs.get(y);
                        } catch {
                          if (n) {
                            if (g()) return;
                            f ||
                              trackEvent("claude_chrome.bridge.tool_call", {
                                ...m,
                                success: !1,
                                error: "tab_not_found",
                              }),
                              sendToolResult({
                                type: "tool_result",
                                tool_use_id: r,
                                error: {
                                  content: [
                                    {
                                      type: "text",
                                      text: tabNotFoundMessage(y),
                                    },
                                  ],
                                },
                                ...h("tab_not_found"),
                              });
                          }
                          return;
                        }
                      let _;
                      bridgeSocket?.readyState === WebSocket.OPEN &&
                        bridgeSocket.send(
                          JSON.stringify({
                            type: "ping",
                          }),
                        );
                      try {
                        const e = await executeTool({
                          toolName: i,
                          args: a,
                          tabId: y,
                          tabGroupId: u?.tabGroupId ?? a.tabGroupId,
                          clientId: o,
                          source: "bridge",
                          permissionMode: s,
                          allowedDomains: c,
                          toolUseId: r,
                          handlePermissionPrompts: d,
                          requestPermissionFromHost: (e, n) =>
                            t.senderLeft() ||
                            t.accountChanged() ||
                            (t.namedBridge && !t.stillWanted())
                              ? Promise.resolve(!1)
                              : (function (e, t, n, r) {
                                  const i = crypto.randomUUID();
                                  return new Promise((o) => {
                                    pendingPermissionRequests.set(i, {
                                      resolve: o,
                                      origin: r,
                                    }),
                                      sendToBridge({
                                        type: "permission_request",
                                        tool_use_id: e,
                                        request_id: i,
                                        tool_type: t.tool,
                                        url: t.url,
                                        action_data: t.actionData,
                                        ...(n && {
                                          category: n,
                                        }),
                                      });
                                  });
                                })(r, e, n, t.origin),
                          reportPopupToHost: void 0,
                          sessionScope: u,
                          supportsToolResultNotices: l,
                          bridgeConnectionId: t.origin,
                          onErrorCode: (e) => {
                            _ = e;
                          },
                        });
                        if (g()) return;
                        f ||
                          trackEvent("claude_chrome.bridge.tool_call", {
                            ...m,
                            success: !0,
                          }),
                          sendToolResult({
                            ...e,
                            ...h(_),
                            type: "tool_result",
                            tool_use_id: r,
                          });
                      } catch (b) {
                        if (g()) return;
                        f ||
                          trackEvent("claude_chrome.bridge.tool_call", {
                            ...m,
                            success: !1,
                            error: b instanceof Error ? b.message : String(b),
                          }),
                          sendToolResult({
                            type: "tool_result",
                            tool_use_id: r,
                            error: {
                              content: [
                                {
                                  type: "text",
                                  text:
                                    b instanceof Error ? b.message : String(b),
                                },
                              ],
                            },
                            ...h(_ ?? "execution_error"),
                          });
                      }
                    })(e, t);
                  } finally {
                    t.end(),
                      activeToolCalls--,
                      void 0 !== t.origin && t.senderLeft()
                        ? debuggerSessionManager.detachAll("bridge", t.origin)
                        : void 0 !== t.origin &&
                          t.socket !== bridgeSocket &&
                          debuggerSessionManager.forgetAttachOrigins(t.origin);
                  }
                  break;
                }
                case "external_message":
                case "external_config": {
                  const t = trackCallContext(e);
                  try {
                    await (async function (e, t) {
                      if (
                        "session_expired" ===
                        (await getStorageValue(
                          STORAGE_KEYS.LAST_AUTH_FAILURE_REASON,
                        ))
                      )
                        return;
                      if ("external_message" === e.type)
                        return void (await (async function (e, t) {
                          const n = e.target_device_id;
                          if (n && n !== deviceId) return;
                          const r = e.requestId;
                          if (!r) return;
                          if (seenExternalRequestIds.has(r)) return;
                          if (
                            (seenExternalRequestIds.add(r),
                            seenExternalRequestIds.size > MAX_SEEN_REQUEST_IDS)
                          ) {
                            const e = seenExternalRequestIds
                              .values()
                              .next().value;
                            void 0 !== e && seenExternalRequestIds.delete(e);
                          }
                          const i = await relayExternalMessage(
                            {
                              extensionIds: e.extensionIds,
                              payload: e.payload,
                              timeoutMs: e.timeoutMs,
                            },
                            t.stillWanted,
                          );
                          if (!i)
                            return void trackEvent(
                              "claude_chrome.bridge.external_result_dropped",
                              {
                                reason: t.dropReason(),
                              },
                            );
                          !(function (e) {
                            const t = sendToBridge(e);
                            trackEvent(
                              "claude_chrome.bridge.external_result_sent",
                              {
                                socket_state: bridgeSocket?.readyState ?? -1,
                                ok: !0 === e.ok,
                                delivered: t,
                              },
                            ),
                              t ||
                                (queuedExternalResults.push({
                                  message: e,
                                  expiresAt:
                                    Date.now() + EXTERNAL_RESULT_TTL_MS,
                                }),
                                queuedExternalResults.length >
                                  MAX_QUEUED_EXTERNAL_RESULTS &&
                                  queuedExternalResults.shift());
                          })({
                            type: "external_message_result",
                            requestId: r,
                            ...i,
                          });
                        })(e, t));
                      if (e.target_device_id && e.target_device_id !== deviceId)
                        return;
                      if (
                        t.senderLeft() ||
                        t.accountChanged() ||
                        t.socket !== bridgeSocket
                      )
                        return;
                      const n = getExternalConfigOrigin();
                      (await configureExternalExtensions(
                        {
                          extensionIds: e.extensionIds,
                          hooks: e.hooks,
                        },
                        "bridge",
                        t.origin,
                      )) &&
                        void 0 !== n &&
                        n !== t.origin &&
                        !t.senderLeft() &&
                        t.socket === bridgeSocket &&
                        getExternalConfigOrigin() === t.origin &&
                        debuggerSessionManager.detachAll("bridge");
                    })(e, t);
                  } finally {
                    t.end();
                  }
                  break;
                }
                case "pairing_request":
                  await (async function (e) {
                    const t = e.request_id;
                    if (!t) return;
                    if (t === lastPairingRequestId) return;
                    lastPairingRequestId = t;
                    const n = e.client_type || "desktop",
                      r = await getBridgeDisplayName();
                    try {
                      if (
                        (
                          await chrome.runtime.sendMessage({
                            type: "show_pairing_prompt",
                            request_id: t,
                            client_type: n,
                            current_name: r,
                          })
                        )?.handled
                      )
                        return;
                    } catch {}
                    const i = chrome.runtime.getURL(
                      `pairing.html?request_id=${encodeURIComponent(t)}&client_type=${encodeURIComponent(n)}&current_name=${encodeURIComponent(r || "")}`,
                    );
                    chrome.tabs.create({
                      url: i,
                    });
                  })(e);
                  break;
                case "permission_response":
                  !(function (e) {
                    const t = e.request_id;
                    if (!t) return;
                    const n = pendingPermissionRequests.get(t);
                    if (!n) return;
                    const r = getConnectionId(e);
                    if (void 0 !== n.origin && void 0 !== r && r !== n.origin)
                      return;
                    pendingPermissionRequests.delete(t),
                      n.resolve(!0 === e.allowed);
                  })(e);
                  break;
                case "error":
                  isConnecting = !1;
              }
            })(JSON.parse(e.data));
          } catch (t) {}
      }),
      (c.onclose = (e) => {
        if (
          ((lastCloseCode = e.code),
          trackEvent("claude_chrome.bridge.disconnected", {
            code: e.code,
            reason: e.reason,
            reconnect_attempt: reconnectAttempt,
            sw_uptime_ms: Date.now() - serviceWorkerStartedAt,
          }),
          bridgeSocket === c)
        ) {
          if (
            (stopPingInterval(),
            (isConnecting = !1),
            (connectStartedAt = 0),
            (bridgeSocket = null),
            rejectPendingPermissions(),
            1008 === e.code)
          ) {
            if (++consecutive1008Count >= 2) {
              let e;
              forceTokenRefresh
                ? ((e = ++tokenClearStreak >= 2), e && (tokenClearStreak = 0))
                : ((e = !0), (tokenClearStreak = 0)),
                trackEvent("claude_chrome.bridge.access_token_cleared", {
                  reason: "consecutive_1008",
                  reconnect_attempt: reconnectAttempt,
                  cleared: e,
                }),
                e &&
                  clearStoredValue(STORAGE_KEYS.ACCESS_TOKEN).catch(() => {}),
                (forceTokenRefresh = !0),
                (consecutive1008Count = 0);
            }
          } else (consecutive1008Count = 0), (tokenClearStreak = 0);
          scheduleReconnect();
        }
      }),
      (c.onerror = (e) => {
        trackEvent("claude_chrome.bridge.error", {
          error: String(e),
        }),
          bridgeSocket === c && ((isConnecting = !1), (connectStartedAt = 0));
      }),
      !0
    );
  } catch (o) {
    return (isConnecting = !1), (connectStartedAt = 0), scheduleReconnect(), !1;
  }
}
/** The bridge only runs for a signed-in (or local-dev), non-managed, non-hybrid identity. */
function isBridgeEligible(e) {
  return !(
    !e ||
    e.managed ||
    e.identity?.hybrid ||
    (!e.identity && !getEnvConfig().localBridge)
  );
}
function isBridgeStale(e, t) {
  const n = getPosture(),
    r = n?.identity?.accountUuid;
  return (
    !n ||
    !isBridgeEligible(n) ||
    identityChanged(e.identity, n.identity) ||
    (!!t && !!r && r !== t)
  );
}
function reconnectIfPostureChanged() {
  const e = getPosture();
  e &&
    isBridgeEligible(e) &&
    lastReconnectGeneration !== e.gen &&
    ((lastReconnectGeneration = e.gen), connectBridge());
}
function onPostureChangedForBridge(e, t) {
  const n = t.identity?.accountUuid;
  ((e && identityChanged(e.identity, t.identity)) ||
    (n && connectedAccountUuid && n !== connectedAccountUuid)) &&
    (resetBridgeSessions(), disconnectBridge()),
    isBridgeEligible(t) ? connectBridge() : disconnectBridge();
}
function disconnectBridge() {
  reconnectTimer && (clearTimeout(reconnectTimer), (reconnectTimer = null)),
    (reconnectAt = null),
    stopPingInterval(),
    (reconnectAttempt = 0),
    (consecutive1008Count = 0),
    (tokenClearStreak = 0),
    (isConnecting = !1),
    rejectPendingPermissions(),
    bridgeSocket &&
      ((bridgeSocket.onclose = null),
      bridgeSocket.close(),
      (bridgeSocket = null)),
    (connectedAccountUuid = void 0);
}
function resetBridgeSessions() {
  resultEpoch++,
    accountEpoch++,
    clearPermissionRequests(),
    debuggerSessionManager.detachAll(),
    (queuedExternalResults.length = 0),
    (queuedToolResults.length = 0);
}
var namedBridgeSupported,
  resultEpoch = 0,
  accountEpoch = 0;
function getConnectionId(e) {
  const t = e.connection_id;
  return !0 === namedBridgeSupported && "string" == typeof t && t.length > 0
    ? t
    : void 0;
}
var inFlightByConnection = new Map();
function trackCallContext(e) {
  const t = getConnectionId(e),
    n = resultEpoch,
    r = accountEpoch,
    i = {
      dead: !1,
    };
  let o = () => {};
  if (void 0 !== t) {
    const e = inFlightByConnection.get(t) ?? new Set();
    e.add(i),
      inFlightByConnection.set(t, e),
      (o = () => {
        const e = inFlightByConnection.get(t);
        e?.delete(i) && 0 === e.size && inFlightByConnection.delete(t);
      });
  }
  const a = () => r !== accountEpoch;
  return {
    origin: t,
    namedBridge: !0 === namedBridgeSupported,
    socket: bridgeSocket,
    stillWanted: () => !i.dead && n === resultEpoch,
    senderLeft: () => i.dead,
    accountChanged: a,
    dropReason: () =>
      a() ? "account" : i.dead ? "peer_left" : "all_results_dropped",
    end: o,
  };
}
function isBridgeOpen() {
  return bridgeSocket?.readyState === WebSocket.OPEN;
}
function rejectPendingPermissions() {
  for (const [, e] of pendingPermissionRequests) e.resolve(!1);
  pendingPermissionRequests.clear();
}
/** Exponential backoff (2s * 1.5^n, +/-20% jitter, capped at 5 min) before the next connectBridge(). */
function scheduleReconnect() {
  return; // Claus: there is no bridge to reconnect to.
  if (reconnectTimer) return;
  const e =
      void 0 !== lastCloseCode && 1006 !== lastCloseCode && lastCloseCode < 4e3,
    t = 4003 === lastCloseCode;
  let n;
  if ((!navigator.onLine && !getEnvConfig().localBridge && !e) || t) n = 5e3;
  else {
    reconnectAttempt++;
    const e = Math.min(
      2e3 * Math.pow(1.5, reconnectAttempt - 1),
      MAX_RECONNECT_DELAY_MS,
    );
    n = Math.min(
      Math.round(e * (0.8 + 0.4 * Math.random())),
      MAX_RECONNECT_DELAY_MS,
    );
  }
  (reconnectAt = Date.now() + n),
    (reconnectTimer = setTimeout(() => {
      (reconnectTimer = null), (reconnectAt = null), connectBridge();
    }, n));
}
/** Serialises a message onto the bridge WebSocket if it is open. Returns whether it was sent. */
function sendToBridge(e) {
  let t = !1;
  return (
    bridgeSocket?.readyState === WebSocket.OPEN &&
      (EXTERNAL_MESSAGE_TYPES.has(e.type),
      bridgeSocket.send(JSON.stringify(e)),
      (t = !0)),
    "tool_result" === e.type &&
      e.tool_use_id &&
      trackEvent("claude_chrome.bridge.result_sent", {
        tool_use_id: e.tool_use_id,
        socket_state: bridgeSocket?.readyState ?? -1,
        buffered_amount: bridgeSocket?.bufferedAmount ?? -1,
        is_error: Boolean(e.error),
      }),
    t
  );
}
var MAX_QUEUED_EXTERNAL_RESULTS = 8,
  EXTERNAL_RESULT_TTL_MS = 3e5,
  queuedExternalResults = [];
function flushQueuedExternalResults() {
  if (0 === queuedExternalResults.length) return;
  const e = Date.now(),
    t = queuedExternalResults.filter((t) => t.expiresAt > e);
  queuedExternalResults = [];
  for (const n of t) sendToBridge(n.message);
}
var lastPairingRequestId,
  MAX_QUEUED_TOOL_RESULTS = 8,
  TOOL_RESULT_TTL_MS = 12e4,
  queuedToolResults = [];
/** Sends a tool_result; successful results that could not be delivered are queued briefly and replayed on reconnect. */
function sendToolResult(e) {
  const t = sendToBridge(e),
    n = null != e.error || !0 === e.is_error;
  if (!t && !n) {
    const t = String(e.tool_use_id);
    (queuedToolResults = queuedToolResults.filter(
      (e) => e.toolUseId !== t,
    )).push({
      toolUseId: t,
      message: e,
      expiresAt: Date.now() + TOOL_RESULT_TTL_MS,
    }),
      queuedToolResults.length > MAX_QUEUED_TOOL_RESULTS &&
        queuedToolResults.shift();
  }
}
function flushQueuedToolResults() {
  if (0 === queuedToolResults.length) return;
  const e = Date.now(),
    t = queuedToolResults.filter((t) => t.expiresAt > e);
  queuedToolResults = [];
  for (const n of t) sendToolResult(n.message);
}
var listenersRegistered = !1;
var seenExternalRequestIds = new Set(),
  MAX_SEEN_REQUEST_IDS = 256;
var ERROR_CODE_ALIASES = new Map([["tab_outside_group", "tab_not_found"]]);
var PAIRING_PROTOCOL_LABEL = "claude-local-pairing/v1",
  textEncoder = new TextEncoder(),
  textDecoder = new TextDecoder("utf-8", {
    fatal: !0,
  });
function utf8Encode(e) {
  return textEncoder.encode(e);
}
function utf8Decode(e) {
  return textDecoder.decode(e);
}
function concatBytes(...e) {
  return concatByteArrays(e);
}
function concatByteArrays(e) {
  let t = 0;
  for (const i of e) t += i.length;
  const n = new Uint8Array(t);
  let r = 0;
  for (const i of e) n.set(i, r), (r += i.length);
  return n;
}
function lengthPrefixed(e) {
  const t = "string" == typeof e ? utf8Encode(e) : e,
    n = new Uint8Array(4 + t.length);
  return new DataView(n.buffer).setUint32(0, t.length, !1), n.set(t, 4), n;
}
function isNonNegativeSafeInt(e) {
  return "number" == typeof e && Number.isSafeInteger(e) && e >= 0;
}
function u64be(e) {
  if (!isNonNegativeSafeInt(e))
    throw new RangeError("u64be: not a non-negative safe integer");
  const t = new Uint8Array(8);
  return new DataView(t.buffer).setBigUint64(0, BigInt(e), !1), t;
}
var BASE64URL_CHARS = /^[A-Za-z0-9_-]*$/;
function base64urlDecode(e) {
  const t = e.length % 4;
  if (!BASE64URL_CHARS.test(e) || 1 === t)
    throw new SyntaxError("not unpadded base64url");
  if (
    0 !== t &&
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".indexOf(
      e.charAt(e.length - 1),
    ) & (2 === t ? 15 : 3)
  )
    throw new SyntaxError("non-canonical base64url");
  const n =
      e.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((e.length + 3) % 4),
    r = atob(n),
    i = new Uint8Array(r.length);
  for (let o = 0; o < r.length; o++) i[o] = r.charCodeAt(o);
  return i;
}
function base64urlEncode(e) {
  let t = "";
  for (let n = 0; n < e.length; n += 32768)
    t += String.fromCharCode.apply(null, e.subarray(n, n + 32768));
  return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function randomBytes(e) {
  const t = new Uint8Array(e);
  return globalThis.crypto.getRandomValues(t), t;
}
function toArrayBuffer(e) {
  return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
}
async function sha256(e) {
  return new Uint8Array(
    await globalThis.crypto.subtle.digest("SHA-256", toArrayBuffer(e)),
  );
}
/** Error with a stable `code` for the local-pairing protocol (wireCode() is what the peer sees). */
var DualClock = class {
    wall;
    mono;
    constructor(e = {}) {
      (this.wall = e.now ?? (() => Date.now() / 1e3)),
        (this.mono =
          e.monotonicNow ?? (() => globalThis.performance.now() / 1e3));
    }
    stamp() {
      return {
        wall: this.wall(),
        mono: this.mono(),
      };
    }
    since(e) {
      return Math.max(0, this.wall() - e.wall, this.mono() - e.mono);
    }
  },
  PairingError = class extends Error {
    code;
    httpStatus;
    peerOrg;
    constructor(e, t, n = {}) {
      super(t ? `${e}: ${t}` : e, {
        cause: n.cause,
      }),
        (this.name = "PairingError"),
        (this.code = e),
        (this.httpStatus = n.httpStatus),
        (this.peerOrg = n.peerOrg);
    }
    wireCode() {
      return "attest_failed" === this.code && void 0 !== this.httpStatus
        ? `attest_failed:${this.httpStatus}`
        : this.code;
    }
  };
function malformedError(e) {
  return new PairingError("malformed", e);
}
var LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
function pairingEndpoints(e, t = !1) {
  let n;
  try {
    n = new URL(e);
  } catch {
    throw new TypeError(`pairing apiOrigin is not a URL: ${e}`);
  }
  if (
    !(
      "https:" === n.protocol ||
      (t && "http:" === n.protocol && LOOPBACK_HOSTS.has(n.hostname))
    ) ||
    n.username ||
    n.password ||
    ("/" !== n.pathname && "" !== n.pathname) ||
    n.search ||
    n.hash
  )
    throw new TypeError(`pairing apiOrigin must be a bare https origin: ${e}`);
  const r = `${n.origin}/api/oauth/local_pairing`;
  return {
    issuer: r,
    attest: `${r}/attest`,
    jwks: `${r}/jwks.json`,
  };
}
async function jwkThumbprint(e) {
  return base64urlEncode(
    await sha256(
      utf8Encode(
        (function (e) {
          return `{"crv":"P-256","kty":"EC","x":"${base64urlEncode(e.subarray(1, 33))}","y":"${base64urlEncode(e.subarray(33, 65))}"}`;
        })(e),
      ),
    ),
  );
}
async function importP256VerifyKey(e, t) {
  return globalThis.crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      x: e,
      y: t,
      ext: !0,
    },
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    !1,
    ["verify"],
  );
}
function withTimeout(e, t, n) {
  let r;
  const i = new Promise((e, i) => {
    (r = setTimeout(() => i(n()), 1e3 * t)), r.unref?.();
  });
  return Promise.race([e, i]).finally(() => clearTimeout(r));
}
function parseCacheControlSeconds(e, t, n) {
  const r = new RegExp(`(?:^|,)\\s*${t}=(\\d+)`).exec(e ?? "");
  return r ? Number(r[1]) : n;
}
function jwksUnavailableError(e, t) {
  return new PairingError("jwks_unavailable", e, {
    cause: t,
  });
}
/** NETWORK: fetches the public signing keys used to verify pairing assertions from
 * <apiBaseUrl>/api/oauth/local_pairing/jwks.json (GET, no credentials) and caches them per Cache-Control. */
var JwksCache = class {
  opts;
  keys = new Map();
  fetchedAt;
  maxAge = 300;
  staleIfError = 3600;
  flooredAt;
  inflight;
  clock;
  floor;
  timeoutSec;
  url;
  constructor(e) {
    (this.opts = e),
      (this.clock = new DualClock(e)),
      (this.floor = 60),
      (this.timeoutSec = e.timeoutSec ?? 10),
      (this.url = pairingEndpoints(e.apiOrigin, e.allowLoopbackHttp).jwks);
  }
  async getKey(e) {
    let t = this.lookup(e);
    if (
      ((!t || this.age() > this.maxAge) &&
        (this.inflight ||
          this.floored() ||
          (t || (this.flooredAt = this.clock.stamp()),
          (this.inflight = this.fetch().finally(() => {
            this.inflight = void 0;
          }))),
        await this.inflight,
        (t = this.lookup(e))),
      t)
    )
      return t;
    if (0 === this.keys.size)
      throw jwksUnavailableError("no verification keys");
    throw new PairingError("unknown_kid", e.slice(0, 32));
  }
  lookup(e) {
    return this.servable().get(e);
  }
  servable() {
    return (
      this.age() > this.maxAge + this.staleIfError && (this.keys = new Map()),
      this.keys
    );
  }
  age() {
    return this.fetchedAt ? this.clock.since(this.fetchedAt) : 1 / 0;
  }
  floored() {
    return (
      void 0 !== this.flooredAt && this.clock.since(this.flooredAt) < this.floor
    );
  }
  async fetch() {
    try {
      await this.load();
    } catch (e) {
      if (((this.flooredAt = this.clock.stamp()), this.servable().size > 0))
        return;
      throw e instanceof PairingError
        ? e
        : jwksUnavailableError("fetch failed", e);
    }
  }
  async load() {
    const e = await withTimeout(this.get(), this.timeoutSec, () =>
      jwksUnavailableError("timed out"),
    );
    if (200 !== e.status) throw jwksUnavailableError(`HTTP ${e.status}`);
    let t;
    try {
      t = JSON.parse(e.text);
    } catch {
      throw jwksUnavailableError("not JSON");
    }
    const n = t?.keys;
    if (!Array.isArray(n)) throw jwksUnavailableError("no keys array");
    const r = new Map();
    for (const i of n)
      if (
        !(
          "EC" !== i?.kty ||
          "P-256" !== i.crv ||
          "string" != typeof i.kid ||
          "string" != typeof i.x ||
          "string" != typeof i.y ||
          (void 0 !== i.alg && "ES256" !== i.alg) ||
          (void 0 !== i.use && "sig" !== i.use)
        )
      )
        try {
          r.set(i.kid, await importP256VerifyKey(i.x, i.y));
        } catch {}
    if (0 === r.size) throw jwksUnavailableError("no usable EC P-256 keys");
    (this.maxAge = Math.max(
      parseCacheControlSeconds(e.cacheControl, "max-age", 300),
      this.floor,
    )),
      (this.staleIfError = parseCacheControlSeconds(
        e.cacheControl,
        "stale-if-error",
        3600,
      )),
      (this.keys = r),
      (this.fetchedAt = this.clock.stamp());
  }
  async get() {
    const e = await this.opts.fetchImpl(this.url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "cache-control": "no-cache",
        },
      }),
      t = e.status;
    return {
      status: t,
      cacheControl: e.headers.get("cache-control"),
      text: 200 === t ? await e.text() : "",
    };
  }
};
/** Deterministic JSON (sorted keys) - used so both sides of the pairing handshake hash identical bytes. */
function canonicalJson(e) {
  if (null === e || "boolean" == typeof e || "string" == typeof e)
    return JSON.stringify(e);
  if ("number" == typeof e) {
    if (!Number.isFinite(e))
      throw new TypeError("canonicalJson: non-finite number");
    return JSON.stringify(e);
  }
  if (Array.isArray(e))
    return "[" + e.map((e) => canonicalJson(e)).join(",") + "]";
  if ("object" == typeof e) {
    const t = e;
    return (
      "{" +
      Object.keys(t)
        .filter((e) => void 0 !== t[e])
        .sort()
        .map((e) => JSON.stringify(e) + ":" + canonicalJson(t[e]))
        .join(",") +
      "}"
    );
  }
  throw new TypeError("canonicalJson: unsupported " + typeof e);
}
/** JSON parser that rejects duplicate keys and trailing data. */
function parseStrictJson(e) {
  let t = 0;
  const n = (e) => {
      throw new SyntaxError(`strict JSON: ${e} at ${t}`);
    },
    r = () => {
      for (; t < e.length && " \t\n\r".includes(e.charAt(t)); ) t++;
    },
    i = () => {
      const r = t;
      for (
        '"' !== e[t] && n("expected string"), t++;
        t < e.length && '"' !== e[t];

      )
        "\\" === e[t] && t++, t++;
      return (
        t >= e.length && n("unterminated string"),
        t++,
        JSON.parse(e.slice(r, t))
      );
    },
    o = () => {
      r();
      const a = e[t];
      if ("{" === a) {
        t++;
        const a = {},
          s = new Set();
        if ((r(), "}" === e[t])) return t++, a;
        for (;;) {
          r();
          const c = i();
          if (
            (s.has(c) && n(`duplicate key ${JSON.stringify(c)}`),
            s.add(c),
            r(),
            ":" !== e[t] && n("expected ':'"),
            t++,
            Object.defineProperty(a, c, {
              value: o(),
              enumerable: !0,
              writable: !0,
              configurable: !0,
            }),
            r(),
            "," !== e[t])
          ) {
            if ("}" === e[t]) return t++, a;
            n("expected ',' or '}'");
          } else t++;
        }
      }
      if ("[" === a) {
        t++;
        const i = [];
        if ((r(), "]" === e[t])) return t++, i;
        for (;;)
          if ((i.push(o()), r(), "," !== e[t])) {
            if ("]" === e[t]) return t++, i;
            n("expected ',' or ']'");
          } else t++;
      }
      if ('"' === a) return i();
      const s =
        /^(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/.exec(
          e.slice(t),
        );
      return s || n("unexpected token"), (t += s[0].length), JSON.parse(s[0]);
    },
    a = o();
  return r(), t !== e.length && n("trailing data"), a;
}
function parseCompactJws(e) {
  if ("string" != typeof e || 0 === e.length || e.length > 4096)
    throw malformedError("assertion missing or too long");
  const t = e.split("."),
    [n, r, i] = t;
  if (3 !== t.length || void 0 === n || void 0 === r || void 0 === i)
    throw malformedError("assertion is not a compact JWS");
  let o, a, s;
  try {
    (o = parseStrictJson(utf8Decode(base64urlDecode(n)))),
      (a = parseStrictJson(utf8Decode(base64urlDecode(r)))),
      (s = base64urlDecode(i));
  } catch (d) {
    throw malformedError(`assertion does not decode: ${String(d)}`);
  }
  if (
    null === o ||
    "object" != typeof o ||
    Array.isArray(o) ||
    null === a ||
    "object" != typeof a ||
    Array.isArray(a)
  )
    throw malformedError("assertion header/payload are not objects");
  const c = o;
  if ("ES256" !== c.alg)
    throw new PairingError(
      "bad_signature",
      `alg ${JSON.stringify(c.alg)} is not ES256`,
    );
  if ("crit" in c) throw malformedError("crit header is not accepted");
  if ("local-pairing+jwt" !== c.typ)
    throw new PairingError(
      "wrong_issuer_or_audience",
      `typ ${JSON.stringify(c.typ)}`,
    );
  if ("string" != typeof c.kid || 0 === c.kid.length || c.kid.length > 256)
    throw malformedError("kid missing or too long");
  if (64 !== s.length)
    throw new PairingError(
      "bad_signature",
      "ES256 signature must be exactly 64 bytes",
    );
  return {
    header: {
      kid: c.kid,
    },
    payload: a,
    signingInput: utf8Encode(`${n}.${r}`),
    signature: s,
  };
}
var PEER_KINDS = ["desktop", "chrome_extension"];
function requireStringClaim(e, t) {
  const n = e[t];
  if ("string" != typeof n || 0 === n.length)
    throw malformedError(`claim ${t} missing`);
  return n;
}
function requireNumberClaim(e, t) {
  const n = e[t];
  if ("number" != typeof n || !Number.isFinite(n))
    throw malformedError(`claim ${t} missing`);
  return n;
}
function parseAssertionClaims(e) {
  const t = requireStringClaim(e, "client_kind");
  if (((n = t), !PEER_KINDS.includes(n)))
    throw new PairingError("wrong_peer_kind", t);
  var n;
  const r = e.cnf;
  if (
    !r ||
    "object" != typeof r ||
    Array.isArray(r) ||
    "string" != typeof r.jkt
  )
    throw malformedError("cnf.jkt missing");
  return {
    iss: requireStringClaim(e, "iss"),
    sub: requireStringClaim(e, "sub"),
    org: requireStringClaim(e, "org"),
    azp: "string" == typeof e.azp ? e.azp : void 0,
    client_kind: t,
    hybrid: !0 === e.hybrid,
    cnf: {
      jkt: r.jkt,
    },
    iat: requireNumberClaim(e, "iat"),
    exp: requireNumberClaim(e, "exp"),
    jti: "string" == typeof e.jti ? e.jti : void 0,
  };
}
/** Checks the peer's ES256-signed JWT: signature against JWKS, issuer/audience, lifetime, peer kind, and that the key matches the `cnf.jkt` thumbprint. */
async function verifyPeerAssertion(e, t, n) {
  const r = parseCompactJws(e),
    i = (function (e) {
      if ("string" != typeof e || 87 !== e.length)
        throw malformedError("public_key must be 87 base64url chars");
      let t;
      try {
        t = base64urlDecode(e);
      } catch {
        throw malformedError("public_key is not base64url");
      }
      if (65 !== t.length || 4 !== t[0])
        throw malformedError("public_key must be an uncompressed P-256 point");
      return t;
    })(t),
    o = await n.jwks.getKey(r.header.kid);
  await (async function (e, t) {
    if (
      !(await globalThis.crypto.subtle.verify(
        {
          name: "ECDSA",
          hash: "SHA-256",
        },
        t,
        toArrayBuffer(e.signature),
        toArrayBuffer(e.signingInput),
      ))
    )
      throw new PairingError("bad_signature");
  })(r, o);
  const a = parseAssertionClaims(r.payload),
    s = r.payload.aud,
    c =
      "claude-local-pairing/v1" === s ||
      (Array.isArray(s) && s.includes("claude-local-pairing/v1"));
  if (a.iss !== n.expectedIssuer || !c)
    throw new PairingError("wrong_issuer_or_audience");
  if (a.exp - a.iat > 301)
    throw new PairingError("expired", "assertion lifetime exceeds 301 s");
  if (a.client_kind !== n.expectedKind)
    throw new PairingError("wrong_peer_kind", a.client_kind);
  if ((await jwkThumbprint(i)) !== a.cnf.jkt)
    throw new PairingError("key_binding_mismatch");
  return {
    claims: a,
    peerRaw: i,
  };
}
/** NETWORK: POSTs the extension's ephemeral public key to <apiBaseUrl>/api/oauth/local_pairing/attest with the user's
 * OAuth bearer token and receives a signed 'assertion' proving which account/org this extension belongs to. */
var OwnAssertionSource = class {
  opts;
  current;
  minting;
  lastFailure;
  epoch = 0;
  clock;
  timeoutSec;
  urls;
  constructor(e) {
    (this.opts = e),
      (this.clock = new DualClock(e)),
      (this.timeoutSec = e.timeoutSec ?? 10),
      (this.urls = pairingEndpoints(e.apiOrigin, e.allowLoopbackHttp));
  }
  get issuer() {
    return this.urls.issuer;
  }
  serverNow(e) {
    return e.claims.iat + this.clock.since(e.minted);
  }
  async get() {
    const e = this.current;
    if (e && e.claims.exp - 30 > this.serverNow(e)) return e;
    const t = this.lastFailure;
    if (t && this.clock.since(t.at) < t.floor) throw t.error;
    const n = (this.minting ??= this.mint().finally(() => {
      this.minting === n && (this.minting = void 0);
    }));
    return n;
  }
  isCurrent(e) {
    return e.epoch === this.epoch;
  }
  clear() {
    (this.epoch += 1),
      (this.current = void 0),
      (this.minting = void 0),
      (this.lastFailure = void 0);
  }
  async mint() {
    const e = this.epoch;
    try {
      const t = await withTimeout(
        this.attest(e),
        this.timeoutSec,
        () =>
          new PairingError("attest_failed", "timed out", {
            httpStatus: 0,
          }),
      );
      if (e !== this.epoch)
        throw new PairingError(
          "not_signed_in",
          "identity changed during attest",
        );
      return (this.current = t), (this.lastFailure = void 0), t;
    } catch (t) {
      const n =
        t instanceof PairingError
          ? t
          : new PairingError("attest_failed", "unexpected", {
              cause: t,
            });
      if (e === this.epoch && "not_signed_in" !== n.code) {
        const e = "rate_limited" === n.code || "pairing_disabled" === n.code;
        this.lastFailure = {
          error: n,
          at: this.clock.stamp(),
          floor: e ? 60 : 5,
        };
      }
      throw n;
    }
  }
  async attest(e) {
    let t;
    try {
      t = await this.opts.getBearer();
    } catch (c) {
      throw new PairingError("not_signed_in", "bearer unavailable", {
        cause: c,
      });
    }
    if (!t) throw new PairingError("not_signed_in");
    const n = await (async function () {
        const e = await globalThis.crypto.subtle.generateKey(
            {
              name: "ECDH",
              namedCurve: "P-256",
            },
            !1,
            ["deriveBits"],
          ),
          t = new Uint8Array(
            await globalThis.crypto.subtle.exportKey("raw", e.publicKey),
          );
        return {
          keyPair: e,
          publicKey: base64urlEncode(t),
          jkt: await jwkThumbprint(t),
        };
      })(),
      r = this.clock.stamp();
    let i, o;
    try {
      i = await this.opts.fetchImpl(this.urls.attest, {
        method: "POST",
        headers: {
          authorization: `Bearer ${t}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          public_key: n.publicKey,
        }),
      });
    } catch (c) {
      throw new PairingError("attest_failed", "fetch failed", {
        httpStatus: 0,
        cause: c,
      });
    }
    if (404 === i.status)
      throw new PairingError("pairing_disabled", "attest is not enabled", {
        httpStatus: 404,
      });
    if (429 === i.status)
      throw new PairingError("rate_limited", void 0, {
        httpStatus: 429,
      });
    if (200 !== i.status)
      throw new PairingError("attest_failed", `HTTP ${i.status}`, {
        httpStatus: i.status,
      });
    try {
      o = JSON.parse(await i.text());
    } catch {
      throw new PairingError("attest_failed", "response is not JSON", {
        httpStatus: 200,
      });
    }
    const a = o?.assertion;
    if ("string" != typeof a)
      throw new PairingError("attest_failed", "response lacks assertion", {
        httpStatus: 200,
      });
    const s = parseAssertionClaims(parseCompactJws(a).payload);
    if (s.cnf.jkt !== n.jkt)
      throw new PairingError(
        "key_binding_mismatch",
        "server bound a different key",
      );
    return {
      assertion: a,
      claims: s,
      eph: n,
      minted: r,
      epoch: e,
    };
  }
};
async function hkdfDeriveBits(e, t, n, r) {
  return new Uint8Array(
    await globalThis.crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: toArrayBuffer(t),
        info: toArrayBuffer(utf8Encode(`${PAIRING_PROTOCOL_LABEL} ${n}`)),
      },
      e,
      8 * r,
    ),
  );
}
async function hmacSha256(e, t) {
  const n = await globalThis.crypto.subtle.importKey(
    "raw",
    toArrayBuffer(e),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    !1,
    ["sign"],
  );
  return new Uint8Array(
    await globalThis.crypto.subtle.sign("HMAC", n, toArrayBuffer(t)),
  );
}
var MAX_REASSEMBLY_BYTES = 33554432,
  SURROGATE_PATTERN = /\p{Surrogate}/u,
  SEALED_FRAME_KINDS = new Set([
    "execute_tool",
    "tool_response",
    "notification:permission_request",
    "notification:sealed_broadcast",
    "notification:inference_request",
    "notification:inference_response",
  ]);
function isSealedFrameKind(e) {
  return "string" == typeof e && SEALED_FRAME_KINDS.has(e);
}
function isValidToolUseId(e) {
  return (
    void 0 === e ||
    ("string" == typeof e && "" !== e && !SURROGATE_PATTERN.test(e))
  );
}
function buildAeadParams(e, t, n, r, i, o, a) {
  const s = u64be(n);
  return {
    name: "AES-GCM",
    iv: toArrayBuffer(concatBytes(new Uint8Array(4), s)),
    additionalData: toArrayBuffer(
      concatBytes(
        lengthPrefixed(PAIRING_PROTOCOL_LABEL),
        lengthPrefixed(e),
        lengthPrefixed(t),
        s,
        lengthPrefixed(r),
        lengthPrefixed(i ?? ""),
        u64be(o),
        ...(a ? [lengthPrefixed("chunk"), u64be(a.i), u64be(a.n)] : []),
      ),
    ),
    tagLength: 128,
  };
}
function wholeSeconds(e) {
  try {
    const t = Math.floor(e());
    return isNonNegativeSafeInt(t) ? t : NaN;
  } catch {
    return NaN;
  }
}
async function importAesKey(e, t) {
  return globalThis.crypto.subtle.importKey(
    "raw",
    toArrayBuffer(e),
    {
      name: "AES-GCM",
    },
    !1,
    [t],
  );
}
var noop = () => {};
function parseSealedPayload(e) {
  try {
    return {
      ok: !0,
      inner: JSON.parse(utf8Decode(e)),
    };
  } catch {
    return {
      ok: !1,
      reason: "malformed",
    };
  }
}
/** AES-256-GCM channel (keys derived with HKDF from the ECDH secret) with counters, replay/stale protection and chunking. Used to talk to Claude Desktop over native messaging. */
var SealedChannel = class e {
    sid;
    dirOut;
    kOut;
    kIn;
    clock;
    sidB64;
    ctrOut = 0;
    ctrIn = -1;
    tagFailures = 0;
    tornDown = !1;
    q = {
      send: Promise.resolve(),
      recv: Promise.resolve(),
    };
    partial;
    stats = {
      gaps: 0,
      replays: 0,
      stale: 0,
      badTags: 0,
    };
    born;
    constructor(e, t, n, r, i) {
      (this.sid = e),
        (this.dirOut = t),
        (this.kOut = n),
        (this.kIn = r),
        (this.clock = i),
        (this.sidB64 = base64urlEncode(e)),
        (this.born = i.stamp());
    }
    static async create(t, n, r = {}) {
      const [i, o, a] =
        "desktop" === t ? [n.kD2e, n.kE2d, "d2e"] : [n.kE2d, n.kD2e, "e2d"];
      return new e(
        n.sid,
        a,
        await importAesKey(i, "encrypt"),
        await importAesKey(o, "decrypt"),
        r.clock ?? new DualClock(),
      );
    }
    ownSeconds() {
      return wholeSeconds(() => this.born.wall + this.clock.since(this.born));
    }
    get dirIn() {
      return "d2e" === this.dirOut ? "e2d" : "d2e";
    }
    get isTornDown() {
      return this.tornDown;
    }
    enqueue(e, t) {
      const n = this.q[e].then(t, t);
      return (this.q[e] = n.then(noop, noop)), n;
    }
    seal(e, t, n) {
      return this.sealFrames(e, t, n, void 0).then(([e]) => {
        if (void 0 === e) throw new Error("seal: no envelope produced");
        return e;
      });
    }
    sealChunked(e, t, n, r) {
      return !Number.isSafeInteger(r) || r < 1
        ? Promise.reject(
            new RangeError(
              "sealChunked: maxChunkBytes must be a positive integer",
            ),
          )
        : this.sealFrames(e, t, n, r);
    }
    sealFrames(e, t, n, r) {
      if (this.tornDown)
        return Promise.reject(new Error("sealed channel torn down"));
      if (!isSealedFrameKind(e))
        return Promise.reject(new TypeError("seal: unknown frame kind"));
      if (!isValidToolUseId(t))
        return Promise.reject(
          new TypeError(
            "seal: toolUseId must be a non-empty well-formed string",
          ),
        );
      let i;
      try {
        const e = JSON.stringify(n);
        if ("string" != typeof e) throw new TypeError("not JSON-serialisable");
        i = utf8Encode(e);
      } catch (u) {
        return Promise.reject(
          new TypeError("seal: inner is not JSON-serialisable", {
            cause: u,
          }),
        );
      }
      const o = void 0 !== r,
        a = r ?? i.length,
        s = Math.ceil(i.length / a),
        c = wholeSeconds(this.clock.wall);
      if (!isNonNegativeSafeInt(c))
        return Promise.reject(new Error("seal: clock is not a usable time"));
      const d = this.ctrOut;
      return (
        (this.ctrOut = d + s),
        Number.isSafeInteger(this.ctrOut)
          ? this.enqueue("send", async () => {
              const n = [];
              for (let r = 0; r < s; r++) {
                const u = o
                    ? {
                        i: r,
                        n: s,
                      }
                    : void 0,
                  l = new Uint8Array(
                    await globalThis.crypto.subtle.encrypt(
                      buildAeadParams(this.dirOut, this.sid, d + r, e, t, c, u),
                      this.kOut,
                      toArrayBuffer(i.subarray(r * a, (r + 1) * a)),
                    ),
                  );
                if (this.tornDown) throw new Error("sealed channel torn down");
                n.push({
                  sid: this.sidB64,
                  ctr: d + r,
                  t: c,
                  ct: base64urlEncode(l),
                  ...(u && {
                    chunk: u,
                  }),
                });
              }
              return n;
            })
          : ((this.tornDown = !0),
            Promise.reject(new Error("sealed channel counter exhausted")))
      );
    }
    open(e, t, n) {
      return this.enqueue("recv", () => this.openNow(e, t, n));
    }
    async openNow(e, t, n) {
      if (this.tornDown)
        return {
          ok: !1,
          reason: "torn_down",
        };
      const r = n;
      if (
        !(
          r &&
          "object" == typeof r &&
          "string" == typeof r.sid &&
          "string" == typeof r.ct &&
          isNonNegativeSafeInt(r.t) &&
          isSealedFrameKind(e) &&
          isValidToolUseId(t) &&
          (function (e) {
            if (void 0 === e) return !0;
            const t = e;
            return (
              !!t &&
              "object" == typeof t &&
              isNonNegativeSafeInt(t.n) &&
              t.n >= 1 &&
              isNonNegativeSafeInt(t.i) &&
              t.i < t.n
            );
          })(r.chunk)
        )
      )
        return {
          ok: !1,
          reason: "malformed",
        };
      const i = r.t,
        o = r.chunk;
      if (r.sid !== this.sidB64)
        return {
          ok: !1,
          reason: "foreign_sid",
        };
      const a = r.ctr;
      if (!isNonNegativeSafeInt(a))
        return {
          ok: !1,
          reason: "malformed",
        };
      if (a <= this.ctrIn)
        return (
          (this.stats.replays += 1),
          {
            ok: !1,
            reason: "replay",
          }
        );
      if (!(Math.abs(this.ownSeconds() - i) <= 60))
        return (
          (this.stats.stale += 1),
          {
            ok: !1,
            reason: "stale",
          }
        );
      let s, c;
      try {
        s = base64urlDecode(r.ct);
      } catch {
        return {
          ok: !1,
          reason: "malformed",
        };
      }
      if (s.length < 16)
        return {
          ok: !1,
          reason: "malformed",
        };
      try {
        c = await globalThis.crypto.subtle.decrypt(
          buildAeadParams(this.dirIn, this.sid, a, e, t, i, o),
          this.kIn,
          toArrayBuffer(s),
        );
      } catch {
        return (
          (this.stats.badTags += 1),
          ++this.tagFailures >= 3 && this.tearDown(),
          {
            ok: !1,
            reason: "bad_tag",
          }
        );
      }
      if (this.tornDown)
        return {
          ok: !1,
          reason: "torn_down",
        };
      a > this.ctrIn + 1 && (this.stats.gaps += a - this.ctrIn - 1),
        (this.ctrIn = a);
      const d = new Uint8Array(c);
      return o
        ? this.reassemble(a, o, d)
        : ((this.partial = void 0), parseSealedPayload(d));
    }
    reassemble(e, t, n) {
      let r = this.partial;
      if (((this.partial = void 0), 0 === t.i))
        r = {
          firstCtr: e,
          n: t.n,
          parts: [],
          bytes: 0,
        };
      else if (!r || e !== r.firstCtr + r.parts.length)
        return {
          ok: !1,
          reason: "bad_chunk",
        };
      return r.bytes + n.length > 33554432
        ? {
            ok: !1,
            reason: "bad_chunk",
          }
        : (r.parts.push(n),
          (r.bytes += n.length),
          r.parts.length < r.n
            ? ((this.partial = r),
              {
                ok: !1,
                reason: "partial",
              })
            : parseSealedPayload(concatByteArrays(r.parts)));
    }
    tearDown() {
      (this.tornDown = !0), (this.partial = void 0);
    }
  },
  INSTANCE_FIELD_BY_MESSAGE = {
    offer: "instance_hint",
    accept: "instance",
  };
function equalsIgnoreCase(e, t) {
  return e.toLowerCase() === t.toLowerCase();
}
function checkOrgPolicy(e, t, n) {
  if (t.sub !== e.sub) throw new PairingError("account_mismatch");
  if (void 0 !== n.requiredOrg && !equalsIgnoreCase(e.org, n.requiredOrg))
    throw new PairingError(
      "org_not_permitted",
      "own sign-in is not in the configured org",
    );
  const r = t.hybrid && "desktop" === t.client_kind,
    i = !n.allowedOrgs || n.allowedOrgs.some((e) => equalsIgnoreCase(e, t.org));
  if (r && !i)
    throw new PairingError(
      "org_not_permitted",
      "the managing Desktop's org is outside the configured list",
    );
  if (
    (void 0 !== n.requiredOrg || r || n.hybridSignIn) &&
    !equalsIgnoreCase(t.org, e.org)
  )
    throw new PairingError(
      "org_mismatch",
      void 0,
      i
        ? {
            peerOrg: t.org,
          }
        : {},
    );
}
function decodeBase64urlField(e, t, n) {
  if ("string" != typeof e) throw malformedError(`${t} missing`);
  let r;
  try {
    r = base64urlDecode(e);
  } catch {
    throw malformedError(`${t} not base64url`);
  }
  if (void 0 !== n && r.length !== n)
    throw malformedError(`${t} must be ${n} bytes`);
  return r;
}
function requireHandshakeMessage(e, t) {
  const n = e;
  if (!n || "object" != typeof n || n.msg !== t)
    throw malformedError(`pair_${t} malformed`);
  if (1 !== n.v) {
    throw malformedError(
      `unsupported v ${"number" == typeof n.v ? String(n.v) : typeof n.v}`,
    );
  }
  return n;
}
function smallObjectOrUndefined(e, t) {
  if (void 0 !== e) {
    if (
      !e ||
      "object" != typeof e ||
      Array.isArray(e) ||
      canonicalJson(e).length > 1024
    )
      throw malformedError(`${t} must be a small object`);
    return e;
  }
}
async function establishPairing(e, t, n, r) {
  const i = await SealedChannel.create(e, r.secrets, {
    clock: n,
  });
  return (
    (function (e, t) {
      if (!e.isCurrent(t))
        throw new PairingError(
          "not_signed_in",
          "identity changed during the handshake",
        );
    })(t, r.own),
    {
      sidB64: i.sidB64,
      channel: i,
      own: r.own.claims,
      peer: r.peer,
      peerInstance: r.peerInstance,
      establishedAt: n.wall(),
    }
  );
}
/** Handles the two-step 'offer' / 'finish' handshake that pairs this extension with a locally installed Claude Desktop (ECDH P-256 + key confirmation). */
var PairingResponder = class {
  opts;
  pending = new Map();
  clock;
  maxPending;
  instance;
  constructor(e) {
    (this.opts = e),
      (this.clock = new DualClock(e)),
      (this.maxPending = e.maxPending ?? 4),
      (this.instance = (function (e, t) {
        if (void 0 !== e)
          try {
            return smallObjectOrUndefined(JSON.parse(JSON.stringify(e)), t);
          } catch (n) {
            throw new TypeError(`${t} must be a small JSON object`, {
              cause: n,
            });
          }
      })(e.instance, "instance"));
  }
  get pendingCount() {
    return this.expire(), this.pending.size;
  }
  async onOffer(e) {
    const { hello: t, instance: n } = (function (e, t) {
        const n = INSTANCE_FIELD_BY_MESSAGE[t],
          r = requireHandshakeMessage(e, t);
        try {
          canonicalJson(r);
        } catch {
          throw malformedError(`pair_${t} is not canonical JSON`);
        }
        return (
          decodeBase64urlField(r.nonce, "nonce", 32),
          {
            hello: r,
            instance: smallObjectOrUndefined(r[n], n),
          }
        );
      })(e, "offer"),
      { source: r, jwks: i, policy: o } = this.opts,
      { claims: a, peerRaw: s } = await verifyPeerAssertion(
        t.assertion,
        t.public_key,
        {
          jwks: i,
          expectedIssuer: r.issuer,
          expectedKind: "desktop",
        },
      ),
      c = await r.get();
    !(function (e, t) {
      if (e.iat > t + 60) throw new PairingError("not_yet_valid");
      if (e.exp + 60 <= t) throw new PairingError("expired");
    })(a, r.serverNow(c)),
      checkOrgPolicy(c.claims, a, o);
    const d = await (async function (e) {
        try {
          return await globalThis.crypto.subtle.importKey(
            "raw",
            toArrayBuffer(e),
            {
              name: "ECDH",
              namedCurve: "P-256",
            },
            !1,
            [],
          );
        } catch {
          throw malformedError("public_key is not a point on P-256");
        }
      })(s),
      u = await (async function (e, t) {
        return new Uint8Array(
          await globalThis.crypto.subtle.deriveBits(
            {
              name: "ECDH",
              public: t,
            },
            e,
            256,
          ),
        );
      })(c.eph.keyPair.privateKey, d),
      l = (function (e, t, n) {
        const r = {
          msg: e,
          v: 1,
          assertion: t.assertion,
          public_key: t.eph.publicKey,
          nonce: base64urlEncode(randomBytes(32)),
        };
        return n && (r[INSTANCE_FIELD_BY_MESSAGE[e]] = n), r;
      })("accept", c, this.instance),
      p = await (async function (e, t) {
        const { mac: n, ...r } = t;
        return sha256(
          concatBytes(
            lengthPrefixed(PAIRING_PROTOCOL_LABEL),
            lengthPrefixed(utf8Encode(canonicalJson(e))),
            lengthPrefixed(utf8Encode(canonicalJson(r))),
          ),
        );
      })(t, l),
      h = await (async function (e, t) {
        const n = await globalThis.crypto.subtle.importKey(
            "raw",
            toArrayBuffer(e),
            "HKDF",
            !1,
            ["deriveBits"],
          ),
          [r, i, o, a, s] = await Promise.all([
            hkdfDeriveBits(n, t, "confirm d", 32),
            hkdfDeriveBits(n, t, "confirm e", 32),
            hkdfDeriveBits(n, t, "aead d2e", 32),
            hkdfDeriveBits(n, t, "aead e2d", 32),
            hkdfDeriveBits(n, t, "sid", 16),
          ]);
        return {
          th: t,
          kcD: r,
          kcE: i,
          kD2e: o,
          kE2d: a,
          sid: s,
        };
      })(u, p),
      f = await ((m = h), hmacSha256(m.kcE, m.th));
    var m;
    this.expire();
    for (const g of this.pending.keys()) {
      if (this.pending.size < this.maxPending) break;
      this.pending.delete(g);
    }
    return (
      this.pending.set(base64urlEncode(h.sid), {
        secrets: h,
        own: c,
        peer: a,
        peerInstance: n,
        createdAt: this.clock.stamp(),
      }),
      {
        ...l,
        mac: base64urlEncode(f),
      }
    );
  }
  async onFinish(e) {
    const t = (function (e, t) {
      const n = requireHandshakeMessage(e, t);
      if ("string" != typeof n.sid)
        throw malformedError(`pair_${t} sid missing`);
      return {
        sid: n.sid,
        mac: decodeBase64urlField(n.mac, `pair_${t} mac`),
      };
    })(e, "finish");
    this.expire();
    const n = this.pending.get(t.sid);
    if (!n)
      throw new PairingError(
        "bad_key_confirmation",
        "no pending pairing for sid on this port",
      );
    var r;
    this.pending.delete(t.sid),
      (function (e, t, n) {
        if (
          !(function (e, t) {
            if (e.length !== t.length) return !1;
            let n = 0;
            for (let r = 0; r < e.length; r++) n |= (e[r] ?? 0) ^ (t[r] ?? 0);
            return 0 === n;
          })(e, t)
        )
          throw new PairingError("bad_key_confirmation", n);
      })(t.mac, await ((r = n.secrets), hmacSha256(r.kcD, r.th)));
    const i = await (function (e) {
        return hmacSha256(e.kcE, concatBytes(e.th, utf8Encode("done")));
      })(n.secrets),
      o = await establishPairing(
        "chrome_extension",
        this.opts.source,
        this.clock,
        n,
      );
    return {
      done: {
        msg: "done",
        v: 1,
        sid: t.sid,
        mac: base64urlEncode(i),
      },
      pairing: o,
    };
  }
  expire() {
    for (const [e, t] of this.pending)
      this.clock.since(t.createdAt) > 30 && this.pending.delete(e);
  }
};
var pairingRuntimeCache = new WeakMap();
/** fetch() wrapper for pairing calls: no cookies, no redirects, no referrer, no cache. */
var pairingRuntime,
  pairingFetch = async (e, t) => {
    const n = await fetch(e, {
      method: t?.method ?? "GET",
      headers: t?.headers,
      body: t?.body,
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
      cache: "no-store",
    });
    return {
      status: n.status,
      headers: n.headers,
      text: () => n.text(),
    };
  };
function policyFromPosture(e) {
  return {
    ...(e.allowedOrgs && {
      allowedOrgs: e.allowedOrgs,
    }),
    ...(e.identity?.hybrid && {
      hybridSignIn: !0,
    }),
  };
}
async function getPairingRuntime() {
  let e = getPosture() ?? (await loadPosture());
  if (!e.identity) {
    let t;
    if (
      (await Promise.race([
        checkAndRefreshOAuth().catch(() => {}),
        new Promise((e) => {
          t = setTimeout(e, 1e4);
        }),
      ]).finally(() => clearTimeout(t)),
      await postureStore.reloadIdentity().catch(() => {}),
      (e = getPosture() ?? e),
      !e.identity)
    )
      throw new PairingError("not_signed_in");
  }
  const t = policyFromPosture(e);
  return (
    (pairingRuntime ??= (function (e) {
      let t = pairingRuntimeCache.get(e);
      return (
        t ||
          ((t = {
            source: new OwnAssertionSource(e),
            jwks: new JwksCache(e),
          }),
          pairingRuntimeCache.set(e, t)),
        t
      );
    })({
      apiOrigin: getEnvConfig().apiBaseUrl,
      fetchImpl: pairingFetch,
      getBearer: getAccessToken,
    })),
    {
      runtime: pairingRuntime,
      policy: t,
    }
  );
}
function clearOwnAssertion() {
  pairingRuntime?.source.clear();
}
function toolResponse(e, t) {
  return {
    type: "tool_response",
    ...(e && {
      tool_use_id: e,
    }),
    ...t,
  };
}
function jsonRpcNotification(e, t) {
  return {
    type: "notification",
    jsonrpc: "2.0",
    method: e,
    params: t ?? {},
  };
}
function refusalResponse(e, t) {
  const n = (function (e) {
    return {
      msg: "refuse",
      v: 1,
      code: e instanceof PairingError ? e.wireCode() : "malformed",
    };
  })(t);
  return toolResponse(e, {
    error: {
      local_pairing: n,
    },
  });
}
function clearOrgMismatchFlag() {
  removeStorageKeys(STORAGE_KEYS.PAIRING_ORG_MISMATCH).catch(() => {});
}
var onPairingClosed,
  pairingClock = new DualClock(),
  pairingState = createPairingState(),
  pendingInferenceRequests = new Map();
function resolveInferenceRequest(e, t) {
  const n = pendingInferenceRequests.get(e);
  n &&
    (pendingInferenceRequests.delete(e), clearTimeout(n.timer), n.resolve(t));
}
function createPairingState() {
  return {
    responder: void 0,
    policy: void 0,
    install: void 0,
    closedClients: new Set(),
    pairings: new Map(),
    offerTimes: [],
    instanceId: base64urlEncode(randomBytes(8)),
  };
}
function resetPairingState() {
  for (const e of [...pairingState.pairings.keys()]) closePairing(e);
  pairingState = createPairingState();
}
function isHybridPairing(e) {
  return e.peer.hybrid;
}
function sameOrg(e, t) {
  return e.peer.org.toLowerCase() === t.peer.org.toLowerCase();
}
function findHybridPairing() {
  for (const { pairing: e } of pairingState.pairings.values())
    if (isHybridPairing(e)) return e;
}
function summarizePairedPeer() {
  const e =
    findHybridPairing() ?? [...pairingState.pairings.values()].at(-1)?.pairing;
  return e
    ? (function (e) {
        const { sub: t, org: n, hybrid: r } = e.peer;
        return {
          sub: t,
          org: n,
          hybrid: r,
        };
      })(e)
    : null;
}
var suppressPostureMirror = !1;
function mirrorPairedPeerToPosture() {
  return suppressPostureMirror
    ? Promise.resolve(getPosture())
    : updatePosture(() => ({
        pairedPeer: summarizePairedPeer(),
      }));
}
function reconcilePosture(e, t) {
  suppressPostureMirror = !0;
  try {
    if (e && identityChanged(e.identity, t.identity))
      return (
        clearOwnAssertion(),
        clearOrgMismatchFlag(),
        e.identity
          ? (resetPairingState(),
            {
              pairedPeer: null,
              awaiting: null,
            })
          : withAwaiting(t, {
              pairedPeer: null,
            })
      );
    const r = t.identity?.accountUuid;
    if (
      r &&
      e?.identity?.accountUuid !== r &&
      [...pairingState.pairings.values()].some(
        ({ pairing: e }) => e.own.sub !== r,
      )
    )
      return (
        clearOwnAssertion(),
        resetPairingState(),
        clearOrgMismatchFlag(),
        {
          pairedPeer: null,
          awaiting: null,
        }
      );
    if (
      !e ||
      !(function (e, t) {
        if (!e) return !0;
        const [n, r] = [policyFromPosture(e), policyFromPosture(t)];
        return (
          n.hybridSignIn !== r.hybridSignIn ||
          !listsEqual(n.allowedOrgs, r.allowedOrgs)
        );
      })(e, t)
    )
      return withAwaiting(
        t,
        r && e?.identity?.accountUuid !== r
          ? {
              pairedPeer: summarizePairedPeer(),
            }
          : {},
      );
    clearOrgMismatchFlag();
    const i = policyFromPosture(t),
      o = void 0 !== findHybridPairing();
    for (const [e, { pairing: t }] of [...pairingState.pairings])
      try {
        checkOrgPolicy(t.own, t.peer, i);
      } catch (n) {
        closePairing(e);
      }
    return o && !findHybridPairing()
      ? {
          pairedPeer: summarizePairedPeer(),
          awaiting: null,
        }
      : withAwaiting(t, {
          pairedPeer: summarizePairedPeer(),
        });
  } finally {
    suppressPostureMirror = !1;
  }
}
function withAwaiting(e, t) {
  if (("pairedPeer" in t ? t.pairedPeer : e.pairedPeer)?.hybrid && e.identity) {
    const { accountUuid: n, orgUuid: r } = e.identity;
    return {
      ...t,
      awaiting: {
        accountUuid: n,
        orgUuid: r,
      },
    };
  }
  return e.awaiting && null === e.source
    ? {
        ...t,
        awaiting: null,
      }
    : "pairedPeer" in t
      ? t
      : void 0;
}
function closePairing(e) {
  const t = pairingState.pairings.get(e);
  if (t) {
    t.pairing.channel.tearDown(), pairingState.pairings.delete(e);
    for (const [t, n] of pendingInferenceRequests)
      n.sid === e &&
        resolveInferenceRequest(t, {
          ok: !1,
          error: "unknown_pairing",
        });
    onPairingClosed?.(e), mirrorPairedPeerToPosture().catch(() => {});
  }
}
function expireOldPairings() {
  for (const [e, { admittedAt: t }] of pairingState.pairings)
    pairingClock.since(t) > 29100 && closePairing(e);
}
function getPeerPid(e) {
  const t = e.peerInstance?.pid;
  return "number" == typeof t ? t : void 0;
}
function assertSamePairingState(e) {
  if (pairingState !== e)
    throw new PairingError(
      "pairing_disabled",
      "identity or port changed during the handshake",
    );
}
/** Entry point for pair_offer / pair_finish messages arriving from the native host. */
async function handlePairingMessage(e, t, n, r) {
  const i = e?.msg,
    o = pairingState;
  try {
    if ("offer" === i) {
      if (
        ((pairingState.offerTimes = pairingState.offerTimes.filter(
          (e) => pairingClock.since(e) < 1,
        )),
        pairingState.offerTimes.length >= 2)
      )
        throw new PairingError("rate_limited", "too many pair offers");
      pairingState.offerTimes.push(pairingClock.stamp());
      const r = await (async function (e) {
        const t = await getPairingRuntime(),
          n =
            pairingState.install ??
            (await (async function () {
              try {
                const e = await chrome.management?.getSelf();
                return {
                  install_type: e?.installType,
                  may_disable: e?.mayDisable,
                };
              } catch {
                return {};
              }
            })());
        assertSamePairingState(e),
          (pairingState.install = n),
          (pairingState.responder &&
            JSON.stringify(pairingState.policy) === JSON.stringify(t.policy)) ||
            ((pairingState.policy = t.policy),
            (pairingState.responder = new PairingResponder({
              source: t.runtime.source,
              jwks: t.runtime.jwks,
              policy: t.policy,
              instance: {
                browser: getBrowserBrand(),
                extension_version: chrome.runtime.getManifest().version,
                instance_id: pairingState.instanceId,
                ...n,
                max_reassembly_bytes: MAX_REASSEMBLY_BYTES,
                can_relay_external: !0,
              },
            })));
        return pairingState.responder;
      })(o);
      let i;
      try {
        i = await r.onOffer(e);
      } catch (a) {
        throw (
          ((function (e) {
            e instanceof PairingError &&
              "org_mismatch" === e.code &&
              e.peerOrg &&
              setStorageValue(STORAGE_KEYS.PAIRING_ORG_MISMATCH, {
                org: e.peerOrg.toLowerCase(),
              }).catch((e) => {});
          })(a),
          a)
        );
      }
      return (
        assertSamePairingState(o),
        void n(
          toolResponse(t, {
            result: {
              local_pairing: i,
            },
          }),
        )
      );
    }
    if ("finish" === i) {
      const i = pairingState.responder;
      if (!i)
        throw new PairingError("bad_key_confirmation", "no offer on this port");
      const { done: s, pairing: c } = await i.onFinish(e);
      try {
        if ((assertSamePairingState(o), void 0 !== r && o.closedClients.has(r)))
          throw new PairingError(
            "pairing_disabled",
            "the Desktop's socket closed during the handshake",
          );
        const e = getPosture();
        if (!e) throw new PairingError("pairing_disabled", "no posture yet");
        checkOrgPolicy(c.own, c.peer, policyFromPosture(e));
        const t = e?.identity?.accountUuid;
        if (t && c.own.sub !== t)
          throw (
            (clearOwnAssertion(),
            new PairingError(
              "not_signed_in",
              "assertion names another account",
            ))
          );
        const n = findHybridPairing();
        if (n && !sameOrg(n, c))
          throw new PairingError(
            "org_mismatch",
            "another org while a hybrid Desktop manages the extension",
          );
      } catch (a) {
        throw (c.channel.tearDown(), a);
      }
      if (
        ((function (e, t) {
          const n = getPeerPid(e);
          if (void 0 !== n)
            for (const [r, i] of pairingState.pairings)
              getPeerPid(i.pairing) === n && closePairing(r);
          for (; pairingState.pairings.size >= 8; )
            closePairing(pairingState.pairings.keys().next().value);
          pairingState.pairings.set(e.sidB64, {
            pairing: e,
            admittedAt: pairingClock.stamp(),
            clientId: t,
          });
        })(c, r),
        isHybridPairing(c))
      )
        for (const [e, t] of [...pairingState.pairings])
          sameOrg(c, t.pairing) || closePairing(e);
      try {
        await mirrorPairedPeerToPosture();
      } catch (a) {
        throw (
          (closePairing(c.sidB64),
          new PairingError("pairing_disabled", "posture mirror write failed", {
            cause: a,
          }))
        );
      }
      return (
        n(
          toolResponse(t, {
            result: {
              local_pairing: s,
            },
          }),
        ),
        void clearOrgMismatchFlag()
      );
    }
    throw new PairingError("malformed", "unknown pairing message");
  } catch (a) {
    n(refusalResponse(t, a));
  }
}
function getBrowserBrand() {
  return (
    navigator.userAgentData?.brands?.find((e) =>
      /Edge|Chrome|Chromium/i.test(e.brand),
    )?.brand ?? "unknown"
  );
}
function isActivePairing(e) {
  return pairingState.pairings.get(e.sidB64)?.pairing === e;
}
async function sealForPairing(e, t, n, r) {
  if ((expireOldPairings(), isActivePairing(e)))
    try {
      const i = await e.channel.seal(t, n, r);
      return isActivePairing(e) ? i : void 0;
    } catch (i) {
      if (!isActivePairing(e)) return;
      return void closePairing(e.sidB64);
    }
}
async function sendSealedResponse(e, t, n, r) {
  const i = await sealForPairing(e, "tool_response", t, n);
  i &&
    r(
      toolResponse(t, {
        sealed: i,
      }),
    );
}
async function handleInferenceResponse(e, t) {
  if ("string" != typeof e) return;
  const n = pendingInferenceRequests.get(e),
    r = n && pairingState.pairings.get(n.sid)?.pairing;
  if (!n || !r) return;
  const i = await r.channel.open("notification:inference_response", e, t);
  if ((r.channel.isTornDown && closePairing(r.sidB64), !i.ok)) return;
  const o = i.inner;
  o &&
    "inference_response" === o.method &&
    o.params?.request_id === e &&
    resolveInferenceRequest(
      e,
      (function (e) {
        const t = e;
        return t && !0 === t.ok && Array.isArray(t.content)
          ? {
              ok: !0,
              content: t.content,
              stop_reason: t.stop_reason ?? null,
            }
          : {
              ok: !1,
              error: "string" == typeof t?.error ? t.error : "malformed",
            };
      })(o.params?.result),
    );
}
var nativePort = null,
  isConnectingNative = !1,
  nativeHostInstalled = !1,
  mcpConnectedViaNative = !1,
  nativeClientIds = new Set(),
  statusResolver = null,
  statusTimer = null,
  pendingSealedPermissionPrompts = new Map(),
  pairingCloseHookInstalled = !1;
function installPairingCloseHook() {
  pairingCloseHookInstalled ||
    ((pairingCloseHookInstalled = !0),
    (onPairingClosed = (e) => {
      for (const [t, n] of pendingSealedPermissionPrompts)
        n.sid === e &&
          (pendingSealedPermissionPrompts.delete(t), n.resolve(!1));
      clearPermissionRequests(pairingScope(e));
    }));
}
function pairingScope(e) {
  return `pairing:${e}`;
}
function safePostMessage(e, t) {
  if (!e) return !1;
  try {
    return e.postMessage(t), !0;
  } catch (n) {
    return !1;
  }
}
function postToNative(e) {
  safePostMessage(nativePort, e);
}
async function postToNativeUnlessClearTextRefused(e) {
  const t = nativePort;
  return !(await postureStore.refusesClearText()) && safePostMessage(t, e);
}
function isNativeHostMissingError(e) {
  return (
    !!e &&
    /native messaging host not found|native messaging host is forbidden/i.test(
      e,
    )
  );
}
function noteNativeError(e) {
  isNativeHostMissingError(e) && (nativeHostInstalled = !1);
}
function onNativeDisconnected(e) {
  nativePort === e &&
    ((nativePort = null),
    (mcpConnectedViaNative = !1),
    nativeClientIds.clear(),
    resetPairingState(),
    setMcpConnectionState("native", !1) || imported_t());
}
var nativeReconnectBackoff = createBackoffTimer(
  {
    first: 1e3,
    max: 3e4,
  },
  () => {
    getPosture()?.managed && connectNativeHost();
  },
);
function updateNativeReconnect() {
  getPosture()?.managed
    ? nativePort || isConnectingNative || nativeReconnectBackoff.arm()
    : nativeReconnectBackoff.disarm();
}
/** NATIVE MESSAGING (only if the optional 'nativeMessaging' permission has been granted):
 * tries to connect to the locally installed hosts com.anthropic.claude_browser_extension (Desktop) or
 * com.anthropic.claude_code_browser_extension (Claude Code) and pings them. */
async function connectNativeHost() {
  return; // Claus: no native messaging host (Claude Desktop / Claude Code).
  let e = !1;
  try {
    e = await (async function () {
      if (nativePort) return !0;
      if (isConnectingNative) return !1;
      isConnectingNative = !0;
      try {
        if (
          !(await chrome.permissions.contains({
            permissions: ["nativeMessaging"],
          }))
        )
          return "absent";
        if ("function" != typeof chrome.runtime.connectNative) return "absent";
        installPairingCloseHook();
        const t = [
          {
            name: "com.anthropic.claude_browser_extension",
            label: "Desktop",
          },
          {
            name: "com.anthropic.claude_code_browser_extension",
            label: "Claus Code",
          },
        ];
        let n = !0;
        for (const r of t)
          try {
            const e = chrome.runtime.connectNative(r.name),
              t = await new Promise((t) => {
                let n = !1;
                const r = () => {
                    if (n) return;
                    n = !0;
                    const e = chrome.runtime.lastError?.message;
                    t(!!isNativeHostMissingError(e) && "absent");
                  },
                  i = (o) => {
                    n ||
                      ("pong" === o.type &&
                        ((n = !0),
                        e.onDisconnect.removeListener(r),
                        e.onMessage.removeListener(i),
                        t(!0)));
                  };
                e.onDisconnect.addListener(r), e.onMessage.addListener(i);
                try {
                  e.postMessage({
                    type: "ping",
                  });
                } catch (o) {
                  return void (n || ((n = !0), t(!1)));
                }
                setTimeout(() => {
                  n ||
                    ((n = !0),
                    e.onDisconnect.removeListener(r),
                    e.onMessage.removeListener(i),
                    t(!1));
                }, 1e4);
              });
            if (!0 === t)
              return (
                (nativePort = e),
                r.name,
                (nativeHostInstalled = !0),
                resetPairingState(),
                e.onMessage.addListener((e) => {
                  handleNativeMessage(e);
                }),
                e.onDisconnect.addListener(() => {
                  const t = chrome.runtime.lastError?.message;
                  onNativeDisconnected(e),
                    noteNativeError(t),
                    updateNativeReconnect();
                }),
                e.postMessage({
                  type: "get_status",
                }),
                !0
              );
            (n &&= "absent" === t), e.disconnect();
          } catch (e) {
            n = !1;
          }
        return !!n && "absent";
      } catch (e) {
        return e instanceof Error && noteNativeError(e.message), !1;
      } finally {
        isConnectingNative = !1;
      }
    })();
  } catch (t) {}
  return (
    "absent" === e && postureStore.forgetHybridPairing(),
    !0 === e && nativeReconnectBackoff.disarm(),
    updateNativeReconnect(),
    !0 === e
  );
}
async function disconnectNativeHost() {
  try {
    await chrome.permissions.remove({
      permissions: ["nativeMessaging"],
    });
    const e = nativePort;
    return (
      e?.disconnect(),
      e ? onNativeDisconnected(e) : resetPairingState(),
      nativeReconnectBackoff.disarm(),
      (isConnectingNative = !1),
      (nativeHostInstalled = !1),
      !0
    );
  } catch (e) {
    return !1;
  }
}
/** Handles messages from the native host: tool_request (run a browser tool), status_response, mcp_connected, mcp_disconnected. */
async function handleNativeMessage(e) {
  switch (e.type) {
    case "tool_request":
      await (async function (e) {
        const t =
            "string" == typeof e.params?.tool_use_id
              ? e.params.tool_use_id
              : void 0,
          { method: n, params: r } = e;
        if ("execute_tool" === n && void 0 !== r?.local_pairing)
          return void (await handlePairingMessage(
            r.local_pairing,
            t,
            postToNative,
            "number" == typeof e.client_id ? e.client_id : void 0,
          ));
        if ("execute_tool" === n && void 0 !== r?.sealed)
          return void (await (async function (e, t) {
            const n = await (async function (e, t, n) {
              const r = () => {
                n(refusalResponse(e, new PairingError("unknown_pairing")));
              };
              expireOldPairings();
              const i = t?.sid,
                o =
                  "string" == typeof i
                    ? pairingState.pairings.get(i)?.pairing
                    : void 0;
              if (!o) return r();
              const a = await o.channel.open("execute_tool", e, t);
              if (
                (o.channel.isTornDown && closePairing(o.sidB64),
                !isActivePairing(o))
              )
                return r();
              if (!a.ok) return void a.reason;
              const s = a.inner;
              if (!s || "object" != typeof s || Array.isArray(s)) return;
              const c = s.params;
              return void 0 === c?.tool_use_id || c.tool_use_id === e
                ? {
                    pairing: o,
                    inner: s,
                  }
                : void 0;
            })(e, t, postToNative);
            if (!n) return;
            const { pairing: r, inner: i } = n,
              o = i.params ?? {};
            if ("permission_response" === i.method)
              return void (function (e, t, n) {
                if (!e) return;
                const r = pendingSealedPermissionPrompts.get(e);
                if (!r || r.sid !== n) return;
                pendingSealedPermissionPrompts.delete(e), r.resolve(!0 === t);
              })(o?.request_id, o?.allowed, r.sidB64);
            if (
              "external_config" === i.method ||
              "external_message" === i.method
            )
              return void (await (async function (e, t, n, r) {
                let i;
                if ("external_config" === n)
                  i = {
                    ok: await configureExternalExtensions(
                      {
                        extensionIds: r?.extension_ids,
                        hooks: r?.hooks,
                      },
                      pairingScope(e.sidB64),
                    ),
                  };
                else {
                  const t = await relayExternalMessage(
                    {
                      extensionIds: r?.extension_ids,
                      payload: r?.payload,
                      timeoutMs: r?.timeout_ms,
                    },
                    () => isActivePairing(e),
                  );
                  if (!t) return;
                  i = t;
                }
                await sendSealedResponse(
                  e,
                  t,
                  {
                    result: i,
                  },
                  postToNative,
                );
              })(r, e, i.method, i.params));
            const a = isHybridPairing(r)
                ? (e) =>
                    (async function (e, t, n) {
                      if (!0 !== e.peerInstance?.can_relay_inference)
                        return {
                          ok: !1,
                          error: "peer_not_capable",
                        };
                      const r = crypto.randomUUID(),
                        i = await sealForPairing(
                          e,
                          "notification:inference_request",
                          r,
                          {
                            method: "inference_request",
                            params: {
                              request_id: r,
                              body: t,
                            },
                          },
                        );
                      return i
                        ? new Promise((t) => {
                            const o = setTimeout(
                              () =>
                                resolveInferenceRequest(r, {
                                  ok: !1,
                                  error: "timeout",
                                }),
                              6e4,
                            );
                            pendingInferenceRequests.set(r, {
                              sid: e.sidB64,
                              resolve: t,
                              timer: o,
                            }),
                              n(
                                jsonRpcNotification("inference_request", {
                                  request_id: r,
                                  sealed: i,
                                }),
                              );
                          })
                        : {
                            ok: !1,
                            error: "unknown_pairing",
                          };
                    })(r, e, postToNative)
                : void 0,
              s =
                "execute_tool" === i.method
                  ? await runToolRequest(
                      o,
                      e,
                      (t, n) =>
                        (function (e, t, n, r) {
                          const i = crypto.randomUUID();
                          return new Promise((o) => {
                            const a = setTimeout(() => {
                                pendingSealedPermissionPrompts.delete(i) &&
                                  o(!1);
                              }, PERMISSION_PROMPT_TIMEOUT_MS),
                              s = (e) => {
                                clearTimeout(a), o(e);
                              };
                            pendingSealedPermissionPrompts.set(i, {
                              resolve: s,
                              sid: e.sidB64,
                            }),
                              (async function (e, t, n, r) {
                                const i = await sealForPairing(
                                  e,
                                  "notification:permission_request",
                                  t,
                                  {
                                    method: "permission_request",
                                    params: {
                                      ...n,
                                      tool_use_id: t,
                                    },
                                  },
                                );
                                return (
                                  !!i &&
                                  (r(
                                    jsonRpcNotification("permission_request", {
                                      tool_use_id: t,
                                      sealed: i,
                                    }),
                                  ),
                                  !0)
                                );
                              })(
                                e,
                                t,
                                {
                                  request_id: i,
                                  tool_type: n.tool,
                                  url: n.url,
                                  action_data: n.actionData,
                                  ...(r && {
                                    category: r,
                                  }),
                                },
                                postToNative,
                              ).then((e) => {
                                e ||
                                  (pendingSealedPermissionPrompts.delete(i),
                                  s(!1));
                              });
                          });
                        })(r, e, t, n),
                      a,
                    )
                  : toolErrorResult(`Unknown method: ${String(i.method)}`),
              c =
                toToolResponseBody(s) ??
                (s.is_error
                  ? {
                      error: {
                        content: "Tool returned no content",
                      },
                    }
                  : {
                      result: {
                        content: "",
                      },
                    });
            await sendSealedResponse(r, e, c, postToNative);
          })(t, r.sealed));
        if ("inference_response" === n && void 0 !== r?.sealed)
          return void (await handleInferenceResponse(r.request_id, r.sealed));
        if (await postureStore.refusesClearText())
          return void (
            "execute_tool" === n &&
            postToNative(
              toolResponse(
                t,
                withPermissionDeniedHint([
                  {
                    type: "text",
                    text: "Rejected: pairing with Claus Desktop is required",
                  },
                ]),
              ),
            )
          );
        try {
          if ("get_bridge_identity" === n)
            return void (await postToNativeUnlessClearTextRefused(
              toolResponse(t, {
                result: {
                  bridge_device_id: await getBridgeDeviceId(),
                  echo: r?.echo,
                },
              }),
            ));
          if ("execute_tool" === n)
            return void (await sendNativeToolResponse(
              await runToolRequest(r, t),
              t,
            ));
          "permission_response" !== n &&
            (await sendNativeToolResponse(
              {
                content: `Unknown method: ${n}`,
              },
              t,
            ));
        } catch (i) {
          await sendNativeToolResponse(
            toolErrorResult(
              `Tool execution failed: ${i instanceof Error ? i.message : "Unknown error"}`,
            ),
            t,
          );
        }
      })(e);
      break;
    case "status_response":
      !(function (e) {
        updateDefaultDisplayName(e.computer_name),
          statusResolver &&
            (clearTimeout(statusTimer),
            (statusTimer = null),
            statusResolver({
              nativeHostInstalled: nativeHostInstalled,
              mcpConnected: mcpConnectedViaNative,
            }),
            (statusResolver = null));
      })(e);
      break;
    case "mcp_connected":
      !(async function (e) {
        "number" == typeof e.client_id && nativeClientIds.add(e.client_id);
        (mcpConnectedViaNative = !0),
          setMcpConnectionState("native", !0),
          await tabGroupManager.initialize(),
          tabGroupManager.startTabGroupChangeListener();
      })(e);
      break;
    case "mcp_disconnected":
      !(function (e) {
        const t = "number" == typeof e.client_id ? e.client_id : void 0;
        if (
          ((function (e) {
            const t =
              void 0 !== e &&
              [...pairingState.pairings.values()].some(
                ({ pairing: t, clientId: n }) => n === e && isHybridPairing(t),
              );
            suppressPostureMirror = !0;
            try {
              if (void 0 === e) resetPairingState();
              else {
                pairingState.closedClients.add(e);
                for (const [t, n] of [...pairingState.pairings])
                  n.clientId === e && closePairing(t);
              }
            } finally {
              suppressPostureMirror = !1;
            }
            updatePosture(() => ({
              pairedPeer: summarizePairedPeer(),
              ...(t && {
                awaiting: null,
              }),
            })).catch(() => {});
          })(t),
          void 0 !== t && (nativeClientIds.delete(t), nativeClientIds.size > 0))
        )
          return;
        (mcpConnectedViaNative = !1),
          setMcpConnectionState("native", !1) ||
            tabGroupManager.stopTabGroupChangeListener();
        debuggerSessionManager.detachAll("native-messaging");
      })(e);
  }
}
/** Maps a tool request (tab id, tab group, session scope, permission settings) onto executeTool(). */
async function runToolRequest(e, t, n, r) {
  if (!e?.tool) return toolErrorResult("No tool specified");
  const i = (e) =>
      "number" == typeof e
        ? e
        : ("string" == typeof e && parseInt(e, 10)) || void 0,
    o = i(
      TOOLS_WITHOUT_TAB.has(e.tool)
        ? void 0
        : (e.args?.tabId ??
            ("browser_batch" === e.tool && Array.isArray(e.args?.actions)
              ? e.args.actions.find(
                  (e) =>
                    "number" == typeof e?.input?.tabId &&
                    !(
                      "string" == typeof e?.name &&
                      TOOLS_WITHOUT_TAB.has(e.name)
                    ),
                )?.input?.tabId
              : void 0)),
    ),
    a = i(e.args?.tabGroupId),
    s = e.session_scope;
  try {
    return await executeTool({
      toolName: e.tool,
      args: e.args || {},
      tabId: o,
      tabGroupId: a,
      clientId: e.client_id,
      source: "native-messaging",
      sessionScope: s,
      relayInference: r,
      ...(n && {
        hostDirected: !0,
        toolUseId: t,
        permissionMode: e.permission_mode,
        allowedDomains: Array.isArray(e.allowed_domains)
          ? e.allowed_domains.filter((e) => "string" == typeof e)
          : void 0,
        handlePermissionPrompts: !0 === e.handle_permission_prompts,
        requestPermissionFromHost: n,
      }),
    });
  } catch (c) {
    return toolErrorResult(
      `Tool execution failed: ${c instanceof Error ? c.message : "Unknown error"}`,
    );
  }
}
var PERMISSION_PROMPT_TIMEOUT_MS = 12e4;
function toToolResponseBody({ content: e, is_error: t }) {
  if (e && ("string" == typeof e || Array.isArray(e)))
    return t
      ? withPermissionDeniedHint(e)
      : {
          result: {
            content: e,
          },
        };
}
async function sendNativeToolResponse(e, t) {
  const n = toToolResponseBody(e);
  n && (await postToNativeUnlessClearTextRefused(toolResponse(t, n)));
}
async function broadcastMcpNotification(e, t) {
  return (
    !!nativePort &&
    (expireOldPairings(),
    pairingState.pairings.size > 0
      ? ((async function (e, t, n) {
          const r = {
            method: e,
            params: t ?? {},
          };
          for (const { pairing: i } of [...pairingState.pairings.values()]) {
            const e = await sealForPairing(
              i,
              "notification:sealed_broadcast",
              void 0,
              r,
            );
            e &&
              n(
                jsonRpcNotification("sealed_broadcast", {
                  sealed: e,
                }),
              );
          }
        })(e, t, postToNative),
        !0)
      : postToNativeUnlessClearTextRefused(jsonRpcNotification(e, t)))
  );
}
function withPermissionDeniedHint(e) {
  let t;
  const n = PERMISSION_DENIED_HINT;
  return (
    (t =
      "string" == typeof e
        ? e.includes("Permission denied by user")
          ? `${e} - ${n}`
          : e
        : e.map((e) =>
            "object" == typeof e &&
            null !== e &&
            "text" in e &&
            "string" == typeof e.text &&
            e.text.includes("Permission denied by user")
              ? {
                  ...e,
                  text: `${e.text} - ${n}`,
                }
              : e,
          )),
    {
      error: {
        content: t,
      },
    }
  );
}
function isLoggedOutTerminal(e) {
  return isTerminal(e) && "logged_out" === e.stop;
}
function isTerminal(e) {
  return "object" == typeof e && null !== e && !0 === e.terminal;
}
var resumingForgetTimer;
async function loadInitialPosture() {
  const [e, t, n] = await Promise.all([
    postureStore.readPolicyOrRetry(),
    postureStore.readIdentityOrRetry(),
    postureStore.readAwaitingOrRetry(),
  ]);
  return {
    policy: e,
    pairedPeer: null,
    identity: t ?? null,
    awaiting: n ?? null,
  };
}
function onPostureSourceChanged(e, t) {
  if ("resuming" === t.source)
    return (
      "resuming" !== e?.source &&
        checkAndRefreshOAuth().then(async ({ isValid: e }) => {
          !e &&
            (await (async function () {
              return isTerminal(
                await getStorageValue(STORAGE_KEYS.STARTUP_REAUTH_STATE).catch(
                  () => {},
                ),
              );
            })()) &&
            postureStore.forgetHybridPairing();
        }),
      void (resumingForgetTimer ??= setTimeout(() => {
        (resumingForgetTimer = void 0), postureStore.forgetHybridPairing();
      }, 15e3))
    );
  clearTimeout(resumingForgetTimer), (resumingForgetTimer = void 0);
}
function savedPromptToSkillDraft(e) {
  const t = "string" == typeof e.command ? e.command : void 0,
    n = toSkillName(t || truncateText(e.prompt) || "shortcut");
  return {
    name: n,
    description: truncateText(e.prompt, 160) || n,
    instructions: "string" == typeof e.prompt ? e.prompt : "",
    isScheduled: isScheduledPrompt(e),
  };
}
var migrationStarted = !1,
  authEpoch = 0;
function bumpAuthEpoch() {
  authEpoch += 1;
}
function getAuthEpoch() {
  return authEpoch;
}
async function getMigrationMode() {
  const [e, t, n] = await Promise.all([
    getFeatureValue(SKILL_MIGRATION_FEATURE_KEY),
    getStorageValue(STORAGE_KEYS.DEV_SKILL_MIGRATION_MODE),
    isGateOverrideActive(),
  ]);
  return n || null !== parseDevMigrationMode(t)
    ? resolveSkillMigrationMode(e, t)
    : null;
}
async function getSkillMigrationState() {
  if (!(await getStorageValue(STORAGE_KEYS.SKILL_MIGRATION_DONE)))
    return "inactive";
  const e = await getMigrationMode();
  return null === e ? "unknown" : "live" === e ? "active" : "inactive";
}
async function fetchOrgInfo() {
  try {
    const e = await profileResource.fetch(PROFILE_KEY),
      t = e?.organization?.uuid;
    return t
      ? {
          organizationUuid: t,
          accountUuid: e?.account?.uuid,
        }
      : null;
  } catch {
    return null;
  }
}
function buildScheduledSkill(e, t, n, r) {
  return {
    skillName: t.name,
    skillId: t.id,
    displayName: t.name,
    repeatType: e.repeatType ?? "none",
    specificTime: e.specificTime,
    specificDate: e.specificDate,
    dayOfWeek: e.dayOfWeek,
    dayOfMonth: e.dayOfMonth,
    monthAndDay: e.monthAndDay,
    url: e.url,
    model: e.model,
    skipPermissions: e.skipPermissions,
    cachedInstructions: n,
    approvedInstructions: n.trim(),
    cachedAt: Date.now(),
    sourceSavedPromptId: r,
  };
}
async function adoptExistingSkill(e, t, n, r, i, o) {
  try {
    const a = "string" == typeof t.prompt ? t.prompt : "",
      s = await findSkillByName(e, n);
    if (!s || !1 === s.enabled) return !1;
    const c = scheduledSkillsStore.bodyOf(await fetchSkillDetail(e, s.id));
    return (
      !(!c || c !== a.trim() || i()) &&
      ((await scheduledSkillsStore.getAll()).some(
        (e) => e.sourceSavedPromptId === r,
      ) ||
        o ||
        (await scheduledSkillsStore.create(buildScheduledSkill(t, s, a, r))),
      !0)
    );
  } catch (a) {
    return !1;
  }
}
async function setSignInBadge(e) {
  try {
    e
      ? await Promise.all([
          chrome.action.setBadgeBackgroundColor({
            color: "#F59E0B",
          }),
          chrome.action.setBadgeTextColor({
            color: "#000000",
          }),
          chrome.action.setBadgeText({
            text: "!",
          }),
          chrome.action.setTitle({
            title: "Claus: sign in needed",
          }),
        ])
      : await Promise.all([
          chrome.action.setBadgeText({
            text: "",
          }),
          chrome.action.setTitle({
            title: chrome.runtime.getManifest().action?.default_title ?? "",
          }),
        ]);
  } catch (t) {}
}
function isOwnExtensionPage(e) {
  return void 0 === e.tab && e.id === chrome.runtime.id;
}
var coworkGateState,
  coworkGateFailures = 0;
async function isCoworkIframeEnabled({ waitForRefresh: e = !0 } = {}) {
  if (await isGateEnabled("chrome_ext_cowork_iframe")) return !0;
  if (await isGateOverrideActive()) return !1;
  const t = Date.now() - (coworkGateState?.startedAt ?? 0),
    n = coworkGateState?.fetching
      ? Math.max(3e4, coworkGateBackoffMs())
      : coworkGateBackoffMs();
  return (
    (!coworkGateState || t < 0 || t >= n) &&
      (coworkGateState?.fetching && (coworkGateFailures += 1),
      (coworkGateState = (function () {
        const e = refreshFeatureGates();
        let t;
        const n = {
          startedAt: Date.now(),
          fetching: !0,
          loaded: Promise.race([
            e.then(() => !0),
            new Promise((e) => {
              t = setTimeout(() => e(!1), 5e3);
            }),
          ]).catch(() => !1),
        };
        return (
          e
            .then(
              () => {
                coworkGateState === n && (coworkGateFailures = 0);
              },
              () => {
                coworkGateState === n && (coworkGateFailures += 1);
              },
            )
            .finally(() => {
              (n.fetching = !1), clearTimeout(t);
            }),
          n
        );
      })())),
    !(!e || !(await coworkGateState.loaded)) &&
      isGateEnabled(COWORK_IFRAME_GATE)
  );
}
function coworkGateBackoffMs() {
  return Math.min(1500 * 2 ** Math.max(coworkGateFailures - 1, 0), 3e5);
}
/** Handles CIC_IFRAME_* messages from the extension's own side panel (Cowork iframe transport). Rejects any sender that is not an extension page. */
async function handleIframeMessage(e, t) {
  if (!isOwnExtensionPage(t))
    return {
      ok: !1,
      error: "sender is not an extension page",
    };
  if (!(await isCoworkIframeEnabled()))
    return {
      ok: !1,
      error: "cowork iframe transport is disabled (chrome_ext_cowork_iframe)",
    };
  if (
    !0 !==
    (await getStorageValue(STORAGE_KEYS.BROWSER_CONTROL_PERMISSION_ACCEPTED))
  )
    return {
      ok: !1,
      error: "browser-control consent has not been accepted",
    };
  if (
    "CIC_IFRAME_BRIDGE_INIT" === e.type ||
    "CIC_IFRAME_TOOL_CALL" === e.type
  ) {
    const t = e.iframeAccountUuid;
    if ("string" == typeof t) {
      const e = await getAccountUuid();
      if ("string" == typeof e && e !== t)
        return {
          ok: !1,
          error: "tool relay refused",
        };
    }
  }
  return "CIC_IFRAME_BRIDGE_INIT" === e.type
    ? (async function (e) {
        if (!Number.isInteger(e.panelTabId) || "string" != typeof e.sessionId)
          return {
            ok: !1,
            error: "malformed CIC_IFRAME_BRIDGE_INIT",
          };
        try {
          const { chromeGroupId: t } =
            await tabGroupManager.createIsolatedGroup(e.panelTabId);
          return (
            bindSessionToTabGroup(
              {
                sessionId: e.sessionId,
              },
              t,
            ),
            {
              ok: !0,
              tabGroupId: t,
            }
          );
        } catch (t) {
          return {
            ok: !1,
            error: "anchor tab-group initialization failed",
          };
        }
      })(e)
    : "CIC_IFRAME_TOOL_CALL" === e.type
      ? (async function (e) {
          if (
            "string" != typeof e.toolName ||
            "string" != typeof e.sessionId ||
            "string" != typeof e.toolUseId ||
            (void 0 !== e.panelTabId && !Number.isInteger(e.panelTabId)) ||
            (void 0 !== e.tabGroupId && !Number.isInteger(e.tabGroupId)) ||
            (void 0 !== e.displayName && "string" != typeof e.displayName) ||
            "object" != typeof e.args ||
            null === e.args ||
            Array.isArray(e.args) ||
            !(function (e) {
              if (void 0 === e) return !0;
              if ("object" != typeof e || null === e || Array.isArray(e))
                return !1;
              const t = e;
              return (
                isStringArrayOrUndefined(t.allowedDomains) &&
                isStringArrayOrUndefined(t.onceApprovedHosts) &&
                isStringArrayOrUndefined(t.deniedDomains) &&
                (void 0 === t.permissionMode ||
                  "skip_all_permission_checks" === t.permissionMode)
              );
            })(e.permissionOverrides) ||
            (void 0 !== e.supportsToolResultNotices &&
              "boolean" != typeof e.supportsToolResultNotices)
          )
            return {
              ok: !1,
              error: "malformed CIC_IFRAME_TOOL_CALL",
            };
          if (!SIDEPANEL_IFRAME_TOOLS.has(e.toolName))
            return {
              ok: !0,
              result: toolErrorResult(
                `Tool "${e.toolName}" is not available on the sidepanel iframe transport.`,
              ),
            };
          const t = (function (e, t) {
            const n = {};
            for (const [r, i] of Object.entries(t))
              STRIPPED_TOOL_ARGS.has(r) || (n[r] = i);
            if ("browser_batch" === e && Array.isArray(n.actions)) {
              const e = [];
              for (const t of n.actions) {
                if ("object" != typeof t || null === t) {
                  e.push(t);
                  continue;
                }
                const { name: n, input: r } = t;
                if (
                  "string" != typeof n ||
                  "browser_batch" === n ||
                  !SIDEPANEL_IFRAME_TOOLS.has(n)
                )
                  return null;
                const i = {};
                if ("object" == typeof r && null !== r)
                  for (const [e, t] of Object.entries(r))
                    STRIPPED_TOOL_ARGS.has(e) || (i[e] = t);
                e.push({
                  ...t,
                  name: n,
                  input: i,
                });
              }
              n.actions = e;
            }
            return n;
          })(e.toolName, e.args);
          if (null === t)
            return {
              ok: !0,
              result: toolErrorResult(
                "A browser_batch sub-action names a tool not available on the sidepanel iframe transport.",
              ),
            };
          if (void 0 === e.panelTabId)
            return {
              ok: !0,
              result: toolErrorResult(
                "No tab available. Please open a new tab or window in Chrome.",
              ),
            };
          if (void 0 === e.tabGroupId)
            return {
              ok: !1,
              error: "anchor tab group not established (tabGroupId missing)",
            };
          try {
            const n = await executeTool({
              toolName: e.toolName,
              args: t,
              tabId: e.panelTabId,
              tabGroupId: e.tabGroupId,
              sessionScope: {
                sessionId: e.sessionId,
                tabGroupId: e.tabGroupId,
                displayName: e.displayName,
              },
              clientId: "claude-code",
              source: "sidepanel-iframe",
              toolUseId: e.toolUseId,
              permissionMode: e.permissionOverrides?.permissionMode,
              allowedDomains: e.permissionOverrides?.allowedDomains
                ? [...e.permissionOverrides.allowedDomains]
                : void 0,
              onceApprovedHosts: e.permissionOverrides?.onceApprovedHosts
                ? [...e.permissionOverrides.onceApprovedHosts]
                : void 0,
              deniedDomains: e.permissionOverrides?.deniedDomains
                ? [...e.permissionOverrides.deniedDomains]
                : void 0,
              supportsToolResultNotices: !0 === e.supportsToolResultNotices,
            });
            return n?.is_error
              ? {
                  ok: !0,
                  result: toolErrorResult(toolErrorMessage(e.toolName)),
                }
              : {
                  ok: !0,
                  result: n ?? toolErrorResult("no result"),
                };
          } catch (n) {
            return {
              ok: !0,
              result: toolErrorResult(toolErrorMessage(e.toolName)),
            };
          }
        })(e)
      : "CIC_IFRAME_AGENT_STATE" === e.type
        ? (!1 === e.running &&
            Number.isInteger(e.panelTabId) &&
            onIframeAgentStopped(e.panelTabId),
          {
            ok: !0,
          })
        : {
            ok: !1,
            error: "unknown type",
          };
}
var STRIPPED_TOOL_ARGS = new Set(["checkUrls", "includePermissionState"]);
function isStringArrayOrUndefined(e) {
  return (
    void 0 === e || (Array.isArray(e) && e.every((e) => "string" == typeof e))
  );
}
/** Intercepts navigations to https://clau.de/chrome/... (permissions, reconnect, tab/<id>) and acts on them, then closes that tab. */
async function handleExtensionUrl(e, t) {
  try {
    const n = new URL(e);
    if ("clau.de" !== n.host) return !1;
    if ("/chrome/permissions" === n.pathname.toLowerCase())
      return (
        await (async function (e) {
          try {
            const e = chrome.runtime.getURL("options.html#permissions");
            await chrome.tabs.create({
              url: e,
            });
          } catch (t) {
          } finally {
            await closeTab(e);
          }
        })(t),
        !0
      );
    if (!n.pathname.startsWith("/chrome/")) return !1;
    const r = n.pathname.substring(8).toLowerCase();
    return "reconnect" === r
      ? (await (async function (e) {
          try {
            await disconnectNativeHost(), disconnectBridge(), await sleep(500);
            const [e, t] = await Promise.all([
              connectNativeHost(),
              connectBridge(),
            ]);
            trackEvent("claude_chrome.extension_url.reconnect", {
              native_host_success: e,
              bridge_initiated: t,
            });
          } catch (t) {
            trackEvent("claude_chrome.extension_url.reconnect", {
              success: !1,
            });
          } finally {
            await closeTab(e);
          }
        })(t),
        !0)
      : !!r.startsWith("tab/") &&
          (await (async function (e, t) {
            if (isNaN(e))
              return (
                trackEvent("claude_chrome.extension_url.tab_switch", {
                  success: !1,
                  error: "invalid_tab_id",
                }),
                await closeTab(t),
                !0
              );
            try {
              await tabGroupManager.initialize();
              const n = await tabGroupManager.findGroupByTab(e);
              if (!n || n.isUnmanaged)
                return (
                  trackEvent("claude_chrome.extension_url.tab_switch", {
                    success: !1,
                    error: "tab_not_managed",
                  }),
                  await closeTab(t),
                  !0
                );
              const r = await chrome.tabs.get(e);
              return (
                void 0 !== r.windowId &&
                  (await chrome.windows.update(r.windowId, {
                    focused: !0,
                  })),
                await chrome.tabs.update(e, {
                  active: !0,
                }),
                trackEvent("claude_chrome.extension_url.tab_switch", {
                  success: !0,
                }),
                await closeTab(t),
                !0
              );
            } catch (n) {
              return (
                trackEvent("claude_chrome.extension_url.tab_switch", {
                  success: !1,
                }),
                await closeTab(t),
                !0
              );
            }
          })(parseInt(r.substring(4), 10), t),
          !0);
  } catch {
    return trackEvent("claude_chrome.extension_url.unknown_exception", {}), !1;
  }
}
async function closeTab(e) {
  try {
    await chrome.tabs.remove(e);
  } catch (t) {}
}
async function readConsentByAccount() {
  return (
    (await getStorageValue(STORAGE_KEYS.PERMISSION_CONSENT_BY_ACCOUNT)) ?? {}
  );
}
function pickConsentKeys(e = {}) {
  return Object.fromEntries(
    PERMISSION_CONSENT_KEYS.filter((t) => t in e).map((t) => [t, e[t]]),
  );
}
async function saveConsentForAccount(e) {
  const [t, n] = await Promise.all([
    readConsentByAccount(),
    getStorageValues(PERMISSION_CONSENT_KEYS),
  ]);
  return (
    (t[e] = n),
    await setStorageValue(STORAGE_KEYS.PERMISSION_CONSENT_BY_ACCOUNT, t),
    t
  );
}
var consentQueue = Promise.resolve();
function runSerialized(e) {
  return (consentQueue = consentQueue.then(e).catch((e) => {}));
}
function syncConsentForAccount(e) {
  return runSerialized(() =>
    (async function (e) {
      const t = await getStorageValue(STORAGE_KEYS.PERMISSION_CONSENT_OWNER);
      if (void 0 !== e && t === e) return;
      let n = {};
      try {
        n = t ? await saveConsentForAccount(t) : await readConsentByAccount();
      } catch (i) {}
      (t || void 0 === e) &&
        (await removeStorageKeys([
          ...PERMISSION_CONSENT_KEYS,
          STORAGE_KEYS.PERMISSION_CONSENT_OWNER,
        ]));
      if (void 0 === e) return;
      const r = n[e];
      if (r && !(await getStorageValue(STORAGE_KEYS.ACCESS_TOKEN))) return;
      await setStorageValues({
        ...pickConsentKeys(r),
        [STORAGE_KEYS.PERMISSION_CONSENT_OWNER]: e,
      });
    })(e),
  );
}
/** declarativeNetRequest session rule: adds the extension's User-Agent suffix and anthropic-client-platform / -version headers to XHR requests to the Anthropic API base URL. */
async function installApiHeaderRules() {
  return; // Claus: no Anthropic API header rewriting (and no declarativeNetRequest permission).
  const e = getEnvConfig(),
    t = `claude-browser-extension/${chrome.runtime.getManifest().version} (external)`,
    n = chrome.runtime.getManifest().version,
    r = `${t} ${navigator.userAgent} `,
    i = [
      {
        id: 1,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: "User-Agent",
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: r,
            },
            {
              header: "anthropic-client-platform",
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: "claude_browser_extension",
            },
            {
              header: "anthropic-client-version",
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: n,
            },
          ],
        },
        condition: {
          urlFilter: `${e.apiBaseUrl}/*`,
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
            chrome.declarativeNetRequest.ResourceType.OTHER,
          ],
        },
      },
    ];
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1],
    addRules: i,
  });
}
async function reconcileSkillAlarms() {
  try {
    const [e, t] = await Promise.all([
      getSkillMigrationState(),
      savedPromptsService.getAllPrompts(),
    ]);
    return await scheduledSkillsStore.reconcileAlarms(e, t, rearmPromptAlarms);
  } catch (e) {
    return scheduledSkillsStore.isCutoverApplied().catch(() => !1);
  }
}
async function refreshAllAlarms() {
  await rearmPromptAlarms(), await reconcileSkillAlarms();
}
async function rearmPromptAlarms() {
  try {
    const t = await savedPromptsService.getAllPrompts(),
      n = new Set(await scheduledSkillsStore.getRetiredSources()),
      r = t.filter(
        (e) => e.repeatType && "none" !== e.repeatType && !n.has(e.id),
      );
    if (0 === r.length) return;
    let i = 0,
      o = 0;
    for (const a of r)
      try {
        await savedPromptsService.updateAlarmForPrompt(a), i++;
      } catch (e) {
        o++;
      }
    try {
      await savedPromptsService.updateNextRunTimes();
    } catch (e) {}
  } catch (e) {}
}
imported_vn(),
  imported_G(),
  "ServiceWorkerGlobalScope" in globalThis &&
    (listenersRegistered ||
      ((listenersRegistered = !0),
      chrome.alarms.create(KEEPALIVE_ALARM, {
        periodInMinutes: 0.5,
      }),
      chrome.alarms.onAlarm.addListener((e) => {
        e.name === KEEPALIVE_ALARM &&
          (function () {
            if (
              bridgeSocket?.readyState === WebSocket.CONNECTING &&
              connectStartedAt > 0 &&
              Date.now() - connectStartedAt > 3e4
            ) {
              const e = Date.now() - connectStartedAt;
              return (
                trackEvent("claude_chrome.bridge.connect_timeout", {
                  stuck_ms: e,
                  sw_uptime_ms: Date.now() - serviceWorkerStartedAt,
                  online: navigator.onLine,
                }),
                (isConnecting = !1),
                (connectStartedAt = 0),
                (lastCloseCode = 4003),
                (bridgeSocket.onclose = null),
                bridgeSocket.close(4003, "connect-timeout"),
                (bridgeSocket = null),
                rejectPendingPermissions(),
                void scheduleReconnect()
              );
            }
            if (
              ((null === reconnectAt || Date.now() >= reconnectAt) &&
                connectBridge(),
              bridgeSocket?.readyState === WebSocket.OPEN)
            ) {
              if (lastPongAt > 0 && Date.now() - lastPongAt > 9e4)
                return (
                  trackEvent("claude_chrome.bridge.stale_socket_reconnect", {
                    ms_since_pong: Date.now() - lastPongAt,
                    sw_uptime_ms: Date.now() - serviceWorkerStartedAt,
                  }),
                  void bridgeSocket.close(4001, "pong-timeout")
                );
              bridgeSocket.send(
                JSON.stringify({
                  type: "ping",
                }),
              );
            }
            Date.now() - lastOAuthRefreshAt >= 18e5 &&
              ((lastOAuthRefreshAt = Date.now()),
              checkAndRefreshOAuth().then(({ isRefreshed: e }) => {}));
          })();
      }),
      globalThis.addEventListener("online", () => {
        const e =
            bridgeSocket?.readyState === WebSocket.OPEN &&
            lastPongAt > 0 &&
            Date.now() - lastPongAt <= 9e4,
          t =
            bridgeSocket?.readyState === WebSocket.CONNECTING &&
            connectStartedAt > 0 &&
            Date.now() - connectStartedAt <= 3e4;
        trackEvent("claude_chrome.bridge.network_online", {
          had_socket: null !== bridgeSocket,
          socket_state: bridgeSocket?.readyState ?? -1,
          socket_healthy: e || t,
          reconnect_attempts: reconnectAttempt,
          reconnect_at_ms_from_now:
            null !== reconnectAt ? reconnectAt - Date.now() : null,
          sw_uptime_ms: Date.now() - serviceWorkerStartedAt,
        }),
          e ||
            t ||
            (reconnectTimer &&
              (clearTimeout(reconnectTimer), (reconnectTimer = null)),
            (reconnectAt = null),
            bridgeSocket && bridgeSocket.readyState !== WebSocket.CLOSED
              ? bridgeSocket.close(4002, "network-online")
              : connectBridge());
      }),
      globalThis.addEventListener("offline", () => {
        trackEvent("claude_chrome.bridge.network_offline", {
          socket_state: bridgeSocket?.readyState ?? -1,
          sw_uptime_ms: Date.now() - serviceWorkerStartedAt,
        });
      }),
      chrome.runtime.onMessage.addListener((e, t, n) => {
        if ("pairing_confirmed" === e.type) {
          const { request_id: t, name: r } = e;
          !(async function (e) {
            e === (await readBridgeNames()).default
              ? await chrome.storage.local.remove("bridgeDisplayName")
              : await chrome.storage.local.set({
                  bridgeDisplayName: e,
                });
          })(r),
            loadOrCreateDeviceId().then((e) => {
              sendToBridge({
                type: "pairing_response",
                request_id: t,
                device_id: e,
                name: r,
              });
            }),
            n({
              ok: !0,
            });
        }
        return (
          "pairing_dismissed" === e.type &&
            (sendToBridge({
              type: "pairing_response",
              request_id: e.request_id,
              dismissed: !0,
            }),
            n({
              ok: !0,
            })),
          !1
        );
      }))),
  (function () {
    setPostureReducer(reconcilePosture),
      subscribeToPosture(onPostureSourceChanged),
      subscribeToPosture(onPostureChangedForBridge),
      subscribeToPosture(onPostureChangedExternal),
      subscribeToPosture(updateNativeReconnect);
    const e = initPosture(loadInitialPosture);
    return postureStore.registerChangeListener(), e;
  })().catch((e) => {}),
  "ServiceWorkerGlobalScope" in globalThis &&
    (chrome.storage.onChanged.addListener((e, t) => {
      "session" === t &&
        STORAGE_KEYS.STARTUP_REAUTH_STATE in e &&
        setSignInBadge(
          isLoggedOutTerminal(e[STORAGE_KEYS.STARTUP_REAUTH_STATE].newValue),
        );
    }),
    getStorageValue(STORAGE_KEYS.STARTUP_REAUTH_STATE)
      .then((e) => setSignInBadge(isLoggedOutTerminal(e)))
      .catch((e) => {})),
  imported_a(),
  imported_i(),
  chrome.runtime.onConnect.addListener(function (e) {
    if ("cic-panel" !== e.name) return;
    const t = e.sender;
    if (!t || !isOwnExtensionPage(t)) {
      try {
        e.disconnect();
      } catch {}
      return;
    }
    const n = handleCicPanelConnection(e);
    isCoworkIframeEnabled({
      waitForRefresh: !1,
    })
      .catch(() => !1)
      .then((e) => {
        e || n();
      });
  }),
  chrome.runtime.onConnect.addListener(handlePortConnection),
  ensureOffscreenDocument().catch((e) => {}),
  clearOrgMismatchFlag(),
  loadPosture().then((e) => {
    e.managed &&
      !mcpConnectedViaNative &&
      setStorageValue(STORAGE_KEYS.MCP_CONNECTED, !1);
  }),
  connectNativeHost(),
  (async function () {
    if (migrationStarted) return;
    migrationStarted = !0;
    const e = await getMigrationMode();
    if (null === e || "off" === e) return;
    if (await getStorageValue(STORAGE_KEYS.SKILL_MIGRATION_DONE)) return;
    const t = await savedPromptsService.getAllPrompts();
    "dry_run" !== e
      ? await (async function (e) {
          const t = authEpoch,
            n = () => authEpoch !== t;
          if (e.length > 50)
            return void trackEvent(
              "claude_chrome.skill_migration.skipped_too_many",
              {
                total: e.length,
                cap: 50,
              },
            );
          const r = await fetchOrgInfo();
          if (!r || n())
            return void trackEvent(
              "claude_chrome.skill_migration.deferred_no_org",
              {
                total: e.length,
              },
            );
          const i = new Set(await scheduledSkillsStore.getRetiredSources());
          let o = 0,
            a = 0;
          const s = [],
            c = [],
            d = [],
            u = [],
            l = (e, t) => {
              s.push(e), isScheduledPrompt(t) && u.push(e);
            },
            p = new Set(),
            h = (e) => {
              let t = e;
              for (let n = 2; p.has(t); n++) t = `${e}-${n}`;
              return p.add(t), t;
            };
          for (let w = 0; w < e.length && !n(); w++) {
            const t = e[w],
              s =
                t && "object" == typeof t && "string" == typeof t.id
                  ? t.id
                  : `index_${w}`;
            let u,
              p,
              f = !1;
            try {
              const e = savedPromptToSkillDraft(t);
              (p = h(e.name)), (f = !0);
              const a = await createSkill({
                organizationUuid: r.organizationUuid,
                name: p,
                description: e.description,
                instructions: e.instructions,
              });
              if (((u = a.skillId), n())) break;
              e.isScheduled &&
                !i.has(s) &&
                (await scheduledSkillsStore.create(
                  buildScheduledSkill(
                    t,
                    {
                      name: a.name || p,
                      id: a.skillId,
                    },
                    e.instructions,
                    s,
                  ),
                )),
                o++;
            } catch (g) {
              if (g instanceof SkillNameConflictError) {
                if (
                  p &&
                  isScheduledPrompt(t) &&
                  (await adoptExistingSkill(
                    r.organizationUuid,
                    t,
                    g.skillName ?? p,
                    s,
                    n,
                    i.has(s),
                  ))
                ) {
                  o++;
                  continue;
                }
                a++, isScheduledPrompt(t) && d.push(s);
                continue;
              }
              if (g instanceof SkillBlockingError) {
                l(s, t);
                for (let t = w + 1; t < e.length; t++) {
                  const n = e[t];
                  l(
                    n && "object" == typeof n && "string" == typeof n.id
                      ? n.id
                      : `index_${t}`,
                    n,
                  );
                }
                break;
              }
              if (g instanceof SkillRejectedError) {
                l(s, t);
                continue;
              }
              if (g instanceof SkillHttpError) {
                [429, 408, 401, 403].includes(g.status) || g.status >= 500
                  ? c.push(s)
                  : l(s, t);
                continue;
              }
              u ? l(s, t) : f ? c.push(s) : l(s, t);
            }
          }
          const f = {
            total: e.length,
            created: o,
            skipped: a,
            failed: s.length,
          };
          if (n())
            return void trackEvent(
              "claude_chrome.skill_migration.aborted_auth_change",
              f,
            );
          const m = 0 === c.length;
          m &&
            (await setStorageValue(STORAGE_KEYS.SKILL_MIGRATION_DONE, {
              at: Date.now(),
              accountUuid: r.accountUuid,
              counts: f,
              scheduledSkipped: d,
              scheduledFailed: u,
            }));
          trackEvent("claude_chrome.skill_migration.completed", {
            ...f,
            deferred: c.length,
            stamped: m,
          });
        })(t)
      : (function (e) {
          const t = e.filter((e) => !!e && "object" == typeof e),
            n = t.map(savedPromptToSkillDraft),
            r = n.map((e) => e.name),
            i = t.reduce(
              (e, t) => e + ("string" == typeof t.prompt ? t.prompt.length : 0),
              0,
            );
          trackEvent("claude_chrome.skill_migration.dry_run", {
            total: e.length,
            malformed: e.length - t.length,
            scheduled: n.filter((e) => e.isScheduled).length,
            name_collisions: r.length - new Set(r).size,
            avg_prompt_len: t.length ? Math.round(i / t.length) : 0,
            has_url: t.filter((e) => !!e.url).length,
            has_command: t.filter((e) => !!e.command).length,
          });
        })(t);
  })()
    .catch((e) => {})
    .then(() => reconcileSkillAlarms()),
  onFeatureFlagsChanged(() => {
    reconcileSkillAlarms();
  });
var mainTabAckCache = new Map();
registerStartupListeners(),
  chrome.storage.onChanged.addListener((e, t) => {
    const n = e[STORAGE_KEYS.ACCOUNT_UUID]?.newValue;
    "local" === t &&
      "string" == typeof n &&
      getStorageValue(STORAGE_KEYS.ACCESS_TOKEN).then((e) => {
        e && syncConsentForAccount(n);
      });
  }),
  getStorageValue(STORAGE_KEYS.ACCOUNT_UUID).then((e) => {
    e && syncConsentForAccount(e);
  }),
  chrome.runtime.onInstalled.addListener(async (e) => {
    chrome.storage.local.remove(["updateAvailable"]),
      chrome.alarms.clear("conway-keepalive"),
      chrome.storage.local.remove([
        "conwayHostUrl",
        "conwayMode",
        "conwayLastConnection",
        "conwayOrgUuid",
        "conwayHostId",
        "conwayHostIdEviction",
      ]),
      chrome.storage.local.remove(["preferCoworkExperience"]),
      initRequestContext(),
      await tabGroupManager.initialize(),
      await installApiHeaderRules(),
      connectNativeHost(),
      await refreshAllAlarms();
  }),
  imported_Nt(),
  imported_Pt(),
  chrome.runtime.onStartup.addListener(async () => {
    initRequestContext(),
      await installApiHeaderRules(),
      await tabGroupManager.initialize(),
      connectBridge(),
      connectNativeHost(),
      await refreshAllAlarms();
  }),
  chrome.permissions.onAdded.addListener((e) => {
    e.permissions?.includes("nativeMessaging") && connectNativeHost();
  }),
  chrome.permissions.onRemoved.addListener((e) => {
    e.permissions?.includes("nativeMessaging") && disconnectNativeHost();
  }),
  chrome.action.onClicked.addListener(async function (e) {
    const t = e.id;
    if (!t) return;
    await openSidePanel(t);
  }),
  chrome.notifications.onClicked.addListener(async (e) => {
    chrome.notifications.clear(e);
    const t = e.split("_");
    let n = null;
    if (
      (t.length >= 2 && "unknown" !== t[1] && (n = parseInt(t[1], 10)),
      n && !isNaN(n))
    )
      try {
        const e = await chrome.tabs.get(n);
        if (e && e.windowId)
          return (
            await chrome.windows.update(e.windowId, {
              focused: !0,
            }),
            void (await chrome.tabs.update(n, {
              active: !0,
            }))
          );
      } catch {}
    const [r] = await chrome.tabs.query({
      active: !0,
      currentWindow: !0,
    });
    r?.id &&
      r.windowId &&
      (await chrome.windows.update(r.windowId, {
        focused: !0,
      }));
  }),
  chrome.commands.onCommand.addListener((e) => {
    "toggle-side-panel" === e &&
      chrome.tabs.query(
        {
          active: !0,
          currentWindow: !0,
        },
        (e) => {
          const t = e[0];
          t &&
            (async function (e) {
              const t = e.id;
              if (!t) return;
              if (!chrome.sidePanel) return openSidePanel(t);
              const n = chrome.runtime.getContexts({
                contextTypes: [chrome.runtime.ContextType.SIDE_PANEL],
              });
              chrome.sidePanel.setOptions({
                tabId: t,
                path: `sidepanel.html?tabId=${encodeURIComponent(t)}`,
                enabled: !0,
              });
              const r = chrome.sidePanel
                .open({
                  tabId: t,
                })
                .catch((e) => {});
              if (
                (await n).some(
                  (e) =>
                    !!e.documentUrl &&
                    new URL(e.documentUrl).searchParams.get("tabId") ===
                      String(t),
                )
              )
                return void chrome.runtime
                  .sendMessage({
                    type: "close_side_panel",
                    tabId: t,
                  })
                  .catch(console.error);
              await r, await ensureTabGroupForTab(t);
            })(t);
        },
      );
  });
var unsupportedBrowserNotified = !1;
/** Opens the side panel for a tab (shows a notification on browsers without the Side Panel API). */
async function openSidePanel(e) {
  if (!chrome.sidePanel)
    return (
      trackEvent("claude_chrome.sidepanel.unsupported_browser", {
        user_agent: navigator.userAgent,
      }),
      void (
        unsupportedBrowserNotified ||
        ((unsupportedBrowserNotified = !0),
        chrome.notifications.create({
          type: "basic",
          iconUrl: "/icon-128.png",
          title: "Browser not supported",
          message:
            "Claus requires the Chrome Side Panel API, which isn't available in this browser. Use Google Chrome, Microsoft Edge, or Brave.",
        }))
      )
    );
  chrome.sidePanel.setOptions({
    tabId: e,
    path: `sidepanel.html?tabId=${encodeURIComponent(e)}`,
    enabled: !0,
  }),
    chrome.sidePanel.open({
      tabId: e,
    }),
    await ensureTabGroupForTab(e);
}
function ensureTabGroupForTab(e) {
  return tabGroupManager.runExclusive(() =>
    (async function (e) {
      await tabGroupManager.initialize(!0);
      const t = await tabGroupManager.findGroupByTab(e);
      if (t) {
        if (t.isUnmanaged) {
          try {
            await tabGroupManager.adoptOrphanedGroup(e, t.chromeGroupId);
          } catch (n) {}
          return;
        }
        return;
      }
      try {
        await tabGroupManager.createGroup(e);
      } catch (n) {}
      connectNativeHost();
    })(e),
  );
}
chrome.runtime.onUpdateAvailable.addListener((e) => {
  setStorageValue(STORAGE_KEYS.UPDATE_AVAILABLE, !0),
    trackEvent("claude_chrome.extension.update_available", {
      current_version: chrome.runtime.getManifest().version,
      new_version: e.version,
    });
});
/** Message types the runtime.onMessage listener below accepts (from content scripts / extension pages). */
var HANDLED_MESSAGE_TYPES = new Set([
  "SW_KEEPALIVE",
  "check_and_refresh_oauth",
  "PLAY_NOTIFICATION_SOUND",
  "open_side_panel",
  "relay_last_active_org",
  "logout",
  MESSAGE_TYPE_en,
  "check_native_host_status",
  "SEND_MCP_NOTIFICATION",
  "OPEN_OPTIONS_WITH_TASK",
  "EXECUTE_SCHEDULED_TASK",
  "RUN_SKILL_SCHEDULE_NOW",
  "STOP_AGENT",
  "STOP_AGENT_DROPPED",
  "SWITCH_TO_MAIN_TAB",
  "SECONDARY_TAB_CHECK_MAIN",
  "MAIN_TAB_ACK_RESPONSE",
  "STATIC_INDICATOR_HEARTBEAT",
  "DISMISS_STATIC_INDICATOR_FOR_GROUP",
  ...IFRAME_MESSAGE_TYPES,
]);
/** chrome.notifications popup. */
async function notifyUser(e, t) {
  try {
    await chrome.notifications.create({
      type: "basic",
      iconUrl: "/icon-128.png",
      title: e,
      message: t,
      priority: 2,
    });
  } catch (n) {}
}
chrome.runtime.onMessage.addListener(
  (e, t, n) =>
    !!HANDLED_MESSAGE_TYPES.has(e.type) &&
    ((async () => {
      if ("SW_KEEPALIVE" !== e.type) {
        if ("check_and_refresh_oauth" !== e.type) {
          if ("PLAY_NOTIFICATION_SOUND" !== e.type) {
            if ("open_side_panel" === e.type) {
              const r = e.tabId || t.tab?.id;
              if (!r)
                return void n({
                  success: !1,
                });
              await openSidePanel(r);
              const i = getOnboardingPrompt(e.onboardingTaskId);
              if (i) {
                const e = async (t = 0) => {
                  try {
                    await sleep(0 === t ? 800 : 500),
                      await new Promise((e, t) => {
                        chrome.runtime.sendMessage(
                          {
                            type: "POPULATE_INPUT_TEXT",
                            prompt: i,
                          },
                          (n) => {
                            const r = chrome.runtime.lastError?.message;
                            r || !n?.success
                              ? t(new Error(r ?? "side panel not ready"))
                              : e();
                          },
                        );
                      });
                  } catch (n) {
                    t < 5 && (await e(t + 1));
                  }
                };
                await e();
              }
              return void n({
                success: !0,
              });
            }
            if ("relay_last_active_org" === e.type)
              return (
                "string" == typeof e.value &&
                  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                    e.value,
                  ) &&
                  (await setStorageValue(
                    STORAGE_KEYS.LAST_ACTIVE_ORG_HINT,
                    e.value,
                  )),
                void n({
                  success: !0,
                })
              );
            if ("logout" === e.type)
              try {
                imported_at(),
                  bumpAuthEpoch(),
                  await updatePosture({
                    identity: null,
                  }).catch(() => {});
                try {
                  await runSerialized(async () => {
                    const e = await getStorageValue(
                      STORAGE_KEYS.PERMISSION_CONSENT_OWNER,
                    );
                    e && (await saveConsentForAccount(e));
                  });
                } catch (o) {}
                await clearAuthState(),
                  await tabGroupManager.clearAllGroups(),
                  resetBridgeSessions(),
                  n({
                    success: !0,
                  });
              } catch (o) {
                n({
                  success: !1,
                  error: String(o),
                }),
                  postureStore.reloadIdentity().catch(() => {});
              }
            else if ("get_posture" === e.type) {
              if (
                t.id !== chrome.runtime.id ||
                !t.url?.startsWith(chrome.runtime.getURL(""))
              )
                return void n(void 0);
              n(await getPostureForUi());
            } else if ("check_native_host_status" === e.type) {
              const e = await (async function () {
                return nativePort && nativeHostInstalled
                  ? (statusTimer && clearTimeout(statusTimer),
                    new Promise((e) => {
                      (statusResolver = e),
                        nativePort.postMessage({
                          type: "get_status",
                        }),
                        (statusTimer = setTimeout(() => {
                          (statusResolver = null),
                            e({
                              nativeHostInstalled: nativeHostInstalled,
                              mcpConnected: mcpConnectedViaNative,
                            });
                        }, 1e4));
                    }))
                  : {
                      nativeHostInstalled: nativeHostInstalled,
                      mcpConnected: mcpConnectedViaNative,
                    };
              })();
              n({
                status: {
                  nativeHostInstalled: e.nativeHostInstalled,
                  mcpConnected: e.mcpConnected || isBridgeOpen(),
                },
              });
            } else if ("SEND_MCP_NOTIFICATION" === e.type) {
              const t = await broadcastMcpNotification(e.method, e.params),
                o =
                  ((r = e.method),
                  (i = e.params),
                  !!isBridgeOpen() &&
                    (sendToBridge({
                      type: "notification",
                      method: r,
                      params: i || {},
                    }),
                    !0));
              n({
                success: t || o,
              });
            } else if (IFRAME_MESSAGE_TYPES.includes(e.type))
              n(await handleIframeMessage(e, t));
            else if ("OPEN_OPTIONS_WITH_TASK" === e.type) {
              if (
                t.id !== chrome.runtime.id ||
                !t.url?.startsWith(chrome.runtime.getURL(""))
              )
                return void n({
                  success: !1,
                  error: "Forbidden sender",
                });
              try {
                await setStorageValue(
                  STORAGE_KEYS.PENDING_SCHEDULED_TASK,
                  e.task,
                );
                const t = (await scheduledSkillsStore.isCutoverApplied())
                    ? "scheduled"
                    : "prompts",
                  r = chrome.runtime.getURL("options.html"),
                  i = (await chrome.tabs.query({})).find((e) =>
                    e.url?.startsWith(r),
                  );
                i && i.id
                  ? (await chrome.tabs.update(i.id, {
                      url: chrome.runtime.getURL(`options.html#${t}`),
                      active: !0,
                    }),
                    i.windowId &&
                      (await chrome.windows.update(i.windowId, {
                        focused: !0,
                      })))
                  : await chrome.tabs.create({
                      url: chrome.runtime.getURL(`options.html#${t}`),
                    }),
                  n({
                    success: !0,
                  });
              } catch (o) {
                n({
                  success: !1,
                  error: o.message,
                });
              }
            } else if ("EXECUTE_SCHEDULED_TASK" === e.type) {
              if (t.tab)
                return void n({
                  success: !1,
                  error: "Forbidden sender",
                });
              try {
                const { task: t, runLogId: r } = e;
                await launchScheduledTask(t, r),
                  trackEvent(
                    "claude_chrome.scheduled_task.executed",
                    buildTaskExecutedSuccessProps(
                      t.id,
                      e.isManual ? "manual" : "automatic",
                    ),
                  ),
                  n({
                    success: !0,
                  });
              } catch (o) {
                trackEvent(
                  "claude_chrome.scheduled_task.executed",
                  buildTaskExecutedFailureProps(
                    e.task.id,
                    e.isManual ? "manual" : "automatic",
                    o,
                  ),
                ),
                  n({
                    success: !1,
                    error: o.message,
                  });
              }
            } else if ("RUN_SKILL_SCHEDULE_NOW" === e.type) {
              const r = chrome.runtime.getURL("");
              if (t.id !== chrome.runtime.id || !t.url?.startsWith(r))
                return void n({
                  success: !1,
                  error: "Forbidden sender",
                });
              const i = "string" == typeof e.scheduleId ? e.scheduleId : "";
              if (!scheduledSkillsStore.isScheduleAlarm(i))
                return void n({
                  success: !1,
                  error: "Invalid schedule id",
                });
              const o = await runScheduledSkill(i, {
                manual: !0,
              });
              n(
                o
                  ? {
                      success: !1,
                      error: o,
                    }
                  : {
                      success: !0,
                    },
              );
            } else if ("STOP_AGENT" === e.type) {
              if ("number" == typeof e.targetTabId) {
                const n = t.tab?.id;
                let r = void 0 === n;
                r ||
                  void 0 === n ||
                  (r =
                    n === e.targetTabId ||
                    (await tabGroupManager.getMainTabId(n)) === e.targetTabId),
                  r && stopAgentOnTab(e.targetTabId);
              }
              n({
                success: !0,
              });
            } else if ("STOP_AGENT_DROPPED" === e.type)
              trackEvent("claude_chrome.stop_pill.dropped", {
                target_tab_id: e.targetTabId,
              }),
                n({
                  success: !0,
                });
            else if ("SWITCH_TO_MAIN_TAB" === e.type) {
              if (t.tab?.id)
                try {
                  await tabGroupManager.initialize(!0);
                  const e = await tabGroupManager.getMainTabId(t.tab.id);
                  if (e) {
                    await chrome.tabs.update(e, {
                      active: !0,
                    });
                    const t = await chrome.tabs.get(e);
                    t.windowId &&
                      (await chrome.windows.update(t.windowId, {
                        focused: !0,
                      })),
                      n({
                        success: !0,
                      });
                  } else
                    n({
                      success: !1,
                      error: "No main tab found",
                    });
                } catch (o) {
                  n({
                    success: !1,
                    error: o.message,
                  });
                }
              else
                n({
                  success: !1,
                  error: "No sender tab",
                });
            } else
              "SECONDARY_TAB_CHECK_MAIN" === e.type
                ? chrome.runtime.sendMessage(
                    {
                      type: "MAIN_TAB_ACK_REQUEST",
                      secondaryTabId: e.secondaryTabId,
                      mainTabId: e.mainTabId,
                      timestamp: e.timestamp,
                    },
                    (e) => {
                      n(
                        e?.success
                          ? {
                              success: !0,
                            }
                          : {
                              success: !1,
                            },
                      );
                    },
                  )
                : "MAIN_TAB_ACK_RESPONSE" === e.type
                  ? n({
                      success: e.success,
                    })
                  : "STATIC_INDICATOR_HEARTBEAT" === e.type
                    ? (async () => {
                        const e = t.tab?.id;
                        if (e)
                          try {
                            const t = (await chrome.tabs.get(e)).groupId;
                            if (
                              void 0 === t ||
                              t === chrome.tabGroups.TAB_GROUP_ID_NONE
                            )
                              return void n({
                                success: !1,
                              });
                            if (await tabGroupManager.findGroupByTab(e))
                              return void n({
                                success: !0,
                              });
                            const r = await chrome.tabs.query({
                                groupId: t,
                              }),
                              i = async (t) => {
                                if (t >= r.length)
                                  return void n({
                                    success: !1,
                                  });
                                const o = r[t];
                                if (o.id === e || !o.id)
                                  return void (await i(t + 1));
                                const a = o.id,
                                  s = Date.now(),
                                  c = mainTabAckCache.get(a);
                                if (c && s - c.timestamp < 3e3)
                                  return c.isAlive
                                    ? void n({
                                        success: !0,
                                      })
                                    : void (await i(t + 1));
                                chrome.runtime.sendMessage(
                                  {
                                    type: "MAIN_TAB_ACK_REQUEST",
                                    secondaryTabId: e,
                                    mainTabId: a,
                                    timestamp: s,
                                  },
                                  async (e) => {
                                    const r = e?.success ?? !1;
                                    mainTabAckCache.set(a, {
                                      timestamp: s,
                                      isAlive: r,
                                    }),
                                      r
                                        ? n({
                                            success: !0,
                                          })
                                        : await i(t + 1);
                                  },
                                );
                              };
                            await i(0);
                          } catch (o) {
                            n({
                              success: !1,
                            });
                          }
                        else
                          n({
                            success: !1,
                          });
                      })()
                    : "DISMISS_STATIC_INDICATOR_FOR_GROUP" === e.type &&
                      (async () => {
                        const e = t.tab?.id;
                        if (e)
                          try {
                            const t = (await chrome.tabs.get(e)).groupId;
                            if (
                              void 0 === t ||
                              t === chrome.tabGroups.TAB_GROUP_ID_NONE
                            )
                              return void n({
                                success: !1,
                              });
                            await tabGroupManager.initialize(),
                              await tabGroupManager.dismissStaticIndicatorsForGroup(
                                t,
                              ),
                              n({
                                success: !0,
                              });
                          } catch (o) {
                            n({
                              success: !1,
                            });
                          }
                        else
                          n({
                            success: !1,
                          });
                      })();
            var r, i;
          } else
            try {
              await ensureOffscreenDocument(),
                await chrome.runtime.sendMessage({
                  type: "OFFSCREEN_PLAY_SOUND",
                  audioUrl: e.audioUrl,
                  volume: e.volume || 0.5,
                }),
                n({
                  success: !0,
                });
            } catch (o) {
              n({
                success: !1,
                error: o.message,
              });
            }
        } else n(await checkAndRefreshOAuth());
      } else n();
    })().catch((e) => {
      n({
        success: !1,
        error: String(e),
      });
    }),
    !0),
),
  chrome.tabs.onRemoved.addListener(async (e) => {
    cleanupClosedTab(e).catch(console.error),
      debuggerSessionManager.notifyTabDetach(e),
      await tabGroupManager.handleTabClosed(e);
  }),
  chrome.webNavigation.onBeforeNavigate.addListener(async (e) => {
    0 === e.frameId && (await handleExtensionUrl(e.url, e.tabId));
  });
var MAX_OWNER_RETRIES = 5;
/** Runs a scheduled skill: validates owner account and instructions, notifies the user on problems, then calls launchScheduledTask(). */
async function runScheduledSkill(e, { manual: t }) {
  const n = getAuthEpoch(),
    r = () => getAuthEpoch() !== n;
  try {
    if (!(await reconcileSkillAlarms())) return "cutover_inactive";
    let n = await scheduledSkillsStore.getById(e);
    if (!n) return t || (await chrome.alarms.clear(e)), "not_found";
    if (!t && !scheduledSkillsStore.isArmable(n))
      return await chrome.alarms.clear(e), "not_armable";
    const [o, a] = await Promise.all([
      getStorageValue(STORAGE_KEYS.SKILL_MIGRATION_DONE),
      getAccountUuid(),
    ]);
    if (o?.accountUuid && o.accountUuid !== a) {
      if (!a) {
        const r = n.ownerRetries ?? 0;
        return (
          !t &&
            "daily" !== n.repeatType &&
            "weekly" !== n.repeatType &&
            r < MAX_OWNER_RETRIES &&
            !!(await getAccessToken()) &&
            (await scheduledSkillsStore.update(e, {
              ownerRetries: r + 1,
            }),
            await chrome.alarms.create(e, {
              delayInMinutes: 1,
            })),
          "unknown_account"
        );
      }
      return (
        await scheduledSkillsStore.update(e, {
          paused: !0,
        }),
        await chrome.alarms.clear(e),
        "other_account"
      );
    }
    n.ownerRetries &&
      (await scheduledSkillsStore.update(e, {
        ownerRetries: void 0,
      }));
    const s = await fetchOrgInfo();
    if (r()) return "unknown_account";
    if (s) {
      const t = await scheduledSkillsStore.refreshInstructionsCache(
        s.organizationUuid,
        e,
      );
      if (!t) return "not_found";
      n = t;
    }
    if (n.disabledReason)
      return (
        t ||
          (await notifyUser(
            "Scheduled task skipped",
            `"${n.displayName}" didn't run because its skill was deleted or turned off on claude.ai. Turn it back on there, then use Run now in Claus settings → Scheduled (or remove it).`,
          )),
        "skill_unavailable"
      );
    const c = (n.cachedInstructions ?? "").trim();
    if (!c) return "no_instructions";
    if (r()) return "unknown_account";
    const d = scheduledSkillsStore.needsReview(n);
    d &&
      !t &&
      (await notifyUser(
        "Scheduled task needs review",
        `"${n.displayName}" changed on claude.ai since you approved it, so it's running with permission prompts. Open Claus settings → Scheduled to review it.`,
      ));
    const u = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    let l = null;
    try {
      await launchScheduledTask(
        {
          id: n.id,
          name: n.displayName,
          prompt: c,
          url: n.url,
          skipPermissions: !d && !1 !== n.skipPermissions,
          model: n.model,
        },
        u,
      ),
        await scheduledSkillsStore.update(e, {
          lastRun: Date.now(),
        }),
        trackEvent(
          "claude_chrome.scheduled_task.executed",
          buildTaskExecutedSuccessProps(n.id, t ? "manual" : "automatic"),
        );
    } catch (i) {
      (l = "run_failed"),
        trackEvent(
          "claude_chrome.scheduled_task.executed",
          buildTaskExecutedFailureProps(n.id, t ? "manual" : "automatic", i),
        ),
        t ||
          (await notifyUser(
            "Scheduled task failed",
            `Task "${n.displayName}" failed to execute. ${i instanceof Error ? i.message : String(i)}`,
          ));
    }
    if (!t && ("monthly" === n.repeatType || "annually" === n.repeatType)) {
      const t = await scheduledSkillsStore.getById(e);
      t && (await scheduledSkillsStore.updateAlarmForSchedule(t));
    }
    return l;
  } catch (o) {
    return "run_failed";
  }
}
/** Opens a new window, puts its first tab in a managed tab group and starts the side-panel agent with the task prompt. */
async function launchScheduledTask(e, t) {
  const n = await chrome.windows.create({
    url: e.url || "about:blank",
    type: "normal",
    focused: !0,
  });
  if (!n || !n.id || !n.tabs || 0 === n.tabs.length)
    throw new Error("Failed to create window for scheduled task");
  const r = n.tabs[0];
  if (!r.id)
    throw new Error("Failed to get tab in new window for scheduled task");
  await tabGroupManager.initialize(!0);
  await tabGroupManager.createGroup(r.id);
  await runTaskInTab({
    tabId: r.id,
    prompt: e.prompt,
    taskName: e.name,
    skipPermissions: e.skipPermissions,
    model: e.model,
    runLogId: t,
    isScheduledTask: !0,
  });
}
chrome.alarms.onAlarm.addListener(async (e) => {
  if (scheduledSkillsStore.isScheduleAlarm(e.name))
    await runScheduledSkill(e.name, {
      manual: !1,
    });
  else if (e.name.startsWith("prompt_"))
    try {
      const r = e.name,
        i = (
          (await chrome.storage.local.get(["savedPrompts"])).savedPrompts || []
        ).find((e) => e.id === r);
      if (
        i &&
        i.repeatType &&
        "none" !== i.repeatType &&
        (await reconcileSkillAlarms()) &&
        (await scheduledSkillsStore.isSourcePromptCovered(r))
      )
        return;
      if (i) {
        const e = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        let o = null;
        try {
          await launchScheduledTask(
            {
              id: i.id,
              name: i.command || "Scheduled Task",
              prompt: i.prompt,
              url: i.url,
              enabled: !0,
              skipPermissions: !1 !== i.skipPermissions,
              model: i.model,
            },
            e,
          );
        } catch (t) {
          (o = t instanceof Error ? t : new Error(String(t))),
            await notifyUser(
              "Scheduled task failed",
              `Task "${i.command || "Scheduled Task"}" failed to execute. ${o.message}`,
            );
        }
        if ("monthly" === i.repeatType || "annually" === i.repeatType)
          try {
            await savedPromptsService.updateAlarmForPrompt(i);
          } catch (t) {
            const e = `retry_${r}`;
            try {
              await chrome.alarms.create(e, {
                delayInMinutes: 1,
              });
            } catch (n) {}
            await notifyUser(
              "Scheduled task setup failed",
              `Failed to schedule next occurrence of "${i.command || "Scheduled Task"}". Please check the task settings.`,
            );
          }
      }
    } catch (t) {}
  else if (e.name.startsWith("retry_"))
    try {
      const n = e.name.replace("retry_", ""),
        r = (
          (await chrome.storage.local.get(["savedPrompts"])).savedPrompts || []
        ).find((e) => e.id === n);
      if (r && ("monthly" === r.repeatType || "annually" === r.repeatType))
        try {
          await savedPromptsService.updateAlarmForPrompt(r);
        } catch (t) {
          await notifyUser(
            "Scheduled task needs attention",
            `Could not automatically reschedule "${r.command || "Scheduled Task"}". Please edit the task to reschedule it.`,
          );
        }
    } catch (t) {}
});
var SIDEPANEL_ACTIONS = ["open_options", "set_locale"];
function isClaudeAiOrigin(e) {
  return "https://claude.ai" === e;
}
chrome.runtime.onMessageExternal.addListener(
  (i, o, a) => (
    (async () => {
      const c = !!(d = o.origin) && ["https://claude.ai"].includes(d);
      var d;
      const u = !c && !1;
      if (c || u) {
        if ("oauth_redirect" === i.type) {
          if (!(await isOAuthFlowInProgress(i.redirect_uri)))
            return void a({
              success: !1,
              error: "No sign-in in progress",
              notStartedHere: !0,
            });
          imported_rt();
          const e = await getStorageValue(STORAGE_KEYS.ACCOUNT_UUID);
          bumpAuthEpoch(),
            await runSerialized(async () => {
              (await getStorageValue(STORAGE_KEYS.PERMISSION_CONSENT_OWNER)) ||
                (await removeStorageKeys(PERMISSION_CONSENT_KEYS));
            });
          const t = await handleOAuthRedirect(i.redirect_uri, o?.tab?.id);
          if ((a(t), t.success)) {
            const t = await getAccountUuid();
            if ((await syncConsentForAccount(t), e !== t)) {
              resetBridgeSessions();
              try {
                await resetAccountCaches(), await resetAccountCaches();
              } catch {}
              void 0 !== e &&
                removeStorageKeys(STORAGE_KEYS.LAST_ACTIVE_ORG_HINT),
                void 0 !== e &&
                  void 0 !== t &&
                  (await scheduledSkillsStore.clearForAccountSwitch(
                    rearmPromptAlarms,
                  ));
            }
            refreshFeatureGates()
              .catch((e) => {})
              .then(() => connectBridge()),
              connectNativeHost(),
              imported_at(),
              imported_st();
          }
        } else if ("ping" === i.type)
          a({
            success: !0,
            exists: !0,
          });
        else if ("get_sidepanel_host_info" === i.type)
          try {
            const r = void 0 === o.tab,
              i = isClaudeAiOrigin(o.origin),
              [s, c, d, l] = await Promise.all([
                r && !u ? getAccountUuid() : Promise.resolve(void 0),
                r && !u
                  ? getStorageValue(STORAGE_KEYS.LAST_ACTIVE_ORG_HINT)
                  : Promise.resolve(void 0),
                getStorageValue(STORAGE_KEYS.NOTIFICATIONS_ENABLED).then(
                  (e) => "enabled" === e,
                ),
                chrome.storage.local.get("preferred_locale").then((t) => {
                  const r = t.preferred_locale;
                  return void 0 !== r && SUPPORTED_LOCALES.includes(r)
                    ? r
                    : getDefaultLocale();
                }),
              ]),
              p =
                r &&
                !u &&
                o.origin === imported_Mt()?.origin &&
                (await imported_At());
            a({
              ok: !0,
              accountUuid: u ? void 0 : s,
              lastActiveOrgUuid: c,
              viaDevCarveOut: u,
              extensionVersion: chrome.runtime.getManifest().version,
              build: {
                environment: "production",
                antOnlyBuild: !1,
              },
              notificationsEnabled: d,
              locale: l,
              availableLocales: SUPPORTED_LOCALES.map((e) => ({
                code: e,
                displayName: LOCALE_DISPLAY_NAMES[e],
              })),
              capabilities: [
                ...(r && i ? SIDEPANEL_ACTIONS : []),
                ...(p ? [SIDEPANEL_CAPABILITY] : []),
              ],
            });
          } catch (l) {
            a({
              ok: !1,
              error: String(l),
            });
          }
        else if (SIDEPANEL_ACTIONS.includes(i.type)) {
          if (void 0 !== o.tab || !isClaudeAiOrigin(o.origin))
            return void a({
              ok: !1,
              error: "Action not allowed from this origin/context",
            });
          try {
            if ("open_options" === i.type)
              await chrome.runtime.openOptionsPage(),
                a({
                  ok: !0,
                });
            else if ("set_locale" === i.type) {
              const e = i.locale;
              if ("string" != typeof e || !SUPPORTED_LOCALES.includes(e))
                return void a({
                  ok: !1,
                  error: "Unknown locale",
                });
              await chrome.storage.local.set({
                preferred_locale: e,
              }),
                a({
                  ok: !0,
                });
            } else
              a({
                ok: !1,
                error: `Unhandled sidepanel action: ${i.type}`,
              });
          } catch (l) {
            a({
              ok: !1,
              error: String(l),
            });
          }
        } else a();
      } else
        a({
          success: !1,
          error: "Untrusted origin",
        });
    })().catch((e) => {
      a({
        success: !1,
        error: String(e),
      });
    }),
    !0
  ),
);
