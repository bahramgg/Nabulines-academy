import React from "react";
import { Composition } from "remotion";
import { Lesson, type LessonScript } from "./Lesson";
import { FPS, totalFrames } from "./theme";
import defaultScript from "../../../content/scripts/ch0-l1.json";

// The single "Lesson" composition renders any script passed as input props:
//   remotion render src/index.ts Lesson out.mp4 --props=content/scripts/ch2-l1.json
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Lesson"
      component={Lesson}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ script: defaultScript as unknown as LessonScript }}
      calculateMetadata={({ props }) => ({
        durationInFrames: totalFrames(props.script as unknown as { scenes: { narration: string; durationSec?: number }[] }),
      })}
    />
  );
};
