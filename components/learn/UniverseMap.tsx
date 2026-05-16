"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { UniverseGraph, UniverseNode, UniverseEdge } from "@/lib/universe-graph";
import UniverseTrajectory from "./UniverseTrajectory";

interface UniverseMapProps {
  graph: UniverseGraph;
}

// Color tints per node kind. Pulled from the brand palette.
const KIND_COLOR: Record<string, { fill: string; stroke: string; glow: string }> = {
  field:   { fill: "rgba(170,255,77,0.18)", stroke: "rgba(170,255,77,0.65)",  glow: "rgba(170,255,77,0.35)" },
  concept: { fill: "rgba(0,255,209,0.16)",  stroke: "rgba(0,255,209,0.65)",   glow: "rgba(0,255,209,0.30)" },
  tool:    { fill: "rgba(244,171,31,0.16)", stroke: "rgba(244,171,31,0.55)",  glow: "rgba(244,171,31,0.25)" },
};

// Bezier control point factor — softens the curve between bands.
function edgePath(from: UniverseNode, to: UniverseNode): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = from.x + dx * 0.5;
  const cy = from.y + dy * 0.5;
  // Curve away from a straight line by a fraction of the y-distance, so
  // long inter-band edges arc gracefully and short edges stay nearly straight.
  const curveAmount = Math.abs(dy) * 0.12 + 16;
  const cx1 = from.x + dx * 0.3;
  const cy1 = cy - curveAmount * Math.sign(dx || 1);
  const cx2 = mx + dx * 0.2;
  const cy2 = cy + curveAmount * Math.sign(dx || 1);
  return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
}

