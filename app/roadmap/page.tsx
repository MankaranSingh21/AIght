import { redirect } from "next/navigation";

// Legacy route — all traffic redirected to the new multi-canvas dashboard.
export default function RoadmapRedirect() {
  redirect("/roadmaps");
}
