import Link from "next/link";
import HeroCanvas from "@/components/HeroCanvas";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-28 pb-28">
      <HeroCanvas />

      <div className="relative z-10 max-w-content mx-auto">
        <p
          className="font-mono uppercase text-accent mb-8"
          style={{ fontSize: "11px", letterSpacing: "0.12em" }}
        >
          A literary magazine covering AI
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

        <div className="flex flex-wrap gap-4">
          <Link href="/learn" className="btn-primary">
            Start reading →
          </Link>
          <Link href="/tools" className="btn-ghost">
            Browse tools
          </Link>
          <Link href="/quiz" className="btn-ghost">
            Find your risk score →
          </Link>
        </div>
      </div>
    </section>
  );
}
