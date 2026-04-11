-- Migration 004: Add public sharing to roadmaps
-- Run in Supabase SQL editor.

ALTER TABLE public.roadmaps
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Allow anyone (including anon) to read public roadmaps
DROP POLICY IF EXISTS "Anyone can view public roadmaps" ON public.roadmaps;

CREATE POLICY "Anyone can view public roadmaps"
  ON public.roadmaps FOR SELECT
  USING (is_public = true);
