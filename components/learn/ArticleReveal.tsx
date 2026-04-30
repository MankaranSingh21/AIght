"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ArticleReveal({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Tag every direct-content node so CSS can transition it
    const nodes = wrapper.querySelectorAll("p, h2, h3, li, blockquote");
    nodes.forEach((el) => el.classList.add("reveal-node", "is-upcoming"));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.remove("is-upcoming", "is-past");
            el.classList.add("is-active");
          } else {
            // If the element has already been seen (above fold), mark as past
            const rect = el.getBoundingClientRect();
            if (rect.bottom < 0) {
              el.classList.remove("is-active", "is-upcoming");
              el.classList.add("is-past");
            } else {
              el.classList.remove("is-active", "is-past");
              el.classList.add("is-upcoming");
            }
          }
        });
      },
      // Only the middle 40% of viewport counts as "active" — lyrics feel
      { rootMargin: "-18% 0px -18% 0px", threshold: 0 }
    );

    nodes.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="article-reveal-wrapper">
      {children}
    </div>
  );
}
