import { useEffect, useState } from 'react';
import { ctas } from '../../data/content';
import { ArrowRight } from '../ui/Icons';

/**
 * CTA discreta in fondo allo schermo, solo su mobile.
 * Compare dopo la CTA della hero e scompare quando il modulo è visibile.
 */
export function MobileStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById('hero-cta');
    const form = document.getElementById(ctas.formAnchor);
    if (!heroCta || !form || !('IntersectionObserver' in window)) return;

    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const formObserver = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      rootMargin: '0px 0px 10% 0px',
    });
    heroObserver.observe(heroCta);
    formObserver.observe(form);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !formVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/95 px-4 pt-3 backdrop-blur-md transition-[transform,opacity] duration-300 ease-out md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-hidden={!visible}
    >
      <a
        href={`#${ctas.formAnchor}`}
        tabIndex={visible ? 0 : -1}
        className="btn btn--block !min-h-12 !text-[0.75rem]"
      >
        <span>{ctas.sticky}</span>
        <ArrowRight className="btn-arrow" />
      </a>
    </div>
  );
}
