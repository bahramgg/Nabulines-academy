import { z } from "zod";

// ── Lesson script contract (Module 1 output → Module 3 input) ────────────────
// A generated lesson script must satisfy this schema AND the hard rules:
//   totalWords <= 750  and  estimated duration <= 300s.

export const SceneType = z.enum(["intro", "slide", "code", "terminal", "browser", "outro"]);
export type SceneType = z.infer<typeof SceneType>;

export const Scene = z.object({
  id: z.number().int().positive(),
  type: SceneType,
  narration: z.string().min(1),
  visual: z.record(z.any()).default({}),
  // filled in by tts.ts once audio is rendered:
  audioFile: z.string().optional(),
  durationSec: z.number().positive().optional(),
});
export type Scene = z.infer<typeof Scene>;

export const QuizQuestion = z.object({
  q: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  answer: z.number().int().min(0),
  points: z.number().int().positive().default(10),
});
export type QuizQuestion = z.infer<typeof QuizQuestion>;

export const LessonScript = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(1),
  totalWords: z.number().int().positive(),
  scenes: z.array(Scene).min(2),
  quiz: z.array(QuizQuestion).default([]),
  exercise: z.string().min(1),
  verifyCommands: z.array(z.string()).default([]),
});
export type LessonScript = z.infer<typeof LessonScript>;

// ── Hard limits ──────────────────────────────────────────────────────────────
export const MAX_WORDS = 750;
export const MAX_SECONDS = 300;
export const WORDS_PER_SECOND = 2.5; // ~150 wpm narration

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Estimate a scene's spoken duration from its narration (used before TTS). */
export function estimateSceneSeconds(scene: Scene): number {
  if (scene.durationSec) return scene.durationSec;
  return Math.max(1.5, countWords(scene.narration) / WORDS_PER_SECOND);
}

export function estimateTotalSeconds(script: LessonScript): number {
  return script.scenes.reduce((sum, s) => sum + estimateSceneSeconds(s), 0);
}

export type ValidationResult =
  | { ok: true; words: number; seconds: number }
  | { ok: false; words: number; seconds: number; errors: string[] };

/** Strict validator: schema + word cap + duration cap. Drives the regenerate loop. */
export function validateScript(input: unknown): ValidationResult {
  const parsed = LessonScript.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      words: 0,
      seconds: 0,
      errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  const script = parsed.data;
  const spokenWords = script.scenes.reduce((n, s) => n + countWords(s.narration), 0);
  const seconds = estimateTotalSeconds(script);
  const errors: string[] = [];

  if (spokenWords > MAX_WORDS) {
    errors.push(`Narration is ${spokenWords} words — over the ${MAX_WORDS}-word cap. Make it shorter.`);
  }
  if (seconds > MAX_SECONDS) {
    errors.push(`Estimated ${Math.round(seconds)}s — over the ${MAX_SECONDS}s cap. Cut scenes or trim narration.`);
  }
  if (script.scenes[0]?.type !== "intro") errors.push("First scene must be an intro.");
  if (script.scenes[script.scenes.length - 1]?.type !== "outro") {
    errors.push("Last scene must be an outro.");
  }

  if (errors.length) return { ok: false, words: spokenWords, seconds, errors };
  return { ok: true, words: spokenWords, seconds };
}
