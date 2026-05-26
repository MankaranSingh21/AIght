'use client';

import { useState } from 'react';
import { PanelLabel } from './ConceptDemo';

// ── Data ─────────────────────────────────────────────────────────────────────

interface Scenario {
  id: string;
  label: string;
  query: string;
  schema: string;
  freeForm: string;
  structured: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'email',
    label: 'Email extraction',
    query: 'Extract the date and event from this email:\n"Hi team, the product launch is scheduled for March 14th. Please mark your calendars."',
    schema: `{
  "event": string,
  "date": string   // ISO 8601
}`,
    freeForm: 'The email mentions a product launch that is scheduled to take place on March 14th. The team has been asked to mark their calendars for this upcoming event.',
    structured: `{
  "event": "product launch",
  "date": "2026-03-14"
}`,
  },
  {
    id: 'invoice',
    label: 'Invoice parsing',
    query: 'Extract vendor and total from:\n"Invoice #1042 from Acme Corp. Total due: $3,200.00"',
    schema: `{
  "vendor": string,
  "invoice_id": string,
  "total_usd": number
}`,
    freeForm: 'This appears to be invoice number 1042 from Acme Corp. The total amount due according to the invoice is $3,200.00.',
    structured: `{
  "vendor": "Acme Corp",
  "invoice_id": "1042",
  "total_usd": 3200.00
}`,
  },
  {
    id: 'feedback',
    label: 'Sentiment tagging',
    query: 'Classify this feedback:\n"The UI is clean but the export button keeps freezing on large files."',
    schema: `{
  "sentiment": "positive"|"negative"|"mixed",
  "topics": string[],
  "actionable": boolean
}`,
    freeForm: 'The user seems to have mixed feelings. They appreciate the clean interface design but are frustrated by a technical issue — specifically the export button freezing when working with large files. This could be an engineering bug.',
    structured: `{
  "sentiment": "mixed",
  "topics": ["ui", "export", "performance"],
  "actionable": true
}`,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function StructuredOutputDemo() {
  const [activeId, setActiveId] = useState<string>(SCENARIOS[0].id);
  const scenario = SCENARIOS.find(s => s.id === activeId)!;

  return (
    <div>
      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            aria-pressed={s.id === activeId}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.05em',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              background: s.id === activeId ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
              color: s.id === activeId ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: s.id === activeId ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Query box */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: '0 0 var(--space-2)',
          }}
        >
          Query
        </p>
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          {scenario.query}
        </p>
      </div>

      {/* Two panels */}
      <div className="so-panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        {/* Free-form panel */}
        <div
          role="group"
          aria-label="Free-form output"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <PanelLabel>Free-Form</PanelLabel>
          <div
            style={{
              background: 'var(--bg-base)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4)',
              flex: 1,
              minHeight: 100,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {scenario.freeForm}
            </p>
          </div>
          <p
            aria-label="ambiguous"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--error)',
              margin: 0,
            }}
          >
            ✗ Ambiguous
          </p>
        </div>

        {/* Structured panel */}
        <div
          role="group"
          aria-label="JSON schema-constrained output"
          style={{
            background: 'var(--accent-primary-glow)',
            border: '1px solid var(--border-emphasis)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <PanelLabel accent>JSON Schema-Constrained</PanelLabel>
          {/* Schema */}
          <pre
            aria-label="JSON schema"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              background: 'var(--bg-base)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3)',
              margin: 0,
              overflowX: 'auto',
              whiteSpace: 'pre',
              lineHeight: 1.6,
              border: '1px solid var(--border-subtle)',
            }}
          >
            {scenario.schema}
          </pre>
          {/* Output */}
          <pre
            aria-label="structured JSON output"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent-primary)',
              background: 'var(--bg-base)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4)',
              margin: 0,
              overflowX: 'auto',
              whiteSpace: 'pre',
              lineHeight: 1.7,
              flex: 1,
            }}
          >
            {scenario.structured}
          </pre>
          <p
            aria-label="machine-readable"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              margin: 0,
            }}
          >
            ✓ Machine-Readable
          </p>
        </div>
      </div>

      {/* Mobile */}
      <style>{`
        @media (max-width: 640px) {
          .so-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
