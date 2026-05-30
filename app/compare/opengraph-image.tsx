import { renderIndexOg, OG_SIZE, OG_CONTENT_TYPE } from "@/utils/og-index";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Compare AI tools side-by-side — AIght";

export default async function CompareOG() {
  return renderIndexOg({
    sectionLabel: "Compare",
    eyebrow: "AIght",
    title: "Two tools, side by side.",
    tagline: "Five-axis score · pricing · the take I actually wrote.",
    footerLeft: "aightai.in / compare",
    accent: "lime",
  });
}
