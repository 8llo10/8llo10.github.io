create table if not exists public.projects (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 subtitle text,
 description text not null,
 tags text[] default '{}',
 image_url text,
 live_url text,
 github_url text,
 featured boolean default false,
 sort_order integer default 0,
 created_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "projects are public" on public.projects for select using (true);
create policy "authenticated owner can insert" on public.projects for insert to authenticated with check (true);
create policy "authenticated owner can update" on public.projects for update to authenticated using (true) with check (true);
create policy "authenticated owner can delete" on public.projects for delete to authenticated using (true);
