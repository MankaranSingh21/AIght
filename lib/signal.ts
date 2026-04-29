import { XMLParser } from "fast-xml-parser";

export type SignalPost = {
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

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
const FALLBACK_POSTS: SignalPost[] = [
  {
    date: "Apr 14, 2025",
    title: "What most AI tool reviews get wrong",
    excerpt:
      "The benchmark charts are real. The pricing pages are accurate. But neither tells you what it actually feels like to use something every day — what breaks first, what you stop trusting.",
    href: "https://medium.com/@singhmankaran05",
  },
  {
    date: "Mar 28, 2025",
    title: "The quiet shift happening in AI search",
    excerpt:
      "Something changed in how AI tools handle ambiguous queries. It's not the models getting smarter. It's the retrieval layer that's doing something different — and most people haven't noticed yet.",
    href: "https://medium.com/@singhmankaran05",
  },
  {
    date: "Mar 12, 2025",
    title: "On building things that resist hype",
    excerpt:
      "There's a version of every AI story that ends with productivity gains and seamless integration. That version is almost never the honest one. Here's what the honest version looks like.",
    href: "https://medium.com/@singhmankaran05",
  },
];

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
};

export async function getSignalPosts(limit?: number): Promise<SignalPost[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return limit ? FALLBACK_POSTS.slice(0, limit) : FALLBACK_POSTS;

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const parsed = parser.parse(xml) as {
      rss?: { channel?: { item?: RssItem | RssItem[] } };
    };

    const raw = parsed?.rss?.channel?.item ?? [];
    const items: RssItem[] = Array.isArray(raw) ? raw : [raw];

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
    return result.length > 0 ? result : (limit ? FALLBACK_POSTS.slice(0, limit) : FALLBACK_POSTS);
  } catch {
    return limit ? FALLBACK_POSTS.slice(0, limit) : FALLBACK_POSTS;
  }
}
