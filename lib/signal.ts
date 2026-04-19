import { XMLParser } from "fast-xml-parser";

export type SignalPost = {
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

const FEED_URL = "https://medium.com/feed/@singhmankaran05";

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
    if (!res.ok) return [];

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

    return limit ? posts.slice(0, limit) : posts;
  } catch {
    return [];
  }
}
