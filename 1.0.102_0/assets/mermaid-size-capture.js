/**
 * @readable-header
 * FILE:      assets/mermaid-size-capture.js
 * WAS:       sizeCapture-INFHLROL-DDrTV07T.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   captureNodeSizes  (export names are unchanged from the original; other files import them by these names)
 */
import { n as e } from "./mermaid-runtime-helpers.js";
function t() {
  if ("undefined" != typeof globalThis) return globalThis;
}
function n() {
  return "undefined" == typeof location
    ? "browser-dev"
    : `${location.pathname}${location.search}`;
}
function o(e, n) {
  const o = t();
  if (!o) return;
  const i = n.node(),
    r =
      ((i && "ownerSVGElement" in i ? i.ownerSVGElement : null) ?? i)?.id ??
      "(unknown)";
  o.mermaidCapturedSizes ??= [];
  const a = { svgId: r, sizes: e };
  o.mermaidCapturedSizes.push(a), (o.mermaidLastCapturedSizes = a);
}
function i(e, t) {
  const i = [];
  for (const n of t.nodes)
    n.isGroup ||
      i.push({ id: n.id, width: n.width ?? 0, height: n.height ?? 0 });
  0 !== i.length &&
    o(
      {
        metadata: {
          captureVersion: 1,
          capturedAt: new Date().toISOString(),
          capturedFrom: n(),
        },
        nodes: i,
      },
      e,
    );
}
e(t, "getCaptureGlobal"),
  e(function () {
    return Boolean(t()?.mermaidCaptureSizes);
  }, "shouldCaptureSizes"),
  e(n, "capturedFromLocation"),
  e(o, "emitCapturedSizes"),
  e(i, "captureNodeSizes");
export { i as captureNodeSizes };
