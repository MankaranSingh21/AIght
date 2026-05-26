'use client';

import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Modality = 'text' | 'image' | 'audio' | 'all';

interface ModalityData {
  id: Modality;
  label: string;
  encoderName: string;
  // Precomputed vector (8 numbers) that all modalities "converge to"
  vector: number[];
}

// Target concept: "a cat sitting"
// Vectors are precomputed and slightly varied per modality to show approximate similarity
const MODALITIES: ModalityData[] = [
  {
    id: 'text',
    label: 'TEXT',
    encoderName: 'Text Encoder (BERT-style)',
    vector: [0.82, -0.14, 0.63, 0.41, -0.29, 0.78, 0.11, -0.55],
  },
  {
    id: 'image',
    label: 'IMAGE',
    encoderName: 'Vision Encoder (ViT)',
    vector: [0.79, -0.18, 0.67, 0.38, -0.31, 0.75, 0.14, -0.51],
  },
  {
    id: 'audio',
    label: 'AUDIO',
    encoderName: 'Audio Encoder (Wav2Vec)',
    vector: [0.84, -0.11, 0.61, 0.44, -0.26, 0.80, 0.09, -0.58],
  },
];

// ── SVG placeholders ──────────────────────────────────────────────────────────

function TextInputSVG() {
  return (
    <div style={{
      background: 'var(--bg-overlay)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4) var(--space-5)',
      fontFamily: 'var(--font-editorial)',
      fontSize: 15,
      color: 'var(--text-primary)',
      lineHeight: 1.6,
      border: '1px solid var(--border-subtle)',
      minHeight: 72,
      display: 'flex',
      alignItems: 'center',
    }}>
      &ldquo;a cat sitting on a windowsill in afternoon light&rdquo;
    </div>
  );
}

function ImageInputSVG() {
  return (
    <svg
      viewBox="0 0 240 120"
      width="100%"
      style={{ borderRadius: 'var(--radius-md)', display: 'block' }}
      aria-label="Placeholder image of a cat"
    >
      <rect width="240" height="120" fill="var(--bg-overlay)" rx="8" />
      {/* Simple cat silhouette */}
      <ellipse cx="120" cy="75" rx="28" ry="22" fill="rgba(170,255,77,0.12)" stroke="rgba(170,255,77,0.3)" strokeWidth="1.5" />
      {/* Head */}
      <ellipse cx="120" cy="50" rx="18" ry="16" fill="rgba(170,255,77,0.12)" stroke="rgba(170,255,77,0.3)" strokeWidth="1.5" />
      {/* Ears */}
      <polygon points="107,38 103,26 113,35" fill="rgba(170,255,77,0.20)" stroke="rgba(170,255,77,0.3)" strokeWidth="1" />
      <polygon points="133,38 137,26 127,35" fill="rgba(170,255,77,0.20)" stroke="rgba(170,255,77,0.3)" strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx="113" cy="50" rx="3" ry="3" fill="rgba(170,255,77,0.6)" />
      <ellipse cx="127" cy="50" rx="3" ry="3" fill="rgba(170,255,77,0.6)" />
      {/* Window frame suggestion */}
      <rect x="10" y="10" width="220" height="100" rx="6" fill="none" stroke="rgba(245,239,224,0.08)" strokeWidth="1" />
      <line x1="10" y1="60" x2="230" y2="60" stroke="rgba(245,239,224,0.06)" strokeWidth="1" />
      <line x1="120" y1="10" x2="120" y2="110" stroke="rgba(245,239,224,0.06)" strokeWidth="1" />
      {/* Label */}
      <text x="120" y="108" textAnchor="middle" fill="rgba(245,239,224,0.25)" fontSize="8" fontFamily="monospace">
        cat_windowsill.jpg
      </text>
    </svg>
  );
}

