import Link from "next/link";
import { StringArt, EyeMark } from "@/components/StringArt";
import { chapters } from "@/lib/syllabus";

const pillars = [
  {
    title: "Short and Focused",
    body: "Tight, no-filler videos, as long as a topic needs. Just the next thing you need to ship.",
  },
  {
    title: "Nothing Faked",
    body: "Every command and demo is really run and verified before it's published. If the code didn't work, the lesson doesn't exist.",
  },
  {
    title: "Creator to Builder",
    body: "Start with an audience and a phone. End up owning sites, apps, and tools you can sell, not just posts you rent.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <StringArt />
        <div className="relative mx-auto flex max-w-content flex-col items-center px-5 py-24 text-center sm:py-32">
          <EyeMark className="mb-7 h-11 w-11" />
          <h1
            className="display max-w-3xl text-[2.1rem] leading-[1.08] text-white sm:text-6xl"
            style={{ letterSpacing: "0.02em", wordSpacing: "-0.08em" }}
          >
            From Creator to Builder
          </h1>
          <p className="mt-6 max-w-md text-base text-text-2 sm:text-lg">
            Go from zero to shipping. No code required, just you and AI.
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto">
            <Link href="/roadmap/" className="btn-primary w-full sm:w-auto">
              Start Free
            </Link>
            <Link href="/roadmap/" className="btn-secondary w-full sm:w-auto">
              See the Roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-content px-5 py-24 sm:py-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="card p-6">
              <h3 className="display mb-3 text-sm text-white">{p.title}</h3>
              <p className="text-sm leading-relaxed text-text-2">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Path preview */}
      <section className="mx-auto max-w-content px-5 pb-24 sm:pb-28">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="section-eyebrow mb-2">The Path</p>
            <h2 className="text-2xl font-bold">Eight chapters, one destination</h2>
          </div>
          <Link href="/roadmap/" className="hidden text-sm text-text-2 hover:text-white sm:block">
            Open roadmap →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {chapters.map((c) => (
            <Link
              key={c.id}
              href="/roadmap/"
              className="card flex items-center gap-4 p-5"
            >
              <span className="display shrink-0 text-lg text-text-3">
                {String(c.index).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.title}</p>
                <p className="truncate text-sm text-text-3">{c.summary}</p>
              </div>
              <span className="shrink-0 text-xs text-text-3">
                {c.lessons.length}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <StringArt />
        <div className="relative mx-auto max-w-content px-5 py-24 text-center">
          <h2 className="display mx-auto max-w-2xl text-3xl text-white sm:text-4xl">
            What&apos;s the first thing you&apos;ll build?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-text-2">
            You&apos;re one tap from lesson one. The only thing between you and a live
            project is starting.
          </p>
          <Link href="/roadmap/" className="btn-primary mt-8">
            Start Chapter 0
          </Link>
        </div>
      </section>
    </>
  );
}
