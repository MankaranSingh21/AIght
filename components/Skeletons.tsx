/**
 * Skeleton loading states. Keep them visually close to their real counterparts
 * so the layout doesn't jump on hydration.
 */

// ── ToolCard skeleton ──────────────────────────────────────────────────────

function ToolCardSkeleton() {
  return (
    <div className="rounded-3xl border border-moss-100 bg-parchment shadow-card overflow-hidden animate-pulse">
      {/* Hero strip */}
      <div className="h-36 bg-moss-100" />

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Category badge */}
        <div className="h-5 w-20 rounded-full bg-moss-200" />
        {/* Name */}
        <div className="h-6 w-3/4 rounded-lg bg-moss-100" />
        {/* Tagline lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-moss-100" />
          <div className="h-3.5 w-5/6 rounded bg-moss-100" />
        </div>
        {/* Tags */}
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 rounded-full bg-moss-100" />
          <div className="h-5 w-16 rounded-full bg-moss-100" />
          <div className="h-5 w-10 rounded-full bg-moss-100" />
        </div>
      </div>

      {/* Footer dot */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-moss-200" />
        <div className="h-3 w-8 rounded bg-moss-100" />
      </div>
    </div>
  );
}

// ── Grid of cards (used as Suspense fallback on homepage + archive) ─────────

export function ToolGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-10">
      {/* Pill row placeholder */}
      <div className="flex gap-2.5 mb-7">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-full bg-moss-100 animate-pulse" />
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ToolCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ── Tool detail skeleton (used as loading state on /tool/[slug]) ──────────

export function ToolDetailSkeleton() {
  return (
    <main className="min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 space-y-16 animate-pulse">
        {/* Back link */}
        <div className="h-4 w-32 rounded bg-moss-100" />

        {/* Logo + name */}
        <div className="space-y-6">
          <div className="w-24 h-24 rounded-2xl bg-moss-100" />
          <div className="space-y-3">
            <div className="h-12 w-64 rounded-xl bg-moss-100" />
            <div className="h-5 w-full max-w-lg rounded bg-moss-100" />
            <div className="h-5 w-4/5 max-w-md rounded bg-moss-100" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-full bg-moss-200" />
            <div className="h-7 w-14 rounded-full bg-moss-100" />
            <div className="h-7 w-16 rounded-full bg-moss-100" />
          </div>
        </div>

        {/* Video placeholder */}
        <div className="w-full aspect-video rounded-4xl bg-moss-100" />

        {/* Use cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-3xl border border-moss-100 bg-parchment overflow-hidden">
              <div className="h-36 bg-moss-100" />
              <div className="px-7 py-5 space-y-2">
                <div className="h-4 w-full rounded bg-moss-100" />
                <div className="h-4 w-5/6 rounded bg-moss-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ── Canvas skeleton (used as Suspense fallback on /roadmaps/[id]) ──────────

export function CanvasSkeleton() {
  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Toolbar placeholder */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-moss-200 bg-parchment animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 rounded bg-moss-100" />
          <div className="h-px w-4 bg-moss-200" />
          <div className="h-5 w-40 rounded bg-moss-100" />
        </div>
        <div className="h-8 w-28 rounded-xl bg-moss-100" />
      </div>

      {/* Canvas area — dots-like repeated pattern */}
      <div
        className="flex-1 min-h-0 bg-parchment flex items-center justify-center animate-pulse"
        style={{
          backgroundImage:
            "radial-gradient(circle, #8ABF76 1.4px, transparent 1.4px)",
          backgroundSize: "22px 22px",
          opacity: 0.6,
        }}
      >
        <div className="text-center space-y-2 opacity-40">
          <p className="font-serif text-2xl font-semibold text-espresso">
            Loading canvas…
          </p>
        </div>
      </div>
    </div>
  );
}
