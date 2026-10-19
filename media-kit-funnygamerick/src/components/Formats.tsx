import { ArrowRight, MapPin } from 'lucide-react';
import type { CreatorData } from '../data/types';
import { Icon } from './ui/Icon';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';
import { onSpotlightMove } from './ui/useSpotlight';

export function Formats({ creator }: { creator: CreatorData }) {
  return (
    <section id="collaborazioni" aria-labelledby="collaborazioni-title" className="section">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 hairline" />
      <div className="container-x">
        <SectionHeader
          id="collaborazioni-title"
          index="07"
          label="Formati di collaborazione"
          title={
            <>
              Let’s create something <span className="glow-text">epic.</span>
            </>
          }
          subtitle={creator.collaborationNote}
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {creator.collaborationFormats.map((f, i) => (
            <Reveal as="li" key={f.id} delay={(i % 4) * 0.07}>
              <article
                onPointerMove={onSpotlightMove}
                className="card card-hover spotlight group flex h-full flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-deep/80 text-cyan transition group-hover:border-cyan/60">
                    <Icon name={f.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-[13px] font-semibold text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-6 font-display text-lg leading-tight font-semibold tracking-wide text-ink uppercase">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.description}</p>
              </article>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.21}>
            <a
              href="#contatti"
              className="group relative flex h-full min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-cyan/40 bg-gaming/25 p-6 transition hover:border-cyan"
            >
              <span className="eyebrow">Hai un’idea diversa?</span>
              <span className="flex items-end justify-between gap-4">
                <span className="font-display text-2xl leading-tight font-bold tracking-wide text-ink uppercase">
                  Costruiamola insieme
                </span>
                <ArrowRight className="h-6 w-6 shrink-0 text-cyan transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          </Reveal>
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 flex items-center gap-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-cyan" aria-hidden="true" />
            {creator.eventsNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
