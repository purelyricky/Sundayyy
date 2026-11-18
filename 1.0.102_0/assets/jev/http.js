// JSON POST with the same retry policy as jev (429/503/529 backoff, no retry on other errors).

export async function postJson(url, key, body, { signal, headers = {}, provider = "Model" } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, ...headers },
        body: JSON.stringify(body),
      });
    } catch (e) {
      if (e.name === "AbortError") throw e;
      throw new Error(`${provider} connection failed; no action executed.`);
    }
    if ([429, 503, 529].includes(response.status) && attempt < 2) {
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
      continue;
    }
    if (!response.ok) {
      const detail = (await response.text().catch(() => "")).slice(0, 200);
      const hint = response.status === 401 || response.status === 403 ? " Check the API key in Settings." : "";
      throw new Error(`${provider} returned HTTP ${response.status}.${hint} ${detail}`.trim());
    }
    return response.json();
  }
  throw new Error(`${provider} unavailable`);
}