export default function UniverseMap({ graph }: UniverseMapProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Adjacency for quick neighbor lookup on hover.
  const adjacency = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const e of graph.edges) {
      if (!m.has(e.from)) m.set(e.from, new Set());
      if (!m.has(e.to))   m.set(e.to, new Set());
      m.get(e.from)!.add(e.to);
      m.get(e.to)!.add(e.from);
    }
    return m;
  }, [graph.edges]);

  const focusedNeighbors = hoverId ? adjacency.get(hoverId) : null;

  function edgeIsFocused(e: UniverseEdge): boolean {
    if (!hoverId) return false;
    return e.from === hoverId || e.to === hoverId;
  }

  function nodeIsFocused(n: UniverseNode): boolean {
    if (!hoverId) return true; // no focus → all are normal
    if (n.id === hoverId) return true;
    return focusedNeighbors?.has(n.id) ?? false;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <svg
        viewBox={`0 0 ${graph.viewBox.width} ${graph.viewBox.height}`}
        role="img"
        aria-label="The AIght universe — fields, concepts, and tools laid out as a connected map"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        <defs>
          <radialGradient id="field-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(170,255,77,0.30)" />
            <stop offset="100%" stopColor="rgba(170,255,77,0)" />
          </radialGradient>
          <radialGradient id="concept-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(0,255,209,0.28)" />
            <stop offset="100%" stopColor="rgba(0,255,209,0)" />
          </radialGradient>
          <radialGradient id="tool-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(244,171,31,0.22)" />
            <stop offset="100%" stopColor="rgba(244,171,31,0)" />
          </radialGradient>
        </defs>

        {/* Band labels — left margin */}
        <g style={{ pointerEvents: "none" }}>
          <text x="60" y="420" fill="rgba(245,239,224,0.30)" fontSize="14" letterSpacing="0.18em" textAnchor="start">
            FIELDS · 22
          </text>
          <text x="60" y="1500" fill="rgba(245,239,224,0.30)" fontSize="14" letterSpacing="0.18em" textAnchor="start">
            CONCEPTS · {graph.nodes.filter((n) => n.kind === "concept").length}
          </text>
          <text x="60" y="2520" fill="rgba(245,239,224,0.30)" fontSize="14" letterSpacing="0.18em" textAnchor="start">
            TOOLS · {graph.nodes.filter((n) => n.kind === "tool").length}
          </text>
        </g>

        {/* Edges */}
        <g aria-hidden>
          {graph.edges.map((e, i) => {
            const from = graph.nodes.find((n) => n.id === e.from);
            const to   = graph.nodes.find((n) => n.id === e.to);
            if (!from || !to) return null;
            const focused = edgeIsFocused(e);
            const dim = hoverId && !focused;
            return (
              <path
                key={i}
                d={edgePath(from, to)}
                fill="none"
                stroke={
                  e.source === "concept-concept" ? "rgba(0,255,209,0.40)" :
                  e.source === "field-concept"   ? "rgba(170,255,77,0.30)" :
                                                    "rgba(244,171,31,0.22)"
                }
                strokeWidth={focused ? 1.6 : 0.8}
                strokeOpacity={focused ? 1 : dim ? 0.07 : (e.strength * 0.55)}
                style={{ transition: "stroke-opacity 200ms ease, stroke-width 200ms ease" }}
              />
            );
          })}
        </g>

        {/* Trajectory overlay (client component, reads localStorage) */}
        <UniverseTrajectory graph={graph} />

        {/* Nodes */}
        <g>
          {graph.nodes.map((node) => {
            const tint = KIND_COLOR[node.kind];
            const isHover = node.id === hoverId;
            const focused = nodeIsFocused(node);
            const opacity = focused ? 1 : 0.25;
            const glowR = node.kind === "field" ? 38 : node.kind === "concept" ? 28 : 18;

            return (
              <g
                key={node.id}
                style={{
                  cursor: "pointer",
                  opacity,
                  transition: "opacity 200ms ease",
                }}
                onMouseEnter={() => setHoverId(node.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(node.id)}
                onBlur={() => setHoverId(null)}
                tabIndex={0}
              >
                {/* Ambient glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={glowR}
                  fill={`url(#${node.kind}-glow)`}
                  style={{ opacity: isHover ? 1 : 0.55, transition: "opacity 200ms ease" }}
                />
                {/* Node body — wrapped in a Next link */}
                <a href={node.href} aria-label={`${node.kind}: ${node.title}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={tint.fill}
                    stroke={tint.stroke}
                    strokeWidth={isHover ? 2.2 : 1.2}
                    style={{ transition: "stroke-width 180ms ease" }}
                  />
                  <title>{`${node.title} — ${node.kind}`}</title>
                </a>
                {/* Label — only render for fields + concepts at rest; tools too small */}
                {node.kind !== "tool" && (
                  <text
                    x={node.x}
                    y={node.y + node.r + 18}
                    textAnchor="middle"
                    fontSize={node.kind === "field" ? 13 : 12}
                    fill={isHover ? "var(--text-primary)" : "rgba(245,239,224,0.62)"}
                    style={{ fontFamily: "var(--font-ui), sans-serif", pointerEvents: "none", transition: "fill 180ms ease" }}
                  >
                    {node.title}
                  </text>
                )}
                {/* Tool labels appear on hover */}
                {node.kind === "tool" && isHover && (
                  <text
                    x={node.x}
                    y={node.y - node.r - 8}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--text-primary)"
                    style={{ fontFamily: "var(--font-ui), sans-serif", pointerEvents: "none" }}
                  >
                    {node.title}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend (sticky in viewport corner) */}
      <div
        aria-hidden
        style={{
          position: "sticky",
          bottom: 20,
          marginTop: 24,
          padding: "12px 18px",
          borderRadius: 999,
          background: "rgba(22,18,16,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(245,239,224,0.08)",
          display: "inline-flex",
          gap: 18,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          marginLeft: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: KIND_COLOR.field.stroke }} />
          Field
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: KIND_COLOR.concept.stroke }} />
          Concept
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: KIND_COLOR.tool.stroke }} />
          Tool
        </span>
        <Link
          href="/learn/paths/quiz"
          style={{ color: "var(--accent-primary)", textDecoration: "none" }}
        >
          See your trajectory →
        </Link>
      </div>
    </div>
  );
}
