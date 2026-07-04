"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LessonPlayer } from "./LessonPlayer";
import { Quiz, type QuizQuestion } from "./Quiz";
import { EyeMark } from "./StringArt";
import { useProgress } from "@/lib/progress";
import { useAuth } from "@/lib/auth";

type Next = { chapterId: string; lessonId: string; title: string } | null;

// Signed-in only: the video and quiz are gated behind login. Completing requires
// watching the video (>=90%) AND passing the quiz (>=60%), which unlocks the
// next lesson on the roadmap.
export function LessonView({
  lessonId,
  exercise,
  quiz,
  video,
  vtt,
  title,
  next,
}: {
  lessonId: string;
  exercise: string;
  quiz: QuizQuestion[];
  video?: string;
  vtt?: string;
  title: string;
  next: Next;
}) {
  const { user, loading } = useAuth();
  const { isCompleted, complete } = useProgress();
  const [watched, setWatched] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => setDone(isCompleted(lessonId)), [isCompleted, lessonId]);

  // Gate: must be signed in to watch.
  if (!loading && !user) {
    return (
      <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
        <EyeMark className="h-10 w-10" />
        <h2 className="display text-base text-white">Sign in to watch</h2>
        <p className="max-w-xs text-sm text-text-2">
          Create a free account to watch lessons, track your progress, and climb the
          leaderboard.
        </p>
        <Link href="/login/" className="btn-primary mt-1">
          Sign in — it&apos;s free
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="card aspect-video animate-pulse" />;
  }

  const hasQuiz = quiz.length > 0;
  const videoRequired = Boolean(video);
  const canComplete =
    !done && (!videoRequired || watched) && (!hasQuiz || result?.passed === true);

  return (
    <>
      <div className="mb-8">
        <LessonPlayer title={title} src={video} vtt={vtt} onWatched={() => setWatched(true)} />
      </div>

      <section className="mb-8 card p-5">
        <h2 className="section-eyebrow mb-2">Exercise</h2>
        <p className="leading-relaxed text-white">{exercise}</p>
      </section>

      {hasQuiz && (
        <section className="mb-8">
          <h2 className="section-eyebrow mb-4">Quick quiz — pass to continue</h2>
          <Quiz questions={quiz} onResult={setResult} />
        </section>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
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
          <Link href={`/learn/${next.chapterId}/${next.lessonId}/`} className="btn-secondary w-full sm:w-auto">
            Next lesson →
          </Link>
        ) : (
          <span className="text-sm text-text-3">
            {done ? "You've reached the end." : "Watch, then pass the quiz to continue."}
          </span>
        )}
      </div>
    </>
  );
}
