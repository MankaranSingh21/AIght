"use client";
import { useEffect } from "react";

const READ_KEY = "aight_learn_read";

export default function ReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    let marked = false;

    function check() {
      if (marked) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= window.innerHeight || scrolled / total >= 0.7) {
        marked = true;
        try {
          const raw = localStorage.getItem(READ_KEY);
          const slugs: string[] = raw ? JSON.parse(raw) : [];
          if (!slugs.includes(slug)) {
            slugs.push(slug);
            localStorage.setItem(READ_KEY, JSON.stringify(slugs));
          }
        } catch {}
        window.removeEventListener("scroll", check);
      }
    }

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, [slug]);

  return null;
}
