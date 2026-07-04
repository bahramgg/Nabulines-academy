"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { EyeMark } from "@/components/StringArt";

// Arrived here from the password-reset email. Supabase establishes a recovery
// session from the link, so updating the password here works for real.
export default function ResetPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.hash.replace(/^#/, "") || window.location.search);
    const err = p.get("error_description") || p.get("error");
    if (err) setLinkError(err.replace(/\+/g, " "));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await updatePassword(password);
    setBusy(false);
    if (error) setMsg(error);
    else {
      setMsg("Password updated. Redirecting to sign in…");
      setTimeout(() => router.push("/login/"), 1200);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-5 py-20">
      <EyeMark className="mb-6 h-10 w-10" />
      <h1 className="display mb-2 text-2xl text-white">Set a new password</h1>

      {linkError ? (
        <>
          <p className="mb-8 mt-2 text-center text-sm text-text-2">
            {linkError}. The reset link may have expired.
          </p>
          <Link href="/login/" className="btn-primary">
            Request a new link
          </Link>
        </>
      ) : (
        <>
          <p className="mb-8 mt-2 text-center text-sm text-text-2">
            Choose a new password for your account.
          </p>
          <form onSubmit={submit} className="flex w-full flex-col gap-3">
            <input
              type="password"
              required
              minLength={6}
              placeholder="New password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-white/40"
            />
            <button type="submit" disabled={busy} className="btn-primary mt-1 disabled:opacity-60">
              {busy ? "…" : "Update password"}
            </button>
          </form>
          {msg && <p className="mt-4 text-center text-sm text-text-2">{msg}</p>}
        </>
      )}
    </div>
  );
}
