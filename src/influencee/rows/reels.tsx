import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BadgeCheck, Heart, MessageCircle, Music2, Play, Send } from 'lucide-react';
import { Button, Container, Eyebrow, GAP, Heading, Lead, Marquee, Section, SectionHeader, TYPE, reveal, type Tone } from '../ds';
import { CREATORS_DB, NICHE_INFO, fmtFollowers, type Creator } from '../site/data';

/* ════════════════════════════════════════════════════════════════════
   REEL — card verticale con interfaccia Reels/TikTok ricostruita in HTML:
   barre di avanzamento, zoom lento (effetto video), azioni laterali,
   didascalia e brano. Con file video reali basta passare `video`.
   ════════════════════════════════════════════════════════════════════ */

const CAPTIONS: Record<string, string> = {
  food: 'La pasta fresca che ordino ogni venerdì 🍝 codice nel link',
  fitness: 'Allenamento da 20 minuti, zero scuse 💪',
  beauty: 'Routine della sera in 3 step ✨ la uso da un mese',
  travel: 'Weekend perfetto a due ore da casa 🧳',
  fashion: 'Tre look con un solo capo: salva il reel',
  tech: 'Unboxing onesto: pro e contro dopo 2 settimane',
  family: 'La nostra mattina in 60 secondi ☕',
  gaming: 'Clip della live di ieri sera 🎮',
};

