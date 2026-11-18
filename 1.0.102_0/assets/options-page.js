/**
 * @readable-header
 * FILE:      assets/options-page.js
 * WAS:       options-Cy_ggWPM.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     claus
 * WHAT:      React options page with Permissions, Prompts (shortcuts), Scheduled and keyboard-shortcut tabs.
 * USED BY:   assets/options-html-entry.js (static import)
 *            options.html (html tag)
 * NEEDS:     assets/auth-and-saved-prompts.js (static import)
 *            assets/i18n.js (static import)
 *            assets/react-vendor-and-language-list.js (static import)
 *            assets/scheduling-fields.js (static import)
 *            assets/skill-text.js (static import)
 *            options.html (named in code)
 */
/**
 * options (extension options page: chrome-extension://<id>/options.html)
 *
 * A React page with four tabs, selected through the URL hash:
 *   #permissions  PermissionsTab          notifications toggle, microphone, approved sites
 *   #prompts      ShortcutsTab            saved prompt "shortcuts" (/command prompts)
 *   #scheduled    ScheduledTab            skills run on a schedule (only when skills mode is on)
 *   #options      KeyboardShortcutSettings  shows/opens the keyboard-shortcut setting
 *
 * It also shows a microphone-permission modal when opened with
 * #<tab>?requestMicrophone=true&returnTabId=<id> (used by workflow recording).
 *
 * This file has no exports. It only imports shared chunks (React runtime,
 * i18n, UI components, storage/permission/skill helpers) and renders itself
 * into #root at the bottom of the file.
 *
 * WHAT THIS FILE TOUCHES (read this to judge safety):
 *
 *   Network:
 *     No fetch/XMLHttpRequest/WebSocket in this file. Network access happens
 *     only inside imported helpers: fetchSkills / findSkillByName /
 *     fetchSkillContent (SavedPromptsService chunk, used by the scheduled-task
 *     dialog, passed the signed-in organization UUID) and startLogin. Those
 *     helper modules are not covered by this file; read them separately.
 *     The page links out (target=_blank) to SKILLS_URL and getSkillEditUrl().
 *
 *   Messages to the service worker (chrome.runtime.sendMessage):
 *     { type: "RUN_SKILL_SCHEDULE_NOW", scheduleId }   "Run now" on a schedule
 *     { type: "logout" }                               "Log out" button
 *
 *   chrome.storage:
 *     Reads/removes keys through getStorageItem / removeStorageItem and
 *     useStorageValue using the StorageKeys enum: ANTHROPIC_API_KEY (read only
 *     to decide whether to show "API Key Mode"; the key is not displayed or
 *     sent from here), PENDING_SCHEDULED_TASK, NOTIFICATIONS_ENABLED,
 *     SKILL_* keys. Listens to chrome.storage.onChanged for the local area.
 *
 *   Other chrome.* APIs:
 *     chrome.tabs.create   opens chrome://settings/content/siteDetails?site=...
 *                          and chrome://extensions/shortcuts
 *     chrome.tabs.update / getCurrent / remove   close this tab after granting the microphone
 *     chrome.tabs.query    reads the active tab's URL origin (http/https only)
 *                          to pre-fill the URL field of a new shortcut
 *     chrome.commands.getAll   reads the "toggle-side-panel" shortcut
 *     chrome.alarms.getAll     reads scheduled-task alarm times
 *     chrome.runtime.id        used to build the Chrome settings URL
 *
 *   Permissions:
 *     PermissionManager (PermissionsTab) lists and revokes the per-site
 *     permissions the user previously approved ("Revoke" button).
 *     navigator.mediaDevices.getUserMedia({audio:true}) asks for microphone
 *     access; the stream's tracks are stopped immediately (no recording here).
 *
 *   Analytics:
 *     analytics.track("claude_chrome.settings.microphone_enabled", { timestamp })
 *     and trackPermissionRevoked(...) when a site permission is revoked.
 */
import {
  a as requireJsxRuntime,
  o as requireReact,
  u as toEsModule,
} from "./react-vendor-and-language-list.js";
import {
  a as requireReactDomClient,
  i as useIntl,
  r as FormattedMessage,
} from "./i18n.js";
import {
  $ as MenuItem,
  $n as Icon,
  At as WarningIcon,
  C as CloseIcon,
  It as Button,
  J as useStorageValue,
  Mt as EditIcon,
  Nt as MoreIcon,
  Pt as ClockIcon,
  Q as DropdownMenu,
  S as FieldError,
  St as useAuth,
  Tt as Spinner,
  X as ModalFooter,
  Y as Modal,
  b as Textarea,
  bt as PageProviders,
  i as useSkillsMode,
  it as initPage,
  jt as TrashIcon,
  kt as SmallCloseIcon,
  n as Select,
  o as EMPTY_SCHEDULE_FIELDS,
  q as createIcon,
  s as useScheduleForm,
  t as ScheduleFields,
  x as TextInput,
  xt as useAnalytics,
} from "./scheduling-fields.js";
import {
  F as sanitizeLabel,
  I as sanitizeText,
  Nn as IconBase,
  Pn as classNames,
  _ as fetchSkills,
  _n as removeStorageItem,
  b as trackPermissionRevoked,
  et as startLogin,
  f as getSkillEditUrl,
  g as isSchedulableSkill,
  h as fetchSkillContent,
  hn as getStorageItem,
  m as findSkillByName,
  mn as StorageKeys,
  n as skillScheduleStore,
  o as isScheduledPrompt,
  s as SKILLS_URL,
  t as savedPromptsService,
  v as getTodayDateString,
  y as PermissionManager,
} from "./auth-and-saved-prompts.js";
import { t as summarizeSkillText } from "./skill-text.js";
import { SETTINGS_DEFAULTS, loadSettings, saveSettings } from "./jev/settings.js";
/**
 * JSX runtime (jsx / jsxs / Fragment) from the shared constants chunk.
 */
var jsxRuntime = requireJsxRuntime();
/**
 * Icons (inline SVG paths) used by this page.
 */
var ExternalLinkIcon = (e) =>
  (0, jsxRuntime.jsx)(IconBase, {
    ...e,
    children: (0, jsxRuntime.jsx)("path", {
      d: "M14.5 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6.707l-8.147 8.147a.5.5 0 0 1-.707-.707L13.293 6H7.5a.5.5 0 0 1 0-1z",
    }),
  });
var CheckCircleIcon = (e) =>
  (0, jsxRuntime.jsx)(IconBase, {
    ...e,
    children: (0, jsxRuntime.jsx)("path", {
      d: "M10 2.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15m0 1a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m2.61 3.688a.5.5 0 0 1 .78.625l-4 5a.5.5 0 0 1-.661.107l-.083-.066-2-2-.064-.079a.5.5 0 0 1 .693-.693l.079.064 1.604 1.605z",
    }),
  });
var PauseIcon = (e) =>
  (0, jsxRuntime.jsx)(IconBase, {
    ...e,
    children: (0, jsxRuntime.jsx)("path", {
      fillRule: "evenodd",
      d: "M7.5 3A1.5 1.5 0 0 1 9 4.5v11A1.5 1.5 0 0 1 7.5 17h-3A1.5 1.5 0 0 1 3 15.5v-11A1.5 1.5 0 0 1 4.5 3zm-3 1a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5zm11-1A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 12.5 3zm-3 1a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5z",
      clipRule: "evenodd",
    }),
  });
var PlayIcon = (e) =>
  (0, jsxRuntime.jsx)(IconBase, {
    ...e,
    children: (0, jsxRuntime.jsx)("path", {
      d: "M4 4.047A1.5 1.5 0 0 1 6.29 2.77l9.603 5.954a1.5 1.5 0 0 1 0 2.55L6.29 17.227a1.5 1.5 0 0 1-2.275-1.06L4 15.953zm1.764-.425A.5.5 0 0 0 5 4.047v11.906l.005.072a.5.5 0 0 0 .759.353l9.601-5.953a.5.5 0 0 0 0-.85z",
    }),
  });
/**
 * Lucide-style icons built with createIcon().
 */
var KeyboardIcon = createIcon("keyboard", [
  [
    "path",
    {
      d: "M10 8h.01",
      key: "1r9ogq",
    },
  ],
  [
    "path",
    {
      d: "M12 12h.01",
      key: "1mp3jc",
    },
  ],
  [
    "path",
    {
      d: "M14 8h.01",
      key: "1primd",
    },
  ],
  [
    "path",
    {
      d: "M16 12h.01",
      key: "1l6xoz",
    },
  ],
  [
    "path",
    {
      d: "M18 8h.01",
      key: "emo2bl",
    },
  ],
  [
    "path",
    {
      d: "M6 8h.01",
      key: "x9i8wu",
    },
  ],
  [
    "path",
    {
      d: "M7 16h10",
      key: "wp8him",
    },
  ],
  [
    "path",
    {
      d: "M8 12h.01",
      key: "czm47f",
    },
  ],
  [
    "rect",
    {
      width: "20",
      height: "16",
      x: "2",
      y: "4",
      rx: "2",
      key: "18n3k1",
    },
  ],
]);
var LogOutIcon = createIcon("log-out", [
  [
    "path",
    {
      d: "m16 17 5-5-5-5",
      key: "1bji2h",
    },
  ],
  [
    "path",
    {
      d: "M21 12H9",
      key: "dn1m92",
    },
  ],
  [
    "path",
    {
      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
      key: "1uf3rs",
    },
  ],
]);
var UserIcon = createIcon("user", [
  [
    "path",
    {
      d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
      key: "975kel",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "7",
      r: "4",
      key: "17ys0d",
    },
  ],
]);
/**
 * React DOM client (createRoot) and React itself.
 */
var ReactDomClient = toEsModule(requireReactDomClient(), 1);
var React = toEsModule(requireReact(), 1);
/**
 * Modal asking for microphone access. Shown when the URL hash contains requestMicrophone=true.
 * Once permission is "granted" it closes this tab and returns to returnTabId (if given).
 */
var MicrophonePermissionModal = ({ isOpen, returnTabId, onClose }) => {
  const intl = useIntl(),
    [permissionState, setPermissionState] = (0, React.useState)("unknown"),
    [isRequesting, setIsRequesting] = (0, React.useState)(!1),
    [errorMessage, setErrorMessage] = (0, React.useState)(null),
    [isClosing, setIsClosing] = (0, React.useState)(!1),
    returnToWorkflow = (0, React.useCallback)(() => {
      setIsClosing(!0),
        returnTabId
          ? chrome.tabs.update(
              returnTabId,
              {
                active: !0,
              },
              () => {
                chrome.tabs.getCurrent((e) => {
                  e?.id && chrome.tabs.remove(e.id);
                });
              },
            )
          : chrome.tabs.getCurrent((e) => {
              e?.id && chrome.tabs.remove(e.id);
            });
    }, [returnTabId]),
    checkPermission = (0, React.useCallback)(async () => {
      try {
        const e = await navigator.permissions.query({
          name: "microphone",
        });
        setPermissionState(e.state),
          e.addEventListener("change", () => {
            const s = e.state;
            setPermissionState(s), "granted" === s && returnToWorkflow();
          });
      } catch (e) {
        setPermissionState("unknown");
      }
    }, [returnToWorkflow]);
  (0, React.useEffect)(() => {
    isOpen && checkPermission();
  }, [isOpen, checkPermission]);
  const handleClose = () => {
    onClose();
  };
  return isOpen
    ? (0, jsxRuntime.jsx)("div", {
        className:
          "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 " +
          (isClosing ? "opacity-0" : "opacity-100"),
        children: (0, jsxRuntime.jsxs)("div", {
          className:
            "bg-bg-000 rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-200 " +
            (isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"),
          children: [
            (0, jsxRuntime.jsxs)("div", {
              className: "flex items-center justify-between px-6 pt-6",
              children: [
                (0, jsxRuntime.jsx)("div", {
                  className: "w-8",
                }),
                " ",
                (0, jsxRuntime.jsx)("button", {
                  onClick: handleClose,
                  className: "p-2 rounded-lg hover:bg-bg-200 transition-colors",
                  "aria-label": intl.formatMessage({
                    defaultMessage: "Close",
                    id: "rbrahOGMC3",
                  }),
                  children: (0, jsxRuntime.jsx)(CloseIcon, {
                    size: 16,
                    className: "text-text-300",
                  }),
                }),
              ],
            }),
            (0, jsxRuntime.jsxs)("div", {
              className: "px-6 pb-6 pt-2 text-center",
              children: [
                (0, jsxRuntime.jsx)("div", {
                  className:
                    "w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100/10 flex items-center justify-center",
                  children: (0, jsxRuntime.jsx)(Icon, {
                    name: "MicrophoneFilled",
                    size: "xxl",
                    className: "text-brand-100",
                  }),
                }),
                (0, jsxRuntime.jsx)("h2", {
                  className: "font-xl-bold text-text-100 mb-2",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Enable microphone access",
                    id: "StB9n+uYO4",
                  }),
                }),
                (0, jsxRuntime.jsx)("p", {
                  className: "text-text-300 font-base mb-6",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage:
                      "Claus needs microphone access to hear your voice narration while you demonstrate workflows. When prompted, select <strong>Allow while visiting the site</strong> to enable voice narration.",
                    id: "C8CF1Igl7Q",
                    values: {
                      strong: (e) =>
                        (0, jsxRuntime.jsx)("span", {
                          className: "font-semibold text-text-200",
                          children: e,
                        }),
                    },
                  }),
                }),
                "granted" === permissionState
                  ? (0, jsxRuntime.jsxs)("div", {
                      className:
                        "mb-6 p-4 bg-success-100/10 border border-success-100/20 rounded-xl",
                      children: [
                        (0, jsxRuntime.jsxs)("div", {
                          className:
                            "flex items-center justify-center gap-2 text-success-100",
                          children: [
                            (0, jsxRuntime.jsx)("svg", {
                              className: "w-5 h-5",
                              fill: "none",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "2",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              children: (0, jsxRuntime.jsx)("path", {
                                d: "M5 13l4 4L19 7",
                              }),
                            }),
                            (0, jsxRuntime.jsx)("span", {
                              className: "font-large",
                              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage: "Microphone access granted",
                                id: "Ymx8APRi1X",
                              }),
                            }),
                          ],
                        }),
                        (0, jsxRuntime.jsx)("p", {
                          className: "text-text-300 font-base-sm mt-2",
                          children: (0, jsxRuntime.jsx)(FormattedMessage, {
                            defaultMessage: "Returning to your workflow...",
                            id: "BHzoQdwFnu",
                          }),
                        }),
                      ],
                    })
                  : "denied" === permissionState
                    ? (0, jsxRuntime.jsx)("div", {
                        className:
                          "mb-6 p-4 bg-danger-000/10 border border-danger-000/20 rounded-xl",
                        children: (0, jsxRuntime.jsx)("p", {
                          className: "font-base text-danger-000",
                          children: (0, jsxRuntime.jsx)(FormattedMessage, {
                            defaultMessage:
                              "Microphone access was denied. You can either try again or <link>open Chrome settings</link> to enable microphone access.",
                            id: "e2DtORRpyx",
                            values: {
                              link: (e) =>
                                (0, jsxRuntime.jsx)("button", {
                                  onClick: () => {
                                    const e = `chrome://settings/content/siteDetails?site=chrome-extension%3A%2F%2F${chrome.runtime.id}%2F`;
                                    chrome.tabs.create({
                                      url: e,
                                    });
                                  },
                                  className: "underline hover:no-underline",
                                  children: e,
                                }),
                            },
                          }),
                        }),
                      })
                    : null,
                errorMessage &&
                  (0, jsxRuntime.jsx)("div", {
                    className:
                      "mb-6 p-4 bg-danger-000/10 border border-danger-000/20 rounded-xl",
                    children: (0, jsxRuntime.jsx)("p", {
                      className: "font-base text-danger-000",
                      children: errorMessage,
                    }),
                  }),
                "granted" !== permissionState &&
                  "denied" !== permissionState &&
                  (0, jsxRuntime.jsxs)("button", {
                    onClick: async () => {
                      setIsRequesting(!0), setErrorMessage(null);
                      try {
                        (
                          await navigator.mediaDevices.getUserMedia({
                            audio: !0,
                          })
                        )
                          .getTracks()
                          .forEach((e) => e.stop()),
                          "granted" ===
                          (
                            await navigator.permissions.query({
                              name: "microphone",
                            })
                          ).state
                            ? returnToWorkflow()
                            : (setIsRequesting(!1),
                              setErrorMessage(
                                'You selected "Allow this time" which doesn\'t persist. Please click the button again and select "Allow while visiting the site" to enable voice narration.',
                              ));
                      } catch (e) {
                        setIsRequesting(!1),
                          e instanceof DOMException
                            ? "NotAllowedError" === e.name
                              ? await checkPermission()
                              : "NotFoundError" === e.name
                                ? setErrorMessage(
                                    "No microphone found. Please connect a microphone and try again.",
                                  )
                                : setErrorMessage(`Error: ${e.message}`)
                            : e instanceof Error
                              ? setErrorMessage(`Error: ${e.message}`)
                              : setErrorMessage("An unknown error occurred");
                      }
                    },
                    disabled: isRequesting,
                    className:
                      "w-full px-6 py-3 bg-brand-100 text-oncolor-100 rounded-xl hover:bg-brand-100/90 transition-all font-large disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                    children: [
                      (0, jsxRuntime.jsx)(Icon, {
                        name: "MicrophoneFilled",
                        size: "md",
                      }),
                      isRequesting
                        ? (0, jsxRuntime.jsx)(FormattedMessage, {
                            defaultMessage: "Requesting access...",
                            id: "kDYzre2KOj",
                          })
                        : (0, jsxRuntime.jsx)(FormattedMessage, {
                            defaultMessage: "Allow microphone access",
                            id: "83itGujdwB",
                          }),
                    ],
                  }),
                (0, jsxRuntime.jsx)("button", {
                  onClick: handleClose,
                  className:
                    "mt-4 text-text-300 hover:text-text-200 font-base-sm transition-colors",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Skip for now",
                    id: "WYzHAIKZxl",
                  }),
                }),
              ],
            }),
          ],
        }),
      })
    : null;
};
/**
 * "Options" tab: shows the current "toggle-side-panel" keyboard shortcut and a
 * button that opens chrome://extensions/shortcuts to change it.
 */
