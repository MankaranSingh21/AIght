import type { Metadata } from "next";
import Link from "next/link";
import { getAllConcepts } from "@/lib/learn";

export const metadata: Metadata = {
  title: "Learn — AIght",
  description: "Honest explanations of the concepts behind the AI tools you use.",
};

export default function LearnPage() {
  const concepts = getAllConcepts();

  return (
    <main className="min-h-screen bg-page">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Learn
          </p>
          <h1
            className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Understand the tools you use
          </h1>
          <p className="font-sans text-lg text-secondary max-w-xl leading-relaxed">
            No jargon for its own sake. No sales copy dressed up as explanation.
            Just honest accounts of how these things actually work.
          </p>
        </div>

        {/* Concept cards grid */}
        {concepts.length === 0 ? (
          <p className="font-sans text-sm text-muted">No concepts yet.</p>
        ) : (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}
          >
            {concepts.map((concept) => (
              <Link
                key={concept.slug}
                href={`/learn/${concept.slug}`}
                className="group block bg-panel border-l-[3px] border-accent rounded-lg p-6 hover:bg-raised transition-colors duration-200"
              >
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted mb-4">
                  Concept
                </p>
                <h2
                  className="font-sans text-2xl font-semibold text-primary mb-3 leading-tight group-hover:text-accent transition-colors duration-150"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {concept.title}
                </h2>
                <p className="font-serif italic text-base text-secondary leading-relaxed mb-5">
                  {concept.tagline}
                </p>
                <p className="font-mono text-sm text-muted">
                  {concept.readTime}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Map link */}
        <div className="mt-12">
          <Link
            href="/learn/map"
            className="font-sans text-sm text-secondary hover:text-accent transition-colors duration-150"
          >
            The landscape →
          </Link>
        </div>

      </div>
    </main>
  );
}
