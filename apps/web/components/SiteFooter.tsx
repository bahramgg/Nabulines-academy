import Link from "next/link";
import { EyeMark } from "./StringArt";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <EyeMark className="h-5 w-5 text-white" />
          <span className="display text-xs text-white">From Creator to Builder</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-3">
          <Link href="/roadmap/" className="hover:text-white">Roadmap</Link>
          <span>·</span>
          <Link href="/news/" className="hover:text-white">News</Link>
          <span>·</span>
          <Link href="/leaderboard/" className="hover:text-white">Leaderboard</Link>
          <span>·</span>
          <a href="https://nabulines.com" className="hover:text-white">nabulines.com</a>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-content px-5 py-4 text-xs text-text-3">
          © {"2026"} Nabulines Academy · Built in public · Every lesson under five minutes.
        </p>
      </div>
    </footer>
  );
}
