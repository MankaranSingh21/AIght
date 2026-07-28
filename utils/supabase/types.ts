// Mirrors the public.tools table in schema.sql
export type ToolStatus = 'stable' | 'beta' | 'rising' | 'deprecated';

export type PricingDetail = {
  free_tier: string;
  cliff: string;
  paid_monthly: string;
  last_verified: string;
};

export type AlternativeEntry = {
  slug: string;
  reason: string;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  vibe_description: string | null;
  url: string | null;
  is_free: boolean;
  category: string | null;
  emoji: string;
  tags: string[];
  accent: string | null;
  video_url: string | null;
  learning_guide: string | null;
  // NOTE: `related_concepts` is deliberately absent. The column does not exist in
  // the database — PostgREST answers 42703 for it. Declaring it here is what let
  // three separate code paths query a phantom column with full type safety, each
  // swallowing the resulting error. The curated concept↔tool relation lives in
  // MDX frontmatter as `exemplar_tools` (see lib/learn.ts). Do not re-add this,
  // and do not run the schema.sql migration for it: that seeds display names
  // ('RAG') against slugs that are not in the table either.
  created_at: string;
  is_sponsored: boolean | null;
  weaknesses: string[];
  status: ToolStatus;
  deprecated_reason: string | null;
  pricing_detail: PricingDetail | null;
  alternatives: AlternativeEntry[];
  utility_score: number;
  privacy_score: number;
  speed_score: number;
  cost_score: number;
  transparency_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  is_open_source: boolean;
  updated_at: string;
  // Phase G: editorial columns. Backfilled from JSON; canonical source going forward.
  aights_take: string | null;
  replaces: string[] | null;
  fields: string[] | null;
  screenshots: string[] | null;
  human_note: { headline: string; body: string; essay: string } | null;
};

export type ToolSubmission = {
  id: string;
  tool_name: string;
  url: string;
  category: string | null;
  reason: string | null;
  pricing: string | null;
  open_source: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};
