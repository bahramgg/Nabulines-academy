"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";

// Unified progress: synced to Supabase when signed in, localStorage otherwise.
const LS_KEY = "nabulines-academy:progress:v2";

export type LessonProgress = { score: number };
type Map = Record<string, LessonProgress>;

type ProgressState = {
  completed: Map;
  loading: boolean;
  isCompleted: (lessonId: string) => boolean;
  points: number;
  completedIds: string[];
  complete: (lessonId: string, score: number) => Promise<void>;
};

const Ctx = createContext<ProgressState | null>(null);

function readLocal(): Map {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY) || "{}") as Map;
  } catch {
    return {};
  }
}
function writeLocal(m: Map) {
  window.localStorage.setItem(LS_KEY, JSON.stringify(m));
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [completed, setCompleted] = useState<Map>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    (async () => {
      setLoading(true);
      if (user) {
        const { data } = await supabase
          .from("progress")
          .select("lesson_id, quiz_score, completed")
          .eq("user_id", user.id)
          .eq("completed", true);
        if (!active) return;
        const map: Map = {};
        for (const row of data ?? []) map[row.lesson_id] = { score: row.quiz_score ?? 0 };
        // merge any local progress made before signing in
        const local = readLocal();
        for (const [id, v] of Object.entries(local)) {
          if (!map[id]) {
            map[id] = v;
            await supabase.from("progress").upsert({
              user_id: user.id,
              lesson_id: id,
              completed: true,
              quiz_score: v.score,
              quiz_passed: true,
            });
          }
        }
        setCompleted(map);
      } else {
        setCompleted(readLocal());
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const complete = useCallback(
    async (lessonId: string, score: number) => {
      setCompleted((prev) => {
        if (prev[lessonId]) return prev;
        const next = { ...prev, [lessonId]: { score } };
        if (!user) writeLocal(next);
        return next;
      });
      if (user) {
        await supabase.from("progress").upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          quiz_score: score,
          quiz_passed: true,
        });
      }
    },
    [user],
  );

  const completedIds = Object.keys(completed);
  const points = Object.values(completed).reduce((n, v) => n + (v.score || 0), 0);

  const value: ProgressState = {
    completed,
    loading,
    isCompleted: (id) => Boolean(completed[id]),
    points,
    completedIds,
    complete,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
