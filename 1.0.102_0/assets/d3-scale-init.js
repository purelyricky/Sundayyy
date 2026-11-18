/**
 * @readable-header
 * FILE:      assets/d3-scale-init.js
 * WAS:       init-C-OQMol4.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/d3-scale-linear.js (static import)
 *            assets/d3-scale-ordinal.js (static import)
 *            assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/mermaid-gantt-diagram.js (static import)
 *            assets/mermaid-xychart-diagram.js (static import)
 * NEEDS:     none
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
function e(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
  }
  return this;
}
export { e as t };
