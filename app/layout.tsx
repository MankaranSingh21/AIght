import type { Metadata } from "next";
import { Space_Grotesk, Lora, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import PostHogProvider from "./providers/PostHogProvider";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
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
    default: "AIght — your cozy corner for AI tools",
    template: "%s — AIght",
  },
  description:
    "A ruthlessly curated AI tool directory. No hype, no sponsored rankings. Just honest signal.",
  keywords: ["AI tools", "AI directory", "AI learning", "curated AI"],
  authors: [{ name: "Mankaran Singh" }],
  creator: "Mankaran Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "AIght",
    title: "AIght — your cozy corner for AI tools",
    description:
      "A ruthlessly curated AI tool directory. No spam, no affiliate links.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIght — your cozy corner for AI tools",
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
        className={`${spaceGrotesk.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PostHogProvider>
          <Navbar />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:       "!bg-panel !border !border-subtle !rounded-lg !font-sans !text-primary",
                title:       "!font-sans !font-semibold !text-primary !text-sm",
                description: "!font-sans !text-secondary !text-xs",
                success:     "!border-emphasis",
                error:       "!border-danger",
              },
            }}
          />
        </PostHogProvider>
      </body>
    </html>
  );
}
