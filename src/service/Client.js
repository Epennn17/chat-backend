const UPSTREAM = "https://api.alwayscodex.eu.cc/api/ai/wormgpt";
const TIMEOUT_MS = 30_000;

export async function askAI(teks) {
  const url = `${UPSTREAM}?teks=${encodeURIComponent(teks)}`;

  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      const e = new Error("Upstream tidak merespons dalam batas waktu");
      e.status = 504;
      throw e;
    }
    const e = new Error("Gagal menghubungi upstream");
    e.status = 502;
    throw e;
  }

  if (!res.ok) {
    const e = new Error(`Upstream merespons dengan status ${res.status}`);
    e.status = 502;
    throw e;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    const e = new Error("Respons upstream bukan JSON valid");
    e.status = 502;
    throw e;
  }

  if (!data.status || typeof data.result !== "string") {
    const e = new Error("Format respons upstream tidak dikenali");
    e.status = 502;
    throw e;
  }

  return {
    reply: data.result,
    timestamp: data.timestamp ?? new Date().toISOString(),
  };
}
