import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AIght is free to start. One canvas, no credit card. Upgrade for unlimited roadmaps, PNG exports, and curated templates.",
};

const FREE_FEATURES = [
  "Access the full tool directory (52+ tools)",
  "1 visual roadmap canvas",
  "Drag, connect, and annotate nodes",
  "Share your canvas publicly",
  "Clone public roadmaps",
  "Mobile-friendly view",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited roadmap canvases",
  "PNG & PDF export",
  "Priority access to new tools",
  "Curated starter stack templates",
  "Early access to AI-generated roadmaps",
  "Support the archive staying independent",
];

function PlanCard({
  name,
  price,
  period,
  tagline,
  features,
  cta,
  ctaHref,
  highlight,
  badge,
}: {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`
        relative flex flex-col rounded-4xl border p-8 md:p-10 space-y-8
        ${highlight
          ? "bg-espresso border-espresso shadow-card-hover"
          : "bg-parchment border-moss-200 shadow-card"
        }
      `}
    >
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="font-body text-2xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-amber-400 text-espresso shadow-amber">
            {badge}
          </span>
        </div>
      )}

      <div className="space-y-2">
        <p className={`font-body text-xs uppercase tracking-widest font-semibold ${highlight ? "text-parchment/50" : "text-moss-500"}`}>
          {name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={`font-serif text-5xl font-bold ${highlight ? "text-parchment" : "text-espresso"}`}>
            {price}
          </span>
          <span className={`font-body text-sm ${highlight ? "text-parchment/50" : "text-forest/50"}`}>
            {period}
          </span>
        </div>
        <p className={`font-body text-sm leading-relaxed ${highlight ? "text-parchment/70" : "text-forest/70"}`}>
          {tagline}
        </p>
      </div>

      <Link
        href={ctaHref}
        className={`
          w-full text-center font-body font-semibold tracking-wide text-base
          px-6 py-3.5 rounded-2xl border transition-colors duration-150
          ${highlight
            ? "bg-parchment text-espresso border-parchment hover:bg-moss-50"
            : "bg-moss-500 text-parchment border-moss-600 hover:bg-moss-600 shadow-moss"
          }
        `}
      >
        {cta}
      </Link>

      <ul className="space-y-3.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${highlight ? "bg-parchment/15" : "bg-moss-100"}`}>
              <Check className={`w-2.5 h-2.5 ${highlight ? "text-parchment" : "text-moss-600"}`} />
            </span>
            <span className={`font-body text-sm leading-snug ${highlight ? "text-parchment/80" : "text-forest/80"}`}>
              {f}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <main className="min-h-screen bg-parchment dark:bg-charcoal-900 texture-grain transition-colors duration-200">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-20 pt-20 pb-16 text-center max-w-3xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-5">
            simple, honest pricing ✦
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-espresso dark:text-parchment leading-tight mb-6 text-balance">
            Start for free.{" "}
            <span className="italic text-moss-600 dark:text-moss-400">Go deeper</span> when you&apos;re ready.
          </h1>
          <p className="font-body text-lg text-forest/70 dark:text-parchment/60 leading-relaxed text-balance">
            AIght will always have a generous free tier. We&apos;re not a VC-backed growth machine — we&apos;re a slowly built archive that respects your time and attention.
          </p>
        </section>

        {/* Plans */}
        <section className="px-6 md:px-12 lg:px-20 pb-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <PlanCard
              name="Free — forever"
              price="$0"
              period="/ month"
              tagline="One canvas is enough to discover whether visual roadmaps click for you."
              features={FREE_FEATURES}
              cta="Start building — it's free"
              ctaHref="/login"
              highlight={false}
            />
            <PlanCard
              name="Pro"
              price="$9"
              period="/ month"
              tagline="For people who are serious about building with AI and want to keep the archive alive."
              features={PRO_FEATURES}
              cta="Upgrade to Pro"
              ctaHref="/login"
              highlight={true}
              badge="Most popular"
            />
          </div>

          {/* FAQ-style notes */}
          <div className="mt-16 space-y-6 max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-espresso dark:text-parchment text-center mb-8">
              Honest answers
            </h2>
            {[
              {
                q: "Is the free plan really free?",
                a: "Yes. No credit card, no trial period. One canvas, full feature set, forever. We'd rather you use it and love it than pay for something you're unsure about.",
              },
              {
                q: "Why $9/month?",
                a: "It covers server costs, curation time, and keeps the site ad-free. We're not building a unicorn — just a tool that doesn't suck.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Of course. No dark patterns, no cancellation friction. You cancel, you go back to the free tier. Simple.",
              },
              {
                q: "What's the AI roadmap generation?",
                a: "We're building a feature that reads your goal ('I want to build a SaaS in 30 days') and generates a pre-wired canvas. It's in early access for Pro users first.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-3xl border border-moss-100 dark:border-charcoal-800 bg-parchment dark:bg-charcoal-800 p-7 space-y-2">
                <p className="font-serif text-base font-bold text-espresso dark:text-parchment">{q}</p>
                <p className="font-body text-sm text-forest/70 dark:text-parchment/60 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
