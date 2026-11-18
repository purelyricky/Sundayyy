/**
 * @readable-header
 * FILE:      assets/mermaid-abnf-diagram.js
 * WAS:       abnfDiagram-VCTEODGH-Dzi9-lKg.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Mermaid implementation of the "abnf" diagram type (diagram definition, renderer and styles).
 * WHY:       Renders ```mermaid code blocks of this type in chat. Loaded lazily by mermaid-core.js.
 * USED BY:   assets/mermaid-core.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/mermaid-config-themes-and-common-db.js (static import)
 *            assets/mermaid-core.js (static import)
 *            assets/mermaid-logger-d3-selection-dayjs.js (static import)
 *            assets/mermaid-parser-core.js (static import)
 *            assets/mermaid-populate-common-db.js (static import)
 *            assets/mermaid-railroad-renderer.js (static import)
 *            assets/mermaid-runtime-helpers.js (static import)
 * EXPORTS:   diagram  (export names are unchanged from the original; other files import them by these names)
 */
import { m as e, t as r } from "./mermaid-parser-core.js";
import { n as t } from "./mermaid-runtime-helpers.js";
import { m as n } from "./mermaid-logger-d3-selection-dayjs.js";
import "./mermaid-config-themes-and-common-db.js";
import { n as a, r as s, t as m } from "./mermaid-railroad-renderer.js";
import { t as o } from "./mermaid-populate-common-db.js";
import "./mermaid-core.js";
var i = e().RailroadAbnf.parser.LangiumParser,
  p = t((e) => {
    const r = e.alternatives.map(l);
    return 1 === r.length ? r[0] : { type: "choice", alternatives: r };
  }, "transformAlternation"),
  l = t((e) => {
    const r = e.elements.map(c);
    return 1 === r.length ? r[0] : { type: "sequence", elements: r };
  }, "transformConcatenation"),
  u = t((e) => {
    if (e.includes("*")) {
      const [r, t] = e.split("*");
      return { min: r ? parseInt(r, 10) : 0, max: t ? parseInt(t, 10) : 1 / 0 };
    }
    const r = parseInt(e, 10);
    return { min: r, max: r };
  }, "parseRepeat"),
  c = t((e) => {
    const r = f(e.primary);
    if (!e.repeat) return r;
    const { min: t, max: n } = u(e.repeat);
    return 0 === t && 1 === n
      ? { type: "optional", element: r }
      : { type: "repetition", element: r, min: t, max: n };
  }, "transformElement"),
  f = t((e) => {
    switch (e.$type) {
      case "AbnfStringLiteral":
      case "AbnfNumVal":
        return { type: "terminal", value: e.value };
      case "AbnfRuleName":
        return { type: "nonterminal", name: e.name };
      case "AbnfGroup":
        return p(e.element);
      case "AbnfOptionalGroup":
        return { type: "optional", element: p(e.element) };
      default:
        throw new Error(`Unsupported ABNF primary node: ${e.$type}`);
    }
  }, "transformPrimary"),
  d = t(
    (e) => ({ name: e.name, definition: p(e.definition) }),
    "transformRule",
  ),
  y = t((e) => {
    o(e, m),
      e.title && m.setTitle(e.title),
      e.rules.map((e) => m.addRule(d(e)));
  }, "populateDb"),
  h = {
    parser: {
      parse: t((e) => {
        m.clear(), n.debug("[ABNF Parser] Starting Langium parse");
        const t = i.parse(e);
        if (t.lexerErrors.length > 0 || t.parserErrors.length > 0)
          throw new r(t);
        const a = t.value;
        n.debug("[ABNF Parser] Parsed rules:", a.rules.length),
          y(a),
          n.debug("[ABNF Parser] Parse complete");
      }, "parse"),
      parser: { yy: m },
    },
    db: m,
    renderer: s,
    styles: a,
  };
export { h as diagram };
