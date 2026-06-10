/**
 * Single source of truth for site-wide stats.
 * Update `lastUpdated` whenever any stat changes.
 *
 * Verified counts (2026-06-10):
 *   tools    — confirmed by video seed script ("populate videos for all 60 tools")
 *   fields   — confirmed by counting /content/paths/fields.json entries (22, not 20)
 *   concepts — confirmed by ls content/learn/*.mdx | wc -l (59)
 */
export const STATS = {
  tools: 60,           // total curated tools
  fields: 22,          // field guide paths (content/paths/fields.json)
  concepts: 59,        // MDX concept articles (content/learn/*.mdx)
  affiliateLinks: 0,   // brand promise
  lastUpdated: '2026-06-10',
} as const;
