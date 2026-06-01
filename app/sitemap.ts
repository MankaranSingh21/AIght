import type { MetadataRoute } from "next";
import { createServiceClient } from "@/utils/supabase/service";
import { getAllConcepts } from "@/lib/learn";
import { getAllHumanEssays } from "@/lib/human";
import { getAllUseCases } from "@/lib/use-cases";
import { getAllWorkflows } from "@/lib/workflows";
import { getNativeSignalPosts } from "@/lib/signal";
import fields from "@/content/paths/fields.json";
import categories from "@/content/categories.json";

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

  const useCaseUrls = getAllUseCases().map((uc) => ({
    url: `${SITE_URL}/use-cases/${uc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const workflowUrls = getAllWorkflows().map((wf) => ({
    url: `${SITE_URL}/workflows/${wf.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const humanUrls = getAllHumanEssays().map((essay) => ({
    url: `${SITE_URL}/human/${essay.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const signalUrls = getNativeSignalPosts().map((post) => ({
    url: `${SITE_URL}/signal/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  // Top-N compare pairings — long-tail SEO for "X vs Y" searches.
  // For each category with ≥2 tools, emit the (top-1, top-2) pairing.
  // "Top" = highest utility_score, with name as tiebreaker. Once Moon fills
  // real scores this becomes meaningful ordering; until then it's
  // alphabetical-ish, which is still better than nothing in the sitemap.
  const comparePairs: MetadataRoute.Sitemap = [];
  const byCategory = new Map<string, Array<{ slug: string; utility_score: number; name: string }>>();
  for (const t of (tools ?? []) as Array<{ slug: string; created_at: string }>) {
    // (re-fetch with the fields we need; the earlier tools query only had slug+created_at)
  }
  const { data: pairTools } = await supabase
    .from("tools")
    .select("slug, name, category, utility_score, status")
    .neq("status", "deprecated");
  for (const t of pairTools ?? []) {
    if (!t.category) continue;
    const bucket = byCategory.get(t.category) ?? [];
    bucket.push({ slug: t.slug, utility_score: t.utility_score ?? 0, name: t.name });
    byCategory.set(t.category, bucket);
  }
  for (const bucket of byCategory.values()) {
    bucket.sort((x, y) => (y.utility_score - x.utility_score) || x.name.localeCompare(y.name));
    if (bucket.length < 2) continue;
    const [a, b] = bucket;
    comparePairs.push({
      url: `${SITE_URL}/compare?a=${a.slug}&b=${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.55,
    });
  }

  const categoryUrls = Object.values(categories).map((cat: any) => ({
    url: `${SITE_URL}/tools/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL,                    lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/tools`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/learn`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/learn/paths`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/learn/map`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/learn/paths/quiz`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/signal`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/use-cases`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/workflows`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/compare`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/about`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about/score`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/changelog`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5 },
    { url: `${SITE_URL}/human`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/support`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/privacy`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/terms`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    ...conceptUrls,
    ...pathUrls,
    ...toolUrls,
    ...useCaseUrls,
    ...workflowUrls,
    ...categoryUrls,
    ...humanUrls,
    ...signalUrls,
    ...comparePairs,
  ];
}
