/**
 * @readable-header
 * FILE:      assets/mermaid-ebnf-diagram.js
 * WAS:       ebnfDiagram-PWID7BFC-BNyOOKwe.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Mermaid
 * WHAT:      Mermaid implementation of the "ebnf" diagram type (diagram definition, renderer and styles).
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
import { f as e, t as r } from "./mermaid-parser-core.js";
import { n as t } from "./mermaid-runtime-helpers.js";
import { m as n } from "./mermaid-logger-d3-selection-dayjs.js";
import "./mermaid-config-themes-and-common-db.js";
import { n as a, r as s, t as o } from "./mermaid-railroad-renderer.js";
import { t as i } from "./mermaid-populate-common-db.js";
import "./mermaid-core.js";
var p = e().RailroadEbnf.parser.LangiumParser,
  m = t((e) => {
    const r = e.alternatives.map(l);
    return 1 === r.length ? r[0] : { type: "choice", alternatives: r };
  }, "transformChoice"),
  l = t((e) => {
    const r = e.elements.map(f);
    return 1 === r.length ? r[0] : { type: "sequence", elements: r };
  }, "transformSequence"),
  u = t((e) => {
    switch (e.$type) {
      case "EbnfTerminal":
        return { type: "terminal", value: e.value };
      case "EbnfNonTerminal":
        return { type: "nonterminal", name: e.name };
      case "EbnfSpecial":
        return { type: "special", text: e.text };
      case "EbnfGroup":
        return m(e.element);
      case "EbnfOptional":
        return { type: "optional", element: m(e.element) };
      case "EbnfRepetition":
        return {
          type: "repetition",
          element: m(e.element),
          min: 0,
          max: 1 / 0,
        };
      default:
        throw new Error(`Unsupported EBNF primary node: ${e.$type}`);
    }
  }, "transformPrimary"),
  c = t((e, r) => {
    switch (r.$type) {
      case "EbnfOptionalPostfix":
        return { type: "optional", element: e };
      case "EbnfZeroOrMorePostfix":
        return { type: "repetition", element: e, min: 0, max: 1 / 0 };
      case "EbnfOneOrMorePostfix":
        return { type: "repetition", element: e, min: 1, max: 1 / 0 };
      case "EbnfExceptionPostfix":
        return {
          type: "sequence",
          elements: [e, { type: "terminal", value: "-" }, u(r.except)],
        };
      default:
        throw new Error(`Unsupported EBNF postfix node: ${r.$type}`);
    }
  }, "transformPostfix"),
  f = t(
    (e) => e.postfixes.reduce((e, r) => c(e, r), u(e.base)),
    "transformTerm",
  ),
  E = t(
    (e) => ({ name: e.name, definition: m(e.definition) }),
    "transformRule",
  ),
  y = t((e) => {
    i(e, o),
      e.title && o.setTitle(e.title),
      e.rules.map((e) => o.addRule(E(e)));
  }, "populateDb"),
  d = {
    parser: {
      parse: t((e) => {
        o.clear(), n.debug("[EBNF Parser] Starting Langium parse");
        const t = p.parse(e);
        if (t.lexerErrors.length > 0 || t.parserErrors.length > 0)
          throw new r(t);
        const a = t.value;
        n.debug("[EBNF Parser] Parsed rules:", a.rules.length),
          y(a),
          n.debug("[EBNF Parser] Parse complete");
      }, "parse"),
      parser: { yy: o },
    },
    db: o,
    renderer: s,
    styles: a,
  };
export { d as diagram };
