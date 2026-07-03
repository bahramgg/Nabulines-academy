"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { YourRank } from "@/components/YourRank";

type Row = { handle: string; lessons_done: number; points: number };

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    supabase
      .from("leaderboard")
      .select("handle, lessons_done, points")
      .order("points", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) setError(true);
        else setRows(data ?? []);
      });
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <header className="mb-10">
        <p className="section-eyebrow mb-2">The Community</p>
        <h1 className="display text-3xl text-white sm:text-4xl">Leaderboard</h1>
        <p className="mt-3 max-w-xl text-text-2">
          Points come from quizzes and finished lessons. Sign in and start learning to
          climb the board.
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
            {rows === null && !error && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-text-3">
                  Loading…
                </td>
              </tr>
            )}
            {rows?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-text-3">
                  No one on the board yet — be the first.
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-text-3">
                  Leaderboard isn&apos;t set up yet.
                </td>
              </tr>
            )}
            {rows?.map((row, i) => (
              <tr key={row.handle + i} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-text-3">{i + 1}</td>
                <td className="px-5 py-3 font-medium">{row.handle ?? "anon"}</td>
                <td className="px-5 py-3 text-right text-text-2">{row.lessons_done}</td>
                <td className="px-5 py-3 text-right font-bold">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
