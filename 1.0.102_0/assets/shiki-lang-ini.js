/**
 * @readable-header
 * FILE:      assets/shiki-lang-ini.js
 * WAS:       ini-BQPWM8ug.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "ini" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "ini" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var n = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"INI","name":"ini","patterns":[{"begin":"(^[\\\\t ]+)?(?=#)","beginCaptures":{"1":{"name":"punctuation.whitespace.comment.leading.ini"}},"end":"(?!\\\\G)","patterns":[{"begin":"#","beginCaptures":{"0":{"name":"punctuation.definition.comment.ini"}},"end":"\\\\n","name":"comment.line.number-sign.ini"}]},{"begin":"(^[\\\\t ]+)?(?=;)","beginCaptures":{"1":{"name":"punctuation.whitespace.comment.leading.ini"}},"end":"(?!\\\\G)","patterns":[{"begin":";","beginCaptures":{"0":{"name":"punctuation.definition.comment.ini"}},"end":"\\\\n","name":"comment.line.semicolon.ini"}]},{"captures":{"1":{"name":"keyword.other.definition.ini"},"2":{"name":"punctuation.separator.key-value.ini"}},"match":"\\\\b([-.0-9A-Z_a-z]+)\\\\b\\\\s*(=)"},{"captures":{"1":{"name":"punctuation.definition.entity.ini"},"3":{"name":"punctuation.definition.entity.ini"}},"match":"^(\\\\[)(.*?)(])","name":"entity.name.section.group-title.ini"},{"begin":"\'","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.ini"}},"end":"\'","endCaptures":{"0":{"name":"punctuation.definition.string.end.ini"}},"name":"string.quoted.single.ini","patterns":[{"match":"\\\\\\\\.","name":"constant.character.escape.ini"}]},{"begin":"\\"","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.ini"}},"end":"\\"","endCaptures":{"0":{"name":"punctuation.definition.string.end.ini"}},"name":"string.quoted.double.ini"}],"scopeName":"source.ini","aliases":["properties"]}',
    ),
  ),
];
export { n as default };
