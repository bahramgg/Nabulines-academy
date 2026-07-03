"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LessonPlayer } from "./LessonPlayer";
import { Quiz, type QuizQuestion } from "./Quiz";
import { useProgress } from "@/lib/progress";
import { useAuth } from "@/lib/auth";

type Next = { chapterId: string; lessonId: string; title: string } | null;

// Real gating: the "Complete" button unlocks only after the video is watched
// (>=90%) AND the quiz is passed (>=60%). Completing writes progress (to
// Supabase when signed in), which unlocks the next lesson on the roadmap.
export function LessonView({
  lessonId,
  title,
  exercise,
  quiz,
  video,
  vtt,
  next,
}: {
  lessonId: string;
  title: string;
  exercise: string;
  quiz: QuizQuestion[];
  video?: string;
  vtt?: string;
  next: Next;
}) {
  const { user } = useAuth();
  const { isCompleted, complete } = useProgress();
  const [watched, setWatched] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => setDone(isCompleted(lessonId)), [isCompleted, lessonId]);

  const hasQuiz = quiz.length > 0;
  const videoRequired = Boolean(video);
  const canComplete =
    !done && (!videoRequired || watched) && (!hasQuiz || result?.passed === true);

  return (
    <>
      <div className="mb-10">
        <LessonPlayer title={title} src={video} vtt={vtt} onWatched={() => setWatched(true)} />
      </div>

      <section className="mb-10 card p-6">
        <h2 className="section-eyebrow mb-3">Exercise</h2>
        <p className="leading-relaxed text-white">{exercise}</p>
      </section>

      {hasQuiz && (
        <section className="mb-10">
          <h2 className="section-eyebrow mb-4">Quiz — pass to unlock the next lesson</h2>
          <Quiz questions={quiz} onResult={setResult} />
        </section>
      )}

      <div className="mb-6 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={!canComplete}
          onClick={() => {
            complete(lessonId, result?.score ?? 0);
            setDone(true);
          }}
          className={`w-full sm:w-auto ${done || canComplete ? "btn-primary" : "btn-secondary cursor-not-allowed opacity-60"}`}
        >
          {done ? "✓ Completed" : "Mark Complete"}
        </button>

        {done && next ? (
          <Link
            href={`/learn/${next.chapterId}/${next.lessonId}/`}
            className="btn-secondary w-full sm:w-auto"
          >
            Next: {next.title} →
          </Link>
        ) : (
          <span className="text-sm text-text-3">
            {done ? "You've reached the end." : "Watch the video and pass the quiz to continue."}
          </span>
        )}
      </div>

      {!user && (
        <p className="text-xs text-text-3">
          <Link href="/login/" className="underline hover:text-white">
            Sign in
          </Link>{" "}
          to save your progress across devices and appear on the leaderboard.
        </p>
      )}
    </>
  );
}
