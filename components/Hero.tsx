import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-28 pb-28">
      {/* Ambient blobs — CSS only, no animation */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[rgba(125,191,140,0.06)] rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[rgba(201,169,110,0.05)] rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-content mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-8">
          A literary magazine that covers AI
        </p>

        <h1
          className="font-sans text-5xl font-semibold text-primary leading-[1.1] mb-8 max-w-3xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          The signal beneath the noise
        </h1>

        <p className="font-sans text-lg text-secondary max-w-xl leading-relaxed mb-12">
          A curated archive of AI tools worth your attention.
          No hype, no sponsored rankings. Just honest signal.
        </p>

        <Link href="/learn" className="btn-ghost">
          Start reading →
        </Link>
      </div>
    </section>
  );
}
