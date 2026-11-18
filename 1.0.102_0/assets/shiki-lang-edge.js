/**
 * @readable-header
 * FILE:      assets/shiki-lang-edge.js
 * WAS:       edge-BnRmi4Xu.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "edge" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "edge" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-html-derivative.js (static import)
 *            assets/shiki-lang-html.js (static import)
 *            assets/shiki-lang-typescript.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import { t as e } from "./shiki-lang-html.js";
import { t } from "./shiki-lang-typescript.js";
import n from "./shiki-lang-html-derivative.js";
var a = [
  ...t,
  ...e,
  ...n,
  Object.freeze(
    JSON.parse(
      '{"displayName":"Edge","injections":{"text.html.edge - (meta.embedded | meta.tag | comment.block.edge), L:(text.html.edge meta.tag - (comment.block.edge | meta.embedded.block.edge)), L:(source.ts.embedded.html - (comment.block.edge | meta.embedded.block.edge))":{"patterns":[{"include":"#comment"},{"include":"#escapedMustache"},{"include":"#safeMustache"},{"include":"#mustache"},{"include":"#nonSeekableTag"},{"include":"#tag"}]}},"name":"edge","patterns":[{"include":"text.html.basic"},{"include":"text.html.derivative"}],"repository":{"comment":{"begin":"\\\\{\\\\{--","beginCaptures":{"0":{"name":"punctuation.definition.comment.begin.edge"}},"end":"--}}","endCaptures":{"0":{"name":"punctuation.definition.comment.end.edge"}},"name":"comment.block"},"escapedMustache":{"begin":"@\\\\{\\\\{","beginCaptures":{"0":{"name":"punctuation.definition.comment.begin.edge"}},"end":"}}","endCaptures":{"0":{"name":"punctuation.definition.comment.end.edge"}},"name":"comment.block"},"mustache":{"begin":"\\\\{\\\\{","beginCaptures":{"0":{"name":"punctuation.mustache.begin"}},"end":"}}","endCaptures":{"0":{"name":"punctuation.mustache.end"}},"name":"meta.embedded.block.javascript","patterns":[{"include":"source.ts#expression"}]},"nonSeekableTag":{"captures":{"2":{"name":"support.function.edge"}},"match":"^(\\\\s*)((@{1,2})(!)?([.A-Z_a-z]+))(~)?$","name":"meta.embedded.block.javascript","patterns":[{"include":"source.ts#expression"}]},"safeMustache":{"begin":"\\\\{\\\\{\\\\{","beginCaptures":{"0":{"name":"punctuation.mustache.begin"}},"end":"}}}","endCaptures":{"0":{"name":"punctuation.mustache.end"}},"name":"meta.embedded.block.javascript","patterns":[{"include":"source.ts#expression"}]},"tag":{"begin":"^(\\\\s*)((@{1,2})(!)?([.A-Z_a-z]+)(\\\\s{0,2}))(\\\\()","beginCaptures":{"2":{"name":"support.function.edge"},"7":{"name":"punctuation.paren.open"}},"end":"\\\\)","endCaptures":{"0":{"name":"punctuation.paren.close"}},"name":"meta.embedded.block.javascript","patterns":[{"include":"source.ts#expression"}]}},"scopeName":"text.html.edge","embeddedLangs":["typescript","html","html-derivative"]}',
    ),
  ),
];
export { a as default };
