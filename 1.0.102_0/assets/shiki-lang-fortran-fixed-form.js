/**
 * @readable-header
 * FILE:      assets/shiki-lang-fortran-fixed-form.js
 * WAS:       fortran-fixed-form-p9QJ0RP5.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "fortran-fixed-form" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "fortran-fixed-form" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-fortran-free-form.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import e from "./shiki-lang-fortran-free-form.js";
var n = [
  ...e,
  Object.freeze(
    JSON.parse(
      '{"displayName":"Fortran (Fixed Form)","fileTypes":["f","F","f77","F77","for","FOR"],"injections":{"source.fortran.fixed - ( string | comment )":{"patterns":[{"include":"#line-header"},{"include":"#line-end-comment"}]}},"name":"fortran-fixed-form","patterns":[{"include":"#comments"},{"begin":"(?i)^(?=.{5}|(?<!^)\\\\t)\\\\s*(?:([0-9]{1,5})\\\\s+)?(format)\\\\b","beginCaptures":{"1":{"name":"constant.numeric.fortran"},"2":{"name":"keyword.control.format.fortran"}},"end":"(?=^(?![^\\\\n!#]{5}\\\\S))","name":"meta.statement.IO.fortran","patterns":[{"include":"#comments"},{"include":"#line-header"},{"match":"!.*$","name":"comment.line.fortran"},{"include":"source.fortran.free#string-constant"},{"include":"source.fortran.free#numeric-constant"},{"include":"source.fortran.free#operators"},{"include":"source.fortran.free#format-parentheses"}]},{"include":"#line-header"},{"include":"source.fortran.free"}],"repository":{"comments":{"patterns":[{"begin":"^[*Cc]","end":"\\\\n","name":"comment.line.fortran"},{"begin":"^ *!","end":"\\\\n","name":"comment.line.fortran"}]},"line-end-comment":{"begin":"(?<=^.{72})(?!\\\\n)","end":"(?=\\\\n)","name":"comment.line-end.fortran"},"line-header":{"captures":{"1":{"name":"constant.numeric.fortran"},"2":{"name":"keyword.line-continuation-operator.fortran"},"3":{"name":"source.fortran.free"},"4":{"name":"invalid.error.fortran"}},"match":"^(?!\\\\s*[!#])(?:([ \\\\d]{5} )|( {5}.)|(\\\\t)|(.{1,5}))"}},"scopeName":"source.fortran.fixed","embeddedLangs":["fortran-free-form"],"aliases":["f","for","f77"]}',
    ),
  ),
];
export { n as default };
