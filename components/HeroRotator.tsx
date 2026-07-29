'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const SPRING_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const ROTATE_MS = 4500;

interface HeroRotatorProps {
  phrases: string[];
  className?: string;
}

/**
 * Cycles through short phrases with a crossfade + slight vertical drift.
 * The container is sized by invisible copies of every phrase so the tallest
 * one reserves the space — no layout shift between swaps.
 */
export default function HeroRotator({ phrases, className }: HeroRotatorProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || phrases.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, phrases.length]);

  if (reduceMotion || phrases.length < 2) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={className} style={{ display: 'inline-grid', position: 'relative' }}>
      {/* Invisible sizers — every phrase occupies the same grid cell */}
      {phrases.map((p) => (
        <span
          key={p}
          aria-hidden
          style={{ gridArea: '1 / 1', visibility: 'hidden', placeSelf: 'center' }}
        >
          {p}
        </span>
      ))}
      {/*
        NOT mode="popLayout". popLayout yanks the exiting element out of layout
        flow by absolutely positioning it, at which point `gridArea` no longer
        places it in the shared cell — it resolves against the padding box
        instead. The outgoing and incoming phrases then sit at different offsets
        and you see both at once, smeared over each other. It was already
        visible at mobile sizes and became obvious once the headline grew.

        Default (sync) mode keeps both spans in grid cell 1/1 for the duration
        of the swap, which is exactly what a crossfade wants: same position,
        one fading out as the other fades in.
      */}
      <AnimatePresence initial={false}>
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: SPRING_EASE }}
          style={{ gridArea: '1 / 1', placeSelf: 'center' }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
