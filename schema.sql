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

-- ── Subscribers ──────────────────────────────────────────────────────────
-- Newsletter subscribers. Email is the only field we collect.

create table if not exists public.subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- Anyone can subscribe (anon key allowed for inserts)
create policy "subscribers_public_insert"
  on public.subscribers for insert
  with check (true);

-- Only service role can read the list
create policy "subscribers_service_read"
  on public.subscribers for select
  using (auth.role() = 'service_role');

-- ── Indexes ──────────────────────────────────────────────────────────────
create index if not exists tools_slug_idx        on public.tools (slug);
create index if not exists tools_category_idx    on public.tools (category);
create index if not exists roadmaps_user_idx     on public.roadmaps (user_id);
create index if not exists subscribers_email_idx on public.subscribers (email);

-- ── Migration: related_concepts ──────────────────────────────────────────
-- Run in Supabase SQL editor to add the related_concepts column.

alter table public.tools
  add column if not exists related_concepts text[] not null default '{}';

-- ── Seed: related_concepts ────────────────────────────────────────────────
-- Maps each tool to concepts from: RAG, MCP, Agents, Embeddings,
-- Transformers, Fine-tuning. Run after the ALTER TABLE above.

-- Research tools (RAG + semantic search)
update public.tools set related_concepts = array['RAG','Embeddings'] where slug = 'notebooklm';
update public.tools set related_concepts = array['RAG','Embeddings'] where slug = 'perplexity';
update public.tools set related_concepts = array['RAG','Embeddings'] where slug = 'elicit';
update public.tools set related_concepts = array['RAG']             where slug = 'humata';
update public.tools set related_concepts = array['RAG','Embeddings'] where slug = 'scholarai';
update public.tools set related_concepts = array['RAG','Embeddings'] where slug = 'consensus';
update public.tools set related_concepts = array['RAG','Embeddings'] where slug = 'researchrabbit';
update public.tools set related_concepts = array['RAG','Embeddings'] where slug = 'scispace';

-- Dev tools (coding agents with codebase context = RAG + Agents)
update public.tools set related_concepts = array['RAG','Agents']    where slug = 'cursor-3';
update public.tools set related_concepts = array['RAG','Agents']    where slug = 'windsurf';
update public.tools set related_concepts = array['RAG','Agents']    where slug = 'aider';
update public.tools set related_concepts = array['Agents']          where slug = 'bolt-new';
update public.tools set related_concepts = array['Agents']          where slug = 'lovable';
update public.tools set related_concepts = array['Agents']          where slug = 'replit-agent';
update public.tools set related_concepts = array['Agents','MCP']    where slug = 'windsurf';

-- AI Chat (transformer-based models with agent capabilities)
update public.tools set related_concepts = array['Transformers','Agents']               where slug = 'claude-4-6';
update public.tools set related_concepts = array['Transformers','Agents','Fine-tuning'] where slug = 'chatgpt-5-4';
update public.tools set related_concepts = array['Transformers','Agents']               where slug = 'grok-4-1';

-- Image generation (diffusion transformers, some with fine-tuning)
update public.tools set related_concepts = array['Transformers']               where slug = 'ideogram-3-0';
update public.tools set related_concepts = array['Transformers']               where slug = 'flux-2';
update public.tools set related_concepts = array['Transformers','Fine-tuning'] where slug = 'leonardo-ai';
update public.tools set related_concepts = array['Transformers']               where slug = 'recraft-v3';
