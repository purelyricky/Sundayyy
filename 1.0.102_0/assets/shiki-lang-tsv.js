/**
 * @readable-header
 * FILE:      assets/shiki-lang-tsv.js
 * WAS:       tsv-BlhQxMKn.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "tsv" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "tsv" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var t = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"TSV","fileTypes":["tsv","tab"],"name":"tsv","patterns":[{"captures":{"1":{"name":"rainbow1"},"2":{"name":"keyword.rainbow2"},"3":{"name":"entity.name.function.rainbow3"},"4":{"name":"comment.rainbow4"},"5":{"name":"string.rainbow5"},"6":{"name":"variable.parameter.rainbow6"},"7":{"name":"constant.numeric.rainbow7"},"8":{"name":"entity.name.type.rainbow8"},"9":{"name":"markup.bold.rainbow9"},"10":{"name":"invalid.rainbow10"}},"match":"([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)([^\\\\t]*\\\\t?)","name":"rainbowgroup"}],"scopeName":"text.tsv"}',
    ),
  ),
];
export { t as default };
