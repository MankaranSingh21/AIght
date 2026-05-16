import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — What AI Cannot Do";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "WHAT AI CANNOT DO",
    eyebrow: "The work that doesn't compress",
    title: "What only the human can do.",
    tagline: "Taste, care, originality, context — the strengths AI tools quietly need us to keep.",
    footerLeft: "AIGHT · HUMAN",
    accent: "amber",
  });
}
