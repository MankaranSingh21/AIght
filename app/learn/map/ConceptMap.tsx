'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Desktop geometry ──────────────────────────────────────────────
const D_T1X = 170;   // Track 1 — HOW AI THINKS (left)
const D_T2X = 530;   // Track 2 — HOW AI ACTS   (right)
const D_NW  = 200;
const D_NH  = 92;
const D_VW  = 700;
const D_VH  = 680;

// ── Mobile geometry ───────────────────────────────────────────────
const M_CX = 160;
const M_NW = 260;
const M_NH = 88;
const M_VW = 320;
const M_VH = 910;

// ── Node data ─────────────────────────────────────────────────────
// Track 1 "How AI thinks": Transformers → Embeddings → Fine-tuning
// Track 2 "How AI acts":   RAG → Agents → MCP
const NODES = [
  { id: 'transformers', title: 'Transformers', tagline: 'How machines learn to read',  slug: 'transformers', difficulty: 3, dCx: D_T1X, dCy: 100, mCy: 82  },
  { id: 'embeddings',   title: 'Embeddings',   tagline: 'Meaning, made numeric',       slug: 'embeddings',   difficulty: 2, dCx: D_T1X, dCy: 250, mCy: 220 },
  { id: 'fine-tuning',  title: 'Fine-tuning',  tagline: 'Teaching models new tasks',   slug: 'fine-tuning',  difficulty: 3, dCx: D_T1X, dCy: 400, mCy: 358 },
  { id: 'rag',          title: 'RAG',          tagline: 'Memory on demand',            slug: 'rag',          difficulty: 2, dCx: D_T2X, dCy: 250, mCy: 520 },
  { id: 'agents',       title: 'Agents',       tagline: 'Models that take action',     slug: 'agents',       difficulty: 2, dCx: D_T2X, dCy: 400, mCy: 658 },
  { id: 'mcp',          title: 'MCP',          tagline: 'How tools talk to models',    slug: 'mcp',          difficulty: 1, dCx: D_T2X, dCy: 550, mCy: 796 },
];

// ── Desktop path helpers ──────────────────────────────────────────
function sPath(x: number, y1: number, y2: number, w = 18): string {
  const my = (y1 + y2) / 2;
  return `M ${x},${y1} C ${x - w},${my - 12} ${x + w},${my + 12} ${x},${y2}`;
}

// Track 1 connectors
const D_PATH_T1a = sPath(D_T1X, 100 + D_NH / 2, 250 - D_NH / 2);  // T → E
const D_PATH_T1b = sPath(D_T1X, 250 + D_NH / 2, 400 - D_NH / 2);  // E → FT
// Track 2 connectors
const D_PATH_T2a = sPath(D_T2X, 250 + D_NH / 2, 400 - D_NH / 2);  // RAG → Agents
const D_PATH_T2b = sPath(D_T2X, 400 + D_NH / 2, 550 - D_NH / 2);  // Agents → MCP

// Horizontal bridge: Embeddings ↔ RAG (both at dCy=250)
const D_BX1 = D_T1X + D_NW / 2;         // 270
const D_BX2 = D_T2X - D_NW / 2;         // 430
const D_BMX = (D_BX1 + D_BX2) / 2;      // 350
const D_BY  = 250;
const BRIDGE = `M ${D_BX1},${D_BY} C ${D_BMX - 20},${D_BY - 38} ${D_BMX + 20},${D_BY - 38} ${D_BX2},${D_BY}`;

// ── Mobile straight-line paths ────────────────────────────────────
const M_LINES = [
  { y1: 82  + M_NH / 2, y2: 220 - M_NH / 2 },   // T  → E
  { y1: 220 + M_NH / 2, y2: 358 - M_NH / 2 },   // E  → FT
  { y1: 520 + M_NH / 2, y2: 658 - M_NH / 2 },   // RAG → Agents
  { y1: 658 + M_NH / 2, y2: 796 - M_NH / 2 },   // Agents → MCP
];

// START HERE indicator — left of Transformers
const START_CX = D_T1X - D_NW / 2 - 20;   // 50
const START_CY = 100;

