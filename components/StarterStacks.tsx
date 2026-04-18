"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { injectStackToRoadmap } from "@/app/actions/roadmap";
import RoadmapPicker from "./RoadmapPicker";

type Stack = {
  id: "indie" | "research";
  title: string;
  subtitle: string;
  description: string;
  steps: { initials: string; label: string }[];
  accent: {
    bg: string;
    border: string;
    badge: string;
    badgeText: string;
    btn: string;
    btnText: string;
    stepLine: string;
  };
};

const STACKS: Stack[] = [
  {
    id: "indie",
    title: "The Indie Hacker Stack",
    subtitle: "Frontend to Backend",
    description:
      "Go from blank canvas to shipped product. This is the pipeline that solo builders use to move at startup speed without a team.",
    steps: [
      { initials: "BN", label: "Bolt.new" },
      { initials: "CR", label: "Cursor" },
      { initials: "CL", label: "Claude" },
    ],
    accent: {
      bg:       "bg-gradient-to-br from-amber-50 to-parchment",
      border:   "border-amber-200",
      badge:    "bg-amber-400 text-espresso",
      badgeText:"bg-amber-400",
      btn:      "bg-amber-400 hover:bg-amber-500 text-espresso",
      btnText:  "text-espresso",
      stepLine: "bg-amber-300",
    },
  },
  {
    id: "research",
    title: "The Deep Research Stack",
    subtitle: "Discovery to Synthesis",
    description:
      "Go from a vague question to a nuanced answer. The pipeline serious researchers use to cut through noise and build real understanding.",
    steps: [
      { initials: "PX", label: "Perplexity" },
      { initials: "CL", label: "Claude" },
      { initials: "NB", label: "NotebookLM" },
    ],
    accent: {
      bg:       "bg-gradient-to-br from-lavender-50 to-parchment",
      border:   "border-lavender-200",
      badge:    "bg-lavender-400 text-parchment",
      badgeText:"bg-lavender-400",
      btn:      "bg-lavender-400 hover:bg-lavender-500 text-parchment",
      btnText:  "text-parchment",
      stepLine: "bg-lavender-300",
    },
  },
];

function StackCard({ stack }: { stack: Stack }) {
  const [isPending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen]  = useState(false);
  const router = useRouter();
  const a = stack.accent;

  return (
    <motion.div
      className={`
        relative flex flex-col rounded-4xl border ${a.border} ${a.bg}
        shadow-card overflow-hidden
      `}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 260, damping: 22 },
      }}
    >
      <RoadmapPicker
        open={pickerOpen}
        isPending={isPending}
        onClose={() => setPickerOpen(false)}
        onSelect={(roadmapId) => {
          startTransition(async () => {
            const result = await injectStackToRoadmap(stack.id, roadmapId);
            if (result?.error) {
              toast.error("Stack injection failed", { description: result.error });
            } else {
              setPickerOpen(false);
              toast.success(`${stack.title} added to your roadmap.`);
              router.push(`/roadmaps/${roadmapId}`);
            }
          });
        }}
      />
      {/* Header */}
      <div className="px-7 pt-7 pb-5 space-y-3">
        <span className={`inline-block text-2xs font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${a.badge}`}>
          {stack.subtitle}
        </span>
        <h3 className="font-serif text-2xl font-bold text-espresso leading-snug">
          {stack.title}
        </h3>
        <p className="font-body text-sm text-forest/70 leading-relaxed">
          {stack.description}
        </p>
      </div>

      {/* Step pipeline */}
      <div className="px-7 py-5 flex items-center gap-0">
        {stack.steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-11 h-11 rounded-2xl bg-parchment border border-moss-100 shadow-card flex items-center justify-center">
                <span className="font-body text-xs font-bold text-espresso tracking-tight">{step.initials}</span>
              </div>
              <span className="font-body text-2xs text-forest/60 font-medium whitespace-nowrap">
                {step.label}
              </span>
            </div>
            {i < stack.steps.length - 1 && (
              <div className={`w-8 h-px ${a.stepLine} mx-1 mb-4 flex-shrink-0`} />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-7 pb-7 pt-2 mt-auto">
        <motion.button
          onClick={() => setPickerOpen(true)}
          disabled={isPending}
          className={`
            w-full font-body font-semibold text-sm py-3 rounded-2xl
            transition-colors duration-150 disabled:opacity-60
            ${a.btn}
          `}
          whileTap={{ scale: 0.97 }}
        >
          {isPending ? "Building your roadmap…" : "Build this Stack →"}

        </motion.button>
      </div>
    </motion.div>
  );
}

export default function StarterStacks() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-14">
      {/* Section header */}
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-2">
          skip the blank canvas
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso">
          Curated Starter Stacks
        </h2>
        <p className="font-body text-sm text-forest/60 mt-1.5 max-w-lg">
          One click injects a pre-wired pipeline straight into your roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STACKS.map((stack) => (
          <StackCard key={stack.id} stack={stack} />
        ))}
      </div>
    </section>
  );
}
