'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import fieldsData from '@/content/paths/fields.json';

type FieldData = (typeof fieldsData)[0];
type Step = 'field' | 'questions' | 'results';

// Base automation exposure derived from difficulty:
// Easy → high automation (70), Medium → moderate (50), Hard → low (30)
const DIFFICULTY_BASE: Record<string, number> = {
  Easy: 70,
  Medium: 50,
  Hard: 30,
};

const Q1_SCORES: Record<string, number> = {
  'Highly predictable': 15,
  'Mostly routine': 5,
  'A mix of both': 0,
  'Highly unpredictable': -10,
};

const Q2_SCORES: Record<string, number> = {
  Never: 10,
  Rarely: 5,
  Often: -10,
  Constantly: -20,
};

const Q3_SCORES: Record<string, number> = {
  'Very little': 10,
  Some: 0,
  Most: -10,
  'Nearly all': -20,
};

const Q4_SCORES: Record<string, number> = {
  Rarely: 10,
  Sometimes: 0,
  Often: -10,
  Daily: -15,
};

const Q5_SCORES: Record<string, number> = {
  'Low (easily fixable)': 10,
  Moderate: 0,
  'High (financial/reputational damage)': -10,
  'Critical (human safety/massive loss)': -20,
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
  if (lower.includes('fine-tun') || lower.includes('finetun') || lower.includes('style transfer')) return 'fine-tuning';
  return 'rag';
}

function getScoreColor(score: number): string {
  if (score <= 35) return 'var(--accent-primary)';
  if (score <= 60) return 'var(--accent-warm)';
  return 'var(--error)';
}

function getRiskLabel(score: number): string {
  if (score <= 35) return 'Low disruption risk';
  if (score <= 60) return 'Moderate disruption risk';
  return 'High disruption risk';
}

interface QuestionBlockProps {
  number: number;
  question: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}

