/**
 * @readable-header
 * FILE:      assets/mermaid-get-diagram-element.js
 * WAS:       chunk-XXDRQBXY-DiiED4wv.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-class-diagram.js (static import)
 *            assets/mermaid-class-parser-db-renderer.js (static import)
 *            assets/mermaid-class-v2-diagram.js (static import)
 *            assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/mermaid-er-diagram.js (static import)
 *            assets/mermaid-flow-diagram.js (static import)
 *            assets/mermaid-flowchart-parser-db.js (static import)
 *            assets/mermaid-mindmap-definition.js (static import)
 *            ... and 5 more (full list in FILE_INDEX.md)
 * NEEDS:     assets/mermaid-logger-d3-selection-dayjs.js (static import)
 *            assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
import { n as o } from "./mermaid-runtime-helpers.js";
import { p as t } from "./mermaid-logger-d3-selection-dayjs.js";
var e = o((o, e) => {
  let n;
  return (
    "sandbox" === e && (n = t("#i" + o)),
    t("sandbox" === e ? n.nodes()[0].contentDocument.body : "body").select(
      `[id="${o}"]`,
    )
  );
}, "getDiagramElement");
export { e as t };
