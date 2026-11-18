/**
 * @readable-header
 * FILE:      assets/shiki-lang-jssm.js
 * WAS:       jssm-B2IdsL_s.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "jssm" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "jssm" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     none
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
var n = [
  Object.freeze(
    JSON.parse(
      '{"displayName":"JSSM","fileTypes":["jssm","jssm_state"],"name":"jssm","patterns":[{"begin":"/\\\\*","captures":{"0":{"name":"punctuation.definition.comment.mn"}},"end":"\\\\*/","name":"comment.block.jssm"},{"begin":"//","end":"$","name":"comment.line.jssm"},{"begin":"\\\\$\\\\{","captures":{"0":{"name":"entity.name.function"}},"end":"}","name":"keyword.other"},{"match":"([0-9]*)(\\\\.)([0-9]*)(\\\\.)([0-9]*)","name":"constant.numeric"},{"match":"graph_layout(\\\\s*)(:)","name":"constant.language.jssmLanguage"},{"match":"machine_name(\\\\s*)(:)","name":"constant.language.jssmLanguage"},{"match":"machine_version(\\\\s*)(:)","name":"constant.language.jssmLanguage"},{"match":"jssm_version(\\\\s*)(:)","name":"constant.language.jssmLanguage"},{"match":"<->","name":"keyword.control.transition.jssmArrow.legal_legal"},{"match":"<-","name":"keyword.control.transition.jssmArrow.legal_none"},{"match":"->","name":"keyword.control.transition.jssmArrow.none_legal"},{"match":"<=>","name":"keyword.control.transition.jssmArrow.main_main"},{"match":"=>","name":"keyword.control.transition.jssmArrow.none_main"},{"match":"<=","name":"keyword.control.transition.jssmArrow.main_none"},{"match":"<~>","name":"keyword.control.transition.jssmArrow.forced_forced"},{"match":"~>","name":"keyword.control.transition.jssmArrow.none_forced"},{"match":"<~","name":"keyword.control.transition.jssmArrow.forced_none"},{"match":"<-=>","name":"keyword.control.transition.jssmArrow.legal_main"},{"match":"<=->","name":"keyword.control.transition.jssmArrow.main_legal"},{"match":"<-~>","name":"keyword.control.transition.jssmArrow.legal_forced"},{"match":"<~->","name":"keyword.control.transition.jssmArrow.forced_legal"},{"match":"<=~>","name":"keyword.control.transition.jssmArrow.main_forced"},{"match":"<~=>","name":"keyword.control.transition.jssmArrow.forced_main"},{"match":"([0-9]+)%","name":"constant.numeric.jssmProbability"},{"match":"\'[^\']*\'","name":"constant.character.jssmAction"},{"match":"\\"[^\\"]*\\"","name":"entity.name.tag.jssmLabel.doublequoted"},{"match":"([!#\\\\&()+,.0-9?-Z_a-z])","name":"entity.name.tag.jssmLabel.atom"}],"scopeName":"source.jssm","aliases":["fsl"]}',
    ),
  ),
];
export { n as default };
