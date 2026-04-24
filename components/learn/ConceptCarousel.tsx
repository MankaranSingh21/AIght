'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

/* ── Concept data ─────────────────────────────────────────────────────────── */

const CONCEPTS = [
  {
    slug: 'rag',
    index: '01',
    title: 'Retrieval-Augmented Generation',
    tagline: 'How AI learned to look things up before answering',
    readTime: '8 min read',
    logLine: '> loading context from knowledge base...',
    body: 'Language models are frozen in time — they know only what they knew when training ended. RAG gives them a research assistant who can sprint to the right source before the model ever speaks.',
  },
  {
    slug: 'agents',
    index: '02',
    title: 'AI Agents',
    tagline: 'When AI stops answering and starts doing',
    readTime: '9 min read',
    logLine: '> initializing loop: observe → think → act → repeat',
    body: 'A chatbot gives you an answer and waits. An agent takes a goal, breaks it into steps, executes them, watches what happens, and adjusts — the loop is what makes it an agent.',
  },
  {
    slug: 'embeddings',
    index: '03',
    title: 'Embeddings',
    tagline: 'The coordinates that give language a sense of direction',
    readTime: '7 min read',
    logLine: '> mapping 1536 dimensions of meaning...',
    body: 'An embedding is a list of numbers — coordinates in a space where similar ideas cluster together and distant ideas live far apart. The geometry is what makes search, comparison, and recommendation actually work.',
  },
  {
    slug: 'transformers',
    index: '04',
    title: 'Transformers',
    tagline: 'The architecture that changed what AI could do with language',
    readTime: '8 min read',
    logLine: '> attending to all tokens simultaneously...',
    body: 'Old models read one word at a time, dragging a fading memory forward. The Transformer reads everything at once and uses attention to decide which parts matter for understanding each part — that one change unlocked almost everything.',
  },
  {
    slug: 'mcp',
    index: '05',
    title: 'Model Context Protocol',
    tagline: 'The open standard that lets AI models talk to your tools',
    readTime: '7 min read',
    logLine: '> handshaking with available tool servers...',
    body: 'Before MCP, every AI integration was custom-built plumbing. MCP is the standard that means you build the connection once — then any compatible model can use any compatible tool, without rewriting the pipes.',
  },
  {
    slug: 'fine-tuning',
    index: '06',
    title: 'Fine-Tuning',
    tagline: 'Teaching a model new habits, not new knowledge',
    readTime: '8 min read',
    logLine: '> adjusting behavior on domain-specific data...',
    body: "Fine-tuning doesn't teach a model new facts — it teaches it new habits. The intelligence stays the same. What changes is tone, format, consistency, and the particular way it responds when it's working for you.",
  },
] as const;

type ConceptSlug = typeof CONCEPTS[number]['slug'];

/* ── SVG Diagrams ─────────────────────────────────────────────────────────── */

/* Shared animation helpers — only CSS properties, no SVG presentation attrs */
const na = (delay: number, dur = 350): React.CSSProperties => ({
  opacity: 0,
  animation: `node-appear ${dur}ms ease ${delay}ms forwards`,
  transformOrigin: 'center center',
});
const ld = (delay: number, dur = 450): React.CSSProperties => ({
  strokeDashoffset: 1,
  animation: `line-draw ${dur}ms ease ${delay}ms forwards`,
});
const cf = (delay: number, dur = 280): React.CSSProperties => ({
  opacity: 0,
  animation: `c-fade ${dur}ms ease ${delay}ms forwards`,
});

