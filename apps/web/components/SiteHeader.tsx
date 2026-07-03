import Link from "next/link";
import { EyeMark } from "./StringArt";

const nav = [
  { href: "/roadmap/", label: "Roadmap" },
  { href: "/news/", label: "News" },
  { href: "/leaderboard/", label: "Leaderboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <EyeMark className="h-6 w-6 text-white" />
          <span className="display text-sm text-white">Nabulines Academy</span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-btn px-3 py-2 text-sm text-text-2 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/roadmap/" className="btn-primary ml-2 hidden sm:inline-flex">
            Start Free
          </Link>
        </nav>
      </div>
    </header>
  );
}
