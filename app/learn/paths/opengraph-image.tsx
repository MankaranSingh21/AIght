import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — AI in your field";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "FIELDS",
    eyebrow: "Field guides",
    title: "AI in your field",
    tagline: "From physicists to poets — the same models, different questions.",
    footerLeft: "AIGHT · 22 FIELDS",
    accent: "teal",
  });
}
