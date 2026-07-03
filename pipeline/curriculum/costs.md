# Costs Reference — verified July 2026

> Every price a lesson states MUST come from this file (Never-Fabricate applies
> to money too). Prices change — the pipeline re-checks this file quarterly.
> Always tell the learner: "prices as of this recording — check the live page."
> Always show the **free path first**, then paid options, then how to pay.

## The free starting path (spend $0 to begin)

A total beginner can start and even deploy a real site for **$0**:
- **claude.ai — Free plan ($0):** chat + Artifacts. Enough to build your first
  pages and small apps in the browser.
- **GitHub — Free:** unlimited public repos.
- **Cloudflare Pages — Free:** deploy a real site on a `*.pages.dev` URL.
- So Chapters 0–3 (first sites) can be done **without paying anything**.

Costs appear later: Claude Code (needs a paid plan or API), a custom domain,
narration/automation tools, and a VPS.

## Claude (claude.ai) — subscriptions

| Plan | Price | What you get |
|------|-------|--------------|
| Free | $0 | Web chat + Artifacts, limited daily usage |
| Pro | **$20/mo** (~$17/mo billed yearly) | More usage + **Claude Code** at baseline limits |
| Max 5× | **$100/mo** | 5× Pro usage (heavier Claude Code use) |
| Max 20× | **$200/mo** | 20× Pro usage |

- **Claude Code is free to install** (`npm i -g @anthropic-ai/claude-code`) but to
  run it you need **either** a Pro/Max plan **or** API credits (below).
- Usage is **shared** between claude.ai and Claude Code on the same plan.
- For most learners starting Claude Code: **Pro ($20/mo) is the entry point.**

## Anthropic API — pay-as-you-go (alternative to a subscription)

Per **million tokens** (input / output):
| Model | Input | Output |
|-------|-------|--------|
| Haiku 4.5 | $1 | $5 |
| Sonnet 4.6 | $3 | $15 |
| Opus 4.8 | $5 | $25 |

- No permanent free tier; you add credits and pay for what you use.
- Prompt caching cuts cached input ~90%; batch is ~50% cheaper.
- Good for light/occasional Claude Code use instead of a monthly plan.

## OpenRouter — one key, many models, **pay with crypto**

- Pay-as-you-go across many models (including Claude) at roughly provider price
  plus a small fee. **Top up with crypto (USDC)** — no card needed.
- Best option for learners **without a credit card**.

## ElevenLabs — narration (only needed for the automation/creator track)

| Plan | Price | Rough monthly audio |
|------|-------|---------------------|
| Free | $0 | ~10 min (10k credits) |
| Starter | **$5/mo** | ~30 min |
| Creator | **$22/mo** | ~100 min |
| Pro | **$99/mo** | ~500 min |

- **Card only** (no direct crypto). No-card path: a crypto-funded virtual card.

## Infrastructure

| Item | Price |
|------|-------|
| GitHub | Free |
| Cloudflare Pages | Free |
| Cloudflare R2 (video/file storage) | ~$0.015/GB stored, **egress free** (<$1/mo for this course) |
| Custom domain | ~$10–12 / year |
| VPS (Hetzner / DigitalOcean / etc.) | ~$5–15 / month |

## Paying when you don't have a credit card (common outside the US)

1. **OpenRouter + crypto** — covers all your LLM/AI usage (USDC top-up).
2. **Crypto-funded virtual card** — a Visa/Mastercard you load with crypto,
   then use anywhere cards are required (ElevenLabs, a Claude subscription, a VPS).
3. **Cloudflare / GitHub** — free, no card to start.

## Honest monthly picture

- **Just learning, browser-only (Ch 0–3):** $0.
- **Serious with Claude Code:** ~$20/mo (Claude Pro) + ~$1/yr domain-share.
- **Full creator/automation track (own tools, narration, always-on agent):**
  ~$20 (Claude Pro) + ~$5–22 (ElevenLabs) + ~$5–15 (VPS) + <$1 (R2) ≈ **$30–60/mo**.
