'use client';
import { useState, useEffect, useRef } from 'react';

interface Scenario {
  id: string;
  label: string;
  base: string;
  partial: string;
  tuned: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'medical',
    label: 'Medical Notes',
    base: 'I can help with general medical information. Elevated troponin levels may suggest cardiac involvement, though context matters. Please consult a qualified healthcare provider before making any clinical decisions.',
    partial: 'Troponin I is elevated at 2.4 ng/mL (reference <0.04). Given the chest pain and diaphoresis, this could be consistent with a cardiac event. A cardiology consult and serial ECGs would be advisable.',
    tuned: 'Troponin I: 2.4 ng/mL (elevated; ref <0.04). Onset chest pain + diaphoresis → consistent with NSTEMI. Recommend: serial ECGs q15min, cardiology consult within 2h, hold NSAIDS, anticoagulation pending imaging.',
  },
  {
    id: 'legal',
    label: 'Legal Drafting',
    base: 'Here is a draft clause about payment. The client agrees to pay the agreed-upon amount in a timely manner, as discussed between the parties involved in this agreement.',
    partial: 'Payment Terms: The client shall pay the fees listed in Schedule A within 30 days of receiving an invoice. If payment is late, interest may be charged on the overdue amount.',
    tuned: 'Payment Terms. Client shall remit fees per Schedule A within thirty (30) calendar days of invoice date. Late payments accrue interest at 1.5% per month (18% per annum), compounded monthly from the date due until paid in full.',
  },
  {
    id: 'poetry',
    label: 'Rumi-style Poetry',
    base: "Here's a poem about longing: I miss you when you're gone. The days feel empty and long. Love is a feeling that stays with us through all of our days.",
    partial: 'Longing sits quietly in the chest. You are gone and something in me follows — traces the empty rooms of your absence, searching.',
    tuned: 'Out beyond the architecture of words — past the bones of meaning — there is a field. Every exile knows it. The heart has only one direction on its map: toward.',
  },
];

export default function FineTuningComparison() {
  const [strength, setStrength] = useState(100);
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [displayed, setDisplayed] = useState({ base: '', tuned: '' });
  const [fading, setFading] = useState(false);
  const baseTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tunedTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (baseTimer.current) clearInterval(baseTimer.current);
    if (tunedTimer.current) clearInterval(tunedTimer.current);
  }

  function runTypewriter(base: string, tuned: string) {
    clearTimers();
    setDisplayed({ base: '', tuned: '' });

    let bi = 0;
    baseTimer.current = setInterval(() => {
      bi++;
      setDisplayed(prev => ({ ...prev, base: base.slice(0, bi) }));
      if (bi >= base.length) clearInterval(baseTimer.current!);
    }, 15);

    let ti = 0;
    tunedTimer.current = setInterval(() => {
      ti++;
      setDisplayed(prev => ({ ...prev, tuned: tuned.slice(0, ti) }));
      if (ti >= tuned.length) clearInterval(tunedTimer.current!);
    }, 15);
  }

  function switchScenario(id: string) {
    if (id === activeId) return;
    clearTimers();
    setFading(true);
    setActiveId(id);
    setTimeout(() => {
      setFading(false);
      const s = SCENARIOS.find(sc => sc.id === id)!;
      runTypewriter(s.base, s.tuned);
    }, 200);
  }

  // Start typing on mount
  useEffect(() => {
    const s = SCENARIOS[0];
    runTypewriter(s.base, s.tuned);
    return clearTimers;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scenario = SCENARIOS.find(s => s.id === activeId)!;
  const baseTyping = displayed.base.length < scenario.base.length;
  const tunedText = strength < 35 ? scenario.base : strength < 70 ? scenario.partial : scenario.tuned;
  const tunedTyping = displayed.tuned.length < tunedText.length;

  const tunedBgColor = strength < 35
    ? 'var(--bg-elevated)'
    : strength < 70
    ? 'rgba(170,255,77,0.05)'
    : 'var(--accent-primary-glow)';
  const tunedBorderColor = strength < 35
    ? 'var(--border-subtle)'
    : strength < 70
    ? 'rgba(170,255,77,0.2)'
    : 'var(--border-emphasis)';
  const tunedLabel = strength < 35 ? 'Untrained' : strength < 70 ? 'Partially tuned' : 'Fine-tuned';

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
        marginBottom: 'var(--space-5)',
      }}>
        ◉ INTERACTIVE
      </p>

      {/* Fine-tuning strength slider */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
            Fine-tuning strength
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: strength >= 70 ? 'var(--accent-primary)' : strength >= 35 ? 'var(--accent-warm)' : 'var(--text-muted)' }}>
            {strength}% — {tunedLabel}
          </span>
        </div>
        <input
          type="range" min={0} max={100} step={1}
          value={strength}
          onChange={(e) => {
            const v = Number(e.target.value);
            setStrength(v);
            const newText = v < 35 ? scenario.base : v < 70 ? scenario.partial : scenario.tuned;
            clearTimers();
            setDisplayed(prev => ({ ...prev, tuned: '' }));
            let ti = 0;
            tunedTimer.current = setInterval(() => {
              ti++;
              setDisplayed(prev => ({ ...prev, tuned: newText.slice(0, ti) }));
              if (ti >= newText.length) clearInterval(tunedTimer.current!);
            }, 12);
          }}
          style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
        />
      </div>

      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => switchScenario(s.id)}
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

      {/* Two-panel comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 200ms ease',
          marginBottom: 'var(--space-6)',
        }}
      >
        {/* Base model panel */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            Base model
          </p>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            margin: 0,
            minHeight: 80,
          }}>
            {displayed.base}
            {baseTyping && <span style={{ opacity: 0.6, animation: 'blink 1s step-end infinite' }}>|</span>}
          </p>
        </div>

        {/* Fine-tuned panel */}
        <div style={{
          background: tunedBgColor,
          border: `1px solid ${tunedBorderColor}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          transition: 'background 300ms ease, border-color 300ms ease',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: strength >= 35 ? 'var(--accent-primary)' : 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
            transition: 'color 300ms ease',
          }}>
            {tunedLabel}
          </p>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            lineHeight: 1.75,
            margin: 0,
            minHeight: 80,
          }}>
            {displayed.tuned}
            {tunedTyping && <span style={{ color: 'var(--accent-primary)', animation: 'blink 1s step-end infinite' }}>|</span>}
          </p>
        </div>
      </div>

      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: 'var(--text-base)',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        lineHeight: 1.7,
        margin: 0,
      }}>
        Fine-tuning changes how a model responds, not what it fundamentally knows.
      </p>
    </div>
  );
}
