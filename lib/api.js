export async function api(path, { method = "GET", body } = {}) {
  const init = { method };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`/api/sipaling/${path}`, init);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/event-stream")) {
    if (!res.ok) throw new Error(`Gagal (${res.status})`);
    return res;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Gagal (${res.status})`);
  return data;
}

export async function readSSE(res, onEvent) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let done = null;
  while (true) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop();
    for (const p of parts) {
      const m = p.match(/event:\s*(\w+)\ndata:\s*([\s\S]*)/);
      if (!m) continue;
      try {
        const data = JSON.parse(m[2]);
        if (m[1] === "done") done = data;
        onEvent?.(m[1], data);
      } catch {}
    }
  }
  return done;
}

/* Baca stream campuran SSE / JSON-lines, kembalikan objek JSON terakhir yang punya url/result */
export async function readToolStream(res, onProgress) {
  const text = await res.text();
  let last = null;
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    const m = t.match(/data:\s*(\{.*\})/);
    const js = m ? m[1] : t.startsWith("{") ? t : null;
    if (!js) continue;
    try {
      const o = JSON.parse(js);
      onProgress?.(o);
      if (o.url || o.result || o.data?.url) last = o;
    } catch {}
  }
  return last;
}

export const arr = (v) => (Array.isArray(v) ? v : []);