var KeyboardShortcutSettings = () => {
  const [shortcut, setShortcut] = (0, React.useState)();
  return (
    (0, React.useEffect)(() => {
      const e = () => {
        chrome.commands.getAll((e) => {
          const t = e.find((e) => "toggle-side-panel" === e.name);
          setShortcut(t?.shortcut);
        });
      };
      e();
      const t = () => {
        "visible" === document.visibilityState && e();
      };
      return (
        document.addEventListener("visibilitychange", t),
        () => document.removeEventListener("visibilitychange", t)
      );
    }, []),
    (0, jsxRuntime.jsx)("div", {
      className: "space-y-6",
      children: (0, jsxRuntime.jsxs)("div", {
        className:
          "bg-bg-100 border border-border-300 rounded-xl px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8",
        children: [
          (0, jsxRuntime.jsx)("h3", {
            className: "text-text-100 font-xl-bold",
            children: (0, jsxRuntime.jsx)(FormattedMessage, {
              defaultMessage: "Keyboard shortcut",
              id: "rHyMT1rizz",
            }),
          }),
          (0, jsxRuntime.jsx)("p", {
            className: "text-text-300 font-base mt-2 mb-6",
            children: (0, jsxRuntime.jsx)(FormattedMessage, {
              defaultMessage:
                "Configure the keyboard shortcut used to open Claus.",
              id: "CcjsWsUTac",
            }),
          }),
          (0, jsxRuntime.jsxs)("div", {
            className: "flex items-center justify-between py-4",
            children: [
              (0, jsxRuntime.jsxs)("div", {
                className: "flex-1",
                children: [
                  (0, jsxRuntime.jsx)("div", {
                    className: "font-large text-text-100",
                    children: (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage: "Open side panel",
                      id: "MihpzFiE1j",
                    }),
                  }),
                  (0, jsxRuntime.jsx)("div", {
                    className: "text-text-400 font-base-sm mt-1",
                    children: shortcut
                      ? (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage: "Current shortcut: {shortcut}",
                          id: "2x8xsy/VJk",
                          values: {
                            shortcut: (0, jsxRuntime.jsx)("kbd", {
                              className:
                                "px-1.5 py-0.5 bg-bg-300 border border-border-300 rounded-sm text-text-200 font-mono text-xs",
                              children: shortcut,
                            }),
                          },
                        })
                      : (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage: "No shortcut configured",
                          id: "7/3PxH3ltB",
                        }),
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)("button", {
                onClick: () => {
                  chrome.tabs.create({
                    url: "chrome://extensions/shortcuts",
                  });
                },
                className:
                  "flex items-center gap-2 px-4 py-2 text-text-200 hover:bg-bg-200 hover:text-text-100 border border-border-300 rounded-lg transition-all font-base",
                children: [
                  (0, jsxRuntime.jsx)(KeyboardIcon, {
                    className: "w-4 h-4",
                  }),
                  (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Configure",
                    id: "9t1iivhk67",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    })
  );
};
/**
 * Layout wrappers: <main> and the sticky page header.
 */
var PageMain = ({ children }) =>
  (0, jsxRuntime.jsx)("main", {
    className: "mx-auto mt-4 w-full flex-1 px-4 md:pl-8 lg:mt-6 max-w-7xl",
    children,
  });
var PageHeader = ({ children, sticky, mdTitle, large }) => {
  const isEmpty = !children && !mdTitle,
    isLarge = large;
  return (0, jsxRuntime.jsx)("header", {
    className: classNames(
      "flex w-full bg-bg-100",
      sticky && "sticky top-0 z-header",
      "h-12",
      isLarge && "mx-auto md:h-24 md:items-end max-w-7xl",
    ),
    "aria-hidden": isEmpty,
    children: (0, jsxRuntime.jsx)("div", {
      className: classNames(
        "flex w-full items-center justify-between gap-4",
        "pl-11 lg:pl-8",
        isLarge ? "px-4 md:pl-8" : "pr-3",
      ),
      children: mdTitle
        ? (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
            children: [
              (0, jsxRuntime.jsx)("h1", {
                className: classNames(
                  "text-text-200 flex items-center gap-2 max-md:hidden min-w-0",
                  "font-heading",
                  isLarge ? "text-2xl" : "text-lg",
                ),
                children: (0, jsxRuntime.jsx)("span", {
                  className: "truncate",
                  children: mdTitle,
                }),
              }),
              (0, jsxRuntime.jsx)("div", {}),
              children,
            ],
          })
        : children,
    }),
  });
};
/**
 * Microphone card on the permissions tab: request access, or link to Chrome's site settings.
 */
var MicrophoneSettingsCard = ({ analytics }) => {
  const intl = useIntl(),
    [permissionState, setPermissionState] = (0, React.useState)("unknown"),
    [isRequesting, setIsRequesting] = (0, React.useState)(!1),
    [errorMessage, setErrorMessage] = (0, React.useState)(null),
    refreshPermissionState = (0, React.useCallback)(async () => {
      try {
        const e = await navigator.permissions.query({
          name: "microphone",
        });
        setPermissionState(e.state),
          e.addEventListener("change", () => {
            setPermissionState(e.state);
          });
      } catch (e) {
        setPermissionState("unknown");
      }
    }, []);
  (0, React.useEffect)(() => {
    refreshPermissionState();
  }, [refreshPermissionState]);
  const openChromeSiteSettings = () => {
    chrome.tabs.create({
      url: `chrome://settings/content/siteDetails?site=chrome-extension://${chrome.runtime.id}`,
    });
  };
  return (0, jsxRuntime.jsxs)("div", {
    className:
      "bg-bg-100 border border-border-300 rounded-xl px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8",
    children: [
      (0, jsxRuntime.jsx)("h3", {
        className: "text-text-100 font-xl-bold",
        children: (0, jsxRuntime.jsx)(FormattedMessage, {
          defaultMessage: "Microphone",
          id: "cW6887Dc/X",
        }),
      }),
      (0, jsxRuntime.jsx)("p", {
        className: "text-text-300 font-base mt-2 mb-6",
        children: (0, jsxRuntime.jsx)(FormattedMessage, {
          defaultMessage:
            "Enable microphone access to use your browser’s speech-to-text functionality for voice narration during workflow recording",
          id: "YQ6CF8Sv1F",
        }),
      }),
      (0, jsxRuntime.jsxs)("div", {
        className: "py-4",
        children: [
          ("prompt" === permissionState || "unknown" === permissionState) &&
            (0, jsxRuntime.jsxs)("div", {
              children: [
                (0, jsxRuntime.jsx)("button", {
                  onClick: async () => {
                    setIsRequesting(!0), setErrorMessage(null);
                    try {
                      (
                        await navigator.mediaDevices.getUserMedia({
                          audio: !0,
                        })
                      )
                        .getTracks()
                        .forEach((e) => e.stop()),
                        await refreshPermissionState(),
                        analytics?.track(
                          "claude_chrome.settings.microphone_enabled",
                          {
                            timestamp: Date.now(),
                          },
                        );
                    } catch (t) {
                      t instanceof DOMException
                        ? "NotAllowedError" === t.name
                          ? setErrorMessage(
                              intl.formatMessage({
                                defaultMessage:
                                  "Permission denied. You can change this in your browser settings.",
                                id: "ErBqL1OKdE",
                              }),
                            )
                          : "NotFoundError" === t.name
                            ? setErrorMessage(
                                intl.formatMessage({
                                  defaultMessage:
                                    "No microphone found. Please connect a microphone and try again.",
                                  id: "KAhM8UkR3A",
                                }),
                              )
                            : setErrorMessage(
                                intl.formatMessage(
                                  {
                                    defaultMessage: "Error: {errorMessage}",
                                    id: "Q+J7H4sPgD",
                                  },
                                  {
                                    errorMessage: t.message,
                                  },
                                ),
                              )
                        : t instanceof Error
                          ? setErrorMessage(
                              intl.formatMessage(
                                {
                                  defaultMessage: "Error: {errorMessage}",
                                  id: "Q+J7H4sPgD",
                                },
                                {
                                  errorMessage: t.message,
                                },
                              ),
                            )
                          : setErrorMessage(
                              intl.formatMessage({
                                defaultMessage: "An unknown error occurred",
                                id: "3VG8rbxa4v",
                              }),
                            ),
                        await refreshPermissionState();
                    } finally {
                      setIsRequesting(!1);
                    }
                  },
                  disabled: isRequesting,
                  className:
                    "px-6 py-2.5 bg-brand-100 text-oncolor-100 rounded-lg hover:bg-brand-100/90 transition-all font-base disabled:opacity-50 disabled:cursor-not-allowed",
                  children: isRequesting
                    ? (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage: "Requesting...",
                        id: "Gma+ACm5J+",
                      })
                    : (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage: "Allow Microphone Access",
                        id: "JfUPjhqwuq",
                      }),
                }),
                errorMessage &&
                  (0, jsxRuntime.jsx)("div", {
                    className:
                      "mt-3 px-4 py-3 bg-danger-000/10 border border-danger-000/20 rounded-lg",
                    children: (0, jsxRuntime.jsx)("p", {
                      className: "font-base text-danger-000",
                      children: errorMessage,
                    }),
                  }),
              ],
            }),
          "granted" === permissionState &&
            (0, jsxRuntime.jsxs)("div", {
              className: "flex items-start gap-3",
              children: [
                (0, jsxRuntime.jsx)("div", {
                  className:
                    "flex-shrink-0 w-5 h-5 rounded-full bg-success-100 flex items-center justify-center mt-0.5",
                  children: (0, jsxRuntime.jsx)("svg", {
                    className: "w-3 h-3 text-oncolor-100",
                    fill: "none",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: (0, jsxRuntime.jsx)("path", {
                      d: "M5 13l4 4L19 7",
                    }),
                  }),
                }),
                (0, jsxRuntime.jsxs)("div", {
                  children: [
                    (0, jsxRuntime.jsx)("div", {
                      className: "font-large text-text-100",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage: "Microphone access granted",
                        id: "Ymx8APRi1X",
                      }),
                    }),
                    (0, jsxRuntime.jsx)("div", {
                      className: "text-text-400 font-base-sm mt-1",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage:
                          "You can now use voice narration when recording workflows. To disable, go to {chromeSettingsLink}.",
                        id: "NSJdoMrS0C",
                        values: {
                          chromeSettingsLink: (0, jsxRuntime.jsx)("button", {
                            onClick: openChromeSiteSettings,
                            className:
                              "text-brand-100 hover:underline cursor-pointer",
                            children: (0, jsxRuntime.jsx)(FormattedMessage, {
                              defaultMessage: "Chrome settings",
                              id: "jebWZltnsn",
                            }),
                          }),
                        },
                      }),
                    }),
                  ],
                }),
              ],
            }),
          "denied" === permissionState &&
            (0, jsxRuntime.jsxs)("div", {
              className: "flex items-start gap-3",
              children: [
                (0, jsxRuntime.jsx)("div", {
                  className:
                    "flex-shrink-0 w-5 h-5 rounded-full bg-danger-200 flex items-center justify-center mt-0.5",
                  children: (0, jsxRuntime.jsx)("svg", {
                    className: "w-3 h-3 text-danger-000",
                    fill: "none",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: (0, jsxRuntime.jsx)("path", {
                      d: "M6 18L18 6M6 6l12 12",
                    }),
                  }),
                }),
                (0, jsxRuntime.jsxs)("div", {
                  children: [
                    (0, jsxRuntime.jsx)("div", {
                      className: "font-large text-text-100",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage: "Microphone access blocked",
                        id: "13YOiAKDfM",
                      }),
                    }),
                    (0, jsxRuntime.jsx)("div", {
                      className: "text-text-400 font-base-sm mt-1",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage:
                          "Microphone access has been denied. To enable, change Microphone to ‘Allow’ in {chromeSettingsLink}.",
                        id: "qkpILBS9+3",
                        values: {
                          chromeSettingsLink: (0, jsxRuntime.jsx)("button", {
                            onClick: openChromeSiteSettings,
                            className:
                              "text-brand-100 hover:underline cursor-pointer",
                            children: (0, jsxRuntime.jsx)(FormattedMessage, {
                              defaultMessage: "Chrome settings",
                              id: "jebWZltnsn",
                            }),
                          }),
                        },
                      }),
                    }),
                  ],
                }),
              ],
            }),
        ],
      }),
    ],
  });
};
/**
 * "Permissions" tab: notifications toggle, microphone card, approved sites and
 * domain transitions (each with a Revoke button).
 */
