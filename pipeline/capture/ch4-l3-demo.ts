import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import type { Page } from "playwright";
import { recordTerminalCast } from "./terminal.js";

// Terminal-scene demo: a real first-project session. The commands below actually
// run; their real output is replayed in the branded terminal.
const here = dirname(fileURLToPath(import.meta.url));

const COMMANDS = [
  "node --version",
  "mkdir hello-builder",
  "cd hello-builder",
  'echo "console.log(\'Hello from your first build!\')" > app.js',
  "cat app.js",
  "node app.js",
];

export async function run(page: Page): Promise<void> {
  const workdir = mkdtempSync(resolve(tmpdir(), "nab-term-"));
  const cast = recordTerminalCast(COMMANDS, workdir);
  await page.addInitScript(`window.__CAST__ = ${JSON.stringify(cast)};`);
  const url = pathToFileURL(resolve(here, "terminal-replay.html")).href;
  await page.goto(url);
  await page.waitForFunction("window.__DONE__ === true", { timeout: 60_000 });
}
