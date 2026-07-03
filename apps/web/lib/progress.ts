"use client";

// Client-side progress tracking. Phase 1 stores completion + quiz points in
// localStorage; a leaderboard / D1 backend comes later.

const KEY = "nabulines-academy:progress:v1";

export type Progress = {
  completed: string[]; // lesson ids
  points: number;
};

const empty: Progress = { completed: [], points: 0 };

export function readProgress(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Progress;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      points: typeof parsed.points === "number" ? parsed.points : 0,
    };
  } catch {
    return empty;
  }
}

export function writeProgress(p: Progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("nabulines-progress"));
}

export function isCompleted(lessonId: string): boolean {
  return readProgress().completed.includes(lessonId);
}

export function completeLesson(lessonId: string, points = 0) {
  const p = readProgress();
  if (p.completed.includes(lessonId)) return p;
  const next: Progress = {
    completed: [...p.completed, lessonId],
    points: p.points + points,
  };
  writeProgress(next);
  return next;
}

export function addPoints(points: number) {
  const p = readProgress();
  const next = { ...p, points: p.points + points };
  writeProgress(next);
  return next;
}

export function resetProgress() {
  writeProgress({ ...empty });
}
