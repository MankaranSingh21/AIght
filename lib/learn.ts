import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "learn");

export type ConceptMeta = {
  title: string;
  tagline: string;
  readTime: string;
  slug: string;
  publishedDate: string;
  related?: string[];
  lastUpdated?: string;
  sources?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  author?: string;
  // Phase J — used by the per-concept mini-map and the misconception pills.
  prerequisites?: string[];    // concept slugs needed before this one
  successors?: string[];       // concepts that build on this one
  exemplar_tools?: string[];   // tool slugs that show this concept in action
  key_fields?: string[];       // field slugs where this matters most
  misconceptions?: string[];   // 1–3 short "wrong intuition" sentences
};

// Solo project — every article is by Mankaran unless the MDX overrides it.
export const DEFAULT_AUTHOR = {
  name: "Mankaran Singh",
  url: "/about",
  bio: "Independent. Reads AI papers at midnight, writes about what actually matters.",
};

export function getAllConcepts(): ConceptMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  return files.map((filename) => {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const stat = fs.statSync(filePath);
    return {
      title: data.title as string,
      tagline: data.tagline as string,
      readTime: data.readTime as string,
      slug: data.slug as string,
      publishedDate: (data.date as string | undefined) ?? stat.birthtime.toISOString(),
      related: data.related as string[] | undefined,
      lastUpdated: data.lastUpdated as string | undefined,
      sources: data.sources as number | undefined,
      difficulty: data.difficulty as ConceptMeta["difficulty"],
      author: data.author as string | undefined,
      prerequisites: data.prerequisites as string[] | undefined,
      successors: data.successors as string[] | undefined,
      exemplar_tools: data.exemplar_tools as string[] | undefined,
      key_fields: data.key_fields as string[] | undefined,
      misconceptions: data.misconceptions as string[] | undefined,
    };
  });
}

export function getConceptSource(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
