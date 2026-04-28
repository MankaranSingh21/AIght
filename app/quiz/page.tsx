import { permanentRedirect } from "next/navigation";

export default function QuizRedirect() {
  permanentRedirect("/learn/paths/quiz");
}
