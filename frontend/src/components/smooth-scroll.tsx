'use client';

import { useEffect } from 'react';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    let scrollingTimer: number | null = null;

    if (reducedMotion) {
      return;
    }

    root.style.scrollBehavior = "smooth";

    const markScrolling = () => {
      document.body.setAttribute("data-scrolling", "true");

      if (scrollingTimer) {
        window.clearTimeout(scrollingTimer);
      }

      scrollingTimer = window.setTimeout(() => {
        document.body.setAttribute("data-scrolling", "false");
      }, 120);
    };

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.length < 2) {
        return;
      }

      const section = document.querySelector(href);

      if (!section) {
        return;
      }

      event.preventDefault();
      markScrolling();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.body.setAttribute("data-scrolling", "false");
    window.addEventListener("scroll", markScrolling, { passive: true });
    document.addEventListener("click", onAnchorClick);

    return () => {
      if (scrollingTimer) {
        window.clearTimeout(scrollingTimer);
      }

      window.removeEventListener("scroll", markScrolling);
      document.removeEventListener("click", onAnchorClick);
      document.body.removeAttribute("data-scrolling");
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return <>{children}</>;
}