function RagDiagram() {
  return (
    <svg viewBox="0 0 800 220" width="100%" height="auto" aria-hidden style={{ display: 'block' }}>
      <defs>
        <marker id="arr-rag" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" style={{ fill: 'var(--text-muted)' }} />
        </marker>
        <marker id="arr-rag-hi" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" style={{ fill: 'var(--accent-primary)' }} />
        </marker>
      </defs>

      {/* User query — highlighted start */}
      <rect x="30" y="82" width="118" height="38" rx="6" fill="none"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 1.5, ...na(0) }} />
      <text x="89" y="106" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--accent-primary)', ...cf(80) }}>
        user query
      </text>

      {/* Arrow → retriever */}
      <line x1="148" y1="101" x2="194" y2="101" markerEnd="url(#arr-rag)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 1.5, ...ld(160) }} />

      {/* Retriever box */}
      <rect x="195" y="82" width="108" height="38" rx="6" fill="none"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...na(200) }} />
      <text x="249" y="106" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', ...cf(280) }}>
        retriever
      </text>

      {/* Vertical dashed line to knowledge base */}
      <line x1="249" y1="120" x2="249" y2="158" markerEnd="url(#arr-rag)"
        strokeDasharray="3 3"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...cf(350) }} />

      {/* Knowledge base */}
      <rect x="190" y="160" width="118" height="36" rx="6" fill="none"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...na(370) }} />
      <text x="249" y="182" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-muted)', ...cf(450) }}>
        knowledge base
      </text>
      <text x="249" y="196" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)', opacity: 0.5, ...cf(470) }}>
        docs · PDFs · notes
      </text>

      {/* Arrow → prompt+context */}
      <line x1="303" y1="101" x2="349" y2="101" markerEnd="url(#arr-rag)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 1.5, ...ld(380) }} />

      {/* Prompt + context box */}
      <rect x="350" y="82" width="134" height="38" rx="6" fill="none"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...na(420) }} />
      <text x="417" y="106" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', ...cf(500) }}>
        prompt + context
      </text>

      {/* Arrow → LLM */}
      <line x1="484" y1="101" x2="534" y2="101" markerEnd="url(#arr-rag)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 1.5, ...ld(530) }} />

      {/* LLM box */}
      <rect x="535" y="82" width="78" height="38" rx="6" fill="none"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...na(570) }} />
      <text x="574" y="106" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', ...cf(650) }}>
        LLM
      </text>

      {/* Arrow → answer */}
      <line x1="613" y1="101" x2="660" y2="101" markerEnd="url(#arr-rag-hi)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 1.5, ...ld(660) }} />

      {/* Answer — highlighted end */}
      <text x="672" y="99" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, fill: 'var(--accent-primary)', ...cf(700) }}>
        answer
      </text>
      <text x="672" y="115" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--accent-primary)', opacity: 0.5, ...cf(750) }}>
        grounded in your data
      </text>
    </svg>
  );
}

function AgentsDiagram() {
  return (
    <svg viewBox="0 0 800 220" width="100%" height="auto" aria-hidden style={{ display: 'block' }}>
      <defs>
        <marker id="arr-ag" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" style={{ fill: 'var(--text-muted)' }} />
        </marker>
        <marker id="arr-ag-hi" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" style={{ fill: 'var(--accent-primary)' }} />
        </marker>
      </defs>

      {/* Goal text */}
      <text x="50" y="97" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fill: 'var(--text-secondary)', ...cf(0) }}>
        Goal
      </text>
      <line x1="88" y1="92" x2="120" y2="92" markerEnd="url(#arr-ag)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 1.5, ...ld(80) }} />

      {/* Observe box */}
      <rect x="122" y="74" width="100" height="36" rx="6" fill="none"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 1.5, ...na(100) }} />
      <text x="172" y="97" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--accent-primary)', ...cf(180) }}>
        Observe
      </text>

      {/* Arrow → Think */}
      <line x1="222" y1="92" x2="268" y2="92" markerEnd="url(#arr-ag)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 1.5, ...ld(260) }} />

      {/* Think box */}
      <rect x="270" y="74" width="100" height="36" rx="6" fill="none"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...na(280) }} />
      <text x="320" y="97" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', ...cf(360) }}>
        Think
      </text>

      {/* Arrow → Act */}
      <line x1="370" y1="92" x2="416" y2="92" markerEnd="url(#arr-ag)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 1.5, ...ld(400) }} />

      {/* Act box */}
      <rect x="418" y="74" width="100" height="36" rx="6" fill="none"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...na(420) }} />
      <text x="468" y="97" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', ...cf(500) }}>
        Act
      </text>

      {/* Arrow to environment */}
      <line x1="518" y1="92" x2="560" y2="92" markerEnd="url(#arr-ag)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 1.5, ...ld(550) }} />
      <text x="574" y="97" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fill: 'var(--text-secondary)', ...cf(580) }}>
        World
      </text>

      {/* Loop back — the key visual */}
      <path
        d="M 468 110 L 468 148 L 172 148 L 172 110"
        fill="none" markerEnd="url(#arr-ag-hi)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 1.5, ...ld(620, 550) }}
      />

      {/* "result" label in the middle of loop */}
      <rect x="275" y="138" width="70" height="20" rx="4"
        style={{ fill: 'var(--bg-elevated)', ...cf(700) }} />
      <text x="310" y="152" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--accent-primary)', ...cf(720) }}>
        result ↺
      </text>
    </svg>
  );
}

