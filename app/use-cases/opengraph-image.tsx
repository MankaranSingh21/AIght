import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — AI Tools by Use Case";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "USE CASES",
    eyebrow: "Jobs to be done",
    title: "What you're actually trying to do",
    tagline: "Browse AI tools by the real work — not by category. Twelve jobs, curated picks for each.",
    footerLeft: "AIGHT · USE CASES",
    accent: "teal",
  });
}
