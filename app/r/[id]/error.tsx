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
    <div
      className="flex flex-col items-center justify-center bg-parchment px-6"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="text-center max-w-sm space-y-5">
        <p className="font-serif text-6xl font-bold text-espresso/20">✦</p>
        <h2 className="font-serif text-2xl font-bold text-espresso leading-snug">
          Couldn&rsquo;t load this canvas
        </h2>
        <p className="font-body text-sm text-forest/60 leading-relaxed">
          Something went sideways fetching this shared roadmap. It may have been
          made private or removed.
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
            ← Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
