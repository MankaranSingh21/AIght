import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ToolDetail, { type ToolDetailData, type UseCase } from "@/components/ToolDetail";
import type { Tool } from "@/utils/supabase/types";

// ── Use-case copy keyed by category ───────────────────────────────────────
// Editorial content — lives here until we add a use_cases table.

const USE_CASES: Record<string, [UseCase, UseCase]> = {
  "AI Chat": [
    {
      audience: "For Devs",
      emoji: "⌨️",
      headline: "Your tireless rubber duck",
      description:
        "Ask it to review your logic, explain a cryptic error, write tests you've been avoiding, or untangle why that regex is doing what it's doing. It won't judge you for the spaghetti.",
      accent: "moss",
    },
    {
      audience: "For Writers",
      emoji: "✍️",
      headline: "Your co-author without an ego",
      description:
        "Outline a chapter, workshop a paragraph, punch up a pitch deck, or just unstick yourself when the cursor refuses to move. It collaborates — it doesn't take over.",
      accent: "amber",
    },
  ],
  "Image Gen": [
    {
      audience: "For Designers",
      emoji: "✏️",
      headline: "Moodboards at the speed of thought",
      description:
        "Generate ten visual directions for a brand in the time it used to take to find stock photos. Iterate, remix, and hand off the vibe — not just a description of it.",
      accent: "lavender",
    },
    {
      audience: "For Storytellers",
      emoji: "📖",
      headline: "The world in your head, rendered",
      description:
        "Cover art, character concepts, scene illustrations — turn the cinematic images you've always had in your mind into something you can actually show people.",
      accent: "amber",
    },
  ],
  "Dev Tools": [
    {
      audience: "For Solo Devs",
      emoji: "🚀",
      headline: "Ship faster, explain less",
      description:
        "It understands your whole codebase — not just the file you have open. Refactor confidently, catch edge cases early, and spend your energy on the parts that actually matter.",
      accent: "amber",
    },
    {
      audience: "For Teams",
      emoji: "🤝",
      headline: "Onboard in hours, not weeks",
      description:
        "New to the repo? It reads the codebase and answers your questions instantly. Less pinging senior devs, more actual building.",
      accent: "moss",
    },
  ],
  "Productivity": [
    {
      audience: "For Students",
      emoji: "📚",
      headline: "Research without the rabbit holes",
      description:
        "Summarise a 40-page PDF in sixty seconds, then ask follow-up questions. Your second brain is finally faster than your first.",
      accent: "amber",
    },
    {
      audience: "For Founders",
      emoji: "🏗️",
      headline: "The ops stack you actually stick with",
      description:
        "Build wikis, track projects, draft SOPs — all in one place. It's the workspace that grows with you instead of against you.",
      accent: "lavender",
    },
  ],
  "Research": [
    {
      audience: "For Curious Minds",
      emoji: "🔭",
      headline: "Answers, not links",
      description:
        "Ask a nuanced question and get a nuanced answer — with citations. It's the difference between a search engine and a research partner.",
      accent: "moss",
    },
    {
      audience: "For Professionals",
      emoji: "💼",
      headline: "Deep dives in minutes",
      description:
        "Market landscape, competitive analysis, technical explainers — the kind of research that used to take an afternoon now takes a coffee break.",
      accent: "amber",
    },
  ],
};

const DEFAULT_USE_CASES: [UseCase, UseCase] = [
  {
    audience: "For Builders",
    emoji: "🔨",
    headline: "Move faster with an AI co-pilot",
    description:
      "Offload the repetitive, automate the tedious, and focus on the creative parts of your work that actually need you.",
    accent: "moss",
  },
  {
    audience: "For Learners",
    emoji: "🌱",
    headline: "Learn by doing, not by watching",
    description:
      "Ask it anything, get back an explanation calibrated exactly to your level. The best tutor you've ever had doesn't charge by the hour.",
    accent: "amber",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function mapPricing(is_free: boolean): ToolDetailData["pricing"] {
  return is_free ? "Free" : "Paid";
}

function getUseCases(category: string | null): [UseCase, UseCase] {
  return USE_CASES[category ?? ""] ?? DEFAULT_USE_CASES;
}

// ── Route ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("name, vibe_description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Tool not found — AIght" };
  return {
    title: `${data.name} — AIght`,
    description: data.vibe_description ?? undefined,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: t } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!t) notFound();

  const tool = t as Tool;

  const toolDetail: ToolDetailData = {
    name: tool.name,
    slug: tool.slug,
    emoji: tool.emoji,
    tagline: tool.vibe_description ?? "",
    category: tool.category ?? "AI Tool",
    pricing: mapPricing(tool.is_free),
    accent: (tool.accent as "moss" | "amber" | "lavender") ?? "moss",
    url: tool.url,
    tags: tool.tags ?? [],
    useCases: getUseCases(tool.category),
    video_url: tool.video_url,
    learning_guide: tool.learning_guide,
    related_concepts: tool.related_concepts ?? [],
  };

  return <ToolDetail tool={toolDetail} />;
}
