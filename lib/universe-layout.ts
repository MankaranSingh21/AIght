// Radial layout for the universe graph. Pure — no React, no fs, no network.
// Runs on the server under ISR so the ~200 lines of trigonometry never enter
// the client bundle and the positioned SVG is in the initial HTML (crawlers and
// no-JS readers get all 141 links).
//
// Replaces a three-band stacked layout that was ~40% dead space and read as
// three disconnected blobs. Concentric orbits instead: the things everything
// else depends on sit in the middle, fields ring the outside, tools form the rim.

import { GROUP_ORDER } from "@/lib/learn";
import type {
  UniverseTopology,
  UniverseNode,
  UniverseEdge,
} from "@/lib/universe-graph";

export interface PositionedNode extends UniverseNode {
  x: number;
  y: number;
  r: number;
  /** Angle in radians, kept so labels can be rotated radially. */
  theta: number;
  /** Distance from centre, kept so the renderer can flip left-half labels. */
  radius: number;
  /** True when nothing links to this node — rendered dashed, not hidden. */
  orphan: boolean;
}

export interface PositionedGraph {
  nodes: PositionedNode[];
  edges: UniverseEdge[];
  viewBox: { width: number; height: number };
  centre: { x: number; y: number };
  stats: UniverseTopology["stats"];
  dropped: UniverseTopology["dropped"];
}

// ── Geometry ─────────────────────────────────────────────────────────────

const VIEW = 3600;
const CX = VIEW / 2;
const CY = VIEW / 2;

/**
 * Ring radius per concept group, in GROUP_ORDER sequence.
 *
 * Radius comes from the site's already-curated pedagogical ordering rather than
 * a derived metric, so there is nothing to drift. Prerequisite-DAG depth was
 * tried first and is a trap: the Foundations/ML essays were authored as a linear
 * chain, so depth produces 19 buckets of one node each while 40 concepts crowd
 * into the first few. GROUP_ORDER gives a balanced 8/11/8/9/8/9/6.
 */
const RING_RADII: Record<string, number> = {
  Foundations: 145,
  "Machine Learning": 240,
  Architecture: 335,
  Training: 430,
  Inference: 525,
  Practical: 620,
  Safety: 720,
};

// Tools sit between the concept rings and the field rim: they are what concepts
// look like in practice, and fields reach past them to reach concepts.
const TOOL_RADIUS = 850;
// Fields are the outermost ring so their labels radiate into open space. The
// radii above are deliberately tight: field labels read radially, and the
// longest of them ("Environmental Science & Climate") runs ~900 units at this
// font size. Rim + label has to clear the 1800-unit half-box or the labels on
// the vertical axis get clipped by the frame, which is exactly what happened
// at a 1240 rim.
const FIELD_RADIUS = 1000;

// Sized in viewBox units so they stay legible when the 3600-unit canvas is fit
// into a ~560-900px frame (roughly 0.16-0.25 scale). Kept under the measured
// per-ring minimum separation: tools 32, inner concept rings 50, fields 410.
const NODE_R = { field: 26, concept: 16, tool: 12 } as const;

/**
 * Thematic walk around the circle. fields.json order is authoring order, not
 * thematic — placing related fields next to each other does more to reduce edge
 * crossings than any algorithm, because concepts are then placed at the mean
 * angle of fields that actually sit together.
 *
 * life sciences → health → mind/society → education/humanities → words →
 * visual → motion/sound → built environment → commerce → money/law →
 * software → physical sciences → land
 */
const FIELD_RING_ORDER: string[] = [
  "biology",
  "pharmacy-drug-discovery",
  "medicine-healthcare",
  "psychology-mental-health",
  "social-work-public-policy",
  "education-teaching",
  "history-humanities",
  "creative-writing-literature",
  "journalism-media",
  "graphic-design-visual-arts",
  "film-video-production",
  "music-audio",
  "architecture-urban-design",
  "marketing-advertising",
  "sales-business-development",
  "finance-economics",
  "law-legal",
  "software-engineering",
  "physics-engineering",
  "chemistry-materials-science",
  "environmental-science-climate",
  "agriculture-food-science",
];

const TAU = Math.PI * 2;

/** Wrap any angle into [0, 2π). */
function norm(a: number): number {
  return ((a % TAU) + TAU) % TAU;
}

/**
 * Circular mean of a weighted set of angles. Averaging angles arithmetically is
 * wrong across the 0/2π seam (350° and 10° average to 180°, not 0°); projecting
 * onto the unit circle first is the standard fix.
 */
