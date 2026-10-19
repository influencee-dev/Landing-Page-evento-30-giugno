import { MessageCircle, Radio, Repeat } from 'lucide-react';
import type { CreatorData, Datum } from '../data/types';
import { hasAudienceData } from '../lib/format';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';

export function Audience({ creator }: { creator: CreatorData }) {
  const show = hasAudienceData(creator);
  return (
    <section id="community" aria-labelledby="community-title" className="section overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(17,101,163,0.18),transparent_70%)]" />
      <div className="container-x">
        <SectionHeader
          id="community-title"
          index="06"
          label="Audience & community"
          title={
            <>
              Non solo visualizzazioni. <span className="glow-text">Persone.</span>
            </>
          }
        />
        {show ? <AudienceCharts creator={creator} /> : <CommunityStory creator={creator} />}
      </div>
    </section>
  );
}

function CommunityStory({ creator }: { creator: CreatorData }) {
  const traits = [
    { icon: MessageCircle, title: 'Risposte dirette', text: 'Commenti e messaggi li legge e li risponde lui, in prima persona.' },
    { icon: Repeat, title: 'Un appuntamento quotidiano', text: 'Da 1 a 4 short al giorno: la community sa che troverà sempre qualcosa di nuovo.' },
    { icon: Radio, title: 'Video e live', text: 'Le serie gameplay si seguono anche in diretta, giocando insieme a chi guarda.' },
  ];
  return (
    <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
      <Reveal className="lg:col-span-7">
        <blockquote className="relative border-l-2 border-cyan pl-6 sm:pl-8">
          <p className="text-xl leading-relaxed font-medium text-ink sm:text-2xl">{creator.communityNote}</p>
        </blockquote>
      </Reveal>
      <ul className="grid gap-4 lg:col-span-5">
        {traits.map((t, i) => (
          <Reveal as="li" key={t.title} delay={0.1 + i * 0.08} className="card card-hover flex gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-deep text-cyan">
              <t.icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold tracking-wide text-ink">{t.title}</span>
              <span className="mt-1 block text-[15px] leading-relaxed text-muted">{t.text}</span>
            </span>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function AudienceCharts({ creator }: { creator: CreatorData }) {
  const a = creator.audience;
  const modules: { title: string; data: Datum[] }[] = [
    { title: 'Fasce d’età', data: a.ageRanges },
    { title: 'Genere', data: a.gender },
    { title: 'Aree geografiche', data: a.topCountries },
    { title: 'Audience per piattaforma', data: a.platformSplit },
  ].filter((m) => m.data.length > 0);

  return (
    <>
      <Reveal>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">{creator.communityNote}</p>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {modules.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.08} className="card p-7">
            <h3 className="eyebrow text-muted">{m.title}</h3>
            <ul className="mt-6 space-y-4">
              {m.data.map((d) => (
                <li key={d.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-ink">{d.label}</span>
                    <span className="font-display font-semibold text-cyan tabular-nums">
                      {d.value.toLocaleString('it-IT', { maximumFractionDigits: 1 })}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-deep" aria-hidden="true">
                    <Bar value={d.value} />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      {a.engagement.length > 0 && (
        <Reveal delay={0.1}>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.engagement.map((e) => (
              <div key={e.label} className="card p-6">
                <dt className="text-xs tracking-wide text-muted uppercase">{e.label}</dt>
                <dd className="mt-2 font-display text-4xl font-bold text-ink">{e.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}
      {a.source && <p className="mt-6 text-xs text-muted">Fonte: {a.source}</p>}
    </>
  );
}

function Bar({ value }: { value: number }) {
  const w = Math.max(0, Math.min(100, value));
  return (
    <Reveal y={0} className="h-full origin-left rounded-full bg-gradient-to-r from-gaming to-cyan-bright" style={{ width: `${w}%` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}>
      {null}
    </Reveal>
  );
}
