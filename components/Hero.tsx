"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-20 pb-20">
      {/* Ambient blobs — felt, not seen */}
      <div className="absolute top-0 left-1/4 w-[480px] h-[480px] bg-moss-200/25 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-24 right-1/4 w-[320px] h-[320px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-[360px] h-[360px] bg-lavender-200/15 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-5"
        >
          your cozy corner of the internet ✦
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-espresso leading-[1.08] mb-7 text-balance"
        >
          Yeah, AI is kind of{" "}
          <span className="italic text-moss-600">everywhere</span>.{" "}
          <br className="hidden md:block" />
          We found the ones that{" "}
          <span className="relative inline-block">
            actually slap.
            <motion.span
              className="absolute -bottom-1 left-0 h-[3px] w-full bg-amber-400 rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.85, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="font-body text-lg md:text-xl text-forest/75 max-w-2xl mx-auto mb-11 leading-relaxed text-balance"
        >
          Discover tools worth your time, learn what they&rsquo;re actually
          good for, and build your personal AI toolkit — no hustle required.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.a
            href="#trending-tools"
            className="font-body font-semibold tracking-wide text-lg px-8 py-4 rounded-3xl bg-moss-500 text-parchment border border-moss-600 hover:bg-moss-600 shadow-moss transition-colors duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            Explore Tools
          </motion.a>
          <motion.a
            href="#about"
            className="font-body font-semibold tracking-wide text-lg px-8 py-4 rounded-3xl bg-transparent text-forest border border-forest/30 hover:bg-forest/8 transition-colors duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            What even is this?
          </motion.a>
        </motion.div>

        {/* Soft divider hint */}
        <motion.div
          variants={item}
          className="mt-16 flex items-center justify-center gap-3 text-forest/30"
        >
          <div className="h-px w-12 bg-current" />
          <span className="font-body text-xs tracking-widest uppercase">
            trending tools
          </span>
          <div className="h-px w-12 bg-current" />
        </motion.div>
      </motion.div>
    </section>
  );
}
