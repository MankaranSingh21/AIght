/**
 * Returns a Clearbit logo URL for the given tool URL, or null if the URL
 * is missing or unparseable. Clearbit serves square PNGs at any size via
 * the ?size= query param — we let Next.js <Image> handle resizing.
 */
export function getToolLogoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    return `https://logo.clearbit.com/${hostname}`;
  } catch {
    return null;
  }
}
