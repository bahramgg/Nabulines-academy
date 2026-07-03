"use client";

import { useState } from "react";
import { EyeMark } from "./StringArt";

// Phase 1: the video pipeline (Module 3) hasn't rendered lessons yet, so this
// shows the branded player shell with a subtitle toggle. Once R2 has the MP4 +
// VTT, pass real `src` / `vtt` and the same player streams it.
export function LessonPlayer({
  title,
  src,
  vtt,
}: {
  title: string;
  src?: string;
  vtt?: string;
}) {
  const [captions, setCaptions] = useState(true);

  return (
    <div className="overflow-hidden rounded-card border border-border">
      <div className="relative aspect-video bg-surface">
        {src ? (
          <video
            className="h-full w-full"
            controls
            playsInline
            poster="/poster.svg"
          >
            <source src={src} type="video/mp4" />
            {vtt && captions && (
              <track kind="subtitles" srcLang="en" label="English" src={vtt} default />
            )}
          </video>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <EyeMark className="h-10 w-10 text-white/70" />
            <p className="display text-xs text-text-2">Video rendering soon</p>
            <p className="max-w-xs px-6 text-xs text-text-3">
              This lesson&apos;s video is produced by the pipeline and lands here after
              Telegram approval.
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="truncate text-sm text-text-2">{title}</p>
        <button
          type="button"
          onClick={() => setCaptions((c) => !c)}
          className="rounded-btn border border-border px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/5"
          aria-pressed={captions}
        >
          Captions: {captions ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
