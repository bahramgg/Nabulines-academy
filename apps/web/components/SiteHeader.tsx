"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeMark } from "./StringArt";
import { AuthMenu } from "./AuthMenu";

const nav = [
  { href: "/roadmap/", label: "Roadmap" },
  { href: "/news/", label: "News" },
  { href: "/leaderboard/", label: "Leaderboard" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <EyeMark className="h-6 w-6 shrink-0" />
          <span className="display hidden truncate text-sm text-white sm:inline">
            Nabulines Academy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-btn px-3 py-2 text-sm text-text-2 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <span className="ml-2">
            <AuthMenu />
          </span>
        </nav>

        {/* Mobile: auth + hamburger */}
        <div className="flex items-center gap-1 sm:hidden">
          <AuthMenu />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-btn border border-border text-white"
          >
            <span className="text-lg leading-none">{open ? "✕" : "≡"}</span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-border bg-bg px-5 py-2 sm:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-btn px-2 py-3 text-sm text-text-2 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