function EmbeddingsDiagram() {
  const dots: Array<{ x: number; y: number; label: string; group: 0 | 1 | 2; delay: number }> = [
    // Group 0 — emotion (accent-primary / green)
    { x: 110, y: 68,  label: 'joy',     group: 0, delay: 0   },
    { x: 150, y: 92,  label: 'happy',   group: 0, delay: 80  },
    { x: 90,  y: 102, label: 'elated',  group: 0, delay: 160 },
    { x: 140, y: 58,  label: 'delight', group: 0, delay: 240 },
    // Group 1 — cold/winter (text-secondary)
    { x: 580, y: 155, label: 'cold',   group: 1, delay: 120 },
    { x: 630, y: 135, label: 'winter', group: 1, delay: 200 },
    { x: 600, y: 175, label: 'frost',  group: 1, delay: 280 },
    { x: 650, y: 165, label: 'ice',    group: 1, delay: 360 },
    // Group 2 — geography (accent-warm / amber)
    { x: 580, y: 55,  label: 'Paris',   group: 2, delay: 60  },
    { x: 635, y: 72,  label: 'London',  group: 2, delay: 140 },
    { x: 560, y: 78,  label: 'Berlin',  group: 2, delay: 220 },
    { x: 655, y: 46,  label: 'Rome',    group: 2, delay: 300 },
  ];

  const colors: string[] = [
    'var(--accent-primary)', 'var(--text-secondary)', 'var(--accent-warm)',
  ];
  const clusterLabels = [
    { x: 120, y: 135, text: 'emotion', delay: 350, color: 'var(--accent-primary)' },
    { x: 600, y: 203, text: 'weather', delay: 450, color: 'var(--text-muted)' },
    { x: 600, y: 30,  text: 'cities',  delay: 400, color: 'var(--accent-warm)' },
  ];

  return (
    <svg viewBox="0 0 800 220" width="100%" height="auto" aria-hidden style={{ display: 'block' }}>
      {/* Cluster halos */}
      <circle cx="120" cy="88"  r="45" fill="none"
        strokeDasharray="3 3"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 0.5, opacity: 0, animation: 'c-fade 400ms ease 300ms forwards' }} />
      <circle cx="615" cy="158" r="48" fill="none"
        strokeDasharray="3 3"
        style={{ stroke: 'var(--text-muted)', strokeWidth: 0.5, opacity: 0, animation: 'c-fade 400ms ease 400ms forwards' }} />
      <circle cx="606" cy="62"  r="46" fill="none"
        strokeDasharray="3 3"
        style={{ stroke: 'var(--accent-warm)', strokeWidth: 0.5, opacity: 0, animation: 'c-fade 400ms ease 350ms forwards' }} />

      {/* Distance indicator between clusters */}
      <line x1="170" y1="108" x2="560" y2="108"
        strokeDasharray="4 4"
        style={{ stroke: 'var(--border-default)', strokeWidth: 0.75, ...cf(480) }} />
      <text x="365" y="103" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)', ...cf(600) }}>
        distance = difference in meaning
      </text>

      {/* Dots */}
      {dots.map((d) => (
        <g key={d.label} style={na(d.delay, 300)}>
          <circle cx={d.x} cy={d.y} r={4.5}
            style={{ fill: colors[d.group] }} />
          <text x={d.x + 7} y={d.y + 4}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: colors[d.group] }}>
            {d.label}
          </text>
        </g>
      ))}

      {/* Cluster labels */}
      {clusterLabels.map((cl) => (
        <text key={cl.text} x={cl.x} y={cl.y} textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.10em', fill: cl.color, opacity: 0, animation: `c-fade 350ms ease ${cl.delay}ms forwards` }}>
          {cl.text.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

function TransformersDiagram() {
  const tokens = ['the', 'trophy', 'fit', 'it', 'big'];
  const cellSize = 52;
  const originX = 180;
  const originY = 32;

  const weights = [
    [0.80, 0.10, 0.05, 0.05, 0.05],
    [0.08, 0.72, 0.10, 0.05, 0.05],
    [0.05, 0.15, 0.65, 0.08, 0.08],
    [0.04, 0.88, 0.04, 0.55, 0.04],
    [0.05, 0.08, 0.08, 0.05, 0.80],
  ];

  return (
    <svg viewBox="0 0 800 220" width="100%" height="auto" aria-hidden style={{ display: 'block' }}>
      {/* Column headers */}
      {tokens.map((t, i) => (
        <text key={`col-${t}`} x={originX + i * cellSize + cellSize / 2} y={originY - 4} textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)', opacity: 0, animation: `c-fade 250ms ease ${i * 60}ms forwards` }}>
          {t}
        </text>
      ))}

      {/* Row headers */}
      {tokens.map((t, i) => (
        <text key={`row-${t}`} x={originX - 8} y={originY + i * cellSize + cellSize / 2 + 4} textAnchor="end"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)', opacity: 0, animation: `c-fade 250ms ease ${i * 60}ms forwards` }}>
          {t}
        </text>
      ))}

      {/* Matrix cells */}
      {weights.map((row, ri) =>
        row.map((w, ci) => {
          const isHot = ri === 3 && ci === 1;
          const baseDelay = 80 + (ri * 5 + ci) * 40;
          const alpha = isHot ? 0.85 : Math.max(0.03, w * 0.75);
          const color = `rgba(125, 191, 140, ${alpha})`;
          return (
            <rect key={`${ri}-${ci}`}
              x={originX + ci * cellSize + 1} y={originY + ri * cellSize + 1}
              width={cellSize - 2} height={cellSize - 2}
              rx={3}
              style={{ fill: color, opacity: 0, animation: `c-fade 300ms ease ${baseDelay}ms forwards` }} />
          );
        })
      )}

      {/* Highlight box around "it"→"trophy" */}
      <rect x={originX + 1 * cellSize} y={originY + 3 * cellSize} width={cellSize} height={cellSize} rx={3}
        fill="none"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 2, opacity: 0, animation: 'node-appear 300ms ease 600ms forwards', transformOrigin: `${originX + 1 * cellSize + cellSize / 2}px ${originY + 3 * cellSize + cellSize / 2}px` }} />

      {/* Callout line — dashed, fade in */}
      <line x1={originX + 1.5 * cellSize} y1={originY + 3 * cellSize - 1} x2={originX + 1.5 * cellSize} y2={originY - 22}
        strokeDasharray="3 3"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 0.75, ...cf(650) }} />

      {/* Caption */}
      <text x={originX + 5 * cellSize + 20} y={originY + 2 * cellSize}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', opacity: 0, animation: 'c-fade 350ms ease 700ms forwards' }}>
        each token
      </text>
      <text x={originX + 5 * cellSize + 20} y={originY + 2 * cellSize + 16}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', opacity: 0, animation: 'c-fade 350ms ease 720ms forwards' }}>
        attends to
      </text>
      <text x={originX + 5 * cellSize + 20} y={originY + 2 * cellSize + 32}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', opacity: 0, animation: 'c-fade 350ms ease 740ms forwards' }}>
        all others
      </text>
      <text x={originX + 5 * cellSize + 20} y={originY + 3 * cellSize + 10}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--accent-primary)', opacity: 0, animation: 'c-fade 350ms ease 760ms forwards' }}>
        &quot;it&quot; → &quot;trophy&quot;
      </text>
      <text x={originX + 5 * cellSize + 20} y={originY + 3 * cellSize + 24}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--accent-primary)', opacity: 0, animation: 'c-fade 350ms ease 780ms forwards' }}>
        strong attention
      </text>
    </svg>
  );
}

