'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Desktop geometry ──────────────────────────────────────────────
const D_T1X = 170;   // HOW AI THINKS (left column)
const D_T2X = 530;   // HOW AI ACTS   (right column)
const D_T3X = 350;   // HOW AI LEARNS (center, single node)
const D_NW  = 200;
const D_NH  = 92;    // taller to fit dots + badge
const D_VW  = 700;
const D_VH  = 760;

// ── Mobile geometry ───────────────────────────────────────────────
const M_CX = 160;
const M_NW = 260;
const M_NH = 88;
const M_VW = 320;
const M_VH = 910;

// ── Node data ─────────────────────────────────────────────────────
const NODES = [
  {
    id: 'transformers', title: 'Transformers',
    tagline: 'How machines learn to read',
    slug: 'transformers', difficulty: 3, hasDemo: false,
    dCx: D_T1X, dCy: 80,  mCy: 82,
  },
  {
    id: 'embeddings', title: 'Embeddings',
    tagline: 'Meaning, made numeric',
    slug: 'embeddings', difficulty: 2, hasDemo: false,
    dCx: D_T1X, dCy: 222, mCy: 220,
  },
  {
    id: 'fine-tuning', title: 'Fine-tuning',
    tagline: 'Teaching models new tasks',
    slug: 'fine-tuning', difficulty: 3, hasDemo: false,
    dCx: D_T3X, dCy: 642, mCy: 358,
  },
  {
    id: 'rag', title: 'RAG',
    tagline: 'Memory on demand',
    slug: 'rag', difficulty: 2, hasDemo: true,
    dCx: D_T2X, dCy: 222, mCy: 520,
  },
  {
    id: 'agents', title: 'Agents',
    tagline: 'Models that take action',
    slug: 'agents', difficulty: 2, hasDemo: false,
    dCx: D_T2X, dCy: 362, mCy: 658,
  },
  {
    id: 'mcp', title: 'MCP',
    tagline: 'How tools talk to models',
    slug: 'mcp', difficulty: 1, hasDemo: true,
    dCx: D_T2X, dCy: 502, mCy: 796,
  },
];

// ── Desktop path helpers ──────────────────────────────────────────
function sPath(x: number, y1: number, y2: number, w = 18): string {
  const my = (y1 + y2) / 2;
  return `M ${x},${y1} C ${x - w},${my - 12} ${x + w},${my + 12} ${x},${y2}`;
}

// Track 1: Transformers → Embeddings
const D_PATH_T1 = sPath(D_T1X, 80 + D_NH / 2, 222 - D_NH / 2);
// Track 2: RAG → Agents → MCP
const D_PATH_T2A = sPath(D_T2X, 222 + D_NH / 2, 362 - D_NH / 2);
const D_PATH_T2B = sPath(D_T2X, 362 + D_NH / 2, 502 - D_NH / 2);

// Horizontal bridge: Embeddings ↔ RAG (both at dCy=222)
const D_BX1 = D_T1X + D_NW / 2;  // 270
const D_BX2 = D_T2X - D_NW / 2;  // 430
const D_BMX = (D_BX1 + D_BX2) / 2;  // 350
const D_BY  = 222;
const BRIDGE = `M ${D_BX1},${D_BY} C ${D_BMX - 20},${D_BY - 38} ${D_BMX + 20},${D_BY - 38} ${D_BX2},${D_BY}`;

// Fine-tuning diagonals: from Fine-tuning top to Transformers/Embeddings bottoms
const FT_TOP  = 642 - D_NH / 2;       // ≈ 596
const T_BOT   = 80  + D_NH / 2;       // ≈ 126
const E_BOT   = 222 + D_NH / 2;       // ≈ 268
const FT_PATH_T = `M ${D_T3X},${FT_TOP} C 280,450 210,280 ${D_T1X},${T_BOT}`;
const FT_PATH_E = `M ${D_T3X},${FT_TOP} C 290,510 220,390 ${D_T1X},${E_BOT}`;

