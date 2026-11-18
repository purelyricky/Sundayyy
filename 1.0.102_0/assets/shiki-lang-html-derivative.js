/**
 * @readable-header
 * FILE:      assets/shiki-lang-html-derivative.js
 * WAS:       html-derivative-CQRc9W-b.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "html-derivative" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "html-derivative" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-lang-blade.js (static import)
 *            assets/shiki-lang-edge.js (static import)
 *            assets/shiki-lang-mdc.js (static import)
 *            assets/shiki-lang-rst.js (static import)
 *            assets/shiki-lang-vue.js (static import)
 *            assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-html.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import { t } from "./shiki-lang-html.js";
var e = [
  ...t,
  Object.freeze(
    JSON.parse(
      '{"displayName":"HTML (Derivative)","injections":{"R:text.html - (comment.block, text.html meta.embedded, meta.tag.*.*.html, meta.tag.*.*.*.html, meta.tag.*.*.*.*.html)":{"patterns":[{"match":"<","name":"invalid.illegal.bad-angle-bracket.html"}]}},"name":"html-derivative","patterns":[{"include":"text.html.basic#core-minus-invalid"},{"begin":"(</?)(\\\\w[^<>\\\\s]*)(?<!/)","beginCaptures":{"1":{"name":"punctuation.definition.tag.begin.html"},"2":{"name":"entity.name.tag.html"}},"end":"((?: ?/)?>)","endCaptures":{"1":{"name":"punctuation.definition.tag.end.html"}},"name":"meta.tag.other.unrecognized.html.derivative","patterns":[{"include":"text.html.basic#attribute"}]}],"scopeName":"text.html.derivative","embeddedLangs":["html"]}',
    ),
  ),
];
export { e as default };