var PermissionsTab = () => {
  const intl = useIntl(),
    [permissions, setPermissions] = (0, React.useState)(),
    [isLoading, setIsLoading] = (0, React.useState)(!0),
    [notificationsSetting, setNotificationsSetting] = useStorageValue(
      StorageKeys.NOTIFICATIONS_ENABLED,
      void 0,
    ),
    { analytics } = useAnalytics(),
    permissionManager = (0, React.useMemo)(
      () =>
        new PermissionManager(() => !1, {
          surface: "classic_sidepanel",
        }),
      [],
    ),
    loadPermissions = (0, React.useCallback)(async () => {
      setIsLoading(!0);
      try {
        await permissionManager.loadPermissions();
        const e = permissionManager.getPermissionsByScope();
        setPermissions({
          netloc: e.netloc.filter((e) => !e.toolUseId),
          domain_transition: e.domain_transition.filter((e) => !e.toolUseId),
        });
      } catch (e) {
      } finally {
        setIsLoading(!1);
      }
    }, [permissionManager]);
  (0, React.useEffect)(() => {
    loadPermissions();
  }, [loadPermissions]);
  const revokePermission = async (e) => {
      const s = permissionManager.getAllPermissions().find((s) => s.id === e);
      await permissionManager.revokePermission(e),
        s &&
          trackPermissionRevoked((e, s) => {
            analytics?.track(e, s);
          }, s),
        loadPermissions();
    },
    formatScope = (s) =>
      "domain_transition" === s.scope.type
        ? `${s.scope.fromDomain} → ${s.scope.toDomain}`
        : s.scope.netloc ||
          intl.formatMessage({
            defaultMessage: "Unknown domain",
            id: "FMvJL9TokP",
          });
  return isLoading
    ? (0, jsxRuntime.jsx)("div", {
        className: "p-6 text-text-200",
        children: (0, jsxRuntime.jsx)(FormattedMessage, {
          defaultMessage: "Loading permissions...",
          id: "481hO7jC9z",
        }),
      })
    : (0, jsxRuntime.jsx)("div", {
        className: "permissions-tab",
        children: (0, jsxRuntime.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, jsxRuntime.jsxs)("div", {
              className:
                "bg-bg-100 border border-border-300 rounded-xl px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8",
              children: [
                (0, jsxRuntime.jsx)("h3", {
                  className: "text-text-100 font-xl-bold",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Notifications",
                    id: "NAidKbB0vi",
                  }),
                }),
                (0, jsxRuntime.jsx)("p", {
                  className: "text-text-300 font-base mt-2 mb-6",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage:
                      "Get notified when tasks complete or need your input",
                    id: "YxhKVgP/H4",
                  }),
                }),
                (0, jsxRuntime.jsxs)("div", {
                  className: "flex items-center justify-between py-4",
                  children: [
                    (0, jsxRuntime.jsxs)("div", {
                      className: "flex-1",
                      children: [
                        (0, jsxRuntime.jsx)("div", {
                          className: "font-large text-text-100",
                          children: (0, jsxRuntime.jsx)(FormattedMessage, {
                            defaultMessage: "Task completion notifications",
                            id: "u18BzaOjgu",
                          }),
                        }),
                        (0, jsxRuntime.jsx)("div", {
                          className: "text-text-400 font-base-sm mt-1",
                          children:
                            "enabled" === notificationsSetting
                              ? (0, jsxRuntime.jsx)(FormattedMessage, {
                                  defaultMessage:
                                    "You’ll receive notifications when tasks finish",
                                  id: "ZjYEYACroG",
                                })
                              : "disabled" === notificationsSetting
                                ? (0, jsxRuntime.jsx)(FormattedMessage, {
                                    defaultMessage:
                                      "Notifications are turned off",
                                    id: "GzejKCwLFI",
                                  })
                                : (0, jsxRuntime.jsx)(FormattedMessage, {
                                    defaultMessage:
                                      "You haven’t set your notification preference yet",
                                    id: "fGEuc1vqam",
                                  }),
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)("label", {
                      className:
                        "relative inline-flex items-center cursor-pointer ml-4",
                      children: [
                        (0, jsxRuntime.jsx)("input", {
                          type: "checkbox",
                          className: "sr-only peer",
                          checked: "enabled" === notificationsSetting,
                          onChange: (e) =>
                            (async (e) => {
                              await setNotificationsSetting(
                                e ? "enabled" : "disabled",
                              );
                            })(e.target.checked),
                        }),
                        (0, jsxRuntime.jsx)("div", {
                          className:
                            "w-11 h-6 bg-bg-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-100",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, jsxRuntime.jsx)(MicrophoneSettingsCard, {
              analytics,
            }),
            (0, jsxRuntime.jsxs)("div", {
              className:
                "bg-bg-100 border border-border-300 rounded-xl px-6 pt-6 pb-2 md:px-8 md:pt-8 md:pb-3",
              children: [
                (0, jsxRuntime.jsx)("h3", {
                  className: "text-text-100 font-xl-bold",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Your approved sites",
                    id: "NFf/0A3zf+",
                  }),
                }),
                (0, jsxRuntime.jsx)("p", {
                  className: "text-text-300 font-base mt-2 mb-6",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage:
                      "You have allowed Claus to take all actions (browse, click, type) on these sites.",
                    id: "7W74V502ms",
                  }),
                }),
                permissions?.netloc && permissions.netloc.length > 0
                  ? (0, jsxRuntime.jsx)(ApprovedSitesList, {
                      permissions: permissions.netloc,
                      onRevoke: revokePermission,
                      formatScope,
                    })
                  : (0, jsxRuntime.jsx)("div", {
                      className: "text-text-400 font-base-sm pb-5",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage: "No sites have been approved yet",
                        id: "B2ROp8L071",
                      }),
                    }),
              ],
            }),
            permissions?.domain_transition &&
              permissions.domain_transition.length > 0 &&
              (0, jsxRuntime.jsxs)("div", {
                className:
                  "bg-bg-100 border border-border-300 rounded-xl px-6 pt-6 pb-2 md:px-8 md:pt-8 md:pb-3",
                children: [
                  (0, jsxRuntime.jsx)("h3", {
                    className: "text-text-100 font-xl-bold",
                    children: (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage: "Domain Transitions",
                      id: "uYztQwXf/+",
                    }),
                  }),
                  (0, jsxRuntime.jsx)("p", {
                    className: "text-text-300 font-base mt-2 mb-6",
                    children: (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage:
                        "Permissions for navigating between different domains.",
                      id: "fxDu88cBut",
                    }),
                  }),
                  (0, jsxRuntime.jsx)(DomainTransitionsList, {
                    permissions: permissions.domain_transition,
                    onRevoke: revokePermission,
                    formatScope,
                  }),
                ],
              }),
            !1,
          ],
        }),
      });
};
/**
 * List of approved sites (netloc permissions) with last-used date and Revoke.
 */
var ApprovedSitesList = ({ permissions, onRevoke, formatScope }) =>
  (0, jsxRuntime.jsx)("div", {
    children: permissions.map((a, i) =>
      (0, jsxRuntime.jsxs)(
        React.Fragment,
        {
          children: [
            (0, jsxRuntime.jsxs)("div", {
              className: "py-4 flex items-center justify-between",
              children: [
                (0, jsxRuntime.jsxs)("div", {
                  className: "flex-1",
                  children: [
                    (0, jsxRuntime.jsx)("div", {
                      className: "font-large text-text-100",
                      children: formatScope(a),
                    }),
                    a.lastUsed &&
                      (0, jsxRuntime.jsx)("div", {
                        className: "text-xs text-text-400 mt-1",
                        children: (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage: "Last used: {date}",
                          id: "VbVJvDFrU4",
                          values: {
                            date: new Date(a.lastUsed).toLocaleString(),
                          },
                        }),
                      }),
                  ],
                }),
                (0, jsxRuntime.jsx)("button", {
                  onClick: () => onRevoke(a.id),
                  className:
                    "ml-4 px-4 py-2 text-danger-000 hover:bg-danger-000/10 rounded-lg transition-all font-base",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Revoke",
                    id: "tnRDuUFRQw",
                  }),
                }),
              ],
            }),
            i < permissions.length - 1 &&
              (0, jsxRuntime.jsx)("div", {
                className: "border-b border-border-400",
              }),
          ],
        },
        a.id,
      ),
    ),
  });
/**
 * List of domain-transition permissions with last-used date and Revoke.
 */
var DomainTransitionsList = ({ permissions, onRevoke, formatScope }) =>
  (0, jsxRuntime.jsx)("div", {
    children: permissions.map((a, i) =>
      (0, jsxRuntime.jsxs)(
        React.Fragment,
        {
          children: [
            (0, jsxRuntime.jsxs)("div", {
              className: "py-4 flex items-center justify-between",
              children: [
                (0, jsxRuntime.jsxs)("div", {
                  className: "flex-1",
                  children: [
                    (0, jsxRuntime.jsx)("div", {
                      className: "font-large text-text-100",
                      children: formatScope(a),
                    }),
                    a.lastUsed &&
                      (0, jsxRuntime.jsx)("div", {
                        className: "text-xs text-text-400 mt-1",
                        children: (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage: "Last used: {date}",
                          id: "VbVJvDFrU4",
                          values: {
                            date: new Date(a.lastUsed).toLocaleString(),
                          },
                        }),
                      }),
                  ],
                }),
                (0, jsxRuntime.jsx)("button", {
                  onClick: () => onRevoke(a.id),
                  className:
                    "ml-4 px-4 py-2 text-danger-000 hover:bg-danger-000/10 rounded-lg transition-all font-base",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Revoke",
                    id: "tnRDuUFRQw",
                  }),
                }),
              ],
            }),
            i < permissions.length - 1 &&
              (0, jsxRuntime.jsx)("div", {
                className: "border-b border-border-400",
              }),
          ],
        },
        a.id,
      ),
    ),
  });
/**
 * Day / month names for describing schedules.
 */
var DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/**
 * Turns a schedule into text, e.g. "Weekly on Monday at 9:00 AM". Empty string if it does not repeat.
 */
function formatScheduleSummary(schedule) {
  if (!schedule.repeatType || "none" === schedule.repeatType) return "";
  const formattedTime = schedule.specificTime
      ? new Date(`2000-01-01T${schedule.specificTime}`).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: !0,
          },
        )
      : "",
    timeSuffix = formattedTime ? ` at ${formattedTime}` : "";
  switch (schedule.repeatType) {
    case "once":
      if (schedule.specificDate) {
        const [s, a, i] = schedule.specificDate.split("-").map(Number);
        return `${MONTH_NAMES[a - 1]} ${i}, ${s}${timeSuffix}`;
      }
      return `Once${timeSuffix}`;
    case "daily":
      return `Daily${timeSuffix}`;
    case "weekly":
      return `Weekly on ${DAY_NAMES[schedule.dayOfWeek || 0]}${timeSuffix}`;
    case "monthly":
      return `Monthly on day ${schedule.dayOfMonth || 1}${timeSuffix}`;
    case "annually":
      if (schedule.monthAndDay) {
        const [s, a] = schedule.monthAndDay.split("-").map(Number);
        return `Annually on ${MONTH_NAMES[s - 1]} ${a}${timeSuffix}`;
      }
      return `Annually${timeSuffix}`;
    default:
      return "";
  }
}
/**
 * Formats the next run time: "today at 9:00 AM", "tomorrow at ...", or "Mar 5 at ...".
 */
function formatNextRun(timestamp) {
  const runDate = new Date(timestamp),
    now = new Date(),
    timeText = runDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: !0,
    }),
    startOfDay = (e) =>
      new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(),
    dayDiff = Math.round((startOfDay(runDate) - startOfDay(now)) / 864e5);
  if (0 === dayDiff) return `today at ${timeText}`;
  if (1 === dayDiff) return `tomorrow at ${timeText}`;
  const sameYear = runDate.getFullYear() === now.getFullYear();
  return `${MONTH_NAMES[runDate.getMonth()]} ${runDate.getDate()}${sameYear ? "" : `, ${runDate.getFullYear()}`} at ${timeText}`;
}
/**
 * Input validation for a scheduled-task "seed" (data handed over through storage
 * under PENDING_SCHEDULED_TASK). Everything is type/range/format checked before use;
 * unknown or malformed fields become undefined.
 */
var REPEAT_TYPES = new Set(["once", "daily", "weekly", "monthly", "annually"]);
function asString(value) {
  return "string" == typeof value ? value : void 0;
}
function asHttpUrl(value) {
  const trimmed = asString(value)?.trim();
  if (trimmed && !(trimmed.length > 2048) && /^https?:\/\//i.test(trimmed))
    try {
      return new URL(trimmed), trimmed;
    } catch {
      return;
    }
}
function asIntegerInRange(value, min, max) {
  return "number" == typeof value &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
    ? value
    : void 0;
}
/**
 * Builds a clean seed object from untrusted stored data: command and prompt are
 * sanitised, url must be http(s) and < 2048 chars, model/time/date must match strict patterns.
 */
function sanitizeScheduledTaskSeed(input) {
  const repeatType = asString(input.repeatType),
    specificDate = asString(input.specificDate);
  return {
    command: sanitizeLabel(asString(input.command)).slice(0, 200) || void 0,
    prompt: sanitizeText(asString(input.prompt)) || void 0,
    url: asHttpUrl(input.url),
    model: /^[\w.:-]{1,80}$/.test(asString(input.model) ?? "")
      ? asString(input.model)
      : void 0,
    repeatType:
      repeatType && REPEAT_TYPES.has(repeatType) ? repeatType : void 0,
    specificTime: /^\d{2}:\d{2}$/.test(asString(input.specificTime) ?? "")
      ? asString(input.specificTime)
      : void 0,
    specificDate:
      specificDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(specificDate) &&
      specificDate >= getTodayDateString()
        ? specificDate
        : void 0,
    dayOfWeek: asIntegerInRange(input.dayOfWeek, 0, 6),
    dayOfMonth: asIntegerInRange(input.dayOfMonth, 1, 31),
    monthAndDay: /^\d{1,2}-\d{1,2}$/.test(asString(input.monthAndDay) ?? "")
      ? asString(input.monthAndDay)
      : void 0,
  };
}
/**
 * Generic card used for shortcuts and scheduled tasks (title, badge, hover "..." menu, footer).
 */
function TaskCard({
  title,
  slashPrefix = !1,
  badge,
  menuItems,
  onClick,
  dashed = !1,
  children,
  footer,
}) {
  const intl = useIntl();
  return (0, jsxRuntime.jsxs)("div", {
    onClick,
    className: [
      "relative group bg-bg-000 border-[0.5px] border-border-300 rounded-2xl p-4 w-full flex flex-col text-left",
      dashed
        ? "border-dashed"
        : "shadow-[0_2px_4px_0_rgba(0,0,0,0.04)] transition-all",
      onClick
        ? "cursor-pointer hover:border-border-200 hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.08)]"
        : "",
    ].join(" "),
    children: [
      (0, jsxRuntime.jsxs)("div", {
        className: "flex items-start justify-between gap-2 mb-2",
        children: [
          (0, jsxRuntime.jsxs)("div", {
            className:
              "flex-1 min-w-0 font-large-bold text-text-200 relative overflow-hidden",
            children: [
              (0, jsxRuntime.jsxs)("div", {
                className: "whitespace-nowrap",
                children: [
                  slashPrefix &&
                    (0, jsxRuntime.jsx)("span", {
                      className: "text-text-500/50 font-mono",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage: "/",
                        id: "XIbwNE7SSU",
                      }),
                    }),
                  (0, jsxRuntime.jsx)("span", {
                    className: slashPrefix ? "ml-0.5" : void 0,
                    children: title,
                  }),
                ],
              }),
              (0, jsxRuntime.jsx)("div", {
                className:
                  "absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg-000 to-transparent pointer-events-none",
              }),
            ],
          }),
          badge,
          menuItems &&
            (0, jsxRuntime.jsx)("div", {
              onClick: (e) => e.stopPropagation(),
              children: (0, jsxRuntime.jsx)(DropdownMenu, {
                unstyledTrigger: !0,
                trigger: (0, jsxRuntime.jsx)("button", {
                  className:
                    "hide-focus-ring p-1 hover:bg-bg-200 rounded-sm transition-colors relative z-10 opacity-0 group-hover:opacity-100 focus:opacity-100",
                  "aria-label": intl.formatMessage({
                    defaultMessage: "More actions",
                    id: "S8/4ZI1Fhf",
                  }),
                  children: (0, jsxRuntime.jsx)(MoreIcon, {
                    size: 16,
                    className: "text-text-300",
                  }),
                }),
                children: menuItems,
              }),
            }),
        ],
      }),
      children,
      footer &&
        (0, jsxRuntime.jsx)("div", {
          className: "mt-auto pt-3",
          children: footer,
        }),
    ],
  });
}
/**
 * Prompt text previews (clamped to N lines, or a scrollable box).
 */
var LINE_CLAMP_CLASSES = {
  2: "line-clamp-2",
  3: "line-clamp-3",
};
function PromptPreview({ text, lines }) {
  return (0, jsxRuntime.jsx)("div", {
    dir: "ltr",
    style: {
      unicodeBidi: "isolate",
    },
    className: `text-sm text-text-300 whitespace-pre-wrap text-left ${LINE_CLAMP_CLASSES[lines]}`,
    children: sanitizeText(text),
  });
}
function PromptBox({ text, tall = !1 }) {
  return (0, jsxRuntime.jsx)("div", {
    className: "bg-bg-100 rounded-lg p-3 w-full text-left",
    children: (0, jsxRuntime.jsx)("div", {
      dir: "ltr",
      style: {
        unicodeBidi: "isolate",
      },
      className:
        "text-sm text-text-300 overflow-y-auto whitespace-pre-wrap " +
        (tall ? "h-24" : "h-16"),
      children: sanitizeText(text),
    }),
  });
}
/**
 * Dialog to create or edit a scheduled task for a skill.
 * A new task picks one of the user's skills from claude.ai; the skill's current prompt is
 * fetched (fetchSkillContent), cached on the schedule, and approved when saved. If the prompt
 * changes on claude.ai the user must re-approve ("Approve and save"). Saving writes through
 * skillScheduleStore and updates the chrome alarm for the schedule.
 */
