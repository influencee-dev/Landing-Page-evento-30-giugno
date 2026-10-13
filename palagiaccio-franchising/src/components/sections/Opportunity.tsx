import { ctas, opportunity } from '../../data/content';
import { conditions, formatLabels, formats, investmentNote } from '../../data/franchise';
import { stagger } from '../../lib/stagger';
import { ButtonLink } from '../ui/Button';
import { ImageSlot } from '../ui/ImageSlot';
import { ReviewFlag } from '../ui/ReviewFlag';
import { SectionLabel } from '../ui/SectionLabel';

export function Opportunity() {
  return (
    <section id="investimento" aria-labelledby="investimento-title" className="section bg-white">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <div data-reveal>
              <SectionLabel>{opportunity.label}</SectionLabel>
            </div>
            <h2 id="investimento-title" data-reveal style={stagger(1)} className="t-h2 mt-6 text-ink">
              {opportunity.title}
            </h2>
          </div>
          <p data-reveal style={stagger(2)} className="t-lead text-muted lg:col-span-4 lg:col-start-9">
            {opportunity.intro}
          </p>
        </div>

        {/* Due configurazioni a confronto */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-0 lg:mt-20">
          {formats.map((f, i) => (
            <article
              key={f.id}
              aria-labelledby={`format-${f.id}`}
              className={`group flex flex-col border border-hairline ${
                i === 1 ? 'bg-cream md:border-l-0' : 'bg-white'
              }`}
            >
              <ImageSlot
                image={f.imageKey}
                index={i}
                hover
                sizes="(min-width: 768px) 45vw, 100vw"
                className="aspect-[16/9]"
              />
              <div className="flex flex-1 flex-col p-7 sm:p-10 lg:p-12">
                <div data-reveal style={stagger(i)}>
                  <p className="t-label text-gold-deep">Configurazione {String(i + 1).padStart(2, '0')}</p>
                  <h3 id={`format-${f.id}`} className="t-h3 mt-3 text-ink">
                    {f.name}
                  </h3>
                </div>

                <dl className="mt-8 flex flex-1 flex-col">
                  <div data-reveal style={stagger(i + 1)} className="border-t border-hairline-warm py-6">
                    <dt className="t-label text-muted">
                      {formatLabels.investment}
                      <ReviewFlag show={f.needsReview} note={f.reviewNote} />
                    </dt>
                    <dd className="t-figure mt-3 text-[clamp(2rem,1.6rem+1.6vw,3rem)] text-bordeaux">{f.investment}</dd>
                  </div>
                  <div data-reveal style={stagger(i + 2)} className="border-t border-hairline-warm py-6">
                    <dt className="t-label text-muted">{formatLabels.surface}</dt>
                    <dd className="t-figure mt-3 text-[clamp(1.5rem,1.3rem+0.8vw,2rem)] text-ink">{f.surface}</dd>
                  </div>
                  <div data-reveal style={stagger(i + 3)} className="mt-auto border-t border-hairline-warm pt-6">
                    <dt className="t-label text-muted">{formatLabels.concept}</dt>
                    <dd className="mt-3 font-serif text-lg italic leading-snug text-ink">{f.concept}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        <p data-reveal className="mt-6 flex max-w-3xl gap-3 text-sm leading-relaxed text-muted">
          <span aria-hidden="true" className="text-gold-deep">
            *
          </span>
          {investmentNote}
        </p>

        {/* Condizioni di affiliazione */}
        <div className="mt-24 grid gap-12 border-t border-ink/80 pt-14 lg:mt-32 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <div className="lg:col-span-4">
            <h3 data-reveal className="t-h2 text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] text-ink">
              {opportunity.conditionsTitle}
            </h3>
            <p data-reveal style={stagger(1)} className="mt-6 text-muted">
              {opportunity.conditionsClosing}
            </p>
            <div data-reveal style={stagger(2)} className="mt-10 hidden lg:block">
              <ButtonLink href={`#${ctas.formAnchor}`}>{ctas.dossier}</ButtonLink>
            </div>
          </div>

          <dl className="lg:col-span-7 lg:col-start-6">
            {conditions.map((c, i) => (
              <div
                key={c.label}
                data-reveal
                style={stagger(i)}
                className="grid gap-1 border-b border-hairline py-6 first:pt-0 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-baseline sm:gap-8"
              >
                <dt className="t-label text-muted">
                  {c.label}
                  <ReviewFlag show={c.needsReview} note={c.reviewNote} />
                </dt>
                <dd className="t-figure text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] text-ink">{c.value}</dd>
              </div>
            ))}
          </dl>

          <div className="lg:hidden">
            <ButtonLink href={`#${ctas.formAnchor}`} block>
              {ctas.dossier}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
