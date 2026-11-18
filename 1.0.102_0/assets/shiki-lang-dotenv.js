/**
 * @readable-header
 * FILE:      assets/shiki-lang-dotenv.js
 * WAS:       dotenv-C0rNZ8yf.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "dotenv" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "dotenv" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var e = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"dotEnv","name":"dotenv","patterns":[{"captures":{"1":{"patterns":[{"include":"#line-comment"}]}},"match":"^\\\\s?(#.*)$\\\\n"},{"captures":{"1":{"patterns":[{"include":"#key"}]},"2":{"name":"keyword.operator.assignment.dotenv"},"3":{"name":"property.value.dotenv","patterns":[{"include":"#line-comment"},{"include":"#double-quoted-string"},{"include":"#single-quoted-string"},{"include":"#interpolation"}]}},"match":"^\\\\s?(.*?)\\\\s?(=)(.*)$"}],"repository":{"double-quoted-string":{"captures":{"1":{"patterns":[{"include":"#interpolation"},{"include":"#escape-characters"}]}},"match":"\\"(.*)\\"","name":"string.quoted.double.dotenv"},"escape-characters":{"match":"\\\\\\\\(?:[\\"\'\\\\\\\\bfnrt]|u[0-9A-F]{4})","name":"constant.character.escape.dotenv"},"interpolation":{"captures":{"1":{"name":"keyword.interpolation.begin.dotenv"},"2":{"name":"variable.interpolation.dotenv"},"3":{"name":"keyword.interpolation.end.dotenv"}},"match":"(\\\\$\\\\{)(.*)(})"},"key":{"captures":{"1":{"name":"keyword.key.export.dotenv"},"2":{"name":"variable.key.dotenv","patterns":[{"include":"#variable"}]}},"match":"(export\\\\s)?(.*)"},"line-comment":{"match":"#.*$","name":"comment.line.dotenv"},"single-quoted-string":{"match":"\'(.*)\'","name":"string.quoted.single.dotenv"},"variable":{"match":"[A-Z_a-z]+[0-9A-Z_a-z]*"}},"scopeName":"source.dotenv"}',
    ),
  ),
];
export { e as default };
