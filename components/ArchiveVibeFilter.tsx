"use client";

import { useRouter } from "next/navigation";
import VibePills from "./VibePills";

export default function ArchiveVibeFilter({ activeVibe }: { activeVibe: string }) {
  const router = useRouter();

  function handleSelect(id: string) {
    const params = new URLSearchParams();
    if (id !== "all") params.set("vibe", id);
    const qs = params.toString();
    router.push(qs ? `/tools?${qs}` : "/tools");
  }

  return <VibePills active={activeVibe} onSelect={handleSelect} />;
}
