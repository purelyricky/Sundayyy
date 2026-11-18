/**
 * @readable-header
 * FILE:      assets/mermaid-populate-common-db.js
 * WAS:       chunk-JWPE2WC7-Dj6C9sv3.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-abnf-diagram.js (static import)
 *            assets/mermaid-architecture-diagram.js (static import)
 *            assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/mermaid-cynefin-diagram.js (static import)
 *            assets/mermaid-ebnf-diagram.js (static import)
 *            assets/mermaid-event-modeling-diagram.js (static import)
 *            assets/mermaid-git-graph-diagram.js (static import)
 *            assets/mermaid-packet-diagram.js (static import)
 *            ... and 7 more (full list in FILE_INDEX.md)
 * NEEDS:     assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
import { n as c } from "./mermaid-runtime-helpers.js";
function t(c, t) {
  c.accDescr && t.setAccDescription?.(c.accDescr),
    c.accTitle && t.setAccTitle?.(c.accTitle),
    c.title && t.setDiagramTitle?.(c.title);
}
c(t, "populateCommonDb");
export { t };