function McpDiagram() {
  return (
    <svg viewBox="0 0 800 220" width="100%" height="auto" aria-hidden style={{ display: 'block' }}>
      <defs>
        <marker id="arr-mcp" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <circle cx="4" cy="4" r="2" style={{ fill: 'var(--accent-primary)' }} />
        </marker>
      </defs>

      {/* AI Model / client — center top */}
      <rect x="290" y="28" width="220" height="44" rx="8" fill="none"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 1.5, ...na(0) }} />
      <text x="400" y="52" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fill: 'var(--accent-primary)', fontWeight: 500, ...cf(80) }}>
        AI Model  ·  MCP Client
      </text>

      {/* Protocol label */}
      <text x="400" y="96" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', fill: 'var(--text-muted)', ...cf(200) }}>
        MODEL CONTEXT PROTOCOL
      </text>

      {/* Three connecting dashed lines — fade in */}
      {[120, 400, 680].map((cx, i) => (
        <line key={cx} x1={400} y1={72} x2={cx} y2={138}
          strokeDasharray="4 3"
          style={{
            stroke: 'var(--accent-primary)', strokeWidth: 1,
            ...cf(280 + i * 80),
          }} />
      ))}

      {/* Three server boxes */}
      {[
        { cx: 120, label: 'Files', sub: 'local server' },
        { cx: 400, label: 'Search', sub: 'web server' },
        { cx: 680, label: 'Calendar', sub: 'api server' },
      ].map(({ cx, label, sub }, i) => (
        <g key={label} style={na(300 + i * 100)}>
          <rect x={cx - 72} y={140} width={144} height={48} rx="6" fill="none"
            style={{ stroke: 'var(--border-default)', strokeWidth: 1 }} />
          <text x={cx} y={164} textAnchor="middle"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fill: 'var(--text-secondary)' }}>
            {label}
          </text>
          <text x={cx} y={179} textAnchor="middle"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)' }}>
            {sub}
          </text>
        </g>
      ))}

      {/* Caption */}
      <text x="400" y="212" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)', opacity: 0.5, ...cf(650) }}>
        one client · any compatible server
      </text>
    </svg>
  );
}

