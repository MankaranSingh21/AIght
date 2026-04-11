-- ============================================================
-- AIght — Initial Database Schema
-- Run this in the Supabase SQL editor to bootstrap the project.
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tools ────────────────────────────────────────────────────────────────
-- Public catalogue of AI tools. Populated by the scraping pipeline
-- and curated by the Claude AI curation step before insert.

create table if not exists public.tools (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text not null unique,
  vibe_description text,                   -- the warm, one-line tagline shown on cards
  url              text,
  is_free          boolean not null default false,
  category         text,
  emoji            text not null default '🤖',
  tags             text[] not null default '{}',
  accent           text not null default 'moss',  -- "moss" | "amber" | "lavender"
  created_at       timestamptz not null default now()
);

-- Anyone can read tools (public discovery feed)
alter table public.tools enable row level security;

create policy "tools_public_read"
  on public.tools for select
  using (true);

-- Only service role can insert/update (scraping pipeline uses service key)
create policy "tools_service_write"
  on public.tools for all
  using (auth.role() = 'service_role');

-- ── Roadmaps ─────────────────────────────────────────────────────────────
-- Each user has one or more named roadmaps. The canvas state (nodes + edges)
-- is stored as JSONB so the React Flow graph can be saved and restored exactly.

create table if not exists public.roadmaps (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'My Roadmap',
  nodes_json  jsonb not null default '[]'::jsonb,
  edges_json  jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- Users can only see and modify their own roadmaps
alter table public.roadmaps enable row level security;

create policy "roadmaps_owner_select"
  on public.roadmaps for select
  using (auth.uid() = user_id);

create policy "roadmaps_owner_insert"
  on public.roadmaps for insert
  with check (auth.uid() = user_id);

create policy "roadmaps_owner_update"
  on public.roadmaps for update
  using (auth.uid() = user_id);

create policy "roadmaps_owner_delete"
  on public.roadmaps for delete
  using (auth.uid() = user_id);

-- ── Indexes ──────────────────────────────────────────────────────────────
create index if not exists tools_slug_idx      on public.tools (slug);
create index if not exists tools_category_idx  on public.tools (category);
create index if not exists roadmaps_user_idx   on public.roadmaps (user_id);
