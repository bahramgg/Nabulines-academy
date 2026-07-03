import "dotenv/config";
import "./lib/proxy.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AwsClient } from "aws4fetch";
import { LessonScript, type LessonScript as Script } from "./lib/schema.js";

// ── Publish (Module 3.6 / 5) ─────────────────────────────────────────────────
// Uploads a rendered MP4 + VTT to Cloudflare R2, writes the lesson MDX the site
// reads, and marks the lesson published in the syllabus. Called on Telegram
// Approve. Needs R2_* env (see .env.example).

const here = dirname(fileURLToPath(import.meta.url));
const SYLLABUS = resolve(here, "curriculum/syllabus.json");
const LESSONS_DIR = resolve(here, "../content/lessons");
const RENDER_DIR = resolve(here, "remotion/out");
const VTT_DIR = resolve(here, "../content/scripts");

function r2Client() {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accessKeyId || !secretAccessKey || !accountId) {
    throw new Error("R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY not set.");
  }
  const client = new AwsClient({ accessKeyId, secretAccessKey, region: "auto", service: "s3" });
  const bucket = process.env.R2_BUCKET ?? "academy-videos";
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucket}`;
  const publicBase = process.env.R2_PUBLIC_BASE ?? "https://media.nabulines.com";
  return { client, endpoint, publicBase };
}

async function putObject(key: string, body: Buffer, contentType: string): Promise<string> {
  const { client, endpoint, publicBase } = r2Client();
  const res = await client.fetch(`${endpoint}/${key}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) throw new Error(`R2 PUT ${key} failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return `${publicBase}/${key}`;
}

function chapterOf(lessonId: string): { chapterId: string; index: number; title: string } {
  const syllabus = JSON.parse(readFileSync(SYLLABUS, "utf8"));
  for (const ch of syllabus.chapters) {
    if (ch.lessons.some((l: { id: string }) => l.id === lessonId)) {
      return { chapterId: ch.id, index: ch.index, title: ch.title };
    }
  }
  throw new Error(`Lesson ${lessonId} not in syllabus`);
}

function writeMdx(script: Script, videoUrl: string, vttUrl: string) {
  mkdirSync(LESSONS_DIR, { recursive: true });
  const ch = chapterOf(script.lessonId);
  const fm = {
    lessonId: script.lessonId,
    title: script.title,
    chapter: ch.chapterId,
    chapterTitle: ch.title,
    video: videoUrl,
    vtt: vttUrl,
    exercise: script.exercise,
    quiz: script.quiz,
  };
  const body = `---\n${JSON.stringify(fm, null, 2)}\n---\n\n# ${script.title}\n`;
  const out = resolve(LESSONS_DIR, `${script.lessonId}.mdx`);
  writeFileSync(out, body);
  return out;
}

function markPublished(lessonId: string, patch: Record<string, unknown>) {
  const syllabus = JSON.parse(readFileSync(SYLLABUS, "utf8"));
  for (const ch of syllabus.chapters) {
    for (const l of ch.lessons) {
      if (l.id === lessonId) {
        l.status = "published";
        Object.assign(l, patch);
      }
    }
  }
  writeFileSync(SYLLABUS, JSON.stringify(syllabus, null, 2));
}

export async function publishLesson(lessonId: string) {
  const scriptPath = resolve(VTT_DIR, `${lessonId}.json`);
  const script = LessonScript.parse(JSON.parse(readFileSync(scriptPath, "utf8")));

  const mp4 = resolve(RENDER_DIR, `${lessonId}.mp4`);
  const vtt = resolve(VTT_DIR, `${lessonId}.en.vtt`);
  if (!existsSync(mp4)) throw new Error(`Missing render: ${mp4}`);
  if (!existsSync(vtt)) throw new Error(`Missing subtitles: ${vtt}`);

  const videoUrl = await putObject(`videos/${lessonId}.mp4`, readFileSync(mp4), "video/mp4");
  const vttUrl = await putObject(`subtitles/${lessonId}.en.vtt`, readFileSync(vtt), "text/vtt");
  const mdx = writeMdx(script, videoUrl, vttUrl);
  markPublished(lessonId, { video: videoUrl, vtt: vttUrl });

  console.log(`[publish] ${lessonId}\n  video: ${videoUrl}\n  vtt:   ${vttUrl}\n  mdx:   ${mdx}`);
  return { videoUrl, vttUrl, mdx };
}

// CLI: tsx publish.ts <lessonId>
if (import.meta.url === `file://${process.argv[1]}`) {
  const lessonId = process.argv[2];
  if (!lessonId) {
    console.error("usage: tsx publish.ts <lessonId>");
    process.exit(1);
  }
  publishLesson(lessonId).catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
}
