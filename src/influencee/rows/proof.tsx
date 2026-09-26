import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, TrendingUp } from 'lucide-react';
import { AvatarStack, Card, Container, CountUp, Float, GAP, Heading, Section, SectionHeader, Stars, TYPE, reveal, type Tone } from '../ds';
import { BRAND, IMG, STATS, TESTIMONIALS } from '../content';

/* ─── 06 · Testimonianza su pannello scuro ──────────────────────── */
export function TestimonialFeature({ tone = 'ink', title = 'Cosa dicono\n*brand e agenzie*', items = TESTIMONIALS, autoplay = 6000 }: { tone?: Tone; title?: string; items?: typeof TESTIMONIALS; autoplay?: number }) {
  const [i, setI] = useState(0);
  const t = items[i];
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), autoplay);
    return () => clearInterval(id);
  }, [autoplay, items.length]);
  return (
    <Section tone={tone}>
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Heading text={title} />
          <div className="mt-12 min-h-[230px]">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-acid text-ink">
                    <Quote className="h-4 w-4 fill-current" />
                  </span>
                  <p className="font-heading text-lg font-semibold">
                    {t.name} <span className="font-sans text-sm font-normal text-white/60">/ {t.role}</span>
                  </p>
                </div>
                <p className={`mt-6 max-w-lg text-white/85 ${TYPE.lead}`}>“{t.quote}”</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
            <Stars /> <b className="text-white">{BRAND.proof.rating}</b> da brand e agenzie
          </div>
          <div className="mt-8 flex gap-2">
            {items.map((_, k) => (
              <button key={k} type="button" aria-label={`Testimonianza ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-acid' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.img key={i} src={t.image} alt="" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="aspect-[5/6] w-full rounded-3xl object-cover" />
          </AnimatePresence>
          <Float className="-left-4 top-12 flex items-center gap-2 sm:-left-12">
            <span className="font-medium">120+ brand</span>
            <AvatarStack src={IMG.people.slice(0, 3)} size="h-6 w-6" />
          </Float>
          <Float className="-right-3 bottom-12 flex items-center gap-6 sm:-right-8">
            <div>
              <p className="font-semibold">Engagement</p>
              <p className="text-xs text-mute">media campagne</p>
            </div>
            <p className="font-heading text-3xl font-semibold tracking-tight">5,8%</p>
          </Float>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 17 · Carosello testimonianze ──────────────────────────────── */
export function TestimonialCarousel({ tone = 'white', eyebrow = 'Testimonianze', title = 'Trovare il creator giusto\n*è solo l’inizio*', items = TESTIMONIALS }: { tone?: Tone; eyebrow?: string; title?: string; items?: typeof TESTIMONIALS }) {
  const [i, setI] = useState(0);
  const n = items.length;
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
      </Container>
      <div className={`${GAP.header} overflow-hidden`}>
        <motion.div className="flex gap-5" animate={{ x: `calc(50vw - 12px - ${i} * (min(88vw, 760px) + 20px) - min(44vw, 380px))` }} transition={{ type: 'spring', stiffness: 70, damping: 18 }}>
          {items.map((t, k) => (
            <div key={k} className={`grid w-[min(88vw,760px)] shrink-0 gap-5 rounded-3xl bg-brand p-4 text-white transition-opacity sm:grid-cols-[2fr_3fr] ${k === i ? '' : 'opacity-50'}`}>
              <img src={t.avatar} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-auto sm:h-full" />
              <div className="flex flex-col justify-center py-4 pr-4">
                <Quote className="h-9 w-9 rounded-full bg-white p-2 text-brand" />
                <p className={`mt-5 ${TYPE.lead}`}>“{t.quote}”</p>
                <p className="mt-5 text-sm font-semibold">
                  {t.name} <span className="font-normal text-white/75">· {t.role}</span>
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="mt-8 flex justify-center gap-2">
        <button type="button" aria-label="Precedente" onClick={() => setI((v) => (v - 1 + n) % n)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-line">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Successiva" onClick={() => setI((v) => (v + 1) % n)} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </Section>
  );
}

/* ─── 23 · Mission + bento di numeri ────────────────────────────── */
export function StatsBento({ tone = 'white', eyebrow = 'Missione', title = 'Il nostro obiettivo è semplice:\n*creator che convertono*', lead = 'Ti promettiamo campagne misurabili e risultati oltre le aspettative.' }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string }) {
  const [creators, campaigns, reach, rating] = STATS;
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="split" eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} grid ${GAP.grid} md:grid-cols-3`}>
          <div className={`flex flex-col ${GAP.grid}`}>
            <motion.div {...reveal(0)}>
              <Card className="flex items-center justify-between px-6 py-4">
                <AvatarStack src={IMG.people.slice(0, 5)} />
                <span className={`${TYPE.label} text-mute`}>{campaigns.value}+ campagne</span>
              </Card>
            </motion.div>
            <motion.div {...reveal(1)} className="flex-1">
              <Card className="flex h-full flex-col justify-between p-7">
                <p className="max-w-[15rem]">Creator selezionati su dati reali di audience</p>
                <div className="mt-16">
                  <p className={TYPE.number}>
                    <CountUp to={creators.value} />
                    <span className="text-mute">{creators.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm text-mute">{creators.label}</p>
                </div>
              </Card>
            </motion.div>
          </div>
          <div className={`flex flex-col ${GAP.grid}`}>
            <motion.div {...reveal(2)} className="flex-1">
              <Card className="flex h-full flex-col justify-between p-7">
                <p className="max-w-[15rem]">Grazie a campagne progettate su obiettivi e KPI</p>
                <div className="mt-16">
                  <p className={TYPE.number}>
                    <CountUp to={reach.value} />
                    <span className="text-mute">{reach.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm text-mute">{reach.label}</p>
                </div>
              </Card>
            </motion.div>
            <motion.div {...reveal(3)}>
              <Card className={`flex items-center gap-3 px-6 py-4 ${TYPE.label} text-mute`}>
                <span className="relative flex h-3 w-3">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                Disponibili per nuove campagne
              </Card>
            </motion.div>
          </div>
          <motion.div {...reveal(4)} className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-ink p-8 text-white">
            <TrendingUp className="absolute -bottom-8 -right-6 h-64 w-64 text-white/5" strokeWidth={2.5} />
            <p className="relative text-white/80">Abbiamo seguito oltre 120 campagne aiutando brand e agenzie a lavorare meglio con i creator.</p>
            <div className="relative flex items-end justify-between gap-4">
              <p className={TYPE.number}>
                <CountUp to={rating.value} decimals={1} />
                <span className="text-2xl text-white/50">/5</span>
              </p>
              <div className="text-right">
                <Stars />
                <p className={`mt-1 max-w-[8rem] ${TYPE.label} text-white/70`}>{rating.label}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 26 · Risultati con contatori ──────────────────────────────── */
export function ResultsList({ tone = 'white', eyebrow = 'Risultati', title = '*Risultati* che parlano da soli', lead = 'Campagne costruite sul pubblico, con crescita, engagement e vendite reali.' }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string }) {
  const rows = [
    { title: 'Persone raggiunte', text: 'Contenuti dei creator che arrivano al pubblico giusto, su tutte le piattaforme.', value: 38, suffix: 'M' },
    { title: 'Interazioni generate', text: 'Like, commenti, salvataggi e condivisioni: attenzione vera, non comprata.', value: 2.6, decimals: 1, suffix: 'M' },
    { title: 'Creator nel database', text: 'Profili italiani verificati, filtrabili per nicchia, audience e performance.', value: 5000, suffix: '' },
  ];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} mx-auto max-w-4xl divide-y divide-line`}>
          {rows.map((r) => (
            <motion.div key={r.title} initial={{ opacity: 0, filter: 'blur(8px)' }} whileInView={{ opacity: 1, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-80px' }} className="flex flex-wrap items-center justify-between gap-6 py-10">
              <div className="max-w-xs">
                <p className={TYPE.h3}>{r.title}</p>
                <p className="mt-2 text-sm text-mute">{r.text}</p>
              </div>
              <p className={TYPE.numberXL}>
                <CountUp to={r.value} decimals={r.decimals} suffix={r.suffix} />
                <span className="ml-2 font-light text-brand">+</span>
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

