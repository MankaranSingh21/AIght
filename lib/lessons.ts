import type { ComponentType, ReactNode } from "react";

/**
 * Brilliant-style step-based lessons.
 *
 * Lessons are typed TSX modules in /content/lessons — one module per concept,
 * lazy-loaded client-side via the registry in content/lessons/index.ts.
 * This file stays free of client imports so server code (routes, sitemap,
 * the essay page pill) can read lesson metadata without pulling demo
 * components into the server bundle.
 */

export type LessonChoice = {
  text: string;
  correct?: boolean;
  /** Shown after the user picks this choice — explain, don't shame. */
  feedback: string;
};

export type LessonStep =
  | {
      kind: "explain";
      id: string;
      /** Small mono label above the body, e.g. "THE IDEA". */
      eyebrow?: string;
      body: ReactNode;
      /** Optional supporting visual below the prose. */
      demo?: ComponentType;
    }
  | {
      kind: "interact";
      id: string;
      body: ReactNode;
      demo: ComponentType;
      /** One-line nudge rendered under the demo, e.g. "Try a longer word." */
      tryThis?: string;
    }
  | {
      kind: "check";
      id: string;
      prompt: string;
      choices: LessonChoice[];
    };

export type Lesson = {
  /** Concept slug — the lesson lives at /learn/[slug]/lesson. */
  slug: string;
  title: string;
  tagline: string;
  minutes: number;
  steps: LessonStep[];
};

/**
 * Static metadata for every lesson that exists. Single source of truth for
 * generateStaticParams, the sitemap, and "interactive" affordances on essay
 * pages and the /learn index. Adding a lesson = add the module in
 * content/lessons + register it here and in content/lessons/index.ts.
 */
export const LESSON_META: Record<string, { minutes: number; steps: number }> = {
  tokenization: { minutes: 6, steps: 8 },
  embeddings: { minutes: 6, steps: 8 },
  "temperature-sampling": { minutes: 5, steps: 7 },
  attention: { minutes: 7, steps: 8 },
  "context-windows": { minutes: 6, steps: 8 },
  hallucination: { minutes: 6, steps: 8 },
  rag: { minutes: 7, steps: 8 },
  "prompt-engineering": { minutes: 6, steps: 8 },
  agents: { minutes: 7, steps: 8 },
  training: { minutes: 7, steps: 8 },
  "neural-networks": { minutes: 6, steps: 8 },
  "gradient-descent": { minutes: 6, steps: 8 },
  "overfitting-underfitting": { minutes: 6, steps: 8 },
  "chain-of-thought": { minutes: 6, steps: 8 },
  "reasoning-models": { minutes: 6, steps: 8 },
  diffusion: { minutes: 6, steps: 8 },
  "function-calling": { minutes: 6, steps: 8 },
  evals: { minutes: 6, steps: 8 },
  "fine-tuning": { minutes: 6, steps: 8 },
  rlhf: { minutes: 6, steps: 8 },
  dpo: { minutes: 6, steps: 8 },
  "prompt-injection": { minutes: 6, steps: 8 },
  "in-context-learning": { minutes: 6, steps: 8 },
  "mixture-of-experts": { minutes: 6, steps: 8 },
  quantization: { minutes: 6, steps: 8 },
  distillation: { minutes: 6, steps: 8 },
  alignment: { minutes: 6, steps: 8 },
  jailbreaks: { minutes: 6, steps: 8 },
  "constitutional-ai": { minutes: 6, steps: 8 },
  multimodal: { minutes: 6, steps: 8 },
  "vision-language-models": { minutes: 6, steps: 8 },
  "scaling-laws": { minutes: 6, steps: 8 },
  "agentic-memory": { minutes: 6, steps: 8 },
  multiagent: { minutes: 6, steps: 8 },
  "retrieval-rerank": { minutes: 6, steps: 8 },
  "structured-output": { minutes: 6, steps: 8 },
  "synthetic-data": { minutes: 6, steps: 8 },
  "model-collapse": { minutes: 6, steps: 8 },
  "kv-cache": { minutes: 6, steps: 8 },
  mcp: { minutes: 6, steps: 8 },
  "model-cards": { minutes: 5, steps: 7 },
  watermarking: { minutes: 5, steps: 8 },
  "what-is-ai": { minutes: 5, steps: 8 },
  "data-and-datasets": { minutes: 5, steps: 8 },
  "statistics-essentials": { minutes: 5, steps: 8 },
  "probability-and-uncertainty": { minutes: 5, steps: 8 },
};

export function getLessonSlugs(): string[] {
  return Object.keys(LESSON_META);
}

export function hasLesson(slug: string): boolean {
  return slug in LESSON_META;
}