function FineTuningDiagram() {
  return (
    <svg viewBox="0 0 800 220" width="100%" height="auto" aria-hidden style={{ display: 'block' }}>
      <defs>
        <marker id="arr-ft" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" style={{ fill: 'var(--text-muted)' }} />
        </marker>
        <marker id="arr-ft-hi" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" style={{ fill: 'var(--accent-primary)' }} />
        </marker>
      </defs>

      {/* Base model box (left) */}
      <rect x="40" y="84" width="130" height="42" rx="6" fill="none"
        style={{ stroke: 'var(--border-default)', strokeWidth: 1, ...na(0) }} />
      <text x="105" y="110" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)', ...cf(80) }}>
        base model
      </text>

      {/* Scattered output arrows — before (inconsistent) */}
      {[
        [170, 105, 220, 68],
        [170, 105, 226, 88],
        [170, 105, 228, 108],
        [170, 105, 224, 128],
        [170, 105, 216, 145],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} markerEnd="url(#arr-ft)"
          pathLength="1" strokeDasharray="1"
          style={{ stroke: 'var(--text-muted)', strokeWidth: 1, ...ld(150 + i * 50) }} />
      ))}

      {/* "varied outputs" label */}
      <text x="235" y="63" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)', opacity: 0.6, ...cf(420) }}>
        tone: varies
      </text>
      <text x="235" y="91" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)', opacity: 0.6, ...cf(440) }}>
        format: inconsistent
      </text>
      <text x="235" y="119" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)', opacity: 0.6, ...cf(460) }}>
        style: generic
      </text>
      <text x="235" y="147" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-muted)', opacity: 0.6, ...cf(480) }}>
        behavior: baseline
      </text>

      {/* Center — training process */}
      <rect x="322" y="80" width="136" height="50" rx="8" fill="none"
        strokeDasharray="4 3"
        style={{ stroke: 'var(--accent-warm)', strokeWidth: 1, ...cf(350) }} />
      <text x="390" y="106" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--accent-warm)', ...cf(420) }}>
        your data
      </text>
      <text x="390" y="121" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--accent-warm)', ...cf(440) }}>
        + training
      </text>

      {/* Center arrow */}
      <line x1="458" y1="105" x2="504" y2="105" markerEnd="url(#arr-ft-hi)"
        pathLength="1" strokeDasharray="1"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 2, ...ld(500) }} />

      {/* Fine-tuned model box (right) */}
      <rect x="505" y="84" width="130" height="42" rx="6" fill="none"
        style={{ stroke: 'var(--accent-primary)', strokeWidth: 1.5, ...na(560) }} />
      <text x="570" y="110" textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--accent-primary)', ...cf(640) }}>
        fine-tuned
      </text>

      {/* Aligned output arrows — after (consistent) */}
      {[68, 88, 108, 128].map((y2, i) => (
        <line key={i} x1={635} y1={105} x2={680} y2={y2} markerEnd="url(#arr-ft-hi)"
          pathLength="1" strokeDasharray="1"
          style={{ stroke: 'var(--accent-primary)', strokeWidth: 1.5, ...ld(680 + i * 40) }} />
      ))}

      {/* "consistent outputs" label */}
      <text x="692" y="76" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--accent-primary)', opacity: 0.8, ...cf(750) }}>
        your tone
      </text>
      <text x="692" y="96" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--accent-primary)', opacity: 0.8, ...cf(760) }}>
        your format
      </text>
      <text x="692" y="116" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--accent-primary)', opacity: 0.8, ...cf(770) }}>
        your style
      </text>
      <text x="692" y="136" textAnchor="start"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--accent-primary)', opacity: 0.8, ...cf(780) }}>
        consistent
      </text>
    </svg>
  );
}

