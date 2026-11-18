/**
 * @readable-header
 * FILE:      assets/khroma-channel.js
 * WAS:       channel-fROY01io.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-block-diagram.js (static import)
 *            assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/mermaid-er-diagram.js (static import)
 *            assets/mermaid-flowchart-parser-db.js (static import)
 * NEEDS:     assets/mermaid-config-themes-and-common-db.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
import { at as a, it as r } from "./mermaid-config-themes-and-common-db.js";
var s = (s, t) => a.lang.round(r.parse(s)[t]);
export { s as t };
