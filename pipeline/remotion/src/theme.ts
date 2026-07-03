// Same monochrome tokens as the website — video and site must feel like one
// product. No color enters here.
export const theme = {
  bg: "#000000",
  surface: "#0a0a0a",
  border: "rgba(255,255,255,0.12)",
  text: "#ffffff",
  text2: "#9ba1a6",
  text3: "#6b7280",
  // Display falls back to a techno-ish system stack until the licensed
  // nabulines.com font file is dropped in (see master plan, risk #5).
  display:
    'Michroma, "SF Mono", "Segoe UI", system-ui, sans-serif',
  sans: 'Inter, system-ui, -apple-system, sans-serif',
} as const;

export const FPS = 30;
export const WORDS_PER_SECOND = 2.5;

type SceneLike = { narration: string; durationSec?: number };

export function sceneFrames(scene: SceneLike): number {
  const words = scene.narration.trim().split(/\s+/).filter(Boolean).length;
  const sec = scene.durationSec ?? Math.max(1.5, words / WORDS_PER_SECOND);
  return Math.round(sec * FPS);
}

export function totalFrames(script: { scenes: SceneLike[] }): number {
  return script.scenes.reduce((n, s) => n + sceneFrames(s), 0);
}
