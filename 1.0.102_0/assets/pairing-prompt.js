/**
 * @readable-header
 * FILE:      assets/pairing-prompt.js
 * WAS:       PairingPrompt-CQ6wAA2R.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     anthropic-extension
 * WHAT:      React PairingPrompt card component (name your browser, Ignore/Connect).
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/pairing-page.js (static import)
 *            assets/sidepanel.js (static import)
 *            pairing.html (html tag)
 *            sidepanel.html (html tag)
 * NEEDS:     assets/i18n.js (static import)
 *            assets/react-vendor-and-language-list.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
/**
 * PairingPrompt (React component, used by pairing.js)
 *
 * The card shown on the pairing page: "<client> wants to connect", a text box
 * to name this browser ("Work laptop"...), and Ignore / Connect buttons.
 * Enter in the text box = Connect; Connect is disabled while the name is blank.
 *
 * Purely UI: it calls the onConfirm(requestId, trimmedName) / onDismiss(requestId)
 * callbacks passed in by pairing.js. No network, no messaging, no page access.
 * Text is rendered through react-intl (useIntl / FormattedMessage from the
 * i18n chunk).
 *
 * Exported as `t` (the name pairing.js imports).
 */
import {
  a as getJsxRuntime,
  o as getReact,
  u as toEsm,
} from "./react-vendor-and-language-list.js";
import { i as useIntl, r as FormattedMessage } from "./i18n.js";
var React = toEsm(getReact(), 1),
  jsx = getJsxRuntime(),
  CLIENT_LABELS = new Map([
    ["desktop", "Claus Desktop"],
    ["claude-code", "Claus Code"],
    ["claude-ai", "claude.ai"],
  ]);

function PairingPrompt({
  requestId,
  clientType,
  currentName,
  onConfirm,
  onDismiss,
}) {
  const intl = useIntl(),
    [name, setName] = (0, React.useState)(currentName || ""),
    nameInputRef = (0, React.useRef)(null);
  (0, React.useEffect)(() => {
    nameInputRef.current?.focus();
  }, []);
  const confirm = (0, React.useCallback)(() => {
      const trimmedName = name.trim();
      trimmedName && onConfirm(requestId, trimmedName);
    }, [name, requestId, onConfirm]),
    handleKeyDown = (0, React.useCallback)(
      (event) => {
        "Enter" === event.key && confirm();
      },
      [confirm],
    ),
    clientLabel = (function (type) {
      return CLIENT_LABELS.get(type) ?? "Claus Desktop";
    })(clientType);
  return (0, jsx.jsxs)("div", {
    className:
      "flex flex-col gap-4 p-5 bg-bg-100 rounded-xl border border-border-300 shadow-lg",
    children: [
      (0, jsx.jsxs)("div", {
        className: "flex flex-col gap-1",
        children: [
          (0, jsx.jsx)("h3", {
            className: "text-base font-medium text-text-000",
            children: (0, jsx.jsx)(FormattedMessage, {
              defaultMessage: "{clientLabel} wants to connect",
              id: "NkHG2fB0cW",
              values: { clientLabel: clientLabel },
            }),
          }),
          (0, jsx.jsx)("p", {
            className: "text-sm text-text-300",
            children: (0, jsx.jsx)(FormattedMessage, {
              defaultMessage: "Name this browser so you can identify it later.",
              id: "nF7/NB+ws3",
            }),
          }),
        ],
      }),
      (0, jsx.jsx)("input", {
        ref: nameInputRef,
        type: "text",
        value: name,
        onChange: (event) => setName(event.target.value),
        onKeyDown: handleKeyDown,
        placeholder: intl.formatMessage({
          defaultMessage: "e.g., “Work laptop”, “Personal Chrome”",
          id: "zKRr/Mr9ip",
        }),
        className:
          "w-full px-3 py-2 text-sm rounded-lg border border-border-300 bg-bg-000 text-text-000 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-transparent",
      }),
      (0, jsx.jsxs)("div", {
        className: "flex gap-2 justify-end",
        children: [
          (0, jsx.jsx)("button", {
            onClick: () => onDismiss(requestId),
            className:
              "px-4 py-2 text-sm rounded-lg border border-border-300 text-text-200 hover:bg-bg-200 transition-colors",
            children: (0, jsx.jsx)(FormattedMessage, {
              defaultMessage: "Ignore",
              id: "paBpxNk4t8",
            }),
          }),
          (0, jsx.jsx)("button", {
            onClick: confirm,
            disabled: !name.trim(),
            className:
              "px-4 py-2 text-sm rounded-lg bg-brand-100 text-oncolor-100 hover:bg-brand-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            children: (0, jsx.jsx)(FormattedMessage, {
              defaultMessage: "Connect",
              id: "+vVZ/G11Zg",
            }),
          }),
        ],
      }),
    ],
  });
}
export { PairingPrompt as t };
