"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
      className="flex h-9 w-9 items-center justify-center rounded-btn border border-border text-sm text-text-2 transition-colors hover:text-white"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
