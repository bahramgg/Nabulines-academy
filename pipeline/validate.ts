import { readFileSync } from "node:fs";
import { validateScript } from "./lib/schema.js";

// CLI: tsx validate.ts <scriptPath> — checks schema + 750-word + 300s caps.
const scriptPath = process.argv[2];
if (!scriptPath) {
  console.error("usage: tsx validate.ts <scriptPath>");
  process.exit(1);
}

const result = validateScript(JSON.parse(readFileSync(scriptPath, "utf8")));
if (result.ok) {
  console.log(`✓ valid · ${result.words} words · ~${Math.round(result.seconds)}s`);
  process.exit(0);
}
console.error(`✗ invalid · ${result.words} words · ~${Math.round(result.seconds)}s`);
for (const e of result.errors) console.error(`  - ${e}`);
process.exit(1);
