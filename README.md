# SiPaling AI

One web app for everything: AI chat, image and video generation, media downloads, drama, anime, comics, music, and web search.

**Live demo:** https://xsrazy-web.vercel.app

![SiPaling AI](public/og-image.jpg)

## About

SiPaling AI ("Si paling bisa semua!", Indonesian for "the one that can do everything") is a mobile-first web app that puts nine everyday AI and media tools behind one bottom navigation bar. It is a pure frontend: every tool call goes through a small Next.js proxy route to an upstream AI/media API, so the app itself stores no user data and needs no login. The interface is in Indonesian.

## Features

- **AI Chat:** ask anything in a chat UI with conversation history.
- **Image tools:** text-to-image generation with live progress updates, image upscaler (2x), and background remover (from an image URL).
- **Video generation:** text-to-video with a ticket queue, status polling, and download.
- **Downloader:** paste a TikTok, YouTube, Instagram, or SoundCloud link and get video, MP3, or media download links.
- **Drama:** short dramas with Indonesian subtitles, search, and an episode player.
- **Anime:** anime and donghua catalog with search, details, and an episode player.
- **Comics:** Komiku comics with latest updates, weekly/monthly/all-time rankings, and a chapter reader.
- **Music:** SoundCloud track search with in-page playback and download (30-second preview where applicable).
- **Web search:** search the web and open results in a new tab.
- **Mobile-first UI:** single-column layout, bottom tab bar, glassmorphism cards, safe-area aware navigation.
- **Proxy guardrails:** the API proxy enforces 60 requests per minute per IP and passes server-sent event streams through untouched.

## Architecture

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS 3. A single client page (`app/page.js`) holds all nine tool views plus the bottom navigation bar; `lib/api.js` is the shared fetch/SSE helper.
- **Backend:** one Next.js route handler (`app/api/sipaling/[...path]/route.js`) that proxies GET and POST requests to the upstream API, enforces the per-IP rate limit, and streams SSE responses through.
- **No database, no accounts, no server-side storage.** All state lives in the browser.
- **Hosting:** Vercel (project `xsrazy-web`). Build command: `next build`.

## API

| Route | Method | Behavior |
|---|---|---|
| `/api/sipaling/*` | GET, POST | Proxies to `{UPSTREAM}/api/*`, 60 requests/min per IP (429 when exceeded), SSE streams passed through |

## Environment Variables

| Name | Purpose |
|---|---|
| `SIPALING_API_BASE_URL` | Upstream API base URL (defaults to the Koyeb backend) |

## Notes

- Upstream move (2026-10-27): the upstream API moved from Vercel to a Go backend on Koyeb, and the proxy default was updated the same day.
- The site metadata (canonical URL and Open Graph tags) still references `sipaling.ai.id`, whose DNS is currently pending; the live deployment is `xsrazy-web.vercel.app`.

## License

MIT. See [LICENSE](LICENSE).
