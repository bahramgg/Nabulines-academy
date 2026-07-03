import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { StringArt, Eyebrow } from "../components";

export const Slide: React.FC<{ visual: { title?: string; bullets?: string[] } }> = ({ visual }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bullets = visual.bullets ?? [];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", padding: "0 180px" }}>
      <StringArt opacity={0.5} />
      <Eyebrow>Nabulines Academy</Eyebrow>
      <h2
        style={{
          fontFamily: theme.display,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: 76,
          color: theme.text,
          margin: "18px 0 48px",
          lineHeight: 1.1,
        }}
      >
        {visual.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {bullets.map((b, i) => {
          const delay = 8 + i * 10;
          const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
          const x = interpolate(s, [0, 1], [-40, 0]);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${x}px)` }}>
              <div style={{ width: 12, height: 12, backgroundColor: theme.text, borderRadius: 2 }} />
              <span style={{ fontFamily: theme.sans, fontSize: 40, color: theme.text2 }}>{b}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
