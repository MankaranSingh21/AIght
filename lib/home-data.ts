import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { mapToolToCardProps } from "@/lib/tool-mapping";
import type { Tool } from "@/utils/supabase/types";
import type { ToolCardProps } from "@/components/ToolCard";
import type { HeroTool } from "@/components/HeroWidgets";

export type RiskStats = { low: number; medium: number; high: number };

export type HeroTopScored = {
  name: string;
  category: string;
  score: number;
} | null;

export type HomeData = {
  recentCards: ToolCardProps[];
  heroTools: HeroTool[];
  riskStats: RiskStats;
  topScored: HeroTopScored;
  totalTools: number;
  error: boolean;
};

function computeAightScore(t: Pick<Tool, "utility_score" | "privacy_score" | "speed_score" | "cost_score" | "transparency_score">): number {
  const s = [t.utility_score, t.privacy_score, t.speed_score, t.cost_score, t.transparency_score].map((v) => v ?? 0);
  if (!s.some((v) => v > 0)) return 0;
  return Math.round(s.reduce((a, b) => a + b, 0) / 5);
}

export const getHomeData = cache(async (): Promise<HomeData> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[home-data] Supabase error:", error.code, error.message);
    return {
      recentCards: [],
      heroTools: [],
      riskStats: { low: 0, medium: 0, high: 0 },
      topScored: null,
      totalTools: 0,
      error: true,
    };
  }

  const tools = (data ?? []) as Tool[];

  const recentCards = tools.slice(0, 6).map((t) => mapToolToCardProps(t));

  const heroTools: HeroTool[] = tools.slice(0, 3).map((t) => ({
    name: t.name,
    cat: t.category ?? "AI Tool",
  }));

  const total = tools.length;
  const counts = { Low: 0, Medium: 0, High: 0 };
  for (const t of tools) {
    const level = t.risk_level ?? "Low";
    if (level in counts) counts[level as keyof typeof counts] += 1;
  }
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
  const riskStats: RiskStats = {
    low: pct(counts.Low),
    medium: pct(counts.Medium),
    high: pct(counts.High),
  };

  let topScored: HeroTopScored = null;
  let bestScore = 0;
  for (const t of tools) {
    const score = computeAightScore(t);
    if (score > bestScore) {
      bestScore = score;
      topScored = { name: t.name, category: t.category ?? "AI Tool", score };
    }
  }

  return {
    recentCards,
    heroTools,
    riskStats,
    topScored,
    totalTools: total,
    error: false,
  };
});
