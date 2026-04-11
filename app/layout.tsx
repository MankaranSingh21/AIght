import type { Metadata } from "next";
import { Playfair_Display, Lora, Fraunces } from "next/font/google";
import Navbar from "@/components/Navbar";
import CommandMenu from "@/components/CommandMenu";
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

export const metadata: Metadata = {
  // Required so Next.js can resolve relative OG image URLs to absolute ones.
  // Falls back to the production domain when NEXT_PUBLIC_SITE_URL isn't set.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aight.app"
  ),
  title: "AIght — your cozy corner for AI tools",
  description: "Discover, learn, and build with AI tools. Cozy not clinical.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lora.variable} ${fraunces.variable} antialiased`}
      >
        <Navbar />
        {children}
        <CommandMenu />
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:       "!bg-parchment !border !border-moss-200 !shadow-card !rounded-2xl !font-body !text-espresso",
              title:       "!font-body !font-semibold !text-espresso !text-sm",
              description: "!font-body !text-forest/70 !text-xs",
              success:     "!border-moss-300",
              error:       "!border-red-200",
            },
          }}
        />
      </body>
    </html>
  );
}
