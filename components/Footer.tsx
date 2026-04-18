"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("That doesn't look like a real email.");
      return;
    }

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 600));
      setDone(true);
      setEmail("");
      toast.success("You're in the archive. ✦ We'll be in touch.");
    });
  }

  if (done) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-body text-sm text-moss-600 dark:text-moss-400 font-semibold"
      >
        ✦ You&apos;re in. See you in the archive.
      </motion.p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="
          flex-1 min-w-0 font-body text-sm text-espresso dark:text-parchment placeholder:text-forest/35 dark:placeholder:text-parchment/30
          bg-parchment dark:bg-charcoal-800 border border-moss-200 dark:border-charcoal-700 rounded-xl px-4 py-2.5
          focus:outline-none focus:border-moss-400 dark:focus:border-moss-600 focus:ring-1 focus:ring-moss-200 dark:focus:ring-moss-800
          transition-all duration-150
        "
      />
      <button
        type="submit"
        disabled={isPending}
        className="
          flex-shrink-0 font-body text-sm font-semibold
          px-5 py-2.5 rounded-xl
          bg-moss-500 text-parchment border border-moss-600
          hover:bg-moss-600 disabled:opacity-50
          transition-colors duration-150
        "
      >
        {isPending ? "…" : "Join"}
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-moss-200 dark:border-charcoal-700 bg-parchment/80 dark:bg-charcoal-900/80 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">

        {/* Social proof strip */}
        <div className="flex flex-wrap items-center gap-8 mb-10 pb-10 border-b border-moss-100 dark:border-charcoal-800">
          {[
            { stat: "52+",   label: "curated tools" },
            { stat: "100%",  label: "no sponsored rankings" },
            { stat: "∞",     label: "roadmaps — first is free" },
          ].map(({ stat, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-moss-600 dark:text-moss-400">{stat}</span>
              <span className="font-body text-sm text-forest/60 dark:text-parchment/50">{label}</span>
            </div>
          ))}
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand column */}
          <div className="space-y-3">
            <p className="font-serif text-xl font-bold text-espresso dark:text-parchment">AIght ✦</p>
            <p className="font-body text-sm text-forest/60 dark:text-parchment/50 leading-relaxed max-w-xs">
              The internet&apos;s cozy corner for AI tool discovery.
              Curated slowly, on purpose.
            </p>
            <p className="font-body text-xs text-forest/40 dark:text-parchment/30 italic">
              &ldquo;Built slowly, on purpose.&rdquo;
            </p>
          </div>

          {/* Navigation column */}
          <nav className="space-y-2">
            <p className="font-body text-xs uppercase tracking-widest text-forest/40 dark:text-parchment/30 mb-3">
              Navigate
            </p>
            {[
              { href: "/",         label: "Home" },
              { href: "/tools",    label: "Tool Directory" },
              { href: "/pricing",  label: "Pricing" },
              { href: "/roadmaps", label: "My Canvases" },
              { href: "/privacy",  label: "Privacy Policy" },
              { href: "/terms",    label: "Terms of Service" },
            ].map(({ href, label }) => (
              <div key={href}>
                <Link
                  href={href}
                  className="font-body text-sm text-forest/60 dark:text-parchment/50 hover:text-forest dark:hover:text-parchment transition-colors duration-150"
                >
                  {label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Newsletter column */}
          <div className="space-y-3">
            <p className="font-body text-xs uppercase tracking-widest text-forest/40 dark:text-parchment/30 mb-3">
              Stay in the loop
            </p>
            <p className="font-body text-sm text-forest/70 dark:text-parchment/50 leading-relaxed">
              New tools, new stacks, and the occasional note from the archive.
              No spam — ever.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-moss-100 dark:border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-forest/40 dark:text-parchment/30">
            © {new Date().getFullYear()} AIght. Built with 🌿 by{" "}
            <a
              href="mailto:singhmankaran05@gmail.com"
              className="hover:text-forest dark:hover:text-parchment transition-colors duration-150"
            >
              Mankaran Singh
            </a>
          </p>
          <p className="font-body text-xs text-forest/30 dark:text-parchment/20 italic">
            Built slowly, on purpose. ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
