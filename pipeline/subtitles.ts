import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { LessonScript, estimateSceneSeconds, type LessonScript as Script } from "./lib/schema.js";

// ── Subtitles (Module 3.5) ───────────────────────────────────────────────────
// timestamps -> lines <= 42 chars -> {lessonId}.en.vtt
//
// With real TTS, pass per-word alignment from ElevenLabs. Without it (Phase 2
// dry run), words are spread evenly across each scene's estimated duration, so
// a valid VTT still comes out — later swapped for frame-accurate timings.

const MAX_LINE_CHARS = 42;

export type WordTiming = { word: string; startSec: number; endSec: number };
export type SceneAlignment = { sceneId: number; words?: WordTiming[] };

type Cue = { startSec: number; endSec: number; text: string };

function evenWordTimings(narration: string, startSec: number, durationSec: number): WordTiming[] {
  const words = narration.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const per = durationSec / words.length;
  return words.map((word, i) => ({
    word,
    startSec: startSec + i * per,
    endSec: startSec + (i + 1) * per,
  }));
}

function groupIntoCues(words: WordTiming[]): Cue[] {
  const cues: Cue[] = [];
  let line: WordTiming[] = [];
  const flush = () => {
    if (!line.length) return;
    cues.push({
      startSec: line[0].startSec,
      endSec: line[line.length - 1].endSec,
      text: line.map((w) => w.word).join(" "),
    });
    line = [];
  };
  for (const w of words) {
    const candidate = [...line, w].map((x) => x.word).join(" ");
    if (candidate.length > MAX_LINE_CHARS && line.length) flush();
    line.push(w);
    // break lines at sentence ends too, for natural reading
    if (/[.!?]$/.test(w.word)) flush();
  }
  flush();
  return cues;
}

function fmt(sec: number): string {
  const ms = Math.round((sec % 1) * 1000);
  const total = Math.floor(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(s)}.${p(ms, 3)}`;
}

export function buildVtt(script: Script, alignment: SceneAlignment[] = []): string {
  const byId = new Map(alignment.map((a) => [a.sceneId, a]));
  const allWords: WordTiming[] = [];
  let offset = 0;
  for (const scene of script.scenes) {
    const dur = estimateSceneSeconds(scene);
    const provided = byId.get(scene.id)?.words;
    const words = provided?.length
      ? provided.map((w) => ({ ...w, startSec: w.startSec + offset, endSec: w.endSec + offset }))
      : evenWordTimings(scene.narration, offset, dur);
    allWords.push(...words);
    offset += dur;
  }
  const cues = groupIntoCues(allWords);
  const body = cues
    .map((c, i) => `${i + 1}\n${fmt(c.startSec)} --> ${fmt(c.endSec)}\n${c.text}`)
    .join("\n\n");
  return `WEBVTT\n\n${body}\n`;
}

// CLI: tsx subtitles.ts <scriptPath> [outPath]
if (import.meta.url === `file://${process.argv[1]}`) {
  const scriptPath = process.argv[2];
  if (!scriptPath) {
    console.error("usage: tsx subtitles.ts <scriptPath> [outPath]");
    process.exit(1);
  }
  const script = LessonScript.parse(JSON.parse(readFileSync(scriptPath, "utf8")));
  const out = process.argv[3] ?? resolve(process.cwd(), `../content/scripts/${script.lessonId}.en.vtt`);
  writeFileSync(out, buildVtt(script));
  console.log(`[subtitles] wrote ${out}`);
}
