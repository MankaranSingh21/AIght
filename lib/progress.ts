// Local-only learning progress: XP, streaks, lesson/essay completion, badges.
// Same pattern as lib/quiz-storage.ts and bookmarks — no account, no DB
// writes, versioned shape, fail-silent, CustomEvent for cross-component sync.

import posthog from "posthog-js";

export const PROGRESS_STORAGE_KEY = "aight_progress";
export const PROGRESS_CHANGED_EVENT = "aight_progress_changed";

export type ProgressState = {
  version: 1;
  xp: number;
  streak: {
    current: number;
    longest: number;
    /** Local date of last activity, YYYY-MM-DD. */
    lastDay: string;
  };
  lessons: Record<string, { step: number; completedAt?: string; checksRight: number }>;
  conceptsRead: Record<string, string>; // slug -> ISO date
  badges: string[];
};

// XP economy — small numbers on purpose. This is a reading site, not a casino.
export const XP = {
  lessonStep: 5,
  lessonComplete: 25,
  conceptRead: 15,
  quizComplete: 20,
  firstActionOfDay: 10,
} as const;

// Levels — mono-caps in UI. Thresholds roughly double.
export const LEVELS: { name: string; xp: number }[] = [
  { name: "Browser", xp: 0 },
  { name: "Reader", xp: 50 },
  { name: "Annotator", xp: 150 },
  { name: "Cartographer", xp: 350 },
  { name: "Synthesist", xp: 700 },
  { name: "Archivist", xp: 1200 },
  { name: "Signal", xp: 2000 },
];

export type Badge = { id: string; name: string; hint: string };

export const BADGES: Badge[] = [
  { id: "first-light", name: "First Light", hint: "Finish your first lesson" },
  { id: "close-reader", name: "Close Reader", hint: "Read five essays to the end" },
  { id: "seven-days", name: "Seven Days of Signal", hint: "A seven-day streak" },
  { id: "polymath", name: "Polymath", hint: "Finish five lessons" },
];

function emptyState(): ProgressState {
  return {
    version: 1,
    xp: 0,
    streak: { current: 0, longest: 0, lastDay: "" },
    lessons: {},
    conceptsRead: {},
    badges: [],
  };
}

function isProgressState(v: unknown): v is ProgressState {
  if (!v || typeof v !== "object") return false;
  const s = v as Partial<ProgressState>;
  return (
    s.version === 1 &&
    typeof s.xp === "number" &&
    !!s.streak &&
    typeof s.streak.lastDay === "string" &&
    typeof s.lessons === "object" &&
    typeof s.conceptsRead === "object" &&
    Array.isArray(s.badges)
  );
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return isProgressState(parsed) ? parsed : emptyState();
  } catch {
    return emptyState();
  }
}

function save(state: ProgressState): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(PROGRESS_CHANGED_EVENT));
  } catch {
    // Storage unavailable (private mode, quota). Progress is a nicety —
    // everything still works without it.
  }
}

function localDay(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function capture(event: string, props?: Record<string, unknown>): void {
  try {
    posthog?.capture?.(event, props);
  } catch {
    // analytics must never break progress
  }
}

/**
 * Advance the streak for today and award the daily bonus on the first
 * action of the day. Returns the (possibly) mutated state.
 */
function touchStreak(state: ProgressState): ProgressState {
  const today = localDay();
  if (state.streak.lastDay === today) return state;

  const yesterday = localDay(new Date(Date.now() - 86_400_000));
  const continued = state.streak.lastDay === yesterday;
  const current = continued ? state.streak.current + 1 : 1;

  if (continued) capture("streak_extended", { length: current });

  return {
    ...state,
    xp: state.xp + XP.firstActionOfDay,
    streak: {
      current,
      longest: Math.max(state.streak.longest, current),
      lastDay: today,
    },
  };
}

function awardBadges(state: ProgressState): ProgressState {
  const completedLessons = Object.values(state.lessons).filter((l) => l.completedAt).length;
  const essaysRead = Object.keys(state.conceptsRead).length;

  const earned: string[] = [];
  const has = (id: string) => state.badges.includes(id) || earned.includes(id);

  if (completedLessons >= 1 && !has("first-light")) earned.push("first-light");
  if (completedLessons >= 5 && !has("polymath")) earned.push("polymath");
  if (essaysRead >= 5 && !has("close-reader")) earned.push("close-reader");
  if (state.streak.current >= 7 && !has("seven-days")) earned.push("seven-days");

  if (earned.length === 0) return state;
  for (const id of earned) capture("badge_earned", { badge: id });
  return { ...state, badges: [...state.badges, ...earned] };
}

function mutate(fn: (state: ProgressState) => ProgressState): ProgressState {
  if (typeof window === "undefined") return emptyState();
  const next = awardBadges(fn(touchStreak(loadProgress())));
  save(next);
  return next;
}

export function recordLessonStep(slug: string, step: number): ProgressState {
  return mutate((s) => {
    const existing = s.lessons[slug] ?? { step: 0, checksRight: 0 };
    if (step <= existing.step || existing.completedAt) {
      // Revisiting an old step earns nothing.
      return { ...s, lessons: { ...s.lessons, [slug]: { ...existing, step: Math.max(existing.step, step) } } };
    }
    return {
      ...s,
      xp: s.xp + XP.lessonStep * (step - existing.step),
      lessons: { ...s.lessons, [slug]: { ...existing, step } },
    };
  });
}

export function completeLesson(slug: string, checksRight: number): ProgressState {
  return mutate((s) => {
    const existing = s.lessons[slug] ?? { step: 0, checksRight: 0 };
    if (existing.completedAt) return s; // already done — no double XP
    capture("lesson_completed", { slug, checksRight });
    return {
      ...s,
      xp: s.xp + XP.lessonComplete,
      lessons: {
        ...s.lessons,
        [slug]: { ...existing, completedAt: new Date().toISOString(), checksRight },
      },
    };
  });
}

export function recordConceptRead(slug: string): ProgressState {
  return mutate((s) => {
    if (s.conceptsRead[slug]) return s;
    capture("concept_read", { slug });
    return {
      ...s,
      xp: s.xp + XP.conceptRead,
      conceptsRead: { ...s.conceptsRead, [slug]: new Date().toISOString() },
    };
  });
}

export function recordQuizComplete(): ProgressState {
  return mutate((s) => ({ ...s, xp: s.xp + XP.quizComplete }));
}

export function levelFor(xp: number): { level: Badge["name"]; next: { name: string; xp: number } | null; progress: number } {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) idx = i;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  const progress = next
    ? Math.min(1, (xp - current.xp) / (next.xp - current.xp))
    : 1;
  return { level: current.name, next, progress };
}
