import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import Hero from "@/components/Hero";
import StarterStacks from "@/components/StarterStacks";
import DiscoverySection from "@/components/DiscoverySection";
import { ToolGridSkeleton } from "@/components/Skeletons";
import type { ToolCardProps } from "@/components/ToolCard";
import type { Tool } from "@/utils/supabase/types";

// Async server component — lives inside the Suspense boundary so the rest of
// the page can render immediately while tools stream in.
async function ToolsSection() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, emoji, url, tags, accent")
    .order("created_at", { ascending: true });

  const tools: ToolCardProps[] = (data ?? []).map((t: Partial<Tool>) => ({
    slug: t.slug ?? "",
    name: t.name ?? "",
    tagline: t.vibe_description ?? "",
    category: t.category ?? "AI Tool",
    emoji: t.emoji ?? "🤖",
    url: t.url ?? null,
    tags: t.tags ?? [],
    accentColor: (t.accent as "moss" | "amber" | "lavender") ?? "moss",
  }));

  return (
    <>
      <StarterStacks />
      <section id="trending-tools">
        <DiscoverySection tools={tools} />
      </section>
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-parchment texture-grain">
      <Hero />

      <Suspense fallback={<ToolGridSkeleton />}>
        <ToolsSection />
      </Suspense>

      <section id="about" className="px-6 md:px-12 lg:px-20 py-20 border-t border-moss-100">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500">
            about this corner of the internet ✦
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
            What even is AIght?
          </h2>
          <p className="font-body text-lg text-forest/75 leading-relaxed">
            AIght is a cozy, curated directory of AI tools that actually deserve your attention.
            No sponsored rankings. No hustle-bro energy. Just honest curation, warm vibes, and
            a roadmap builder so you can learn at your own pace — the internet as it should be.
          </p>
          <p className="font-body text-sm text-forest/50 leading-relaxed">
            Built slowly, on purpose. More features coming when they&rsquo;re ready. ✦
          </p>
        </div>
      </section>
    </main>
  );
}
