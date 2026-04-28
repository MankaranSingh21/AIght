import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Lora, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import GlobalEffects from "@/components/GlobalEffects";
import PostHogProvider from "./providers/PostHogProvider";
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
      </head>
      <body
        className={`${plusJakartaSans.variable} ${fraunces.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PostHogProvider>
          {/* Global ambient effects — particle canvas + custom cursor */}
          <GlobalEffects />
          <Navbar />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
