'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimelineMilestone {
  year: number;
  label: string;
  description: string;
}

interface ImpactData {
  replacement_risk: number;
  roles_at_risk: string[];
  roles_growing: string[];
  timeline: TimelineMilestone[];
}

interface Props {
  fieldName: string;
  impactData: ImpactData;
  concepts: string[];
  tools: { name: string; what_it_does: string }[];
  triggerLabel?: string;
  triggerClass?: string;
}

type Step = 'q1' | 'q2' | 'q3' | 'calculating' | 'report' | 'roadmap';

const Q1_OPTIONS = [
  { id: 'practitioner', label: 'Practitioner / frontline worker' },
  { id: 'analyst',      label: 'Analyst / researcher' },
  { id: 'manager',      label: 'Manager / leader' },
  { id: 'student',      label: 'Student / exploring' },
];

const Q2_OPTIONS = [
  { id: 'none',         label: "Haven't started yet" },
  { id: 'occasionally', label: 'Experimenting occasionally' },
  { id: 'weekly',       label: 'Using it regularly' },
  { id: 'daily',        label: "It's part of my daily flow" },
];

function conceptToSlug(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('retrieval') || t.includes('rag')) return 'rag';
  if (t.includes('mcp') || t.includes('model context protocol')) return 'mcp';
  if (t.includes('agent') || t.includes('autonomous') || t.includes('agentic') || t.includes('closed-loop')) return 'agents';
  if (t.includes('embedding') || t.includes('vector')) return 'embeddings';
  if (t.includes('transformer') || t.includes('attention') || t.includes('multimodal')) return 'transformers';
  if (t.includes('fine-tun')) return 'fine-tuning';
  if (t.includes('generative') || t.includes('generation')) return 'fine-tuning';
  if (t.includes('neural') || t.includes('deep learning') || t.includes('graph neural')) return 'transformers';
  if (t.includes('predict') || t.includes('classification')) return 'embeddings';
  return 'rag';
}

function computeRisk(base: number, q1: string, q2: string): number {
  let risk = base;
  if (q1 === 'manager') risk = Math.round(risk * 0.75);
  if (q1 === 'analyst')  risk = Math.round(risk * 0.88);
  if (q2 === 'none')     risk = Math.min(72, risk + 8);
  if (q2 === 'weekly')   risk = Math.max(5,  risk - 5);
  if (q2 === 'daily')    risk = Math.max(5,  risk - 12);
  return Math.max(5, Math.min(72, risk));
}

