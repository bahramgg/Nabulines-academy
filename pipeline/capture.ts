import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ── Capture (Module 3.3) ─────────────────────────────────────────────────────
// Records a REAL browser demo with Playwright (1920×1080) so viewers see the
// real process, not a fake screenshot — the Never-Fabricate rule, visually.
//
// A lesson's `browser` scene points at a capture script (visual.captureScript).
// Each capture script exports `run(page)`; this driver wraps it in a recorded
// context and returns the webm path.

const here = dirname(fileURLToPath(import.meta.url));

// Uses the pre-installed Chromium (PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers).
export async function capture(demoModule: string, lessonId: string): Promise<string> {
  const { chromium } = await import("playwright");
  const outDir = resolve(here, `../content/captures/${lessonId}`);
  mkdirSync(outDir, { recursive: true });

  // Use a specific Chromium build when provided (e.g. the pre-installed one in
  // managed environments); otherwise Playwright's default.
  const executablePath = process.env.CHROMIUM_PATH || undefined;
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
    // For UI-heavy lessons (e.g. claude.ai) load a saved session:
    ...(process.env.CAPTURE_STORAGE_STATE ? { storageState: process.env.CAPTURE_STORAGE_STATE } : {}),
  });
  const page = await context.newPage();

  const mod = (await import(resolve(here, demoModule))) as { run: (page: unknown) => Promise<void> };
  if (typeof mod.run !== "function") throw new Error(`${demoModule} must export async run(page)`);
  await mod.run(page);

  const video = page.video();
  await context.close();
  await browser.close();
  const path = video ? await video.path() : "";
  console.log(`[capture] ${lessonId} -> ${path}`);
  return path;
}

// CLI: tsx capture.ts <demoModule> <lessonId>
if (import.meta.url === `file://${process.argv[1]}`) {
  const [demoModule, lessonId] = process.argv.slice(2);
  if (!demoModule || !lessonId) {
    console.error("usage: tsx capture.ts <demoModule> <lessonId>");
    process.exit(1);
  }
  capture(demoModule, lessonId).catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
}
