import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";
import Footer from "@/components/Footer";
import { getAllConcepts } from "@/lib/learn";
import { getAllCheckSlugs, getChecks, type ConceptCheckQuestion } from "@/lib/checks";

export const metadata: Metadata = {
  title: "Review",
  description:
    "Spaced review of what you've learned on AIght. A few questions resurface on a schedule so the ideas actually stick. Lives on your device; no account.",
  robots: { index: false, follow: true },
};

export default function ReviewPage() {
  const slugs = getAllCheckSlugs();

  // The whole (small) question bank goes to the client, which intersects it
  // with localStorage to decide what's actually due. Server can't see progress.
  const bank: Record<string, ConceptCheckQuestion[]> = Object.fromEntries(
    slugs.map((s) => [s, getChecks(s) ?? []])
  );
  const titles: Record<string, string> = Object.fromEntries(
    getAllConcepts().map((c) => [c.slug, c.title])
  );

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <ReviewClient bank={bank} titles={titles} />
      </main>
      <Footer />
    </>
  );
}
