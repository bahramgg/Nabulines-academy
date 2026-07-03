import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allLessons, getLesson, lessonNeighbors } from "@/lib/syllabus";
import { LessonView } from "@/components/LessonView";

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

      <LessonView
        lessonId={lesson.id}
        title={lesson.title}
        exercise={lesson.exercise}
        quiz={lesson.quiz ?? []}
        video={lesson.video}
        vtt={lesson.vtt}
        next={
          next
            ? { chapterId: next.chapter.id, lessonId: next.lesson.id, title: next.lesson.title }
            : null
        }
      />

      {prev && (
        <nav className="mt-10 border-t border-border pt-6 text-sm text-text-3">
          <Link
            href={`/learn/${prev.chapter.id}/${prev.lesson.id}/`}
            className="hover:text-white"
          >
            ← {prev.lesson.title}
          </Link>
        </nav>
      )}
    </div>
  );
}
