import type { Tool } from "@/utils/supabase/types";
import type { ToolCardProps } from "@/components/ToolCard";

export function mapToolToCardProps(t: Partial<Tool>): ToolCardProps {
  const category = t.category ?? "AI Tool";
  const tags = t.tags ?? [];
  const relatedConcepts = t.related_concepts ?? [];
  
  // 1. Difficulty derivation
  let difficulty: "Beginner" | "Intermediate" | "Advanced" = "Beginner";
  const advancedTriggers = ["DEV TOOLS", "AUTOMATION"];
  const advancedConceptTriggers = ["Agents", "MCP", "Embeddings", "Fine-tuning"];
  
  if (advancedTriggers.includes(category.toUpperCase()) || relatedConcepts.some(c => advancedConceptTriggers.includes(c))) {
    difficulty = "Advanced";
  } else if (category.toUpperCase() === "RESEARCH" || tags.some(tag => ["advanced", "research", "complex"].includes(tag.toLowerCase()))) {
    difficulty = "Intermediate";
  }

  // 2. Pricing derivation
  let pricing: "Free" | "Freemium" | "Paid" = "Paid";
  if (t.is_free) {
    pricing = "Free";
  } else if (t.pricing_detail?.free_tier) {
    pricing = "Freemium";
  }

  // 3. Best For derivation
  let bestFor = "";
  switch (category.toUpperCase()) {
    case "AI CHAT": bestFor = "Writing & Chat"; break;
    case "DEV TOOLS": bestFor = "Coding"; break;
    case "IMAGE GEN": bestFor = "Visuals"; break;
    case "VIDEO GEN": bestFor = "Cinematics"; break;
    case "RESEARCH": bestFor = "Deep Dives"; break;
    case "PRODUCTIVITY": bestFor = "Organization"; break;
    case "AUTOMATION": bestFor = "Workflows"; break;
    case "AUDIO": bestFor = "Voice & Sound"; break;
    default: bestFor = "General AI";
  }

  return {
    slug:         t.slug ?? "",
    name:         t.name ?? "",
    tagline:      t.vibe_description ?? "",
    category:     category,
    url:          t.url ?? null,
    tags:         tags,
    created_at:   t.created_at ?? undefined,
    is_sponsored: t.is_sponsored ?? null,
    accent:       t.accent ?? null,
    status:       t.status ?? "stable",
    difficulty,
    pricing,
    bestFor,
    utility_score: t.utility_score ?? 0,
    privacy_score: t.privacy_score ?? 0,
    speed_score: t.speed_score ?? 0,
    cost_score: t.cost_score ?? 0,
    transparency_score: t.transparency_score ?? 0,
    risk_level: t.risk_level ?? "Low",
    is_open_source: t.is_open_source ?? false,
    updated_at: t.updated_at ?? t.created_at ?? undefined,
  };
}
