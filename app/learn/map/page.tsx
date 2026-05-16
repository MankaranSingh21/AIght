import type { Metadata } from "next";
import Link from "next/link";
import UniverseMap from "@/components/learn/UniverseMap";
import { buildUniverseGraph } from "@/lib/universe-graph";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The universe",
  description:
    "Every field, every concept, every tool — and where you fit. AIght's full map of AI learning.",
  openGraph: {
    title: "The AIght universe",
    description:
      "Every field, every concept, every tool — and where you fit.",
  },
};

export default async function MapPage() {
  const graph = await buildUniverseGraph();

  const fieldCount   = graph.nodes.filter((n) => n.kind === "field").length;
  const conceptCount = graph.nodes.filter((n) => n.kind === "concept").length;
  const toolCount    = graph.nodes.filter((n) => n.kind === "tool").length;

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <div
          style={{
            maxWidth: "var(--max-width-content)",
            margin: "0 auto",
            padding: "64px clamp(20px, 5vw, 48px) 32px",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-primary)",
                marginBottom: 14,
              }}
            >
              The universe
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 900,
                color: "#F5EFE0",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: "0 0 14px",
              }}
            >
              Every field, every concept, every tool &mdash; and where you fit.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-editorial)",
                fontStyle: "italic",
                fontSize: 17,
                color: "rgba(245,239,224,0.55)",
                lineHeight: 1.8,
                maxWidth: "60ch",
                marginBottom: 18,
              }}
            >
              {fieldCount} fields, {conceptCount} concepts, {toolCount} tools. Hover any
              node to see its connections. Take the quiz to overlay your own
              trajectory.
            </p>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
              <Link
                href="/learn/paths/quiz"
                className="btn-ghost"
                style={{ fontSize: 13 }}
              >
                See your trajectory →
              </Link>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                Scroll the canvas to explore.
              </span>
            </div>
          </div>
        </div>

        {/* Universe canvas */}
        <div style={{ padding: "0 clamp(8px, 3vw, 32px) 96px" }}>
          <UniverseMap graph={graph} />
        </div>

        {/* Footer note */}
        <div
          style={{
            maxWidth: "var(--max-width-content)",
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 48px) 96px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(245,239,224,0.25)",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            More concepts coming &mdash; slowly, on purpose.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
