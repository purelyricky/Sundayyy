/**
 * @readable-header
 * FILE:      assets/mermaid-peg-diagram.js
 * WAS:       pegDiagram-XKGWAZYB-D4eFq98k.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Mermaid implementation of the "peg" diagram type (diagram definition, renderer and styles).
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
import { t as e, u as r } from "./mermaid-parser-core.js";
import { n as t } from "./mermaid-runtime-helpers.js";
import { m as a } from "./mermaid-logger-d3-selection-dayjs.js";
import "./mermaid-config-themes-and-common-db.js";
import { n, r as s, t as o } from "./mermaid-railroad-renderer.js";
import { t as i } from "./mermaid-populate-common-db.js";
import "./mermaid-core.js";
var p = r().RailroadPeg.parser.LangiumParser,
  m = t((e) => {
    const r = e.alternatives.map(u);
    return 1 === r.length ? r[0] : { type: "choice", alternatives: r };
  }, "transformOrderedChoice"),
  u = t((e) => {
    const r = e.elements.map(l);
    return 1 === r.length ? r[0] : { type: "sequence", elements: r };
  }, "transformSequence"),
  l = t((e) => {
    const r = f(e.suffix);
    return e.operator
      ? { type: "special", text: "&" === e.operator ? `&${c(r)}` : `!${c(r)}` }
      : r;
  }, "transformPrefix"),
  c = t((e) => {
    switch (e.type) {
      case "terminal":
        return `"${e.value}"`;
      case "nonterminal":
        return e.name;
      case "special":
        return e.text;
      default:
        return "(...)";
    }
  }, "nodeToLabel"),
  f = t((e) => {
    const r = d(e.primary);
    if (!e.operator) return r;
    switch (e.operator) {
      case "?":
        return { type: "optional", element: r };
      case "*":
        return { type: "repetition", element: r, min: 0, max: 1 / 0 };
      case "+":
        return { type: "repetition", element: r, min: 1, max: 1 / 0 };
      default:
        throw new Error(`Unsupported PEG suffix operator: ${e.operator}`);
    }
  }, "transformSuffix"),
  d = t((e) => {
    switch (e.$type) {
      case "PegLiteral":
        return { type: "terminal", value: e.value };
      case "PegIdentifier":
        return { type: "nonterminal", name: e.name };
      case "PegGroup":
        return m(e.element);
      case "PegAny":
        return { type: "special", text: e.dot };
      default:
        throw new Error(`Unsupported PEG primary node: ${e.$type}`);
    }
  }, "transformPrimary"),
  P = t(
    (e) => ({ name: e.name, definition: m(e.definition) }),
    "transformRule",
  ),
  y = t((e) => {
    i(e, o),
      e.title && o.setTitle(e.title),
      e.rules.map((e) => o.addRule(P(e)));
  }, "populateDb"),
  h = {
    parser: {
      parse: t((r) => {
        o.clear(), a.debug("[PEG Parser] Starting Langium parse");
        const t = p.parse(r);
        if (t.lexerErrors.length > 0 || t.parserErrors.length > 0)
          throw new e(t);
        const n = t.value;
        a.debug("[PEG Parser] Parsed rules:", n.rules.length),
          y(n),
          a.debug("[PEG Parser] Parse complete");
      }, "parse"),
      parser: { yy: o },
    },
    db: o,
    renderer: s,
    styles: n,
  };
export { h as diagram };
