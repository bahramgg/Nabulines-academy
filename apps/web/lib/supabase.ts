import { createClient } from "@supabase/supabase-js";

// Public client credentials — safe to ship to the browser. Overridable via env
// at deploy time; the fallbacks keep local builds working out of the box.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://mnetbcnhyxaoxvcacieu.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_RHI64OnEGbRqGlVhEyd8SA_x0YjJWVM";

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
