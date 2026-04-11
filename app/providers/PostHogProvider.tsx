"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Guard against SSR — posthog-js is browser-only.
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // Only create person profiles for identified (logged-in) users.
    person_profiles: "identified_only",
    // Next.js App Router handles navigation events natively; disable auto-capture
    // to avoid double-counting and send clean route-change events instead.
    capture_pageview: false,
    capture_pageleave: true,
  });
}

// Syncs Supabase auth state → PostHog identity in one place so every
// subsequent event is tied to the right user without any per-component wiring.
function PostHogAuthSync() {
  useEffect(() => {
    const supabase = createClient();

    // Identify any user who is already signed in when the page first loads.
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        posthog.identify(user.id, { email: user.email ?? undefined });
      }
    });

    // Keep in sync across sign-in / sign-out events (e.g. after magic link).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email ?? undefined,
        });
      } else {
        // User signed out — disassociate future anonymous events.
        posthog.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PHProvider client={posthog}>
      <PostHogAuthSync />
      {children}
    </PHProvider>
  );
}
