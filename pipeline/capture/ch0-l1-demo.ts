import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page } from "playwright";

// Browser-scene demo for ch0-l1: a working countdown timer, "built from one
// prompt". Loads the real page and lets it run so capture.ts records it live.
const here = dirname(fileURLToPath(import.meta.url));

export async function run(page: Page): Promise<void> {
  const url = pathToFileURL(resolve(here, "demos/countdown.html")).href;
  await page.goto(url);
  await page.waitForSelector("#countdown");
  await page.waitForTimeout(6000); // record a few seconds of the countdown
}
