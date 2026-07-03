import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Eyebrow } from "../components";

// Typewriter code with line numbers + highlighted lines.
export const Code: React.FC<{
  visual: { language?: string; code?: string; highlightLines?: number[] };
}> = ({ visual }) => {
  const frame = useCurrentFrame();
  const code = visual.code ?? "";
  const highlight = new Set(visual.highlightLines ?? []);
  const chars = Math.floor(interpolate(frame, [6, 90], [0, code.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const shown = code.slice(0, chars);
  const lines = shown.split("\n");
  const totalLines = code.split("\n").length;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", padding: "0 160px" }}>
      <Eyebrow>{visual.language ?? "code"}</Eyebrow>
      <div
        style={{
          marginTop: 24,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          backgroundColor: theme.surface,
          padding: 40,
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 34,
          lineHeight: 1.5,
        }}
      >
        {Array.from({ length: totalLines }).map((_, i) => {
          const text = lines[i] ?? "";
          const on = highlight.has(i + 1);
          return (
            <div key={i} style={{ display: "flex", gap: 28, backgroundColor: on ? "rgba(255,255,255,0.06)" : "transparent", padding: "2px 8px", borderRadius: 6 }}>
              <span style={{ color: theme.text3, width: 40, textAlign: "right", userSelect: "none" }}>{i + 1}</span>
              <span style={{ color: on ? theme.text : theme.text2, whiteSpace: "pre-wrap" }}>{text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
