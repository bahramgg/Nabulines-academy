"use client";

import Link from "next/link";
import type { Chapter } from "@/lib/syllabus";
import { useProgress } from "@/lib/progress";
import { ProgressBar } from "./ProgressStats";

// Sequential unlock: a lesson is available once the previous one is complete.
export function RoadmapList({ chapters }: { chapters: Chapter[] }) {
  const { completedIds } = useProgress();
  const done = new Set(completedIds);

  const flat = chapters.flatMap((c) => c.lessons.map((l) => l.id));
  const isUnlocked = (lessonId: string) => {
    const i = flat.indexOf(lessonId);
    if (i <= 0) return true;
    return done.has(flat[i - 1]);
  };

  return (
    <div className="flex flex-col gap-10">
      {chapters.map((chapter) => {
        const chDone = chapter.lessons.filter((l) => done.has(l.id)).length;
        const chPct = Math.round((chDone / chapter.lessons.length) * 100);
        return (
          <section key={chapter.id}>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <div>
                <p className="section-eyebrow mb-1">Chapter {chapter.index}</p>
                <h2 className="text-xl font-bold">{chapter.title}</h2>
                <p className="mt-1 text-sm text-text-2">{chapter.summary}</p>
              </div>
              <span className="shrink-0 text-sm text-text-3">
                {chDone}/{chapter.lessons.length}
              </span>
            </div>
            <div className="mb-5">
              <ProgressBar value={chPct} />
            </div>
            <ol className="flex flex-col gap-2">
              {chapter.lessons.map((lesson, i) => {
                const unlocked = isUnlocked(lesson.id);
                const complete = done.has(lesson.id);
                const inner = (
                  <div
                    className={`card flex items-center gap-4 p-4 ${
                      unlocked ? "" : "opacity-50"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs ${
                        complete
                          ? "border-white bg-white text-black"
                          : "border-border text-text-2"
                      }`}
                    >
                      {complete ? "✓" : `${chapter.index}.${i + 1}`}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{lesson.title}</p>
                      <p className="truncate text-sm text-text-3">{lesson.goal}</p>
                    </div>
                    <span className="shrink-0 text-xs text-text-3">
                      {unlocked ? (complete ? "Done" : "Start") : "Locked"}
                    </span>
                  </div>
                );
                return (
                  <li key={lesson.id}>
                    {unlocked ? (
                      <Link href={`/learn/${chapter.id}/${lesson.id}/`}>{inner}</Link>
                    ) : (
                      <div aria-disabled className="cursor-not-allowed">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
