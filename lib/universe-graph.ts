// Pure builder for the /learn/map universe graph. No React, no DOM — produces
// a deterministic { nodes, edges } structure that UniverseMap renders.

import fields from "@/content/paths/fields.json";
import { getAllConcepts } from "@/lib/learn";
import { createServiceClient } from "@/utils/supabase/service";
import { FIELD_TOOL_MAP } from "@/lib/field-tool-map";

// ── Types ────────────────────────────────────────────────────────────────

export type UniverseNodeKind = "field" | "concept" | "tool";

export interface UniverseNode {
  id: string;          // unique across all kinds (prefixed by kind)
  kind: UniverseNodeKind;
  slug: string;
  title: string;
  href: string;
  // Positioning, in viewBox coords. UniverseMap reads these directly.
  x: number;
  y: number;
  r: number;           // visual radius
  category?: string;   // tool category, for cluster + color hints
  difficulty?: string; // field difficulty (Easy/Medium/Hard) for tint
}

export interface UniverseEdge {
  from: string;
  to: string;
  // Edge weight: 1 = strong, 0.5 = soft. Drives stroke opacity.
  strength: number;
  // Source for the edge — used for debugging + filtering.
  source: "field-concept" | "concept-concept" | "field-tool";
}

export interface UniverseGraph {
  nodes: UniverseNode[];
  edges: UniverseEdge[];
  viewBox: { width: number; height: number };
}

// ── Layout constants ─────────────────────────────────────────────────────
// Vertical, scrollable canvas. Three bands stacked top-to-bottom: fields
// (top), concepts (middle), tools (bottom). Soft sinusoidal jitter per band
// makes it feel hand-positioned, not gridded.

const VW = 1600;
const VH = 3200;

const FIELD_BAND   = { yCenter:  420, jitter: 110 };
const CONCEPT_BAND = { yCenter: 1500, jitter:  90 };
const TOOL_BAND    = { yCenter: 2520, jitter: 200 };

const FIELD_PAD   = 90;
const CONCEPT_PAD = 200;

// ── Helpers ──────────────────────────────────────────────────────────────

// Same concept-name → slug resolver used in field guide pages. Kept in sync
// manually until we collapse them into one helper.
function conceptToSlug(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("retrieval") || t.includes("rag")) return "rag";
  if (t.includes("mcp") || t.includes("model context protocol")) return "mcp";
  if (t.includes("agent") || t.includes("autonomous") || t.includes("agentic") || t.includes("closed-loop")) return "agents";
  if (t.includes("embedding") || t.includes("vector")) return "embeddings";
  if (t.includes("transformer") || t.includes("attention") || t.includes("multimodal")) return "transformers";
  if (t.includes("fine-tun") || t.includes("fine tuning")) return "fine-tuning";
  if (t.includes("generative") || t.includes("generation")) return "fine-tuning";
  if (t.includes("neural") || t.includes("deep learning") || t.includes("graph neural")) return "transformers";
  if (t.includes("predict") || t.includes("classification")) return "embeddings";
  return "rag";
}

// ── Builder ──────────────────────────────────────────────────────────────

