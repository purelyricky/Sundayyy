/**
 * @readable-header
 * FILE:      assets/mermaid-icon-styles.js
 * WAS:       chunk-5VM5RSS4-CgGJlPco.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-block-diagram.js (static import)
 *            assets/mermaid-class-parser-db-renderer.js (static import)
 *            assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/mermaid-flowchart-parser-db.js (static import)
 *            assets/mermaid-journey-diagram.js (static import)
 *            assets/mermaid-kanban-definition.js (static import)
 * NEEDS:     assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
import { n } from "./mermaid-runtime-helpers.js";
var e = n(
  () =>
    "\n  /* Font Awesome icon styling - consolidated */\n  .label-icon {\n    display: inline-block;\n    height: 1em;\n    overflow: visible;\n    vertical-align: -0.125em;\n  }\n  \n  .node .label-icon path {\n    fill: currentColor;\n    stroke: revert;\n    stroke-width: revert;\n  }\n",
  "getIconStyles",
);
export { e as t };
