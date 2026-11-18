/**
 * @readable-header
 * FILE:      assets/shiki-languages-index.js
 * WAS:       langs-BXKgIiQm.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     third-party - Shiki (version not determined)
 * WHAT:      Shiki bundled language registry (bundledLanguages, bundledLanguagesAlias, bundledLanguagesInfo) mapping language ids to lazy imports of assets/shiki-lang-*.js grammar chunks (336 references).
 * WHY:       Imported by sidepanel.js to load grammars on demand for syntax highlighting in chat code blocks.
 * USED BY:   assets/sidepanel.js (named in code (e.g. lazy-load list))
 * NEEDS:     assets/auth-and-saved-prompts.js (static import)
 *            assets/react-vendor-and-language-list.js (named in code)
 *            assets/shiki-lang-abap.js (named in code)
 *            assets/shiki-lang-actionscript-3.js (named in code)
 *            assets/shiki-lang-ada.js (named in code)
 *            assets/shiki-lang-angular-html.js (named in code)
 *            assets/shiki-lang-angular-ts.js (named in code)
 *            assets/shiki-lang-apache.js (named in code)
 *            ... and 229 more (full list in FILE_INDEX.md)
 * EXPORTS:   bundledLanguages, bundledLanguagesAlias, bundledLanguagesBase, bundledLanguagesInfo  (export names are unchanged from the original; other files import them by these names)
 */
