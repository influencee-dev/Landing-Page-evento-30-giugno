/* Dissolvenza delle sezioni sotto la prima schermata: usata dal caricatore (boot.ts) e dal bundle (client.tsx). */

/** Dissolvenza leggera (CSS) per le sezioni sotto la prima schermata, quando ci si arriva scorrendo. */
export function animaSezioniSotto(root: HTMLElement) {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in-anim-on');
        io.unobserve(e.target);
      }
    }),
    { rootMargin: '0px 0px -60px 0px' },
  );
  root.querySelectorAll<HTMLElement>('section.in-section').forEach((s) => {
    if (s.getBoundingClientRect().top > window.innerHeight) {
      s.classList.add('in-anim');
      io.observe(s);
    }
  });
}
