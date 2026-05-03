import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { mapToolToCardProps } from "@/lib/tool-mapping";

import ToolCard, { type ToolCardProps } from "@/components/ToolCard";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import type { Tool } from "@/utils/supabase/types";
import categoriesData from "@/content/categories.json";

type Props = {
  params: Promise<{ category: string }>;
};

const SLUG_TO_DB: Record<string, string> = {
  "ai-chat": "AI CHAT",
  "dev-tools": "DEV TOOLS",
  "image-gen": "IMAGE GEN",
  "video-gen": "VIDEO GEN",
  "research": "RESEARCH",
  "productivity": "PRODUCTIVITY",
  "automation": "AUTOMATION",
  "audio": "AUDIO",
};

function getCategoryData(slug: string) {
  return Object.values(categoriesData).find((cat) => cat.slug === slug);
}

export async function generateStaticParams() {
  return Object.values(categoriesData).map((cat) => ({
    category: cat.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryData(category);
  if (!cat) notFound();

  const dbCategory = SLUG_TO_DB[category];
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("*")
    .eq("category", dbCategory)
    .order("created_at", { ascending: false });

  const tools: ToolCardProps[] = (data ?? []).map((t: Tool) => mapToolToCardProps(t));

  return (
    <>
      <main style={{ minHeight: "100vh", position: "relative" }}>

        {/* Back */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 48px 0" }}>
          <Link
            href="/tools"
            style={{
              fontFamily: "var(--font-ui)", fontSize: 13,
              color: "var(--text-muted)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "color 150ms ease",
            }}
          >
            ← All tools
          </Link>
        </div>

        {/* Editorial header */}
        <section className="section-full" style={{ paddingBottom: 0 }}>
          <div className="section-inner" style={{ paddingBottom: 48 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 16,
            }}>
              {dbCategory.toLowerCase()}
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 5vw, 56px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 24px",
              maxWidth: "22ch",
            }}>
              {cat.headline}
            </h1>

            {/* Two-column editorial block */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "32px 64px",
              maxWidth: 900,
            }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10,
                }}>
                  What it is
                </p>
                <p style={{
                  fontFamily: "var(--font-editorial)", fontSize: 15,
                  color: "var(--text-secondary)", lineHeight: 1.8, margin: 0,
                }}>
                  {cat.overview}
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10,
                }}>
                  Why now
                </p>
                <p style={{
                  fontFamily: "var(--font-editorial)", fontSize: 15,
                  color: "var(--text-secondary)", lineHeight: 1.8, margin: 0,
                }}>
                  {cat.why_now}
                </p>
              </div>
            </div>

            {/* Related concepts */}
            {cat.related_concepts.length > 0 && (
              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.10em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                }}>
                  Understand the tech →
                </span>
                {cat.related_concepts.map((concept) => (
                  <Link
                    key={concept}
                    href={`/learn/${concept}`}
                    className="tag tag-accent"
                    style={{ textDecoration: "none" }}
                  >
                    {concept.replace(/-/g, " ")} →
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,239,224,0.08) 20%, rgba(245,239,224,0.08) 80%, transparent)" }} />
        </section>

        {/* Tool grid */}
        <section className="section-full" style={{ background: "rgba(16,14,11,0.5)" }}>
          <div className="section-inner" style={{ paddingTop: 48 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)",
              color: "var(--text-muted)", margin: "0 0 28px",
            }}>
              {tools.length} tool{tools.length !== 1 ? "s" : ""} in this category
            </p>
            {tools.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "var(--space-5)",
              }}>
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} {...tool} />
                ))}
              </div>
            ) : (
              <p style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic",
                color: "var(--text-muted)", fontSize: "var(--text-lg)",
              }}>
                No tools in this category yet.
              </p>
            )}

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
