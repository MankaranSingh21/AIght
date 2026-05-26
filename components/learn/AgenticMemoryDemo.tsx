'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// ── Data ─────────────────────────────────────────────────────────────────────

interface MemoryEntry {
  key: string;
  value: string;
  addedAt: number; // step index
}

interface Turn {
  step: number;
  userMsg: string;
  response: string;
  responseNoMemory?: string;  // only for turn 5 toggle
  newMemory?: MemoryEntry;
}

const TURNS: Turn[] = [
  {
    step: 0,
    userMsg: "I'm allergic to peanuts.",
    response: "Got it — I've noted your peanut allergy. I'll keep that in mind for any food-related suggestions.",
    newMemory: { key: 'allergy', value: 'peanuts', addedAt: 0 },
  },
  {
    step: 1,
    userMsg: 'Suggest a snack for me.',
    response: 'Given your peanut allergy, here are safe options: rice cakes with hummus, apple slices with sunflower seed butter, or a small handful of mixed nuts (avoiding peanuts).',
  },
  {
    step: 2,
    userMsg: 'I prefer salty over sweet.',
    response: 'Noted! Salty preference saved.',
    newMemory: { key: 'preference', value: 'salty over sweet', addedAt: 2 },
  },
  {
    step: 3,
    userMsg: "Pick a restaurant for tonight.",
    response: "Since you prefer salty flavours and have a peanut allergy, I'd suggest a Mediterranean spot — mezze platters are naturally salty and peanut-free. Avoid Thai or Indonesian places where peanut sauces are common.",
    responseNoMemory: "Sure! There are lots of great options depending on your cuisine preference. Pizza, sushi, or a burger place could all be good choices. What are you in the mood for?",
  },
  {
    step: 4,
    userMsg: 'What do you know about me so far?',
    response: "From our conversation: you have a peanut allergy and you prefer salty over sweet. That's what I have stored — I'll use both when making recommendations.",
  },
];

const ALL_MEMORY: MemoryEntry[] = [
  { key: 'allergy', value: 'peanuts', addedAt: 0 },
  { key: 'preference', value: 'salty over sweet', addedAt: 2 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgenticMemoryDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [noMemory, setNoMemory] = useState(false);

  const currentTurn = TURNS[activeStep];
  const visibleMemory = ALL_MEMORY.filter(m => m.addedAt <= activeStep);
  const isLastStep = activeStep === TURNS.length - 1;
  const isToggleTurn = activeStep === 3;

  const responseText = (isToggleTurn && noMemory && currentTurn.responseNoMemory)
    ? currentTurn.responseNoMemory
    : currentTurn.response;

  return (
    <StepThrough
      ariaLabel="Agentic memory across turns"
      totalSteps={TURNS.length}
      activeStep={activeStep}
      onNext={() => { setActiveStep(s => Math.min(TURNS.length - 1, s + 1)); setNoMemory(false); }}
      onBack={() => { setActiveStep(s => Math.max(0, s - 1)); setNoMemory(false); }}
      onReset={() => { setActiveStep(0); setNoMemory(false); }}
    >
      <style>{`
        .am-layout {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: var(--space-4);
        }
        @media (max-width: 640px) {
          .am-layout { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="am-layout">
        {/* Left: conversation turn */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Turn {activeStep + 1}
          </p>

          {/* User bubble */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 var(--space-2)' }}>User</p>
            <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
              {currentTurn.userMsg}
            </p>
          </div>

          {/* Memory grew indicator */}
          {currentTurn.newMemory && (
            <div
              aria-live="polite"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--accent-primary-glow)',
                border: '1px solid var(--border-emphasis)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)' }}>+ MEMORY STORED</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{currentTurn.newMemory.key}: "{currentTurn.newMemory.value}"</span>
            </div>
          )}

          {/* Toggle for step 4 */}
          {isToggleTurn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button
                onClick={() => setNoMemory(v => !v)}
                aria-pressed={noMemory}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-sm)',
                  background: noMemory ? 'rgba(224,112,112,0.1)' : 'var(--bg-elevated)',
                  color: noMemory ? 'var(--error)' : 'var(--text-secondary)',
                  border: `1px solid ${noMemory ? 'var(--error)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {noMemory ? '✗ Without memory' : '○ Toggle: without memory'}
              </button>
            </div>
          )}

          {/* Assistant response */}
          <div
            aria-live="polite"
            style={{
              background: noMemory && isToggleTurn ? 'rgba(30,26,22,0.8)' : 'var(--accent-primary-glow)',
              border: `1px solid ${noMemory && isToggleTurn ? 'var(--border-subtle)' : 'var(--border-emphasis)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              transition: 'background 200ms ease, border-color 200ms ease',
            }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: noMemory && isToggleTurn ? 'var(--text-muted)' : 'var(--accent-primary)', margin: '0 0 var(--space-2)' }}>
              {noMemory && isToggleTurn ? 'Assistant (no memory)' : 'Assistant'}
            </p>
            <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.75, margin: 0 }}>
              {responseText}
            </p>
          </div>

          {isLastStep && (
            <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              The memory bank persists across turns. Go back to step 4 and toggle "without memory" to see the difference.
            </p>
          )}
        </div>

        {/* Right: memory bank */}
        <div
          role="complementary"
          aria-label="Memory bank"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            alignSelf: 'start',
          }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
            Memory Bank
          </p>
          {visibleMemory.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              (empty)
            </p>
          ) : (
            visibleMemory.map(m => (
              <div
                key={m.key}
                aria-label={`${m.key}: ${m.value}`}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-2) var(--space-3)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.06em', margin: '0 0 2px' }}>
                  {m.key}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
                  {m.value}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </StepThrough>
  );
}
