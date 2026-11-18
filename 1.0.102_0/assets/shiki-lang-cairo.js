/**
 * @readable-header
 * FILE:      assets/shiki-lang-cairo.js
 * WAS:       cairo-jU7b2cQC.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "cairo" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "cairo" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-python.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import e from "./shiki-lang-python.js";
var n = [
  ...e,
  Object.freeze(
    JSON.parse(
      '{"displayName":"Cairo","name":"cairo","patterns":[{"begin":"\\\\b(if).*\\\\(","beginCaptures":{"1":{"name":"keyword.control.if"},"2":{"name":"entity.name.condition"}},"contentName":"source.cairo0","end":"}","endCaptures":{"0":{"name":"keyword.control.end"}},"name":"meta.control.if","patterns":[{"include":"source.cairo0"}]},{"begin":"\\\\b(with)\\\\s+(.+)\\\\s*\\\\{","beginCaptures":{"1":{"name":"keyword.control.with"},"2":{"name":"entity.name.identifiers"}},"contentName":"source.cairo0","end":"}","endCaptures":{"0":{"name":"keyword.control.end"}},"name":"meta.control.with","patterns":[{"include":"source.cairo0"}]},{"begin":"\\\\b(with_attr)\\\\s+([A-Z_a-z][0-9A-Z_a-z]*)\\\\s*[({]","beginCaptures":{"1":{"name":"keyword.control.with_attr"},"2":{"name":"entity.name.function"}},"contentName":"source.cairo0","end":"}","endCaptures":{"0":{"name":"keyword.control.end"}},"name":"meta.control.with_attr","patterns":[{"include":"source.cairo0"}]},{"match":"\\\\belse\\\\b","name":"keyword.control.else"},{"match":"\\\\b(call|jmp|ret|abs|rel|if)\\\\b","name":"keyword.other.opcode"},{"match":"\\\\b([af]p)\\\\b","name":"keyword.other.register"},{"match":"\\\\b(const|let|local|tempvar|felt|as|from|import|static_assert|return|assert|cast|alloc_locals|with|with_attr|nondet|dw|codeoffset|new|using|and)\\\\b","name":"keyword.other.meta"},{"match":"\\\\b(SIZE(?:OF_LOCALS|))\\\\b","name":"markup.italic"},{"match":"//[^\\\\n]*\\\\n","name":"comment.line.sharp"},{"match":"\\\\b[A-Z_a-z][0-9A-Z_a-z]*:\\\\s*$","name":"entity.name.function"},{"begin":"\\\\b(func)\\\\s+([A-Z_a-z][0-9A-Z_a-z]*)\\\\s*[({]","beginCaptures":{"1":{"name":"storage.type.function.cairo"},"2":{"name":"entity.name.function"}},"contentName":"source.cairo0","end":"}","endCaptures":{"0":{"name":"storage.type.function.cairo"}},"name":"meta.function.cairo","patterns":[{"include":"source.cairo0"}]},{"begin":"\\\\b(struct|namespace)\\\\s+([A-Z_a-z][0-9A-Z_a-z]*)\\\\s*\\\\{","beginCaptures":{"1":{"name":"storage.type.function.cairo"},"2":{"name":"entity.name.function"}},"contentName":"source.cairo0","end":"}","endCaptures":{"0":{"name":"storage.type.function.cairo"}},"name":"meta.function.cairo","patterns":[{"include":"source.cairo0"}]},{"match":"\\\\b[-+]?[0-9]+\\\\b","name":"constant.numeric.decimal"},{"match":"\\\\b[-+]?0x\\\\h+\\\\b","name":"constant.numeric.hexadecimal"},{"match":"\'[^\']*\'","name":"string.quoted.single"},{"match":"\\"[^\\"]*\\"","name":"string.quoted.double"},{"begin":"%\\\\{","beginCaptures":{"0":{"name":"punctuation.section.embedded.begin.python"}},"contentName":"source.python","end":"%}","endCaptures":{"0":{"name":"punctuation.section.embedded.end.python"},"1":{"name":"source.python"}},"name":"meta.embedded.block.python","patterns":[{"include":"source.python"}]}],"scopeName":"source.cairo0","embeddedLangs":["python"]}',
    ),
  ),
];
export { n as default };
