import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { loadGoogleFont } from "@/utils/og-font";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dynamic OG image for `/compare?a=<slug>&b=<slug>`.
 *
 * Next.js `opengraph-image.tsx` files don't receive searchParams, so
 * query-param-driven OG has to be a route handler. The `/compare` page's
 * `generateMetadata` points `openGraph.images` at this URL with the same
 * `?a=&b=` params.
 *
 * Renders: two tool names overlaid on the dark brand surface, each with
 * its AIght score and category. The radar shape isn't drawn — keeps the
 * image legible in a Twitter/Slack preview at small sizes.
 *
 * Falls back to the static brand card if either tool is missing.
 */

const SIZE = { width: 1200, height: 630 };
const BG = "#0C0A08";
const LIME = "#AAFF4D";
const TEAL = "#00FFD1";
const TEXT = "#F5EFE0";
const MUTED = "rgba(245,239,224,0.50)";
const BORDER = "rgba(245,239,224,0.10)";

function avgScore(t: {
  utility_score: number; privacy_score: number; speed_score: number;
  cost_score: number; transparency_score: number;
}): number {
  return Math.round(
    (t.utility_score + t.privacy_score + t.speed_score + t.cost_score + t.transparency_score) / 5,
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const a = url.searchParams.get("a");
  const b = url.searchParams.get("b");

  const font = await loadGoogleFont("Fraunces", 700);
  const fonts = font ? [{ name: "Fraunces", data: font, weight: 700 as const, style: "normal" as const }] : undefined;

  // No params → brand card (also serves as the fallback when params are bad).
  if (!a || !b) {
    return brandCard(fonts);
  }

  const supabase = createServiceClient();
  const { data: tools } = await supabase
    .from("tools")
    .select("slug, name, category, utility_score, privacy_score, speed_score, cost_score, transparency_score")
    .in("slug", [a, b]);

  const toolA = tools?.find((t) => t.slug === a);
  const toolB = tools?.find((t) => t.slug === b);
  if (!toolA || !toolB) {
    return brandCard(fonts);
  }

  const scoreA = avgScore(toolA);
  const scoreB = avgScore(toolB);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: BG,
          display: "flex",
          flexDirection: "column",
          padding: 64,
          position: "relative",
          fontFamily: "Fraunces",
        }}
      >
        {/* Top strip: logo + eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "monospace",
        }}>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: "-0.04em" }}>
            <span style={{ color: TEXT }}>AI</span>
            <span style={{ color: LIME }}>ght</span>
            <span style={{ color: LIME }}>_</span>
          </div>
          <div style={{ fontSize: 18, color: LIME, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Compare
          </div>
        </div>

        {/* VS layout */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 48, marginTop: 48,
        }}>
          {/* A */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, borderTop: `4px solid ${LIME}`, paddingTop: 28 }}>
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 16, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              A · {toolA.category ?? "AI Tool"}
            </div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: LIME, letterSpacing: "-0.03em", lineHeight: 1, wordBreak: "break-word" }}>
              {toolA.name}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 12 }}>
              <span style={{ display: "flex", fontSize: 64, fontWeight: 700, color: TEXT, lineHeight: 1 }}>{scoreA}</span>
              <span style={{ display: "flex", fontFamily: "monospace", fontSize: 14, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>AIght score</span>
            </div>
          </div>

          {/* VS divider */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 8, fontFamily: "monospace",
          }}>
            <div style={{ display: "flex", fontSize: 28, color: MUTED, letterSpacing: "0.14em" }}>vs</div>
            <div style={{ width: 1, height: 200, background: BORDER }} />
          </div>

          {/* B */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, borderTop: `4px solid ${TEAL}`, paddingTop: 28, alignItems: "flex-end", textAlign: "right" }}>
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 16, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {toolB.category ?? "AI Tool"} · B
            </div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: TEAL, letterSpacing: "-0.03em", lineHeight: 1, wordBreak: "break-word", justifyContent: "flex-end" }}>
              {toolB.name}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 12 }}>
              <span style={{ display: "flex", fontFamily: "monospace", fontSize: 14, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>AIght score</span>
              <span style={{ display: "flex", fontSize: 64, fontWeight: 700, color: TEXT, lineHeight: 1 }}>{scoreB}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "monospace", fontSize: 16, color: MUTED,
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginTop: 32, paddingTop: 24, borderTop: `1px solid ${BORDER}`,
        }}>
          <span style={{ display: "flex" }}>Five-axis score · pricing · the take</span>
          <span style={{ display: "flex" }}>aightai.in / compare</span>
        </div>
      </div>
    ),
    { ...SIZE, fonts },
  );
}

// Static fallback rendered when params are missing or one tool isn't in DB.
// `fonts` is typed `any[] | undefined` because next/og's ImageResponse fonts
// shape isn't exported as a public type and we don't want to drift from it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function brandCard(fonts: any[] | undefined) {
  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630, background: BG,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 80, position: "relative",
        fontFamily: "Fraunces",
      }}>
        <div style={{
          position: "absolute", top: 56, left: 80,
          display: "flex", fontFamily: "monospace", fontSize: 28, letterSpacing: "-0.04em",
        }}>
          <span style={{ color: TEXT }}>AI</span>
          <span style={{ color: LIME }}>ght</span>
          <span style={{ color: LIME }}>_</span>
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: 22, color: LIME,
          letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 28,
        }}>
          Compare
        </div>
        <div style={{
          fontSize: 92, fontWeight: 700, color: TEXT, letterSpacing: "-0.03em",
          lineHeight: 1, marginBottom: 28, textAlign: "center", display: "flex",
          flexDirection: "column",
        }}>
          <span>Two tools,</span>
          <span style={{ color: LIME }}>side by side.</span>
        </div>
        <div style={{
          fontSize: 28, fontStyle: "italic", color: MUTED,
          textAlign: "center", maxWidth: 880, lineHeight: 1.4,
        }}>
          Five-axis score · pricing · the take I actually wrote.
        </div>
      </div>
    ),
    { ...SIZE, fonts },
  );
}
