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

## State machine (`syllabus.json` `status`)

`pending → scripted → rendered → verified → awaiting_approval → published`

Nothing renders without a green `verify`. Nothing publishes without Telegram approval.

## Curriculum

`curriculum/syllabus.json` is the single source of truth (45 lessons, English).
The website syncs a copy of it at build time — edit it here, not in `apps/web`.