function ScheduledTaskDialog({ organizationUuid, target, onClose, onSaved }) {
  const intl = useIntl(),
    editingSchedule = "edit" === target.kind ? target.schedule : null,
    seed = "create" === target.kind ? target.seed : void 0,
    seedPrompt = "string" == typeof seed?.prompt ? seed.prompt.trim() : "",
    [reloadCounter, setReloadCounter] = (0, React.useState)(0);
  (0, React.useEffect)(() => {
    const e = () => setReloadCounter((e) => e + 1);
    return (
      window.addEventListener("focus", e),
      () => window.removeEventListener("focus", e)
    );
  }, []);
  const [skills, setSkills] = (0, React.useState)(editingSchedule ? [] : null),
    [skillsLoadFailed, setSkillsLoadFailed] = (0, React.useState)(!1);
  (0, React.useEffect)(() => {
    if (editingSchedule) return;
    let s = !1;
    return (
      fetchSkills(organizationUuid)
        .then((e) => {
          s ||
            (setSkillsLoadFailed(!1),
            setSkills(
              e
                .filter((e) => isSchedulableSkill(e) && !1 !== e.enabled)
                .sort((e, s) => e.name.localeCompare(s.name)),
            ));
        })
        .catch((e) => {
          s || (setSkills((e) => e ?? []), setSkillsLoadFailed(!0));
        }),
      () => {
        s = !0;
      }
    );
  }, [organizationUuid, editingSchedule, reloadCounter]);
  const [skillName, setSkillName] = (0, React.useState)(
      editingSchedule?.skillName ?? "",
    ),
    [loadedSkill, setLoadedSkill] = (0, React.useState)(null),
    currentSkill = loadedSkill?.skillName === skillName ? loadedSkill : null,
    [isLoadingSkill, setIsLoadingSkill] = (0, React.useState)(!1),
    [skillLoadFailed, setSkillLoadFailed] = (0, React.useState)(!1),
    [skillDisabled, setSkillDisabled] = (0, React.useState)(!1);
  (0, React.useEffect)(() => {
    if ((setSkillLoadFailed(!1), setSkillDisabled(!1), !skillName)) return;
    let s = !1;
    return (
      setIsLoadingSkill(!0),
      (async () => {
        try {
          const t = await findSkillByName(organizationUuid, skillName);
          if (!t) throw new Error("skill not found");
          if (!1 === t.enabled)
            throw (
              (s || (setSkillDisabled(!0), setLoadedSkill(null)),
              new Error("skill disabled on claude.ai"))
            );
          const a = await fetchSkillContent(organizationUuid, t.id);
          if (s) return;
          setLoadedSkill({
            skillName,
            skillId: t.id,
            body: skillScheduleStore.bodyOf(a),
          });
        } catch (t) {
          if (s) return;
          setSkillLoadFailed(!0);
        } finally {
          s || setIsLoadingSkill(!1);
        }
      })(),
      () => {
        s = !0;
      }
    );
  }, [organizationUuid, skillName, reloadCounter]);
  const scheduleForm = useScheduleForm(editingSchedule ?? seed, {
      defaultRepeatType: "daily",
      defaultDayOfWeek: 1,
      isEdit: !!editingSchedule,
    }),
    [showErrors, setShowErrors] = (0, React.useState)(!1),
    [isSaving, setIsSaving] = (0, React.useState)(!1),
    [saveError, setSaveError] = (0, React.useState)(""),
    promptBody =
      currentSkill?.body ?? (editingSchedule?.cachedInstructions ?? "").trim(),
    needsApproval =
      !!editingSchedule &&
      !!currentSkill &&
      currentSkill.body !== (editingSchedule.approvedInstructions ?? "").trim(),
    skillId = currentSkill?.skillId ?? editingSchedule?.skillId,
    skillOptions = (0, React.useMemo)(
      () =>
        (skills ?? []).map((e) => ({
          value: e.name,
          label: e.name,
        })),
      [skills],
    );
  return (0, jsxRuntime.jsxs)(Modal, {
    isOpen: !0,
    onClose,
    title: editingSchedule
      ? intl.formatMessage({
          defaultMessage: "Edit scheduled task",
          id: "6ZDt71ZCiV",
        })
      : intl.formatMessage({
          defaultMessage: "Create scheduled task",
          id: "dJqE3eAWkM",
        }),
    modalSize: "lg",
    hasCloseButton: !0,
    overlayClassName: "!z-[40] !bg-always-black/50",
    children: [
      (0, jsxRuntime.jsxs)("div", {
        className: "space-y-4 mt-4",
        children: [
          seedPrompt &&
            (0, jsxRuntime.jsxs)("div", {
              className:
                "rounded-lg border-[0.5px] border-border-300 bg-bg-100 p-3 text-sm text-text-200 space-y-2",
              children: [
                (0, jsxRuntime.jsxs)("div", {
                  className: "flex items-start gap-3",
                  children: [
                    (0, jsxRuntime.jsx)(Icon, {
                      name: "Info",
                      size: "sm",
                      className: "text-text-300 mt-0.5 shrink-0",
                    }),
                    (0, jsxRuntime.jsxs)("div", {
                      children: [
                        (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage:
                            "Setting up “{name}”. Save this prompt as a skill on claude.ai, then pick it below. The timing is copied from your shortcut.",
                          id: "tx44ZEpY31",
                          values: {
                            name: sanitizeLabel(
                              seed?.command ||
                                (seed ? formatScheduleSummary(seed) : ""),
                            ),
                          },
                        }),
                        " ",
                        (0, jsxRuntime.jsxs)("a", {
                          href: SKILLS_URL,
                          target: "_blank",
                          rel: "noreferrer",
                          className:
                            "inline-flex items-center gap-1 inline-link hover:text-text-100",
                          children: [
                            (0, jsxRuntime.jsx)(FormattedMessage, {
                              defaultMessage: "New skill on claude.ai",
                              id: "0eJzv/Gju6",
                            }),
                            (0, jsxRuntime.jsx)(ExternalLinkIcon, {
                              size: 12,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, jsxRuntime.jsx)(PromptBox, {
                  text: seedPrompt,
                }),
              ],
            }),
          (0, jsxRuntime.jsxs)("div", {
            children: [
              (0, jsxRuntime.jsxs)("div", {
                className: "flex items-baseline justify-between mb-1",
                children: [
                  (0, jsxRuntime.jsx)("span", {
                    className: "font-base text-text-200",
                    children: (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage: "Skill",
                      id: "GFhSwY2YQB",
                    }),
                  }),
                  !editingSchedule && skillsLoadFailed
                    ? (0, jsxRuntime.jsx)("button", {
                        type: "button",
                        onClick: () => setReloadCounter((e) => e + 1),
                        className:
                          "text-xs inline-link text-text-300 hover:text-text-100",
                        children: (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage: "Retry",
                          id: "62nsdyMyIO",
                        }),
                      })
                    : editingSchedule || seedPrompt
                      ? null
                      : (0, jsxRuntime.jsxs)("a", {
                          href: SKILLS_URL,
                          target: "_blank",
                          rel: "noreferrer",
                          className:
                            "inline-flex items-center gap-1 text-xs inline-link text-text-300 hover:text-text-100",
                          children: [
                            (0, jsxRuntime.jsx)(FormattedMessage, {
                              defaultMessage: "New skill on claude.ai",
                              id: "0eJzv/Gju6",
                            }),
                            (0, jsxRuntime.jsx)(ExternalLinkIcon, {
                              size: 12,
                            }),
                          ],
                        }),
                ],
              }),
              editingSchedule
                ? (0, jsxRuntime.jsx)(TextInput, {
                    type: "text",
                    value: skillName,
                    readOnly: !0,
                    disabled: !0,
                    className: "w-full text-sm",
                  })
                : (0, jsxRuntime.jsx)(Select, {
                    value: skillName,
                    onChange: (e) => {
                      setSkillName(e), setSaveError("");
                    },
                    options: skillOptions,
                    disabled: null === skills || 0 === skillOptions.length,
                    placeholder:
                      null === skills
                        ? intl.formatMessage({
                            defaultMessage: "Loading skills…",
                            id: "ru671a3rnA",
                          })
                        : skillsLoadFailed && 0 === skillOptions.length
                          ? intl.formatMessage({
                              defaultMessage:
                                "Couldn’t load your skills from claude.ai",
                              id: "8t8K+XGrOd",
                            })
                          : 0 === skillOptions.length
                            ? intl.formatMessage({
                                defaultMessage:
                                  "No skills yet. Create one on claude.ai first.",
                                id: "9TTTgLikl6",
                              })
                            : intl.formatMessage({
                                defaultMessage: "Select a skill",
                                id: "bvZpnbs17l",
                              }),
                  }),
              showErrors &&
                !skillName &&
                (0, jsxRuntime.jsx)(FieldError, {
                  className: "mt-1",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Choose a skill to run",
                    id: "2wgScuP/gS",
                  }),
                }),
            ],
          }),
          skillName &&
            (0, jsxRuntime.jsxs)("div", {
              children: [
                (0, jsxRuntime.jsxs)("div", {
                  className: "flex items-baseline justify-between mb-1",
                  children: [
                    (0, jsxRuntime.jsx)("span", {
                      className: "font-base text-text-200",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage: "Prompt",
                        id: "iWKE8shLIt",
                      }),
                    }),
                    (0, jsxRuntime.jsx)("span", {
                      className: "text-xs text-text-400",
                      children: isLoadingSkill
                        ? (0, jsxRuntime.jsx)(FormattedMessage, {
                            defaultMessage: "Loading from claude.ai…",
                            id: "by4XIPqYDD",
                          })
                        : skillDisabled
                          ? (0, jsxRuntime.jsx)(FormattedMessage, {
                              defaultMessage:
                                "This skill is turned off on claude.ai. Turn it on there to schedule it.",
                              id: "ac67de/r3v",
                            })
                          : skillLoadFailed
                            ? (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage:
                                  "Couldn’t load the latest prompt. Showing the cached copy.",
                                id: "nkFDp9KJfo",
                              })
                            : skillId
                              ? (0, jsxRuntime.jsxs)("a", {
                                  href: getSkillEditUrl(skillId),
                                  target: "_blank",
                                  rel: "noreferrer",
                                  className:
                                    "inline-flex items-center gap-1 inline-link hover:text-text-100",
                                  children: [
                                    (0, jsxRuntime.jsx)(FormattedMessage, {
                                      defaultMessage: "Edit on claude.ai",
                                      id: "uebBTuGj6x",
                                    }),
                                    (0, jsxRuntime.jsx)(ExternalLinkIcon, {
                                      size: 12,
                                    }),
                                  ],
                                })
                              : null,
                    }),
                  ],
                }),
                (0, jsxRuntime.jsx)(PromptBox, {
                  tall: !0,
                  text: promptBody,
                }),
                needsApproval &&
                  (0, jsxRuntime.jsx)("p", {
                    className: "text-xs text-text-300 mt-2",
                    children: (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage:
                        "This prompt changed on claude.ai since you last reviewed it here, so scheduled runs are asking for permissions. Save to approve the current version.",
                      id: "gmS7z/SyJa",
                    }),
                  }),
              ],
            }),
          (0, jsxRuntime.jsx)(ScheduleFields, {
            form: scheduleForm,
            scheduleEnabled: !0,
            setScheduleEnabled: () => {},
            hideScheduleToggle: !0,
            showUrlError: showErrors,
            showDateError: showErrors,
          }),
          saveError &&
            (0, jsxRuntime.jsx)("div", {
              className: "text-danger-000 text-sm",
              children: saveError,
            }),
        ],
      }),
      (0, jsxRuntime.jsxs)(ModalFooter, {
        children: [
          (0, jsxRuntime.jsx)(Button, {
            onClick: onClose,
            variant: "secondary",
            disabled: isSaving,
            children: (0, jsxRuntime.jsx)(FormattedMessage, {
              defaultMessage: "Cancel",
              id: "47FYwba+bI",
            }),
          }),
          (0, jsxRuntime.jsx)(Button, {
            onClick: async () => {
              if (
                (setShowErrors(!0),
                setSaveError(""),
                skillName &&
                  !scheduleForm.missingDate &&
                  scheduleForm.validateUrl())
              )
                if (editingSchedule || currentSkill) {
                  setIsSaving(!0);
                  try {
                    const e = currentSkill
                        ? {
                            skillId: currentSkill.skillId,
                            cachedInstructions: currentSkill.body,
                            cachedAt: Date.now(),
                            approvedInstructions: currentSkill.body,
                            disabledReason: void 0,
                          }
                        : {},
                      s = editingSchedule
                        ? await skillScheduleStore.update(editingSchedule.id, {
                            ...scheduleForm.output(),
                            ...e,
                          })
                        : await skillScheduleStore.create({
                            ...scheduleForm.output(),
                            repeatType:
                              scheduleForm.output().repeatType ?? "daily",
                            skillName,
                            skillId: currentSkill?.skillId ?? "",
                            displayName: skillName,
                            ...e,
                            sourceSavedPromptId: seed?.id,
                            skipPermissions: seed?.skipPermissions,
                          });
                    s && (await skillScheduleStore.updateAlarmForSchedule(s)),
                      onSaved(
                        editingSchedule
                          ? intl.formatMessage({
                              defaultMessage: "Scheduled task updated",
                              id: "oEUmV1ggcS",
                            })
                          : intl.formatMessage({
                              defaultMessage: "Scheduled task created",
                              id: "ghLZYwvcbf",
                            }),
                      );
                  } catch (e) {
                    setSaveError(
                      intl.formatMessage({
                        defaultMessage:
                          "Couldn’t save the schedule. Try again.",
                        id: "EYjNpvk+3B",
                      }),
                    );
                  } finally {
                    setIsSaving(!1);
                  }
                } else
                  setSaveError(
                    intl.formatMessage({
                      defaultMessage:
                        "Couldn’t load that skill from claude.ai. Try again.",
                      id: "Gvz6Xvt6PK",
                    }),
                  );
            },
            disabled: isSaving || isLoadingSkill || skillDisabled,
            children: needsApproval
              ? (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage: "Approve and save",
                  id: "3nskC1kZ0/",
                })
              : (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage: "Save",
                  id: "jvo0vs3nF0",
                }),
          }),
        ],
      }),
    ],
  });
}
/**
 * Toasts: a small notification stack. window.showToast is registered by ToastContainer
 * and called through useToast().
 */
function Toast({ toast, onClose }) {
  const [isLeaving, setIsLeaving] = (0, React.useState)(!1);
  (0, React.useEffect)(() => {
    const e = setTimeout(() => {
      dismiss();
    }, 3e3);
    return () => clearTimeout(e);
  }, [toast.id]);
  const dismiss = () => {
    setIsLeaving(!0),
      setTimeout(() => {
        onClose(toast.id);
      }, 200);
  };
  return (0, jsxRuntime.jsxs)("div", {
    className: classNames(
      "flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg",
      "bg-bg-000 border-[0.5px] border-border-300",
      "min-w-[300px] transition-all duration-200 ease-out",
      isLeaving
        ? ["opacity-0 translate-x-full"]
        : ["animate-toast-slide-in", "opacity-100 translate-x-0"],
    ),
    style: {
      animation: isLeaving ? void 0 : "toast-slide-in 0.3s ease-out",
    },
    children: [
      "success" === toast.type &&
        (0, jsxRuntime.jsx)(CheckCircleIcon, {
          size: 16,
          className: "text-accent-100 flex-shrink-0",
        }),
      (0, jsxRuntime.jsx)("p", {
        className: "text-text-200 font-base flex-1",
        children: toast.message,
      }),
      (0, jsxRuntime.jsx)("button", {
        onClick: dismiss,
        className:
          "p-1 hover:bg-bg-100 rounded-sm transition-colors flex-shrink-0",
        children: (0, jsxRuntime.jsx)(SmallCloseIcon, {
          size: 14,
          className: "text-text-300",
        }),
      }),
    ],
  });
}
function ToastContainer() {
  const [toasts, setToasts] = (0, React.useState)([]),
    addToast = (e, t = "success") => {
      const a = Date.now().toString();
      setToasts((s) => [
        ...s,
        {
          id: a,
          message: e,
          type: t,
        },
      ]);
    },
    removeToast = (e) => {
      setToasts((s) => s.filter((s) => s.id !== e));
    };
  return (
    (0, React.useEffect)(
      () => (
        (window.showToast = addToast),
        () => {
          delete window.showToast;
        }
      ),
      [],
    ),
    0 === toasts.length
      ? null
      : (0, jsxRuntime.jsx)("div", {
          className: "fixed top-4 right-4 z-50 flex flex-col gap-2",
          children: toasts.map((e) =>
            (0, jsxRuntime.jsx)(
              Toast,
              {
                toast: e,
                onClose: removeToast,
              },
              e.id,
            ),
          ),
        })
  );
}
function useToast() {
  return {
    showToast: (e, s = "success") => {
      const t = window;
      t.showToast && t.showToast(e, s);
    },
  };
}
/**
 * "Scheduled" tab: lists skill schedules (with next run time from chrome.alarms), lets the
 * user create/edit/pause/delete/run-now, and shows old shortcut schedules that were not
 * migrated to skills.
 */
