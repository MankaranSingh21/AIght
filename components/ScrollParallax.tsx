'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type Props = {
  children: ReactNode;
  range?: [number, number];   // px translation when section enters → leaves viewport
  className?: string;
};

// Continuous Y-translation driven by the wrapped element's position in the
// viewport. As the element enters from below, it sits at `range[0]`; as it
// leaves the top, it sits at `range[1]`. Used for section headings so they
// drift gently while the user scrolls past — supplements one-shot ScrollReveal.
export default function ScrollParallax({
  children,
  range = [12, -12],
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], range);

  return (
    <motion.div ref={ref} style={{ y, position: 'relative' }} className={className}>
      {children}
    </motion.div>
  );
}
