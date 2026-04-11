-- Migration 003: Ensure roadmaps table exists with correct RLS
-- The table may already exist — this is idempotent.
-- Run in Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.roadmaps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT 'My Roadmap',
  nodes_json  jsonb NOT NULL DEFAULT '[]',
  edges_json  jsonb NOT NULL DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies so this script is re-runnable
DROP POLICY IF EXISTS "Users can view own roadmaps"   ON public.roadmaps;
DROP POLICY IF EXISTS "Users can insert own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can update own roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Users can delete own roadmaps" ON public.roadmaps;

CREATE POLICY "Users can view own roadmaps"
  ON public.roadmaps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmaps"
  ON public.roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps"
  ON public.roadmaps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmaps"
  ON public.roadmaps FOR DELETE
  USING (auth.uid() = user_id);