function ScheduledTab() {
  const intl = useIntl(),
    { userProfile } = useAuth(),
    organizationUuid = userProfile?.organization?.uuid,
    { showToast } = useToast(),
    [schedules, setSchedules] = (0, React.useState)([]),
    [nextRunTimes, setNextRunTimes] = (0, React.useState)({}),
    [skippedPrompts, setSkippedPrompts] = (0, React.useState)([]),
    [failedPrompts, setFailedPrompts] = (0, React.useState)([]),
    [migrationState] = useStorageValue(StorageKeys.SKILL_MIGRATION_DONE),
    [retiredSources] = useStorageValue(
      StorageKeys.SKILL_SCHEDULE_RETIRED_SOURCES,
      [],
    ),
    [dismissedPromptIds, setDismissedPromptIds] = useStorageValue(
      StorageKeys.SKILL_SCHEDULE_UNLINKED_DISMISSED,
      [],
    ),
    [dialogTarget, setDialogTarget] = (0, React.useState)(null),
    [runningScheduleId, setRunningScheduleId] = (0, React.useState)(null),
    reloadSchedules = (0, React.useCallback)(async () => {
      const [e, s, t] = await Promise.all([
        skillScheduleStore.getAll(),
        chrome.alarms.getAll(),
        savedPromptsService.getAllPrompts(),
      ]);
      setSchedules(e);
      const a = {};
      for (const d of s)
        skillScheduleStore.isScheduleAlarm(d.name) &&
          (a[d.name] = d.scheduledTime);
      setNextRunTimes(a);
      const i = new Set(e.map((e) => e.sourceSavedPromptId).filter(Boolean)),
        r = new Set(migrationState?.scheduledSkipped ?? []),
        l = new Set(retiredSources ?? []),
        n = t.filter(
          (e) => isScheduledPrompt(e) && !i.has(e.id) && !l.has(e.id),
        );
      setSkippedPrompts(n.filter((e) => r.has(e.id))),
        setFailedPrompts(n.filter((e) => !r.has(e.id)));
    }, [migrationState, retiredSources]);
  (0, React.useEffect)(() => {
    reloadSchedules();
    const e = (e, s) => {
      "local" === s && e[StorageKeys.SKILL_SCHEDULES] && reloadSchedules();
    };
    return (
      chrome.storage.onChanged.addListener(e),
      () => chrome.storage.onChanged.removeListener(e)
    );
  }, [reloadSchedules]);
  const consumePendingTask = (0, React.useCallback)(async () => {
    if (!organizationUuid) return;
    const e = await getStorageItem(StorageKeys.PENDING_SCHEDULED_TASK);
    e &&
      (await removeStorageItem(StorageKeys.PENDING_SCHEDULED_TASK),
      setDialogTarget({
        kind: "create",
        seed: sanitizeScheduledTaskSeed(e),
      }));
  }, [organizationUuid]);
  (0, React.useEffect)(() => {
    consumePendingTask();
    const e = (e, s) => {
      "local" === s &&
        null != e[StorageKeys.PENDING_SCHEDULED_TASK]?.newValue &&
        consumePendingTask();
    };
    return (
      chrome.storage.onChanged.addListener(e),
      () => chrome.storage.onChanged.removeListener(e)
    );
  }, [consumePendingTask]);
  const sortedSchedules = (0, React.useMemo)(
      () =>
        [...schedules].sort((e, s) => {
          const t = nextRunTimes[e.id] ?? Number.POSITIVE_INFINITY,
            a = nextRunTimes[s.id] ?? Number.POSITIVE_INFINITY;
          return t !== a ? t - a : e.displayName.localeCompare(s.displayName);
        }),
      [schedules, nextRunTimes],
    ),
    visibleSkippedPrompts = skippedPrompts.filter(
      (e) => !(dismissedPromptIds ?? []).includes(e.id),
    ),
    visibleFailedPrompts = failedPrompts.filter(
      (e) => !(dismissedPromptIds ?? []).includes(e.id),
    );
  return (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
    children: [
      (0, jsxRuntime.jsx)(ToastContainer, {}),
      (0, jsxRuntime.jsxs)("div", {
        className: "space-y-6",
        children: [
          (0, jsxRuntime.jsxs)("div", {
            className:
              "bg-bg-100 border-[0.5px] border-border-300 rounded-xl px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8",
            children: [
              (0, jsxRuntime.jsxs)("div", {
                className: "flex items-start justify-between mb-2 gap-4",
                children: [
                  (0, jsxRuntime.jsxs)("div", {
                    children: [
                      (0, jsxRuntime.jsx)("h3", {
                        className: "text-text-100 font-xl-bold",
                        children: (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage: "Scheduled tasks",
                          id: "sy7vzf+1SO",
                        }),
                      }),
                      (0, jsxRuntime.jsx)("p", {
                        className: "text-text-300 font-base mt-1",
                        children: (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage:
                            "Run a skill on a schedule. The prompt lives in your Skills on claude.ai; the schedule lives on this computer.",
                          id: "CB+F51UVqL",
                        }),
                      }),
                    ],
                  }),
                  (0, jsxRuntime.jsx)(Button, {
                    onClick: () =>
                      setDialogTarget({
                        kind: "create",
                      }),
                    prepend: (0, jsxRuntime.jsx)(Icon, {
                      name: "Add",
                      size: "sm",
                    }),
                    size: "sm",
                    className: "ml-2 shrink-0",
                    disabled: !organizationUuid,
                    children: (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage: "New task",
                      id: "K4O03zh0vo",
                    }),
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)("div", {
                className:
                  "mb-6 flex items-start gap-3 rounded-lg border-[0.5px] border-border-300 bg-bg-000 p-3",
                children: [
                  (0, jsxRuntime.jsx)(Icon, {
                    name: "Info",
                    size: "sm",
                    className: "text-text-300 mt-0.5 shrink-0",
                  }),
                  (0, jsxRuntime.jsx)("div", {
                    className: "flex-1 text-sm text-text-200",
                    children: (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage:
                        "Scheduled tasks only run while Chrome is open on this computer. Each run opens in its own Claude window.",
                      id: "yAOCN6j+H1",
                    }),
                  }),
                ],
              }),
              [
                {
                  key: "skipped",
                  list: visibleSkippedPrompts,
                  title: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Not migrated",
                    id: "hLRQTqzi4d",
                  }),
                  body: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage:
                      "These scheduled shortcuts weren’t moved to Skills because a skill with the same name already existed. They’re paused until you set them up.",
                    id: "dJhb9VytAw",
                  }),
                },
                {
                  key: "failed",
                  list: visibleFailedPrompts,
                  title: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Still running as shortcuts",
                    id: "eZjRoibd9g",
                  }),
                  body: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage:
                      "These scheduled shortcuts aren’t set up as skills yet. They keep running from this computer as before; set them up here to manage them as skills.",
                    id: "rkCa1cn772",
                  }),
                },
              ]
                .filter(({ list: e }) => e.length > 0)
                .map(({ key: e, list: s, title: a, body: i }) =>
                  (0, jsxRuntime.jsxs)(
                    "div",
                    {
                      className: "mb-8",
                      children: [
                        (0, jsxRuntime.jsxs)("div", {
                          className: "flex items-center gap-2 mb-3",
                          children: [
                            (0, jsxRuntime.jsx)(WarningIcon, {
                              size: 16,
                              className: "text-text-300",
                            }),
                            (0, jsxRuntime.jsx)("h4", {
                              className: "text-text-200 font-base-bold",
                              children: a,
                            }),
                          ],
                        }),
                        (0, jsxRuntime.jsx)("p", {
                          className: "text-text-300 text-sm mb-3",
                          children: i,
                        }),
                        (0, jsxRuntime.jsx)("div", {
                          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                          children: s.map((e) =>
                            (0, jsxRuntime.jsxs)(
                              TaskCard,
                              {
                                dashed: !0,
                                title: sanitizeLabel(
                                  e.command || formatScheduleSummary(e),
                                ),
                                slashPrefix: !!e.command,
                                footer: (0, jsxRuntime.jsxs)("div", {
                                  className: "flex gap-2",
                                  children: [
                                    (0, jsxRuntime.jsx)(Button, {
                                      size: "sm",
                                      onClick: () =>
                                        setDialogTarget({
                                          kind: "create",
                                          seed: e,
                                        }),
                                      disabled: !organizationUuid,
                                      children: (0, jsxRuntime.jsx)(
                                        FormattedMessage,
                                        {
                                          defaultMessage: "Set up",
                                          id: "rrGMSxQd9S",
                                        },
                                      ),
                                    }),
                                    (0, jsxRuntime.jsx)(Button, {
                                      size: "sm",
                                      variant: "secondary",
                                      onClick: () => {
                                        (async (e) => {
                                          (dismissedPromptIds ?? []).includes(
                                            e,
                                          ) ||
                                            (await setDismissedPromptIds([
                                              ...(dismissedPromptIds ?? []),
                                              e,
                                            ]));
                                        })(e.id);
                                      },
                                      children: (0, jsxRuntime.jsx)(
                                        FormattedMessage,
                                        {
                                          defaultMessage: "Dismiss",
                                          id: "TDaF6JVgG6",
                                        },
                                      ),
                                    }),
                                  ],
                                }),
                                children: [
                                  (0, jsxRuntime.jsx)(PromptPreview, {
                                    lines: 2,
                                    text: e.prompt,
                                  }),
                                  (0, jsxRuntime.jsx)("div", {
                                    className: "text-xs text-text-400 mt-2",
                                    children: formatScheduleSummary(e),
                                  }),
                                ],
                              },
                              e.id,
                            ),
                          ),
                        }),
                      ],
                    },
                    e,
                  ),
                ),
              sortedSchedules.length > 0
                ? (0, jsxRuntime.jsx)("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: sortedSchedules.map((s) =>
                      (0, jsxRuntime.jsx)(
                        ScheduleCard,
                        {
                          schedule: s,
                          nextRun: nextRunTimes[s.id],
                          isRunning: runningScheduleId === s.id,
                          onEdit: () =>
                            setDialogTarget({
                              kind: "edit",
                              schedule: s,
                            }),
                          onPauseToggle: () => {
                            (async (s) => {
                              const t = await skillScheduleStore.update(s.id, {
                                paused: !s.paused,
                              });
                              t &&
                                (await skillScheduleStore.updateAlarmForSchedule(
                                  t,
                                )),
                                await reloadSchedules(),
                                showToast(
                                  s.paused
                                    ? intl.formatMessage({
                                        defaultMessage: "Schedule resumed",
                                        id: "Yx+QvoaHXh",
                                      })
                                    : intl.formatMessage({
                                        defaultMessage: "Schedule paused",
                                        id: "AAIeOchsdD",
                                      }),
                                );
                            })(s);
                          },
                          onDelete: () => {
                            (async (s) => {
                              confirm(
                                intl.formatMessage(
                                  {
                                    defaultMessage:
                                      "Delete the schedule for “{name}”? The skill itself stays in your Skills on claude.ai.",
                                    id: "gK2znP5SuY",
                                  },
                                  {
                                    name: s.displayName,
                                  },
                                ),
                              ) &&
                                (await skillScheduleStore.delete(s.id),
                                await reloadSchedules(),
                                showToast(
                                  intl.formatMessage({
                                    defaultMessage: "Schedule deleted",
                                    id: "DEf+xslx0k",
                                  }),
                                ));
                            })(s);
                          },
                          onRunNow: () => {
                            (async (s) => {
                              setRunningScheduleId(s.id);
                              try {
                                const t = await chrome.runtime.sendMessage({
                                  type: "RUN_SKILL_SCHEDULE_NOW",
                                  scheduleId: s.id,
                                });
                                if (!t?.success) {
                                  const s = t?.error,
                                    i =
                                      "skill_unavailable" === s
                                        ? intl.formatMessage({
                                            defaultMessage:
                                              "This skill was deleted or is turned off on claude.ai. Turn it on there, then run again.",
                                            id: "bBBQlT/nP8",
                                          })
                                        : "other_account" === s
                                          ? intl.formatMessage({
                                              defaultMessage:
                                                "This schedule was set up by a different account and has been paused.",
                                              id: "gi7SDoXzle",
                                            })
                                          : "unknown_account" === s
                                            ? intl.formatMessage({
                                                defaultMessage:
                                                  "Couldn’t confirm your account. Sign in, then try again.",
                                                id: "FQnGGwg0RB",
                                              })
                                            : intl.formatMessage({
                                                defaultMessage:
                                                  "Couldn’t start the task. Try again.",
                                                id: "f8rGcz71Mm",
                                              });
                                  showToast(i, "error");
                                }
                                await reloadSchedules();
                              } finally {
                                setRunningScheduleId(null);
                              }
                            })(s);
                          },
                        },
                        s.id,
                      ),
                    ),
                  })
                : (0, jsxRuntime.jsxs)("div", {
                    className: "bg-bg-200 rounded-xl p-12 text-center",
                    children: [
                      (0, jsxRuntime.jsxs)("picture", {
                        children: [
                          (0, jsxRuntime.jsx)("source", {
                            srcSet:
                              "data:image/svg+xml,%3csvg%20width='80'%20height='69'%20viewBox='0%200%2080%2069'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_d_5136_3558)'%3e%3cpath%20d='M5%2019C5%2013.3995%205%2010.5992%206.08993%208.46009C7.04867%206.57847%208.57847%205.04867%2010.4601%204.08993C12.5992%203%2015.3995%203%2021%203H59.0648C64.6654%203%2067.4656%203%2069.6047%204.08993C71.4864%205.04867%2073.0162%206.57847%2073.9749%208.46009C75.0648%2010.5992%2075.0648%2013.3995%2075.0648%2019V46C75.0648%2051.6005%2075.0648%2054.4008%2073.9749%2056.5399C73.0162%2058.4215%2071.4864%2059.9513%2069.6047%2060.9101C67.4656%2062%2064.6654%2062%2059.0648%2062H21C15.3995%2062%2012.5992%2062%2010.4601%2060.9101C8.57847%2059.9513%207.04867%2058.4215%206.08993%2056.5399C5%2054.4008%205%2051.6005%205%2046V19Z'%20fill='%2330302E'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M59.0645%202.75C61.8606%202.75%2063.9733%202.74945%2065.6533%202.88672C67.3361%203.02421%2068.6072%203.30141%2069.7178%203.86719C71.6464%204.84987%2073.2146%206.41806%2074.1973%208.34668C74.7632%209.45736%2075.0402%2010.7291%2075.1777%2012.4121C75.315%2014.0921%2075.3145%2016.2041%2075.3145%2019V46C75.3145%2048.7959%2075.315%2050.9079%2075.1777%2052.5879C75.0402%2054.2709%2074.7632%2055.5426%2074.1973%2056.6533C73.2146%2058.5819%2071.6464%2060.1501%2069.7178%2061.1328C68.6072%2061.6986%2067.3361%2061.9758%2065.6533%2062.1133C63.9733%2062.2505%2061.8606%2062.25%2059.0645%2062.25H21C18.2041%2062.25%2016.0921%2062.2505%2014.4121%2062.1133C12.7292%2061.9758%2011.4573%2061.6987%2010.3467%2061.1328C8.41802%2060.1501%206.84989%2058.582%205.86719%2056.6533C5.30129%2055.5427%205.02422%2054.2708%204.88672%2052.5879C4.74949%2050.9079%204.75%2048.7959%204.75%2046V19C4.75%2016.2041%204.74949%2014.0921%204.88672%2012.4121C5.02422%2010.7292%205.30129%209.45734%205.86719%208.34668C6.84989%206.41802%208.41802%204.84989%2010.3467%203.86719C11.4573%203.30129%2012.7292%203.02422%2014.4121%202.88672C16.0921%202.74949%2018.2041%202.75%2021%202.75H59.0645Z'%20stroke='%23DEDCD1'%20stroke-opacity='0.3'%20stroke-width='0.5'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M14.4844%2019.2899L16.6109%2012.6917L17.5147%2012.7101L15.3882%2019.3083L14.4844%2019.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='15'%20width='32.0373'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2030.2899L16.6109%2023.6917L17.5147%2023.7101L15.3882%2030.3083L14.4844%2030.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='26'%20width='44.1435'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2041.2899L16.6109%2034.6917L17.5147%2034.7101L15.3882%2041.3083L14.4844%2041.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='37'%20width='38.9607'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2052.2899L16.6109%2045.6917L17.5147%2045.7101L15.3882%2052.3083L14.4844%2052.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='48'%20width='34.6778'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d_5136_3558'%20x='0.5'%20y='0.5'%20width='79.0645'%20height='68'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='2'/%3e%3cfeGaussianBlur%20stdDeviation='2'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='out'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.05%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow_5136_3558'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow_5136_3558'%20result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e",
                            media: "(prefers-color-scheme: dark)",
                          }),
                          (0, jsxRuntime.jsx)("img", {
                            src: "data:image/svg+xml,%3csvg%20width='80'%20height='69'%20viewBox='0%200%2080%2069'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_d_5136_3446)'%3e%3cpath%20d='M5%2019C5%2013.3995%205%2010.5992%206.08993%208.46009C7.04867%206.57847%208.57847%205.04867%2010.4601%204.08993C12.5992%203%2015.3995%203%2021%203H59.0648C64.6654%203%2067.4656%203%2069.6047%204.08993C71.4864%205.04867%2073.0162%206.57847%2073.9749%208.46009C75.0648%2010.5992%2075.0648%2013.3995%2075.0648%2019V46C75.0648%2051.6005%2075.0648%2054.4008%2073.9749%2056.5399C73.0162%2058.4215%2071.4864%2059.9513%2069.6047%2060.9101C67.4656%2062%2064.6654%2062%2059.0648%2062H21C15.3995%2062%2012.5992%2062%2010.4601%2060.9101C8.57847%2059.9513%207.04867%2058.4215%206.08993%2056.5399C5%2054.4008%205%2051.6005%205%2046V19Z'%20fill='white'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M59.0645%202.75C61.8606%202.75%2063.9733%202.74945%2065.6533%202.88672C67.3361%203.02421%2068.6072%203.30141%2069.7178%203.86719C71.6464%204.84987%2073.2146%206.41806%2074.1973%208.34668C74.7632%209.45736%2075.0402%2010.7291%2075.1777%2012.4121C75.315%2014.0921%2075.3145%2016.2041%2075.3145%2019V46C75.3145%2048.7959%2075.315%2050.9079%2075.1777%2052.5879C75.0402%2054.2709%2074.7632%2055.5426%2074.1973%2056.6533C73.2146%2058.5819%2071.6464%2060.1501%2069.7178%2061.1328C68.6072%2061.6986%2067.3361%2061.9758%2065.6533%2062.1133C63.9733%2062.2505%2061.8606%2062.25%2059.0645%2062.25H21C18.2041%2062.25%2016.0921%2062.2505%2014.4121%2062.1133C12.7292%2061.9758%2011.4573%2061.6987%2010.3467%2061.1328C8.41802%2060.1501%206.84989%2058.582%205.86719%2056.6533C5.30129%2055.5427%205.02422%2054.2708%204.88672%2052.5879C4.74949%2050.9079%204.75%2048.7959%204.75%2046V19C4.75%2016.2041%204.74949%2014.0921%204.88672%2012.4121C5.02422%2010.7292%205.30129%209.45734%205.86719%208.34668C6.84989%206.41802%208.41802%204.84989%2010.3467%203.86719C11.4573%203.30129%2012.7292%203.02422%2014.4121%202.88672C16.0921%202.74949%2018.2041%202.75%2021%202.75H59.0645Z'%20stroke='%231F1E1D'%20stroke-opacity='0.3'%20stroke-width='0.5'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M14.4844%2019.2899L16.6109%2012.6917L17.5147%2012.7101L15.3882%2019.3083L14.4844%2019.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='15'%20width='32.0373'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2030.2899L16.6109%2023.6917L17.5147%2023.7101L15.3882%2030.3083L14.4844%2030.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='26'%20width='44.1435'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2041.2899L16.6109%2034.6917L17.5147%2034.7101L15.3882%2041.3083L14.4844%2041.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='37'%20width='38.9607'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2052.2899L16.6109%2045.6917L17.5147%2045.7101L15.3882%2052.3083L14.4844%2052.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='48'%20width='34.6778'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d_5136_3446'%20x='0.5'%20y='0.5'%20width='79.0645'%20height='68'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='2'/%3e%3cfeGaussianBlur%20stdDeviation='2'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='out'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.05%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow_5136_3446'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow_5136_3446'%20result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e",
                            alt: "",
                            className: "w-24 h-24 mx-auto mb-1",
                          }),
                        ],
                      }),
                      (0, jsxRuntime.jsx)("p", {
                        className: "text-text-300 max-w-[240px] mx-auto",
                        children: (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage:
                            "No scheduled tasks yet. Create one to run a skill automatically.",
                          id: "aPy3R9aCkg",
                        }),
                      }),
                    ],
                  }),
              (0, jsxRuntime.jsx)("div", {
                className: "mt-6 text-sm text-text-300",
                children: (0, jsxRuntime.jsxs)("a", {
                  href: SKILLS_URL,
                  target: "_blank",
                  rel: "noreferrer",
                  className:
                    "inline-flex items-center gap-1 inline-link hover:text-text-100",
                  children: [
                    (0, jsxRuntime.jsx)(FormattedMessage, {
                      defaultMessage: "Manage skills on claude.ai",
                      id: "4TCGMty/p5",
                    }),
                    (0, jsxRuntime.jsx)(ExternalLinkIcon, {
                      size: 12,
                    }),
                  ],
                }),
              }),
            ],
          }),
          dialogTarget &&
            organizationUuid &&
            (0, jsxRuntime.jsx)(ScheduledTaskDialog, {
              organizationUuid,
              target: dialogTarget,
              onClose: () => setDialogTarget(null),
              onSaved: (e) => {
                setDialogTarget(null), reloadSchedules(), showToast(e);
              },
            }),
        ],
      }),
    ],
  });
}
/**
 * One scheduled-task card with status badge, next run, and the actions menu.
 */
