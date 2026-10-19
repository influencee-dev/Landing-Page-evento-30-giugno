import { BadgeCheck, Gamepad2, Handshake, Link2, type LucideIcon } from 'lucide-react';
import type { CreatorData, PartnershipKind } from '../data/types';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';
import { onSpotlightMove } from './ui/useSpotlight';

const KIND: Record<PartnershipKind, { label: string; icon: LucideIcon }> = {
  'creator-program': { label: 'Programma creator', icon: BadgeCheck },
  'game-access': { label: 'Accesso ai giochi', icon: Gamepad2 },
  commercial: { label: 'Collaborazione commerciale', icon: Handshake },
  affiliate: { label: 'Affiliazione', icon: Link2 },
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

export function Partnerships({ creator }: { creator: CreatorData }) {
  const { partnerships, affiliatePrograms } = creator;
  const kinds = [...new Set(partnerships.map((p) => p.kind))];

  return (
    <section id="partnership" aria-labelledby="partnership-title" className="section overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 hairline" />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            id="partnership-title"
            index="05"
            label="Brands & partnerships"
            title={
              <>
                Partnership & <span className="glow-text">gaming experiences.</span>
              </>
            }
          />
          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-sm leading-relaxed text-muted">
              Programmi e piattaforme dell’industria videoludica con cui Riccardo ha lavorato. Per ognuno è indicata la
              natura del rapporto.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Legenda">
              {kinds.map((k) => {
                const K = KIND[k];
                return (
                  <li key={k} className="chip">
                    <K.icon className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
                    {K.label}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {partnerships.map((p, i) => {
            const K = KIND[p.kind];
            return (
              <Reveal as="li" key={p.name} delay={i * 0.1}>
                <article
                  onPointerMove={onSpotlightMove}
                  className="card card-hover spotlight group flex h-full flex-col p-7 sm:p-8"
                >
                  <div className="flex h-24 items-center">
                    {p.logo ? (
                      <img src={p.logo} alt={`Logo ${p.name}`} loading="lazy" className="max-h-14 w-auto max-w-[70%] object-contain opacity-90" />
                    ) : (
                      <div aria-hidden="true" className="relative flex h-20 w-20 items-center justify-center">
                        <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full text-line transition duration-700 group-hover:rotate-45 group-hover:text-cyan/60">
                          <polygon points="40,2 74,21 74,59 40,78 6,59 6,21" fill="none" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        <span className="font-display text-2xl font-bold tracking-wider text-cyan">{initials(p.name)}</span>
                      </div>
                    )}
                  </div>
                  <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
                    <K.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {K.label}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-wide text-ink uppercase">{p.name}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
                  {p.highlight && (
                    <p className="mt-auto pt-6 text-sm text-ink/80">
                      <span className="text-muted">Titolo di riferimento · </span>
                      {p.highlight}
                    </p>
                  )}
                </article>
              </Reveal>
            );
          })}
        </ul>

        {affiliatePrograms && affiliatePrograms.names.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-dashed border-line/80 px-6 py-5 sm:flex-row sm:items-center">
              <p className="flex items-center gap-2 text-sm text-muted">
                <Link2 className="h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
                {affiliatePrograms.note}
              </p>
              <ul className="flex flex-wrap gap-2 sm:ml-auto">
                {affiliatePrograms.names.map((n) => (
                  <li key={n} className="chip text-ink/90">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
