import type { Metadata } from "next";
import BookmarksClient from "./BookmarksClient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Your stack — Saved tools",
  description: "Your saved AI tools, ready to copy as a markdown stack. Bookmarks live on your device — no account required.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BookmarksPage() {
  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <BookmarksClient />
      </main>
      <Footer />
    </>
  );
}
