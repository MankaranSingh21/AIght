'use client';

import { useState, useRef } from 'react';

interface DocumentChunk {
  id: number;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

const CHUNKS: DocumentChunk[] = [
  {
    id: 1,
    category: 'Remote Work',
    title: 'Work-from-Home Policy',
    content:
      'Employees may work remotely up to 3 days per week with manager approval. Full-remote arrangements require VP sign-off and a quarterly in-person review. All remote employees must maintain core hours of 10 AM–3 PM in their local timezone.',
    keywords: ['remote', 'work from home', 'wfh', 'home', 'office', 'hybrid', 'core hours', 'location'],
  },
  {
    id: 2,
    category: 'Time Off',
    title: 'Vacation & PTO',
    content:
      'Full-time employees accrue 15 days of PTO annually, increasing to 20 days after 3 years. PTO must be requested at least 2 weeks in advance for periods exceeding 5 days. Unused PTO carries over up to a maximum of 10 days per calendar year.',
    keywords: ['pto', 'vacation', 'time off', 'leave', 'holiday', 'accrual', 'days', 'annual'],
  },
  {
    id: 3,
    category: 'Performance',
    title: 'Review Cycle & Promotions',
    content:
      'Performance reviews are conducted twice annually: in June and December. Each review includes a self-assessment, peer feedback, and a manager evaluation. Promotion eligibility requires a rating of "Exceeds Expectations" in at least two consecutive review cycles.',
    keywords: ['performance', 'review', 'promotion', 'rating', 'feedback', 'cycle', 'annual', 'evaluation'],
  },
  {
    id: 4,
    category: 'Benefits',
    title: 'Health & Dental Coverage',
    content:
      'The company covers 90% of premiums for medical, dental, and vision insurance for employees, and 70% for dependents. Enrollment is open during the first 30 days of employment and each November. A $500 annual wellness stipend is available for gym memberships, therapy, or fitness equipment.',
    keywords: ['health', 'dental', 'vision', 'insurance', 'benefits', 'medical', 'wellness', 'premium', 'stipend'],
  },
  {
    id: 5,
    category: 'Finance',
    title: 'Expense Reimbursement',
    content:
      'Business expenses under $75 can be submitted without prior approval. Expenses between $75–$500 require manager approval before purchase. All expenses must be submitted within 30 days via the Expensify portal with original receipts. Travel expenses follow a separate per-diem schedule.',
    keywords: ['expense', 'reimbursement', 'travel', 'receipt', 'approval', 'purchase', 'budget', 'cost'],
  },
  {
    id: 6,
    category: 'Conduct',
    title: 'Conflicts of Interest',
    content:
      'Employees must disclose any outside employment, financial interest, or personal relationship that could conflict with company interests. Disclosure forms must be submitted to HR within 14 days of a conflict arising. Failure to disclose may result in disciplinary action up to and including termination.',
    keywords: ['conflict', 'interest', 'outside', 'employment', 'disclosure', 'conduct', 'ethics', 'hr'],
  },
];

const CANNED_ANSWERS: Record<string, string> = {
  '1,2':
    'According to the handbook, you can work remotely up to 3 days per week with manager approval, maintaining core hours of 10 AM–3 PM local time. For time off, full-time employees accrue 15 days of PTO annually (20 after 3 years), with requests for 5+ days requiring 2 weeks notice.',
  '1,3':
    'Remote work is allowed up to 3 days per week with manager sign-off, with full-remote needing VP approval. Your performance is reviewed twice a year (June and December), and promotions require "Exceeds Expectations" in two consecutive cycles.',
  '1,4':
    'The company supports remote work up to 3 days per week. On the benefits side, 90% of medical, dental, and vision premiums are covered for employees, plus a $500 annual wellness stipend for gym, therapy, or equipment.',
  '1,5':
    'For remote work, you can work from home up to 3 days per week with manager approval. Separately, business expenses under $75 need no prior approval — just submit them within 30 days via Expensify with receipts.',
  '1,6':
    'The remote work policy allows up to 3 days per week from home with manager approval. If you have any outside employment or financial interests that could conflict with your role, you must disclose them to HR within 14 days.',
  '2,3':
    'You accrue 15 days of PTO per year (20 after 3 years), with a 10-day carryover maximum. Performance reviews happen in June and December — a rating of "Exceeds Expectations" in two consecutive cycles is required for promotion eligibility.',
  '2,4':
    'PTO accrues at 15 days per year and increases to 20 after 3 years. The company also covers 90% of health, dental, and vision premiums, with a $500 wellness stipend available annually.',
  '2,5':
    'Full-time employees get 15 days of PTO annually, increasing to 20 after 3 years. For expenses, anything under $75 requires no prior approval — submit within 30 days with receipts via Expensify.',
  '2,6':
    'PTO accrues at 15 days per year and carries over up to 10 unused days. Separately, any conflicts of interest — outside employment, financial ties — must be disclosed to HR within 14 days of arising.',
  '3,4':
    'Performance reviews are held in June and December, with peer feedback and self-assessments. Your benefits include 90% coverage on medical, dental, and vision, plus a $500 wellness stipend each year.',
  '3,5':
    'Reviews happen twice a year in June and December. Promotion requires "Exceeds Expectations" two cycles running. On expenses: under $75 needs no approval, $75–$500 needs manager sign-off before purchase.',
  '3,6':
    'Performance is reviewed in June and December, and promotions require two strong consecutive ratings. Any conflicts of interest — including outside work — must be disclosed to HR within 14 days.',
  '4,5':
    'Health benefits cover 90% of premiums for medical, dental, and vision, plus a $500 wellness stipend. Business expenses under $75 require no approval; $75–$500 need manager sign-off before purchase.',
  '4,6':
    'The company covers 90% of medical, dental, and vision premiums for employees. Regarding conduct: any conflicts of interest, such as outside employment or personal financial stakes, must be disclosed to HR within 14 days.',
  '5,6':
    'Expenses under $75 can be submitted without approval; $75–$500 needs prior manager sign-off. Separately, if you have any outside employment or financial conflicts of interest, you must disclose them to HR within 14 days of the conflict arising.',
};

function scoreChunk(chunk: DocumentChunk, query: string): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const kw of chunk.keywords) {
    if (q.includes(kw)) score += 3;
  }
  for (const word of words) {
    if (word.length < 3) continue;
    if (chunk.content.toLowerCase().includes(word)) score += 1;
    if (chunk.title.toLowerCase().includes(word)) score += 2;
  }
  return score;
}

