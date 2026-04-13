"use client";

import { motion } from "framer-motion";

export const VIBES = [
  { id: "all",      label: "all tools",         emoji: "✦" },
  { id: "builders", label: "for builders",       emoji: "🔨" },
  { id: "students", label: "for broke students", emoji: "📚" },
  { id: "writers",  label: "for writers",        emoji: "✍️" },
  { id: "curious",  label: "for the curious",    emoji: "🔭" },
];

type Props = {
  active: string;
  onSelect: (id: string) => void;
};

export default function VibePills({ active, onSelect }: Props) {
  return (
    <div className="flex gap-2.5 overflow-x-auto py-2 scrollbar-hide">
      {VIBES.map((vibe, i) => {
        const isActive = active === vibe.id;
        return (
          <motion.button
            key={vibe.id}
            onClick={() => onSelect(vibe.id)}
            className={`
              relative overflow-hidden flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full
              font-body text-sm font-medium border transition-colors duration-200 select-none
              ${isActive
                ? "text-parchment border-espresso"
                : "bg-moss-100 text-forest border-moss-200 hover:bg-moss-200 hover:border-moss-400"
              }
            `}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 240, damping: 24 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {isActive && (
              <motion.span
                layoutId="vibe-active-bg"
                className="absolute inset-0 rounded-full bg-espresso"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative z-10">{vibe.emoji}</span>
            <span className="relative z-10">{vibe.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
