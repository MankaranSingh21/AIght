'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Geometry constants ────────────────────────────────────────────

const D_T1X = 170, D_T2X = 530;
const D_NW = 200, D_NH = 75;
const D_VW = 700, D_VH = 660;

const M_CX = 160;
const M_NW = 260, M_NH = 70;
const M_VW = 320, M_VH = 820;

// ── Node data (positions baked in) ───────────────────────────────

const NODES = [
  { id: 'transformers', title: 'Transformers', tagline: 'How machines learn to read', slug: 'transformers', dCx: D_T1X, dCy: 90,  mCy: 65  },
  { id: 'embeddings',   title: 'Embeddings',   tagline: 'Meaning, made numeric',       slug: 'embeddings',   dCx: D_T1X, dCy: 255, mCy: 195 },
  { id: 'fine-tuning',  title: 'Fine-tuning',  tagline: 'Teaching models new tasks',   slug: 'fine-tuning',  dCx: D_T1X, dCy: 420, mCy: 325 },
  { id: 'rag',          title: 'RAG',          tagline: 'Memory on demand',            slug: 'rag',          dCx: D_T2X, dCy: 255, mCy: 510 },
  { id: 'agents',       title: 'Agents',       tagline: 'Models that take action',     slug: 'agents',       dCx: D_T2X, dCy: 420, mCy: 640 },
  { id: 'mcp',          title: 'MCP',          tagline: 'How tools talk to models',    slug: 'mcp',          dCx: D_T2X, dCy: 585, mCy: 760 },
];

// ── Path helpers ──────────────────────────────────────────────────

// Gentle S-curve between two y-positions at a given x
function sPath(x: number, y1: number, y2: number, w = 25): string {
  const my = (y1 + y2) / 2;
  return `M ${x},${y1} C ${x - w},${my - 15} ${x + w},${my + 15} ${x},${y2}`;
}

const D_PATHS = [
  sPath(D_T1X, 90 + D_NH / 2,  255 - D_NH / 2),
  sPath(D_T1X, 255 + D_NH / 2, 420 - D_NH / 2),
  sPath(D_T2X, 255 + D_NH / 2, 420 - D_NH / 2),
  sPath(D_T2X, 420 + D_NH / 2, 585 - D_NH / 2),
];

const M_PATHS = [
  sPath(M_CX, 65 + M_NH / 2,  195 - M_NH / 2, 18),
  sPath(M_CX, 195 + M_NH / 2, 325 - M_NH / 2, 18),
  sPath(M_CX, 510 + M_NH / 2, 640 - M_NH / 2, 18),
  sPath(M_CX, 640 + M_NH / 2, 760 - M_NH / 2, 18),
];

// Horizontal arching bridge — Embeddings right edge → RAG left edge
const D_BX1 = D_T1X + D_NW / 2;           // 270
const D_BX2 = D_T2X - D_NW / 2;           // 430
const D_BMX = (D_BX1 + D_BX2) / 2;        // 350
const D_BY  = 255;                          // shared y for Embeddings & RAG
const BRIDGE = `M ${D_BX1},${D_BY} C ${D_BMX - 20},${D_BY - 35} ${D_BMX + 20},${D_BY - 35} ${D_BX2},${D_BY}`;

// ── Component ─────────────────────────────────────────────────────

export default function ConceptMap() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    setMounted(true);
    return () => window.removeEventListener('resize', check);
  }, []);

  const vw = isMobile ? M_VW : D_VW;
  const vh = isMobile ? M_VH : D_VH;
  const paths = isMobile ? M_PATHS : D_PATHS;

  function pos(node: typeof NODES[0]) {
    const cx = isMobile ? M_CX : node.dCx;
    const cy = isMobile ? node.mCy : node.dCy;
    const nw = isMobile ? M_NW : D_NW;
    const nh = isMobile ? M_NH : D_NH;
    return { cx, cy, x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh };
  }

  const LABEL_STYLE: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fill: 'var(--text-muted)',
    letterSpacing: '0.12em',
  };

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      style={{
        width: '100%',
        maxWidth: isMobile ? '360px' : '700px',
        height: 'auto',
        display: 'block',
        margin: '0 auto',
      }}
      aria-label="Concept map — How AI thinks and How AI acts"
    >
      {/* Within-track connector paths */}
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth={1.5}
          strokeOpacity={0.3}
        />
      ))}

      {/* Desktop: arching bridge + label */}
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
          <text x={D_BMX} y={D_BY - 52} textAnchor="middle" style={LABEL_STYLE}>
            where it connects
          </text>
        </>
      )}

      {/* Mobile: separator line + label between tracks */}
      {isMobile && (
        <>
          <line x1={70} y1={418} x2={250} y2={418} stroke="var(--border-subtle)" strokeWidth={1} />
          <text x={M_CX} y={400} textAnchor="middle" style={LABEL_STYLE}>
            where it connects
          </text>
        </>
      )}

      {/* Track labels */}
      {!isMobile ? (
        <>
          <text x={D_T1X} y={25} textAnchor="middle" style={LABEL_STYLE}>HOW AI THINKS</text>
          <text x={D_T2X} y={195} textAnchor="middle" style={LABEL_STYLE}>HOW AI ACTS</text>
        </>
      ) : (
        <>
          <text x={M_CX} y={22} textAnchor="middle" style={LABEL_STYLE}>HOW AI THINKS</text>
          <text x={M_CX} y={452} textAnchor="middle" style={LABEL_STYLE}>HOW AI ACTS</text>
        </>
      )}

      {/* Nodes — outer <g> animates, inner <g> handles hover */}
      {NODES.map((node, i) => {
        const p = pos(node);
        const isHov = hovered === node.id;
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
              role="button"
              tabIndex={0}
              aria-label={`Learn about ${node.title}`}
              style={{
                cursor: 'pointer',
                transformOrigin: `${p.cx}px ${p.cy}px`,
                transform: isHov ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 200ms ease',
              }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => router.push(`/learn/${node.slug}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/learn/${node.slug}`); }}
            >
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                rx={12}
                fill="var(--bg-surface)"
                stroke={isHov ? 'var(--border-emphasis)' : 'var(--border-default)'}
                strokeWidth={1}
                style={{ transition: 'stroke 200ms ease' }}
              />
              {/* Title */}
              <text
                x={p.cx}
                y={p.cy - (isMobile ? 8 : 10)}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: isMobile ? 15 : 16,
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
              {/* Tagline */}
              <text
                x={p.cx}
                y={p.cy + (isMobile ? 12 : 14)}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 13,
                  fontStyle: 'italic',
                  fill: 'var(--text-secondary)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {node.tagline}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
