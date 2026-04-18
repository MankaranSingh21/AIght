"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export default function NavAuthSection({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="
          font-body text-sm font-medium px-4 py-2 rounded-xl
          bg-moss-500 text-parchment border border-moss-600
          hover:bg-moss-600 transition-colors duration-150 shadow-moss
        "
      >
        Login
      </Link>
    );
  }

  const initials = (user.user_metadata?.full_name as string | undefined)
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
    ?? user.email?.[0].toUpperCase()
    ?? "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close account menu" : "Open account menu"}
        aria-expanded={open}
        aria-haspopup="menu"
        className="
          flex items-center gap-2.5 px-3 py-1.5 rounded-xl
          border border-moss-200 dark:border-charcoal-700 hover:border-moss-400 dark:hover:border-charcoal-600
          bg-parchment dark:bg-charcoal-800 hover:bg-moss-50 dark:hover:bg-charcoal-700
          transition-colors duration-150 select-none
        "
      >
        <span className="w-6 h-6 rounded-full bg-moss-500 text-parchment font-body text-2xs font-bold flex items-center justify-center">
          {initials}
        </span>
        <span className="font-body text-sm text-espresso dark:text-parchment hidden sm:block max-w-[120px] truncate">
          {user.user_metadata?.full_name ?? user.email}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-forest/50 dark:text-parchment/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="
            absolute right-0 top-full mt-2 z-50 min-w-[180px]
            bg-parchment dark:bg-charcoal-800 border border-moss-200 dark:border-charcoal-700
            rounded-2xl shadow-card-hover dark:shadow-card-dark-hover
            py-1.5 overflow-hidden
          "
        >
          <Link
            href="/roadmaps"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-forest dark:text-parchment hover:bg-moss-50 dark:hover:bg-charcoal-700 transition-colors duration-100"
          >
            <span aria-hidden>🗺️</span> My Canvases
          </Link>
          <div className="mx-3 my-1 h-px bg-moss-100 dark:bg-charcoal-700" role="separator" />
          <button
            role="menuitem"
            onClick={signOut}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-espresso/70 dark:text-parchment/60 hover:bg-moss-50 dark:hover:bg-charcoal-700 hover:text-espresso dark:hover:text-parchment transition-colors duration-100"
          >
            <span aria-hidden>→</span> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
