"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID, trackPageview } from "@/lib/analytics";

/**
 * Sends a page_view on first load and on every client-side route change.
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
    const url = `${pathname}${qs ? `?${qs}` : ""}`;
    // Guard against double-sends: Strict Mode runs effects twice in dev, and a
    // re-render with identical params is not a new pageview.
    if (lastUrl.current === url) return;
    lastUrl.current = url;
    trackPageview(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Google Analytics 4.
 *
 * Consent Mode v2 is configured BEFORE the gtag config call, which is not a
 * style preference — consent defaults only apply to commands issued after them,
 * so setting them late means the first pageview of every session is collected
 * under the wrong basis. Google also requires Consent Mode v2 for ads served to
 * EEA/UK traffic, so this has to be right before any ad unit goes live.
 *
 * Defaults are denied in the EEA, UK and Switzerland and granted elsewhere —
 * the standard split. A consent banner can later call
 * gtag('consent', 'update', ...) to grant in those regions.
 */
export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // GA and AdSense are configured independently — either can be live without
  // the other — so neither may short-circuit the other's setup.
  if (!GA_MEASUREMENT_ID) {
    return (
      <>
        <AdSenseScript />
        {children}
      </>
    );
  }

  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR',
                     'HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL',
                     'PT','RO','SK','SI','ES','SE','GB','CH'],
          });
          gtag('consent', 'default', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted',
          });
          gtag('js', new Date());
        `}
      </Script>

      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />

      <Script id="ga-config" strategy="afterInteractive">
        {`
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>

      <AdSenseScript />

      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </>
  );
}

/**
 * Loads the AdSense library, once, for the whole site.
 *
 * Kept next to the GA setup on purpose: both depend on the Consent Mode v2
 * defaults declared above, and splitting them across files is how the ordering
 * quietly breaks later.
 *
 * `requestNonPersonalizedAds = 1` is set before the library loads, so the very
 * first request is non-personalised rather than the flag arriving a beat late.
 * This is what keeps the contextual-advertising claim on /about and /privacy
 * true; it moves together with that copy or not at all.
 *
 * Renders nothing when NEXT_PUBLIC_ADSENSE_ID is unset — the pre-approval state.
 */
function AdSenseScript() {
  const pub = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!pub) return null;
  const client = pub.startsWith("ca-") ? pub : `ca-${pub}`;

  return (
    <>
      <Script id="adsense-npa" strategy="afterInteractive">
        {`window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.requestNonPersonalizedAds = 1;`}
      </Script>
      <Script
        id="adsense-src"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      />
    </>
  );
}
