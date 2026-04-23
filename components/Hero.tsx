'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const HeroWidgets = dynamic(() => import('./HeroWidgets'), { ssr: false });

interface MousePos { x: number; y: number; }

const STATS = [
  { num: '2,400+', label: 'AI tools indexed' },
  { num: '140+',   label: 'Fields covered'   },
  { num: 'Daily',  label: 'Signal updates'   },
];

export default function Hero() {
  const [mouse, setMouse] = useState<MousePos>({ x: 0.5, y: 0.5 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top)  / r.height,
    });
  }, []);

  const lineStyle = (delay: number): React.CSSProperties => ({
    opacity:   revealed ? 1 : 0,
    transform: revealed ? 'none' : 'translateY(18px)',
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <section
      onMouseMove={onMouseMove}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 48px 80px',
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        alignItems: 'center',
      }}>

        {/* LEFT — copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Eyebrow pill */}
          <div style={lineStyle(0)}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(170,255,77,0.08)',
              border: '1px solid rgba(170,255,77,0.20)',
              marginBottom: 28,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#AAFF4D',
                boxShadow: '0 0 6px #AAFF4D',
                animation: 'pulse-dot 2s infinite',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: '#AAFF4D',
              }}>
                AI learning, reimagined
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ margin: 0, marginBottom: 24, lineHeight: 1.05 }}>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 5.5vw, 72px)',
              fontWeight: 900,
              color: '#F5EFE0',
              letterSpacing: '-0.03em',
              ...lineStyle(80),
            }}>
              The signal
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 5.5vw, 72px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#AAFF4D',
              letterSpacing: '-0.03em',
              ...lineStyle(180),
            }}>
              beneath
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 5.5vw, 72px)',
              fontWeight: 300,
              color: 'rgba(245,239,224,0.22)',
              letterSpacing: '-0.03em',
              ...lineStyle(280),
            }}>
              the noise.
            </span>
          </h1>

          {/* Body */}
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 17,
            lineHeight: 1.8,
            color: 'rgba(245,239,224,0.60)',
            maxWidth: '44ch',
            margin: '0 0 36px',
            ...lineStyle(360),
          }}>
            A curated archive of AI tools worth your attention.
            No hype, no sponsored rankings. Just honest signal.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48, ...lineStyle(440) }}>
            <Link href="/tools" className="btn-primary">
              Explore tools →
            </Link>
            <Link href="/quiz" className="btn-ghost">
              See what&apos;s relevant
            </Link>
          </div>

          {/* Stats strip */}
          <div style={{
            display: 'flex',
            gap: 32,
            paddingTop: 24,
            borderTop: '1px solid rgba(245,239,224,0.07)',
            ...lineStyle(520),
          }}>
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#F5EFE0',
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {num}
                </div>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,239,224,0.35)',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating widgets */}
        <div style={{ position: 'relative' }}>
          <HeroWidgets mouse={mouse} />
        </div>
      </div>
    </section>
  );
}
