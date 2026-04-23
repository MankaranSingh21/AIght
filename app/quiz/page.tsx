'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import fieldsData from '@/content/paths/fields.json';

type FieldData = (typeof fieldsData)[0];
type QuizStep = 'field' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'results';

// Easy = field is highly susceptible to AI disruption (high base score)
const DIFFICULTY_BASE: Record<string, number> = { Easy: 68, Medium: 48, Hard: 28 };

const Q_SCORES: Record<string, Record<string, number>> = {
  q1: {
    'Highly predictable': 16,
    'Mostly routine': 6,
    'A mix of both': -2,
    'Highly unpredictable': -12,
  },
  q2: {
    Never: 10,
    Rarely: 4,
    Often: -10,
    Constantly: -20,
  },
  q3: {
    'Very little': 10,
    Some: 0,
    Most: -10,
    'Nearly all': -20,
  },
  q4: {
    Rarely: 10,
    Sometimes: 0,
    Often: -10,
    Daily: -18,
  },
  q5: {
    // Can output be verified without domain expertise?
    // Objective/verifiable output → more automatable (higher risk)
    'Yes — clear quality standards exist': 12,
    'Partly — experts can spot-check key decisions': 4,
    'Rarely — only a peer expert can judge quality': -8,
    'Never — judgment is intrinsic and non-transferable': -16,
  },
  q6: {
    // AI adoption = lower risk (you're already augmenting, not being replaced)
    "I've deeply integrated AI tools into my daily workflow": -18,
    'I use AI tools a few times a week': -8,
    'I experiment occasionally but nothing habitual': 4,
    'I avoid them or my workplace blocks them': 14,
  },
};

const QUESTIONS: Record<string, { number: number; question: string; options: string[] }> = {
  q1: {
    number: 1,
    question: 'How predictable are the problems you solve on a typical day?',
    options: ['Highly predictable', 'Mostly routine', 'A mix of both', 'Highly unpredictable'],
  },
  q2: {
    number: 2,
    question:
      'Does your role require navigating unpredictable physical environments or complex manual dexterity?',
    options: ['Never', 'Rarely', 'Often', 'Constantly'],
  },
  q3: {
    number: 3,
    question:
      'How central is deep human trust or navigating complex emotional situations to your work?',
    options: ['Very little', 'Some', 'Most', 'Nearly all'],
  },
  q4: {
    number: 4,
    question: 'How often do you have to invent new strategies or synthesize ideas across unrelated domains?',
    options: ['Rarely', 'Sometimes', 'Often', 'Daily'],
  },
  q5: {
    number: 5,
    question: "Can your work output be evaluated by someone who doesn't share your expertise?",
    options: [
      'Yes — clear quality standards exist',
      'Partly — experts can spot-check key decisions',
      'Rarely — only a peer expert can judge quality',
      'Never — judgment is intrinsic and non-transferable',
    ],
  },
  q6: {
    number: 6,
    question: 'How much are you already using AI tools in your daily work?',
    options: [
      "I've deeply integrated AI tools into my daily workflow",
      'I use AI tools a few times a week',
      'I experiment occasionally but nothing habitual',
      'I avoid them or my workplace blocks them',
    ],
  },
};

const STEP_DOT: Record<QuizStep, number> = {
  field: 1, q1: 2, q2: 2, q3: 3, q4: 3, q5: 4, q6: 4, results: 4,
};

const STEP_LABEL: Record<QuizStep, string> = {
  field: 'Step 1 of 4',
  q1: 'Step 2 of 4',
  q2: 'Step 2 of 4',
  q3: 'Step 3 of 4',
  q4: 'Step 3 of 4',
  q5: 'Step 4 of 4',
  q6: 'Step 4 of 4',
  results: 'Your results',
};

const NEXT_STEP: Record<QuizStep, QuizStep | null> = {
  field: 'q1', q1: 'q2', q2: 'q3', q3: 'q4', q4: 'q5', q5: 'q6', q6: 'results', results: null,
};

function conceptToSlug(concept: string): string {
  const lower = concept.toLowerCase();
  if (lower.includes('retrieval') || lower.includes('rag')) return 'rag';
  if (lower.includes('mcp') || lower.includes('model context')) return 'mcp';
  if (lower.includes('agent') || lower.includes('autonomous') || lower.includes('conversational')) return 'agents';
  if (lower.includes('embed') || lower.includes('predictive') || lower.includes('vector')) return 'embeddings';
  if (
    lower.includes('transform') ||
    lower.includes('attention') ||
    lower.includes('diffusion') ||
    lower.includes('generative') ||
    lower.includes('multimodal') ||
    lower.includes('vision') ||
    lower.includes('graph neural')
  )
    return 'transformers';
  if (lower.includes('fine-tun') || lower.includes('finetun') || lower.includes('style transfer'))
    return 'fine-tuning';
  return 'rag';
}

function getScoreColor(score: number) {
  if (score <= 30) return 'var(--accent-primary)';
  if (score <= 55) return 'var(--accent-warm)';
  return 'var(--error)';
}

