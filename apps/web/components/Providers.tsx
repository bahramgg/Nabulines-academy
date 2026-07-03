"use client";

import { AuthProvider } from "@/lib/auth";
import { ProgressProvider } from "@/lib/progress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </AuthProvider>
  );
}
