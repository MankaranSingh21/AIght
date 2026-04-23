'use client';

import { useState, useEffect } from 'react';

interface MousePos { x: number; y: number; }

const TOOLS = [
  { name: 'Notion AI',       cat: 'Productivity', score: 94, risk: 'low'  as const },
  { name: 'ElevenLabs',      cat: 'Audio AI',     score: 88, risk: 'high' as const },
  { name: 'GitHub Copilot',  cat: 'Code',         score: 91, risk: 'low'  as const },
];
const FIELDS = ['Healthcare', 'Law & Legal', 'Engineering', 'Design', 'Education', 'Finance'];
const RISK_COLOR = { low: '#AAFF4D', medium: '#F4AB1F', high: '#FF7070' } as const;

// ── Glass card shell ──────────────────────────────────────────────────────────
function Glass({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        background: hov ? 'rgba(255,250,240,0.07)' : 'rgba(255,250,240,0.04)',
        border: `1px solid ${hov ? 'rgba(255,250,240,0.18)' : 'rgba(255,250,240,0.09)'}`,
        boxShadow: hov ? '0 8px 32px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
        transition: 'all 220ms cubic-bezier(0.16,1,0.3,1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Tool row inside trending card ─────────────────────────────────────────────
function ToolRow({ t }: { t: typeof TOOLS[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 8px',
        borderRadius: 9,
        marginBottom: 3,
        background: hov ? 'rgba(245,239,224,0.06)' : 'transparent',
        transition: 'background 140ms',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: 6,
        background: 'rgba(245,239,224,0.06)',
        border: '1px solid rgba(245,239,224,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
        color: 'rgba(245,239,224,0.4)', flexShrink: 0,
      }}>
        {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: '#F5EFE0' }}>{t.name}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: 'rgba(245,239,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{t.cat}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: RISK_COLOR[t.risk] }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: RISK_COLOR[t.risk] }}>{t.score}</span>
      </div>
    </div>
  );
}

// ── Cycling field label ───────────────────────────────────────────────────────
function FieldCycler() {
  const [i, setI] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setI(p => (p + 1) % FIELDS.length);
      setKey(p => p + 1);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      key={key}
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 12,
        fontWeight: 700,
        color: '#AAFF4D',
        display: 'inline-block',
        animation: 'hero-line 0.3s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      {FIELDS[i]}
    </span>
  );
}

