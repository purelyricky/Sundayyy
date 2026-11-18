/**
 * @readable-header
 * FILE:      assets/d3-shape-line.js
 * WAS:       line-DtZKFgiP.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 *            assets/mermaid-edge-rendering.js (static import)
 *            assets/mermaid-state-diagram.js (static import)
 *            assets/mermaid-xychart-diagram.js (static import)
 *            assets/sidepanel.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/d3-path.js (static import)
 *            assets/d3-shape-array.js (static import)
 *            assets/mermaid-utils.js (static import)
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
import { n, t } from "./d3-path.js";
import { t as r } from "./d3-shape-array.js";
import { rt as u } from "./mermaid-utils.js";
function o(n) {
  return n[0];
}
function e(n) {
  return n[1];
}
function f(f, i) {
  var l = n(!0),
    c = null,
    a = u,
    p = null,
    s = t(h);
  function h(n) {
    var t,
      u,
      o,
      e = (n = r(n)).length,
      h = !1;
    for (null == c && (p = a((o = s()))), t = 0; t <= e; ++t)
      !(t < e && l((u = n[t]), t, n)) === h &&
        ((h = !h) ? p.lineStart() : p.lineEnd()),
        h && p.point(+f(u, t, n), +i(u, t, n));
    if (o) return (p = null), o + "" || null;
  }
  return (
    (f = "function" == typeof f ? f : void 0 === f ? o : n(f)),
    (i = "function" == typeof i ? i : void 0 === i ? e : n(i)),
    (h.x = function (t) {
      return arguments.length
        ? ((f = "function" == typeof t ? t : n(+t)), h)
        : f;
    }),
    (h.y = function (t) {
      return arguments.length
        ? ((i = "function" == typeof t ? t : n(+t)), h)
        : i;
    }),
    (h.defined = function (t) {
      return arguments.length
        ? ((l = "function" == typeof t ? t : n(!!t)), h)
        : l;
    }),
    (h.curve = function (n) {
      return arguments.length ? ((a = n), null != c && (p = a(c)), h) : a;
    }),
    (h.context = function (n) {
      return arguments.length
        ? (null == n ? (c = p = null) : (p = a((c = n))), h)
        : c;
    }),
    h
  );
}
export { f as t };
