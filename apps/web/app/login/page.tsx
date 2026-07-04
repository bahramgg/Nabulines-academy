"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { EyeMark } from "@/components/StringArt";

type Mode = "in" | "up" | "forgot";

export default function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    if (mode === "forgot") {
      const { error } = await resetPassword(email);
      setBusy(false);
      setMsg(error ?? "Check your email for a link to reset your password.");
      return;
    }
    if (mode === "in") {
      const { error } = await signIn(email, password);
      setBusy(false);
      if (error) setMsg(error);
      else router.push("/profile/");
      return;
    }
    // sign up
    const { error, session } = await signUp(email, password, name.trim());
    setBusy(false);
    if (error) setMsg(error);
    else if (session) router.push("/profile/");
    else setMsg("Account created. Check your email to confirm, then sign in here.");
  }

  const title = mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Reset password";

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-5 py-20">
      <EyeMark className="mb-6 h-10 w-10" />
      <h1 className="display mb-2 text-2xl text-white">{title}</h1>
      <p className="mb-8 text-center text-sm text-text-2">
        {mode === "forgot"
          ? "Enter your email and we'll send a reset link."
          : "Save your progress, earn points, and appear on the leaderboard."}
      </p>

      <form onSubmit={submit} className="flex w-full flex-col gap-3">
        {mode === "up" && (
          <input
            type="text"
            required
            placeholder="Your name (shown on the leaderboard)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-white/40"
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-white/40"
        />
        {mode !== "forgot" && (
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-btn border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-white/40"
          />
        )}
        <button type="submit" disabled={busy} className="btn-primary mt-1 disabled:opacity-60">
          {busy ? "…" : title}
        </button>
      </form>

      {msg && <p className="mt-4 text-center text-sm text-text-2">{msg}</p>}

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        {mode === "in" && (
          <button type="button" onClick={() => { setMode("forgot"); setMsg(null); }} className="text-text-3 hover:text-white">
            Forgot your password?
          </button>
        )}
        <button
          type="button"
          onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }}
          className="text-text-3 hover:text-white"
        >
          {mode === "in" ? "No account? Create one" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
