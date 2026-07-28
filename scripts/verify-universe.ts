// Regression guard for the universe graph. Run with:  npm run verify:universe
//
// Exists because the layout's collision-freedom is a *property* of the geometry
// rather than something a human can eyeball -- and it already caught one real
// regression: shrinking the tool ring made three cross-category tool pairs
// overlap (kling-3-0/atomwise landed 0.3 units apart), which is invisible in a
// screenshot at fit scale.
// Numeric validation of the universe topology + layout, before any UI exists.
import { buildUniverseTopology } from "@/lib/universe-graph";
import { layoutUniverse } from "@/lib/universe-layout";

function ok(cond: boolean, msg: string) {
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${msg}`);
  if (!cond) process.exitCode = 1;
}

async function main() {
  const topo = await buildUniverseTopology();
  const g = layoutUniverse(topo);

  console.log("\n── Topology ──");
  console.log(`nodes ${g.nodes.length}  edges ${g.edges.length}  dropped ${g.dropped.length}`);
  const bySource: Record<string, number> = {};
  for (const e of topo.edges) bySource[e.source] = (bySource[e.source] ?? 0) + 1;
  console.table(bySource);
  const byTier: Record<string, number> = {};
  for (const e of topo.edges) byTier[e.tier] = (byTier[e.tier] ?? 0) + 1;
  console.log("tiers:", byTier);

  if (g.dropped.length) {
    console.log("\nDROPPED:");
    for (const d of g.dropped.slice(0, 20)) console.log(`  ${d.from} -> ${d.to}  (${d.reason})`);
  }

  console.log("\n── Correctness ──");
  ok(g.dropped.length === 0, "no dropped edges (all curated slugs resolve)");

  // The old bug: everything defaulted to `rag`.
  // The old builder defaulted every unmatched field concept to `rag`. The real
  // property to assert is that rag is not a disproportionate sink, not an
  // absolute count -- RAG genuinely is relevant to many fields.
  const pathEdges = topo.edges.filter((e) => e.source === "field-concept-path");
  const perConcept = new Map<string, number>();
  for (const e of pathEdges) {
    const c = e.from.startsWith("concept:") ? e.from : e.to;
    perConcept.set(c, (perConcept.get(c) ?? 0) + 1);
  }
  const ragN = perConcept.get("concept:rag") ?? 0;
  const maxN = Math.max(...perConcept.values());
  ok(ragN <= maxN, `rag is not a catch-all sink (${ragN} edges vs max ${maxN})`);

  // Concept reachability from fields — the headline metric.
  const reachable = new Set<string>();
  for (const e of topo.edges) {
    if (e.source === "field-concept-path" || e.source === "field-concept-context") {
      reachable.add(e.from.startsWith("concept:") ? e.from : e.to);
    }
  }
  const conceptCount = g.nodes.filter((n) => n.kind === "concept").length;
  console.log(`  concepts reachable from a field: ${reachable.size} / ${conceptCount}`);
  ok(reachable.size >= 40, "at least 40 concepts reachable from fields (was ~9)");

  // Concept -> tool bridge must exist now.
  const ct = topo.edges.filter((e) => e.source === "concept-tool");
  ok(ct.length > 100, `concept-tool bridge exists (${ct.length} edges, was 0)`);

  console.log("\n── Collision check (min pairwise gap per ring) ──");
  const rings = new Map<string, typeof g.nodes>();
  for (const n of g.nodes) {
    const key =
      n.kind === "field" ? "FIELDS" : n.kind === "tool" ? "TOOLS" : `concept:${n.group}`;
    rings.set(key, [...(rings.get(key) ?? []), n]);
  }
  let worst = Infinity;
  for (const [name, list] of [...rings.entries()].sort()) {
    let min = Infinity;
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const d = Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y);
        if (d < min) min = d;
      }
    const need = list[0].r * 2;
    worst = Math.min(worst, min - need);
    console.log(
      `  ${name.padEnd(26)} n=${String(list.length).padStart(2)}  minDist=${min.toFixed(0).padStart(4)}  need>=${need}  ${min >= need ? "ok" : "OVERLAP"}`,
    );
  }
  ok(worst >= 0, "no node overlaps on any ring");

  // Everything must be inside the viewBox.
  const oob = g.nodes.filter(
    (n) => n.x < 0 || n.y < 0 || n.x > g.viewBox.width || n.y > g.viewBox.height,
  );
  ok(oob.length === 0, `all nodes inside viewBox (${oob.length} outside)`);

  const orphans = g.nodes.filter((n) => n.orphan);
  console.log(`\n  orphan nodes (no edges): ${orphans.length}`);
  console.log("   ", orphans.map((o) => o.id).join(", ") || "none");

  // Determinism: layout twice, expect identical coordinates.
  const g2 = layoutUniverse(topo);
  const same = g.nodes.every((n, i) => n.x === g2.nodes[i].x && n.y === g2.nodes[i].y);
  ok(same, "layout is deterministic across runs (safe for ISR)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
