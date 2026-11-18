/**
 * @readable-header
 * FILE:      assets/mermaid-parser-treemap.js
 * WAS:       treemap-WGGIJYW6-uXdlmewZ.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Tiny stub that wires the "treemap" diagram grammar into Mermaid's parser (exports a create...Services function).
 * WHY:       Lets mermaid-parser-core.js load the parser for this diagram type only when it is needed.
 * USED BY:   assets/mermaid-parser-core.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/mermaid-parser-chunk.js (static import)
 *            assets/mermaid-parser-core.js (static import)
 * EXPORTS:   createTreemapServices  (export names are unchanged from the original; other files import them by these names)
 */
import "./mermaid-parser-chunk.js";
import { a as r, o } from "./mermaid-parser-core.js";
export { o as createTreemapServices };
