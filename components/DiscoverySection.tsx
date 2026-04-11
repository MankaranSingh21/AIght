"use client";

import { useState } from "react";
import VibePills from "./VibePills";
import ToolCarousel from "./ToolCarousel";
import type { ToolCardProps } from "./ToolCard";

// Maps aesthetic pill ids → the DB category strings they represent.
// Comparison is normalised to uppercase so "AI Chat" and "AI CHAT" both match.
const VIBE_TO_CATEGORIES: Record<string, string[]> = {
  builders: ["DEV TOOLS", "CODE"],
  students: ["PRODUCTIVITY", "EDUCATION"],
  writers:  ["AI CHAT", "WRITING"],
  curious:  ["RESEARCH", "IMAGE GEN", "VIDEO GEN", "AUDIO", "OTHER"],
};

export default function DiscoverySection({ tools }: { tools: ToolCardProps[] }) {
  const [activeVibe, setActiveVibe] = useState("all");

  const filtered =
    activeVibe === "all"
      ? tools
      : tools.filter((t) => {
          const cats = VIBE_TO_CATEGORIES[activeVibe] ?? [];
          return cats.includes((t.category ?? "").toUpperCase());
        });

  return (
    <section className="pb-24">
      <div className="px-6 md:px-12 lg:px-20 mb-7">
        <VibePills active={activeVibe} onSelect={setActiveVibe} />
      </div>
      <ToolCarousel tools={filtered} />
    </section>
  );
}
