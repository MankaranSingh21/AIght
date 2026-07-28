// Lookup index for the universe graph, built once per graph instead of per render.
//
// The previous renderer called `graph.nodes.find()` twice for every edge on
// every render — 203 edges × 2 linear scans of 141 nodes, on each hover. With
// the richer edge set that would have been ~626 × 2. `edgesByNode` is also what
// lets the renderer draw only the focused node's edges instead of re-styling
// all of them.

import type { UniverseEdge } from "@/lib/universe-graph";
import type { PositionedNode, PositionedGraph } from "@/lib/universe-layout";

export interface UniverseIndex {
  nodeById: Map<string, PositionedNode>;
  neighbors: Map<string, Set<string>>;
  edgesByNode: Map<string, UniverseEdge[]>;
}

export function buildIndex(graph: PositionedGraph): UniverseIndex {
  const nodeById = new Map<string, PositionedNode>();
  for (const n of graph.nodes) nodeById.set(n.id, n);

  const neighbors = new Map<string, Set<string>>();
  const edgesByNode = new Map<string, UniverseEdge[]>();

  const addNeighbor = (a: string, b: string) => {
    let set = neighbors.get(a);
    if (!set) neighbors.set(a, (set = new Set()));
    set.add(b);
  };
  const addEdge = (id: string, e: UniverseEdge) => {
    let list = edgesByNode.get(id);
    if (!list) edgesByNode.set(id, (list = []));
    list.push(e);
  };

  for (const e of graph.edges) {
    addNeighbor(e.from, e.to);
    addNeighbor(e.to, e.from);
    addEdge(e.from, e);
    addEdge(e.to, e);
  }

  return { nodeById, neighbors, edgesByNode };
}
