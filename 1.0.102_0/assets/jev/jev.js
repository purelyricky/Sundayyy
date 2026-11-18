// Jev (TypeSafe): one request returns an operation and operation-specific target heads.
// Port of choose()/action_space() from jev_ultrafast/model.py.

import { postJson } from "./http.js";
import { NEXT_ACTION, TARGET } from "./prompts.js";

const JEV_URL = "https://api.typesafe.ai/v1/systemone";

export function validateChoice(answer, ids) {
  const idList = Object.keys(ids);
  let valid = false;
  try {
    const probabilities = answer.probabilities;
    const numbers = [...Object.values(probabilities), answer.confidence];
    valid =
      idList.includes(answer.choice) &&
      Object.keys(probabilities).length === idList.length &&
      Object.keys(probabilities).every((k) => idList.includes(k)) &&
      numbers.every((n) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1) &&
      Math.abs(Object.values(probabilities).reduce((a, b) => a + b, 0) - 1) < 0.02 &&
      probabilities[answer.choice] >= Math.max(...Object.values(probabilities)) - 1e-6;
  } catch {
    valid = false;
  }
  if (!valid) throw new Error("Invalid Jev response; no action executed.");
  return answer;
}

/** One index per observed element; each operation has its own valid target choices. */
export function actionSpace(actions) {
  const elements = [], indices = new Map(), targets = {}, controls = {};
  const operations = { click: "CLICK", fill: "TYPE_TEXT", select: "SELECT" };
  for (const action of actions) {
    const kind = action.kind;
    if (!(kind in operations)) {
      controls[action.id.toUpperCase()] = action;
      continue;
    }
    if (!indices.has(action.node)) {
      const index = String(elements.length + 1);
      indices.set(action.node, index);
      const element = {};
      for (const k of ["role", "value", "checked", "selected", "expanded"]) if (k in action) element[k] = action[k];
      Object.assign(element, { index, label: action.label.split(" → ")[0], operations: [] });
      if (kind === "select") {
        element.value = action.current_value ?? "";
        element.options = [];
      }
      elements.push(element);
    }
    const index = indices.get(action.node);
    const operation = operations[kind];
    const group = (targets[operation] ??= {});
    const element = elements[Number(index) - 1];
    if (!element.operations.includes(operation)) element.operations.push(operation);
    let target = index;
    if (kind === "select") {
      target = `${index}:${element.options.length + 1}`;
      element.options.push({ index: target, label: action.label, value: action.value });
    }
    group[target] = action;
  }
  return { elements, targets, controls };
}

export async function choose(state, goal, history, { jevKey, jevModel = "jev-latest", signal, screenshot = null }) {
  const { elements, targets, controls } = actionSpace(state.actions);
  const labels = {
    CLICK: "Click an element, button, menu option, autocomplete suggestion, or calendar day.",
    TYPE_TEXT: "Enter or replace text in an editable field. A small LLM will supply the value from the goal.",
    SELECT: "Select an observed dropdown value.",
  };
  const operations = {};
  for (const key of Object.keys(targets)) operations[key] = labels[key];
  for (const [key, value] of Object.entries(controls)) operations[key] = value.label;
  operations.DONE = "Every requirement is visibly satisfied.";
  operations.BLOCKED = "No supported operation can progress.";

  const questions = {
    operation: { type: "choice", criteria: operations, instructions: { goal, rules: NEXT_ACTION } },
  };
  for (const [operation, candidates] of Object.entries(targets)) {
    const criteria = {};
    for (const [index, a] of Object.entries(candidates)) {
      criteria[index] = { element: `[${index}] ${a.label}`, current_value: a.current_value ?? a.value ?? "" };
      for (const k of ["role", "checked", "selected", "expanded"]) if (k in a) criteria[index][k] = a[k];
    }
    questions[operation.toLowerCase() + "_target"] = {
      type: "choice",
      criteria,
      instructions: { goal, operation, rules: [NEXT_ACTION, TARGET] },
    };
  }
  const body = {
    model: jevModel,
    state: {
      page: { url: state.url, title: state.title, text: state.text },
      elements,
      recent_actions: history.slice(-10).map((h) => ({
        action: h.action ?? null, kind: h.kind ?? null, text: h.text ?? null, page_changed: h.page_changed ?? null,
      })),
    },
    questions,
  };

  // Optional viewport image (settings.jevImages = "on"). Kept in one place in case the endpoint's image field differs.
  if (screenshot) body.state.page.screenshot = `data:image/jpeg;base64,${screenshot}`;

  const started = performance.now();
  const result = await postJson(JEV_URL, jevKey, body, { signal, provider: "Jev" });
  const operationAnswer = validateChoice(result.answers?.operation ?? {}, operations);
  const operation = operationAnswer.choice;
  let choice, target = null, targetAnswer = null;
  if (operation in targets) {
    // Unused target heads cannot cause an action. Validate only the head the operation selects.
    targetAnswer = validateChoice(result.answers?.[operation.toLowerCase() + "_target"] ?? {}, targets[operation]);
    target = targetAnswer.choice;
    choice = targets[operation][target].id;
  } else {
    choice = operation in controls ? controls[operation].id : operation;
  }
  return {
    choice,
    operation,
    target,
    confidence: operationAnswer.confidence,
    targetConfidence: targetAnswer?.confidence ?? null,
    model: result.model,
    usage: result.usage ?? {},
    latency_ms: Math.round(performance.now() - started),
  };
}
