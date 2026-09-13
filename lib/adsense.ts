/**
 * AdSense publisher ID normalisation.
 *
 * Google shows the same account three different ways depending on where you
 * copy it from, and the two places it gets used want different forms:
 *
 *   ca-pub-6421542097279410   the ad script's `client` param, and data-ad-client
 *   pub-6421542097279410      ads.txt's seller field
 *
 * Naively prefixing breaks whichever form you did not anticipate — pasting the
 * `ca-pub-` form (what the AdSense snippet actually gives you) previously
 * produced `pub-ca-pub-...` in ads.txt. That file does not error; it just
 * silently fails to authorise Google as a seller, and demand quietly never
 * arrives. Normalise to the digits once, then build both forms from that.
 */

const RAW = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim();

/** Digits only, from any of the three forms Google hands out. */
function digitsOf(raw: string | undefined): string | null {
  if (!raw) return null;
  const d = raw.replace(/^ca-/i, "").replace(/^pub-/i, "");
  // A publisher ID is a run of digits. Anything else is a paste error, and a
  // malformed ads.txt is worse than an absent one — so treat it as unset.
  return /^\d{10,20}$/.test(d) ? d : null;
}

const DIGITS = digitsOf(RAW);

/** `ca-pub-…` — ad script `client` param and `data-ad-client`. Null when unset. */
export const ADSENSE_CLIENT = DIGITS ? `ca-pub-${DIGITS}` : null;

/** `pub-…` — the seller field in ads.txt. Null when unset. */
export const ADSENSE_PUBLISHER = DIGITS ? `pub-${DIGITS}` : null;
