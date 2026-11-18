/**
 * @readable-header
 * FILE:      assets/shiki-lang-hy.js
 * WAS:       hy-B8jNIU-6.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "hy" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "hy" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var e = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"Hy","name":"hy","patterns":[{"include":"#all"}],"repository":{"all":{"patterns":[{"include":"#comment"},{"include":"#constants"},{"include":"#keywords"},{"include":"#strings"},{"include":"#operators"},{"include":"#keysym"},{"include":"#builtin"},{"include":"#symbol"}]},"builtin":{"patterns":[{"match":"(?<![-!$%\\\\&*./:<-@^_\\\\w])(abs|all|any|ascii|bin|breakpoint|callable|chr|compile|delattr|dir|divmod|eval|exec|format|getattr|globals|hasattr|hash|hex|id|input|isinstance|issubclass|iter|aiter|len|locals|max|min|next|anext|oct|ord|pow|print|repr|round|setattr|sorted|sum|vars|False|None|True|NotImplemented|bool|memoryview|bytearray|bytes|classmethod|complex|dict|enumerate|filter|float|frozenset|property|int|list|map|object|range|reversed|set|slice|staticmethod|str|super|tuple|type|zip|open|quit|exit|copyright|credits|help)(?![-!$%\\\\&*./:<-@^_\\\\w])","name":"storage.builtin.hy"},{"match":"(?<=\\\\(\\\\s*)\\\\.\\\\.\\\\.(?![-!$%\\\\&*./:<-@^_\\\\w])","name":"storage.builtin.dots.hy"}]},"comment":{"patterns":[{"match":"(;).*$","name":"comment.line.hy"}]},"constants":{"patterns":[{"match":"(?<=[(\\\\[{\\\\s])([0-9]+(\\\\.[0-9]+)?|(#x)\\\\h+|(#o)[0-7]+|(#b)[01]+)(?=[]\\"\'(),;\\\\[{}\\\\s])","name":"constant.numeric.hy"}]},"keysym":{"match":"(?<![-!$%\\\\&*./:<-@^_\\\\w]):[-!$%\\\\&*./:<-@^_\\\\w]*","name":"variable.other.constant"},"keywords":{"patterns":[{"match":"(?<![-!$%\\\\&*./:<-@^_\\\\w])(and|await|match|let|annotate|assert|break|chainc|cond|continue|deftype|do|except\\\\*?|finally|else|defreader|([dgls])?for|set[vx]|defclass|defmacro|del|export|eval-and-compile|eval-when-compile|get|global|if|import|(de)?fn|nonlocal|not-in|or|(quasi)?quote|require|return|cut|raise|try|unpack-iterable|unpack-mapping|unquote|unquote-splice|when|while|with|yield|local-macros|in|is|py(s)?|pragma|nonlocal|(is-)?not)(?![-!$%\\\\&*./:<-@^_\\\\w])","name":"keyword.control.hy"},{"match":"(?<=\\\\(\\\\s*)\\\\.(?![-!$%\\\\&*./:<-@^_\\\\w])","name":"keyword.control.dot.hy"}]},"operators":{"patterns":[{"match":"(?<![-!$%\\\\&*./:<-@^_\\\\w])(\\\\+=?|//?=?|\\\\*\\\\*?=?|--?=?|[!<>]?=|@=?|%=?|<<?=?|>>?=?|&=?|\\\\|=?|\\\\^|~@|~=?|#\\\\*\\\\*?)(?![-!$%\\\\&*./:<-@^_\\\\w])","name":"keyword.control.hy"}]},"strings":{"begin":"(f?\\"|}(?=\\\\N*?[\\"{]))","end":"(\\"|(?<=[\\"}]\\\\N*?)\\\\{)","name":"string.quoted.double.hy","patterns":[{"match":"\\\\\\\\.","name":"constant.character.escape.hy"}]},"symbol":{"match":"(?<![-!#-\\\\&*./:<-@^_\\\\w])[-!#$%*./<-Z^_a-zΑ-Ωα-ω][-!#-\\\\&*./:<-@^_\\\\w]*","name":"variable.other.hy"}},"scopeName":"source.hy"}',
    ),
  ),
];
export { e as default };
