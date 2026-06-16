/**
 * Rule-based "what to read next" — Wave 4. Deterministic graph logic over the
 * concept prerequisites/successors frontmatter + the reader's localStorage
 * history. No AI, no network (design rule: nothing AI-generated on the
 * frontend). Pure functions so the server can hand the graph to a client
 * component that intersects it with progress.
 */

export type GraphConcept = {
  slug: string;
  title: string;
  tagline: string;
  group: string;
  readTime: string;
  hasLesson: boolean;
  prerequisites: string[];
  successors: string[];
};

/**
 * Rank unread concepts by readiness + relevance to what the reader has already
 * read. Signals, strongest first:
 *   +5   it's a declared successor of something they've read ("what comes next")
 *   +3   all its prerequisites are met (they're ready for it)
 *   +1   per individual prerequisite met (partial readiness / adjacency)
 *   +0.5 same group as something they've read (soft topical relevance)
 * Ties keep source order (alphabetical within group, per getAllConcepts). The
 * frontmatter graph is sparse, so the soft signal + a final entry-point
 * backfill keep the module from ever looking half-empty. Returns [] for a
 * reader with no history — the caller renders nothing, leaving the curated
 * first-visit layout untouched.
 */
export function recommendNext(
  concepts: GraphConcept[],
  readSlugs: Set<string>,
  limit = 3
): GraphConcept[] {
  if (readSlugs.size === 0) return [];

  const unread = concepts.filter((c) => !readSlugs.has(c.slug));
  if (unread.length === 0) return [];

  // Every concept a read concept points to as its next step, and every group
  // the reader has touched.
  const successorOfRead = new Set<string>();
  const readGroups = new Set<string>();
  for (const c of concepts) {
    if (!readSlugs.has(c.slug)) continue;
    readGroups.add(c.group);
    for (const s of c.successors) successorOfRead.add(s);
  }

  const ranked = unread
    .map((c, i) => {
      const prereqMet = c.prerequisites.filter((p) => readSlugs.has(p)).length;
      const allMet = c.prerequisites.length > 0 && prereqMet === c.prerequisites.length;
      let score = 0;
      if (successorOfRead.has(c.slug)) score += 5;
      if (allMet) score += 3;
      score += prereqMet;
      if (score === 0 && readGroups.has(c.group)) score += 0.5;
      return { c, score, i };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((s) => s.c);

  if (ranked.length >= limit) return ranked.slice(0, limit);

  // Backfill to `limit`: entry points (approachable) first, then anything else
  // unread. Keeps source order, no duplicates.
  const picked = new Set(ranked.map((c) => c.slug));
  const backfill = [
    ...unread.filter((c) => !picked.has(c.slug) && c.prerequisites.length === 0),
    ...unread.filter((c) => !picked.has(c.slug) && c.prerequisites.length > 0),
  ];
  for (const c of backfill) {
    if (ranked.length >= limit) break;
    ranked.push(c);
    picked.add(c.slug);
  }
  return ranked.slice(0, limit);
}
