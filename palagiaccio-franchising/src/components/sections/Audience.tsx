import { audience } from '../../data/content';
import { stagger } from '../../lib/stagger';
import { CheckLine } from '../ui/Icons';
import { SectionLabel } from '../ui/SectionLabel';

export function Audience() {
  return (
    <section aria-labelledby="profilo-title" className="section bg-white">
      <div className="container-site">
        <div data-reveal>
          <SectionLabel>{audience.label}</SectionLabel>
        </div>
        <h2
          id="profilo-title"
          data-reveal
          style={stagger(1)}
          className="t-display mt-7 max-w-5xl text-[clamp(2rem,1.5rem+2.4vw,3.75rem)] text-ink"
        >
          {audience.title}
        </h2>

        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="prose-body text-muted lg:col-span-5">
            {audience.paragraphs.map((p, i) => (
              <p key={i} data-reveal style={stagger(i)} className={i === 0 ? 't-lead text-ink/90' : ''}>
                {p}
              </p>
            ))}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div data-reveal className="border-l-2 border-bordeaux bg-cream px-7 py-9 sm:px-10 sm:py-11">
              <h3 className="t-label text-bordeaux">{audience.listTitle}</h3>
              <ul className="mt-7 space-y-5">
                {audience.traits.map((trait, i) => (
                  <li key={trait} data-reveal style={stagger(i)} className="flex gap-4">
                    <CheckLine className="mt-1.5 shrink-0 text-gold-deep" />
                    <span className="font-serif text-[1.0625rem] leading-snug text-ink sm:text-lg">{trait}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p data-reveal className="mt-20 max-w-4xl font-serif text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-[1.3] lg:mt-28">
          <span className="block text-ink">{audience.closing[0]}</span>
          <span className="block italic text-bordeaux">{audience.closing[1]}</span>
        </p>
      </div>
    </section>
  );
}
