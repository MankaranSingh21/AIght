-- Run this in the Supabase SQL Editor if you already applied schema.sql.
-- Adds the emoji, tags, and accent columns to the tools table.

ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS emoji  TEXT        NOT NULL DEFAULT '🤖',
  ADD COLUMN IF NOT EXISTS tags   TEXT[]      NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS accent TEXT        NOT NULL DEFAULT 'moss';
