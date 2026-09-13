import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import { XMLParser } from "fast-xml-parser";

export type SignalPost = {
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

// Native MDX-backed Signal posts live in `content/signal/`. Each file has
// frontmatter (title, slug, date, excerpt, tags, author, draft) + body.
// These render at `/signal/<slug>` and link from `/signal` above the
// Medium RSS feed.

const SIGNAL_DIR = path.join(process.cwd(), "content", "signal");

export type NativeSignalMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
};

function formatNativeDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/**
 * All native Signal posts, newest first, drafts excluded.
 * Wrapped in `cache` so multiple consumers (Signal index, sitemap, digest)
 * share the same disk read per request.
 */
export const getNativeSignalPosts = cache((): NativeSignalMeta[] => {
  if (!fs.existsSync(SIGNAL_DIR)) return [];
  return fs
    .readdirSync(SIGNAL_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(SIGNAL_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug: (data.slug as string | undefined) ?? filename.replace(/\.mdx$/, ""),
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string,
        tags: data.tags as string[] | undefined,
        author: data.author as string | undefined,
        draft: data.draft === true,
      };
    })
    .filter((p) => !p.draft && p.title && p.date && p.excerpt)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
});

/** Raw MDX source for a native Signal post, or `null` if not found / drafted. */
export function getNativeSignalSource(slug: string): string | null {
  const filePath = path.join(SIGNAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

/** Native posts mapped to the `SignalPost` card shape used on /signal index. */
export function getNativeSignalCards(): SignalPost[] {
  return getNativeSignalPosts().map((p) => ({
    date: formatNativeDate(p.date),
    title: p.title,
    excerpt: p.excerpt,
    href: `/signal/${p.slug}`,
  }));
}

const FEED_URL = "https://medium.com/feed/@singhmankaran05";

// Always-visible editorial posts from the editor — shown above RSS feed.
export const EDITOR_POSTS: SignalPost[] = [
  {
    date: "Apr 22, 2025",
    title: "Why context windows changed everything (and nobody talks about it)",
    excerpt:
      "The benchmark wars are loud. Context window size barely gets a headline. But the jump from 4k to 128k tokens is the single change that made AI assistants feel like colleagues instead of calculators — and it quietly rewrote what's possible with RAG, agents, and long-form reasoning.",
    href: "/learn/context-windows",
  },
  {
    date: "Apr 10, 2025",
    title: "The honest case for fine-tuning (and when it's the wrong answer)",
    excerpt:
      "Everyone recommends RAG first. That's usually right. But there's a specific class of problem — consistent tone, domain-specific jargon, structured output formats — where fine-tuning is the only tool that actually works. Here's how to tell which situation you're in before spending the budget.",
    href: "/learn/fine-tuning",
  },
  {
    date: "Mar 25, 2025",
    title: "MCP is the most underrated thing to happen to AI tooling this year",
    excerpt:
      "Model Context Protocol quietly solved the integration problem that was making AI agents painful to build. Not by being clever — by being boring. A single standard that any LLM and any tool can speak. The implications for how we build software are still unfolding.",
    href: "/learn/mcp",
  },
];

// Shown when the RSS feed is unavailable or returns no posts.
/*
 * There is deliberately no FALLBACK_POSTS array here any more.
 *
 * It held three hand-written entries — "What most AI tool reviews get wrong",
 * "The quiet shift happening in AI search", "On building things that resist
 * hype" — with invented excerpts, invented dates, and an href pointing at the
 * Medium *profile* rather than any article. No such posts exist. They rendered
 * under a "From Medium" heading on /signal, and were eligible to backfill the
 * homepage and /author/moon, as though they were published writing.
 *
 * On a site whose stated purpose is "the signal beneath the noise" that is the
 * one thing it cannot do. An empty feed is a true statement; a fabricated one
 * is not, and /signal already renders "Nothing published yet" for the empty
 * case.
 *
 * Note the feed itself is healthy: it returns 200 with six items. They are
 * personal writing (poetry, books, life) rather than AI, so isRelevant()
 * correctly filters them out. The empty result is accurate, not a failure.
 */

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(pubDate: string): string {
  try {
    return new Date(pubDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return pubDate;
  }
}

type RssItem = {
  title?: unknown;
  link?: unknown;
  pubDate?: unknown;
  description?: unknown;
  "content:encoded"?: unknown;
  category?: unknown;
};

// The Medium account also publishes personal essays (poetry, books, life).
// Only items tagged or titled with AI/tech terms belong in Signal; everything
// else is filtered out and the AI-themed fallbacks take over when nothing passes.
const RELEVANT_TERMS = [
  "ai",
  "artificial-intelligence",
  "artificial intelligence",
  "machine-learning",
  "machine learning",
  "llm",
  "gpt",
  "claude",
  "gemini",
  "agents",
  "agentic",
  "prompt",
  "rag",
  "mcp",
  "model",
  "tooling",
  "software",
  "tech",
  "technology",
  "developer",
  "programming",
];

const RELEVANT_TITLE_RE = new RegExp(
  `\\b(${RELEVANT_TERMS.map((t) => t.replace(/[- ]/g, "[- ]")).join("|")})\\b`,
  "i"
);

function isRelevant(item: RssItem): boolean {
  const rawCats = item.category ?? [];
  const cats = (Array.isArray(rawCats) ? rawCats : [rawCats]).map((c) =>
    String(c).toLowerCase()
  );
  return (
    cats.some((c) => RELEVANT_TERMS.includes(c)) ||
    RELEVANT_TITLE_RE.test(String(item.title ?? ""))
  );
}

export async function getSignalPosts(limit?: number): Promise<SignalPost[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return []; // feed unreachable — say nothing rather than invent

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const parsed = parser.parse(xml) as {
      rss?: { channel?: { item?: RssItem | RssItem[] } };
    };

    const raw = parsed?.rss?.channel?.item ?? [];
    const items: RssItem[] = (Array.isArray(raw) ? raw : [raw]).filter(isRelevant);

    const posts: SignalPost[] = items.map((item) => {
      const rawDescription =
        String(item["content:encoded"] ?? item.description ?? "");
      const text = stripHtml(rawDescription);
      const excerpt = text.length > 200 ? text.slice(0, 200).trimEnd() + "…" : text;

      return {
        date: formatDate(String(item.pubDate ?? "")),
        title: stripHtml(String(item.title ?? "Untitled")),
        excerpt,
        href: String(item.link ?? "#"),
      };
    });

    const result = limit ? posts.slice(0, limit) : posts;
    return result;
  } catch {
    return []; // parse/network failure — an empty feed is the honest answer
  }
}