// ── Mobile straight-line paths ────────────────────────────────────
const M_LINES = [
  { y1: 82  + M_NH / 2, y2: 220 - M_NH / 2 },   // T  → E
  { y1: 220 + M_NH / 2, y2: 358 - M_NH / 2 },   // E  → FT
  { y1: 520 + M_NH / 2, y2: 658 - M_NH / 2 },   // RAG → Agents
  { y1: 658 + M_NH / 2, y2: 796 - M_NH / 2 },   // Agents → MCP
];

// ── Component ─────────────────────────────────────────────────────
export default function ConceptMap() {
  const router = useRouter();
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [focused,  setFocused]  = useState<string | null>(null);
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
    const cx = isMobile ? M_CX       : node.dCx;
    const cy = isMobile ? node.mCy   : node.dCy;
    const nw = isMobile ? M_NW       : D_NW;
    const nh = isMobile ? M_NH       : D_NH;
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
    const dotY = cy + nh / 2 - 20;
    const spacing = 10;
    const startX = cx - ((count - 1) * spacing) / 2;
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <circle
            key={i}
            cx={startX + i * spacing}
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
    const badgeW = 52;
    const badgeH = 16;
    const bx = cx + nw / 2 - badgeW - 6;
    const by = cy + nh / 2 - badgeH - 6;
    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect
          x={bx} y={by}
          width={badgeW} height={badgeH} rx={3}
          fill="var(--accent-primary-glow)"
          stroke="var(--border-emphasis)"
          strokeWidth={1}
        />
        <text
          x={bx + badgeW / 2}
          y={by + badgeH / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fill: 'var(--accent-primary)',
            letterSpacing: '0.04em',
            userSelect: 'none',
          }}
        >
          ◉ demo
        </text>
      </g>
    );
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        style={{
          width: '100%',
          maxWidth: isMobile ? '360px' : '700px',
          height: 'auto',
          display: 'block',
          margin: '0 auto',
        }}
        aria-label="Concept map — How AI thinks, How AI acts, How AI learns"
      >
        {/* ── Connector paths ─────────────────────────────────── */}

        {isMobile ? (
          M_LINES.map((l, i) => (
            <line
              key={i}
              x1={M_CX} y1={l.y1}
              x2={M_CX} y2={l.y2}
              stroke="var(--accent-primary)"
              strokeWidth={1.5}
              strokeOpacity={0.3}
            />
          ))
        ) : (
          <>
            <path d={D_PATH_T1}  fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
            <path d={D_PATH_T2A} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
            <path d={D_PATH_T2B} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} strokeOpacity={0.3} />
          </>
        )}

        {/* Desktop: bridge + Fine-tuning diagonal connectors */}
        {!isMobile && (
          <>
            <path
              d={BRIDGE}
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth={1.5}
              strokeOpacity={0.3}
              strokeDasharray="4 4"
            />
            <text x={D_BMX} y={D_BY - 48} textAnchor="middle" style={LABEL_STYLE}>
              where it connects
            </text>
            {/* Fine-tuning → Transformers */}
            <path
              d={FT_PATH_T}
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth={1.5}
              strokeOpacity={0.25}
              strokeDasharray="4 4"
            />
            {/* Fine-tuning → Embeddings */}
            <path
              d={FT_PATH_E}
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth={1.5}
              strokeOpacity={0.25}
              strokeDasharray="4 4"
            />
          </>
        )}

        {/* Mobile: separator between foundational and applied */}
        {isMobile && (
          <>
            <line x1={70} y1={432} x2={250} y2={432} stroke="var(--border-subtle)" strokeWidth={1} />
            <text x={M_CX} y={415} textAnchor="middle" style={LABEL_STYLE}>
              where it connects
            </text>
          </>
        )}

        {/* ── Track labels ─────────────────────────────────────── */}
        {!isMobile ? (
          <>
            <text x={D_T1X} y={28} textAnchor="middle" style={LABEL_STYLE}>HOW AI THINKS</text>
            <text x={D_T2X} y={168} textAnchor="middle" style={LABEL_STYLE}>HOW AI ACTS</text>
            <text x={D_T3X} y={570} textAnchor="middle" style={LABEL_STYLE}>HOW AI LEARNS</text>
          </>
        ) : (
          <>
            <text x={M_CX} y={22} textAnchor="middle" style={LABEL_STYLE}>HOW AI THINKS</text>
            <text x={M_CX} y={462} textAnchor="middle" style={LABEL_STYLE}>HOW AI ACTS</text>
          </>
        )}

        {/* ── Nodes ────────────────────────────────────────────── */}
        {NODES.map((node, i) => {
          const p   = pos(node);
          const isHov = hovered === node.id;
          const isFoc = focused === node.id;
          const delay = i * 80;

          return (
            <g
              key={node.id}
              style={
                mounted
                  ? { animation: `fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }
                  : { opacity: 0 }
              }
            >
              <g
                className="concept-node"
                role="button"
                tabIndex={0}
                aria-label={`Learn about ${node.title}`}
                style={{
                  cursor: 'pointer',
                  transformOrigin: `${p.cx}px ${p.cy}px`,
                  transform: isHov ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 200ms ease',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setFocused(node.id)}
                onBlur={() => setFocused(null)}
                onClick={() => router.push(`/learn/${node.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/learn/${node.slug}`); }}
              >
                {/* Node background */}
                <rect
                  x={p.x} y={p.y} width={p.w} height={p.h} rx={12}
                  fill="var(--bg-surface)"
                  stroke={
                    isFoc  ? 'var(--accent-primary)' :
                    isHov  ? 'var(--border-emphasis)' :
                             'var(--border-default)'
                  }
                  strokeWidth={isFoc ? 1.5 : 1}
                  style={{ transition: 'stroke 200ms ease' }}
                />

                {/* Title — Space Grotesk 16px 600 */}
                <text
                  x={p.cx}
                  y={p.cy - (isMobile ? 22 : 24)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 16,
                    fontWeight: 600,
                    fill: isHov ? 'var(--accent-primary)' : 'var(--text-primary)',
                    transition: 'fill 200ms ease',
                    userSelect: 'none',
                    letterSpacing: '-0.02em',
                    pointerEvents: 'none',
                  }}
                >
                  {node.title}
                </text>

                {/* Tagline — Lora italic 12px */}
                <text
                  x={p.cx}
                  y={p.cy - (isMobile ? 4 : 4)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 12,
                    fontStyle: 'italic',
                    fill: 'var(--text-secondary)',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {node.tagline}
                </text>

                {/* Difficulty dots — 1-3 filled circles */}
                <DifficultyDots
                  cx={p.cx} cy={p.cy}
                  count={node.difficulty}
                  nw={p.w} nh={p.h}
                />

                {/* Interactive demo badge (bottom-right, only for nodes with demos) */}
                {node.hasDemo && (
                  <DemoBadge cx={p.cx} cy={p.cy} nw={p.w} nh={p.h} />
                )}

                {/* Hover tooltip */}
                <g className="concept-tooltip">
                  <rect
                    x={p.x - 2}
                    y={p.y + p.h + 5}
                    width={p.w + 4}
                    height={22}
                    rx={4}
                    fill="var(--bg-elevated)"
                    stroke="var(--border-emphasis)"
                    strokeWidth={1}
                  />
                  <text
                    x={p.cx}
                    y={p.y + p.h + 19}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: 11,
                      fontStyle: 'italic',
                      fill: 'var(--accent-primary)',
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    {node.tagline}
                  </text>
                </g>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: 'var(--space-4)',
          letterSpacing: '0.05em',
        }}
      >
        ● More complex &nbsp;&nbsp; ○ Easier to start
      </p>
    </div>
  );
}
