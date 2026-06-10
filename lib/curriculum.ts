import { cache } from "react";
import rawTracks from "@/content/curriculum/tracks.json";
import { getAllConcepts, type ConceptMeta } from "@/lib/learn";
import { hasLesson } from "@/lib/lessons";

/**
 * Curriculum tracks — ordered roadmaps over concepts. A node either points
 * at a live concept (validated against content/learn at build time — a typo
 * throws) or is an explicit `soon: true` placeholder carrying its own title,
 * so roadmaps can ship before every essay exists.
 */

type RawNode = {
  concept: string;
  optional?: boolean;
  soon?: boolean;
  title?: string;
  tagline?: string;
};

type RawTrack = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  audience: string;
  order: number;
  nodes: RawNode[];
};

export type TrackNode = {
  slug: string;
  title: string;
  tagline: string;
  optional: boolean;
  soon: boolean;
  readTime?: string;
  difficulty?: ConceptMeta["difficulty"];
  hasLesson: boolean;
};

export type Track = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  audience: string;
  order: number;
  nodes: TrackNode[];
  liveCount: number;
  soonCount: number;
  lessonCount: number;
};

export const getTracks = cache((): Track[] => {
  const concepts = new Map(getAllConcepts().map((c) => [c.slug, c]));

  return (rawTracks as RawTrack[])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((t) => {
      const nodes: TrackNode[] = t.nodes.map((n) => {
        if (n.soon) {
          if (!n.title) {
            throw new Error(
              `[curriculum] "${t.slug}" soon-node "${n.concept}" needs a title`
            );
          }
          return {
            slug: n.concept,
            title: n.title,
            tagline: n.tagline ?? "",
            optional: n.optional ?? false,
            soon: true,
            hasLesson: false,
          };
        }
        const c = concepts.get(n.concept);
        if (!c) {
          throw new Error(
            `[curriculum] "${t.slug}" references unknown concept "${n.concept}" — fix the slug or mark it soon`
          );
        }
        return {
          slug: c.slug,
          title: c.title,
          tagline: c.tagline,
          optional: n.optional ?? false,
          soon: false,
          readTime: c.readTime,
          difficulty: c.difficulty,
          hasLesson: hasLesson(c.slug),
        };
      });

      return {
        slug: t.slug,
        title: t.title,
        eyebrow: t.eyebrow,
        description: t.description,
        audience: t.audience,
        order: t.order,
        nodes,
        liveCount: nodes.filter((n) => !n.soon).length,
        soonCount: nodes.filter((n) => n.soon).length,
        lessonCount: nodes.filter((n) => n.hasLesson).length,
      };
    });
});

export function getTrack(slug: string): Track | null {
  return getTracks().find((t) => t.slug === slug) ?? null;
}
