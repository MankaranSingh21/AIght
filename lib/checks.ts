import rawChecks from "@/content/checks.json";
import type { LessonChoice } from "@/lib/lessons";

/**
 * Inline "knowledge check" questions appended to a concept article.
 *
 * One central JSON keyed by concept slug — same convention as
 * content/curriculum/tracks.json and content/paths/fields.json. The article
 * page passes the questions to the client <ConceptCheck> as props (so the
 * client never touches the filesystem), and the /review queue (Wave 3) reads
 * from the same bank. Reuses LessonChoice so the lesson player's CheckQuestion
 * renders them unchanged.
 *
 * A concept with no entry here simply renders no check — opt-in, never throws.
 */
export type ConceptCheckQuestion = {
  prompt: string;
  choices: LessonChoice[];
};

const BANK = rawChecks as Record<string, ConceptCheckQuestion[]>;

/** Questions for one concept, or null if none are authored yet. */
export function getChecks(slug: string): ConceptCheckQuestion[] | null {
  const qs = BANK[slug];
  return qs && qs.length > 0 ? qs : null;
}

/** Every concept slug that has at least one authored check. */
export function getAllCheckSlugs(): string[] {
  return Object.keys(BANK).filter((slug) => (BANK[slug]?.length ?? 0) > 0);
}

/** How many concepts have a check — the denominator on /you. */
export function getCheckCount(): number {
  return getAllCheckSlugs().length;
}
