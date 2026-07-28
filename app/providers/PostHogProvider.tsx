"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { trackPageview } from "@/lib/analytics";

// Init is deliberately NOT at module scope. Doing it there runs during render,
// which is a Strict Mode hazard, and it fired `posthog.init(undefined)` on every
// page load — the site spent months logging "PostHog was initialized without a
// token" to every visitor's console while collecting nothing.
function initPostHog(): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  // No key (local dev, preview builds, or a missing Vercel env var) → stay a
  // no-op instead of throwing. lib/analytics.ts guards on the same condition.
  if (!key) return;
  if (posthog.__loaded) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // No auth system on this site, so there is never an identified user.
    person_profiles: "identified_only",
    // posthog-js's automatic pageview does not fire on App Router client
    // navigation. PageviewTracker below sends them instead.
    capture_pageview: false,
    capture_pageleave: true,
  });
}

/**
 * Sends a $pageview on first load and on every client-side route change.
 *
 * Reads useSearchParams, so it MUST stay inside <Suspense> — without a boundary
 * it opts every page into dynamic rendering, which would silently break ISR on
 * /, /tools and /learn/map.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    const url = `${window.origin}${pathname}${qs ? `?${qs}` : ""}`;
    // Guard against double-sends: React 18 Strict Mode runs effects twice in
    // dev, and a re-render with identical params must not count as a new view.
    if (lastUrl.current === url) return;
    lastUrl.current = url;
    trackPageview(url);
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
