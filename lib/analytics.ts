// One place for every analytics event on the site.
//
// Before this module, 13 events were captured from 6 files using two different
// patterns (the `usePostHog()` hook in components, a bare wrapper in progress.ts)
// with ad-hoc string literals. That made it impossible to answer "what do we
// actually measure?" without grepping, and a typo in an event name was silent.
//
// Rules that hold everywhere:
//   - Analytics must NEVER break a user flow. Every call is wrapped.
//   - A missing PostHog key is a no-op, not an error. The site ran for months
//     shipping posthog-js with no token, logging an init error on every page.
//   - Event names are a closed union. Adding one means adding it here.

import posthog from "posthog-js";

/** True when PostHog has a key and can actually send. */
export function analyticsEnabled(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
  );
}

// ── Event taxonomy ───────────────────────────────────────────────────────
// Grouped by the question each group answers.

export type AnalyticsEvent =
  // Learning progress — "is the teaching working?"
  | { name: "lesson_completed";     props: { slug: string; checksRight: number } }
  | { name: "concept_read";         props: { slug: string } }
  | { name: "concept_check_passed"; props: { slug: string } }
  | { name: "review_graded";        props: { slug: string; remembered: boolean; box: number } }
  | { name: "track_completed";      props: { slug: string } }
  | { name: "badge_earned";         props: { badge: string } }
  | { name: "streak_extended";      props: { length: number } }
  // Tools — "which tools pull, and from where?"
  // Prop names standardised on `slug`/`name`/`category`. Safe to change: the
  // site has never had a PostHog key, so there is no historical data to break.
  | { name: "tool_visit_detail";    props: { slug: string } }
  | { name: "tool_visit_from_card"; props: { slug: string; name: string } }
  | { name: "tool_bookmarked";      props: { slug: string; name: string; category?: string | null } }
  | { name: "tool_unbookmarked";    props: { slug: string; name: string; category?: string | null } }
  // Discovery — previously uninstrumented. These answer "what is this site for?"
  | { name: "tools_searched";       props: { query: string; results: number } }
  | { name: "tools_filtered";       props: { facet: string; value: string } }
  | { name: "compare_viewed";       props: { a: string; b: string } }
  // The universe — zero events today
  | { name: "universe_node_opened"; props: { id: string; kind: string; via: "click" | "search" | "deeplink" } }
  | { name: "universe_filtered";    props: { filter: string } }
  | { name: "universe_searched";    props: { query: string; results: number } }
  // Quiz funnel — only the completion was measured, so drop-off was invisible
  | { name: "quiz_started";         props: Record<string, never> }
  | { name: "quiz_step_completed";  props: { step: number; total: number } }
  | { name: "quiz_completed";       props: Record<string, unknown> }
  // Newsletter
  | { name: "newsletter_subscribe"; props: { source?: string } };

export type AnalyticsEventName = AnalyticsEvent["name"];

type PropsFor<N extends AnalyticsEventName> = Extract<
  AnalyticsEvent,
  { name: N }
>["props"];

/**
 * Send one event. Typed so the props must match the event name.
 *
 * Fail-silent by design — this preserves the guarantee that lib/progress.ts
 * already relied on: a broken or blocked analytics call must never interrupt
 * XP, streaks, or navigation.
 */
export function track<N extends AnalyticsEventName>(
  name: N,
  ...[props]: PropsFor<N> extends Record<string, never> ? [] : [PropsFor<N>]
): void {
  if (!analyticsEnabled()) return;
  try {
    posthog?.capture?.(name, props as Record<string, unknown> | undefined);
  } catch {
    // Blocked by an extension, quota, offline — never surface to the user.
  }
}

/**
 * Route-change pageview. The provider sets `capture_pageview: false` because
 * posthog-js's automatic pageview does not understand App Router client
 * navigation; we send this instead.
 */
export function trackPageview(url: string): void {
  if (!analyticsEnabled()) return;
  try {
    posthog?.capture?.("$pageview", { $current_url: url });
  } catch {
    // ignore
  }
}
