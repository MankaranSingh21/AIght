"use client";

import { useMemo } from "react";
import type { PositionedGraph, PositionedNode } from "@/lib/universe-layout";
import type { UniverseIndex } from "@/lib/universe-adjacency";
import type { UniverseEdge } from "@/lib/universe-graph";
import UniverseTrajectory from "./UniverseTrajectory";

export type FilterMode = "all" | "field" | "concepts" | "tools";

interface Props {
  graph: PositionedGraph;
  index: UniverseIndex;
  hoverId: string | null;
  lockedId: string | null;
  visibleIds: Set<string> | null;
  /** Current zoom scale — drives label level-of-detail. */
  scale: number;
  labelMode: "auto" | "all";
  onHover: (id: string | null) => void;
  onNodeClick: (e: React.MouseEvent, node: PositionedNode) => void;
}

const KIND_COLOR: Record<string, { fill: string; stroke: string }> = {
  field: { fill: "rgba(170,255,77,0.18)", stroke: "rgba(170,255,77,0.65)" },
  concept: { fill: "rgba(0,255,209,0.16)", stroke: "rgba(0,255,209,0.65)" },
  tool: { fill: "rgba(244,171,31,0.16)", stroke: "rgba(244,171,31,0.55)" },
};

const EDGE_COLOR: Record<string, string> = {
  "field-concept-path": "rgba(170,255,77,0.34)",
  "field-concept-context": "rgba(170,255,77,0.16)",
  "concept-concept": "rgba(0,255,209,0.34)",
  "concept-tool": "rgba(244,171,31,0.28)",
  "field-tool": "rgba(244,171,31,0.16)",
};

/**
 * Edge path. On a radial layout a straight chord between two outer nodes cuts
 * through the dense core, so bow every edge away from the centre by an amount
 * proportional to its span. Short edges stay nearly straight.
 */
