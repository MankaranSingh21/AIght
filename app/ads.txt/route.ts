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
import { ADSENSE_PUBLISHER } from "@/lib/adsense";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  // Normalised in lib/adsense.ts — this field needs the bare `pub-…` form, and
  // the ID Google gives you in the ad snippet is the `ca-pub-…` form.
  if (!ADSENSE_PUBLISHER) return new Response("Not found", { status: 404 });

  // f08c47fec0942fa0 is Google's fixed certification-authority ID.
  const body = `google.com, ${ADSENSE_PUBLISHER}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
