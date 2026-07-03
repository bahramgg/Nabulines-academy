"use client";

import { useProgress } from "@/lib/progress";
import { syllabus } from "@/lib/syllabus";

export function YourRank() {
  const { completedIds, points } = useProgress();
  return (
    <div className="card flex items-center justify-between p-5">
      <div>
        <p className="section-eyebrow mb-1">You</p>
        <p className="text-sm text-text-2">
          {completedIds.length} / {syllabus.meta.totalLessons} lessons complete
        </p>
      </div>
      <p className="display text-2xl text-white">{points} pts</p>
    </div>
  );
}
