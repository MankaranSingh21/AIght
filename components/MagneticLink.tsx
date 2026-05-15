'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useMagneticHover } from '@/hooks/useMagneticHover';

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  external?: boolean;
};

// Link variant with magnetic-cursor attraction. Drop-in replacement for
// <Link> on primary CTAs. Falls back to a plain link on touch / reduced motion.
export default function MagneticLink({ href, className, children, external }: Props) {
  const ref = useMagneticHover<HTMLAnchorElement>({ radius: 80, strength: 0.28, max: 12 });

  if (external) {
    return (
      <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} className={className}>
      {children}
    </Link>
  );
}
