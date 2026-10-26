"use client";
import { useState, useEffect, useRef } from "react";
import { api, readSSE, readToolStream, arr } from "@/lib/api";

/* Modern SVG icons (Lucide style) */
const I = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  bot: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>,
  clapper: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  botSm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
  imageSm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  downloadSm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>,
  clapperSm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>,
  bookSm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  searchSm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  film: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>,
  music: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  tv: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><rect width="20" height="15" x="2" y="7" rx="2"/><path d="m17 2-5 5-5-5"/></svg>,
  sparkles: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>,
};

function Err({ e }) {
  if (!e) return null;
  return <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{e}</div>;
}

function Header({ grad, icon, title, desc }) {
  return (
    <div className="mb-4 flex items-center gap-4 rounded-3xl border border-white/25 bg-white/10 p-5 shadow-lg backdrop-blur-md">
      <div className={`shrink-0 rounded-2xl bg-gradient-to-br ${grad} p-2.5 shadow-lg`}>{icon}</div>
      <div>
        <h2 className="text-xl font-extrabold text-white">{title}</h2>
        <p className="text-sm text-white/70">{desc}</p>
      </div>
    </div>
  );
}
function Spin() {
  return <div className="py-10 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" /></div>;
}

function Home({ go }) {
  const menu = [
    { id: "ai", icon: I.bot, name: "Chat AI", desc: "Ngobrol sama AI", grad: "from-violet-500 to-purple-600" },
    { id: "gambar", icon: I.image, name: "Bikin Gambar", desc: "Ketik jadi gambar", grad: "from-fuchsia-500 to-pink-500" },
    { id: "video", icon: I.film, name: "Bikin Video", desc: "Ketik jadi video AI", grad: "from-indigo-500 to-violet-600" },
    { id: "download", icon: I.download, name: "Download", desc: "TikTok, YT, IG, SC", grad: "from-sky-500 to-blue-600" },
    { id: "nonton", icon: I.clapper, name: "Nonton", desc: "Drama sub Indo", grad: "from-rose-500 to-orange-500" },
    { id: "tv", icon: I.tv, name: "Nonton Anime", desc: "Anime plus Donghua", grad: "from-cyan-500 to-teal-600" },
    { id: "komik", icon: I.book, name: "Komik", desc: "Baca komik update", grad: "from-emerald-500 to-green-600" },
    { id: "musik", icon: I.music, name: "Musik", desc: "Dengerin lagu", grad: "from-purple-500 to-fuchsia-600" },
    { id: "cari", icon: I.search, name: "Cari Web", desc: "Cari apa aja", grad: "from-amber-500 to-yellow-500" },
  ];
  return (
    <div className="px-4 pt-6 pb-28">
      <div className="mb-6 flex items-center gap-3">
        <img src="/logo.png" alt="SiPaling AI" className="h-14 w-14 rounded-2xl shadow-lg" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">SiPaling AI</h1>
          <p className="text-sm text-white/70">Si paling bisa semua!</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {menu.map((m) => (
          <button key={m.id} onClick={() => go(m.id)}
            className="rounded-3xl border border-white/25 bg-white/10 p-5 text-left shadow-lg backdrop-blur-md transition active:scale-95">
            <div className={`mb-3 w-fit rounded-2xl bg-gradient-to-br ${m.grad} p-2.5 shadow-lg`}>{m.icon}</div>
            <p className="font-extrabold text-white">{m.name}</p>
            <p className="text-xs text-white/70">{m.desc}</p>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-white/25 bg-white/10 p-5 shadow-lg backdrop-blur-md">
        <p className="mb-1 font-extrabold text-white">Baru pertama buka?</p>
        <p className="text-sm text-white/70">Tinggal ketuk salah satu kartu di atas atau pilih menu di bawah. Langsung jalan, nggak ribet.</p>
      </div>
    </div>
  );
}

function AIChat() {
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);
  async function send() {
    const t = inp.trim();
    if (!t || busy) return;
    setErr(""); setInp(""); setBusy(true);
    const nm = [...msgs, { r: "u", t }];
    setMsgs(nm);
    try {
      const d = await api("chat/completions", { method: "POST", body: { model: "auto", messages: nm.map((m) => ({ role: m.r === "u" ? "user" : "assistant", content: m.t })) } });
      setMsgs([...nm, { r: "a", t: d.choices?.[0]?.message?.content || "..." }]);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="flex h-full flex-col px-4 pt-4 pb-28">
      <Header grad="from-violet-500 to-purple-600" icon={I.bot} title="Chat AI" desc="Tanya apa aja, dijawab cepet. Curhat juga bisa." />
      <div ref={ref} className="min-h-[300px] flex-1 space-y-2 overflow-y-auto rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
        {!msgs.length && <p className="py-20 text-center text-sm text-white/50">Tanya apa aja di sini</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.r === "u" ? "ml-auto bg-violet-500 text-white" : "bg-white/20 shadow-sm backdrop-blur"}`}>{m.t}</div>
        ))}
        {busy && <div className="w-fit rounded-2xl bg-white/20 px-3 py-2 text-sm text-white shadow-sm backdrop-blur">lagi ngetik...</div>}
      </div>
      <Err e={err} />
      <div className="mt-3 flex gap-2">
        <input value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 rounded-full border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-violet-500" placeholder="Tulis pertanyaan..." />
        <button onClick={send} disabled={busy} className="rounded-full bg-violet-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">Kirim</button>
      </div>
    </div>
  );
}

function Gambar() {
  const [mode, setMode] = useState("gen");
  const [p, setP] = useState("");
  const [img, setImg] = useState("");
  const [st, setSt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function go() {
    if (!p.trim() || busy) return;
    setErr(""); setImg(""); setBusy(true);
    try {
      if (mode === "gen") {
        setSt("Mulai gambar...");
        const res = await api("text2image", { method: "POST", body: { prompt: p.trim(), size: "1:1", num_images: 1 } });
        const done = await readSSE(res, (ev) => { if (ev === "progress") setSt("Lagi digambar..."); });
        const urls = done?.images || [];
        if (urls[0]) setImg(urls[0]); else setErr("Gagal bikin gambar, coba lagi.");
      } else {
        setSt("Lagi diproses...");
        const ep = mode === "up" ? "tools-image/upscaler" : "tools-image/remove-background";
        const body = mode === "up" ? { file: p.trim(), scale: 2 } : { file: p.trim() };
        const res = await fetch(`/api/sipaling/${ep}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(`Gagal (${res.status})`);
        const last = await readToolStream(res);
        const url = last?.url || last?.data?.url || last?.result;
        if (url) setImg(typeof url === "string" ? url : url.url); else setErr("Gagal, coba gambar lain.");
      }
    } catch (e) { setErr(e.message); } finally { setBusy(false); setSt(""); }
  }
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-fuchsia-500 to-pink-500" icon={I.image} title="Bikin Gambar" desc="Ketik jadi gambar, perjelas gambar, hapus background." />
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[["gen", "Generate"], ["up", "Perjelas"], ["bg", "Hapus BG"]].map(([m, lbl]) => (
          <button key={m} onClick={() => { setMode(m); setImg(""); setErr(""); }}
            className={`rounded-2xl py-2.5 text-xs font-extrabold transition ${mode === m ? "bg-fuchsia-500 text-white shadow" : "border border-white/20 bg-white/10 text-white/70 shadow-sm backdrop-blur"}`}>{lbl}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={p} onChange={(e) => setP(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-fuchsia-500"
          placeholder={mode === "gen" ? "Contoh: kucing pakai topi" : "Tempel link gambar di sini"} />
        <button onClick={go} disabled={busy} className="rounded-2xl bg-fuchsia-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">{busy ? "..." : "Gas"}</button>
      </div>
      <Err e={err} />
      {st && <p className="mt-4 text-center text-sm font-bold text-fuchsia-600">{st}</p>}
      {busy && !img && <Spin />}
      {img && <div className="mt-4"><img src={img} alt="hasil" className="w-full rounded-3xl shadow-lg" />
        <a href={img} download target="_blank" rel="noreferrer" className="mt-3 block rounded-2xl bg-green-500 py-3 text-center font-extrabold text-white shadow-lg">Simpan Gambar</a></div>}
    </div>
  );
}

function Download() {
  const [u, setU] = useState("");
  const [d, setD] = useState(null);
  const [tab, setTab] = useState("tiktok");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pls = {
    tiktok: "Tempel link TikTok di sini",
    youtube: "Tempel link YouTube di sini",
    instagram: "Tempel link Instagram di sini",
    soundcloud: "Tempel link track SoundCloud di sini",
  };
  async function go() {
    if (!u.trim() || busy) return;
    setErr(""); setD(null); setBusy(true);
    try {
      const ep = { tiktok: "tiktok", youtube: "youtube", instagram: "instagram", soundcloud: "soundcloud" }[tab];
      const r = await api(`downloader/${ep}?url=${encodeURIComponent(u.trim())}${tab === "youtube" ? "&type=video" : ""}`);
      setD(r);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-sky-500 to-blue-600" icon={I.download} title="Download" desc="TikTok, YouTube, Instagram, SoundCloud. Tempel linknya, unduh." />
      <div className="mb-3 grid grid-cols-4 gap-2">
        {["tiktok", "youtube", "instagram", "soundcloud"].map((t) => (
          <button key={t} onClick={() => { setTab(t); setD(null); setErr(""); }}
            className={`rounded-2xl py-2.5 text-xs font-extrabold capitalize transition ${tab === t ? "bg-sky-500 text-white shadow" : "border border-white/20 bg-white/10 text-white/70 shadow-sm backdrop-blur"}`}>{t}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={u} onChange={(e) => setU(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-sky-500" placeholder={pls[tab]} />
        <button onClick={go} disabled={busy} className="rounded-2xl bg-sky-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">{busy ? "..." : "Gas"}</button>
      </div>
      <Err e={err} />
      {busy && <Spin />}
      {d && (
        <div className="mt-4 rounded-3xl border border-white/25 bg-white/10 p-4 shadow-lg backdrop-blur-md">
          {d.video_url && <video src={d.video_url} controls className="w-full rounded-2xl bg-black" />}
          {d.media_url && !d.video_url && <img src={d.media_url} alt="" className="w-full rounded-2xl" />}
          {(d.title || d.caption) && <p className="mt-2 px-1 text-sm font-bold">{d.title || d.caption}</p>}
          {d.author && <p className="px-1 text-xs text-white/60">@{d.author}</p>}
          {d.thumbnail && !d.video_url && !d.media_url && <img src={d.thumbnail} alt="" className="w-full rounded-2xl" />}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {d.video_url && <a href={d.video_url} download target="_blank" rel="noreferrer" className="rounded-2xl bg-green-500 py-3 text-center text-sm font-extrabold text-white">Video</a>}
            {d.mp3_url && <a href={d.mp3_url} download target="_blank" rel="noreferrer" className="rounded-2xl bg-amber-500 py-3 text-center text-sm font-extrabold text-white">MP3</a>}
            {d.media_url && !d.video_url && <a href={d.media_url} download target="_blank" rel="noreferrer" className="col-span-2 rounded-2xl bg-green-500 py-3 text-center text-sm font-extrabold text-white">Download Media</a>}
            {d.download_url && <a href={d.download_url} download target="_blank" rel="noreferrer" className="col-span-2 rounded-2xl bg-amber-500 py-3 text-center text-sm font-extrabold text-white">Download MP3</a>}
            {arr(d.links).map((l, i) => (
              <a key={i} href={typeof l === "string" ? l : l.url} download target="_blank" rel="noreferrer" className="rounded-2xl bg-green-500 py-3 text-center text-sm font-extrabold text-white">
                {typeof l === "object" && (l.quality || l.label) ? l.quality || l.label : `Link ${i + 1}`}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Nonton() {
  const [view, setView] = useState("home");
  const [secs, setSecs] = useState([]);
  const [det, setDet] = useState(null);
  const [eps, setEps] = useState([]);
  const [play, setPlay] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { load(); }, []);
  async function load() {
    setBusy(true); setErr("");
    try { const d = await api("dramabox/home"); setSecs(arr(d.sections)); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function search() {
    if (!q.trim()) return;
    setBusy(true); setErr("");
    try {
      const d = await api(`dramabox/search?q=${encodeURIComponent(q.trim())}`);
      const items = arr(d.results || d.items || d.dramas);
      setSecs(items.length ? [{ title: "Hasil Pencarian", items }] : []);
      setView("home");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function open(it) {
    setBusy(true); setErr("");
    try {
      const d = await api(`dramabox/detail?id=${it.id}`);
      setDet(d.book || {}); setEps(arr(d.episodes)); setPlay(""); setView("det");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-rose-500 to-orange-500" icon={I.clapper} title="Nonton Drama" desc="Drama pendek sub Indo, nonton sampe tamat." />
      <div className="mb-4 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-rose-500" placeholder="Cari judul drama..." />
        <button onClick={search} disabled={busy} className="rounded-2xl bg-rose-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">Cari</button>
      </div>
      <Err e={err} />
      {busy && <Spin />}
      {view === "home" && secs.map((s, i) => (
        <div key={i} className="mb-5">
          <h3 className="mb-2 text-sm font-extrabold text-white">{s.title}</h3>
          <div className="grid grid-cols-3 gap-2">
            {arr(s.items).map((it) => (
              <button key={it.id} onClick={() => open(it)} className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-left shadow-md backdrop-blur-md transition active:scale-95">
                {it.cover && <img src={it.cover} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
                <p className="truncate p-2 text-xs font-bold">{it.title}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
      {view === "det" && det && (
        <div>
          <button onClick={() => setView("home")} className="mb-3 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow backdrop-blur">Kembali</button>
          {play && <video key={play} src={play} controls autoPlay className="mb-3 w-full rounded-2xl bg-black shadow-lg" />}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow backdrop-blur-md">
            <h3 className="font-extrabold">{det.title}</h3>
            <p className="mt-1 line-clamp-3 text-xs text-white/60">{det.synopsis}</p>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {eps.map((e, i) => (
              <button key={e.id || i} disabled={!e.video_url} onClick={() => setPlay(e.video_url)}
                className={`rounded-xl py-2.5 text-sm font-extrabold ${e.video_url ? "bg-green-500 text-white shadow" : "bg-white/10 text-white/40"}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Komik() {
  const [view, setView] = useState("home");
  const [secs, setSecs] = useState([]);
  const [det, setDet] = useState(null);
  const [chap, setChap] = useState(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { load(); }, []);
  async function load() {
    setBusy(true); setErr("");
    try {
      const d = await api("komiku/home");
      const s = [];
      if (arr(d.terbaru).length) s.push({ title: "Terbaru", items: d.terbaru });
      if (arr(d.ranking?.mingguan).length) s.push({ title: "Ranking Mingguan", items: d.ranking.mingguan });
      if (arr(d.ranking?.bulanan).length) s.push({ title: "Ranking Bulanan", items: d.ranking.bulanan });
      if (arr(d.ranking?.keseluruhan).length) s.push({ title: "Ranking Keseluruhan", items: d.ranking.keseluruhan });
      setSecs(s);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function search() {
    if (!q.trim()) return;
    setBusy(true); setErr("");
    try {
      const d = await api(`komiku/search?q=${encodeURIComponent(q.trim())}`);
      const items = arr(d.results || d.items || d.data);
      setSecs(items.length ? [{ title: "Hasil Pencarian", items }] : []);
      setView("home");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function open(it) {
    setBusy(true); setErr("");
    try { const d = await api(`komiku/detail?slug=${it.slug}`); setDet(d); setView("det"); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function read(c) {
    setBusy(true); setErr("");
    try { const d = await api(`komiku/chapter?url=${encodeURIComponent(c.url)}`); setChap(d.data || d); setView("read"); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  const chaps = det?.chapters?.list || [];
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-emerald-500 to-green-600" icon={I.book} title="Baca Komik" desc="Komik update tiap hari, baca sepuasnya." />
      <div className="mb-4 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-emerald-500" placeholder="Cari judul komik..." />
        <button onClick={search} disabled={busy} className="rounded-2xl bg-emerald-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">Cari</button>
      </div>
      <Err e={err} />
      {busy && <Spin />}
      {view === "home" && secs.map((s, si) => (
        <div key={si} className="mb-5">
          <h3 className="mb-2 text-sm font-extrabold text-white">{s.title}</h3>
          <div className="grid grid-cols-3 gap-2">
            {s.items.map((it) => (
              <button key={it.slug} onClick={() => open(it)} className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-left shadow-md backdrop-blur-md transition active:scale-95">
                {it.cover && <img src={it.cover} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
                <p className="truncate p-2 text-xs font-bold">{it.title}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
      {view === "det" && det && (
        <div>
          <button onClick={() => setView("home")} className="mb-3 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow backdrop-blur">Kembali</button>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow backdrop-blur-md">
            <h3 className="font-extrabold">{det.title}</h3>
            <p className="mt-1 line-clamp-3 text-xs text-white/60">{det.synopsis}</p>
          </div>
          <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
            {chaps.map((c, i) => (
              <button key={i} onClick={() => read(c)} className="flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-bold text-white shadow-sm backdrop-blur-md">
                {c.title || `Chapter ${i + 1}`} <span>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {view === "read" && chap && (
        <div>
          <button onClick={() => setView("det")} className="mb-3 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow backdrop-blur">Daftar Chapter</button>
          <div className="space-y-1">
            {arr(chap.images).map((s, i) => (
              <img key={i} src={typeof s === "string" ? s : s.url} alt="" className="w-full rounded-xl shadow" loading="lazy" referrerPolicy="no-referrer" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Cari() {
  const [q, setQ] = useState("");
  const [rs, setRs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function go() {
    if (!q.trim() || busy) return;
    setErr(""); setRs([]); setBusy(true);
    try { const d = await api(`search/web?query=${encodeURIComponent(q.trim())}&limit=8`); setRs(arr(d.results)); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-amber-500 to-yellow-500" icon={I.search} title="Cari Web" desc="Cari apa aja di internet dari sini." />
      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-amber-500" placeholder="Mau cari apa?" />
        <button onClick={go} disabled={busy} className="rounded-2xl bg-amber-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">Cari</button>
      </div>
      <Err e={err} />
      {busy && <Spin />}
      <div className="mt-3 space-y-2">
        {rs.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-white/20 bg-white/10 p-3 shadow backdrop-blur-md-sm">
            <p className="text-sm font-bold">{r.title}</p>
            <p className="truncate text-xs text-white/50">{r.url}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function Video() {
  const [p, setP] = useState("");
  const [vid, setVid] = useState("");
  const [st, setSt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function go() {
    if (!p.trim() || busy) return;
    setErr(""); setVid(""); setBusy(true);
    try {
      setSt("Minta tiket antri...");
      const t = await api("text2video", { method: "POST", body: { prompt: p.trim(), aspect: "16:9" } });
      const cookie = encodeURIComponent(t.cookie || "");
      let left = Math.ceil((t.wait_ms || 60000) / 1000);
      setSt(`Lagi antri, nunggu ${left} detik...`);
      await new Promise((r) => {
        const iv = setInterval(() => {
          left -= 1;
          setSt(`Lagi antri, nunggu ${Math.max(left, 0)} detik...`);
          if (left <= 0) { clearInterval(iv); r(); }
        }, 1000);
      });
      setSt("Tukar tiket...");
      let job = null;
      for (let i = 0; i < 6 && !job; i++) {
        try {
          const rd = await api(`text2video/redeem?ticket=${t.ticket}&cookie=${cookie}`);
          job = rd.job_id || rd.jobId || rd.id;
          if (!job) await new Promise((r) => setTimeout(r, 15000));
        } catch { await new Promise((r) => setTimeout(r, 15000)); }
      }
      if (!job) throw new Error("Antriannya kelamaan, coba lagi.");
      setSt("Videonya lagi dibuat...");
      for (let i = 0; i < 30; i++) {
        const s = await api(`text2video/status?job_id=${job}&cookie=${cookie}`);
        const v = arr(s.videos)[0];
        if (v) { setVid(typeof v === "string" ? v : v.url); break; }
        if (s.status === "failed" || s.status === "error") throw new Error("Gagal bikin video.");
        await new Promise((r) => setTimeout(r, 15000));
      }
      if (!vid) setSt("");
    } catch (e) { setErr(e.message); } finally { setBusy(false); setSt(""); }
  }
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-indigo-500 to-violet-600" icon={I.film} title="Bikin Video" desc="Ketik idenya, jadi video AI. Prosesnya agak lama ya." />
      <div className="flex gap-2">
        <input value={p} onChange={(e) => setP(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-indigo-500" placeholder="Contoh: naga terbang di atas kota" />
        <button onClick={go} disabled={busy} className="rounded-2xl bg-indigo-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">{busy ? "..." : "Gas"}</button>
      </div>
      <Err e={err} />
      {st && <p className="mt-4 text-center text-sm font-bold text-indigo-600">{st}</p>}
      {busy && !vid && <Spin />}
      {vid && <div className="mt-4"><video src={vid} controls autoPlay className="w-full rounded-3xl bg-black shadow-lg" />
        <a href={vid} download target="_blank" rel="noreferrer" className="mt-3 block rounded-2xl bg-green-500 py-3 text-center font-extrabold text-white shadow-lg">Simpan Video</a></div>}
    </div>
  );
}

function Musik() {
  const [q, setQ] = useState("");
  const [tr, setTr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function go() {
    if (!q.trim() || busy) return;
    setErr(""); setTr(null); setBusy(true);
    try {
      const d = await api(`play/soundcloud?q=${encodeURIComponent(q.trim())}`);
      if (d.track?.stream_url) setTr(d.track); else setErr("Lagunya nggak ketemu.");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-purple-500 to-fuchsia-600" icon={I.music} title="Musik" desc="Cari lagu terus langsung putar di sini." />
      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-purple-500" placeholder="Judul lagu atau penyanyinya" />
        <button onClick={go} disabled={busy} className="rounded-2xl bg-purple-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">{busy ? "..." : "Cari"}</button>
      </div>
      <Err e={err} />
      {busy && <Spin />}
      {tr && (
        <div className="mt-4 rounded-3xl border border-white/25 bg-white/10 p-4 shadow-lg backdrop-blur-md">
          {tr.artwork_url && <img src={tr.artwork_url} alt="" className="mx-auto mb-3 h-40 w-40 rounded-2xl object-cover shadow" />}
          <p className="text-center font-extrabold">{tr.title}</p>
          <p className="mb-3 text-center text-xs text-white/60">{tr.author}{tr.is_preview ? " (preview 30 detik)" : ""}</p>
          <audio src={tr.stream_url} controls autoPlay className="w-full" />
          <a href={tr.stream_url} download target="_blank" rel="noreferrer" className="mt-3 block rounded-2xl bg-green-500 py-3 text-center font-extrabold text-white shadow-lg">Download Lagu</a>
        </div>
      )}
    </div>
  );
}

function TV() {
  const [view, setView] = useState("home");
  const [secs, setSecs] = useState([]);
  const [det, setDet] = useState(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { load(); }, []);
  async function load() {
    setBusy(true); setErr("");
    try {
      const d = await api("purtv/home");
      const s = [];
      if (arr(d.featuredSlider).length) s.push({ title: "Pilihan", items: d.featuredSlider });
      if (arr(d.latestReleases).length) s.push({ title: "Rilis Terbaru", items: d.latestReleases });
      if (arr(d.popularToday).length) s.push({ title: "Populer Hari Ini", items: d.popularToday });
      if (arr(d.ongoing).length) s.push({ title: "Sedang Tayang", items: d.ongoing });
      setSecs(s);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function search() {
    if (!q.trim()) return;
    setBusy(true); setErr("");
    try {
      const d = await api(`purtv/search?q=${encodeURIComponent(q.trim())}`);
      const items = arr(d.results || d.items);
      setSecs(items.length ? [{ title: "Hasil Pencarian", items }] : []);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function open(it) {
    setBusy(true); setErr("");
    try {
      const d = await api(`purtv/detail?url=${encodeURIComponent(it.url)}`);
      setDet(d); setView("det");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  const img = (it) => it.thumbnail || it.image || it.poster || it.cover;
  return (
    <div className="px-4 pt-4 pb-28">
      <Header grad="from-cyan-500 to-teal-600" icon={I.tv} title="Nonton Anime" desc="Anime sama Donghua sub Indo, update terus." />
      <div className="mb-4 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm backdrop-blur outline-none focus:border-cyan-500" placeholder="Cari judul anime..." />
        <button onClick={search} disabled={busy} className="rounded-2xl bg-cyan-500 px-5 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50">Cari</button>
      </div>
      <Err e={err} />
      {busy && <Spin />}
      {view === "home" && secs.map((s, i) => (
        <div key={i} className="mb-5">
          <h3 className="mb-2 text-sm font-extrabold text-white">{s.title}</h3>
          <div className="grid grid-cols-3 gap-2">
            {s.items.map((it, j) => (
              <button key={j} onClick={() => open(it)} className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-left shadow-md backdrop-blur-md transition active:scale-95">
                {img(it) && <img src={img(it)} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
                <p className="line-clamp-2 p-2 text-xs font-bold">{it.title}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
      {view === "det" && det && (
        <div>
          <button onClick={() => setView("home")} className="mb-3 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow backdrop-blur">Kembali</button>
          {det.defaultIframe && (
            <div className="mb-3 overflow-hidden rounded-2xl bg-black shadow-lg">
              <iframe src={det.defaultIframe} className="aspect-video w-full" allowFullScreen allow="autoplay; encrypted-media" />
            </div>
          )}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow backdrop-blur-md">
            <h3 className="font-extrabold">{det.title}</h3>
            <p className="mt-1 line-clamp-4 text-xs text-white/60">{det.synopsis}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: "home", icon: I.home, label: "Beranda" },
  { id: "ai", icon: I.botSm, label: "AI" },
  { id: "gambar", icon: I.imageSm, label: "Gambar" },
  { id: "download", icon: I.downloadSm, label: "Download" },
  { id: "nonton", icon: I.clapperSm, label: "Nonton" },
  { id: "komik", icon: I.bookSm, label: "Komik" },
  { id: "cari", icon: I.searchSm, label: "Cari" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  return (
    <div className="mx-auto min-h-screen max-w-lg">
      <div className="min-h-screen">
        {tab === "home" && <Home go={setTab} />}
        {tab === "ai" && <AIChat />}
        {tab === "gambar" && <Gambar />}
        {tab === "video" && <Video />}
        {tab === "download" && <Download />}
        {tab === "nonton" && <Nonton />}
        {tab === "tv" && <TV />}
        {tab === "komik" && <Komik />}
        {tab === "musik" && <Musik />}
        {tab === "cari" && <Cari />}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 bg-slate-950/30 backdrop-blur-xl">
        <div className="mx-auto grid max-w-lg grid-cols-7">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex flex-col items-center py-2.5 transition ${tab === t.id || (t.id === "ai" && tab === "gambar") ? "text-white" : "text-white/50"}`}>
              <span>{t.icon}</span>
              <span className="mt-0.5 text-[10px] font-bold">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
