/**
 * @readable-header
 * FILE:      assets/mermaid-imperative-state.js
 * WAS:       chunk-2Q5K7J3B-1I_gT9Tm.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/mermaid-git-graph-diagram.js (static import)
 *            assets/mermaid-sequence-diagram.js (static import)
 *            assets/mermaid-tree-view-diagram.js (static import)
 * NEEDS:     assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
import { n as t } from "./mermaid-runtime-helpers.js";
var s = class {
  constructor(t) {
    (this.init = t), (this.records = this.init());
  }
  static {
    t(this, "ImperativeState");
  }
  reset() {
    this.records = this.init();
  }
};
export { s as t };
