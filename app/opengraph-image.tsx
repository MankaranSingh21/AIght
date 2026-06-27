import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — the signal beneath the noise";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "AIGHT",
    eyebrow: "AI tools, understood",
    title: "The signal beneath the noise",
    tagline:
      "A ruthlessly curated AI tool directory. No hype, no sponsored rankings — just honest signal.",
    footerLeft: "AIGHT · CURATED AI",
    accent: "lime",
  });
}
