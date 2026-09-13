import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Lora, JetBrains_Mono, Caveat } from "next/font/google";
import Navbar from "@/components/Navbar";
import GlobalEffects from "@/components/GlobalEffects";
import AnalyticsProvider from "./providers/AnalyticsProvider";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "700", "900"],
  style: ["normal", "italic"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Caveat — used sparingly for AIght's Take (the author's one-line verdict per
// tool). Hand-written feel signals editorial opinion vs. algorithmic output.
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
  display: "swap",
  weight: ["500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIght — the signal beneath the noise",
    template: "%s — AIght",
  },
  description:
    "Discover AI tools relevant to your field, understand their risks, and stay current — without the doomscroll.",
  keywords: ["AI tools", "AI directory", "AI learning", "curated AI"],
  authors: [{ name: "Mankaran Singh" }],
  creator: "Mankaran Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "AIght",
    title: "AIght — the signal beneath the noise",
    description:
      "A ruthlessly curated AI tool directory. No hype, no sponsored rankings. Just honest signal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIght — the signal beneath the noise",
    description: "A ruthlessly curated AI tool directory. No spam, no affiliate links.",
    creator: "@aightai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AIght",
  "url": SITE_URL,
  "description": "Curated AI tool directory. No spam, no affiliate links.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_URL}/tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*
          AdSense loader — a literal <script> in the document head, on purpose.

          next/script with strategy="afterInteractive" emits only a
          <link rel="preload" as="script"> into the HTML and injects the real
          tag client-side after hydration. That is fine for serving ads, but
          AdSense OWNERSHIP VERIFICATION looks for this snippet in the markup,
          and betting verification on the crawler executing hydration is a bad
          bet. This renders exactly the snippet Google hands you.

          `async` keeps it off the critical path, so this costs nothing that
          next/script was buying.
        */}
        {ADSENSE_CLIENT && (
          <>
            {/*
              Non-personalised flag.

              Set inline rather than via an afterInteractive next/script, which
              would only run after hydration. Note Next hoists <script src> tags
              above inline ones in <head>, so this does NOT win on document
              order — the guarantee comes from two other facts:

                - the loader is `async`, so it cannot execute before it has been
                  fetched, while this executes during parse with no round-trip;
                - an ad is only REQUESTED when AdSlot calls adsbygoogle.push({})
                  from a useEffect, which is after hydration and therefore long
                  after this has run.

              That ordering is what keeps the claim on /about and /privacy — that
              ads are contextual, not personalised — actually true.

              ⚠️ This holds only while ad requests come from our own AdSlot.
              Auto ads, enabled in the AdSense dashboard, inject units without
              going through push() and bypass both this flag's guarantee and the
              deliberate placement rules in DESIGN_SYSTEM.md. Leave Auto ads off.
            */}
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "window.adsbygoogle=window.adsbygoogle||[];" +
                  "window.adsbygoogle.requestNonPersonalizedAds=1;",
              }}
            />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body
        className={`${plusJakartaSans.variable} ${fraunces.variable} ${lora.variable} ${jetbrainsMono.variable} ${caveat.variable} antialiased`}
      >
        <AnalyticsProvider>
          {/* Global ambient effects — particle canvas + custom cursor */}
          <GlobalEffects />
          <Navbar />
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
