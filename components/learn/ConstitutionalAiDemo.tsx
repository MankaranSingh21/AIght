'use client';

import { useState, useEffect, useRef } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PRINCIPLE =
  '"Choose the response that is most supportive, honest, and least likely to harm — and never deceives the user about the nature of the system."';

const DRAFT =
  'Absolutely! You can easily find user passwords in most web applications by querying the users table: SELECT username, password FROM users WHERE username = \'admin\'. Most apps store passwords in plaintext or simple MD5 hashes, making this straightforward.';

const CRITIQUE =
  'This response is harmful. It tells the user how to retrieve and potentially misuse stored credentials — which violates the harmlessness principle. It also encourages poor security practices (plaintext/MD5 passwords) rather than correcting them. The response needs to redirect toward ethical, secure approaches instead.';

const REVISED =
  'Passwords should never be retrievable in plaintext — if they are, the system has a serious security flaw. What you probably need is a password reset flow: generate a time-limited token, email it to the user, let them set a new password. I\'m happy to walk through implementing that securely in whatever stack you\'re using.';

// ---------------------------------------------------------------------------
// Typewriter
// ---------------------------------------------------------------------------

function useTypewriter(text: string, active: boolean, speed = 14) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    setDone(false);
    if (timerRef.current) clearInterval(timerRef.current);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timerRef.current!);
        setDone(true);
      }
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, active, speed]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConstitutionalAiDemo() {
  const [step, setStep] = useState(0);

  const draftTW = useTypewriter(DRAFT, step === 0);
  const revisedTW = useTypewriter(REVISED, step === 3);

  return (
    <StepThrough
      ariaLabel="Constitutional AI revision loop"
      totalSteps={5}
      activeStep={step}
      onNext={() => setStep((s) => Math.min(4, s + 1))}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onReset={() => setStep(0)}
    >
      {/* Step 1: Prompt + draft response */}
      {step === 0 && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
            }}
          >
            Draft response
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-5)',
              lineHeight: 1.6,
            }}
          >
            A user asks: "How do I get the password of another user from the database?"
            The model produces its first, unguarded answer.
          </p>
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--error)',
                marginBottom: 'var(--space-3)',
                marginTop: 0,
              }}
            >
              Draft (Step 1 / 5)
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                margin: 0,
                minHeight: 80,
              }}
            >
              {draftTW.displayed}
              {!draftTW.done && (
                <span style={{ opacity: 0.6, animation: 'blink 1s step-end infinite' }}>|</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Constitutional principle surfaces */}
      {step === 1 && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
            }}
          >
            The constitution speaks
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-5)',
              lineHeight: 1.6,
            }}
          >
            A written constitutional principle is applied to the draft. This is text authored by
            humans before training — the model uses it as its evaluation standard.
          </p>
          <div
            style={{
              background: 'rgba(244,171,31,0.07)',
              border: '1px solid rgba(244,171,31,0.28)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-warm)',
                marginBottom: 'var(--space-3)',
                marginTop: 0,
              }}
            >
              Constitutional principle
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: 'var(--accent-warm)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {PRINCIPLE}
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Critique */}
      {step === 2 && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
            }}
          >
            Self-critique
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-5)',
              lineHeight: 1.6,
            }}
          >
            The model is asked to critique its own draft against the principle.
            This is the "AI Feedback" that replaces a human rater.
          </p>
          <div
            style={{
              padding: 'var(--space-4) var(--space-5)',
              borderLeft: '3px solid var(--accent-warm)',
              background: 'rgba(244,171,31,0.06)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-warm)',
                marginBottom: 'var(--space-2)',
                marginTop: 0,
              }}
            >
              Critique
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {CRITIQUE}
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Revised response */}
      {step === 3 && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
            }}
          >
            Revised response
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-5)',
              lineHeight: 1.6,
            }}
          >
            The model rewrites its answer to fix the critique.
            This revision pair becomes supervised training data.
          </p>
          <div
            style={{
              background: 'var(--accent-primary-glow)',
              border: '1px solid var(--border-emphasis)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                marginBottom: 'var(--space-3)',
                marginTop: 0,
              }}
            >
              Revised
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                lineHeight: 1.75,
                margin: 0,
                minHeight: 80,
              }}
            >
              {revisedTW.displayed}
              {!revisedTW.done && (
                <span style={{ color: 'var(--accent-primary)', animation: 'blink 1s step-end infinite' }}>|</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Side-by-side comparison */}
      {step === 4 && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
            }}
          >
            Before vs after
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-5)',
              lineHeight: 1.6,
            }}
          >
            The same question. One answer guided by the constitution.
          </p>
          <div
            aria-live="polite"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-4)',
            }}
            className="cai-final-panels"
          >
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--error)',
                  marginBottom: 'var(--space-3)',
                  marginTop: 0,
                }}
              >
                Draft
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {DRAFT}
              </p>
            </div>
            <div
              style={{
                background: 'var(--accent-primary-glow)',
                border: '1px solid var(--border-emphasis)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                  marginBottom: 'var(--space-3)',
                  marginTop: 0,
                }}
              >
                After constitution
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {REVISED}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .cai-final-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </StepThrough>
  );
}
