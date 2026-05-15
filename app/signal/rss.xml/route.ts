import { EDITOR_POSTS, getSignalPosts, type SignalPost } from "@/lib/signal";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAbsoluteUrl(href: string): string {
  if (/^https?:\/\//i.test(href)) return href;
  return `${SITE_URL}${href.startsWith("/") ? href : `/${href}`}`;
}

function toRfc822(displayDate: string): string {
  const parsed = new Date(displayDate);
  if (!Number.isNaN(parsed.getTime())) return parsed.toUTCString();
  return new Date().toUTCString();
}

function renderItem(post: SignalPost): string {
  const link = toAbsoluteUrl(post.href);
  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `      <pubDate>${toRfc822(post.date)}</pubDate>`,
    `      <description>${escapeXml(post.excerpt)}</description>`,
    "    </item>",
  ].join("\n");
}

export async function GET(): Promise<Response> {
  const external = await getSignalPosts();

  // Editor posts first (canonical AIght content), then Medium feed.
  const items = [...EDITOR_POSTS, ...external];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AIght — Signal</title>
    <link>${SITE_URL}/signal</link>
    <atom:link href="${SITE_URL}/signal/rss.xml" rel="self" type="application/rss+xml" />
    <description>Honest writing about AI tools and what they mean. No hype, no sponsored takes.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.map(renderItem).join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
