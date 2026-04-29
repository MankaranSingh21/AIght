import type { Metadata } from "next";
import Link from "next/link";
import { getAllWorkflows } from "@/lib/workflows";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Workflows — AIght",
  description: "Step-by-step guides showing how AI tools combine into real pipelines. Six real workflows, authored and tested.",
};

export default function WorkflowsPage() {
  const workflows = getAllWorkflows();

  return (
    <>
      <main style={{ minHeight: "100vh", position: "relative" }}>

        {/* Header */}
        <section className="section-full" style={{ paddingBottom: 0 }}>
          <div className="section-inner" style={{ paddingBottom: 64 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 16,
            }}>
              tool combinations that actually work
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 20px",
              maxWidth: "18ch",
            }}>
              Workflows
            </h1>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 17,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              maxWidth: "52ch",
              fontStyle: "italic",
              margin: 0,
            }}>
              Real multi-step pipelines. Not theoretical — each one is something you can run today.
            </p>
          </div>

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,239,224,0.08) 20%, rgba(245,239,224,0.08) 80%, transparent)" }} />
        </section>

        {/* Workflow list */}
        <section className="section-full">
          <div className="section-inner" style={{ paddingTop: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {workflows.map((wf, i) => (
                <Link
                  key={wf.slug}
                  href={`/workflows/${wf.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "2rem 1fr auto",
                    alignItems: "start",
                    gap: "clamp(16px, 3vw, 40px)",
                    padding: "clamp(24px, 3vw, 36px) 0",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    {/* Index */}
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.05em",
                      paddingTop: 6,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Content */}
                    <div>
                      {/* Outcome label */}
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--accent-primary)",
                        margin: "0 0 10px",
                      }}>
                        {wf.outcome}
                      </p>
                      <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(18px, 3vw, 30px)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.025em",
                        lineHeight: 1.2,
                        margin: "0 0 10px",
                      }}>
                        {wf.title}
                      </h2>
                      <p style={{
                        fontFamily: "var(--font-editorial)",
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                        margin: "0 0 14px",
                        maxWidth: "58ch",
                        fontStyle: "italic",
                      }}>
                        {wf.tagline}
                      </p>
                      {/* Tool count chip */}
                      <span className="tag" style={{ fontSize: 10 }}>
                        {wf.tool_slugs.length} tools
                      </span>
                    </div>

                    {/* Meta */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0, paddingTop: 6 }}>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                      }}>
                        {wf.readTime}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 18,
                        color: "var(--text-muted)",
                      }}>
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
