/**
 * Deterministic "concept of the day" — a stable daily pick so returning
 * visitors get a fresh reason to read each day. Pure: same calendar day →
 * same concept, no storage, no randomness. Computed client-side so it tracks
 * the visitor's local midnight (and never goes stale on a cached page).
 */

/** Local-day index: increments at the visitor's midnight. */
export function dayNumber(date: Date = new Date()): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
}

/** The concept for the given day, or null if the list is empty. */
export function conceptOfDay<T>(concepts: T[], date: Date = new Date()): T | null {
  if (concepts.length === 0) return null;
  return concepts[dayNumber(date) % concepts.length];
}
