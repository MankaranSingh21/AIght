import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "../(auth)/AuthForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to save your bookmarks, quiz result, and reading trajectory across devices.",
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          padding: "var(--space-20) var(--space-8)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <Suspense fallback={null}>
            <AuthForm mode="signin" />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