function circularMean(entries: { theta: number; weight: number }[]): number | null {
  if (entries.length === 0) return null;
  let sx = 0;
  let sy = 0;
  for (const { theta, weight } of entries) {
    sx += Math.cos(theta) * weight;
    sy += Math.sin(theta) * weight;
  }
  if (sx === 0 && sy === 0) return null;
  return norm(Math.atan2(sy, sx));
}

/**
 * Greedy angular separation: nudge nodes apart until each pair on a ring clears
 * `minGap`, including across the wrap seam, then re-centre the run.
 *
 * On this dataset every ring has 2-13× the slots it needs, so this pass is a
 * guarantee rather than a repair — it essentially never fires. That is the
 * point: collision-freedom should be a property of the layout, not a patch.
 */
function separate(thetas: number[], minGap: number): number[] {
  const n = thetas.length;
  if (n < 2) return thetas;

  const idx = thetas.map((t, i) => ({ t: norm(t), i })).sort((a, b) => a.t - b.t);

  for (let pass = 0; pass < 2; pass++) {
    for (let k = 1; k < n; k++) {
      const gap = idx[k].t - idx[k - 1].t;
      if (gap < minGap) idx[k].t = idx[k - 1].t + minGap;
    }
    // Wrap seam: the last node must also clear the first.
    const wrap = idx[0].t + TAU - idx[n - 1].t;
    if (wrap < minGap) {
      const shift = (minGap - wrap) / 2;
      for (let k = 0; k < n; k++) idx[k].t -= shift * (k / (n - 1));
    }
  }

  const out = new Array<number>(n);
  for (const { t, i } of idx) out[i] = norm(t);
  return out;
}

// ── Layout ───────────────────────────────────────────────────────────────

