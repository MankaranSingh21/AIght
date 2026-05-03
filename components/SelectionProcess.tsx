"use client";

import ScrollReveal from "./ScrollReveal";

const CRITERIA = [
  {
    title: "Utility over Novelty",
    desc: "We ignore the 'wrapper of the week.' If a tool doesn't solve a real problem or add a unique layer of value, it doesn't make the cut.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Privacy First",
    desc: "We prioritize tools with local-first features, open-weight models, or transparent data policies. Your data shouldn't be the price of admission.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Zero Affiliate Bias",
    desc: "We don't make a cent if you click. Our rankings are purely meritocratic, driven by quality and user experience, not kickbacks.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
  },
  {
    title: "Human Tested",
    desc: "No automated scraping or bulk indexing. Every tool in this archive has been used and vetted by a human before it's listed.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function SelectionProcess() {
  return (
    <section className="section-full bg-surface/30 border-y border-primary/5">
      <div className="section-inner py-20 md:py-32">
        <ScrollReveal>
          <div className="max-w-editorial mb-16">
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent mb-4">
              Our Standard
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-primary tracking-tight mb-6">
              How we choose tools
            </h2>
            <p className="font-serif text-lg leading-relaxed text-secondary italic">
              The AI space is loud, messy, and full of noise. We built AIght to be the filter. 
              Our curation process is manual, opinionated, and intentionally slow.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {CRITERIA.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100}>
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  {item.icon}
                </div>
                <h3 className="font-sans text-lg font-bold text-primary tracking-tight">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
