import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, CalendarDays, CreditCard, Instagram, Music2, PlayCircle, Youtube, Twitch } from 'lucide-react';
import { AvatarStack, Button, Card, Container, Eyebrow, Float, Heading, Lead, Marquee, Navbar, Pill, Section, SocialProof, TYPE, reveal, type Tone } from '../ds';
import { BRAND, CASES, CREATORS, CTA, IMG } from '../content';
import { BrowserFrame, PhoneFrame, PlatformMock, PostCard, StoryCard } from '../mocks';
import CurvedMarquee, { CURVES } from '../../rows/CurvedMarquee';
import type { HeroBase } from './heroes-a';

function HeroShell({ tone, showNav = true, children }: { tone: Tone; showNav?: boolean; children: React.ReactNode }) {
  return (
    <Section tone={tone} pad="hero">
      {showNav ? <Navbar /> : <div className="h-8" />}
      {children}
    </Section>
  );
}

/* ─── 10 · Hero con card a ventaglio (stories | post) ───────────── */
export function HeroFan({
  tone,
  showNav,
  variant = 'stories',
  title,
  lead = 'Pianifichiamo, selezioniamo e coordiniamo i creator per lanci di prodotto, campagne sempre attive e test creativi per le ads.',
}: HeroBase & { variant?: 'stories' | 'posts' }) {
  const stories = variant === 'stories';
  const t: Tone = tone ?? (stories ? 'white' : 'ink');
  const heading = title ?? (stories ? 'Contenuti creator\ncostruiti per *fermare lo scroll*' : 'Fai parlare di te\n*le persone giuste*');
  const fan = stories
    ? [
        { x: '-62%', r: -6, s: 0.86 },
        { x: '0%', r: 0, s: 1 },
        { x: '62%', r: 6, s: 0.86 },
      ]
    : [
        { x: '-90%', r: -12, s: 0.95 },
        { x: '0%', r: 0, s: 1 },
        { x: '90%', r: 12, s: 0.95 },
      ];
  const cards = [CREATORS[1], CREATORS[0], CREATORS[2]];
  return (
    <HeroShell tone={t} showNav={showNav}>
      <Container className="relative z-10 pt-12 text-center sm:pt-16">
        <motion.div {...reveal()}>
          <Heading as="h1" size="display" text={heading} className="mx-auto max-w-5xl" />
          <Lead className="mx-auto mt-6 max-w-xl">{lead}</Lead>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={CTA.campaign.href} arrow>
              {CTA.campaign.label}
            </Button>
            <Button href={CTA.creator.href} variant="secondary">
              {CTA.creator.label}
            </Button>
          </div>
        </motion.div>
      </Container>
      <div className="relative mt-14 h-[330px] sm:h-[430px]">
        {stories && (
          <>
            <CurvedMarquee items={['Il tuo motore di crescita con i creator', '38M+ persone raggiunte']} bg="#c8ff1a" color="#0a0a0a" fontClass="font-heading font-semibold" className="absolute inset-x-0 top-24 h-48 w-full" duration={40} />
            <CurvedMarquee items={['Il tuo motore di crescita con i creator', '38M+ persone raggiunte']} bg="#ff1f8f" fontClass="font-heading font-semibold" className="absolute inset-x-0 top-32 z-[3] h-48 w-full" duration={34} />
          </>
        )}
        {cards.map((c, i) => (
          <motion.div
            key={c.handle}
            initial={{ opacity: 0, y: 80, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: fan[i].r }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 80 }}
            style={{ zIndex: i === 1 ? 2 : 0, x: fan[i].x, scale: fan[i].s }}
            className={`absolute left-1/2 top-0 -ml-[105px] w-[210px] sm:-ml-[135px] sm:w-[270px] ${stories ? 'aspect-[9/14]' : 'aspect-[4/5]'}`}
          >
            {stories ? <StoryCard image={c.cover} avatar={c.avatar} handle={c.handle} meta={c.followers} /> : <PostCard image={c.cover} avatar={c.avatar} handle={c.handle} meta={c.niche} />}
          </motion.div>
        ))}
      </div>
    </HeroShell>
  );
}

