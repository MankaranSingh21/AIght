import type { Metadata } from "next";
import ConceptMap from "./ConceptMap";

export const metadata: Metadata = {
  title: "The landscape — AIght",
  description: "Six concepts. Two tracks. Everything connects.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen bg-page">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <h1
            className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            The landscape
          </h1>
          <p className="font-serif italic text-lg text-secondary leading-relaxed">
            Six concepts. Two tracks. Everything connects.
          </p>
        </div>

        {/* Interactive concept map */}
        <ConceptMap />

        {/* Footer note */}
        <p
          className="font-mono text-xs text-muted text-center mt-16"
          style={{ letterSpacing: "0.04em" }}
        >
          More concepts coming — slowly, on purpose.
        </p>

      </div>
    </main>
  );
}
