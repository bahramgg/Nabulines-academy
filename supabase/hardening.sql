-- Nabulines Academy — security hardening (run after schema.sql).
-- Clears the Supabase advisor warnings. Idempotent; safe to re-run.
-- SQL Editor → New query → paste → Run.

-- ── Profiles policies: evaluate auth.uid() once per query (perf) ─────────────
drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles
  for insert with check ((select auth.uid()) = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using ((select auth.uid()) = id);

-- ── Progress policies: public read (for the leaderboard), owner-only writes ──
drop policy if exists "manage own progress" on public.progress;

drop policy if exists "read progress" on public.progress;
create policy "read progress" on public.progress for select using (true);

drop policy if exists "insert own progress" on public.progress;
create policy "insert own progress" on public.progress
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "update own progress" on public.progress;
create policy "update own progress" on public.progress
  for update using ((select auth.uid()) = user_id);

-- ── Leaderboard: security_invoker view (clears the CRITICAL advisory) ────────
drop view if exists public.leaderboard;
create view public.leaderboard with (security_invoker = on) as
select
  p.handle,
  count(*) filter (where pr.completed) as lessons_done,
  coalesce(sum(pr.quiz_score) filter (where pr.completed), 0) as points
from public.profiles p
left join public.progress pr on pr.user_id = p.id
group by p.handle
having count(*) filter (where pr.completed) > 0
order by points desc;

grant select on public.leaderboard to anon, authenticated;

-- ── Lock down the signup trigger function (only the trigger needs it) ────────
revoke execute on function public.handle_new_user() from public, anon, authenticated;
