/**
 * @readable-header
 * FILE:      assets/shiki-lang-shellsession.js
 * WAS:       shellsession-C_DbqIZO.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "shellsession" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "shellsession" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-shellscript.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import { t as s } from "./shiki-lang-shellscript.js";
var e = [
  ...s,
  Object.freeze(
    JSON.parse(
      '{"displayName":"Shell Session","fileTypes":["sh-session"],"name":"shellsession","patterns":[{"captures":{"1":{"name":"entity.other.prompt-prefix.shell-session"},"2":{"name":"punctuation.separator.prompt.shell-session"},"3":{"name":"source.shell","patterns":[{"include":"source.shell"}]}},"match":"^(?:((?:\\\\(\\\\S+\\\\)\\\\s*)?(?:sh\\\\S*?|\\\\w+\\\\S+[:@]\\\\S+(?:\\\\s+\\\\S+)?|\\\\[\\\\S+?[:@]\\\\N+?].*?))\\\\s*)?([#$%>❯➜\\\\p{Greek}])\\\\s+(.*)$"},{"match":"^.+$","name":"meta.output.shell-session"}],"scopeName":"text.shell-session","embeddedLangs":["shellscript"],"aliases":["console"]}',
    ),
  ),
];
export { e as default };