/* ─── 11 · Hero telefono + widget flottanti ─────────────────────── */
export function HeroWidgets({ tone = 'white', showNav, title = '*Influencer marketing*\nper brand che vogliono crescere', lead = 'Dalla scelta dei creator alla produzione dei contenuti: risultati misurabili che spostano il business.' }: HeroBase) {
  const c = CREATORS[0];
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Container className="pt-12 text-center sm:pt-16">
        <motion.div {...reveal()}>
          <Heading as="h1" size="display" text={title} className="mx-auto max-w-5xl" />
          <Lead className="mx-auto mt-6 max-w-xl">{lead}</Lead>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={CTA.campaign.href}>{CTA.campaign.label}</Button>
            <Button href={CTA.platform.href} variant="secondary">
              {CTA.platform.label}
            </Button>
          </div>
        </motion.div>
        <div className="relative mx-auto mt-14 flex max-w-5xl justify-center">
          <div className="absolute left-0 top-4 hidden w-52 space-y-4 text-left md:block lg:left-10">
            <motion.div {...reveal(1)} className="rounded-3xl bg-white p-5 shadow-float">
              <p className="text-sm font-medium">Audience</p>
              <div className="relative mx-auto mt-3 h-24 w-24 rounded-full" style={{ background: 'conic-gradient(#ff1f8f 0 46%, #c8ff1a 46% 78%, #0a0a0a 78% 100%)' }}>
                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white text-[10px] leading-tight">
                  <b className="text-sm">68%</b>donne 25–34
                </div>
              </div>
            </motion.div>
            <motion.div {...reveal(2)} className="-ml-6 w-44 rounded-2xl bg-ink p-4 text-white shadow-float">
              <p className="text-right text-xs text-white/60">Engagement rate</p>
              <div className="flex items-end justify-between">
                <span className="flex items-end gap-0.5">
                  {[3, 6, 4, 10].map((h, i) => (
                    <span key={i} className="w-2 rounded-sm bg-acid" style={{ height: h * 1.6 }} />
                  ))}
                </span>
                <span className="font-heading text-2xl font-semibold">6,2%</span>
              </div>
            </motion.div>
          </div>
          <motion.div {...reveal(1)} className="w-60 sm:w-72">
            <PhoneFrame className="aspect-[9/14] rounded-b-none border-b-0 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
              <img src={c.avatar} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 top-7 flex items-center gap-2 p-3 text-left text-white">
                <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
                <span className="text-xs leading-tight">
                  <b className="block">{c.name}</b>
                  {c.handle}
                </span>
                <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs font-semibold">● Live</span>
              </div>
            </PhoneFrame>
          </motion.div>
          <div className="absolute right-0 top-4 hidden w-52 space-y-4 text-left md:block lg:right-10">
            <motion.div {...reveal(2)} className="flex gap-3 rounded-3xl bg-white p-4 shadow-float">
              <div className="flex-1">
                <p className="text-sm font-medium">Codice sconto</p>
                <p className="text-xs text-mute">usato oggi</p>
                <p className="mt-2 font-heading text-2xl font-semibold">312</p>
              </div>
              <img src={IMG.campaign2} alt="" className="h-16 w-14 rounded-xl object-cover" />
            </motion.div>
            <motion.div {...reveal(3)} className="relative ml-6 rounded-3xl bg-white p-2 shadow-float">
              <img src={CREATORS[2].cover} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <span className="absolute -left-4 top-1/2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">29,2K ♥</span>
            </motion.div>
          </div>
        </div>
      </Container>
    </HeroShell>
  );
}

