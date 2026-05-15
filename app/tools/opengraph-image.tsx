import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — The Full Archive of AI Tools";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "DIRECTORY",
    eyebrow: "Every tool worth your time",
    title: "The Full Archive",
    tagline: "60+ AI tools, ruthlessly curated. No sponsored rankings, no hustle energy.",
    footerLeft: "AIGHT · TOOLS",
    accent: "lime",
  });
}
