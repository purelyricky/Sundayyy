/**
 * @readable-header
 * FILE:      assets/mermaid-rough-style-utils.js
 * WAS:       chunk-P2QGCYS3-OK53HEiW.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     unknown
 * WHAT:      Purpose not determined automatically (name kept from the original build).
 * USED BY:   assets/mermaid-block-diagram.js (static import)
 *            assets/mermaid-c4-diagram.js (static import)
 *            assets/mermaid-class-diagram.js (static import)
 *            assets/mermaid-class-v2-diagram.js (static import)
 *            assets/mermaid-cluster-rendering.js (static import)
 *            assets/mermaid-core.js (static import)
 *            assets/mermaid-dagre-layout.js (static import)
 *            assets/mermaid-edge-rendering.js (static import)
 *            ... and 12 more (full list in FILE_INDEX.md)
 * NEEDS:     assets/mermaid-config-themes-and-common-db.js (static import)
 *            assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   a, i, n, r, t  (export names are unchanged from the original; other files import them by these names)
 */
import { n as e } from "./mermaid-runtime-helpers.js";
import { x as t } from "./mermaid-config-themes-and-common-db.js";
var r = e((e) => {
    const { handDrawnSeed: r } = t();
    return {
      fill: e,
      hachureAngle: 120,
      hachureGap: 4,
      fillWeight: 2,
      roughness: 0.7,
      stroke: e,
      seed: r,
    };
  }, "solidStateFill"),
  s = e(
    (e) =>
      Array.isArray(e)
        ? e
        : e
          ? e
              .split(";")
              .map((e) => e.trim())
              .filter(Boolean)
          : [],
    "normalizeStyleList",
  ),
  a = e((e) => {
    const t = o([
      ...(e.cssCompiledStyles || []),
      ...(e.cssStyles || []),
      ...s(e.labelStyle),
    ]);
    return { stylesMap: t, stylesArray: [...t] };
  }, "compileStyles"),
  o = e((e) => {
    const t = new Map();
    return (
      e.forEach((e) => {
        const [r, s] = e.split(":");
        t.set(r.trim(), s?.trim());
      }),
      t
    );
  }, "styles2Map"),
  i = e(
    (e) =>
      "color" === e ||
      "font-size" === e ||
      "font-family" === e ||
      "font-weight" === e ||
      "font-style" === e ||
      "text-decoration" === e ||
      "text-align" === e ||
      "text-transform" === e ||
      "line-height" === e ||
      "letter-spacing" === e ||
      "word-spacing" === e ||
      "text-shadow" === e ||
      "text-overflow" === e ||
      "white-space" === e ||
      "word-wrap" === e ||
      "word-break" === e ||
      "overflow-wrap" === e ||
      "hyphens" === e,
    "isLabelStyle",
  ),
  l = e((e) => {
    const { stylesArray: t } = a(e),
      r = [],
      s = [],
      o = [],
      l = [];
    return (
      t.forEach((e) => {
        const t = e[0];
        i(t)
          ? r.push(e.join(":") + " !important")
          : (s.push(e.join(":") + " !important"),
            t.includes("stroke") && o.push(e.join(":") + " !important"),
            "fill" === t && l.push(e.join(":") + " !important"));
      }),
      {
        labelStyles: r.join(";"),
        nodeStyles: s.join(";"),
        stylesArray: t,
        borderStyles: o,
        backgroundStyles: l,
      }
    );
  }, "styles2String"),
  n = e((e, r) => {
    const { themeVariables: s, handDrawnSeed: o } = t(),
      { nodeBorder: i, mainBkg: l } = s,
      { stylesMap: n } = a(e);
    return Object.assign(
      {
        roughness: 0.7,
        fill: n.get("fill") || l,
        fillStyle: "hachure",
        fillWeight: 4,
        hachureGap: 5.2,
        stroke: n.get("stroke") || i,
        seed: o,
        strokeWidth: n.get("stroke-width")?.replace("px", "") || 1.3,
        fillLineDash: [0, 0],
        strokeLineDash: h(n.get("stroke-dasharray")),
      },
      r,
    );
  }, "userNodeOverrides"),
  h = e((e) => {
    if (!e) return [0, 0];
    const t = e.trim().split(/\s+/).map(Number);
    if (1 === t.length) {
      const e = isNaN(t[0]) ? 0 : t[0];
      return [e, e];
    }
    return [isNaN(t[0]) ? 0 : t[0], isNaN(t[1]) ? 0 : t[1]];
  }, "getStrokeDashArray");
export { n as a, l as i, i as n, r, a as t };