export async function buildUniverseGraph(): Promise<UniverseGraph> {
  const concepts = getAllConcepts();
  const supabase = createServiceClient();
  const { data: toolsData } = await supabase
    .from("tools")
    .select("slug, name, category")
    .order("created_at", { ascending: true });

  const tools = (toolsData ?? []) as { slug: string; name: string; category: string | null }[];

  const nodes: UniverseNode[] = [];
  const edges: UniverseEdge[] = [];

  // 1. Field nodes — spread across the top band in an arc with sin jitter.
  fields.forEach((field, i) => {
    const t = fields.length > 1 ? i / (fields.length - 1) : 0.5;
    const x = FIELD_PAD + t * (VW - FIELD_PAD * 2);
    const y = FIELD_BAND.yCenter + Math.sin(i * 0.85) * FIELD_BAND.jitter;
    nodes.push({
      id: `field:${field.slug}`,
      kind: "field",
      slug: field.slug,
      title: field.field,
      href: `/learn/paths/${field.slug}`,
      x,
      y,
      r: 14,
      difficulty: (field as { difficulty?: string }).difficulty,
    });
  });

  // 2. Concept nodes — middle band, also arc-spread.
  concepts.forEach((concept, i) => {
    const t = concepts.length > 1 ? i / (concepts.length - 1) : 0.5;
    const x = CONCEPT_PAD + t * (VW - CONCEPT_PAD * 2);
    const y = CONCEPT_BAND.yCenter + Math.sin(i * 1.1 + 0.6) * CONCEPT_BAND.jitter;
    nodes.push({
      id: `concept:${concept.slug}`,
      kind: "concept",
      slug: concept.slug,
      title: concept.title,
      href: `/learn/${concept.slug}`,
      x,
      y,
      r: 11,
    });
  });

  // 3. Tool nodes — bottom band, clustered by category. Each category gets a
  // horizontal cell; tools fan out inside the cell in a small grid.
  const categories = Array.from(new Set(tools.map((t) => t.category ?? "OTHER"))).sort();
  const cellW = (VW - 200) / Math.max(1, categories.length);
  const TOOLS_PER_ROW = 6;

  categories.forEach((cat, catIdx) => {
    const inCat = tools.filter((t) => (t.category ?? "OTHER") === cat);
    const cellX = 100 + catIdx * cellW + cellW / 2;
    inCat.forEach((tool, j) => {
      const row = Math.floor(j / TOOLS_PER_ROW);
      const col = j % TOOLS_PER_ROW;
      const offset = (col - (TOOLS_PER_ROW - 1) / 2) * 22;
      const x = cellX + offset;
      const y = TOOL_BAND.yCenter + row * 36 + Math.sin(j * 0.7 + catIdx) * 10;
      nodes.push({
        id: `tool:${tool.slug}`,
        kind: "tool",
        slug: tool.slug,
        title: tool.name,
        href: `/tool/${tool.slug}`,
        x,
        y,
        r: 7,
        category: tool.category ?? "OTHER",
      });
    });
  });

  // ── Edges ──

  // field ↔ concept (via field.concepts[] resolved by conceptToSlug)
  const conceptIds = new Set(concepts.map((c) => `concept:${c.slug}`));
  fields.forEach((field) => {
    const seen = new Set<string>();
    (field.concepts ?? []).forEach((conceptText) => {
      const slug = conceptToSlug(conceptText);
      const target = `concept:${slug}`;
      if (!conceptIds.has(target) || seen.has(target)) return;
      seen.add(target);
      edges.push({
        from: `field:${field.slug}`,
        to: target,
        strength: 0.8,
        source: "field-concept",
      });
    });
  });

  // concept ↔ concept (MDX frontmatter `related[]`)
  concepts.forEach((concept) => {
    (concept.related ?? []).forEach((relatedSlug) => {
      const target = `concept:${relatedSlug}`;
      if (!conceptIds.has(target)) return;
      // de-dupe symmetric edges
      const a = `concept:${concept.slug}`;
      if (a >= target) return;
      edges.push({ from: a, to: target, strength: 0.6, source: "concept-concept" });
    });
  });

  // field ↔ tool (FIELD_TOOL_MAP — manual curation)
  const toolIds = new Set(tools.map((t) => `tool:${t.slug}`));
  fields.forEach((field) => {
    const toolSlugs = FIELD_TOOL_MAP[field.slug] ?? [];
    toolSlugs.forEach((toolSlug) => {
      const target = `tool:${toolSlug}`;
      if (!toolIds.has(target)) return;
      edges.push({
        from: `field:${field.slug}`,
        to: target,
        strength: 0.5,
        source: "field-tool",
      });
    });
  });

  return {
    nodes,
    edges,
    viewBox: { width: VW, height: VH },
  };
}

// Convenience: find a node by id with O(n) — fine for ~150 nodes.
export function findNode(graph: UniverseGraph, id: string): UniverseNode | undefined {
  return graph.nodes.find((n) => n.id === id);
}
