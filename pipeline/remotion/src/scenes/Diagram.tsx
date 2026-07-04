import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Eyebrow } from "../components";

// Schematic flow scene — used to EXPLAIN a process visually instead of
// performing it for real (e.g. paid steps: buy a domain, rent a VPS, upgrade a
// plan). No real action, no money spent: a labeled node flow with arrows.
export const Diagram: React.FC<{
  visual: { title?: string; nodes?: { label: string; sub?: string }[]; caption?: string };
}> = ({ visual }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nodes = visual.nodes ?? [];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", padding: "0 120px" }}>
      {visual.title && <Eyebrow>{visual.title}</Eyebrow>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 40, flexWrap: "wrap" }}>
        {nodes.map((node, i) => {
          const delay = i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
          const y = interpolate(s, [0, 1], [24, 0]);
          const arrow = spring({ frame: frame - delay + 6, fps, config: { damping: 200 } });
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div style={{ width: 70, textAlign: "center", opacity: arrow, color: theme.text2, fontSize: 40 }}>
                  →
                </div>
              )}
              <div
                style={{
                  opacity: s,
                  transform: `translateY(${y}px)`,
                  minWidth: 230,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 16,
                  background: theme.surface,
                  padding: "26px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: theme.sans, fontSize: 30, color: theme.text, fontWeight: 600 }}>
                  {node.label}
                </div>
                {node.sub && (
                  <div style={{ fontFamily: theme.sans, fontSize: 22, color: theme.text3, marginTop: 8 }}>
                    {node.sub}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {visual.caption && (
        <p style={{ marginTop: 44, textAlign: "center", fontFamily: theme.sans, fontSize: 28, color: theme.text2 }}>
          {visual.caption}
        </p>
      )}
    </AbsoluteFill>
  );
};
