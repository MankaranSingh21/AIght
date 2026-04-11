import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

// Auth pages are always dynamic — session state changes on every request
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In — AIght",
  description: "Sign in to save your roadmap and track your AI tools.",
};

export default function LoginPage() {
  return <LoginForm />;
}
