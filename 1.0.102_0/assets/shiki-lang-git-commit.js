/**
 * @readable-header
 * FILE:      assets/shiki-lang-git-commit.js
 * WAS:       git-commit-BhaJ1TQv.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "git-commit" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "git-commit" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-diff.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import e from "./shiki-lang-diff.js";
var t = [
  ...e,
  Object.freeze(
    JSON.parse(
      '{"displayName":"Git Commit Message","name":"git-commit","patterns":[{"begin":"(?=^diff --git)","contentName":"source.diff","end":"\\\\z","name":"meta.embedded.diff.git-commit","patterns":[{"include":"source.diff"}]},{"begin":"^(?!#)","end":"^(?=#)","name":"meta.scope.message.git-commit","patterns":[{"captures":{"1":{"name":"invalid.deprecated.line-too-long.git-commit"},"2":{"name":"invalid.illegal.line-too-long.git-commit"}},"match":"\\\\G.{0,50}(.{0,22}(.*))$","name":"meta.scope.subject.git-commit"}]},{"begin":"^(?=#)","contentName":"comment.line.number-sign.git-commit","end":"^(?!#)","name":"meta.scope.metadata.git-commit","patterns":[{"captures":{"1":{"name":"markup.changed.git-commit"}},"match":"^#\\\\t((modified|renamed):.*)$"},{"captures":{"1":{"name":"markup.inserted.git-commit"}},"match":"^#\\\\t(new file:.*)$"},{"captures":{"1":{"name":"markup.deleted.git-commit"}},"match":"^#\\\\t(deleted.*)$"},{"captures":{"1":{"name":"keyword.other.file-type.git-commit"},"2":{"name":"string.unquoted.filename.git-commit"}},"match":"^#\\\\t([^:]+): *(.*)$"}]}],"scopeName":"text.git-commit","embeddedLangs":["diff"]}',
    ),
  ),
];
export { t as default };
