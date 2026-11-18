/**
 * @readable-header
 * FILE:      assets/shiki-lang-sparql.js
 * WAS:       sparql-C45tde-l.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (grammar data)
 * WHAT:      Syntax-highlighting grammar for "sparql" (a TextMate grammar as frozen JSON, exported as default).
 * WHY:       Colours code blocks tagged "sparql" in the side panel. Fetched on demand through the language list in shiki-languages-index.js.
 * USED BY:   assets/shiki-languages-index.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/shiki-lang-turtle.js (static import)
 * EXPORTS:   default  (export names are unchanged from the original; other files import them by these names)
 */
import e from "./shiki-lang-turtle.js";
var s = [
  ...e,
  Object.freeze(
    JSON.parse(
      '{"displayName":"SPARQL","fileTypes":["rq","sparql","sq"],"name":"sparql","patterns":[{"include":"source.turtle"},{"include":"#query-keyword-operators"},{"include":"#functions"},{"include":"#variables"},{"include":"#expression-operators"}],"repository":{"expression-operators":{"match":"\\\\|\\\\||&&|=|!=|[<>]|<=|>=|[-!*+/?^|]","name":"support.class.sparql"},"functions":{"match":"\\\\b(?i:concat|regex|asc|desc|bound|isiri|isuri|isblank|isliteral|isnumeric|str|lang|datatype|sameterm|langmatches|avg|count|group_concat|separator|max|min|sample|sum|iri|uri|bnode|strdt|uuid|struuid|strlang|strlen|substr|ucase|lcase|strstarts|strends|contains|strbefore|strafter|encode_for_uri|replace|abs|round|ceil|floor|rand|now|year|month|day|hours|minutes|seconds|timezone|tz|md5|sha1|sha256|sha384|sha512|coalesce|if)\\\\b","name":"support.function.sparql"},"query-keyword-operators":{"match":"\\\\b(?i:define|select|distinct|reduced|from|named|construct|ask|describe|where|graph|having|bind|as|filter|optional|union|order|by|group|limit|offset|values|insert data|delete data|with|delete|insert|clear|silent|default|all|create|drop|copy|move|add|to|using|service|not exists|exists|not in|in|minus|load)\\\\b","name":"keyword.control.sparql"},"variables":{"match":"(?<!\\\\w)[$?]\\\\w+","name":"constant.variable.sparql.turtle"}},"scopeName":"source.sparql","embeddedLangs":["turtle"]}',
    ),
  ),
];
export { s as default };
