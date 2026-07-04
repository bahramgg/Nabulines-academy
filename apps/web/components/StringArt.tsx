// Signature curved-line pattern behind hero / CTA blocks — the string-art feel
// of nabulines.com. Pure SVG, 1px strokes at very low opacity, no color.

// Subtle ambient glow behind hero / CTA blocks — calm and monochrome, no busy
// lines. A soft light bloom from the top center that fades into the black.
export function StringArt({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, transparent 60%)",
      }}
    />
  );
}

// Brand logomark (white line-art on transparent), used across the site.
export function EyeMark({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="Nabulines Academy" className={className} />;
}
