// Copies the source-of-truth syllabus into the web app and enriches each lesson
// with its real quiz (from content/scripts/<id>.json) so the site can gate
// completion on a real quiz pass. Keeps content/pipeline (data) separate from
// apps (code) per the master plan.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../../../pipeline/curriculum/syllabus.json");
const scriptsDir = resolve(here, "../../../content/scripts");
const dest = resolve(here, "../lib/syllabus.data.json");

const syllabus = JSON.parse(readFileSync(src, "utf8"));
let withQuiz = 0;
for (const chapter of syllabus.chapters) {
  for (const lesson of chapter.lessons) {
    const scriptPath = resolve(scriptsDir, `${lesson.id}.json`);
    if (existsSync(scriptPath)) {
      try {
        const script = JSON.parse(readFileSync(scriptPath, "utf8"));
        if (Array.isArray(script.quiz) && script.quiz.length) {
          lesson.quiz = script.quiz;
          withQuiz++;
        }
      } catch {
        /* ignore malformed script */
      }
    }
  }
}

mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(syllabus, null, 2));
console.log(`[sync-syllabus] ${src} -> ${dest} (quizzes merged: ${withQuiz})`);
