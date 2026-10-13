import { support } from '../../data/content';
import { stagger } from '../../lib/stagger';
import { Flourish } from '../ui/Icons';
import { ImageSlot } from '../ui/ImageSlot';
import { SectionLabel } from '../ui/SectionLabel';

export function Support() {
  return (
    <section id="supporto" aria-labelledby="supporto-title" className="section bg-cream">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <ImageSlot
                image="support"
                hover
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div data-reveal>
              <SectionLabel>{support.label}</SectionLabel>
            </div>
            <h2 id="supporto-title" data-reveal style={stagger(1)} className="t-h2 mt-6 text-ink">
              {support.title}
            </h2>
            <p data-reveal style={stagger(2)} className="t-lead mt-7 text-ink/90">
              {support.intro}
            </p>

            <ol className="mt-12 grid gap-x-10 sm:grid-cols-2">
              {support.services.map((service, i) => (
                <li
                  key={service.title}
                  data-reveal
                  style={stagger(i % 2)}
                  className="border-t border-hairline-warm pb-9 pt-6"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="t-label w-5 shrink-0 text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="t-h4 text-ink">{service.title}</h3>
                  </div>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted sm:pl-9">{service.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <figure data-reveal className="mx-auto mt-24 max-w-4xl text-center lg:mt-32">
          <Flourish className="mx-auto h-4 w-20 text-gold" />
          <blockquote className="mt-8 font-serif text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-[1.35] text-bordeaux">
            {support.closing}
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
