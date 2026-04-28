import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/utils/og-font";
import fields from "@/content/paths/fields.json";

export const runtime = "nodejs";
export const alt = "AIght — AI in Your Field";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG    = "#0C0A08";
const LIME  = "#AAFF4D";
const TEAL  = "#00FFD1";
const AMBER = "#F4AB1F";
const RED   = "#E07070";
const TEXT  = "#F5EFE0";
const MUTED = "rgba(245,239,224,0.40)";
const BORD  = "rgba(245,239,224,0.08)";

function difficultyColor(d: string) {
  if (d === "Easy")   return LIME;
  if (d === "Medium") return AMBER;
  return RED;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const field = fields.find((f) => f.slug === slug);

  const name       = field?.field      ?? "Field Guide";
  const tagline    = field?.tagline    ?? "";
  const difficulty = field?.difficulty ?? "Medium";

  const shortTagline =
    tagline.length > 110 ? tagline.slice(0, 107).trimEnd() + "…" : tagline;

  const nameSize =
    name.length > 38 ? 52 :
    name.length > 26 ? 66 :
    name.length > 16 ? 80 : 92;

  const diffColor = difficultyColor(difficulty);
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
        {/* Left accent stripe — teal for paths (differs from lime on concepts) */}
        <div
          style={{
            width:           "6px",
            height:          "100%",
            backgroundColor: TEAL,
            flexShrink:      0,
          }}
        />

        {/* Ambient glow */}
        <div
          style={{
            position:     "absolute",
            top:          "-80px",
            right:        "100px",
            width:        "400px",
            height:       "400px",
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(0,255,209,0.06) 0%, transparent 70%)",
            display:      "flex",
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
          {/* Header */}
          <div
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              marginBottom:   "auto",
            }}
          >
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

            <div
              style={{
                display:         "flex",
                backgroundColor: "rgba(0,255,209,0.08)",
                border:          "1.5px solid rgba(0,255,209,0.22)",
                borderRadius:    "100px",
                padding:         "7px 20px",
              }}
            >
              <span
                style={{
                  color:         TEAL,
                  fontSize:      "12px",
                  fontWeight:    700,
                  letterSpacing: "0.14em",
                }}
              >
                FIELD GUIDE
              </span>
            </div>
          </div>

          {/* Center */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           "20px",
              paddingTop:    "40px",
              paddingBottom: "32px",
            }}
          >
            {/* Difficulty badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width:           "8px",
                  height:          "8px",
                  borderRadius:    "50%",
                  backgroundColor: diffColor,
                  display:         "flex",
                }}
              />
              <span
                style={{
                  fontFamily:    "monospace",
                  fontSize:      "12px",
                  fontWeight:    700,
                  letterSpacing: "0.14em",
                  color:         diffColor,
                }}
              >
                {difficulty.toUpperCase()} IMPACT
              </span>
            </div>

            {/* Field name */}
            <div
              style={{
                fontSize:      `${nameSize}px`,
                fontWeight:    700,
                color:         TEXT,
                lineHeight:    1.05,
                letterSpacing: "-0.02em",
                maxWidth:      "960px",
              }}
            >
              {name}
            </div>

            {/* Tagline */}
            {shortTagline && (
              <div
                style={{
                  fontSize:   "20px",
                  color:      MUTED,
                  maxWidth:   "840px",
                  lineHeight: 1.55,
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
              borderTop:      `1px solid ${BORD}`,
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
              AI IN YOUR FIELD · AIGHT
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
