"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import ToolCard, { type ToolCardProps } from "./ToolCard";

const carouselVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const cardSlide: Variants = {
  hidden: { x: 32, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 210, damping: 28 },
  },
};

export default function ToolCarousel({ tools }: { tools: ToolCardProps[] }) {
  if (tools.length === 0) {
    return (
      <div className="px-6 md:px-12 lg:px-20 py-12 text-center">
        <p className="font-body text-sm text-forest/50">
          No tools yet — the shelves are being stocked.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 md:px-12 lg:px-20 flex items-baseline justify-between mb-7">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso">
          Tools making waves right now
        </h2>
        <Link
          href="/tools"
          className="font-body text-sm text-moss-500 hover:text-moss-700 underline underline-offset-4 transition-colors duration-150"
        >
          See all →
        </Link>
      </div>

      <motion.div
        className="flex gap-5 overflow-x-auto pt-4 pb-8 px-6 md:px-12 lg:px-20 snap-x snap-mandatory scrollbar-hide"
        variants={carouselVariants}
        initial="hidden"
        animate="show"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {tools.map((tool) => (
          <motion.div
            key={tool.name}
            variants={cardSlide}
            className="flex-shrink-0 w-[272px] snap-start"
          >
            <Link href={`/tool/${tool.slug}`} className="block">
              <ToolCard {...tool} />
            </Link>
          </motion.div>
        ))}
        <div className="flex-shrink-0 w-6 md:w-12 lg:w-20" aria-hidden />
      </motion.div>
    </div>
  );
}
