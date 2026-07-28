// Pure topology for the /learn/map universe. No React, no DOM, no coordinates.
//
// Layout lives in lib/universe-layout.ts. Keeping the two apart means the graph
// can be reasoned about (and its edges counted) without dragging in trigonometry,
// and a future breakpoint-specific layout is one call site rather than a rewrite.
//
// Every edge here comes from hand-curated content. Nothing is inferred from prose.
// The previous version guessed field→concept edges with a keyword ladder that
// ended in `return "rag"` as a catch-all, so unmatched fields silently wired to
// RAG and only ~9 of 59 concepts were reachable. All four curated sources below
// already existed in the repo; none of them were being used by this graph.

import fields from "@/content/paths/fields.json";
import fieldConceptPaths from "@/content/paths/field-concept-paths.json";
import { getAllConcepts } from "@/lib/learn";
import { createPublicClient } from "@/utils/supabase/public";
import { FIELD_TOOL_MAP } from "@/lib/field-tool-map";

// ── Types ────────────────────────────────────────────────────────────────

export type UniverseNodeKind = "field" | "concept" | "tool";

export interface UniverseNode {
  id: string; // unique across kinds, prefixed by kind
  kind: UniverseNodeKind;
  slug: string;
  title: string;
  href: string;
  /** Concept group (drives ring radius) — concepts only. */
  group?: string;
  /** Tool category (drives the outer-ring arc) — tools only. */
  category?: string;
  /** Field difficulty (Easy/Medium/Hard), for tint — fields only. */
  difficulty?: string;
  tagline?: string;
}

export type UniverseEdgeSource =
  | "field-concept-path"    // curated per-field roadmap
  | "field-concept-context" // concept frontmatter key_fields
  | "concept-concept"       // prerequisites / successors / related
  | "concept-tool"          // concept frontmatter exemplar_tools
  | "field-tool";           // FIELD_TOOL_MAP

export interface UniverseEdge {
  from: string;
  to: string;
  /** Drives stroke opacity. 1 = strongest. */
  strength: number;
  source: UniverseEdgeSource;
  /**
   * "primary" edges render at rest; "context" edges are hidden until hover or
   * a filter reveals them. Without this split the resting graph is ~626 paths
   * of spaghetti.
   */
  tier: "primary" | "context";
  /** Which half of the field roadmap this concept sits in. */
  track?: "intuitions" | "deeper";
  /** Reading order within that track, so the trajectory overlay can sequence. */
  order?: number;
}

/** An edge that referenced something that does not exist. Surfaced in dev. */
export interface DroppedEdge {
  from: string;
  to: string;
  reason: string;
}

export interface UniverseTopology {
  nodes: UniverseNode[];
  edges: UniverseEdge[];
  dropped: DroppedEdge[];
  stats: { fields: number; concepts: number; tools: number; edges: number };
}

type FieldPath = { intuitions?: string[]; deeper?: string[] };

// ── Builder ──────────────────────────────────────────────────────────────

