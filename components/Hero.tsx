'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import fields from "@/content/paths/fields.json";
import HeroWidgets, { type HeroTool, type HeroRiskStats, type HeroTopScored } from './HeroWidgets';
import MagneticLink from './MagneticLink';

interface HeroProps {
  tools?: HeroTool[];
  riskStats?: HeroRiskStats;
  topScored?: HeroTopScored | null;
  fieldNames?: string[];
  totalTools?: number;
}

const SPRING_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const LINE_VARIANTS = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: SPRING_EASE },
  }),
};

const FADE_UP = (i: number) => ({
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.38 + i * 0.08, duration: 0.6, ease: SPRING_EASE },
  },
});

export default function Hero({ tools, riskStats, topScored, fieldNames, totalTools }: HeroProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Headline drifts up + fades as user scrolls away — Apple-style exit
  const headlineY  = useTransform(scrollYProgress, [0, 0.6], ['0px', '-60px']);
  const headlineOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const ghostY     = useTransform(scrollYProgress, [0, 1], ['0px', '-120px']);

  // Mouse position normalized 0..1 for HeroWidgets parallax
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    if (!sectionRef.current) return;
    const onMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      setMouse({
        x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
        y: Math.max(0, Math.min(1, (e.clientY - r.top)  / r.height)),
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const toolCountLabel = totalTools && totalTools > 0 ? `${totalTools}+` : '60+';
  const STATS = [
    { num: toolCountLabel,  label: 'Curated tools'  },
    { num: fields.length.toString(), label: 'Fields covered' },
    { num: '0',    label: 'Affiliate links' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-24 md:pt-32 pb-20"
      style={{ paddingLeft: 'clamp(20px, 6vw, 96px)', paddingRight: 'clamp(20px, 6vw, 96px)' }}
    >
      {/* Edge-bleed ghost glyph — drifts on scroll */}
      <motion.span
        aria-hidden
        className="hero-ghost-glyph hidden lg:block"
        style={{ y: ghostY }}
      >
        &amp;
      </motion.span>

      <div
        className="relative mx-auto grid items-center"
        style={{
          maxWidth: 1600,
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 'clamp(32px, 5vw, 96px)',
        }}
      >
        {/* Two-column grid on large screens; single column below */}
        <div className="grid items-center" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
          gap: 'clamp(32px, 4vw, 80px)',
        }}>
          {/* LEFT — copy */}
          <div className="hero-copy flex flex-col items-start text-left" style={{ zIndex: 2 }}>
            {/* Eyebrow pill */}
            <motion.div
              custom={0}
              variants={LINE_VARIANTS}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-glow border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent-primary)] animate-[pulse-dot_2s_infinite] shrink-0" />
                <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-accent">
                  Ruthlessly curated. No affiliate links.
                </span>
              </div>
            </motion.div>

            {/* Headline — scroll-exit parallax */}
            <motion.div style={{ y: headlineY, opacity: headlineOp }}>
              <h1 className="m-0 mb-8 leading-[1.02]">
                <motion.span
                  custom={1}
                  variants={LINE_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  className="block font-display text-[44px] sm:text-[60px] md:text-[68px] lg:text-[80px] xl:text-[92px] font-black text-primary tracking-[-0.03em]"
                >
                  The <span className="underline-grow">signal</span>
                </motion.span>
                <motion.span
                  custom={2}
                  variants={LINE_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  className="block font-display text-[44px] sm:text-[60px] md:text-[68px] lg:text-[80px] xl:text-[92px] font-black italic text-accent tracking-[-0.03em]"
                >
                  beneath
                </motion.span>
                <motion.span
                  custom={3}
                  variants={LINE_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  className="block font-display text-[44px] sm:text-[60px] md:text-[68px] lg:text-[80px] xl:text-[92px] font-light text-primary/25 tracking-[-0.03em]"
                >
                  the noise.
                </motion.span>
              </h1>
            </motion.div>

            {/* Body */}
            <motion.p
              variants={FADE_UP(0)}
              initial="hidden"
              animate="visible"
              className="font-serif text-lg leading-relaxed text-secondary max-w-[52ch] mb-10"
            >
              A literary, anti-hype archive of AI tools worth your attention.
              We do the deep dives so you don&apos;t have to. No sponsored rankings,
              no hustle energy—just honest signal.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={FADE_UP(1)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3 mb-12"
            >
              <MagneticLink href="/tools" className="btn-primary">
                Explore tools →
              </MagneticLink>
              <MagneticLink href="/learn/paths/quiz" className="btn-ghost">
                See what&apos;s relevant
              </MagneticLink>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={FADE_UP(2)}
              initial="hidden"
              animate="visible"
              className="flex gap-10 pt-6 border-t border-primary/10 w-full max-w-md"
            >
              {STATS.map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display text-3xl font-bold text-primary mb-1">{num}</div>
                  <div className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-muted">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — floating glass widgets (desktop only) */}
          <div className="hidden lg:block" style={{ minHeight: 520, position: 'relative' }}>
            <HeroWidgets
              mouse={mouse}
              tools={tools}
              riskStats={riskStats}
              topScored={topScored ?? undefined}
              fields={fieldNames}
              totalTools={totalTools}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .hero-copy { align-items: flex-start; }
          section :global(.hero-copy ~ div) { display: none; }
        }
        section > div > div {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
        }
        @media (max-width: 1024px) {
          section > div > div {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
