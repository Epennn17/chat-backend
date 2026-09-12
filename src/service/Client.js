const UPSTREAM = "https://api.alwayscodex.eu.cc/api/ai/wormgpt";
const TIMEOUT_MS = 30_000;

export async function askAI(teks) {
  const url = `${UPSTREAM}?teks=${encodeURIComponent(teks)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    const err = new Error(`Upstream merespons ${res.status}`);
    err.status = 502;
    throw err;
  }

  const data = await res.json();

  if (!data.status || typeof data.result !== "string") {
    const err = new Error("Format respons upstream tidak dikenali");
    err.status = 502;
    throw err;
  }

  return {
    reply: data.result,
    timestamp: data.timestamp ?? new Date().toISOString(),
  };
      }
