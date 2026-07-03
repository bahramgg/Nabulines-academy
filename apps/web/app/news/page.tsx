import type { Metadata } from "next";
import { news } from "@/lib/mock";

export const metadata: Metadata = {
  title: "News",
  description: "AI and vibe-coding news, every item with a builder's angle.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <header className="mb-10">
        <p className="section-eyebrow mb-2">The Signal</p>
        <h1 className="display text-3xl text-white sm:text-4xl">News for Builders</h1>
        <p className="mt-3 max-w-xl text-text-2">
          AI and vibe-coding moves fast. Every item here answers one question:
          why does it matter for what you&apos;re building?
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {news.map((item) => (
          <article key={item.slug} className="card p-6">
            <div className="mb-3 flex items-center gap-3 text-xs text-text-3">
              <span>{item.source}</span>
              <span>·</span>
              <time dateTime={item.date}>{item.date}</time>
            </div>
            <h2 className="mb-3 text-xl font-bold">{item.title}</h2>
            <p className="mb-4 leading-relaxed text-text-2">{item.whatHappened}</p>
            <div className="rounded-card border border-border p-4">
              <p className="section-eyebrow mb-2">Why it matters for builders</p>
              <p className="leading-relaxed text-white">{item.whyItMatters}</p>
            </div>
            <a
              href={item.sourceUrl}
              className="mt-4 inline-block text-sm text-text-2 hover:text-white"
            >
              Read the source →
            </a>
          </article>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-text-3">
        Sample feed · The News Agent publishes up to three fresh items a day.
      </p>
    </div>
  );
}