// ── Main HeroWidgets component ────────────────────────────────────────────────
export default function HeroWidgets({ mouse }: { mouse: MousePos }) {
  const [shown, setShown] = useState<number[]>([]);

  useEffect(() => {
    [0, 500, 900, 1300, 1700].forEach((delay, i) => {
      setTimeout(() => setShown(p => [...p, i]), 1200 + delay);
    });
  }, []);

  // Parallax offset per depth layer
  const p = (depth: number) => ({
    x: (mouse.x - 0.5) * depth * 28,
    y: (mouse.y - 0.5) * depth * 16,
  });

  const widgetStyle = (i: number, base: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    opacity: 0,
    transform: 'translateY(14px) scale(0.98)',
    ...(shown.includes(i) ? {
      animation: 'widget-appear 0.6s cubic-bezier(0.16,1,0.3,1) both',
    } : {}),
    ...base,
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: 480, overflow: 'hidden' }}>

      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(170,255,77,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)', top: '10%', left: '15%', pointerEvents: 'none',
        transform: `translate(${p(0.2).x}px,${p(0.2).y}px)`,
        transition: 'transform 1s cubic-bezier(0.16,1,0.3,1)',
      }} />
      <div style={{
        position: 'absolute', width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,209,0.05) 0%, transparent 70%)',
        filter: 'blur(60px)', bottom: '5%', right: '8%', pointerEvents: 'none',
        transform: `translate(${p(0.15).x}px,${p(0.15).y}px)`,
        transition: 'transform 1s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {/* Widget 0 — Trending tools (center, appears first) */}
      <div style={widgetStyle(0, {
        top: '50%', left: '50%',
        transform: `translate(calc(-50% + ${p(0.4).x}px), calc(-50% + ${p(0.4).y}px))`,
        transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        width: 268, zIndex: 3,
        ...(shown.includes(0) ? { animation: 'widget-appear 0.6s cubic-bezier(0.16,1,0.3,1) both' } : {}),
      })}>
        <Glass style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.4)' }}>Trending now</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#AAFF4D', display: 'block', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#AAFF4D' }}>live</span>
            </div>
          </div>
          {TOOLS.map(t => <ToolRow key={t.name} t={t} />)}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(245,239,224,0.08)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-editorial)', fontSize: 11, color: 'rgba(245,239,224,0.4)', fontStyle: 'italic' }}>40+ tools indexed</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: '#AAFF4D', cursor: 'pointer' }}>All tools →</span>
          </div>
        </Glass>
      </div>

      {/* Widget 1 — Risk overview (top-right) */}
      <div style={widgetStyle(1, {
        top: '2%', right: '0%',
        transform: `translate(${p(0.65).x}px, ${p(0.65).y}px)`,
        transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        width: 172, zIndex: 4,
        ...(shown.includes(1) ? { animation: 'widget-appear 0.6s cubic-bezier(0.16,1,0.3,1) both' } : {}),
      })}>
        <Glass style={{ padding: 15 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.4)', marginBottom: 10 }}>Risk overview</div>
          {[
            { l: 'Low',    c: '#AAFF4D', pct: 62 },
            { l: 'Medium', c: '#F4AB1F', pct: 24 },
            { l: 'High',   c: '#FF7070', pct: 14 },
          ].map(({ l, c, pct }) => (
            <div key={l} style={{ marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(245,239,224,0.6)' }}>{l}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245,239,224,0.4)' }}>{pct}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: 'rgba(245,239,224,0.08)' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: 2, opacity: 0.75 }} />
              </div>
            </div>
          ))}
        </Glass>
      </div>

      {/* Widget 2 — Signal card (top-left) */}
      <div style={widgetStyle(2, {
        top: '4%', left: '0%',
        transform: `translate(${p(0.55).x}px, ${p(0.55).y}px)`,
        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        width: 200, zIndex: 2,
        ...(shown.includes(2) ? { animation: 'widget-appear 0.6s cubic-bezier(0.16,1,0.3,1) both' } : {}),
      })}>
        <Glass style={{ padding: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FFD1', boxShadow: '0 0 6px #00FFD1' }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.4)' }}>Signal · 2h ago</span>
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: '#F5EFE0', lineHeight: 1.4, marginBottom: 6 }}>New model releases reshaping creative workflows</div>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 11, color: 'rgba(245,239,224,0.4)', lineHeight: 1.5 }}>High relevance for Design & Media.</div>
        </Glass>
      </div>

      {/* Widget 3 — AIght score badge (bottom-right) */}
      <div style={widgetStyle(3, {
        bottom: '12%', right: '0%',
        transform: `translate(${p(0.9).x}px, ${p(0.9).y}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 2,
        ...(shown.includes(3) ? { animation: 'widget-appear 0.6s cubic-bezier(0.16,1,0.3,1) both' } : {}),
      })}>
        <Glass style={{ padding: '11px 15px', borderColor: 'rgba(170,255,77,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: '#AAFF4D', lineHeight: 1, letterSpacing: '-0.02em' }}>94</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: 'rgba(245,239,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>AIght score</div>
            </div>
            <div style={{ width: 1, height: 28, background: 'rgba(245,239,224,0.08)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: '#F5EFE0' }}>Notion AI</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(245,239,224,0.4)', marginTop: 1 }}>Productivity</div>
            </div>
          </div>
        </Glass>
      </div>

      {/* Widget 4 — Field cycler (bottom-left) */}
      <div style={widgetStyle(4, {
        bottom: '10%', left: '0%',
        transform: `translate(${p(0.85).x}px, ${p(0.85).y}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 5,
        ...(shown.includes(4) ? { animation: 'widget-appear 0.6s cubic-bezier(0.16,1,0.3,1) both' } : {}),
      })}>
        <Glass style={{ padding: '9px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(245,239,224,0.4)' }}>Filtered for</span>
            <FieldCycler />
          </div>
        </Glass>
      </div>
    </div>
  );
}
