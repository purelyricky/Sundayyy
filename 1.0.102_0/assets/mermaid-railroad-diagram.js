/**
 * @readable-header
 * FILE:      assets/mermaid-railroad-diagram.js
 * WAS:       railroadDiagram-O6MQD6OU-xjSmwNGO.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Mermaid implementation of the "railroad" diagram type (diagram definition, renderer and styles).
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
import { g as e, t as r } from "./mermaid-parser-core.js";
import { n as a } from "./mermaid-runtime-helpers.js";
import { m as t } from "./mermaid-logger-d3-selection-dayjs.js";
import "./mermaid-config-themes-and-common-db.js";
import { n, r as s, t as o } from "./mermaid-railroad-renderer.js";
import { t as i } from "./mermaid-populate-common-db.js";
import "./mermaid-core.js";
var l = e().Railroad.parser.LangiumParser,
  p = a((e) => {
    switch (e.$type) {
      case "RailroadTerminalExpr":
        return { type: "terminal", value: e.value };
      case "RailroadNonTerminalExpr":
        return { type: "nonterminal", name: e.name };
      case "RailroadSpecialExpr":
        return { type: "special", text: e.text };
      case "RailroadSequenceExpr": {
        const r = e.elements.map(p);
        return 1 === r.length ? r[0] : { type: "sequence", elements: r };
      }
      case "RailroadChoiceExpr": {
        const r = e.alternatives.map(p);
        return 1 === r.length ? r[0] : { type: "choice", alternatives: r };
      }
      case "RailroadOptionalExpr":
        return { type: "optional", element: p(e.element) };
      case "RailroadOneOrMoreExpr":
        return {
          type: "repetition",
          element: p(e.element),
          min: 1,
          max: 1 / 0,
        };
      case "RailroadZeroOrMoreExpr":
        return {
          type: "repetition",
          element: p(e.element),
          min: 0,
          max: 1 / 0,
        };
      default:
        throw new Error(`Unsupported railroad expression: ${e.$type}`);
    }
  }, "transformExpression"),
  m = a(
    (e) => ({ name: e.name, definition: p(e.definition) }),
    "transformRule",
  ),
  u = a((e) => {
    i(e, o),
      e.title && o.setTitle(e.title),
      e.rules.map((e) => o.addRule(m(e)));
  }, "populateDb"),
  c = {
    parser: {
      parse: a((e) => {
        o.clear(), t.debug("[Railroad Parser] Starting Langium parse");
        const a = l.parse(e);
        if (a.lexerErrors.length > 0 || a.parserErrors.length > 0)
          throw new r(a);
        const n = a.value;
        t.debug("[Railroad Parser] Parsed rules:", n.rules.length),
          u(n),
          t.debug("[Railroad Parser] Parse complete");
      }, "parse"),
      parser: { yy: o },
    },
    db: o,
    renderer: s,
    styles: n,
  };
export { c as diagram };
