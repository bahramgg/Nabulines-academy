# Pipeline (Modules 1, 3, 4)

The content factory. Each lesson flows:

```
syllabus.json → generate-lesson → tts → capture → verify → remotion render → subtitles → publish
```

## Files (Phase 2 targets)

| File | Module | Job |
|------|--------|-----|
| `generate-lesson.ts` | 1 | Claude API → validated script JSON (≤750 words) in `content/scripts/` |
| `tts.ts` | 3 | ElevenLabs narration per scene + character timestamps |
| `capture.ts` | 3 | Playwright records real browser demos (Never-Fabricate) |
| `verify.ts` | 3 | Runs each lesson's `verifyCommands` in a sandbox; fail → regenerate |
| `subtitles.ts` | 3 | timestamps → `{lessonId}.en.vtt` |
| `publish.ts` | 3 | Upload MP4/VTT to R2 + write MDX + git commit/push |
| `remotion/` | 3 | Six scene components: Intro, Slide, Code, Terminal, Browser, Outro |

## Running it (Phase 2 — works today)

```bash
cd pipeline && npm install
npm run validate  ../content/scripts/ch0-l1.json    # schema + 750-word / 300s caps
npm run subtitles ../content/scripts/ch0-l1.json    # -> content/scripts/ch0-l1.en.vtt

# verify runs from the REPO ROOT (verifyCommands are rooted there):
cd .. && node --import tsx/esm pipeline/verify.ts content/scripts/ch0-l1.json

# render (uses the six Remotion scenes):
cd pipeline/remotion && npm install
npx remotion render src/index.ts Lesson out/ch0-l1.mp4 --props=../../content/scripts/ch0-l1.json
```

With keys set (`pipeline/.env` from `.env.example`):

```bash
npm run generate ch0-l2     # OpenRouter -> validated content/scripts/ch0-l2.json
npm run tts ../content/scripts/ch0-l2.json   # ElevenLabs or local Piper + timings
```

## State machine (`syllabus.json` `status`)

`pending → scripted → rendered → verified → awaiting_approval → published`

Nothing renders without a green `verify`. Nothing publishes without Telegram approval.

## Curriculum

`curriculum/syllabus.json` is the single source of truth (45 lessons, English).
The website syncs a copy of it at build time — edit it here, not in `apps/web`.
