-- Feature 7: Editorial alternatives
-- Shape: [{ slug: string, reason: string }]
ALTER TABLE tools ADD COLUMN IF NOT EXISTS alternatives jsonb NOT NULL DEFAULT '[]';
