"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ── Newsletter form ─────────────────────────────────────────────────────────

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
      // Wire to your email provider (Mailchimp, Loops, ConvertKit) here.
      // For now: optimistic confirmation.
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
        className="font-body text-sm text-moss-600 font-semibold"
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
          flex-1 min-w-0 font-body text-sm text-espresso placeholder:text-forest/35
          bg-parchment border border-moss-200 rounded-xl px-4 py-2.5
          focus:outline-none focus:border-moss-400 focus:ring-1 focus:ring-moss-200
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

// ── Footer ─────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="border-t border-moss-200 bg-parchment/80">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">

        {/* Social proof strip */}
        <div className="flex flex-wrap items-center gap-8 mb-10 pb-10 border-b border-moss-100">
          {[
            { stat: "52+",    label: "curated tools" },
            { stat: "100%",   label: "no sponsored rankings" },
            { stat: "∞",      label: "roadmaps — first is free" },
          ].map(({ stat, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-moss-600">{stat}</span>
              <span className="font-body text-sm text-forest/60">{label}</span>
            </div>
          ))}
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand column */}
          <div className="space-y-3">
            <p className="font-serif text-xl font-bold text-espresso">AIght ✦</p>
            <p className="font-body text-sm text-forest/60 leading-relaxed max-w-xs">
              The internet&apos;s cozy corner for AI tool discovery.
              Curated slowly, on purpose.
            </p>
            <p className="font-body text-xs text-forest/40 italic">
              &ldquo;Built slowly, on purpose.&rdquo;
            </p>
          </div>

          {/* Navigation column */}
          <nav className="space-y-2">
            <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-3">
              Navigate
            </p>
            {[
              { href: "/",        label: "Home" },
              { href: "/tools",   label: "Tool Directory" },
              { href: "/pricing", label: "Pricing" },
              { href: "/roadmaps",label: "My Canvases" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms",   label: "Terms of Service" },
            ].map(({ href, label }) => (
              <div key={href}>
                <Link
                  href={href}
                  className="font-body text-sm text-forest/60 hover:text-forest transition-colors duration-150"
                >
                  {label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Newsletter column */}
          <div className="space-y-3">
            <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-3">
              Stay in the loop
            </p>
            <p className="font-body text-sm text-forest/70 leading-relaxed">
              New tools, new stacks, and the occasional note from the archive.
              No spam — ever.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-moss-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-forest/40">
            © {new Date().getFullYear()} AIght. Built with 🌿 by{" "}
            <a
              href="mailto:singhmankaran05@gmail.com"
              className="hover:text-forest transition-colors duration-150"
            >
              Mankaran Singh
            </a>
          </p>
          <p className="font-body text-xs text-forest/30 italic">
            No hustle. No hype. Just the signal.
          </p>
        </div>
      </div>
    </footer>
  );
}
