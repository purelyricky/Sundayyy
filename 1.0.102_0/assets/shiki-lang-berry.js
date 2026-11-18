/**
 * @readable-header
 * FILE:      assets/shiki-lang-berry.js
 * WAS:       berry-B2RC3RO_.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "berry" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "berry" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var e = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"Berry","name":"berry","patterns":[{"include":"#controls"},{"include":"#strings"},{"include":"#comment-block"},{"include":"#comments"},{"include":"#keywords"},{"include":"#function"},{"include":"#member"},{"include":"#identifier"},{"include":"#number"},{"include":"#operator"}],"repository":{"comment-block":{"begin":"#-","end":"-#","name":"comment.berry","patterns":[{}]},"comments":{"begin":"#","end":"\\\\n","name":"comment.line.berry","patterns":[{}]},"controls":{"patterns":[{"match":"\\\\b(if|elif|else|for|while|do|end|break|continue|return|try|except|raise)\\\\b","name":"keyword.control.berry"}]},"function":{"patterns":[{"match":"\\\\b([A-Z_a-z][0-9A-Z_a-z]*(?=\\\\s*\\\\())","name":"entity.name.function.berry"}]},"identifier":{"patterns":[{"match":"\\\\b[A-Z_a-z]\\\\w+\\\\b","name":"identifier.berry"}]},"keywords":{"patterns":[{"match":"\\\\b(var|static|def|class|true|false|nil|self|super|import|as|_class)\\\\b","name":"keyword.berry"}]},"member":{"patterns":[{"captures":{"0":{"name":"entity.other.attribute-name.berry"}},"match":"\\\\.([A-Z_a-z][0-9A-Z_a-z]*)"}]},"number":{"patterns":[{"match":"0x\\\\h+|\\\\d+|(\\\\d+\\\\.?|\\\\.\\\\d)\\\\d*([Ee][-+]?\\\\d+)?","name":"constant.numeric.berry"}]},"operator":{"patterns":[{"match":"[-\\\\]!%\\\\&(-+./:<=>\\\\[^|~]","name":"keyword.operator.berry"}]},"strings":{"patterns":[{"begin":"f(?=[\\"\'])","patterns":[{"begin":"\\"","end":"\\"","name":"string.quoted.other.berry","patterns":[{"match":"(\\\\\\\\x\\\\h{2})|(\\\\\\\\[0-7]{3})|(\\\\\\\\\\\\\\\\)|(\\\\\\\\\\")|(\\\\\\\\\')|(\\\\\\\\a)|(\\\\\\\\b)|(\\\\\\\\f)|(\\\\\\\\n)|(\\\\\\\\r)|(\\\\\\\\t)|(\\\\\\\\v)","name":"constant.character.escape.berry"},{"match":"\\\\{\\\\{[^}]*}}","name":"string.quoted.other.berry"},{"begin":"\\\\{","end":"}","name":"keyword.other.unit.berry","patterns":[{"include":"#keywords"},{"include":"#numbers"},{"include":"#identifier"},{"include":"#operator"},{"include":"#member"},{"include":"#function"}]}]},{"begin":"\'","end":"\'","name":"string.quoted.other.berry","patterns":[{"match":"(\\\\\\\\x\\\\h{2})|(\\\\\\\\[0-7]{3})|(\\\\\\\\\\\\\\\\)|(\\\\\\\\\\")|(\\\\\\\\\')|(\\\\\\\\a)|(\\\\\\\\b)|(\\\\\\\\f)|(\\\\\\\\n)|(\\\\\\\\r)|(\\\\\\\\t)|(\\\\\\\\v)","name":"constant.character.escape.berry"},{"match":"\\\\{\\\\{[^}]*}}","name":"string.quoted.other.berry"},{"begin":"\\\\{","end":"}","name":"keyword.other.unit.berry","patterns":[{"include":"#keywords"},{"include":"#numbers"},{"include":"#identifier"},{"include":"#operator"},{"include":"#member"},{"include":"#function"}]}]}],"while":"\\\\G|^[\\\\t ]*(?=[\\"\'])"},{"begin":"([\\"\'])","end":"\\\\1","name":"string.quoted.double.berry","patterns":[{"match":"(\\\\\\\\x\\\\h{2})|(\\\\\\\\[0-7]{3})|(\\\\\\\\\\\\\\\\)|(\\\\\\\\\\")|(\\\\\\\\\')|(\\\\\\\\a)|(\\\\\\\\b)|(\\\\\\\\f)|(\\\\\\\\n)|(\\\\\\\\r)|(\\\\\\\\t)|(\\\\\\\\v)","name":"constant.character.escape.berry"}]}]}},"scopeName":"source.berry","aliases":["be"]}',
    ),
  ),
];
export { e as default };
