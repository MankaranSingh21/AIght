import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ToolsClient from "@/components/ToolsClient";
import type { ToolCardProps } from "@/components/ToolCard";
import type { Tool } from "@/utils/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Full Archive",
  description:
    "52+ curated AI tools worth your attention. Instant search, tag filters, and one-click roadmap building. No sponsored rankings, no affiliate links.",
};

export default async function ToolsArchivePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, emoji, url, tags, accent")
    .order("created_at", { ascending: true });

  const tools: ToolCardProps[] = (data ?? []).map((t: Partial<Tool>) => ({
    slug:        t.slug ?? "",
    name:        t.name ?? "",
    tagline:     t.vibe_description ?? "",
    category:    t.category ?? "AI Tool",
    emoji:       t.emoji ?? "🤖",
    url:         t.url ?? null,
    tags:        t.tags ?? [],
    accentColor: (t.accent as "moss" | "amber" | "lavender") ?? "moss",
  }));

  return (
    <main className="min-h-screen bg-parchment texture-grain">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-16 pb-12">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-4">
          every tool we&apos;ve found worth your time ✦
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-espresso leading-tight mb-4">
          The Full Archive
        </h1>
        <p className="font-body text-lg text-forest/70 max-w-xl leading-relaxed">
          {tools.length} tools and counting. No sponsored rankings. No hustle energy.
          Hover any card to build a roadmap with it in one click.
        </p>
      </section>

      {/* Divider */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="h-px w-full bg-moss-200" />
      </div>

      {/* Search + grid */}
      <section className="px-6 md:px-12 lg:px-20 py-10">
        <ToolsClient tools={tools} />
      </section>
    </main>
  );
}
