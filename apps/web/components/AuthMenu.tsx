"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function AuthMenu() {
  const { user, loading, profileName } = useAuth();
  if (loading) return <span className="w-12" />;

  if (!user) {
    return (
      <Link
        href="/login/"
        className="whitespace-nowrap rounded-btn px-3 py-2 text-sm text-text-2 transition-colors hover:text-white"
      >
        Sign in
      </Link>
    );
  }

  const label = profileName || user.email?.split("@")[0] || "Profile";
  return (
    <Link
      href="/profile/"
      className="max-w-[120px] truncate whitespace-nowrap rounded-btn border border-border px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/5"
    >
      {label}
    </Link>
  );
}
