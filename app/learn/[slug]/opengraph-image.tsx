import { ImageResponse } from "next/og";
import { getAllConcepts } from "@/lib/learn";
import { loadGoogleFont } from "@/utils/og-font";

export const runtime = "nodejs";
export const alt = "AIght — Learn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG      = "#0C0A08";
const SURFACE = "#161210";
const LIME    = "#AAFF4D";
const TEXT    = "#F5EFE0";
const MUTED   = "rgba(245,239,224,0.40)";
const BORDER  = "rgba(245,239,224,0.08)";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const concepts = getAllConcepts();
  const concept  = concepts.find((c) => c.slug === slug);

  const title    = concept?.title    ?? "Learn";
  const tagline  = concept?.tagline  ?? "";
  const readTime = concept?.readTime ?? "";

  const shortTagline =
    tagline.length > 100 ? tagline.slice(0, 97).trimEnd() + "…" : tagline;

  const titleSize =
    title.length > 40 ? 52 :
    title.length > 28 ? 64 :
    title.length > 18 ? 76 : 88;

  const font = await loadGoogleFont("Fraunces", 700);

  return new ImageResponse(
    (
      <div
        style={{
          display:         "flex",
          width:           "100%",
          height:          "100%",
          backgroundColor: BG,
          fontFamily:      "Fraunces, Georgia, serif",
          position:        "relative",
        }}
      >
        {/* Left accent stripe */}
        <div
          style={{
            width:           "6px",
            height:          "100%",
            backgroundColor: LIME,
            flexShrink:      0,
          }}
        />

        {/* Ambient glow top-left */}
        <div
          style={{
            position:        "absolute",
            top:             "-120px",
            left:            "80px",
            width:           "480px",
            height:          "480px",
            borderRadius:    "50%",
            background:      "radial-gradient(circle, rgba(170,255,77,0.07) 0%, transparent 70%)",
            display:         "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            flex:          1,
            padding:       "52px 68px",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              marginBottom:   "auto",
            }}
          >
            {/* Logo */}
            <span
              style={{
                fontSize:      "28px",
                fontWeight:    700,
                color:         TEXT,
                letterSpacing: "-0.5px",
              }}
            >
              AI<span style={{ color: LIME }}>ght</span>
              <span style={{ color: LIME, marginLeft: "2px" }}>_</span>
            </span>

            {/* Section label */}
            <div
              style={{
                display:         "flex",
                backgroundColor: "rgba(170,255,77,0.10)",
                border:          `1.5px solid rgba(170,255,77,0.25)`,
                borderRadius:    "100px",
                padding:         "7px 20px",
              }}
            >
              <span
                style={{
                  color:         LIME,
                  fontSize:      "12px",
                  fontWeight:    700,
                  letterSpacing: "0.14em",
                }}
              >
                LEARN
              </span>
            </div>
          </div>

          {/* Center content */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           "20px",
              paddingTop:    "48px",
              paddingBottom: "40px",
            }}
          >
            {/* Concept label */}
            <span
              style={{
                fontFamily:    "monospace",
                fontSize:      "13px",
                fontWeight:    700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color:         MUTED,
              }}
            >
              Concept
            </span>

            {/* Title */}
            <div
              style={{
                fontSize:      `${titleSize}px`,
                fontWeight:    700,
                color:         TEXT,
                lineHeight:    1.05,
                letterSpacing: "-0.02em",
                maxWidth:      "960px",
              }}
            >
              {title}
            </div>

            {/* Tagline */}
            {shortTagline && (
              <div
                style={{
                  fontSize:   "22px",
                  color:      MUTED,
                  maxWidth:   "820px",
                  lineHeight: 1.5,
                  fontStyle:  "italic",
                }}
              >
                {shortTagline}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              paddingTop:     "20px",
              borderTop:      `1px solid ${BORDER}`,
            }}
          >
            <span
              style={{
                fontFamily:    "monospace",
                fontSize:      "13px",
                color:         MUTED,
                letterSpacing: "0.08em",
              }}
            >
              {readTime ? readTime.toUpperCase() : "AIGHT · AI LEARNING"}
            </span>
            <span
              style={{
                fontSize:   "14px",
                color:      LIME,
                fontWeight: 600,
              }}
            >
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
