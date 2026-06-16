'use client';

import { useEffect, useRef, useState } from 'react';
import CheckQuestion from '@/components/lessons/CheckQuestion';
import { recordConceptCheck, XP } from '@/lib/progress';
import type { ConceptCheckQuestion } from '@/lib/checks';

interface ConceptCheckProps {
  slug: string;
  questions: ConceptCheckQuestion[];
}

/**
 * Inline knowledge check appended to a concept article (Wave 2). Turns a
 * passive read into active recall, and awards XP once via the shared progress
 * engine. Reuses the lesson player's CheckQuestion for the per-question UI;
 * here we just group them under one header and track which are solved.
 */
export default function ConceptCheck({ slug, questions }: ConceptCheckProps) {
  const [selected, setSelected] = useState<(number | null)[]>(() => questions.map(() => null));
  const awarded = useRef(false);

  const allSolved = questions.every((q, i) => {
    const pick = selected[i];
    return pick !== null && q.choices[pick]?.correct === true;
  });

  // Award once, the first time every question is solved. recordConceptCheck is
  // itself idempotent per slug, so a refresh after passing earns nothing.
  useEffect(() => {
    if (allSolved && !awarded.current) {
      awarded.current = true;
      recordConceptCheck(slug);
    }
  }, [allSolved, slug]);

  const multi = questions.length > 1;

  return (
    <section
      aria-label="Knowledge check"
      style={{
        marginTop: 64,
        paddingTop: 40,
        borderTop: '1px solid rgba(245,239,224,0.07)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--accent-primary)',
          margin: '0 0 8px',
        }}
      >
        ◈ Check yourself
      </p>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          margin: '0 0 var(--space-8)',
          maxWidth: '52ch',
        }}
      >
        You just read it — now see if it stuck. No score, no penalty for a wrong pick.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
        {questions.map((q, i) => (
          <div key={q.prompt}>
            {multi && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  margin: '0 0 var(--space-3)',
                }}
              >
                Question {i + 1} of {questions.length}
              </p>
            )}
            <CheckQuestion
              prompt={q.prompt}
              choices={q.choices}
              selected={selected[i]}
              hideEyebrow
              onSelect={(idx) =>
                setSelected((prev) => prev.map((v, j) => (j === i ? idx : v)))
              }
            />
          </div>
        ))}
      </div>

      {allSolved && (
        <p
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            margin: 'var(--space-8) 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span aria-hidden>✓</span>
          {multi ? 'All clear' : 'Nailed it'} · +{XP.conceptCheck} xp logged
        </p>
      )}
    </section>
  );
}
