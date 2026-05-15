import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "AI Impact Quiz — find your stack",
  description:
    "A six-minute, anti-hype quiz. Tell us your field and we'll show you which AI tools actually matter for your work — and which are noise.",
  openGraph: {
    title: "AI Impact Quiz — find your stack",
    description:
      "A six-minute, anti-hype quiz. Tell us your field and we'll show you which AI tools actually matter for your work.",
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
