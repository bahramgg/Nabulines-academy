"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LessonPlayer } from "./LessonPlayer";
import { Quiz, type QuizQuestion } from "./Quiz";
import { useProgress } from "@/lib/progress";
import { useAuth } from "@/lib/auth";

type Next = { chapterId: string; lessonId: string; title: string } | null;

// Open access: anyone can watch the video and take the quiz without signing in.
// Progress is saved to localStorage for guests and synced to the account (and the
// leaderboard) once they sign in. Completing requires watching the video (>=90%)
// AND passing the quiz (>=60%), which unlocks the next lesson on the roadmap.
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

      {!user && (
        <p className="mt-4 text-center text-sm text-text-3">
          Watching as a guest — your progress is saved on this device.{" "}
          <Link href="/login/" className="text-white underline underline-offset-2">
            Sign in
          </Link>{" "}
          to sync it and join the leaderboard.
        </p>
      )}
    </>
  );
}
