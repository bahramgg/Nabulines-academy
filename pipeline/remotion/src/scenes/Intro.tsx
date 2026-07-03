import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { StringArt, EyeMark, Eyebrow } from "../components";

export const Intro: React.FC<{ visual: { title?: string; subtitle?: string } }> = ({ visual }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", alignItems: "center" }}>
      <StringArt />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 28, opacity: enter, transform: `translateY(${y}px)` }}>
        <EyeMark size={72} />
        {visual.subtitle && <Eyebrow>{visual.subtitle}</Eyebrow>}
        <h1
          style={{
            fontFamily: theme.display,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: 96,
            color: theme.text,
            margin: 0,
            textAlign: "center",
            maxWidth: 1400,
            lineHeight: 1.05,
          }}
        >
          {visual.title}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
