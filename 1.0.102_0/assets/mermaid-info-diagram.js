/**
 * @readable-header
 * FILE:      assets/mermaid-info-diagram.js
 * WAS:       infoDiagram-27XIBGKW-BJ9DVNzu.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Mermaid implementation of the "info" diagram type (diagram definition, renderer and styles).
 * WHY:       Renders ```mermaid code blocks of this type in chat. Loaded lazily by mermaid-core.js.
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/mermaid-config-themes-and-common-db.js (static import)
 *            assets/mermaid-core.js (static import)
 *            assets/mermaid-logger-d3-selection-dayjs.js (static import)
 *            assets/mermaid-parser-core.js (static import)
 *            assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   diagram  (export names are unchanged from the original; other files import them by these names)
 */
import { n as r } from "./mermaid-parser-core.js";
import { n as e } from "./mermaid-runtime-helpers.js";
import { m as a } from "./mermaid-logger-d3-selection-dayjs.js";
import { c as t } from "./mermaid-config-themes-and-common-db.js";
import { f as s } from "./mermaid-core.js";
var o = "11.17.2",
  n = {
    parser: {
      parse: e(async (e) => {
        const t = await r("info", e);
        a.debug(t);
      }, "parse"),
    },
    db: { getVersion: e(() => o, "getVersion") },
    renderer: {
      draw: e((r, e, o) => {
        a.debug("rendering info diagram\n" + r);
        const n = s(e);
        t(n, 100, 400, !0),
          n
            .append("g")
            .append("text")
            .attr("x", 100)
            .attr("y", 40)
            .attr("class", "version")
            .attr("font-size", 32)
            .style("text-anchor", "middle")
            .text(`v${o}`);
      }, "draw"),
    },
  };
export { n as diagram };
