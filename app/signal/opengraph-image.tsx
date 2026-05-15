import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — Signal, editorial on AI tools";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "SIGNAL",
    eyebrow: "From the archive",
    title: "Honest writing about AI tools",
    tagline: "No hype. No sponsored takes. For people who'd rather subscribe than scroll.",
    footerLeft: "AIGHT · SIGNAL",
    accent: "amber",
  });
}
