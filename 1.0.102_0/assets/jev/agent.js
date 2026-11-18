// The complete agent loop: page -> indexed elements -> operation + target -> execution.
// Port of jev_ultrafast/agent.py. Never retries a browser mutation; logs execution before observing.

import { Browser, StalePage } from "./browser.js";
import { choose } from "./jev.js";
import { fieldContext, fieldText } from "./typing.js";
import { MAX_STEPS } from "./prompts.js";

/**
 * @param {{goal:string, url?:string, tabId?:number, settings:object, signal:AbortSignal, onEvent:(e:object)=>void}} opts
 * @returns {Promise<{status:'done'|'blocked'|'stopped'|'no_elements', elapsed_ms:number, steps:number, history:object[], page:object, screenshot:string|null}>}
 */
export async function runAgent({ goal, url, tabId, settings, signal, onEvent, maxSteps = MAX_STEPS }) {
  goal = goal.trim();
  if (!goal) throw new Error("Describe what you want done.");
  const browser = await Browser.open({ tabId, url });
  const history = [];
  let lastPage = null;
  let decisions = 0, stale = 0, pending = null, startedAt = null, status = "running";
  const elapsed = () => Math.round(performance.now() - startedAt);
  const stopped = () => {
    if (signal.aborted) {
      status = "stopped";
      return true;
    }
    return false;
  };

  try {
    let page = await browser.observe();
    startedAt = performance.now(); // timing starts after the initial page observation, like jev
    onEvent({ type: "start", url: page.url, title: page.title });
    const interactive = (p) => p.actions.some((a) => ["click", "fill", "select"].includes(a.kind));

    while (status === "running") {
      if (stopped()) break;
      try {
        if (!(await browser.fresh(page))) page = await browser.observe();
        lastPage = page;
        // Nothing the DOM exposes (canvas, closed shadow roots, cross-origin frames, blank page): hand back to the
        // agent model, which can take a screenshot and click by coordinates.
        if (!interactive(page)) {
          status = "no_elements";
          break;
        }
        if (decisions >= maxSteps * 2) throw new Error("Reached the model-call budget.");

        // --- predict: one Jev request = operation + target ---
        const shot = settings.jevImages === "on" ? await browser.screenshot().catch(() => null) : null;
        const decision = await choose(page, goal, history, { ...settings, signal, screenshot: shot });
        decisions++;
        if (stopped()) break;

        // --- act ---
        const selected = decision.choice;
        if (selected === "DONE" || selected === "BLOCKED") {
          if (!(await browser.fresh(page))) throw new StalePage("Page changed since the decision.");
          status = selected === "DONE" ? "done" : "blocked";
          onEvent({ type: "decision", operation: selected, jev_ms: decision.latency_ms, elapsed_ms: elapsed() });
          break;
        }
        const action = page.actions.find((a) => a.id === selected);
        if (!action) throw new Error("Jev chose an element that was not observed; no action executed.");
        if (history.length >= maxSteps) {
          status = "blocked";
          onEvent({ type: "note", message: `Stopped at the ${maxSteps}-action budget.` });
          break;
        }

        let text = null, helper = null;
        if (action.kind === "fill") {
          if (!(await browser.fresh(page))) throw new StalePage("Page changed before text generation.");
          const context = fieldContext(goal, action, page, history);
          const key = JSON.stringify(context);
          // A stale retry reuses its value only while the whole helper input is identical.
          if (pending?.key === key) ({ text, helper } = pending);
          else {
            ({ text, helper } = await fieldText(context, { ...settings, signal }));
            pending = { key, text, helper };
          }
          if (stopped()) break;
        }

        await browser.act(action, page, text);
        pending = null;
        const entry = {
          step: history.length + 1,
          action: action.label,
          kind: action.kind,
          operation: decision.operation,
          text,
          page_changed: null,
          jev_ms: decision.latency_ms,
          text_ms: helper?.latency_ms ?? 0,
          executed_ms: elapsed(),
        };
        history.push(entry);
        // Execution is logged before the post-action observation, which may be interrupted by navigation.
        onEvent({ type: "step", ...entry, text_model: helper?.model ?? null });

        const before = page.fingerprint;
        page = await browser.observe();
        entry.page_changed = page.fingerprint !== before;
        const last3 = history.slice(-3);
        if (last3.length === 3 && last3.every((h) => h.page_changed === false && h.kind !== "wait")) {
          status = "blocked";
          onEvent({ type: "note", message: "Three actions in a row changed nothing." });
        }
        stale = 0;
      } catch (e) {
        if (e.name === "AbortError") {
          status = "stopped";
        } else if (e instanceof StalePage && ++stale < 40) {
          onEvent({ type: "stale", message: e.message });
          page = await browser.observe();
        } else {
          throw e;
        }
      }
    }
    // Final look at the page so the caller can report what happened and show a screenshot.
    let finalPage = lastPage, screenshot = null;
    if (!browser.detached) {
      finalPage = await browser.observe().catch(() => lastPage);
      screenshot = await browser.screenshot().catch(() => null);
    }
    return {
      status,
      elapsed_ms: startedAt ? elapsed() : 0,
      steps: history.length,
      history,
      page: finalPage ? { url: finalPage.url, title: finalPage.title, text: finalPage.text } : null,
      screenshot,
    };
  } finally {
    await browser.close();
  }
}
