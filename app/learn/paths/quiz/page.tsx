import type { Metadata } from "next";
import QuizClient from "./QuizClient";
import { getAllHumanEssays } from "@/lib/human";

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
  const humanEssays = getAllHumanEssays();
  return <QuizClient humanEssays={humanEssays} />;
}