function getRiskLabel(score: number) {
  if (score <= 30) return 'Low disruption risk';
  if (score <= 55) return 'Moderate disruption risk';
  if (score <= 72) return 'High disruption risk';
  return 'Significant disruption ahead';
}

function getRiskSubtext(score: number) {
  if (score <= 30) return 'AI is a tool in your hands. Your work relies on dimensions that are difficult to automate.';
  if (score <= 55) return 'Parts of your role will change — likely the parts you find most routine. The human core of what you do still holds.';
  if (score <= 72) return 'Routine tasks in your field are already being automated. Adapting now — not later — is the edge.';
  return 'Your current role may look very different by 2027. The people thriving here will be those who become the experts at directing AI, not competing with it.';
}

function StepIndicator({ step }: { step: QuizStep }) {
  if (step === 'results') return null;
  const activeDot = STEP_DOT[step];
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((d) => (
          <div
            key={d}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: d <= activeDot ? 'var(--accent-primary)' : 'var(--border-default)',
              transition: 'background 200ms ease',
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}
      >
        {STEP_LABEL[step]}
      </span>
    </div>
  );
}

interface QuestionBlockProps {
  number: number;
  question: string;
  options: string[];
  flashed: string | null;
  onSelect: (value: string) => void;
}

function QuestionBlock({ number, question, options, flashed, onSelect }: QuestionBlockProps) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,239,224,0.30)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
        Question {number} of 5
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 24 }}>
        {question}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt) => {
          const isFlashed = flashed === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                textAlign: 'left',
                padding: '14px 20px',
                borderRadius: 10,
                border: `1px solid ${isFlashed ? 'rgba(170,255,77,0.35)' : 'rgba(245,239,224,0.09)'}`,
                background: isFlashed ? 'rgba(170,255,77,0.08)' : 'rgba(255,250,240,0.03)',
                backdropFilter: 'blur(12px)',
                color: isFlashed ? '#AAFF4D' : 'rgba(245,239,224,0.60)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const QUESTION_STEPS: QuizStep[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

export default function QuizPage() {
  const [step, setStep] = useState<QuizStep>('field');
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flashedOption, setFlashedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const quizRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll quiz container into view on each step change, accounting for fixed nav
  useEffect(() => {
    if (!quizRef.current) return;
    const top = quizRef.current.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [step]);

  // Trigger stagger animation after results render
  useEffect(() => {
    if (step === 'results') {
      const t = setTimeout(() => setAnimated(true), 80);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Count-up animation for score number
  useEffect(() => {
    if (!animated || step !== 'results') return;
    const startTime = performance.now();
    const duration = 1200;
    const target = score;

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplayScore(Math.round(eased * target));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animated, score, step]);

  function handleFieldSelect(field: FieldData) {
    setSelectedField(field);
    setFlashedOption(field.slug);
    setTimeout(() => {
      setFlashedOption(null);
      setStep('q1');
    }, 150);
  }

  function handleQuestionSelect(qKey: string, answer: string) {
    const next = NEXT_STEP[qKey as QuizStep];
    if (!next) return;

    setAnswers((prev) => ({ ...prev, [qKey]: answer }));
    setFlashedOption(answer);

    setTimeout(() => {
      setFlashedOption(null);

      if (next === 'results') {
        if (!selectedField) return;
        const allAnswers = { ...answers, [qKey]: answer };
        const base = DIFFICULTY_BASE[selectedField.difficulty] ?? 48;
        const raw =
          base +
          (Q_SCORES.q1[allAnswers.q1] ?? 0) +
          (Q_SCORES.q2[allAnswers.q2] ?? 0) +
          (Q_SCORES.q3[allAnswers.q3] ?? 0) +
          (Q_SCORES.q4[allAnswers.q4] ?? 0) +
          (Q_SCORES.q5[allAnswers.q5] ?? 0) +
          (Q_SCORES.q6[allAnswers.q6] ?? 0);
        setScore(Math.min(92, Math.max(8, raw)));
        setDisplayScore(0);
        setAnimated(false);
        setStep('results');
      } else {
        setStep(next);
      }
    }, 150);
  }

  function handleRetake() {
    cancelAnimationFrame(rafRef.current);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setStep('field');
    setSelectedField(null);
    setAnswers({});
    setScore(0);
    setDisplayScore(0);
    setAnimated(false);
    setFlashedOption(null);
    setCopied(false);
  }

  function handleShare() {
    if (!selectedField) return;
    const text = `I just took the AI disruption quiz on AIght. My field (${selectedField.field}) scored ${score}/100 for disruption risk. Find out yours: aightai.in/quiz`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  // SVG circle meter
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = getScoreColor(score);
  const dashOffset = animated ? circumference * (1 - score / 100) : circumference;

  function fadeUp(delay: number): React.CSSProperties {
    return animated
      ? { animation: `fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }
      : { opacity: 0 };
  }

  const isQuestionStep = QUESTION_STEPS.includes(step);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <main className="px-6 md:px-12 lg:px-20 py-20 max-w-content mx-auto">
        <div ref={quizRef} style={{ scrollMarginTop: '84px' }}>
          <StepIndicator step={step} />

          {/* ── Step 1: Field selection ── */}
          {step === 'field' && (
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 14, margin: '0 0 14px' }}>
                How will AI affect you?
              </h1>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 17, color: 'rgba(245,239,224,0.55)', lineHeight: 1.8, maxWidth: '48ch', marginBottom: 56 }}>
                Select your field. We&apos;ll ask five questions and give you an honest disruption score.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {fieldsData.map((field) => {
                  const isFlashed = flashedOption === field.slug;
                  return (
                    <button
                      key={field.slug}
                      onClick={() => handleFieldSelect(field as FieldData)}
                      style={{
                        textAlign: 'left',
                        padding: 20,
                        borderRadius: 12,
                        border: `1px solid ${isFlashed ? 'rgba(170,255,77,0.35)' : 'rgba(245,239,224,0.07)'}`,
                        background: isFlashed ? 'rgba(170,255,77,0.08)' : 'rgba(255,250,240,0.03)',
                        backdropFilter: 'blur(16px)',
                        transform: isFlashed ? 'translateY(-2px)' : 'translateY(0)',
                        transition: 'all 150ms ease',
                        cursor: 'pointer',
                      }}
                    >
                      <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: isFlashed ? '#AAFF4D' : '#F5EFE0', marginBottom: 6, lineHeight: 1.3 }}>
                        {field.field}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 12, color: 'rgba(245,239,224,0.45)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                        {field.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Steps 2–4: One question at a time ── */}
          {isQuestionStep && selectedField && (
            <div className="max-w-editorial mx-auto">
              <button
                onClick={() => setStep('field')}
                className="font-mono text-xs text-muted hover:text-secondary transition-colors duration-150 mb-8 flex items-center gap-2"
              >
                ← Change field
              </button>
              <p className="font-sans text-base text-secondary mb-10 leading-relaxed">
                <span className="font-medium text-primary">{selectedField.field}</span> — answer
                honestly. The more accurate your answers, the more useful the score.
              </p>
              <QuestionBlock
                number={QUESTIONS[step].number}
                question={QUESTIONS[step].question}
                options={QUESTIONS[step].options}
                flashed={flashedOption}
                onSelect={(answer) => handleQuestionSelect(step, answer)}
              />
            </div>
          )}

          {/* ── Results ── */}
          {step === 'results' && selectedField && (
            <div className="max-w-editorial mx-auto">

              {/* Score meter with radial glow */}
              <div className="flex flex-col items-center mb-14" style={fadeUp(0)}>
                <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 'var(--space-4)' }}>
                  {/* Radial glow — box-shadow spread, no filter blur */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      boxShadow: '0 0 70px 35px var(--accent-primary-glow)',
                      pointerEvents: 'none',
                    }}
                  />
                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    role="img"
                    aria-label={`Risk score: ${score} out of 100`}
                    style={{ position: 'relative' }}
                  >
                    <circle
                      cx="100" cy="100" r={radius}
                      fill="none" stroke="var(--bg-elevated)" strokeWidth="10"
                    />
                    <circle
                      cx="100" cy="100" r={radius}
                      fill="none" stroke={strokeColor} strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '100px 100px',
                        transition: 'stroke-dashoffset 1000ms ease-out',
                      }}
                    />
                    <text
                      x="100" y="92"
                      textAnchor="middle" dominantBaseline="middle"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '2.5rem',
                        fontWeight: 600,
                        fill: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {displayScore}
                    </text>
                    <text
                      x="100" y="126"
                      textAnchor="middle"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        fill: 'var(--text-muted)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      / 100
                    </text>
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, textAlign: 'center', color: strokeColor, letterSpacing: '-0.02em' }}>
                  {getRiskLabel(score)}
                </h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.30)', marginTop: 4, marginBottom: 12 }}>{selectedField.field}</p>
                <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, textAlign: 'center', color: 'rgba(245,239,224,0.55)', maxWidth: '38ch', lineHeight: 1.7 }}>
                  {getRiskSubtext(score)}
                </p>
              </div>

              {/* Action paragraph as pull quote */}
              <blockquote
                style={{
                  ...fadeUp(120),
                  borderLeft: '3px solid var(--accent-warm)',
                  paddingLeft: 'var(--space-6)',
                  margin: '0 0 var(--space-10) 0',
                }}
              >
                <p
                  className="font-serif italic text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}
                >
                  {selectedField.action_paragraph}
                </p>
              </blockquote>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10" style={fadeUp(240)}>
                <Link href={`/learn/paths/${selectedField.slug}`} className="btn-primary">
                  Your learning path →
                </Link>
                <button onClick={handleShare} className="btn-ghost">
                  {copied ? 'Copied ✓' : 'Share your score'}
                </button>
                <button onClick={handleRetake} className="btn-ghost">
                  Start over
                </button>
              </div>

              {/* People in your field are also learning */}
              {selectedField.concepts.length > 0 && (
                <div style={fadeUp(360)}>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.05em',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    People in your field are also learning:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedField.concepts.slice(0, 3).map((concept) => (
                      <Link
                        key={concept}
                        href={`/learn/${conceptToSlug(concept)}`}
                        className="tag tag-accent"
                      >
                        {concept}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
