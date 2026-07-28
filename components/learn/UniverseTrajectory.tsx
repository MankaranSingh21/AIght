"use client";

import { useEffect, useState } from "react";
import { loadQuizResult, type StoredQuizResult, QUIZ_CHANGED_EVENT } from "@/lib/quiz-storage";
import type { PositionedGraph, PositionedNode } from "@/lib/universe-layout";
import type { UniverseIndex } from "@/lib/universe-adjacency";

interface UniverseTrajectoryProps {
  graph: PositionedGraph;
  index: UniverseIndex;
}

// Reads a stored quiz result from localStorage and overlays a glowing path
// inside the parent UniverseSVG. Rendered as an inline <g>.
export default function UniverseTrajectory({ graph, index }: UniverseTrajectoryProps) {
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

  const fieldNode = index.nodeById.get(`field:${stored.fieldSlug}`);
  if (!fieldNode) return null;

  // The quiz now writes these from the curated field roadmap + tool map, so the
  // old "fall back to raw graph adjacency" branch is gone. An empty array here
  // means a pre-fix result is still in localStorage; showing nothing is correct.
  const targetConcepts: PositionedNode[] = stored.recommendedConceptSlugs
    .map((slug) => index.nodeById.get(`concept:${slug}`))
    .filter((n): n is PositionedNode => Boolean(n))
    .slice(0, 3);

  const targetTools: PositionedNode[] = stored.recommendedToolSlugs
    .map((slug) => index.nodeById.get(`tool:${slug}`))
    .filter((n): n is PositionedNode => Boolean(n))
    .slice(0, 5);

  // Bow the path away from the centre. On concentric rings a straight line from
  // a field to a ring-0 concept would pass straight through the densest area.
  function lineFromTo(a: PositionedNode, b: PositionedNode): string {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const vx = mx - graph.centre.x;
    const vy = my - graph.centre.y;
    const len = Math.hypot(vx, vy) || 1;
    const bow = Math.min(Math.hypot(b.x - a.x, b.y - a.y) * 0.16, 160);
    return `M ${a.x} ${a.y} Q ${mx + (vx / len) * bow} ${my + (vy / len) * bow}, ${b.x} ${b.y}`;
  }

  const allTargets: PositionedNode[] = [...targetConcepts, ...targetTools];

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

      {/* Glowing edges from field to each target — sequenced draw, 160ms apart */}
      {allTargets.map((t, i) => {
        const delay = i * 160;
        return (
          <g key={t.id}>
            <path
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
                  animation: `universe-trajectory-draw 700ms cubic-bezier(0.16,1,0.3,1) forwards ${delay}ms`,
                }),
              }}
            />
            {/* Trail dot — one-shot lime spark that lands at the target node */}
            {!reduceMotion && (
              <circle
                r={3.5}
                fill="var(--accent-primary)"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(170,255,77,0.75))",
                  opacity: 0,
                  // SMIL animation along the path
                }}
              >
                <animateMotion
                  dur="700ms"
                  begin={`${delay}ms`}
                  fill="freeze"
                  path={lineFromTo(fieldNode, t)}
                  rotate="auto"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="700ms"
                  begin={`${delay}ms`}
                  fill="freeze"
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* Pulse rings at target nodes — fire after their path lands */}
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
              // Start the pulse after the path draws in
              animationDelay: `${i * 160 + 700}ms`,
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
