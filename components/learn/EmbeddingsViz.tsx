'use client';
import { useState, useRef } from 'react';

interface WordDot {
  text: string;
  x: number;
  y: number;
  cluster: number;
}

const WORDS: WordDot[] = [
  // Cluster 0: royalty (top-left)
  { text: 'king',      x: 70,  y: 62,  cluster: 0 },
  { text: 'queen',     x: 100, y: 82,  cluster: 0 },
  { text: 'royal',     x: 54,  y: 98,  cluster: 0 },
  { text: 'crown',     x: 84,  y: 46,  cluster: 0 },
  // Cluster 1: animals (bottom-right)
  { text: 'cat',       x: 318, y: 214, cluster: 1 },
  { text: 'dog',       x: 348, y: 242, cluster: 1 },
  { text: 'pet',       x: 304, y: 252, cluster: 1 },
  { text: 'animal',    x: 340, y: 198, cluster: 1 },
  // Cluster 2: code (top-right)
  { text: 'python',    x: 308, y: 56,  cluster: 2 },
  { text: 'code',      x: 346, y: 74,  cluster: 2 },
  { text: 'function',  x: 298, y: 88,  cluster: 2 },
  { text: 'algorithm', x: 340, y: 40,  cluster: 2 },
  // Cluster 3: emotions (center-left)
  { text: 'joy',       x: 118, y: 172, cluster: 3 },
  { text: 'love',      x: 145, y: 196, cluster: 3 },
  { text: 'warmth',    x: 103, y: 202, cluster: 3 },
  { text: 'hope',      x: 140, y: 155, cluster: 3 },
];

const CLUSTER_CENTERS = [
  { x: 77,  y: 72  },
  { x: 328, y: 227 },
  { x: 323, y: 65  },
  { x: 127, y: 182 },
];

const CLUSTER_ELLIPSES = [
  { cx: 77,  cy: 72,  rx: 42, ry: 36 },
  { cx: 328, cy: 227, rx: 44, ry: 38 },
  { cx: 323, cy: 65,  rx: 50, ry: 37 },
  { cx: 127, cy: 182, rx: 40, ry: 34 },
];

const CLUSTER_KEYWORDS: string[][] = [
  ['king', 'queen', 'royal', 'crown', 'prince', 'throne', 'lord', 'ruler', 'noble', 'duke', 'empire', 'palace', 'court', 'knight', 'reign'],
  ['cat', 'dog', 'pet', 'animal', 'fish', 'bird', 'rabbit', 'horse', 'cow', 'lion', 'tiger', 'wolf', 'fox', 'bear', 'elephant', 'feline', 'canine'],
  ['python', 'code', 'function', 'algorithm', 'program', 'variable', 'loop', 'class', 'method', 'bug', 'script', 'data', 'software', 'react', 'javascript', 'java', 'array', 'stack', 'compute', 'tech'],
  ['joy', 'love', 'warmth', 'hope', 'happy', 'bliss', 'peace', 'calm', 'care', 'kind', 'sweet', 'affection', 'comfort', 'delight', 'sad', 'grief', 'wonder', 'awe', 'tender', 'serene'],
];

function findCluster(word: string): number {
  const lower = word.toLowerCase().trim();
  let best = -1, bestScore = 0;
  for (let i = 0; i < CLUSTER_KEYWORDS.length; i++) {
    const score = CLUSTER_KEYWORDS[i].reduce(
      (acc, kw) => acc + (lower.includes(kw) || kw.includes(lower) ? 1 : 0),
      0
    );
    if (score > bestScore) { bestScore = score; best = i; }
  }
  return best >= 0 ? best : Math.floor(Math.random() * 4);
}

interface PlacedWord {
  text: string;
  x: number;
  y: number;
  key: number;
}

export default function EmbeddingsViz() {
  const [input, setInput] = useState('');
  const [placed, setPlaced] = useState<PlacedWord[]>([]);
  const keyRef = useRef(0);

  function handlePlace() {
    const word = input.trim();
    if (!word || word.length > 20) return;
    const cluster = findCluster(word);
    const center = CLUSTER_CENTERS[cluster];
    const x = Math.max(24, Math.min(396, center.x + (Math.random() - 0.5) * 38));
    const y = Math.max(18, Math.min(262, center.y + (Math.random() - 0.5) * 30));
    setPlaced(prev => [...prev, { text: word, x, y, key: ++keyRef.current }]);
    setInput('');
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-10)',
      margin: 'var(--space-10) 0',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 'var(--space-4)',
      }}>
        ◉ INTERACTIVE
      </p>

      <svg
        viewBox="0 0 420 280"
        style={{ width: '100%', height: 'auto', display: 'block', marginBottom: 'var(--space-5)' }}
        aria-label="Word embedding scatter plot — clusters of semantically related words"
      >
        <style>{`
          @keyframes embWordPop {
            from { transform: scale(0); opacity: 0; }
            to   { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Background grid dots */}
        {Array.from({ length: 7 }, (_, xi) =>
          Array.from({ length: 5 }, (_, yi) => (
            <circle
              key={`g${xi}-${yi}`}
              cx={30 + xi * 60}
              cy={28 + yi * 56}
              r={1.5}
              fill="var(--border-subtle)"
            />
          ))
        )}

        {/* Cluster ellipses — convex hull approximations */}
        {CLUSTER_ELLIPSES.map((e, i) => (
          <ellipse
            key={i}
            cx={e.cx}
            cy={e.cy}
            rx={e.rx}
            ry={e.ry}
            fill="var(--accent-primary)"
            fillOpacity={0.05}
            stroke="var(--accent-primary)"
            strokeOpacity={0.14}
            strokeWidth={1}
          />
        ))}

        {/* Pre-placed words */}
        {WORDS.map(({ text, x, y }) => (
          <g key={text}>
            <circle cx={x} cy={y} r={3} fill="var(--accent-primary)" fillOpacity={0.65} />
            <text
              x={x + 6}
              y={y + 4}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fill: 'var(--text-secondary)',
                userSelect: 'none',
              }}
            >
              {text}
            </text>
          </g>
        ))}

        {/* User-placed words — amber, animated */}
        {placed.map(({ text, x, y, key }) => (
          <g key={key} transform={`translate(${x}, ${y})`}>
            <g style={{
              animation: 'embWordPop 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
              transformBox: 'fill-box',
              transformOrigin: 'center',
            }}>
              <circle cx={0} cy={0} r={4} fill="var(--accent-warm)" fillOpacity={0.9} />
              <text
                x={6}
                y={4}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: '600',
                  fill: 'var(--accent-warm)',
                  userSelect: 'none',
                }}
              >
                {text}
              </text>
            </g>
          </g>
        ))}
      </svg>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePlace()}
          placeholder="Type any word..."
          maxLength={20}
          style={{
            flex: 1,
            height: '44px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0 var(--space-4)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <button
          onClick={handlePlace}
          style={{
            height: '44px',
            padding: '0 var(--space-5)',
            background: 'var(--accent-primary)',
            color: 'var(--text-inverse)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Place it
        </button>
      </div>

      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: 'var(--text-base)',
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        Words with similar meanings end up neighbours. This is why AI can search by meaning, not just keywords.
      </p>

      <style>{`
        input::placeholder { color: var(--text-muted); }
        input:focus { border-color: var(--border-emphasis) !important; }
      `}</style>
    </div>
  );
}
