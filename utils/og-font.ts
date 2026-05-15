/**
 * Loads a Google Font as an ArrayBuffer suitable for passing to ImageResponse's
 * `fonts` option. Satori (the engine behind next/og) only supports TTF/OTF —
 * woff2 fails with "Unsupported OpenType signature wOF2", EOT fails too.
 *
 * Trick: the legacy `fonts.googleapis.com/css` endpoint (not `css2`) plus a
 * Firefox-3-era UA gets Google to return a plain `.ttf` URL with
 * `format('truetype')`. Modern UAs always get woff2; the IE UA gets EOT.
 *
 * Returns null on any failure so callers fall back to system fonts.
 */
export async function loadGoogleFont(
  family: string,
  weight: 400 | 700 = 700
): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${weight}`,
      {
        headers: {
          // Firefox 3 supports @font-face but predates woff/woff2 → Google
          // returns a plain TTF kit URL with format('truetype').
          "User-Agent":
            "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7",
        },
      }
    ).then((r) => r.text());

    // Prefer an explicit TTF URL. If none, accept the first url().
    const ttfMatch = css.match(/url\(([^)]+\.ttf)\)/);
    const anyMatch = css.match(/url\(([^)]+)\)/);
    const url = ttfMatch?.[1] ?? anyMatch?.[1];
    if (!url) return null;

    // Defensive: skip non-TTF formats Satori can't parse.
    if (/\.(woff2?|eot)(\?|$)/i.test(url)) return null;

    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}
