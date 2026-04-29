import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "workflows");

export type WorkflowMeta = {
  title: string;
  tagline: string;
  readTime: string;
  outcome: string;
  tool_slugs: string[];
  slug: string;
};

export function getAllWorkflows(): WorkflowMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return {
      title:      data.title as string,
      tagline:    data.tagline as string,
      readTime:   data.readTime as string,
      outcome:    data.outcome as string,
      tool_slugs: (data.tool_slugs as string[]) ?? [],
      slug:       data.slug as string,
    };
  });
}

export function getWorkflowSource(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
