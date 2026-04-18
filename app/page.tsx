import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import Hero from "@/components/Hero";
import StarterStacks from "@/components/StarterStacks";
import DiscoverySection from "@/components/DiscoverySection";
import TeaserCarousel from "@/components/TeaserCarousel";
import Footer from "@/components/Footer";
import { ToolGridSkeleton } from "@/components/Skeletons";
import type { ToolCardProps } from "@/components/ToolCard";
import type { Tool } from "@/utils/supabase/types";

function mapTool(t: Partial<Tool>): ToolCardProps {
  return {
    slug: t.slug ?? "",
    name: t.name ?? "",
    tagline: t.vibe_description ?? "",
    category: t.category ?? "AI Tool",
    emoji: t.emoji ?? "🤖",
    url: t.url ?? null,
    tags: t.tags ?? [],
    accentColor: (t.accent as "moss" | "amber" | "lavender") ?? "moss",
  };
}

async function GlimpseSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, emoji, url, tags, accent")
    .order("created_at", { ascending: false })
    .limit(10);

  const tools = (data ?? []).map(mapTool);

  return (
    <section className="py-16 border-t border-moss-100">
      <div className="px-6 md:px-12 lg:px-20 mb-7 flex items-baseline justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-2">
            glimpse the archive ✦
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso">
            The signal in the noise
          </h2>
        </div>
      </div>
      <TeaserCarousel tools={tools} />
    </section>
  );
}

async function ToolsSection() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, emoji, url, tags, accent")
    .order("created_at", { ascending: true });

  const tools = (data ?? []).map(mapTool);

  return (
    <>
      <StarterStacks />
      <section id="trending-tools">
        <DiscoverySection tools={tools} />
      </section>
    </>
  );
}

function FoundersNote() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-moss-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-amber-500">
          why this exists ✦
        </p>
        <blockquote className="font-serif text-2xl md:text-3xl font-bold text-espresso leading-snug text-balance">
          &ldquo;The internet is drowning in AI spam and affiliate links.&rdquo;
        </blockquote>
        <p className="font-body text-lg text-forest/75 leading-relaxed">
          AIght is a deeply personal, ruthlessly curated archive. No hype, no sponsored rankings.
          Just the signal hidden in the noise. Built slowly, on purpose.
        </p>
        <div className="pt-2 flex items-center gap-3">
          <div className="h-px w-10 bg-amber-300" />
          <span className="font-body text-xs text-forest/40 tracking-widest uppercase">
            the founder&rsquo;s note
          </span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-parchment texture-grain">
        <Hero />

        <Suspense fallback={<ToolGridSkeleton />}>
          <GlimpseSection />
        </Suspense>

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

        <FoundersNote />
      </main>

      <Footer />
    </>
  );
}
