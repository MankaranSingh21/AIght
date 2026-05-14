import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { FIELD_TOOL_MAP } from "@/lib/field-tool-map";

const RESP_TO_CATEGORY: Record<string, string[]> = {
  code_technical:      ["DEV TOOLS"],
  creative_prod:       ["IMAGE GEN", "AI CHAT"],
  writing_drafting:    ["AI CHAT", "PRODUCTIVITY"],
  research:            ["RESEARCH", "AI CHAT"],
  data_analysis:       ["RESEARCH", "PRODUCTIVITY"],
  project_mgmt:        ["PRODUCTIVITY"],
  compliance_admin:    ["PRODUCTIVITY", "AI CHAT"],
  strategy_planning:   ["RESEARCH", "PRODUCTIVITY"],
  teaching_training:   ["AI CHAT", "PRODUCTIVITY"],
  client_comms:        ["AI CHAT"],
  sales_negotiation:   ["AI CHAT", "PRODUCTIVITY"],
  decision_making:     ["RESEARCH", "AI CHAT"],
  support_counselling: ["AI CHAT"],
  physical_hands_on:   ["PRODUCTIVITY"],
};

// Personalised match reasons using seniority + career direction
function buildMatchReason(
  baseReason: string,
  seniority?: string,
  careerDirection?: string,
  aiGoal?: string
): string {
  if (aiGoal === "build")         return `Great for building AI-powered projects`;
  if (aiGoal === "advance")       return `Helps you stay ahead — not just keep pace`;
  if (aiGoal === "save_time")     return `${baseReason} — saves meaningful time`;
  if (aiGoal === "stay_relevant") return `Helps you stay relevant as AI reshapes your field`;
  if (aiGoal === "learn")         return `Good for learning how AI tools actually work`;
  if (careerDirection === "independent") return `Essential for independent practitioners`;
  if (careerDirection === "leadership")  return `Useful for leaders shaping AI strategy`;
  if (seniority === "junior" || seniority === "mid") return `${baseReason} — beginner-friendly`;
  return baseReason;
}

const RESP_MATCH_REASON: Record<string, string> = {
  code_technical:      "Matches your coding & technical work",
  creative_prod:       "Matches your creative production work",
  writing_drafting:    "Saves time on writing & drafting",
  research:            "Built for research & synthesis",
  data_analysis:       "Helps with data analysis & reporting",
  project_mgmt:        "Useful for project coordination",
  compliance_admin:    "Cuts down admin & compliance tasks",
  strategy_planning:   "Good for strategy & planning work",
  teaching_training:   "Useful for teaching & facilitation",
  client_comms:        "Helps with client communication",
  sales_negotiation:   "Good for sales & business development",
  decision_making:     "Supports high-stakes decision making",
  support_counselling: "Helpful for support & care roles",
  physical_hands_on:   "Helps with scheduling & coordination",
};

// Map AI_TOOLS_OPTS values to tool slugs so we can filter already-known tools
const TOOL_OPT_TO_SLUG: Record<string, string[]> = {
  chatgpt:    ["chatgpt", "chatgpt-5-4"],
  claude:     ["claude", "claude-4-6"],
  gemini:     ["gemini"],
  copilot:    ["copilot", "microsoft-copilot"],
  midjourney: ["midjourney"],
  cursor:     ["cursor", "cursor-3"],
  perplexity: ["perplexity"],
  notion_ai:  ["notion-ai", "notion"],
};

// Prefer beginner-friendly tools for junior/mid seniority
const BEGINNER_PREFERRED = new Set(["junior", "mid"]);
// Prefer advanced tools for senior+
const ADVANCED_PREFERRED = new Set(["senior", "lead", "director"]);

// ai_goal → category boosts
const GOAL_CATEGORY_BOOST: Record<string, string[]> = {
  build:        ["DEV TOOLS", "AI CHAT"],
  advance:      ["RESEARCH", "DEV TOOLS"],
  save_time:    ["PRODUCTIVITY", "AI CHAT"],
  learn:        ["RESEARCH", "PRODUCTIVITY"],
  stay_relevant:["RESEARCH", "AI CHAT"],
};