/* ─── 12 · Hero UGC a tre colonne ───────────────────────────────── */
export function HeroUGC({ tone = 'white', showNav, title = 'UGC che fa crescere il tuo *brand.*', services = ['Contenuti UGC', 'Influencer marketing', 'Campagne per agenzie'] }: HeroBase & { services?: string[] }) {
  const imgs = CREATORS.slice(0, 3).map((c) => c.cover);
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + imgs.length) % imgs.length);
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <CurvedMarquee items={services.map((s) => s.toUpperCase())} path={CURVES.wave} bg="#c8ff1a" color="#0a0a0a" separator="•" fontClass="font-heading font-semibold" className="absolute inset-x-0 top-[52%] z-[1] h-[42%] w-full" />
      <Container className="grid gap-10 pt-10 sm:pt-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <motion.div {...reveal()} className="relative z-[2]">
          <Heading as="h1" size="display" text={title} className="max-w-sm" />
          <ul className="mt-6 space-y-1.5">
            {services.map((s) => (
              <li key={s} className={`flex items-center gap-2 ${TYPE.label}`}>
                <Asterisk className="h-4 w-4 text-brand" /> {s}
              </li>
            ))}
          </ul>
        </motion.div>
        <div className="relative z-[2] mx-auto h-[420px] w-[260px]">
          {[2, 1].map((off) => (
            <div key={off} className="absolute inset-0 overflow-hidden rounded-3xl bg-muted" style={{ transform: `translateX(${-off * 18}px) scale(${1 - off * 0.05})` }}>
              <img src={imgs[(i + off) % imgs.length]} alt="" className="h-full w-full object-cover opacity-50" />
            </div>
          ))}
          <AnimatePresence mode="popLayout">
            <motion.img key={i} src={imgs[i]} alt="" initial={{ opacity: 0, x: 60, rotate: 4 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -60, rotate: -4 }} className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-float" />
          </AnimatePresence>
          <div className="absolute -right-8 bottom-24 flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-sm text-white">
            <button type="button" onClick={() => go(-1)} aria-label="Precedente">
              <ArrowLeft className="h-4 w-4" />
            </button>
            Sfoglia
            <button type="button" onClick={() => go(1)} aria-label="Successiva">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <motion.div {...reveal(1)} className="relative z-[2] flex flex-col justify-between gap-14 lg:h-[420px]">
          <a href={CTA.cases.href} className="group flex items-start gap-3">
            <img src={IMG.event} alt="" className="h-20 w-16 rounded-2xl object-cover" />
            <span>
              <Pill active className="px-2 py-0.5 text-[10px]">
                NOVITÀ
              </Pill>
              <span className="mt-1 block max-w-[11rem] font-heading font-semibold leading-tight">Case study: 12 creator per un lancio beauty</span>
            </span>
            <ArrowUpRight className="ml-auto h-8 w-8 rounded-full bg-paper p-2 transition group-hover:rotate-45" />
          </a>
          <div>
            <Lead className="max-w-xs">
              Aiutiamo i brand a creare contenuti che si connettono davvero con il pubblico, <b className="text-ink">in modo costante e misurabile.</b>
            </Lead>
            <div className="mt-6">
              <Button href={CTA.campaign.href} variant="contrast" arrow>
                {CTA.campaign.label}
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </HeroShell>
  );
}

/* ─── 24 · Hero con calendario pubblicazioni ────────────────────── */
const SCHEDULE = [
  { day: 'LUN', date: '22 GIU', items: [{ who: CREATORS[0], what: 'Reel · lancio prodotto', time: '12:30' }] },
  { day: 'MAR', date: '23 GIU', items: [{ who: CREATORS[2], what: 'Stories · codice sconto', time: '18:00' }, { who: CREATORS[4], what: 'Post carosello', time: '20:15' }] },
  { day: 'GIO', date: '25 GIU', items: [{ who: CREATORS[1], what: 'TikTok · challenge', time: '19:00' }] },
  { day: 'SAB', date: '27 GIU', items: [{ who: CREATORS[3], what: 'YouTube · recensione', time: '10:00' }] },
  { day: 'MAR', date: '30 GIU', items: [{ who: CREATORS[5], what: 'Live · unboxing', time: '21:00' }] },
];

