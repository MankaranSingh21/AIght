/**
 * Single source of truth for the AIght five-axis radar geometry.
 *
 * Consumers:
 *   - `components/ToolDetail.tsx` — single-tool `<RadarChart scores={...}>` with legend
 *   - `app/compare/page.tsx`     — two-tool `<CompareRadar>` overlay
 *
 * Both share the same axes, ring proportions, and `radarPoint()` math — keep
 * that here so a change to axis count or ring density only happens once.
 */

import type { JSX } from "react";

export interface RadarAxis {
  label: string;
  color: string;
}

export const RADAR_AXES: RadarAxis[] = [
  { label: "Utility",      color: "#AAFF4D" },
  { label: "Privacy",      color: "#00FFD1" },
  { label: "Speed",        color: "#FFD100" },
  { label: "Cost",         color: "#B088FF" },
  { label: "Transparency", color: "#F4AB1F" },
];

const N = RADAR_AXES.length;
const ANGLES = Array.from({ length: N }, (_, i) => (360 / N) * i);
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1] as const;

/**
 * Map an (angle°, radius) polar coord to (x, y) on a 200×200 SVG centred at (100,100).
 */
export function radarPoint(angle: number, r: number, cx = 100, cy = 100): readonly [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

function clamp100(s: number): number {
  return Math.max(0, Math.min(100, s));
}

function polygonPoints(scores: number[], maxR: number): string {
  return scores
    .map((s, i) => radarPoint(ANGLES[i], (clamp100(s) / 100) * maxR))
    .map((p) => p.join(","))
    .join(" ");
}

function gridRings(maxR: number): string[] {
  return RING_FRACTIONS.map((t) =>
    ANGLES.map((a) => radarPoint(a, maxR * t)).map((p) => p.join(",")).join(" ")
  );
}

function axisLines(maxR: number) {
  return ANGLES.map((a) => {
    const [x, y] = radarPoint(a, maxR);
    return { x, y };
  });
}

const GRID_STROKE = "rgba(245,239,224,0.07)";

// ── Single-tool radar with legend ──────────────────────────────────────────────

export function RadarChart({ scores }: { scores: number[] }): JSX.Element {
  const maxR = 72;
  const rings = gridRings(maxR);
  const axes = axisLines(maxR);
  const scorePoints = scores.map((s, i) => radarPoint(ANGLES[i], (clamp100(s) / 100) * maxR));
  const polygon = scorePoints.map((p) => p.join(",")).join(" ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
      <svg viewBox="0 0 200 200" width={200} height={200} style={{ flexShrink: 0, overflow: "visible" }}>
        {rings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke={GRID_STROKE} strokeWidth={1} />
        ))}
        {axes.map(({ x, y }, i) => (
          <line key={i} x1={100} y1={100} x2={x} y2={y} stroke={GRID_STROKE} strokeWidth={1} />
        ))}
        <polygon
          points={polygon}
          fill="rgba(170,255,77,0.12)"
          stroke="#AAFF4D"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {scorePoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill={RADAR_AXES[i].color} />
        ))}
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {RADAR_AXES.map(({ label, color }, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,239,224,0.50)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {label}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color, marginLeft: "auto", minWidth: 24, textAlign: "right" }}>
              {scores[i].toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Two-tool overlay radar (no legend — labels rendered around the chart) ─────

export interface CompareRadarProps {
  scoresA: number[];
  scoresB: number[];
  colorA: string;
  colorB: string;
}

export function CompareRadar({ scoresA, scoresB, colorA, colorB }: CompareRadarProps): JSX.Element {
  const maxR = 72;
  const rings = gridRings(maxR);
  const axes = axisLines(maxR);
  const polyA = polygonPoints(scoresA, maxR);
  const polyB = polygonPoints(scoresB, maxR);
  const labels = ANGLES.map((a, i) => {
    const [x, y] = radarPoint(a, maxR + 22);
    return { x, y, label: RADAR_AXES[i].label };
  });

  return (
    <svg viewBox="0 0 200 200" width={280} height={280} style={{ flexShrink: 0, overflow: "visible" }} aria-hidden>
      {rings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke={GRID_STROKE} strokeWidth={1} />
      ))}
      {axes.map(({ x, y }, i) => (
        <line key={i} x1={100} y1={100} x2={x} y2={y} stroke={GRID_STROKE} strokeWidth={1} />
      ))}
      {/* Tool B drawn first, behind */}
      <polygon points={polyB} fill={colorB} fillOpacity={0.18} stroke={colorB} strokeWidth={1.5} strokeLinejoin="round" />
      {/* Tool A on top */}
      <polygon points={polyA} fill={colorA} fillOpacity={0.20} stroke={colorA} strokeWidth={1.5} strokeLinejoin="round" />
      {labels.map(({ x, y, label }) => (
        <text
          key={label}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fill: "rgba(245,239,224,0.55)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
