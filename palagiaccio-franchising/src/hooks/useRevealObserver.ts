import { useEffect } from 'react';

/**
 * Attiva le animazioni di ingresso: ogni elemento con [data-reveal] o
 * [data-reveal-media] riceve la classe .is-visible quando entra nel viewport.
 * Un solo IntersectionObserver per tutta la pagina; ogni elemento si anima una volta.
 */
export function useRevealObserver() {
  useEffect(() => {
    const selector = '[data-reveal], [data-reveal-media]';
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
