import "dotenv/config";
import "./lib/proxy.js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chat, type ChatMessage } from "./lib/llm.js";
import { validateScript, LessonScript, type LessonScript as Script } from "./lib/schema.js";

// ── Curriculum Engine (Module 1) ─────────────────────────────────────────────
// syllabus lesson -> Claude (via OpenRouter) -> validated script JSON.
// Regenerates with feedback until the strict validator passes (max 3 tries).

const here = dirname(fileURLToPath(import.meta.url));
const SYLLABUS = resolve(here, "curriculum/syllabus.json");
const PROMPT = resolve(here, "curriculum/prompts/lesson.md");
const OUT_DIR = resolve(here, "../content/scripts");

type SyllabusLesson = {
  id: string;
  title: string;
  goal: string;
  exercise: string;
  sceneHints: string[];
};

function findLesson(lessonId: string): { lesson: SyllabusLesson } {
  const syllabus = JSON.parse(readFileSync(SYLLABUS, "utf8"));
  for (const ch of syllabus.chapters) {
    const lesson = ch.lessons.find((l: SyllabusLesson) => l.id === lessonId);
    if (lesson) return { lesson };
  }
  throw new Error(`Lesson ${lessonId} not found in syllabus.json`);
}

function stripFences(raw: string): string {
  return raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
}

export async function generateLesson(lessonId: string): Promise<Script> {
  const { lesson } = findLesson(lessonId);
  const template = readFileSync(PROMPT, "utf8");

  const system: ChatMessage = { role: "system", content: template };
  const messages: ChatMessage[] = [
    system,
    {
      role: "user",
      content: JSON.stringify(
        {
          lessonId: lesson.id,
          title: lesson.title,
          goal: lesson.goal,
          exercise: lesson.exercise,
          sceneHints: lesson.sceneHints,
        },
        null,
        2,
      ),
    },
  ];

  for (let attempt = 1; attempt <= 3; attempt++) {
    const raw = await chat(messages, { jsonMode: true });
    let candidate: unknown;
    try {
      candidate = JSON.parse(stripFences(raw));
    } catch {
      messages.push({ role: "assistant", content: raw });
      messages.push({ role: "user", content: "That was not valid JSON. Return ONLY the JSON object." });
      continue;
    }

    const result = validateScript(candidate);
    if (result.ok) {
      const script = LessonScript.parse(candidate);
      console.log(`[generate] ${lessonId} ok · ${result.words} words · ~${Math.round(result.seconds)}s`);
      return script;
    }

    console.warn(`[generate] ${lessonId} attempt ${attempt} rejected:\n  - ${result.errors.join("\n  - ")}`);
    messages.push({ role: "assistant", content: raw });
    messages.push({
      role: "user",
      content: `Your script failed validation. Fix these and return ONLY the corrected JSON:\n- ${result.errors.join("\n- ")}`,
    });
  }
  throw new Error(`[generate] ${lessonId} failed validation after 3 attempts.`);
}

// CLI: tsx generate-lesson.ts <lessonId>
if (import.meta.url === `file://${process.argv[1]}`) {
  const lessonId = process.argv[2];
  if (!lessonId) {
    console.error("usage: tsx generate-lesson.ts <lessonId>   e.g. ch0-l1");
    process.exit(1);
  }
  generateLesson(lessonId)
    .then((script) => {
      mkdirSync(OUT_DIR, { recursive: true });
      const out = resolve(OUT_DIR, `${lessonId}.json`);
      writeFileSync(out, JSON.stringify(script, null, 2));
      console.log(`[generate] wrote ${out}`);
    })
    .catch((err) => {
      console.error(err.message ?? err);
      process.exit(1);
    });
}