function QuestionBlock({ number, question, options, selected, onSelect }: QuestionBlockProps) {
  return (
    <div className="py-8 border-b border-subtle last:border-b-0">
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
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="text-left px-5 py-4 rounded-lg border transition-all duration-200"
            style={{
              background: selected === opt ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
              borderColor: selected === opt ? 'var(--accent-primary)' : 'var(--border-default)',
              color: selected === opt ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
          >
            <span className="font-sans text-base">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function QuizPage() {
  const [step, setStep] = useState<Step>('field');
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4, setQ4] = useState<string | null>(null);
  const [q5, setQ5] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (step === 'results') {
      const t = setTimeout(() => setAnimated(true), 150);
      return () => clearTimeout(t);
    }
  }, [step]);

  function handleCalculate() {
    if (!selectedField || !q1 || !q2 || !q3 || !q4 || !q5) return;
    const base = DIFFICULTY_BASE[selectedField.difficulty] ?? 50;
    const raw =
      base +
      (Q1_SCORES[q1] ?? 0) +
      (Q2_SCORES[q2] ?? 0) +
      (Q3_SCORES[q3] ?? 0) +
      (Q4_SCORES[q4] ?? 0) +
      (Q5_SCORES[q5] ?? 0);
    setScore(Math.min(90, Math.max(10, raw)));
    setAnimated(false);
    setStep('results');
  }

  function handleRetake() {
    setStep('field');
    setSelectedField(null);
    setQ1(null);
    setQ2(null);
    setQ3(null);
    setQ4(null);
    setQ5(null);
    setScore(0);
    setAnimated(false);
  }

  const allAnswered = q1 && q2 && q3 && q4 && q5;

  // SVG circle meter
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = getScoreColor(score);
  const dashOffset = animated ? circumference * (1 - score / 100) : circumference;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      <main className="px-6 md:px-12 lg:px-20 py-20 max-w-content mx-auto">

        {/* ── Step 1: Field selection ─────────────────────────────────────── */}
        {step === 'field' && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
              Step 1 of 3
            </p>
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
              className="grid gap-4 mb-14"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
            >
              {fieldsData.map((field) => {
                const isSelected = selectedField?.slug === field.slug;
                return (
                  <button
                    key={field.slug}
                    onClick={() => setSelectedField(field as FieldData)}
                    className="text-left p-6 rounded-lg border transition-all duration-200"
                    style={{
                      background: isSelected ? 'var(--accent-primary-glow)' : 'var(--bg-surface)',
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    <h3
                      className="font-sans text-base font-medium mb-2 leading-tight"
                      style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}
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

            <button
              onClick={() => selectedField && setStep('questions')}
              disabled={!selectedField}
              className="btn-primary"
              style={{
                opacity: selectedField ? 1 : 0.4,
                cursor: selectedField ? 'pointer' : 'not-allowed',
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 2: Questions ───────────────────────────────────────────── */}
        {step === 'questions' && selectedField && (
          <div className="max-w-editorial mx-auto">
            <button
              onClick={() => setStep('field')}
              className="font-mono text-xs text-muted hover:text-secondary transition-colors duration-150 mb-8 flex items-center gap-2"
            >
              ← Change field
            </button>

            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
              Step 2 of 3
            </p>
            <h2
              className="font-sans text-3xl font-semibold text-primary mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              {selectedField.field}
            </h2>
            <p className="font-sans text-base text-secondary mb-12 leading-relaxed">
              Answer honestly. The more accurate your answers, the more useful the score.
            </p>

            <div className="mb-12">
              <QuestionBlock
                number={1}
                question="How predictable are the daily problems you solve?"
                options={['Highly predictable', 'Mostly routine', 'A mix of both', 'Highly unpredictable']}
                selected={q1}
                onSelect={setQ1}
              />
              <QuestionBlock
                number={2}
                question="Does your role require navigating unpredictable physical environments or using complex manual dexterity?"
                options={['Never', 'Rarely', 'Often', 'Constantly']}
                selected={q2}
                onSelect={setQ2}
              />
              <QuestionBlock
                number={3}
                question="How much does your work rely on building deep human trust or navigating complex emotional situations?"
                options={['Very little', 'Some', 'Most', 'Nearly all']}
                selected={q3}
                onSelect={setQ3}
              />
              <QuestionBlock
                number={4}
                question="How often do you have to invent entirely new strategies or synthesize unconnected, abstract ideas?"
                options={['Rarely', 'Sometimes', 'Often', 'Daily']}
                selected={q4}
                onSelect={setQ4}
              />
              <QuestionBlock
                number={5}
                question="If you make a critical mistake in your core tasks, what is the immediate consequence?"
                options={[
                  'Low (easily fixable)',
                  'Moderate',
                  'High (financial/reputational damage)',
                  'Critical (human safety/massive loss)',
                ]}
                selected={q5}
                onSelect={setQ5}
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={!allAnswered}
              className="btn-primary"
              style={{
                opacity: allAnswered ? 1 : 0.4,
                cursor: allAnswered ? 'pointer' : 'not-allowed',
              }}
            >
              Calculate my score →
            </button>
          </div>
        )}

        {/* ── Step 3: Results ─────────────────────────────────────────────── */}
        {step === 'results' && selectedField && (
          <div className="max-w-editorial mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-12">
              Your results
            </p>

            {/* Score meter */}
            <div className="flex flex-col items-center mb-14">
              <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label={`Risk score: ${score} out of 100`}>
                {/* Background track */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="var(--bg-elevated)"
                  strokeWidth="10"
                />
                {/* Progress arc */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '100px 100px',
                    transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                {/* Score number */}
                <text
                  x="100"
                  y="92"
                  textAnchor="middle"
                  dominantBaseline="middle"
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
                  x="100"
                  y="126"
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
              className="mb-10"
              style={{
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
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link href={`/learn/paths/${selectedField.slug}`} className="btn-primary">
                Your learning path →
              </Link>
              <button onClick={handleRetake} className="btn-ghost">
                Retake quiz
              </button>
            </div>

            {/* Concept chips */}
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
      </main>

      <Footer />
    </div>
  );
}
