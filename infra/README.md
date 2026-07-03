# Infra (Modules 5, 6)

## `telegram-bot/` — Approval Bot (Module 5)

Two-way Telegram bot. For each finished lesson it sends a preview card:

```
📗 New lesson ready for review
ch2-l1 — Your First Landing Page with Artifacts
⏱ 4:38 | ✅ Verify passed | 🎬 preview: <signed R2 link>

[✅ Approve]  [✏️ Revise]  [❌ Reject]
```

- **Approve** → `publish.ts` (commit + push → Cloudflare Pages auto-deploy)
- **Revise** → your text reply becomes feedback for a regenerate → v2 back in queue
- **Reject** → archive + log reason
- Admin commands: `/status`, `/next`, `/pause`

## `cron/` — Orchestrator (Module 6)

- State machine over `syllabus.json`.
- Daily cron: take the next 3 `pending` lessons → full pipeline → send to Telegram.
- Retry each step twice with logging; final failure → Telegram alert with traceback.
- Structured JSON logs in `logs/` + weekly report (lessons published, TTS cost).
