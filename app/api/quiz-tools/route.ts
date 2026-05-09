import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";

const RESP_TO_CATEGORY: Record<string, string[]> = {
  code_technical:      ["Dev Tools"],
  creative_prod:       ["Image Gen", "AI Chat"],
  writing_drafting:    ["AI Chat", "Productivity"],
  research:            ["Research", "AI Chat"],
  data_analysis:       ["Research", "Productivity"],
  project_mgmt:        ["Productivity"],
  compliance_admin:    ["Productivity", "AI Chat"],
  strategy_planning:   ["Research", "Productivity"],
  teaching_training:   ["AI Chat", "Productivity"],
  client_comms:        ["AI Chat"],
  sales_negotiation:   ["AI Chat", "Productivity"],
  decision_making:     ["Research", "AI Chat"],
  support_counselling: ["AI Chat"],
  physical_hands_on:   ["Productivity"],
};

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
  chatgpt:    ["chatgpt"],
  claude:     ["claude"],
  gemini:     ["gemini"],
  copilot:    ["copilot", "microsoft-copilot"],
  midjourney: ["midjourney"],
  cursor:     ["cursor"],
  perplexity: ["perplexity"],
  notion_ai:  ["notion-ai", "notion"],
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const responsibilitiesParam = searchParams.get("responsibilities") ?? "";
  const riskCategory          = searchParams.get("risk_category") ?? "medium";
  const aiToolsUsedParam      = searchParams.get("ai_tools_used") ?? "";

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
  for (const resp of responsibilities) {
    const cats = RESP_TO_CATEGORY[resp] ?? [];
    const reason = RESP_MATCH_REASON[resp] ?? "Relevant to your work";
    for (const cat of cats) {
      if (!categoryOrder.includes(cat)) {
        categoryOrder.push(cat);
        categoryToReason[cat] = reason;
      }
    }
  }

  if (!categoryOrder.includes("AI Chat")) categoryOrder.push("AI Chat");
  if (!categoryToReason["AI Chat"]) categoryToReason["AI Chat"] = "A good general-purpose AI tool";
  if (riskCategory === "high" && !categoryOrder.includes("Research")) {
    categoryOrder.splice(1, 0, "Research");
    categoryToReason["Research"] = "Helps you stay ahead of AI changes in your field";
  }

  const supabase = createServiceClient();
  const topCats = categoryOrder.slice(0, 4);

  const { data, error } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, is_free")
    .in("category", topCats)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ tools: [] }, { status: 500 });
  }

  // Filter out tools the user already uses
  const candidates = (data ?? []).filter((t) => !excludeSlugs.has(t.slug));

  // Pick one per category (up to 5), respecting category priority order
  const picked: (typeof candidates[0] & { matchReason: string })[] = [];
  const usedCategories = new Set<string>();
  for (const cat of topCats) {
    const match = candidates.find((t) => t.category === cat && !usedCategories.has(t.category));
    if (match) {
      picked.push({ ...match, matchReason: categoryToReason[cat] ?? "Relevant to your work" });
      usedCategories.add(match.category);
    }
    if (picked.length >= 5) break;
  }

  // Fill remaining slots from the rest of candidates
  for (const tool of candidates) {
    if (picked.length >= 5) break;
    if (!picked.find((p) => p.slug === tool.slug)) {
      picked.push({ ...tool, matchReason: categoryToReason[tool.category] ?? "Relevant to your work" });
    }
  }

  return NextResponse.json({ tools: picked });
}
