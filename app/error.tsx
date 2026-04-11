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
    <div className="min-h-[calc(100vh-56px)] bg-parchment flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-moss-200/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-200/15 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 text-center max-w-sm space-y-6">
        <p className="font-serif text-7xl font-bold text-espresso/15 select-none">✦</p>

        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-bold text-espresso leading-snug">
            Something broke.
          </h2>
          <p className="font-body text-sm text-forest/60 leading-relaxed">
            An unexpected error occurred. We caught it before it could do any
            real damage — but we&rsquo;d still like to know about it.
          </p>
          {error.digest && (
            <p className="font-body text-2xs text-forest/30 uppercase tracking-widest">
              Error ID: {error.digest}
            </p>
          )}
        </div>

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
