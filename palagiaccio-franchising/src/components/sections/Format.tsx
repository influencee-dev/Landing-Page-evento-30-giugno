import { format } from '../../data/content';
import { stagger } from '../../lib/stagger';
import { ImageSlot } from '../ui/ImageSlot';
import { ReviewFlag } from '../ui/ReviewFlag';
import { SectionLabel } from '../ui/SectionLabel';

/** Sfalsamento verticale delle tre colonne: composizione editoriale, non tre card uguali. */
const offsets = ['md:mt-0', 'md:mt-28', 'md:mt-14'];

export function Format() {
  return (
    <section id="format" aria-labelledby="format-title" className="section bg-white">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <div data-reveal>
              <SectionLabel>{format.label}</SectionLabel>
            </div>
            <h2 id="format-title" data-reveal style={stagger(1)} className="t-h2 mt-6 text-ink">
              {format.title}
            </h2>
          </div>
          <div className="prose-body text-muted lg:col-span-5 lg:col-start-8 lg:pt-14">
            {format.paragraphs.map((p, i) => (
              <p key={i} data-reveal style={stagger(i + 2)} className={i === 0 ? 't-lead text-ink/90' : ''}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <p data-reveal className="ornament t-label mt-20 text-gold-deep lg:mt-28">
          <span className="max-w-[16rem] text-center sm:max-w-none sm:shrink-0">{format.intro}</span>
        </p>

        <ol className="mt-14 grid gap-16 md:grid-cols-3 md:gap-8 lg:gap-12">
          {format.pillars.map((pillar, i) => (
            <li key={pillar.number} className={`group ${offsets[i]}`}>
              <ImageSlot
                image={pillar.imageKey}
                index={i}
                hover
                sizes="(min-width: 768px) 30vw, 100vw"
                className="aspect-[4/3] md:aspect-[4/5]"
              />
              <div data-reveal style={stagger(i)} className="mt-7">
                <div className="flex items-center gap-5">
                  <span className="font-serif text-4xl leading-none text-gold-deep lg:text-5xl">{pillar.number}</span>
                  <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
                </div>
                <h3 className="t-h3 mt-5 text-ink">
                  {pillar.title}
                  <ReviewFlag
                    show={'needsReview' in pillar && pillar.needsReview}
                    note="Verificare configurazione operativa e requisiti autorizzativi delle degustazioni."
                  />
                </h3>
                <p className="mt-4 text-muted">{pillar.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p
          data-reveal
          className="mx-auto mt-24 max-w-3xl text-center font-serif text-[clamp(1.5rem,1.15rem+1.4vw,2.375rem)] italic leading-snug text-bordeaux lg:mt-32"
        >
          {format.closing}
        </p>
      </div>
    </section>
  );
}
