import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrack, getTracks } from "@/lib/curriculum";
import TrackRoadmap from "@/components/learn/TrackRoadmap";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getTracks().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) return { title: "Not Found" };
  return {
    title: `${track.title} — Learning Track`,
    description: track.description,
  };
}

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const tracks = getTracks();
  const idx = tracks.findIndex((t) => t.slug === slug);
  const nextTrack = tracks[idx + 1] ?? null;

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: track.title,
    description: track.description,
    provider: { "@type": "Organization", name: "AIght", url: SITE_URL },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${track.liveCount * 7}M`,
    },
    isAccessibleForFree: true,
  };

  return (
    <>
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
            href="/learn"
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
            ← All of Learn
          </Link>

          <header style={{ marginBottom: 48 }}>
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
              {track.eyebrow} · Learning track
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
              {track.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-editorial)",
                fontSize: 17,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                margin: "0 0 12px",
                maxWidth: "54ch",
              }}
            >
              {track.description}
            </p>
            <p
              style={{
                fontFamily: "var(--font-editorial)",
                fontStyle: "italic",
                fontSize: 14,
                color: "var(--text-muted)",
                margin: "0 0 16px",
                maxWidth: "54ch",
              }}
            >
              For: {track.audience}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              {track.nodes.length} stops · {track.liveCount} live
              {track.soonCount > 0 && ` · ${track.soonCount} coming`}
              {track.lessonCount > 0 && ` · ${track.lessonCount} interactive`}
            </p>
          </header>

          <TrackRoadmap track={track} />

          {nextTrack && (
            <div
              style={{
                marginTop: 64,
                paddingTop: 32,
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  margin: "0 0 8px",
                }}
              >
                Next track
              </p>
              <Link
                href={`/learn/tracks/${nextTrack.slug}`}
                className="hover:text-accent"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
              >
                {nextTrack.title} →
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
