'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import fields from "@/content/paths/fields.json";
import HeroRotator from './HeroRotator';
import CountUp from './CountUp';
import MagneticLink from './MagneticLink';
import { STATS } from '@/lib/stats';

interface HeroProps {
  totalTools?: number;
  latestTool?: string;
  latestConcept?: string;
}

const SPRING_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ROTATING_LINES = [
  'beneath the noise.',
  'explained, visually.',
  'in the tools worth your time.',
  'without the hype.',
];

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

export default function Hero({ totalTools, latestTool, latestConcept }: HeroProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Headline drifts up + fades as user scrolls away — Apple-style exit
  const headlineY  = useTransform(scrollYProgress, [0, 0.6], ['0px', '-60px']);
  const headlineOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const ghostY     = useTransform(scrollYProgress, [0, 1], ['0px', '-120px']);

  const heroStats = [
    { end: totalTools && totalTools > 0 ? totalTools : STATS.tools, suffix: '+', label: 'Curated tools' },
    { end: STATS.concepts, suffix: '', label: 'Concepts explained' },
    { end: fields.length, suffix: '', label: 'Fields covered' },
    { end: STATS.affiliateLinks, suffix: '', label: 'Affiliate links' },
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
        className="relative mx-auto flex flex-col items-center text-center"
        style={{ maxWidth: 880, zIndex: 2 }}
      >
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

        {/* Headline — static first line, rotating second line */}
        <motion.div style={{ y: headlineY, opacity: headlineOp }}>
          <h1 className="m-0 mb-8 leading-[1.06]">
            <motion.span
              custom={1}
              variants={LINE_VARIANTS}
              initial="hidden"
              animate="visible"
              className="block font-display text-[44px] sm:text-[60px] md:text-[72px] lg:text-[84px] font-black text-primary tracking-[-0.03em]"
            >
              The <span className="underline-grow">signal</span>
            </motion.span>
            <motion.span
              custom={2}
              variants={LINE_VARIANTS}
              initial="hidden"
              animate="visible"
              className="block font-display text-[32px] sm:text-[44px] md:text-[54px] lg:text-[62px] font-black italic text-accent tracking-[-0.03em]"
            >
              <HeroRotator phrases={ROTATING_LINES} />
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
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <MagneticLink href="/learn" className="btn-primary">
            Start learning →
          </MagneticLink>
          <MagneticLink href="/tools" className="btn-ghost">
            Explore tools
          </MagneticLink>
        </motion.div>

        {/* Stats strip — count up on first view */}
        <motion.div
          variants={FADE_UP(2)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-6 border-t border-primary/10 w-full max-w-2xl"
        >
          {heroStats.map(({ end, suffix, label }) => (
            <div key={label}>
              <div className="font-display text-3xl font-bold text-primary mb-1">
                <CountUp end={end} suffix={suffix} />
              </div>
              <div className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-muted">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Quiet live line */}
        {(latestTool || latestConcept) && (
          <motion.p
            variants={FADE_UP(3)}
            initial="hidden"
            animate="visible"
            className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted mt-8 mb-0"
          >
            {latestTool && <>latest: <span className="text-secondary">{latestTool}</span></>}
            {latestTool && latestConcept && ' · '}
            {latestConcept && <>newest concept: <span className="text-secondary">{latestConcept}</span></>}
          </motion.p>
        )}
      </div>
    </section>
  );
}
