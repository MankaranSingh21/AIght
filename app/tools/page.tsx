import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ToolCard, { type ToolCardProps } from "@/components/ToolCard";
import ArchiveVibeFilter from "@/components/ArchiveVibeFilter";
import type { Tool } from "@/utils/supabase/types";

export const dynamic = "force-dynamic";

// Same vibe → DB category mapping used in DiscoverySection (client) and here (server).
const VIBE_TO_CATEGORIES: Record<string, string[]> = {
  builders: ["Dev Tools", "Code"],
  students: ["Productivity", "Education"],
  writers:  ["AI Chat", "Writing"],
  curious:  ["Research", "Image Gen", "Video Gen", "Audio", "Other"],
};

type Props = { searchParams: Promise<{ vibe?: string }> };

export default async function ToolsArchivePage({ searchParams }: Props) {
  const { vibe } = await searchParams;
  const activeVibe = vibe && VIBE_TO_CATEGORIES[vibe] ? vibe : "all";

  const supabase = await createClient();

  let query = supabase
    .from("tools")
    .select("slug, name, vibe_description, category, emoji, url, tags, accent")
    .order("created_at", { ascending: true });

  // Apply category filter server-side when a valid vibe is selected.
  if (activeVibe !== "all") {
    const cats = VIBE_TO_CATEGORIES[activeVibe];
    // ilike is case-insensitive so "Dev Tools" matches "dev tools" in the DB.
    const orFilter = cats.map((c) => `category.ilike.${c}`).join(",");
    query = query.or(orFilter);
  }

  const { data } = await query;

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
    <main className="min-h-screen bg-parchment texture-grain">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-16 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-sm text-moss-500 hover:text-moss-700 transition-colors duration-150 mb-10"
        >
          ← Back to Home
        </Link>

        <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-4">
          every tool we&apos;ve found worth your time ✦
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-espresso leading-tight mb-4">
          The Full Archive
        </h1>
        <p className="font-body text-lg text-forest/70 max-w-xl leading-relaxed">
          {tools.length} {activeVibe === "all" ? "tools" : "tools in this vibe"} and counting.
          No sponsored rankings. No hustle energy. Just the good stuff, curated slowly on purpose.
        </p>
      </section>

      {/* Divider */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="h-px w-full bg-moss-200" />
      </div>

      {/* Vibe filter pills + clear */}
      <div className="px-6 md:px-12 lg:px-20 pt-10 pb-2 space-y-3">
        <ArchiveVibeFilter activeVibe={activeVibe} />
        {activeVibe !== "all" && (
          <div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 font-body text-xs text-forest/50 hover:text-forest transition-colors duration-150"
            >
              <span aria-hidden>×</span> Clear filter
            </Link>
          </div>
        )}
      </div>

      {/* Grid */}
      <section className="px-6 md:px-12 lg:px-20 py-10">
        {tools.length === 0 ? (
          <p className="font-body text-sm text-forest/50 text-center py-16">
            Nothing here yet — try a different vibe. ✦
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/tool/${tool.slug}`} className="block">
                <ToolCard {...tool} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
