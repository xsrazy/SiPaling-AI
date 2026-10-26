import { NextResponse } from "next/server";

const UPSTREAM = process.env.SIPALING_API_BASE_URL || "https://na-api-nue-api-e7bfd3f4.koyeb.app";
const MAX = 60;
const WINDOW = 60_000;
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const a = hits.get(ip) || [];
  const fresh = a.filter((t) => now - t < WINDOW);
  if (fresh.length >= MAX) return true;
  fresh.push(now);
  hits.set(ip, fresh);
  return false;
}

async function proxy(req, { params }) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (limited(ip)) {
    return NextResponse.json({ success: false, error: "Kebanyakan request, coba lagi bentar." }, { status: 429 });
  }
  const path = (params.path || []).join("/");
  const qs = req.nextUrl.search;
  const url = `${UPSTREAM}/api/${path}${qs}`;
  try {
    const init = { headers: { "User-Agent": "sipaling-ai/1.0" } };
    if (req.method === "POST") {
      init.method = "POST";
      const ct = req.headers.get("content-type") || "";
      init.headers["Content-Type"] = ct || "application/json";
      init.body = await req.arrayBuffer();
    }
    const up = await fetch(url, init);
    const ct = up.headers.get("content-type") || "";
    if (ct.includes("text/event-stream")) {
      return new NextResponse(up.body, {
        status: up.status,
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }
    const body = await up.text();
    return new NextResponse(body, {
      status: up.status,
      headers: { "Content-Type": ct || "application/json" },
    });
  } catch {
    return NextResponse.json({ success: false, error: "API lagi offline." }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
