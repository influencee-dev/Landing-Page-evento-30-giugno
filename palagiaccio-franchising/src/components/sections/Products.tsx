import { products } from '../../data/content';
import { sourcing } from '../../data/franchise';
import { stagger } from '../../lib/stagger';
import { ImageSlot } from '../ui/ImageSlot';
import { SectionLabel } from '../ui/SectionLabel';

export function Products() {
  const [, referencesNumber] = sourcing.references.split(' ');

  return (
    <section id="prodotti" aria-labelledby="prodotti-title" className="section bg-cream">
      <div className="container-site">
        {/* Apertura: mosaico fotografico + testo */}
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4 lg:col-span-7">
            <ImageSlot
              image="products"
              hover
              sizes="(min-width: 1024px) 38vw, 66vw"
              className="col-span-2 aspect-[4/3] sm:col-span-4 sm:row-span-2 sm:aspect-[4/5]"
            />
            <ImageSlot
              image="productsDairy"
              index={1}
              hover
              sizes="(min-width: 1024px) 18vw, 33vw"
              className="col-span-1 aspect-square self-start sm:col-span-2"
            />
            <ImageSlot
              image="productsPantry"
              index={2}
              hover
              sizes="(min-width: 1024px) 18vw, 33vw"
              className="col-span-1 aspect-square self-end sm:col-span-2 sm:aspect-[2/3]"
            />
          </div>

          <div className="flex flex-col lg:col-span-5 lg:pl-6">
            <div data-reveal>
              <SectionLabel>{products.label}</SectionLabel>
            </div>
            <h2 id="prodotti-title" data-reveal style={stagger(1)} className="t-h2 mt-6 text-ink">
              {products.title}
            </h2>
            <p data-reveal style={stagger(2)} className="t-lead mt-7 text-ink/90">
              {products.intro}
            </p>

            <div data-reveal style={stagger(3)} className="mt-auto flex items-end gap-5 border-t border-hairline-warm pt-8 lg:mt-12">
              <p className="t-numeral text-bordeaux">
                <span className="sr-only">circa </span>
                {referencesNumber}
              </p>
              <p className="pb-2 text-sm leading-snug text-muted">
                <span aria-hidden="true" className="t-label block text-gold-deep">
                  circa
                </span>
                {products.referencesLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Specialità del marchio */}
        <div data-reveal className="mt-24 border-y border-hairline-warm py-10 text-center lg:mt-32">
          <p className="t-label text-gold-deep">{products.signatureLabel}</p>
          <ul className="mt-5 flex flex-col items-center gap-y-1 font-serif text-[clamp(1.625rem,1.1rem+1.8vw,2.75rem)] italic leading-tight text-ink sm:flex-row sm:flex-wrap sm:justify-center">
            {products.signatures.map((name, i) => (
              <li key={name} className="flex items-center">
                {i > 0 && (
                  <span className="mx-5 hidden text-gold sm:inline" aria-hidden="true">
                    ·
                  </span>
                )}
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">{products.signatureNote}</p>
        </div>

        {/* Offerta + approvvigionamento */}
        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h3 data-reveal className="t-h3 text-ink">
              {products.listTitle}
            </h3>
            <ol className="mt-8">
              {products.categories.map((cat, i) => (
                <li
                  key={cat}
                  data-reveal
                  style={stagger(i)}
                  className="flex gap-6 border-t border-hairline-warm py-4 last:border-b"
                >
                  <span className="t-label w-6 shrink-0 pt-1 text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-ink/90">{cat}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h3 data-reveal className="t-h3 text-ink">
              {products.sourcingTitle}
            </h3>

            <div data-reveal style={stagger(1)} className="mt-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="t-figure text-[clamp(2.75rem,2.2rem+2vw,4rem)] text-bordeaux">{sourcing.casaMadre}%</p>
                  <p className="mt-1 max-w-[12rem] text-sm text-muted">{products.sourcingCasaMadre}</p>
                </div>
                <div className="text-right">
                  <p className="t-figure text-[clamp(2rem,1.7rem+1.2vw,2.75rem)] text-gold-deep">{sourcing.territorio}%</p>
                  <p className="mt-1 max-w-[12rem] text-sm text-muted">{products.sourcingTerritorio}</p>
                </div>
              </div>
              {/* barra proporzionale semplice, nessun grafico complesso */}
              <div className="mt-6 flex h-2 w-full gap-1" aria-hidden="true">
                <span className="h-full bg-bordeaux" style={{ width: `${sourcing.casaMadre}%` }} />
                <span className="h-full flex-1 bg-gold" />
              </div>
            </div>

            <p data-reveal style={stagger(2)} className="mt-8 text-muted">
              {products.sourcingText}
            </p>
            <p data-reveal style={stagger(3)} className="t-kicker mt-8 text-ink">
              {products.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
