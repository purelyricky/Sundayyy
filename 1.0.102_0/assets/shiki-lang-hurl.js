/**
 * @readable-header
 * FILE:      assets/shiki-lang-hurl.js
 * WAS:       hurl-DFZHUQMI.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "hurl" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "hurl" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-csv.js (static import)
 *            assets/shiki-lang-graphql.js (static import)
 *            assets/shiki-lang-xml.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import { t as e } from "./shiki-lang-xml.js";
import t from "./shiki-lang-csv.js";
import { t as n } from "./shiki-lang-graphql.js";
var a = [
  ...n,
  ...e,
  ...t,
  Object.freeze(
    JSON.parse(
      '{"displayName":"Hurl","name":"hurl","patterns":[{"include":"#comments"},{"include":"#sections"},{"include":"#http"},{"include":"#strings"},{"include":"#body"},{"include":"#request"}],"repository":{"body":{"patterns":[{"begin":"```graphql(,\\\\w+)*$","beginCaptures":{"1":{"name":"support.type"}},"end":"```$","name":"meta.embedded.block.graphql.hurl","patterns":[{"include":"source.graphql"}]},{"begin":"```xml(,\\\\w+)*$","beginCaptures":{"1":{"name":"support.type"}},"end":"```$","name":"meta.embedded.block.xml.hurl","patterns":[{"include":"text.xml"}]},{"begin":"```json(,\\\\w+)*$","beginCaptures":{"1":{"name":"support.type"}},"end":"```$","name":"meta.embedded.block.json.hurl","patterns":[{"include":"text.json"}]},{"begin":"```csv(,\\\\w+)*$","beginCaptures":{"1":{"name":"support.type"}},"end":"```$","name":"meta.embedded.block.csv.hurl","patterns":[{"include":"text.csv"}]},{"begin":"```hex(,\\\\w+)*$","beginCaptures":{"1":{"name":"support.type"}},"contentName":"text.plain","end":"```$","name":"string.quoted.multiline.hurl"},{"begin":"```base64(,\\\\w+)*$","beginCaptures":{"1":{"name":"support.type"}},"contentName":"text.plain","end":"```$","name":"string.quoted.multiline.hurl"},{"begin":"```([^,]*)(,\\\\w+)*$","beginCaptures":{"1":{"name":"support.type"},"2":{"name":"support.type"}},"end":"```$","name":"string.quoted.multiline.hurl"},{"match":"`(\\\\\\\\.|[^\\\\\\\\`])*`","name":"string.quoted.backtick.hurl","patterns":[{"include":"#escapes"}]},{"begin":"\\\\b(base64|hex),","beginCaptures":{"1":{"name":"support.function.name"}},"contentName":"text.plain","end":";","endCaptures":{"0":{"name":"support.function"}},"name":"support.function","patterns":[{"include":"#placeholders"}]}]},"comments":{"patterns":[{"match":"#.*$","name":"comment.line.number-sign.hurl"}]},"escapes":{"patterns":[{"match":"\\\\\\\\[\\"#\\\\\\\\`bnrtu]","name":"constant.character.escape.hurl"}]},"http":{"patterns":[{"captures":{"1":{"name":"constant.language.version.hurl"},"3":{"name":"constant.numeric.status.hurl"}},"match":"\\\\b(HTTP(/(?:1\\\\.0|1\\\\.1|2))?)([\\\\t ]+([0-9]{3}))?\\\\b"}]},"placeholders":{"patterns":[{"begin":"(\\\\{\\\\{)\\\\s*","beginCaptures":{"1":{"name":"string.interpolated.hurl"}},"contentName":"variable.other.hurl","end":"\\\\s*(}})","endCaptures":{"1":{"name":"string.interpolated.hurl"}}}]},"request":{"patterns":[{"match":"\\\\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|TRACE|CONNECT)\\\\b","name":"keyword.control.method.hurl"},{"captures":{"1":{"name":"string.unquoted.url.hurl","patterns":[{"include":"#placeholders"}]}},"match":"(https?://[^\\\\t\\\\n]+)\\\\s*$","name":"string.unquoted.url.hurl"},{"begin":"^([-0-9A-Za-z]+)(:)\\\\s*","beginCaptures":{"1":{"name":"entity.name.tag.header.hurl"},"2":{"name":"punctuation.separator.key-value.hurl"}},"contentName":"string.unquoted.hurl","end":"$","name":"entity.name.tag.header.hurl","patterns":[{"include":"#placeholders"}]}]},"sections":{"patterns":[{"match":"^\\\\s*\\\\[(QueryStringParams|Query|FormParams|Form|MultipartFormData|Multipart|Cookies|Captures|Asserts|BasicAuth|Options)]","name":"entity.name.section.hurl"}]},"strings":{"patterns":[{"match":"\\"(\\\\\\\\.|[^\\"\\\\\\\\])*\\"","name":"string.quoted.double.hurl","patterns":[{"include":"#escapes"}]}]}},"scopeName":"source.hurl","embeddedLangs":["graphql","xml","csv"]}',
    ),
  ),
];
export { a as default };
