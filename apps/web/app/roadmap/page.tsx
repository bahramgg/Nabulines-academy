import type { Metadata } from "next";
import { chapters, syllabus } from "@/lib/syllabus";
import { RoadmapList } from "@/components/RoadmapList";
import { OverallProgress } from "@/components/ProgressStats";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "The full learning path — eight chapters from mindset to public launch.",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <header className="mb-10">
        <p className="section-eyebrow mb-2">The Roadmap</p>
        <h1 className="display text-3xl text-white sm:text-4xl">Your Path to Builder</h1>
        <p className="mt-3 max-w-xl text-text-2">
          {syllabus.meta.totalLessons} lessons across {syllabus.meta.totalChapters} chapters.
          Finish each lesson to unlock the next. Progress is saved on this device.
        </p>
      </header>

      <div className="mb-12 max-w-md">
        <OverallProgress total={syllabus.meta.totalLessons} />
      </div>

      <RoadmapList chapters={chapters} />
    </div>
  );
}
