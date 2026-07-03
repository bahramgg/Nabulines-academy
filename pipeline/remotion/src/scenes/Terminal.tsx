import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Eyebrow } from "../components";

// Terminal simulator: types a command, then shows its real output (from verify.ts).
export const Terminal: React.FC<{ visual: { command?: string; output?: string } }> = ({ visual }) => {
  const frame = useCurrentFrame();
  const command = visual.command ?? "";
  const output = visual.output ?? "";
  const typed = Math.floor(interpolate(frame, [6, 45], [0, command.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const showOutput = frame > 52;
  const cursor = Math.floor(frame / 15) % 2 === 0 ? "▋" : " ";

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", padding: "0 160px" }}>
      <Eyebrow>Terminal</Eyebrow>
      <div
        style={{
          marginTop: 24,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          backgroundColor: theme.surface,
          overflow: "hidden",
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 32,
        }}
      >
        <div style={{ display: "flex", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${theme.border}` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", border: `1px solid ${theme.border}` }} />
          ))}
        </div>
        <div style={{ padding: 36, lineHeight: 1.5 }}>
          <div style={{ color: theme.text }}>
            <span style={{ color: theme.text3 }}>$ </span>
            {command.slice(0, typed)}
            {typed < command.length ? cursor : ""}
          </div>
          {showOutput && (
            <pre style={{ color: theme.text2, margin: "18px 0 0", whiteSpace: "pre-wrap" }}>{output}</pre>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