export function layoutUniverse(topology: UniverseTopology): PositionedGraph {
  const { nodes, edges } = topology;

  const theta = new Map<string, number>();
  const radius = new Map<string, number>();

  // Nodes with at least one edge. Used for the orphan flag and to decide which
  // tools get pulled toward their neighbours.
  const linked = new Set<string>();
  for (const e of edges) {
    linked.add(e.from);
    linked.add(e.to);
  }

  // ── 1. Fields anchor the whole layout: fixed, evenly spaced, curated order.
  const fieldNodes = nodes.filter((n) => n.kind === "field");
  const orderIndex = new Map(FIELD_RING_ORDER.map((slug, i) => [slug, i]));
  const orderedFields = [...fieldNodes].sort(
    (a, b) =>
      (orderIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  );
  orderedFields.forEach((n, i) => {
    theta.set(n.id, norm((TAU * i) / orderedFields.length - Math.PI / 2));
    radius.set(n.id, FIELD_RADIUS);
  });

  // ── 2. Concepts: barycentre of the fields that teach them.
  // Weight primary (curated roadmap) edges above context (key_fields) ones.
  const fieldAnglesFor = new Map<string, { theta: number; weight: number }[]>();
  for (const e of edges) {
    if (e.source !== "field-concept-path" && e.source !== "field-concept-context") continue;
    const fieldId = e.from.startsWith("field:") ? e.from : e.to;
    const conceptId = e.from.startsWith("concept:") ? e.from : e.to;
    const ft = theta.get(fieldId);
    if (ft === undefined) continue;
    const list = fieldAnglesFor.get(conceptId) ?? [];
    list.push({ theta: ft, weight: e.source === "field-concept-path" ? 1 : 0.6 });
    fieldAnglesFor.set(conceptId, list);
  }

  // Group concepts by ring so each ring can be spread and de-collided on its own.
  const conceptsByGroup = new Map<string, UniverseNode[]>();
  for (const n of nodes) {
    if (n.kind !== "concept") continue;
    const g = n.group && RING_RADII[n.group] ? n.group : "Practical";
    const list = conceptsByGroup.get(g) ?? [];
    list.push(n);
    conceptsByGroup.set(g, list);
  }

  for (const group of GROUP_ORDER) {
    const ring = conceptsByGroup.get(group);
    if (!ring?.length) continue;
    const r = RING_RADII[group];

    // The 19 concepts with no field links are exactly Foundations + Machine
    // Learning. That is a clean partition, not a data gap — they underpin
    // everything, so no barycentre exists and none is needed. Spread them
    // evenly, ordered by slug for determinism across ISR regenerations.
    const anchored = ring.filter((n) => (fieldAnglesFor.get(n.id) ?? []).length > 0);
    const floating = ring.filter((n) => (fieldAnglesFor.get(n.id) ?? []).length === 0);

    const raw = new Map<string, number>();
    for (const n of anchored) {
      raw.set(n.id, circularMean(fieldAnglesFor.get(n.id)!) ?? 0);
    }
    [...floating]
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .forEach((n, i, arr) => {
        raw.set(n.id, norm((TAU * i) / arr.length - Math.PI / 2));
      });

    // Tangential labels sit under concept nodes, so the separation constant is
    // label height, converted from arc length to radians at this ring's radius.
    const minGap = (NODE_R.concept * 2 + 26) / r;
    const ids = ring.map((n) => n.id);
    const spread = separate(ids.map((id) => raw.get(id)!), minGap);
    ids.forEach((id, i) => {
      theta.set(id, spread[i]);
      radius.set(id, r);
    });
  }

  // ── 3. Tools: barycentre of connected concepts/fields, clamped to a category
  // arc so the rim reads as coherent clusters instead of a scatter.
  const toolNodes = nodes.filter((n) => n.kind === "tool");
  const categories = Array.from(
    new Set(toolNodes.map((t) => t.category ?? "OTHER")),
  ).sort();

  const neighbourAngles = new Map<string, { theta: number; weight: number }[]>();
  for (const e of edges) {
    if (e.source !== "concept-tool" && e.source !== "field-tool") continue;
    const toolId = e.from.startsWith("tool:") ? e.from : e.to;
    const otherId = toolId === e.from ? e.to : e.from;
    const ot = theta.get(otherId);
    if (ot === undefined) continue;
    const list = neighbourAngles.get(toolId) ?? [];
    list.push({ theta: ot, weight: e.strength });
    neighbourAngles.set(toolId, list);
  }

  let arcStart = -Math.PI / 2;
  for (const cat of categories) {
    const inCat = toolNodes.filter((t) => (t.category ?? "OTHER") === cat);
    // Arc size proportional to member count, so a 21-tool category gets room.
    const arcSize = (TAU * inCat.length) / toolNodes.length;
    const pad = arcSize * 0.08;
    const lo = arcStart + pad;
    const hi = arcStart + arcSize - pad;

    const raw = new Map<string, number>();
    inCat.forEach((n, i) => {
      const mean = circularMean(neighbourAngles.get(n.id) ?? []);
      if (mean === null) {
        // Unlinked tool: even slot inside its own category arc. Its category is
        // its own DB attribute, so grouping by it invents no relationship.
        raw.set(n.id, lo + ((hi - lo) * (i + 0.5)) / inCat.length);
        return;
      }
      // Clamp the barycentre into this category's arc. Compare in arc-local
      // space so the 0/2π seam does not throw the clamp off.
      const local = norm(mean - lo);
      const span = norm(hi - lo);
      raw.set(n.id, lo + Math.min(local, span));
    });

    const minGap = (NODE_R.tool * 2 + 14) / TOOL_RADIUS;
    const ids = inCat.map((n) => n.id);
    const spread = separate(ids.map((id) => raw.get(id)!), minGap);
    ids.forEach((id, i) => {
      theta.set(id, spread[i]);
      radius.set(id, TOOL_RADIUS);
    });

    arcStart += arcSize;
  }

  // The per-category pass above cannot see across arc boundaries, so two tools
  // in adjacent categories can still land on top of each other (verified: three
  // such pairs, e.g. kling-3-0/atomwise at 0.3 units apart). One global pass
  // over the whole ring fixes the seams; because the arcs are already laid out
  // in order it only nudges boundary nodes and leaves the grouping intact.
  {
    const ids = toolNodes.map((n) => n.id);
    const minGap = (NODE_R.tool * 2 + 14) / TOOL_RADIUS;
    const spread = separate(ids.map((id) => theta.get(id)!), minGap);
    ids.forEach((id, i) => theta.set(id, spread[i]));
  }

  // ── 4. Project polar → cartesian.
  const positioned: PositionedNode[] = nodes.map((n) => {
    const t = theta.get(n.id) ?? 0;
    const rad = radius.get(n.id) ?? FIELD_RADIUS;
    return {
      ...n,
      theta: t,
      radius: rad,
      r: NODE_R[n.kind],
      x: CX + Math.cos(t) * rad,
      y: CY + Math.sin(t) * rad,
      orphan: !linked.has(n.id),
    };
  });

  return {
    nodes: positioned,
    edges,
    viewBox: { width: VIEW, height: VIEW },
    centre: { x: CX, y: CY },
    stats: topology.stats,
    dropped: topology.dropped,
  };
}
