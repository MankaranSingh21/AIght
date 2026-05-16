-- Migration 008 — Auth pivot
-- Adds user-owned tables so quiz results, bookmarks, and profiles can be
-- persisted across devices once a user signs in. Uses Supabase Auth's
-- built-in auth.users table (no separate users table needed).
--
-- Apply in: Supabase Studio → SQL Editor → New query → paste this whole file → Run.
-- Safe to re-run (uses IF NOT EXISTS).

-- ── profiles — display preferences (mostly empty for now, room to grow) ───────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  field_slug  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );


-- ── user_quiz_results — one row per user (latest result) ─────────────────────
CREATE TABLE IF NOT EXISTS public.user_quiz_results (
  user_id      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  taken_at     timestamptz NOT NULL DEFAULT now(),
  field_slug   text NOT NULL,
  field_name   text NOT NULL,
  role_title   text,
  score        int NOT NULL,
  category     text NOT NULL CHECK (category IN ('low','medium','high')),
  cognitive_profile           jsonb NOT NULL,
  recommended_concept_slugs   text[] NOT NULL DEFAULT '{}',
  recommended_tool_slugs      text[] NOT NULL DEFAULT '{}',
  recommended_human_essay_slugs text[] NOT NULL DEFAULT '{}'
);

ALTER TABLE public.user_quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own quiz result"   ON public.user_quiz_results;
DROP POLICY IF EXISTS "Users upsert own quiz result" ON public.user_quiz_results;
DROP POLICY IF EXISTS "Users delete own quiz result" ON public.user_quiz_results;

CREATE POLICY "Users read own quiz result"
  ON public.user_quiz_results FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users upsert own quiz result"
  ON public.user_quiz_results FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users update own quiz result"
  ON public.user_quiz_results FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users delete own quiz result"
  ON public.user_quiz_results FOR DELETE
  USING ( auth.uid() = user_id );


-- ── user_bookmarks — one row per (user, tool_slug) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug  text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tool_slug)
);

CREATE INDEX IF NOT EXISTS user_bookmarks_user_created_idx
  ON public.user_bookmarks (user_id, created_at DESC);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own bookmarks"   ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users insert own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users delete own bookmarks" ON public.user_bookmarks;

CREATE POLICY "Users read own bookmarks"
  ON public.user_bookmarks FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users insert own bookmarks"
  ON public.user_bookmarks FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users delete own bookmarks"
  ON public.user_bookmarks FOR DELETE
  USING ( auth.uid() = user_id );


-- ── handle_new_user trigger — creates an empty profile row on sign-up ────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NULL))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── Verification queries (paste into SQL editor after) ────────────────────────
-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' AND table_name IN
--   ('profiles','user_quiz_results','user_bookmarks');
--
-- SELECT pol.polname, pc.relname FROM pg_policies pol
--   JOIN pg_class pc ON pc.oid = pol.polrelid
--   WHERE pc.relname IN ('profiles','user_quiz_results','user_bookmarks');
