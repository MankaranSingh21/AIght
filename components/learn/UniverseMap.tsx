"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { UniverseGraph, UniverseNode, UniverseEdge } from "@/lib/universe-graph";
import UniverseTrajectory from "./UniverseTrajectory";
import { loadQuizResult, QUIZ_CHANGED_EVENT } from "@/lib/quiz-storage";

type FilterMode = "all" | "field" | "concepts" | "tools";

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
  const [filter, setFilter] = useState<FilterMode>("all");
  const [userField, setUserField] = useState<{ slug: string; name: string } | null>(null);

  // Read stored quiz result so we can enable the "My field" filter pill.
  useEffect(() => {
    const refresh = () => {
      const r = loadQuizResult();
      setUserField(r ? { slug: r.fieldSlug, name: r.fieldName } : null);
    };
    refresh();
    window.addEventListener(QUIZ_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(QUIZ_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Adjacency for quick neighbor lookup on hover, AND for the field filter.
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

  // Compute which node ids pass the active filter.
  const visibleIds = useMemo<Set<string> | null>(() => {
    if (filter === "all") return null;
    if (filter === "concepts") {
      return new Set(graph.nodes.filter((n) => n.kind === "concept").map((n) => n.id));
    }
    if (filter === "tools") {
      return new Set(graph.nodes.filter((n) => n.kind === "tool").map((n) => n.id));
    }
    if (filter === "field" && userField) {
      const fieldId = `field:${userField.slug}`;
      const ids = new Set<string>([fieldId]);
      const direct = adjacency.get(fieldId);
      direct?.forEach((id) => ids.add(id));
      // Second-degree: concept↔concept neighbors of any included concept
      Array.from(direct ?? []).forEach((id) => {
        if (id.startsWith("concept:")) {
          adjacency.get(id)?.forEach((nbr) => {
            if (nbr.startsWith("concept:")) ids.add(nbr);
          });
        }
      });
      return ids;
    }
    return null;
  }, [filter, userField, graph.nodes, adjacency]);

  const focusedNeighbors = hoverId ? adjacency.get(hoverId) : null;

  function edgeIsFocused(e: UniverseEdge): boolean {
    if (!hoverId) return false;
    return e.from === hoverId || e.to === hoverId;
  }

  function edgeIsVisible(e: UniverseEdge): boolean {
    if (!visibleIds) return true;
    return visibleIds.has(e.from) && visibleIds.has(e.to);
  }

  function nodeIsFocused(n: UniverseNode): boolean {
    if (!hoverId) return true;
    if (n.id === hoverId) return true;
    return focusedNeighbors?.has(n.id) ?? false;
  }

  function nodeIsVisible(n: UniverseNode): boolean {
    if (!visibleIds) return true;
    return visibleIds.has(n.id);
  }

  const FILTER_OPTIONS: { value: FilterMode; label: string; disabled?: boolean }[] = [
    { value: "all",      label: "All" },
    { value: "field",    label: userField ? `My field · ${userField.name}` : "My field (take the quiz)", disabled: !userField },
    { value: "concepts", label: "Concepts only" },
    { value: "tools",    label: "Tools only" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {/* Filter chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 18,
          padding: "0 4px",
        }}
      >
        {FILTER_OPTIONS.map((opt) => {
          const active = filter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => !opt.disabled && setFilter(opt.value)}
              disabled={opt.disabled}
              aria-pressed={active}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                padding: "6px 12px",
                borderRadius: 999,
                background: active
                  ? "var(--accent-primary)"
                  : opt.disabled
                  ? "transparent"
                  : "rgba(255,250,240,0.04)",
                color: active
                  ? "var(--text-inverse, #0C0A08)"
                  : opt.disabled
                  ? "var(--text-muted)"
                  : "var(--text-secondary)",
                border: active
                  ? "1px solid var(--accent-primary)"
                  : "1px solid rgba(245,239,224,0.10)",
                cursor: opt.disabled ? "not-allowed" : "pointer",
                opacity: opt.disabled ? 0.55 : 1,
                transition: "all 150ms ease",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

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
            const visible = edgeIsVisible(e);
            const focused = edgeIsFocused(e);
            const dim = (hoverId && !focused) || !visible;
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
                strokeOpacity={!visible ? 0.05 : focused ? 1 : dim ? 0.07 : (e.strength * 0.55)}
                style={{ transition: "stroke-opacity 240ms ease, stroke-width 200ms ease" }}
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
            const visible = nodeIsVisible(node);
            const focused = nodeIsFocused(node);
            const opacity = !visible ? 0.10 : focused ? 1 : 0.25;
            const glowR = node.kind === "field" ? 38 : node.kind === "concept" ? 28 : 18;

            return (
              <g
                key={node.id}
                style={{
                  cursor: visible ? "pointer" : "default",
                  opacity,
                  pointerEvents: visible ? "auto" : "none",
                  transition: "opacity 240ms ease",
                }}
                onMouseEnter={() => setHoverId(node.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(node.id)}
                onBlur={() => setHoverId(null)}
                tabIndex={visible ? 0 : -1}
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
