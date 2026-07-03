"use client";

import { useState, useEffect } from "react";
import { completeLesson, isCompleted } from "@/lib/progress";

export function CompleteButton({
  lessonId,
  points = 10,
}: {
  lessonId: string;
  points?: number;
}) {
  const [done, setDone] = useState(false);
  useEffect(() => setDone(isCompleted(lessonId)), [lessonId]);

  return (
    <button
      type="button"
      disabled={done}
      onClick={() => {
        completeLesson(lessonId, points);
        setDone(true);
      }}
      className={done ? "btn-secondary w-full sm:w-auto" : "btn-primary w-full sm:w-auto"}
    >
      {done ? "✓ Completed" : "Mark Complete"}
    </button>
  );
}