export function HeroCalendar({ tone = 'white', showNav, title = 'Ogni creator, *ogni post*, sotto controllo', lead = 'Calendario condiviso, approvazioni e pubblicazioni: la tua campagna organizzata al minuto, senza fogli Excel.' }: HeroBase) {
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Container className="grid gap-12 pt-6 lg:grid-cols-[1.3fr_1fr]">
        <motion.div {...reveal()} className="py-10 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 ring-1 ring-emerald-200">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" /> Disponibili per nuove campagne
          </span>
          <Heading as="h1" size="display" text={title} className="mt-6" />
          <Lead className="mt-6 max-w-md">{lead}</Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={CTA.demo.href} variant="contrast">
              {CTA.demo.label}
            </Button>
            <Button href={CTA.platform.href} variant="secondary">
              <PlayCircle className="h-4 w-4" /> Guarda come funziona
            </Button>
          </div>
          <SocialProof className="mt-10" />
        </motion.div>
        <div className="relative hidden h-[620px] overflow-hidden lg:block [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_85%,transparent)]">
          <motion.div className="space-y-5 px-2" animate={{ y: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
            {[...SCHEDULE, ...SCHEDULE].map((d, i) => (
              <div key={i} className={`rounded-3xl bg-white shadow-card ${i % 2 ? 'rotate-[1.5deg]' : '-rotate-1'}`}>
                <div className="flex justify-between border-b border-dashed border-line px-5 py-3 text-xs text-mute">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {d.day}
                  </span>
                  <span>{d.date}</span>
                </div>
                {d.items.map((it, k) => (
                  <div key={k} className={`flex items-center gap-3 px-5 py-3.5 ${k ? 'border-t border-dashed border-line' : ''}`}>
                    <img src={it.who.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-sm font-medium">{it.who.handle}</p>
                      <p className="text-xs text-mute">{it.what}</p>
                    </div>
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-ink">{it.time}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </HeroShell>
  );
}

/* ─── 27 · Hero centrata con 3 varianti di contenuto ────────────── */
export function HeroCentered({ tone = 'white', showNav, variant = 'marquee' }: HeroBase & { variant?: 'marquee' | 'work' | 'contact' }) {
  const copy = {
    marquee: { title: 'Aiutiamo i brand a\n*vincere sui social*', lead: 'Raggiungiamo il pubblico giusto con i creator giusti: contenuti, gestione e advertising sulle piattaforme che contano.' },
    work: { title: 'Dentro le nostre campagne *migliori*', lead: 'Esempi reali di come i creator hanno aiutato i brand a crescere, coinvolgere e vendere.' },
    contact: { title: 'Facciamo *crescere*\nil tuo brand', lead: 'Raccontaci obiettivi e budget: ti mostriamo come trasformare l’attenzione in risultati concreti.' },
  }[variant];
  const cats = ['Tutti', 'Beauty', 'Food', 'Eventi', 'Agenzie'];
  const [cat, setCat] = useState('Tutti');
  const [service, setService] = useState('Influencer marketing');
  const [budget, setBudget] = useState('€5–15K');
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Container className="pt-12 text-center sm:pt-16">
        <motion.div {...reveal()}>
          <Heading as="h1" size="display" text={copy.title} className="mx-auto max-w-4xl" />
          <Lead className="mx-auto mt-5 max-w-lg">{copy.lead}</Lead>
          {variant === 'marquee' && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={CTA.campaign.href} variant="contrast">
                {CTA.campaign.label}
              </Button>
              <Button href={CTA.platform.href} variant="secondary">
                {CTA.platform.label}
              </Button>
            </div>
          )}
          <SocialProof className="mt-7 justify-center" />
        </motion.div>
      </Container>

      {variant === 'marquee' && (
        <Marquee className="mt-14">
          {CREATORS.map((c) => (
            <div key={c.handle} className="aspect-[3/4] w-56 shrink-0 sm:w-60">
              <StoryCard image={c.cover} avatar={c.avatar} handle={c.handle} badge={c.followers} />
            </div>
          ))}
        </Marquee>
      )}

      {variant === 'work' && (
        <Container className="mt-10">
          <div className="flex flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)}>
                <Pill active={cat === c}>{c}</Pill>
              </button>
            ))}
          </div>
          <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {CASES.filter((w) => cat === 'Tutti' || w.tag === cat).map((w) => (
              <motion.a layout key={w.title} href={CTA.cases.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative overflow-hidden rounded-3xl text-left">
                <img src={w.image} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 text-sm backdrop-blur">
                  <b className="font-heading font-semibold">{w.title}</b>
                  <span className="shrink-0 pl-3 text-mute">{w.metric}</span>
                </span>
              </motion.a>
            ))}
          </motion.div>
        </Container>
      )}

      {variant === 'contact' && (
        <Container className="mt-12 grid gap-4 text-left sm:gap-5 md:grid-cols-[1fr_2fr]">
          <div className="space-y-4">
            {['Risposta in 24 ore', 'Proposta su misura', 'Risultati misurabili'].map((s, i) => (
              <Card key={s} className="p-6">
                <p className="flex items-center gap-2 font-heading font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] text-white">0{i + 1}</span>
                  {s}
                </p>
                <p className="mt-2 text-sm text-mute">{['Leggiamo ogni richiesta e ti rispondiamo entro un giorno lavorativo.', 'Niente pacchetti generici: partiamo da obiettivi, pubblico e budget.', 'Dalla reach alle vendite: concordiamo i KPI prima di partire.'][i]}</p>
              </Card>
            ))}
          </div>
          <Card className="p-6 sm:p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Nome e cognome', 'Mario Rossi', 'text'],
                  ['Email aziendale', 'mario@brand.it', 'email'],
                ].map(([l, ph, type]) => (
                  <label key={l} className="block font-medium">
                    {l}
                    <input type={type} placeholder={ph} className="mt-2 w-full rounded-2xl bg-paper px-4 py-3 font-normal outline-none ring-1 ring-line focus:ring-brand" />
                  </label>
                ))}
              </div>
              {[
                ['Cosa ti serve?', ['Influencer marketing', 'Contenuti UGC', 'Piattaforma agenzie', 'Tutto'], service, setService],
                ['Budget indicativo', ['< €5K', '€5–15K', '€15–50K', '€50K+'], budget, setBudget],
              ].map(([label, opts, val, set]) => (
                <div key={label as string}>
                  <p className="mb-2 font-medium">{label as string}</p>
                  <div className="flex flex-wrap gap-2">
                    {(opts as string[]).map((o) => (
                      <button key={o} type="button" onClick={() => (set as (v: string) => void)(o)}>
                        <Pill active={val === o}>{o}</Pill>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <label className="block font-medium">
                Raccontaci il progetto
                <textarea rows={3} placeholder="Brand, obiettivi, tempistiche…" className="mt-2 w-full rounded-2xl bg-paper px-4 py-3 font-normal outline-none ring-1 ring-line focus:ring-brand" />
              </label>
              <Button type="submit">Invia richiesta</Button>
            </form>
          </Card>
        </Container>
      )}
    </HeroShell>
  );
}

/* ─── 29 · Hero centrata con icone e dashboard ──────────────────── */
const TILES = [
  { Icon: Instagram, pos: 'left-[5%] top-28', r: -6 },
  { Icon: Youtube, pos: 'right-[5%] top-28', r: 6 },
  { Icon: Music2, pos: 'left-[8%] top-80', r: 5 },
  { Icon: Twitch, pos: 'right-[8%] top-80', r: -5 },
];

export function HeroDashboard({ tone = 'white', showNav, title = 'Trasforma i dati dei creator\nin *scelte intelligenti*', lead = 'Una sola piattaforma per trovare creator, lanciare campagne e misurare ROI, reach e vendite. Senza caos.' }: HeroBase) {
  return (
    <HeroShell tone={tone} showNav={showNav}>
      {TILES.map(({ Icon, pos, r }, i) => (
        <span key={i} className={`absolute hidden h-20 w-20 animate-float items-center justify-center rounded-3xl bg-paper text-brand shadow-card ring-4 ring-white lg:flex ${pos}`} style={{ animationDelay: `${i * 0.7}s`, ['--r' as string]: `${r}deg` }}>
          <Icon className="h-9 w-9" />
        </span>
      ))}
      <Container className="pt-12 text-center sm:pt-16">
        <motion.div {...reveal()}>
          <Eyebrow>Piattaforma {BRAND.name}</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mx-auto mt-6 max-w-4xl" />
          <Lead className="mx-auto mt-5 max-w-lg">{lead}</Lead>
          <div className="mt-8 flex justify-center">
            <Button href={CTA.demo.href}>{CTA.demo.label}</Button>
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-mute">
            <CreditCard className="h-4 w-4 text-brand" /> Demo gratuita, nessun impegno
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative mx-auto mt-14 max-w-5xl">
          <div className="absolute -inset-x-10 -bottom-10 top-10 rounded-[40px] bg-brand/15 blur-3xl" />
          <BrowserFrame className="relative">
            <PlatformMock rows={4} />
          </BrowserFrame>
          <Float className="-left-4 top-24 hidden items-center gap-2 sm:flex lg:-left-12">
            <AvatarStack src={IMG.people.slice(0, 3)} size="h-6 w-6" /> 1.284 creator trovati
          </Float>
          <Float className="-right-4 bottom-10 hidden sm:block lg:-right-10">
            <p className="text-xs text-mute">ROI campagna</p>
            <p className="font-heading text-2xl font-semibold">4,1x</p>
          </Float>
        </motion.div>
      </Container>
    </HeroShell>
  );
}

