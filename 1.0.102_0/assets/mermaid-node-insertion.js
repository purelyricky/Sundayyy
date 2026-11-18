/**
 * @readable-header
 * FILE:      assets/mermaid-node-insertion.js
 * WAS:       chunk-GVQU2GXP-CguiKRsa.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-block-diagram.js (static import)
 *            assets/mermaid-class-diagram.js (static import)
 *            assets/mermaid-class-v2-diagram.js (static import)
 *            assets/mermaid-cluster-rendering.js (static import)
 *            assets/mermaid-core.js (static import)
 *            assets/mermaid-dagre-layout.js (static import)
 *            assets/mermaid-edge-rendering.js (static import)
 *            assets/mermaid-er-diagram.js (static import)
 *            ... and 9 more (full list in FILE_INDEX.md)
 * NEEDS:     assets/mermaid-logger-d3-selection-dayjs.js (static import)
 *            assets/mermaid-node-shapes.js (static import)
 *            assets/mermaid-runtime-helpers.js (static import)
 *            assets/mermaid-utils.js (static import)
 * EXPORTS:   a, i, n, r, t  (export names are unchanged from the original; other files import them by these names)
 */
import { n as t } from "./mermaid-runtime-helpers.js";
import { m as a } from "./mermaid-logger-d3-selection-dayjs.js";
import { u as r } from "./mermaid-utils.js";
import { o as e } from "./mermaid-node-shapes.js";
var s = t(({ flowchart: t }) => {
    const a = t?.subGraphTitleMargin?.top ?? 0,
      r = t?.subGraphTitleMargin?.bottom ?? 0;
    return {
      subGraphTitleTopMargin: a,
      subGraphTitleBottomMargin: r,
      subGraphTitleTotalMargin: a + r,
    };
  }, "getSubGraphTitleMargins"),
  o = new Map();
async function i(t, a, s) {
  let i, n;
  "rect" === a.shape &&
    (a.rx && a.ry ? (a.shape = "roundedRect") : (a.shape = "squareRect"));
  const l = a.shape ? e[a.shape] : void 0;
  if (!l)
    throw new Error(`No such shape: ${a.shape}. Please check your syntax.`);
  if (a.link) {
    let r;
    "sandbox" === s.config.securityLevel
      ? (r = "_top")
      : a.linkTarget && (r = a.linkTarget || "_blank"),
      (i = t
        .insert("svg:a")
        .attr("xlink:href", a.link)
        .attr("target", r ?? null)),
      (n = await l(i, a, s));
  } else (n = await l(t, a, s)), (i = n);
  return (
    i.attr("data-look", r(a.look)),
    a.tooltip && n.attr("title", a.tooltip),
    o.set(a.id, i),
    a.haveCallback && i.attr("class", i.attr("class") + " clickable"),
    i
  );
}
t(i, "insertNode");
var n = t((t, a) => {
    o.set(a.id, t);
  }, "setNodeElem"),
  l = t(() => {
    o.clear();
  }, "clear"),
  c = t((t) => {
    const r = o.get(t.id);
    a.trace(
      "Transforming node",
      t.diff,
      t,
      "translate(" + (t.x - t.width / 2 - 5) + ", " + t.width / 2 + ")",
    );
    const e = t.diff || 0;
    return (
      t.clusterNode
        ? r.attr(
            "transform",
            "translate(" +
              (t.x + e - t.width / 2) +
              ", " +
              (t.y - t.height / 2 - 8) +
              ")",
          )
        : r.attr("transform", "translate(" + t.x + ", " + t.y + ")"),
      e
    );
  }, "positionNode");
export { n as a, c as i, s as n, i as r, l as t };
