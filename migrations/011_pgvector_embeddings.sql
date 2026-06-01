-- Migration 011: pgvector + tool embeddings
-- Run in the Supabase SQL editor BEFORE running scripts/embed-tools.ts.
--
-- Adds:
--   1. pgvector extension (used by Supabase's vector module).
--   2. `tools.embedding vector(1536)` — OpenAI text-embedding-3-small dimension.
--   3. `match_tools_for_slug(query_slug, match_count)` — given a slug, returns
--      that tool's top-N nearest neighbours by cosine similarity, excluding
--      the tool itself and any deprecated tools.
--   4. An ivfflat index for fast nearest-neighbour search.
--
-- This is idempotent — safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- ivfflat index for cosine distance. The list count is a heuristic: roughly
-- sqrt(rows) is a good default. 8 lists works well at 60 rows; bump to ~50
-- once the catalog grows past a few thousand tools.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'tools_embedding_cosine_idx'
  ) THEN
    EXECUTE 'CREATE INDEX tools_embedding_cosine_idx ON public.tools '
         || 'USING ivfflat (embedding vector_cosine_ops) WITH (lists = 8)';
  END IF;
END $$;

-- Drop the existing function so we can re-create it cleanly with the new
-- return signature if the migration is re-run.
DROP FUNCTION IF EXISTS public.match_tools_for_slug(text, int);

CREATE OR REPLACE FUNCTION public.match_tools_for_slug(
  query_slug text,
  match_count int DEFAULT 4
)
RETURNS TABLE (
  slug text,
  name text,
  category text,
  vibe_description text,
  similarity float
)
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  q_embedding vector(1536);
BEGIN
  SELECT t.embedding INTO q_embedding
  FROM public.tools t
  WHERE t.slug = query_slug;

  IF q_embedding IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    t.slug,
    t.name,
    t.category,
    t.vibe_description,
    1 - (t.embedding <=> q_embedding) AS similarity
  FROM public.tools t
  WHERE
    t.slug <> query_slug
    AND t.embedding IS NOT NULL
    AND t.status <> 'deprecated'
  ORDER BY t.embedding <=> q_embedding ASC
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.match_tools_for_slug(text, int) TO anon, authenticated;
