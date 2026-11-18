/**
 * @readable-header
 * FILE:      service-worker-loader.js
 * OWNER:     anthropic-extension
 * WHAT:      Manifest background entry; single line import of ./assets/service-worker.js.
 * ENTRY:     background service worker (manifest.json)
 * USED BY:   manifest.json (manifest)
 * NEEDS:     assets/service-worker.js (static import)
 */
import "./assets/service-worker.js";
