import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { StringArt, EyeMark, Eyebrow } from "../components";

export const Outro: React.FC<{ visual: { title?: string; subtitle?: string; next?: string } }> = ({ visual }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", alignItems: "center", gap: 26 }}>
      <StringArt />
      <div style={{ opacity: enter, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <EyeMark size={56} />
        {visual.title && <Eyebrow>{visual.title}</Eyebrow>}
        <h2
          style={{
            fontFamily: theme.display,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: 72,
            color: theme.text,
            margin: 0,
            textAlign: "center",
            maxWidth: 1400,
            lineHeight: 1.1,
          }}
        >
          {visual.subtitle}
        </h2>
        {visual.next && (
          <div
            style={{
              marginTop: 12,
              border: `1px solid ${theme.border}`,
              borderRadius: 14,
              padding: "16px 28px",
              fontFamily: theme.sans,
              fontSize: 28,
              color: theme.text2,
            }}
          >
            Next → {visual.next}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
