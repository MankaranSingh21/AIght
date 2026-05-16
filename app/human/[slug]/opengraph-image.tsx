import { ImageResponse } from "next/og";
import { getAllHumanEssays } from "@/lib/human";
import { loadGoogleFont } from "@/utils/og-font";

export const runtime = "nodejs";
export const alt = "AIght — What AI Cannot Do";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG     = "#0C0A08";
const AMBER  = "#F4AB1F";
const TEXT   = "#F5EFE0";
const MUTED  = "rgba(245,239,224,0.40)";
const BORDER = "rgba(245,239,224,0.08)";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essays = getAllHumanEssays();
  const essay = essays.find((e) => e.slug === slug);

  const title = essay?.title ?? "What AI Cannot Do";
  const tagline = essay?.tagline ?? "";
  const readTime = essay?.readTime ?? "";

  const shortTagline =
    tagline.length > 110 ? tagline.slice(0, 107).trimEnd() + "…" : tagline;

  const titleSize =
    title.length > 30 ? 80 :
    title.length > 18 ? 96 : 116;

  const font = await loadGoogleFont("Fraunces", 700);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: BG,
          fontFamily: "Fraunces, Georgia, serif",
          position: "relative",
        }}
      >
        {/* Left accent stripe */}
        <div style={{ width: "6px", height: "100%", backgroundColor: AMBER, flexShrink: 0 }} />

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "-140px",
            left: "60px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,171,31,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 72px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "auto" }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: TEXT, letterSpacing: "-0.5px" }}>
              AI<span style={{ color: AMBER }}>ght</span>
              <span style={{ color: AMBER, marginLeft: 2 }}>_</span>
            </span>
            <div
              style={{
                display: "flex",
                backgroundColor: "rgba(244,171,31,0.10)",
                border: "1.5px solid rgba(244,171,31,0.28)",
                borderRadius: 100,
                padding: "7px 22px",
              }}
            >
              <span style={{ color: AMBER, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em" }}>
                WHAT AI CANNOT DO
              </span>
            </div>
          </div>

          {/* Center content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingTop: 44, paddingBottom: 36 }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Essay
            </span>
            <div
              style={{
                fontSize: titleSize,
                fontWeight: 700,
                color: TEXT,
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                maxWidth: 980,
              }}
            >
              {title}
            </div>
            {shortTagline && (
              <div
                style={{
                  fontSize: 22,
                  color: MUTED,
                  maxWidth: 820,
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                {shortTagline}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: MUTED, letterSpacing: "0.08em" }}>
              {readTime ? readTime.toUpperCase() : "AIGHT · HUMAN"}
            </span>
            <span style={{ fontSize: 14, color: AMBER, fontWeight: 600 }}>
              aightai.in
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Fraunces", data: font, style: "normal", weight: 700 }]
        : [],
    }
  );
}
