// Mirrors the public.tools table in schema.sql
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
  related_concepts: string[];
  created_at: string;
  is_sponsored: boolean | null;
};
