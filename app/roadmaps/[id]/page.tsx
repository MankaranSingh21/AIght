import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Node, Edge } from "@xyflow/react";
import { createClient } from "@/utils/supabase/server";
import RoadmapCanvas from "@/components/RoadmapCanvas";
import { CanvasSkeleton } from "@/components/Skeletons";
import type { ToolNodeData } from "@/components/ToolNode";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("roadmaps")
    .select("title")
    .eq("id", id)
    .single();
  return { title: data ? `${data.title} — AIght` : "Canvas — AIght" };
}

// Inner async server component — fetches canvas data inside the Suspense boundary.
async function CanvasLoader({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, title, nodes_json, edges_json, is_public")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!roadmap) notFound();

  const nodes = Array.isArray(roadmap.nodes_json)
    ? (roadmap.nodes_json as Node<ToolNodeData>[])
    : [];

  const edges = Array.isArray(roadmap.edges_json)
    ? (roadmap.edges_json as Edge[])
    : [];

  return (
    <RoadmapCanvas
      roadmapId={roadmap.id}
      title={roadmap.title}
      initialNodes={nodes}
      initialEdges={edges}
      initialIsPublic={roadmap.is_public ?? false}
    />
  );
}

export default function RoadmapCanvasPage({ params }: Props) {
  return (
    <Suspense fallback={<CanvasSkeleton />}>
      <CanvasLoader params={params} />
    </Suspense>
  );
}
