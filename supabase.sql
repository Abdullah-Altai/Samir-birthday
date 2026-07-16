create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  message text not null,
  emoji text default '🤍',
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Anyone can send messages"
on public.messages for insert
to anon
with check (true);

create policy "Anyone can read messages"
on public.messages for select
to anon
using (true);
