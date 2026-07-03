// Signature curved-line pattern behind hero / CTA blocks — the string-art feel
// of nabulines.com. Pure SVG, 1px strokes at very low opacity, no color.

export function StringArt({ className = "" }: { className?: string }) {
  const lines = 18;
  const w = 1200;
  const h = 600;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1">
        {Array.from({ length: lines }).map((_, i) => {
          const t = i / (lines - 1);
          const x1 = t * w;
          const y2 = t * h;
          return <line key={`a${i}`} x1={x1} y1={0} x2={0} y2={y2} />;
        })}
        {Array.from({ length: lines }).map((_, i) => {
          const t = i / (lines - 1);
          const x1 = w - t * w;
          const y2 = t * h;
          return <line key={`b${i}`} x1={x1} y1={0} x2={w} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

// The 👁️⃤ eye/triangle motif, drawn so it matches the monochrome system.
export function EyeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M24 6 L42 40 L6 40 Z" />
      <ellipse cx="24" cy="30" rx="9" ry="6" />
      <circle cx="24" cy="30" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
