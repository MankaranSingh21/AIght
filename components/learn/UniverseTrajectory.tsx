"use client";

import { useEffect, useState } from "react";
import { loadQuizResult, type StoredQuizResult, QUIZ_CHANGED_EVENT } from "@/lib/quiz-storage";
import type { UniverseGraph, UniverseNode } from "@/lib/universe-graph";

interface UniverseTrajectoryProps {
  graph: UniverseGraph;
}

// Reads a stored quiz result from localStorage and overlays a glowing path
// inside the parent UniverseMap SVG. Rendered as an inline <g>.
export default function UniverseTrajectory({ graph }: UniverseTrajectoryProps) {
  const [stored, setStored] = useState<StoredQuizResult | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setStored(loadQuizResult());
    const handler = () => setStored(loadQuizResult());
    window.addEventListener(QUIZ_CHANGED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(QUIZ_CHANGED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!stored) return null;

  const fieldNode = graph.nodes.find((n) => n.id === `field:${stored.fieldSlug}`);
  if (!fieldNode) return null;

  // Pick concept + tool nodes connected to the user's field. If the stored
  // recommendation arrays are empty (current default), fall back to whatever
  // is adjacent in the graph.
  const fieldNeighbors = graph.edges.filter((e) => e.from === fieldNode.id || e.to === fieldNode.id);
  const conceptIds = new Set(
    fieldNeighbors
      .map((e) => (e.from === fieldNode.id ? e.to : e.from))
      .filter((id) => id.startsWith("concept:"))
  );
  const toolIds = new Set(
    fieldNeighbors
      .map((e) => (e.from === fieldNode.id ? e.to : e.from))
      .filter((id) => id.startsWith("tool:"))
  );

  const targetConcepts: UniverseNode[] = stored.recommendedConceptSlugs.length > 0
    ? stored.recommendedConceptSlugs
        .map((s) => graph.nodes.find((n) => n.id === `concept:${s}`))
        .filter((n): n is UniverseNode => Boolean(n))
        .slice(0, 3)
    : Array.from(conceptIds)
        .map((id) => graph.nodes.find((n) => n.id === id))
        .filter((n): n is UniverseNode => Boolean(n))
        .slice(0, 3);

  const targetTools: UniverseNode[] = stored.recommendedToolSlugs.length > 0
    ? stored.recommendedToolSlugs
        .map((s) => graph.nodes.find((n) => n.id === `tool:${s}`))
        .filter((n): n is UniverseNode => Boolean(n))
        .slice(0, 5)
    : Array.from(toolIds)
        .map((id) => graph.nodes.find((n) => n.id === id))
        .filter((n): n is UniverseNode => Boolean(n))
        .slice(0, 5);

  function lineFromTo(a: UniverseNode, b: UniverseNode): string {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const cx = a.x + dx * 0.5;
    const cy = a.y + dy * 0.45;
    return `M ${a.x} ${a.y} Q ${cx} ${cy}, ${b.x} ${b.y}`;
  }

  const allTargets: UniverseNode[] = [...targetConcepts, ...targetTools];

  return (
    <g aria-label="Your trajectory through the universe, based on your quiz answers">
      {/* Soft halo around the user's field */}
      <circle
        cx={fieldNode.x}
        cy={fieldNode.y}
        r={fieldNode.r + 18}
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth={1.5}
        strokeOpacity={0.55}
        style={{
          ...(reduceMotion ? {} : {
            animation: "universe-trajectory-pulse 2.6s ease-in-out infinite",
          }),
        }}
      />

      {/* Glowing edges from field to each target */}
      {allTargets.map((t, i) => (
        <path
          key={t.id}
          d={lineFromTo(fieldNode, t)}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth={1.8}
          strokeOpacity={0.85}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 6px rgba(170,255,77,0.55))",
            ...(reduceMotion ? {} : {
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: `universe-trajectory-draw 700ms cubic-bezier(0.16,1,0.3,1) forwards ${i * 80}ms`,
            }),
          }}
        />
      ))}

      {/* Pulse rings at target nodes */}
      {allTargets.map((t, i) => (
        <circle
          key={`pulse:${t.id}`}
          cx={t.x}
          cy={t.y}
          r={t.r + 6}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth={1.2}
          strokeOpacity={0.65}
          style={{
            ...(reduceMotion ? {} : {
              animation: `universe-trajectory-pulse 2.8s ease-in-out infinite`,
              animationDelay: `${i * 120}ms`,
            }),
          }}
        />
      ))}

      <style>{`
        @keyframes universe-trajectory-pulse {
          0%, 100% { stroke-opacity: 0.65; }
          50%      { stroke-opacity: 0.20; }
        }
        @keyframes universe-trajectory-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </g>
  );
}
