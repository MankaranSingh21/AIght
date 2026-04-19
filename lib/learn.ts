import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "learn");

export type ConceptMeta = {
  title: string;
  tagline: string;
  readTime: string;
  slug: string;
};

export function getAllConcepts(): ConceptMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return {
      title: data.title as string,
      tagline: data.tagline as string,
      readTime: data.readTime as string,
      slug: data.slug as string,
    };
  });
}

export function getConceptSource(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
