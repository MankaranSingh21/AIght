import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import UniverseCanvas from "@/components/learn/UniverseCanvas";
import UniverseList from "@/components/learn/UniverseList";
import { buildUniverseTopology } from "@/lib/universe-graph";
import { layoutUniverse } from "@/lib/universe-layout";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The universe",
  description:
    "Every field, every concept, every tool — and where you fit. AIght's full map of AI learning.",
  openGraph: {
    title: "The AIght universe",
    description: "Every field, every concept, every tool — and where you fit.",
  },
};

export default async function MapPage() {
  const topology = await buildUniverseTopology();

  // Every edge in this graph points at hand-curated content. If a slug is
  // renamed or a tool is removed, the edge is dropped silently — which is
  // exactly how 12 dead tool references sat in FIELD_TOOL_MAP unnoticed.
  // Make the next one loud in development.
  if (process.env.NODE_ENV !== "production" && topology.dropped.length > 0) {
    console.warn(
      `[universe] ${topology.dropped.length} edge(s) dropped:\n` +
        topology.dropped.map((d) => `  ${d.from} -> ${d.to}  (${d.reason})`).join("\n"),
    );
  }

  const graph = layoutUniverse(topology);
  const { fields, concepts, tools } = graph.stats;

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <div
          style={{
            maxWidth: "var(--max-width-content)",
            margin: "0 auto",
            padding: "64px clamp(20px, 5vw, 48px) 24px",
          }}
        >
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
            {`${fields} fields, ${concepts} concepts, ${tools} tools \u2014 drawn as orbits, with the ideas everything else rests on at the centre. Hover a node to light up what it connects to. Take the quiz to overlay your own path.`}
          </p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/learn/paths/quiz" className="btn-ghost" style={{ fontSize: 13 }}>
              See your trajectory →
            </Link>
            <a
              href="#universe-list"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Skip the map, browse as a list →
            </a>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
              }}
            >
              Drag to pan · ⌘-scroll or pinch to zoom
            </span>
          </div>
        </div>

        {/*
          Order flips on mobile: the list comes first, because on a phone the
          list is how you get somewhere and the canvas is what you play with.
          Handled with CSS order so the DOM keeps a sensible reading sequence.
        */}
        <div className="universe-layout">
          <div className="universe-canvas-slot">
            <div style={{ padding: "0 clamp(8px, 3vw, 32px)" }}>
              {/* useSearchParams inside — Suspense keeps the page prerenderable */}
              <Suspense fallback={<div style={{ height: "min(82vh, 860px)" }} />}>
                <UniverseCanvas graph={graph} />
              </Suspense>
            </div>
          </div>

          <div className="universe-list-slot">
            <UniverseList graph={graph} />
          </div>
        </div>

        <div
          style={{
            maxWidth: "var(--max-width-content)",
            margin: "0 auto",
            padding: "48px clamp(20px, 5vw, 48px) 96px",
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

      <style>{`
        .universe-layout { display: flex; flex-direction: column; gap: 56px; }
        .universe-canvas-slot { order: 1; }
        .universe-list-slot { order: 2; }
        @media (max-width: 640px) {
          .universe-canvas-slot { order: 2; }
          .universe-list-slot { order: 1; }
        }
      `}</style>
    </>
  );
}