function DonutChart({ risk }: { risk: number }) {
  const augmentation = Math.round((100 - risk) * 0.65);
  const growth = 100 - risk - augmentation;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', width: 148, height: 148, flexShrink: 0 }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: `conic-gradient(
            #E07070 0% ${risk}%,
            #AAFF4D ${risk}% ${risk + augmentation}%,
            #F4AB1F ${risk + augmentation}% 100%
          )`,
        }} />
        <div style={{
          position: 'absolute', inset: 26, borderRadius: '50%',
          background: 'var(--bg-elevated)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#E07070', lineHeight: 1 }}>
            {risk}%
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(245,239,224,0.35)', letterSpacing: '0.10em', marginTop: 3, textTransform: 'uppercase' }}>
            at risk
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { color: '#E07070', label: 'At risk of displacement', value: `${risk}%` },
          { color: '#AAFF4D', label: 'Augmented by AI',         value: `${augmentation}%` },
          { color: '#F4AB1F', label: 'New growth roles',        value: `${growth}%` },
        ].map(({ color, label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 3 }} />
            <div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(245,239,224,0.45)', display: 'block', lineHeight: 1.3 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#F5EFE0', fontWeight: 500 }}>{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ milestones }: { milestones: TimelineMilestone[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {milestones.map((m, i) => {
        const isPast = m.year < 2026;
        const isCurrent = m.year === 2026;
        return (
          <div key={m.year} style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 18 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                background: isPast ? 'rgba(245,239,224,0.18)' : isCurrent ? '#AAFF4D' : 'rgba(170,255,77,0.30)',
                boxShadow: isCurrent ? '0 0 8px rgba(170,255,77,0.40)' : 'none',
              }} />
              {i < milestones.length - 1 && (
                <div style={{ width: 1, flex: 1, background: 'rgba(245,239,224,0.07)', marginTop: 4, minHeight: 32 }} />
              )}
            </div>
            <div style={{ paddingBottom: i < milestones.length - 1 ? 18 : 0 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: isPast ? 'rgba(245,239,224,0.28)' : '#AAFF4D', letterSpacing: '0.10em', marginBottom: 2, textTransform: 'uppercase' }}>
                {m.year}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: isPast ? 'rgba(245,239,224,0.38)' : '#F5EFE0', letterSpacing: '-0.01em', marginBottom: 3 }}>
                {m.label}
              </p>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 12, color: 'rgba(245,239,224,0.38)', lineHeight: 1.6, margin: 0 }}>
                {m.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FieldImpactQuiz({ fieldName, impactData, concepts, tools, triggerLabel = 'Run AI impact quiz →', triggerClass = 'btn-primary' }: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>('q1');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [adjustedRisk, setAdjustedRisk] = useState(impactData.replacement_risk);

  useEffect(() => {
    if (open) requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [open]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleOpen() {
    setStep('q1'); setQ1(''); setQ2(''); setQ3('');
    setAdjustedRisk(impactData.replacement_risk);
    setOpen(true);
  }

  function handleClose() {
    setVisible(false);
    setTimeout(() => setOpen(false), 320);
  }

  function handleQ1Select(val: string) {
    setQ1(val);
    setTimeout(() => setStep('q2'), 280);
  }

  function handleQ2Select(val: string) {
    setQ2(val);
    setTimeout(() => setStep('q3'), 280);
  }

  function handleSubmit() {
    setStep('calculating');
    const risk = computeRisk(impactData.replacement_risk, q1, q2);
    setTimeout(() => { setAdjustedRisk(risk); setStep('report'); }, 1400);
  }

  const progressIndex = { q1: 0, q2: 1, q3: 2, calculating: 2, report: 3, roadmap: 3 }[step] ?? 0;

  const optionStyle = (selected: boolean): React.CSSProperties => ({
    background: selected ? 'rgba(170,255,77,0.10)' : 'rgba(255,250,240,0.03)',
    border: `1px solid ${selected ? 'rgba(170,255,77,0.35)' : 'rgba(245,239,224,0.10)'}`,
    borderRadius: 10, padding: '14px 18px',
    textAlign: 'left', cursor: 'pointer',
    fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
    color: selected ? '#AAFF4D' : 'rgba(245,239,224,0.68)',
    transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
    width: '100%',
  });

  return (
    <>
      <button onClick={handleOpen} className={triggerClass} style={{ cursor: 'pointer' }}>
        {triggerLabel}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleClose}
            aria-hidden
            style={{
              position: 'fixed', inset: 0, zIndex: 99,
              background: 'rgba(14,13,11,0.72)',
              backdropFilter: 'blur(4px)',
              opacity: visible ? 1 : 0,
              transition: 'opacity 320ms ease',
            }}
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-label="AI Impact Quiz"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100,
              width: 'min(480px, 100vw)',
              background: 'var(--bg-elevated)',
              borderLeft: '1px solid rgba(245,239,224,0.10)',
              overflowY: 'auto',
              transform: visible ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid rgba(245,239,224,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              position: 'sticky', top: 0, background: 'var(--bg-elevated)', zIndex: 1,
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: '#AAFF4D', textTransform: 'uppercase', marginBottom: 2 }}>
                  AI Impact Quiz
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: '#F5EFE0', letterSpacing: '-0.01em' }}>
                  {fieldName}
                </p>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'none', border: '1px solid rgba(245,239,224,0.12)',
                  borderRadius: 8, padding: '6px 12px',
                  color: 'rgba(245,239,224,0.45)', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 13,
                  transition: 'border-color 150ms ease, color 150ms ease',
                }}
              >
                ✕
              </button>
            </div>

            {/* Progress bar */}
            {['q1', 'q2', 'q3'].includes(step) && (
              <div style={{ padding: '14px 24px 0', display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    height: 2, flex: 1, borderRadius: 1,
                    background: i <= progressIndex ? '#AAFF4D' : 'rgba(245,239,224,0.10)',
                    transition: 'background 300ms ease',
                  }} />
                ))}
              </div>
            )}

            {/* Step content */}
            <div style={{ padding: 24, flex: 1 }}>

              {step === 'q1' && (
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(245,239,224,0.32)', textTransform: 'uppercase', marginBottom: 16 }}>
                    Question 1 of 3
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 24 }}>
                    What best describes your role in {fieldName}?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Q1_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => handleQ1Select(opt.id)} style={optionStyle(q1 === opt.id)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'q2' && (
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(245,239,224,0.32)', textTransform: 'uppercase', marginBottom: 16 }}>
                    Question 2 of 3
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 24 }}>
                    How much AI are you already using?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Q2_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => handleQ2Select(opt.id)} style={optionStyle(q2 === opt.id)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'q3' && (
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(245,239,224,0.32)', textTransform: 'uppercase', marginBottom: 16 }}>
                    Question 3 of 3
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 8 }}>
                    What would you most want AI to help with?
                  </p>
                  <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 13, fontStyle: 'italic', color: 'rgba(245,239,224,0.38)', lineHeight: 1.65, marginBottom: 20 }}>
                    Optional — helps personalize your roadmap.
                  </p>
                  <textarea
                    value={q3}
                    onChange={e => setQ3(e.target.value)}
                    maxLength={200}
                    placeholder={`e.g. "The repetitive parts so I can focus on the work that actually matters"`}
                    style={{
                      width: '100%', minHeight: 96, resize: 'vertical',
                      background: 'rgba(255,250,240,0.03)',
                      border: '1px solid rgba(245,239,224,0.12)',
                      borderRadius: 10, padding: '12px 16px',
                      fontFamily: 'var(--font-editorial)', fontSize: 14, fontStyle: 'italic',
                      color: '#F5EFE0', lineHeight: 1.65,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    style={{ marginTop: 20, width: '100%', cursor: 'pointer', padding: '14px 24px' }}
                  >
                    Calculate my score →
                  </button>
                </div>
              )}

              {step === 'calculating' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 20 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: '50%', background: '#AAFF4D',
                        animation: 'breath 1.2s ease-in-out infinite',
                        animationDelay: `${i * 200}ms`,
                      }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'rgba(245,239,224,0.38)' }}>
                    Calculating your profile…
                  </p>
                </div>
              )}

              {step === 'report' && (
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: '#AAFF4D', textTransform: 'uppercase', marginBottom: 6 }}>
                    Your disruption profile
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', marginBottom: 26 }}>
                    {fieldName}
                  </p>

                  <DonutChart risk={adjustedRisk} />

                  <div style={{ height: 1, background: 'rgba(245,239,224,0.07)', margin: '26px 0' }} />

                  <div style={{ marginBottom: 22 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(245,239,224,0.40)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
                      Roles at risk
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {impactData.roles_at_risk.map(role => (
                        <span key={role} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#E07070', background: 'rgba(224,112,112,0.10)', border: '1px solid rgba(224,112,112,0.20)', borderRadius: 4, padding: '3px 9px' }}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 26 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(245,239,224,0.40)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
                      Roles growing
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {impactData.roles_growing.map(role => (
                        <span key={role} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#AAFF4D', background: 'rgba(170,255,77,0.08)', border: '1px solid rgba(170,255,77,0.20)', borderRadius: 4, padding: '3px 9px' }}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ height: 1, background: 'rgba(245,239,224,0.07)', marginBottom: 22 }} />

                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(245,239,224,0.40)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>
                    What&apos;s coming
                  </p>
                  <Timeline milestones={impactData.timeline} />

                  <button
                    onClick={() => setStep('roadmap')}
                    className="btn-primary"
                    style={{ marginTop: 28, width: '100%', cursor: 'pointer', padding: '14px 24px' }}
                  >
                    See your learning path →
                  </button>
                </div>
              )}

              {step === 'roadmap' && (
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: '#AAFF4D', textTransform: 'uppercase', marginBottom: 6 }}>
                    Your path from here
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', marginBottom: 8 }}>
                    Where to focus next
                  </p>
                  <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 14, fontStyle: 'italic', color: 'rgba(245,239,224,0.42)', lineHeight: 1.7, marginBottom: 28 }}>
                    Based on where {fieldName} is heading and how you&apos;re positioned today.
                  </p>

                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(245,239,224,0.40)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Concepts to understand
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26 }}>
                    {concepts.map((concept, i) => (
                      <Link
                        key={i}
                        href={`/learn/${conceptToSlug(concept)}`}
                        onClick={handleClose}
                        style={{
                          padding: '12px 16px', borderRadius: 10,
                          border: '1px solid rgba(245,239,224,0.08)',
                          background: 'rgba(255,250,240,0.03)',
                          textDecoration: 'none', display: 'flex',
                          alignItems: 'center', justifyContent: 'space-between',
                          transition: 'border-color 150ms ease',
                        }}
                        className="group"
                      >
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: '#F5EFE0' }} className="group-hover:text-accent">
                          {concept}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.28)' }}>→</span>
                      </Link>
                    ))}
                  </div>

                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(245,239,224,0.40)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Tools to try
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                    {tools.slice(0, 3).map((tool, i) => (
                      <Link
                        key={i}
                        href="/tools"
                        onClick={handleClose}
                        style={{
                          padding: '12px 16px', borderRadius: 10,
                          border: '1px solid rgba(245,239,224,0.08)',
                          background: 'rgba(255,250,240,0.03)',
                          textDecoration: 'none', display: 'block',
                          transition: 'border-color 150ms ease',
                        }}
                        className="group"
                      >
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: '#F5EFE0', letterSpacing: '-0.01em', marginBottom: 3 }} className="group-hover:text-accent">
                          {tool.name}
                        </p>
                        <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 12, color: 'rgba(245,239,224,0.38)', lineHeight: 1.5, margin: 0 }}>
                          {tool.what_it_does}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div style={{ padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(170,255,77,0.14)', background: 'rgba(170,255,77,0.04)', marginBottom: 20 }}>
                    <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 13, fontStyle: 'italic', color: 'rgba(245,239,224,0.50)', lineHeight: 1.75, margin: 0 }}>
                      The goal isn&apos;t to automate your job. It&apos;s to understand what AI can and can&apos;t do in your field — and position yourself accordingly.
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="btn-ghost"
                    style={{ width: '100%', cursor: 'pointer', padding: '12px 24px' }}
                  >
                    Close
                  </button>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </>
  );
}
