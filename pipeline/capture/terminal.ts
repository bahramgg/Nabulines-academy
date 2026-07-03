import { execSync } from "node:child_process";
import { resolve } from "node:path";

// Runs a sequence of REAL shell commands and captures their REAL output as a
// transcript ("cast"). `cd` updates the tracked working directory so a
// multi-step session behaves like a real one. This is the Never-Fabricate rule
// for terminal lessons: what the viewer sees actually ran.

export type CastStep = { cmd: string; output: string };

export function recordTerminalCast(cmds: string[], baseDir: string): CastStep[] {
  let cwd = baseDir;
  const cast: CastStep[] = [];
  for (const cmd of cmds) {
    const trimmed = cmd.trim();
    const cd = trimmed.match(/^cd\s+(.+)$/);
    if (cd) {
      cwd = resolve(cwd, cd[1]);
      cast.push({ cmd: trimmed, output: "" });
      continue;
    }
    let output = "";
    try {
      output = execSync(trimmed, { cwd, shell: "/bin/bash", encoding: "utf8", timeout: 60_000 });
    } catch (err) {
      const e = err as { stdout?: string; stderr?: string; message?: string };
      output = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim() || (e.message ?? "");
    }
    cast.push({ cmd: trimmed, output: output.replace(/\n$/, "") });
  }
  return cast;
}
