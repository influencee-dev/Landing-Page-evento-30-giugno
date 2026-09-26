import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Play } from 'lucide-react';
import { Button, Card, Container, GAP, Heading, Lead, Pill, Section, SectionHeader, TYPE, reveal, type Tone } from '../ds';
import { CASES, CREATORS, CTA, IMG, TESTIMONIALS } from '../content';

/* ─── 13 · Storytelling con tre media sfalsati ──────────────────── */
export function MediaTrio({ tone = 'white', eyebrow = 'Il nostro approccio', title = 'Storie vere,\n*non pubblicità*', lead = 'I contenuti dei creator funzionano quando raccontano esperienze reali. Per questo partiamo dalle persone e dai loro problemi di ogni giorno, non dal prodotto.', media = [IMG.campaign1, IMG.event, IMG.campaign3] }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string; media?: string[] }) {
  const offsets = ['lg:mt-24', 'lg:mt-12', 'lg:mt-0'];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="split" eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} grid items-start ${GAP.grid} sm:grid-cols-3`}>
          {media.map((src, i) => (
            <motion.div key={i} {...reveal(i)} className={`relative aspect-[9/16] overflow-hidden rounded-3xl ${offsets[i]}`}>
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 1 && (
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-float">
                  <Play className="ml-1 h-6 w-6 fill-current" />
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 14 · Progetti in evidenza (bento) ─────────────────────────── */
export function ProjectsBento({ tone = 'soft', eyebrow = 'Progetti in evidenza', title = 'Campagne di cui\n*andiamo fieri*', items = CASES }: { tone?: Tone; eyebrow?: string; title?: string; items?: typeof CASES }) {
  const [a, b, c, d] = items;
  const Tile = ({ p, className }: { p: (typeof CASES)[number]; className: string }) => (
    <motion.a href={CTA.cases.href} {...reveal()} className={`group relative block overflow-hidden rounded-3xl bg-ink ${className}`}>
      <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-x-3 top-3 flex items-center gap-2">
        <span className="flex flex-1 items-center justify-between rounded-full bg-white/95 px-4 py-2 text-sm backdrop-blur">
          <b className="truncate font-heading font-semibold">{p.tag}</b>
          <span className={`hidden pl-3 text-mute sm:inline ${TYPE.label}`}>{p.metric}</span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 transition group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </motion.a>
  );
  return (
    <Section tone={tone} id="casi">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className={`${GAP.header} mx-auto grid max-w-5xl ${GAP.grid} sm:grid-cols-5`}>
          <Tile p={a} className="aspect-[16/9] sm:col-span-5" />
          <Tile p={b} className="aspect-[3/4] sm:col-span-3 sm:row-span-2 sm:aspect-auto" />
          <Tile p={c} className="aspect-[4/3] sm:col-span-2" />
          <Tile p={d} className="aspect-[4/3] sm:col-span-2" />
        </div>
      </Container>
    </Section>
  );
}

/* ─── 15 · Video UGC + statistica ───────────────────────────────── */
export function StatVideo({ tone = 'paper', title = 'Contenuti UGC che\nportano *risultati veri*', lead = 'Ogni contenuto viene testato e ottimizzato su dati di performance, per diventare anche la tua migliore inserzione.', image = CREATORS[0].cover, video, stat = { value: '+200%', label: 'crescita follower organica' }, reverse = false }: { tone?: Tone; title?: string; lead?: string; image?: string; video?: string; stat?: { value: string; label: string }; reverse?: boolean }) {
  return (
    <Section tone={tone}>
      <Container className={`flex flex-col items-center gap-16 lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div {...reveal()} className="relative aspect-[9/14] w-full max-w-[300px] shrink-0">
          {video ? <video src={video} autoPlay muted loop playsInline className="h-full w-full rounded-3xl object-cover" /> : <img src={image} alt="" className="h-full w-full rounded-3xl object-cover" />}
          <p className="absolute inset-x-6 bottom-28 text-center text-sm font-semibold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">“Non pensavo funzionasse così bene…”</p>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="absolute -left-6 bottom-6 w-52 rounded-2xl bg-brand px-5 py-4 text-white shadow-float">
            <p className="font-heading text-3xl font-semibold tracking-tight">{stat.value}</p>
            <p className="text-sm text-white/80">{stat.label}</p>
          </motion.div>
        </motion.div>
        <div>
          <Heading text={title} />
          <Lead className="mt-6 max-w-md">{lead}</Lead>
          <div className="mt-8">
            <Button href={CTA.campaign.href} arrow>
              {CTA.campaign.label}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 18 · Casi studio a card ───────────────────────────────────── */
