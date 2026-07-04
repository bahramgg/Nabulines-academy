"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileName: string | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string; session: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  updateName: (name: string) => Promise<{ error?: string }>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfileName(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle();
    setProfileName(data?.display_name ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user.id);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      loadProfile(s?.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const value: AuthState = {
    user: session?.user ?? null,
    session,
    loading,
    profileName,
    async signUp(email, password, name) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/auth/confirm/` : undefined,
        },
      });
      return { error: error?.message, session: Boolean(data.session) };
    },
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message };
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async resetPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/reset/` : undefined,
      });
      return { error: error?.message };
    },
    async updatePassword(password) {
      const { error } = await supabase.auth.updateUser({ password });
      return { error: error?.message };
    },
    async updateName(name) {
      const uid = session?.user.id;
      if (!uid) return { error: "Not signed in" };
      const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", uid);
      if (!error) setProfileName(name);
      return { error: error?.message };
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
