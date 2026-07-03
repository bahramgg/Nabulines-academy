import type { Metadata } from "next";
import { leaderboard } from "@/lib/mock";
import { YourRank } from "@/components/YourRank";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Quiz points and completed projects across the Nabulines community.",
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <header className="mb-10">
        <p className="section-eyebrow mb-2">The Community</p>
        <h1 className="display text-3xl text-white sm:text-4xl">Leaderboard</h1>
        <p className="mt-3 max-w-xl text-text-2">
          Points come from quizzes and finished projects. Sample standings shown —
          the live board connects to the Nabulines community score system.
        </p>
      </header>

      <div className="mb-8">
        <YourRank />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-3">
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Builder</th>
              <th className="px-5 py-3 text-right font-medium">Lessons</th>
              <th className="px-5 py-3 text-right font-medium">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row) => (
              <tr key={row.rank} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-text-3">{row.rank}</td>
                <td className="px-5 py-3 font-medium">{row.handle}</td>
                <td className="px-5 py-3 text-right text-text-2">{row.lessonsDone}</td>
                <td className="px-5 py-3 text-right font-bold">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