function ScheduleCard({
  schedule,
  nextRun,
  isRunning,
  onEdit,
  onPauseToggle,
  onDelete,
  onRunNow,
}) {
  const promptPreview = summarizeSkillText(schedule.cachedInstructions, 200),
    isUnavailable = !!schedule.disabledReason,
    needsReview = !isUnavailable && skillScheduleStore.needsReview(schedule),
    statusBadge = isUnavailable
      ? (0, jsxRuntime.jsxs)("span", {
          className:
            "inline-flex items-center gap-1 rounded-md bg-danger-900 text-danger-000 px-2 py-0.5",
          children: [
            (0, jsxRuntime.jsx)(WarningIcon, {
              size: 12,
            }),
            (0, jsxRuntime.jsx)(FormattedMessage, {
              defaultMessage: "Skill unavailable",
              id: "rRGaX+nHKV",
            }),
          ],
        })
      : schedule.paused
        ? (0, jsxRuntime.jsxs)("span", {
            className:
              "inline-flex items-center gap-1 rounded-md bg-bg-200 text-text-300 px-2 py-0.5",
            children: [
              (0, jsxRuntime.jsx)(PauseIcon, {
                size: 12,
              }),
              (0, jsxRuntime.jsx)(FormattedMessage, {
                defaultMessage: "Paused",
                id: "C2iTEHtK//",
              }),
            ],
          })
        : (0, jsxRuntime.jsxs)("span", {
            className:
              "inline-flex items-center gap-1 rounded-md bg-accent-900 text-accent-100 px-2 py-0.5",
            children: [
              (0, jsxRuntime.jsx)(ClockIcon, {
                size: 12,
              }),
              formatScheduleSummary(schedule),
            ],
          });
  return (0, jsxRuntime.jsx)(TaskCard, {
    title: sanitizeLabel(schedule.displayName),
    onClick: onEdit,
    menuItems: (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
      children: [
        (0, jsxRuntime.jsx)(MenuItem, {
          icon: (0, jsxRuntime.jsx)(PlayIcon, {
            size: 14,
          }),
          disabled: isRunning,
          onSelect: onRunNow,
          children: (0, jsxRuntime.jsx)(FormattedMessage, {
            defaultMessage: "Run now",
            id: "+ZAG46kixX",
          }),
        }),
        !isUnavailable &&
          (0, jsxRuntime.jsx)(MenuItem, {
            icon: schedule.paused
              ? (0, jsxRuntime.jsx)(PlayIcon, {
                  size: 14,
                })
              : (0, jsxRuntime.jsx)(PauseIcon, {
                  size: 14,
                }),
            onSelect: onPauseToggle,
            children: schedule.paused
              ? (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage: "Resume",
                  id: "3y9DGgura7",
                })
              : (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage: "Pause",
                  id: "tFFMkFDBMO",
                }),
          }),
        (0, jsxRuntime.jsx)(MenuItem, {
          icon: (0, jsxRuntime.jsx)(EditIcon, {
            size: 14,
          }),
          onSelect: onEdit,
          children: (0, jsxRuntime.jsx)(FormattedMessage, {
            defaultMessage: "Edit",
            id: "wEQDC6Wv3/",
          }),
        }),
        (0, jsxRuntime.jsx)(MenuItem, {
          icon: (0, jsxRuntime.jsx)(TrashIcon, {
            size: 14,
          }),
          danger: !0,
          onSelect: onDelete,
          children: (0, jsxRuntime.jsx)(FormattedMessage, {
            defaultMessage: "Delete",
            id: "K3r6DQW7h+",
          }),
        }),
      ],
    }),
    footer: (0, jsxRuntime.jsxs)("div", {
      className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs",
      children: [
        statusBadge,
        needsReview &&
          (0, jsxRuntime.jsxs)("span", {
            className:
              "inline-flex items-center gap-1 rounded-md bg-danger-900 text-danger-000 px-2 py-0.5",
            children: [
              (0, jsxRuntime.jsx)(WarningIcon, {
                size: 12,
              }),
              (0, jsxRuntime.jsx)(FormattedMessage, {
                defaultMessage: "Prompt changed: review",
                id: "UJ2N9T6tkT",
              }),
            ],
          }),
        !isUnavailable &&
          !schedule.paused &&
          nextRun &&
          (0, jsxRuntime.jsx)("span", {
            className: "text-text-400",
            children: (0, jsxRuntime.jsx)(FormattedMessage, {
              defaultMessage: "Next run: {when}",
              id: "tXnyVYHFxs",
              values: {
                when: formatNextRun(nextRun),
              },
            }),
          }),
      ],
    }),
    children:
      promptPreview &&
      (0, jsxRuntime.jsx)(PromptPreview, {
        lines: 3,
        text: promptPreview,
      }),
  });
}
/**
 * Left-hand navigation button.
 */
var NavButton = ({ children, isActive, onClick }) =>
  (0, jsxRuntime.jsx)("button", {
    onClick,
    "aria-current": isActive ? "page" : void 0,
    className: classNames(
      "hit-row hit-row-main block w-full text-left whitespace-nowrap transition-transform ease-in-out active:scale-95",
      "font-base rounded-lg px-3 py-3",
      isActive
        ? "bg-bg-300 font-medium text-text-000"
        : "text-text-200 hover:bg-bg-200 hover:text-text-100",
    ),
    children,
  });
/**
 * "Shortcuts" tab: list, create, edit and delete saved prompts (savedPromptsService).
 * In skills mode it only shows a notice pointing to claude.ai.
 */
