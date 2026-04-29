ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS weaknesses text[] NOT NULL DEFAULT '{}';
