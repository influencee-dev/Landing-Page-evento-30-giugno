import type { ContentPillar, CreatorData } from '../data/types';
import { Icon } from './ui/Icon';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';
import { onSpotlightMove } from './ui/useSpotlight';

const SPAN: Record<ContentPillar['size'], string> = {
  large: 'md:col-span-2 md:row-span-1 lg:col-span-2',
  tall: 'md:row-span-2 lg:row-span-2',
  regular: '',
};

export function ContentUniverse({ creator }: { creator: CreatorData }) {
  return (
    <section id="contenuti" aria-labelledby="contenuti-title" className="section">
      <div className="container-x">
        <SectionHeader
          id="contenuti-title"
          index="04"
          label="Content universe"
          title={
            <>
              Il gaming è solo <span className="glow-text">l’inizio.</span>
            </>
          }
          subtitle="Dai gameplay ai meme: contenuti diversi, un’unica personalità."
        />

        <ul className="mt-14 grid auto-rows-[minmax(15rem,auto)] gap-5 md:grid-cols-3">
          {creator.contentPillars.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08} className={SPAN[p.size]}>
              <article
                onPointerMove={onSpotlightMove}
                className="card card-hover spotlight group relative flex h-full flex-col overflow-hidden p-7 sm:p-8"
              >
                <PillarArt variant={i} />
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-deep/80 text-cyan transition duration-500 group-hover:border-cyan/60 group-hover:shadow-[0_0_30px_-6px_rgba(53,217,255,0.6)]">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-display text-xs tracking-[0.25em] text-muted">0{i + 1}</span>
                </div>
                {p.size === 'tall' && <ShortFeedArt />}
                <div className="relative mt-auto pt-16">
                  <h3 className={`display text-ink ${p.size === 'large' ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}>{p.title}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{p.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Formati">
                    {p.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Tre schermi verticali stilizzati: riempie la card alta dello short form. */
function ShortFeedArt() {
  return (
    <div aria-hidden="true" className="relative mt-10 hidden h-56 items-center justify-center md:flex">
      {[-14, 0, 14].map((rot, i) => (
        <div
          key={rot}
          className={`absolute flex h-48 w-[6.5rem] items-end rounded-2xl border p-2.5 transition duration-700 ${
            i === 1
              ? 'z-10 border-cyan/60 bg-gradient-to-b from-gaming/50 to-deep shadow-[0_0_40px_-10px_rgba(53,217,255,0.6)] group-hover:-translate-y-2'
              : 'border-line bg-deep/80'
          }`}
          style={{ transform: `rotate(${rot}deg) translateX(${rot * 5}px)` }}
        >
          <div className="w-full space-y-1.5">
            <div className="h-1 w-3/4 rounded-full bg-ink/30" />
            <div className="h-1 w-1/2 rounded-full bg-ink/20" />
            <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-line">
              <div className={`h-full bg-cyan ${i === 1 ? 'w-2/3' : 'w-1/4'}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Piccole illustrazioni astratte (SVG) per differenziare le card. */
function PillarArt({ variant }: { variant: number }) {
  const common = 'pointer-events-none absolute -top-6 -right-6 h-48 w-48 text-cyan opacity-25 transition duration-700 group-hover:opacity-50 group-hover:rotate-6';
  if (variant === 0)
    return (
      <svg aria-hidden="true" viewBox="0 0 200 200" className={`${common} h-64 w-64`} fill="none" stroke="currentColor">
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M0 ${150 - i * 9} C 60 ${60 + i * 6}, 120 ${200 - i * 12}, 200 ${40 + i * 7}`} strokeWidth="0.8" />
        ))}
      </svg>
    );
  if (variant === 1)
    return (
      <svg aria-hidden="true" viewBox="0 0 200 200" className={common} fill="none" stroke="currentColor">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={60 + i * 10} y={20 + i * 10} width={70} height={124} rx={12} strokeWidth="0.9" />
        ))}
      </svg>
    );
  if (variant === 2)
    return (
      <svg aria-hidden="true" viewBox="0 0 200 200" className={common} fill="none" stroke="currentColor">
        {[24, 44, 64, 84].map((r) => (
          <circle key={r} cx="130" cy="70" r={r} strokeWidth="0.8" strokeDasharray={r > 50 ? '3 6' : undefined} />
        ))}
      </svg>
    );
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={common} fill="none" stroke="currentColor">
      {[0, 1, 2].map((i) => (
        <polygon key={i} points="130,10 190,45 190,115 130,150 70,115 70,45" strokeWidth="0.8" transform={`rotate(${i * 20} 130 80) scale(${1 - i * 0.18}) translate(${i * 28} ${i * 16})`} />
      ))}
    </svg>
  );
}
