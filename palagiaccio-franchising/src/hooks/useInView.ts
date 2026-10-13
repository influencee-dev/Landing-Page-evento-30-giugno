import { useEffect, useState, type RefObject } from 'react';

/** Restituisce true mentre l'elemento è (anche parzialmente) nel viewport. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit = {},
): boolean {
  const [inView, setInView] = useState(false);
  const { root = null, rootMargin = '0px', threshold = 0 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      root,
      rootMargin,
      threshold,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, root, rootMargin, threshold]);

  return inView;
}
