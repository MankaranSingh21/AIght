"use client";

import { useEffect, useRef } from "react";

/**
 * A single contextual AdSense unit.
 *
 * Deliberately restrained, because DESIGN_SYSTEM.md governs this page too and
 * its word is "intentional". No sticky units, no interstitials, no anchor ads,
 * nothing that reflows text mid-read. The slot reserves its own height so an ad
 * arriving late cannot push content around (layout shift is both a Core Web
 * Vitals penalty and the single most irritating thing ads do to a reader).
 *
 * NON-PERSONALISED ONLY. `data-npa="1"` asks Google not to use reader data for
 * targeting, which is what keeps the claim on /about and /privacy true. Do not
 * remove it without changing that copy first — the promise and the flag have to
 * move together.
 *
 * Renders nothing at all when NEXT_PUBLIC_ADSENSE_ID is unset, so the site
 * before approval is simply a site without ads.
 */
export default function AdSlot({
  slot,
  label = "Advertisement",
  minHeight = 280,
}: {
  /** AdSense ad unit ID (data-ad-slot). Ad units only exist after approval, so
   *  this is optional: no slot means no ad, not a broken one. */
  slot?: string;
  label?: string;
  minHeight?: number;
}) {
  const pub = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const pushed = useRef(false);

  useEffect(() => {
    if (!pub || !slot || pushed.current) return;
    pushed.current = true;
    try {
      // adsbygoogle is created by the AdSense script in layout.tsx.
      const w = window as Window & { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // Blocked by an extension, or the script never loaded. An ad failing to
      // render must never be visible as an error to a reader.
    }
  }, [pub, slot]);

  if (!pub || !slot) return null;

  return (
    <aside
      aria-label={label}
      style={{
        margin: "var(--space-16) auto",
        maxWidth: "var(--max-width-editorial)",
        minHeight,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Labelled, because an unlabelled ad on an editorial page reads as
          endorsement — which is exactly what this site promises it is not. */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={pub.startsWith("ca-") ? pub : `ca-${pub}`}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-npa="1"
      />
    </aside>
  );
}
