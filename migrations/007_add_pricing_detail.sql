-- Feature 6: Honest pricing deep-dive
-- Shape: { free_tier: string, cliff: string, paid_monthly: string, last_verified: string }
ALTER TABLE tools ADD COLUMN IF NOT EXISTS pricing_detail jsonb;
