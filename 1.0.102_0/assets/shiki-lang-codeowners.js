/**
 * @readable-header
 * FILE:      assets/shiki-lang-codeowners.js
 * WAS:       codeowners-Ni32Z74j.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "codeowners" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "codeowners" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var e = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"CODEOWNERS","name":"codeowners","patterns":[{"include":"#comment"},{"include":"#pattern"},{"include":"#owner"}],"repository":{"comment":{"patterns":[{"begin":"^\\\\s*#","captures":{"0":{"name":"punctuation.definition.comment.codeowners"}},"end":"$","name":"comment.line.codeowners"}]},"owner":{"match":"\\\\S*@\\\\S+","name":"storage.type.function.codeowners"},"pattern":{"match":"^\\\\s*(\\\\S+)","name":"variable.other.codeowners"}},"scopeName":"text.codeowners"}',
    ),
  ),
];
export { e as default };
