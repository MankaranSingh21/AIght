"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Node, Edge } from "@xyflow/react";
import type { ToolNodeData } from "@/components/ToolNode";

// ── Types ──────────────────────────────────────────────────────────────────

type AddToolInput = {
  slug: string;
  name: string;
  emoji: string;
  url?: string | null;
  category: string;
  accent: "moss" | "amber" | "lavender";
  learning_guide?: string | null;
  video_url?: string | null;
};

// ── createRoadmap ──────────────────────────────────────────────────────────

export async function createRoadmap(title: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("roadmaps")
    .insert({
      user_id: user.id,
      title: title.trim() || "Untitled Canvas",
      nodes_json: [],
      edges_json: [],
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}

// ── addToolToRoadmap ───────────────────────────────────────────────────────

export async function addToolToRoadmap(tool: AddToolInput, roadmapId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, nodes_json")
    .eq("id", roadmapId)
    .eq("user_id", user.id)
    .single();

  if (!roadmap) return { error: "Roadmap not found." };

  const existingNodes: Node<ToolNodeData>[] = Array.isArray(roadmap.nodes_json)
    ? (roadmap.nodes_json as Node<ToolNodeData>[])
    : [];

  const idx = existingNodes.length;
  const col = idx % 3;
  const row = Math.floor(idx / 3);

  const newNode: Node<ToolNodeData> = {
    id: `${tool.slug}-${Date.now()}`,
    type: "toolNode",
    position: { x: 80 + col * 280, y: 80 + row * 200 },
    data: {
      label:          tool.name,
      emoji:          tool.emoji,
      url:            tool.url ?? null,
      category:       tool.category,
      accent:         tool.accent,
      status:         "todo",
      stepNumber:     idx + 1,
      learning_guide: tool.learning_guide ?? null,
      video_url:      tool.video_url ?? null,
    },
  };

  const { error } = await supabase
    .from("roadmaps")
    .update({ nodes_json: [...existingNodes, newNode] })
    .eq("id", roadmapId);

  if (error) return { error: error.message };

  revalidatePath(`/roadmaps/${roadmapId}`);
  return { success: true };
}

// ── cloneRoadmap ───────────────────────────────────────────────────────────

export async function cloneRoadmap(sourceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/r/${sourceId}`);

  // Read the source using service client — bypasses RLS so private-but-shared
  // roadmaps can't be cloned by guessing IDs (only publicly visible ones can).
  const { createServiceClient } = await import("@/utils/supabase/service");
  const service = createServiceClient();

  const { data: source } = await service
    .from("roadmaps")
    .select("title, nodes_json, edges_json, is_public")
    .eq("id", sourceId)
    .single();

  if (!source || !source.is_public) {
    return { error: "Roadmap not found or not public." };
  }

  const { data: newRoadmap, error } = await supabase
    .from("roadmaps")
    .insert({
      user_id:    user.id,
      title:      `${source.title} (clone)`,
      nodes_json: source.nodes_json ?? [],
      edges_json: source.edges_json ?? [],
      is_public:  false,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/roadmaps");
  return { id: newRoadmap.id };
}

// ── toggleRoadmapVisibility ────────────────────────────────────────────────

export async function toggleRoadmapVisibility(
  roadmapId: string,
  isPublic: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("roadmaps")
    .update({ is_public: isPublic })
    .eq("id", roadmapId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/roadmaps/${roadmapId}`);
  revalidatePath(`/r/${roadmapId}`);
  return { success: true };
}

// ── persistNodes ──────────────────────────────────────────────────────────
// Writes the full nodes array (already filtered + resequenced client-side).

export async function persistNodes(nodes: Node<ToolNodeData>[], roadmapId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("roadmaps")
    .update({ nodes_json: nodes })
    .eq("id", roadmapId)
    .eq("user_id", user.id);
}

// ── removeToolFromRoadmap ──────────────────────────────────────────────────

export async function removeToolFromRoadmap(nodeId: string, roadmapId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, nodes_json")
    .eq("id", roadmapId)
    .eq("user_id", user.id)
    .single();

  if (!roadmap) return;

  const filtered = (roadmap.nodes_json as { id: string }[]).filter(
    (n) => n.id !== nodeId
  );

  await supabase
    .from("roadmaps")
    .update({ nodes_json: filtered })
    .eq("id", roadmapId);
}

// ── updateToolStatus ───────────────────────────────────────────────────────

export async function updateToolStatus(
  nodeId: string,
  status: string,
  roadmapId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, nodes_json")
    .eq("id", roadmapId)
    .eq("user_id", user.id)
    .single();

  if (!roadmap) return;

  const updated = (
    roadmap.nodes_json as { id: string; data: Record<string, unknown> }[]
  ).map((n) =>
    n.id === nodeId ? { ...n, data: { ...n.data, status } } : n
  );

  await supabase
    .from("roadmaps")
    .update({ nodes_json: updated })
    .eq("id", roadmapId);
}

// ── updateRoadmapEdges ─────────────────────────────────────────────────────

export async function updateRoadmapEdges(edges: Edge[], roadmapId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("roadmaps")
    .update({ edges_json: edges })
    .eq("id", roadmapId)
    .eq("user_id", user.id);
}

// ── createRoadmapWithTool ──────────────────────────────────────────────────
// Convenience: creates a new roadmap and immediately adds one tool.

export async function createRoadmapWithTool(
  title: string,
  tool: AddToolInput
): Promise<{ id?: string; error?: string }> {
  const roadmap = await createRoadmap(title);
  if (roadmap.error || !roadmap.id) return { error: roadmap.error ?? "Failed to create roadmap" };
  const result = await addToolToRoadmap(tool, roadmap.id);
  if (result?.error) return { error: result.error };
  return { id: roadmap.id };
}

// ── Stack definitions ──────────────────────────────────────────────────────

const STACKS: Record<"indie" | "research", string[]> = {
  indie:    ["bolt-new", "cursor", "claude"],
  research: ["perplexity", "claude", "notebooklm"],
};

// ── injectStackToRoadmap ───────────────────────────────────────────────────

export async function injectStackToRoadmap(
  stackType: "indie" | "research",
  roadmapId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const slugs = STACKS[stackType];

  const { data: tools } = await supabase
    .from("tools")
    .select("slug, name, emoji, url, category, accent, learning_guide, video_url")
    .in("slug", slugs);

  if (!tools || tools.length === 0) {
    return { error: "No matching tools found for this stack." };
  }

  const ordered = slugs
    .map((s) => tools.find((t) => t.slug === s))
    .filter(Boolean) as typeof tools;

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, nodes_json, edges_json")
    .eq("id", roadmapId)
    .eq("user_id", user.id)
    .single();

  if (!roadmap) return { error: "Roadmap not found." };

  const existingNodes: Node<ToolNodeData>[] = Array.isArray(roadmap.nodes_json)
    ? (roadmap.nodes_json as Node<ToolNodeData>[])
    : [];

  const existingEdges: Edge[] = Array.isArray(roadmap.edges_json)
    ? (roadmap.edges_json as Edge[])
    : [];

  const rowCount = Math.ceil(existingNodes.length / 3);
  const baseY    = 80 + rowCount * 220;
  const baseStep = existingNodes.length + 1;

  const newNodes: Node<ToolNodeData>[] = ordered.map((tool, i) => ({
    id: `${tool.slug}-stack-${Date.now()}-${i}`,
    type: "toolNode",
    position: { x: 100 + i * 400, y: baseY },
    data: {
      label:          tool.name,
      emoji:          tool.emoji ?? "✨",
      url:            tool.url ?? null,
      category:       tool.category ?? "AI Tool",
      accent:         (tool.accent as "moss" | "amber" | "lavender") ?? "moss",
      status:         "todo",
      stepNumber:     baseStep + i,
      learning_guide: tool.learning_guide ?? null,
      video_url:      tool.video_url ?? null,
    },
  }));

  const newEdges: Edge[] = newNodes.slice(0, -1).map((node, i) => ({
    id:     `edge-${node.id}-${newNodes[i + 1].id}`,
    source: node.id,
    target: newNodes[i + 1].id,
    type:   "default",
  }));

  await supabase
    .from("roadmaps")
    .update({
      nodes_json: [...existingNodes, ...newNodes],
      edges_json: [...existingEdges, ...newEdges],
    })
    .eq("id", roadmapId);

  revalidatePath(`/roadmaps/${roadmapId}`);
  return { success: true };
}
