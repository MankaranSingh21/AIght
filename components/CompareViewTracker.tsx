"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Reports a completed tool-vs-tool comparison.
 *
 * /compare is a server component that reads `a` and `b` from searchParams, so
 * there is no client boundary to fire from — hence this. Renders nothing.
 *
 * Which pairs people actually compare is one of the more valuable signals the
 * site can produce: it says what readers see as substitutes for each other.
 */
export default function CompareViewTracker({ a, b }: { a: string; b: string }) {
  const reported = useRef<string | null>(null);

  useEffect(() => {
    const key = `${a}|${b}`;
    if (!a || !b || reported.current === key) return;
    reported.current = key;
    track("compare_viewed", { a, b });
  }, [a, b]);

  return null;
}
