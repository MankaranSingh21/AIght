-- Migration 007 — Phase G: tool content columns
-- Adds the four columns we've been seeding via JSON files so we can drop the
-- content/aights-take.json + content/tool-replaces.json + content/tool-human-notes.json
-- files once everything reads from the DB.
--
-- Apply in: Supabase Studio → SQL Editor → New query → paste this whole file → Run.
-- Safe to re-run (uses IF NOT EXISTS).

ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS aights_take TEXT,
  ADD COLUMN IF NOT EXISTS replaces JSONB,
  ADD COLUMN IF NOT EXISTS fields TEXT[],
  ADD COLUMN IF NOT EXISTS screenshots TEXT[],
  ADD COLUMN IF NOT EXISTS human_note JSONB;

-- Lightweight comments so future-you knows what these are.
COMMENT ON COLUMN public.tools.aights_take IS 'Author one-line verdict (Mankaran''s voice). ~14 words, rendered in Caveat font.';
COMMENT ON COLUMN public.tools.replaces    IS 'JSON array of strings: "You can probably stop using:" items.';
COMMENT ON COLUMN public.tools.fields      IS 'Field-compatibility tags (e.g. ["designers","researchers"]).';
COMMENT ON COLUMN public.tools.screenshots IS 'Public image URLs for the tool detail gallery.';
COMMENT ON COLUMN public.tools.human_note  IS 'JSON {"headline": string, "body": string, "essay": "taste"|"care"|"originality"|"context"}.';

-- Verification:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'tools' AND column_name IN
--   ('aights_take', 'replaces', 'fields', 'screenshots', 'human_note');
