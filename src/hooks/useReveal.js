import { useEffect, useRef } from 'react';

/**
 * useReveal
 *
 * Attaches an IntersectionObserver to the returned ref.
 * When the element scrolls into view, the `.visible` class is added,
 * triggering the CSS reveal animation defined in index.css.
 *
 * Options:
 *  - threshold: fraction of element visible before triggering (default 0.1)
 *  - rootMargin: margin around root (default '0px 0px -40px 0px')
 *  - once: if true, only triggers once (default true)
 */
export function useReveal({
  threshold = 0.08,
  rootMargin = '0px 0px -30px 0px',
  once = true,
  immediate = false,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || immediate) {
      el.classList.add('visible');
      return;
    }

    // Check if element is already in the viewport on initial render
    if (typeof window !== 'undefined') {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) {
        // Schedule next frame to allow entrance animation to play smoothly
        const rafId = requestAnimationFrame(() => {
          if (el) el.classList.add('visible');
        });
        if (once) {
          return () => cancelAnimationFrame(rafId);
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (once) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    // Defensive fallback: ensure content is never permanently hidden if an observer fails
    const fallbackTimer = setTimeout(() => {
      if (el && !el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    }, 1200);

    return () => {
      clearTimeout(fallbackTimer);
      observer.unobserve(el);
    };
  }, [threshold, rootMargin, once, immediate]);

  return ref;
}
