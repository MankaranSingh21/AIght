/**
 * Loads a Google Font as an ArrayBuffer suitable for passing to ImageResponse's
 * `fonts` option. Requests TTF format by spoofing an old Android UA — TTF is
 * what Satori (the engine behind next/og) actually supports.
 *
 * Returns null on any network failure so callers can fall back gracefully.
 */
export async function loadGoogleFont(
  family: string,
  weight: 400 | 700 = 700
): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
      {
        headers: {
          // Old Android UA → Google returns TTF (Satori-compatible)
          "User-Agent":
            "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0",
        },
      }
    ).then((r) => r.text());

    const url = css.match(/url\(([^)]+)\)/)?.[1];
    if (!url) return null;

    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}
