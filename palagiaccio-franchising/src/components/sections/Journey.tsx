import { useEffect, useRef, useState } from 'react';
import { ctas, journey } from '../../data/content';
import { stagger } from '../../lib/stagger';
import { ButtonLink } from '../ui/Button';
import { SectionLabel } from '../ui/SectionLabel';

/**
 * Timeline verticale: la linea si "riempie" seguendo lo scroll e ogni tappa
 * si accende quando raggiunge il centro dello schermo. Nessuno scroll hijacking.
 */
export function Journey() {
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const value = (anchor - rect.top) / rect.height;
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const steps = journey.steps.length;

  return (
    <section id="percorso" aria-labelledby="percorso-title" className="section bg-cream">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div data-reveal>
                <SectionLabel>{journey.label}</SectionLabel>
              </div>
              <h2 id="percorso-title" data-reveal style={stagger(1)} className="t-h2 mt-6 text-ink">
                {journey.title}
              </h2>
              <div data-reveal style={stagger(2)} className="mt-10 hidden lg:block">
                <ButtonLink href={`#${ctas.formAnchor}`} variant="ghost">
                  {ctas.header}
                </ButtonLink>
              </div>
            </div>
          </div>

          <ol ref={listRef} className="relative lg:col-span-7 lg:col-start-6">
            {/* binario e riempimento */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[1.4375rem] top-6 w-px bg-hairline-warm sm:left-[1.9375rem]"
            />
            <span
              aria-hidden="true"
              className="absolute left-[1.4375rem] top-6 w-px origin-top bg-bordeaux transition-transform duration-150 ease-linear sm:left-[1.9375rem]"
              style={{ bottom: '1.5rem', transform: `scaleY(${progress})` }}
            />

            {journey.steps.map((step, i) => {
              const active = progress >= (i + 0.15) / steps || progress >= 0.999;
              return (
                <li key={step.number} className="relative flex gap-6 pb-12 last:pb-0 sm:gap-10 sm:pb-16">
                  <span
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-serif text-base transition-colors duration-500 sm:h-16 sm:w-16 sm:text-xl ${
                      active ? 'border-bordeaux bg-bordeaux text-white' : 'border-hairline-warm bg-cream text-gold-deep'
                    }`}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div data-reveal className="pt-2 sm:pt-4">
                    <h3 className="t-h3 text-ink">
                      <span className="sr-only">Passo {step.number}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-muted">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
