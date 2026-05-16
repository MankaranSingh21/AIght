"use client";

// User-data sync: keeps localStorage and Supabase in agreement for bookmarks
// and the quiz result. localStorage remains the source of truth on every
// device for guest reads (avoids round-trips); the DB is canonical across
// devices once you sign in.
//
// Strategy:
// - Guest users: read/write localStorage only (no auth, no DB write).
// - On SIGNED_IN: merge localStorage → DB (insert anything DB doesn't have),
//   then overwrite localStorage with the merged DB set. localStorage and DB
//   are now in sync.
// - On every subsequent mutation: write localStorage immediately, fire-and-
//   forget a DB write if signed in. Failures don't break the UI.

import { createClient } from "@/utils/supabase/client";
import {
  loadQuizResult,
  saveQuizResult,
  QUIZ_STORAGE_KEY,
  QUIZ_CHANGED_EVENT,
  type StoredQuizResult,
} from "@/lib/quiz-storage";

const BOOKMARKS_KEY = "aight_bookmarks";
const BOOKMARKS_CHANGED_EVENT = "aight_bookmarks_changed";

function readLocalBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeLocalBookmarks(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new Event(BOOKMARKS_CHANGED_EVENT));
  } catch {
    // ignore
  }
}

// Returns the new signed-in state of the bookmark. Writes locally first;
// best-effort DB write on top.
export async function pushBookmark(slug: string, signedIn: boolean): Promise<void> {
  const existing = readLocalBookmarks();
  if (existing.includes(slug)) return;
  writeLocalBookmarks([...existing, slug]);
  if (signedIn) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_bookmarks").insert({ user_id: user.id, tool_slug: slug });
      }
    } catch {
      // Silent; localStorage already has it. Next sign-in cycle will reconcile.
    }
  }
}

export async function removeBookmark(slug: string, signedIn: boolean): Promise<void> {
  const existing = readLocalBookmarks();
  if (!existing.includes(slug)) return;
  writeLocalBookmarks(existing.filter((s) => s !== slug));
  if (signedIn) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("tool_slug", slug);
      }
    } catch {
      // ignore
    }
  }
}

// Push the latest stored quiz result to DB. No-op for guests.
export async function pushQuizResult(result: StoredQuizResult, signedIn: boolean): Promise<void> {
  if (!signedIn) return;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("user_quiz_results").upsert({
      user_id: user.id,
      taken_at: result.takenAt,
      field_slug: result.fieldSlug,
      field_name: result.fieldName,
      role_title: result.roleTitle ?? null,
      score: result.score,
      category: result.category,
      cognitive_profile: result.cognitiveProfile,
      recommended_concept_slugs: result.recommendedConceptSlugs,
      recommended_tool_slugs: result.recommendedToolSlugs,
      recommended_human_essay_slugs: result.recommendedHumanEssaySlugs,
    }, { onConflict: "user_id" });
  } catch {
    // ignore
  }
}

// Called once on SIGNED_IN. Merges local data up to the DB, then pulls the
// authoritative DB state back into localStorage.
export async function syncOnSignIn(): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // ── Bookmarks ──
    const localSlugs = readLocalBookmarks();
    if (localSlugs.length > 0) {
      const rows = localSlugs.map((slug) => ({ user_id: user.id, tool_slug: slug }));
      // ON CONFLICT DO NOTHING via .upsert with ignoreDuplicates
      await supabase.from("user_bookmarks").upsert(rows, { ignoreDuplicates: true });
    }
    const { data: dbBookmarks } = await supabase
      .from("user_bookmarks")
      .select("tool_slug")
      .eq("user_id", user.id);
    const merged = (dbBookmarks ?? []).map((b: { tool_slug: string }) => b.tool_slug);
    writeLocalBookmarks(merged);

    // ── Quiz result ── DB wins if it exists; else push local up.
    const { data: dbQuiz } = await supabase
      .from("user_quiz_results")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbQuiz) {
      const stored: StoredQuizResult = {
        version: 1,
        takenAt: dbQuiz.taken_at,
        fieldSlug: dbQuiz.field_slug,
        fieldName: dbQuiz.field_name,
        roleTitle: dbQuiz.role_title ?? undefined,
        score: dbQuiz.score,
        category: dbQuiz.category,
        cognitiveProfile: dbQuiz.cognitive_profile,
        recommendedConceptSlugs: dbQuiz.recommended_concept_slugs ?? [],
        recommendedToolSlugs: dbQuiz.recommended_tool_slugs ?? [],
        recommendedHumanEssaySlugs: dbQuiz.recommended_human_essay_slugs ?? [],
      };
      saveQuizResult(stored);
    } else {
      const localQuiz = loadQuizResult();
      if (localQuiz) await pushQuizResult(localQuiz, true);
    }

    // Tell consumers to refresh.
    window.dispatchEvent(new Event(BOOKMARKS_CHANGED_EVENT));
    window.dispatchEvent(new Event(QUIZ_CHANGED_EVENT));
  } catch {
    // Sync failure is non-fatal — site still works on localStorage alone.
  }
}
