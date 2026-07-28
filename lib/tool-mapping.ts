import type { Tool } from "@/utils/supabase/types";
import type { ToolCardProps } from "@/components/ToolCard";

export function mapToolToCardProps(t: Partial<Tool>): ToolCardProps {
  const category = t.category ?? "AI Tool";
  const tags = t.tags ?? [];

  // 1. Difficulty derivation
  //
  // There used to be a second trigger here keyed on `t.related_concepts`. It was
  // dead twice over: that column does not exist in the database (so the value was
  // always undefined), and the trigger list held display names ("Agents", "MCP")
  // which would never have matched the slug form stored anywhere else. Category
  // already carries the signal, so the branch is gone rather than resurrected.
  let difficulty: "Beginner" | "Intermediate" | "Advanced" = "Beginner";
  const advancedTriggers = ["DEV TOOLS", "AUTOMATION"];

  if (advancedTriggers.includes(category.toUpperCase())) {
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
    aightsTake: t.aights_take ?? null,
  };
}
