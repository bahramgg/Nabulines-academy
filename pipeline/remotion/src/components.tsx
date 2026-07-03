import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "./theme";

// Shared signature elements: string-art backdrop + eye/triangle mark.

export const StringArt: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const lines = 18;
  const w = 1920;
  const h = 1080;
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <g fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1}>
          {Array.from({ length: lines }).map((_, i) => {
            const t = i / (lines - 1);
            return <line key={`a${i}`} x1={t * w} y1={0} x2={0} y2={t * h} />;
          })}
          {Array.from({ length: lines }).map((_, i) => {
            const t = i / (lines - 1);
            return <line key={`b${i}`} x1={w - t * w} y1={0} x2={w} y2={t * h} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const EyeMark: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = theme.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round">
    <path d="M24 6 L42 40 L6 40 Z" />
    <ellipse cx="24" cy="30" rx="9" ry="6" />
    <circle cx="24" cy="30" r="2.4" fill={color} stroke="none" />
  </svg>
);

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: theme.display,
      textTransform: "uppercase",
      letterSpacing: "0.28em",
      fontSize: 22,
      color: theme.text2,
    }}
  >
    {children}
  </div>
);
