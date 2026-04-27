'use client';
import { useState, useEffect, useRef } from 'react';

interface GoalData {
  echo: string;
  subtasks: string[];
  tools: string[];
  result: string;
}

const GOALS: Record<string, GoalData> = {
  'Book a flight': {
    echo: '"Book a flight" — parsed. Searching for routes.',
    subtasks: ['Search routes', 'Compare prices', 'Reserve seat'],
    tools: ['Web Search', 'Calendar'],
    result: 'Found 3 flights under $420. Reserved seat 12C on the 7:15 AM departure. Calendar blocked.',
  },
  'Write a weekly report': {
    echo: '"Write a weekly report" — scope defined. Gathering sources.',
    subtasks: ['Gather data', 'Draft sections', 'Format output'],
    tools: ['File Reader', 'Templates'],
    result: 'Report compiled: 4 sections, 847 words. Saved as weekly_report_apr25.md',
  },
  'Research a topic': {
    echo: '"Research a topic" — beginning retrieval across sources.',
    subtasks: ['Find sources', 'Extract key points', 'Synthesize'],
    tools: ['Web Search', 'Knowledge Base', 'Summarizer'],
    result: 'Synthesized 7 sources. Key finding: consensus shifted significantly post-2022. Three conflicting views noted.',
  },
};

const STEP_LABELS = [
  'Goal understood',
  'Breaking into tasks',
  'Selecting tools',
  'Executing...',
  'Complete',
];

export default function AgentsSimulation() {
  const [goal, setGoal] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  }

  function advanceStep(current: number) {
    if (current >= 4) return;
    stepTimerRef.current = setTimeout(() => {
      const next = current + 1;
      setActiveStep(next);
      if (next === 3) {
        // Fill progress bar over 1.5s, then reveal final step
        setProgress(0);
        let p = 0;
        const tick = 50;
        const totalTicks = 1500 / tick;
        progressTimerRef.current = setInterval(() => {
          p += 100 / totalTicks;
          setProgress(Math.min(100, p));
          if (p >= 100) {
            clearInterval(progressTimerRef.current!);
            stepTimerRef.current = setTimeout(() => setActiveStep(4), 250);
          }
        }, tick);
      } else {
        advanceStep(next);
      }
    }, 700);
  }

  function startGoal(g: string) {
    clearTimers();
    setGoal(g);
    setActiveStep(0);
    setProgress(0);
    advanceStep(0);
  }

  function reset() {
    clearTimers();
    setGoal(null);
    setActiveStep(-1);
    setProgress(0);
  }

  useEffect(() => () => clearTimers(), []);

  const goalData = goal ? GOALS[goal] : null;

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

      {/* Goal picker */}
      {!goal ? (
        <div>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-4)',
          }}>
            Pick a goal to watch an agent work:
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {Object.keys(GOALS).map(g => (
              <button
                key={g}
                onClick={() => startGoal(g)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-5)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-primary)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-primary)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      ) : goalData && (
        <div>
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-5)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--accent-primary)',
              letterSpacing: '0.06em',
            }}>
              goal: {goal}
            </span>
            <button
              onClick={reset}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: 4,
                padding: '2px 8px',
                cursor: 'pointer',
                transition: 'color 150ms ease',
              }}
            >
              reset ↺
            </button>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {STEP_LABELS.map((label, i) => {
              if (i > activeStep) return null;
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <div
                  key={i}
                  style={{
                    borderLeft: `3px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    paddingLeft: 'var(--space-4)',
                    paddingTop: 'var(--space-2)',
                    paddingBottom: 'var(--space-2)',
                    opacity: isPast ? 0.4 : 1,
                    transition: 'border-color 300ms ease, opacity 300ms ease',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    letterSpacing: '0.06em',
                    marginBottom: 'var(--space-2)',
                    transition: 'color 300ms ease',
                  }}>
                    ▸ {label}
                  </p>

                  {/* Step 0: goal echo */}
                  {i === 0 && (
                    <p style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.6,
                    }}>
                      {goalData.echo}
                    </p>
                  )}

                  {/* Step 1: subtask chips */}
                  {i === 1 && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {goalData.subtasks.map(t => (
                        <span key={t} className="tag tag-accent">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Step 2: tool badges */}
                  {i === 2 && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {goalData.tools.map(t => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Step 3: progress bar */}
                  {i === 3 && (
                    <div style={{
                      height: 4,
                      background: 'var(--bg-elevated)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'var(--accent-primary)',
                        borderRadius: 2,
                        transition: 'width 50ms linear',
                      }} />
                    </div>
                  )}

                  {/* Step 4: result */}
                  {i === 4 && (
                    <p style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.7,
                    }}>
                      {goalData.result}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
