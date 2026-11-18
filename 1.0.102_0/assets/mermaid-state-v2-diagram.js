/**
 * @readable-header
 * FILE:      assets/mermaid-state-v2-diagram.js
 * WAS:       stateDiagram-v2-MP3YSRHH-C_YOwH-d.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Mermaid implementation of the "state v2" diagram type (diagram definition, renderer and styles).
 * WHY:       Renders ```mermaid code blocks of this type in chat. Loaded lazily by mermaid-core.js.
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/mermaid-cluster-rendering.js (static import)
 *            assets/mermaid-config-themes-and-common-db.js (static import)
 *            assets/mermaid-core.js (static import)
 *            assets/mermaid-edge-rendering.js (static import)
 *            assets/mermaid-get-diagram-element.js (static import)
 *            assets/mermaid-icon-registry.js (static import)
 *            assets/mermaid-logger-d3-selection-dayjs.js (static import)
 *            assets/mermaid-node-insertion.js (static import)
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
import {
  i as t,
  n as s,
  r as o,
  t as i,
} from "./mermaid-state-parser-db-renderer.js";
import "./mermaid-core.js";
var n = {
  parser: s,
  get db() {
    return new i(2);
  },
  renderer: o,
  styles: t,
  init: r((r) => {
    r.state || (r.state = {}),
      (r.state.arrowMarkerAbsolute = r.arrowMarkerAbsolute);
  }, "init"),
};
export { n as diagram };