export function CaseCards({ tone = 'white', eyebrow = 'Casi studio', title = 'Le campagne che\n*hanno fatto la differenza*', items = CASES.slice(0, 2) }: { tone?: Tone; eyebrow?: string; title?: string; items?: typeof CASES }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader
          align="split"
          eyebrow={eyebrow}
          title={title}
          aside={
            <Button href={CTA.cases.href} variant="secondary" size="sm" arrow>
              Vedi tutti
            </Button>
          }
        />
        <div className={`${GAP.header} grid gap-8 sm:grid-cols-2`}>
          {items.map((c, i) => (
            <motion.a key={c.title} href={CTA.cases.href} {...reveal(i)} className="group block">
              <div className="overflow-hidden rounded-3xl">
                <img src={c.image} alt="" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Pill active className="px-2.5 py-1 text-xs">
                  {c.tag}
                </Pill>
                <span className="text-sm text-mute">{c.metric}</span>
              </div>
              <h3 className={`mt-3 ${TYPE.h3} group-hover:text-brand`}>{c.title}</h3>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 21 · Case study in evidenza ───────────────────────────────── */
export function CaseStudyFeature({ tone = 'paper', bigTitle = 'le nostre\n*campagne.*', client = 'Brand beauty · Lancio prodotto', tags = ['Beauty', 'Micro-creator', 'UGC'], headline = 'Abbiamo lanciato una nuova linea skincare con 12 micro-creator, dalla strategia ai contenuti fino al report finale.', text = 'Dopo un’analisi dell’audience, abbiamo scelto creator con pubblico affine e alto engagement, costruendo un calendario di contenuti e un codice sconto tracciato.', image = CREATORS[2].cover, result = { label: 'Views in 30 giorni', value: '0 → 2,4M' }, quote = TESTIMONIALS[0] }: { tone?: Tone; bigTitle?: string; client?: string; tags?: string[]; headline?: string; text?: string; image?: string; result?: { label: string; value: string }; quote?: (typeof TESTIMONIALS)[number] }) {
  return (
    <Section tone={tone}>
      <Container>
        <Heading text={bigTitle} className="text-center !text-6xl !leading-[0.85] text-ink/30 sm:!text-8xl lg:!text-9xl" />
        <div className="mt-12 flex items-center gap-4 text-sm">
          <b className="shrink-0 font-heading font-semibold">{client}</b>
          <span className="h-px flex-1 bg-line" />
          <span className="shrink-0 text-mute">*Case study in evidenza</span>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Pill key={t} className="px-2.5 py-1 text-xs">
                  {t}
                </Pill>
              ))}
            </div>
            <p className={`mt-4 ${TYPE.h3} !leading-snug sm:!text-3xl`}>{headline}</p>
            <Lead className="mt-5 max-w-sm !text-base">{text}</Lead>
            <div className="mt-6">
              <Button href={CTA.cases.href} variant="contrast" size="sm" arrow>
                Leggi il caso
              </Button>
            </div>
            <div className={`mt-12 grid grid-cols-2 items-end ${GAP.grid}`}>
              <motion.div {...reveal()}>
                <Card className="flex aspect-[4/5] flex-col justify-between p-6">
                  <b className="font-heading font-semibold">Risultati.</b>
                  <div>
                    <p className="text-sm text-mute">{result.label}</p>
                    <p className="font-heading text-2xl font-semibold tracking-tight">{result.value}</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div {...reveal(1)} className="-mt-16">
                <Card className="flex aspect-[4/6] flex-col justify-between p-6">
                  <div>
                    <img src={quote.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
                    <p className="mt-2 text-sm font-medium">{quote.name}</p>
                    <p className="text-xs text-mute">{quote.role}</p>
                  </div>
                  <p className="text-sm font-medium leading-snug">“{quote.quote}”</p>
                </Card>
              </motion.div>
            </div>
          </div>
          <motion.img {...reveal(1)} src={image} alt="" className="aspect-[4/5] w-full self-end rounded-3xl object-cover" />
        </div>
      </Container>
    </Section>
  );
}

