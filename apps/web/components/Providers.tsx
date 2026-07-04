"use client";

import { AuthProvider } from "@/lib/auth";
import { ProgressProvider } from "@/lib/progress";
import { ThemeProvider } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
