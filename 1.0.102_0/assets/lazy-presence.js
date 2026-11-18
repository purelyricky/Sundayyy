/**
 * @readable-header
 * FILE:      assets/lazy-presence.js
 * WAS:       lazyPresenceChunk-4SWP-v7G.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Framer Motion / motion (version not determined)
 * WHAT:      Small chunk (original lazyPresenceChunk) exposing Framer Motion style LazyMotion, AnimatePresence and PresenceContext with the domMax feature set, built on helpers from scheduling-fields.js.
 * WHY:       Lazily loaded animation feature bundle for UI transitions; imported by scheduling-fields.js.
 * USED BY:   assets/scheduling-fields.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/react-vendor-and-language-list.js (static import)
 *            assets/scheduling-fields.js (static import)
 * EXPORTS:   AnimatePresence, HidingPresenceElement, LazyMotion, PresenceContext, PresenceElement, domMax, m  (export names are unchanged from the original; other files import them by these names)
 */
import { a as e, o as r, u as t } from "./react-vendor-and-language-list.js";
import {
  Bt as n,
  Fn as s,
  Gt as a,
  Ht as o,
  Jt as i,
  Kt as c,
  Ut as u,
  Vt as f,
  Wt as d,
  qt as p,
  zt as l,
} from "./scheduling-fields.js";
var h = e(),
  m = t(r(), 1);
function j({ children: e, features: r, strict: t = !1 }) {
  const [, n] = (0, m.useState)(!v(r)),
    s = (0, m.useRef)(void 0);
  if (!v(r)) {
    const { renderer: e, ...t } = r;
    (s.current = e), a(t);
  }
  return (
    (0, m.useEffect)(() => {
      v(r) &&
        r().then(({ renderer: e, ...r }) => {
          a(r), (s.current = e), n(!0);
        });
    }, []),
    (0, h.jsx)(c.Provider, {
      value: { renderer: s.current, strict: t },
      children: e,
    })
  );
}
function v(e) {
  return "function" == typeof e;
}
var x = d(),
  g = { ...{ renderer: u, ...o, ...n }, ...f, ...l };
function R({ tag: e, props: r, elementRef: t }) {
  const n = x[e];
  return (0, h.jsx)(n, { ...r, ref: t });
}
function F({ tag: e, props: r, elementRef: t }) {
  const n = i(),
    s = x[e];
  return (0, h.jsx)(s, { ...r, "aria-hidden": !n || r["aria-hidden"], ref: t });
}
export {
  p as AnimatePresence,
  F as HidingPresenceElement,
  j as LazyMotion,
  s as PresenceContext,
  R as PresenceElement,
  g as domMax,
  x as m,
};
