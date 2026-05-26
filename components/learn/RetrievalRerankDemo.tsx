'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// ── Data ─────────────────────────────────────────────────────────────────────

const QUERY = 'How do I configure a Postgres connection pool?';

interface Doc {
  id: string;
  label: string;
  retrieveScore: number;  // cosine similarity 0-1
  rerankScore: number;    // cross-encoder 0-1
  topK: boolean;          // in top-5 after rerank
}

const DOCS: Doc[] = [
  { id: 'D01', label: 'postgres/conn-pool.md',       retrieveScore: 0.89, rerankScore: 0.95, topK: true  },
  { id: 'D02', label: 'postgres/getting-started.md', retrieveScore: 0.84, rerankScore: 0.88, topK: true  },
  { id: 'D03', label: 'postgres/pooler-config.md',   retrieveScore: 0.78, rerankScore: 0.91, topK: true  },
  { id: 'D04', label: 'postgres/env-vars.md',        retrieveScore: 0.74, rerankScore: 0.72, topK: false },
  { id: 'D05', label: 'pg-bouncer/setup.md',         retrieveScore: 0.71, rerankScore: 0.93, topK: true  },
  { id: 'D06', label: 'postgres/migrations.md',      retrieveScore: 0.69, rerankScore: 0.41, topK: false },
  { id: 'D07', label: 'pg-bouncer/tuning.md',        retrieveScore: 0.67, rerankScore: 0.86, topK: true  },
  { id: 'D08', label: 'nodejs/db-drivers.md',        retrieveScore: 0.65, rerankScore: 0.55, topK: false },
  { id: 'D09', label: 'redis/caching.md',            retrieveScore: 0.59, rerankScore: 0.18, topK: false },
  { id: 'D10', label: 'postgres/indexes.md',         retrieveScore: 0.55, rerankScore: 0.38, topK: false },
  { id: 'D11', label: 'postgres/transactions.md',    retrieveScore: 0.52, rerankScore: 0.32, topK: false },
  { id: 'D12', label: 'docker/networking.md',        retrieveScore: 0.50, rerankScore: 0.22, topK: false },
  { id: 'D13', label: 'postgres/auth.md',            retrieveScore: 0.47, rerankScore: 0.29, topK: false },
  { id: 'D14', label: 'prisma/config.md',            retrieveScore: 0.45, rerankScore: 0.48, topK: false },
  { id: 'D15', label: 'postgres/replication.md',     retrieveScore: 0.43, rerankScore: 0.19, topK: false },
];

// Generate 35 more placeholder docs for the "50 docs" visual
const EXTRA_IDS = Array.from({ length: 35 }, (_, i) => {
  const n = i + 16;
  return {
    id: `D${String(n).padStart(2, '0')}`,
    label: `docs/misc-${n}.md`,
    retrieveScore: Math.round((0.4 - i * 0.008) * 100) / 100,
    rerankScore: Math.round((0.15 + Math.random() * 0.2) * 100) / 100,
    topK: false,
  };
});

const ALL_DOCS: Doc[] = [...DOCS, ...EXTRA_IDS];

// ── Sub-components ─────────────────────────────────────────────────────────────

function ScoreBar({ value, accent }: { value: number; accent?: boolean }) {
  return (
    <div
      style={{
        width: '100%',
        height: 4,
        background: 'var(--bg-base)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${value * 100}%`,
          height: '100%',
          background: accent ? 'var(--accent-primary)' : 'var(--accent-secondary)',
          borderRadius: 2,
          transition: 'width 400ms ease',
        }}
      />
    </div>
  );
}

