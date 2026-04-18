import type { Metadata } from "next";
import { Playfair_Display, Lora, Fraunces } from "next/font/google";
import Navbar from "@/components/Navbar";
import CommandMenu from "@/components/CommandMenu";
import PostHogProvider from "./providers/PostHogProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIght — your cozy corner for AI tools",
    template: "%s — AIght",
  },
  description:
    "Discover the best AI tools, then build a beautiful visual roadmap to actually use them. Ruthlessly curated. No hype, no sponsored rankings.",
  keywords: ["AI tools", "AI directory", "roadmap builder", "AI learning", "curated AI"],
  authors: [{ name: "Mankaran Singh" }],
  creator: "Mankaran Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "AIght",
    title: "AIght — your cozy corner for AI tools",
    description:
      "Discover the best AI tools, then build a beautiful visual roadmap to actually use them. No spam, no affiliate links.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIght — your cozy corner for AI tools",
    description:
      "Discover the best AI tools, then build a beautiful visual roadmap to actually use them.",
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
  "description": "Curated AI tool directory + visual roadmap builder. No spam, no affiliate links.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${lora.variable} ${fraunces.variable} antialiased`}
      >
        <ThemeProvider>
        <PostHogProvider>
          <Navbar />
          {children}
          <CommandMenu />
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:       "!bg-parchment dark:!bg-charcoal-800 !border !border-moss-200 dark:!border-charcoal-700 !shadow-card !rounded-2xl !font-body !text-espresso dark:!text-parchment",
                title:       "!font-body !font-semibold !text-espresso dark:!text-parchment !text-sm",
                description: "!font-body !text-forest/70 dark:!text-parchment/60 !text-xs",
                success:     "!border-moss-300 dark:!border-moss-700",
                error:       "!border-red-200 dark:!border-red-900",
              },
            }}
          />
        </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
