import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";

// Map quiz responsibility values → Supabase tool categories (priority-ordered)
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const responsibilitiesParam = searchParams.get("responsibilities") ?? "";
  const riskCategory          = searchParams.get("risk_category") ?? "medium";

  const responsibilities = responsibilitiesParam
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  // Build priority-ordered list of categories from responsibilities
  const categoryOrder: string[] = [];
  for (const resp of responsibilities) {
    const cats = RESP_TO_CATEGORY[resp] ?? [];
    for (const cat of cats) {
      if (!categoryOrder.includes(cat)) categoryOrder.push(cat);
    }
  }

  // Fallback: AI Chat is always relevant
  if (!categoryOrder.includes("AI Chat")) categoryOrder.push("AI Chat");
  // Research tools are especially valuable for high-risk roles
  if (riskCategory === "high" && !categoryOrder.includes("Research")) {
    categoryOrder.splice(1, 0, "Research");
  }

  const supabase = createServiceClient();

  // Fetch up to 12 candidates across the top 3 categories, then pick 4
  const topCats = categoryOrder.slice(0, 3);
  const { data, error } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, is_free")
    .in("category", topCats)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return NextResponse.json({ tools: [] }, { status: 500 });
  }

  // Deduplicate and pick one per category (up to 4 total) for variety
  const picked: typeof data = [];
  const usedCategories = new Set<string>();
  for (const cat of topCats) {
    const match = (data ?? []).find(
      (t) => t.category === cat && !usedCategories.has(t.category)
    );
    if (match) {
      picked.push(match);
      usedCategories.add(match.category);
    }
    if (picked.length >= 4) break;
  }

  // If we still have room, fill from remaining results
  for (const tool of data ?? []) {
    if (picked.length >= 4) break;
    if (!picked.find((p) => p.slug === tool.slug)) picked.push(tool);
  }

  return NextResponse.json({ tools: picked });
}
