import type { MetadataRoute } from "next";
import { createServiceClient } from "@/utils/supabase/service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient();

  const [toolsResult, roadmapsResult] = await Promise.all([
    supabase.from("tools").select("slug, created_at"),
    supabase.from("roadmaps").select("id, created_at").eq("is_public", true),
  ]);

  const toolUrls = (toolsResult.data ?? []).map((tool) => ({
    url: `${SITE_URL}/tool/${tool.slug}`,
    lastModified: new Date(tool.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const roadmapUrls = (roadmapsResult.data ?? []).map((rm) => ({
    url: `${SITE_URL}/r/${rm.id}`,
    lastModified: new Date(rm.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    ...toolUrls,
    ...roadmapUrls,
  ];
}