// career_direction → category boosts
const DIRECTION_CATEGORY_BOOST: Record<string, string[]> = {
  pivot_role:  ["PRODUCTIVITY", "AI CHAT"],
  independent: ["AI CHAT", "PRODUCTIVITY", "DEV TOOLS"],
  leadership:  ["RESEARCH", "PRODUCTIVITY"],
  advance:     ["RESEARCH", "DEV TOOLS"],
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const responsibilitiesParam  = searchParams.get("responsibilities") ?? "";
  const riskCategory           = searchParams.get("risk_category") ?? "medium";
  const aiToolsUsedParam       = searchParams.get("ai_tools_used") ?? "";
  const fieldSlug              = searchParams.get("field") ?? "";
  const seniority              = searchParams.get("seniority") ?? "";
  const careerDirection        = searchParams.get("career_direction") ?? "";
  const aiGoal                 = searchParams.get("ai_goal") ?? "";

  const responsibilities = responsibilitiesParam.split(",").map((r) => r.trim()).filter(Boolean);
  const aiToolsUsed = aiToolsUsedParam.split(",").map((r) => r.trim()).filter(Boolean);

  // Expand known tool slugs to exclude
  const excludeSlugs = new Set<string>();
  for (const opt of aiToolsUsed) {
    for (const s of TOOL_OPT_TO_SLUG[opt] ?? []) excludeSlugs.add(s);
  }

  // Build priority-ordered categories + per-category match reasons
  const categoryOrder: string[] = [];
  const categoryToReason: Record<string, string> = {};

  // 1. ai_goal / career_direction boosts (highest priority context)
  const goalBoost = GOAL_CATEGORY_BOOST[aiGoal] ?? [];
  const dirBoost  = DIRECTION_CATEGORY_BOOST[careerDirection] ?? [];
  for (const cat of [...goalBoost, ...dirBoost]) {
    if (!categoryOrder.includes(cat)) {
      categoryOrder.push(cat);
      categoryToReason[cat] = buildMatchReason(
        `Relevant to your ${aiGoal || careerDirection || "goals"}`,
        seniority, careerDirection, aiGoal
      );
    }
  }

  // 2. Responsibility-based categories
  for (const resp of responsibilities) {
    const cats = RESP_TO_CATEGORY[resp] ?? [];
    const reason = buildMatchReason(
      RESP_MATCH_REASON[resp] ?? "Relevant to your work",
      seniority, careerDirection, aiGoal
    );
    for (const cat of cats) {
      if (!categoryOrder.includes(cat)) {
        categoryOrder.push(cat);
        categoryToReason[cat] = reason;
      }
    }
  }

  if (!categoryOrder.includes("AI CHAT")) categoryOrder.push("AI CHAT");
  if (!categoryToReason["AI CHAT"]) categoryToReason["AI CHAT"] = "A good general-purpose AI tool";
  if (riskCategory === "high" && !categoryOrder.includes("RESEARCH")) {
    categoryOrder.splice(1, 0, "RESEARCH");
    categoryToReason["RESEARCH"] = "Helps you stay ahead of AI changes in your field";
  }

  const supabase = createServiceClient();
  const topCats = categoryOrder.slice(0, 5);

  // 3. Field-specific tools — inject from FIELD_TOOL_MAP
  const fieldSlugsToInject = fieldSlug ? (FIELD_TOOL_MAP[fieldSlug] ?? []) : [];
  let fieldTools: Array<{ slug: string; name: string; vibe_description: string | null; category: string; is_free: boolean; matchReason: string }> = [];

  if (fieldSlugsToInject.length > 0) {
    const { data: fData } = await supabase
      .from("tools")
      .select("slug, name, vibe_description, category, is_free")
      .in("slug", fieldSlugsToInject)
      .limit(3);

    fieldTools = (fData ?? [])
      .filter((t) => !excludeSlugs.has(t.slug))
      .slice(0, 2)
      .map((t) => ({
        ...t,
        vibe_description: t.vibe_description ?? null,
        matchReason: `Recommended for professionals in your field`,
      }));
  }

  // 4. Responsibility-based tools
  const { data, error } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, is_free")
    .in("category", topCats)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ tools: [] }, { status: 500 });
  }

  const candidates = (data ?? []).filter((t) => !excludeSlugs.has(t.slug));

  // Prefer difficulty-matched tools
  const preferBeginner = BEGINNER_PREFERRED.has(seniority);
  const preferAdvanced = ADVANCED_PREFERRED.has(seniority);

  function candidateScore(t: typeof candidates[0]): number {
    // No difficulty data at this select level, so use category as proxy
    if (preferBeginner && t.category === "AI CHAT") return 1;
    if (preferAdvanced && (t.category === "DEV TOOLS" || t.category === "RESEARCH")) return 1;
    return 0;
  }

  const sortedCandidates = [...candidates].sort((a, b) => candidateScore(b) - candidateScore(a));

  const fieldToolSlugs = new Set(fieldTools.map(t => t.slug));
  const picked: (typeof candidates[0] & { matchReason: string })[] = [];
  const usedCategories = new Set<string>();
  const maxPicked = Math.max(0, 5 - fieldTools.length);

  for (const cat of topCats) {
    if (picked.length >= maxPicked) break;
    const match = sortedCandidates.find(
      (t) => t.category === cat && !usedCategories.has(t.category) && !fieldToolSlugs.has(t.slug)
    );
    if (match) {
      picked.push({ ...match, matchReason: categoryToReason[cat] ?? "Relevant to your work" });
      usedCategories.add(match.category);
    }
  }

  for (const tool of sortedCandidates) {
    if (picked.length >= maxPicked) break;
    if (!picked.find((p) => p.slug === tool.slug) && !fieldToolSlugs.has(tool.slug)) {
      picked.push({ ...tool, matchReason: categoryToReason[tool.category] ?? "Relevant to your work" });
    }
  }

  // Prepend field-specific tools
  const allTools = [...fieldTools, ...picked].slice(0, 5);

  return NextResponse.json({ tools: allTools });
}
