ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'stable',
  ADD COLUMN IF NOT EXISTS deprecated_reason text;

ALTER TABLE public.tools
  ADD CONSTRAINT tools_status_check
  CHECK (status IN ('stable', 'beta', 'rising', 'deprecated'));
