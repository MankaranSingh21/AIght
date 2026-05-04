create table if not exists public.tool_submissions (
  id uuid primary key default uuid_generate_v4(),
  tool_name text not null,
  url text not null,
  category text,
  reason text,
  pricing text,
  open_source boolean default false,
  status text default 'pending', -- pending, approved, rejected
  created_at timestamptz default now()
);

-- Row Level Security for submissions
alter table public.tool_submissions enable row level security;

-- Anyone can submit (public insert)
create policy "tool_submissions_public_insert"
  on public.tool_submissions for insert
  with check (true);

-- Only service role can read/write the list
create policy "tool_submissions_service_all"
  on public.tool_submissions for all
  using (auth.role() = 'service_role');
