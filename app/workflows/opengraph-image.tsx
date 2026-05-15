import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — AI Workflows";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "WORKFLOWS",
    eyebrow: "Tool combinations that work",
    title: "How the tools fit together",
    tagline: "Step-by-step pipelines, authored and tested. Six real workflows.",
    footerLeft: "AIGHT · WORKFLOWS",
    accent: "lime",
  });
}