export function ReelCard({ c, video, delay = 0, className = '' }: { c: Creator; video?: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const views = fmtFollowers(Math.round(c.followers * (2.2 + (c.er % 3))));
  const likes = fmtFollowers(Math.round(c.followers * (c.er / 100) * 3));
  return (
    <div className={`relative aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-ink text-white shadow-float ${className}`}>
      {video ? (
        <video src={video} poster={c.cover} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <motion.img
          src={c.cover}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
          animate={reduce ? undefined : { scale: [1, 1.14], x: ['0%', '-3%'] }}
          transition={{ duration: 9, delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />

      {/* barre di avanzamento */}
      <div className="absolute inset-x-3 top-3 flex gap-1">
        {[0, 1, 2].map((k) => (
          <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            {k === 0 && <motion.span className="block h-full bg-white" initial={{ width: '0%' }} animate={reduce ? { width: '100%' } : { width: ['0%', '100%'] }} transition={{ duration: 6, delay, repeat: Infinity, ease: 'linear' }} />}
          </span>
        ))}
      </div>
      <span className="absolute right-3 top-7 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
        <Play className="h-2.5 w-2.5 fill-current" /> {views}
      </span>

      {/* azioni laterali */}
      <div className="absolute bottom-24 right-2.5 flex flex-col items-center gap-3.5 text-[10px] font-semibold">
        <span className="flex flex-col items-center gap-0.5">
          <Heart className="h-6 w-6 fill-brand text-brand" />
          {likes}
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <MessageCircle className="h-6 w-6" />
          {Math.round(c.er * 37)}
        </span>
        <Send className="h-6 w-6" />
        <motion.img src={c.avatar} alt="" className="h-7 w-7 rounded-full border-2 border-white/80 object-cover" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
      </div>

      {/* didascalia */}
      <div className="absolute inset-x-3 bottom-3 pr-9">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold">
          <img src={c.avatar} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-white/70" />
          {c.handle}
          <BadgeCheck className="h-3.5 w-3.5 fill-brand text-white" />
        </p>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-white/90">{CAPTIONS[c.niche]}</p>
        <p className="mt-1.5 flex items-center gap-1 overflow-hidden whitespace-nowrap text-[10px] text-white/75">
          <Music2 className="h-3 w-3 shrink-0" /> Audio originale · {c.name}
        </p>
      </div>
    </div>
  );
}

/* ─── 49 · Strip di reel ────────────────────────────────────────── */
export function ReelsStrip({
  tone = 'ink',
  eyebrow = 'Reel',
  title = 'I reel dei nostri *creator*',
  lead = 'Contenuti reali delle campagne: formati verticali pensati per fermare lo scroll e portare risultati.',
  creators = CREATORS_DB.slice(0, 5),
}: {
  tone?: Tone;
  eyebrow?: string;
  title?: string;
  lead?: string;
  creators?: Creator[];
}) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="split" eyebrow={eyebrow} title={title} lead={lead} aside={<div className="mt-6"><Button href="#creator" arrow>Scopri i creator</Button></div>} />
      </Container>
      <div className={`${GAP.header} flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:mx-auto lg:grid lg:max-w-[1200px] lg:grid-cols-5 lg:items-center lg:overflow-visible lg:px-10 [scrollbar-width:none]`}>
        {creators.map((c, i) => (
          <motion.a key={c.slug} href={`#creator.${c.slug}`} {...reveal(i)} className={`block w-[62vw] max-w-[260px] shrink-0 snap-center lg:w-auto lg:max-w-none ${i === 2 ? 'lg:scale-[1.08]' : ''}`}>
            <ReelCard c={c} delay={i * 0.8} />
            <p className="mt-3 text-center text-xs opacity-70">
              {NICHE_INFO[c.niche].name} · {fmtFollowers(c.followers)} follower
            </p>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}

/* ─── 50 · Muro di reel ─────────────────────────────────────────── */
export function ReelWall({
  tone = 'white',
  eyebrow = 'Contenuti',
  title = 'Contenuti che\n*fermano lo scroll*',
  lead = 'Ogni campagna produce decine di reel, stories e video UGC: pubblicati dai creator e riutilizzabili nelle tue ads.',
  stats = [
    ['2,4M', 'views medie per campagna'],
    ['5,8%', 'engagement medio'],
    ['40+', 'contenuti per campagna'],
  ],
}: {
  tone?: Tone;
  eyebrow?: string;
  title?: string;
  lead?: string;
  stats?: string[][];
}) {
  const cols = [CREATORS_DB.slice(0, 2), CREATORS_DB.slice(2, 4), CREATORS_DB.slice(4, 6), CREATORS_DB.slice(6, 8)];
  const offsets = ['', 'lg:mt-20', 'lg:mt-8', 'lg:mt-28'];
  return (
    <Section tone={tone}>
      <Container className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader align="left" eyebrow={eyebrow} title={title} lead={lead} />
          <dl className="mt-10 space-y-5">
            {stats.map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-4 border-t border-line pt-5">
                <dt className={`${TYPE.number} !text-4xl text-brand`}>{v}</dt>
                <dd className="text-sm text-mute">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {cols.map((col, k) => (
            <div key={k} className={`space-y-4 sm:space-y-5 ${offsets[k]} ${k > 1 ? 'hidden lg:block' : ''}`}>
              {col.map((c, i) => (
                <motion.a key={c.slug} href={`#creator.${c.slug}`} {...reveal(k + i)} className="block">
                  <ReelCard c={c} delay={(k * 2 + i) * 0.6} />
                </motion.a>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 51 · Hero reel su fondo nero (pagine creator) ─────────────────
   Regola: tutte le pagine della categoria creator (elenco, nicchia,
   profilo, candidatura) aprono con questa hero: nero, testo centrato,
   reel che scorrono sotto.                                            */
export function HeroReels({
  crumbs,
  eyebrow = 'Creator',
  title = 'I creator che fanno\n*parlare di te*',
  lead = 'Profili verificati in tutte le nicchie, scelti su audience, engagement e affinità con il tuo brand.',
  creators = CREATORS_DB,
  actions,
  children,
}: {
  crumbs?: React.ReactNode;
  eyebrow?: string;
  title?: string;
  lead?: string;
  creators?: Creator[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const list = creators.length < 6 ? [...creators, ...CREATORS_DB.filter((c) => !creators.includes(c))].slice(0, 8) : creators;
  return (
    <Section tone="ink" pad="none" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(ellipse_at_top,rgba(255,31,143,0.28),transparent_65%)]" />
      <Container className="text-center">
        {crumbs}
        <motion.div {...reveal()} className="mx-auto mt-10 max-w-4xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mt-6" />
          <Lead className="mx-auto mt-6 max-w-xl">{lead}</Lead>
          {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </Container>
      <Marquee className="mt-14 pb-8" speed="animate-[marquee_45s_linear_infinite]">
        {list.map((c, i) => (
          <a key={c.slug} href={`#creator.${c.slug}`} className={`block w-44 shrink-0 sm:w-52 ${i % 2 ? 'translate-y-6' : ''}`}>
            <ReelCard c={c} delay={i * 0.5} />
          </a>
        ))}
      </Marquee>
    </Section>
  );
}

