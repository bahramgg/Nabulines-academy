// Copies the single source-of-truth syllabus into the web app so the site is
// buildable standalone (Cloudflare Pages) without importing across the repo root.
// Keeps content/ + pipeline/ (data) separated from apps/ (code) per the master plan.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../../../pipeline/curriculum/syllabus.json");
const dest = resolve(here, "../lib/syllabus.data.json");

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`[sync-syllabus] ${src} -> ${dest}`);