// ── Component ─────────────────────────────────────────────────────
export default function ConceptMap() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    setMounted(true);
    return () => window.removeEventListener('resize', check);
  }, []);

  const vw = isMobile ? M_VW : D_VW;
  const vh = isMobile ? M_VH : D_VH;

  function pos(node: typeof NODES[0]) {
    const cx = isMobile ? M_CX     : node.dCx;
    const cy = isMobile ? node.mCy : node.dCy;
    const nw = isMobile ? M_NW     : D_NW;
    const nh = isMobile ? M_NH     : D_NH;
    return { cx, cy, x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh };
  }

  const LABEL_STYLE: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fill: 'var(--text-muted)',
    letterSpacing: '0.12em',
  };

  function DifficultyDots({ cx, cy, count, nw, nh }: {
    cx: number; cy: number; count: number; nw: number; nh: number;
  }) {
    const dotY  = cy + nh / 2 - 22;
    const startX = cx - nw / 2 + 12;
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <circle
            key={i}
            cx={startX + i * 10}
            cy={dotY}
            r={3}
            fill={i < count ? 'var(--accent-primary)' : 'var(--border-default)'}
            style={{ transition: 'fill 200ms ease', pointerEvents: 'none' }}
          />
        ))}
      </>
    );
  }

  function DemoBadge({ cx, cy, nw, nh }: {
    cx: number; cy: number; nw: number; nh: number;
  }) {
    const bW = 52;
    const bH = 16;
    const bx = cx + nw / 2 - bW - 6;
    const by = cy + nh / 2 - bH - 6;
    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect x={bx} y={by} width={bW} height={bH} rx={3}
          fill="var(--accent-primary-glow)" stroke="var(--border-emphasis)" strokeWidth={1} />
        <text x={bx + bW / 2} y={by + bH / 2}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--accent-primary)',
                   letterSpacing: '0.04em', userSelect: 'none' }}>
          ◉ demo
        </text>
      </g>
    );
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        style={{ width: '100%', maxWidth: isMobile ? '360px' : '700px',
                 height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' }}
        aria-label="Concept map — How AI thinks, How AI acts"
      >
        {/* ── Connector paths ─────────────────────────────────── */}
        {isMobile ? (
          M_LINES.map((l, i) => (
            <line key={i} x1={M_CX} y1={l.y1} x2={M_CX} y2={l.y2}
              stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
          ))
        ) : (
          <>
            <path d={D_PATH_T1a} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
            <path d={D_PATH_T1b} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
            <path d={D_PATH_T2a} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
            <path d={D_PATH_T2b} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
          </>
        )}

        {/* ── Desktop: bridge + label ──────────────────────────── */}
        {!isMobile && (
          <>
            <path d={BRIDGE} fill="none" stroke="var(--accent-primary)"
              strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="4 4" />
            <text x={D_BMX} y={D_BY - 48} textAnchor="middle" style={LABEL_STYLE}>
              where it connects
            </text>
          </>
        )}

        {/* ── Mobile: separator ────────────────────────────────── */}
        {isMobile && (
          <>
            <line x1={70} y1={432} x2={250} y2={432}
              stroke="var(--border-subtle)" strokeWidth={1} />
            <text x={M_CX} y={415} textAnchor="middle" style={LABEL_STYLE}>
              where it connects
            </text>
          </>
        )}

        {/* ── Track labels ─────────────────────────────────────── */}
        {!isMobile ? (
          <>
            <text x={D_T1X} y={35}  textAnchor="middle" style={LABEL_STYLE}>HOW AI THINKS</text>
            <text x={D_T2X} y={196} textAnchor="middle" style={LABEL_STYLE}>HOW AI ACTS</text>
          </>
        ) : (
          <>
            <text x={M_CX} y={22}  textAnchor="middle" style={LABEL_STYLE}>HOW AI THINKS</text>
            <text x={M_CX} y={462} textAnchor="middle" style={LABEL_STYLE}>HOW AI ACTS</text>
          </>
        )}

        {/* ── START HERE indicator (desktop only) ──────────────── */}
        {!isMobile && mounted && (
          <g style={{ pointerEvents: 'none' }}>
            <circle className="map-start-pulse"
              cx={START_CX} cy={START_CY} r={5}
              fill="none" stroke="var(--accent-primary)" strokeWidth={2} />
            <circle cx={START_CX} cy={START_CY} r={4} fill="var(--accent-primary)" />
            <text x={START_CX} y={START_CY + 18} textAnchor="middle"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 9,
                       fill: 'var(--accent-primary)', letterSpacing: '0.06em', userSelect: 'none' }}>
              start here
            </text>
          </g>
        )}

        {/* ── Nodes ────────────────────────────────────────────── */}
        {NODES.map((node, i) => {
          const p = pos(node);
          return (
            <g key={node.id}
              style={mounted
                ? { animation: `fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms both` }
                : { opacity: 0 }}>
              <g
                className="concept-node"
                role="button"
                tabIndex={0}
                aria-label={`Learn about ${node.title}`}
                style={{ cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => router.push(`/learn/${node.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/learn/${node.slug}`); }}
              >
                {/* Background */}
                <rect className="concept-node-rect"
                  x={p.x} y={p.y} width={p.w} height={p.h} rx={12}
                  fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth={1} />

                {/* Title — Space Grotesk 15px 600 */}
                <text className="concept-node-title"
                  x={p.cx} y={p.cy - 22}
                  textAnchor="middle" dominantBaseline="middle"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600,
                           fill: 'var(--text-primary)', userSelect: 'none',
                           letterSpacing: '-0.02em', pointerEvents: 'none' }}>
                  {node.title}
                </text>

                {/* Tagline — Lora italic 12px */}
                <text x={p.cx} y={p.cy - 4}
                  textAnchor="middle" dominantBaseline="middle"
                  style={{ fontFamily: 'var(--font-editorial)', fontSize: 12, fontStyle: 'italic',
                           fill: 'var(--text-secondary)', userSelect: 'none', pointerEvents: 'none' }}>
                  {node.tagline}
                </text>

                {/* Difficulty dots — left side of node bottom */}
                <DifficultyDots cx={p.cx} cy={p.cy} count={node.difficulty} nw={p.w} nh={p.h} />

                {/* ◉ demo badge — bottom-right, all nodes */}
                <DemoBadge cx={p.cx} cy={p.cy} nw={p.w} nh={p.h} />

                {/* CSS tooltip — hidden by default, shown on hover / always on mobile */}
                <g className="concept-tooltip">
                  {/* Arrow pointing up */}
                  <polygon
                    points={`${p.cx - 5},${p.y + p.h + 8} ${p.cx + 5},${p.y + p.h + 8} ${p.cx},${p.y + p.h + 2}`}
                    fill="var(--bg-elevated)"
                    style={{ pointerEvents: 'none' }}
                  />
                  {/* Box */}
                  <rect
                    x={p.x - 4} y={p.y + p.h + 8}
                    width={p.w + 8} height={28} rx={8}
                    fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth={1} />
                  {/* Text */}
                  <text x={p.cx} y={p.y + p.h + 25}
                    textAnchor="middle"
                    style={{ fontFamily: 'var(--font-editorial)', fontSize: 11, fontStyle: 'italic',
                             fill: 'var(--text-secondary)', userSelect: 'none', pointerEvents: 'none' }}>
                    {node.tagline}
                  </text>
                </g>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)', textAlign: 'center',
                  marginTop: 'var(--space-6)', letterSpacing: '0.05em' }}>
        <span style={{ color: 'var(--accent-primary)' }}>● ● ●</span>{' '}Complex
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style={{ color: 'var(--accent-primary)' }}>● ●</span>{' '}
        <span style={{ color: 'var(--border-default)' }}>●</span>{' '}Medium
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style={{ color: 'var(--accent-primary)' }}>●</span>{' '}
        <span style={{ color: 'var(--border-default)' }}>● ●</span>{' '}Approachable
      </p>
    </div>
  );
}
