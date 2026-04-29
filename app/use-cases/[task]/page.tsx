import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getUseCase, getAllUseCases } from "@/lib/use-cases";
import { createClient } from "@/utils/supabase/server";
import ToolCard from "@/components/ToolCard";
import type { ToolCardProps } from "@/components/ToolCard";
import type { Tool } from "@/utils/supabase/types";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ task: string }> };

export async function generateStaticParams() {
  return getAllUseCases().map((uc) => ({ task: uc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { task } = await params;
  const uc = getUseCase(task);
  if (!uc) return { title: "Not found" };
  return {
    title: `${uc.label} — AIght`,
    description: uc.description,
  };
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { task } = await params;
  const uc = getUseCase(task);
  if (!uc) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("*")
    .in("slug", uc.tool_slugs);

  // Preserve the editorial ordering from use-cases.json
  const toolMap = new Map((data ?? []).map((t: Tool) => [t.slug, t]));
  const tools: ToolCardProps[] = uc.tool_slugs
    .map((slug) => toolMap.get(slug))
    .filter(Boolean)
    .map((t) => ({
      slug:         (t as Tool).slug,
      name:         (t as Tool).name,
      tagline:      (t as Tool).vibe_description ?? "",
      category:     (t as Tool).category ?? "AI Tool",
      url:          (t as Tool).url ?? null,
      tags:         (t as Tool).tags ?? [],
      created_at:   (t as Tool).created_at,
      is_sponsored: (t as Tool).is_sponsored ?? null,
      accent:       (t as Tool).accent ?? null,
      status:       (t as Tool).status ?? "stable",
    }));

  return (
    <>
      <main style={{ minHeight: "100vh", position: "relative" }}>

        {/* Back */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 48px 0" }}>
          <Link
            href="/use-cases"
            style={{
              fontFamily: "var(--font-ui)", fontSize: 13,
              color: "var(--text-muted)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "color 150ms ease",
            }}
          >
            ← All use cases
          </Link>
        </div>

        {/* Header */}
        <section className="section-full" style={{ paddingBottom: 0 }}>
          <div className="section-inner" style={{ paddingBottom: 48 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 16,
            }}>
              use case
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 20px",
              maxWidth: "18ch",
            }}>
              {uc.label}
            </h1>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 17,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              maxWidth: "52ch",
              margin: 0,
              fontStyle: "italic",
            }}>
              {uc.description}
            </p>
          </div>
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,239,224,0.08) 20%, rgba(245,239,224,0.08) 80%, transparent)" }} />
        </section>

        {/* Tool grid */}
        <section className="section-full">
          <div className="section-inner" style={{ paddingTop: 48 }}>
            {tools.length > 0 ? (
              <>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)",
                  color: "var(--text-muted)", margin: "0 0 28px",
                }}>
                  {tools.length} tool{tools.length !== 1 ? "s" : ""} for this job
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "var(--space-5)",
                }}>
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} {...tool} />
                  ))}
                </div>
              </>
            ) : (
              <p style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic",
                color: "var(--text-muted)", fontSize: "var(--text-lg)",
              }}>
                Tools coming soon for this use case.
              </p>
            )}

            {/* Browse all link */}
            <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border-subtle)" }}>
              <Link href="/tools" className="btn-ghost" style={{ fontSize: 14 }}>
                Browse the full archive →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
