import { Trophy } from 'lucide-react';
import type { CreatorData } from '../data/types';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';

export function About({ creator }: { creator: CreatorData }) {
  const { about, images } = creator;

  return (
    <section id="chi-sono" aria-labelledby="chi-sono-title" className="section overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-night via-deep/70 to-night" />
      <div aria-hidden="true" className="bg-dots absolute top-20 right-0 -z-10 h-80 w-80 opacity-40 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />

      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionHeader
            id="chi-sono-title"
            index="03"
            label="Chi è FunnyGameRick"
            title={
              <>
                Dietro il <span className="glow-text">controller.</span>
              </>
            }
          />

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? 'text-xl leading-relaxed text-ink/90 sm:text-2xl' : ''}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Colonna visual asimmetrica */}
        <div className="relative lg:col-span-5 lg:pt-24">
          <Reveal y={40}>{images.aboutPhoto ? <AboutPhoto creator={creator} /> : <PlayerCard creator={creator} />}</Reveal>
        </div>

        {/* Tre caratteristiche */}
        <ol className="grid gap-5 sm:grid-cols-3 lg:col-span-12 lg:mt-6">
          {about.pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.title} delay={i * 0.1} className="card card-hover p-7">
              <span className="font-display text-sm font-semibold text-cyan tabular-nums">0{i + 1}</span>
              <h3 className="mt-6 font-display text-2xl font-bold tracking-wide text-ink uppercase">{pillar.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{pillar.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AboutPhoto({ creator }: { creator: CreatorData }) {
  const photo = creator.images.aboutPhoto!;
  return (
    <figure className="relative mx-auto max-w-sm lg:mr-0 lg:ml-auto">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 384px, 90vw"
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover object-top"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/10 to-transparent" />
        <figcaption className="absolute inset-x-5 bottom-5">
          <span className="block font-display text-2xl font-bold tracking-wide text-ink uppercase">{creator.realName}</span>
          <span className="block text-sm text-cyan">{creator.handle}</span>
        </figcaption>
      </div>
    </figure>
  );
}

/** "Scheda personaggio" in stile HUD, costruita solo con fatti verificati. Usata finché manca una foto reale. */
function PlayerCard({ creator }: { creator: CreatorData }) {
  const rows: [string, string][] = [
    ['Nome', creator.realName],
    ['Classe', 'Completista'],
    ['Base', 'YouTube · TikTok · Twitch'],
    ['Specialità', creator.bannerTagline],
  ];
  const achievements = creator.highlights.map((h) => `${h.value} · ${h.label}`);
  return (
    <div className="relative mx-auto max-w-sm lg:mr-0 lg:ml-auto">
      <div className="card relative overflow-hidden p-7">
        <div className="relative flex items-center gap-4">
          <img
            src="images/avatar-192.webp"
            alt=""
            width={64}
            height={64}
            loading="lazy"
            className="h-16 w-16 rounded-2xl border border-cyan/40 object-cover"
          />
          <div>
            <p className="eyebrow text-xs">Player 1</p>
            <p className="font-display text-2xl font-bold tracking-wide text-ink uppercase">{creator.name}</p>
          </div>
        </div>

        <dl className="relative mt-7 divide-y divide-line/50 border-y border-line/50 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-right font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="relative mt-6 eyebrow text-xs">Obiettivi sbloccati</p>
        <ul className="relative mt-3 space-y-2.5">
          {achievements.map((a) => (
            <li key={a} className="flex items-center gap-3 text-sm text-ink/90">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-cyan/40 bg-cyan/10 text-cyan">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
