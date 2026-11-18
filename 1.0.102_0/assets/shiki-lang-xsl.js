/**
 * @readable-header
 * FILE:      assets/shiki-lang-xsl.js
 * WAS:       xsl-CUWXgJFQ.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "xsl" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "xsl" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-xml.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import { t as e } from "./shiki-lang-xml.js";
var n = [
  ...e,
  Object.freeze(
    JSON.parse(
      '{"displayName":"XSL","name":"xsl","patterns":[{"begin":"(<)(xsl)((:))(template)","captures":{"1":{"name":"punctuation.definition.tag.xml"},"2":{"name":"entity.name.tag.namespace.xml"},"3":{"name":"entity.name.tag.xml"},"4":{"name":"punctuation.separator.namespace.xml"},"5":{"name":"entity.name.tag.localname.xml"}},"end":"(>)","name":"meta.tag.xml.template","patterns":[{"captures":{"1":{"name":"entity.other.attribute-name.namespace.xml"},"2":{"name":"entity.other.attribute-name.xml"},"3":{"name":"punctuation.separator.namespace.xml"},"4":{"name":"entity.other.attribute-name.localname.xml"}},"match":" (?:([-0-9A-Z_a-z]+)((:)))?([-A-Za-z]+)"},{"include":"#doublequotedString"},{"include":"#singlequotedString"}]},{"include":"text.xml"}],"repository":{"doublequotedString":{"begin":"\\"","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.xml"}},"end":"\\"","endCaptures":{"0":{"name":"punctuation.definition.string.end.xml"}},"name":"string.quoted.double.xml"},"singlequotedString":{"begin":"\'","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.xml"}},"end":"\'","endCaptures":{"0":{"name":"punctuation.definition.string.end.xml"}},"name":"string.quoted.single.xml"}},"scopeName":"text.xml.xsl","embeddedLangs":["xml"]}',
    ),
  ),
];
export { n as default };
