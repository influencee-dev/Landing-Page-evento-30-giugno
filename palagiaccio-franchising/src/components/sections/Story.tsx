import { story } from '../../data/content';
import { stagger } from '../../lib/stagger';
import { Flourish } from '../ui/Icons';
import { ImageSlot } from '../ui/ImageSlot';
import { SectionLabel } from '../ui/SectionLabel';

export function Story() {
  const [territory, roots, ...rest] = story.paragraphs;

  return (
    <section id="storia" aria-labelledby="storia-title" className="section overflow-hidden bg-cream">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Composizione fotografica */}
          <div className="relative lg:col-span-6 lg:pr-6">
            <ImageSlot
              image="history"
              hover
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/5] w-full sm:w-[86%] lg:w-full"
            />
            <ImageSlot
              image="historyDetail"
              index={2}
              hover
              sizes="(min-width: 1024px) 20vw, 45vw"
              className="absolute -bottom-10 right-0 aspect-square w-[46%] border-[6px] border-cream sm:-bottom-12 sm:w-[40%] lg:-right-10 lg:w-[44%] lg:border-8"
            />
          </div>

          {/* Testo */}
          <div className="relative pt-10 lg:col-span-5 lg:col-start-8 lg:pt-0">
            <p
              aria-hidden="true"
              data-reveal="fade"
              className="pointer-events-none absolute -top-14 right-0 hidden select-none sm:block font-serif text-giant leading-none tracking-tight text-bordeaux/[0.07] sm:-top-14 lg:-top-24 lg:right-[-3rem]"
            >
              {story.year}
            </p>

            <div className="relative">
              <div data-reveal>
                <SectionLabel>{story.label}</SectionLabel>
              </div>
              <h2 id="storia-title" data-reveal style={stagger(1)} className="t-h2 mt-6 text-ink">
                {story.title}
              </h2>
              <p data-reveal style={stagger(2)} className="t-kicker mt-6 text-bordeaux">
                {story.kicker}
              </p>

              <div data-reveal style={stagger(3)} className="prose-body mt-8 text-muted">
                <p>{territory}</p>
              </div>

              <p
                data-reveal
                className="mt-10 border-l border-gold pl-6 font-serif text-[1.375rem] leading-snug text-ink lg:text-2xl"
              >
                {roots}
              </p>

              <div data-reveal className="prose-body mt-10 text-muted">
                {rest.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>

              {/* La filiera citata nel testo, resa come sequenza tipografica */}
              <ol
                aria-label="La filiera Il Palagiaccio"
                className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
              >
                {story.chain.map((step, i) => (
                  <li key={step} data-reveal style={stagger(i)} className="flex items-center gap-3">
                    {i > 0 && <span className="h-px w-5 bg-gold" aria-hidden="true" />}
                    <span className="t-label text-[0.6875rem] text-gold-deep">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Obiettivo */}
        <figure data-reveal className="mx-auto mt-28 max-w-4xl text-center lg:mt-36">
          <Flourish className="mx-auto h-4 w-20 text-gold" />
          <blockquote className="mt-8 font-serif text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] italic leading-[1.35] text-ink">
            {story.closing}
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
