/**
 * @readable-header
 * FILE:      assets/shiki-lang-csv.js
 * WAS:       csv-D00qLzLg.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "csv" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "csv" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-lang-hurl.js (static import)
 *            assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var a = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"CSV","fileTypes":["csv"],"name":"csv","patterns":[{"captures":{"1":{"name":"rainbow1"},"2":{"name":"keyword.rainbow2"},"3":{"name":"entity.name.function.rainbow3"},"4":{"name":"comment.rainbow4"},"5":{"name":"string.rainbow5"},"6":{"name":"variable.parameter.rainbow6"},"7":{"name":"constant.numeric.rainbow7"},"8":{"name":"entity.name.type.rainbow8"},"9":{"name":"markup.bold.rainbow9"},"10":{"name":"invalid.rainbow10"}},"match":"( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?( *\\"(?:[^\\"]*\\"\\")*[^\\"]*\\" *(?:,|$)|[^,]*(?:,|$))?","name":"rainbowgroup"}],"scopeName":"text.csv"}',
    ),
  ),
];
export { a as default };
