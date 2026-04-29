import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ToolDetail, { type ToolDetailData, type UseCase, type Alternative } from "@/components/ToolDetail";
import type { Tool, AlternativeEntry } from "@/utils/supabase/types";

// ── Use-case copy keyed by category ───────────────────────────────────────
// Editorial content — lives here until we add a use_cases table.

const USE_CASES: Record<string, [UseCase, UseCase]> = {
  "AI Chat": [
    {
      audience: "For Devs",
      headline: "Your tireless rubber duck",
      description:
        "Ask it to review your logic, explain a cryptic error, write tests you've been avoiding, or untangle why that regex is doing what it's doing. It won't judge you for the spaghetti.",
    },
    {
      audience: "For Writers",
      headline: "Your co-author without an ego",
      description:
        "Outline a chapter, workshop a paragraph, punch up a pitch deck, or just unstick yourself when the cursor refuses to move. It collaborates — it doesn't take over.",
    },
  ],
  "Image Gen": [
    {
      audience: "For Designers",
      headline: "Moodboards at the speed of thought",
      description:
        "Generate ten visual directions for a brand in the time it used to take to find stock photos. Iterate, remix, and hand off the vibe — not just a description of it.",
    },
    {
      audience: "For Storytellers",
      headline: "The world in your head, rendered",
      description:
        "Cover art, character concepts, scene illustrations — turn the cinematic images you've always had in your mind into something you can actually show people.",
    },
  ],
  "Dev Tools": [
    {
      audience: "For Solo Devs",
      headline: "Ship faster, explain less",
      description:
        "It understands your whole codebase — not just the file you have open. Refactor confidently, catch edge cases early, and spend your energy on the parts that actually matter.",
    },
    {
      audience: "For Teams",
      headline: "Onboard in hours, not weeks",
      description:
        "New to the repo? It reads the codebase and answers your questions instantly. Less pinging senior devs, more actual building.",
    },
  ],
  "Productivity": [
    {
      audience: "For Students",
      headline: "Research without the rabbit holes",
      description:
        "Summarise a 40-page PDF in sixty seconds, then ask follow-up questions. Your second brain is finally faster than your first.",
    },
    {
      audience: "For Founders",
      headline: "The ops stack you actually stick with",
      description:
        "Build wikis, track projects, draft SOPs — all in one place. It's the workspace that grows with you instead of against you.",
    },
  ],
  "Research": [
    {
      audience: "For Curious Minds",
      headline: "Answers, not links",
      description:
        "Ask a nuanced question and get a nuanced answer — with citations. It's the difference between a search engine and a research partner.",
    },
    {
      audience: "For Professionals",
      headline: "Deep dives in minutes",
      description:
        "Market landscape, competitive analysis, technical explainers — the kind of research that used to take an afternoon now takes a coffee break.",
    },
  ],
};

const DEFAULT_USE_CASES: [UseCase, UseCase] = [
  {
    audience: "For Builders",
    headline: "Move faster with an AI co-pilot",
    description:
      "Offload the repetitive, automate the tedious, and focus on the creative parts of your work that actually need you.",
  },
  {
    audience: "For Learners",
    headline: "Learn by doing, not by watching",
    description:
      "Ask it anything, get back an explanation calibrated exactly to your level. The best tutor you've ever had doesn't charge by the hour.",
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

  if (!data) return { title: "Tool not found" };
  return {
    title: data.name,
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

  // Secondary query: resolve alternative tool names from slugs
  const altEntries: AlternativeEntry[] = tool.alternatives ?? [];
  const altSlugs = altEntries.map((a) => a.slug);
  let resolvedAlts: Alternative[] = [];
  if (altSlugs.length > 0) {
    const { data: altData } = await supabase
      .from("tools")
      .select("slug, name")
      .in("slug", altSlugs);
    const nameMap = new Map((altData ?? []).map((r: { slug: string; name: string }) => [r.slug, r.name]));
    resolvedAlts = altEntries
      .filter((a) => nameMap.has(a.slug))
      .map((a) => ({ slug: a.slug, name: nameMap.get(a.slug)!, reason: a.reason }));
  }

  const toolDetail: ToolDetailData = {
    name: tool.name,
    slug: tool.slug,
    tagline: tool.vibe_description ?? "",
    category: tool.category ?? "AI Tool",
    pricing: mapPricing(tool.is_free),
    url: tool.url,
    tags: tool.tags ?? [],
    useCases: getUseCases(tool.category),
    video_url: tool.video_url,
    learning_guide: tool.learning_guide,
    related_concepts: tool.related_concepts ?? [],
    weaknesses: tool.weaknesses ?? [],
    status: tool.status ?? "stable",
    deprecated_reason: tool.deprecated_reason ?? null,
    pricing_detail: tool.pricing_detail ?? null,
    alternatives: resolvedAlts,
  };

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.vibe_description ?? undefined,
    "applicationCategory": tool.category ?? "AI Tool",
    "url": tool.url ?? undefined,
    "offers": {
      "@type": "Offer",
      "price": tool.is_free ? "0" : undefined,
      "priceCurrency": tool.is_free ? "USD" : undefined,
      "availability": "https://schema.org/OnlineOnly",
    },
    "featureList": (tool.tags ?? []).join(", ") || undefined,
    "isPartOf": {
      "@type": "WebSite",
      "name": "AIght",
      "url": SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolDetail tool={toolDetail} />
    </>
  );
}
