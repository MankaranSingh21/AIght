'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import fields from "@/content/paths/fields.json";

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

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Headline drifts up + fades as user scrolls away — Apple-style exit
  const headlineY  = useTransform(scrollYProgress, [0, 0.6], ['0px', '-60px']);
  const headlineOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const STATS = [
    { num: '60+',  label: 'Curated tools'  },
    { num: fields.length.toString(), label: 'Fields covered' },
    { num: '0',    label: 'Affiliate links' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-28 md:pt-40 pb-24 px-6"
    >
      <div className="max-w-content mx-auto flex flex-col items-center text-center">

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
          <h1 className="m-0 mb-8 leading-[1.05]">
            <motion.span
              custom={1}
              variants={LINE_VARIANTS}
              initial="hidden"
              animate="visible"
              className="block font-display text-[52px] md:text-[72px] lg:text-[88px] font-black text-primary tracking-[-0.03em]"
            >
              The signal
            </motion.span>
            <motion.span
              custom={2}
              variants={LINE_VARIANTS}
              initial="hidden"
              animate="visible"
              className="block font-display text-[52px] md:text-[72px] lg:text-[88px] font-black italic text-accent tracking-[-0.03em]"
            >
              beneath
            </motion.span>
            <motion.span
              custom={3}
              variants={LINE_VARIANTS}
              initial="hidden"
              animate="visible"
              className="block font-display text-[52px] md:text-[72px] lg:text-[88px] font-light text-primary/25 tracking-[-0.03em]"
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
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          <Link href="/tools" className="btn-primary">
            Explore tools →
          </Link>
          <Link href="/learn/paths/quiz" className="btn-ghost">
            See what&apos;s relevant
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={FADE_UP(2)}
          initial="hidden"
          animate="visible"
          className="flex gap-12 pt-8 border-t border-primary/10"
        >
          {STATS.map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-bold text-primary mb-1">{num}</div>
              <div className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-muted">{label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
