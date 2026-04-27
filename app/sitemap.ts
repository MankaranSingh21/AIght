import type { MetadataRoute } from "next";
import { createServiceClient } from "@/utils/supabase/service";
import { getAllConcepts } from "@/lib/learn";
import fields from "@/content/paths/fields.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient();

  const { data: tools } = await supabase
    .from("tools")
    .select("slug, created_at");

  const toolUrls = (tools ?? []).map((tool) => ({
    url: `${SITE_URL}/tool/${tool.slug}`,
    lastModified: new Date(tool.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const conceptUrls = getAllConcepts().map((concept) => ({
    url: `${SITE_URL}/learn/${concept.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const pathUrls = fields.map((field) => ({
    url: `${SITE_URL}/learn/paths/${field.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: SITE_URL,                    lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/tools`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/learn`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/learn/paths`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/learn/map`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/learn/paths/quiz`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/signal`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/privacy`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/terms`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    ...conceptUrls,
    ...pathUrls,
    ...toolUrls,
  ];
}
