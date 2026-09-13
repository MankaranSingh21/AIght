/**
 * ads.txt — the IAB authorised-sellers file.
 *
 * AdSense requires this to be reachable at the domain root before it will serve
 * reliably; without it, buyers cannot verify that this site authorises Google to
 * sell its inventory, and demand drops or disappears.
 *
 * Served from a route handler rather than public/ads.txt so the publisher ID
 * comes from an env var — the ID is not a secret, but hardcoding it means the
 * file silently says the wrong thing on forks and preview deploys.
 *
 * Returns 404 until NEXT_PUBLIC_ADSENSE_ID is set, which is the honest state:
 * an ads.txt naming no seller is worse than none at all.
 */
export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const pub = process.env.NEXT_PUBLIC_ADSENSE_ID; // e.g. pub-1234567890123456
  if (!pub) return new Response("Not found", { status: 404 });

  const id = pub.startsWith("pub-") ? pub : `pub-${pub}`;
  // f08c47fec0942fa0 is Google's fixed certification-authority ID.
  const body = `google.com, ${id}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
