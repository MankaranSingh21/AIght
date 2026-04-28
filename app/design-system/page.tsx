import ToolCard from "@/components/ToolCard";

// This is a Server Component — the interactive showcases are isolated as Client Components below.

export const metadata = {
  title: "Design System — AIght",
  description: "The living style guide. Fonts, colors, buttons, and cards.",
};

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-parchment text-espresso">
      {/* Header */}
      <header className="border-b border-moss-200 px-8 py-10 bg-forest text-parchment">
        <p className="font-body text-sm uppercase tracking-widest text-neon-lime mb-2">
          AIght — Design System
        </p>
        <h1 className="font-display text-5xl font-bold leading-tight">
          The Living Style Guide
        </h1>
        <p className="font-body text-lg text-parchment/70 mt-3 max-w-xl">
          Every vibe check in one place. Fonts breathe, cards hover, buttons sing.
          If it slaps here, it slaps everywhere.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-16 space-y-24">

        {/* ── Typography Scale ── */}
        <section>
          <SectionLabel>01 — Typography</SectionLabel>
          <div className="space-y-6">
            <div>
              <Specimen label="font-display / 7xl" sub="Fraunces — for dramatic display moments">
                <p className="font-display text-7xl font-bold text-espresso leading-none">
                  AI, but cozy.
                </p>
              </Specimen>
            </div>
            <div>
              <Specimen label="font-serif / 5xl" sub="Playfair Display — editorial headers">
                <h2 className="font-serif text-5xl font-bold text-espresso">
                  Discover tools that actually slap.
                </h2>
              </Specimen>
            </div>
            <div>
              <Specimen label="font-serif / 3xl" sub="Playfair Display — section headers">
                <h3 className="font-serif text-3xl font-semibold text-forest">
                  Your productivity roadmap, finally alive.
                </h3>
              </Specimen>
            </div>
            <div>
              <Specimen label="font-body / base" sub="Lora — warm readable body copy">
                <p className="font-body text-base text-espresso/80 max-w-2xl">
                  We built AIght because finding good AI tools shouldn&apos;t feel
                  like doomscrolling a Product Hunt archive. It should feel like
                  wandering a cozy market — curious, unhurried, and genuinely
                  delightful.
                </p>
              </Specimen>
            </div>
            <div>
              <Specimen label="font-body / sm + tracking-widest" sub="Labels, badges, meta copy">
                <p className="font-body text-sm uppercase tracking-widest text-moss-600 font-semibold">
                  Creative Tools · 42 tools · Updated daily
                </p>
              </Specimen>
            </div>
          </div>
        </section>

        {/* ── Color Palette ── */}
        <section>
          <SectionLabel>02 — Color Palette</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Swatch name="Parchment" hex="#F5EFE0" className="bg-[#F5EFE0] border border-moss-200" />
            <Swatch name="Espresso" hex="#2C1A0E" className="bg-[#2C1A0E]" light />
            <Swatch name="Forest" hex="#1C3A2E" className="bg-[#1C3A2E]" light />
            <Swatch name="Moss 500" hex="#3D8A2B" className="bg-moss-500" light />
            <Swatch name="Amber 400" hex="#F4AB1F" className="bg-amber-400" />
            <Swatch name="Lavender 400" hex="#A373D7" className="bg-lavender-400" light />
            <Swatch name="Neon Lime" hex="#AAFF4D" className="bg-[#AAFF4D]" />
            <Swatch name="Neon Teal" hex="#00FFD1" className="bg-[#00FFD1]" />
          </div>
        </section>

        {/* ── Tool Cards ── */}
        <section>
          <SectionLabel>04 — Tool Card</SectionLabel>
          <p className="font-body text-sm text-forest/60 mb-8">
            Hover each card — they breathe. The category watermark shifts at rest.
            The whole thing springs on interaction.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolCard
              slug="notion-ai"
              name="Notion AI"
              tagline="Your second brain, now with a brain of its own. Yeah, it writes pretty well."
              category="Productivity"
              tags={["writing", "PKM", "notes"]}
            />
            <ToolCard
              slug="midjourney"
              name="Midjourney"
              tagline="Prompts into paintings. Every iteration is a little act of magic."
              category="Image Gen"
              tags={["art", "design", "creative"]}
            />
            <ToolCard
              slug="elevenlabs"
              name="ElevenLabs"
              tagline="Clone a voice, narrate a world. Audio that feels disturbingly human."
              category="Audio AI"
              tags={["voice", "audio", "TTS"]}
            />
          </div>
        </section>

      </div>
    </main>
  );
}

// ── Helpers (Server Component sub-components) ──────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 font-semibold mb-1">
        {children}
      </p>
      <div className="h-px bg-moss-200" />
    </div>
  );
}

function Specimen({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-moss-100 bg-parchment/60 p-6 space-y-3">
      <div>
        <span className="font-body text-xs text-moss-600 font-semibold uppercase tracking-widest">
          {label}
        </span>
        <span className="font-body text-xs text-espresso/40 ml-3">{sub}</span>
      </div>
      {children}
    </div>
  );
}

function Swatch({
  name,
  hex,
  className,
  light,
}: {
  name: string;
  hex: string;
  className: string;
  light?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}>
      <p
        className={`font-body text-sm font-semibold ${light ? "text-parchment" : "text-espresso"}`}
      >
        {name}
      </p>
      <p
        className={`font-body text-xs mt-0.5 ${light ? "text-parchment/60" : "text-espresso/60"}`}
      >
        {hex}
      </p>
    </div>
  );
}
