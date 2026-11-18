/**
 * @readable-header
 * FILE:      assets/mermaid-swimlanes-diagram.js
 * WAS:       swimlanesDiagram-VR7AAH4N-87NVV70p.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Mermaid implementation of the "swimlanes" diagram type (diagram definition, renderer and styles).
 * WHY:       Renders ```mermaid code blocks of this type in chat. Loaded lazily by mermaid-core.js.
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/mermaid-cluster-rendering.js (static import)
 *            assets/mermaid-config-themes-and-common-db.js (static import)
 *            assets/mermaid-core.js (static import)
 *            assets/mermaid-edge-rendering.js (static import)
 *            assets/mermaid-flowchart-parser-db.js (static import)
 *            assets/mermaid-get-diagram-element.js (static import)
 *            assets/mermaid-icon-registry.js (static import)
 *            assets/mermaid-logger-d3-selection-dayjs.js (static import)
 *            ... and 8 more (full list in FILE_INDEX.md)
 * EXPORTS:   diagram  (export names are unchanged from the original; other files import them by these names)
 */
import { n as r } from "./mermaid-runtime-helpers.js";
import "./mermaid-logger-d3-selection-dayjs.js";
import "./mermaid-config-themes-and-common-db.js";
import "./mermaid-utils.js";
import "./mermaid-icon-registry.js";
import "./mermaid-text-rendering.js";
import "./mermaid-rough-style-utils.js";
import "./mermaid-node-shapes.js";
import "./mermaid-node-insertion.js";
import "./mermaid-edge-rendering.js";
import "./mermaid-svg-draw-primitives.js";
import "./mermaid-get-diagram-element.js";
import "./mermaid-svg-viewport.js";
import "./mermaid-cluster-rendering.js";
import { r as t, t as s } from "./mermaid-flowchart-parser-db.js";
import "./mermaid-core.js";
var n = s({
  defaultLayout: "swimlane",
  styles: r(
    (r) =>
      `${t(r)}\n  .swimlane.cluster rect {\n    stroke: ${r.clusterBorder} !important;\n  }\n  [data-look="neo"].cluster rect {\n    filter: none;\n  }\n`,
    "getStyles",
  ),
});
export { n as diagram };