function AudioInputSVG() {
  // Simple waveform
  const points: string[] = [];
  const N = 60;
  for (let i = 0; i < N; i++) {
    const x = 10 + (i / (N - 1)) * 220;
    const amp = Math.sin(i * 0.6) * 18 + Math.sin(i * 1.7) * 10 + Math.sin(i * 0.2) * 6;
    const y = 60 - amp;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <svg
      viewBox="0 0 240 120"
      width="100%"
      style={{ borderRadius: 'var(--radius-md)', display: 'block' }}
      aria-label="Audio waveform placeholder"
    >
      <rect width="240" height="120" fill="var(--bg-overlay)" rx="8" />
      {/* Baseline */}
      <line x1="10" y1="60" x2="230" y2="60" stroke="rgba(245,239,224,0.08)" strokeWidth="1" />
      {/* Waveform */}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="rgba(0,255,209,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mirror below */}
      <polyline
        points={points.map((p) => {
          const [x, y] = p.split(',').map(Number);
          return `${x},${(120 - y).toFixed(1)}`;
        }).join(' ')}
        fill="none"
        stroke="rgba(0,255,209,0.25)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="120" y="108" textAnchor="middle" fill="rgba(245,239,224,0.25)" fontSize="8" fontFamily="monospace">
        cat_audio_description.wav
      </text>
    </svg>
  );
}

// ── Vector display ────────────────────────────────────────────────────────────

function VectorDisplay({ vector, label }: { vector: number[]; label: string }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-3) var(--space-4)',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: '0 0 var(--space-2)',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--accent-primary)',
        margin: 0,
        lineHeight: 1.6,
        letterSpacing: '0.02em',
      }}>
        [{vector.map((v) => v.toFixed(2)).join(', ')}]
      </p>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MultimodalDemo() {
  const [active, setActive] = useState<Modality>('text');

  const isAll = active === 'all';
  const singleModality = MODALITIES.find((m) => m.id === active);

  const tabStyle = (id: Modality): React.CSSProperties => {
    const isSelected = active === id;
    return {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.06em',
      padding: 'var(--space-2) var(--space-4)',
      borderRadius: 'var(--radius-sm)',
      border: isSelected ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
      background: isSelected ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
      color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all 150ms ease',
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Modality tabs */}
      <div role="tablist" aria-label="Input modality" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {(['text', 'image', 'audio', 'all'] as Modality[]).map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={active === id}
            onClick={() => setActive(id)}
            style={tabStyle(id)}
          >
            {id === 'all' ? 'ALL THREE' : id.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Single modality view */}
      {!isAll && singleModality && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Input */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              margin: '0 0 var(--space-2)',
            }}>
              Input — "{active}"
            </p>
            {active === 'text' && <TextInputSVG />}
            {active === 'image' && <ImageInputSVG />}
            {active === 'audio' && <AudioInputSVG />}
          </div>

          {/* Encoder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 20 }}>↓</span>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244,171,31,0.10)',
              border: '1px solid rgba(244,171,31,0.28)',
              color: 'var(--accent-warm)',
            }}>
              {singleModality.encoderName}
            </div>
          </div>

          {/* Encoded vector */}
          <VectorDisplay vector={singleModality.vector} label="Encoded vector (shared embedding space)" />
        </div>
      )}

      {/* ALL THREE view */}
      {isAll && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Three different signals. Same concept. Similar vectors.
          </p>
          {MODALITIES.map((m) => (
            <div key={m.id} style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  minWidth: 48,
                }}>
                  {m.label}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>→</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--accent-warm)',
                }}>
                  {m.encoderName}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>→</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--accent-primary)',
                }}>
                  [{m.vector.slice(0, 4).map((v) => v.toFixed(2)).join(', ')}, …]
                </span>
              </div>
            </div>
          ))}
          <div style={{
            padding: 'var(--space-4) var(--space-5)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-primary-glow)',
            border: '1px solid var(--border-emphasis)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--accent-primary)',
            textAlign: 'center',
          }}>
            ↓ shared embedding space ↓
          </div>
        </div>
      )}

      {/* Footer caption */}
      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: 'var(--text-sm)',
        color: 'var(--accent-warm)',
        borderLeft: '2px solid var(--accent-warm)',
        paddingLeft: 'var(--space-4)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        Text, image, and audio for the same concept land near each other in vector space. That proximity is what multimodal reasoning is built on.
      </p>
    </div>
  );
}
