"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

// ── Animation variants ─────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
};

// ── Component ──────────────────────────────────────────────────────────────

export default function LoginForm() {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-moss-200/25 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-56 h-56 bg-lavender-200/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Wordmark */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <span className="font-display text-4xl font-bold text-espresso">AIght</span>
          <p className="font-body text-2xs uppercase tracking-[0.2em] text-moss-500 mt-1">
            ✦ your cozy corner for AI tools
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={fadeUp}
          className="bg-parchment border border-moss-200 rounded-4xl shadow-card-hover p-8"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="text-center space-y-4 py-4"
              >
                <motion.div
                  animate={{ rotate: [0, -8, 8, -4, 0] }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeInOut" }}
                  className="text-5xl leading-none select-none"
                  aria-hidden
                >
                  📬
                </motion.div>

                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-bold text-espresso">
                    Check your inbox!
                  </h2>
                  <p className="font-body text-sm text-forest/70 leading-relaxed">
                    We sent a magic link to{" "}
                    <span className="font-semibold text-espresso">{email}</span>.
                    <br />
                    Click it to sign in — no password needed.
                  </p>
                </div>

                <div className="pt-2 border-t border-moss-100">
                  <p className="font-body text-xs text-forest/40">
                    Wrong address?{" "}
                    <button
                      onClick={() => { setSent(false); setEmail(""); }}
                      className="text-moss-600 hover:text-moss-800 underline underline-offset-2 transition-colors duration-150"
                    >
                      Start over
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h1 className="font-serif text-3xl font-bold text-espresso leading-snug">
                    Hey, welcome back.
                  </h1>
                  <p className="font-body text-sm text-forest/70 leading-relaxed">
                    Drop your email and we&rsquo;ll send you a magic link. No
                    passwords, no friction.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <label className="block space-y-1.5">
                    <span className="font-body text-xs uppercase tracking-widest text-forest/60 font-semibold">
                      Email address
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      autoFocus
                      className="
                        w-full bg-moss-50 border border-moss-200 rounded-xl
                        px-4 py-3 font-body text-sm text-espresso
                        placeholder:text-forest/35
                        focus:outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20
                        transition-colors duration-150
                      "
                    />
                  </label>

                  <motion.button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="
                      w-full flex items-center justify-center gap-2
                      bg-moss-500 text-parchment border border-moss-600
                      font-body text-sm font-semibold
                      py-3 px-5 rounded-2xl shadow-moss
                      hover:bg-moss-600 transition-colors duration-150
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-parchment/40 border-t-parchment rounded-full animate-spin" />
                    ) : (
                      <>
                        <span aria-hidden>✉</span>
                        Send Magic Link
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Error */}
                {error && (
                  <p className="font-body text-xs text-red-600 text-center bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    {error}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={fadeUp}
          className="text-center font-body text-xs text-forest/40 mt-6 leading-relaxed"
        >
          No passwords. No dark patterns. Just good tools.
        </motion.p>
      </motion.div>
    </div>
  );
}
