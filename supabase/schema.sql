-- Nabulines Academy — Supabase schema.
-- Run this once in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (idempotent).

-- ── Profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  handle text unique,
  created_at timestamptz default now()
);

-- ── Progress (one row per user per lesson) ──────────────────────────────────
create table if not exists public.progress (
  user_id uuid references auth.users on delete cascade,
  lesson_id text not null,
  completed boolean default false,
  quiz_score int default 0,
  quiz_passed boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "profiles are readable" on public.profiles;
create policy "profiles are readable" on public.profiles for select using (true);

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "manage own progress" on public.progress;
create policy "manage own progress" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Auto-create a profile on signup (handle = email local-part) ─────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, handle)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Public leaderboard (aggregated; no private rows exposed) ─────────────────
create or replace view public.leaderboard as
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
