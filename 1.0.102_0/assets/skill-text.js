/**
 * @readable-header
 * FILE:      assets/skill-text.js
 * WAS:       skillText-Huh3v7kv.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     anthropic-extension
 * WHAT:      Tiny helper module (original skillText) with two functions: one slugifies a name into a lowercase hyphenated skill id (default 'shortcut'), the other returns the first non-empty line of text truncated to 60 characters.
 * USED BY:   assets/options-page.js (static import)
 *            assets/service-worker.js (static import)
 *            options.html (html tag)
 * NEEDS:     none
 * EXPORTS:   n, t  (export names are unchanged from the original; other files import them by these names)
 */
function t(t) {
  return (
    t
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "shortcut"
  );
}
function e(t, e = 60) {
  const r = "string" == typeof t ? t : "";
  for (const n of r.split(/\r?\n/)) {
    const t = n.trim();
    if (t) return t.length > e ? t.slice(0, e) : t;
  }
  return "";
}
export { t as n, e as t };
