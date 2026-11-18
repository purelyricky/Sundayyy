/**
 * @readable-header
 * FILE:      assets/shiki-lang-desktop.js
 * WAS:       desktop-BMV7d8QH.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "desktop" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "desktop" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var e = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"Desktop","name":"desktop","patterns":[{"include":"#layout"},{"include":"#keywords"},{"include":"#values"},{"include":"#inCommands"},{"include":"#inCategories"}],"repository":{"inCategories":{"patterns":[{"match":"(?<=^Categories.*)AudioVideo|(?<=^Categories.*)Audio|(?<=^Categories.*)Video|(?<=^Categories.*)Development|(?<=^Categories.*)Education|(?<=^Categories.*)Game|(?<=^Categories.*)Graphics|(?<=^Categories.*)Network|(?<=^Categories.*)Office|(?<=^Categories.*)Science|(?<=^Categories.*)Settings|(?<=^Categories.*)System|(?<=^Categories.*)Utility","name":"markup.bold"}]},"inCommands":{"patterns":[{"match":"(?<=^Exec.*\\\\s)-+\\\\S+","name":"variable.parameter"},{"match":"(?<=^Exec.*)\\\\s%[FUcfiku]\\\\s","name":"variable.language"},{"match":"\\".*\\"","name":"string"}]},"keywords":{"patterns":[{"match":"^(?:Type|Version|Name|GenericName|NoDisplay|Comment|Icon|Hidden|OnlyShowIn|NotShowIn|DBusActivatable|TryExec|Exec|Path|Terminal|Actions|MimeType|Categories|Implements|Keywords|StartupNotify|StartupWMClass|URL|PrefersNonDefaultGPU|Encoding)\\\\b","name":"keyword"},{"match":"^X-[- 0-9A-z]*","name":"keyword.other"},{"match":"(?<!^)\\\\[.+]","name":"constant.language"},{"match":"^(?:GtkTheme|MetacityTheme|IconTheme|CursorTheme|ButtonLayout|ApplicationFont)\\\\b","name":"keyword"}]},"layout":{"patterns":[{"begin":"^\\\\[Desktop","end":"]","name":"markup.heading"},{"begin":"^\\\\[X-\\\\w*","end":"]","name":"markup.heading"},{"match":"^\\\\s*#.*","name":"comment"},{"match":";","name":"strong"}]},"values":{"patterns":[{"match":"(?<=^\\\\S+)=","name":"keyword.operator"},{"match":"\\\\b(?:tru|fals)e\\\\b","name":"variable.other"},{"match":"(?<=^Version.*)\\\\d+(\\\\.?\\\\d*)","name":"variable.other"}]}},"scopeName":"source.desktop"}',
    ),
  ),
];
export { e as default };
