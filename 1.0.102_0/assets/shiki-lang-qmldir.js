/**
 * @readable-header
 * FILE:      assets/shiki-lang-qmldir.js
 * WAS:       qmldir-Bf_3Mw4a.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "qmldir" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "qmldir" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var e = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"QML Directory","name":"qmldir","patterns":[{"include":"#comment"},{"include":"#keywords"},{"include":"#version"},{"include":"#names"}],"repository":{"comment":{"patterns":[{"begin":"#","end":"$","name":"comment.line.number-sign.qmldir"}]},"file-name":{"patterns":[{"match":"\\\\b\\\\w+\\\\.(qmltypes|qml|js)\\\\b","name":"string.unquoted.qmldir"}]},"identifier":{"patterns":[{"match":"\\\\b\\\\w+\\\\b","name":"variable.parameter.qmldir"}]},"keywords":{"patterns":[{"match":"\\\\b(module|singleton|internal|plugin|classname|typeinfo|depends|designersupported)\\\\b","name":"keyword.other.qmldir"}]},"module-name":{"patterns":[{"match":"\\\\b[A-Z]\\\\w*\\\\b","name":"entity.name.type.qmldir"}]},"names":{"patterns":[{"include":"#file-name"},{"include":"#module-name"},{"include":"#identifier"}]},"version":{"patterns":[{"match":"\\\\b\\\\d+\\\\.\\\\d+\\\\b","name":"constant.numeric.qml"}]}},"scopeName":"source.qmldir"}',
    ),
  ),
];
export { e as default };
