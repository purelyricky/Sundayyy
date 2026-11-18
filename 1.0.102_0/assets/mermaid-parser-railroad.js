/**
 * @readable-header
 * FILE:      assets/mermaid-parser-railroad.js
 * WAS:       railroad-74A4TZTK-D3Oz763F.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Tiny stub that wires the "railroad" diagram grammar into Mermaid's parser (exports a create...Services function).
 * WHY:       Lets mermaid-parser-core.js load the parser for this diagram type only when it is needed.
 * USED BY:   assets/mermaid-parser-core.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/mermaid-parser-chunk.js (static import)
 *            assets/mermaid-parser-core.js (static import)
 * EXPORTS:   createRailroadServices  (export names are unchanged from the original; other files import them by these names)
 */
import "./mermaid-parser-chunk.js";
import { g as r, h as m } from "./mermaid-parser-core.js";
export { r as createRailroadServices };
