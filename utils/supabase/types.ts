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
};

// Mirrors the public.roadmaps table
export type Roadmap = {
  id: string;
  user_id: string;
  title: string;
  nodes_json: unknown;
  edges_json: unknown;
  is_public: boolean;
  created_at: string;
};
