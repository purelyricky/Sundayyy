/**
 * @readable-header
 * FILE:      assets/anthropic-sdk-node-browser-fs-path-stub.js
 * WAS:       node.browser-CNXU8uHP.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/browser-tools-and-permissions.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/anthropic-sdk-errors.js (static import)
 * EXPORTS:   fs, path  (export names are unchanged from the original; other files import them by these names)
 */
import { a as e } from "./anthropic-sdk-errors.js";
function t(t) {
  return new Proxy(
    {},
    {
      get(o, r) {
        if ("symbol" != typeof r)
          throw new e(
            `\`${t}.${r}\` is not available in this environment; it needs a Node.js-compatible runtime`,
          );
      },
    },
  );
}
var o = t("fs"),
  r = t("path");
export { o as fs, r as path };
