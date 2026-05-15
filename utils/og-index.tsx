import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/utils/og-font";

const BG = "#0C0A08";
const LIME = "#AAFF4D";
const TEAL = "#00FFD1";
const AMBER = "#F4AB1F";
const TEXT = "#F5EFE0";
const MUTED = "rgba(245,239,224,0.40)";
const BORDER = "rgba(245,239,224,0.08)";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png" as const;

type Accent = "lime" | "teal" | "amber";

const ACCENT_HEX: Record<Accent, string> = {
  lime: LIME,
  teal: TEAL,
  amber: AMBER,
};

const ACCENT_GLOW: Record<Accent, string> = {
  lime: "rgba(170,255,77,0.07)",
  teal: "rgba(0,255,209,0.07)",
  amber: "rgba(244,171,31,0.07)",
};

export interface IndexOgOptions {
  sectionLabel: string;
  eyebrow: string;
  title: string;
  tagline: string;
  footerLeft: string;
  accent?: Accent;
}

export async function renderIndexOg(opts: IndexOgOptions): Promise<ImageResponse> {
  const accent = opts.accent ?? "lime";
  const accentColor = ACCENT_HEX[accent];
  const accentGlow = ACCENT_GLOW[accent];

  const titleSize =
    opts.title.length > 40 ? 60 :
    opts.title.length > 28 ? 76 :
    opts.title.length > 18 ? 88 : 100;

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
        <div style={{ width: "6px", height: "100%", backgroundColor: accentColor, flexShrink: 0 }} />

        {/* Ambient glow top-left */}
        <div
          style={{
            position: "absolute",
            top: "-140px",
            left: "60px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "56px 72px",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "auto",
            }}
          >
            {/* Logo */}
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: TEXT,
                letterSpacing: "-0.5px",
              }}
            >
              AI<span style={{ color: accentColor }}>ght</span>
              <span style={{ color: accentColor, marginLeft: "2px" }}>_</span>
            </span>

            {/* Section pill */}
            <div
              style={{
                display: "flex",
                backgroundColor: `${accentColor}1A`,
                border: `1.5px solid ${accentColor}40`,
                borderRadius: "100px",
                padding: "7px 22px",
              }}
            >
              <span
                style={{
                  color: accentColor,
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                }}
              >
                {opts.sectionLabel}
              </span>
            </div>
          </div>

          {/* Center content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              paddingTop: "44px",
              paddingBottom: "36px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {opts.eyebrow}
            </span>

            <div
              style={{
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: TEXT,
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                maxWidth: "960px",
              }}
            >
              {opts.title}
            </div>

            {opts.tagline && (
              <div
                style={{
                  fontSize: "22px",
                  color: MUTED,
                  maxWidth: "820px",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                {opts.tagline}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "20px",
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "13px",
                color: MUTED,
                letterSpacing: "0.08em",
              }}
            >
              {opts.footerLeft.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: "14px",
                color: accentColor,
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
      ...OG_SIZE,
      fonts: font
        ? [{ name: "Fraunces", data: font, style: "normal", weight: 700 }]
        : [],
    }
  );
}
