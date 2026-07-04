"use client";

import { useRef, useState } from "react";
import { EyeMark } from "./StringArt";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

// Branded player with caption toggle + YouTube-style playback speed control.
export function LessonPlayer({
  title,
  src,
  vtt,
  onWatched,
}: {
  title: string;
  src?: string;
  vtt?: string;
  onWatched?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [captions, setCaptions] = useState(true);
  const [speed, setSpeed] = useState(1);

  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  }

  return (
    <div className="overflow-hidden rounded-card border border-border">
      <div className="relative aspect-video bg-surface">
        {src ? (
          <video
            ref={videoRef}
            className="h-full w-full"
            controls
            playsInline
            poster="/poster.svg"
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration && v.currentTime / v.duration >= 0.9) onWatched?.();
            }}
            onEnded={() => onWatched?.()}
          >
            <source src={src} type="video/mp4" />
            {vtt && captions && (
              <track kind="subtitles" srcLang="en" label="English" src={vtt} default />
            )}
          </video>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <EyeMark className="h-10 w-10 opacity-70" />
            <p className="display text-xs text-text-2">Video coming soon</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <button
          type="button"
          onClick={cycleSpeed}
          disabled={!src}
          className="rounded-btn border border-border px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/5 disabled:opacity-40"
        >
          Speed {speed}×
        </button>
        <button
          type="button"
          onClick={() => setCaptions((c) => !c)}
          className="rounded-btn border border-border px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/5"
          aria-pressed={captions}
        >
          Captions {captions ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
