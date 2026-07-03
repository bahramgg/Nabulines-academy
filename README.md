# 👁️⃤ Nabulines Academy

> **From Creator to Builder** — an automated vibe-coding academy.
> Full product (video, audio, subtitles, UI, news) is **English**. See [`MASTER_PLAN.md`](./MASTER_PLAN.md).

An automated pipeline generates every lesson — script, narration, video, subtitles,
quiz, news — in English. The only human step is a one-tap approval from Telegram.

## Hard rules

1. ⏱️ No video over **5 minutes** — scripts capped at **750 words**.
2. 🚫 **Never-Fabricate** — every command/claim is really run and verified before publish.
3. ✅ Nothing goes live without Telegram approval.
4. 🔀 `content/` + `pipeline/` (data) stay separate from `apps/` (code).
5. 👁️⃤ Visual language mirrors nabulines.com — **full monochrome**, no accent colors.

## Repo layout

```
apps/web/            Next.js 14 site (static export → Cloudflare Pages)
pipeline/
  curriculum/
    syllabus.json    Source of truth: 45 lessons, 8 chapters (English)
    prompts/         Generation prompt templates
  *.ts               generate-lesson, tts, capture, verify, subtitles, publish
  remotion/          Video scene components
content/             Generated MDX lessons, script JSON, news
infra/               Telegram approval bot + VPS cron jobs
```

## Website (Phase 1 — done)

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000  (syncs syllabus.json first)
npm run build    # static export → apps/web/out/
```

Pages: `/` landing · `/roadmap` learning path with progress · `/learn/[ch]/[lesson]`
lesson player · `/news` builder news · `/leaderboard` community score.

Progress is stored in `localStorage` for now; the leaderboard uses mock data until
it connects to the Nabulines community score system.

### Cloudflare Pages

- Build command: `cd apps/web && npm install && npm run build`
- Output directory: `apps/web/out`
- Videos stream from Cloudflare R2 behind `media.nabulines.com` (added in Phase 2/3).

## Build phases

- **Phase 1 — Skeleton + validation (done):** repo structure, full `syllabus.json`,
  Next.js site with 5 pages and mock data, monochrome theme.
- **Phase 2:** end-to-end video pipeline (Remotion scenes, `generate-lesson`, `tts`,
  `capture`, `verify`, `subtitles`).
- **Phase 3:** Telegram approval loop + `publish` + News Agent.
- **Phase 4:** Orchestrator — 3 lessons/day to 45.
- **Phase 5:** quiz/points/leaderboard polish + SEO + launch.

## Needed to go further

- `ELEVEN_API_KEY`, `ELEVEN_VOICE_ID` (TTS)
- `ANTHROPIC_API_KEY` (lesson + news generation)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (approval bot)
- Cloudflare R2 bucket + credentials, custom domain
- The licensed techno display font file from nabulines.com (currently falls back to Michroma)
