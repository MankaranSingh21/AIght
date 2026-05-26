'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// ── Precomputed step data ─────────────────────────────────────────────────────

const TOOL_REGISTRY = [
  { name: 'get_weather', sig: '(location: string): WeatherResult' },
  { name: 'get_forecast', sig: '(location: string, days: number): ForecastResult' },
  { name: 'search_web', sig: '(query: string): SearchResult[]' },
];

const STEPS = [
  {
    label: 'User asks',
    heading: 'The question arrives.',
    sub: 'A natural-language request the model cannot answer from memory alone.',
    content: (
      <div style={{ padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
        <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
          "What's the weather in San Francisco and should I take an umbrella?"
        </p>
      </div>
    ),
  },
  {
    label: 'Model → tool call',
    heading: 'The model emits a call.',
    sub: 'It doesn\'t "call" anything — it outputs a JSON payload. Your code runs the function.',
    content: (
      <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'var(--accent-primary)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', border: '1px solid var(--border-emphasis)', margin: 0, overflowX: 'auto' }}>
{`{
  "tool_calls": [{
    "name": "get_weather",
    "arguments": {
      "location": "San Francisco, CA"
    }
  }]
}`}
      </pre>
    ),
  },
  {
    label: 'Tool executes',
    heading: 'Your code runs the function.',
    sub: 'The result is sent back to the model as a tool-role message.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>Tool result</p>
        <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'var(--accent-secondary)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', border: '1px solid rgba(0,255,209,0.2)', margin: 0, overflowX: 'auto' }}>
{`{
  "temp_f": 62,
  "condition": "overcast",
  "rain_chance_pct": 70,
  "humidity": 84
}`}
        </pre>
      </div>
    ),
  },
  {
    label: 'Model reasons',
    heading: 'The model interprets the result.',
    sub: 'It may make another tool call — or decide it has enough to answer.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-warm)', letterSpacing: '0.06em' }}>MODEL THINKING</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>(not shown to user)</span>
        </div>
        <div style={{ padding: 'var(--space-4)', background: 'rgba(244,171,31,0.06)', border: '1px solid rgba(244,171,31,0.18)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            I have temp (62°F) and rain chance (70%). That's enough to advise on the umbrella question. No second call needed.
          </p>
        </div>
      </div>
    ),
  },
  {
    label: 'Final answer',
    heading: 'The model responds to the user.',
    sub: 'Grounded in the tool result, not in training data memory.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--accent-primary-glow)', border: '1px solid var(--border-emphasis)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
            It's 62°F and overcast in San Francisco right now, with a <strong>70% chance of rain</strong>. Yes — take an umbrella.
          </p>
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
          Answer grounded in live tool data, not model weights
        </p>
      </div>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function FunctionCallingDemo() {
  const [step, setStep] = useState(0);

  const current = STEPS[step];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 'var(--space-4)', alignItems: 'start' }} className="fc-layout">
      <StepThrough
        ariaLabel="Function calling tool loop"
        totalSteps={STEPS.length}
        activeStep={step}
        onNext={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
        onBack={() => setStep(s => Math.max(0, s - 1))}
        onReset={() => setStep(0)}
      >
        <div style={{ minHeight: 180 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-1)', marginTop: 0 }}>
            {current.heading}
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)', marginTop: 0 }}>
            {current.sub}
          </p>
          {current.content}
        </div>
      </StepThrough>

      {/* Tool registry sidebar */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', flexShrink: 0 }} aria-label="Available tool registry">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 var(--space-3)' }}>
          Tool Registry
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {TOOL_REGISTRY.map((t, i) => (
            <div
              key={t.name}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: step === 1 && i === 0 ? 'var(--accent-primary-glow)' : 'transparent',
                border: `1px solid ${step === 1 && i === 0 ? 'var(--border-emphasis)' : 'transparent'}`,
                transition: 'all 200ms ease',
              }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: step === 1 && i === 0 ? 'var(--accent-primary)' : 'var(--text-secondary)', margin: 0, wordBreak: 'break-all' }}>
                {t.name}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', margin: 0, wordBreak: 'break-all' }}>
                {t.sig}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .fc-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
