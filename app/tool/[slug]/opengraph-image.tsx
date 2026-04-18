import { ImageResponse } from "next/og";
import { createServiceClient } from "@/utils/supabase/service";
import { loadGoogleFont } from "@/utils/og-font";

export const runtime = "nodejs";
export const alt = "AIght — AI Tool Discovery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  parchment: "#F5EFE0",
  espresso:  "#2C1A0E",
  forest:    "#1C3A2E",
  moss:      "#3D8A2B",
  mossLight: "#8ABF76",
  amber:     "#F4AB1F",
  lavender:  "#9B72CF",
};

const ACCENT_STRIPE: Record<string, string> = {
  moss:     C.moss,
  amber:    C.amber,
  lavender: C.lavender,
};

const ACCENT_PILL_BG: Record<string, string> = {
  moss:     C.moss,
  amber:    "#F4AB1F22",
  lavender: "#9B72CF22",
};

const ACCENT_PILL_TEXT: Record<string, string> = {
  moss:     C.parchment,
  amber:    "#92600A",
  lavender: "#5B3F8A",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createServiceClient();
  const { data: tool } = await supabase
    .from("tools")
    .select("name, vibe_description, category, emoji, accent")
    .eq("slug", slug)
    .single();

  const name     = tool?.name     ?? "AI Tool";
  const tagline  = tool?.vibe_description ?? "";
  const category = tool?.category ?? "AI Tool";
  const emoji    = tool?.emoji    ?? "✨";
  const accent   = (tool?.accent as string) ?? "moss";

  const stripeColor  = ACCENT_STRIPE[accent]   ?? C.moss;
  const pillBg       = ACCENT_PILL_BG[accent]  ?? C.moss;
  const pillText     = ACCENT_PILL_TEXT[accent] ?? C.parchment;

  // Truncate tagline for the card
  const shortTagline =
    tagline.length > 90 ? tagline.slice(0, 87).trimEnd() + "…" : tagline;

  // Scale font based on name length
  const nameSize =
    name.length > 30 ? 62 :
    name.length > 20 ? 76 :
    name.length > 12 ? 90 : 104;

  const font = await loadGoogleFont("Playfair Display", 700);

  return new ImageResponse(
    (
      <div
        style={{
          display:         "flex",
          width:           "100%",
          height:          "100%",
          backgroundColor: C.parchment,
          fontFamily:      "Playfair Display, Georgia, serif",
        }}
      >
        {/* Left accent stripe — colored by tool accent */}
        <div
          style={{
            width:           "10px",
            height:          "100%",
            backgroundColor: stripeColor,
            flexShrink:      0,
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
          {/* ── Header ── */}
          <div
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
            }}
          >
            {/* AIght wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize:      "34px",
                  fontWeight:    700,
                  color:         C.espresso,
                  letterSpacing: "-0.5px",
                }}
              >
                AIght
              </span>
              <span style={{ color: C.moss, fontSize: "22px" }}>✦</span>
            </div>

            {/* Category pill */}
            <div
              style={{
                display:         "flex",
                backgroundColor: pillBg,
                borderRadius:    "100px",
                padding:         "8px 22px",
                border:          `1.5px solid ${stripeColor}55`,
              }}
            >
              <span
                style={{
                  color:         pillText,
                  fontSize:      "13px",
                  fontWeight:    700,
                  letterSpacing: "0.14em",
                }}
              >
                {category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* ── Center: emoji + tool name ── */}
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              flex:           1,
              justifyContent: "center",
              gap:            "16px",
            }}
          >
            {/* Emoji */}
            <div style={{ fontSize: "64px", lineHeight: 1 }}>{emoji}</div>

            {/* Tool name */}
            <div
              style={{
                fontSize:   `${nameSize}px`,
                fontWeight: 700,
                color:      C.espresso,
                lineHeight: 1.05,
                maxWidth:   "960px",
              }}
            >
              {name}
            </div>

            {/* Tagline */}
            {shortTagline && (
              <div
                style={{
                  fontSize:  "22px",
                  color:     C.forest,
                  opacity:   0.6,
                  maxWidth:  "800px",
                  lineHeight: 1.4,
                }}
              >
                {shortTagline}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              paddingTop:     "20px",
              borderTop:      `1px solid ${C.mossLight}55`,
            }}
          >
            <span
              style={{
                fontSize:      "13px",
                color:         C.forest,
                opacity:       0.45,
                letterSpacing: "0.12em",
              }}
            >
              DISCOVER ON AIGHT · AI TOOL DIRECTORY
            </span>
            <span
              style={{
                fontSize:   "14px",
                color:      C.moss,
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
        ? [{ name: "Playfair Display", data: font, style: "normal", weight: 700 }]
        : [],
    }
  );
}
