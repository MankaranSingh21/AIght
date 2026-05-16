// Local-only persistence for quiz results. Same pattern as bookmarks
// (components/Navbar.tsx) — no account, no DB writes.

export const QUIZ_STORAGE_KEY = "aight_quiz_result";
export const QUIZ_CHANGED_EVENT = "aight_quiz_changed";

export type CognitiveProfile = {
  // Each axis is -1.0 to +1.0 (never surfaced as labels)
  divergent_vs_convergent: number;   // - = convergent, + = divergent
  intuitive_vs_analytical: number;   // - = analytical, + = intuitive
  originator_vs_synthesist: number;  // - = synthesist, + = originator
};

export type StoredQuizResult = {
  version: 1;
  takenAt: string;        // ISO date
  fieldSlug: string;
  fieldName: string;
  roleTitle?: string;
  score: number;          // 5–85
  category: "low" | "medium" | "high";
  cognitiveProfile: CognitiveProfile;
  recommendedConceptSlugs: string[];
  recommendedToolSlugs: string[];
  recommendedHumanEssaySlugs: string[];
};

function isStoredResult(v: unknown): v is StoredQuizResult {
  if (!v || typeof v !== "object") return false;
  const r = v as Partial<StoredQuizResult>;
  return r.version === 1 && typeof r.fieldSlug === "string" && typeof r.score === "number";
}

export function loadQuizResult(): StoredQuizResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isStoredResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveQuizResult(r: StoredQuizResult): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(r));
    window.dispatchEvent(new CustomEvent(QUIZ_CHANGED_EVENT));
  } catch {
    // Storage may be unavailable (private mode, quota). Fail silent — quiz
    // still works without persistence.
  }
}

export function clearQuizResult(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(QUIZ_CHANGED_EVENT));
  } catch {
    // ignore
  }
}
