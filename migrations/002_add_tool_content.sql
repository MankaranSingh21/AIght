-- Migration 002: Add rich content fields to tools
-- Run this against your Supabase project via the SQL editor.

ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS video_url     TEXT,
  ADD COLUMN IF NOT EXISTS learning_guide TEXT;
