import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "human");

export type HumanEssayMeta = {
  title: string;
  tagline: string;
  readTime: string;
  slug: string;
  publishedDate: string;
  lastUpdated?: string;
  related?: string[];
  author?: string;
};

export function getAllHumanEssays(): HumanEssayMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((filename) => {
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
        lastUpdated: data.lastUpdated as string | undefined,
        related: data.related as string[] | undefined,
        author: data.author as string | undefined,
      };
    });
}

export function getHumanEssaySource(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
