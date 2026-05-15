import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const runtime = "nodejs";
export const alt = "AIght — Learn the concepts behind the tools";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderIndexOg({
    sectionLabel: "LEARN",
    eyebrow: "Concepts",
    title: "The mental models behind the buttons",
    tagline: "Short essays, pause-worthy diagrams. The ideas that make AI tools make sense.",
    footerLeft: "AIGHT · LEARN",
    accent: "lime",
  });
}
