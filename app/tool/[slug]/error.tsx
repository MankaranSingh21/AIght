"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-parchment flex items-center justify-center px-6">
      <div className="text-center max-w-sm space-y-5">
        <p className="font-serif text-6xl font-bold text-espresso/20">✦</p>
        <h2 className="font-serif text-2xl font-bold text-espresso leading-snug">
          Tool page failed to load
        </h2>
        <p className="font-body text-sm text-forest/60 leading-relaxed">
          We hit a snag pulling this tool&rsquo;s details. Give it another shot
          or browse all tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="font-body text-sm font-semibold px-5 py-2.5 rounded-xl bg-moss-500 hover:bg-moss-600 text-parchment transition-colors duration-150"
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-body text-sm font-semibold px-5 py-2.5 rounded-xl border border-moss-200 hover:bg-moss-50 text-forest transition-colors duration-150"
          >
            ← Browse tools
          </Link>
        </div>
      </div>
    </main>
  );
}
