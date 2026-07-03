"use client";

import { useEffect, useState } from "react";
import { readProgress } from "@/lib/progress";

export function useProgress() {
  const [state, setState] = useState({ completed: [] as string[], points: 0 });
  useEffect(() => {
    const sync = () => setState(readProgress());
    sync();
    window.addEventListener("nabulines-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("nabulines-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-white transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function OverallProgress({ total }: { total: number }) {
  const { completed, points } = useProgress();
  const done = completed.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="section-eyebrow mb-1">Your Progress</p>
          <p className="text-2xl font-bold">
            {done}
            <span className="text-text-3"> / {total} lessons</span>
          </p>
        </div>
        <p className="text-right text-sm text-text-2">
          {pct}% · {points} pts
        </p>
      </div>
      <ProgressBar value={pct} />
    </div>
  );
}
