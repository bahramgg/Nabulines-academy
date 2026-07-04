-- Nabulines Academy — profile update (run after schema.sql + hardening.sql).
-- Adds a display name chosen at signup, used on the profile page and leaderboard.
-- SQL Editor → New query → paste → Run. Idempotent.

-- Display name (not unique; the handle stays for internal use)
alter table public.profiles add column if not exists display_name text;
update public.profiles set display_name = handle where display_name is null;

-- handle collisions must never break signup — drop its unique constraint
alter table public.profiles drop constraint if exists profiles_handle_key;

-- Signup trigger: take the name the user typed (user metadata), else email prefix
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, handle, display_name)
  values (
    new.id,
    split_part(new.email, '@', 1),
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Leaderboard shows the display name
drop view if exists public.leaderboard;
create view public.leaderboard with (security_invoker = on) as
select
  coalesce(nullif(p.display_name, ''), p.handle) as handle,
  count(*) filter (where pr.completed) as lessons_done,
  coalesce(sum(pr.quiz_score) filter (where pr.completed), 0) as points
from public.profiles p
left join public.progress pr on pr.user_id = p.id
group by p.id, p.display_name, p.handle
having count(*) filter (where pr.completed) > 0
order by points desc;
grant select on public.leaderboard to anon, authenticated;
