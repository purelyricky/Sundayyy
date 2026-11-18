/**
 * @readable-header
 * FILE:      assets/mermaid-svg-viewport.js
 * WAS:       chunk-POPQ4Y6H-CK_om7JF.js (name in the original Vite build; only the name and formatting changed)
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
 *            ... and 6 more (full list in FILE_INDEX.md)
 * NEEDS:     assets/mermaid-config-themes-and-common-db.js (static import)
 *            assets/mermaid-logger-d3-selection-dayjs.js (static import)
 *            assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
import { n as t } from "./mermaid-runtime-helpers.js";
import { m as i } from "./mermaid-logger-d3-selection-dayjs.js";
import { c as e } from "./mermaid-config-themes-and-common-db.js";
var o = t((t, o, s, a) => {
    t.attr("class", s);
    const { width: n, height: c, x: d, y: g } = h(t, o);
    e(t, c, n, a);
    const w = r(d, g, n, c, o);
    t.attr("viewBox", w),
      i.debug(`viewBox configured: ${w} with padding: ${o}`);
  }, "setupViewPortForSVG"),
  h = t((t, i) => {
    const e = t.node()?.getBBox() || { width: 0, height: 0, x: 0, y: 0 };
    return { width: e.width + 2 * i, height: e.height + 2 * i, x: e.x, y: e.y };
  }, "calculateDimensionsWithPadding"),
  r = t((t, i, e, o, h) => `${t - h} ${i - h} ${e} ${o}`, "createViewBox");
export { o as t };
