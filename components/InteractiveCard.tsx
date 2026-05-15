'use client';

import type { ReactNode } from 'react';
import TiltCard from './TiltCard';
import { MagicCard } from './ui/magic-card';

type Props = {
  children: ReactNode;
  gradientColor?: string;            // hex color for the spotlight glow
  gradientSize?: number;
  gradientOpacity?: number;
  maxTilt?: number;
  className?: string;
  innerClassName?: string;
};

// Composed wrapper: TiltCard (3D rotation on cursor) + MagicCard (gradient
// spotlight that follows the cursor). Use on Concept / Path / Signal cards on
// the homepage to bring them to parity with ToolCard's interactivity.
export default function InteractiveCard({
  children,
  gradientColor = '#AAFF4D',
  gradientSize = 280,
  gradientOpacity = 0.12,
  maxTilt = 5,
  className,
  innerClassName,
}: Props) {
  return (
    <TiltCard maxDeg={maxTilt} className={className}>
      <MagicCard
        gradientColor={gradientColor}
        gradientSize={gradientSize}
        gradientOpacity={gradientOpacity}
        className={innerClassName}
      >
        {children}
      </MagicCard>
    </TiltCard>
  );
}
