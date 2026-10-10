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
export function useReveal({ threshold = 0.1, rootMargin = '0px 0px -40px 0px', once = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      el.classList.add('visible');
      return;
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

    return () => {
      observer.unobserve(el);
    };
  }, [threshold, rootMargin, once]);

  return ref;
}
