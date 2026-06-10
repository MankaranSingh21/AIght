import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "learn");

export type ConceptGroup =
  | "Foundations"
  | "Machine Learning"
  | "Architecture"
  | "Training"
  | "Inference"
  | "Practical"
  | "Safety";

export const GROUP_ORDER: ConceptGroup[] = [
  "Foundations",
  "Machine Learning",
  "Architecture",
  "Training",
  "Inference",
  "Practical",
  "Safety",
];

export const GROUP_DESCRIPTIONS: Record<ConceptGroup, string> = {
  Foundations:        "Zero assumed. What AI actually is, what data is, and why statistics runs the show.",
  "Machine Learning": "How machines learn from examples. The ideas every model — old or frontier — is built on.",
  Architecture: "How the models are built. The shapes underneath everything.",
  Training:     "How they learn. What gets baked in and what gets sanded down.",
  Inference:    "How they answer. The mechanics of producing output one token at a time.",
  Practical:    "How to actually use them. The patterns that survive contact with real work.",
  Safety:       "Where they fail, lie, or get tricked. The shape of the things to watch for.",
};

// Centralised grouping. Easier to evolve here than across 40 MDX frontmatters.
// Add a new concept slug here when it ships; default group is "Practical".
const CONCEPT_GROUPS: Record<string, ConceptGroup> = {
  // Foundations — zero assumed
  "what-is-ai":                  "Foundations",
  "data-and-datasets":           "Foundations",
  "statistics-essentials":       "Foundations",
  "probability-and-uncertainty": "Foundations",
  "correlation-vs-causation":    "Foundations",
  "patterns-and-predictions":    "Foundations",
  "what-is-a-model":             "Foundations",
  "bias-in-data":                "Foundations",

  // Machine Learning — classic ML + the deep-learning on-ramp
  "features-and-labels":       "Machine Learning",
  "training-vs-testing":       "Machine Learning",
  "loss-functions":            "Machine Learning",
  "gradient-descent":          "Machine Learning",
  "overfitting-underfitting":  "Machine Learning",
  "regression-classification": "Machine Learning",
  clustering:                  "Machine Learning",
  "evaluation-metrics":        "Machine Learning",
  "neural-networks":           "Machine Learning",
  backpropagation:             "Machine Learning",
  "gpus-and-compute":          "Machine Learning",

  // Architecture
  attention:                "Architecture",
  diffusion:                "Architecture",
  embeddings:               "Architecture",
  "mixture-of-experts":     "Architecture",
  multimodal:               "Architecture",
  tokenization:             "Architecture",
  transformers:             "Architecture",
  "vision-language-models": "Architecture",

  // Training
  distillation:        "Training",
  dpo:                 "Training",
  "fine-tuning":       "Training",
  "model-collapse":    "Training",
  quantization:        "Training",
  rlhf:                "Training",
  "scaling-laws":      "Training",
  "synthetic-data":    "Training",
  training:            "Training",

  // Inference
  "chain-of-thought":     "Inference",
  "context-windows":      "Inference",
  "function-calling":     "Inference",
  "in-context-learning":  "Inference",
  "kv-cache":             "Inference",
  "reasoning-models":     "Inference",
  "structured-output":    "Inference",
  "temperature-sampling": "Inference",

  // Practical
  "agentic-memory":     "Practical",
  agents:               "Practical",
  evals:                "Practical",
  mcp:                  "Practical",
  "model-cards":        "Practical",
  multiagent:           "Practical",
  "prompt-engineering": "Practical",
  rag:                  "Practical",
  "retrieval-rerank":   "Practical",

  // Safety
  alignment:           "Safety",
  "constitutional-ai": "Safety",
  hallucination:       "Safety",
  jailbreaks:          "Safety",
  "prompt-injection":  "Safety",
  watermarking:        "Safety",
};

export type ConceptMeta = {
  title: string;
  tagline: string;
  readTime: string;
  slug: string;
  publishedDate: string;
  related?: string[];
  lastUpdated?: string;
  sources?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  author?: string;
  group: ConceptGroup;
  // Phase J — used by the per-concept mini-map and the misconception pills.
  prerequisites?: string[];    // concept slugs needed before this one
  successors?: string[];       // concepts that build on this one
  exemplar_tools?: string[];   // tool slugs that show this concept in action
  key_fields?: string[];       // field slugs where this matters most
  misconceptions?: string[];   // 1–3 short "wrong intuition" sentences
};

// Solo project — every article is by Mankaran unless the MDX overrides it.
export const DEFAULT_AUTHOR = {
  name: "Mankaran Singh",
  url: "/about",
  bio: "Independent. Reads AI papers at midnight, writes about what actually matters.",
};

// `cache` dedupes within a single request — the homepage, sitemap, /learn,
// /learn/[slug], etc. all call this; without the wrap we'd re-read 40 MDX files
// per call. Per-request only; doesn't persist across requests.
export const getAllConcepts = cache((): ConceptMeta[] => {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  return files.map((filename) => {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const stat = fs.statSync(filePath);
    return {
      title: data.title as string,
      tagline: data.tagline as string,
      readTime: data.readTime as string,
      slug: data.slug as string,
      publishedDate: (data.date as string | undefined) ?? stat.birthtime.toISOString(),
      related: data.related as string[] | undefined,
      lastUpdated: data.lastUpdated as string | undefined,
      sources: data.sources as number | undefined,
      difficulty: data.difficulty as ConceptMeta["difficulty"],
      author: data.author as string | undefined,
      group: CONCEPT_GROUPS[data.slug as string] ?? "Practical",
      prerequisites: data.prerequisites as string[] | undefined,
      successors: data.successors as string[] | undefined,
      exemplar_tools: data.exemplar_tools as string[] | undefined,
      key_fields: data.key_fields as string[] | undefined,
      misconceptions: data.misconceptions as string[] | undefined,
    };
  });
});

/**
 * Bucket all concepts into the 5 groups, alphabetised within each group.
 * Groups are returned in GROUP_ORDER so callers can iterate predictably.
 */
export function getConceptsGrouped(): { group: ConceptGroup; description: string; concepts: ConceptMeta[] }[] {
  const all = getAllConcepts();
  return GROUP_ORDER.map((group) => ({
    group,
    description: GROUP_DESCRIPTIONS[group],
    concepts: all
      .filter((c) => c.group === group)
      .sort((a, b) => a.title.localeCompare(b.title)),
  })).filter((g) => g.concepts.length > 0);
}

export function getConceptSource(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
