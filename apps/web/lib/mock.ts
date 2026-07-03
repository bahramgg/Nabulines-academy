// Mock data for Phase 1 pages (news + leaderboard). Real data arrives with the
// News Agent (Module 4) and the community score system later.

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  source: string;
  sourceUrl: string;
  whatHappened: string;
  whyItMatters: string;
};

export const news: NewsItem[] = [
  {
    slug: "claude-code-web-sessions",
    title: "Claude Code Comes to the Browser",
    date: "2026-06-30",
    source: "Anthropic",
    sourceUrl: "https://www.anthropic.com",
    whatHappened:
      "Claude Code can now run in the browser as remote sessions, cloning a repo into an isolated cloud container and pushing changes back.",
    whyItMatters:
      "You no longer need a powerful laptop or a local setup to build. A phone and a browser are enough to start shipping — exactly the on-ramp this academy is built around.",
  },
  {
    slug: "cloudflare-r2-zero-egress",
    title: "Why Zero-Egress Storage Changes Video Hosting",
    date: "2026-06-27",
    source: "Cloudflare",
    sourceUrl: "https://www.cloudflare.com",
    whatHappened:
      "Cloudflare R2 continues to charge nothing for egress, so streaming files out of a bucket is effectively free.",
    whyItMatters:
      "A builder can host a full course of videos for under a dollar a month. Distribution stops being a cost problem and starts being a content problem — which is the one worth having.",
  },
  {
    slug: "elevenlabs-v3-expressive-tts",
    title: "Expressive Text-to-Speech Gets Good Enough to Teach",
    date: "2026-06-24",
    source: "ElevenLabs",
    sourceUrl: "https://elevenlabs.io",
    whatHappened:
      "The latest expressive TTS models produce narration with natural pacing and emphasis close to a human educator.",
    whyItMatters:
      "One builder can now produce a polished video course without a studio or a voice actor. The bottleneck moves back to the quality of the script — the part that actually teaches.",
  },
];

export type LeaderboardEntry = {
  rank: number;
  handle: string;
  points: number;
  lessonsDone: number;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, handle: "@builder_zero", points: 430, lessonsDone: 43 },
  { rank: 2, handle: "@shipfast", points: 410, lessonsDone: 41 },
  { rank: 3, handle: "@vibecoder", points: 380, lessonsDone: 39 },
  { rank: 4, handle: "@nightbuild", points: 350, lessonsDone: 35 },
  { rank: 5, handle: "@fromcreator", points: 320, lessonsDone: 33 },
  { rank: 6, handle: "@onetap", points: 290, lessonsDone: 30 },
  { rank: 7, handle: "@artifact_kid", points: 250, lessonsDone: 26 },
  { rank: 8, handle: "@cronjob", points: 220, lessonsDone: 23 },
  { rank: 9, handle: "@ownyourstack", points: 180, lessonsDone: 19 },
  { rank: 10, handle: "@justpublished", points: 150, lessonsDone: 16 },
];
