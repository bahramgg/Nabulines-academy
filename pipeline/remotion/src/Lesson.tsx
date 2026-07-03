import React from "react";
import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { theme, sceneFrames } from "./theme";
import { Intro } from "./scenes/Intro";
import { Slide } from "./scenes/Slide";
import { Code } from "./scenes/Code";
import { Terminal } from "./scenes/Terminal";
import { Browser } from "./scenes/Browser";
import { Outro } from "./scenes/Outro";

export type Scene = {
  id: number;
  type: "intro" | "slide" | "code" | "terminal" | "browser" | "outro";
  narration: string;
  durationSec?: number;
  audioFile?: string; // path under remotion/public, set by tts.ts
  visual: Record<string, unknown>;
};

export type LessonScript = {
  lessonId: string;
  title: string;
  scenes: Scene[];
};

function renderScene(scene: Scene) {
  const v = scene.visual as never;
  switch (scene.type) {
    case "intro":
      return <Intro visual={v} />;
    case "slide":
      return <Slide visual={v} />;
    case "code":
      return <Code visual={v} />;
    case "terminal":
      return <Terminal visual={v} />;
    case "browser":
      return <Browser visual={v} />;
    case "outro":
      return <Outro visual={v} />;
    default:
      return null;
  }
}

// Props ARE the lesson script, so `--props=content/scripts/<id>.json` works
// with the script file directly (no wrapper object).
export const Lesson: React.FC<LessonScript> = (script) => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.sans }}>
      <Series>
        {script.scenes.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={sceneFrames(scene)}>
            {scene.audioFile ? <Audio src={staticFile(scene.audioFile)} /> : null}
            {renderScene(scene)}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
