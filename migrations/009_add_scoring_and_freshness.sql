alter table public.tools
  add column if not exists utility_score integer default 0,
  add column if not exists privacy_score integer default 0,
  add column if not exists speed_score integer default 0,
  add column if not exists cost_score integer default 0,
  add column if not exists transparency_score integer default 0,
  add column if not exists risk_level text default 'Low', -- Low, Medium, High
  add column if not exists is_open_source boolean default false,
  add column if not exists updated_at timestamptz default now();

-- Update existing tools to have updated_at as created_at
update public.tools set updated_at = created_at where updated_at is null;