export async function buildUniverseTopology(): Promise<UniverseTopology> {
  const concepts = getAllConcepts();

  // Public/anon client, not the service role. This page reads three public
  // columns that the `tools_public_read` RLS policy already exposes — there is
  // no reason to hand it a key that bypasses RLS.
  const supabase = createPublicClient();
  const { data: toolsData } = await supabase
    .from("tools")
    .select("slug, name, category")
    .order("created_at", { ascending: true });

  const tools = (toolsData ?? []) as {
    slug: string;
    name: string;
    category: string | null;
  }[];

  const nodes: UniverseNode[] = [];
  const edges: UniverseEdge[] = [];
  const dropped: DroppedEdge[] = [];

  // ── Nodes ──

  for (const field of fields) {
    nodes.push({
      id: `field:${field.slug}`,
      kind: "field",
      slug: field.slug,
      title: field.field,
      href: `/learn/paths/${field.slug}`,
      difficulty: (field as { difficulty?: string }).difficulty,
      tagline: (field as { tagline?: string }).tagline,
    });
  }

  for (const concept of concepts) {
    nodes.push({
      id: `concept:${concept.slug}`,
      kind: "concept",
      slug: concept.slug,
      title: concept.title,
      href: `/learn/${concept.slug}`,
      group: concept.group,
      tagline: concept.tagline,
    });
  }

  for (const tool of tools) {
    nodes.push({
      id: `tool:${tool.slug}`,
      kind: "tool",
      slug: tool.slug,
      title: tool.name,
      href: `/tool/${tool.slug}`,
      category: tool.category ?? "OTHER",
    });
  }

  const fieldIds = new Set(fields.map((f) => `field:${f.slug}`));
  const conceptIds = new Set(concepts.map((c) => `concept:${c.slug}`));
  const toolIds = new Set(tools.map((t) => `tool:${t.slug}`));

  // Dedupe key so a pair curated in two sources keeps only its strongest edge.
  const seen = new Set<string>();
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

  function push(edge: UniverseEdge): void {
    const k = key(edge.from, edge.to);
    if (seen.has(k)) return;
    seen.add(k);
    edges.push(edge);
  }

  // ── 1. field → concept (primary): the curated per-field roadmap ──
  // Same source FieldRoadmap.tsx already renders, so the map and the field
  // guide can no longer disagree about what a field should read.
  const paths = fieldConceptPaths as Record<string, FieldPath | string>;
  for (const [fieldSlug, value] of Object.entries(paths)) {
    if (fieldSlug === "_meta" || typeof value === "string") continue;
    const from = `field:${fieldSlug}`;
    if (!fieldIds.has(from)) {
      dropped.push({ from, to: "—", reason: "unknown field in field-concept-paths.json" });
      continue;
    }
    for (const track of ["intuitions", "deeper"] as const) {
      (value[track] ?? []).forEach((conceptSlug, i) => {
        const to = `concept:${conceptSlug}`;
        if (!conceptIds.has(to)) {
          dropped.push({ from, to, reason: `unknown concept slug in ${track}` });
          return;
        }
        push({
          from,
          to,
          strength: 1,
          source: "field-concept-path",
          tier: "primary",
          track,
          order: i,
        });
      });
    }
  }

  // ── 2. field → concept (context): concept frontmatter `key_fields` ──
  for (const concept of concepts) {
    const to = `concept:${concept.slug}`;
    for (const fieldSlug of concept.key_fields ?? []) {
      const from = `field:${fieldSlug}`;
      if (!fieldIds.has(from)) {
        dropped.push({ from, to, reason: `unknown field in ${concept.slug} key_fields` });
        continue;
      }
      push({ from, to, strength: 0.5, source: "field-concept-context", tier: "context" });
    }
  }

  // ── 3. concept ↔ concept: prerequisites ∪ successors ∪ related ──
  // The three are not inverses of each other in the content (38 `successors`
  // entries are not mirrored as `prerequisites` on the target), so the union is
  // genuinely additive rather than redundant.
  for (const concept of concepts) {
    const from = `concept:${concept.slug}`;
    const linked: [string[], number][] = [
      [concept.prerequisites ?? [], 0.8],
      [concept.successors ?? [], 0.8],
      [concept.related ?? [], 0.5],
    ];
    for (const [slugs, strength] of linked) {
      for (const slug of slugs) {
        const to = `concept:${slug}`;
        if (!conceptIds.has(to)) {
          dropped.push({ from, to, reason: "unknown related concept slug" });
          continue;
        }
        if (to === from) continue;
        push({ from, to, strength, source: "concept-concept", tier: "primary" });
      }
    }
  }

  // ── 4. concept → tool: frontmatter `exemplar_tools` ──
  // The only honest concept↔tool relation in the repo. The `tools.related_concepts`
  // column that three other code paths query DOES NOT EXIST in the database.
  for (const concept of concepts) {
    const from = `concept:${concept.slug}`;
    for (const toolSlug of concept.exemplar_tools ?? []) {
      const to = `tool:${toolSlug}`;
      if (!toolIds.has(to)) {
        dropped.push({ from, to, reason: `unknown tool in ${concept.slug} exemplar_tools` });
        continue;
      }
      push({ from, to, strength: 0.7, source: "concept-tool", tier: "context" });
    }
  }

  // ── 5. field → tool: FIELD_TOOL_MAP ──
  for (const field of fields) {
    const from = `field:${field.slug}`;
    for (const toolSlug of FIELD_TOOL_MAP[field.slug] ?? []) {
      const to = `tool:${toolSlug}`;
      if (!toolIds.has(to)) {
        dropped.push({ from, to, reason: "unknown tool in FIELD_TOOL_MAP" });
        continue;
      }
      push({ from, to, strength: 0.5, source: "field-tool", tier: "context" });
    }
  }

  return {
    nodes,
    edges,
    dropped,
    stats: {
      fields: fields.length,
      concepts: concepts.length,
      tools: tools.length,
      edges: edges.length,
    },
  };
}
