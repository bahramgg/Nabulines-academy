"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { EyeMark } from "@/components/StringArt";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await signIn(email, password);
      setBusy(false);
      if (error) setMsg(error);
      else router.push("/roadmap/");
      return;
    }
    const { error, session } = await signUp(email, password);
    setBusy(false);
    if (error) setMsg(error);
    else if (session) router.push("/roadmap/"); // confirmation off: signed in now
    else setMsg("Account created. Check your email to confirm, then sign in here.");
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-5 py-20">
      <EyeMark className="mb-6 h-10 w-10" />
      <h1 className="display mb-2 text-2xl text-white">
        {mode === "in" ? "Sign in" : "Create account"}
      </h1>
      <p className="mb-8 text-center text-sm text-text-2">
        Save your progress across devices and appear on the leaderboard.
      </p>

      <form onSubmit={submit} className="flex w-full flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-white/40"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-white/40"
        />
        <button type="submit" disabled={busy} className="btn-primary mt-1 disabled:opacity-60">
          {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>

      {msg && <p className="mt-4 text-center text-sm text-text-2">{msg}</p>}

      <button
        type="button"
        onClick={() => {
          setMode(mode === "in" ? "up" : "in");
          setMsg(null);
        }}
        className="mt-6 text-sm text-text-3 hover:text-white"
      >
        {mode === "in" ? "No account? Create one" : "Have an account? Sign in"}
      </button>
    </div>
  );
}
