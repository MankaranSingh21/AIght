import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ToolsClient from "@/components/ToolsClient";
import Footer from "@/components/Footer";
import type { ToolCardProps } from "@/components/ToolCard";
import type { Tool } from "@/utils/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Full Archive",
  description:
    "52+ curated AI tools worth your attention. Instant search and tag filters. No sponsored rankings, no affiliate links.",
};

export default async function ToolsArchivePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, url, tags")
    .order("created_at", { ascending: true });

  const tools: ToolCardProps[] = (data ?? []).map((t: Partial<Tool>) => ({
    slug:     t.slug ?? "",
    name:     t.name ?? "",
    tagline:  t.vibe_description ?? "",
    category: t.category ?? "AI Tool",
    url:      t.url ?? null,
    tags:     t.tags ?? [],
  }));

  return (
    <>
      <main className="min-h-screen bg-page">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-20 pt-16 pb-12">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-accent mb-4">
            every tool we&apos;ve found worth your time
          </p>
          <h1 className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-4 tracking-tight">
            The Full Archive
          </h1>
          <p className="font-sans text-lg text-secondary max-w-xl leading-relaxed">
            {tools.length} tools and counting. No sponsored rankings. No hustle energy.
            Tap any card to explore.
          </p>
        </section>

        {/* Divider */}
        <div className="px-6 md:px-12 lg:px-20">
          <div className="h-px w-full bg-[var(--border-default)]" />
        </div>

        {/* Search + grid */}
        <section className="px-6 md:px-12 lg:px-20 py-10">
          <ToolsClient tools={tools} />
        </section>
      </main>
      <Footer />
    </>
  );
}
