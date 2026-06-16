import { cache } from "react";
import { createPublicClient } from "@/utils/supabase/public";
import { mapToolToCardProps } from "@/lib/tool-mapping";
import type { Tool } from "@/utils/supabase/types";
import type { ToolCardProps } from "@/components/ToolCard";

export type HomeData = {
  recentCards: ToolCardProps[];
  totalTools: number;
  error: boolean;
};

export const getHomeData = cache(async (): Promise<HomeData> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[home-data] Supabase error:", error.code, error.message);
    return {
      recentCards: [],
      totalTools: 0,
      error: true,
    };
  }

  const tools = (data ?? []) as Tool[];

  return {
    recentCards: tools.slice(0, 6).map((t) => mapToolToCardProps(t)),
    totalTools: tools.length,
    error: false,
  };
});
