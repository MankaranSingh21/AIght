import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import RoadmapDashboard from "@/components/RoadmapDashboard";

export const metadata: Metadata = {
  title: "My Canvases — AIght",
  description: "All your AI learning roadmaps, in one place.",
};

export const dynamic = "force-dynamic";

export default async function RoadmapsDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("roadmaps")
    .select("id, title, created_at, nodes_json")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const roadmaps = (data ?? []).map((rm) => ({
    id:         rm.id,
    title:      rm.title,
    created_at: rm.created_at,
    nodeCount:  Array.isArray(rm.nodes_json) ? rm.nodes_json.length : 0,
  }));

  return (
    <main className="min-h-screen bg-parchment texture-grain">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 space-y-8">
        <div className="space-y-2">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500">
            your learning paths ✦
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso">
            My Canvases
          </h1>
          <p className="font-body text-base text-forest/60 max-w-md">
            Each canvas is an autonomous roadmap. Build one per project, goal, or vibe.
          </p>
        </div>

        <RoadmapDashboard roadmaps={roadmaps} />
      </div>
    </main>
  );
}
