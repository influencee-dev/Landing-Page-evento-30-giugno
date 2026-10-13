import { ctas, hero } from '../../data/content';
import { formats, startingInvestment } from '../../data/franchise';
import { ButtonLink } from '../ui/Button';
import { ArrowDown } from '../ui/Icons';
import { ImageSlot } from '../ui/ImageSlot';
import { ReviewFlag } from '../ui/ReviewFlag';
import { stagger } from '../../lib/stagger';

export function Hero() {
  const facts = [
    { k: 'Dal 1100', v: 'Mugello, Toscana' },
    { k: 'Filiera produttiva interna', v: 'Dal latte alla vendita in bottega' },
    { k: 'Due configurazioni', v: formats.map((f) => f.surface).join(' · ') },
  ];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative bg-white pt-[4.75rem] lg:pt-24">
      <div className="container-wide">
        <div className="grid items-stretch gap-10 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-12 lg:gap-0">
          {/* Testo */}
          <div className="flex flex-col justify-center pb-2 pt-10 lg:col-span-6 lg:py-12 lg:pr-12 xl:pr-20">
            <p className="hero-in t-label section-label" style={stagger(0)}>
              {hero.label}
            </p>

            <p
              className="hero-in t-kicker mt-7 max-w-md text-muted"
              style={stagger(1)}
            >
              {hero.kicker}
            </p>

            <h1
              id="hero-title"
              className="hero-in t-display mt-4 text-ink"
              style={stagger(2)}
            >
              {hero.title} <span className="text-bordeaux">{hero.titleAccent}</span>
            </h1>

            <p className="hero-in t-lead mt-7 max-w-xl text-ink/90" style={stagger(3)}>
              {hero.paragraphs[0]}
            </p>

            <div
              className="hero-in mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-t border-hairline pt-7"
              style={stagger(4)}
            >
              <div>
                <p className="t-label text-muted">
                  {hero.investmentLabel}
                  <ReviewFlag show={startingInvestment.needsReview} note={startingInvestment.reviewNote} />
                </p>
                <p className="t-figure mt-2 text-[clamp(2.25rem,1.8rem+1.4vw,3rem)] text-bordeaux">
                  {startingInvestment.value}
                </p>
              </div>
              <ButtonLink id="hero-cta" href={`#${ctas.formAnchor}`} className="max-sm:w-full">
                {ctas.primary}
              </ButtonLink>
            </div>

            <div className="hero-in mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10" style={stagger(5)}>
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted">{hero.paragraphs[1]}</p>
              <a href="#format" className="link-arrow shrink-0 self-start">
                {hero.secondaryLink}
                <ArrowDown />
              </a>
            </div>
          </div>

          {/* Immagine */}
          <div className="relative lg:col-span-6 lg:-mr-[var(--space-gutter)]">
            <ImageSlot
              image="hero"
              priority
              reveal={false}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="hero-media -mx-[var(--space-gutter)] aspect-[4/3] sm:aspect-[16/10] lg:mx-0 lg:aspect-auto lg:h-full lg:min-h-[640px]"
              as="div"
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 hidden bg-white px-6 pt-5 lg:block"
              aria-hidden="true"
            >
              <p className="t-label text-gold-deep">Bontà dal Mugello</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fatti chiave tratti dal documento */}
      <div className="container-wide">
        <ul className="grid border-t border-hairline sm:grid-cols-3">
          {facts.map((fact, i) => (
            <li
              key={fact.k}
              data-reveal
              style={stagger(i)}
              className={`flex flex-col gap-1 py-5 sm:py-7 ${i > 0 ? 'border-t border-hairline sm:border-l sm:border-t-0 sm:pl-8' : ''}`}
            >
              <span className="font-serif text-lg text-ink">{fact.k}</span>
              <span className="text-sm text-muted">{fact.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
