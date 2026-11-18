/**
 * @readable-header
 * FILE:      assets/shiki-lang-git-rebase.js
 * WAS:       git-rebase-BYbQoRKu.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "git-rebase" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "git-rebase" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-shellscript.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import { t as e } from "./shiki-lang-shellscript.js";
var a = [
  ...e,
  Object.freeze(
    JSON.parse(
      '{"displayName":"Git Rebase Message","name":"git-rebase","patterns":[{"captures":{"1":{"name":"punctuation.definition.comment.git-rebase"}},"match":"^\\\\s*(#).*$\\\\n?","name":"comment.line.number-sign.git-rebase"},{"captures":{"1":{"name":"support.function.git-rebase"},"2":{"name":"constant.sha.git-rebase"},"3":{"name":"meta.commit-message.git-rebase"}},"match":"^\\\\s*(pick|p|reword|r|edit|e|squash|s|fixup|f|drop|d)\\\\s+([0-9a-f]+)\\\\s+(.*)$","name":"meta.commit-command.git-rebase"},{"captures":{"1":{"name":"support.function.git-rebase"},"2":{"patterns":[{"include":"source.shell"}]}},"match":"^\\\\s*(exec|x)\\\\s+(.*)$","name":"meta.commit-command.git-rebase"},{"captures":{"1":{"name":"support.function.git-rebase"}},"match":"^\\\\s*(b(?:reak|))\\\\s*$","name":"meta.commit-command.git-rebase"}],"scopeName":"text.git-rebase","embeddedLangs":["shellscript"]}',
    ),
  ),
];
export { a as default };
