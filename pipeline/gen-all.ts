import "dotenv/config";
import "./lib/proxy.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateLesson } from "./generate-lesson.js";

// Batch-generates every lesson script that doesn't exist yet. Cheap (OpenRouter)
// and persistent (scripts commit to git). Skips already-generated lessons so it
// is resumable. Run: npx tsx gen-all.ts   (best in the background)

const here = dirname(fileURLToPath(import.meta.url));
const syllabus = JSON.parse(readFileSync(resolve(here, "curriculum/syllabus.json"), "utf8"));
const OUT = resolve(here, "../content/scripts");
mkdirSync(OUT, { recursive: true });

const ids: string[] = [];
for (const ch of syllabus.chapters) for (const l of ch.lessons) ids.push(l.id);

let done = 0, made = 0, failed = 0;
for (const id of ids) {
  const out = resolve(OUT, `${id}.json`);
  if (existsSync(out)) {
    done++;
    console.log(`[skip] ${id} (exists)`);
    continue;
  }
  try {
    const script = await generateLesson(id);
    writeFileSync(out, JSON.stringify(script, null, 2));
    made++;
    console.log(`[made] ${id} -> ${out}`);
  } catch (err) {
    failed++;
    console.error(`[fail] ${id}: ${(err as Error).message ?? err}`);
  }
}
console.log(`\n[gen-all] done. existing=${done} made=${made} failed=${failed} total=${ids.length}`);
