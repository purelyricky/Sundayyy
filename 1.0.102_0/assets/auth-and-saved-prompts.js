/**
 * @readable-header
 * FILE:      assets/auth-and-saved-prompts.js
 * WAS:       SavedPromptsService-N06kd8Mw.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     mixed - Bundled Sentry browser SDK (version not determined)
 * WHAT:      Shared chunk (original name SavedPromptsService) with account/session logic and the saved-prompt/skill services: OAuth (claude.ai/oauth/authorize, platform.claude.com/v1/oauth/token, chrome.identity redirect URL), token refresh, chrome.alarms for scheduled tasks, skills CRUD with error classes (SkillAlreadyExists, SkillLimitReached, SkillNameReserved), skill schedule and migration flags in storage, Anthropic event logging (api.anthropic.com/api/event_logging/v2/batch), and a bundled Sentry browser SDK with PII scrubbing integrations. Uses chrome.storage (session/local/managed), alarms, identity, tabs. Also contains the Vite preload helper.
 * WHY:       Used by service worker, side panel, options page and mermaid chunks for auth, storage, skills and error reporting.
 * USED BY:   assets/browser-tools-and-permissions.js (static import)
 *            assets/mermaid-config-themes-and-common-db.js (static import)
 *            assets/mermaid-core.js (static import)
 *            assets/mermaid-parser-core.js (static import)
 *            assets/options-page.js (static import)
 *            assets/scheduling-fields.js (static import)
 *            assets/service-worker.js (static import)
 *            assets/shiki-languages-index.js (static import)
 *            ... and 3 more (full list in FILE_INDEX.md)
 * NEEDS:     assets/react-vendor-and-language-list.js (static import)
 * EXPORTS:   $, $t, A, An, At, B, Bt, C, Cn, Ct, D, Dn, Dt, E, En, Et, F, Fn, Ft, G, Gt, H, Ht, I, It, J, Jt, K, Kt, L, ... (143 total)  (export names are unchanged from the original; other files import them by these names)
 */
import {
  a as requireJsxRuntime,
  o as requireReact,
  u as toEsModule,
} from "./react-vendor-and-language-list.js";
var preloadedUrlSet = {},
  preloadWithDependencies = function (t, e, n) {
    let s = Promise.resolve();
    if (e && e.length > 0) {
      const t = document.getElementsByTagName("link"),
        n = document.querySelector("meta[property=csp-nonce]"),
        o = n?.nonce || n?.getAttribute("nonce");
      (i = e.map((e) => {
        var n;
        if (
          ((e = (function (t) {
            return "/" + t;
          })(e)),
          (n = e),
          (e = import.meta.resolve
            ? import.meta.resolve(n)
            : new URL(n, import.meta.url).href) in preloadedUrlSet)
        )
          return;
        preloadedUrlSet[e] = !0;
        const s = e.endsWith(".css");
        for (let r = t.length - 1; r >= 0; r--) {
          const n = t[r];
          if (n.href === e && (!s || "stylesheet" === n.rel)) return;
        }
        const i = document.createElement("link");
        return (
          (i.rel = s ? "stylesheet" : "modulepreload"),
          s || (i.as = "script"),
          (i.crossOrigin = ""),
          (i.href = e),
          o && i.setAttribute("nonce", o),
          document.head.appendChild(i),
          s
            ? new Promise((t, n) => {
                i.addEventListener("load", t),
                  i.addEventListener("error", () =>
                    n(new Error(`Unable to preload CSS for ${e}`)),
                  );
              })
            : void 0
        );
      })),
        (s = Promise.all(
          i.map((t) =>
            Promise.resolve(t).then(
              (t) => ({
                status: "fulfilled",
                value: t,
              }),
              (t) => ({
                status: "rejected",
                reason: t,
              }),
            ),
          ),
        ));
    }
    var i;
    function o(t) {
      const e = new Event("vite:preloadError", {
        cancelable: !0,
      });
      if (((e.payload = t), window.dispatchEvent(e), !e.defaultPrevented))
        throw t;
    }
    return s.then((e) => {
      for (const t of e || []) "rejected" === t.status && o(t.reason);
      return t().catch(o);
    });
  },
  jsxRuntime = requireJsxRuntime();
function classValueToString(t) {
  var e,
    n,
    r = "";
  if ("string" == typeof t || "number" == typeof t) r += t;
  else if ("object" == typeof t)
    if (Array.isArray(t)) {
      var s = t.length;
      for (e = 0; e < s; e++)
        t[e] && (n = classValueToString(t[e])) && (r && (r += " "), (r += n));
    } else for (n in t) t[n] && (r && (r += " "), (r += n));
  return r;
}
function classNames() {
  for (var t, e, n = 0, r = "", s = arguments.length; n < s; n++)
    (t = arguments[n]) &&
      (e = classValueToString(t)) &&
      (r && (r += " "), (r += e));
  return r;
}
var ICON_PIXEL_SIZES = {
  12: 16,
  14: 16,
  16: 20,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
};
function SvgIconFrame({
  size: t = 20,
  vectorSizeOverride: e,
  className: n,
  alt: r,
  viewBox: s = "0 0 20 20",
  children: o,
}) {
  const a = e || ICON_PIXEL_SIZES[t],
    u = (0, jsxRuntime.jsx)("svg", {
      width: a,
      height: a,
      viewBox: s,
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      style: {
        flexShrink: 0,
      },
      className: n,
      "aria-label": r,
      "aria-hidden": !r,
      children: o,
    });
  return e
    ? u
    : (0, jsxRuntime.jsx)("div", {
        className: n,
        style: {
          width: t,
          height: t,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: u,
      });
}
var PRODUCTION_EXTENSION_ID = "fcoeoabgfenejglbffodgkkbkcdhcgfn",
  OAUTH_DEV_CONFIG = {
    AUTHORIZE_URL: "https://claude.ai/oauth/authorize",
    TOKEN_URL: "https://platform.claude.com/v1/oauth/token",
    SCOPES_STR: "user:profile user:inference user:chat",
    CLIENT_ID: "54511e87-7abf-4923-9d84-d6f24532e871",
    REDIRECT_URI: `chrome-extension://${"dihbgbndebgnbjfmelmegjepbnkhlgni"}/oauth_callback.html`,
  },
  OAUTH_CONFIGS_BY_ENV = {
    development: OAUTH_DEV_CONFIG,
    production: {
      ...OAUTH_DEV_CONFIG,
      CLIENT_ID: "dae2cad8-15c5-43d2-9046-fcaecc135fa4",
      REDIRECT_URI: `chrome-extension://${PRODUCTION_EXTENSION_ID}/oauth_callback.html`,
    },
  },
  getEnvironmentConfig = () => {
    const t = "production";
    return {
      environment: t,
      apiBaseUrl: "https://api.anthropic.com",
      wsApiBaseUrl: "wss://api.anthropic.com",
      oauth: OAUTH_CONFIGS_BY_ENV[t],
      localBridge: !1,
    };
  };
function createSseLineParser(t) {
  let e,
    n,
    r,
    s = !1;
  return function (i) {
    void 0 === e
      ? ((e = i), (n = 0), (r = -1))
      : (e = (function (t, e) {
          const n = new Uint8Array(t.length + e.length);
          return n.set(t), n.set(e, t.length), n;
        })(e, i));
    const o = e.length;
    let a = 0;
    for (; n < o; ) {
      s && (10 === e[n] && (a = ++n), (s = !1));
      let i = -1;
      for (; n < o && -1 === i; ++n)
        switch (e[n]) {
          case 58:
            -1 === r && (r = n - a);
            break;
          case 13:
            s = !0;
          case 10:
            i = n;
        }
      if (-1 === i) break;
      t(e.subarray(a, i), r), (a = n), (r = -1);
    }
    a === o ? (e = void 0) : 0 !== a && ((e = e.subarray(a)), (n -= a));
  };
}
var objectWithoutProperties = function (t, e) {
    var n = {};
    for (var r in t)
      Object.prototype.hasOwnProperty.call(t, r) &&
        e.indexOf(r) < 0 &&
        (n[r] = t[r]);
    if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
      var s = 0;
      for (r = Object.getOwnPropertySymbols(t); s < r.length; s++)
        e.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(t, r[s]) &&
          (n[r[s]] = t[r[s]]);
    }
    return n;
  },
  SSE_CONTENT_TYPE = "text/event-stream",
  LAST_EVENT_ID_HEADER = "last-event-id";
function fetchEventSourceStream(t, e) {
  var {
      signal: n,
      headers: r,
      onopen: s,
      onmessage: i,
      onchunk: o,
      onclose: a,
      onerror: c,
      openWhenHidden: u,
      fetch: l,
    } = e,
    d = objectWithoutProperties(e, [
      "signal",
      "headers",
      "onopen",
      "onmessage",
      "onchunk",
      "onclose",
      "onerror",
      "openWhenHidden",
      "fetch",
    ]);
  return new Promise((e, h) => {
    const p = Object.assign({}, r);
    let m;
    function y() {
      m.abort(), document.hidden || A();
    }
    p.accept || (p.accept = SSE_CONTENT_TYPE),
      "undefined" == typeof document ||
        u ||
        document.addEventListener("visibilitychange", y);
    let w = 1e3,
      E = 0;
    function S() {
      "undefined" == typeof document ||
        u ||
        document.removeEventListener("visibilitychange", y),
        clearTimeout(E),
        m.abort();
    }
    null == n ||
      n.addEventListener("abort", () => {
        S(), e();
      });
    const b = null != l ? l : fetch,
      T = null != s ? s : assertEventStreamResponse;
    async function A() {
      var n;
      m = new AbortController();
      try {
        const n = await b(
          t,
          Object.assign(Object.assign({}, d), {
            headers: p,
            signal: m.signal,
          }),
        );
        await T(n);
        const r = createSseLineParser(
          (function (t, e, n) {
            let r = {
              data: "",
              event: "",
              id: "",
              retry: void 0,
            };
            const s = new TextDecoder();
            return function (i, o) {
              if (0 === i.length)
                null == t || t(r),
                  (r = {
                    data: "",
                    event: "",
                    id: "",
                    retry: void 0,
                  });
              else if (o > 0) {
                const t = s.decode(i.subarray(0, o)),
                  a = o + (32 === i[o + 1] ? 2 : 1),
                  c = s.decode(i.subarray(a));
                switch (t) {
                  case "data":
                    r.data = r.data ? r.data + "\n" + c : c;
                    break;
                  case "event":
                    r.event = c;
                    break;
                  case "id":
                    null == e || e((r.id = c));
                    break;
                  case "retry":
                    const t = parseInt(c, 10);
                    isNaN(t) || null == n || n((r.retry = t));
                }
              }
            };
          })(
            i,
            (t) => {
              t
                ? (p[LAST_EVENT_ID_HEADER] = t)
                : delete p[LAST_EVENT_ID_HEADER];
            },
            (t) => {
              w = t;
            },
          ),
        );
        await (async function (t, e) {
          const n = t.getReader();
          let r;
          for (; !(r = await n.read()).done; ) {
            const t = e(r.value);
            null != t && "function" == typeof t.then && (await t);
          }
        })(n.body, o ? (t) => (r(t), o()) : r),
          null == a || a(),
          S(),
          e();
      } catch (r) {
        if (!m.signal.aborted)
          try {
            const t =
              null !== (n = null == c ? void 0 : c(r)) && void 0 !== n ? n : w;
            clearTimeout(E), (E = setTimeout(A, t));
          } catch (s) {
            S(), h(s);
          }
      }
    }
    A();
  });
}
function assertEventStreamResponse(t) {
  const e = t.headers.get("content-type");
  if (!(null == e ? void 0 : e.startsWith("text/event-stream")))
    throw new Error(
      `Expected content-type to be ${SSE_CONTENT_TYPE}, Actual: ${e}`,
    );
}
function createBackoffTimer(t, e) {
  let n,
    r = 0;
  return {
    arm() {
      n ||
        ((r = Math.min(r ? 2 * r : t.first, t.max)),
        (n = setTimeout(() => {
          (n = void 0), e();
        }, r)));
    },
    disarm() {
      clearTimeout(n), (n = void 0), (r = 0);
    },
  };
}
function isValidTabGroupId(t) {
  return "number" == typeof t && Number.isInteger(t) && t >= 0;
}
var sessionTabGroupCache = new Map(),
  TAB_GROUPS_STORAGE_KEY = "mcpSessionTabGroups",
  tabGroupWriteQueue = Promise.resolve(),
  tabGroupIdRemaps = [];
function updateStoredTabGroups(t) {
  return (tabGroupWriteQueue = tabGroupWriteQueue.then(async () => {
    try {
      const e =
        (await chrome.storage.session.get(TAB_GROUPS_STORAGE_KEY))[
          TAB_GROUPS_STORAGE_KEY
        ] ?? {};
      t(e),
        await chrome.storage.session.set({
          [TAB_GROUPS_STORAGE_KEY]: e,
        });
    } catch (e) {}
  }));
}
function getSessionKey(t) {
  return t?.sessionId ?? "__legacy_shared__";
}
async function resolveSessionTabGroupId(t) {
  const e = getSessionKey(t),
    n = sessionTabGroupCache.get(e);
  if (void 0 !== n?.tabGroupId)
    return (n.lastActiveAt = Date.now()), n.tabGroupId;
  const r = tabGroupIdRemaps.length;
  let s = await (async function (t) {
    await tabGroupWriteQueue;
    try {
      const e = (await chrome.storage.session.get(TAB_GROUPS_STORAGE_KEY))[
        TAB_GROUPS_STORAGE_KEY
      ]?.[t];
      return isValidTabGroupId(e) ? e : void 0;
    } catch {
      return;
    }
  })(e);
  const i = sessionTabGroupCache.get(e);
  if (void 0 !== i?.tabGroupId) return i.tabGroupId;
  for (const { from: o, to: a } of tabGroupIdRemaps.slice(r))
    s === o && (s = a);
  return (
    sessionTabGroupCache.set(e, {
      tabGroupId: s,
      lastActiveAt: Date.now(),
    }),
    s
  );
}
function setSessionTabGroupId(t, e) {
  const n = getSessionKey(t);
  sessionTabGroupCache.set(n, {
    tabGroupId: e,
    lastActiveAt: Date.now(),
  }),
    updateStoredTabGroups((t) => {
      t[n] = e;
    });
}
function remapTabGroupId(t, e) {
  if (t !== e) {
    tabGroupIdRemaps.push({
      from: t,
      to: e,
    });
    for (const n of sessionTabGroupCache.values())
      n.tabGroupId === t && (n.tabGroupId = e);
    updateStoredTabGroups((n) => {
      for (const [r, s] of Object.entries(n)) s === t && (n[r] = e);
    });
  }
}
function countSessionsWithTabGroup() {
  let t = 0;
  for (const e of sessionTabGroupCache.values()) void 0 !== e.tabGroupId && t++;
  return t;
}
var SCREENSHOT_TTL_MS = 3e5,
  SCREENSHOT_MAX_BYTES = 8388608,
  SCREENSHOT_KEY_PREFIX = "screenshotBytes:";
function screenshotSessionKey(t) {
  return getSessionKey(t);
}
function screenshotStorageKey(t, e) {
  return `${SCREENSHOT_KEY_PREFIX}${encodeURIComponent(t)}:${e}`;
}
function hasSessionStorage() {
  return (
    "undefined" != typeof chrome &&
    !!chrome.storage?.session &&
    "function" == typeof chrome.storage.session.get
  );
}
var screenshotCache = new (class {
  entries = new Map();
  totalEncodedBytes = 0;
  set(t, e, n, r) {
    if (!e || !n) return;
    if (n.length > SCREENSHOT_MAX_BYTES) return;
    this.sweepOrphansOnce();
    const s = screenshotStorageKey(screenshotSessionKey(t), e);
    this.remove(s);
    const i = {
      data: n,
      mimeType: r,
      storedAt: Date.now(),
    };
    this.entries.set(s, i),
      (this.totalEncodedBytes += n.length),
      this.evictToBudget(),
      hasSessionStorage() &&
        chrome.storage.session
          .set({
            [s]: i,
          })
          .catch((t) => {});
  }
  async get(t, e) {
    this.sweepOrphansOnce();
    const n = screenshotStorageKey(screenshotSessionKey(t), e);
    let r = this.entries.get(n);
    if (!r && hasSessionStorage())
      try {
        const t = (await chrome.storage.session.get(n))?.[n],
          e =
            t &&
            "string" == typeof t.data &&
            "string" == typeof t.mimeType &&
            "number" == typeof t.storedAt &&
            Date.now() - t.storedAt <= SCREENSHOT_TTL_MS;
        e && !this.entries.has(n)
          ? ((r = t),
            this.entries.set(n, r),
            (this.totalEncodedBytes += r.data.length),
            this.evictToBudget())
          : this.entries.has(n)
            ? (r = this.entries.get(n))
            : t && !e && chrome.storage.session.remove(n).catch(() => {});
      } catch (s) {}
    if (r) {
      if (!(Date.now() - r.storedAt > SCREENSHOT_TTL_MS))
        return (
          this.entries.delete(n),
          this.entries.set(n, r),
          {
            data: r.data,
            mimeType: r.mimeType,
          }
        );
      this.remove(n);
    }
  }
  deleteByImageId(t) {
    if (!t) return;
    const e = `:${t}`;
    for (const n of [...this.entries.keys()]) n.endsWith(e) && this.remove(n);
  }
  remove(t) {
    const e = this.entries.get(t);
    e && ((this.totalEncodedBytes -= e.data.length), this.entries.delete(t)),
      hasSessionStorage() && chrome.storage.session.remove(t).catch(() => {});
  }
  evictToBudget() {
    for (const [t] of this.entries) {
      if (this.totalEncodedBytes <= SCREENSHOT_MAX_BYTES) break;
      this.remove(t);
    }
  }
  sweepStarted = !1;
  sweepOrphansOnce() {
    !this.sweepStarted &&
      hasSessionStorage() &&
      ((this.sweepStarted = !0),
      (async () => {
        try {
          const t = await chrome.storage.session.get(null),
            e = Date.now(),
            n = [],
            r = [];
          for (const i of Object.keys(t)) {
            if (!i.startsWith(SCREENSHOT_KEY_PREFIX)) continue;
            const s = t[i];
            "string" != typeof s?.data ||
            "string" != typeof s?.mimeType ||
            "number" != typeof s?.storedAt ||
            e - s.storedAt > SCREENSHOT_TTL_MS
              ? n.push(i)
              : this.entries.has(i) || r.push([i, s]);
          }
          n.length > 0 && (await chrome.storage.session.remove(n)),
            r.sort((t, e) => t[1].storedAt - e[1].storedAt);
          const s = [];
          for (const [i, o] of r)
            this.entries.has(i) ||
              (s.push([i, o]), (this.totalEncodedBytes += o.data.length));
          s.length > 0 && (this.entries = new Map([...s, ...this.entries])),
            this.evictToBudget();
        } catch (t) {}
      })());
  }
  _clearForTesting() {
    this.entries.clear(),
      (this.totalEncodedBytes = 0),
      (this.sweepStarted = !1);
  }
})();
function isKnownTransportType(t) {
  return "bridge" === t || "native-messaging" === t || "sidepanel-iframe" === t;
}
async function clearScreenshotCache() {
  if ((screenshotCache._clearForTesting(), hasSessionStorage())) {
    const t = await chrome.storage.session.get(null),
      e = Object.keys(t).filter((t) => t.startsWith(SCREENSHOT_KEY_PREFIX));
    e.length > 0 && (await chrome.storage.session.remove(e));
  }
}
var StorageKey = (function (t) {
    return (
      (t.ACCESS_TOKEN = "accessToken"),
      (t.REFRESH_TOKEN = "refreshToken"),
      (t.TOKEN_EXPIRY = "tokenExpiry"),
      (t.OAUTH_STATE = "oauthState"),
      (t.CODE_VERIFIER = "codeVerifier"),
      (t.SIGN_IN_STATE = "signInState"),
      (t.OAUTH_ORG_SWITCH = "oauthOrgSwitch"),
      (t.LAST_AUTH_FAILURE_REASON = "lastAuthFailureReason"),
      (t.ACCOUNT_UUID = "accountUuid"),
      (t.TOKEN_ORG = "tokenOrg"),
      (t.POSTURE = "posture"),
      (t.LAST_HYBRID_PAIRING = "lastHybridPairing"),
      (t.PAIRING_ORG_MISMATCH = "pairingOrgMismatch"),
      (t.LAST_ACTIVE_ORG_HINT = "lastActiveOrgHint"),
      (t.STARTUP_REAUTH_STATE = "startupReauthState"),
      (t.ANTHROPIC_API_KEY = "anthropicApiKey"),
      (t.SELECTED_MODEL = "selectedModel"),
      (t.SYSTEM_PROMPT = "systemPrompt"),
      (t.DEBUG_MODE = "debugMode"),
      (t.MODEL_SELECTOR_DEBUG = "modelSelectorDebug"),
      (t.SHOW_TRACE_IDS = "showTraceIds"),
      (t.SHOW_SYSTEM_REMINDERS = "showSystemReminders"),
      (t.PERF_TRACE_PILL = "perfTracePill"),
      (t.SAVE_TIMESTAMPED_SCREENSHOTS = "saveTimestampedScreenshots"),
      (t.USE_SESSIONS_API = "useSessionsAPI"),
      (t.SESSIONS_API_HOSTNAME = "sessionsApiHostname"),
      (t.BROWSER_CONTROL_PERMISSION_ACCEPTED =
        "browserControlPermissionAccepted"),
      (t.PERMISSION_STORAGE = "permissionStorage"),
      (t.LAST_PERMISSION_MODE_PREFERENCE = "lastPermissionModePreference"),
      (t.PERMISSION_CONSENT_OWNER = "permissionConsentOwner"),
      (t.PERMISSION_CONSENT_BY_ACCOUNT = "permissionConsentByAccount"),
      (t.ANONYMOUS_ID = "anonymousId"),
      (t.TEST_DATA_MESSAGES = "test_data_messages"),
      (t.SCHEDULED_TASK_LOGS = "scheduledTaskLogs"),
      (t.SCHEDULED_TASK_STATS = "scheduledTaskStats"),
      (t.PENDING_SCHEDULED_TASK = "pendingScheduledTask"),
      (t.UPDATE_AVAILABLE = "updateAvailable"),
      (t.TIP_DISPLAY_COUNTS = "tipDisplayCounts"),
      (t.NOTIFICATIONS_ENABLED = "notificationsEnabled"),
      (t.ANNOUNCEMENT_DISMISSED = "announcementDismissed"),
      (t.MODEL_OVERRIDE_SEEN = "modelOverrideSeen"),
      (t.SAVED_PROMPTS = "savedPrompts"),
      (t.SAVED_PROMPT_CATEGORIES = "savedPromptCategories"),
      (t.SKILL_SCHEDULES = "skillSchedules"),
      (t.SKILL_MIGRATION_DONE = "skillMigrationDone"),
      (t.SKILL_CUTOVER_APPLIED = "skillCutoverApplied"),
      (t.SKILL_SCHEDULE_UNLINKED_DISMISSED = "skillScheduleUnlinkedDismissed"),
      (t.SKILL_SCHEDULE_RETIRED_SOURCES = "skillScheduleRetiredSources"),
      (t.DEV_SKILL_MIGRATION_MODE = "devSkillMigrationMode"),
      (t.TAB_GROUPS = "tabGroups"),
      (t.DISMISSED_TAB_GROUPS = "dismissedTabGroups"),
      (t.MCP_TAB_GROUP_ID = "mcpTabGroupId"),
      (t.MCP_CONNECTED = "mcpConnected"),
      t
    );
  })({}),
  SESSION_STORAGE_KEYS = new Set([
    "accessToken",
    "refreshToken",
    "tokenExpiry",
    "startupReauthState",
    "posture",
    "pairingOrgMismatch",
  ]);
function getStorageAreaName(t) {
  return SESSION_STORAGE_KEYS.has(t) ? "session" : "local";
}
function restrictLocalStorageToTrustedContexts() {
  chrome.storage.local
    .setAccessLevel?.({
      accessLevel: "TRUSTED_CONTEXTS",
    })
    .catch(() => {});
}
function getStorageArea(t) {
  return chrome.storage[getStorageAreaName(t)];
}
function partitionKeysByArea(t) {
  const e = [],
    n = [];
  for (const r of t) (SESSION_STORAGE_KEYS.has(r) ? e : n).push(r);
  return {
    session: e,
    local: n,
  };
}
async function getStoredValue(t, e) {
  const n = await getStorageArea(t).get(t);
  return void 0 !== n[t] ? n[t] : e;
}
async function setStoredValue(t, e) {
  await getStorageArea(t).set({
    [t]: e,
  });
}
async function removeStoredKeys(t) {
  const { session: e, local: n } = partitionKeysByArea(
    Array.isArray(t) ? t : [t],
  );
  await Promise.all([
    e.length ? chrome.storage.session.remove(e) : void 0,
    e.length + n.length ? chrome.storage.local.remove([...n, ...e]) : void 0,
  ]);
}
async function getStoredValues(t) {
  const { session: e, local: n } = partitionKeysByArea(t),
    [r, s] = await Promise.all([
      e.length ? chrome.storage.session.get(e) : {},
      n.length ? chrome.storage.local.get(n) : {},
    ]);
  return {
    ...s,
    ...r,
  };
}
async function setStoredValues(t) {
  const { session: e, local: n } = partitionKeysByArea(Object.keys(t)),
    r = (e) => Object.fromEntries(e.map((e) => [e, t[e]]));
  await Promise.all([
    e.length ? chrome.storage.session.set(r(e)) : void 0,
    n.length ? chrome.storage.local.set(r(n)) : void 0,
  ]);
}
var KEYS_PRESERVED_ON_LOGOUT = new Set([
  "anonymousId",
  "updateAvailable",
  "permissionConsentByAccount",
  "posture",
]);
var PERMISSION_STORAGE_KEYS = [
    "browserControlPermissionAccepted",
    "permissionStorage",
    "lastPermissionModePreference",
  ],
  PROFILE_CACHE_KEY = "swAnalyticsProfileCache";
async function clearAccountStorage() {
  await removeStoredKeys(
    Object.values(StorageKey).filter((t) => !KEYS_PRESERVED_ON_LOGOUT.has(t)),
  );
  try {
    await chrome.storage.session.remove(PROFILE_CACHE_KEY);
  } catch {}
  try {
    await clearScreenshotCache();
  } catch {}
  try {
    await removeStoredKeys([
      "accountUuid",
      "permissionStorage",
      "skillSchedules",
      "skillMigrationDone",
      "skillCutoverApplied",
      "skillScheduleRetiredSources",
      "skillScheduleUnlinkedDismissed",
      "pendingScheduledTask",
    ]),
      await chrome.storage.session.remove(PROFILE_CACHE_KEY),
      await clearScreenshotCache();
  } catch {}
}
function derivePosture(t, e) {
  const { identity: n, awaiting: r } = t,
    { orgs: s } = t.policy,
    i = n ? t.pairedPeer : null,
    o =
      !!r &&
      (!n || identityMatchesAwaiting(n, r)) &&
      (!s || !r.orgUuid || s.includes(r.orgUuid)),
    a = i?.hybrid ? "pairing" : o ? "resuming" : null;
  return Object.freeze({
    managed: null !== a,
    source: a,
    allowedOrgs: s,
    pairedPeer: i,
    identity: n,
    awaiting: r,
    gen: e,
  });
}
function isSameIdentity(t, e) {
  return (
    t === e ||
    (!!t && !!e && t.accountUuid === e.accountUuid && t.orgUuid === e.orgUuid)
  );
}
function identityMatchesAwaiting(t, e) {
  return (
    t.orgUuid === e.orgUuid &&
    (t.accountUuid === e.accountUuid ||
      null === t.accountUuid ||
      null === e.accountUuid)
  );
}
function isMeaningfulIdentityChange(t, e) {
  return (
    !isSameIdentity(t, e) &&
    !(
      t &&
      e &&
      null === t.accountUuid &&
      null !== e.accountUuid &&
      t.orgUuid === e.orgUuid
    )
  );
}
function areStringArraysEqual(t, e) {
  return (
    t === e ||
    (!!t && !!e && t.length === e.length && t.every((t, n) => t === e[n]))
  );
}
var postureInputs,
  currentPosture,
  resolveFirstPosture,
  postureQueue = Promise.resolve(),
  mirroredPostureGen = 0,
  postureMirrorDirty = !1,
  postureMirrorRetryTimer = createBackoffTimer(
    {
      first: 1e3,
      max: 3e4,
    },
    () => {
      enqueuePostureUpdate({}).catch(() => {});
    },
  ),
  PostureMirrorWriteError = class extends Error {
    posture;
    constructor(t, e) {
      super("posture mirror write failed", {
        cause: e,
      }),
        (this.posture = t);
    }
  },
  postureChangeListeners = [],
  postureInterceptors = [],
  firstPosturePromise = new Promise((t) => {
    resolveFirstPosture = t;
  });
function addPostureInterceptor(t) {
  return (
    postureInterceptors.push(t),
    () => {
      const e = postureInterceptors.indexOf(t);
      e >= 0 && postureInterceptors.splice(e, 1);
    }
  );
}
function addPostureChangeListener(t) {
  return (
    postureChangeListeners.push(t),
    () => {
      const e = postureChangeListeners.indexOf(t);
      e >= 0 && postureChangeListeners.splice(e, 1);
    }
  );
}
function getCurrentPosture() {
  return currentPosture;
}
function isPostureManaged() {
  return currentPosture?.managed ?? !0;
}
function waitForFirstPosture() {
  return firstPosturePromise;
}
async function applyPostureInput(t) {
  if (!postureInputs)
    throw new Error("posture: an input applied before the boot derive");
  const e = postureInputs.awaiting,
    n = "function" == typeof t ? await t() : t;
  postureInputs = {
    ...postureInputs,
    ...n,
  };
  const r = currentPosture ? currentPosture.gen + 1 : 1;
  let s = derivePosture(postureInputs, r);
  for (const u of postureInterceptors)
    try {
      const t = u(currentPosture, s);
      t &&
        (s = derivePosture(
          (postureInputs = {
            ...postureInputs,
            ...t,
          }),
          r,
        ));
    } catch (c) {}
  if (
    ((function (t, e, n) {
      const r = "awaiting" in e && !isSameIdentity(n, e.awaiting ?? null);
      if (!postureMirrorDirty && isSameIdentity(n, t) && !r) return;
      (postureMirrorDirty = !1),
        (n
          ? setStoredValue(StorageKey.LAST_HYBRID_PAIRING, n)
          : removeStoredKeys(StorageKey.LAST_HYBRID_PAIRING)
        ).then(
          () => {
            mirroredPostureGen === currentPosture?.gen &&
              postureMirrorRetryTimer.disarm();
          },
          (t) => {
            (postureMirrorDirty = !0), postureMirrorRetryTimer.arm();
          },
        );
    })(e, n, postureInputs.awaiting),
    currentPosture &&
      ((o = s),
      (i = currentPosture).source === o.source &&
        areStringArraysEqual(i.allowedOrgs, o.allowedOrgs) &&
        (function (t, e) {
          return (
            t === e ||
            (!!t &&
              !!e &&
              t.sub === e.sub &&
              t.org === e.org &&
              t.hybrid === e.hybrid)
          );
        })(i.pairedPeer, o.pairedPeer) &&
        isSameIdentity(i.identity, o.identity) &&
        !!i.identity?.hybrid == !!o.identity?.hybrid &&
        isSameIdentity(i.awaiting, o.awaiting)))
  )
    return mirroredPostureGen === currentPosture.gen
      ? currentPosture
      : mirrorPostureToSession(currentPosture);
  var i, o;
  const a = currentPosture;
  currentPosture = s;
  for (const u of postureChangeListeners)
    try {
      u(a, s);
    } catch (c) {}
  return (
    resolveFirstPosture?.(s),
    (resolveFirstPosture = void 0),
    mirrorPostureToSession(s)
  );
}
async function mirrorPostureToSession(t) {
  try {
    await chrome.storage.session.set({
      [StorageKey.POSTURE]: t,
    });
  } catch (e) {
    throw (postureMirrorRetryTimer.arm(), new PostureMirrorWriteError(t, e));
  }
  return (
    (mirroredPostureGen = t.gen),
    postureMirrorDirty || postureMirrorRetryTimer.disarm(),
    t
  );
}
function enqueuePostureUpdate(t) {
  const e = postureQueue.then(() => applyPostureInput(t));
  return (postureQueue = e.catch(() => {})), e;
}
function initPostureInputs(t) {
  const e = postureQueue.then(
    async () => (
      (postureInputs = await t().catch((t) => ({
        policy: {
          orgs: null,
        },
        pairedPeer: null,
        identity: null,
        awaiting: null,
      }))),
      applyPostureInput({})
    ),
  );
  return (postureQueue = e.catch(() => {})), e;
}
function parsePosture(t) {
  const e = t;
  return e && "object" == typeof e && "number" == typeof e.gen ? e : void 0;
}
var GET_POSTURE_MESSAGE = "get_posture";
async function readPosture() {
  if ("ServiceWorkerGlobalScope" in globalThis)
    return await firstPosturePromise, currentPosture;
  try {
    const t = parsePosture(
      (await chrome.storage.session.get(StorageKey.POSTURE))[
        StorageKey.POSTURE
      ],
    );
    if (t) return t;
  } catch (t) {}
  return (async function () {
    try {
      return parsePosture(
        await chrome.runtime.sendMessage({
          type: GET_POSTURE_MESSAGE,
        }),
      );
    } catch (t) {
      return;
    }
  })();
}
function onPostureStorageChange(t) {
  const e = (e, n) => {
    const r = "session" === n && e[StorageKey.POSTURE];
    r && t(parsePosture(r.oldValue), parsePosture(r.newValue));
  };
  return (
    chrome.storage.onChanged.addListener(e),
    () => chrome.storage.onChanged.removeListener(e)
  );
}
var BLOCKED_URL_PATTERNS_KEY = "blockedUrlPatterns",
  FORCE_LOGIN_ORG_KEY = "forceLoginOrgUUID";
function parseTokenOrg(t) {
  const e = t;
  return e && "object" == typeof e && "string" == typeof e.uuid
    ? {
        uuid: e.uuid.toLowerCase(),
        hybrid: !0 === e.hybrid,
      }
    : null;
}
function parseForcedLoginOrgs(t) {
  if ("string" != typeof t) return null;
  const e = t.trim();
  if (!e) return null;
  if (e.startsWith("[")) {
    try {
      const t = JSON.parse(e);
      if (
        Array.isArray(t) &&
        t.length > 0 &&
        t.every((t) => "string" == typeof t)
      )
        return t.map((t) => t.trim().toLowerCase());
      if (Array.isArray(t) && 0 === t.length) return null;
    } catch {
      return null;
    }
    return null;
  }
  return [e.toLowerCase()];
}
function urlMatchesBlockPattern(t, e) {
  let n;
  try {
    n = new URL(/^https?:\/\//.test(t) ? t : `https://${t}`);
  } catch {
    return !1;
  }
  const r =
    n.hostname
      .toLowerCase()
      .replace(/\.$/, "")
      .replace(/^www\./, "") + n.pathname.toLowerCase();
  let s = e
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^([^/]*)\.(?=\/|$)/, "$1")
    .replace(/\/$/, "/*");
  s.includes("/") || (s += "/*");
  const i = s
    .split("*")
    .map((t) => t.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${i}$`).test(r);
}
var IDENTITY_STORAGE_KEYS = {
    local: [StorageKey.ACCOUNT_UUID, StorageKey.TOKEN_ORG],
    session: [StorageKey.ACCESS_TOKEN, StorageKey.REFRESH_TOKEN],
  },
  DesktopManagedState = class {
    static blockedUrlPatterns = null;
    static listenerRegistered = !1;
    static async isUrlBlockedByManagedPolicy(t) {
      null === this.blockedUrlPatterns &&
        ((this.blockedUrlPatterns = await this.loadBlockedUrlPatterns()),
        this.registerChangeListener());
      for (const e of this.blockedUrlPatterns)
        if (urlMatchesBlockPattern(t, e)) return !0;
      return !1;
    }
    static async isDesktopManaged() {
      return (await readPosture())?.managed ?? !0;
    }
    static async refusesClearText() {
      if (await this.isDesktopManaged()) return !0;
      try {
        const t = await getStoredValue(StorageKey.TOKEN_ORG);
        return parseTokenOrg(t)?.hybrid ?? null != t;
      } catch {
        return !0;
      }
    }
    static async desktopManagedBy() {
      return (await readPosture())?.source;
    }
    static async getForcedLoginOrgUUIDs() {
      return (await readPosture())?.allowedOrgs;
    }
    static async readPolicy() {
      try {
        return {
          orgs: parseForcedLoginOrgs(
            (await chrome.storage.managed.get(FORCE_LOGIN_ORG_KEY))[
              FORCE_LOGIN_ORG_KEY
            ],
          ),
        };
      } catch (t) {
        return;
      }
    }
    static async readPolicyOrRetry() {
      const t = await this.readPolicy();
      return (
        this.retry("policy", void 0 === t),
        t ?? {
          orgs: null,
        }
      );
    }
    static async reloadPolicy() {
      await enqueuePostureUpdate(async () => ({
        policy: await this.readPolicyOrRetry(),
      }));
    }
    static async readIdentity() {
      const [t, e] = await Promise.all([
        chrome.storage.local.get(IDENTITY_STORAGE_KEYS.local),
        chrome.storage.session.get(IDENTITY_STORAGE_KEYS.session),
      ]);
      if (IDENTITY_STORAGE_KEYS.session.every((t) => !e[t])) return null;
      const n = t[StorageKey.ACCOUNT_UUID],
        r = parseTokenOrg(t[StorageKey.TOKEN_ORG]);
      return {
        accountUuid: "string" == typeof n ? n : null,
        orgUuid: r?.uuid ?? null,
        hybrid: !0 === r?.hybrid,
      };
    }
    static readIdentityOrRetry() {
      return this.readOrRetry("identity", () => this.readIdentity());
    }
    static reloadIdentity() {
      return this.reload("identity");
    }
    static async readAwaiting() {
      const t = await getStoredValue(StorageKey.LAST_HYBRID_PAIRING),
        e = t?.accountUuid,
        n = t?.orgUuid;
      return !t ||
        (null !== e && "string" != typeof e) ||
        (null !== n && "string" != typeof n)
        ? null
        : {
            accountUuid: e,
            orgUuid: n,
          };
    }
    static readAwaitingOrRetry() {
      return this.readOrRetry("awaiting", () => this.readAwaiting());
    }
    static reloadAwaiting() {
      return this.reload("awaiting");
    }
    static async readOrRetry(t, e) {
      try {
        const n = await e();
        return this.retry(t, !1), n;
      } catch (n) {
        return void this.retry(t, !0);
      }
    }
    static async reload(t) {
      await enqueuePostureUpdate(async () => {
        const e = await ("identity" === t
            ? this.readIdentityOrRetry()
            : this.readAwaitingOrRetry()),
          n = {};
        return void 0 !== e && (n[t] = e), n;
      });
    }
    static forgetHybridPairing() {
      return enqueuePostureUpdate({
        awaiting: null,
      }).then(
        () => {},
        () => {},
      );
    }
    static RETRY_MS = {
      first: 5e3,
      max: 3e4,
    };
    static retries = {
      policy: createBackoffTimer(this.RETRY_MS, () => {
        this.reloadPolicy().catch(() => {});
      }),
      identity: createBackoffTimer(this.RETRY_MS, () => {
        this.reloadIdentity().catch(() => {});
      }),
      awaiting: createBackoffTimer(this.RETRY_MS, () => {
        this.reloadAwaiting().catch(() => {});
      }),
    };
    static retry(t, e) {
      e ? this.retries[t].arm() : this.retries[t].disarm();
    }
    static registerChangeListener() {
      if (this.listenerRegistered) return;
      this.listenerRegistered = !0;
      const t = "ServiceWorkerGlobalScope" in globalThis;
      chrome.storage.onChanged.addListener((e, n) => {
        if ("managed" === n)
          return (
            e[BLOCKED_URL_PATTERNS_KEY] &&
              this.loadBlockedUrlPatterns().then((t) => {
                this.blockedUrlPatterns = t;
              }),
            void (
              t &&
              e[FORCE_LOGIN_ORG_KEY] &&
              this.reloadPolicy().catch((t) => {})
            )
          );
        t &&
          ("local" === n || "session" === n) &&
          IDENTITY_STORAGE_KEYS[n].some((t) => t in e) &&
          this.reloadIdentity().catch((t) => {});
      });
    }
    static async loadBlockedUrlPatterns() {
      try {
        const t = (await chrome.storage.managed.get(BLOCKED_URL_PATTERNS_KEY))[
          BLOCKED_URL_PATTERNS_KEY
        ];
        return Array.isArray(t)
          ? t.filter((t) => "string" == typeof t && t.length > 0)
          : [];
      } catch (t) {
        return [];
      }
    }
    static _resetForTests() {
      (this.blockedUrlPatterns = null), (this.listenerRegistered = !1);
      for (const t of Object.values(this.retries)) t.disarm();
    }
  },
  React = toEsModule(requireReact(), 1),
  OAUTH_PROFILE_PATH = "/api/oauth/profile";
async function assertNotDesktopManaged(t) {
  if (
    "/api/oauth/profile" !== t &&
    (await DesktopManagedState.isDesktopManaged())
  )
    throw new Error(
      `API request withheld while managed by Claus Desktop: ${t.split("?")[0]}`,
    );
}
var apiClient = new (class {
    baseURL;
    constructor() {
      const t = getEnvironmentConfig();
      this.baseURL = t.apiBaseUrl;
    }
    async fetch(t, e = {}) {
      await assertNotDesktopManaged(t);
      const n = await getAccessTokenFromAnyContext();
      if (!n) throw new Error("No valid OAuth token available");
      await assertNotDesktopManaged(t);
      const r = `${this.baseURL}${t}`,
        s = {
          Authorization: `Bearer ${n}`,
          "Content-Type": "application/json",
          "anthropic-client-platform": "claude_browser_extension",
          "anthropic-client-version": chrome.runtime.getManifest().version,
          ...e.headers,
        },
        i = await fetch(r, {
          ...e,
          headers: s,
        });
      if (!i.ok)
        throw new Error(`API request failed: ${i.status} ${i.statusText}`);
      const o = i.headers.get("content-type");
      return 204 === i.status
        ? null
        : o?.includes("application/json")
          ? i.json()
          : o
            ? i.blob()
            : null;
    }
    async fetchEventSource(t, e) {
      await assertNotDesktopManaged(t);
      const n = await getAccessTokenFromAnyContext();
      if (!n) throw new Error("No valid OAuth token available for SSE stream");
      await assertNotDesktopManaged(t);
      const r = `${this.baseURL}${t}`,
        s = new AbortController();
      return (
        await fetchEventSourceStream(r, {
          ...e,
          headers: {
            Authorization: `Bearer ${n}`,
            "anthropic-client-platform": "claude_browser_extension",
            "anthropic-client-version": chrome.runtime.getManifest().version,
            ...e.headers,
          },
          signal: e.signal || s.signal,
        }),
        () => {
          s.abort();
        }
      );
    }
  })(),
  FeatureFlagStore = class {
    config;
    features = null;
    cacheTimestamp = null;
    initPromise = null;
    isRefreshing = !1;
    refreshFailures = 0;
    retryNotBefore = 0;
    constructor(t) {
      this.config = {
        ...t,
        cacheTTL: t.cacheTTL ?? 3e5,
        storageKey: t.storageKey ?? "features",
      };
    }
    setOnFeaturesUpdated(t) {
      this.config.onFeaturesUpdated = t;
    }
    async hydrateFromStorage() {
      if (this.features) return;
      const t = await this.readStoredCache();
      t?.payload?.features &&
        ((this.features = t.payload.features),
        (this.cacheTimestamp = t.timestamp));
    }
    async loadFromCache() {
      const t = await this.readStoredCache();
      return t &&
        t.payload &&
        t.timestamp &&
        Date.now() - t.timestamp < this.config.cacheTTL
        ? t
        : null;
    }
    async storedCacheApplies() {
      return !(await DesktopManagedState.isDesktopManaged());
    }
    async readStoredCache() {
      try {
        if (!(await this.storedCacheApplies())) return;
        return (await chrome.storage.local.get(this.config.storageKey))[
          this.config.storageKey
        ];
      } catch (t) {
        return;
      }
    }
    async saveToCache(t) {
      try {
        if (!(await this.storedCacheApplies())) return;
        const e = {
          payload: t,
          timestamp: Date.now(),
        };
        await chrome.storage.local.set({
          [this.config.storageKey]: e,
        });
      } catch (e) {}
    }
    async fetchAndUpdate() {
      try {
        const t = !1 !== (await readPosture())?.managed,
          e = t
            ? {
                features: {},
              }
            : await this.config.fetchFeatures();
        if ((!1 !== (await readPosture())?.managed) !== t) return;
        (this.features = e.features),
          (this.cacheTimestamp = Date.now()),
          (this.refreshFailures = 0),
          (this.retryNotBefore = 0),
          await this.saveToCache(e),
          this.config.onFeaturesUpdated?.(e.features);
      } catch (t) {
        throw (
          ((this.refreshFailures += 1),
          (this.retryNotBefore =
            Date.now() +
            Math.min(
              3e4 * 2 ** (this.refreshFailures - 1),
              this.config.cacheTTL,
            )),
          t)
        );
      }
    }
    checkAndRefreshIfStale() {
      if (
        !(
          !this.cacheTimestamp ||
          this.isRefreshing ||
          Date.now() < this.retryNotBefore
        )
      )
        return Date.now() - this.cacheTimestamp > this.config.cacheTTL
          ? ((this.isRefreshing = !0),
            this.fetchAndUpdate()
              .catch((t) => {})
              .finally(() => {
                this.isRefreshing = !1;
              }))
          : void 0;
    }
    async initialize() {
      if (!this.features)
        return (
          this.initPromise ||
            (this.initPromise = (async () => {
              const t = await this.loadFromCache();
              if (t) {
                if (
                  ((this.features = t.payload.features),
                  (this.cacheTimestamp = t.timestamp),
                  this.config.onFeaturesUpdated?.(t.payload.features),
                  Date.now() - t.timestamp > this.config.cacheTTL / 2)
                ) {
                  this.isRefreshing = !0;
                  try {
                    await this.fetchAndUpdate();
                  } catch (e) {
                  } finally {
                    this.isRefreshing = !1;
                  }
                }
              } else
                try {
                  await this.fetchAndUpdate();
                } catch {}
            })()),
          this.initPromise
        );
    }
    getFeatureValue(t, e) {
      this.checkAndRefreshIfStale();
      const n = this.features?.[t];
      return n && void 0 !== n.value && null !== n.value ? n.value : e;
    }
    async getFeatureValueAsync(t, e) {
      await this.checkAndRefreshIfStale();
      const n = this.features?.[t];
      return n && void 0 !== n.value && null !== n.value ? n.value : e;
    }
    isFeatureEnabled(t) {
      return this.checkAndRefreshIfStale(), this.features?.[t]?.on ?? !1;
    }
    async isFeatureEnabledAsync(t) {
      return await this.checkAndRefreshIfStale(), this.features?.[t]?.on ?? !1;
    }
    getFeature(t) {
      return this.checkAndRefreshIfStale(), this.features?.[t];
    }
    async getFeatureAsync(t) {
      return await this.checkAndRefreshIfStale(), this.features?.[t];
    }
    async refresh() {
      await this.fetchAndUpdate();
    }
    isReady() {
      return null !== this.features;
    }
  },
  FEATURE_BOOTSTRAP_NAME = "claude_in_chrome";
function wrapAsAsyncFn(t) {
  return async () => t();
}
var fetchFeaturesViaApiClient = wrapAsAsyncFn(() =>
    apiClient.fetch(`/api/bootstrap/features/${FEATURE_BOOTSTRAP_NAME}`),
  ),
  featureStoreInstance = null;
var FeatureContext = (0, React.createContext)(null);
function FeatureProvider({ children: t }) {
  const [e, n] = (0, React.useState)(null),
    [r, s] = (0, React.useState)(!1),
    [o, a] = (0, React.useState)(null),
    c = (0, React.useRef)(null);
  (0, React.useEffect)(() => {
    const t = (t) => {
        n(t), a(null);
      },
      e = (function (t) {
        return (
          featureStoreInstance ||
            (featureStoreInstance = new FeatureFlagStore({
              fetchFeatures: fetchFeaturesViaApiClient,
              onFeaturesUpdated: t,
            })),
          featureStoreInstance
        );
      })(t);
    (c.current = e),
      e.setOnFeaturesUpdated(t),
      e
        .initialize()
        .then(() => {
          s(!0);
        })
        .catch((t) => {
          a(t instanceof Error ? t : new Error(String(t))), s(!0);
        });
  }, []);
  const u = (0, React.useCallback)(
      (t, e) => (c.current ? c.current.getFeatureValue(t, e) : e),
      [e],
    ),
    l = (0, React.useCallback)(
      (t) => !!c.current && c.current.isFeatureEnabled(t),
      [e],
    ),
    d = (0, React.useCallback)(
      (t) => {
        if (c.current) return c.current.getFeature(t);
      },
      [e],
    ),
    h = (0, React.useCallback)((t) => void 0 !== e?.[t], [e]),
    p = (0, React.useCallback)(async () => {
      c.current && (await c.current.refresh());
    }, []);
  (0, React.useEffect)(() => {}, [e]);
  const f = null !== e,
    m = (0, React.useMemo)(
      () => ({
        isReady: r,
        hasPayload: f,
        error: o,
        getFeatureValue: u,
        isFeatureEnabled: l,
        getFeature: d,
        hasFeature: h,
        refresh: p,
      }),
      [r, f, o, u, l, d, h, p],
    );
  return (0, jsxRuntime.jsx)(FeatureContext.Provider, {
    value: m,
    children: t,
  });
}
function peekFeatureValue(t) {
  if (featureStoreInstance && featureStoreInstance.isReady())
    return featureStoreInstance.getFeature(t)?.value;
}
function useFeatures() {
  const t = (0, React.useContext)(FeatureContext);
  if (!t) throw new Error("useFeatures must be used within a FeatureProvider");
  return t;
}
// Claus never fetches remote flags, so every flag falls back to the caller's inline default. Callers pass fresh
// object literals ({}), and effects that depend on them would re-run (and set state) on every render forever.
// Keep one stable default object per flag.
var stableFeatureDefaults = new Map();
function useFeatureValue(t, e) {
  const { getFeatureValue: n } = useFeatures(),
    r = n(t, e);
  if (r === e && null !== e && "object" == typeof e) {
    const n = stableFeatureDefaults.get(t);
    if (n && JSON.stringify(n) === JSON.stringify(e)) return n;
    stableFeatureDefaults.set(t, e);
  }
  return r;
}
function useFeatureEnabled(t) {
  const { isFeatureEnabled: e } = useFeatures();
  return e(t);
}
function useFeaturesReady() {
  const { isReady: t } = useFeatures();
  return t;
}
function useHasFeaturePayload() {
  const { hasPayload: t } = useFeatures();
  return t;
}
var TOKEN_KEYS = [
    StorageKey.ACCESS_TOKEN,
    StorageKey.REFRESH_TOKEN,
    StorageKey.TOKEN_EXPIRY,
  ],
  TOKEN_KEYS_WITH_HANDOFF = [...TOKEN_KEYS, "tokenHandOffAt"],
  authResetCounter = 0,
  getAuthResetCounter = () => authResetCounter;
function clearStoredKeys(...t) {
  return removeStoredKeys(t);
}
var tokenMigrationPromise = null;
var featureStoreSingleton = null,
  featureUpdateListeners = new Set();
function addFeatureUpdateListener(t) {
  return featureUpdateListeners.add(t), () => featureUpdateListeners.delete(t);
}
var fetchFeaturesWithOAuth = wrapAsAsyncFn(async function () {
  const t = getEnvironmentConfig(),
    e = await getValidAccessToken();
  if (!e) throw new Error("No valid OAuth token available for feature fetch");
  if (await DesktopManagedState.isDesktopManaged())
    throw new Error("Feature fetch withheld: Desktop-managed");
  const n = await fetch(
    `${t.apiBaseUrl}/api/bootstrap/features/${FEATURE_BOOTSTRAP_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${e}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (401 === n.status)
    throw (
      (await clearStoredKeys(StorageKey.ACCESS_TOKEN, StorageKey.TOKEN_EXPIRY),
      new Error("OAuth token rejected by server (401)"))
    );
  if (!n.ok) throw new Error(`Failed to fetch features: ${n.status}`);
  return n.json();
});
function getFeatureStore() {
  return (
    featureStoreSingleton ||
      (featureStoreSingleton = new FeatureFlagStore({
        fetchFeatures: fetchFeaturesWithOAuth,
        onFeaturesUpdated: () => {
          for (const e of featureUpdateListeners)
            try {
              e();
            } catch (t) {}
        },
      })),
    featureStoreSingleton
  );
}
async function getFeatureObject(t) {
  const e = getFeatureStore();
  await e.initialize();
  const n = await e.getFeatureValueAsync(t, {});
  return (r = n) &&
    "object" == typeof r &&
    Object.keys(r).some((t) => void 0 !== r[t] && null !== r[t])
    ? n
    : {};
  var r;
}
async function isFeatureStoreReady() {
  const t = getFeatureStore();
  return await t.initialize(), t.isReady();
}
async function isFeatureEnabledAsync(t) {
  const e = getFeatureStore();
  return await e.initialize(), e.isFeatureEnabledAsync(t);
}
function getFeatureValue(t, e) {
  return getFeatureStore().getFeatureValue(t, e);
}
async function refreshFeatures() {
  await getFeatureStore().refresh();
}
function refreshFeaturesOnManagedChange(t, e) {
  t && t.managed !== e.managed && refreshFeatures().catch((t) => {});
}
async function hydrateFeaturesFromStorage() {
  await getFeatureStore().hydrateFromStorage();
}
var DEFAULT_OAUTH_REFRESH_TIMEOUT_MS = 1e4,
  DEFAULT_DEBUGGER_ATTACH_TIMEOUT_MS = 8e3,
  DEFAULT_CDP_COMMAND_TIMEOUT_MS = 3e4;
function getTimeoutOverrides() {
  return getFeatureValue("cic_ext_timeouts", {});
}
var be = 45e3,
  Te = 5e3;
function getHiddenTabDrawMs() {
  return (
    localCicOverrides.hiddenTabDrawMs ??
    getTimeoutOverrides().hiddenTabDrawMs ??
    2e3
  );
}
function isHiddenTabDrawEnabled() {
  return getFeatureValue("cic_hidden_tab_draw", !0);
}
function isFocusEmulationEnabled() {
  return (
    localCicOverrides.focusEmulation ??
    getFeatureValue("cic_focus_emulation", !1)
  );
}
function isFocusEmulationInWorker() {
  return "undefined" == typeof document && isFocusEmulationEnabled();
}
var localOverridesLoadPromise,
  localCicOverrides = {},
  localOverridesLoaded = !1;
function areLocalOverridesLoaded() {
  return localOverridesLoaded;
}
function parseCicOverrides(t) {
  const { cicFocusEmulation: e, cicHiddenTabDrawMs: n } = t;
  return {
    focusEmulation: "boolean" == typeof e ? e : void 0,
    hiddenTabDrawMs: "number" == typeof n && n > 0 ? n : void 0,
  };
}
function loadLocalCicOverrides() {
  return (
    (localOverridesLoadPromise ??= (async () => {
      try {
        chrome.storage.onChanged.addListener((t, e) => {
          "local" === e &&
            ("cicFocusEmulation" in t || "cicHiddenTabDrawMs" in t) &&
            (localCicOverrides = parseCicOverrides({
              cicFocusEmulation:
                "cicFocusEmulation" in t
                  ? t.cicFocusEmulation.newValue
                  : localCicOverrides.focusEmulation,
              cicHiddenTabDrawMs:
                "cicHiddenTabDrawMs" in t
                  ? t.cicHiddenTabDrawMs.newValue
                  : localCicOverrides.hiddenTabDrawMs,
            }));
        }),
          (localCicOverrides = parseCicOverrides(
            await chrome.storage.local.get([
              "cicFocusEmulation",
              "cicHiddenTabDrawMs",
            ]),
          ));
      } catch (t) {}
      localOverridesLoaded = !0;
    })()),
    localOverridesLoadPromise
  );
}
var Ne = 4e4,
  Le = 1e3,
  $e = 8e3;
function getOauthRefreshTimeoutMs() {
  return (
    getTimeoutOverrides().oauthRefreshMs ?? DEFAULT_OAUTH_REFRESH_TIMEOUT_MS
  );
}
function getDebuggerAttachTimeoutMs() {
  return (
    getTimeoutOverrides().debuggerAttachMs ?? DEFAULT_DEBUGGER_ATTACH_TIMEOUT_MS
  );
}
function getCdpCommandTimeoutMs() {
  return (
    getTimeoutOverrides().cdpSendCommandMs ?? DEFAULT_CDP_COMMAND_TIMEOUT_MS
  );
}
var Be = 5e3,
  CLAUDE_AI_ORIGIN = new URL("https://claude.ai").origin,
  BOOTSTRAP_URL = `${CLAUDE_AI_ORIGIN}/api/bootstrap`;
async function probeClaudeAiSession(t) {
  try {
    const e = await fetch(BOOTSTRAP_URL, {
      credentials: "include",
      cache: "no-store",
      redirect: "manual",
      signal: t,
    });
    if (401 === e.status || 403 === e.status) {
      if ("challenge" === e.headers.get("cf-mitigated")) return;
      if (403 === e.status) {
        const t = await e
          .json()
          .then((t) => ("object" == typeof t && null !== t ? t : null))
          .catch(() => null);
        if ("error" !== t?.type || void 0 !== t.error?.details?.error_code)
          return;
      }
      return !1;
    }
    if (!e.ok) return;
    const n = await e.json();
    if ("object" != typeof n || null === n) return;
    return null != n.account;
  } catch {
    return;
  }
}
async function getOrCreateAnonymousId() {
  let t = await getStoredValue(StorageKey.ANONYMOUS_ID);
  return (
    t ||
      ((t = crypto.randomUUID()),
      await setStoredValue(StorageKey.ANONYMOUS_ID, t)),
    t
  );
}
function trimmedLength(t) {
  return t?.trim().length ?? 0;
}
function buildShortcutInvokedProps(t, e) {
  return {
    sessionId: t,
    shortcut_id: e,
    commandType: "shortcut",
  };
}
function buildShortcutCreatedProps(t, e) {
  return {
    sessionId: t,
    shortcut_id: e.id,
    command_name_length: trimmedLength(e.command),
  };
}
function buildShortcutUpdatedProps(t, e, n) {
  return {
    sessionId: t,
    shortcut_id: n.id,
    renamed: e.trim() !== (n.command ?? ""),
    command_name_length: trimmedLength(e),
  };
}
function buildShortcutDeletedProps(t, e) {
  return {
    sessionId: t,
    shortcut_id: e,
  };
}
function buildTaskSuccessProps(t, e) {
  return {
    task_id: t,
    success: !0,
    execution_type: e,
  };
}
function buildTaskFailureProps(t, e, n) {
  return {
    task_id: t,
    success: !1,
    execution_type: e,
    error_name: n instanceof Error ? n.name : typeof n,
  };
}
function readLocalStorage(t) {
  try {
    return "undefined" == typeof localStorage ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}
function writeLocalStorage(t, e) {
  try {
    if ("undefined" == typeof localStorage) return;
    localStorage.setItem(t, e);
  } catch {}
}
function removeLocalStorage(t) {
  try {
    if ("undefined" == typeof localStorage) return;
    localStorage.removeItem(t);
  } catch {}
}
function generateUuid() {
  return "undefined" != typeof crypto && "function" == typeof crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
        const e = (16 * Math.random()) | 0;
        return ("x" === t ? e : (3 & e) | 8).toString(16);
      });
}
var ANALYTICS_ID_PREFIX = "antalytics",
  ANONYMOUS_ID_STORAGE_KEY = "antalytics_anonymous_id",
  VALID_ANONYMOUS_ID_PATTERN = /^[a-zA-Z0-9_.-]{1,128}$/;
function writeSharedCookie(t, e, n) {
  try {
    if ("undefined" == typeof document) return;
    document.cookie = `${encodeURIComponent(t)}=; Path=/; Max-Age=0`;
    const r = 31536e3,
      s =
        "undefined" != typeof location && "https:" === location.protocol
          ? "; Secure"
          : "";
    document.cookie = `${encodeURIComponent(t)}=${encodeURIComponent(e)}; Domain=${n}; Path=/; Max-Age=${r}; SameSite=Lax${s}`;
  } catch {}
}
function generateAnonymousId(t) {
  return `${t}.v1.${generateUuid()}`;
}
function resolveAnonymousId(t = {}) {
  const e = t.prefix ?? ANALYTICS_ID_PREFIX;
  if (t.cookieName) {
    const e = (function (t) {
      try {
        if ("undefined" == typeof document) return null;
        const e = `${encodeURIComponent(t)}=`;
        for (const t of document.cookie.split("; "))
          if (t.startsWith(e)) {
            const n = decodeURIComponent(t.slice(e.length));
            return n.length >= 2 && n.startsWith('"') && n.endsWith('"')
              ? n.slice(1, -1)
              : n;
          }
        return null;
      } catch {
        return null;
      }
    })(t.cookieName);
    if (e && VALID_ANONYMOUS_ID_PATTERN.test(e))
      return (
        writeLocalStorage(ANONYMOUS_ID_STORAGE_KEY, e),
        t.cookieDomain && writeSharedCookie(t.cookieName, e, t.cookieDomain),
        e
      );
  }
  const n = readLocalStorage(ANONYMOUS_ID_STORAGE_KEY);
  if (n)
    return (
      t.cookieName &&
        t.cookieDomain &&
        writeSharedCookie(t.cookieName, n, t.cookieDomain),
      n
    );
  const r = generateAnonymousId(e);
  return (
    writeLocalStorage(ANONYMOUS_ID_STORAGE_KEY, r),
    t.cookieName &&
      t.cookieDomain &&
      writeSharedCookie(t.cookieName, r, t.cookieDomain),
    r
  );
}
var UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
];
function runBeforePlugins(t, e, n) {
  if (0 === e.length) return t;
  let r = t;
  for (const i of e) {
    if (null == r) break;
    try {
      r = i.fn(r);
    } catch (s) {
      if (i.privacy) {
        try {
          n?.(s, i.name);
        } catch {}
        return null;
      }
    }
  }
  return r ?? null;
}
var PII_PROPERTY_KEYS = new Set([
    "email",
    "ip",
    "ipAddress",
    "ip_address",
    "userAgent",
    "user_agent",
    "title",
  ]),
  piiScrubPlugin = {
    name: "piiScrub",
    type: "before",
    privacy: !0,
    fn: (t) => {
      const e = Object.create(null);
      for (const [n, r] of Object.entries(t.properties))
        PII_PROPERTY_KEYS.has(n) || (e[n] = r);
      return {
        ...t,
        properties: e,
      };
    },
  },
  QUEUE_STORAGE_KEY = "antalytics_queue_v1";
function clearPersistedQueue() {
  removeLocalStorage(QUEUE_STORAGE_KEY);
}
function serializeEvent(t) {
  const e = {
    event_name: t.eventName,
    event_id: t.eventId,
    event_timestamp: t.eventTimestamp,
  };
  return (
    void 0 !== t.accountUuid && (e.account_uuid = t.accountUuid),
    void 0 !== t.organizationUuid && (e.organization_uuid = t.organizationUuid),
    Object.keys(t.properties).length > 0 &&
      (e.properties = JSON.stringify(t.properties)),
    {
      event_type: "ProductAnalyticsEvent",
      event_data: e,
    }
  );
}
function withTestMode(t) {
  if (!t.testMode) return t.endpoint;
  const e = t.endpoint.includes("?") ? "&" : "?";
  return `${t.endpoint}${e}test_mode=true`;
}
function buildBatchBody(t) {
  const e = {
    events: t.map(serializeEvent),
  };
  return JSON.stringify(e);
}
function classifyStatus(t) {
  return t >= 200 && t < 300
    ? "ok"
    : 429 === t
      ? "rate_limited"
      : t >= 500
        ? "retryable"
        : "drop";
}
function sleep(t) {
  return new Promise((e) => setTimeout(e, t));
}
function backoffDelayMs(t) {
  return 1e3 * Math.pow(2, t) + 250 * Math.random();
}
function byteLength(t) {
  return "function" == typeof TextEncoder
    ? new TextEncoder().encode(t).byteLength
    : "function" == typeof Blob
      ? new Blob([t]).size
      : t.length;
}
async function postBatch(t, e, n) {
  const r = (r) =>
      fetch(t, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-service-name": n,
        },
        keepalive: r,
        body: e,
      }),
    s = byteLength(e) < 6e4;
  try {
    return classifyStatus((await r(s)).status);
  } catch {
    if (s)
      try {
        return classifyStatus((await r(!1)).status);
      } catch {}
    return "retryable";
  }
}
function sendBeaconBatch(t, e) {
  if (
    "undefined" == typeof navigator ||
    "function" != typeof navigator.sendBeacon
  )
    return !1;
  try {
    return navigator.sendBeacon(t, new Blob([e]));
  } catch {
    return !1;
  }
}
function flushOnUnload(t, e) {
  if (0 === t.length) return !0;
  const n = buildBatchBody(t),
    r = withTestMode(e),
    s = `${r}${r.includes("?") ? "&" : "?"}service_name=${encodeURIComponent(e.serviceName)}`;
  if (
    (function () {
      try {
        return "function" == typeof Request && "keepalive" in Request.prototype;
      } catch {
        return !1;
      }
    })() &&
    "function" == typeof fetch &&
    byteLength(n) < 6e4
  )
    try {
      return (
        fetch(s, {
          method: "POST",
          keepalive: !0,
          body: new Blob([n]),
        }).catch(() => {
          sendBeaconBatch(s, n);
        }),
        !0
      );
    } catch {}
  return sendBeaconBatch(s, n);
}
var EVENT_LOGGING_URL = "https://api.anthropic.com/api/event_logging/v2/batch",
  IDENTIFY_EVENT_NAME = "$identify",
  Rn = 500;
function toNamedError(t) {
  const e = t instanceof Error ? t.name : typeof t,
    n = new Error(e);
  return (n.name = e), n;
}
var MAX_TIMER_DELAY = 2147483647,
  EVENT_NAME_PATTERN =
    /^([a-z][a-z0-9_]*\.)+[a-z][a-z0-9_]*$|^\$[a-z_]+$|^page_viewed$/;
function isBrowserEnvironment() {
  return "undefined" != typeof window && "undefined" != typeof document;
}
function isPlainObject(t) {
  return "object" == typeof t && null !== t && !Array.isArray(t);
}
function scrubIdentifiers(t) {
  return t && "string" == typeof t ? redactIdSegments(t) : t;
}
function redactIdSegments(t) {
  let e = t;
  return (
    (e = e.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      "*",
    )),
    (e = e.replace(/\b[0-9a-f]{32}\b/gi, "*")),
    (e = e.replace(/\b[0-9a-f]{24}\b/gi, "*")),
    (e = e.replace(/\/(\d{4,})(?=\/|$|\?|#)/g, "/*")),
    e
  );
}
function addCanonicalUriProps(t) {
  if (!(t.path || t.url || t.referrer || t.search)) return;
  const e = {
    ...t,
  };
  return (
    e.path && (e.canonical_path = scrubIdentifiers(e.path)),
    e.url && (e.canonical_url = scrubIdentifiers(e.url)),
    e.referrer && (e.canonical_referrer = scrubIdentifiers(e.referrer)),
    e.search &&
      (e.canonical_search = (function (t) {
        if (!t || "string" != typeof t) return t;
        const e = new URLSearchParams(t.replace(/^\?/, "")),
          n = new URLSearchParams();
        for (const [s, i] of e) n.set(s, redactIdSegments(i));
        const r = n.toString();
        return r ? `?${r}` : "";
      })(e.search)),
    e
  );
}
var DOLLAR_SEGMENT_PATTERN = /\/\$[^/?#]*(?=\/|$|\?|#)/g;
function wildcardDollarSegments(t) {
  if ("string" != typeof t) return t;
  const e = t.search(/[?#]/);
  return -1 === e
    ? t.replace(DOLLAR_SEGMENT_PATTERN, "/*")
    : t.slice(0, e).replace(DOLLAR_SEGMENT_PATTERN, "/*") + t.slice(e);
}
function getOrigin(t) {
  try {
    const { protocol: e, host: n } = new URL(String(t));
    return "" === n ? null : e + "//" + n;
  } catch {
    return null;
  }
}
var CANONICAL_PROPERTY_KEYS = [
    "canonical_path",
    "canonical_url",
    "canonical_referrer",
    "canonical_search",
  ],
  canonicalUriPlugin = {
    name: "canonicalUriProperties",
    type: "before",
    fn: (t) => {
      if ("page_viewed" !== t.eventName) return t;
      const e = t.properties;
      if (!e || "object" != typeof e) return t;
      const n = getOrigin(e.referrer),
        r = addCanonicalUriProps({
          ...e,
          path: wildcardDollarSegments(e.path),
          url: wildcardDollarSegments(e.url),
          ...(null !== n &&
            n === getOrigin(e.url) && {
              referrer: wildcardDollarSegments(e.referrer),
            }),
        });
      if (!r) return t;
      const s = {
        ...e,
      };
      for (const i of CANONICAL_PROPERTY_KEYS) i in r && (s[i] = r[i]);
      return {
        ...t,
        properties: s,
      };
    },
  },
  eventLogger = new (class {
    constructor() {
      (this.config = null),
        (this.queue = []),
        (this.inFlight = []),
        (this.flushTimer = null),
        (this.firstFlushTimer = null),
        (this.firstFlushPendingDelayMs = null),
        (this.firstFlushRequested = !1),
        (this.persistTimer = null),
        (this.flushPromise = null),
        (this.lastRetryExhaustedAt = 0),
        (this.consecutiveRetryableFailures = 0),
        (this.lastRateLimitedAt = 0),
        (this.anonymousId = ""),
        (this.accountUuid = void 0),
        (this.organizationUuid = void 0),
        (this.traits = {}),
        (this.unloadListenersRegistered = !1),
        (this.readBackFromStorage = new WeakSet()),
        (this.forgetGen = 0),
        (this.preInitBuffer = []),
        (this.preInitDroppedCount = 0),
        (this.preInitWarned = !1),
        (this.preInitConsentGetter = null);
    }
    init(t) {
      try {
        if (this.config) return;
        (this.config = (function (t) {
          const e = t.plugins ?? [];
          return {
            endpoint: t.endpoint ?? EVENT_LOGGING_URL,
            serviceName: t.serviceName,
            flushInterval: t.flushInterval ?? 5e3,
            getFlushInterval: t.getFlushInterval,
            flushAt: t.flushAt ?? 50,
            maxRetries: t.maxRetries ?? 3,
            testMode: t.testMode ?? !1,
            debug: t.debug ?? !1,
            pluginsBefore: e.filter((t) => "before" === t.type),
            pluginsAfter: e.filter((t) => "after" === t.type),
            anonymousIdCookie: t.anonymousIdCookie,
            anonymousIdCookieDomain: t.anonymousIdCookieDomain,
            onError: t.onError,
          };
        })(t)),
          isBrowserEnvironment() &&
            t.allowedOrigins &&
            t.allowedOrigins.includes(window.location.origin),
          this.config.debug && this.config.endpoint,
          (this.anonymousId = resolveAnonymousId({
            prefix: this.config.serviceName,
            cookieName: this.config.anonymousIdCookie,
            cookieDomain: this.config.anonymousIdCookieDomain,
          }));
        const e = (function () {
          const t = readLocalStorage(QUEUE_STORAGE_KEY);
          if (!t) return [];
          try {
            const e = JSON.parse(t);
            return Array.isArray(e)
              ? e.filter(
                  (t) =>
                    "object" == typeof t &&
                    null !== t &&
                    "string" == typeof t.eventName &&
                    "string" == typeof t.eventId &&
                    "string" == typeof t.eventTimestamp &&
                    "object" == typeof t.properties &&
                    null !== t.properties &&
                    !Array.isArray(t.properties),
                )
              : [];
          } catch {
            return [];
          }
        })();
        if (e.length > 0) {
          for (const t of e) this.readBackFromStorage.add(t);
          this.queue.push(...e), this.flush();
        }
        isBrowserEnvironment() &&
          !this.unloadListenersRegistered &&
          (this.registerUnloadListeners(),
          (this.unloadListenersRegistered = !0)),
          this.drainPreInitBuffer(this.config);
      } catch (e) {
        const n = this.config?.onError ?? t?.onError;
        (this.config = null), this.reportError("init", e, n);
      }
    }
    track(t, e = {}, n) {
      try {
        const r = this.config;
        if (!r) return void this.bufferPreInit(t, e, n);
        this.enqueueEvent(
          r,
          t,
          e,
          n?.timestamp ?? new Date().toISOString(),
          n?.context,
        );
      } catch (r) {
        this.reportError("track", r);
      }
    }
    captureForTrack() {
      return {
        timestamp: new Date().toISOString(),
        context: isBrowserEnvironment()
          ? {
              url: window.location.href,
              path: window.location.pathname,
              referrer: document.referrer || void 0,
              search: window.location.search || void 0,
            }
          : void 0,
      };
    }
    registerPreInitConsent(t) {
      this.preInitConsentGetter = t;
    }
    hasPreInitConsent() {
      return null !== this.preInitConsentGetter;
    }
    bufferPreInit(t, e, n = this.captureForTrack()) {
      if (!this.preInitConsentGetter)
        return void (this.preInitWarned || (this.preInitWarned = !0));
      let r = !1;
      try {
        r = this.preInitConsentGetter();
      } catch {}
      r &&
        (this.preInitWarned || (this.preInitWarned = !0),
        !(this.preInitBuffer.length >= 100) ||
        (t === IDENTIFY_EVENT_NAME &&
          this.preInitBuffer.filter((t) => t.eventName === IDENTIFY_EVENT_NAME)
            .length < 25)
          ? this.preInitBuffer.push({
              eventName: t,
              properties: {
                ...e,
              },
              eventTimestamp: n.timestamp,
              capturedContext: n.context,
            })
          : (this.preInitDroppedCount += 1));
    }
    drainPreInitBuffer(t) {
      if (
        (this.preInitDroppedCount > 0 && (this.preInitDroppedCount = 0),
        0 === this.preInitBuffer.length)
      )
        return;
      const e = this.preInitBuffer;
      this.preInitBuffer = [];
      for (const r of e)
        try {
          this.enqueueEvent(
            t,
            r.eventName,
            r.properties,
            r.eventTimestamp,
            r.capturedContext,
          );
        } catch (n) {
          this.reportError("track", n);
        }
    }
    enqueueEvent(t, e, n, r, s) {
      t.debug && EVENT_NAME_PATTERN.test(e);
      const i = runBeforePlugins(
        {
          eventName: e,
          eventId: generateUuid(),
          eventTimestamp: r,
          accountUuid: this.accountUuid,
          organizationUuid: this.organizationUuid,
          properties: {
            ...this.traits,
            ...n,
            anonymous_id: this.anonymousId,
            service_name: t.serviceName,
          },
          capturedContext: s,
        },
        t.pluginsBefore,
        (t, e) => this.reportError(`privacy_plugin_drop:${e}`, toNamedError(t)),
      );
      null !== i &&
        (delete i.capturedContext,
        this.queue.push(i),
        this.queue.length > Rn && this.queue.splice(0, this.queue.length - Rn),
        this.persist(),
        null !== this.firstFlushPendingDelayMs &&
          (this.armFirstFlushTimer(this.firstFlushPendingDelayMs),
          (this.firstFlushPendingDelayMs = null)),
        this.queue.length >= t.flushAt && null === this.flushPromise
          ? this.flush()
          : this.scheduleFlush());
    }
    page(t, e = {}) {
      try {
        isPlainObject(t) && ((e = t), (t = void 0));
        const n = {
          ...e,
        };
        void 0 !== t && (n.page_name = t),
          isBrowserEnvironment() &&
            ((n.url = n.url ?? window.location.href),
            (n.path = n.path ?? window.location.pathname),
            (n.referrer = n.referrer ?? (document.referrer || void 0))),
          this.track("page_viewed", n);
      } catch (n) {
        this.reportError("page", n);
      }
    }
    identify(t, e = {}, n = {}) {
      try {
        isPlainObject(t) && ((e = t), (t = void 0)),
          "string" == typeof t && (this.accountUuid = t),
          null === n.organizationUuid
            ? (this.organizationUuid = void 0)
            : "string" == typeof n.organizationUuid &&
              (this.organizationUuid = n.organizationUuid),
          (this.traits = {
            ...this.traits,
            ...e,
          }),
          this.track(IDENTIFY_EVENT_NAME, {});
      } catch (r) {
        this.reportError("identify", r);
      }
    }
    alias(t, e) {
      try {
        (this.accountUuid = t),
          this.track("$alias", {
            previous_id: e,
          });
      } catch (n) {
        this.reportError("alias", n);
      }
    }
    reset() {
      try {
        (this.accountUuid = void 0),
          (this.organizationUuid = void 0),
          (this.traits = {}),
          (this.preInitBuffer = []),
          (this.preInitDroppedCount = 0),
          (this.anonymousId = (function (t = {}) {
            const e = t.prefix ?? ANALYTICS_ID_PREFIX;
            removeLocalStorage(ANONYMOUS_ID_STORAGE_KEY);
            const n = generateAnonymousId(e);
            return (
              writeLocalStorage(ANONYMOUS_ID_STORAGE_KEY, n),
              t.cookieName &&
                t.cookieDomain &&
                writeSharedCookie(t.cookieName, n, t.cookieDomain),
              n
            );
          })(
            this.config
              ? {
                  prefix: this.config.serviceName,
                  cookieName: this.config.anonymousIdCookie,
                  cookieDomain: this.config.anonymousIdCookieDomain,
                }
              : {},
          ));
      } catch (t) {
        this.reportError("reset", t);
      }
    }
    forgetIdentity() {
      try {
        (this.forgetGen += 1),
          (this.accountUuid = void 0),
          (this.organizationUuid = void 0),
          (this.traits = {}),
          (this.queue = []),
          (this.inFlight = []),
          (this.preInitBuffer = []),
          (this.preInitDroppedCount = 0),
          this.clearFlushTimer(),
          this.clearFirstFlushTimer(),
          null !== this.persistTimer &&
            (clearTimeout(this.persistTimer), (this.persistTimer = null)),
          clearPersistedQueue(),
          (function (t = {}) {
            if (
              (removeLocalStorage(ANONYMOUS_ID_STORAGE_KEY),
              t.cookieName && t.cookieDomain)
            )
              try {
                if ("undefined" == typeof document) return;
                (document.cookie = `${encodeURIComponent(t.cookieName)}=; Domain=${t.cookieDomain}; Path=/; Max-Age=0`),
                  (document.cookie = `${encodeURIComponent(t.cookieName)}=; Path=/; Max-Age=0`);
              } catch {}
          })(
            this.config
              ? {
                  prefix: this.config.serviceName,
                  cookieName: this.config.anonymousIdCookie,
                  cookieDomain: this.config.anonymousIdCookieDomain,
                }
              : {},
          );
      } catch (t) {
        this.reportError("forgetIdentity", t);
      }
    }
    dropUnsent() {
      try {
        (this.forgetGen += 1),
          (this.queue = []),
          (this.inFlight = []),
          (this.preInitBuffer = []),
          (this.preInitDroppedCount = 0),
          this.clearFlushTimer(),
          this.clearFirstFlushTimer(),
          null !== this.persistTimer &&
            (clearTimeout(this.persistTimer), (this.persistTimer = null)),
          clearPersistedQueue();
      } catch (t) {
        this.reportError("dropUnsent", t);
      }
    }
    dropUnsentFromOtherAccounts(t) {
      try {
        const e = (e) =>
          void 0 === e.accountUuid
            ? !this.readBackFromStorage.has(e)
            : !(function (t, e) {
                return void 0 !== t.accountUuid && t.accountUuid !== e;
              })(e, t);
        (this.queue = this.queue.filter(e)),
          this.inFlight.splice(
            0,
            this.inFlight.length,
            ...this.inFlight.filter(e),
          ),
          this.persistNow();
      } catch (e) {
        this.reportError("dropUnsentFromOtherAccounts", e);
      }
    }
    getAnonymousId() {
      return this.anonymousId;
    }
    async flush() {
      try {
        if (this.flushPromise) {
          if (
            (await this.flushPromise,
            0 === this.queue.length && null === this.flushPromise)
          )
            return;
          return await this.flush();
        }
        const t = this.config;
        if (!t || 0 === this.queue.length) return;
        const e =
          this.consecutiveRetryableFailures >= 3 ? 3e5 : t.flushInterval;
        if (Date.now() - this.lastRetryExhaustedAt < e)
          return void this.scheduleFlush();
        if (Date.now() - this.lastRateLimitedAt < 6e4)
          return void this.scheduleFlush();
        this.clearFlushTimer();
        const n = [...this.queue];
        (this.queue = []),
          (this.inFlight = n),
          (this.flushPromise = this.doFlush(n, t).finally(() => {
            this.flushPromise = null;
          })),
          await this.flushPromise;
      } catch (t) {
        this.inFlight.length > 0 &&
          ((this.queue = [...this.inFlight, ...this.queue]),
          (this.inFlight = []),
          this.queue.length > Rn &&
            this.queue.splice(0, this.queue.length - Rn),
          this.persistNow()),
          this.reportError("flush", t);
      }
    }
    async doFlush(t, e) {
      if (e.debug)
        return (
          (this.inFlight = []),
          this.persistNow(),
          void this.runAfterPlugins(t, e)
        );
      const n = this.forgetGen,
        r = await (async function (t, e) {
          if (0 === t.length) return "ok";
          const n = withTestMode(e);
          let r;
          try {
            r = buildBatchBody(t);
          } catch {
            return "drop";
          }
          for (let s = 0; s <= e.maxRetries; s++) {
            const t = await postBatch(n, r, e.serviceName);
            if ("retryable" !== t) return t;
            s < e.maxRetries && (await sleep(backoffDelayMs(s)));
          }
          return "retryable";
        })(t, e);
      if (((this.inFlight = []), n === this.forgetGen))
        switch (r) {
          case "ok":
            return (
              (this.consecutiveRetryableFailures = 0),
              this.persistNow(),
              this.runAfterPlugins(t, e),
              void (this.queue.length > 0 && this.scheduleFlush())
            );
          case "drop":
            return (
              (this.consecutiveRetryableFailures = 0),
              this.reportError(
                "flush",
                new Error(`batch dropped (4xx); ${t.length} events lost`),
              ),
              this.persistNow(),
              void (this.queue.length > 0 && this.scheduleFlush())
            );
          case "rate_limited":
            return (
              (this.consecutiveRetryableFailures = 0),
              (this.queue = [...t, ...this.queue]),
              this.queue.length > Rn &&
                this.queue.splice(0, this.queue.length - Rn),
              (this.lastRateLimitedAt = Date.now()),
              this.persistNow(),
              void this.scheduleFlush()
            );
          case "retryable":
            return (
              (this.consecutiveRetryableFailures += 1),
              (this.queue = [...t, ...this.queue]),
              this.queue.length > Rn &&
                this.queue.splice(0, this.queue.length - Rn),
              (this.lastRetryExhaustedAt = Date.now()),
              this.persistNow(),
              void this.scheduleFlush()
            );
        }
    }
    runAfterPlugins(t, e) {
      if (0 !== e.pluginsAfter.length)
        for (const n of t)
          runBeforePlugins(n, e.pluginsAfter, (t, e) =>
            this.reportError(`privacy_plugin_drop:${e}`, toNamedError(t)),
          );
    }
    persist() {
      null !== this.persistTimer && clearTimeout(this.persistTimer),
        (this.persistTimer = setTimeout(() => {
          (this.persistTimer = null), this.persistNow();
        }, 250));
    }
    persistNow() {
      null !== this.persistTimer &&
        (clearTimeout(this.persistTimer), (this.persistTimer = null));
      const t = [...this.inFlight, ...this.queue];
      t.length > 0
        ? (function (t) {
            const e = t.length > 100 ? t.slice(t.length - 100) : t;
            try {
              writeLocalStorage(QUEUE_STORAGE_KEY, JSON.stringify(e));
            } catch {}
          })(t)
        : clearPersistedQueue();
    }
    reportError(t, e, n) {
      const r = n ?? this.config?.onError;
      if (r)
        try {
          return void r(e, {
            method: t,
          });
        } catch {}
    }
    scheduleFlush() {
      null === this.flushTimer &&
        this.config &&
        (this.flushTimer = setTimeout(() => {
          (this.flushTimer = null), this.flush();
        }, this.resolveFlushIntervalMs(this.config)));
    }
    resolveFlushIntervalMs(t) {
      if (t.getFlushInterval)
        try {
          const e = t.getFlushInterval();
          if (
            "number" == typeof e &&
            Number.isFinite(e) &&
            e > 0 &&
            e <= MAX_TIMER_DELAY
          )
            return Math.max(e, 1e3);
        } catch (e) {
          this.reportError("getFlushInterval", e);
        }
      return t.flushInterval;
    }
    scheduleFirstFlush(t) {
      try {
        if (
          !this.config ||
          this.firstFlushRequested ||
          "number" != typeof t ||
          !Number.isFinite(t) ||
          t < 0 ||
          t > MAX_TIMER_DELAY
        )
          return;
        (this.firstFlushRequested = !0),
          this.queue.length > 0
            ? this.armFirstFlushTimer(t)
            : (this.firstFlushPendingDelayMs = t);
      } catch (e) {
        this.reportError("scheduleFirstFlush", e);
      }
    }
    armFirstFlushTimer(t) {
      this.firstFlushTimer = setTimeout(() => {
        (this.firstFlushTimer = null), this.flush();
      }, t);
    }
    clearFirstFlushTimer() {
      null !== this.firstFlushTimer &&
        (clearTimeout(this.firstFlushTimer), (this.firstFlushTimer = null)),
        (this.firstFlushPendingDelayMs = null);
    }
    clearFlushTimer() {
      null !== this.flushTimer &&
        (clearTimeout(this.flushTimer), (this.flushTimer = null));
    }
    registerUnloadListeners() {
      window.addEventListener("pagehide", () => this.flushWithBeacon(), {
        passive: !0,
      });
    }
    flushWithBeacon() {
      try {
        const t = this.config;
        if (!t) return;
        if (
          ((this.inFlight.length > 0 || this.queue.length > 0) &&
            this.persistNow(),
          0 === this.queue.length)
        )
          return;
        this.clearFlushTimer();
        const e = [...this.queue];
        if (((this.queue = []), t.debug)) return void this.persistNow();
        flushOnUnload(e, t)
          ? this.persistNow()
          : ((this.queue = [...e, ...this.queue]),
            this.persistNow(),
            this.scheduleFlush());
      } catch (t) {
        this.reportError("flushWithBeacon", t);
      }
    }
  })(),
  ERROR_TEXT_PROPERTY_KEYS = ["error", "debugger_attach_error"],
  errorTextCapPlugin = {
    name: "extensionErrorTextCap",
    type: "before",
    privacy: !0,
    fn: (t) => {
      let e;
      for (const n of ERROR_TEXT_PROPERTY_KEYS) {
        const r = (e ?? t.properties)[n];
        if ("string" == typeof r && r.length > 256) {
          let s = r.slice(0, 256);
          const i = s.charCodeAt(s.length - 1);
          i >= 55296 && i <= 56319 && (s = s.slice(0, -1)),
            (e ??= {
              ...t.properties,
            }),
            (e[n] = s);
        }
      }
      return e
        ? {
            ...t,
            properties: e,
          }
        : t;
    },
  },
  eventLoggerInitialized = !1;
var userTextScrubPlugin = {
  name: "extensionUserTextScrub",
  type: "before",
  privacy: !0,
  fn: (t) => {
    if ("claude_chrome.chat.feedback" !== t.eventName) return t;
    if (!("message" in t.properties)) return t;
    const { message: e, ...n } = t.properties;
    return {
      ...t,
      properties: {
        ...n,
        message_length: "string" == typeof e ? e.length : 0,
      },
    };
  },
};
function initEventLogger(t) {
  return; // Claus: no event logging. eventLoggerInitialized stays false, so every trackEvent()/identify() is a no-op.
  if (eventLoggerInitialized) return;
  eventLoggerInitialized = !0;
  const e = getEnvironmentConfig();
  var n, r;
  eventLogger.init({
    serviceName: "claude_browser_extension",
    endpoint: `${e.apiBaseUrl}/api/event_logging/v2/batch`,
    testMode: "development" === e.environment,
    ...(void 0 !== t.flushAt
      ? {
          flushAt: t.flushAt,
        }
      : {}),
    ...(void 0 !== t.flushInterval
      ? {
          flushInterval: t.flushInterval,
        }
      : {}),
    plugins: [
      ((r = t.stableAnonymousId),
      {
        name: "extensionStableAnonymousId",
        type: "before",
        fn: (t) => ({
          ...t,
          properties: {
            ...t.properties,
            anonymous_id: r,
          },
        }),
      }),
      ((n = t.extensionVersion),
      {
        name: "extensionVersion",
        type: "before",
        fn: (t) => ({
          ...t,
          properties: {
            ...t.properties,
            extension_version: n,
          },
        }),
      }),
      canonicalUriPlugin,
      errorTextCapPlugin,
      piiScrubPlugin,
      userTextScrubPlugin,
    ],
    onError: (t, e) => {},
  });
}
function trackEvent(t, e = {}) {
  eventLoggerInitialized && eventLogger.track(t, e);
}
function trackPageView(t, e = {}) {
  eventLoggerInitialized && eventLogger.page(t, e);
}
function identifyUser(t, e) {
  eventLoggerInitialized &&
    ("string" == typeof e
      ? eventLogger.identify(
          t,
          {},
          {
            organizationUuid: e,
          },
        )
      : eventLogger.identify(t));
}
function resetEventLogger() {
  eventLoggerInitialized && eventLogger.reset();
}
var analyticsReady = !1,
  analyticsInitPromise = null,
  identityEpoch = 0;
async function ensureAnalyticsInitialized() {
  if (analyticsInitPromise) return analyticsInitPromise;
  analyticsReady ||
    ((analyticsInitPromise = (async () => {
      try {
        try {
          await hydrateFeaturesFromStorage();
        } catch (t) {}
        initEventLogger({
          stableAnonymousId: await getOrCreateAnonymousId(),
          extensionVersion: chrome.runtime.getManifest().version,
          flushAt: 20,
          flushInterval: 1e4,
        }),
          (analyticsReady = !0),
          await identifyFromProfile();
      } catch (e) {}
    })()),
    await analyticsInitPromise);
}
function resetAnalyticsIdentity() {
  bumpIdentityEpoch(), resetEventLogger();
}
function bumpIdentityEpoch() {
  identityEpoch++;
}
async function identifyFromProfile() {
  if (!analyticsReady) return;
  const t = identityEpoch;
  try {
    const e = await (async function () {
        try {
          const t = await getValidAccessToken();
          if (!t) return null;
          const e = await getStoredValue(StorageKey.ACCOUNT_UUID).catch(
              () => {},
            ),
            n = (
              await chrome.storage.session
                .get(PROFILE_CACHE_KEY)
                .catch(() => ({}))
            )[PROFILE_CACHE_KEY];
          if (n && n.accountUuid === e && Date.now() - n.fetchedAt < 6e5)
            return n.profile;
          const r = `${getEnvironmentConfig().apiBaseUrl}/api/oauth/profile`,
            s = await fetch(r, {
              headers: {
                Authorization: `Bearer ${t}`,
                "Content-Type": "application/json",
                "anthropic-client-platform": "claude_browser_extension",
              },
              signal: AbortSignal.timeout(getOauthRefreshTimeoutMs()),
            });
          if (!s.ok) return null;
          const i = await s.json(),
            o = i?.account?.uuid;
          if (!o) return i ?? null;
          const a = await getStoredValue(StorageKey.ACCESS_TOKEN).catch(
            () => {},
          );
          if (a !== t) {
            const t = await getStoredValue(StorageKey.ACCOUNT_UUID).catch(
                () => {},
              ),
              e = await getStoredValue(StorageKey.REFRESH_TOKEN).catch(
                () => {},
              );
            return (a || e) && t && t === o ? i : null;
          }
          return (
            e !== o &&
              setStoredValue(StorageKey.ACCOUNT_UUID, o).catch(() => {}),
            chrome.storage.session
              .set({
                [PROFILE_CACHE_KEY]: {
                  profile: i,
                  accountUuid: o,
                  fetchedAt: Date.now(),
                },
              })
              .catch(() => {}),
            i
          );
        } catch {
          return null;
        }
      })(),
      n = await DesktopManagedState.isDesktopManaged();
    if (identityEpoch !== t) return;
    if (e) {
      if (n) return;
      const t = e.account.uuid,
        r = e.organization?.uuid;
      identifyUser(t, "string" == typeof r ? r : void 0);
    }
  } catch (e) {}
}
async function logExtensionEvent(t, e = {}) {
  try {
    if (
      (analyticsReady || (await ensureAnalyticsInitialized()), !analyticsReady)
    )
      return;
    if ((await readPosture())?.managed ?? 1) return;
    trackEvent(t, e);
  } catch (n) {}
}
var TOKEN_REFRESH_SKEW_MS = 36e5,
  TOKEN_LIFETIME_SECONDS = 31536e3;
function getAccountUuid(t) {
  const e = t.account?.uuid;
  return "string" == typeof e ? e : void 0;
}
function getOrgFromResponse(t) {
  const e = t.organization?.uuid;
  return "string" == typeof e
    ? {
        uuid: e.toLowerCase(),
        hybrid: !0 === t.organization?.hybrid,
      }
    : void 0;
}
function runUnlessManaged(t, e) {
  (t ? Promise.resolve(t) : waitForFirstPosture()).then((t) => {
    t.managed || e();
  });
}
function logOAuthRefresh(t, e) {
  logExtensionEvent("chrome_ext_oauth_refresh", {
    outcome: t,
    ...e,
  });
}
var base64UrlEncode = (t) =>
    btoa(String.fromCharCode(...t))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, ""),
  randomBase64Url = (t) => {
    const e = new Uint8Array(t);
    return crypto.getRandomValues(e), base64UrlEncode(e);
  },
  sha256Base64Url = async (t) => {
    const e = new TextEncoder().encode(t),
      n = await crypto.subtle.digest("SHA-256", e);
    return base64UrlEncode(new Uint8Array(n));
  },
  exchangeAuthorizationCode = async (t, e, n, r) => {
    try {
      const s = await fetch(r.TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: r.CLIENT_ID,
          code: t,
          redirect_uri: r.REDIRECT_URI,
          state: e,
          code_verifier: n,
          expires_in: String(TOKEN_LIFETIME_SECONDS),
        }),
        signal: AbortSignal.timeout(getOauthRefreshTimeoutMs()),
      });
      if (!s.ok) {
        const t = await s.text();
        return {
          success: !1,
          error: `Token exchange failed: ${s.status} ${t}`,
        };
      }
      const i = await s.json();
      return i.error
        ? {
            success: !1,
            error: i.error_description || i.error,
          }
        : {
            success: !0,
            accessToken: i.access_token,
            refreshToken: i.refresh_token,
            expiresAt: i.expires_in ? Date.now() + 1e3 * i.expires_in : void 0,
            org: getOrgFromResponse(i),
            accountUuid: getAccountUuid(i),
          };
    } catch (s) {
      return {
        success: !1,
        error:
          s instanceof Error
            ? s.message
            : "Network error during token exchange",
      };
    }
  },
  storeOAuthTokens = async (t, e, n) =>
    (void 0 === n?.unlessAuthResetSince ||
      n.unlessAuthResetSince === getAuthResetCounter()) &&
    (await removeStoredKeys([
      StorageKey.LAST_AUTH_FAILURE_REASON,
      StorageKey.STARTUP_REAUTH_STATE,
    ]),
    !!(await (async function (t, e, n = {}) {
      void 0 === n.unlessResetSince && (authResetCounter += 1);
      const r = () =>
          void 0 === n.unlessResetSince ||
          n.unlessResetSince === authResetCounter,
        s = {
          [StorageKey.OAUTH_STATE]: e.oauthState,
          ...(void 0 !== e.org && {
            [StorageKey.TOKEN_ORG]: e.org,
          }),
          ...(e.accountUuid && {
            [StorageKey.ACCOUNT_UUID]: e.accountUuid,
          }),
        },
        i = {
          [StorageKey.ACCESS_TOKEN]: t.accessToken,
          [StorageKey.REFRESH_TOKEN]: t.refreshToken,
          [StorageKey.TOKEN_EXPIRY]: t.expiresAt,
        };
      let o = !1;
      const a = async () =>
        !!r() &&
        (null === e.accountUuid &&
          (await removeStoredKeys(StorageKey.ACCOUNT_UUID)),
        await setStoredValues(s),
        (o = !0),
        void 0 === t.refreshToken &&
          (await removeStoredKeys(StorageKey.REFRESH_TOKEN)),
        !!r() && (await setStoredValues(i), !0));
      try {
        try {
          return await a();
        } catch (c) {
          return await n.beforeRetry?.().catch(() => {}), await a();
        }
      } catch (c) {
        throw (o && (await removeStoredKeys(TOKEN_KEYS).catch(() => {})), c);
      }
    })(
      {
        accessToken: t.accessToken,
        refreshToken: t.refreshToken,
        expiresAt: t.expiresAt,
      },
      {
        org: t.org,
        accountUuid: t.accountUuid,
        oauthState: e,
      },
      {
        unlessResetSince: n?.unlessAuthResetSince,
        beforeRetry: clearScreenshotCache,
      },
    )) && ((lastTokenStoredAt = Date.now()), !0)),
  currentAuthEpoch = getAuthResetCounter,
  migrateLocalTokensToSession = function () {
    return "ServiceWorkerGlobalScope" in globalThis
      ? ((tokenMigrationPromise ??= (async () => {
          try {
            const t = authResetCounter,
              e = await chrome.storage.local.get(TOKEN_KEYS),
              n = Object.fromEntries(
                Object.entries(e).filter(([, t]) => null != t),
              );
            if (0 === Object.keys(n).length) return;
            const r = await chrome.storage.session.get([
              StorageKey.ACCESS_TOKEN,
              StorageKey.REFRESH_TOKEN,
            ]);
            r[StorageKey.ACCESS_TOKEN] ||
              r[StorageKey.REFRESH_TOKEN] ||
              authResetCounter !== t ||
              (await chrome.storage.session.set(n)),
              await chrome.storage.local.remove(TOKEN_KEYS_WITH_HANDOFF);
          } catch (t) {}
        })()),
        tokenMigrationPromise)
      : Promise.resolve();
  },
  SILENT_REAUTH_GATE = "cic_ext_silent_reauth",
  serviceWorkerStartTime = Date.now(),
  silentReauthInFlight = !1;
async function silentReauth(t = {}) {
  const e = currentAuthEpoch();
  if (
    (await hydrateFeaturesFromStorage(),
    !getFeatureValue(SILENT_REAUTH_GATE, !0))
  )
    return "disabled_by_gate";
  const n = await getStoredValue(StorageKey.ACCOUNT_UUID);
  if (!n) return "no_stored_account";
  const r = parseTokenOrg(await getStoredValue(StorageKey.TOKEN_ORG)),
    s = getEnvironmentConfig(),
    i = randomBase64Url(32),
    o = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32))),
    a = await sha256Base64Url(o),
    c = chrome.identity.getRedirectURL(),
    u = new URLSearchParams({
      client_id: s.oauth.CLIENT_ID,
      response_type: "code",
      scope: s.oauth.SCOPES_STR,
      redirect_uri: c,
      state: i,
      code_challenge: a,
      code_challenge_method: "S256",
      prompt: "none",
      login_hint: n,
      ...(r && {
        orgUUID: r.uuid,
      }),
    });
  if (silentReauthInFlight) return "authorize_failed";
  silentReauthInFlight = !0;
  let l,
    d,
    h = !1;
  const f = Date.now();
  try {
    d = await Promise.race([
      chrome.identity
        .launchWebAuthFlow({
          url: `${s.oauth.AUTHORIZE_URL}?${u.toString()}`,
          interactive: !1,
          abortOnLoadForNonInteractive: !1,
          timeoutMsForNonInteractive: 15e3,
        })
        .finally(() => {
          silentReauthInFlight = !1;
        }),
      new Promise((t, e) => {
        l = setTimeout(() => {
          (h = !0), e(new Error("launchWebAuthFlow timeout"));
        }, 2e4);
      }),
    ]);
  } catch (w) {
    return (
      (t.cause = h
        ? "extension_timeout"
        : ((t, e) => {
            const n = String(t);
            return /timed out/i.test(n)
              ? "timed_out_page_loading"
              : /could not be loaded/i.test(n)
                ? "page_load_failed"
                : /interaction required/i.test(n)
                  ? e >= 14750
                    ? "timed_out_page_loaded"
                    : "chrome_stopped_early"
                  : "other_chrome_error";
          })(w, Date.now() - f)),
      "authorize_failed"
    );
  } finally {
    l && clearTimeout(l), (t.windowMs = Date.now() - f);
  }
  if (!d) return (t.cause = "unusable_redirect"), "authorize_failed";
  let m;
  try {
    m = new URL(d);
  } catch {
    return (t.cause = "unusable_redirect"), "authorize_failed";
  }
  const g = m.searchParams.get("error");
  if (g)
    return "login_required" === g
      ? "account_mismatch"
      : "consent_required" === g
        ? "consent_required"
        : "interaction_required" === g
          ? "interaction_required"
          : ((t.cause =
              "temporarily_unavailable" === g
                ? "temporarily_unavailable"
                : "unknown_error_code"),
            "authorize_failed");
  if (m.searchParams.get("state") !== i)
    return (t.cause = "unusable_redirect"), "authorize_failed";
  const _ = m.searchParams.get("code");
  if (!_) return (t.cause = "unusable_redirect"), "authorize_failed";
  const y = await exchangeAuthorizationCode(_, i, o, {
    ...s.oauth,
    REDIRECT_URI: c,
  });
  if (!y.success) return "code_exchange_failed";
  const v = null != y.accountUuid && y.accountUuid !== n;
  return (await storeOAuthTokens(
    {
      ...y,
      org: y.org ?? (v ? null : void 0),
    },
    i,
    {
      unlessAuthResetSince: e,
    },
  ))
    ? "success"
    : ((t.cause = "superseded"), "authorize_failed");
}
var refreshAccessToken = async (t, e) => {
    const n = getOauthRefreshTimeoutMs(),
      r = new AbortController(),
      s = setTimeout(() => r.abort(), n);
    try {
      const n = await fetch(e.TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: e.CLIENT_ID,
          refresh_token: t,
          expires_in: String(TOKEN_LIFETIME_SECONDS),
        }),
        signal: r.signal,
      });
      if (!n.ok) {
        const t = await n.text(),
          e =
            400 === n.status && t.includes("invalid_grant")
              ? "invalid_grant"
              : "server_error";
        return {
          success: !1,
          error: `Token refresh failed: ${n.status} ${t}`,
          failureReason: e,
        };
      }
      const s = await n.json();
      return s.error
        ? {
            success: !1,
            error: s.error_description || s.error,
            failureReason:
              "invalid_grant" === s.error ? "invalid_grant" : "server_error",
          }
        : {
            success: !0,
            accessToken: s.access_token,
            refreshToken: s.refresh_token || t,
            expiresAt: s.expires_in ? Date.now() + 1e3 * s.expires_in : void 0,
            org: getOrgFromResponse(s),
            accountUuid: getAccountUuid(s),
          };
    } catch (i) {
      return {
        success: !1,
        error:
          i instanceof DOMException && "AbortError" === i.name
            ? `Token refresh timed out after ${n}ms (auth endpoint unreachable or slow)`
            : i instanceof Error
              ? i.message
              : "Network error during token refresh",
        failureReason: "network_error",
      };
    } finally {
      clearTimeout(s);
    }
  },
  tokenRefreshInFlight = null,
  REAUTH_BACKOFF_MAX_MS = 3e5,
  reauthBackoffMs = (t) =>
    Math.min(3e4 * 2 ** Math.max(t - 1, 0), REAUTH_BACKOFF_MAX_MS),
  probeSessionWithTimeout = async () => {
    const t = new AbortController(),
      e = setTimeout(() => t.abort(), 8e3);
    try {
      return await probeClaudeAiSession(t.signal);
    } finally {
      clearTimeout(e);
    }
  };
var checkAndRefreshOAuth = () =>
  tokenRefreshInFlight ||
  (tokenRefreshInFlight = (async function () {
    const t = getCurrentPosture();
    try {
      const e = currentAuthEpoch();
      await migrateLocalTokensToSession();
      const n = await getStoredValues([
          StorageKey.ACCESS_TOKEN,
          StorageKey.REFRESH_TOKEN,
          StorageKey.TOKEN_EXPIRY,
        ]),
        r = !!n[StorageKey.ACCESS_TOKEN],
        s = !!n[StorageKey.REFRESH_TOKEN];
      if (!r && !s)
        return (await (async function () {
          if (!("ServiceWorkerGlobalScope" in globalThis)) return !1;
          if (!(await getStoredValue(StorageKey.ACCOUNT_UUID))) return !1;
          let t = (await getStoredValue(StorageKey.STARTUP_REAUTH_STATE)) ?? {};
          if (silentReauthInFlight) return !1;
          if (t.terminal) {
            if ("logged_out" !== t.stop) return !1;
            if (Date.now() - (t.lastProbeAt ?? 0) < 3e5) return !1;
            const e = lastTokenStoredAt,
              n = getAuthResetCounter(),
              r = async () => {
                if (
                  lastTokenStoredAt !== e ||
                  getAuthResetCounter() !== n ||
                  (await getStoredValue(StorageKey.ACCESS_TOKEN))
                )
                  return !0;
                const t = await getStoredValue(StorageKey.STARTUP_REAUTH_STATE);
                return !0 !== t?.terminal || "logged_out" !== t.stop;
              };
            if (
              (await hydrateFeaturesFromStorage(),
              !getFeatureValue(SILENT_REAUTH_GATE, !0))
            )
              return !1;
            if (await r()) return !1;
            if (
              (await setStoredValue(StorageKey.STARTUP_REAUTH_STATE, {
                ...t,
                lastProbeAt: Date.now(),
              }),
              !0 !== (await probeSessionWithTimeout()))
            )
              return !1;
            if (await r()) return !1;
            t = {};
          }
          if (t.until && Date.now() < t.until) return !1;
          const e = Date.now(),
            n = getCurrentPosture();
          await setStoredValue(StorageKey.STARTUP_REAUTH_STATE, {
            ...t,
            until: e + REAUTH_BACKOFF_MAX_MS,
          });
          const r = lastTokenStoredAt,
            s = getAuthResetCounter(),
            i = {},
            o = await silentReauth(i);
          if ("disabled_by_gate" === o) return !1;
          const a = "superseded" === i.cause,
            c =
              a || ("authorize_failed" !== o && "interaction_required" !== o)
                ? void 0
                : await probeSessionWithTimeout();
          if (
            (runUnlessManaged(n, () =>
              logExtensionEvent("chrome_ext_oauth_startup_reauth", {
                outcome: o,
                claude_ai_session:
                  void 0 === c ? "unknown" : c ? "present" : "absent",
                ...(i.cause && {
                  cause: i.cause,
                }),
                ...(void 0 !== i.windowMs && {
                  window_ms: i.windowMs,
                }),
                sw_uptime_ms: e - serviceWorkerStartTime,
              }),
            ),
            "success" === o)
          )
            return !0;
          if (a) return !!(await getStoredValue(StorageKey.ACCESS_TOKEN));
          const u = async () =>
              !(
                lastTokenStoredAt === r &&
                getAuthResetCounter() === s &&
                !(await getStoredValue(StorageKey.ACCESS_TOKEN))
              ) ||
              void 0 ===
                (await getStoredValue(StorageKey.STARTUP_REAUTH_STATE)),
            l = async (t) => {
              (await u()) ||
                (await setStoredValues({
                  [StorageKey.STARTUP_REAUTH_STATE]: {
                    terminal: !0,
                    stop: t,
                    lastProbeAt: e,
                  },
                  [StorageKey.LAST_AUTH_FAILURE_REASON]: "session_expired",
                }));
            };
          if ("account_mismatch" === o || "consent_required" === o)
            return await l("definitive"), !1;
          if (!1 === c) return await l("logged_out"), !1;
          const d = (t.strikes ?? 0) + 1;
          if ("interaction_required" === o && void 0 === c) {
            const e = (t.irStrikes ?? 0) + 1;
            return e >= 3
              ? (await l("logged_out"), !1)
              : ((await u()) ||
                  (await setStoredValue(StorageKey.STARTUP_REAUTH_STATE, {
                    strikes: d,
                    irStrikes: e,
                    until: Date.now() + reauthBackoffMs(d),
                  })),
                !1);
          }
          return (
            (await u()) ||
              (await setStoredValue(StorageKey.STARTUP_REAUTH_STATE, {
                strikes: d,
                until: Date.now() + reauthBackoffMs(d),
              })),
            !1
          );
        })())
          ? {
              isValid: !0,
              isRefreshed: !0,
            }
          : {
              isValid: !1,
              isRefreshed: !1,
            };
      const i = Date.now(),
        o = n[StorageKey.TOKEN_EXPIRY],
        a = r && !!o && i < o;
      if (r && !(o && i >= o - TOKEN_REFRESH_SKEW_MS))
        return {
          isValid: a,
          isRefreshed: !1,
        };
      if (!s)
        return (
          a ||
            (await setStoredValue(
              StorageKey.LAST_AUTH_FAILURE_REASON,
              "session_expired",
            )),
          {
            isValid: a,
            isRefreshed: !1,
          }
        );
      const c = getEnvironmentConfig(),
        u = {
          was_access_token_expired: !a,
          was_access_token_missing: !r,
        };
      for (let l = 0; l < 3; l++) {
        const r = await refreshAccessToken(
          n[StorageKey.REFRESH_TOKEN],
          c.oauth,
        );
        if (r.success)
          return (await storeOAuthTokens(r, void 0, {
            unlessAuthResetSince: e,
          }))
            ? (logOAuthRefresh("success", {
                ...u,
                attempt: l,
                tokens_deleted: !1,
              }),
              {
                isValid: !0,
                isRefreshed: !0,
              })
            : {
                isValid: !1,
                isRefreshed: !1,
              };
        if ("invalid_grant" === r.failureReason) {
          await clearStoredKeys(StorageKey.REFRESH_TOKEN);
          const e = await silentReauth();
          return "success" === e
            ? (runUnlessManaged(t, () =>
                logOAuthRefresh("invalid_grant", {
                  ...u,
                  attempt: l,
                  tokens_deleted: !1,
                  silent_reauth_outcome: e,
                }),
              ),
              {
                isValid: !0,
                isRefreshed: !0,
              })
            : (a ||
                (await setStoredValue(
                  StorageKey.LAST_AUTH_FAILURE_REASON,
                  "session_expired",
                )),
              runUnlessManaged(t, () =>
                logOAuthRefresh("invalid_grant", {
                  ...u,
                  attempt: l,
                  tokens_deleted: !1,
                  silent_reauth_outcome: e,
                }),
              ),
              {
                isValid: a,
                isRefreshed: !1,
              });
        }
        if (2 === l)
          return (
            logOAuthRefresh(r.failureReason ?? "network_error", {
              ...u,
              attempt: l,
              tokens_deleted: !1,
            }),
            {
              isValid: a,
              isRefreshed: !1,
            }
          );
      }
      return {
        isValid: a,
        isRefreshed: !1,
      };
    } catch {
      return {
        isValid: !1,
        isRefreshed: !1,
      };
    }
  })().finally(() => {
    tokenRefreshInFlight = null;
  }));
var getValidAccessToken = async () => {
    if ((await checkAndRefreshOAuth()).isValid)
      return (await getStoredValue(StorageKey.ACCESS_TOKEN)) || void 0;
  },
  getAccessTokenFromAnyContext = async () => {
    if ("ServiceWorkerGlobalScope" in globalThis) return getValidAccessToken();
    try {
      const t = await chrome.runtime.sendMessage({
        type: "check_and_refresh_oauth",
      });
      if (t?.isValid) return getStoredValue(StorageKey.ACCESS_TOKEN);
      if (t) return;
    } catch {}
    return getValidAccessToken();
  },
  profileFetchInFlight = null,
  profile401Count = 0,
  profile401Token = null,
  lastTokenClearAt = 0,
  lastTokenStoredAt = 0,
  fetchAccountUuid = async (t, e) => {
    const n = t ?? (await getValidAccessToken());
    if (!n) return;
    if (!e?.forceRefresh)
      try {
        const t = await getStoredValue(StorageKey.ACCOUNT_UUID);
        if (t) return t;
      } catch {}
    if (profileFetchInFlight?.token === n) return profileFetchInFlight.promise;
    const r = (async (t) => {
      try {
        const e = getEnvironmentConfig(),
          n = await fetch(`${e.apiBaseUrl}/api/oauth/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${t}`,
              "Content-Type": "application/json",
              "anthropic-client-platform": "claude_browser_extension",
            },
            signal: AbortSignal.timeout(getOauthRefreshTimeoutMs()),
          });
        if (!n.ok) {
          if (401 === n.status && Date.now() - lastTokenStoredAt >= 5e3) {
            if (
              (profile401Token === t
                ? profile401Count++
                : ((profile401Token = t), (profile401Count = 1)),
              profile401Count >= 2)
            ) {
              if (Date.now() - lastTokenClearAt >= 9e5)
                try {
                  (await getStoredValue(StorageKey.ACCESS_TOKEN)) === t &&
                    (clearStoredKeys(StorageKey.ACCESS_TOKEN).catch(() => {}),
                    (lastTokenClearAt = Date.now()));
                } catch {}
              (profile401Count = 0), (profile401Token = null);
            }
          } else
            403 === n.status &&
              ((profile401Count = 0), (profile401Token = null));
          return;
        }
        (profile401Count = 0), (profile401Token = null);
        const r = (await n.json())?.account?.uuid;
        if (r)
          try {
            (await getStoredValue(StorageKey.ACCESS_TOKEN)) === t &&
              (await setStoredValue(StorageKey.ACCOUNT_UUID, r));
          } catch {}
        return r;
      } catch (e) {
        return;
      }
    })(n);
    profileFetchInFlight = {
      token: n,
      promise: r,
    };
    try {
      return await r;
    } finally {
      profileFetchInFlight?.promise === r && (profileFetchInFlight = null);
    }
  },
  isExpectedSignInState = async (t) => {
    let e;
    try {
      e = new URL(t).searchParams.get("state");
    } catch {
      return !1;
    }
    return !!e && e === (await getStoredValue(StorageKey.SIGN_IN_STATE));
  },
  handleOAuthCallback = async (t, e) => {
    try {
      const n = new URLSearchParams(new URL(t).search),
        r = n.get("code"),
        s = n.get("error"),
        i = n.get("error_description"),
        o = n.get("state");
      if (s) {
        return {
          success: !1,
          error: `Authentication failed: ${s}${i ? " - " + i : ""}`,
        };
      }
      if (!r)
        return {
          success: !1,
          error: "No authorization code received",
        };
      const a = (await getStoredValue(StorageKey.CODE_VERIFIER)) || "",
        c = getEnvironmentConfig(),
        u = await exchangeAuthorizationCode(r, o || "", a, c.oauth);
      if (u.success) {
        try {
          await chrome.storage.session.remove(PROFILE_CACHE_KEY);
        } catch {}
        const t = u.accountUuid ?? null;
        await storeOAuthTokens(
          {
            ...u,
            org: u.org ?? null,
            accountUuid: t,
          },
          o || void 0,
        );
        try {
          await chrome.storage.session.remove(PROFILE_CACHE_KEY);
        } catch {}
        try {
          t
            ? await setStoredValue(StorageKey.ACCOUNT_UUID, t)
            : await removeStoredKeys(StorageKey.ACCOUNT_UUID);
        } catch {}
        const n = "https://claude.ai/chrome/installed";
        if (e) {
          const t =
            getCurrentPosture()?.managed ||
            (await getStoredValue(StorageKey.OAUTH_ORG_SWITCH).catch(() => !1));
          try {
            await (t
              ? chrome.tabs.remove(e)
              : chrome.tabs.update(e, {
                  url: n,
                }));
          } catch {}
        }
        return (
          fetchAccountUuid(u.accessToken),
          {
            success: !0,
            message: "Authentication successful!",
          }
        );
      }
      return {
        success: !1,
        error: u.error || "Failed to exchange authorization code for token",
      };
    } catch (n) {
      return {
        success: !1,
        error:
          n instanceof Error
            ? n.message
            : "An unexpected error occurred during authentication",
      };
    }
  },
  signOut = async function () {
    authResetCounter += 1;
    try {
      await clearAccountStorage();
    } finally {
      await chrome.storage.local.remove(TOKEN_KEYS_WITH_HANDOFF);
    }
  },
  startOAuthLogin = async (t = {}) => {
    const e = getEnvironmentConfig(),
      n = randomBase64Url(32),
      r = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32))),
      s = await sha256Base64Url(r);
    await setStoredValues({
      [StorageKey.SIGN_IN_STATE]: n,
      [StorageKey.CODE_VERIFIER]: r,
      [StorageKey.OAUTH_ORG_SWITCH]: !!t.orgUUID,
    });
    const i = new URLSearchParams({
        client_id: e.oauth.CLIENT_ID,
        response_type: "code",
        scope: e.oauth.SCOPES_STR,
        redirect_uri: e.oauth.REDIRECT_URI,
        state: n,
        code_challenge: s,
        code_challenge_method: "S256",
        ...(t.orgUUID && {
          orgUUID: t.orgUUID,
        }),
      }),
      o = `${e.oauth.AUTHORIZE_URL}?${i.toString()}`;
    chrome.tabs.create({
      url: o,
    });
  },
  DEBUG_BUILD = "undefined" == typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__,
  GLOBAL_OBJ = globalThis,
  SDK_VERSION = "10.53.1";
function getGlobalSentry() {
  return getSentryCarrier(GLOBAL_OBJ), GLOBAL_OBJ;
}
function getSentryCarrier(t) {
  const e = (t.__SENTRY__ = t.__SENTRY__ || {});
  return (
    (e.version = e.version || "10.53.1"), (e[SDK_VERSION] = e["10.53.1"] || {})
  );
}
function getGlobalSingleton(t, e, n = GLOBAL_OBJ) {
  const r = (n.__SENTRY__ = n.__SENTRY__ || {}),
    s = (r[SDK_VERSION] = r["10.53.1"] || {});
  return s[t] || (s[t] = e());
}
var CONSOLE_LEVELS = [
    "debug",
    "info",
    "warn",
    "error",
    "log",
    "assert",
    "trace",
  ],
  originalConsoleMethods = {};
function withOriginalConsole(t) {
  if (!("console" in GLOBAL_OBJ)) return t();
  const e = GLOBAL_OBJ.console,
    n = {},
    r = Object.keys(originalConsoleMethods);
  r.forEach((t) => {
    const r = originalConsoleMethods[t];
    (n[t] = e[t]), (e[t] = r);
  });
  try {
    return t();
  } finally {
    r.forEach((t) => {
      e[t] = n[t];
    });
  }
}
function isLoggerEnabled() {
  return getLoggerSettings().enabled;
}
function logWithPrefix(t, ...e) {
  DEBUG_BUILD &&
    isLoggerEnabled() &&
    withOriginalConsole(() => {
      GLOBAL_OBJ.console[t](`Sentry Logger [${t}]:`, ...e);
    });
}
function getLoggerSettings() {
  return DEBUG_BUILD
    ? getGlobalSingleton("loggerSettings", () => ({
        enabled: !1,
      }))
    : {
        enabled: !1,
      };
}
var sentryLogger = {
    enable: function () {
      getLoggerSettings().enabled = !0;
    },
    disable: function () {
      getLoggerSettings().enabled = !1;
    },
    isEnabled: isLoggerEnabled,
    log: function (...t) {
      logWithPrefix("log", ...t);
    },
    warn: function (...t) {
      logWithPrefix("warn", ...t);
    },
    error: function (...t) {
      logWithPrefix("error", ...t);
    },
  },
  ERROR_PAREN_PATTERN = /\(error: (.*)\)/,
  CAPTURE_FRAME_PATTERN = /captureMessage|captureException/;
function createStackParser(...t) {
  const e = t.sort((t, e) => t[0] - e[0]).map((t) => t[1]);
  return (t, n = 0, r = 0) => {
    const s = [],
      i = t.split("\n");
    for (let o = n; o < i.length; o++) {
      let t = i[o];
      t.length > 1024 && (t = t.slice(0, 1024));
      const n = ERROR_PAREN_PATTERN.test(t)
        ? t.replace(ERROR_PAREN_PATTERN, "$1")
        : t;
      if (!n.includes("Error: ")) {
        for (const t of e) {
          const e = t(n);
          if (e) {
            s.push(e);
            break;
          }
        }
        if (s.length >= 50 + r) break;
      }
    }
    return (function (t) {
      if (!t.length) return [];
      const e = Array.from(t);
      /sentryWrapped/.test(lastElement(e).function || "") && e.pop();
      e.reverse(),
        CAPTURE_FRAME_PATTERN.test(lastElement(e).function || "") &&
          (e.pop(),
          CAPTURE_FRAME_PATTERN.test(lastElement(e).function || "") && e.pop());
      return e.slice(0, 50).map((t) => ({
        ...t,
        filename: t.filename || lastElement(e).filename,
        function: t.function || "?",
      }));
    })(s.slice(r));
  };
}
function lastElement(t) {
  return t[t.length - 1] || {};
}
var ANONYMOUS_FUNCTION_NAME = "<anonymous>";
function getFunctionName(t) {
  try {
    return (t && "function" == typeof t && t.name) || ANONYMOUS_FUNCTION_NAME;
  } catch {
    return ANONYMOUS_FUNCTION_NAME;
  }
}
function getFramesFromEvent(t) {
  const e = t.exception;
  if (e) {
    const t = [];
    try {
      return (
        e.values.forEach((e) => {
          e.stacktrace.frames && t.push(...e.stacktrace.frames);
        }),
        t
      );
    } catch {
      return;
    }
  }
}
function stringifyVueValue(t) {
  return "__v_isVNode" in t && t.__v_isVNode ? "[VueVNode]" : "[VueViewModel]";
}
var instrumentationHandlers = {},
  instrumentedTypes = {};
function addInstrumentationHandler(t, e) {
  return (
    (instrumentationHandlers[t] = instrumentationHandlers[t] || []),
    instrumentationHandlers[t].push(e),
    () => {
      const n = instrumentationHandlers[t];
      if (n) {
        const t = n.indexOf(e);
        -1 !== t && n.splice(t, 1);
      }
    }
  );
}
function instrumentOnce(t, e) {
  if (!instrumentedTypes[t]) {
    instrumentedTypes[t] = !0;
    try {
      e();
    } catch (n) {
      DEBUG_BUILD && sentryLogger.error(`Error while instrumenting ${t}`, n);
    }
  }
}
function triggerHandlers(t, e) {
  const n = t && instrumentationHandlers[t];
  if (n)
    for (const s of n)
      try {
        s(e);
      } catch (r) {
        DEBUG_BUILD &&
          sentryLogger.error(
            `Error while triggering instrumentation handler.\nType: ${t}\nName: ${getFunctionName(s)}\nError:`,
            r,
          );
      }
}
var originalOnError = null;
function instrumentGlobalOnError() {
  (originalOnError = GLOBAL_OBJ.onerror),
    (GLOBAL_OBJ.onerror = function (t, e, n, r, s) {
      return (
        triggerHandlers("error", {
          column: r,
          error: s,
          line: n,
          msg: t,
          url: e,
        }),
        !!originalOnError && originalOnError.apply(this, arguments)
      );
    }),
    (GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = !0);
}
var originalOnUnhandledRejection = null;
function instrumentUnhandledRejection() {
  (originalOnUnhandledRejection = GLOBAL_OBJ.onunhandledrejection),
    (GLOBAL_OBJ.onunhandledrejection = function (t) {
      return (
        triggerHandlers("unhandledrejection", t),
        !originalOnUnhandledRejection ||
          originalOnUnhandledRejection.apply(this, arguments)
      );
    }),
    (GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0);
}
var objectToString = Object.prototype.toString;
function isError(t) {
  switch (objectToString.call(t)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return !0;
    default:
      return isInstanceOf(t, Error);
  }
}
function hasBuiltinTag(t, e) {
  return objectToString.call(t) === `[object ${e}]`;
}
function isErrorEvent(t) {
  return hasBuiltinTag(t, "ErrorEvent");
}
function isDomError(t) {
  return hasBuiltinTag(t, "DOMError");
}
function isString(t) {
  return hasBuiltinTag(t, "String");
}
function isParameterizedString(t) {
  return (
    "object" == typeof t &&
    null !== t &&
    "__sentry_template_string__" in t &&
    "__sentry_template_values__" in t
  );
}
function isPrimitive(t) {
  return (
    null === t ||
    isParameterizedString(t) ||
    ("object" != typeof t && "function" != typeof t)
  );
}
function isPlainObjectTag(t) {
  return hasBuiltinTag(t, "Object");
}
function isEvent(t) {
  return "undefined" != typeof Event && isInstanceOf(t, Event);
}
function isThenable(t) {
  return Boolean(t?.then && "function" == typeof t.then);
}
function isInstanceOf(t, e) {
  try {
    return t instanceof e;
  } catch {
    return !1;
  }
}
function isVueViewModel(t) {
  return !(
    "object" != typeof t ||
    null === t ||
    !(t.__isVue || t._isVue || t.__v_isVNode)
  );
}
function isRequest(t) {
  return "undefined" != typeof Request && isInstanceOf(t, Request);
}
var xs,
  Ps,
  globalObject = GLOBAL_OBJ;
function htmlTreeAsString(t, e = {}) {
  if (!t) return "<unknown>";
  try {
    let n = t;
    const r = 5,
      s = [];
    let i = 0,
      o = 0;
    const a = " > ",
      c = 3;
    let u;
    const l = Array.isArray(e) ? e : e.keyAttrs,
      d = (!Array.isArray(e) && e.maxStringLength) || 80;
    for (
      ;
      n &&
      i++ < r &&
      ((u = describeElement(n, l)),
      !("html" === u || (i > 1 && o + s.length * c + u.length >= d)));

    )
      s.push(u), (o += u.length), (n = n.parentNode);
    return s.reverse().join(a);
  } catch {
    return "<unknown>";
  }
}
function describeElement(t, e) {
  const n = t,
    r = [];
  if (!n?.tagName) return "";
  if (globalObject.HTMLElement && n instanceof HTMLElement && n.dataset) {
    if (n.dataset.sentryComponent) return n.dataset.sentryComponent;
    if (n.dataset.sentryElement) return n.dataset.sentryElement;
  }
  r.push(n.tagName.toLowerCase());
  const s = e?.length
    ? e.filter((t) => n.getAttribute(t)).map((t) => [t, n.getAttribute(t)])
    : null;
  if (s?.length)
    s.forEach((t) => {
      r.push(`[${t[0]}="${t[1]}"]`);
    });
  else {
    n.id && r.push(`#${n.id}`);
    const t = n.className;
    if (t && isString(t)) {
      const e = t.split(/\s+/);
      for (const t of e) r.push(`.${t}`);
    }
  }
  for (const i of ["aria-label", "type", "name", "title", "alt"]) {
    const t = n.getAttribute(i);
    t && r.push(`[${i}="${t}"]`);
  }
  return r.join("");
}
function getLocationHref() {
  try {
    return globalObject.document.location.href;
  } catch {
    return "";
  }
}
function wrapMethod(t, e, n) {
  if (!(e in t)) return;
  const r = t[e];
  if ("function" != typeof r) return;
  const s = n(r);
  "function" == typeof s && markFunctionWrapped(s, r);
  try {
    t[e] = s;
  } catch {
    DEBUG_BUILD &&
      sentryLogger.log(`Failed to replace method "${e}" in object`, t);
  }
}
function addNonEnumerableProperty(t, e, n) {
  try {
    Object.defineProperty(t, e, {
      value: n,
      writable: !0,
      configurable: !0,
    });
  } catch {
    DEBUG_BUILD &&
      sentryLogger.log(
        `Failed to add non-enumerable property "${String(e)}" to object`,
        t,
      );
  }
}
function markFunctionWrapped(t, e) {
  try {
    (t.prototype = e.prototype = e.prototype || {}),
      addNonEnumerableProperty(t, "__sentry_original__", e);
  } catch {}
}
function getOriginalFunction(t) {
  return t.__sentry_original__;
}
function convertToPlainObject(t) {
  if (isError(t))
    return {
      message: t.message,
      name: t.name,
      stack: t.stack,
      ...getOwnProperties(t),
    };
  if (isEvent(t)) {
    const e = {
      type: t.type,
      target: serializeEventTarget(t.target),
      currentTarget: serializeEventTarget(t.currentTarget),
      ...getOwnProperties(t),
    };
    return (
      "undefined" != typeof CustomEvent &&
        isInstanceOf(t, CustomEvent) &&
        (e.detail = t.detail),
      e
    );
  }
  return t;
}
function serializeEventTarget(t) {
  try {
    return (
      (e = t),
      "undefined" != typeof Element && isInstanceOf(e, Element)
        ? htmlTreeAsString(t)
        : Object.prototype.toString.call(t)
    );
  } catch {
    return "<unknown>";
  }
  var e;
}
function getOwnProperties(t) {
  return "object" == typeof t && null !== t
    ? Object.fromEntries(Object.entries(t))
    : {};
}
function withRandomSafeContext(t) {
  if (void 0 !== xs) return xs ? xs(t) : t();
  const e = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__"),
    n = GLOBAL_OBJ;
  return e in n && "function" == typeof n[e]
    ? (xs = n[e])(t)
    : ((xs = null), t());
}
function safeMathRandom() {
  return withRandomSafeContext(() => Math.random());
}
function safeDateNow() {
  return withRandomSafeContext(() => Date.now());
}
function truncateString(t, e = 0) {
  return "string" != typeof t || 0 === e || t.length <= e
    ? t
    : `${t.slice(0, e)}...`;
}
function safeJoin(t, e) {
  if (!Array.isArray(t)) return "";
  const n = [];
  for (let r = 0; r < t.length; r++) {
    const e = t[r];
    try {
      isVueViewModel(e) ? n.push(stringifyVueValue(e)) : n.push(String(e));
    } catch {
      n.push("[value cannot be serialized]");
    }
  }
  return n.join(e);
}
function isMatchingPattern(t, e, n = !1) {
  return (
    !!isString(t) &&
    (hasBuiltinTag(e, "RegExp")
      ? e.test(t)
      : isString(e)
        ? n
          ? t === e
          : t.includes(e)
        : "function" == typeof e && e(t))
  );
}
function stringMatchesSomePattern(t, e = [], n = !1) {
  for (const r of e) if (isMatchingPattern(t, r, n)) return !0;
  return !1;
}
function generateUuid2(
  t = (function () {
    const t = GLOBAL_OBJ;
    return t.crypto || t.msCrypto;
  })(),
) {
  try {
    if (t?.randomUUID)
      return withRandomSafeContext(() => t.randomUUID()).replace(/-/g, "");
  } catch {}
  return (
    Ps || (Ps = "10000000100040008000100000000000"),
    Ps.replace(/[018]/g, (t) =>
      (t ^ (((16 * safeMathRandom()) & 15) >> (t / 4))).toString(16),
    )
  );
}
function getFirstException(t) {
  return t.exception?.values?.[0];
}
function getEventDescription(t) {
  const { message: e, event_id: n } = t;
  if (e) return e;
  const r = getFirstException(t);
  return r
    ? r.type && r.value
      ? `${r.type}: ${r.value}`
      : r.type || r.value || n || "<unknown>"
    : n || "<unknown>";
}
function addExceptionTypeValue(t, e, n) {
  const r = (t.exception = t.exception || {}),
    s = (r.values = r.values || []),
    i = (s[0] = s[0] || {});
  i.value || (i.value = e || ""), i.type || (i.type = n || "Error");
}
function addExceptionMechanism(t, e) {
  const n = getFirstException(t);
  if (!n) return;
  const r = n.mechanism;
  if (
    ((n.mechanism = {
      type: "generic",
      handled: !0,
      ...r,
      ...e,
    }),
    e && "data" in e)
  ) {
    const t = {
      ...r?.data,
      ...e.data,
    };
    n.mechanism.data = t;
  }
}
function checkOrSetAlreadyCaught(t) {
  if (
    (function (t) {
      try {
        return t.__sentry_captured__;
      } catch {}
    })(t)
  )
    return !0;
  try {
    addNonEnumerableProperty(t, "__sentry_captured__", !0);
  } catch {}
  return !1;
}
var cachedTimestampProvider;
function dateTimestampInSeconds() {
  return safeDateNow() / 1e3;
}
function timestampInSeconds() {
  return (
    cachedTimestampProvider ??
    (cachedTimestampProvider = (function () {
      const { performance: t } = GLOBAL_OBJ;
      if (!t?.now || !t.timeOrigin) return dateTimestampInSeconds;
      const e = t.timeOrigin;
      return () => (e + withRandomSafeContext(() => t.now())) / 1e3;
    })())
  )();
}
function makeSession(t) {
  const e = timestampInSeconds(),
    n = {
      sid: generateUuid2(),
      init: !0,
      timestamp: e,
      started: e,
      duration: 0,
      status: "ok",
      errors: 0,
      ignoreDuration: !1,
      toJSON: () =>
        (function (t) {
          return {
            sid: `${t.sid}`,
            init: t.init,
            started: new Date(1e3 * t.started).toISOString(),
            timestamp: new Date(1e3 * t.timestamp).toISOString(),
            status: t.status,
            errors: t.errors,
            did:
              "number" == typeof t.did || "string" == typeof t.did
                ? `${t.did}`
                : void 0,
            duration: t.duration,
            abnormal_mechanism: t.abnormal_mechanism,
            attrs: {
              release: t.release,
              environment: t.environment,
              ip_address: t.ipAddress,
              user_agent: t.userAgent,
            },
          };
        })(n),
    };
  return t && updateSession(n, t), n;
}
function updateSession(t, e = {}) {
  if (
    (e.user &&
      (!t.ipAddress && e.user.ip_address && (t.ipAddress = e.user.ip_address),
      t.did || e.did || (t.did = e.user.id || e.user.email || e.user.username)),
    (t.timestamp = e.timestamp || timestampInSeconds()),
    e.abnormal_mechanism && (t.abnormal_mechanism = e.abnormal_mechanism),
    e.ignoreDuration && (t.ignoreDuration = e.ignoreDuration),
    e.sid && (t.sid = 32 === e.sid.length ? e.sid : generateUuid2()),
    void 0 !== e.init && (t.init = e.init),
    !t.did && e.did && (t.did = `${e.did}`),
    "number" == typeof e.started && (t.started = e.started),
    t.ignoreDuration)
  )
    t.duration = void 0;
  else if ("number" == typeof e.duration) t.duration = e.duration;
  else {
    const e = t.timestamp - t.started;
    t.duration = e >= 0 ? e : 0;
  }
  e.release && (t.release = e.release),
    e.environment && (t.environment = e.environment),
    !t.ipAddress && e.ipAddress && (t.ipAddress = e.ipAddress),
    !t.userAgent && e.userAgent && (t.userAgent = e.userAgent),
    "number" == typeof e.errors && (t.errors = e.errors),
    e.status && (t.status = e.status);
}
function mergeDeep(t, e, n = 2) {
  if (!e || "object" != typeof e || n <= 0) return e;
  if (t && 0 === Object.keys(e).length) return t;
  const r = {
    ...t,
  };
  for (const s in e)
    Object.prototype.hasOwnProperty.call(e, s) &&
      (r[s] = mergeDeep(r[s], e[s], n - 1));
  return r;
}
function generateTraceId() {
  return generateUuid2();
}
function generateSpanId() {
  return generateUuid2().substring(16);
}
var SCOPE_SPAN_KEY = "_sentrySpan";
function setSpanOnScope(t, e) {
  e ? addNonEnumerableProperty(t, SCOPE_SPAN_KEY, e) : delete t[SCOPE_SPAN_KEY];
}
function getSpanFromScope(t) {
  return t[SCOPE_SPAN_KEY];
}
var SentryScope = class t {
  constructor() {
    (this._notifyingListeners = !1),
      (this._scopeListeners = []),
      (this._eventProcessors = []),
      (this._breadcrumbs = []),
      (this._attachments = []),
      (this._user = {}),
      (this._tags = {}),
      (this._attributes = {}),
      (this._extra = {}),
      (this._contexts = {}),
      (this._sdkProcessingMetadata = {}),
      (this._propagationContext = {
        traceId: generateTraceId(),
        sampleRand: safeMathRandom(),
      });
  }
  clone() {
    const e = new t();
    return (
      (e._breadcrumbs = [...this._breadcrumbs]),
      (e._tags = {
        ...this._tags,
      }),
      (e._attributes = {
        ...this._attributes,
      }),
      (e._extra = {
        ...this._extra,
      }),
      (e._contexts = {
        ...this._contexts,
      }),
      this._contexts.flags &&
        (e._contexts.flags = {
          values: [...this._contexts.flags.values],
        }),
      (e._user = this._user),
      (e._level = this._level),
      (e._session = this._session),
      (e._transactionName = this._transactionName),
      (e._fingerprint = this._fingerprint),
      (e._eventProcessors = [...this._eventProcessors]),
      (e._attachments = [...this._attachments]),
      (e._sdkProcessingMetadata = {
        ...this._sdkProcessingMetadata,
      }),
      (e._propagationContext = {
        ...this._propagationContext,
      }),
      (e._client = this._client),
      (e._lastEventId = this._lastEventId),
      (e._conversationId = this._conversationId),
      setSpanOnScope(e, getSpanFromScope(this)),
      e
    );
  }
  setClient(t) {
    this._client = t;
  }
  setLastEventId(t) {
    this._lastEventId = t;
  }
  getClient() {
    return this._client;
  }
  lastEventId() {
    return this._lastEventId;
  }
  addScopeListener(t) {
    this._scopeListeners.push(t);
  }
  addEventProcessor(t) {
    return this._eventProcessors.push(t), this;
  }
  setUser(t) {
    return (
      (this._user = t || {
        email: void 0,
        id: void 0,
        ip_address: void 0,
        username: void 0,
      }),
      this._session &&
        updateSession(this._session, {
          user: t,
        }),
      this._notifyScopeListeners(),
      this
    );
  }
  getUser() {
    return this._user;
  }
  setConversationId(t) {
    return (
      (this._conversationId = t || void 0), this._notifyScopeListeners(), this
    );
  }
  setTags(t) {
    return (
      (this._tags = {
        ...this._tags,
        ...t,
      }),
      this._notifyScopeListeners(),
      this
    );
  }
  setTag(t, e) {
    return this.setTags({
      [t]: e,
    });
  }
  setAttributes(t) {
    return (
      (this._attributes = {
        ...this._attributes,
        ...t,
      }),
      this._notifyScopeListeners(),
      this
    );
  }
  setAttribute(t, e) {
    return this.setAttributes({
      [t]: e,
    });
  }
  removeAttribute(t) {
    return (
      t in this._attributes &&
        (delete this._attributes[t], this._notifyScopeListeners()),
      this
    );
  }
  setExtras(t) {
    return (
      (this._extra = {
        ...this._extra,
        ...t,
      }),
      this._notifyScopeListeners(),
      this
    );
  }
  setExtra(t, e) {
    return (
      (this._extra = {
        ...this._extra,
        [t]: e,
      }),
      this._notifyScopeListeners(),
      this
    );
  }
  setFingerprint(t) {
    return (this._fingerprint = t), this._notifyScopeListeners(), this;
  }
  setLevel(t) {
    return (this._level = t), this._notifyScopeListeners(), this;
  }
  setTransactionName(t) {
    return (this._transactionName = t), this._notifyScopeListeners(), this;
  }
  setContext(t, e) {
    return (
      null === e ? delete this._contexts[t] : (this._contexts[t] = e),
      this._notifyScopeListeners(),
      this
    );
  }
  setSession(t) {
    return (
      t ? (this._session = t) : delete this._session,
      this._notifyScopeListeners(),
      this
    );
  }
  getSession() {
    return this._session;
  }
  update(e) {
    if (!e) return this;
    const n = "function" == typeof e ? e(this) : e,
      {
        tags: r,
        attributes: s,
        extra: i,
        user: o,
        contexts: a,
        level: c,
        fingerprint: u = [],
        propagationContext: l,
        conversationId: d,
      } = (n instanceof t
        ? n.getScopeData()
        : isPlainObjectTag(n)
          ? e
          : void 0) || {};
    return (
      (this._tags = {
        ...this._tags,
        ...r,
      }),
      (this._attributes = {
        ...this._attributes,
        ...s,
      }),
      (this._extra = {
        ...this._extra,
        ...i,
      }),
      (this._contexts = {
        ...this._contexts,
        ...a,
      }),
      o && Object.keys(o).length && (this._user = o),
      c && (this._level = c),
      u.length && (this._fingerprint = u),
      l && (this._propagationContext = l),
      d && (this._conversationId = d),
      this
    );
  }
  clear() {
    return (
      (this._breadcrumbs = []),
      (this._tags = {}),
      (this._attributes = {}),
      (this._extra = {}),
      (this._user = {}),
      (this._contexts = {}),
      (this._level = void 0),
      (this._transactionName = void 0),
      (this._fingerprint = void 0),
      (this._session = void 0),
      (this._conversationId = void 0),
      setSpanOnScope(this, void 0),
      (this._attachments = []),
      this.setPropagationContext({
        traceId: generateTraceId(),
        sampleRand: safeMathRandom(),
      }),
      this._notifyScopeListeners(),
      this
    );
  }
  addBreadcrumb(t, e) {
    const n = "number" == typeof e ? e : 100;
    if (n <= 0) return this;
    const r = {
      timestamp: dateTimestampInSeconds(),
      ...t,
      message: t.message ? truncateString(t.message, 2048) : t.message,
    };
    return (
      this._breadcrumbs.push(r),
      this._breadcrumbs.length > n &&
        ((this._breadcrumbs = this._breadcrumbs.slice(-n)),
        this._client?.recordDroppedEvent("buffer_overflow", "log_item")),
      this._notifyScopeListeners(),
      this
    );
  }
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  clearBreadcrumbs() {
    return (this._breadcrumbs = []), this._notifyScopeListeners(), this;
  }
  addAttachment(t) {
    return this._attachments.push(t), this;
  }
  clearAttachments() {
    return (this._attachments = []), this;
  }
  getScopeData() {
    return {
      breadcrumbs: this._breadcrumbs,
      attachments: this._attachments,
      contexts: this._contexts,
      tags: this._tags,
      attributes: this._attributes,
      extra: this._extra,
      user: this._user,
      level: this._level,
      fingerprint: this._fingerprint || [],
      eventProcessors: this._eventProcessors,
      propagationContext: this._propagationContext,
      sdkProcessingMetadata: this._sdkProcessingMetadata,
      transactionName: this._transactionName,
      span: getSpanFromScope(this),
      conversationId: this._conversationId,
    };
  }
  setSDKProcessingMetadata(t) {
    return (
      (this._sdkProcessingMetadata = mergeDeep(
        this._sdkProcessingMetadata,
        t,
        2,
      )),
      this
    );
  }
  setPropagationContext(t) {
    return (this._propagationContext = t), this;
  }
  getPropagationContext() {
    return this._propagationContext;
  }
  captureException(t, e) {
    const n = e?.event_id || generateUuid2();
    if (!this._client)
      return (
        DEBUG_BUILD &&
          sentryLogger.warn(
            "No client configured on scope - will not capture exception!",
          ),
        n
      );
    const r = new Error("Sentry syntheticException");
    return (
      this._client.captureException(
        t,
        {
          originalException: t,
          syntheticException: r,
          ...e,
          event_id: n,
        },
        this,
      ),
      n
    );
  }
  captureMessage(t, e, n) {
    const r = n?.event_id || generateUuid2();
    if (!this._client)
      return (
        DEBUG_BUILD &&
          sentryLogger.warn(
            "No client configured on scope - will not capture message!",
          ),
        r
      );
    const s = n?.syntheticException ?? new Error(t);
    return (
      this._client.captureMessage(
        t,
        e,
        {
          originalException: t,
          syntheticException: s,
          ...n,
          event_id: r,
        },
        this,
      ),
      r
    );
  }
  captureEvent(t, e) {
    const n = t.event_id || e?.event_id || generateUuid2();
    return this._client
      ? (this._client.captureEvent(
          t,
          {
            ...e,
            event_id: n,
          },
          this,
        ),
        n)
      : (DEBUG_BUILD &&
          sentryLogger.warn(
            "No client configured on scope - will not capture event!",
          ),
        n);
  }
  _notifyScopeListeners() {
    this._notifyingListeners ||
      ((this._notifyingListeners = !0),
      this._scopeListeners.forEach((t) => {
        t(this);
      }),
      (this._notifyingListeners = !1));
  }
};
var isUnchainedPromise = (t) =>
    t instanceof Promise && !t[CHAINED_PROMISE_SYMBOL],
  CHAINED_PROMISE_SYMBOL = Symbol("chained PromiseLike"),
  copyMissingPromiseProps = (t, e) => {
    if (!e) return t;
    let n = !1;
    for (const r in t) {
      if (r in e) continue;
      n = !0;
      const s = t[r];
      "function" == typeof s
        ? Object.defineProperty(e, r, {
            value: (...e) => s.apply(t, e),
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[r] = s);
    }
    return (
      n &&
        Object.assign(e, {
          [CHAINED_PROMISE_SYMBOL]: !0,
        }),
      e
    );
  },
  AsyncContextStack = class {
    constructor(t, e) {
      let n, r;
      (n = t || new SentryScope()),
        (r = e || new SentryScope()),
        (this._stack = [
          {
            scope: n,
          },
        ]),
        (this._isolationScope = r);
    }
    withScope(t) {
      const e = this._pushScope();
      let n;
      try {
        n = t(e);
      } catch (r) {
        throw (this._popScope(), r);
      }
      return isThenable(n)
        ? ((t, e, n) => {
            const r = t.then(
              (t) => (e(t), t),
              (t) => {
                throw (n(t), t);
              },
            );
            return isUnchainedPromise(r) && isUnchainedPromise(t)
              ? r
              : copyMissingPromiseProps(t, r);
          })(
            n,
            () => this._popScope(),
            () => this._popScope(),
          )
        : (this._popScope(), n);
    }
    getClient() {
      return this.getStackTop().client;
    }
    getScope() {
      return this.getStackTop().scope;
    }
    getIsolationScope() {
      return this._isolationScope;
    }
    getStackTop() {
      return this._stack[this._stack.length - 1];
    }
    _pushScope() {
      const t = this.getScope().clone();
      return (
        this._stack.push({
          client: this.getClient(),
          scope: t,
        }),
        t
      );
    }
    _popScope() {
      return !(this._stack.length <= 1) && !!this._stack.pop();
    }
  };
function getAsyncContextStack() {
  const t = getSentryCarrier(getGlobalSentry());
  return (t.stack =
    t.stack ||
    new AsyncContextStack(
      getGlobalSingleton("defaultCurrentScope", () => new SentryScope()),
      getGlobalSingleton("defaultIsolationScope", () => new SentryScope()),
    ));
}
function defaultWithScope(t) {
  return getAsyncContextStack().withScope(t);
}
function defaultWithSetScope(t, e) {
  const n = getAsyncContextStack();
  return n.withScope(() => ((n.getStackTop().scope = t), e(t)));
}
function defaultWithIsolationScope(t) {
  return getAsyncContextStack().withScope(() =>
    t(getAsyncContextStack().getIsolationScope()),
  );
}
function getAsyncContextStrategy(t) {
  const e = getSentryCarrier(t);
  return e.acs
    ? e.acs
    : {
        withIsolationScope: defaultWithIsolationScope,
        withScope: defaultWithScope,
        withSetScope: defaultWithSetScope,
        withSetIsolationScope: (t, e) => defaultWithIsolationScope(e),
        getCurrentScope: () => getAsyncContextStack().getScope(),
        getIsolationScope: () => getAsyncContextStack().getIsolationScope(),
      };
}
function toTypedAttributeValue(t, e) {
  const { value: n, unit: r } =
    "object" == typeof (s = t) &&
    null != s &&
    !Array.isArray(s) &&
    Object.keys(s).includes("value")
      ? t
      : {
          value: t,
          unit: void 0,
        };
  var s;
  const i = (function (t) {
      const e =
        "string" == typeof t
          ? "string"
          : "boolean" == typeof t
            ? "boolean"
            : "number" != typeof t || Number.isNaN(t)
              ? null
              : Number.isInteger(t)
                ? "integer"
                : "double";
      if (e)
        return {
          value: t,
          type: e,
        };
    })(n),
    o =
      r && "string" == typeof r
        ? {
            unit: r,
          }
        : {};
  if (i)
    return {
      ...i,
      ...o,
    };
  if (!e || ("skip-undefined" === e && void 0 === n)) return;
  let a = "";
  try {
    a = JSON.stringify(n) ?? "";
  } catch {}
  return {
    value: a,
    type: "string",
    ...o,
  };
}
function toTypedAttributes(t, e = !1) {
  const n = {};
  for (const [r, s] of Object.entries(t ?? {})) {
    const t = toTypedAttributeValue(s, e);
    t && (n[r] = t);
  }
  return n;
}
function getCurrentScope() {
  return getAsyncContextStrategy(getGlobalSentry()).getCurrentScope();
}
function getIsolationScope() {
  return getAsyncContextStrategy(getGlobalSentry()).getIsolationScope();
}
function getCurrentClient() {
  return getCurrentScope().getClient();
}
function getTraceContextFromScope(t) {
  const e = void 0;
  const {
      traceId: n,
      parentSpanId: r,
      propagationSpanId: s,
    } = t.getPropagationContext(),
    i = {
      trace_id: n,
      span_id: s || generateSpanId(),
    };
  return r && (i.parent_span_id = r), i;
}
function derefWeakRef(t) {
  if (t) {
    if ("object" == typeof t && "deref" in t && "function" == typeof t.deref)
      try {
        return t.deref();
      } catch {
        return;
      }
    return t;
  }
}
function getCapturedScopesOnSpan(t) {
  const e = t;
  return {
    scope: e._sentryScope,
    isolationScope: derefWeakRef(e._sentryIsolationScope),
  };
}
function baggageToDynamicSamplingContext(t) {
  const e = (function (t) {
    if (!t || (!isString(t) && !Array.isArray(t))) return;
    return Array.isArray(t)
      ? t.reduce((t, e) => {
          const n = parseBaggageString(e);
          return (
            Object.entries(n).forEach(([e, n]) => {
              t[e] = n;
            }),
            t
          );
        }, {})
      : parseBaggageString(t);
  })(t);
  if (!e) return;
  const n = Object.entries(e).reduce((t, [e, n]) => {
    if (e.startsWith("sentry-")) {
      t[e.slice(7)] = n;
    }
    return t;
  }, {});
  return Object.keys(n).length > 0 ? n : void 0;
}
function parseBaggageString(t) {
  return t
    .split(",")
    .map((t) => {
      const e = t.indexOf("=");
      return -1 === e
        ? []
        : [t.slice(0, e), t.slice(e + 1)].map((t) => {
            try {
              return decodeURIComponent(t.trim());
            } catch {
              return;
            }
          });
    })
    .reduce((t, [e, n]) => (e && n && (t[e] = n), t), {});
}
var ORG_ID_HOST_REGEX = /^o(\d+)\./,
  DSN_REGEX =
    /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
function dsnToString(t, e = !1) {
  const {
    host: n,
    path: r,
    pass: s,
    port: i,
    projectId: o,
    protocol: a,
    publicKey: c,
  } = t;
  return `${a}://${c}${e && s ? `:${s}` : ""}@${n}${i ? `:${i}` : ""}/${r ? `${r}/` : r}${o}`;
}
function dsnFromComponents(t) {
  return {
    protocol: t.protocol,
    publicKey: t.publicKey || "",
    pass: t.pass || "",
    host: t.host,
    port: t.port || "",
    path: t.path || "",
    projectId: t.projectId,
  };
}
function extractOrgId(t) {
  const e = t.getOptions(),
    { host: n } = t.getDsn() || {};
  let r;
  return (
    e.orgId
      ? (r = String(e.orgId))
      : n &&
        (r = (function (t) {
          return t.match(ORG_ID_HOST_REGEX)?.[1];
        })(n)),
    r
  );
}
function makeDsn(t) {
  const e =
    "string" == typeof t
      ? (function (t) {
          const e = DSN_REGEX.exec(t);
          if (!e) return void withOriginalConsole(() => {});
          const [n, r, s = "", i = "", o = "", a = ""] = e.slice(1);
          let c = "",
            u = a;
          const l = u.split("/");
          if (
            (l.length > 1 && ((c = l.slice(0, -1).join("/")), (u = l.pop())), u)
          ) {
            const t = u.match(/^\d+/);
            t && (u = t[0]);
          }
          return dsnFromComponents({
            host: i,
            pass: s,
            path: c,
            projectId: u,
            port: o,
            protocol: n,
            publicKey: r,
          });
        })(t)
      : dsnFromComponents(t);
  if (
    e &&
    (function (t) {
      if (!DEBUG_BUILD) return !0;
      const { port: e, projectId: n, protocol: r } = t;
      return !(
        ["protocol", "publicKey", "host", "projectId"].find(
          (e) =>
            !t[e] &&
            (sentryLogger.error(`Invalid Sentry Dsn: ${e} missing`), !0),
        ) ||
        (n.match(/^\d+$/)
          ? (function (t) {
              return "http" === t || "https" === t;
            })(r)
            ? e &&
              isNaN(parseInt(e, 10)) &&
              (sentryLogger.error(`Invalid Sentry Dsn: Invalid port ${e}`), 1)
            : (sentryLogger.error(`Invalid Sentry Dsn: Invalid protocol ${r}`),
              1)
          : (sentryLogger.error(`Invalid Sentry Dsn: Invalid projectId ${n}`),
            1))
      );
    })(e)
  )
    return e;
}
var tracingWarningEmitted = !1;
function spanToTraceContext(t) {
  const { spanId: e, traceId: n, isRemote: r } = t.spanContext(),
    s = r ? e : spanToJSON(t).parent_span_id,
    i = getCapturedScopesOnSpan(t).scope;
  return {
    parent_span_id: s,
    span_id: r
      ? i?.getPropagationContext().propagationSpanId || generateSpanId()
      : e,
    trace_id: n,
  };
}
function convertSpanLinks(t) {
  return t && t.length > 0
    ? t.map(
        ({
          context: { spanId: t, traceId: e, traceFlags: n, ...r },
          attributes: s,
        }) => ({
          span_id: t,
          trace_id: e,
          sampled: 1 === n,
          attributes: s,
          ...r,
        }),
      )
    : void 0;
}
function spanTimeInputToSeconds(t) {
  return "number" == typeof t
    ? normalizeTimestampToSeconds(t)
    : Array.isArray(t)
      ? t[0] + t[1] / 1e9
      : t instanceof Date
        ? normalizeTimestampToSeconds(t.getTime())
        : timestampInSeconds();
}
function normalizeTimestampToSeconds(t) {
  return t > 9999999999 ? t / 1e3 : t;
}
function spanToJSON(t) {
  if (
    (function (t) {
      return "function" == typeof t.getSpanJSON;
    })(t)
  )
    return t.getSpanJSON();
  const { spanId: e, traceId: n } = t.spanContext();
  if (
    (function (t) {
      const e = t;
      return !!(e.attributes && e.startTime && e.name && e.endTime && e.status);
    })(t)
  ) {
    const {
      attributes: r,
      startTime: s,
      name: i,
      endTime: o,
      status: a,
      links: c,
    } = t;
    return {
      span_id: e,
      trace_id: n,
      data: r,
      description: i,
      parent_span_id: getParentSpanId(t),
      start_timestamp: spanTimeInputToSeconds(s),
      timestamp: spanTimeInputToSeconds(o) || void 0,
      status: getSpanStatusMessage(a),
      op: r["sentry.op"],
      origin: r["sentry.origin"],
      links: convertSpanLinks(c),
    };
  }
  return {
    span_id: e,
    trace_id: n,
    start_timestamp: 0,
    data: {},
  };
}
function getParentSpanId(t) {
  return "parentSpanId" in t
    ? t.parentSpanId
    : "parentSpanContext" in t
      ? t.parentSpanContext?.spanId
      : void 0;
}
function getSpanStatusMessage(t) {
  if (t && 0 !== t.code)
    return 1 === t.code ? "ok" : t.message || "internal_error";
}
var getRootSpan = function (t) {
  return t._sentryRootSpan || t;
};
function emitTracingWarningOnce() {
  tracingWarningEmitted ||
    (withOriginalConsole(() => {}), (tracingWarningEmitted = !0));
}
function logIgnoredSpan(t) {
  sentryLogger.log(
    `Ignoring span ${t.op} - ${t.description} because it matches \`ignoreSpans\`.`,
  );
}
function shouldIgnoreSpan(t, e) {
  if (!e?.length) return !1;
  for (const n of e) {
    if (isStringOrRegExp(n)) {
      if (t.description && isMatchingPattern(t.description, n))
        return DEBUG_BUILD && logIgnoredSpan(t), !0;
      continue;
    }
    const e = !!n.attributes && Object.keys(n.attributes).length > 0;
    if (!n.name && !n.op && !e) continue;
    const r =
        !n.name || (t.description && isMatchingPattern(t.description, n.name)),
      s = !n.op || (t.op && isMatchingPattern(t.op, n.op)),
      i =
        !n.attributes ||
        Object.entries(n.attributes).every(([e, n]) =>
          spanAttributeMatches(t.attributes?.[e], n),
        );
    if (r && s && i) return DEBUG_BUILD && logIgnoredSpan(t), !0;
  }
  return !1;
}
function spanAttributeMatches(t, e) {
  return "string" == typeof t && ("string" == typeof e || e instanceof RegExp)
    ? isMatchingPattern(t, e)
    : Array.isArray(t) && Array.isArray(e)
      ? t.length === e.length && t.every((t, n) => t === e[n])
      : t === e;
}
function reparentChildSpans(t, e) {
  const n = e.parent_span_id,
    r = e.span_id;
  if (n) for (const s of t) s.parent_span_id === r && (s.parent_span_id = n);
}
function isStringOrRegExp(t) {
  return "string" == typeof t || t instanceof RegExp;
}
var DEFAULT_ENVIRONMENT = "production";
function getDscFromClient(t, e) {
  const n = e.getOptions(),
    { publicKey: r } = e.getDsn() || {},
    s = {
      environment: n.environment || "production",
      release: n.release,
      public_key: r,
      trace_id: t,
      org_id: extractOrgId(e),
    };
  return e.emit("createDsc", s), s;
}
function getDscFromScope(t, e) {
  const n = e.getPropagationContext();
  return n.dsc || getDscFromClient(n.traceId, t);
}
function getDscFromSpan(t) {
  const e = getCurrentClient();
  if (!e) return {};
  const n = getRootSpan(t),
    r = spanToJSON(n),
    s = r.data,
    i = n.spanContext().traceState,
    o =
      i?.get("sentry.sample_rate") ??
      s["sentry.sample_rate"] ??
      s["sentry.previous_trace_sample_rate"];
  function a(t) {
    return (
      ("number" != typeof o && "string" != typeof o) ||
        (t.sample_rate = `${o}`),
      t
    );
  }
  const c = n._frozenDsc;
  if (c) return a(c);
  const u = i?.get("sentry.dsc"),
    l = u && baggageToDynamicSamplingContext(u);
  if (l) return a(l);
  const d = getDscFromClient(t.spanContext().traceId, e),
    h = s["sentry.source"] ?? s["sentry.span.source"],
    p = r.description;
  return (
    "url" !== h && p && (d.transaction = p),
    (function (t) {
      if ("boolean" == typeof __SENTRY_TRACING__ && !__SENTRY_TRACING__)
        return !1;
      const e = t || getCurrentClient()?.getOptions();
      return !(!e || (null == e.tracesSampleRate && !e.tracesSampler));
    })() &&
      ((d.sampled = String(
        (function (t) {
          const { traceFlags: e } = t.spanContext();
          return 1 === e;
        })(n),
      )),
      (d.sample_rand =
        i?.get("sentry.sample_rand") ??
        getCapturedScopesOnSpan(n)
          .scope?.getPropagationContext()
          .sampleRand.toString())),
    a(d),
    e.emit("createDsc", d, n),
    d
  );
}
var SKIP_NORMALIZATION_KEY = Symbol.for("sentry.skipNormalization"),
  OVERRIDE_NORMALIZATION_DEPTH_KEY = Symbol.for(
    "sentry.overrideNormalizationDepth",
  );
function normalize(t, e = 100, n = 1 / 0) {
  try {
    return visitNormalized("", t, e, n);
  } catch (r) {
    return {
      ERROR: `**non-serializable** (${r})`,
    };
  }
}
function normalizeToSize(t, e = 3, n = 102400) {
  const r = normalize(t, e);
  return (
    (s = r),
    (function (t) {
      return ~-encodeURI(t).split(/%..|./).length;
    })(JSON.stringify(s)) > n
      ? normalizeToSize(t, e - 1, n)
      : r
  );
  var s;
}
function visitNormalized(
  t,
  e,
  n = 1 / 0,
  r = 1 / 0,
  s = (function () {
    const t = new WeakSet();
    function e(e) {
      return !!t.has(e) || (t.add(e), !1);
    }
    function n(e) {
      t.delete(e);
    }
    return [e, n];
  })(),
) {
  const [i, o] = s;
  if (
    null == e ||
    ["boolean", "string"].includes(typeof e) ||
    ("number" == typeof e && Number.isFinite(e))
  )
    return e;
  const a = (function (t, e) {
    try {
      if ("domain" === t && e && "object" == typeof e && e._events)
        return "[Domain]";
      if ("domainEmitter" === t) return "[DomainEmitter]";
      if ("undefined" != typeof global && e === global) return "[Global]";
      if ("undefined" != typeof window && e === window) return "[Window]";
      if ("undefined" != typeof document && e === document) return "[Document]";
      if (isVueViewModel(e)) return stringifyVueValue(e);
      if (
        isPlainObjectTag((n = e)) &&
        "nativeEvent" in n &&
        "preventDefault" in n &&
        "stopPropagation" in n
      )
        return "[SyntheticEvent]";
      if ("number" == typeof e && !Number.isFinite(e)) return `[${e}]`;
      if ("function" == typeof e) return `[Function: ${getFunctionName(e)}]`;
      if ("symbol" == typeof e) return `[${String(e)}]`;
      if ("bigint" == typeof e) return `[BigInt: ${String(e)}]`;
      const r = (function (t) {
        const e = Object.getPrototypeOf(t);
        return e?.constructor ? e.constructor.name : "null prototype";
      })(e);
      return /^HTML(\w*)Element$/.test(r)
        ? `[HTMLElement: ${r}]`
        : `[object ${r}]`;
    } catch (r) {
      return `**non-serializable** (${r})`;
    }
    var n;
  })(t, e);
  if (!a.startsWith("[object ")) return a;
  if (
    (function (t) {
      return Boolean(t[SKIP_NORMALIZATION_KEY]);
    })(e)
  )
    return e;
  const c = (function (t) {
      const e = t[OVERRIDE_NORMALIZATION_DEPTH_KEY];
      return "number" == typeof e ? e : void 0;
    })(e),
    u = void 0 !== c ? c : n;
  if (0 === u) return a.replace("object ", "");
  if (i(e)) return "[Circular ~]";
  const l = e;
  if (l && "function" == typeof l.toJSON)
    try {
      return visitNormalized("", l.toJSON(), u - 1, r, s);
    } catch {}
  const d = Array.isArray(e) ? [] : {};
  let h = 0;
  const p = convertToPlainObject(e);
  for (const f in p) {
    if (!Object.prototype.hasOwnProperty.call(p, f)) continue;
    if (h >= r) {
      d[f] = "[MaxProperties ~]";
      break;
    }
    const t = p[f];
    (d[f] = visitNormalized(f, t, u - 1, r, s)), h++;
  }
  return o(e), d;
}
function createEnvelope(t, e = []) {
  return [t, e];
}
function addItemToEnvelope(t, e) {
  const [n, r] = t;
  return [n, [...r, e]];
}
function envelopeContainsItemType(t, e) {
  const n = t[1];
  for (const r of n) {
    if (e(r, r[0].type)) return !0;
  }
  return !1;
}
function encodeUtf8(t) {
  const e = getSentryCarrier(GLOBAL_OBJ);
  return e.encodePolyfill ? e.encodePolyfill(t) : new TextEncoder().encode(t);
}
function serializeEnvelope(t) {
  const [e, n] = t;
  let r = JSON.stringify(e);
  function s(t) {
    "string" == typeof r
      ? (r = "string" == typeof t ? r + t : [encodeUtf8(r), t])
      : r.push("string" == typeof t ? encodeUtf8(t) : t);
  }
  for (const i of n) {
    const [t, e] = i;
    if (
      (s(`\n${JSON.stringify(t)}\n`),
      "string" == typeof e || e instanceof Uint8Array)
    )
      s(e);
    else {
      let t;
      try {
        t = JSON.stringify(e);
      } catch {
        t = JSON.stringify(normalize(e));
      }
      s(t);
    }
  }
  return "string" == typeof r
    ? r
    : (function (t) {
        const e = t.reduce((t, e) => t + e.length, 0),
          n = new Uint8Array(e);
        let r = 0;
        for (const s of t) n.set(s, r), (r += s.length);
        return n;
      })(r);
}
function createAttachmentEnvelopeItem(t) {
  const e = "string" == typeof t.data ? encodeUtf8(t.data) : t.data;
  return [
    {
      type: "attachment",
      length: e.length,
      filename: t.filename,
      content_type: t.contentType,
      attachment_type: t.attachmentType,
    },
    e,
  ];
}
var ITEM_TYPE_TO_DATA_CATEGORY = {
  sessions: "session",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile_chunk: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  raw_security: "security",
  log: "log_item",
  trace_metric: "metric",
};
function envelopeItemTypeToCategory(t) {
  return (function (t) {
    return t in ITEM_TYPE_TO_DATA_CATEGORY;
  })(t)
    ? ITEM_TYPE_TO_DATA_CATEGORY[t]
    : t;
}
function getSdkMetadataForEnvelope(t) {
  if (!t?.sdk) return;
  const { name: e, version: n } = t.sdk;
  return {
    name: e,
    version: n,
  };
}
function createEventEnvelope(t, e, n, r) {
  const s = getSdkMetadataForEnvelope(n),
    i = t.type && "replay_event" !== t.type ? t.type : "event";
  !(function (t, e) {
    if (!e) return t;
    const n = t.sdk || {};
    t.sdk = {
      ...n,
      name: n.name || e.name,
      version: n.version || e.version,
      integrations: [...(t.sdk?.integrations || []), ...(e.integrations || [])],
      packages: [...(t.sdk?.packages || []), ...(e.packages || [])],
      settings:
        t.sdk?.settings || e.settings
          ? {
              ...t.sdk?.settings,
              ...e.settings,
            }
          : void 0,
    };
  })(t, n?.sdk);
  const o = (function (t, e, n, r) {
    const s = t.sdkProcessingMetadata?.dynamicSamplingContext;
    return {
      event_id: t.event_id,
      sent_at: new Date().toISOString(),
      ...(e && {
        sdk: e,
      }),
      ...(!!n &&
        r && {
          dsn: dsnToString(r),
        }),
      ...(s && {
        trace: s,
      }),
    };
  })(t, s, r, e);
  return (
    delete t.sdkProcessingMetadata,
    createEnvelope(o, [
      [
        {
          type: i,
        },
        t,
      ],
    ])
  );
}
function applyScopeDataToEvent(t, e) {
  const {
    fingerprint: n,
    span: r,
    breadcrumbs: s,
    sdkProcessingMetadata: i,
  } = e;
  !(function (t, e) {
    const {
      extra: n,
      tags: r,
      user: s,
      contexts: i,
      level: o,
      transactionName: a,
    } = e;
    Object.keys(n).length &&
      (t.extra = {
        ...n,
        ...t.extra,
      });
    Object.keys(r).length &&
      (t.tags = {
        ...r,
        ...t.tags,
      });
    Object.keys(s).length &&
      (t.user = {
        ...s,
        ...t.user,
      });
    Object.keys(i).length &&
      (t.contexts = {
        ...i,
        ...t.contexts,
      });
    o && (t.level = o);
    a && "transaction" !== t.type && (t.transaction = a);
  })(t, e),
    r &&
      (function (t, e) {
        (t.contexts = {
          trace: spanToTraceContext(e),
          ...t.contexts,
        }),
          (t.sdkProcessingMetadata = {
            dynamicSamplingContext: getDscFromSpan(e),
            ...t.sdkProcessingMetadata,
          });
        const n = getRootSpan(e),
          r = spanToJSON(n).description;
        r && !t.transaction && "transaction" === t.type && (t.transaction = r);
      })(t, r),
    (function (t, e) {
      (t.fingerprint = t.fingerprint
        ? Array.isArray(t.fingerprint)
          ? t.fingerprint
          : [t.fingerprint]
        : []),
        e && (t.fingerprint = t.fingerprint.concat(e));
      t.fingerprint.length || delete t.fingerprint;
    })(t, n),
    (function (t, e) {
      const n = [...(t.breadcrumbs || []), ...e];
      t.breadcrumbs = n.length ? n : void 0;
    })(t, s),
    (function (t, e) {
      t.sdkProcessingMetadata = {
        ...t.sdkProcessingMetadata,
        ...e,
      };
    })(t, i);
}
function mergeScopeData(t, e) {
  const {
    extra: n,
    tags: r,
    attributes: s,
    user: i,
    contexts: o,
    level: a,
    sdkProcessingMetadata: c,
    breadcrumbs: u,
    fingerprint: l,
    eventProcessors: d,
    attachments: h,
    propagationContext: p,
    transactionName: f,
    span: m,
  } = e;
  mergeScopeDataField(t, "extra", n),
    mergeScopeDataField(t, "tags", r),
    mergeScopeDataField(t, "attributes", s),
    mergeScopeDataField(t, "user", i),
    mergeScopeDataField(t, "contexts", o),
    (t.sdkProcessingMetadata = mergeDeep(t.sdkProcessingMetadata, c, 2)),
    a && (t.level = a),
    f && (t.transactionName = f),
    m && (t.span = m),
    u.length && (t.breadcrumbs = [...t.breadcrumbs, ...u]),
    l.length && (t.fingerprint = [...t.fingerprint, ...l]),
    d.length && (t.eventProcessors = [...t.eventProcessors, ...d]),
    h.length && (t.attachments = [...t.attachments, ...h]),
    (t.propagationContext = {
      ...t.propagationContext,
      ...p,
    });
}
function mergeScopeDataField(t, e, n) {
  t[e] = mergeDeep(t[e], n, 1);
}
function getCombinedScopeData(t, e) {
  const n = getGlobalSingleton(
    "globalScope",
    () => new SentryScope(),
  ).getScopeData();
  return (
    t && mergeScopeData(n, t.getScopeData()),
    e && mergeScopeData(n, e.getScopeData()),
    n
  );
}
function parseUrl(t) {
  if (!t) return {};
  const e = t.match(
    /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,
  );
  if (!e) return {};
  const n = e[6] || "",
    r = e[8] || "";
  return {
    host: e[4],
    path: e[5],
    protocol: e[2],
    search: n,
    hash: r,
    relative: e[5] + n + r,
  };
}
function setDefaultSpanAttributes(t, e) {
  const n = t.attributes ?? (t.attributes = {});
  Object.entries(e).forEach(([t, e]) => {
    null == e || t in n || (n[t] = e);
  });
}
function resolvedSyncPromise(t) {
  return new SyncPromise((e) => {
    e(t);
  });
}
function rejectedSyncPromise(t) {
  return new SyncPromise((e, n) => {
    n(t);
  });
}
var debugIdParseCache,
  lastSentryDebugIdCount,
  lastLegacyDebugIdCount,
  filenameToDebugIdMap,
  SyncPromise = class t {
    constructor(t) {
      (this._state = 0), (this._handlers = []), this._runExecutor(t);
    }
    then(e, n) {
      return new t((t, r) => {
        this._handlers.push([
          !1,
          (n) => {
            if (e)
              try {
                t(e(n));
              } catch (s) {
                r(s);
              }
            else t(n);
          },
          (e) => {
            if (n)
              try {
                t(n(e));
              } catch (s) {
                r(s);
              }
            else r(e);
          },
        ]),
          this._executeHandlers();
      });
    }
    catch(t) {
      return this.then((t) => t, t);
    }
    finally(e) {
      return new t((t, n) => {
        let r, s;
        return this.then(
          (t) => {
            (s = !1), (r = t), e && e();
          },
          (t) => {
            (s = !0), (r = t), e && e();
          },
        ).then(() => {
          s ? n(r) : t(r);
        });
      });
    }
    _executeHandlers() {
      if (0 === this._state) return;
      const t = this._handlers.slice();
      (this._handlers = []),
        t.forEach((t) => {
          t[0] ||
            (1 === this._state && t[1](this._value),
            2 === this._state && t[2](this._value),
            (t[0] = !0));
        });
    }
    _runExecutor(t) {
      const e = (t, e) => {
          0 === this._state &&
            (isThenable(e)
              ? e.then(n, r)
              : ((this._state = t),
                (this._value = e),
                this._executeHandlers()));
        },
        n = (t) => {
          e(1, t);
        },
        r = (t) => {
          e(2, t);
        };
      try {
        t(n, r);
      } catch (s) {
        r(s);
      }
    }
  };
function notifyEventProcessors(t, e, n, r = 0) {
  try {
    const s = runEventProcessorChain(e, n, t, r);
    return isThenable(s) ? s : resolvedSyncPromise(s);
  } catch (s) {
    return rejectedSyncPromise(s);
  }
}
function runEventProcessorChain(t, e, n, r) {
  const s = n[r];
  if (!t || !s) return t;
  const i = s(
    {
      ...t,
    },
    e,
  );
  return (
    DEBUG_BUILD &&
      null === i &&
      sentryLogger.log(`Event processor "${s.id || "?"}" dropped event`),
    isThenable(i)
      ? i.then((t) => runEventProcessorChain(t, e, n, r + 1))
      : runEventProcessorChain(i, e, n, r + 1)
  );
}
function prepareEvent(t, e, n, r, s, i) {
  const { normalizeDepth: o = 3, normalizeMaxBreadth: a = 1e3 } = t,
    c = {
      ...e,
      event_id: e.event_id || n.event_id || generateUuid2(),
      timestamp: e.timestamp || dateTimestampInSeconds(),
    },
    u = n.integrations || t.integrations.map((t) => t.name);
  !(function (t, e) {
    const { environment: n, release: r, dist: s, maxValueLength: i } = e;
    (t.environment = t.environment || n || "production"),
      !t.release && r && (t.release = r);
    !t.dist && s && (t.dist = s);
    const o = t.request;
    o?.url && i && (o.url = truncateString(o.url, i));
    i &&
      t.exception?.values?.forEach((t) => {
        t.value && (t.value = truncateString(t.value, i));
      });
  })(c, t),
    (function (t, e) {
      e.length > 0 &&
        ((t.sdk = t.sdk || {}),
        (t.sdk.integrations = [...(t.sdk.integrations || []), ...e]));
    })(c, u),
    s && s.emit("applyFrameMetadata", e),
    void 0 === e.type &&
      (function (t, e) {
        const n = (function (t) {
          const e = GLOBAL_OBJ._sentryDebugIds,
            n = GLOBAL_OBJ._debugIds;
          if (!e && !n) return {};
          const r = e ? Object.keys(e) : [],
            s = n ? Object.keys(n) : [];
          if (
            filenameToDebugIdMap &&
            r.length === lastSentryDebugIdCount &&
            s.length === lastLegacyDebugIdCount
          )
            return filenameToDebugIdMap;
          (lastSentryDebugIdCount = r.length),
            (lastLegacyDebugIdCount = s.length),
            (filenameToDebugIdMap = {}),
            debugIdParseCache || (debugIdParseCache = {});
          const i = (e, n) => {
            for (const r of e) {
              const e = n[r],
                s = debugIdParseCache?.[r];
              if (s && filenameToDebugIdMap && e)
                (filenameToDebugIdMap[s[0]] = e),
                  debugIdParseCache && (debugIdParseCache[r] = [s[0], e]);
              else if (e) {
                const n = t(r);
                for (let t = n.length - 1; t >= 0; t--) {
                  const s = n[t]?.filename;
                  if (s && filenameToDebugIdMap && debugIdParseCache) {
                    (filenameToDebugIdMap[s] = e),
                      (debugIdParseCache[r] = [s, e]);
                    break;
                  }
                }
              }
            }
          };
          return e && i(r, e), n && i(s, n), filenameToDebugIdMap;
        })(e);
        t.exception?.values?.forEach((t) => {
          t.stacktrace?.frames?.forEach((t) => {
            t.filename && (t.debug_id = n[t.filename]);
          });
        });
      })(c, t.stackParser);
  const l = (function (t, e) {
    if (!e) return t;
    const n = t ? t.clone() : new SentryScope();
    return n.update(e), n;
  })(r, n.captureContext);
  n.mechanism && addExceptionMechanism(c, n.mechanism);
  const d = s ? s.getEventProcessors() : [],
    h = getCombinedScopeData(i, l),
    p = [...(n.attachments || []), ...h.attachments];
  p.length && (n.attachments = p), applyScopeDataToEvent(c, h);
  const f = [...d, ...h.eventProcessors];
  return (
    n.data && !0 === n.data.__sentry__
      ? resolvedSyncPromise(c)
      : notifyEventProcessors(f, c, n)
  ).then(
    (t) => (
      t &&
        (function (t) {
          const e = {};
          if (
            (t.exception?.values?.forEach((t) => {
              t.stacktrace?.frames?.forEach((t) => {
                t.debug_id &&
                  (t.abs_path
                    ? (e[t.abs_path] = t.debug_id)
                    : t.filename && (e[t.filename] = t.debug_id),
                  delete t.debug_id);
              });
            }),
            0 === Object.keys(e).length)
          )
            return;
          (t.debug_meta = t.debug_meta || {}),
            (t.debug_meta.images = t.debug_meta.images || []);
          const n = t.debug_meta.images;
          Object.entries(e).forEach(([t, e]) => {
            n.push({
              type: "sourcemap",
              code_file: t,
              debug_id: e,
            });
          });
        })(t),
      "number" == typeof o && o > 0
        ? (function (t, e, n) {
            if (!t) return null;
            const r = {
              ...t,
              ...(t.breadcrumbs && {
                breadcrumbs: t.breadcrumbs.map((t) => ({
                  ...t,
                  ...(t.data && {
                    data: normalize(t.data, e, n),
                  }),
                })),
              }),
              ...(t.user && {
                user: normalize(t.user, e, n),
              }),
              ...(t.contexts && {
                contexts: normalize(t.contexts, e, n),
              }),
              ...(t.extra && {
                extra: normalize(t.extra, e, n),
              }),
            };
            t.contexts?.trace &&
              r.contexts &&
              ((r.contexts.trace = t.contexts.trace),
              t.contexts.trace.data &&
                (r.contexts.trace.data = normalize(
                  t.contexts.trace.data,
                  e,
                  n,
                )));
            t.spans &&
              (r.spans = t.spans.map((t) => ({
                ...t,
                ...(t.data && {
                  data: normalize(t.data, e, n),
                }),
              })));
            t.contexts?.flags &&
              r.contexts &&
              (r.contexts.flags = normalize(t.contexts.flags, 3, n));
            return r;
          })(t, o, a)
        : t
    ),
  );
}
function parseCaptureContext(t) {
  if (t)
    return (function (t) {
      return t instanceof SentryScope || "function" == typeof t;
    })(t) ||
      (function (t) {
        return Object.keys(t).some((t) => CAPTURE_CONTEXT_KEYS.includes(t));
      })(t)
      ? {
          captureContext: t,
        }
      : t;
}
var CAPTURE_CONTEXT_KEYS = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "propagationContext",
];
function captureException(t, e) {
  return getCurrentScope().captureException(t, parseCaptureContext(e));
}
function captureMessage(t, e) {
  const n = "string" == typeof e ? e : void 0,
    r =
      "string" != typeof e
        ? {
            captureContext: e,
          }
        : void 0;
  return getCurrentScope().captureMessage(t, n, r);
}
function captureEvent(t, e) {
  return getCurrentScope().captureEvent(t, e);
}
function startSession(t) {
  const e = getIsolationScope(),
    { user: n } = getCombinedScopeData(e, getCurrentScope()),
    { userAgent: r } = GLOBAL_OBJ.navigator || {},
    s = makeSession({
      user: n,
      ...(r && {
        userAgent: r,
      }),
      ...t,
    }),
    i = e.getSession();
  return (
    "ok" === i?.status &&
      updateSession(i, {
        status: "exited",
      }),
    endSession(),
    e.setSession(s),
    s
  );
}
function endSession() {
  const t = getIsolationScope(),
    e = getCurrentScope().getSession() || t.getSession();
  e &&
    (function (t, e) {
      let n = {};
      e
        ? (n = {
            status: e,
          })
        : "ok" === t.status &&
          (n = {
            status: "exited",
          }),
        updateSession(t, n);
    })(e),
    sendCurrentSession(),
    t.setSession();
}
function sendCurrentSession() {
  const t = getIsolationScope(),
    e = getCurrentClient(),
    n = t.getSession();
  n && e && e.captureSession(n);
}
function captureSession(t = !1) {
  t ? endSession() : sendCurrentSession();
}
function getEnvelopeEndpointUrl(t, e, n) {
  return (
    e ||
    `${(function (t) {
      return `${(function (t) {
        const e = t.protocol ? `${t.protocol}:` : "",
          n = t.port ? `:${t.port}` : "";
        return `${e}//${t.host}${n}${t.path ? `/${t.path}` : ""}/api/`;
      })(t)}${t.projectId}/envelope/`;
    })(t)}?${(function (t, e) {
      const n = {
        sentry_version: "7",
      };
      return (
        t.publicKey && (n.sentry_key = t.publicKey),
        e && (n.sentry_client = `${e.name}/${e.version}`),
        new URLSearchParams(n).toString()
      );
    })(t, n)}`
  );
}
var setupIntegrationNames = [];
function getIntegrationsToSetup(t) {
  const e = t.defaultIntegrations || [],
    n = t.integrations;
  let r;
  if (
    (e.forEach((t) => {
      t.isDefaultInstance = !0;
    }),
    Array.isArray(n))
  )
    r = [...e, ...n];
  else if ("function" == typeof n) {
    const t = n(e);
    r = Array.isArray(t) ? t : [t];
  } else r = e;
  return (function (t) {
    const e = {};
    return (
      t.forEach((t) => {
        const { name: n } = t,
          r = e[n];
        (r && !r.isDefaultInstance && t.isDefaultInstance) || (e[n] = t);
      }),
      Object.values(e)
    );
  })(r);
}
function runAfterAllSetup(t, e) {
  for (const n of e) n?.afterAllSetup && n.afterAllSetup(t);
}
function setupIntegration(t, e, n) {
  if (n[e.name])
    DEBUG_BUILD &&
      sentryLogger.log(
        `Integration skipped because it was already installed: ${e.name}`,
      );
  else {
    if (
      ((n[e.name] = e),
      setupIntegrationNames.includes(e.name) ||
        "function" != typeof e.setupOnce ||
        (e.setupOnce(), setupIntegrationNames.push(e.name)),
      e.setup && "function" == typeof e.setup && e.setup(t),
      "function" == typeof e.preprocessEvent)
    ) {
      const n = e.preprocessEvent.bind(e);
      t.on("preprocessEvent", (e, r) => n(e, r, t));
    }
    if ("function" == typeof e.processEvent) {
      const n = e.processEvent.bind(e),
        r = Object.assign((e, r) => n(e, r, t), {
          id: e.name,
        });
      t.addEventProcessor(r);
    }
    ["processSpan", "processSegmentSpan"].forEach((n) => {
      const r = e[n];
      "function" == typeof r && t.on(n, (n) => r.call(e, n, t));
    }),
      DEBUG_BUILD && sentryLogger.log(`Integration installed: ${e.name}`);
  }
}
function isNodeEnvironment() {
  return (
    !(
      "undefined" != typeof __SENTRY_BROWSER_BUNDLE__ &&
      __SENTRY_BROWSER_BUNDLE__
    ) &&
    "[object process]" ===
      Object.prototype.toString.call(
        "undefined" != typeof process ? process : 0,
      )
  );
}
function isBrowserLikeEnvironment() {
  return (
    "undefined" != typeof window &&
    (!isNodeEnvironment() || "renderer" === GLOBAL_OBJ.process?.type)
  );
}
function createLogEnvelopeItem(t, e) {
  const n = e ? "auto" : "never";
  return [
    {
      type: "log",
      item_count: t.length,
      content_type: "application/vnd.sentry.items.log+json",
    },
    {
      version: 2,
      ...(isBrowserLikeEnvironment() && {
        ingest_settings: {
          infer_ip: n,
          infer_user_agent: n,
        },
      }),
      items: t,
    },
  ];
}
function flushLogBuffer(t, e) {
  const n =
    e ??
    (function (t) {
      return getLogBufferMap().get(t);
    })(t) ??
    [];
  if (0 === n.length) return;
  const r = t.getOptions(),
    s = (function (t, e, n, r, s) {
      const i = {};
      return (
        e?.sdk &&
          (i.sdk = {
            name: e.sdk.name,
            version: e.sdk.version,
          }),
        n && r && (i.dsn = dsnToString(r)),
        createEnvelope(i, [createLogEnvelopeItem(t, s)])
      );
    })(n, r._metadata, r.tunnel, t.getDsn(), r.sendDefaultPii);
  getLogBufferMap().set(t, []), t.emit("flushLogs"), t.sendEnvelope(s);
}
function getLogBufferMap() {
  return getGlobalSingleton("clientToLogBufferMap", () => new WeakMap());
}
function createMetricEnvelopeItem(t, e) {
  const n = e ? "auto" : "never";
  return [
    {
      type: "trace_metric",
      item_count: t.length,
      content_type: "application/vnd.sentry.items.trace-metric+json",
    },
    {
      version: 2,
      ...(isBrowserLikeEnvironment() && {
        ingest_settings: {
          infer_ip: n,
          infer_user_agent: n,
        },
      }),
      items: t,
    },
  ];
}
function flushMetricBuffer(t, e) {
  const n =
    e ??
    (function (t) {
      return getMetricBufferMap().get(t);
    })(t) ??
    [];
  if (0 === n.length) return;
  const r = t.getOptions(),
    s = (function (t, e, n, r, s) {
      const i = {};
      return (
        e?.sdk &&
          (i.sdk = {
            name: e.sdk.name,
            version: e.sdk.version,
          }),
        n && r && (i.dsn = dsnToString(r)),
        createEnvelope(i, [createMetricEnvelopeItem(t, s)])
      );
    })(n, r._metadata, r.tunnel, t.getDsn(), r.sendDefaultPii);
  getMetricBufferMap().set(t, []), t.emit("flushMetrics"), t.sendEnvelope(s);
}
function getMetricBufferMap() {
  return getGlobalSingleton("clientToMetricBufferMap", () => new WeakMap());
}
function spanJsonToStreamedSpan(t) {
  const e = {
    trace_id: t.trace_id,
    span_id: t.span_id,
    parent_span_id: t.parent_span_id,
    name: t.description || "",
    start_timestamp: t.start_timestamp,
    end_timestamp: t.timestamp || t.start_timestamp,
    status:
      t.status && "ok" !== t.status && "cancelled" !== t.status
        ? "error"
        : "ok",
    is_segment: !1,
    attributes: {
      ...t.data,
    },
    links: t.links,
  };
  return (
    (n = e),
    {
      ...n,
      attributes: toTypedAttributes(n.attributes),
      links: n.links?.map((t) => ({
        ...t,
        attributes: toTypedAttributes(t.attributes),
      })),
    }
  );
  var n;
}
function unrefTimer(t) {
  return "object" == typeof t && "function" == typeof t.unref && t.unref(), t;
}
var BUFFER_FULL_ERROR = Symbol.for("SentryBufferFullError");
function makePromiseBuffer(t = 100) {
  const e = new Set();
  function n(t) {
    e.delete(t);
  }
  return {
    get $() {
      return Array.from(e);
    },
    add: function (r) {
      if (!(e.size < t)) return rejectedSyncPromise(BUFFER_FULL_ERROR);
      const s = r();
      return (
        e.add(s),
        s.then(
          () => n(s),
          () => n(s),
        ),
        s
      );
    },
    drain: function (t) {
      if (!e.size) return resolvedSyncPromise(!0);
      const n = Promise.allSettled(Array.from(e)).then(() => !0);
      if (!t) return n;
      const r = [n, new Promise((e) => unrefTimer(setTimeout(() => e(!1), t)))];
      return Promise.race(r);
    },
  };
}
function updateRateLimits(t, { statusCode: e, headers: n }, r = safeDateNow()) {
  const s = {
      ...t,
    },
    i = n?.["x-sentry-rate-limits"],
    o = n?.["retry-after"];
  if (i)
    for (const a of i.trim().split(",")) {
      const [t, e, , , n] = a.split(":", 5),
        i = parseInt(t, 10),
        o = 1e3 * (isNaN(i) ? 60 : i);
      if (e)
        for (const a of e.split(";"))
          ("metric_bucket" === a && n && !n.split(";").includes("custom")) ||
            (s[a] = r + o);
      else s.all = r + o;
    }
  else
    o
      ? (s.all =
          r +
          (function (t, e = safeDateNow()) {
            const n = parseInt(`${t}`, 10);
            if (!isNaN(n)) return 1e3 * n;
            const r = Date.parse(`${t}`);
            return isNaN(r) ? 6e4 : r - e;
          })(o, r))
      : 429 === e && (s.all = r + 6e4);
  return s;
}
function createTransport(t, e, n = makePromiseBuffer(t.bufferSize || 64)) {
  let r = {};
  return {
    send: function (s) {
      const i = [];
      if (
        (envelopeContainsItemType(s, (e, n) => {
          const s = envelopeItemTypeToCategory(n);
          !(function (t, e, n = safeDateNow()) {
            return (
              (function (t, e) {
                return t[e] || t.all || 0;
              })(t, e) > n
            );
          })(r, s)
            ? i.push(e)
            : t.recordDroppedEvent("ratelimit_backoff", s);
        }),
        0 === i.length)
      )
        return Promise.resolve({});
      const o = createEnvelope(s[0], i),
        a = (e) => {
          !(function (t, e) {
            return envelopeContainsItemType(t, (t, n) => e.includes(n));
          })(o, ["client_report"])
            ? envelopeContainsItemType(o, (n, r) => {
                t.recordDroppedEvent(e, envelopeItemTypeToCategory(r));
              })
            : DEBUG_BUILD &&
              sentryLogger.warn(
                `Dropping client report. Will not send outcomes (reason: ${e}).`,
              );
        };
      return n
        .add(() =>
          e({
            body: serializeEnvelope(o),
          }).then(
            (t) =>
              413 === t.statusCode
                ? (DEBUG_BUILD &&
                    sentryLogger.error(
                      "Sentry responded with status code 413. Envelope was discarded due to exceeding size limits.",
                    ),
                  a("send_error"),
                  t)
                : (DEBUG_BUILD &&
                    void 0 !== t.statusCode &&
                    (t.statusCode < 200 || t.statusCode >= 300) &&
                    sentryLogger.warn(
                      `Sentry responded with status code ${t.statusCode} to sent event.`,
                    ),
                  (r = updateRateLimits(r, t)),
                  t),
            (t) => {
              throw (
                (a("network_error"),
                DEBUG_BUILD &&
                  sentryLogger.error(
                    "Encountered error running transport request:",
                    t,
                  ),
                t)
              );
            },
          ),
        )
        .then(
          (t) => t,
          (t) => {
            if (t === BUFFER_FULL_ERROR)
              return (
                DEBUG_BUILD &&
                  sentryLogger.error(
                    "Skipped sending event because buffer is full.",
                  ),
                a("queue_overflow"),
                Promise.resolve({})
              );
            throw t;
          },
        );
    },
    flush: (t) => n.drain(t),
  };
}
function getPossibleEventMessages(t) {
  const e = [];
  t.message && e.push(t.message);
  try {
    const n = t.exception.values[t.exception.values.length - 1];
    n?.value && (e.push(n.value), n.type && e.push(`${n.type}: ${n.value}`));
  } catch {}
  return e;
}
var ALREADY_CAPTURED_MESSAGE =
    "Not capturing exception because it's already been captured.",
  MISSING_RELEASE_MESSAGE =
    "Discarded session because of missing or non-string release",
  INTERNAL_ERROR_KEY = Symbol.for("SentryInternalError"),
  DO_NOT_SEND_EVENT_KEY = Symbol.for("SentryDoNotSendEventError");
function makeInternalError(t) {
  return {
    message: t,
    [INTERNAL_ERROR_KEY]: !0,
  };
}
function makeDoNotSendEventError(t) {
  return {
    message: t,
    [DO_NOT_SEND_EVENT_KEY]: !0,
  };
}
function isInternalError(t) {
  return !!t && "object" == typeof t && INTERNAL_ERROR_KEY in t;
}
function isDoNotSendEventError(t) {
  return !!t && "object" == typeof t && DO_NOT_SEND_EVENT_KEY in t;
}
function setupBufferedFlush(t, e, n, r, s) {
  let i,
    o = 0,
    a = !1;
  t.on(n, () => {
    (o = 0), clearTimeout(i), (a = !1);
  }),
    t.on(e, (e) => {
      (o += r(e)),
        o >= 8e5
          ? s(t)
          : a ||
            ((a = !0),
            (i = unrefTimer(
              setTimeout(() => {
                s(t);
              }, 5e3),
            )));
    }),
    t.on("flush", () => {
      s(t);
    });
}
var SentryBaseClient = class {
  constructor(t) {
    if (
      ((this._options = t),
      (this._integrations = {}),
      (this._numProcessing = 0),
      (this._outcomes = {}),
      (this._hooks = {}),
      (this._eventProcessors = []),
      (this._promiseBuffer = makePromiseBuffer(
        t.transportOptions?.bufferSize ?? 64,
      )),
      t.dsn
        ? (this._dsn = makeDsn(t.dsn))
        : DEBUG_BUILD &&
          sentryLogger.warn("No DSN provided, client will not send events."),
      this._dsn)
    ) {
      const e = getEnvelopeEndpointUrl(
        this._dsn,
        t.tunnel,
        t._metadata ? t._metadata.sdk : void 0,
      );
      this._transport = t.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...t.transportOptions,
        url: e,
      });
    }
    (this._options.enableLogs =
      this._options.enableLogs ?? this._options._experiments?.enableLogs),
      this._options.enableLogs &&
        setupBufferedFlush(
          this,
          "afterCaptureLog",
          "flushLogs",
          estimateLogSize,
          flushLogBuffer,
        ),
      (this._options.enableMetrics ??
        this._options._experiments?.enableMetrics ??
        1) &&
        setupBufferedFlush(
          this,
          "afterCaptureMetric",
          "flushMetrics",
          estimateMetricSize,
          flushMetricBuffer,
        );
  }
  captureException(t, e, n) {
    const r = generateUuid2();
    if (checkOrSetAlreadyCaught(t))
      return DEBUG_BUILD && sentryLogger.log(ALREADY_CAPTURED_MESSAGE), r;
    const s = {
      event_id: r,
      ...e,
    };
    return (
      this._process(
        () =>
          this.eventFromException(t, s)
            .then((t) => this._captureEvent(t, s, n))
            .then((t) => t),
        "error",
      ),
      s.event_id
    );
  }
  captureMessage(t, e, n, r) {
    const s = {
        event_id: generateUuid2(),
        ...n,
      },
      i = isParameterizedString(t) ? t : String(t),
      o = isPrimitive(t),
      a = o ? this.eventFromMessage(i, e, s) : this.eventFromException(t, s);
    return (
      this._process(
        () => a.then((t) => this._captureEvent(t, s, r)),
        o ? "unknown" : "error",
      ),
      s.event_id
    );
  }
  captureEvent(t, e, n) {
    const r = generateUuid2();
    if (e?.originalException && checkOrSetAlreadyCaught(e.originalException))
      return DEBUG_BUILD && sentryLogger.log(ALREADY_CAPTURED_MESSAGE), r;
    const s = {
        event_id: r,
        ...e,
      },
      i = t.sdkProcessingMetadata || {},
      o = i.capturedSpanScope,
      a = i.capturedSpanIsolationScope,
      c = eventTypeToCategory(t.type);
    return (
      this._process(() => this._captureEvent(t, s, o || n, a), c), s.event_id
    );
  }
  captureSession(t) {
    this.sendSession(t),
      updateSession(t, {
        init: !1,
      });
  }
  getDsn() {
    return this._dsn;
  }
  getOptions() {
    return this._options;
  }
  getSdkMetadata() {
    return this._options._metadata;
  }
  getTransport() {
    return this._transport;
  }
  async flush(t) {
    const e = this._transport;
    if ((this.emit("flush"), !e)) return !0;
    const n = await this._isClientDoneProcessing(t),
      r = await e.flush(t);
    return n && r;
  }
  async close(t) {
    flushLogBuffer(this);
    const e = await this.flush(t);
    return (this.getOptions().enabled = !1), this.emit("close"), e;
  }
  getEventProcessors() {
    return this._eventProcessors;
  }
  addEventProcessor(t) {
    this._eventProcessors.push(t);
  }
  init() {
    (this._isEnabled() ||
      this._options.integrations.some(({ name: t }) =>
        t.startsWith("Spotlight"),
      )) &&
      this._setupIntegrations();
  }
  getIntegrationByName(t) {
    return this._integrations[t];
  }
  addIntegration(t) {
    const e = this._integrations[t.name];
    !e && t.beforeSetup && t.beforeSetup(this),
      setupIntegration(this, t, this._integrations),
      e || runAfterAllSetup(this, [t]);
  }
  sendEvent(t, e = {}) {
    this.emit("beforeSendEvent", t, e);
    const n = (function (t, e) {
      if (
        "transaction" !== t.type ||
        !t.spans?.length ||
        !t.sdkProcessingMetadata?.hasGenAiSpans ||
        !e.getOptions().streamGenAiSpans ||
        (function (t) {
          return "stream" === t.getOptions().traceLifecycle;
        })(e)
      )
        return;
      const n = [],
        r = [];
      for (const i of t.spans)
        i.op?.startsWith("gen_ai.")
          ? n.push(spanJsonToStreamedSpan(i))
          : r.push(i);
      if (0 === n.length) return;
      t.spans = r;
      const s = e.getOptions().sendDefaultPii ? "auto" : "never";
      return [
        {
          type: "span",
          item_count: n.length,
          content_type: "application/vnd.sentry.items.span.v2+json",
        },
        {
          version: 2,
          ...(isBrowserLikeEnvironment() && {
            ingest_settings: {
              infer_ip: s,
              infer_user_agent: s,
            },
          }),
          items: n,
        },
      ];
    })(t, this);
    let r = createEventEnvelope(
      t,
      this._dsn,
      this._options._metadata,
      this._options.tunnel,
    );
    for (const s of e.attachments || [])
      r = addItemToEnvelope(r, createAttachmentEnvelopeItem(s));
    n && (r = addItemToEnvelope(r, n)),
      this.sendEnvelope(r).then((e) => this.emit("afterSendEvent", t, e));
  }
  sendSession(t) {
    const { release: e, environment: n = DEFAULT_ENVIRONMENT } = this._options;
    if ("aggregates" in t) {
      const r = t.attrs || {};
      if (!r.release && !e)
        return void (DEBUG_BUILD && sentryLogger.warn(MISSING_RELEASE_MESSAGE));
      (r.release = r.release || e),
        (r.environment = r.environment || n),
        (t.attrs = r);
    } else {
      if (!t.release && !e)
        return void (DEBUG_BUILD && sentryLogger.warn(MISSING_RELEASE_MESSAGE));
      (t.release = t.release || e), (t.environment = t.environment || n);
    }
    this.emit("beforeSendSession", t);
    const r = (function (t, e, n, r) {
      const s = getSdkMetadataForEnvelope(n);
      return createEnvelope(
        {
          sent_at: new Date().toISOString(),
          ...(s && {
            sdk: s,
          }),
          ...(!!r &&
            e && {
              dsn: dsnToString(e),
            }),
        },
        [
          "aggregates" in t
            ? [
                {
                  type: "sessions",
                },
                t,
              ]
            : [
                {
                  type: "session",
                },
                t.toJSON(),
              ],
        ],
      );
    })(t, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(r);
  }
  recordDroppedEvent(t, e, n = 1) {
    if (this._options.sendClientReports) {
      const r = `${t}:${e}`;
      DEBUG_BUILD &&
        sentryLogger.log(
          `Recording outcome: "${r}"${n > 1 ? ` (${n} times)` : ""}`,
        ),
        (this._outcomes[r] = (this._outcomes[r] || 0) + n);
    }
  }
  on(t, e) {
    const n = (this._hooks[t] = this._hooks[t] || new Set()),
      r = (...t) => e(...t);
    return (
      n.add(r),
      () => {
        n.delete(r);
      }
    );
  }
  emit(t, ...e) {
    const n = this._hooks[t];
    n && n.forEach((t) => t(...e));
  }
  async sendEnvelope(t) {
    if ((this.emit("beforeEnvelope", t), this._isEnabled() && this._transport))
      try {
        return await this._transport.send(t);
      } catch (e) {
        return (
          DEBUG_BUILD && sentryLogger.error("Error while sending envelope:", e),
          {}
        );
      }
    return DEBUG_BUILD && sentryLogger.error("Transport disabled"), {};
  }
  registerCleanup(t) {}
  dispose() {}
  _setupIntegrations() {
    const { integrations: t } = this._options;
    (this._integrations = (function (t, e) {
      const n = {};
      return (
        e.forEach((e) => {
          e?.beforeSetup && e.beforeSetup(t);
        }),
        e.forEach((e) => {
          e && setupIntegration(t, e, n);
        }),
        n
      );
    })(this, t)),
      runAfterAllSetup(this, t);
  }
  _updateSessionFromEvent(t, e) {
    let n = "fatal" === e.level,
      r = !1;
    const s = e.exception?.values;
    if (s) {
      (r = !0), (n = !1);
      for (const t of s)
        if (!1 === t.mechanism?.handled) {
          n = !0;
          break;
        }
    }
    const i = "ok" === t.status;
    ((i && 0 === t.errors) || (i && n)) &&
      (updateSession(t, {
        ...(n && {
          status: "crashed",
        }),
        errors: t.errors || Number(r || n),
      }),
      this.captureSession(t));
  }
  async _isClientDoneProcessing(t) {
    let e = 0;
    for (; !t || e < t; ) {
      if ((await new Promise((t) => setTimeout(t, 1)), !this._numProcessing))
        return !0;
      e++;
    }
    return !1;
  }
  _isEnabled() {
    return !1 !== this.getOptions().enabled && void 0 !== this._transport;
  }
  _prepareEvent(t, e, n, r) {
    const s = this.getOptions(),
      i = Object.keys(this._integrations);
    return (
      !e.integrations && i?.length && (e.integrations = i),
      this.emit("preprocessEvent", t, e),
      t.type || r.setLastEventId(t.event_id || e.event_id),
      prepareEvent(s, t, e, n, this, r).then(
        (t) => (
          null === t ||
            (this.emit("postprocessEvent", t, e),
            (t.contexts = {
              trace: {
                ...t.contexts?.trace,
                ...getTraceContextFromScope(n),
              },
              ...t.contexts,
            }),
            (t.sdkProcessingMetadata = {
              dynamicSamplingContext: getDscFromScope(this, n),
              ...t.sdkProcessingMetadata,
            })),
          t
        ),
      )
    );
  }
  _captureEvent(t, e = {}, n = getCurrentScope(), r = getIsolationScope()) {
    return (
      DEBUG_BUILD &&
        isErrorEvent2(t) &&
        sentryLogger.log(
          `Captured error event \`${getPossibleEventMessages(t)[0] || "<unknown>"}\``,
        ),
      this._processEvent(t, e, n, r).then(
        (t) => t.event_id,
        (t) => {
          DEBUG_BUILD &&
            (isDoNotSendEventError(t)
              ? sentryLogger.log(t.message)
              : isInternalError(t)
                ? sentryLogger.warn(t.message)
                : sentryLogger.warn(t));
        },
      )
    );
  }
  _processEvent(t, e, n, r) {
    const s = this.getOptions(),
      { sampleRate: i } = s,
      o = isTransactionEvent(t),
      a = isErrorEvent2(t),
      c = `before send for type \`${t.type || "error"}\``,
      u =
        void 0 === i
          ? void 0
          : (function (t) {
              if ("boolean" == typeof t) return Number(t);
              const e = "string" == typeof t ? parseFloat(t) : t;
              return "number" != typeof e || isNaN(e) || e < 0 || e > 1
                ? void 0
                : e;
            })(i);
    if (a && "number" == typeof u && safeMathRandom() > u)
      return (
        this.recordDroppedEvent("sample_rate", "error"),
        rejectedSyncPromise(
          makeDoNotSendEventError(
            `Discarding event because it's not included in the random sample (sampling rate = ${i})`,
          ),
        )
      );
    const l = eventTypeToCategory(t.type);
    return this._prepareEvent(t, e, n, r)
      .then((t) => {
        if (null === t)
          throw (
            (this.recordDroppedEvent("event_processor", l),
            makeDoNotSendEventError(
              "An event processor returned `null`, will not send event.",
            ))
          );
        return !0 === e.data?.__sentry__
          ? t
          : (function (t, e) {
              const n = `${e} must return \`null\` or a valid event.`;
              if (isThenable(t))
                return t.then(
                  (t) => {
                    if (!isPlainObjectTag(t) && null !== t)
                      throw makeInternalError(n);
                    return t;
                  },
                  (t) => {
                    throw makeInternalError(`${e} rejected with ${t}`);
                  },
                );
              if (!isPlainObjectTag(t) && null !== t)
                throw makeInternalError(n);
              return t;
            })(
              (function (t, e, n, r) {
                const {
                    beforeSend: s,
                    beforeSendTransaction: i,
                    ignoreSpans: o,
                  } = e,
                  a =
                    ((c = e.beforeSendSpan),
                    !(
                      c &&
                      "function" == typeof c &&
                      "_streamed" in c &&
                      c._streamed
                    ) && e.beforeSendSpan);
                var c;
                let u = n;
                if (isErrorEvent2(u) && s) return s(u, r);
                if (isTransactionEvent(u)) {
                  if (a || o) {
                    const e = (function (t) {
                      const {
                        trace_id: e,
                        parent_span_id: n,
                        span_id: r,
                        status: s,
                        origin: i,
                        data: o,
                        op: a,
                      } = t.contexts?.trace ?? {};
                      return {
                        data: o ?? {},
                        description: t.transaction,
                        op: a,
                        parent_span_id: n,
                        span_id: r ?? "",
                        start_timestamp: t.start_timestamp ?? 0,
                        status: s,
                        timestamp: t.timestamp,
                        trace_id: e ?? "",
                        origin: i,
                        profile_id: o?.["sentry.profile_id"],
                        exclusive_time: o?.["sentry.exclusive_time"],
                        measurements: t.measurements,
                        is_segment: !0,
                      };
                    })(u);
                    if (
                      o?.length &&
                      shouldIgnoreSpan(
                        {
                          description: e.description,
                          op: e.op,
                          attributes: e.data,
                        },
                        o,
                      )
                    )
                      return null;
                    if (a) {
                      const t = a(e);
                      t
                        ? (u = mergeDeep(n, {
                            type: "transaction",
                            timestamp: (l = t).timestamp,
                            start_timestamp: l.start_timestamp,
                            transaction: l.description,
                            contexts: {
                              trace: {
                                trace_id: l.trace_id,
                                span_id: l.span_id,
                                parent_span_id: l.parent_span_id,
                                op: l.op,
                                status: l.status,
                                origin: l.origin,
                                data: {
                                  ...l.data,
                                  ...(l.profile_id && {
                                    "sentry.profile_id": l.profile_id,
                                  }),
                                  ...(l.exclusive_time && {
                                    "sentry.exclusive_time": l.exclusive_time,
                                  }),
                                },
                              },
                            },
                            measurements: l.measurements,
                          }))
                        : emitTracingWarningOnce();
                    }
                    if (u.spans) {
                      const e = [],
                        n = u.spans;
                      for (const t of n)
                        if (
                          o?.length &&
                          shouldIgnoreSpan(
                            {
                              description: t.description,
                              op: t.op,
                              attributes: t.data,
                            },
                            o,
                          )
                        )
                          reparentChildSpans(n, t);
                        else if (a) {
                          const n = a(t);
                          n ? e.push(n) : (emitTracingWarningOnce(), e.push(t));
                        } else e.push(t);
                      const r = u.spans.length - e.length;
                      r && t.recordDroppedEvent("before_send", "span", r),
                        (u.spans = e);
                    }
                  }
                  if (i) {
                    if (u.spans) {
                      const t = u.spans.length;
                      u.sdkProcessingMetadata = {
                        ...n.sdkProcessingMetadata,
                        spanCountBeforeProcessing: t,
                      };
                    }
                    return i(u, r);
                  }
                }
                var l;
                return u;
              })(this, s, t, e),
              c,
            );
      })
      .then((s) => {
        if (null === s) {
          if ((this.recordDroppedEvent("before_send", l), o)) {
            const e = 1 + (t.spans || []).length;
            this.recordDroppedEvent("before_send", "span", e);
          }
          throw makeDoNotSendEventError(
            `${c} returned \`null\`, will not send event.`,
          );
        }
        const i = n.getSession() || r.getSession();
        if ((a && i && this._updateSessionFromEvent(i, s), o)) {
          const t =
            (s.sdkProcessingMetadata?.spanCountBeforeProcessing || 0) -
            (s.spans ? s.spans.length : 0);
          t > 0 && this.recordDroppedEvent("before_send", "span", t);
        }
        const u = s.transaction_info;
        if (o && u && s.transaction !== t.transaction) {
          const t = "custom";
          s.transaction_info = {
            ...u,
            source: t,
          };
        }
        return this.sendEvent(s, e), s;
      })
      .then(null, (t) => {
        if (isDoNotSendEventError(t) || isInternalError(t)) throw t;
        throw (
          (this.captureException(t, {
            mechanism: {
              handled: !1,
              type: "internal",
            },
            data: {
              __sentry__: !0,
            },
            originalException: t,
          }),
          makeInternalError(
            `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ${t}`,
          ))
        );
      });
  }
  _process(t, e) {
    this._numProcessing++,
      this._promiseBuffer.add(t).then(
        (t) => (this._numProcessing--, t),
        (t) => (
          this._numProcessing--,
          t === BUFFER_FULL_ERROR &&
            this.recordDroppedEvent("queue_overflow", e),
          t
        ),
      );
  }
  _clearOutcomes() {
    const t = this._outcomes;
    return (
      (this._outcomes = {}),
      Object.entries(t).map(([t, e]) => {
        const [n, r] = t.split(":");
        return {
          reason: n,
          category: r,
          quantity: e,
        };
      })
    );
  }
  _flushOutcomes() {
    DEBUG_BUILD && sentryLogger.log("Flushing outcomes...");
    const t = this._clearOutcomes();
    if (0 === t.length)
      return void (DEBUG_BUILD && sentryLogger.log("No outcomes to send"));
    if (!this._dsn)
      return void (
        DEBUG_BUILD &&
        sentryLogger.log("No dsn provided, will not send outcomes")
      );
    DEBUG_BUILD && sentryLogger.log("Sending outcomes:", t);
    const e =
      ((n = t),
      createEnvelope(
        (r = this._options.tunnel && dsnToString(this._dsn))
          ? {
              dsn: r,
            }
          : {},
        [
          [
            {
              type: "client_report",
            },
            {
              timestamp: s || dateTimestampInSeconds(),
              discarded_events: n,
            },
          ],
        ],
      ));
    var n, r, s;
    this.sendEnvelope(e);
  }
};
function eventTypeToCategory(t) {
  return "replay_event" === t ? "replay" : t || "error";
}
function isErrorEvent2(t) {
  return void 0 === t.type;
}
function isTransactionEvent(t) {
  return "transaction" === t.type;
}
function estimateMetricSize(t) {
  let e = 0;
  return (
    t.name && (e += 2 * t.name.length),
    (e += 8),
    e + estimateAttributesSize(t.attributes)
  );
}
function estimateLogSize(t) {
  let e = 0;
  return (
    t.message && (e += 2 * t.message.length),
    e + estimateAttributesSize(t.attributes)
  );
}
function estimateAttributesSize(t) {
  if (!t) return 0;
  let e = 0;
  return (
    Object.values(t).forEach((t) => {
      Array.isArray(t)
        ? (e += t.length * estimateValueSize(t[0]))
        : isPrimitive(t)
          ? (e += estimateValueSize(t))
          : (e += 100);
    }),
    e
  );
}
function estimateValueSize(t) {
  return "string" == typeof t
    ? 2 * t.length
    : "number" == typeof t
      ? 8
      : "boolean" == typeof t
        ? 4
        : 0;
}
function initAndBindClient(t, e) {
  !0 === e.debug &&
    (DEBUG_BUILD ? sentryLogger.enable() : withOriginalConsole(() => {})),
    getCurrentScope().update(e.initialScope);
  const n = new t(e);
  return (
    (function (t) {
      getCurrentScope().setClient(t);
    })(n),
    n.init(),
    n
  );
}
function setAutoIpAddress(t) {
  "aggregates" in t
    ? void 0 === t.attrs?.ip_address &&
      (t.attrs = {
        ...t.attrs,
        ip_address: "{{auto}}",
      })
    : void 0 === t.ipAddress && (t.ipAddress = "{{auto}}");
}
var originalFunctionToString,
  DEFAULT_MAX_BREADCRUMBS = 100;
function addBreadcrumb(t, e) {
  const n = getCurrentClient(),
    r = getIsolationScope();
  if (!n) return;
  const {
    beforeBreadcrumb: s = null,
    maxBreadcrumbs: i = DEFAULT_MAX_BREADCRUMBS,
  } = n.getOptions();
  if (i <= 0) return;
  const o = {
      timestamp: dateTimestampInSeconds(),
      ...t,
    },
    a = s ? withOriginalConsole(() => s(o, e)) : o;
  null !== a &&
    (n.emit && n.emit("beforeAddBreadcrumb", a, e), r.addBreadcrumb(a, i));
}
var clientsWithFunctionToString = new WeakMap(),
  functionToStringIntegration = () => ({
    name: "FunctionToString",
    setupOnce() {
      originalFunctionToString = Function.prototype.toString;
      try {
        Function.prototype.toString = function (...t) {
          const e = getOriginalFunction(this),
            n =
              clientsWithFunctionToString.has(getCurrentClient()) &&
              void 0 !== e
                ? e
                : this;
          return originalFunctionToString.apply(n, t);
        };
      } catch {}
    },
    setup(t) {
      clientsWithFunctionToString.set(t, !0);
    },
  }),
  DEFAULT_IGNORED_ERRORS = [
    /^Script error\.?$/,
    /^Javascript error: Script error\.? on line 0$/,
    /^ResizeObserver loop completed with undelivered notifications.$/,
    /^Cannot redefine property: googletag$/,
    /^Can't find variable: gmo$/,
    /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
    /can't redefine non-configurable property "solana"/,
    /vv\(\)\.getRestrictions is not a function/,
    /Can't find variable: _AutofillCallbackHandler/,
    /Object Not Found Matching Id:\d+, MethodName:simulateEvent/,
    /^Java exception was raised during method invocation$/,
  ],
  eventFiltersIntegration = (t = {}) => {
    let e;
    return {
      name: "EventFilters",
      setup(n) {
        e = mergeEventFilterOptions(t, n.getOptions());
      },
      processEvent: (n, r, s) => (
        e || (e = mergeEventFilterOptions(t, s.getOptions())),
        (function (t, e) {
          if (t.type) {
            if (
              "transaction" === t.type &&
              (function (t, e) {
                if (!e?.length) return !1;
                const n = t.transaction;
                return !!n && stringMatchesSomePattern(n, e);
              })(t, e.ignoreTransactions)
            )
              return (
                DEBUG_BUILD &&
                  sentryLogger.warn(
                    `Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${getEventDescription(t)}`,
                  ),
                !0
              );
          } else {
            if (
              (function (t, e) {
                return (
                  !!e?.length &&
                  getPossibleEventMessages(t).some((t) =>
                    stringMatchesSomePattern(t, e),
                  )
                );
              })(t, e.ignoreErrors)
            )
              return (
                DEBUG_BUILD &&
                  sentryLogger.warn(
                    `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${getEventDescription(t)}`,
                  ),
                !0
              );
            if (
              (function (t) {
                return (
                  !!t.exception?.values?.length &&
                  !t.message &&
                  !t.exception.values.some(
                    (t) =>
                      t.stacktrace || (t.type && "Error" !== t.type) || t.value,
                  )
                );
              })(t)
            )
              return (
                DEBUG_BUILD &&
                  sentryLogger.warn(
                    `Event dropped due to not having an error message, error type or stacktrace.\nEvent: ${getEventDescription(t)}`,
                  ),
                !0
              );
            if (
              (function (t, e) {
                if (!e?.length) return !1;
                const n = getEventFilterUrl(t);
                return !!n && stringMatchesSomePattern(n, e);
              })(t, e.denyUrls)
            )
              return (
                DEBUG_BUILD &&
                  sentryLogger.warn(
                    `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${getEventDescription(t)}.\nUrl: ${getEventFilterUrl(t)}`,
                  ),
                !0
              );
            if (
              !(function (t, e) {
                if (!e?.length) return !0;
                const n = getEventFilterUrl(t);
                return !n || stringMatchesSomePattern(n, e);
              })(t, e.allowUrls)
            )
              return (
                DEBUG_BUILD &&
                  sentryLogger.warn(
                    `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${getEventDescription(t)}.\nUrl: ${getEventFilterUrl(t)}`,
                  ),
                !0
              );
          }
          return !1;
        })(n, e)
          ? null
          : n
      ),
    };
  },
  inboundFiltersIntegration = (t = {}) => ({
    ...eventFiltersIntegration(t),
    name: "InboundFilters",
  });
function mergeEventFilterOptions(t = {}, e = {}) {
  return {
    allowUrls: [...(t.allowUrls || []), ...(e.allowUrls || [])],
    denyUrls: [...(t.denyUrls || []), ...(e.denyUrls || [])],
    ignoreErrors: [
      ...(t.ignoreErrors || []),
      ...(e.ignoreErrors || []),
      ...(t.disableErrorDefaults ? [] : DEFAULT_IGNORED_ERRORS),
    ],
    ignoreTransactions: [
      ...(t.ignoreTransactions || []),
      ...(e.ignoreTransactions || []),
    ],
  };
}
function getEventFilterUrl(t) {
  try {
    const e = [...(t.exception?.values ?? [])]
      .reverse()
      .find(
        (t) =>
          void 0 === t.mechanism?.parent_id && t.stacktrace?.frames?.length,
      )?.stacktrace?.frames;
    return e
      ? (function (t = []) {
          for (let e = t.length - 1; e >= 0; e--) {
            const n = t[e];
            if (
              n &&
              "<anonymous>" !== n.filename &&
              "[native code]" !== n.filename
            )
              return n.filename || null;
          }
          return null;
        })(e)
      : null;
  } catch {
    return (
      DEBUG_BUILD &&
        sentryLogger.error(
          `Cannot extract url for event ${getEventDescription(t)}`,
        ),
      null
    );
  }
}
function applyLinkedErrors(t, e, n, r, s, i) {
  if (!s.exception?.values || !i || !isInstanceOf(i.originalException, Error))
    return;
  const o =
    s.exception.values.length > 0
      ? s.exception.values[s.exception.values.length - 1]
      : void 0;
  o &&
    (s.exception.values = collectLinkedErrors(
      t,
      e,
      r,
      i.originalException,
      n,
      s.exception.values,
      o,
      0,
    ));
}
function collectLinkedErrors(t, e, n, r, s, i, o, a) {
  if (i.length >= n + 1) return i;
  let c = [...i];
  if (isInstanceOf(r[s], Error)) {
    setLinkedErrorMechanism(o, a, r);
    const i = t(e, r[s]),
      u = c.length;
    setChainedErrorMechanism(i, s, u, a),
      (c = collectLinkedErrors(t, e, n, r[s], s, [i, ...c], i, u));
  }
  return (
    isAggregateError(r) &&
      r.errors.forEach((i, u) => {
        if (isInstanceOf(i, Error)) {
          setLinkedErrorMechanism(o, a, r);
          const l = t(e, i),
            d = c.length;
          setChainedErrorMechanism(l, `errors[${u}]`, d, a),
            (c = collectLinkedErrors(t, e, n, i, s, [l, ...c], l, d));
        }
      }),
    c
  );
}
function isAggregateError(t) {
  return Array.isArray(t.errors);
}
function setLinkedErrorMechanism(t, e, n) {
  t.mechanism = {
    handled: !0,
    type: "auto.core.linked_errors",
    ...(isAggregateError(n) && {
      is_exception_group: !0,
    }),
    ...t.mechanism,
    exception_id: e,
  };
}
function setChainedErrorMechanism(t, e, n, r) {
  t.mechanism = {
    handled: !0,
    ...t.mechanism,
    type: "chained",
    source: e,
    exception_id: n,
    parent_id: r,
  };
}
function getFetchErrorMessage(t) {
  return (function (t) {
    return (
      isError(t) &&
      "__sentry_fetch_url_host__" in t &&
      "string" == typeof t.__sentry_fetch_url_host__
    );
  })(t)
    ? `${t.message} (${t.__sentry_fetch_url_host__})`
    : t.message;
}
var CONSOLE_IGNORE_PATTERNS = new Set([]);
function instrumentConsole() {
  "console" in GLOBAL_OBJ &&
    CONSOLE_LEVELS.forEach(function (t) {
      t in GLOBAL_OBJ.console &&
        wrapMethod(GLOBAL_OBJ.console, t, function (e) {
          return (
            (originalConsoleMethods[t] = e),
            function (...e) {
              const n = e[0],
                r = originalConsoleMethods[t],
                s =
                  CONSOLE_IGNORE_PATTERNS.size &&
                  "string" == typeof n &&
                  stringMatchesSomePattern(n, CONSOLE_IGNORE_PATTERNS);
              s ||
                triggerHandlers("console", {
                  args: e,
                  level: t,
                }),
                (!s || (DEBUG_BUILD && sentryLogger.isEnabled())) &&
                  r?.apply(GLOBAL_OBJ.console, e);
            }
          );
        });
    });
}
function severityFromConsoleLevel(t) {
  return "warn" === t
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(t)
      ? t
      : "log";
}
var dedupeIntegration = () => {
  let t;
  return {
    name: "Dedupe",
    processEvent(e) {
      if (e.type) return e;
      try {
        if (
          (function (t, e) {
            return (
              !!e &&
              (!!(function (t, e) {
                const n = t.message,
                  r = e.message;
                return (
                  !(!n && !r) &&
                  !((n && !r) || (!n && r)) &&
                  n === r &&
                  !!fingerprintsEqual(t, e) &&
                  !!stackFramesEqual(t, e)
                );
              })(t, e) ||
                !!(function (t, e) {
                  const n = getFirstExceptionValue(e),
                    r = getFirstExceptionValue(t);
                  return (
                    !(!n || !r) &&
                    n.type === r.type &&
                    n.value === r.value &&
                    !!fingerprintsEqual(t, e) &&
                    !!stackFramesEqual(t, e)
                  );
                })(t, e))
            );
          })(e, t)
        )
          return (
            DEBUG_BUILD &&
              sentryLogger.warn(
                "Event dropped due to being a duplicate of previously captured event.",
              ),
            null
          );
      } catch {}
      return (t = e);
    },
  };
};
function stackFramesEqual(t, e) {
  let n = getFramesFromEvent(t),
    r = getFramesFromEvent(e);
  if (!n && !r) return !0;
  if ((n && !r) || (!n && r)) return !1;
  if (r.length !== n.length) return !1;
  for (let s = 0; s < r.length; s++) {
    const t = r[s],
      e = n[s];
    if (
      t.filename !== e.filename ||
      t.lineno !== e.lineno ||
      t.colno !== e.colno ||
      t.function !== e.function
    )
      return !1;
  }
  return !0;
}
function fingerprintsEqual(t, e) {
  let n = t.fingerprint,
    r = e.fingerprint;
  if (!n && !r) return !0;
  if ((n && !r) || (!n && r)) return !1;
  try {
    return !(n.join("") !== r.join(""));
  } catch {
    return !1;
  }
}
function getFirstExceptionValue(t) {
  return t.exception?.values?.[0];
}
var conversationIdIntegration = () => ({
  name: "ConversationId",
  setup(t) {
    t.on("spanStart", (t) => {
      const e = getCurrentScope().getScopeData(),
        n = getIsolationScope().getScopeData(),
        r = e.conversationId || n.conversationId;
      if (r) {
        const { op: e, data: n, description: s } = spanToJSON(t);
        if (
          !e?.startsWith("gen_ai.") &&
          !n["ai.operationId"] &&
          !s?.startsWith("ai.")
        )
          return;
        t.setAttribute("gen_ai.conversation.id", r);
      }
    });
  },
});
function breadcrumbLevelFromStatus(t) {
  return void 0 === t
    ? void 0
    : t >= 400 && t < 500
      ? "warning"
      : t >= 500
        ? "error"
        : void 0;
}
var globalObject2 = GLOBAL_OBJ;
function isNativeFunction(t) {
  return (
    t && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(t.toString())
  );
}
function supportsNativeFetch() {
  if ("string" == typeof EdgeRuntime) return !0;
  if (
    !(function () {
      if (!("fetch" in globalObject2)) return !1;
      try {
        return new Headers(), new Request("data:,"), new Response(), !0;
      } catch {
        return !1;
      }
    })()
  )
    return !1;
  if (isNativeFunction(globalObject2.fetch)) return !0;
  let t = !1;
  const e = globalObject2.document;
  if (e && "function" == typeof e.createElement)
    try {
      const n = e.createElement("iframe");
      (n.hidden = !0),
        e.head.appendChild(n),
        n.contentWindow?.fetch && (t = isNativeFunction(n.contentWindow.fetch)),
        e.head.removeChild(n);
    } catch (n) {
      DEBUG_BUILD &&
        sentryLogger.warn(
          "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
          n,
        );
    }
  return t;
}
function instrumentFetch(t, e) {
  const n = "fetch",
    r = addInstrumentationHandler(n, t);
  return (
    instrumentOnce(n, () =>
      (function (t, e = !1) {
        if (e && !supportsNativeFetch()) return;
        wrapMethod(GLOBAL_OBJ, "fetch", function (e) {
          return function (...n) {
            const r = new Error(),
              { method: s, url: i } = (function (t) {
                if (0 === t.length)
                  return {
                    method: "GET",
                    url: "",
                  };
                if (2 === t.length) {
                  const [e, n] = t;
                  return {
                    url: getFetchUrl(e),
                    method: hasTruthyProperty(n, "method")
                      ? String(n.method).toUpperCase()
                      : isRequest(e) && hasTruthyProperty(e, "method")
                        ? String(e.method).toUpperCase()
                        : "GET",
                  };
                }
                const e = t[0];
                return {
                  url: getFetchUrl(e),
                  method: hasTruthyProperty(e, "method")
                    ? String(e.method).toUpperCase()
                    : "GET",
                };
              })(n),
              o = {
                args: n,
                fetchData: {
                  method: s,
                  url: i,
                },
                startTimestamp: 1e3 * timestampInSeconds(),
                virtualError: r,
                headers: getFetchHeaders(n),
              };
            return (
              t ||
                triggerHandlers("fetch", {
                  ...o,
                }),
              e.apply(GLOBAL_OBJ, n).then(
                async (e) => (
                  t
                    ? t(e)
                    : triggerHandlers("fetch", {
                        ...o,
                        endTimestamp: 1e3 * timestampInSeconds(),
                        response: e,
                      }),
                  e
                ),
                (t) => {
                  triggerHandlers("fetch", {
                    ...o,
                    endTimestamp: 1e3 * timestampInSeconds(),
                    error: t,
                  }),
                    isError(t) &&
                      void 0 === t.stack &&
                      ((t.stack = r.stack),
                      addNonEnumerableProperty(t, "framesToPop", 1));
                  const e =
                    getCurrentClient()?.getOptions()
                      .enhanceFetchErrorMessages ?? "always";
                  if (
                    !1 !== e &&
                    t instanceof TypeError &&
                    ("Failed to fetch" === t.message ||
                      "Load failed" === t.message ||
                      "NetworkError when attempting to fetch resource." ===
                        t.message)
                  )
                    try {
                      const n = new URL(o.fetchData.url).host;
                      "always" === e
                        ? (t.message = `${t.message} (${n})`)
                        : addNonEnumerableProperty(
                            t,
                            "__sentry_fetch_url_host__",
                            n,
                          );
                    } catch {}
                  throw t;
                },
              )
            );
          };
        });
      })(void 0, e),
    ),
    r
  );
}
function hasTruthyProperty(t, e) {
  return !!t && "object" == typeof t && !!t[e];
}
function getFetchUrl(t) {
  return "string" == typeof t
    ? t
    : t
      ? hasTruthyProperty(t, "url")
        ? t.url
        : t.toString
          ? t.toString()
          : ""
      : "";
}
function getFetchHeaders(t) {
  const [e, n] = t;
  try {
    if ("object" == typeof n && null !== n && "headers" in n && n.headers)
      return new Headers(n.headers);
    if (isRequest(e)) return new Headers(e.headers);
  } catch {}
}
var browserWindow = GLOBAL_OBJ,
  ignoreOnErrorDepth = 0;
function isIgnoringOnError() {
  return ignoreOnErrorDepth > 0;
}
function wrapFunction(t, e = {}) {
  if (
    !(function (t) {
      return "function" == typeof t;
    })(t)
  )
    return t;
  try {
    const e = t.__sentry_wrapped__;
    if (e) return "function" == typeof e ? e : t;
    if (getOriginalFunction(t)) return t;
  } catch {
    return t;
  }
  const n = function (...n) {
    try {
      const r = n.map((t) => wrapFunction(t, e));
      return t.apply(this, r);
    } catch (r) {
      throw (
        (ignoreOnErrorDepth++,
        setTimeout(() => {
          ignoreOnErrorDepth--;
        }),
        (function (...t) {
          const e = getAsyncContextStrategy(getGlobalSentry());
          if (2 === t.length) {
            const [n, r] = t;
            return n ? e.withSetScope(n, r) : e.withScope(r);
          }
          e.withScope(t[0]);
        })((t) => {
          t.addEventProcessor(
            (t) => (
              e.mechanism &&
                (addExceptionTypeValue(t, void 0, void 0),
                addExceptionMechanism(t, e.mechanism)),
              (t.extra = {
                ...t.extra,
                arguments: n,
              }),
              t
            ),
          ),
            captureException(r);
        }),
        r)
      );
    }
  };
  try {
    for (const e in t)
      Object.prototype.hasOwnProperty.call(t, e) && (n[e] = t[e]);
  } catch {}
  markFunctionWrapped(n, t),
    addNonEnumerableProperty(t, "__sentry_wrapped__", n);
  try {
    Object.getOwnPropertyDescriptor(n, "name").configurable &&
      Object.defineProperty(n, "name", {
        get: () => t.name,
      });
  } catch {}
  return n;
}
function getRequestInfo() {
  const t = getLocationHref(),
    { referrer: e } = browserWindow.document || {},
    { userAgent: n } = browserWindow.navigator || {};
  return {
    url: t,
    headers: {
      ...(e && {
        Referer: e,
      }),
      ...(n && {
        "User-Agent": n,
      }),
    },
  };
}
function exceptionFromError(t, e) {
  const n = parseStackFrames(t, e),
    r = {
      type: getExceptionType(e),
      value: getExceptionMessage(e),
    };
  return (
    n.length &&
      (r.stacktrace = {
        frames: n,
      }),
    void 0 === r.type &&
      "" === r.value &&
      (r.value = "Unrecoverable error caught"),
    r
  );
}
function exceptionFromPlainObject(t, e, n, r) {
  const s = getCurrentClient()?.getOptions().normalizeDepth,
    i = ((o = e), Object.values(o).find((t) => t instanceof Error));
  var o;
  const a = {
    __serialized__: normalizeToSize(e, s),
  };
  if (i)
    return {
      exception: {
        values: [exceptionFromError(t, i)],
      },
      extra: a,
    };
  const c = {
    exception: {
      values: [
        {
          type: isEvent(e)
            ? e.constructor.name
            : r
              ? "UnhandledRejection"
              : "Error",
          value: describeNonErrorObject(e, {
            isUnhandledRejection: r,
          }),
        },
      ],
    },
    extra: a,
  };
  if (n) {
    const e = parseStackFrames(t, n);
    e.length &&
      (c.exception.values[0].stacktrace = {
        frames: e,
      });
  }
  return c;
}
function eventFromError(t, e) {
  return {
    exception: {
      values: [exceptionFromError(t, e)],
    },
  };
}
function parseStackFrames(t, e) {
  const n = e.stacktrace || e.stack || "",
    r = (function (t) {
      return t && REACT_MINIFIED_ERROR_REGEX.test(t.message) ? 1 : 0;
    })(e),
    s = (function (t) {
      return "number" == typeof t.framesToPop ? t.framesToPop : 0;
    })(e);
  try {
    return t(n, r, s);
  } catch {}
  return [];
}
var REACT_MINIFIED_ERROR_REGEX = /Minified React error #\d+;/i;
function isWebAssemblyException(t) {
  return (
    "undefined" != typeof WebAssembly &&
    void 0 !== WebAssembly.Exception &&
    t instanceof WebAssembly.Exception
  );
}
function getExceptionType(t) {
  const e = t?.name;
  return !e && isWebAssemblyException(t)
    ? t.message && Array.isArray(t.message) && 2 == t.message.length
      ? t.message[0]
      : "WebAssembly.Exception"
    : e;
}
function getExceptionMessage(t) {
  const e = t?.message;
  return isWebAssemblyException(t)
    ? Array.isArray(t.message) && 2 == t.message.length
      ? t.message[1]
      : "wasm exception"
    : e
      ? e.error && "string" == typeof e.error.message
        ? getFetchErrorMessage(e.error)
        : getFetchErrorMessage(t)
      : "No error message";
}
function eventFromUnknownInput(t, e, n, r, s) {
  let i;
  if (isErrorEvent(e) && e.error) return eventFromError(t, e.error);
  if (isDomError(e) || hasBuiltinTag(e, "DOMException")) {
    const s = e;
    if ("stack" in e) i = eventFromError(t, e);
    else {
      const e = s.name || (isDomError(s) ? "DOMError" : "DOMException"),
        o = s.message ? `${e}: ${s.message}` : e;
      (i = eventFromString(t, o, n, r)), addExceptionTypeValue(i, o);
    }
    return (
      "code" in s &&
        (i.tags = {
          ...i.tags,
          "DOMException.code": `${s.code}`,
        }),
      i
    );
  }
  return isError(e)
    ? eventFromError(t, e)
    : isPlainObjectTag(e) || isEvent(e)
      ? ((i = exceptionFromPlainObject(t, e, n, s)),
        addExceptionMechanism(i, {
          synthetic: !0,
        }),
        i)
      : ((i = eventFromString(t, e, n, r)),
        addExceptionTypeValue(i, `${e}`, void 0),
        addExceptionMechanism(i, {
          synthetic: !0,
        }),
        i);
}
function eventFromString(t, e, n, r) {
  const s = {};
  if (r && n) {
    const r = parseStackFrames(t, n);
    r.length &&
      (s.exception = {
        values: [
          {
            value: e,
            stacktrace: {
              frames: r,
            },
          },
        ],
      }),
      addExceptionMechanism(s, {
        synthetic: !0,
      });
  }
  if (isParameterizedString(e)) {
    const { __sentry_template_string__: t, __sentry_template_values__: n } = e;
    return (
      (s.logentry = {
        message: t,
        params: n,
      }),
      s
    );
  }
  return (s.message = e), s;
}
function describeNonErrorObject(t, { isUnhandledRejection: e }) {
  const n = (function (t) {
      const e = Object.keys(convertToPlainObject(t));
      return e.sort(), e[0] ? e.join(", ") : "[object has no keys]";
    })(t),
    r = e ? "promise rejection" : "exception";
  return isErrorEvent(t)
    ? `Event \`ErrorEvent\` captured as ${r} with message \`${t.message}\``
    : isEvent(t)
      ? `Event \`${(function (t) {
          try {
            const e = Object.getPrototypeOf(t);
            return e ? e.constructor.name : void 0;
          } catch {}
        })(t)}\` (type=${t.type}) captured as ${r}`
      : `Object captured as ${r} with keys: ${n}`;
}
var BrowserClient = class extends SentryBaseClient {
  constructor(t) {
    const e =
      ((n = t),
      {
        release:
          "string" == typeof __SENTRY_RELEASE__
            ? __SENTRY_RELEASE__
            : browserWindow.SENTRY_RELEASE?.id,
        sendClientReports: !0,
        parentSpanIsAlwaysRootSpan: !0,
        ...n,
      });
    var n;
    !(function (t, e, n = [e], r = "npm") {
      const s = ((t._metadata = t._metadata || {}).sdk = t._metadata.sdk || {});
      s.name ||
        ((s.name = `sentry.javascript.${e}`),
        (s.packages = n.map((t) => ({
          name: `${r}:@sentry/${t}`,
          version: SDK_VERSION,
        }))),
        (s.version = SDK_VERSION));
    })(e, "browser", ["browser"], browserWindow.SENTRY_SDK_SOURCE || "npm"),
      e._metadata?.sdk &&
        (e._metadata.sdk.settings = {
          infer_ip: e.sendDefaultPii ? "auto" : "never",
          ...e._metadata.sdk.settings,
        }),
      super(e);
    const {
        sendDefaultPii: r,
        sendClientReports: s,
        enableLogs: i,
        _experiments: o,
        enableMetrics: a,
      } = this._options,
      c = a ?? o?.enableMetrics ?? !0;
    browserWindow.document &&
      (s || i || c) &&
      browserWindow.document.addEventListener("visibilitychange", () => {
        "hidden" === browserWindow.document.visibilityState &&
          (s && this._flushOutcomes(),
          i && flushLogBuffer(this),
          c && flushMetricBuffer(this));
      }),
      r && this.on("beforeSendSession", setAutoIpAddress);
  }
  eventFromException(t, e) {
    return (function (t, e, n, r) {
      const s = eventFromUnknownInput(t, e, n?.syntheticException || void 0, r);
      return (
        addExceptionMechanism(s),
        (s.level = "error"),
        n?.event_id && (s.event_id = n.event_id),
        resolvedSyncPromise(s)
      );
    })(this._options.stackParser, t, e, this._options.attachStacktrace);
  }
  eventFromMessage(t, e = "info", n) {
    return (function (t, e, n = "info", r, s) {
      const i = eventFromString(t, e, r?.syntheticException || void 0, s);
      return (
        (i.level = n),
        r?.event_id && (i.event_id = r.event_id),
        resolvedSyncPromise(i)
      );
    })(this._options.stackParser, t, e, n, this._options.attachStacktrace);
  }
  _prepareEvent(t, e, n, r) {
    return (
      (t.platform = t.platform || "javascript"), super._prepareEvent(t, e, n, r)
    );
  }
};
var domDebounceTimer,
  lastDomEventType,
  lastDomEventTargetId,
  lastHistoryUrl,
  IS_DEBUG_BUILD = "undefined" == typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__,
  browserGlobal = GLOBAL_OBJ;
function instrumentDomEvents() {
  if (!browserGlobal.document) return;
  const t = triggerHandlers.bind(null, "dom"),
    e = makeDomEventHandler(t, !0);
  browserGlobal.document.addEventListener("click", e, !1),
    browserGlobal.document.addEventListener("keypress", e, !1),
    ["EventTarget", "Node"].forEach((e) => {
      const n = browserGlobal[e]?.prototype;
      n?.hasOwnProperty?.("addEventListener") &&
        (wrapMethod(n, "addEventListener", function (e) {
          return function (n, r, s) {
            if ("click" === n || "keypress" == n)
              try {
                const r = (this.__sentry_instrumentation_handlers__ =
                    this.__sentry_instrumentation_handlers__ || {}),
                  i = (r[n] = r[n] || {
                    refCount: 0,
                  });
                if (!i.handler) {
                  const r = makeDomEventHandler(t);
                  (i.handler = r), e.call(this, n, r, s);
                }
                i.refCount++;
              } catch {}
            return e.call(this, n, r, s);
          };
        }),
        wrapMethod(n, "removeEventListener", function (t) {
          return function (e, n, r) {
            if ("click" === e || "keypress" == e)
              try {
                const n = this.__sentry_instrumentation_handlers__ || {},
                  s = n[e];
                s &&
                  (s.refCount--,
                  s.refCount <= 0 &&
                    (t.call(this, e, s.handler, r),
                    (s.handler = void 0),
                    delete n[e]),
                  0 === Object.keys(n).length &&
                    delete this.__sentry_instrumentation_handlers__);
              } catch {}
            return t.call(this, e, n, r);
          };
        }));
    });
}
function makeDomEventHandler(t, e = !1) {
  return (n) => {
    if (!n || n._sentryCaptured) return;
    const r = (function (t) {
      try {
        return t.target;
      } catch {
        return null;
      }
    })(n);
    if (
      (function (t, e) {
        return (
          "keypress" === t &&
          (!e?.tagName ||
            ("INPUT" !== e.tagName &&
              "TEXTAREA" !== e.tagName &&
              !e.isContentEditable))
        );
      })(n.type, r)
    )
      return;
    addNonEnumerableProperty(n, "_sentryCaptured", !0),
      r &&
        !r._sentryId &&
        addNonEnumerableProperty(r, "_sentryId", generateUuid2());
    const s = "keypress" === n.type ? "input" : n.type;
    (function (t) {
      if (t.type !== lastDomEventType) return !1;
      try {
        if (!t.target || t.target._sentryId !== lastDomEventTargetId) return !1;
      } catch {}
      return !0;
    })(n) ||
      (t({
        event: n,
        name: s,
        global: e,
      }),
      (lastDomEventType = n.type),
      (lastDomEventTargetId = r ? r._sentryId : void 0)),
      clearTimeout(domDebounceTimer),
      (domDebounceTimer = browserGlobal.setTimeout(() => {
        (lastDomEventTargetId = void 0), (lastDomEventType = void 0);
      }, 1e3));
  };
}
function instrumentHistoryHandler(t) {
  const e = "history";
  addInstrumentationHandler(e, t), instrumentOnce(e, instrumentHistory);
}
function instrumentHistory() {
  function t(t) {
    return function (...e) {
      const n = e.length > 2 ? e[2] : void 0;
      if (n) {
        const r = lastHistoryUrl,
          s = (function (t) {
            try {
              return new URL(t, browserGlobal.location.origin).toString();
            } catch {
              return t;
            }
          })(String(n));
        if (((lastHistoryUrl = s), r === s)) return t.apply(this, e);
        triggerHandlers("history", {
          from: r,
          to: s,
        });
      }
      return t.apply(this, e);
    };
  }
  browserGlobal.addEventListener("popstate", () => {
    const t = browserGlobal.location.href,
      e = lastHistoryUrl;
    (lastHistoryUrl = t),
      e !== t &&
        triggerHandlers("history", {
          from: e,
          to: t,
        });
  }),
    "history" in globalObject2 &&
      globalObject2.history &&
      (wrapMethod(browserGlobal.history, "pushState", t),
      wrapMethod(browserGlobal.history, "replaceState", t));
}
var nativeApiCache = {};
var XHR_DATA_KEY = "__sentry_xhr_v3__";
function instrumentXhr() {
  if (!browserGlobal.XMLHttpRequest) return;
  const t = XMLHttpRequest.prototype;
  (t.open = new Proxy(t.open, {
    apply(t, e, n) {
      const r = new Error(),
        s = 1e3 * timestampInSeconds(),
        i = isString(n[0]) ? n[0].toUpperCase() : void 0,
        o = (function (t) {
          if (isString(t)) return t;
          try {
            return t.toString();
          } catch {}
        })(n[1]);
      if (!i || !o) return t.apply(e, n);
      (e[XHR_DATA_KEY] = {
        method: i,
        url: o,
        request_headers: {},
      }),
        "POST" === i &&
          o.match(/sentry_key/) &&
          (e.__sentry_own_request__ = !0);
      const a = () => {
        const t = e[XHR_DATA_KEY];
        if (t && 4 === e.readyState) {
          try {
            t.status_code = e.status;
          } catch {}
          triggerHandlers("xhr", {
            endTimestamp: 1e3 * timestampInSeconds(),
            startTimestamp: s,
            xhr: e,
            virtualError: r,
          });
        }
      };
      return (
        "onreadystatechange" in e && "function" == typeof e.onreadystatechange
          ? (e.onreadystatechange = new Proxy(e.onreadystatechange, {
              apply: (t, e, n) => (a(), t.apply(e, n)),
            }))
          : e.addEventListener("readystatechange", a),
        (e.setRequestHeader = new Proxy(e.setRequestHeader, {
          apply(t, e, n) {
            const [r, s] = n,
              i = e[XHR_DATA_KEY];
            return (
              i &&
                isString(r) &&
                isString(s) &&
                (i.request_headers[r.toLowerCase()] = s),
              t.apply(e, n)
            );
          },
        })),
        t.apply(e, n)
      );
    },
  })),
    (t.send = new Proxy(t.send, {
      apply(t, e, n) {
        const r = e[XHR_DATA_KEY];
        if (!r) return t.apply(e, n);
        void 0 !== n[0] && (r.body = n[0]);
        return (
          triggerHandlers("xhr", {
            startTimestamp: 1e3 * timestampInSeconds(),
            xhr: e,
          }),
          t.apply(e, n)
        );
      },
    }));
}
function makeFetchTransport(
  t,
  e = (function (t) {
    const e = nativeApiCache[t];
    if (e) return e;
    let n = browserGlobal[t];
    if (isNativeFunction(n)) return (nativeApiCache[t] = n.bind(browserGlobal));
    const r = browserGlobal.document;
    if (r && "function" == typeof r.createElement)
      try {
        const e = r.createElement("iframe");
        (e.hidden = !0), r.head.appendChild(e);
        const s = e.contentWindow;
        s?.[t] && (n = s[t]), r.head.removeChild(e);
      } catch (s) {
        IS_DEBUG_BUILD &&
          sentryLogger.warn(
            `Could not create sandbox iframe for ${t} check, bailing to window.${t}: `,
            s,
          );
      }
    return n ? (nativeApiCache[t] = n.bind(browserGlobal)) : n;
  })("fetch"),
) {
  let n = 0,
    r = 0;
  return createTransport(
    t,
    async function (s) {
      const i = s.body.length;
      (n += i), r++;
      const o = {
        body: s.body,
        method: "POST",
        referrerPolicy: "strict-origin",
        headers: t.headers,
        keepalive: n <= 6e4 && r < 15,
        ...t.fetchOptions,
      };
      try {
        const n = await e(t.url, o);
        return {
          statusCode: n.status,
          headers: {
            "x-sentry-rate-limits": n.headers.get("X-Sentry-Rate-Limits"),
            "retry-after": n.headers.get("Retry-After"),
          },
        };
      } catch (a) {
        throw ((nativeApiCache["fetch"] = void 0), a);
      } finally {
        (n -= i), r--;
      }
    },
    makePromiseBuffer(t.bufferSize || 40),
  );
}
var isDebugBuildFlag =
  "undefined" == typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__;
function createStackFrame(t, e, n, r) {
  const s = {
    filename: t,
    function: "<anonymous>" === e ? "?" : e,
    in_app: !0,
  };
  return void 0 !== n && (s.lineno = n), void 0 !== r && (s.colno = r), s;
}
var CHROME_BARE_FRAME_REGEX = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
  CHROME_FRAME_REGEX =
    /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
  CHROME_EVAL_REGEX = /\((\S*)(?::(\d+))(?::(\d+))\)/,
  CHROME_DATA_URL_REGEX = /at (.+?) ?\(data:(.+?),/,
  GECKO_FRAME_REGEX =
    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
  GECKO_EVAL_REGEX = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
  defaultStackParser = createStackParser(
    ...[
      [
        30,
        (t) => {
          const e = t.match(CHROME_DATA_URL_REGEX);
          if (e)
            return {
              filename: `<data:${e[2]}>`,
              function: e[1],
            };
          const n = CHROME_BARE_FRAME_REGEX.exec(t);
          if (n) {
            const [, t, e, r] = n;
            return createStackFrame(t, "?", +e, +r);
          }
          const r = CHROME_FRAME_REGEX.exec(t);
          if (r) {
            if (0 === r[2]?.indexOf("eval")) {
              const t = CHROME_EVAL_REGEX.exec(r[2]);
              t && ((r[2] = t[1]), (r[3] = t[2]), (r[4] = t[3]));
            }
            const [t, e] = normalizeSafariExtensionFrame(r[1] || "?", r[2]);
            return createStackFrame(
              e,
              t,
              r[3] ? +r[3] : void 0,
              r[4] ? +r[4] : void 0,
            );
          }
        },
      ],
      [
        50,
        (t) => {
          const e = GECKO_FRAME_REGEX.exec(t);
          if (e) {
            if (e[3] && e[3].indexOf(" > eval") > -1) {
              const t = GECKO_EVAL_REGEX.exec(e[3]);
              t &&
                ((e[1] = e[1] || "eval"),
                (e[3] = t[1]),
                (e[4] = t[2]),
                (e[5] = ""));
            }
            let t = e[3],
              n = e[1] || "?";
            return (
              ([n, t] = normalizeSafariExtensionFrame(n, t)),
              createStackFrame(
                t,
                n,
                e[4] ? +e[4] : void 0,
                e[5] ? +e[5] : void 0,
              )
            );
          }
        },
      ],
    ],
  ),
  normalizeSafariExtensionFrame = (t, e) => {
    const n = -1 !== t.indexOf("safari-extension"),
      r = -1 !== t.indexOf("safari-web-extension");
    return n || r
      ? [
          -1 !== t.indexOf("@") ? t.split("@")[0] : "?",
          n ? `safari-extension:${e}` : `safari-web-extension:${e}`,
        ]
      : [t, e];
  },
  MAX_DOM_STRING_LENGTH = 1024,
  breadcrumbsIntegration = (t = {}) => {
    const e = {
      console: !0,
      dom: !0,
      fetch: !0,
      history: !0,
      sentry: !0,
      xhr: !0,
      ...t,
    };
    return {
      name: "Breadcrumbs",
      setup(t) {
        var n;
        e.console &&
          (function (t) {
            const e = "console",
              n = addInstrumentationHandler(e, t);
            instrumentOnce(e, instrumentConsole);
          })(
            (function (t) {
              return function (e) {
                if (getCurrentClient() !== t) return;
                const n = {
                  category: "console",
                  data: {
                    arguments: e.args,
                    logger: "console",
                  },
                  level: severityFromConsoleLevel(e.level),
                  message: safeJoin(e.args, " "),
                };
                if ("assert" === e.level) {
                  if (!1 !== e.args[0]) return;
                  (n.message = `Assertion failed: ${safeJoin(e.args.slice(1), " ") || "console.assert"}`),
                    (n.data.arguments = e.args.slice(1));
                }
                addBreadcrumb(n, {
                  input: e.args,
                  level: e.level,
                });
              };
            })(t),
          ),
          e.dom &&
            ((n = (function (t, e) {
              return function (n) {
                if (getCurrentClient() !== t) return;
                let r,
                  s,
                  i = "object" == typeof e ? e.serializeAttribute : void 0,
                  o =
                    "object" == typeof e && "number" == typeof e.maxStringLength
                      ? e.maxStringLength
                      : void 0;
                o &&
                  o > MAX_DOM_STRING_LENGTH &&
                  (isDebugBuildFlag &&
                    sentryLogger.warn(
                      `\`dom.maxStringLength\` cannot exceed 1024, but a value of ${o} was configured. Sentry will use 1024 instead.`,
                    ),
                  (o = MAX_DOM_STRING_LENGTH)),
                  "string" == typeof i && (i = [i]);
                try {
                  const t = n.event,
                    e = (function (t) {
                      return !!t && !!t.target;
                    })(t)
                      ? t.target
                      : t;
                  (r = htmlTreeAsString(e, {
                    keyAttrs: i,
                    maxStringLength: o,
                  })),
                    (s = (function (t, e = 5) {
                      if (!globalObject.HTMLElement) return null;
                      let n = t;
                      for (let r = 0; r < e; r++) {
                        if (!n) return null;
                        if (n instanceof HTMLElement) {
                          if (n.dataset.sentryComponent)
                            return n.dataset.sentryComponent;
                          if (n.dataset.sentryElement)
                            return n.dataset.sentryElement;
                        }
                        n = n.parentNode;
                      }
                      return null;
                    })(e));
                } catch {
                  r = "<unknown>";
                }
                if (0 === r.length) return;
                const a = {
                  category: `ui.${n.name}`,
                  message: r,
                };
                s &&
                  (a.data = {
                    "ui.component_name": s,
                  }),
                  addBreadcrumb(a, {
                    event: n.event,
                    name: n.name,
                    global: n.global,
                  });
              };
            })(t, e.dom)),
            addInstrumentationHandler("dom", n),
            instrumentOnce("dom", instrumentDomEvents)),
          e.xhr &&
            (function (t) {
              addInstrumentationHandler("xhr", t),
                instrumentOnce("xhr", instrumentXhr);
            })(
              (function (t) {
                return function (e) {
                  if (getCurrentClient() !== t) return;
                  const { startTimestamp: n, endTimestamp: r } = e,
                    s = e.xhr[XHR_DATA_KEY];
                  if (!n || !r || !s) return;
                  const { method: i, url: o, status_code: a, body: c } = s,
                    u = {
                      method: i,
                      url: o,
                      status_code: a,
                    },
                    l = {
                      xhr: e.xhr,
                      input: c,
                      startTimestamp: n,
                      endTimestamp: r,
                    },
                    d = {
                      category: "xhr",
                      data: u,
                      type: "http",
                      level: breadcrumbLevelFromStatus(a),
                    };
                  t.emit("beforeOutgoingRequestBreadcrumb", d, l),
                    addBreadcrumb(d, l);
                };
              })(t),
            ),
          e.fetch &&
            instrumentFetch(
              (function (t) {
                return function (e) {
                  if (getCurrentClient() !== t) return;
                  const { startTimestamp: n, endTimestamp: r } = e;
                  if (
                    r &&
                    (!e.fetchData.url.match(/sentry_key/) ||
                      "POST" !== e.fetchData.method)
                  )
                    if (e.error) {
                      const s = {
                          data: e.error,
                          input: e.args,
                          startTimestamp: n,
                          endTimestamp: r,
                        },
                        i = {
                          category: "fetch",
                          data: e.fetchData,
                          level: "error",
                          type: "http",
                        };
                      t.emit("beforeOutgoingRequestBreadcrumb", i, s),
                        addBreadcrumb(i, s);
                    } else {
                      const s = e.response,
                        i = {
                          ...e.fetchData,
                          status_code: s?.status,
                        },
                        o = {
                          input: e.args,
                          response: s,
                          startTimestamp: n,
                          endTimestamp: r,
                        },
                        a = {
                          category: "fetch",
                          data: i,
                          type: "http",
                          level: breadcrumbLevelFromStatus(i.status_code),
                        };
                      t.emit("beforeOutgoingRequestBreadcrumb", a, o),
                        addBreadcrumb(a, o);
                    }
                };
              })(t),
            ),
          e.history &&
            instrumentHistoryHandler(
              (function (t) {
                return function (e) {
                  if (getCurrentClient() !== t) return;
                  let n = e.from,
                    r = e.to;
                  const s = parseUrl(browserWindow.location.href);
                  let i = n ? parseUrl(n) : void 0;
                  const o = parseUrl(r);
                  i?.path || (i = s),
                    s.protocol === o.protocol &&
                      s.host === o.host &&
                      (r = o.relative),
                    s.protocol === i.protocol &&
                      s.host === i.host &&
                      (n = i.relative),
                    addBreadcrumb({
                      category: "navigation",
                      data: {
                        from: n,
                        to: r,
                      },
                    });
                };
              })(t),
            ),
          e.sentry &&
            t.on(
              "beforeSendEvent",
              (function (t) {
                return function (e) {
                  getCurrentClient() === t &&
                    addBreadcrumb(
                      {
                        category:
                          "sentry." +
                          ("transaction" === e.type ? "transaction" : "event"),
                        event_id: e.event_id,
                        level: e.level,
                        message: getEventDescription(e),
                      },
                      {
                        event: e,
                      },
                    );
                };
              })(t),
            );
      },
    };
  };
var WRAPPED_EVENT_TARGETS =
    "EventTarget,Window,Node,ApplicationCache,AudioTrackList,BroadcastChannel,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(
      ",",
    ),
  browserApiErrorsIntegration = (t = {}) => {
    const e = {
      XMLHttpRequest: !0,
      eventTarget: !0,
      requestAnimationFrame: !0,
      setInterval: !0,
      setTimeout: !0,
      unregisterOriginalCallbacks: !1,
      ...t,
    };
    return {
      name: "BrowserApiErrors",
      setupOnce() {
        e.setTimeout &&
          wrapMethod(browserWindow, "setTimeout", wrapTimerFunction),
          e.setInterval &&
            wrapMethod(browserWindow, "setInterval", wrapTimerFunction),
          e.requestAnimationFrame &&
            wrapMethod(
              browserWindow,
              "requestAnimationFrame",
              wrapRequestAnimationFrame,
            ),
          e.XMLHttpRequest &&
            "XMLHttpRequest" in browserWindow &&
            wrapMethod(XMLHttpRequest.prototype, "send", wrapXhrSend);
        const t = e.eventTarget;
        t &&
          (Array.isArray(t) ? t : WRAPPED_EVENT_TARGETS).forEach((t) =>
            (function (t, e) {
              const n = browserWindow[t]?.prototype;
              if (!n?.hasOwnProperty?.("addEventListener")) return;
              wrapMethod(n, "addEventListener", function (n) {
                return function (r, s, i) {
                  try {
                    "function" == typeof s.handleEvent &&
                      (s.handleEvent = wrapFunction(s.handleEvent, {
                        mechanism: {
                          data: {
                            handler: getFunctionName(s),
                            target: t,
                          },
                          handled: !1,
                          type: "auto.browser.browserapierrors.handleEvent",
                        },
                      }));
                  } catch {}
                  return (
                    e.unregisterOriginalCallbacks &&
                      (function (t, e, n) {
                        t &&
                          "object" == typeof t &&
                          "removeEventListener" in t &&
                          "function" == typeof t.removeEventListener &&
                          t.removeEventListener(e, n);
                      })(this, r, s),
                    n.apply(this, [
                      r,
                      wrapFunction(s, {
                        mechanism: {
                          data: {
                            handler: getFunctionName(s),
                            target: t,
                          },
                          handled: !1,
                          type: "auto.browser.browserapierrors.addEventListener",
                        },
                      }),
                      i,
                    ])
                  );
                };
              }),
                wrapMethod(n, "removeEventListener", function (t) {
                  return function (e, n, r) {
                    try {
                      const s = n.__sentry_wrapped__;
                      s && t.call(this, e, s, r);
                    } catch {}
                    return t.call(this, e, n, r);
                  };
                });
            })(t, e),
          );
      },
    };
  };
function wrapTimerFunction(t) {
  return function (...e) {
    const n = e[0];
    return (
      (e[0] = wrapFunction(n, {
        mechanism: {
          handled: !1,
          type: `auto.browser.browserapierrors.${getFunctionName(t)}`,
        },
      })),
      t.apply(this, e)
    );
  };
}
function wrapRequestAnimationFrame(t) {
  return function (e) {
    return t.apply(this, [
      wrapFunction(e, {
        mechanism: {
          data: {
            handler: getFunctionName(t),
          },
          handled: !1,
          type: "auto.browser.browserapierrors.requestAnimationFrame",
        },
      }),
    ]);
  };
}
function wrapXhrSend(t) {
  return function (...e) {
    const n = this;
    return (
      ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((t) => {
        t in n &&
          "function" == typeof n[t] &&
          wrapMethod(n, t, function (e) {
            const n = {
                mechanism: {
                  data: {
                    handler: getFunctionName(e),
                  },
                  handled: !1,
                  type: `auto.browser.browserapierrors.xhr.${t}`,
                },
              },
              r = getOriginalFunction(e);
            return (
              r && (n.mechanism.data.handler = getFunctionName(r)),
              wrapFunction(e, n)
            );
          });
      }),
      t.apply(this, e)
    );
  };
}
var browserSessionIntegration = (t = {}) => {
    const e = t.lifecycle ?? "route";
    return {
      name: "BrowserSession",
      setupOnce() {
        if (void 0 === browserWindow.document)
          return void (
            isDebugBuildFlag &&
            sentryLogger.warn(
              "Using the `browserSessionIntegration` in non-browser environments is not supported.",
            )
          );
        startSession({
          ignoreDuration: !0,
        }),
          captureSession();
        const t = getIsolationScope();
        let n = t.getUser();
        t.addScopeListener((t) => {
          const e = t.getUser();
          (n?.id === e?.id && n?.ip_address === e?.ip_address) ||
            (captureSession(), (n = e));
        }),
          "route" === e &&
            instrumentHistoryHandler(({ from: t, to: e }) => {
              t !== e &&
                (startSession({
                  ignoreDuration: !0,
                }),
                captureSession());
            });
      },
    };
  },
  cultureContextIntegration = () => ({
    name: "CultureContext",
    preprocessEvent(t) {
      const e = getCultureContext();
      e &&
        (t.contexts = {
          ...t.contexts,
          culture: {
            ...e,
            ...t.contexts?.culture,
          },
        });
    },
    processSegmentSpan(t) {
      const e = getCultureContext();
      e &&
        setDefaultSpanAttributes(t, {
          "culture.locale": e.locale,
          "culture.timezone": e.timezone,
          "culture.calendar": e.calendar,
        });
    },
  });
function getCultureContext() {
  try {
    const t = browserWindow.Intl;
    if (!t) return;
    const e = t.DateTimeFormat().resolvedOptions();
    return {
      locale: e.locale,
      timezone: e.timeZone,
      calendar: e.calendar,
    };
  } catch {
    return;
  }
}
var globalHandlersIntegration = (t = {}) => {
  const e = {
    onerror: !0,
    onunhandledrejection: !0,
    ...t,
  };
  return {
    name: "GlobalHandlers",
    setupOnce() {
      Error.stackTraceLimit = 50;
    },
    setup(t) {
      e.onerror &&
        (!(function (t) {
          !(function (t) {
            const e = "error";
            addInstrumentationHandler(e, t),
              instrumentOnce(e, instrumentGlobalOnError);
          })((e) => {
            const { stackParser: n, attachStacktrace: r } =
              getStackParserOptions();
            if (getCurrentClient() !== t || isIgnoringOnError()) return;
            const { msg: s, url: i, line: o, column: a, error: c } = e,
              u = (function (t, e, n, r) {
                const s = (t.exception = t.exception || {}),
                  i = (s.values = s.values || []),
                  o = (i[0] = i[0] || {}),
                  a = (o.stacktrace = o.stacktrace || {}),
                  c = (a.frames = a.frames || []);
                0 === c.length &&
                  c.push({
                    colno: r,
                    lineno: n,
                    filename: sanitizeErrorFilename(e) ?? getLocationHref(),
                    function: "?",
                    in_app: !0,
                  });
                return t;
              })(eventFromUnknownInput(n, c || s, void 0, r, !1), i, o, a);
            (u.level = "error"),
              captureEvent(u, {
                originalException: c,
                mechanism: {
                  handled: !1,
                  type: "auto.browser.global_handlers.onerror",
                },
              });
          });
        })(t),
        logGlobalHandlerAttached("onerror")),
        e.onunhandledrejection &&
          (!(function (t) {
            !(function (t) {
              const e = "unhandledrejection";
              addInstrumentationHandler(e, t),
                instrumentOnce(e, instrumentUnhandledRejection);
            })((e) => {
              const { stackParser: n, attachStacktrace: r } =
                getStackParserOptions();
              if (getCurrentClient() !== t || isIgnoringOnError()) return;
              const s = (function (t) {
                  if (isPrimitive(t)) return t;
                  try {
                    if ("reason" in t) return t.reason;
                    if ("detail" in t && "reason" in t.detail)
                      return t.detail.reason;
                  } catch {}
                  return t;
                })(e),
                i = isPrimitive(s)
                  ? {
                      exception: {
                        values: [
                          {
                            type: "UnhandledRejection",
                            value: `Non-Error promise rejection captured with value: ${String(s)}`,
                          },
                        ],
                      },
                    }
                  : eventFromUnknownInput(n, s, void 0, r, !0);
              (i.level = "error"),
                captureEvent(i, {
                  originalException: s,
                  mechanism: {
                    handled: !1,
                    type: "auto.browser.global_handlers.onunhandledrejection",
                  },
                });
            });
          })(t),
          logGlobalHandlerAttached("onunhandledrejection"));
    },
  };
};
function logGlobalHandlerAttached(t) {
  isDebugBuildFlag && sentryLogger.log(`Global Handler attached: ${t}`);
}
function getStackParserOptions() {
  return (
    getCurrentClient()?.getOptions() || {
      stackParser: () => [],
      attachStacktrace: !1,
    }
  );
}
function sanitizeErrorFilename(t) {
  if (isString(t) && 0 !== t.length)
    return t.startsWith("data:")
      ? `<${(function (t, e = !0) {
          if (t.startsWith("data:")) {
            const n = t.match(/^data:([^;,]+)/),
              r = n ? n[1] : "text/plain",
              s = t.includes(";base64,"),
              i = t.indexOf(",");
            let o = "";
            if (e && -1 !== i) {
              const e = t.slice(i + 1);
              o = e.length > 10 ? `${e.slice(0, 10)}... [truncated]` : e;
            }
            return `data:${r}${s ? ",base64" : ""}${o ? `,${o}` : ""}`;
          }
          return t;
        })(t, !1)}>`
      : t;
}
var httpContextIntegration = () => ({
    name: "HttpContext",
    preprocessEvent(t) {
      if (
        !browserWindow.navigator &&
        !browserWindow.location &&
        !browserWindow.document
      )
        return;
      const e = getRequestInfo(),
        n = {
          ...e.headers,
          ...t.request?.headers,
        };
      t.request = {
        ...e,
        ...t.request,
        headers: n,
      };
    },
    processSegmentSpan(t) {
      if (
        !browserWindow.navigator &&
        !browserWindow.location &&
        !browserWindow.document
      )
        return;
      const e = getRequestInfo();
      setDefaultSpanAttributes(t, {
        "url.full": e.url || void 0,
        "http.request.header.user_agent": e.headers["User-Agent"],
        "http.request.header.referer": e.headers.Referer,
      });
    },
  }),
  linkedErrorsIntegration = (t = {}) => {
    const e = t.limit || 5,
      n = t.key || "cause";
    return {
      name: "LinkedErrors",
      preprocessEvent(t, r, s) {
        applyLinkedErrors(
          exceptionFromError,
          s.getOptions().stackParser,
          n,
          e,
          t,
          r,
        );
      },
    };
  };
function isBrowserExtensionContext() {
  return (
    !!(function () {
      if (void 0 === browserWindow.window) return !1;
      const t = browserWindow;
      if (t.nw) return !1;
      if (!(t.chrome || t.browser)?.runtime?.id) return !1;
      const e = getLocationHref();
      return !(
        browserWindow === browserWindow.top &&
        /^(?:chrome-extension|moz-extension|ms-browser-extension|safari-web-extension):\/\//.test(
          e,
        )
      );
    })() && (isDebugBuildFlag && withOriginalConsole(() => {}), !0)
  );
}
function getDefaultIntegrations(t) {
  return [
    inboundFiltersIntegration(),
    functionToStringIntegration(),
    conversationIdIntegration(),
    browserApiErrorsIntegration(),
    breadcrumbsIntegration(),
    globalHandlersIntegration(),
    linkedErrorsIntegration(),
    dedupeIntegration(),
    httpContextIntegration(),
    cultureContextIntegration(),
    browserSessionIntegration(),
  ];
}
function initSentry() {
  return; // Claus: no error reporting, ever. No Sentry client is created, so captureException() is a no-op.
  const t = getDefaultIntegrations().filter(
    (t) =>
      ![
        "BrowserApiErrors",
        "Breadcrumbs",
        "GlobalHandlers",
        "BrowserSession",
      ].includes(t.name),
  );
  !(function (t = {}) {
    const e = !t.skipBrowserExtensionCheck && isBrowserExtensionContext();
    let n =
      null == t.defaultIntegrations
        ? getDefaultIntegrations()
        : t.defaultIntegrations;
    const r = {
      ...t,
      enabled: !e && t.enabled,
      stackParser:
        ((s = t.stackParser || defaultStackParser),
        Array.isArray(s) ? createStackParser(...s) : s),
      integrations: getIntegrationsToSetup({
        integrations: t.integrations,
        defaultIntegrations: n,
      }),
      transport: t.transport || makeFetchTransport,
    };
    var s;
    initAndBindClient(BrowserClient, r);
  })({
    dsn: "https://60bea3ee4ef1022e4035b23ba50f44d0@o1158394.ingest.us.sentry.io/4509876992278529",
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: t,
    sendClientReports: !1,
    initialScope: {
      tags: {
        extension_version: chrome.runtime.getManifest().version,
      },
    },
    beforeSend: async (t) =>
      (await DesktopManagedState.isDesktopManaged())
        ? null
        : ((t.contexts = {
            ...t.contexts,
            extension: {
              id: chrome.runtime.id,
              version: chrome.runtime.getManifest().version,
              environment: "production",
            },
          }),
          t),
  });
}
var REMOTE_DEVICES_SERVER = "remote-devices",
  COMPUTER_TOOL_PREFIX = "computer_",
  CLAUDE_BROWSER_TOOL_SEGMENT = "Claude_Browser__",
  REMOTE_BROWSER_TOOL_PREFIX = `mcp__${REMOTE_DEVICES_SERVER}__${CLAUDE_BROWSER_TOOL_SEGMENT}`,
  REMOTE_DEVICE_TOOL_NAMES = new Set([
    "list_devices",
    "get_device_info",
    "device_list_dir",
    "device_stage_files",
    "device_commit_files",
    "device_bash",
    "device_request_folder_access",
    "device_request_delete_permission",
    "create_artifact",
    "update_artifact",
    "list_artifacts",
    "list_legacy_live_artifacts",
    "project_memory_read",
    "project_memory_write",
    "computer_resolve_access",
    "computer_request_access",
    "computer_release_lock",
    "computer_screenshot",
    "computer_zoom",
    "computer_left_click",
    "computer_double_click",
    "computer_triple_click",
    "computer_right_click",
    "computer_middle_click",
    "computer_type",
    "computer_key",
    "computer_scroll",
    "computer_left_click_drag",
    "computer_mouse_move",
    "computer_open_application",
    "computer_switch_display",
    "computer_list_granted_applications",
    "computer_list_apps",
    "computer_read_clipboard",
    "computer_write_clipboard",
    "computer_wait",
    "computer_cursor_position",
    "computer_hold_key",
    "computer_left_mouse_down",
    "computer_left_mouse_up",
    "computer_batch",
    "computer_release_full_control",
    "computer_request_full_control",
    "computer_app_list_windows",
    "computer_app_ax_find",
    "computer_app_screenshot",
    "computer_app_zoom",
    "computer_app_click",
    "computer_app_type",
    "computer_app_key",
    "computer_app_scroll",
    "computer_app_focus",
    "computer_app_drag",
    "computer_app_menu",
    "computer_app_batch",
    "computer_app_release",
    "computer_app_bring_to_current_space",
  ]),
  INVISIBLE_CHARS_REGEX =
    /[\u034F\u0000-\u001F\u007F-\u009F\u00AD\u061C\u115F\u1160\u180E\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060-\u2064\u2066-\u2069\u3164\uFEFF\uFFA0]/g;
function stripInvisibleChars(t) {
  return null == t
    ? ""
    : "object" == typeof t
      ? "[non-string]"
      : ("string" == typeof t ? t : String(t)).replace(
          INVISIBLE_CHARS_REGEX,
          "�",
        );
}
var DEFAULT_IGNORABLE_REGEX = /[\u2800\p{Default_Ignorable_Code_Point}]/gu,
  BLANK_LINE_REGEX = /^[\s\u2800\p{Default_Ignorable_Code_Point}]*$/u;
function sanitizeMultilineText(t) {
  return "string" != typeof t
    ? stripInvisibleChars(t)
    : t
        .replace(/\r\n?/g, "\n")
        .replace(/\t/g, "  ")
        .split("\n")
        .map((t) =>
          BLANK_LINE_REGEX.test(t)
            ? ""
            : stripInvisibleChars(t).replace(DEFAULT_IGNORABLE_REGEX, "�"),
        )
        .join("\n")
        .replace(/\n{3,}/g, "\n\n");
}
function getHostnameFromUrl(t) {
  t.startsWith("http") || (t = `https://${t}`);
  try {
    return new URL(t).hostname;
  } catch {
    return "";
  }
}
var pendingNavigationChecker = () => !1;
function setPendingNavigationChecker(t) {
  pendingNavigationChecker = t;
}
async function verifyTabDomainUnchanged(t, e, n, r = {}) {
  if (!e) return null;
  const s = await chrome.tabs.get(t);
  if (!s.url)
    return {
      error: "Unable to verify current URL for security check",
      errorCode: "security_check_failed",
    };
  const i = getHostnameFromUrl(e),
    o = getHostnameFromUrl(s.url),
    a =
      (r.countPendingNavigation ?? pendingNavigationChecker(t))
        ? s.pendingUrl
        : void 0;
  return i !== o || (a && getHostnameFromUrl(a) !== i)
    ? {
        error: `Security check failed: the page navigated to a different domain during ${n}. Re-read the tab state before retrying.`,
        errorCode: "security_check_failed",
      }
    : null;
}
async function verifyTabOrigin(t, e) {
  let n;
  try {
    const e = await chrome.tabs.get(t);
    n = e.url ? new URL(e.url).origin : void 0;
  } catch {
    n = void 0;
  }
  return n && "null" !== n && "null" !== e && n === e
    ? null
    : {
        error:
          "Origin mismatch: the tab is no longer on the page this text was approved for",
        errorCode: "security_check_failed",
      };
}
var ICON_SIZE_MAP = {
  12: 16,
  16: 20,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
};
function SvgIconBase({
  size: t = 20,
  vectorSizeOverride: e,
  className: n,
  alt: r,
  viewBox: s = "0 0 20 20",
  children: o,
}) {
  const c = e || ICON_SIZE_MAP[t],
    u = (0, jsxRuntime.jsx)("svg", {
      width: c,
      height: c,
      viewBox: s,
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      className: "shrink-0",
      "aria-label": r,
      "aria-hidden": !r,
      children: o,
    });
  return e
    ? u
    : (0, jsxRuntime.jsx)("div", {
        className: classNames("flex items-center justify-center", n),
        style: {
          width: t,
          height: t,
        },
        children: u,
      });
}
var PermissionToolType = (function (t) {
    return (
      (t.NAVIGATE = "navigate"),
      (t.READ_PAGE_CONTENT = "read_page_content"),
      (t.READ_CONSOLE_MESSAGES = "read_console_messages"),
      (t.READ_NETWORK_REQUESTS = "read_network_requests"),
      (t.CLICK = "click"),
      (t.TYPE = "type"),
      (t.UPLOAD_IMAGE = "upload_image"),
      (t.DOMAIN_TRANSITION = "domain_transition"),
      (t.PLAN_APPROVAL = "plan_approval"),
      (t.EXECUTE_JAVASCRIPT = "execute_javascript"),
      (t.REMOTE_MCP = "remote_mcp"),
      t
    );
  })({}),
  PermissionAction = (function (t) {
    return (t.ALLOW = "allow"), (t.DENY = "deny"), t;
  })({}),
  PermissionDuration = (function (t) {
    return (t.ONCE = "once"), (t.ALWAYS = "always"), t;
  })({});
function getPermissionVerbPhrase(t) {
  return {
    [PermissionToolType.NAVIGATE]: "navigate to",
    [PermissionToolType.READ_PAGE_CONTENT]: "read page content on",
    [PermissionToolType.READ_CONSOLE_MESSAGES]: "read debugging information on",
    [PermissionToolType.READ_NETWORK_REQUESTS]: "read debugging information on",
    [PermissionToolType.CLICK]: "click on",
    [PermissionToolType.TYPE]: "type text into",
    [PermissionToolType.UPLOAD_IMAGE]: "upload an image to",
    [PermissionToolType.DOMAIN_TRANSITION]: "navigate from",
    [PermissionToolType.PLAN_APPROVAL]: "approve plan for",
    [PermissionToolType.EXECUTE_JAVASCRIPT]: "execute JavaScript on",
    [PermissionToolType.REMOTE_MCP]: "access",
  }[t];
}
var PERMISSION_MODES = ["follow_a_plan", "skip_all_permission_checks"],
  DEFAULT_PERMISSION_MODE = "follow_a_plan";
function PointerClickIcon(t) {
  return (0, jsxRuntime.jsxs)(SvgIconBase, {
    ...t,
    children: [
      (0, jsxRuntime.jsx)("path", {
        d: "M10.8139 17.5841L7.08902 8.12868C6.76198 7.29851 7.60347 6.48813 8.42074 6.84621L17.6697 10.8985C18.6008 11.3065 18.4 12.6821 17.3912 12.8069L14.3103 13.1881C13.8869 13.2405 13.5433 13.5557 13.4548 13.973L12.7225 17.4251C12.5168 18.3949 11.1772 18.5065 10.8139 17.5841Z",
        stroke: "currentColor",
        fill: "none",
        strokeWidth: "1",
      }),
      (0, jsxRuntime.jsx)("path", {
        d: "M5 5L3 3",
        stroke: "currentColor",
        strokeLinecap: "round",
      }),
      (0, jsxRuntime.jsx)("path", {
        d: "M8.36609 3.82843L8.36609 1.63391",
        stroke: "currentColor",
        strokeLinecap: "round",
      }),
      (0, jsxRuntime.jsx)("path", {
        d: "M3.82843 8.4624H1.5376",
        stroke: "currentColor",
        strokeLinecap: "round",
      }),
    ],
  });
}
function PointerIcon(t) {
  return (0, jsxRuntime.jsx)(SvgIconBase, {
    ...t,
    children: (0, jsxRuntime.jsx)("path", {
      d: "M8.5284 16.4959L3.99583 4.99017C3.6688 4.16 4.51029 3.34963 5.32755 3.7077L16.6268 8.65832C17.5578 9.06626 17.3571 10.4419 16.3482 10.5667L12.2422 11.0747C11.8188 11.1271 11.4753 11.4423 11.3868 11.8596L10.437 16.3369C10.2313 17.3066 8.89175 17.4182 8.5284 16.4959Z",
      stroke: "currentColor",
      fill: "none",
      strokeWidth: "1",
    }),
  });
}
function ju(t) {
  return (0, jsxRuntime.jsx)(SvgIconBase, {
    ...t,
    children: (0, jsxRuntime.jsx)("path", {
      d: "M9.77051 6.99976C10.7236 6.99987 11.5443 7.67268 11.7314 8.60718L12.4102 11.9998H14.3906L13.7344 8.72339C13.6503 8.3028 13.2814 7.9999 12.8525 7.99976H12.5C12.224 7.99976 12.0002 7.77576 12 7.49976C12 7.22361 12.2239 6.99976 12.5 6.99976H12.8525C13.7581 6.9999 14.5382 7.63909 14.7158 8.5271L15.4102 11.9998H17.3906L16.7344 8.72339C16.6503 8.3028 16.2814 7.9999 15.8525 7.99976H15.5C15.224 7.99976 15.0002 7.77576 15 7.49976C15 7.22361 15.2239 6.99976 15.5 6.99976H15.8525C16.7581 6.9999 17.5382 7.63909 17.7158 8.5271L18.4902 12.4021C18.5194 12.5488 18.4815 12.7015 18.3867 12.8171C18.2918 12.9327 18.1496 12.9997 18 12.9998H2.5C2.43885 12.9998 2.38012 12.9857 2.32422 12.9646C2.31718 12.9619 2.30962 12.9607 2.30273 12.9578C2.28147 12.9486 2.262 12.9366 2.24219 12.9246C2.23265 12.9187 2.22297 12.9134 2.21387 12.907C2.19638 12.8947 2.17994 12.8815 2.16406 12.8669C2.15403 12.8577 2.14402 12.8486 2.13477 12.8386C2.12793 12.8313 2.1197 12.825 2.11328 12.8171C2.10702 12.8095 2.10244 12.8007 2.09668 12.7927C2.08824 12.7811 2.08068 12.7689 2.07324 12.7566C2.06252 12.7387 2.0523 12.7208 2.04395 12.7019C2.03919 12.6912 2.03623 12.6798 2.03223 12.6687C2.02468 12.6477 2.01639 12.627 2.01172 12.6052C2.00939 12.5944 2.00943 12.5831 2.00781 12.572C1.99968 12.5161 1.99848 12.4588 2.00977 12.4021L2.76855 8.60718C2.95571 7.67268 3.7764 6.99986 4.72949 6.99976H9.77051ZM4.72949 7.99976C4.25302 7.99986 3.84263 8.33629 3.74902 8.80347L3.10938 11.9998H11.3906L10.751 8.80347C10.6574 8.33629 10.247 7.99987 9.77051 7.99976H4.72949Z",
      fill: "currentColor",
    }),
  });
}
var EVENT_GRANT_WRITTEN = "claude_chrome.permission.grant_written",
  EVENT_GRANT_REVOKED = "claude_chrome.permission.grant_revoked",
  EVENT_GRANTS_CLEARED = "claude_chrome.permission.grants_cleared",
  EVENT_STORED_GRANT_APPLIED = "claude_chrome.permission.stored_grant_applied";
function getUrlHost(t) {
  if (!t) return "";
  try {
    return new URL(t).host;
  } catch {
    return "";
  }
}
function sanitizeHostForTelemetry(t) {
  if (!t) return "";
  const e = t.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split(/[/?#]/, 1)[0],
    n = e.lastIndexOf("@"),
    r = -1 === n ? e : e.slice(n + 1);
  return /^(\*\.)?[a-z0-9._-]+(:\d+)?$|^\[[0-9a-f:.]+\](:\d+)?$/i.test(r)
    ? r
    : "";
}
function permissionScopeToTelemetry(t) {
  return "netloc" === t.type
    ? {
        scope_type: "netloc",
        host: sanitizeHostForTelemetry(t.netloc),
      }
    : {
        scope_type: "domain_transition",
        host: sanitizeHostForTelemetry(t.fromDomain),
        to_host: sanitizeHostForTelemetry(t.toDomain),
      };
}
function trackGrantWritten(t, e) {
  if (t)
    try {
      t(EVENT_GRANT_WRITTEN, {
        ...permissionScopeToTelemetry(e.scope),
        duration: e.duration,
        tool_type: e.tool_type,
        surface: e.surface ?? null,
        category_at_write: e.categoryAtWrite ?? null,
      });
    } catch {}
}
function trackGrantRevoked(t, e) {
  if (t)
    try {
      t(EVENT_GRANT_REVOKED, {
        ...permissionScopeToTelemetry(e.scope),
        duration: e.duration,
        action: e.action,
        surface: e.surface ?? null,
      });
    } catch {}
}
function trackStoredGrantApplied(t, e, n) {
  if (
    t &&
    (e.duration !== PermissionDuration.ONCE || "netloc" !== e.scope.type)
  )
    try {
      t(EVENT_STORED_GRANT_APPLIED, {
        ...permissionScopeToTelemetry(e.scope),
        matched_host: sanitizeHostForTelemetry(n),
        duration: e.duration,
        action: e.action,
        grant_surface: e.surface ?? null,
        grant_age_ms: Date.now() - e.createdAt,
      });
    } catch {}
}
var PermissionManager = class {
  permissions = [];
  cache = new Map();
  getSkipAllPermissions;
  forcePrompt = !1;
  bypassLocalhostForMcp = !1;
  trackEvent;
  turnApprovedDomains = new Set();
  restrictOnly = !1;
  deniedDomains = new Set();
  surface;
  constructor(t, e) {
    (this.getSkipAllPermissions = t),
      (this.surface = e.surface),
      (this.bypassLocalhostForMcp = e.bypassLocalhostForMcp ?? !1),
      (this.trackEvent = e.trackEvent),
      this.loadPermissions(),
      this.setupStorageListener();
  }
  setForcePrompt(t) {
    this.forcePrompt = t;
  }
  setRestrictOnly(t) {
    this.restrictOnly = t;
  }
  setDeniedDomains(t) {
    this.deniedDomains.clear();
    for (const e of t) {
      const t = this.normalizeDomain(e);
      t && this.deniedDomains.add(t);
    }
  }
  isDeniedHost(t) {
    if (!t) return !1;
    for (const e of this.deniedDomains)
      if (t === e || t.endsWith("." + e)) return !0;
    return !1;
  }
  setTurnApprovedDomains(t) {
    this.turnApprovedDomains.clear();
    for (const e of t) {
      const t = this.normalizeDomain(e);
      t && this.turnApprovedDomains.add(t);
    }
  }
  clearTurnApprovedDomains() {
    this.turnApprovedDomains.clear();
  }
  isTurnApprovedDomain(t) {
    const e = this.normalizeDomain(t);
    return !!e && this.turnApprovedDomains.has(e);
  }
  getTurnApprovedDomains() {
    return Array.from(this.turnApprovedDomains);
  }
  normalizeDomain(t) {
    try {
      if (t.startsWith("http://") || t.startsWith("https://"))
        return new URL(t).hostname
          .toLowerCase()
          .replace(/\.$/, "")
          .replace(/^www\./, "");
      const e = t
        .toLowerCase()
        .replace(/^www\./, "")
        .split("/")[0];
      if (e.startsWith("[")) {
        const t = e.indexOf("]");
        return -1 === t ? e : e.slice(1, t);
      }
      const n = e.indexOf(":");
      return n !== e.lastIndexOf(":")
        ? e
        : (-1 === n ? e : e.slice(0, n)).replace(/\.$/, "");
    } catch {
      return null;
    }
  }
  async checkPermission(t, e, n) {
    const r = this.normalizeDomain(new URL(t).hostname.replace(/\.$/, ""));
    if (this.isDeniedHost(r))
      return {
        allowed: !1,
        needsPrompt: !1,
      };
    const s = new URL(t).hostname.replace(/\.$/, "");
    if (s && this.turnApprovedDomains.size > 0 && !this.isTurnApprovedDomain(s))
      return {
        allowed: !1,
        needsPrompt: !1,
      };
    if (
      !this.forcePrompt &&
      this.bypassLocalhostForMcp &&
      this.isLocalhostUrl(t)
    )
      return {
        allowed: !0,
        needsPrompt: !1,
      };
    if (!this.forcePrompt && this.getSkipAllPermissions())
      return {
        allowed: !0,
        permission: void 0,
      };
    const { host: i } = new URL(t),
      o = i.replace(/\.(?=(:\d+)?$)/, "");
    if (!this.forcePrompt && !this.restrictOnly && this.isTurnApprovedDomain(o))
      return {
        allowed: !0,
        needsPrompt: !1,
      };
    await this.loadPermissions();
    const a = new URL(t).origin,
      c = this.findApplicablePermission(o, e, a),
      u =
        null !== c &&
        this.forcePrompt &&
        c.action === PermissionAction.ALLOW &&
        c.duration !== PermissionDuration.ONCE;
    return c && !u
      ? (n?.readonly ||
          ((c.lastUsed = Date.now()),
          await this.savePermissions(),
          trackStoredGrantApplied(this.trackEvent, c, o)),
        {
          allowed: c.action === PermissionAction.ALLOW,
          permission: c,
        })
      : (this.forcePrompt,
        {
          allowed: !1,
          needsPrompt: !0,
        });
  }
  async checkDomainTransition(t, e) {
    const n = (t) => t.replace(/\.(?=(:\d+)?$)/, ""),
      r = (t) => (void 0 === t ? void 0 : n(t));
    (t = n(t)), (e = n(e));
    const s = this.normalizeDomain(e);
    if (this.isDeniedHost(s))
      return {
        allowed: !1,
        needsPrompt: !0,
      };
    if (!this.forcePrompt && this.bypassLocalhostForMcp) {
      const n = this.isLocalhostDomain(t),
        r = this.isLocalhostDomain(e);
      if (r)
        return {
          allowed: !0,
          needsPrompt: !1,
        };
      if (n && !r)
        return {
          allowed: !1,
          needsPrompt: !0,
        };
    }
    if (this.forcePrompt)
      return {
        allowed: !1,
        needsPrompt: !0,
      };
    const i = this.isTurnApprovedDomain(e);
    if (!this.restrictOnly && i)
      return {
        allowed: !0,
        needsPrompt: !1,
      };
    await this.loadPermissions();
    const o = this.permissions.filter(
        (n) =>
          "domain_transition" === n.scope.type &&
          r(n.scope.fromDomain) === t &&
          r(n.scope.toDomain) === e,
      ),
      a = o.find((t) => t.action === PermissionAction.DENY);
    if (a)
      return (
        (a.lastUsed = Date.now()),
        await this.savePermissions(),
        trackStoredGrantApplied(this.trackEvent, a, e),
        {
          allowed: !1,
          permission: a,
        }
      );
    const c = o.find((t) => t.action === PermissionAction.ALLOW);
    return c
      ? ((c.lastUsed = Date.now()),
        await this.savePermissions(),
        trackStoredGrantApplied(this.trackEvent, c, e),
        {
          allowed: !0,
          permission: c,
        })
      : {
          allowed: !1,
          needsPrompt: !0,
        };
  }
  async grantPermission(t, e, n, r) {
    const s = {
      id: crypto.randomUUID(),
      scope: t,
      action: PermissionAction.ALLOW,
      duration: e,
      createdAt: Date.now(),
      toolUseId: e === PermissionDuration.ONCE ? n : void 0,
      origin: e === PermissionDuration.ONCE ? r : void 0,
      surface: this.surface,
    };
    await this.loadPermissions(),
      this.permissions.push(s),
      await this.savePermissions(),
      this.clearCache();
  }
  async denyPermission(t, e) {
    if (e === PermissionDuration.ONCE) return;
    const n = {
      id: crypto.randomUUID(),
      scope: t,
      action: PermissionAction.DENY,
      duration: e,
      createdAt: Date.now(),
    };
    await this.loadPermissions(),
      e === PermissionDuration.ALWAYS && this.permissions.push(n),
      await this.savePermissions(),
      this.clearCache();
  }
  async revokePermission(t) {
    await this.loadPermissions(),
      (this.permissions = this.permissions.filter((e) => e.id !== t)),
      await this.savePermissions(),
      this.clearCache();
  }
  async clearAllPermissions() {
    const t = this.permissions.length;
    (this.permissions = []), await this.savePermissions(), this.clearCache();
    try {
      this.trackEvent?.(EVENT_GRANTS_CLEARED, {
        count: t,
      });
    } catch {}
  }
  async clearOncePermissions() {
    await this.loadPermissions();
    const t = this.permissions.length;
    this.permissions = this.permissions.filter(
      (t) => t.duration !== PermissionDuration.ONCE,
    );
    t - this.permissions.length > 0 &&
      (await this.savePermissions(), this.clearCache());
  }
  getPermissionsByScope() {
    return {
      netloc: this.permissions.filter((t) => "netloc" === t.scope.type),
      domain_transition: this.permissions.filter(
        (t) => "domain_transition" === t.scope.type,
      ),
    };
  }
  getAllPermissions() {
    return [...this.permissions];
  }
  findApplicablePermission(t, e, n) {
    const r = this.surface,
      s = `${t}:${r}:${e || "no-tool"}`;
    if (this.cache.has(s)) return this.cache.get(s);
    if (e) {
      const s = this.permissions.find(
        (s) =>
          s.duration === PermissionDuration.ONCE &&
          s.toolUseId === e &&
          "netloc" === s.scope.type &&
          s.scope.netloc &&
          this.matchesNetloc(t, s.scope.netloc) &&
          void 0 !== s.surface &&
          s.surface === r &&
          (void 0 === s.origin || s.origin === n),
      );
      if (s) return this.revokePermission(s.id), s;
    }
    this.permissions.forEach((t) => {});
    const i = this.permissions.filter(
        (e) =>
          "netloc" === e.scope.type &&
          e.duration !== PermissionDuration.ONCE &&
          e.scope.netloc &&
          this.matchesNetloc(t, e.scope.netloc),
      ),
      o = i.find((t) => t.action === PermissionAction.DENY);
    if (o) return this.cache.set(s, o), o;
    const a = i.find(
      (t) =>
        t.action === PermissionAction.ALLOW &&
        void 0 !== t.surface &&
        t.surface === r,
    );
    return a ? (this.cache.set(s, a), a) : null;
  }
  async hasSiteWidePermissions(t) {
    return (
      await this.loadPermissions(),
      this.permissions.some(
        (e) =>
          "netloc" === e.scope.type &&
          e.duration === PermissionDuration.ALWAYS &&
          e.action === PermissionAction.ALLOW &&
          void 0 !== e.surface &&
          e.surface === this.surface &&
          e.scope.netloc &&
          this.matchesNetloc(t, e.scope.netloc),
      )
    );
  }
  matchesNetloc(t, e) {
    const n = (t) => t.replace(/\.(?=(:\d+)?$)/, "").replace(/^www\./, ""),
      r = n(t),
      s = n(e);
    if (s.startsWith("*.")) {
      const t = s.slice(2);
      return r === t || r.endsWith("." + t);
    }
    return r === s;
  }
  async loadPermissions() {
    try {
      const t = await getStoredValue(StorageKey.PERMISSION_STORAGE);
      (this.permissions = t?.permissions ?? []), t || this.clearCache();
    } catch (t) {}
  }
  async savePermissions() {
    try {
      const t = {
        permissions: this.permissions,
      };
      await setStoredValue(StorageKey.PERMISSION_STORAGE, t);
    } catch (t) {}
  }
  setupStorageListener() {
    chrome.storage.onChanged.addListener((t, e) => {
      "local" === e &&
        t[StorageKey.PERMISSION_STORAGE] &&
        (void 0 === t[StorageKey.PERMISSION_STORAGE].newValue
          ? ((this.permissions = []), this.turnApprovedDomains.clear())
          : this.loadPermissions(),
        this.clearCache());
    });
  }
  clearCache() {
    this.cache.clear();
  }
  isLocalhostDomain(t) {
    const e = t.toLowerCase();
    return (
      "localhost" === e ||
      "127.0.0.1" === e ||
      "[::1]" === e ||
      "::1" === e ||
      e.startsWith("127.") ||
      e.endsWith(".localhost")
    );
  }
  isLocalhostUrl(t) {
    try {
      const e = new URL(t),
        n = e.protocol;
      return (
        ("http:" === n || "https:" === n) && this.isLocalhostDomain(e.hostname)
      );
    } catch {
      return !1;
    }
  }
};
function formatLocalDate(t = new Date()) {
  const e = String(t.getMonth() + 1).padStart(2, "0"),
    n = String(t.getDate()).padStart(2, "0");
  return `${t.getFullYear()}-${e}-${n}`;
}
function getScheduleSignature(t) {
  const e = t.specificTime ?? "";
  switch (t.repeatType) {
    case "once":
      return `once|${t.specificDate ?? ""}|${e}`;
    case "daily":
      return `daily|${e}`;
    case "weekly":
      return `weekly|${t.dayOfWeek ?? ""}|${e}`;
    case "monthly":
      return `monthly|${t.dayOfMonth ?? ""}|${e}`;
    case "annually":
      return `annually|${(t.monthAndDay ?? "")
        .split("-")
        .map((t) => String(Number(t)).padStart(2, "0"))
        .join("-")}|${e}`;
    default:
      return "none";
  }
}
function dateClampedToMonth(t, e, n, r, s) {
  const i = new Date(t, e + 1, 0).getDate();
  return new Date(t, e, Math.min(n, i), r, s);
}
function computeNextAlarm(t, e = new Date()) {
  if (!t.repeatType || "none" === t.repeatType || !t.specificTime) return null;
  const [n, r] = t.specificTime.split(":").map(Number),
    s = e.getFullYear(),
    i = e.getMonth();
  switch (t.repeatType) {
    case "once": {
      if (!t.specificDate) return null;
      const [s, i, o] = t.specificDate.split("-").map(Number),
        a = new Date(s, i - 1, o, n, r, 0, 0);
      return a > e
        ? {
            when: a.getTime(),
          }
        : null;
    }
    case "daily": {
      const t = new Date(e);
      return (
        t.setHours(n, r, 0, 0),
        t <= e && t.setDate(t.getDate() + 1),
        {
          when: t.getTime(),
          periodInMinutes: 1440,
        }
      );
    }
    case "weekly": {
      if (void 0 === t.dayOfWeek) return null;
      let s = (t.dayOfWeek - e.getDay() + 7) % 7;
      if (0 === s) {
        const t = new Date(e);
        t.setHours(n, r, 0, 0), t <= e && (s = 7);
      }
      const i = new Date(e);
      return (
        i.setDate(e.getDate() + s),
        i.setHours(n, r, 0, 0),
        {
          when: i.getTime(),
          periodInMinutes: 10080,
        }
      );
    }
    case "monthly": {
      if (!t.dayOfMonth) return null;
      let o = dateClampedToMonth(s, i, t.dayOfMonth, n, r);
      return (
        o <= e && (o = dateClampedToMonth(s, i + 1, t.dayOfMonth, n, r)),
        {
          when: o.getTime(),
        }
      );
    }
    case "annually": {
      if (!t.monthAndDay) return null;
      const [i, o] = t.monthAndDay.split("-").map(Number);
      let a = dateClampedToMonth(s, i - 1, o, n, r);
      return (
        a <= e && (a = dateClampedToMonth(s + 1, i - 1, o, n, r)),
        {
          when: a.getTime(),
        }
      );
    }
    default:
      return null;
  }
}
var SkillAlreadyExistsError = class extends Error {
    skillName;
    constructor(t) {
      super(`A skill named "${t}" already exists`),
        (this.skillName = t),
        (this.name = "SkillAlreadyExistsError");
    }
  },
  SkillLimitReachedError = class extends Error {
    constructor() {
      super("Account skill limit reached"),
        (this.name = "SkillLimitReachedError");
    }
  },
  SkillNameReservedError = class extends Error {
    skillName;
    constructor(t) {
      super(`The skill name "${t}" is reserved`),
        (this.skillName = t),
        (this.name = "SkillNameReservedError");
    }
  },
  SkillUnavailableError = class extends Error {
    permanent;
    constructor(t) {
      super(
        t
          ? "Skill instructions are permanently unavailable"
          : "Skill instructions are temporarily unavailable",
      ),
        (this.permanent = t),
        (this.name = "SkillUnavailableError");
    }
  },
  SkillApiError = class extends Error {
    status;
    errorCode;
    constructor(t, e) {
      super(`Skills API request failed: ${t}${e ? ` (${e})` : ""}`),
        (this.status = t),
        (this.errorCode = e),
        (this.name = "SkillApiError");
    }
  },
  SKILLS_SETTINGS_URL = "https://claude.ai/new#settings/customize-skills";
function getSkillSettingsUrl(t) {
  return `${SKILLS_SETTINGS_URL}/${encodeURIComponent(t)}`;
}
function isUserCustomAccountSkill(t) {
  return (
    "user" === t.creator_type &&
    "custom" === t.source &&
    "account" === t.partition_by &&
    !1 === t.is_shared
  );
}
async function buildSkillsRequestHeaders() {
  if (await DesktopManagedState.isDesktopManaged())
    throw new SkillApiError(403, "third_party_desktop_mode");
  const t = await getAccessTokenFromAnyContext();
  if (!t) throw new Error("No valid OAuth token available");
  if (await DesktopManagedState.isDesktopManaged())
    throw new SkillApiError(403, "third_party_desktop_mode");
  return {
    Authorization: `Bearer ${t}`,
    "Content-Type": "application/json",
    "anthropic-client-platform": "claude_browser_extension",
    "anthropic-client-version": chrome.runtime.getManifest().version,
  };
}
function getSkillsEndpointUrl(t, e) {
  return `${getEnvironmentConfig().apiBaseUrl}/api/oauth/organizations/${encodeURIComponent(t)}/skills/${e}`;
}
async function throwSkillApiError(t, e) {
  let n;
  try {
    n = await t.json();
  } catch {
    n = void 0;
  }
  const r =
      n?.error?.details?.error_code ?? n?.error?.error_code ?? n?.error_code,
    s = n?.error?.details?.skill_name ?? e;
  switch (r) {
    case "upload_skill_already_exists":
      throw new SkillAlreadyExistsError(s);
    case "upload_skill_limit_reached":
      throw new SkillLimitReachedError();
    case "upload_skill_name_reserved":
      throw new SkillNameReservedError(s);
    default:
      throw new SkillApiError(t.status, r);
  }
}
async function createSimpleSkill(t) {
  const e = await fetch(
    getSkillsEndpointUrl(t.organizationUuid, "create-simple-skill"),
    {
      method: "POST",
      headers: await buildSkillsRequestHeaders(),
      body: JSON.stringify({
        name: t.name,
        description: t.description,
        instructions: t.instructions,
      }),
    },
  );
  e.ok || (await throwSkillApiError(e, t.name));
  const n = await e.json();
  return {
    skillId: n.id,
    name: n.name,
  };
}
async function listSkills(t) {
  const e = await fetch(getSkillsEndpointUrl(t, "list-skills"), {
    method: "GET",
    headers: await buildSkillsRequestHeaders(),
  });
  e.ok || (await throwSkillApiError(e));
  const n = await e.json();
  return Array.isArray(n.skills) ? n.skills : [];
}
async function findCustomSkillByName(t, e) {
  return (await listSkills(t)).find(
    (t) => t.name === e && isUserCustomAccountSkill(t),
  );
}
async function fetchSkillInstructions(t, e) {
  const n = await fetch(
    getSkillsEndpointUrl(t, `${encodeURIComponent(e)}/instructions`),
    {
      method: "GET",
      headers: await buildSkillsRequestHeaders(),
    },
  );
  if (!n.ok) {
    if (404 === n.status) throw new SkillUnavailableError(!0);
    if (503 === n.status) throw new SkillUnavailableError(!1);
    await throwSkillApiError(n);
  }
  return (await n.json()).instructions;
}
function isRecurringSchedule(t) {
  return (
    !!t &&
    "object" == typeof t &&
    "string" == typeof t.id &&
    !!t.repeatType &&
    "none" !== t.repeatType
  );
}
var SKILL_MIGRATION_FLAG = "chrome_ext_skill_migration";
function vl(t) {
  return null;
}
function parseMigrationMode(t, e) {
  return (
    (n = t?.mode),
    ("off" === n || "dry_run" === n || "live" === n ? n : null) ?? "off"
  );
  var n;
}
function isSourcePromptCovered(t, e, n, r) {
  return (
    e.has(t) || (n?.scheduledSkipped ?? []).includes(t) || (r ?? []).includes(t)
  );
}
var SCHEDULE_ID_PREFIX = "sched_",
  SkillScheduleService = class {
    static isScheduleAlarm(t) {
      return t.startsWith(SCHEDULE_ID_PREFIX);
    }
    static async getAll() {
      return (await getStoredValue(StorageKey.SKILL_SCHEDULES)) ?? [];
    }
    static async getById(t) {
      return (await this.getAll()).find((e) => e.id === t);
    }
    static async create(t) {
      const e = await this.getAll(),
        n = {
          ...t,
          id: `${SCHEDULE_ID_PREFIX}${crypto.randomUUID()}`,
        };
      return e.push(n), await setStoredValue(StorageKey.SKILL_SCHEDULES, e), n;
    }
    static async update(t, e) {
      const n = await this.getAll(),
        r = n.findIndex((e) => e.id === t);
      if (-1 !== r)
        return (
          (n[r] = {
            ...n[r],
            ...e,
          }),
          await setStoredValue(StorageKey.SKILL_SCHEDULES, n),
          n[r]
        );
    }
    static async delete(t) {
      const e = await this.getAll(),
        n = e.find((e) => e.id === t);
      if (!n) return !1;
      if (n.sourceSavedPromptId) {
        const t = await this.getRetiredSources();
        t.includes(n.sourceSavedPromptId) ||
          (await setStoredValue(StorageKey.SKILL_SCHEDULE_RETIRED_SOURCES, [
            ...t,
            n.sourceSavedPromptId,
          ])),
          await chrome.alarms.clear(n.sourceSavedPromptId);
      }
      return (
        await chrome.alarms.clear(t),
        await setStoredValue(
          StorageKey.SKILL_SCHEDULES,
          e.filter((e) => e.id !== t),
        ),
        !0
      );
    }
    static async getRetiredSources() {
      return (
        (await getStoredValue(StorageKey.SKILL_SCHEDULE_RETIRED_SOURCES)) ?? []
      );
    }
    static async unretireSource(t) {
      const e = await this.getRetiredSources();
      e.includes(t) &&
        (await setStoredValue(
          StorageKey.SKILL_SCHEDULE_RETIRED_SOURCES,
          e.filter((e) => e !== t),
        ));
    }
    static bodyOf(t) {
      return (function (t) {
        const e = t.startsWith("\ufeff") ? t.slice(1) : t,
          n = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(e);
        return n ? e.slice(n[0].length) : e;
      })(t ?? "").trim();
    }
    static needsReview(t) {
      const e = (t.approvedInstructions ?? "").trim();
      return !e || e !== (t.cachedInstructions ?? "").trim();
    }
    static async revokeApprovalBySourcePromptId(t) {
      const e = await this.getAll();
      let n = !1;
      for (const r of e)
        r.sourceSavedPromptId === t &&
          r.approvedInstructions &&
          ((r.approvedInstructions = void 0), (n = !0));
      n && (await setStoredValue(StorageKey.SKILL_SCHEDULES, e));
    }
    static async deleteBySourcePromptId(t) {
      const e = await this.getAll(),
        n = e.filter((e) => e.sourceSavedPromptId === t);
      for (const r of n) await chrome.alarms.clear(r.id);
      return (
        n.length &&
          (await setStoredValue(
            StorageKey.SKILL_SCHEDULES,
            e.filter((e) => e.sourceSavedPromptId !== t),
          )),
        n.length
      );
    }
    static async syncFromSavedPrompt(t, e) {
      if (!t.repeatType || "none" === t.repeatType)
        return void (await this.deleteBySourcePromptId(t.id));
      e && (await this.unretireSource(t.id));
      const n = (await this.getAll()).filter(
        (e) => e.sourceSavedPromptId === t.id,
      );
      if (!n.length) return;
      const r = new Set((await chrome.alarms.getAll()).map((t) => t.name));
      for (const s of n) {
        const e = await this.update(s.id, {
          repeatType: t.repeatType,
          specificTime: t.specificTime,
          specificDate: t.specificDate,
          dayOfWeek: t.dayOfWeek,
          dayOfMonth: t.dayOfMonth,
          monthAndDay: t.monthAndDay,
          url: t.url,
          model: t.model,
        });
        e && r.has(s.id) && (await this.updateAlarmForSchedule(e));
      }
    }
    static async refreshInstructionsCache(t, e) {
      const n = await this.getById(e);
      if (!n) return;
      const r = async (t = n.skillId, r = "skill_deleted") => (
        await chrome.alarms.clear(e),
        this.update(e, {
          skillId: t,
          disabledReason: r,
        })
      );
      let s;
      try {
        const e = await findCustomSkillByName(t, n.skillName);
        if (!e) return r();
        if (!1 === e.enabled) return r(e.id, "skill_unavailable");
        s = e.id;
      } catch {
        return n;
      }
      try {
        const r = this.bodyOf(await fetchSkillInstructions(t, s)),
          i = await this.update(e, {
            skillId: s,
            cachedInstructions: r,
            cachedAt: Date.now(),
            disabledReason: void 0,
          });
        return (
          n.disabledReason && i && (await this.updateAlarmForSchedule(i)), i
        );
      } catch (i) {
        return i instanceof SkillUnavailableError && i.permanent
          ? r(s)
          : s !== n.skillId
            ? this.update(e, {
                skillId: s,
              })
            : n;
      }
    }
    static isArmable(t) {
      return (
        !t.disabledReason &&
        !t.paused &&
        "none" !== t.repeatType &&
        !!t.specificTime
      );
    }
    static async updateAlarmForSchedule(t) {
      if ((await chrome.alarms.clear(t.id), !this.isArmable(t))) return;
      const e = computeNextAlarm(t);
      e && (await chrome.alarms.create(t.id, e));
    }
    static async syncAllAlarms() {
      const [t, e] = await Promise.all([this.getAll(), chrome.alarms.getAll()]),
        n = new Set(e.map((t) => t.name));
      for (const s of t) {
        const t = this.isArmable(s);
        if (t && !n.has(s.id))
          try {
            await this.updateAlarmForSchedule(s);
          } catch (r) {}
        else !t && n.has(s.id) && (await chrome.alarms.clear(s.id));
      }
    }
    static async clearForAccountSwitch(t) {
      (await this.isCutoverApplied()) && (await t()),
        await this.clearAllAlarms(),
        await removeStoredKeys([
          StorageKey.SKILL_SCHEDULES,
          StorageKey.SKILL_MIGRATION_DONE,
          StorageKey.SKILL_CUTOVER_APPLIED,
          StorageKey.SKILL_SCHEDULE_UNLINKED_DISMISSED,
          StorageKey.PENDING_SCHEDULED_TASK,
        ]);
    }
    static async clearAllAlarms() {
      for (const t of await chrome.alarms.getAll())
        this.isScheduleAlarm(t.name) && (await chrome.alarms.clear(t.name));
    }
    static async isSourcePromptCovered(t) {
      const { linked: e, sentinel: n, retired: r } = await this.loadCoverage();
      return isSourcePromptCovered(t, e, n, r);
    }
    static async loadCoverage() {
      const [t, e, n] = await Promise.all([
        this.getAll(),
        getStoredValue(StorageKey.SKILL_MIGRATION_DONE),
        this.getRetiredSources(),
      ]);
      return {
        linked: new Set(t.map((t) => t.sourceSavedPromptId).filter((t) => !!t)),
        sentinel: e,
        retired: n,
      };
    }
    static async isCutoverApplied() {
      return (await getStoredValue(StorageKey.SKILL_CUTOVER_APPLIED)) ?? !1;
    }
    static async reconcileAlarms(t, e, n) {
      const r = await this.isCutoverApplied();
      if ("unknown" === t) return r;
      if ("inactive" === t)
        return (
          await this.clearAllAlarms(),
          r &&
            (await n(),
            await setStoredValue(StorageKey.SKILL_CUTOVER_APPLIED, !1)),
          !1
        );
      r || (await setStoredValue(StorageKey.SKILL_CUTOVER_APPLIED, !0)),
        await this.syncAllAlarms();
      const { linked: s, sentinel: i, retired: o } = await this.loadCoverage();
      for (const a of e)
        isRecurringSchedule(a) &&
          isSourcePromptCovered(a.id, s, i, o) &&
          (await chrome.alarms.clear(a.id));
      return !0;
    }
  },
  SavedPromptsService = class {
    static async getAllPrompts() {
      return (await getStoredValue(StorageKey.SAVED_PROMPTS)) || [];
    }
    static async getPromptById(t) {
      return (await this.getAllPrompts()).find((e) => e.id === t);
    }
    static async getPromptByCommand(t) {
      return (await this.getAllPrompts()).find((e) => e.command === t);
    }
    static async savePrompt(t) {
      const e = await this.getAllPrompts();
      if (t.command && e.find((e) => e.command === t.command))
        throw new Error(`/${t.command} is already in use`);
      const n = {
        ...t,
        id: `prompt_${Date.now()}`,
        createdAt: t.createdAt || Date.now(),
        usageCount: t.usageCount || 0,
      };
      return (
        e.push(n),
        await setStoredValue(StorageKey.SAVED_PROMPTS, e),
        n.repeatType &&
          "none" !== n.repeatType &&
          (await this.updateAlarmForPrompt(n)),
        n
      );
    }
    static async updatePrompt(t, e, n) {
      const r = await this.getAllPrompts(),
        s = r.findIndex((e) => e.id === t);
      if (-1 === s) return;
      if (
        e.command &&
        e.command !== r[s].command &&
        r.find((t) => t.command === e.command)
      )
        throw new Error(`/${e.command} is already in use`);
      const i = r[s];
      (r[s] = {
        ...r[s],
        ...e,
      }),
        await setStoredValue(StorageKey.SAVED_PROMPTS, r);
      const o = r[s];
      i.prompt !== o.prompt &&
        (await SkillScheduleService.revokeApprovalBySourcePromptId(t));
      const a = getScheduleSignature(i) !== getScheduleSignature(o);
      return (
        a && (await this.updateAlarmForPrompt(o)),
        (!a && i.url === o.url && i.model === o.model) ||
          n ||
          (await SkillScheduleService.syncFromSavedPrompt(o, a)),
        r[s]
      );
    }
    static async deletePrompt(t) {
      const e = await this.getAllPrompts(),
        n = e.find((e) => e.id === t),
        r = e.filter((e) => e.id !== t);
      return (
        r.length !== e.length &&
        (n?.repeatType &&
          "none" !== n.repeatType &&
          (await chrome.alarms.clear(t)),
        await SkillScheduleService.deleteBySourcePromptId(t),
        await setStoredValue(StorageKey.SAVED_PROMPTS, r),
        !0)
      );
    }
    static async recordPromptUsage(t) {
      const e = await this.getAllPrompts(),
        n = e.find((e) => e.id === t);
      n &&
        ((n.lastUsedAt = Date.now()),
        (n.usageCount = (n.usageCount || 0) + 1),
        await setStoredValue(StorageKey.SAVED_PROMPTS, e));
    }
    static async searchPrompts(t) {
      const e = await this.getAllPrompts(),
        n = t.toLowerCase();
      return e.filter(
        (t) =>
          t.prompt.toLowerCase().includes(n) ||
          (t.command && t.command.toLowerCase().includes(n)),
      );
    }
    static async exportPrompts(t) {
      const e = await this.getAllPrompts(),
        n = t ? e.filter((e) => t.includes(e.id)) : e;
      return JSON.stringify(n, null, 2);
    }
    static async importPrompts(t, e = !1) {
      const n = JSON.parse(t),
        r = e ? [] : await this.getAllPrompts(),
        s = n.map((t) => ({
          ...t,
          id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          usageCount: 0,
          lastUsedAt: void 0,
        })),
        i = [...r, ...s].filter((t) => t.command).map((t) => t.command),
        o = new Set(i);
      if (i.length !== o.size)
        throw new Error("Import contains duplicate command shortcuts");
      const a = [...r, ...s];
      return await setStoredValue(StorageKey.SAVED_PROMPTS, a), s.length;
    }
    static async updateAlarmForPrompt(t) {
      const e = t.id;
      await chrome.alarms.clear(e);
      const n = computeNextAlarm(t);
      n && (await chrome.alarms.create(e, n));
    }
    static async updateNextRunTimes() {
      const t = await this.getAllPrompts(),
        e = await chrome.alarms.getAll();
      let n = !1;
      for (const r of t)
        if (r.repeatType && "none" !== r.repeatType) {
          const t = e.find((t) => t.name === r.id)?.scheduledTime;
          r.nextRun !== t && ((r.nextRun = t), (n = !0));
        } else r.nextRun && ((r.nextRun = void 0), (n = !0));
      n && (await setStoredValue(StorageKey.SAVED_PROMPTS, t));
    }
  };
export {
  handleOAuthCallback as $,
  parseTokenOrg as $t,
  PermissionToolType as A,
  remapTabGroupId as An,
  getDebuggerAttachTimeoutMs as At,
  CLAUDE_BROWSER_TOOL_SEGMENT as B,
  addFeatureUpdateListener as Bt,
  ju as C,
  isKnownTransportType as Cn,
  be as Ct,
  PermissionDuration as D,
  setSessionTabGroupId as Dn,
  $e as Dt,
  DEFAULT_PERMISSION_MODE as E,
  isValidTabGroupId as En,
  Te as Et,
  stripInvisibleChars as F,
  preloadWithDependencies as Fn,
  loadLocalCicOverrides as Ft,
  initSentry as G,
  peekFeatureValue as Gt,
  COMPUTER_TOOL_PREFIX as H,
  refreshFeatures as Ht,
  sanitizeMultilineText as I,
  isFeatureStoreReady as It,
  checkAndRefreshOAuth as J,
  useHasFeaturePayload as Jt,
  captureException as K,
  useFeatureEnabled as Kt,
  setPendingNavigationChecker as L,
  getFeatureObject as Lt,
  INVISIBLE_CHARS_REGEX as M,
  getEnvironmentConfig as Mn,
  isFocusEmulationInWorker as Mt,
  DEFAULT_IGNORABLE_REGEX as N,
  SvgIconFrame as Nn,
  isFocusEmulationEnabled as Nt,
  PERMISSION_MODES as O,
  getSessionKey as On,
  areLocalOverridesLoaded as Ot,
  getHostnameFromUrl as P,
  classNames as Pn,
  isHiddenTabDrawEnabled as Pt,
  fetchAccountUuid as Q,
  DesktopManagedState as Qt,
  verifyTabDomainUnchanged as R,
  getFeatureValue as Rt,
  getUrlHost as S,
  clearScreenshotCache as Sn,
  Be as St,
  PointerClickIcon as T,
  countSessionsWithTabGroup as Tn,
  Ne as Tt,
  REMOTE_DEVICES_SERVER as U,
  clearStoredKeys as Ut,
  REMOTE_BROWSER_TOOL_PREFIX as V,
  refreshFeaturesOnManagedChange as Vt,
  REMOTE_DEVICE_TOOL_NAMES as W,
  FeatureProvider as Wt,
  getValidAccessToken as X,
  OAUTH_PROFILE_PATH as Xt,
  signOut as Y,
  useFeaturesReady as Yt,
  getAccessTokenFromAnyContext as Z,
  apiClient as Zt,
  listSkills as _,
  removeStoredKeys as _n,
  buildShortcutDeletedProps as _t,
  vl as a,
  isMeaningfulIdentityChange as an,
  resetAnalyticsIdentity as at,
  trackGrantRevoked as b,
  setStoredValues as bn,
  CLAUDE_AI_ORIGIN as bt,
  SkillAlreadyExistsError as c,
  waitForFirstPosture as cn,
  identifyUser as ct,
  SkillNameReservedError as d,
  identityMatchesAwaiting as dn,
  trackEvent as dt,
  GET_POSTURE_MESSAGE as en,
  startOAuthLogin as et,
  getSkillSettingsUrl as f,
  addPostureChangeListener as fn,
  initEventLogger as ft,
  isUserCustomAccountSkill as g,
  getStoredValues as gn,
  buildShortcutCreatedProps as gt,
  fetchSkillInstructions as h,
  getStoredValue as hn,
  buildTaskSuccessProps as ht,
  parseMigrationMode as i,
  isPostureManaged as in,
  ensureAnalyticsInitialized as it,
  SvgIconBase as j,
  createBackoffTimer as jn,
  getHiddenTabDrawMs as jt,
  getPermissionVerbPhrase as k,
  resolveSessionTabGroupId as kn,
  getCdpCommandTimeoutMs as kt,
  SkillApiError as l,
  readPosture as ln,
  trackPageView as lt,
  findCustomSkillByName as m,
  StorageKey as mn,
  buildTaskFailureProps as mt,
  SkillScheduleService as n,
  initPostureInputs as nn,
  migrateLocalTokensToSession as nt,
  isRecurringSchedule as o,
  addPostureInterceptor as on,
  logExtensionEvent as ot,
  createSimpleSkill as p,
  PERMISSION_STORAGE_KEYS as pn,
  getOrCreateAnonymousId as pt,
  captureMessage as q,
  useFeatureValue as qt,
  SKILL_MIGRATION_FLAG as r,
  getCurrentPosture as rn,
  bumpIdentityEpoch as rt,
  SKILLS_SETTINGS_URL as s,
  onPostureStorageChange as sn,
  identifyFromProfile as st,
  SavedPromptsService as t,
  enqueuePostureUpdate as tn,
  isExpectedSignInState as tt,
  SkillLimitReachedError as u,
  areStringArraysEqual as un,
  resetEventLogger as ut,
  formatLocalDate as v,
  restrictLocalStorageToTrustedContexts as vn,
  buildShortcutInvokedProps as vt,
  PointerIcon as w,
  screenshotCache as wn,
  Le as wt,
  trackGrantWritten as x,
  getStorageAreaName as xn,
  probeClaudeAiSession as xt,
  PermissionManager as y,
  setStoredValue as yn,
  buildShortcutUpdatedProps as yt,
  verifyTabOrigin as z,
  isFeatureEnabledAsync as zt,
};
