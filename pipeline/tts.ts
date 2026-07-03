import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LessonScript, type LessonScript as Script, type Scene } from "./lib/schema.js";
import type { WordTiming } from "./subtitles.js";

// ── Narration (Module 3.1) ───────────────────────────────────────────────────
// One audio file per scene + per-word timings for frame-accurate subtitles.
// TTS_PROVIDER=elevenlabs (best, card only) | local (Piper on the VPS, free).

const here = dirname(fileURLToPath(import.meta.url));

export type SceneAudio = { sceneId: number; audioFile: string; durationSec: number; words: WordTiming[] };

function charsToWords(text: string, chars: string[], starts: number[], ends: number[]): WordTiming[] {
  const words: WordTiming[] = [];
  let cur = "";
  let startIdx = -1;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c)) {
      if (cur) {
        words.push({ word: cur, startSec: starts[startIdx], endSec: ends[i - 1] ?? starts[startIdx] });
        cur = "";
        startIdx = -1;
      }
    } else {
      if (!cur) startIdx = i;
      cur += c;
    }
  }
  if (cur && startIdx >= 0) words.push({ word: cur, startSec: starts[startIdx], endSec: ends[ends.length - 1] });
  return words;
}

async function elevenlabs(scene: Scene, outFile: string): Promise<SceneAudio> {
  const key = process.env.ELEVEN_API_KEY;
  const voice = process.env.ELEVEN_VOICE_ID;
  if (!key || !voice) throw new Error("ELEVEN_API_KEY / ELEVEN_VOICE_ID not set.");
  const model = process.env.ELEVEN_MODEL ?? "eleven_v3";

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: scene.narration, model_id: model }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);

  const data = (await res.json()) as {
    audio_base64: string;
    alignment: { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };
  };
  writeFileSync(outFile, Buffer.from(data.audio_base64, "base64"));
  const a = data.alignment;
  const words = charsToWords(scene.narration, a.characters, a.character_start_times_seconds, a.character_end_times_seconds);
  const durationSec = a.character_end_times_seconds.at(-1) ?? 0;
  return { sceneId: scene.id, audioFile: outFile, durationSec, words };
}

function localPiper(scene: Scene, outFile: string): SceneAudio {
  // Free path: Piper TTS on the VPS. Requires PIPER_BIN + PIPER_MODEL (.onnx).
  const bin = process.env.PIPER_BIN;
  const voiceModel = process.env.PIPER_MODEL;
  if (!bin || !voiceModel) {
    throw new Error(
      "Local TTS needs PIPER_BIN + PIPER_MODEL. Install Piper on the VPS, or set TTS_PROVIDER=elevenlabs.",
    );
  }
  const wav = outFile.replace(/\.\w+$/, ".wav");
  execFileSync(bin, ["--model", voiceModel, "--output_file", wav], { input: scene.narration });
  // Piper doesn't return word timings; subtitles.ts falls back to even spacing.
  const durationSec = wavDurationSec(wav);
  return { sceneId: scene.id, audioFile: wav, durationSec, words: [] };
}

function wavDurationSec(path: string): number {
  const buf = readFileSync(path);
  const byteRate = buf.readUInt32LE(28);
  const dataSize = buf.readUInt32LE(40);
  return byteRate ? dataSize / byteRate : 0;
}

export async function synthesizeScene(scene: Scene, outFile: string): Promise<SceneAudio> {
  const provider = process.env.TTS_PROVIDER ?? "local";
  return provider === "elevenlabs" ? elevenlabs(scene, outFile) : localPiper(scene, outFile);
}

export async function synthesizeLesson(script: Script, outDir: string): Promise<SceneAudio[]> {
  mkdirSync(outDir, { recursive: true });
  const out: SceneAudio[] = [];
  for (const scene of script.scenes) {
    const file = resolve(outDir, `${script.lessonId}-s${scene.id}.mp3`);
    out.push(await synthesizeScene(scene, file));
  }
  return out;
}

// CLI: tsx tts.ts <scriptPath>
if (import.meta.url === `file://${process.argv[1]}`) {
  const scriptPath = process.argv[2];
  if (!scriptPath) {
    console.error("usage: tsx tts.ts <scriptPath>");
    process.exit(1);
  }
  const script = LessonScript.parse(JSON.parse(readFileSync(scriptPath, "utf8")));
  const outDir = resolve(here, `../content/audio/${script.lessonId}`);
  synthesizeLesson(script, outDir)
    .then((audio) => {
      const meta = resolve(outDir, "timings.json");
      writeFileSync(meta, JSON.stringify(audio, null, 2));
      const total = audio.reduce((s, a) => s + a.durationSec, 0);
      console.log(`[tts] ${script.lessonId}: ${audio.length} scenes · ${total.toFixed(1)}s · timings -> ${meta}`);
    })
    .catch((err) => {
      console.error(err.message ?? err);
      process.exit(1);
    });
}
