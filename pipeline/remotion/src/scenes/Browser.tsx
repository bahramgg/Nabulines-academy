import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { theme } from "../theme";

// Recorded Playwright demo inside a branded browser frame. Pass `captureVideo`
// (a path under public/) once capture.ts has produced the webm; otherwise a
// placeholder frame renders so the composition still previews.
export const Browser: React.FC<{ visual: { captureVideo?: string; caption?: string } }> = ({ visual }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", alignItems: "center", padding: 120 }}>
      <div style={{ width: "100%", maxWidth: 1560, border: `1px solid ${theme.border}`, borderRadius: 18, overflow: "hidden", backgroundColor: theme.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", borderBottom: `1px solid ${theme.border}` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", border: `1px solid ${theme.border}` }} />
          ))}
          <div style={{ marginLeft: 16, flex: 1, height: 34, borderRadius: 8, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", paddingLeft: 18, color: theme.text3, fontFamily: theme.sans, fontSize: 22 }}>
            localhost
          </div>
        </div>
        <div style={{ aspectRatio: "16 / 9", backgroundColor: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {visual.captureVideo ? (
            <OffthreadVideo src={staticFile(visual.captureVideo)} style={{ width: "100%", height: "100%" }} />
          ) : (
            <span style={{ fontFamily: theme.display, textTransform: "uppercase", letterSpacing: "0.2em", color: theme.text2, fontSize: 28 }}>
              live demo
            </span>
          )}
        </div>
      </div>
      {visual.caption && (
        <p style={{ marginTop: 28, fontFamily: theme.sans, fontSize: 30, color: theme.text2 }}>{visual.caption}</p>
      )}
    </AbsoluteFill>
  );
};
