"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function AuthMenu() {
  const { user, loading, signOut } = useAuth();
  if (loading) return <span className="w-16" />;

  if (!user) {
    return (
      <Link href="/login/" className="whitespace-nowrap rounded-btn px-3 py-2 text-sm text-text-2 transition-colors hover:text-white">
        Sign in
      </Link>
    );
  }

  const handle = user.email?.split("@")[0] ?? "you";
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-text-2 sm:inline">{handle}</span>
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-btn border border-border px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/5"
      >
        Sign out
      </button>
    </div>
  );
}
