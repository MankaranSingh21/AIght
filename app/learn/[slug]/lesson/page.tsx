import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllConcepts } from "@/lib/learn";
import { getLessonSlugs, hasLesson, LESSON_META } from "@/lib/lessons";
import LessonLoader from "@/components/lessons/LessonLoader";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const concept = getAllConcepts().find((c) => c.slug === slug);
  if (!concept || !hasLesson(slug)) return { title: "Not Found" };
  return {
    title: `${concept.title} — Interactive Lesson`,
    description: `Learn ${concept.title} step by step: short visual explanations, a hands-on demo, and check questions. ${LESSON_META[slug].minutes} minutes.`,
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const concept = getAllConcepts().find((c) => c.slug === slug);
  if (!concept || !hasLesson(slug)) notFound();

  const meta = LESSON_META[slug];
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `${concept.title} — Interactive Lesson`,
    description: concept.tagline,
    educationalLevel: concept.difficulty ?? "beginner",
    timeRequired: `PT${meta.minutes}M`,
    learningResourceType: "interactive lesson",
    url: `${SITE_URL}/learn/${slug}/lesson`,
    isPartOf: { "@type": "WebSite", name: "AIght", url: SITE_URL },
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "var(--bg-base)",
        padding: "var(--space-16) clamp(20px, 5vw, 48px) var(--space-24)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: "var(--max-width-editorial)", margin: "0 auto" }}>
        <Link
          href={`/learn/${slug}`}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            color: "rgba(245,239,224,0.45)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 32,
          }}
          className="hover:text-primary"
        >
          ← {concept.title}: the essay
        </Link>

        <header style={{ marginBottom: 40 }}>
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
            ◈ Interactive lesson
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 18px",
            }}
          >
            {concept.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            {meta.steps} steps · ~{meta.minutes} min · keyboard: ← → and 1–4
          </p>
        </header>

        <LessonLoader slug={slug} />
      </div>
    </main>
  );
}
