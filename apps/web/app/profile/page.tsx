"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { allLessons, syllabus } from "@/lib/syllabus";
import { ProgressBar } from "@/components/ProgressStats";

export default function ProfilePage() {
  const { user, loading, profileName, updateName, updatePassword, signOut } = useAuth();
  const { completedIds, points } = useProgress();
  const router = useRouter();

  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [pw, setPw] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login/");
  }, [loading, user, router]);
  useEffect(() => {
    if (profileName) setName(profileName);
  }, [profileName]);

  const total = syllabus.meta.totalLessons;
  const done = completedIds.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const nextLesson = useMemo(() => {
    const doneSet = new Set(completedIds);
    return allLessons().find((x) => !doneSet.has(x.lesson.id)) ?? null;
  }, [completedIds]);

  if (loading || !user) {
    return <div className="mx-auto max-w-2xl px-5 py-20 text-center text-text-3">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <header className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="section-eyebrow mb-1">Your Profile</p>
          <h1 className="display text-2xl text-white sm:text-3xl">{profileName ?? "Builder"}</h1>
          <p className="mt-1 text-sm text-text-3">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut().then(() => router.push("/"))}
          className="btn-secondary shrink-0"
        >
          Sign out
        </button>
      </header>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="section-eyebrow mb-1">Points</p>
          <p className="display text-3xl text-white">{points}</p>
        </div>
        <div className="card p-5">
          <p className="section-eyebrow mb-1">Lessons</p>
          <p className="display text-3xl text-white">
            {done}
            <span className="text-lg text-text-3"> / {total}</span>
          </p>
        </div>
      </div>

      <div className="card mb-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="section-eyebrow">Progress</p>
          <p className="text-sm text-text-2">{pct}%</p>
        </div>
        <ProgressBar value={pct} />
      </div>

      {/* Next lesson */}
      <div className="mb-10">
        <p className="section-eyebrow mb-3">Continue learning</p>
        {nextLesson ? (
          <Link
            href={`/learn/${nextLesson.chapter.id}/${nextLesson.lesson.id}/`}
            className="card flex items-center justify-between gap-4 p-5"
          >
            <div className="min-w-0">
              <p className="text-xs text-text-3">
                Chapter {nextLesson.chapter.index} · Next up
              </p>
              <p className="truncate font-medium text-white">{nextLesson.lesson.title}</p>
            </div>
            <span className="btn-primary shrink-0">Watch →</span>
          </Link>
        ) : (
          <div className="card p-5 text-sm text-text-2">
            🎉 You&apos;ve completed every lesson. Legend.
          </div>
        )}
      </div>

      {/* Account settings */}
      <section className="mb-6">
        <h2 className="section-eyebrow mb-4">Account settings</h2>

        <div className="card mb-4 p-5">
          <label className="mb-2 block text-sm text-text-2">Display name</label>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="flex-1 rounded-btn border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:border-white/40"
            />
            <button
              type="button"
              onClick={async () => {
                setNameMsg(null);
                const { error } = await updateName(name.trim());
                setNameMsg(error ?? "Saved.");
              }}
              className="btn-primary shrink-0"
            >
              Save
            </button>
          </div>
          {nameMsg && <p className="mt-2 text-xs text-text-3">{nameMsg}</p>}
        </div>

        <div className="card p-5">
          <label className="mb-2 block text-sm text-text-2">New password</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={pw}
              minLength={6}
              placeholder="Min 6 characters"
              onChange={(e) => setPw(e.target.value)}
              className="flex-1 rounded-btn border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:border-white/40"
            />
            <button
              type="button"
              onClick={async () => {
                setPwMsg(null);
                if (pw.length < 6) return setPwMsg("At least 6 characters.");
                const { error } = await updatePassword(pw);
                setPwMsg(error ?? "Password updated.");
                if (!error) setPw("");
              }}
              className="btn-primary shrink-0"
            >
              Update
            </button>
          </div>
          {pwMsg && <p className="mt-2 text-xs text-text-3">{pwMsg}</p>}
        </div>
      </section>
    </div>
  );
}
