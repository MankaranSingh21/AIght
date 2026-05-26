// Shared types for ConceptDemo family
import type { ReactNode } from 'react';

export type DemoShape = 'playground' | 'stepthrough' | 'compare';

/** Props shared by all three shape primitives */
export interface BaseShapeProps {
  /** Suffix appended after "◉ INTERACTIVE" in the label. e.g. "— click any word" */
  hint?: string;
  /** Accessible label for the outermost region element */
  ariaLabel: string;
  children: ReactNode;
}

/** Props for ConceptDemo outer wrapper */
export interface ConceptDemoProps {
  /** The shape scaffold to use — determines inner structure */
  shape: DemoShape;
  /** Override background token. Defaults to 'var(--bg-surface)' */
  background?: string;
  /** Accessible label for the demo region */
  ariaLabel: string;
  /** Hint suffix after "◉ INTERACTIVE". Pass empty string to suppress hint. */
  hint?: string;
  /** Vertical margin override. Defaults to 'var(--space-10) 0' */
  margin?: string;
  children: ReactNode;
}

/** Props for StepThrough shape */
export interface StepThroughProps extends BaseShapeProps {
  /** Total number of steps — used to render "Step N of M" counter */
  totalSteps: number;
  /** Currently active step (0-indexed) */
  activeStep: number;
  /** Called when user clicks Next. Demo manages its own state. */
  onNext?: () => void;
  /** Called when user clicks Back. Optional — omit for auto-advance demos. */
  onBack?: () => void;
  /** Called when user clicks Reset. Optional. */
  onReset?: () => void;
  /** If true, hides Next/Back buttons (demo is auto-advancing via timers) */
  autoAdvance?: boolean;
}

/** Props for Compare shape */
export interface CompareProps extends BaseShapeProps {
  /** Labels for the left and right panels */
  panelLabels: [string, string];
  /** Accent color for the right (highlighted) panel. Defaults to accent-primary-glow border */
  rightAccent?: boolean;
}

/** Props for Playground shape */
export interface PlaygroundProps extends BaseShapeProps {
  /** Optional footer caption beneath the interactive area */
  caption?: string;
}