const DIAGRAMS: Record<ConceptSlug, React.FC> = {
  'rag':          RagDiagram,
  'agents':       AgentsDiagram,
  'embeddings':   EmbeddingsDiagram,
  'transformers': TransformersDiagram,
  'mcp':          McpDiagram,
  'fine-tuning':  FineTuningDiagram,
};

/* ── Main Carousel ────────────────────────────────────────────────────────── */

export default function ConceptCarousel() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    if (index === active) return;
    setActive(index);
    setAnimKey((k) => k + 1);
  }, [active]);

  const goNext = useCallback(() => goTo(Math.min(active + 1, CONCEPTS.length - 1)), [active, goTo]);
  const goPrev = useCallback(() => goTo(Math.max(active - 1, 0)), [active, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  return (
    <div>
      {/* ── Frames ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {CONCEPTS.map((concept, i) => {
          const Diagram = DIAGRAMS[concept.slug];
          const isActive = i === active;
          return (
            <div
              key={concept.slug}
              aria-hidden={!isActive}
              style={{
                position: isActive ? 'relative' : 'absolute',
                inset: isActive ? 'auto' : 0,
                width: '100%',
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                transition: 'opacity 300ms ease',
                zIndex: isActive ? 1 : 0,
              }}
            >
              {/* key={animKey} forces animation restart on each visit */}
              <div key={animKey}>

                {/* ── Header ────────────────────────────────────────────── */}
                <div style={{
                  maxWidth: 'var(--max-width-content)',
                  margin: '0 auto',
                  padding: 'clamp(48px, 8vw, 80px) clamp(24px, 5vw, 40px) 36px',
                }}>
                  {/* Log line — type-out reveal */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      letterSpacing: '0.04em',
                      color: 'var(--accent-primary)',
                      clipPath: 'inset(0 100% 0 0)',
                      animation: 'type-out 400ms ease 0ms forwards',
                      display: 'inline-block',
                    }}>
                      {concept.logLine}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      width: 8,
                      height: 14,
                      background: 'var(--accent-primary)',
                      animation: 'blink 1s step-end infinite',
                      opacity: 0,
                      animationDelay: '400ms',
                    }} />
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(28px, 4vw, 52px)',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    margin: '0 0 14px',
                    opacity: 0,
                    animation: 'fade-up 500ms cubic-bezier(0.16,1,0.3,1) 200ms forwards',
                  }}>
                    {concept.title}
                  </h2>

                  {/* Index + tagline row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em',
                      opacity: 0,
                      animation: 'c-fade 300ms ease 300ms forwards',
                    }}>
                      {concept.index} / 06
                    </span>
                    <p style={{
                      fontFamily: 'var(--font-editorial)',
                      fontStyle: 'italic',
                      fontSize: 17,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      margin: 0,
                      opacity: 0,
                      animation: 'fade-up 500ms cubic-bezier(0.16,1,0.3,1) 280ms forwards',
                    }}>
                      {concept.tagline}
                    </p>
                  </div>
                </div>

                {/* ── Diagram — full bleed ───────────────────────────────── */}
                <div style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '36px 0',
                  opacity: 0,
                  animation: 'c-fade 500ms ease 350ms forwards',
                }}>
                  <div style={{
                    maxWidth: 'var(--max-width-content)',
                    margin: '0 auto',
                    padding: '0 clamp(24px, 5vw, 40px)',
                  }}>
                    <Diagram />
                  </div>
                </div>

                {/* ── Body + link ────────────────────────────────────────── */}
                <div style={{
                  maxWidth: 'var(--max-width-content)',
                  margin: '0 auto',
                  padding: '36px clamp(24px, 5vw, 40px) 40px',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 17,
                    lineHeight: 1.85,
                    color: 'var(--text-secondary)',
                    maxWidth: '62ch',
                    margin: '0 0 24px',
                    opacity: 0,
                    animation: 'fade-up 600ms cubic-bezier(0.16,1,0.3,1) 550ms forwards',
                  }}>
                    {concept.body}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    opacity: 0,
                    animation: 'c-fade 400ms ease 650ms forwards',
                  }}>
                    <Link
                      href={`/learn/${concept.slug}`}
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--accent-primary)',
                        textDecoration: 'none',
                        letterSpacing: '-0.01em',
                        transition: 'opacity 150ms ease',
                      }}
                    >
                      Read full concept →
                    </Link>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}>
                      {concept.readTime}
                    </span>
                  </div>
                </div>

              </div>{/* /key={animKey} */}
            </div>
          );
        })}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--max-width-content)',
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 40px) 64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          if (touchStartY.current === null) return;
          const delta = e.changedTouches[0].clientY - touchStartY.current;
          if (delta < -50) goNext();
          if (delta > 50) goPrev();
          touchStartY.current = null;
        }}
      >
        {/* Prev */}
        <button
          onClick={goPrev}
          disabled={active === 0}
          aria-label="Previous concept"
          style={{
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '8px 14px',
            color: active === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: active === 0 ? 'default' : 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            transition: 'border-color 150ms ease, color 150ms ease',
            opacity: active === 0 ? 0.35 : 1,
          }}
        >
          ←
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {CONCEPTS.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => goTo(i)}
              aria-label={`${c.title}`}
              aria-current={i === active ? 'true' : undefined}
              style={{
                background: 'none',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'opacity 150ms ease',
                opacity: i === active ? 1 : 0.4,
              }}
            >
              <span style={{
                display: 'block',
                width: i === active ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i === active ? 'var(--accent-primary)' : 'var(--text-muted)',
                transition: 'width 250ms ease, background 250ms ease',
              }} />
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={goNext}
          disabled={active === CONCEPTS.length - 1}
          aria-label="Next concept"
          style={{
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '8px 14px',
            color: active === CONCEPTS.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: active === CONCEPTS.length - 1 ? 'default' : 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            transition: 'border-color 150ms ease, color 150ms ease',
            opacity: active === CONCEPTS.length - 1 ? 0.35 : 1,
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
