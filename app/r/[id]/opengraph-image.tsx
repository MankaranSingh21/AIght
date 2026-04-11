import { ImageResponse } from "next/og";
import { createServiceClient } from "@/utils/supabase/service";
import { loadGoogleFont } from "@/utils/og-font";

export const runtime = "nodejs";
export const alt = "AIght — Shared AI Tool Canvas";
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
};

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("roadmaps")
    .select("title, is_public, nodes_json")
    .eq("id", id)
    .single();

  // Gracefully degrade if roadmap is private or missing
  const title     = data?.is_public && data.title ? data.title : "A Curated Pipeline";
  const nodeCount = Array.isArray(data?.nodes_json) ? data.nodes_json.length : 0;

  const font = await loadGoogleFont("Playfair Display", 700);

  // Dynamically scale font size so long titles never overflow
  const titleSize =
    title.length > 50 ? 52 :
    title.length > 35 ? 64 :
    title.length > 20 ? 76 : 88;

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
        {/* Left moss accent stripe */}
        <div
          style={{
            width:           "10px",
            height:          "100%",
            backgroundColor: C.moss,
            flexShrink:      0,
          }}
        />

        {/* Main content column */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            flex:           1,
            padding:        "52px 68px",
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
            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize:    "34px",
                  fontWeight:  700,
                  color:       C.espresso,
                  letterSpacing: "-0.5px",
                }}
              >
                AIght
              </span>
              <span style={{ color: C.moss, fontSize: "22px" }}>✦</span>
            </div>

            {/* "Shared Canvas" pill */}
            <div
              style={{
                display:         "flex",
                backgroundColor: C.moss,
                borderRadius:    "100px",
                padding:         "8px 22px",
              }}
            >
              <span
                style={{
                  color:       C.parchment,
                  fontSize:    "13px",
                  fontWeight:  600,
                  letterSpacing: "0.14em",
                }}
              >
                SHARED CANVAS
              </span>
            </div>
          </div>

          {/* ── Center title block ── */}
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              flex:           1,
              justifyContent: "center",
              gap:            "22px",
            }}
          >
            {/* Amber rule */}
            <div
              style={{
                width:           "64px",
                height:          "4px",
                backgroundColor: C.amber,
                borderRadius:    "100px",
              }}
            />

            {/* Roadmap title */}
            <div
              style={{
                fontSize:    `${titleSize}px`,
                fontWeight:  700,
                color:       C.espresso,
                lineHeight:  1.1,
                maxWidth:    "960px",
              }}
            >
              {title}
            </div>

            {/* Tool count sub-label */}
            {nodeCount > 0 && (
              <div
                style={{
                  fontSize: "22px",
                  color:    C.forest,
                  opacity:  0.55,
                }}
              >
                {nodeCount} tool{nodeCount !== 1 ? "s" : ""} · Step by step
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
                fontSize:    "13px",
                color:       C.forest,
                opacity:     0.45,
                letterSpacing: "0.12em",
              }}
            >
              AIGHT PLATFORM · CURATED PIPELINE
            </span>
            <span
              style={{
                fontSize:   "14px",
                color:      C.moss,
                fontWeight: 600,
              }}
            >
              aight.app
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
