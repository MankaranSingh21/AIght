import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/Footer";
import CompareSearch from "@/components/CompareSearch";
import { CompareRadar, RADAR_AXES } from "@/components/RadarChart";
import type { Tool } from "@/utils/supabase/types";

export const revalidate = 3600;

type SP = Promise<{ a?: string; b?: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

function delta(a: number, b: number) {
  const d = a - b;
  if (Math.abs(d) < 0.05) return { sign: "·", value: "0.0", color: "var(--text-muted)" };
  return {
    sign: d > 0 ? "▲" : "▼",
    value: Math.abs(d).toFixed(1),
    color: d > 0 ? "var(--accent-primary)" : "var(--accent-secondary)",
  };
}

function avgScore(t: Tool) {
  return (t.utility_score + t.privacy_score + t.speed_score + t.cost_score + t.transparency_score) / 5;
}

// ── Top-strip card ────────────────────────────────────────────────────────────

function ToolHeaderStrip({ tool, color, sideLabel }: { tool: Tool; color: string; sideLabel: string }) {
  return (
    <div style={{
      padding: "var(--space-6)",
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      borderTop: `3px solid ${color}`,
      borderRadius: "var(--radius-lg)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}>
          {sideLabel}{tool.category ? ` · ${tool.category}` : ""}
        </span>
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-2xl)",
        fontWeight: 700,
        color: "var(--text-primary)",
        letterSpacing: "-0.02em",
        margin: 0,
        lineHeight: 1.15,
      }}>
        {tool.name}
      </h2>
      <p style={{
        fontFamily: "var(--font-editorial)",
        fontStyle: "italic",
        fontSize: "var(--text-sm)",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
        margin: 0,
      }}>
        {tool.vibe_description}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}>
            {avgScore(tool).toFixed(0)}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginTop: 4,
          }}>
            AIght score
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
        {tool.url && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: "none", fontSize: 13 }}
          >
            Visit →
          </a>
        )}
        <Link
          href={`/tool/${tool.slug}`}
          className="btn-ghost"
          style={{ textDecoration: "none", fontSize: 13 }}
        >
          Full review
        </Link>
      </div>
    </div>
  );
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { a, b } = await searchParams;
  if (!a || !b) {
    return {
      title: "Compare",
      description: "Compare any two AI tools side-by-side. Score deltas, pricing, AIght's take.",
      alternates: { canonical: `${SITE_URL}/compare` },
    };
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description")
    .in("slug", [a, b]);
  const aRow = data?.find((t) => t.slug === a);
  const bRow = data?.find((t) => t.slug === b);
  const aName = aRow?.name ?? a;
  const bName = bRow?.name ?? b;
  const title = `${aName} vs ${bName}`;
  const description = `Side-by-side comparison of ${aName} and ${bName} — the five-axis AIght score, pricing, and a writer's honest take.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/compare?a=${a}&b=${b}` },
    openGraph: { title: `${title} — AIght`, description, type: "website" },
    twitter: { card: "summary_large_image", title: `${title} — AIght`, description },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ComparePage({ searchParams }: { searchParams: SP }) {
  const { a, b } = await searchParams;
  const supabase = await createClient();

  // Picker list — slim view of all tools
  const { data: pickerRows } = await supabase
    .from("tools")
    .select("slug, name, category")
    .order("name", { ascending: true });
  const pickerTools = pickerRows ?? [];

  // Empty state — neither slug provided
  if (!a && !b) {
    return (
      <>
        <main style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          padding: "var(--space-20) var(--space-8)",
        }}>
          <div style={{ maxWidth: "var(--max-width-editorial)", margin: "0 auto", textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              marginBottom: "var(--space-4)",
            }}>
              Compare
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 var(--space-5)",
            }}>
              Two tools, side by side.
            </h1>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              maxWidth: "52ch",
              margin: "0 auto var(--space-10)",
              lineHeight: 1.7,
            }}>
              The five-axis score, the pricing, the take I actually wrote.
              No marketing copy mixed in.
            </p>
            <CompareSearch tools={pickerTools} />
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--text-muted)",
              marginTop: "var(--space-8)",
            }}>
              {pickerTools.length} tools to choose from.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Fetch the chosen tools (1 or 2)
  const slugs = [a, b].filter(Boolean) as string[];
  const { data: tools } = await supabase.from("tools").select("*").in("slug", slugs);
  const toolA = tools?.find((t) => t.slug === a) as Tool | undefined;
  const toolB = tools?.find((t) => t.slug === b) as Tool | undefined;

  if (a && !toolA) notFound();
  if (b && !toolB) notFound();

  // Only one selected — render that tool + picker for the other
  if (!toolA || !toolB) {
    const known = (toolA ?? toolB)!;
    return (
      <>
        <main style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          padding: "var(--space-16) var(--space-8)",
        }}>
          <div style={{ maxWidth: "var(--max-width-content)", margin: "0 auto" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              marginBottom: "var(--space-4)",
            }}>
              Compare
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 var(--space-8)",
              lineHeight: 1.2,
            }}>
              Pick a second tool to compare with{" "}
              <em style={{ color: "var(--accent-primary)", fontStyle: "italic" }}>{known.name}</em>.
            </h1>
            <CompareSearch tools={pickerTools} prefilledA={toolA?.slug} prefilledB={toolB?.slug} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Full comparison ──
  const scoresA = [toolA.utility_score, toolA.privacy_score, toolA.speed_score, toolA.cost_score, toolA.transparency_score];
  const scoresB = [toolB.utility_score, toolB.privacy_score, toolB.speed_score, toolB.cost_score, toolB.transparency_score];

  // Alternatives intersection
  const altsA = (toolA.alternatives ?? []).map((x) => x.slug);
  const altsB = (toolB.alternatives ?? []).map((x) => x.slug);
  const sharedAltSlugs = altsA.filter((s) => altsB.includes(s));
  let sharedAlts: { slug: string; name: string }[] = [];
  if (sharedAltSlugs.length > 0) {
    const { data: altRows } = await supabase.from("tools").select("slug, name").in("slug", sharedAltSlugs);
    sharedAlts = altRows ?? [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${toolA.name} vs ${toolB.name}`,
    description: `Compare ${toolA.name} and ${toolB.name} on the five-axis AIght score, pricing, and editorial take.`,
    url: `${SITE_URL}/compare?a=${toolA.slug}&b=${toolB.slug}`,
    isPartOf: { "@type": "WebSite", name: "AIght", url: SITE_URL },
    about: [
      { "@type": "SoftwareApplication", name: toolA.name, url: `${SITE_URL}/tool/${toolA.slug}` },
      { "@type": "SoftwareApplication", name: toolB.name, url: `${SITE_URL}/tool/${toolB.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{
        minHeight: "calc(100vh - 64px)",
        background: "var(--bg-base)",
        padding: "var(--space-16) var(--space-8)",
      }}>
        <div style={{ maxWidth: "var(--max-width-content)", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent-primary)",
            marginBottom: "var(--space-3)",
          }}>
            Compare
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            margin: "0 0 var(--space-12)",
            lineHeight: 1.1,
          }}>
            <span style={{ color: "var(--accent-primary)" }}>{toolA.name}</span>{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>vs</span>{" "}
            <span style={{ color: "var(--accent-secondary)" }}>{toolB.name}</span>
          </h1>

          {/* Top strip — two cards */}
          <div className="compare-strip" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}>
            <ToolHeaderStrip tool={toolA} color="var(--accent-primary)" sideLabel="A" />
            <ToolHeaderStrip tool={toolB} color="var(--accent-secondary)" sideLabel="B" />
          </div>

          {/* Radar overlay + delta table */}
          <section style={{ marginBottom: "var(--space-16)" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--space-6)",
            }}>
              Five-axis score
            </p>
            <div className="compare-radar-row" style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "var(--space-12)",
              alignItems: "center",
            }}>
              <CompareRadar
                scoresA={scoresA}
                scoresB={scoresB}
                colorA="#AAFF4D"
                colorB="#00FFD1"
              />
              <div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) 0",
                  borderBottom: "1px solid var(--border-default)",
                }}>
                  <span style={headerCellStyle}>Axis</span>
                  <span style={{ ...headerCellStyle, color: "var(--accent-primary)", textAlign: "right" }}>{toolA.name}</span>
                  <span style={{ ...headerCellStyle, color: "var(--accent-secondary)", textAlign: "right" }}>{toolB.name}</span>
                  <span style={{ ...headerCellStyle, textAlign: "right" }}>Δ A−B</span>
                </div>
                {RADAR_AXES.map(({ label }, i) => {
                  const d = delta(scoresA[i], scoresB[i]);
                  return (
                    <div
                      key={label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
                        gap: "var(--space-3)",
                        padding: "var(--space-3) 0",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span style={cellLabelStyle}>{label}</span>
                      <span style={{ ...cellNumStyle, textAlign: "right" }}>{scoresA[i].toFixed(1)}</span>
                      <span style={{ ...cellNumStyle, textAlign: "right" }}>{scoresB[i].toFixed(1)}</span>
                      <span style={{ ...cellNumStyle, color: d.color, textAlign: "right" }}>
                        {d.sign} {d.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section style={{ marginBottom: "var(--space-16)" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--space-4)",
            }}>
              Pricing
            </p>
            <div className="compare-pair" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-6)",
            }}>
              {[toolA, toolB].map((t, i) => {
                const color = i === 0 ? "var(--accent-primary)" : "var(--accent-secondary)";
                const p = t.pricing_detail;
                return (
                  <div
                    key={t.slug}
                    style={{
                      padding: "var(--space-5)",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color,
                      margin: "0 0 var(--space-3)",
                    }}>
                      {t.name}
                    </p>
                    {p ? (
                      <dl style={{ margin: 0 }}>
                        {[
                          ["Free tier",   p.free_tier],
                          ["Cliff",       p.cliff],
                          ["Paid monthly", p.paid_monthly],
                        ].map(([k, v], idx, all) => (
                          <div
                            key={k}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 12,
                              padding: "8px 0",
                              borderBottom: idx < all.length - 1 ? "1px solid var(--border-subtle)" : "none",
                            }}
                          >
                            <dt style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>{k}</dt>
                            <dd style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)", textAlign: "right", maxWidth: "22ch" }}>
                              {v || "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                        Pricing details not on file. {t.is_free ? "Has a free tier." : "Paid."}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* AIght's take */}
          {(toolA.aights_take || toolB.aights_take) && (
            <section style={{ marginBottom: "var(--space-16)" }}>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-warm)",
                marginBottom: "var(--space-4)",
              }}>
                AIght&rsquo;s take
              </p>
              <div className="compare-pair" style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-6)",
              }}>
                {[toolA, toolB].map((t, i) => {
                  const color = i === 0 ? "var(--accent-primary)" : "var(--accent-secondary)";
                  return (
                    <div
                      key={t.slug}
                      style={{
                        padding: "var(--space-5)",
                        background: "rgba(244,171,31,0.04)",
                        border: "1px solid rgba(244,171,31,0.18)",
                        borderLeft: `3px solid ${color}`,
                        borderRadius: "var(--radius-lg)",
                      }}
                    >
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color,
                        margin: "0 0 var(--space-3)",
                      }}>
                        {t.name}
                      </p>
                      {t.aights_take ? (
                        <p style={{
                          fontFamily: "var(--font-editorial)",
                          fontSize: "var(--text-base)",
                          lineHeight: 1.75,
                          color: "var(--text-primary)",
                          margin: 0,
                        }}>
                          {t.aights_take}
                        </p>
                      ) : (
                        <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                          No take filed for {t.name} yet.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Shared alternatives */}
          {sharedAlts.length > 0 && (
            <section style={{ marginBottom: "var(--space-16)" }}>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "var(--space-4)",
              }}>
                Both consider these alternatives
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {sharedAlts.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/tool/${alt.slug}`}
                    className="tag"
                    style={{ textDecoration: "none" }}
                  >
                    {alt.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Try another pair */}
          <section style={{
            marginTop: "var(--space-20)",
            paddingTop: "var(--space-10)",
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--space-4)",
            }}>
              Try a different pair
            </p>
            <CompareSearch tools={pickerTools} prefilledA={toolA.slug} prefilledB={toolB.slug} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

const headerCellStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const cellLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  color: "var(--text-primary)",
};

const cellNumStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "var(--text-primary)",
};