function DocChip({
  doc,
  showScore,
  highlight,
  scoreKey,
}: {
  doc: Doc;
  showScore: boolean;
  highlight: boolean;
  scoreKey: 'retrieveScore' | 'rerankScore';
}) {
  const score = doc[scoreKey];
  return (
    <div
      aria-label={`${doc.label} score ${score}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        padding: '6px 8px',
        borderRadius: 'var(--radius-sm)',
        background: highlight ? 'var(--accent-primary-glow)' : 'var(--bg-base)',
        border: `1px solid ${highlight ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
        minWidth: 0,
        transition: 'background 200ms ease, border-color 200ms ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: highlight ? 'var(--accent-primary)' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 140,
        }}
      >
        {doc.id}
      </span>
      {showScore && (
        <>
          <ScoreBar value={score} accent={highlight} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
            }}
          >
            {score.toFixed(2)}
          </span>
        </>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RetrievalRerankDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const rerankSorted = [...ALL_DOCS].sort((a, b) => b.rerankScore - a.rerankScore);
  const top5 = rerankSorted.slice(0, 5);

  return (
    <StepThrough
      ariaLabel="Retrieval + rerank pipeline"
      totalSteps={4}
      activeStep={activeStep}
      onNext={() => setActiveStep(s => Math.min(3, s + 1))}
      onBack={() => setActiveStep(s => Math.max(0, s - 1))}
      onReset={() => setActiveStep(0)}
    >
      <style>{`
        .rr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: var(--space-2);
        }
        @media (max-width: 640px) {
          .rr-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
        }
      `}</style>

      {/* Step 1 — User query → embedding vector */}
      {activeStep === 0 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            User query
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.6, margin: '0 0 var(--space-5)' }}>
            The query is embedded into a vector — a list of numbers that encode semantic meaning.
          </p>

          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 var(--space-3)' }}>Query</p>
            <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: '0 0 var(--space-4)', lineHeight: 1.6 }}>
              "{QUERY}"
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 var(--space-2)' }}>Embedding vector</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[0.12, -0.84, 0.33, 0.07, -0.51, 0.92, -0.18, 0.64, 0.29, -0.73, 0.45, -0.11].map((v, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  background: v > 0 ? 'rgba(170,255,77,0.08)' : 'rgba(0,255,209,0.06)',
                  color: v > 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  {v > 0 ? '+' : ''}{v.toFixed(2)}
                </span>
              ))}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', alignSelf: 'center' }}>… (1536 dims)</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Retriever fetches top-50 by cosine similarity */}
      {activeStep === 1 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            Retriever fetches top-50
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 var(--space-4)' }}>
            Cosine similarity against all indexed docs. Fast but approximate — scores spread widely (0.4–0.9).
          </p>
          <div className="rr-grid" style={{ marginBottom: 'var(--space-4)' }}>
            {ALL_DOCS.map(doc => (
              <DocChip key={doc.id} doc={doc} showScore highlight={false} scoreKey="retrieveScore" />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            50 candidates · sorted by cosine similarity
          </p>
        </div>
      )}

      {/* Step 3 — Reranker re-scores */}
      {activeStep === 2 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            Reranker re-scores top-50
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 var(--space-4)' }}>
            Cross-encoder reads query + each doc together. Scores tighten and reorder — some docs jump, others fall.
          </p>
          <div className="rr-grid" style={{ marginBottom: 'var(--space-4)' }}>
            {rerankSorted.map(doc => (
              <DocChip key={doc.id} doc={doc} showScore={false} highlight={doc.topK} scoreKey="rerankScore" />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            50 docs re-scored · highlighted = new top-5
          </p>
        </div>
      )}

      {/* Step 4 — Top-5 to context */}
      {activeStep === 3 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            Top-5 to context window
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 var(--space-4)' }}>
            Only the 5 highest-scoring docs reach the LLM. Everything else is discarded.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
            {top5.map((doc, i) => (
              <div
                key={doc.id}
                aria-label={`rank ${i + 1}: ${doc.label}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  background: 'var(--accent-primary-glow)',
                  border: '1px solid var(--border-emphasis)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-primary)', minWidth: 24 }}>#{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)', flex: 1 }}>{doc.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-primary)' }}>{doc.rerankScore.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            padding: 'var(--space-4) var(--space-5)',
            borderLeft: '3px solid var(--border-emphasis)',
            background: 'var(--accent-primary-glow)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            margin: 0,
          }}>
            Cheap retriever pulls candidates. Expensive reranker picks winners. Best of both.
          </p>
        </div>
      )}
    </StepThrough>
  );
}
