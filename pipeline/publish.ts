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

// Provider-agnostic S3 client. Works with any S3-compatible host — Cloudflare R2
// (needs a card), or the no-card options Filebase / Storj / Backblaze. Set
// S3_ENDPOINT to switch providers; falls back to R2 from R2_ACCOUNT_ID.
function s3Client() {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY (or R2_* equivalents) not set.");
  }
  const host =
    process.env.S3_ENDPOINT ??
    (process.env.R2_ACCOUNT_ID
      ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined);
  if (!host) throw new Error("Set S3_ENDPOINT (or R2_ACCOUNT_ID for Cloudflare R2).");

  const client = new AwsClient({ accessKeyId, secretAccessKey, region: "auto", service: "s3" });
  const bucket = process.env.S3_BUCKET ?? process.env.R2_BUCKET ?? "academy-videos";
  const endpoint = `${host.replace(/\/$/, "")}/${bucket}`;
  const publicBase = process.env.S3_PUBLIC_BASE ?? process.env.R2_PUBLIC_BASE ?? `${endpoint}`;
  return { client, endpoint, publicBase };
}

async function putObject(key: string, body: Buffer, contentType: string): Promise<string> {
  const { client, endpoint, publicBase } = s3Client();
  const res = await client.fetch(`${endpoint}/${key}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) throw new Error(`S3 PUT ${key} failed: ${res.status} ${(await res.text()).slice(0, 200)}`);

  // Filebase pins to IPFS and returns the object's CID; public playback is via
  // the IPFS gateway (the S3 path stays private). Other providers ignore this.
  const cid = res.headers.get("x-amz-meta-cid");
  const gateway = process.env.FILEBASE_GATEWAY;
  if (cid && gateway) return `${gateway.replace(/\/$/, "")}/${cid}`;
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