function edgePath(a: PositionedNode, b: PositionedNode, cx: number, cy: number): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  // Push the control point outward from the centre through the midpoint.
  const vx = mx - cx;
  const vy = my - cy;
  const len = Math.hypot(vx, vy) || 1;
  const bow = Math.min(dist * 0.18, 190);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${(mx + (vx / len) * bow).toFixed(1)} ${(my + (vy / len) * bow).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export default function UniverseSVG({
  graph,
  index,
  hoverId,
  lockedId,
  visibleIds,
  scale,
  labelMode,
  onHover,
  onNodeClick,
}: Props) {
  const { centre } = graph;
  const activeId = hoverId ?? lockedId;

  // Path strings are pure geometry — compute once, never on hover.
  const paths = useMemo(() => {
    const m = new Map<UniverseEdge, string>();
    for (const e of graph.edges) {
      const a = index.nodeById.get(e.from);
      const b = index.nodeById.get(e.to);
      if (!a || !b) continue;
      m.set(e, edgePath(a, b, centre.x, centre.y));
    }
    return m;
  }, [graph.edges, index, centre.x, centre.y]);

  const primary = useMemo(() => graph.edges.filter((e) => e.tier === "primary"), [graph.edges]);
  const context = useMemo(() => graph.edges.filter((e) => e.tier === "context"), [graph.edges]);

  const focusEdges = activeId ? index.edgesByNode.get(activeId) ?? [] : [];
  const neighbors = activeId ? index.neighbors.get(activeId) : null;

  function nodeVisible(n: PositionedNode): boolean {
    return !visibleIds || visibleIds.has(n.id);
  }
  function edgeVisible(e: UniverseEdge): boolean {
    return !visibleIds || (visibleIds.has(e.from) && visibleIds.has(e.to));
  }

  // Level of detail. Because the layout guarantees no label overlaps, "all" is
  // always a safe state — LOD here is an aesthetic default, not a crutch.
  const showConceptLabels = labelMode === "all" || scale >= 1.8;
  const showToolLabels = labelMode === "all" || scale >= 2.8;

  return (
    <svg
      viewBox={`0 0 ${graph.viewBox.width} ${graph.viewBox.height}`}
      aria-labelledby="universe-svg-title"
      style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
    >
      <title id="universe-svg-title">
        {`Map of ${graph.stats.fields} fields, ${graph.stats.concepts} concepts and ${graph.stats.tools} tools, drawn as concentric orbits.`}
      </title>

      <defs>
        <radialGradient id="u-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(170,255,77,0.05)" />
          <stop offset="100%" stopColor="rgba(170,255,77,0)" />
        </radialGradient>
      </defs>

      {/* Faint core wash so the middle does not read as an empty hole */}
      <circle cx={centre.x} cy={centre.y} r={380} fill="url(#u-core)" />

      {/* Ring guides */}
      <g aria-hidden style={{ pointerEvents: "none" }}>
        {[145, 240, 335, 430, 525, 620, 720, 850, 1000].map((r) => (
          <circle
            key={r}
            cx={centre.x}
            cy={centre.y}
            r={r}
            fill="none"
            stroke="rgba(245,239,224,0.04)"
            strokeWidth={1}
          />
        ))}
      </g>

      {/*
        Layer 1 — resting edges. Dimmed as a group via one class on the parent
        when something is focused, rather than restyling ~390 individual paths.
      */}
      <g
        aria-hidden
        style={{
          pointerEvents: "none",
          opacity: activeId ? 0.07 : 1,
          transition: "opacity 240ms ease",
        }}
      >
        {primary.map((e, i) => (
          <path
            key={i}
            d={paths.get(e)}
            fill="none"
            stroke={EDGE_COLOR[e.source]}
            strokeWidth={0.9}
            strokeOpacity={edgeVisible(e) ? e.strength * 0.6 : 0.04}
          />
        ))}
      </g>

      {/* Layer 2 — context edges, only when a filter asks for them */}
      {visibleIds && (
        <g aria-hidden style={{ pointerEvents: "none", opacity: activeId ? 0.07 : 1 }}>
          {context.map((e, i) =>
            edgeVisible(e) ? (
              <path
                key={i}
                d={paths.get(e)}
                fill="none"
                stroke={EDGE_COLOR[e.source]}
                strokeWidth={0.8}
                strokeOpacity={e.strength * 0.5}
              />
            ) : null,
          )}
        </g>
      )}

      {/* Layer 3 — focused node's edges only (≤ ~25 paths) */}
      {activeId && (
        <g aria-hidden style={{ pointerEvents: "none" }}>
          {focusEdges.map((e, i) => (
            <path
              key={i}
              d={paths.get(e)}
              fill="none"
              stroke={EDGE_COLOR[e.source]}
              strokeWidth={2}
              strokeOpacity={1}
              style={{ filter: "drop-shadow(0 0 4px rgba(170,255,77,0.25))" }}
            />
          ))}
        </g>
      )}

      <UniverseTrajectory graph={graph} index={index} />

      {/* Nodes */}
      <g>
        {graph.nodes.map((node) => {
          const tint = KIND_COLOR[node.kind];
          const isHover = node.id === hoverId;
          const isLocked = node.id === lockedId;
          const visible = nodeVisible(node);
          const focused = !activeId || node.id === activeId || (neighbors?.has(node.id) ?? false);
          const opacity = !visible ? 0.08 : focused ? 1 : 0.22;

          const labelOn =
            node.kind === "field" ||
            (node.kind === "concept" && showConceptLabels) ||
            (node.kind === "tool" && showToolLabels) ||
            isHover ||
            isLocked ||
            (activeId !== null && (neighbors?.has(node.id) ?? false));

          // Fields and tools sit on the outermost rings, where there is
          // unbounded room outward — so their labels read radially. Rotate to
          // the node's angle and flip on the left half so text stays upright.
          const deg = (node.theta * 180) / Math.PI;
          const flip = Math.cos(node.theta) < 0;
          const radial = node.kind !== "concept";
          const labelGap = node.r + 14;

          return (
            <g
              key={node.id}
              id={node.id}
              style={{
                opacity,
                pointerEvents: visible ? "auto" : "none",
                transition: "opacity 240ms ease",
              }}
            >
              {/*
                One focusable element per node. The previous version put
                tabIndex on this <g> AND kept the natively-focusable <a>
                inside it, which produced 282 tab stops for 141 nodes.
              */}
              <a
                href={node.href}
                aria-label={`${node.kind}: ${node.title}`}
                onMouseEnter={() => onHover(node.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(node.id)}
                onBlur={() => onHover(null)}
                onClick={(e) => onNodeClick(e, node)}
                style={{ cursor: "pointer" }}
              >
                {/* Oversized invisible hit area — the visible dot is 9px on the
                    tool ring, far under the 24px minimum touch target. */}
                <circle cx={node.x} cy={node.y} r={node.r + 12} fill="transparent" />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={node.orphan ? "transparent" : tint.fill}
                  stroke={tint.stroke}
                  strokeWidth={isHover || isLocked ? 2.6 : 1.3}
                  // Unlinked tools read as dashed rather than being hidden —
                  // an honest, visible gap instead of a fabricated edge.
                  strokeDasharray={node.orphan ? "3 3" : undefined}
                  strokeOpacity={node.orphan ? 0.45 : 1}
                  style={{ transition: "stroke-width 180ms ease" }}
                />
              </a>

              {labelOn && (
                <text
                  x={radial ? 0 : node.x}
                  y={radial ? 0 : node.y + labelGap + 6}
                  textAnchor={radial ? (flip ? "end" : "start") : "middle"}
                  dominantBaseline={radial ? "middle" : undefined}
                  transform={
                    radial
                      ? `translate(${centre.x} ${centre.y}) rotate(${deg}) translate(${node.radius + labelGap} 0)${flip ? " rotate(180)" : ""}`
                      : undefined
                  }
                  fontSize={node.kind === "field" ? 58 : node.kind === "concept" ? 32 : 24}
                  fill={
                    isHover || isLocked
                      ? "var(--text-primary)"
                      : node.kind === "field"
                        ? "rgba(245,239,224,0.72)"
                        : "rgba(245,239,224,0.55)"
                  }
                  style={{
                    fontFamily: "var(--font-ui), sans-serif",
                    pointerEvents: "none",
                    transition: "fill 180ms ease",
                  }}
                >
                  {node.title}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
