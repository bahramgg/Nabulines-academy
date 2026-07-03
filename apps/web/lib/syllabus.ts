import data from "./syllabus.data.json";

export type Lesson = {
  id: string;
  title: string;
  goal: string;
  prerequisites: string[];
  maxWords: number;
  sceneHints: string[];
  exercise: string;
  status: "pending" | "scripted" | "rendered" | "verified" | "awaiting_approval" | "published";
  video?: string;
  vtt?: string;
};

export type Chapter = {
  id: string;
  index: number;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type Syllabus = {
  meta: {
    title: string;
    tagline: string;
    language: string;
    maxLessonSeconds: number;
    maxLessonWords: number;
    totalLessons: number;
    totalChapters: number;
  };
  chapters: Chapter[];
};

export const syllabus = data as Syllabus;

export const chapters = syllabus.chapters;

export function allLessons(): { chapter: Chapter; lesson: Lesson; order: number }[] {
  const out: { chapter: Chapter; lesson: Lesson; order: number }[] = [];
  let order = 0;
  for (const chapter of chapters) {
    for (const lesson of chapter.lessons) {
      out.push({ chapter, lesson, order: order++ });
    }
  }
  return out;
}

export function getChapter(chapterId: string): Chapter | undefined {
  return chapters.find((c) => c.id === chapterId);
}

export function getLesson(chapterId: string, lessonId: string): { chapter: Chapter; lesson: Lesson } | undefined {
  const chapter = getChapter(chapterId);
  const lesson = chapter?.lessons.find((l) => l.id === lessonId);
  if (!chapter || !lesson) return undefined;
  return { chapter, lesson };
}

export function lessonNeighbors(lessonId: string) {
  const flat = allLessons();
  const i = flat.findIndex((x) => x.lesson.id === lessonId);
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  };
}
