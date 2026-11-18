/**
 * @readable-header
 * FILE:      assets/shiki-lang-reg.js
 * WAS:       reg-u_4hSzWh.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "reg" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "reg" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var e = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"Windows Registry Script","fileTypes":["reg","REG"],"name":"reg","patterns":[{"match":"Windows Registry Editor Version 5\\\\.00|REGEDIT4","name":"keyword.control.import.reg"},{"captures":{"1":{"name":"punctuation.definition.comment.reg"}},"match":"(;).*$","name":"comment.line.semicolon.reg"},{"captures":{"1":{"name":"punctuation.definition.section.reg"},"2":{"name":"entity.section.reg"},"3":{"name":"punctuation.definition.section.reg"}},"match":"^\\\\s*(\\\\[(?!-))(.*?)(])","name":"entity.name.function.section.add.reg"},{"captures":{"1":{"name":"punctuation.definition.section.reg"},"2":{"name":"entity.section.reg"},"3":{"name":"punctuation.definition.section.reg"}},"match":"^\\\\s*(\\\\[-)(.*?)(])","name":"entity.name.function.section.delete.reg"},{"captures":{"2":{"name":"punctuation.definition.quote.reg"},"3":{"name":"support.function.regname.ini"},"4":{"name":"punctuation.definition.quote.reg"},"5":{"name":"punctuation.definition.equals.reg"},"7":{"name":"keyword.operator.arithmetic.minus.reg"},"9":{"name":"punctuation.definition.quote.reg"},"10":{"name":"string.name.regdata.reg"},"11":{"name":"punctuation.definition.quote.reg"},"13":{"name":"support.type.dword.reg"},"14":{"name":"keyword.operator.arithmetic.colon.reg"},"15":{"name":"constant.numeric.dword.reg"},"17":{"name":"support.type.dword.reg"},"18":{"name":"keyword.operator.arithmetic.parenthesis.reg"},"19":{"name":"keyword.operator.arithmetic.parenthesis.reg"},"20":{"name":"constant.numeric.hex.size.reg"},"21":{"name":"keyword.operator.arithmetic.parenthesis.reg"},"22":{"name":"keyword.operator.arithmetic.colon.reg"},"23":{"name":"constant.numeric.hex.reg"},"24":{"name":"keyword.operator.arithmetic.linecontinuation.reg"},"25":{"name":"comment.declarationline.semicolon.reg"}},"match":"^(\\\\s*([\\"\']?)(.+?)([\\"\']?)\\\\s*(=))?\\\\s*((-)|(([\\"\'])(.*?)([\\"\']))|(((?i:dword))(:)\\\\s*([A-Fa-f\\\\d]{1,8}))|(((?i:hex))((\\\\()(\\\\d*)(\\\\)))?(:)(.*?)(\\\\\\\\?)))\\\\s*(;.*)?$","name":"meta.declaration.reg"},{"match":"[0-9]+","name":"constant.numeric.reg"},{"match":"[A-Fa-f]+","name":"constant.numeric.hex.reg"},{"match":",+","name":"constant.numeric.hex.comma.reg"},{"match":"\\\\\\\\","name":"keyword.operator.arithmetic.linecontinuation.reg"}],"scopeName":"source.reg"}',
    ),
  ),
];
export { e as default };
