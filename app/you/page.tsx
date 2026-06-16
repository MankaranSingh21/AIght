import type { Metadata } from "next";
import YouClient from "./YouClient";
import Footer from "@/components/Footer";
import { getAllConcepts } from "@/lib/learn";
import { getLessonSlugs } from "@/lib/lessons";
import { getTracks } from "@/lib/curriculum";
import { getCheckCount, getAllCheckSlugs } from "@/lib/checks";

export const metadata: Metadata = {
  title: "Your progress",
  description:
    "Your journey through AIght — concepts read, lessons finished, knowledge checks passed, streak and badges. Lives on your device; no account required.",
  robots: { index: false, follow: true },
};

export default function YouPage() {
  const concepts = getAllConcepts();

  // Slug → title, so the client can label read concepts and the "continue"
  // card without re-reading the filesystem. Small payload, fully static.
  const conceptTitles: Record<string, string> = Object.fromEntries(
    concepts.map((c) => [c.slug, c.title])
  );

  // Per-track live concept slugs, so the client can compute "X / Y read".
  const tracks = getTracks().map((t) => ({
    slug: t.slug,
    title: t.title,
    eyebrow: t.eyebrow,
    conceptSlugs: t.nodes.filter((n) => !n.soon).map((n) => n.slug),
  }));

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <YouClient
          conceptTitles={conceptTitles}
          totalConcepts={concepts.length}
          lessonSlugs={getLessonSlugs()}
          totalChecks={getCheckCount()}
          checkSlugs={getAllCheckSlugs()}
          tracks={tracks}
        />
      </main>
      <Footer />
    </>
  );
}