export default function RagSimulation() {
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'found' | 'answered'>('idle');
  const [answer, setAnswer] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch() {
    if (!query.trim()) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const scores = CHUNKS.map((c) => ({ id: c.id, score: scoreChunk(c, query) }));
    scores.sort((a, b) => b.score - a.score);
    const top2 = scores.slice(0, 2).map((s) => s.id).sort((a, b) => a - b);

    setHighlighted(top2);
    setPhase('found');
    setAnswer('');

    const key = top2.join(',');
    const canned =
      CANNED_ANSWERS[key] ??
      'Based on the retrieved sections of the handbook, the most relevant information has been highlighted above. Review those chunks for the specific policy details that apply to your question.';

    timerRef.current = setTimeout(() => {
      setAnswer(canned);
      setPhase('answered');
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        margin: 'var(--space-10) 0',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-4)',
        }}
      >
        INTERACTIVE — try it
      </p>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something about the company handbook..."
          style={{
            flex: 1,
            height: '48px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0 var(--space-4)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            height: '48px',
            padding: '0 var(--space-6)',
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
          Search
        </button>
      </div>

      {/* Chunk label */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-3)',
        }}
      >
        Document corpus — 6 chunks
      </p>

      {/* Chunk grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {CHUNKS.map((chunk) => {
          const isHighlighted = highlighted.includes(chunk.id);
          return (
            <div
              key={chunk.id}
              style={{
                background: isHighlighted ? 'var(--accent-primary-glow)' : 'var(--bg-surface)',
                border: `1px solid ${isHighlighted ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                transition: 'border-color 200ms ease, background 200ms ease',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isHighlighted ? 'var(--accent-primary)' : 'var(--text-muted)',
                  marginBottom: 'var(--space-2)',
                  transition: 'color 200ms ease',
                }}
              >
                {chunk.category}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                  lineHeight: 1.3,
                }}
              >
                {chunk.title}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {chunk.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Result panel */}
      {phase !== 'idle' && (
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderLeft: '3px solid var(--accent-primary)',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            padding: 'var(--space-6)',
            opacity: 1,
            transition: 'opacity 300ms ease',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Found 2 relevant chunks. {phase === 'found' ? 'Generating answer...' : 'Answer ready.'}
          </p>
          {phase === 'answered' && answer && (
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'var(--text-base)',
                color: 'var(--text-primary)',
                lineHeight: 1.85,
                animation: 'ragFadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
              }}
            >
              {answer}
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes ragFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: var(--text-muted); }
        input:focus { border-color: var(--border-emphasis); }
      `}</style>
    </div>
  );
}
