'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import fieldsData from '@/content/paths/fields.json';

type FieldData = (typeof fieldsData)[0];
type QuizStep = 'field' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'results';

const DIFFICULTY_BASE: Record<string, number> = { Easy: 70, Medium: 50, Hard: 30 };

const Q_SCORES: Record<string, Record<string, number>> = {
  q1: { 'Highly predictable': 15, 'Mostly routine': 5, 'A mix of both': 0, 'Highly unpredictable': -10 },
  q2: { Never: 10, Rarely: 5, Often: -10, Constantly: -20 },
  q3: { 'Very little': 10, Some: 0, Most: -10, 'Nearly all': -20 },
  q4: { Rarely: 10, Sometimes: 0, Often: -10, Daily: -15 },
  q5: {
    'Low (easily fixable)': 10,
    Moderate: 0,
    'High (financial/reputational damage)': -10,
    'Critical (human safety/massive loss)': -20,
  },
};

const QUESTIONS: Record<string, { number: number; question: string; options: string[] }> = {
  q1: {
    number: 1,
    question: 'How predictable are the daily problems you solve?',
    options: ['Highly predictable', 'Mostly routine', 'A mix of both', 'Highly unpredictable'],
  },
  q2: {
    number: 2,
    question:
      'Does your role require navigating unpredictable physical environments or using complex manual dexterity?',
    options: ['Never', 'Rarely', 'Often', 'Constantly'],
  },
  q3: {
    number: 3,
    question:
      'How much does your work rely on building deep human trust or navigating complex emotional situations?',
    options: ['Very little', 'Some', 'Most', 'Nearly all'],
  },
  q4: {
    number: 4,
    question: 'How often do you have to invent entirely new strategies or synthesize unconnected, abstract ideas?',
    options: ['Rarely', 'Sometimes', 'Often', 'Daily'],
  },
  q5: {
    number: 5,
    question: 'If you make a critical mistake in your core tasks, what is the immediate consequence?',
    options: [
      'Low (easily fixable)',
      'Moderate',
      'High (financial/reputational damage)',
      'Critical (human safety/massive loss)',
    ],
  },
};

// Maps each step to a dot index (1–4) for the progress indicator
const STEP_DOT: Record<QuizStep, number> = {
  field: 1, q1: 2, q2: 2, q3: 3, q4: 3, q5: 4, results: 4,
};

const STEP_LABEL: Record<QuizStep, string> = {
  field: 'Step 1 of 4',
  q1: 'Step 2 of 4',
  q2: 'Step 2 of 4',
  q3: 'Step 3 of 4',
  q4: 'Step 3 of 4',
  q5: 'Step 4 of 4',
  results: 'Your results',
};

const NEXT_STEP: Record<QuizStep, QuizStep | null> = {
  field: 'q1', q1: 'q2', q2: 'q3', q3: 'q4', q4: 'q5', q5: 'results', results: null,
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
  if (score <= 35) return 'var(--accent-primary)';
  if (score <= 60) return 'var(--accent-warm)';
  return 'var(--error)';
}

function getRiskLabel(score: number) {
  if (score <= 35) return 'Low disruption risk';
  if (score <= 60) return 'Moderate disruption risk';
  return 'High disruption risk';
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
      <p className="font-mono text-xs text-muted uppercase tracking-widest mb-3">
        Question {number} of 5
      </p>
      <p
        className="font-sans text-xl font-medium text-primary mb-6 leading-snug"
        style={{ letterSpacing: '-0.02em' }}
      >
        {question}
      </p>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isFlashed = flashed === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className="text-left px-5 py-4 rounded-lg border transition-all duration-150"
              style={{
                background: isFlashed ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                borderColor: isFlashed ? 'var(--accent-primary)' : 'var(--border-default)',
                color: isFlashed ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              <span className="font-sans text-base">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const QUESTION_STEPS: QuizStep[] = ['q1', 'q2', 'q3', 'q4', 'q5'];

export default function QuizPage() {
  const [step, setStep] = useState<QuizStep>('field');
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flashedOption, setFlashedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [animated, setAnimated] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);

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
        // Compute score immediately with the fresh answer map
        const allAnswers = { ...answers, [qKey]: answer };
        const base = DIFFICULTY_BASE[selectedField.difficulty] ?? 50;
        const raw =
          base +
          (Q_SCORES.q1[allAnswers.q1] ?? 0) +
          (Q_SCORES.q2[allAnswers.q2] ?? 0) +
          (Q_SCORES.q3[allAnswers.q3] ?? 0) +
          (Q_SCORES.q4[allAnswers.q4] ?? 0) +
          (Q_SCORES.q5[allAnswers.q5] ?? 0);
        setScore(Math.min(90, Math.max(10, raw)));
        setAnimated(false);
        setStep('results');
      } else {
        setStep(next);
      }
    }, 150);
  }

  function handleRetake() {
    setStep('field');
    setSelectedField(null);
    setAnswers({});
    setScore(0);
    setAnimated(false);
    setFlashedOption(null);
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
              <h1
                className="font-sans text-4xl font-semibold text-primary mb-4"
                style={{ letterSpacing: '-0.02em' }}
              >
                How will AI affect you?
              </h1>
              <p className="font-sans text-lg text-secondary mb-14 max-w-xl leading-relaxed">
                Select your field. We&apos;ll ask five questions and give you an honest disruption score.
              </p>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
              >
                {fieldsData.map((field) => {
                  const isFlashed = flashedOption === field.slug;
                  return (
                    <button
                      key={field.slug}
                      onClick={() => handleFieldSelect(field as FieldData)}
                      className="text-left p-6 rounded-lg border transition-all duration-150"
                      style={{
                        background: isFlashed ? 'var(--accent-primary-glow)' : 'var(--bg-surface)',
                        borderColor: isFlashed ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        transform: isFlashed ? 'translateY(-2px)' : 'translateY(0)',
                      }}
                    >
                      <h3
                        className="font-sans text-base font-medium mb-2 leading-tight"
                        style={{ color: isFlashed ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                      >
                        {field.field}
                      </h3>
                      <p
                        className="font-sans text-sm leading-snug line-clamp-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
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
              {/* Score meter */}
              <div className="flex flex-col items-center mb-14" style={fadeUp(0)}>
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  role="img"
                  aria-label={`Risk score: ${score} out of 100`}
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
                    {score}
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
                <h2
                  className="font-sans text-2xl font-semibold mt-4 text-center"
                  style={{ color: strokeColor, letterSpacing: '-0.02em' }}
                >
                  {getRiskLabel(score)}
                </h2>
                <p className="font-mono text-sm text-muted mt-1">{selectedField.field}</p>
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
                <button onClick={handleRetake} className="btn-ghost">
                  Retake quiz
                </button>
              </div>

              {/* Concept chips */}
              <div className="flex flex-wrap gap-3" style={fadeUp(360)}>
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
      </main>
      <Footer />
    </div>
  );
}
