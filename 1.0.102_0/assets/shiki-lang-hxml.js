/**
 * @readable-header
 * FILE:      assets/shiki-lang-hxml.js
 * WAS:       hxml-7-5tIoln.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "hxml" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "hxml" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-haxe.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import e from "./shiki-lang-haxe.js";
var a = [
  ...e,
  Object.freeze(
    JSON.parse(
      '{"displayName":"HXML","fileTypes":["hxml"],"foldingStartMarker":"--next","foldingStopMarker":"\\\\n\\\\n","name":"hxml","patterns":[{"captures":{"1":{"name":"punctuation.definition.comment.hxml"}},"match":"(#).*$\\\\n?","name":"comment.line.number-sign.hxml"},{"begin":"(?<!\\\\w)(--macro)\\\\b","beginCaptures":{"1":{"name":"keyword.other.hxml"}},"end":"\\\\n","patterns":[{"include":"source.hx#block-contents"}]},{"captures":{"1":{"name":"keyword.other.hxml"},"2":{"name":"support.package.hx"},"4":{"name":"entity.name.type.hx"}},"match":"(?<!\\\\w)(-(?:m|main|-main|-run))\\\\b\\\\s*\\\\b(?:(([a-z][0-9A-Za-z]*\\\\.)*)(_*[A-Z]\\\\w*))?\\\\b"},{"captures":{"1":{"name":"keyword.other.hxml"}},"match":"(?<!\\\\w)(-(?:cppia|cpp?|js|as3|swf-(header|version|lib(-extern)?)|swf9?|neko|python|php|cs|java-lib|java|xml|lua|hl|x|lib|D|resource|exclude|version|v|debug|prompt|cmd|dce\\\\s+(std|full|no)?|-flash-strict|-no-traces|-flash-use-stage|-neko-source|-gen-hx-classes|net-lib|net-std|c-arg|-each|-next|-display|-no-output|-times|-no-inline|-no-opt|-php-front|-php-lib|-php-prefix|-remap|-help-defines|-help-metas|help|-help|java|cs|-js-modern|-interp|-eval|-dce|-wait|-connect|-cwd|-run)).*$"},{"captures":{"1":{"name":"keyword.other.hxml"}},"match":"(?<!\\\\w)(-(?:-js(on)?|-lua|-swf-(header|version|lib(-extern)?)|-swf|-as3|-neko|-php|-cppia|-cpp|-cppia|-cs|-java-lib(-extern)?|-java|-jvm|-python|-hl|p|-class-path|L|-library|-define|r|-resource|-cmd|C|-verbose|-debug|-prompt|-xml|-json|-net-lib|-net-std|-c-arg|-version|-haxelib-global|h|-main|-server-connect|-server-listen)).*$"}],"scopeName":"source.hxml","embeddedLangs":["haxe"]}',
    ),
  ),
];
export { a as default };
