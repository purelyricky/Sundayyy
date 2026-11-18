// Browser layer: observe + act through chrome.debugger (CDP). Port of jev_ultrafast/browser.py.
// One CDP session, no model-generated selectors: every target is an element observed by snapshot.js.

export class StalePage extends Error {}

// Where Claus starts when the current tab is a new-tab page / chrome:// page and the goal names no URL.
const START_PAGE = "https://www.google.com/";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

let readState;
async function snapshotSource() {
  readState ??= await (await fetch(chrome.runtime.getURL("assets/jev/snapshot.js"))).text();
  return readState;
}

// Small, fast, non-crypto string hash (cyrb53) for page fingerprints.
function hash(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export function fingerprint(s) {
  return hash(JSON.stringify({ url: s.url, text: s.text, actions: s.actions, scroll: s.scroll }));
}

export class Browser {
  constructor(tabId, ownsTab) {
    this.tabId = tabId;
    this.attachedByUs = ownsTab;
    this.afterInput = null;
    this.detached = false;
    this.onDetach = (source, reason) => {
      if (source.tabId === this.tabId) this.detached = reason;
    };
    chrome.debugger.onDetach.addListener(this.onDetach);
  }

  /**
   * Drive `tabId` (the side panel's own tab), falling back to the active tab.
   * If the tab can't be driven (new-tab page, chrome://) or a start `url` is given, navigate it first.
   */
  static async open({ tabId, url } = {}) {
    const drivable = (u) => /^(https?|file):/.test(u || "");
    let tab;
    if (tabId) tab = await chrome.tabs.get(tabId).catch(() => undefined);
    if (!tab) [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("No tab to work in. Open a web page first.");
    if (!drivable(tab.url) && !url) url = START_PAGE;
    if (url && !drivable(tab.url)) {
      // The debugger can't attach to chrome:// or new-tab pages; navigate the tab itself first.
      await chrome.tabs.update(tab.id, { url });
      const deadline = performance.now() + 15000;
      while (performance.now() < deadline) {
        const t = await chrome.tabs.get(tab.id);
        if (t.status === "complete" && drivable(t.url)) break;
        await sleep(50);
      }
      url = undefined;
    }
    const browser = new Browser(tab.id, false);
    try {
      await chrome.debugger.attach({ tabId: tab.id }, "1.3");
      browser.attachedByUs = true;
    } catch (e) {
      // Already attached by this same extension is fine; anything else (DevTools, another extension) is not.
      if (!/already attached/i.test(e.message)) {
        chrome.debugger.onDetach.removeListener(browser.onDetach);
        throw new Error(`Could not attach to the page: ${e.message}. Close DevTools on that tab and retry.`);
      }
    }
    try {
      await browser.call("Runtime.evaluate", { expression: "1" });
    } catch {
      chrome.debugger.onDetach.removeListener(browser.onDetach);
      throw new Error("Another debugger (DevTools or an extension) is attached to this tab. Close it and retry.");
    }
    // Keep rAF/menus rendering even if the user switches tabs mid-run.
    await browser.call("Emulation.setFocusEmulationEnabled", { enabled: true }).catch(() => {});
    if (url) {
      await browser.call("Page.navigate", { url });
      const deadline = performance.now() + 15000;
      while (performance.now() < deadline) {
        if ((await browser.evaluate("document.readyState").catch(() => null)) === "complete") break;
        await sleep(20);
      }
    }
    return browser;
  }

  call(method, params = {}) {
    if (this.detached) throw new Error(`Debugger detached (${this.detached}).`);
    return chrome.debugger.sendCommand({ tabId: this.tabId }, method, params);
  }

  async evaluate(expression, { mutating = false } = {}) {
    let response;
    try {
      response = await this.call("Runtime.evaluate", { expression, returnByValue: true });
    } catch (e) {
      if (this.detached) throw e;
      throw new StalePage("Document changed during evaluation");
    }
    if (response.exceptionDetails) {
      if (mutating) throw new Error("Dropdown execution was interrupted; inspect before retrying.");
      throw new StalePage("Document changed during evaluation");
    }
    return response.result?.value;
  }

  async #snapshot() {
    const info = await this.evaluate(await snapshotSource());
    if (info == null) throw new StalePage("Document is navigating");
    info.fingerprint = fingerprint(info);
    return info;
  }

  async observe() {
    if (this.afterInput) {
      const action = this.afterInput;
      this.afterInput = null;
      // Read-only settle wait, after execution was logged. Autocomplete gets up to 200 ms, the rest 50 ms.
      await this.call("Runtime.evaluate", {
        expression: `(action => new Promise(resolve => {
          const field=window.__clausFast?.nodes.get(action.node);
          const autocomplete=action.kind==='fill' && field?.getAttribute('role')==='combobox';
          let frames=0, stopped=false;
          const finish=()=>{stopped=true;resolve()};
          setTimeout(finish,autocomplete ? 200 : 50);
          const ready=()=>{
            if (stopped) return;
            const ids=(field?.getAttribute('aria-controls')||field?.getAttribute('aria-owns')||'')
              .split(/\\s+/).filter(Boolean);
            const roots=ids.length ? ids.map(id=>document.getElementById(id)).filter(Boolean) : [document];
            const options=roots.flatMap(root=>[...root.querySelectorAll('[role="option"]')]);
            if (++frames>=2 && (!autocomplete || options.some(e=>{
              const r=e.getBoundingClientRect();
              return r.width && r.height && r.bottom>0 && r.top<innerHeight &&
                e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true});
            }))) finish();
            else requestAnimationFrame(ready);
          };
          requestAnimationFrame(ready);
        }))(${JSON.stringify(action)})`,
        awaitPromise: true,
        returnByValue: true,
      }).catch(() => {});
    }
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.#snapshot();
      } catch (e) {
        if (!(e instanceof StalePage) || attempt >= 40) throw e;
        await sleep(40); // navigations take a moment; ~1.6 s ceiling
      }
    }
  }

  async fresh(page, action = null) {
    if (action && (action.kind === "click" || action.kind === "select")) {
      if (!Number.isInteger(action.node)) return false;
      const current = await this.evaluate(
        `(() => { const c=window.__clausFast; return c ? [c.pageKey(),c.guard(c.nodes.get(${action.node}))] : null; })()`,
      );
      return same(current, [page.page_key, page.guards[action.node] ?? null]);
    }
    const marker = await this.evaluate(
      `(() => { const state=${await snapshotSource()}; return state?.marker ?? null; })()`,
    );
    return same(marker, page.marker);
  }

  async act(action, page, text = null) {
    if (!(await this.fresh(page, action))) throw new StalePage("Page changed since this decision. Observe again.");
    const kind = action.kind;
    if (kind === "wait") {
      await sleep(100);
    } else if (kind === "scroll") {
      const x = Math.round(page.w / 2), y = Math.round(page.h / 2);
      await this.indicator({ type: "UPDATE_PHANTOM_CURSOR", x, y }, 250);
      await this.call("Input.dispatchMouseEvent", { type: "mouseWheel", x, y, deltaX: 0, deltaY: action.delta });
    } else {
      if (!Number.isInteger(action.node)) throw new Error("Invalid observed node");
      // Code-owned node IDs refer to actual observed elements, never model-generated selectors.
      const target = await this.evaluate(
        `(action => {
          const e=window.__clausFast?.nodes.get(action.node);
          if (!e?.isConnected || e.matches(':disabled') || e.closest('[aria-disabled="true"],[inert]') ||
              !e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})) return null;
          if (action.kind==='fill' && (e.readOnly || e.getAttribute('aria-readonly')==='true')) return null;
          const r=e.getBoundingClientRect(), x=r.x+r.width/2, y=r.y+r.height/2;
          if (!r.width || !r.height || x<0 || y<0 || x>=innerWidth || y>=innerHeight) return null;
          if (!e.contains(document.elementFromPoint(x,y))) return null;
          if (action.kind==='select') {
            if (e.tagName!=='SELECT' || ![...e.options].some(o=>o.value===action.value &&
                !o.disabled && !o.closest('optgroup[disabled]'))) return null;
            e.value=action.value;
            e.dispatchEvent(new Event('input',{bubbles:true}));
            e.dispatchEvent(new Event('change',{bubbles:true}));
          }
          return {x,y};
        })(${JSON.stringify(action)})`,
        { mutating: kind === "select" },
      );
      if (target == null) {
        if (kind === "select") throw new Error("Dropdown execution was not confirmed; inspect before retrying.");
        throw new StalePage("Target changed or is covered. Observe again.");
      }
      if (kind === "select") {
        this.indicator({ type: "UPDATE_PHANTOM_CURSOR", x: target.x, y: target.y }); // the value is already set
      } else {
        // Glide the phantom cursor to the target, like the original extension (capped so Jev stays fast).
        await this.indicator({ type: "UPDATE_PHANTOM_CURSOR", x: target.x, y: target.y }, 250);
        for (const type of ["mousePressed", "mouseReleased"]) {
          await this.call("Input.dispatchMouseEvent", { type, x: target.x, y: target.y, button: "left", clickCount: 1 });
        }
        if (kind === "fill") {
          const modifiers = /Mac/i.test(navigator.platform) ? 4 : 2;
          await this.call("Input.dispatchKeyEvent", {
            type: "keyDown", key: "a", code: "KeyA", modifiers, commands: ["selectAll"],
          });
          await this.call("Input.dispatchKeyEvent", { type: "keyUp", key: "a", code: "KeyA", modifiers });
          await this.call("Input.insertText", { text });
        }
      }
    }
    this.afterInput = kind === "wait" ? null : action;
  }

  /** Tell the page's agent-visual-indicator content script something (cursor, hide/show). Never fails the run. */
  async indicator(message, waitMs = 0) {
    const sent = chrome.tabs.sendMessage(this.tabId, message).catch(() => {});
    if (waitMs) await Promise.race([sent, sleep(waitMs)]);
  }

  /** JPEG screenshot of the viewport as base64 (no data: prefix), taken with the glow/cursor overlay hidden. */
  async screenshot(quality = 60) {
    await this.indicator({ type: "HIDE_FOR_TOOL_USE" }, 100);
    try {
      const shot = await this.call("Page.captureScreenshot", { format: "jpeg", quality });
      return shot.data;
    } finally {
      this.indicator({ type: "SHOW_AFTER_TOOL_USE" });
    }
  }

  async close() {
    chrome.debugger.onDetach.removeListener(this.onDetach);
    // Only detach what we attached, so the extension's own debugger session (if any) survives.
    if (!this.detached && this.attachedByUs) await chrome.debugger.detach({ tabId: this.tabId }).catch(() => {});
    this.detached = "closed";
  }
}
