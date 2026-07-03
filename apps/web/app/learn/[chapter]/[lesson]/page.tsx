import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allLessons,
  getLesson,
  lessonNeighbors,
} from "@/lib/syllabus";
import { LessonPlayer } from "@/components/LessonPlayer";
import { Quiz, type QuizQuestion } from "@/components/Quiz";
import { CompleteButton } from "@/components/CompleteButton";

export function generateStaticParams() {
  return allLessons().map(({ chapter, lesson }) => ({
    chapter: chapter.id,
    lesson: lesson.id,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { chapter: string; lesson: string };
}): Metadata {
  const found = getLesson(params.chapter, params.lesson);
  if (!found) return { title: "Lesson" };
  return { title: found.lesson.title, description: found.lesson.goal };
}

// Phase 1 placeholder quiz — real quizzes come from each lesson's script JSON.
function placeholderQuiz(goal: string): QuizQuestion[] {
  return [
    {
      q: "What's the single goal of this lesson?",
      options: [goal, "Memorize syntax you'll never use", "Nothing in particular"],
      answer: 0,
      points: 10,
    },
  ];
}

export default function LessonPage({
  params,
}: {
  params: { chapter: string; lesson: string };
}) {
  const found = getLesson(params.chapter, params.lesson);
  if (!found) notFound();
  const { chapter, lesson } = found;
  const { prev, next } = lessonNeighbors(lesson.id);
  const lessonNumber = `${chapter.index}.${chapter.lessons.findIndex((l) => l.id === lesson.id) + 1}`;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="mb-6 text-sm text-text-3">
        <Link href="/roadmap/" className="hover:text-white">
          Roadmap
        </Link>
        <span className="mx-2">/</span>
        <span>{chapter.title}</span>
      </nav>

      <header className="mb-8">
        <p className="section-eyebrow mb-2">Lesson {lessonNumber}</p>
        <h1 className="text-3xl font-bold leading-tight">{lesson.title}</h1>
        <p className="mt-3 text-lg text-text-2">{lesson.goal}</p>
      </header>

      <div className="mb-10">
        <LessonPlayer title={lesson.title} src={lesson.video} vtt={lesson.vtt} />
      </div>

      <section className="mb-10">
        <h2 className="section-eyebrow mb-3">What You&apos;ll Do</h2>
        <p className="leading-relaxed text-text-2">
          Full lesson notes render here once the script for this lesson is generated
          and approved. For now, focus on the goal above and the exercise below.
        </p>
      </section>

      <section className="mb-10 card p-6">
        <h2 className="section-eyebrow mb-3">Exercise</h2>
        <p className="leading-relaxed text-white">{lesson.exercise}</p>
      </section>

      <section className="mb-10">
        <h2 className="section-eyebrow mb-4">Quick Check</h2>
        <Quiz questions={placeholderQuiz(lesson.goal)} />
      </section>

      <div className="mb-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <CompleteButton lessonId={lesson.id} />
        {next ? (
          <Link
            href={`/learn/${next.chapter.id}/${next.lesson.id}/`}
            className="btn-secondary w-full sm:w-auto"
          >
            Next: {next.lesson.title} →
          </Link>
        ) : (
          <Link href="/leaderboard/" className="btn-secondary w-full sm:w-auto">
            See the Leaderboard →
          </Link>
        )}
      </div>

      <nav className="flex items-center justify-between text-sm text-text-3">
        {prev ? (
          <Link href={`/learn/${prev.chapter.id}/${prev.lesson.id}/`} className="hover:text-white">
            ← {prev.lesson.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
