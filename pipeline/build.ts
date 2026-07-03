import "dotenv/config";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ── Orchestrator (Module 6, simplified) ──────────────────────────────────────
// For every lesson that isn't published yet: tts -> render -> publish (IPFS) ->
// commit+push. Resumable (skips published), fault-tolerant (logs and continues).
// Run in the background:  npx tsx build.ts   [ch0-l1 ch0-l2 ...]  (optional filter)

const here = dirname(fileURLToPath(import.meta.url));
const remotionDir = resolve(here, "remotion");
const SYLLABUS = resolve(here, "curriculum/syllabus.json");

function sh(cmd: string, cwd: string) {
  execSync(cmd, { cwd, stdio: "inherit", env: process.env });
}

function lessons(): { id: string; status: string }[] {
  const s = JSON.parse(readFileSync(SYLLABUS, "utf8"));
  return s.chapters.flatMap((c: { lessons: { id: string; status: string }[] }) => c.lessons);
}

const only = process.argv.slice(2);
const queue = lessons().filter((l) => l.status !== "published" && (!only.length || only.includes(l.id)));

console.log(`[build] ${queue.length} lesson(s) to produce\n`);
let ok = 0, fail = 0;
for (const [i, l] of queue.entries()) {
  const id = l.id;
  const t0 = Date.now();
  console.log(`\n===== [${i + 1}/${queue.length}] ${id} =====`);
  try {
    sh(`npx tsx tts.ts ../content/scripts/${id}.json`, here);
    sh(
      `npx remotion render src/index.ts Lesson out/${id}.mp4 --props=../../content/scripts/${id}.audio.json --concurrency=4`,
      remotionDir,
    );
    sh(`npx tsx publish.ts ${id}`, here);
    // Persist progress: commit the syllabus/MDX/VTT for this lesson.
    sh(
      `git add -A && git commit -q -m "Publish ${id} (auto)" && git push -q || true`,
      resolve(here, ".."),
    );
    ok++;
    console.log(`[build] ${id} done in ${Math.round((Date.now() - t0) / 1000)}s`);
  } catch (err) {
    fail++;
    console.error(`[build] ${id} FAILED: ${(err as Error).message ?? err}`);
  }
}
console.log(`\n[build] complete. ok=${ok} fail=${fail}`);
