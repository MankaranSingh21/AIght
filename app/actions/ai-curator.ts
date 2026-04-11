"use server";

import { redirect } from "next/navigation";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { Node, Edge } from "@xyflow/react";
import type { ToolNodeData } from "@/components/ToolNode";

// ── Provider setup ─────────────────────────────────────────────────────────

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

// ── Schema ─────────────────────────────────────────────────────────────────

const RoadmapSchema = z.object({
  title: z
    .string()
    .describe("A short, evocative roadmap title (5–8 words, no filler)"),
  steps: z
    .array(
      z.object({
        slug: z
          .string()
          .describe("Exact slug from the available tools list — no guessing"),
        rationale: z
          .string()
          .describe("One sentence: why this tool belongs at this step"),
        step_instructions: z
          .string()
          .describe(
            "2–3 sentences: exactly what the user must do inside this specific tool to accomplish the overall roadmap goal. Be concrete and specific to the user's goal — not generic tool documentation."
          ),
      })
    )
    .min(3)
    .max(5),
});

// ── Action ─────────────────────────────────────────────────────────────────

export async function generateRoadmapFromPrompt(userPrompt: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Fetch all available tools so the AI knows what to pick from
  const { data: tools } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category")
    .order("name");

  if (!tools || tools.length === 0) {
    return { error: "No tools found in the database." };
  }

  const toolIndex = tools
    .map((t) => `- ${t.slug}: ${t.name} (${t.category ?? "AI"}) — ${t.vibe_description ?? ""}`)
    .join("\n");

  // 2. Ask Gemini to select and sequence the right tools
  let aiResult;
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: RoadmapSchema,
      system: `You are an expert AI architect curating learning roadmaps.
Given a user goal and a list of available AI tools, select 3–5 tools that together form a coherent, sequential pipeline.
Return them in strict chronological order — step 1 should be done first.
For each tool, write step_instructions: a short, actionable paragraph (2–3 sentences) explaining EXACTLY what the user needs to do inside that specific tool to accomplish the overall goal. Be concrete to the user's goal — not generic tool documentation. For example, if the goal is 'build a landing page' and the tool is Cursor, say something like: 'Open Cursor and use Composer mode to scaffold a Next.js project. Describe the landing page sections you want in plain English and let Cursor generate the components. Iterate on the design by selecting code blocks and asking Cursor to refine the styling.'
IMPORTANT: Only use slugs that appear exactly in the available tools list. Do not invent slugs.`,
      prompt: `User goal: "${userPrompt}"

Available tools:
${toolIndex}

Select the best 3–5 tools for this goal and return them in order.`,
    });
    aiResult = object;
  } catch (err) {
    console.error("Gemini generateObject failed:", err);
    return { error: "AI generation failed. Please try again." };
  }

  // 3. Validate slugs against actual DB rows (discard any hallucinated slugs)
  const slugSet = new Set(tools.map((t) => t.slug));
  const validSteps = aiResult.steps.filter((s) => slugSet.has(s.slug));

  if (validSteps.length === 0) {
    return { error: "The AI didn't find any matching tools. Try rephrasing your goal." };
  }

  // 4. Fetch full tool data for the selected slugs
  const { data: selectedTools } = await supabase
    .from("tools")
    .select("slug, name, emoji, url, category, accent, learning_guide, video_url")
    .in("slug", validSteps.map((s) => s.slug));

  if (!selectedTools || selectedTools.length === 0) {
    return { error: "Could not fetch tool data." };
  }

  // Preserve the AI's ordering
  const ordered = validSteps
    .map((step) => ({
      tool:              selectedTools.find((t) => t.slug === step.slug),
      rationale:         step.rationale,
      step_instructions: step.step_instructions,
    }))
    .filter((s) => s.tool !== undefined) as {
      tool: (typeof selectedTools)[number];
      rationale: string;
      step_instructions: string;
    }[];

  // 5. Construct nodes in a horizontal pipeline row
  const nodes: Node<ToolNodeData>[] = ordered.map((s, i) => ({
    id:   `${s.tool.slug}-ai-${Date.now()}-${i}`,
    type: "toolNode",
    position: { x: 100 + i * 400, y: 120 },
    data: {
      label:          s.tool.name,
      emoji:          s.tool.emoji ?? "✨",
      url:            s.tool.url ?? null,
      category:       s.tool.category ?? "AI Tool",
      accent:         (s.tool.accent as "moss" | "amber" | "lavender") ?? "moss",
      status:         "todo",
      stepNumber:     i + 1,
      rationale:         s.rationale,
      step_instructions: s.step_instructions,
      learning_guide:    s.tool.learning_guide ?? null,
      video_url:         s.tool.video_url ?? null,
    },
  }));

  const edges: Edge[] = nodes.slice(0, -1).map((node, i) => ({
    id:     `edge-${node.id}-${nodes[i + 1].id}`,
    source: node.id,
    target: nodes[i + 1].id,
    type:   "smoothstep",
    animated: true,
    style: { stroke: "#3D8A2B", strokeWidth: 2 },
  }));

  // 6. Persist the new roadmap
  const { data: newRoadmap, error: insertError } = await supabase
    .from("roadmaps")
    .insert({
      user_id:    user.id,
      title:      aiResult.title,
      nodes_json: nodes,
      edges_json: edges,
      is_public:  false,
    })
    .select("id")
    .single();

  if (insertError) return { error: insertError.message };

  return { roadmapId: newRoadmap.id, title: aiResult.title };
}
