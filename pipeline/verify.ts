import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { LessonScript, type LessonScript as Script } from "./lib/schema.js";

// ── Verify (Module 3.4) ──────────────────────────────────────────────────────
// Runs every verifyCommand before render. Any failure => the lesson goes back to
// the regenerate queue with the error log. No green verify, no render. This is
// how the Never-Fabricate rule is enforced in code.

export type VerifyReport = {
  lessonId: string;
  ok: boolean;
  results: { command: string; ok: boolean; output: string }[];
};

export function verifyLesson(script: Script, opts: { timeoutMs?: number } = {}): VerifyReport {
  const timeout = opts.timeoutMs ?? 120_000;
  const results = script.verifyCommands.map((command) => {
    try {
      const output = execSync(command, {
        timeout,
        stdio: "pipe",
        encoding: "utf8",
        shell: "/bin/bash",
      });
      return { command, ok: true, output: output.slice(-2000) };
    } catch (err: unknown) {
      const e = err as { stdout?: string; stderr?: string; message?: string };
      const output = `${e.stdout ?? ""}${e.stderr ?? ""}${e.message ?? ""}`.slice(-2000);
      return { command, ok: false, output };
    }
  });
  return { lessonId: script.lessonId, ok: results.every((r) => r.ok), results };
}

// CLI: tsx verify.ts <scriptPath>
if (import.meta.url === `file://${process.argv[1]}`) {
  const scriptPath = process.argv[2];
  if (!scriptPath) {
    console.error("usage: tsx verify.ts <scriptPath>");
    process.exit(1);
  }
  const script = LessonScript.parse(JSON.parse(readFileSync(scriptPath, "utf8")));
  const report = verifyLesson(script);
  for (const r of report.results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.command}`);
    if (!r.ok) console.log(r.output);
  }
  console.log(report.ok ? `\n[verify] ${script.lessonId} PASSED` : `\n[verify] ${script.lessonId} FAILED`);
  process.exit(report.ok ? 0 : 1);
}