const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/shiki-lang-angular-html.js",
      "assets/react-vendor-and-language-list.js",
      "assets/shiki-lang-html.js",
      "assets/shiki-lang-javascript.js",
      "assets/shiki-lang-css.js",
      "assets/shiki-lang-angular-ts.js",
      "assets/shiki-lang-scss.js",
      "assets/shiki-lang-apl.js",
      "assets/shiki-lang-xml.js",
      "assets/shiki-lang-java.js",
      "assets/shiki-lang-json.js",
      "assets/shiki-lang-astro.js",
      "assets/shiki-lang-typescript.js",
      "assets/shiki-lang-postcss.js",
      "assets/shiki-lang-tsx.js",
      "assets/shiki-lang-blade.js",
      "assets/shiki-lang-html-derivative.js",
      "assets/shiki-lang-sql.js",
      "assets/shiki-lang-bsl.js",
      "assets/shiki-lang-sdbl.js",
      "assets/shiki-lang-c.js",
      "assets/shiki-lang-cairo.js",
      "assets/shiki-lang-python.js",
      "assets/shiki-lang-cobol.js",
      "assets/shiki-lang-coffee.js",
      "assets/shiki-lang-cpp.js",
      "assets/shiki-lang-regexp.js",
      "assets/shiki-lang-glsl.js",
      "assets/shiki-lang-crystal.js",
      "assets/shiki-lang-shellscript.js",
      "assets/shiki-lang-edge.js",
      "assets/shiki-lang-elixir.js",
      "assets/shiki-lang-elm.js",
      "assets/shiki-lang-erb.js",
      "assets/shiki-lang-ruby.js",
      "assets/shiki-lang-haml.js",
      "assets/shiki-lang-graphql.js",
      "assets/shiki-lang-jsx.js",
      "assets/shiki-lang-lua.js",
      "assets/shiki-lang-yaml.js",
      "assets/shiki-lang-erlang.js",
      "assets/shiki-lang-markdown.js",
      "assets/shiki-lang-fortran-fixed-form.js",
      "assets/shiki-lang-fortran-free-form.js",
      "assets/shiki-lang-fsharp.js",
      "assets/shiki-lang-gdresource.js",
      "assets/shiki-lang-gdshader.js",
      "assets/shiki-lang-gdscript.js",
      "assets/shiki-lang-git-commit.js",
      "assets/shiki-lang-diff.js",
      "assets/shiki-lang-git-rebase.js",
      "assets/shiki-lang-glimmer-js.js",
      "assets/shiki-lang-glimmer-ts.js",
      "assets/shiki-lang-hack.js",
      "assets/shiki-lang-handlebars.js",
      "assets/shiki-lang-http.js",
      "assets/shiki-lang-hurl.js",
      "assets/shiki-lang-csv.js",
      "assets/shiki-lang-hxml.js",
      "assets/shiki-lang-haxe.js",
      "assets/shiki-lang-jinja.js",
      "assets/shiki-lang-jison.js",
      "assets/shiki-lang-julia.js",
      "assets/shiki-lang-r.js",
      "assets/shiki-lang-just.js",
      "assets/shiki-lang-perl.js",
      "assets/shiki-lang-latex.js",
      "assets/shiki-lang-tex.js",
      "assets/shiki-lang-liquid.js",
      "assets/shiki-lang-marko.js",
      "assets/shiki-lang-less.js",
      "assets/shiki-lang-mdc.js",
      "assets/shiki-lang-nextflow.js",
      "assets/shiki-lang-nextflow-groovy.js",
      "assets/shiki-lang-nginx.js",
      "assets/shiki-lang-nim.js",
      "assets/shiki-lang-php.js",
      "assets/shiki-lang-pug.js",
      "assets/shiki-lang-qml.js",
      "assets/shiki-lang-razor.js",
      "assets/shiki-lang-csharp.js",
      "assets/shiki-lang-rst.js",
      "assets/shiki-lang-cmake.js",
      "assets/shiki-lang-sas.js",
      "assets/shiki-lang-shaderlab.js",
      "assets/shiki-lang-hlsl.js",
      "assets/shiki-lang-shellsession.js",
      "assets/shiki-lang-soy.js",
      "assets/shiki-lang-sparql.js",
      "assets/shiki-lang-turtle.js",
      "assets/shiki-lang-stata.js",
      "assets/shiki-lang-surrealql.js",
      "assets/shiki-lang-svelte.js",
      "assets/shiki-lang-templ.js",
      "assets/shiki-lang-go.js",
      "assets/shiki-lang-ts-tags.js",
      "assets/shiki-lang-twig.js",
      "assets/shiki-lang-vue.js",
      "assets/shiki-lang-vue-html.js",
      "assets/shiki-lang-vue-vine.js",
      "assets/shiki-lang-stylus.js",
      "assets/shiki-lang-xsl.js",
    ]),
) => i.map((i) => d[i]);
import { Fn as _ } from "./auth-and-saved-prompts.js";
var i = [
    {
      id: "abap",
      name: "ABAP",
      import: () => _(() => import("./shiki-lang-abap.js"), []),
    },
    {
      id: "actionscript-3",
      name: "ActionScript",
      import: () => _(() => import("./shiki-lang-actionscript-3.js"), []),
    },
    {
      id: "ada",
      name: "Ada",
      import: () => _(() => import("./shiki-lang-ada.js"), []),
    },
    {
      id: "angular-html",
      name: "Angular HTML",
      import: () =>
        _(
          () => import("./shiki-lang-angular-html.js").then((_) => _.n),
          __vite__mapDeps([0, 1, 2, 3, 4]),
        ),
    },
    {
      id: "angular-ts",
      name: "Angular TypeScript",
      import: () =>
        _(
          () => import("./shiki-lang-angular-ts.js"),
          __vite__mapDeps([5, 0, 1, 2, 3, 4, 6]),
        ),
    },
    {
      id: "apache",
      name: "Apache Conf",
      import: () => _(() => import("./shiki-lang-apache.js"), []),
    },
    {
      id: "apex",
      name: "Apex",
      import: () => _(() => import("./shiki-lang-apex.js"), []),
    },
    {
      id: "apl",
      name: "APL",
      import: () =>
        _(
          () => import("./shiki-lang-apl.js"),
          __vite__mapDeps([7, 3, 1, 4, 2, 8, 9, 10]),
        ),
    },
    {
      id: "applescript",
      name: "AppleScript",
      import: () => _(() => import("./shiki-lang-applescript.js"), []),
    },
    {
      id: "ara",
      name: "Ara",
      import: () => _(() => import("./shiki-lang-ara.js"), []),
    },
    {
      id: "asciidoc",
      name: "AsciiDoc",
      aliases: ["adoc"],
      import: () => _(() => import("./shiki-lang-asciidoc.js"), []),
    },
    {
      id: "asm",
      name: "Assembly",
      import: () => _(() => import("./shiki-lang-asm.js"), []),
    },
    {
      id: "astro",
      name: "Astro",
      import: () =>
        _(
          () => import("./shiki-lang-astro.js"),
          __vite__mapDeps([11, 3, 1, 4, 10, 12, 13, 14]),
        ),
    },
    {
      id: "awk",
      name: "AWK",
      import: () => _(() => import("./shiki-lang-awk.js"), []),
    },
    {
      id: "ballerina",
      name: "Ballerina",
      import: () => _(() => import("./shiki-lang-ballerina.js"), []),
    },
    {
      id: "bat",
      name: "Batch File",
      aliases: ["batch"],
      import: () => _(() => import("./shiki-lang-bat.js"), []),
    },
    {
      id: "beancount",
      name: "Beancount",
      import: () => _(() => import("./shiki-lang-beancount.js"), []),
    },
    {
      id: "berry",
      name: "Berry",
      aliases: ["be"],
      import: () => _(() => import("./shiki-lang-berry.js"), []),
    },
    {
      id: "bibtex",
      name: "BibTeX",
      import: () => _(() => import("./shiki-lang-bibtex.js"), []),
    },
    {
      id: "bicep",
      name: "Bicep",
      import: () => _(() => import("./shiki-lang-bicep.js"), []),
    },
    {
      id: "bird2",
      name: "BIRD2 Configuration",
      aliases: ["bird"],
      import: () => _(() => import("./shiki-lang-bird2.js"), []),
    },
    {
      id: "blade",
      name: "Blade",
      import: () =>
        _(
          () => import("./shiki-lang-blade.js"),
          __vite__mapDeps([15, 3, 1, 4, 2, 8, 9, 10, 16, 17]),
        ),
    },
    {
      id: "bsl",
      name: "1C (Enterprise)",
      aliases: ["1c"],
      import: () =>
        _(() => import("./shiki-lang-bsl.js"), __vite__mapDeps([18, 19])),
    },
    {
      id: "c",
      name: "C",
      import: () =>
        _(
          () => import("./shiki-lang-c.js").then((_) => _.n),
          __vite__mapDeps([20, 1]),
        ),
    },
    {
      id: "c3",
      name: "C3",
      import: () => _(() => import("./shiki-lang-c3.js"), []),
    },
    {
      id: "cadence",
      name: "Cadence",
      aliases: ["cdc"],
      import: () => _(() => import("./shiki-lang-cadence.js"), []),
    },
    {
      id: "cairo",
      name: "Cairo",
      import: () =>
        _(() => import("./shiki-lang-cairo.js"), __vite__mapDeps([21, 22])),
    },
    {
      id: "clarity",
      name: "Clarity",
      import: () => _(() => import("./shiki-lang-clarity.js"), []),
    },
    {
      id: "clojure",
      name: "Clojure",
      aliases: ["clj"],
      import: () => _(() => import("./shiki-lang-clojure.js"), []),
    },
    {
      id: "cmake",
      name: "CMake",
      import: () => _(() => import("./shiki-lang-cmake.js"), []),
    },
    {
      id: "cobol",
      name: "COBOL",
      import: () =>
        _(
          () => import("./shiki-lang-cobol.js"),
          __vite__mapDeps([23, 2, 1, 3, 4, 9]),
        ),
    },
    {
      id: "codeowners",
      name: "CODEOWNERS",
      import: () => _(() => import("./shiki-lang-codeowners.js"), []),
    },
    {
      id: "codeql",
      name: "CodeQL",
      aliases: ["ql"],
      import: () => _(() => import("./shiki-lang-codeql.js"), []),
    },
    {
      id: "coffee",
      name: "CoffeeScript",
      aliases: ["coffeescript"],
      import: () =>
        _(() => import("./shiki-lang-coffee.js"), __vite__mapDeps([24, 3, 1])),
    },
    {
      id: "common-lisp",
      name: "Common Lisp",
      aliases: ["lisp"],
      import: () => _(() => import("./shiki-lang-common-lisp.js"), []),
    },
    {
      id: "coq",
      name: "Coq",
      import: () => _(() => import("./shiki-lang-coq.js"), []),
    },
    {
      id: "cpp",
      name: "C++",
      aliases: ["c++"],
      import: () =>
        _(
          () => import("./shiki-lang-cpp.js").then((_) => _.n),
          __vite__mapDeps([25, 1, 17, 26, 27, 20]),
        ),
    },
    {
      id: "crystal",
      name: "Crystal",
      import: () =>
        _(
          () => import("./shiki-lang-crystal.js"),
          __vite__mapDeps([28, 3, 1, 4, 2, 17, 20, 29]),
        ),
    },
    {
      id: "csharp",
      name: "C#",
      aliases: ["c#", "cs"],
      import: () => _(() => import("./shiki-lang-csharp.js"), []),
    },
    {
      id: "css",
      name: "CSS",
      import: () =>
        _(
          () => import("./shiki-lang-css.js").then((_) => _.n),
          __vite__mapDeps([4, 1]),
        ),
    },
    {
      id: "csv",
      name: "CSV",
      import: () => _(() => import("./shiki-lang-csv.js"), []),
    },
    {
      id: "cue",
      name: "CUE",
      import: () => _(() => import("./shiki-lang-cue.js"), []),
    },
    {
      id: "cypher",
      name: "Cypher",
      aliases: ["cql"],
      import: () => _(() => import("./shiki-lang-cypher.js"), []),
    },
    {
      id: "d",
      name: "D",
      import: () => _(() => import("./shiki-lang-d.js"), []),
    },
    {
      id: "dart",
      name: "Dart",
      import: () => _(() => import("./shiki-lang-dart.js"), []),
    },
    {
      id: "dax",
      name: "DAX",
      import: () => _(() => import("./shiki-lang-dax.js"), []),
    },
    {
      id: "desktop",
      name: "Desktop",
      import: () => _(() => import("./shiki-lang-desktop.js"), []),
    },
    {
      id: "diff",
      name: "Diff",
      import: () => _(() => import("./shiki-lang-diff.js"), []),
    },
    {
      id: "docker",
      name: "Dockerfile",
      aliases: ["dockerfile"],
      import: () => _(() => import("./shiki-lang-docker.js"), []),
    },
    {
      id: "dotenv",
      name: "dotEnv",
      import: () => _(() => import("./shiki-lang-dotenv.js"), []),
    },
    {
      id: "dream-maker",
      name: "Dream Maker",
      import: () => _(() => import("./shiki-lang-dream-maker.js"), []),
    },
    {
      id: "edge",
      name: "Edge",
      import: () =>
        _(
          () => import("./shiki-lang-edge.js"),
          __vite__mapDeps([30, 2, 1, 3, 4, 12, 16]),
        ),
    },
    {
      id: "elixir",
      name: "Elixir",
      import: () =>
        _(
          () => import("./shiki-lang-elixir.js"),
          __vite__mapDeps([31, 2, 1, 3, 4]),
        ),
    },
    {
      id: "elm",
      name: "Elm",
      import: () =>
        _(
          () => import("./shiki-lang-elm.js"),
          __vite__mapDeps([32, 27, 1, 20]),
        ),
    },
    {
      id: "emacs-lisp",
      name: "Emacs Lisp",
      aliases: ["elisp"],
      import: () => _(() => import("./shiki-lang-emacs-lisp.js"), []),
    },
    {
      id: "erb",
      name: "ERB",
      import: () =>
        _(
          () => import("./shiki-lang-erb.js"),
          __vite__mapDeps([
            33, 2, 1, 3, 4, 34, 8, 9, 17, 20, 25, 26, 27, 29, 35, 36, 12, 14,
            37, 38, 39,
          ]),
        ),
    },
    {
      id: "erlang",
      name: "Erlang",
      aliases: ["erl"],
      import: () =>
        _(() => import("./shiki-lang-erlang.js"), __vite__mapDeps([40, 41])),
    },
    {
      id: "fennel",
      name: "Fennel",
      import: () => _(() => import("./shiki-lang-fennel.js"), []),
    },
    {
      id: "fish",
      name: "Fish",
      import: () => _(() => import("./shiki-lang-fish.js"), []),
    },
    {
      id: "fluent",
      name: "Fluent",
      aliases: ["ftl"],
      import: () => _(() => import("./shiki-lang-fluent.js"), []),
    },
    {
      id: "fortran-fixed-form",
      name: "Fortran (Fixed Form)",
      aliases: ["f", "for", "f77"],
      import: () =>
        _(
          () => import("./shiki-lang-fortran-fixed-form.js"),
          __vite__mapDeps([42, 43]),
        ),
    },
    {
      id: "fortran-free-form",
      name: "Fortran (Free Form)",
      aliases: ["f90", "f95", "f03", "f08", "f18"],
      import: () => _(() => import("./shiki-lang-fortran-free-form.js"), []),
    },
    {
      id: "fsharp",
      name: "F#",
      aliases: ["f#", "fs"],
      import: () =>
        _(() => import("./shiki-lang-fsharp.js"), __vite__mapDeps([44, 41])),
    },
    {
      id: "gdresource",
      name: "GDResource",
      aliases: ["tscn", "tres"],
      import: () =>
        _(
          () => import("./shiki-lang-gdresource.js"),
          __vite__mapDeps([45, 46, 47]),
        ),
    },
    {
      id: "gdscript",
      name: "GDScript",
      aliases: ["gd"],
      import: () => _(() => import("./shiki-lang-gdscript.js"), []),
    },
    {
      id: "gdshader",
      name: "GDShader",
      import: () => _(() => import("./shiki-lang-gdshader.js"), []),
    },
    {
      id: "genie",
      name: "Genie",
      import: () => _(() => import("./shiki-lang-genie.js"), []),
    },
    {
      id: "gherkin",
      name: "Gherkin",
      import: () => _(() => import("./shiki-lang-gherkin.js"), []),
    },
    {
      id: "git-commit",
      name: "Git Commit Message",
      import: () =>
        _(
          () => import("./shiki-lang-git-commit.js"),
          __vite__mapDeps([48, 49]),
        ),
    },
    {
      id: "git-rebase",
      name: "Git Rebase Message",
      import: () =>
        _(
          () => import("./shiki-lang-git-rebase.js"),
          __vite__mapDeps([50, 29, 1]),
        ),
    },
    {
      id: "gleam",
      name: "Gleam",
      import: () => _(() => import("./shiki-lang-gleam.js"), []),
    },
    {
      id: "glimmer-js",
      name: "Glimmer JS",
      aliases: ["gjs"],
      import: () =>
        _(
          () => import("./shiki-lang-glimmer-js.js"),
          __vite__mapDeps([51, 3, 1, 4, 2, 12]),
        ),
    },
    {
      id: "glimmer-ts",
      name: "Glimmer TS",
      aliases: ["gts"],
      import: () =>
        _(
          () => import("./shiki-lang-glimmer-ts.js"),
          __vite__mapDeps([52, 3, 1, 4, 2, 12]),
        ),
    },
    {
      id: "glsl",
      name: "GLSL",
      import: () =>
        _(
          () => import("./shiki-lang-glsl.js").then((_) => _.n),
          __vite__mapDeps([27, 1, 20]),
        ),
    },
    {
      id: "gn",
      name: "GN",
      import: () => _(() => import("./shiki-lang-gn.js"), []),
    },
    {
      id: "gnuplot",
      name: "Gnuplot",
      import: () => _(() => import("./shiki-lang-gnuplot.js"), []),
    },
    {
      id: "go",
      name: "Go",
      import: () => _(() => import("./shiki-lang-go.js"), []),
    },
    {
      id: "graphql",
      name: "GraphQL",
      aliases: ["gql"],
      import: () =>
        _(
          () => import("./shiki-lang-graphql.js").then((_) => _.n),
          __vite__mapDeps([36, 1, 3, 12, 14, 37]),
        ),
    },
    {
      id: "groovy",
      name: "Groovy",
      import: () => _(() => import("./shiki-lang-groovy.js"), []),
    },
    {
      id: "hack",
      name: "Hack",
      import: () =>
        _(
          () => import("./shiki-lang-hack.js"),
          __vite__mapDeps([53, 2, 1, 3, 4, 17]),
        ),
    },
    {
      id: "haml",
      name: "Ruby Haml",
      import: () =>
        _(
          () => import("./shiki-lang-haml.js").then((_) => _.n),
          __vite__mapDeps([35, 1, 3, 4]),
        ),
    },
    {
      id: "handlebars",
      name: "Handlebars",
      aliases: ["hbs"],
      import: () =>
        _(
          () => import("./shiki-lang-handlebars.js"),
          __vite__mapDeps([54, 3, 1, 4, 2, 39]),
        ),
    },
    {
      id: "haskell",
      name: "Haskell",
      aliases: ["hs"],
      import: () => _(() => import("./shiki-lang-haskell.js"), []),
    },
    {
      id: "haxe",
      name: "Haxe",
      import: () => _(() => import("./shiki-lang-haxe.js"), []),
    },
    {
      id: "hcl",
      name: "HashiCorp HCL",
      import: () => _(() => import("./shiki-lang-hcl.js"), []),
    },
    {
      id: "hjson",
      name: "Hjson",
      import: () => _(() => import("./shiki-lang-hjson.js"), []),
    },
    {
      id: "hlsl",
      name: "HLSL",
      import: () => _(() => import("./shiki-lang-hlsl.js"), []),
    },
    {
      id: "html",
      name: "HTML",
      import: () =>
        _(
          () => import("./shiki-lang-html.js").then((_) => _.n),
          __vite__mapDeps([2, 1, 3, 4]),
        ),
    },
    {
      id: "html-derivative",
      name: "HTML (Derivative)",
      import: () =>
        _(
          () => import("./shiki-lang-html-derivative.js"),
          __vite__mapDeps([16, 2, 1, 3, 4]),
        ),
    },
    {
      id: "http",
      name: "HTTP",
      import: () =>
        _(
          () => import("./shiki-lang-http.js"),
          __vite__mapDeps([55, 8, 1, 9, 10, 29, 36, 3, 12, 14, 37]),
        ),
    },
    {
      id: "hurl",
      name: "Hurl",
      import: () =>
        _(
          () => import("./shiki-lang-hurl.js"),
          __vite__mapDeps([56, 8, 1, 9, 57, 36, 3, 12, 14, 37]),
        ),
    },
    {
      id: "hxml",
      name: "HXML",
      import: () =>
        _(() => import("./shiki-lang-hxml.js"), __vite__mapDeps([58, 59])),
    },
    {
      id: "hy",
      name: "Hy",
      import: () => _(() => import("./shiki-lang-hy.js"), []),
    },
    {
      id: "imba",
      name: "Imba",
      import: () => _(() => import("./shiki-lang-imba.js"), []),
    },
    {
      id: "ini",
      name: "INI",
      aliases: ["properties"],
      import: () => _(() => import("./shiki-lang-ini.js"), []),
    },
    {
      id: "java",
      name: "Java",
      import: () =>
        _(
          () => import("./shiki-lang-java.js").then((_) => _.n),
          __vite__mapDeps([9, 1]),
        ),
    },
    {
      id: "javascript",
      name: "JavaScript",
      aliases: ["js", "cjs", "mjs"],
      import: () =>
        _(
          () => import("./shiki-lang-javascript.js").then((_) => _.n),
          __vite__mapDeps([3, 1]),
        ),
    },
    {
      id: "jinja",
      name: "Jinja",
      import: () =>
        _(
          () => import("./shiki-lang-jinja.js"),
          __vite__mapDeps([60, 2, 1, 3, 4]),
        ),
    },
    {
      id: "jison",
      name: "Jison",
      import: () =>
        _(() => import("./shiki-lang-jison.js"), __vite__mapDeps([61, 3, 1])),
    },
    {
      id: "json",
      name: "JSON",
      import: () =>
        _(
          () => import("./shiki-lang-json.js").then((_) => _.n),
          __vite__mapDeps([10, 1]),
        ),
    },
    {
      id: "json5",
      name: "JSON5",
      import: () => _(() => import("./shiki-lang-json5.js"), []),
    },
    {
      id: "jsonc",
      name: "JSON with Comments",
      import: () => _(() => import("./shiki-lang-jsonc.js"), []),
    },
    {
      id: "jsonl",
      name: "JSON Lines",
      import: () => _(() => import("./shiki-lang-jsonl.js"), []),
    },
    {
      id: "jsonnet",
      name: "Jsonnet",
      import: () => _(() => import("./shiki-lang-jsonnet.js"), []),
    },
    {
      id: "jssm",
      name: "JSSM",
      aliases: ["fsl"],
      import: () => _(() => import("./shiki-lang-jssm.js"), []),
    },
    {
      id: "jsx",
      name: "JSX",
      import: () =>
        _(
          () => import("./shiki-lang-jsx.js").then((_) => _.n),
          __vite__mapDeps([37, 1]),
        ),
    },
    {
      id: "julia",
      name: "Julia",
      aliases: ["jl"],
      import: () =>
        _(
          () => import("./shiki-lang-julia.js"),
          __vite__mapDeps([62, 3, 1, 17, 22, 25, 26, 27, 20, 63]),
        ),
    },
    {
      id: "just",
      name: "Just",
      import: () =>
        _(
          () => import("./shiki-lang-just.js"),
          __vite__mapDeps([
            64, 3, 1, 12, 22, 29, 34, 4, 2, 8, 9, 17, 20, 25, 26, 27, 35, 36,
            14, 37, 38, 39, 65,
          ]),
        ),
    },
    {
      id: "kdl",
      name: "KDL",
      import: () => _(() => import("./shiki-lang-kdl.js"), []),
    },
    {
      id: "kotlin",
      name: "Kotlin",
      aliases: ["kt", "kts"],
      import: () => _(() => import("./shiki-lang-kotlin.js"), []),
    },
    {
      id: "kusto",
      name: "Kusto",
      aliases: ["kql"],
      import: () => _(() => import("./shiki-lang-kusto.js"), []),
    },
    {
      id: "latex",
      name: "LaTeX",
      import: () =>
        _(
          () => import("./shiki-lang-latex.js"),
          __vite__mapDeps([66, 67, 63, 1]),
        ),
    },
    {
      id: "lean",
      name: "Lean 4",
      aliases: ["lean4"],
      import: () => _(() => import("./shiki-lang-lean.js"), []),
    },
    {
      id: "less",
      name: "Less",
      import: () => _(() => import("./shiki-lang-less.js"), []),
    },
    {
      id: "liquid",
      name: "Liquid",
      import: () =>
        _(
          () => import("./shiki-lang-liquid.js"),
          __vite__mapDeps([68, 3, 1, 4, 2, 10]),
        ),
    },
    {
      id: "llvm",
      name: "LLVM IR",
      import: () => _(() => import("./shiki-lang-llvm.js"), []),
    },
    {
      id: "log",
      name: "Log file",
      import: () => _(() => import("./shiki-lang-log.js"), []),
    },
    {
      id: "logo",
      name: "Logo",
      import: () => _(() => import("./shiki-lang-logo.js"), []),
    },
    {
      id: "lua",
      name: "Lua",
      import: () =>
        _(
          () => import("./shiki-lang-lua.js").then((_) => _.n),
          __vite__mapDeps([38, 1, 20]),
        ),
    },
    {
      id: "luau",
      name: "Luau",
      import: () => _(() => import("./shiki-lang-luau.js"), []),
    },
    {
      id: "make",
      name: "Makefile",
      aliases: ["makefile"],
      import: () => _(() => import("./shiki-lang-make.js"), []),
    },
    {
      id: "markdown",
      name: "Markdown",
      aliases: ["md"],
      import: () => _(() => import("./shiki-lang-markdown.js"), []),
    },
    {
      id: "marko",
      name: "Marko",
      import: () =>
        _(
          () => import("./shiki-lang-marko.js"),
          __vite__mapDeps([69, 4, 1, 6, 12, 70]),
        ),
    },
    {
      id: "matlab",
      name: "MATLAB",
      import: () => _(() => import("./shiki-lang-matlab.js"), []),
    },
    {
      id: "mdc",
      name: "MDC",
      import: () =>
        _(
          () => import("./shiki-lang-mdc.js"),
          __vite__mapDeps([71, 16, 2, 1, 3, 4, 39, 41]),
        ),
    },
    {
      id: "mdx",
      name: "MDX",
      import: () => _(() => import("./shiki-lang-mdx.js"), []),
    },
    {
      id: "mermaid",
      name: "Mermaid",
      aliases: ["mmd"],
      import: () => _(() => import("./shiki-lang-mermaid.js"), []),
    },
    {
      id: "mipsasm",
      name: "MIPS Assembly",
      aliases: ["mips"],
      import: () => _(() => import("./shiki-lang-mipsasm.js"), []),
    },
    {
      id: "mojo",
      name: "Mojo",
      import: () => _(() => import("./shiki-lang-mojo.js"), []),
    },
    {
      id: "moonbit",
      name: "MoonBit",
      aliases: ["mbt", "mbti"],
      import: () => _(() => import("./shiki-lang-moonbit.js"), []),
    },
    {
      id: "move",
      name: "Move",
      import: () => _(() => import("./shiki-lang-move.js"), []),
    },
    {
      id: "narrat",
      name: "Narrat Language",
      aliases: ["nar"],
      import: () => _(() => import("./shiki-lang-narrat.js"), []),
    },
    {
      id: "nextflow",
      name: "Nextflow",
      aliases: ["nf"],
      import: () =>
        _(() => import("./shiki-lang-nextflow.js"), __vite__mapDeps([72, 73])),
    },
    {
      id: "nextflow-groovy",
      name: "nextflow-groovy",
      import: () => _(() => import("./shiki-lang-nextflow-groovy.js"), []),
    },
    {
      id: "nginx",
      name: "Nginx",
      import: () =>
        _(
          () => import("./shiki-lang-nginx.js"),
          __vite__mapDeps([74, 38, 1, 20]),
        ),
    },
    {
      id: "nim",
      name: "Nim",
      import: () =>
        _(
          () => import("./shiki-lang-nim.js"),
          __vite__mapDeps([75, 3, 1, 4, 2, 8, 9, 20, 27, 41]),
        ),
    },
    {
      id: "nix",
      name: "Nix",
      import: () => _(() => import("./shiki-lang-nix.js"), []),
    },
    {
      id: "nushell",
      name: "nushell",
      aliases: ["nu"],
      import: () => _(() => import("./shiki-lang-nushell.js"), []),
    },
    {
      id: "objective-c",
      name: "Objective-C",
      aliases: ["objc"],
      import: () => _(() => import("./shiki-lang-objective-c.js"), []),
    },
    {
      id: "objective-cpp",
      name: "Objective-C++",
      import: () => _(() => import("./shiki-lang-objective-cpp.js"), []),
    },
    {
      id: "ocaml",
      name: "OCaml",
      import: () => _(() => import("./shiki-lang-ocaml.js"), []),
    },
    {
      id: "odin",
      name: "Odin",
      import: () => _(() => import("./shiki-lang-odin.js"), []),
    },
    {
      id: "openscad",
      name: "OpenSCAD",
      aliases: ["scad"],
      import: () => _(() => import("./shiki-lang-openscad.js"), []),
    },
    {
      id: "pascal",
      name: "Pascal",
      import: () => _(() => import("./shiki-lang-pascal.js"), []),
    },
    {
      id: "perl",
      name: "Perl",
      import: () =>
        _(
          () => import("./shiki-lang-perl.js"),
          __vite__mapDeps([65, 3, 1, 4, 2, 8, 9, 17]),
        ),
    },
    {
      id: "php",
      name: "PHP",
      import: () =>
        _(
          () => import("./shiki-lang-php.js"),
          __vite__mapDeps([76, 3, 1, 4, 2, 8, 9, 10, 17]),
        ),
    },
    {
      id: "pkl",
      name: "Pkl",
      import: () => _(() => import("./shiki-lang-pkl.js"), []),
    },
    {
      id: "plsql",
      name: "PL/SQL",
      import: () => _(() => import("./shiki-lang-plsql.js"), []),
    },
    {
      id: "po",
      name: "Gettext PO",
      aliases: ["pot", "potx"],
      import: () => _(() => import("./shiki-lang-po.js"), []),
    },
    {
      id: "polar",
      name: "Polar",
      import: () => _(() => import("./shiki-lang-polar.js"), []),
    },
    {
      id: "postcss",
      name: "PostCSS",
      import: () => _(() => import("./shiki-lang-postcss.js"), []),
    },
    {
      id: "powerquery",
      name: "PowerQuery",
      import: () => _(() => import("./shiki-lang-powerquery.js"), []),
    },
    {
      id: "powershell",
      name: "PowerShell",
      aliases: ["ps", "ps1"],
      import: () => _(() => import("./shiki-lang-powershell.js"), []),
    },
    {
      id: "prisma",
      name: "Prisma",
      import: () => _(() => import("./shiki-lang-prisma.js"), []),
    },
    {
      id: "prolog",
      name: "Prolog",
      import: () => _(() => import("./shiki-lang-prolog.js"), []),
    },
    {
      id: "proto",
      name: "Protocol Buffer 3",
      aliases: ["protobuf"],
      import: () => _(() => import("./shiki-lang-proto.js"), []),
    },
    {
      id: "pug",
      name: "Pug",
      aliases: ["jade"],
      import: () =>
        _(
          () => import("./shiki-lang-pug.js"),
          __vite__mapDeps([77, 3, 1, 4, 2]),
        ),
    },
    {
      id: "puppet",
      name: "Puppet",
      import: () => _(() => import("./shiki-lang-puppet.js"), []),
    },
    {
      id: "purescript",
      name: "PureScript",
      import: () => _(() => import("./shiki-lang-purescript.js"), []),
    },
    {
      id: "python",
      name: "Python",
      aliases: ["py"],
      import: () => _(() => import("./shiki-lang-python.js"), []),
    },
    {
      id: "qml",
      name: "QML",
      import: () =>
        _(() => import("./shiki-lang-qml.js"), __vite__mapDeps([78, 3, 1])),
    },
    {
      id: "qmldir",
      name: "QML Directory",
      import: () => _(() => import("./shiki-lang-qmldir.js"), []),
    },
    {
      id: "qss",
      name: "Qt Style Sheets",
      import: () => _(() => import("./shiki-lang-qss.js"), []),
    },
    {
      id: "r",
      name: "R",
      import: () =>
        _(
          () => import("./shiki-lang-r.js").then((_) => _.n),
          __vite__mapDeps([63, 1]),
        ),
    },
    {
      id: "racket",
      name: "Racket",
      import: () => _(() => import("./shiki-lang-racket.js"), []),
    },
    {
      id: "raku",
      name: "Raku",
      aliases: ["perl6"],
      import: () => _(() => import("./shiki-lang-raku.js"), []),
    },
    {
      id: "razor",
      name: "ASP.NET Razor",
      import: () =>
        _(
          () => import("./shiki-lang-razor.js"),
          __vite__mapDeps([79, 2, 1, 3, 4, 80]),
        ),
    },
    {
      id: "reg",
      name: "Windows Registry Script",
      import: () => _(() => import("./shiki-lang-reg.js"), []),
    },
    {
      id: "regexp",
      name: "RegExp",
      aliases: ["regex"],
      import: () =>
        _(
          () => import("./shiki-lang-regexp.js").then((_) => _.n),
          __vite__mapDeps([26, 1]),
        ),
    },
    {
      id: "rel",
      name: "Rel",
      import: () => _(() => import("./shiki-lang-rel.js"), []),
    },
    {
      id: "riscv",
      name: "RISC-V",
      import: () => _(() => import("./shiki-lang-riscv.js"), []),
    },
    {
      id: "ron",
      name: "RON",
      import: () => _(() => import("./shiki-lang-ron.js"), []),
    },
    {
      id: "rosmsg",
      name: "ROS Interface",
      import: () => _(() => import("./shiki-lang-rosmsg.js"), []),
    },
    {
      id: "rst",
      name: "reStructuredText",
      import: () =>
        _(
          () => import("./shiki-lang-rst.js"),
          __vite__mapDeps([
            81, 3, 1, 16, 2, 4, 22, 82, 25, 17, 26, 27, 20, 29, 39, 34, 8, 9,
            35, 36, 12, 14, 37, 38,
          ]),
        ),
    },
    {
      id: "ruby",
      name: "Ruby",
      aliases: ["rb"],
      import: () =>
        _(
          () => import("./shiki-lang-ruby.js"),
          __vite__mapDeps([
            34, 3, 1, 4, 2, 8, 9, 17, 20, 25, 26, 27, 29, 35, 36, 12, 14, 37,
            38, 39,
          ]),
        ),
    },
    {
      id: "rust",
      name: "Rust",
      aliases: ["rs"],
      import: () => _(() => import("./shiki-lang-rust.js"), []),
    },
    {
      id: "sas",
      name: "SAS",
      import: () =>
        _(() => import("./shiki-lang-sas.js"), __vite__mapDeps([83, 17, 1])),
    },
    {
      id: "sass",
      name: "Sass",
      import: () => _(() => import("./shiki-lang-sass.js"), []),
    },
    {
      id: "scala",
      name: "Scala",
      import: () => _(() => import("./shiki-lang-scala.js"), []),
    },
    {
      id: "scheme",
      name: "Scheme",
      import: () => _(() => import("./shiki-lang-scheme.js"), []),
    },
    {
      id: "scss",
      name: "SCSS",
      import: () =>
        _(
          () => import("./shiki-lang-scss.js").then((_) => _.n),
          __vite__mapDeps([6, 1, 4]),
        ),
    },
    {
      id: "sdbl",
      name: "1C (Query)",
      aliases: ["1c-query"],
      import: () => _(() => import("./shiki-lang-sdbl.js"), []),
    },
    {
      id: "shaderlab",
      name: "ShaderLab",
      aliases: ["shader"],
      import: () =>
        _(() => import("./shiki-lang-shaderlab.js"), __vite__mapDeps([84, 85])),
    },
    {
      id: "shellscript",
      name: "Shell",
      aliases: ["bash", "sh", "shell", "zsh"],
      import: () =>
        _(
          () => import("./shiki-lang-shellscript.js").then((_) => _.n),
          __vite__mapDeps([29, 1]),
        ),
    },
    {
      id: "shellsession",
      name: "Shell Session",
      aliases: ["console"],
      import: () =>
        _(
          () => import("./shiki-lang-shellsession.js"),
          __vite__mapDeps([86, 29, 1]),
        ),
    },
    {
      id: "smalltalk",
      name: "Smalltalk",
      import: () => _(() => import("./shiki-lang-smalltalk.js"), []),
    },
    {
      id: "solidity",
      name: "Solidity",
      import: () => _(() => import("./shiki-lang-solidity.js"), []),
    },
    {
      id: "soy",
      name: "Closure Templates",
      aliases: ["closure-templates"],
      import: () =>
        _(
          () => import("./shiki-lang-soy.js"),
          __vite__mapDeps([87, 2, 1, 3, 4]),
        ),
    },
    {
      id: "sparql",
      name: "SPARQL",
      import: () =>
        _(() => import("./shiki-lang-sparql.js"), __vite__mapDeps([88, 89])),
    },
    {
      id: "splunk",
      name: "Splunk Query Language",
      aliases: ["spl"],
      import: () => _(() => import("./shiki-lang-splunk.js"), []),
    },
    {
      id: "sql",
      name: "SQL",
      import: () =>
        _(
          () => import("./shiki-lang-sql.js").then((_) => _.n),
          __vite__mapDeps([17, 1]),
        ),
    },
    {
      id: "ssh-config",
      name: "SSH Config",
      import: () => _(() => import("./shiki-lang-ssh-config.js"), []),
    },
    {
      id: "stata",
      name: "Stata",
      import: () =>
        _(() => import("./shiki-lang-stata.js"), __vite__mapDeps([90, 17, 1])),
    },
    {
      id: "stylus",
      name: "Stylus",
      aliases: ["styl"],
      import: () => _(() => import("./shiki-lang-stylus.js"), []),
    },
    {
      id: "surrealql",
      name: "SurrealQL",
      aliases: ["surql"],
      import: () =>
        _(
          () => import("./shiki-lang-surrealql.js"),
          __vite__mapDeps([91, 3, 1]),
        ),
    },
    {
      id: "svelte",
      name: "Svelte",
      import: () =>
        _(
          () => import("./shiki-lang-svelte.js"),
          __vite__mapDeps([92, 3, 1, 4, 12, 13]),
        ),
    },
    {
      id: "swift",
      name: "Swift",
      import: () => _(() => import("./shiki-lang-swift.js"), []),
    },
    {
      id: "system-verilog",
      name: "SystemVerilog",
      import: () => _(() => import("./shiki-lang-system-verilog.js"), []),
    },
    {
      id: "systemd",
      name: "Systemd Units",
      import: () => _(() => import("./shiki-lang-systemd.js"), []),
    },
    {
      id: "talonscript",
      name: "TalonScript",
      aliases: ["talon"],
      import: () => _(() => import("./shiki-lang-talonscript.js"), []),
    },
    {
      id: "tasl",
      name: "Tasl",
      import: () => _(() => import("./shiki-lang-tasl.js"), []),
    },
    {
      id: "tcl",
      name: "Tcl",
      import: () => _(() => import("./shiki-lang-tcl.js"), []),
    },
    {
      id: "templ",
      name: "Templ",
      import: () =>
        _(
          () => import("./shiki-lang-templ.js"),
          __vite__mapDeps([93, 3, 1, 4, 94]),
        ),
    },
    {
      id: "terraform",
      name: "Terraform",
      aliases: ["tf", "tfvars"],
      import: () => _(() => import("./shiki-lang-terraform.js"), []),
    },
    {
      id: "tex",
      name: "TeX",
      import: () =>
        _(() => import("./shiki-lang-tex.js"), __vite__mapDeps([67, 63, 1])),
    },
    {
      id: "toml",
      name: "TOML",
      import: () => _(() => import("./shiki-lang-toml.js"), []),
    },
    {
      id: "ts-tags",
      name: "TypeScript with Tags",
      aliases: ["lit"],
      import: () =>
        _(
          () => import("./shiki-lang-ts-tags.js"),
          __vite__mapDeps([95, 3, 1, 4, 2, 8, 9, 12, 17, 27, 20]),
        ),
    },
    {
      id: "tsv",
      name: "TSV",
      import: () => _(() => import("./shiki-lang-tsv.js"), []),
    },
    {
      id: "tsx",
      name: "TSX",
      import: () =>
        _(
          () => import("./shiki-lang-tsx.js").then((_) => _.n),
          __vite__mapDeps([14, 1]),
        ),
    },
    {
      id: "turtle",
      name: "Turtle",
      import: () => _(() => import("./shiki-lang-turtle.js"), []),
    },
    {
      id: "twig",
      name: "Twig",
      import: () =>
        _(
          () => import("./shiki-lang-twig.js"),
          __vite__mapDeps([
            96, 3, 1, 4, 6, 22, 34, 2, 8, 9, 17, 20, 25, 26, 27, 29, 35, 36, 12,
            14, 37, 38, 39, 76, 10,
          ]),
        ),
    },
    {
      id: "typescript",
      name: "TypeScript",
      aliases: ["ts", "cts", "mts"],
      import: () =>
        _(
          () => import("./shiki-lang-typescript.js").then((_) => _.n),
          __vite__mapDeps([12, 1]),
        ),
    },
    {
      id: "typespec",
      name: "TypeSpec",
      aliases: ["tsp"],
      import: () => _(() => import("./shiki-lang-typespec.js"), []),
    },
    {
      id: "typst",
      name: "Typst",
      aliases: ["typ"],
      import: () => _(() => import("./shiki-lang-typst.js"), []),
    },
    {
      id: "v",
      name: "V",
      import: () => _(() => import("./shiki-lang-v.js"), []),
    },
    {
      id: "vala",
      name: "Vala",
      import: () => _(() => import("./shiki-lang-vala.js"), []),
    },
    {
      id: "vb",
      name: "Visual Basic",
      aliases: ["cmd"],
      import: () => _(() => import("./shiki-lang-vb.js"), []),
    },
    {
      id: "verilog",
      name: "Verilog",
      import: () => _(() => import("./shiki-lang-verilog.js"), []),
    },
    {
      id: "vhdl",
      name: "VHDL",
      import: () => _(() => import("./shiki-lang-vhdl.js"), []),
    },
    {
      id: "viml",
      name: "Vim Script",
      aliases: ["vim", "vimscript"],
      import: () => _(() => import("./shiki-lang-viml.js"), []),
    },
    {
      id: "vue",
      name: "Vue",
      import: () =>
        _(
          () => import("./shiki-lang-vue.js"),
          __vite__mapDeps([97, 3, 1, 4, 2, 10, 12, 16]),
        ),
    },
    {
      id: "vue-html",
      name: "Vue HTML",
      import: () =>
        _(
          () => import("./shiki-lang-vue-html.js"),
          __vite__mapDeps([98, 3, 1]),
        ),
    },
    {
      id: "vue-vine",
      name: "Vue Vine",
      import: () =>
        _(
          () => import("./shiki-lang-vue-vine.js"),
          __vite__mapDeps([99, 3, 1, 4, 6, 13, 70, 100]),
        ),
    },
    {
      id: "vyper",
      name: "Vyper",
      aliases: ["vy"],
      import: () => _(() => import("./shiki-lang-vyper.js"), []),
    },
    {
      id: "wasm",
      name: "WebAssembly",
      import: () => _(() => import("./shiki-lang-wasm.js"), []),
    },
    {
      id: "wenyan",
      name: "Wenyan",
      aliases: ["文言"],
      import: () => _(() => import("./shiki-lang-wenyan.js"), []),
    },
    {
      id: "wgsl",
      name: "WGSL",
      import: () => _(() => import("./shiki-lang-wgsl.js"), []),
    },
    {
      id: "wikitext",
      name: "Wikitext",
      aliases: ["mediawiki", "wiki"],
      import: () => _(() => import("./shiki-lang-wikitext.js"), []),
    },
    {
      id: "wit",
      name: "WebAssembly Interface Types",
      import: () => _(() => import("./shiki-lang-wit.js"), []),
    },
    {
      id: "wolfram",
      name: "Wolfram",
      aliases: ["wl"],
      import: () => _(() => import("./shiki-lang-wolfram.js"), []),
    },
    {
      id: "xml",
      name: "XML",
      import: () =>
        _(
          () => import("./shiki-lang-xml.js").then((_) => _.n),
          __vite__mapDeps([8, 1, 9]),
        ),
    },
    {
      id: "xsl",
      name: "XSL",
      import: () =>
        _(() => import("./shiki-lang-xsl.js"), __vite__mapDeps([101, 8, 1, 9])),
    },
    {
      id: "yaml",
      name: "YAML",
      aliases: ["yml"],
      import: () =>
        _(
          () => import("./shiki-lang-yaml.js").then((_) => _.n),
          __vite__mapDeps([39, 1]),
        ),
    },
    {
      id: "zenscript",
      name: "ZenScript",
      import: () => _(() => import("./shiki-lang-zenscript.js"), []),
    },
    {
      id: "zig",
      name: "Zig",
      import: () => _(() => import("./shiki-lang-zig.js"), []),
    },
  ],
  m = Object.fromEntries(i.map((_) => [_.id, _.import])),
  r = Object.fromEntries(
    i.flatMap((_) => _.aliases?.map((i) => [i, _.import]) || []),
  ),
  t = { ...m, ...r };
export {
  t as bundledLanguages,
  r as bundledLanguagesAlias,
  m as bundledLanguagesBase,
  i as bundledLanguagesInfo,
};