function ShortcutsTab({
  showAddForm: showAddFormProp,
  setShowAddForm: setShowAddFormProp,
  editingPrompt: editingPromptProp,
  setEditingPrompt: setEditingPromptProp,
  isInModal = !1,
} = {}) {
  const intl = useIntl(),
    [prompts, setPrompts] = (0, React.useState)([]),
    [localEditingPrompt, setLocalEditingPrompt] = (0, React.useState)(null),
    [localShowAddForm, setLocalShowAddForm] = (0, React.useState)(!1),
    editingPrompt =
      void 0 !== editingPromptProp ? editingPromptProp : localEditingPrompt,
    setEditingPrompt = setEditingPromptProp || setLocalEditingPrompt,
    showAddForm =
      void 0 !== showAddFormProp ? showAddFormProp : localShowAddForm,
    setShowAddForm = setShowAddFormProp || setLocalShowAddForm,
    { showToast } = useToast(),
    { active: skillsActive, loaded: skillsStateLoaded } = useSkillsMode(),
    isSkillsMode = skillsActive,
    reloadPrompts = async () => {
      const e = await savedPromptsService.getAllPrompts();
      setPrompts(e.sort((e, s) => s.createdAt - e.createdAt));
    },
    scheduledPrompts = prompts.filter(
      (e) => e.repeatType && "none" !== e.repeatType,
    ),
    unscheduledPrompts = prompts.filter(
      (e) => !e.repeatType || "none" === e.repeatType,
    );
  (0, React.useEffect)(() => {
    reloadPrompts();
  }, []),
    (0, React.useEffect)(() => {
      if (!skillsStateLoaded || isSkillsMode) return;
      const e = async () => {
        const e = await getStorageItem(StorageKeys.PENDING_SCHEDULED_TASK);
        if (e) {
          const s = sanitizeScheduledTaskSeed(e);
          setEditingPrompt({
            ...s,
            command: s.command || "",
            prompt: s.prompt || "",
            createdAt: Date.now(),
            usageCount: 0,
          }),
            setShowAddForm(!0),
            await removeStorageItem(StorageKeys.PENDING_SCHEDULED_TASK);
        }
      };
      e();
      const s = (s, t) => {
        "local" === t &&
          null != s[StorageKeys.PENDING_SCHEDULED_TASK]?.newValue &&
          e();
      };
      return (
        chrome.storage.onChanged.addListener(s),
        () => chrome.storage.onChanged.removeListener(s)
      );
    }, [skillsStateLoaded, isSkillsMode, setEditingPrompt, setShowAddForm]);
  const deletePrompt = async (e) => {
    confirm(
      intl.formatMessage({
        defaultMessage: "Are you sure you want to delete this prompt?",
        id: "eJFbw2HgHp",
      }),
    ) &&
      (await savedPromptsService.deletePrompt(e),
      editingPrompt?.id === e && (setEditingPrompt(null), setShowAddForm(!1)),
      reloadPrompts(),
      showToast(
        intl.formatMessage({
          defaultMessage: "Shortcut deleted",
          id: "RRFjL3H23m",
        }),
      ));
  };
  return isSkillsMode
    ? (0, jsxRuntime.jsxs)("div", {
        className:
          "bg-bg-100 border-[0.5px] border-border-300 rounded-xl px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8 flex items-start justify-between gap-4",
        children: [
          (0, jsxRuntime.jsxs)("div", {
            children: [
              (0, jsxRuntime.jsx)("h3", {
                className: "text-text-100 font-xl-bold",
                children: (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage: "Shortcuts",
                  id: "7FAwwkYilD",
                }),
              }),
              (0, jsxRuntime.jsx)("p", {
                className: "text-text-300 font-base mt-1",
                children: (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage:
                    "Your shortcuts are now Skills in your claude.ai account: create, edit, and share them there. Type / in the chat to use them; scheduled ones live in the Scheduled tab.",
                  id: "+T3EWDU4jf",
                }),
              }),
            ],
          }),
          (0, jsxRuntime.jsx)(Button, {
            href: SKILLS_URL,
            target: "_blank",
            append: (0, jsxRuntime.jsx)(ExternalLinkIcon, {
              size: 14,
            }),
            size: "sm",
            className: "ml-2 shrink-0",
            children: (0, jsxRuntime.jsx)(FormattedMessage, {
              defaultMessage: "Manage on claude.ai",
              id: "OFipYsAbEA",
            }),
          }),
        ],
      })
    : (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
        children: [
          (0, jsxRuntime.jsx)(ToastContainer, {}),
          (0, jsxRuntime.jsxs)("div", {
            className: "space-y-6",
            children: [
              (0, jsxRuntime.jsxs)("div", {
                className: isInModal
                  ? "px-6 pt-6 pb-6"
                  : "bg-bg-100 border-[0.5px] border-border-300 rounded-xl px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8",
                children: [
                  !isInModal &&
                    (0, jsxRuntime.jsxs)("div", {
                      className: "flex items-start justify-between mb-2",
                      children: [
                        (0, jsxRuntime.jsxs)("div", {
                          children: [
                            (0, jsxRuntime.jsx)("h3", {
                              className: "text-text-100 font-xl-bold",
                              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage: "Shortcuts",
                                id: "7FAwwkYilD",
                              }),
                            }),
                            (0, jsxRuntime.jsx)("p", {
                              className: "text-text-300 font-base mt-1",
                              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage:
                                  "Type / in the chat to use shortcuts or run them on schedule",
                                id: "YEk9i6AJuT",
                              }),
                            }),
                          ],
                        }),
                        (0, jsxRuntime.jsx)(Button, {
                          onClick: () => {
                            setEditingPrompt(null), setShowAddForm(!0);
                          },
                          prepend: (0, jsxRuntime.jsx)(Icon, {
                            name: "Add",
                            size: "sm",
                          }),
                          size: "sm",
                          className: "ml-2",
                          children: (0, jsxRuntime.jsx)(FormattedMessage, {
                            defaultMessage: "Create shortcut",
                            id: "AzO4h7b149",
                          }),
                        }),
                      ],
                    }),
                  isInModal &&
                    (0, jsxRuntime.jsx)("p", {
                      className: "text-text-300 font-base mb-6",
                      children: (0, jsxRuntime.jsx)(FormattedMessage, {
                        defaultMessage:
                          "Type / to use shortcuts or run them on a schedule",
                        id: "lQnSmhAWv8",
                      }),
                    }),
                  (0, jsxRuntime.jsxs)("div", {
                    className: "space-y-8 mt-6",
                    children: [
                      scheduledPrompts.length > 0 &&
                        (0, jsxRuntime.jsxs)("div", {
                          children: [
                            (0, jsxRuntime.jsxs)("div", {
                              className: "flex items-center gap-2 mb-4",
                              children: [
                                (0, jsxRuntime.jsx)(ClockIcon, {
                                  size: 16,
                                  className: "text-text-300",
                                }),
                                (0, jsxRuntime.jsx)("h4", {
                                  className: "text-text-200 font-base-bold",
                                  children: (0, jsxRuntime.jsx)(
                                    FormattedMessage,
                                    {
                                      defaultMessage: "Scheduled",
                                      id: "cXAlMRerxW",
                                    },
                                  ),
                                }),
                              ],
                            }),
                            (0, jsxRuntime.jsx)("div", {
                              className:
                                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                              children: scheduledPrompts.map((e) =>
                                (0, jsxRuntime.jsx)(
                                  ShortcutCard,
                                  {
                                    prompt: e,
                                    scheduleText: formatScheduleSummary(e),
                                    onEdit: () => {
                                      setEditingPrompt(e), setShowAddForm(!0);
                                    },
                                    onDelete: () => deletePrompt(e.id),
                                  },
                                  e.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                      unscheduledPrompts.length > 0 &&
                        (0, jsxRuntime.jsxs)("div", {
                          children: [
                            scheduledPrompts.length > 0 &&
                              (0, jsxRuntime.jsxs)("div", {
                                className: "flex items-center gap-2 mb-4",
                                children: [
                                  (0, jsxRuntime.jsx)(Icon, {
                                    name: "ListBullet",
                                    customSize: 18,
                                    className: "text-text-300",
                                  }),
                                  (0, jsxRuntime.jsx)("h4", {
                                    className: "text-text-200 font-base-bold",
                                    children: (0, jsxRuntime.jsx)(
                                      FormattedMessage,
                                      {
                                        defaultMessage: "Other",
                                        id: "/VnDMl81rh",
                                      },
                                    ),
                                  }),
                                ],
                              }),
                            (0, jsxRuntime.jsx)("div", {
                              className:
                                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                              children: unscheduledPrompts.map((e) =>
                                (0, jsxRuntime.jsx)(
                                  ShortcutCard,
                                  {
                                    prompt: e,
                                    onEdit: () => {
                                      setEditingPrompt(e), setShowAddForm(!0);
                                    },
                                    onDelete: () => deletePrompt(e.id),
                                  },
                                  e.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                      0 === prompts.length &&
                        (0, jsxRuntime.jsxs)("div", {
                          className: "bg-bg-200 rounded-xl p-12 text-center",
                          children: [
                            (0, jsxRuntime.jsxs)("picture", {
                              children: [
                                (0, jsxRuntime.jsx)("source", {
                                  srcSet:
                                    "data:image/svg+xml,%3csvg%20width='80'%20height='69'%20viewBox='0%200%2080%2069'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_d_5136_3558)'%3e%3cpath%20d='M5%2019C5%2013.3995%205%2010.5992%206.08993%208.46009C7.04867%206.57847%208.57847%205.04867%2010.4601%204.08993C12.5992%203%2015.3995%203%2021%203H59.0648C64.6654%203%2067.4656%203%2069.6047%204.08993C71.4864%205.04867%2073.0162%206.57847%2073.9749%208.46009C75.0648%2010.5992%2075.0648%2013.3995%2075.0648%2019V46C75.0648%2051.6005%2075.0648%2054.4008%2073.9749%2056.5399C73.0162%2058.4215%2071.4864%2059.9513%2069.6047%2060.9101C67.4656%2062%2064.6654%2062%2059.0648%2062H21C15.3995%2062%2012.5992%2062%2010.4601%2060.9101C8.57847%2059.9513%207.04867%2058.4215%206.08993%2056.5399C5%2054.4008%205%2051.6005%205%2046V19Z'%20fill='%2330302E'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M59.0645%202.75C61.8606%202.75%2063.9733%202.74945%2065.6533%202.88672C67.3361%203.02421%2068.6072%203.30141%2069.7178%203.86719C71.6464%204.84987%2073.2146%206.41806%2074.1973%208.34668C74.7632%209.45736%2075.0402%2010.7291%2075.1777%2012.4121C75.315%2014.0921%2075.3145%2016.2041%2075.3145%2019V46C75.3145%2048.7959%2075.315%2050.9079%2075.1777%2052.5879C75.0402%2054.2709%2074.7632%2055.5426%2074.1973%2056.6533C73.2146%2058.5819%2071.6464%2060.1501%2069.7178%2061.1328C68.6072%2061.6986%2067.3361%2061.9758%2065.6533%2062.1133C63.9733%2062.2505%2061.8606%2062.25%2059.0645%2062.25H21C18.2041%2062.25%2016.0921%2062.2505%2014.4121%2062.1133C12.7292%2061.9758%2011.4573%2061.6987%2010.3467%2061.1328C8.41802%2060.1501%206.84989%2058.582%205.86719%2056.6533C5.30129%2055.5427%205.02422%2054.2708%204.88672%2052.5879C4.74949%2050.9079%204.75%2048.7959%204.75%2046V19C4.75%2016.2041%204.74949%2014.0921%204.88672%2012.4121C5.02422%2010.7292%205.30129%209.45734%205.86719%208.34668C6.84989%206.41802%208.41802%204.84989%2010.3467%203.86719C11.4573%203.30129%2012.7292%203.02422%2014.4121%202.88672C16.0921%202.74949%2018.2041%202.75%2021%202.75H59.0645Z'%20stroke='%23DEDCD1'%20stroke-opacity='0.3'%20stroke-width='0.5'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M14.4844%2019.2899L16.6109%2012.6917L17.5147%2012.7101L15.3882%2019.3083L14.4844%2019.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='15'%20width='32.0373'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2030.2899L16.6109%2023.6917L17.5147%2023.7101L15.3882%2030.3083L14.4844%2030.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='26'%20width='44.1435'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2041.2899L16.6109%2034.6917L17.5147%2034.7101L15.3882%2041.3083L14.4844%2041.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='37'%20width='38.9607'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2052.2899L16.6109%2045.6917L17.5147%2045.7101L15.3882%2052.3083L14.4844%2052.2899Z'%20fill='%23C2C0B6'/%3e%3crect%20x='22.9209'%20y='48'%20width='34.6778'%20height='2'%20rx='1'%20fill='%23DEDCD1'%20fill-opacity='0.15'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d_5136_3558'%20x='0.5'%20y='0.5'%20width='79.0645'%20height='68'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='2'/%3e%3cfeGaussianBlur%20stdDeviation='2'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='out'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.05%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow_5136_3558'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow_5136_3558'%20result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e",
                                  media: "(prefers-color-scheme: dark)",
                                }),
                                (0, jsxRuntime.jsx)("img", {
                                  src: "data:image/svg+xml,%3csvg%20width='80'%20height='69'%20viewBox='0%200%2080%2069'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_d_5136_3446)'%3e%3cpath%20d='M5%2019C5%2013.3995%205%2010.5992%206.08993%208.46009C7.04867%206.57847%208.57847%205.04867%2010.4601%204.08993C12.5992%203%2015.3995%203%2021%203H59.0648C64.6654%203%2067.4656%203%2069.6047%204.08993C71.4864%205.04867%2073.0162%206.57847%2073.9749%208.46009C75.0648%2010.5992%2075.0648%2013.3995%2075.0648%2019V46C75.0648%2051.6005%2075.0648%2054.4008%2073.9749%2056.5399C73.0162%2058.4215%2071.4864%2059.9513%2069.6047%2060.9101C67.4656%2062%2064.6654%2062%2059.0648%2062H21C15.3995%2062%2012.5992%2062%2010.4601%2060.9101C8.57847%2059.9513%207.04867%2058.4215%206.08993%2056.5399C5%2054.4008%205%2051.6005%205%2046V19Z'%20fill='white'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M59.0645%202.75C61.8606%202.75%2063.9733%202.74945%2065.6533%202.88672C67.3361%203.02421%2068.6072%203.30141%2069.7178%203.86719C71.6464%204.84987%2073.2146%206.41806%2074.1973%208.34668C74.7632%209.45736%2075.0402%2010.7291%2075.1777%2012.4121C75.315%2014.0921%2075.3145%2016.2041%2075.3145%2019V46C75.3145%2048.7959%2075.315%2050.9079%2075.1777%2052.5879C75.0402%2054.2709%2074.7632%2055.5426%2074.1973%2056.6533C73.2146%2058.5819%2071.6464%2060.1501%2069.7178%2061.1328C68.6072%2061.6986%2067.3361%2061.9758%2065.6533%2062.1133C63.9733%2062.2505%2061.8606%2062.25%2059.0645%2062.25H21C18.2041%2062.25%2016.0921%2062.2505%2014.4121%2062.1133C12.7292%2061.9758%2011.4573%2061.6987%2010.3467%2061.1328C8.41802%2060.1501%206.84989%2058.582%205.86719%2056.6533C5.30129%2055.5427%205.02422%2054.2708%204.88672%2052.5879C4.74949%2050.9079%204.75%2048.7959%204.75%2046V19C4.75%2016.2041%204.74949%2014.0921%204.88672%2012.4121C5.02422%2010.7292%205.30129%209.45734%205.86719%208.34668C6.84989%206.41802%208.41802%204.84989%2010.3467%203.86719C11.4573%203.30129%2012.7292%203.02422%2014.4121%202.88672C16.0921%202.74949%2018.2041%202.75%2021%202.75H59.0645Z'%20stroke='%231F1E1D'%20stroke-opacity='0.3'%20stroke-width='0.5'%20shape-rendering='crispEdges'/%3e%3cpath%20d='M14.4844%2019.2899L16.6109%2012.6917L17.5147%2012.7101L15.3882%2019.3083L14.4844%2019.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='15'%20width='32.0373'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2030.2899L16.6109%2023.6917L17.5147%2023.7101L15.3882%2030.3083L14.4844%2030.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='26'%20width='44.1435'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2041.2899L16.6109%2034.6917L17.5147%2034.7101L15.3882%2041.3083L14.4844%2041.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='37'%20width='38.9607'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3cpath%20d='M14.4844%2052.2899L16.6109%2045.6917L17.5147%2045.7101L15.3882%2052.3083L14.4844%2052.2899Z'%20fill='%233D3D3A'/%3e%3crect%20x='22.9209'%20y='48'%20width='34.6778'%20height='2'%20rx='1'%20fill='%231F1E1D'%20fill-opacity='0.15'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d_5136_3446'%20x='0.5'%20y='0.5'%20width='79.0645'%20height='68'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='2'/%3e%3cfeGaussianBlur%20stdDeviation='2'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='out'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.05%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow_5136_3446'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow_5136_3446'%20result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e",
                                  alt: intl.formatMessage({
                                    defaultMessage: "Tasks illustration",
                                    id: "heKLO07Qz/",
                                  }),
                                  className: "w-24 h-24 mx-auto mb-1",
                                }),
                              ],
                            }),
                            (0, jsxRuntime.jsx)("p", {
                              className: "text-text-300 max-w-[200px] mx-auto",
                              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage:
                                  "Create your first shortcut to get started",
                                id: "8Y2q4SsIpY",
                              }),
                            }),
                          ],
                        }),
                      !1,
                    ],
                  }),
                ],
              }),
              showAddForm &&
                (0, jsxRuntime.jsx)(ShortcutDialog, {
                  prompt: editingPrompt,
                  onClose: () => {
                    setShowAddForm(!1), setEditingPrompt(null);
                  },
                  onSave: (e) => {
                    reloadPrompts(),
                      setShowAddForm(!1),
                      setEditingPrompt(null),
                      showToast(
                        e
                          ? intl.formatMessage({
                              defaultMessage: "Shortcut updated",
                              id: "IV5WU06zbs",
                            })
                          : intl.formatMessage({
                              defaultMessage: "Shortcut added",
                              id: "wn15NDyLWm",
                            }),
                      );
                  },
                }),
            ],
          }),
        ],
      });
}
/**
 * One shortcut card (/command, prompt, optional schedule text).
 */
function ShortcutCard({ prompt, scheduleText, onEdit, onDelete }) {
  return (0, jsxRuntime.jsx)(TaskCard, {
    title: prompt.command,
    slashPrefix: !!prompt.command,
    onClick: onEdit,
    menuItems: (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
      children: [
        (0, jsxRuntime.jsx)(MenuItem, {
          icon: (0, jsxRuntime.jsx)(EditIcon, {
            size: 14,
          }),
          onSelect: onEdit,
          children: (0, jsxRuntime.jsx)(FormattedMessage, {
            defaultMessage: "Edit",
            id: "wEQDC6Wv3/",
          }),
        }),
        (0, jsxRuntime.jsx)(MenuItem, {
          icon: (0, jsxRuntime.jsx)(TrashIcon, {
            size: 14,
          }),
          danger: !0,
          onSelect: onDelete,
          children: (0, jsxRuntime.jsx)(FormattedMessage, {
            defaultMessage: "Delete",
            id: "K3r6DQW7h+",
          }),
        }),
      ],
    }),
    footer: scheduleText
      ? (0, jsxRuntime.jsx)("span", {
          className: "text-xs text-text-300",
          children: scheduleText,
        })
      : void 0,
    children: (0, jsxRuntime.jsx)(PromptBox, {
      tall: !0,
      text: prompt.prompt,
    }),
  });
}
/**
 * Dialog to create or edit a shortcut: name (letters, digits, - and _), prompt, URL and optional schedule.
 * A new shortcut pre-fills the URL field with the active tab's origin.
 */
function ShortcutDialog({ prompt, onClose, onSave }) {
  const intl = useIntl(),
    [command, setCommand] = (0, React.useState)(prompt?.command || ""),
    [promptText, setPromptText] = (0, React.useState)(prompt?.prompt || ""),
    [errorMessage, setErrorMessage] = (0, React.useState)(""),
    [showErrors, setShowErrors] = (0, React.useState)(!1),
    isNew = !prompt?.id,
    nameInputRef = (0, React.useRef)(null),
    [scheduleEnabled, setScheduleEnabled] = (0, React.useState)(
      Boolean(prompt?.repeatType && "none" !== prompt.repeatType),
    ),
    scheduleForm = useScheduleForm(prompt),
    setUrl = scheduleForm.setUrl;
  (0, React.useEffect)(() => {
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100),
      (prompt && !isNew) ||
        chrome.tabs.query(
          {
            active: !0,
            currentWindow: !0,
          },
          (e) => {
            if (e[0]?.url)
              try {
                const s = new URL(e[0].url).origin;
                s.startsWith("http") && setUrl(s);
              } catch {}
          },
        );
  }, [prompt, isNew, setUrl]),
    (0, React.useEffect)(() => {
      const e = (e) => {
        if ("Enter" === e.key) {
          const s = document.activeElement;
          "INPUT" !== s?.tagName &&
            "TEXTAREA" !== s?.tagName &&
            (e.preventDefault(), save());
        }
      };
      return (
        document.addEventListener("keydown", e),
        () => document.removeEventListener("keydown", e)
      );
    }, [command, promptText]);
  const save = async () => {
    if (
      (setShowErrors(!0),
      command.trim() &&
        promptText.trim() &&
        !(
          !scheduleForm.validateUrl() ||
          (scheduleEnabled && scheduleForm.missingDate)
        ))
    )
      try {
        const s = scheduleForm.output();
        prompt && !isNew
          ? await savedPromptsService.updatePrompt(
              prompt.id,
              {
                prompt: promptText.trim(),
                command: command.trim(),
                url: s.url,
                ...(scheduleEnabled ? s : EMPTY_SCHEDULE_FIELDS),
              },
              !1,
            )
          : await savedPromptsService.savePrompt({
              prompt: promptText.trim(),
              command: command.trim(),
              url: s.url,
              createdAt: Date.now(),
              usageCount: 0,
              ...(scheduleEnabled ? s : {}),
            }),
          onSave(!(!prompt || isNew));
      } catch (s) {
        setErrorMessage(s instanceof Error ? s.message : "Failed to save");
      }
  };
  return (0, jsxRuntime.jsxs)(Modal, {
    isOpen: !0,
    onClose,
    title:
      prompt && !isNew
        ? intl.formatMessage({
            defaultMessage: "Edit shortcut",
            id: "R592aOW18A",
          })
        : intl.formatMessage({
            defaultMessage: "Create shortcut",
            id: "AzO4h7b149",
          }),
    modalSize: "lg",
    hasCloseButton: !0,
    overlayClassName: "!z-[40] !bg-always-black/50",
    children: [
      (0, jsxRuntime.jsxs)("div", {
        className: "space-y-4 mt-4",
        children: [
          (0, jsxRuntime.jsxs)("div", {
            children: [
              (0, jsxRuntime.jsx)("span", {
                className: "font-base text-text-200 block mb-1",
                children: (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage: "Name",
                  id: "HAlOn1ZsuY",
                }),
              }),
              (0, jsxRuntime.jsx)(TextInput, {
                ref: nameInputRef,
                type: "text",
                value: command,
                onChange: (e) => {
                  const s = e.target.value
                    .replace(/\s/g, "-")
                    .replace(/[^a-zA-Z0-9-_]/g, "");
                  setCommand(s), errorMessage && setErrorMessage("");
                },
                prepend: (0, jsxRuntime.jsx)("span", {
                  className: "text-text-300",
                  children: (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "/",
                    id: "XIbwNE7SSU",
                  }),
                }),
                placeholder: intl.formatMessage({
                  defaultMessage: "task-name",
                  id: "zfW5u5DbnY",
                }),
                className: "w-full text-sm",
                error:
                  (showErrors && !command.trim()) ||
                  errorMessage?.includes("already in use"),
              }),
              ((showErrors && !command.trim()) ||
                errorMessage?.includes("already in use")) &&
                (0, jsxRuntime.jsx)(FieldError, {
                  className: "mt-1",
                  children:
                    showErrors && !command.trim()
                      ? (0, jsxRuntime.jsx)(FormattedMessage, {
                          defaultMessage: "Name is required",
                          id: "Gvxoji2HqE",
                        })
                      : errorMessage,
                }),
            ],
          }),
          (0, jsxRuntime.jsxs)("div", {
            children: [
              (0, jsxRuntime.jsx)("span", {
                className: "font-base text-text-200 block mb-1",
                children: (0, jsxRuntime.jsx)(FormattedMessage, {
                  defaultMessage: "Prompt",
                  id: "iWKE8shLIt",
                }),
              }),
              (0, jsxRuntime.jsx)(Textarea, {
                required: !0,
                value: promptText,
                onChange: (e) => setPromptText(e.target.value),
                className:
                  "min-h-32 max-h-64 overflow-y-auto font-large text-sm",
                placeholder: intl.formatMessage({
                  defaultMessage: "Enter your prompt text...",
                  id: "xvBEtpDq86",
                }),
                error:
                  showErrors && !promptText.trim()
                    ? intl.formatMessage({
                        defaultMessage: "Prompt is required",
                        id: "E8uSl+czLg",
                      })
                    : void 0,
              }),
            ],
          }),
          (0, jsxRuntime.jsx)(ScheduleFields, {
            form: scheduleForm,
            scheduleEnabled,
            setScheduleEnabled,
            showUrlError: showErrors,
            showDateError: showErrors,
          }),
          errorMessage &&
            !errorMessage.includes("already in use") &&
            (0, jsxRuntime.jsx)("div", {
              className: "text-danger-000 text-sm",
              children: errorMessage,
            }),
        ],
      }),
      (0, jsxRuntime.jsxs)(ModalFooter, {
        children: [
          (0, jsxRuntime.jsx)(Button, {
            onClick: onClose,
            variant: "secondary",
            children: (0, jsxRuntime.jsx)(FormattedMessage, {
              defaultMessage: "Cancel",
              id: "47FYwba+bI",
            }),
          }),
          (0, jsxRuntime.jsx)(Button, {
            onClick: save,
            children:
              prompt && !isNew
                ? (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Save changes",
                    id: "X0ha1a+WYV",
                  })
                : (0, jsxRuntime.jsx)(FormattedMessage, {
                    defaultMessage: "Create shortcut",
                    id: "AzO4h7b149",
                  }),
          }),
        ],
      }),
    ],
  });
}
/**
 * Root component: reads the URL hash to pick the tab, shows the signed-in email or "API Key Mode",
 * the navigation, the selected tab, and the microphone modal. Log out sends { type: "logout" }
 * to the service worker, resets analytics and reloads the page.
 */
/**
 * Models tab (Claus): mode, provider, API keys, models, thinking and personality. Stored by jev/settings.js in
 * chrome.storage.local, which the side panel reads on every message, so changes apply to the next message.
 */
var MODES = [
    ["gpt", "Jev off: OpenAI only", "One OpenAI model reads the page, thinks and drives the browser with screenshots, element refs and coordinates. Only needs an OpenAI key."],
    ["decision", "Jev on: OpenAI + Jev decision model", "The same OpenAI model, plus Jev as a separate decision model that picks the exact element to click or type into, so ordinary page work takes fewer, quicker steps. Needs a Jev key too."],
  ],
  MODEL_FIELD_CLASS =
    "w-full px-3 py-2 bg-bg-000 border border-border-200 rounded-lg font-base-sm text-text-100 focus:outline-none focus:border-accent-main-100";
function ModelsField({ id, label, hint, children }) {
  return (0, jsxRuntime.jsxs)("div", {
    className: "flex flex-col gap-1",
    children: [
      (0, jsxRuntime.jsx)("label", { htmlFor: id, className: "font-base-bold text-text-100", children: label }),
      children,
      hint && (0, jsxRuntime.jsx)("p", { className: "font-small text-text-300", children: hint }),
    ],
  });
}
function ModelsTab() {
  const [values, setValues] = (0, React.useState)(null),
    [status, setStatus] = (0, React.useState)("");
  (0, React.useEffect)(() => {
    loadSettings().then(setValues);
  }, []);
  if (!values)
    return (0, jsxRuntime.jsx)("div", {
      className: "flex flex-col items-center justify-center min-h-[200px]",
      children: (0, jsxRuntime.jsx)(Spinner, {}),
    });
  const set = (name) => (e) => (setValues((v) => ({ ...v, [name]: e.target.value })), setStatus("")),
    text = (name, extra = {}) =>
      (0, jsxRuntime.jsx)("input", {
        id: name,
        className: MODEL_FIELD_CLASS,
        value: values[name] ?? "",
        onChange: set(name),
        spellCheck: !1,
        autoComplete: "off",
        ...extra,
      }),
    select = (name, options) =>
      (0, jsxRuntime.jsx)("select", {
        id: name,
        className: MODEL_FIELD_CLASS,
        value: values[name],
        onChange: set(name),
        children: options.map(([value, label]) => (0, jsxRuntime.jsx)("option", { value, children: label }, value)),
      }),
    decision = "decision" === values.mode,
    save = async (e) => {
      e.preventDefault();
      const next = {};
      for (const name of Object.keys(SETTINGS_DEFAULTS)) next[name] = String(values[name] ?? "").trim() || SETTINGS_DEFAULTS[name];
      await saveSettings(next);
      setValues(await loadSettings());
      setStatus("Saved. Applies to your next message.");
    };
  return (0, jsxRuntime.jsxs)("form", {
    onSubmit: save,
    autoComplete: "off",
    className: "flex flex-col gap-6 max-w-xl",
    children: [
      (0, jsxRuntime.jsxs)("div", {
        className: "flex flex-col gap-2",
        children: [
          (0, jsxRuntime.jsx)("span", { className: "font-base-bold text-text-100", children: "Mode" }),
          MODES.map(([value, label, hint]) =>
            (0, jsxRuntime.jsxs)(
              "label",
              {
                className:
                  "flex gap-3 items-start p-3 rounded-lg border cursor-pointer " +
                  (values.mode === value ? "border-accent-main-100 bg-bg-100" : "border-border-200 bg-bg-000"),
                children: [
                  (0, jsxRuntime.jsx)("input", {
                    type: "radio",
                    name: "mode",
                    value,
                    checked: values.mode === value,
                    onChange: set("mode"),
                    className: "mt-1",
                  }),
                  (0, jsxRuntime.jsxs)("span", {
                    className: "flex flex-col",
                    children: [
                      (0, jsxRuntime.jsx)("span", { className: "font-base-bold text-text-100", children: label }),
                      (0, jsxRuntime.jsx)("span", { className: "font-small text-text-300", children: hint }),
                    ],
                  }),
                ],
              },
              value,
            ),
          ),
        ],
      }),
      (0, jsxRuntime.jsx)(ModelsField, {
        id: "openaiKey",
        label: "OpenAI API key",
        hint: "Sent only to api.openai.com.",
        children: text("openaiKey", { type: "password", placeholder: "sk-..." }),
      }),
      decision &&
        (0, jsxRuntime.jsx)(ModelsField, {
          id: "jevKey",
          label: "Jev API key (separate from OpenAI)",
          hint: "Chooses the next click, selection or scroll. Sent only to api.typesafe.ai.",
          children: text("jevKey", { type: "password", placeholder: "TypeSafe API key" }),
        }),
      (0, jsxRuntime.jsx)(ModelsField, {
        id: "agentModel",
        label: "OpenAI agent model",
        hint: "The GPT model that thinks, talks to you, reads screenshots and calls the browser tools. Needs tool calling and image input, for example gpt-5-mini, gpt-5 or gpt-4.1.",
        children: text("agentModel"),
      }),
      (0, jsxRuntime.jsx)(ModelsField, {
        id: "thinking",
        label: "Thinking",
        hint: "How hard reasoning models (GPT-5, o-series) think before answering or acting. Ignored by models that do not reason.",
        children: select("thinking", [["off", "Off (fastest)"], ["low", "Low"], ["medium", "Medium"], ["high", "High (slowest)"]]),
      }),
      (0, jsxRuntime.jsx)(ModelsField, {
        id: "textModel",
        label: "OpenAI typing model",
        hint: "Small and fast works best. Writes the text typed into fields when Jev is on, plus the panel's status line and chat titles.",
        children: text("textModel"),
      }),
      (0, jsxRuntime.jsx)(ModelsField, {
        id: "personality",
        label: "Personality",
        hint: "Only changes how Claus talks to you in the chat. Whatever it types into web pages stays clean.",
        children: select("personality", [["mean", "Mean (rude, swears, still gets it done)"], ["polite", "Polite"]]),
      }),
      decision &&
        (0, jsxRuntime.jsxs)("details", {
          children: [
            (0, jsxRuntime.jsx)("summary", { className: "cursor-pointer text-text-300", children: "Advanced" }),
            (0, jsxRuntime.jsxs)("div", {
              className: "flex flex-col gap-4 mt-3",
              children: [
                (0, jsxRuntime.jsx)(ModelsField, { id: "jevModel", label: "Jev model", children: text("jevModel") }),
                (0, jsxRuntime.jsx)(ModelsField, {
                  id: "jevImages",
                  label: "Send screenshots to Jev",
                  children: select("jevImages", [["off", "Off"], ["on", "On"]]),
                }),
              ],
            }),
          ],
        }),
      (0, jsxRuntime.jsxs)("div", {
        className: "flex items-center gap-3",
        children: [
          (0, jsxRuntime.jsx)("button", {
            type: "submit",
            className: "px-4 py-2 bg-brand-100 text-oncolor-100 rounded-lg font-base-bold hover:bg-brand-200 transition-colors",
            children: "Save",
          }),
          (0, jsxRuntime.jsx)("span", { role: "status", className: "font-small text-text-300", children: status }),
        ],
      }),
      (0, jsxRuntime.jsx)("p", {
        className: "font-small text-text-300",
        children:
          "Keys are stored only in this browser's extension storage. Claus talks only to OpenAI (and to Jev when it is on). Conversations live in the side panel for the session and are never saved; no account, no analytics, no error reporting.",
      }),
    ],
  });
}
function OptionsApp() {
  const internalTabContent = !1,
    // Claus: no account and no claude.ai skills, so there is no Scheduled tab and nothing to sign in to.
    skillsActive = !1,
    skillsLoaded = !0,
    [activeTab, setActiveTab] = (0, React.useState)("models"),
    [showMicrophoneModal, setShowMicrophoneModal] = (0, React.useState)(!1),
    [returnTabId, setReturnTabId] = (0, React.useState)();
  (0, React.useEffect)(() => {
      const e = () => {
          const [e, s] = window.location.hash.slice(1).split("?"),
            t = [
              "models",
              "permissions",
              "prompts",
              "scheduled",
              "options",
              "internal",
            ].includes(e)
              ? e
              : "models";
          let a,
            i = !1;
          if (s) {
            const e = new URLSearchParams(s);
            i = "true" === e.get("requestMicrophone");
            const t = e.get("returnTabId");
            t && (a = parseInt(t, 10));
          }
          return {
            tab: t,
            requestMicrophone: i,
            returnTabId: a,
          };
        },
        s = () => {
          const { tab: s, requestMicrophone: t, returnTabId: a } = e();
          setActiveTab(s), t && (setShowMicrophoneModal(!0), setReturnTabId(a));
        },
        { tab: t, requestMicrophone: a, returnTabId: i } = e();
      return (
        setActiveTab(t),
        a && (setShowMicrophoneModal(!0), setReturnTabId(i)),
        window.addEventListener("hashchange", s),
        () => {
          window.removeEventListener("hashchange", s);
        }
      );
    }, []);
  const selectTab = (e) => {
    setActiveTab(e), (window.location.hash = e);
  };
  (0, React.useEffect)(() => {
    "scheduled" === activeTab &&
      skillsLoaded &&
      !skillsActive &&
      (setActiveTab("prompts"), (window.location.hash = "prompts"));
  }, [activeTab, skillsLoaded, skillsActive]);
  return (0, jsxRuntime.jsxs)("div", {
    "data-theme": "claude",
    children: [
      (0, jsxRuntime.jsx)(PageHeader, {
        large: !0,
        sticky: !0,
        mdTitle: (0, jsxRuntime.jsx)("div", {
          className: "flex flex-col pl-3",
          children: (0, jsxRuntime.jsx)("span", { children: "Claus settings" }),
        }),
        children: [],
      }),
      (0, jsxRuntime.jsxs)(PageMain, {
        children: [
          (0, jsxRuntime.jsx)("div", {
            className: "mb-4 md:hidden pl-3",
            children: (0, jsxRuntime.jsx)("h1", {
              className: "font-heading text-text-200 flex items-center gap-1.5",
              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                defaultMessage: "Settings",
                id: "D3idYvSLF9",
              }),
            }),
          }),
          (0, jsxRuntime.jsxs)("div", {
                className:
                  "grid md:grid-cols-[220px_minmax(0px,_1fr)] gap-x-8 w-full max-w-6xl my-4 md:my-8",
                children: [
                  (0, jsxRuntime.jsxs)("nav", {
                    className:
                      "w-full overflow-x-auto -m-2 p-2 self-start md:sticky md:top-4 relative z-10 mb-4 md:mb-0",
                    children: [
                      (0, jsxRuntime.jsxs)("ul", {
                        className:
                          "flex gap-x-1 md:flex-col md:hit-gap-y-1 mb-0",
                        children: [
                          (0, jsxRuntime.jsx)("li", {
                            children: (0, jsxRuntime.jsx)(NavButton, {
                              isActive: "models" === activeTab,
                              onClick: () => selectTab("models"),
                              children: "Models",
                            }),
                          }),
                          (0, jsxRuntime.jsx)("li", {
                            children: (0, jsxRuntime.jsx)(NavButton, {
                              isActive: "permissions" === activeTab,
                              onClick: () => selectTab("permissions"),
                              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage: "Permissions",
                                id: "SFuk1vRI4X",
                              }),
                            }),
                          }),
                          (0, jsxRuntime.jsx)("li", {
                            children: (0, jsxRuntime.jsx)(NavButton, {
                              isActive: "prompts" === activeTab,
                              onClick: () => selectTab("prompts"),
                              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage: "Shortcuts",
                                id: "7FAwwkYilD",
                              }),
                            }),
                          }),
                          skillsActive &&
                            (0, jsxRuntime.jsx)("li", {
                              children: (0, jsxRuntime.jsx)(NavButton, {
                                isActive: "scheduled" === activeTab,
                                onClick: () => selectTab("scheduled"),
                                children: (0, jsxRuntime.jsx)(
                                  FormattedMessage,
                                  {
                                    defaultMessage: "Scheduled",
                                    id: "cXAlMRerxW",
                                  },
                                ),
                              }),
                            }),
                          (0, jsxRuntime.jsx)("li", {
                            children: (0, jsxRuntime.jsx)(NavButton, {
                              isActive: "options" === activeTab,
                              onClick: () => selectTab("options"),
                              children: (0, jsxRuntime.jsx)(FormattedMessage, {
                                defaultMessage: "Options",
                                id: "NDV5MqT9ww",
                              }),
                            }),
                          }),
                          internalTabContent,
                        ],
                      }),
                    ],
                  }),
                  (0, jsxRuntime.jsxs)("div", {
                    children: [
                      "models" === activeTab && (0, jsxRuntime.jsx)(ModelsTab, {}),
                      "permissions" === activeTab &&
                        (0, jsxRuntime.jsx)(PermissionsTab, {}),
                      "prompts" === activeTab &&
                        (0, jsxRuntime.jsx)(ShortcutsTab, {}),
                      "scheduled" === activeTab &&
                        skillsActive &&
                        (0, jsxRuntime.jsx)(ScheduledTab, {}),
                      "options" === activeTab &&
                        (0, jsxRuntime.jsx)(KeyboardShortcutSettings, {}),
                      "internal" === activeTab && internalTabContent,
                    ],
                  }),
                ],
              }),
        ],
      }),
      (0, jsxRuntime.jsx)(MicrophonePermissionModal, {
        isOpen: showMicrophoneModal,
        returnTabId,
        onClose: () => setShowMicrophoneModal(!1),
      }),
    ],
  });
}
/**
 * Entry point: initialise the page, then render <OptionsApp/> into #root
 * inside the shared provider wrapper.
 */
initPage(),
  ReactDomClient.createRoot(document.getElementById("root")).render(
    (0, jsxRuntime.jsx)(React.StrictMode, {
      children: (0, jsxRuntime.jsx)(PageProviders, {
        pageName: "Options",
        children: (0, jsxRuntime.jsx)(OptionsApp, {}),
      }),
    }),
  );
