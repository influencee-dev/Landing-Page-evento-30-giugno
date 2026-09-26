import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCircle2, FileBarChart, Play, UserPlus } from 'lucide-react';
import { AvatarStack, Button, Container, Eyebrow, Float, Heading, Lead, Marquee, Navbar, Section, SocialProof, Stars, TYPE, reveal, type Tone } from '../ds';
import { BRAND, CREATORS, CTA, IMG, NICHES } from '../content';
import { BrowserFrame, PhoneFrame, PlatformMock, StoryCard } from '../mocks';

export interface HeroBase {
  tone?: Tone;
  showNav?: boolean;
  title?: string;
  lead?: string;
}

function HeroShell({ tone, showNav = true, children }: { tone: Tone; showNav?: boolean; children: React.ReactNode }) {
  return (
    <Section tone={tone} pad="hero">
      {showNav ? <Navbar /> : <div className="h-8" />}
      {children}
    </Section>
  );
}

/* ─── 01 · Hero titolo + pillola ────────────────────────────────── */
function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="in-sp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9a3ff" />
          <stop offset="0.6" stopColor="#6c3cff" />
          <stop offset="1" stopColor="#0e0e14" />
        </linearGradient>
      </defs>
      <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0Z" fill="url(#in-sp)" />
    </svg>
  );
}

export function HeroPill({ tone = 'paper', showNav, title = 'Creator giusti, campagne che portano', lead = 'Troviamo i creator perfetti per il tuo brand analizzando audience, engagement e affinità. Poi gestiamo tutto, dal brief al report.' }: HeroBase) {
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Sparkle className="pointer-events-none absolute left-[5%] top-32 hidden w-16 animate-float drop-shadow-xl md:block" />
      <Sparkle className="pointer-events-none absolute bottom-40 right-[6%] hidden w-10 animate-float drop-shadow-xl md:block [animation-delay:1.5s]" />
      <Container className="pt-12 text-center sm:pt-20">
        <motion.div {...reveal()} className="flex justify-center">
          <SocialProof className="rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-card" />
        </motion.div>
        <motion.h1 {...reveal(1)} className={`mx-auto mt-8 max-w-5xl ${TYPE.display}`}>
          {title}{' '}
          <span className="inline-block rounded-full bg-brand px-4 pb-1 text-white sm:px-6">
            <em className="font-accent font-normal italic">risultati.</em>
          </span>
        </motion.h1>
        <motion.div {...reveal(2)}>
          <Lead className="mx-auto mt-6 max-w-xl">{lead}</Lead>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={CTA.campaign.href}>{CTA.campaign.label}</Button>
            <Button href={CTA.cases.href} variant="secondary">
              {CTA.cases.label}
            </Button>
          </div>
        </motion.div>
      </Container>
      <Marquee className="mt-16">
        {NICHES.map((n) => (
          <span key={n} className="flex items-center gap-2 px-4 font-heading text-lg font-semibold tracking-tight text-ink/80">
            <span className="h-2 w-2 rotate-45 bg-brand" /> {n}
          </span>
        ))}
      </Marquee>
    </HeroShell>
  );
}

/* ─── 02 · Hero VSL con video ───────────────────────────────────── */
export function HeroVideo({
  tone = 'ink',
  showNav,
  title = 'Influencer marketing *senza improvvisare*',
  lead = 'Guarda in 2 minuti come selezioniamo i creator, lanciamo la campagna e misuriamo ogni risultato.',
  poster = IMG.event,
  videoSrc,
}: HeroBase & { poster?: string; videoSrc?: string }) {
  const [play, setPlay] = useState(false);
  const dark = isDarkTone(tone);
  return (
    <HeroShell tone={tone} showNav={showNav}>
      {isDarkTone(tone) && <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(ellipse_at_top,rgba(108,60,255,0.35),transparent_65%)]" />}
      <Container className="pt-12 text-center sm:pt-16">
        <motion.div {...reveal()}>
          <Eyebrow>Metodo {BRAND.name}</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mx-auto mt-6 max-w-4xl" />
          <Lead className="mx-auto mt-5 max-w-xl">{lead}</Lead>
        </motion.div>
        <motion.div {...reveal(1)} className="relative mx-auto mt-12 aspect-video max-w-4xl overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-[0_40px_120px_-30px_rgba(108,60,255,0.55)]">
          {play && videoSrc ? (
            videoSrc.endsWith('.mp4') ? (
              <video src={videoSrc} autoPlay controls className="h-full w-full object-cover" />
            ) : (
              <iframe src={videoSrc} allow="autoplay; fullscreen" title="Video" className="h-full w-full" />
            )
          ) : (
            <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label="Riproduci video">
              <img src={poster} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-ink/25" />
              <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-float transition group-hover:scale-110">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </span>
            </button>
          )}
        </motion.div>
        <div className="mt-10 flex flex-col items-center gap-5">
          <Button href={CTA.demo.href} variant={dark ? 'contrast' : 'primary'}>
            {CTA.demo.label}
          </Button>
          <SocialProof />
        </div>
      </Container>
    </HeroShell>
  );
}
const isDarkTone = (t: Tone) => t === 'ink' || t === 'brand';

/* ─── 03 · Hero con story card ──────────────────────────────────── */
export function HeroStories({ tone = 'white', showNav, title = 'I creator che fanno\n*crescere il tuo brand*', lead = 'Strategia, selezione, contenuti e advertising con i creator: un solo team, un solo report.' }: HeroBase) {
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Container className="pt-12 text-center sm:pt-16">
        <motion.div {...reveal()}>
          <Eyebrow>Agenzia di influencer marketing</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mx-auto mt-6 max-w-4xl" />
          <Lead className="mx-auto mt-5 max-w-lg">{lead}</Lead>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={CTA.cases.href} variant="secondary">
              {CTA.cases.label}
            </Button>
            <Button href={CTA.campaign.href} variant="contrast">
              {CTA.campaign.label}
            </Button>
          </div>
        </motion.div>
        <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {CREATORS.slice(0, 3).map((c, i) => (
            <motion.div key={c.handle} {...reveal(i + 1)} whileHover={{ y: -6 }} className="aspect-[9/13] shadow-card">
              <StoryCard image={c.cover} avatar={c.avatar} handle={c.handle} meta={c.niche} badge={`${c.followers} follower`} />
            </motion.div>
          ))}
        </div>
      </Container>
    </HeroShell>
  );
}

/* ─── 05 · Hero split con ritratto ──────────────────────────────── */
function Chevrons() {
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="in-chev" width="44" height="36" patternUnits="userSpaceOnUse">
          <path d="M2 4 L22 18 L42 4 M2 20 L22 34 L42 20" fill="none" stroke="#6c3cff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#in-chev)" />
    </svg>
  );
}

export function HeroPortrait({ tone = 'paper', showNav, title = 'Il ponte tra *brand e creator*', lead = 'Da un lato i brand che vogliono risultati, dall’altro i creator che vogliono collaborazioni serie. Noi li mettiamo in contatto, con metodo.', portrait = IMG.people[1] }: HeroBase & { portrait?: string }) {
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Container className="grid items-center gap-14 pt-10 sm:pt-16 lg:grid-cols-2">
        <motion.div {...reveal()}>
          <Eyebrow>Ciao, siamo {BRAND.name}</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mt-6" />
          <Lead className="mt-6 max-w-md">{lead}</Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={CTA.campaign.href} arrow>
              {CTA.campaign.label}
            </Button>
            <Button href={CTA.creator.href} variant="secondary" arrow>
              {CTA.creator.label}
            </Button>
          </div>
        </motion.div>
        <motion.div {...reveal(1)} className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-soft">
            <Chevrons />
            <img src={portrait} alt="" className="absolute inset-x-8 bottom-0 top-10 h-[calc(100%-2.5rem)] w-[calc(100%-4rem)] rounded-t-[2rem] object-cover [mask-image:linear-gradient(to_bottom,black_78%,transparent)]" />
          </div>
          <Float className="-left-4 top-1/4 flex items-center gap-2 sm:-left-14">
            <span className="font-medium">5.000+ creator</span>
            <AvatarStack src={IMG.people.slice(2, 5)} size="h-6 w-6" />
          </Float>
          <Float className="-right-3 bottom-16 flex items-center gap-3 sm:-right-10">
            <Stars />
            <span className="text-mute">{BRAND.proof.rating}</span>
          </Float>
        </motion.div>
      </Container>
    </HeroShell>
  );
}

/* ─── 07 · Hero telefono con notifiche ──────────────────────────── */
const NOTIFS = [
  { icon: UserPlus, app: 'Candidatura', text: '@giulia.eats vuole collaborare con il tuo brand', time: '09:12' },
  { icon: CheckCircle2, app: 'Contenuto', text: 'Reel di @marco.moves approvato e programmato', time: '11:40' },
  { icon: Bell, app: 'Campagna', text: 'Il post di @sara.glow ha superato 100K views', time: '15:02' },
  { icon: FileBarChart, app: 'Report pronto', text: 'Campagna Estate: 1,2M reach · ER 5,8% · 3.420 click', time: '18:30' },
];

export function HeroNotifications({ tone = 'muted', showNav, title = 'Le campagne che\nlavorano *per te*', lead = 'Candidature, approvazioni, risultati: ricevi solo ciò che conta, noi gestiamo il resto.' }: HeroBase) {
  const last = NOTIFS.length - 1;
  const LastIcon = NOTIFS[last].icon;
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Container className="grid items-center gap-14 pt-10 sm:pt-16 lg:grid-cols-2">
        <motion.div {...reveal()}>
          <Eyebrow>120+ campagne gestite</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mt-6" />
          <Lead className="mt-6 max-w-md">{lead}</Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={CTA.cases.href} variant="secondary">
              {CTA.cases.label}
            </Button>
            <Button href={CTA.demo.href} variant="contrast">
              {CTA.demo.label}
            </Button>
          </div>
          <SocialProof className="mt-8" />
        </motion.div>
        <div className="relative mx-auto w-full max-w-[290px]">
          <div className="absolute -inset-12 rounded-full bg-brand/30 blur-3xl" />
          <PhoneFrame className="relative">
            <div className="h-full bg-gradient-to-b from-[#2a1470] via-brand to-brand-glow px-3 pt-12">
              <p className="text-center text-sm text-white/80">Lunedì 30 giugno</p>
              <p className="text-center font-heading text-6xl font-semibold tracking-tight text-white">18:30</p>
              <div className="mt-6 space-y-2">
                {NOTIFS.slice(0, last).map((n, i) => (
                  <motion.div key={n.text} {...reveal(i + 2)} className="flex gap-2 rounded-2xl bg-ink/35 p-2.5 text-white backdrop-blur">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
                      <n.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 text-[10px] leading-tight">
                      <span className="flex justify-between font-semibold">
                        {n.app} <span className="font-normal text-white/60">{n.time}</span>
                      </span>
                      <span className="line-clamp-2 text-white/80">{n.text}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </PhoneFrame>
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="absolute -left-8 bottom-14 z-10 flex w-[320px] max-w-[calc(100vw-3rem)] gap-3 rounded-2xl bg-ink p-4 text-white shadow-float sm:-left-20"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand">
              <LastIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 text-sm leading-snug">
              <span className="flex justify-between font-semibold">
                {NOTIFS[last].app} <span className="text-xs font-normal text-white/60">{NOTIFS[last].time}</span>
              </span>
              <span className="text-white/75">{NOTIFS[last].text}</span>
            </span>
          </motion.div>
        </div>
      </Container>
    </HeroShell>
  );
}

/* ─── 09 · Hero split + showcase piattaforma ────────────────────── */
export function HeroShowcase({ tone = 'white', showNav, title = 'Il tuo influencer marketing,\n*finalmente misurabile.*', lead = 'Cerca tra migliaia di creator italiani, lancia campagne e leggi i risultati in tempo reale. Per brand, agenzie e centri media.' }: HeroBase) {
  return (
    <HeroShell tone={tone} showNav={showNav}>
      <Container className="grid gap-8 pt-10 sm:pt-16 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <motion.div {...reveal()}>
          <div className="flex items-center gap-3">
            <AvatarStack src={IMG.people.slice(0, 3)} />
            <p className={`${TYPE.label} text-mute`}>Il team {BRAND.name}</p>
          </div>
          <Heading as="h1" size="display" text={title} className="mt-6" />
        </motion.div>
        <motion.div {...reveal(1)}>
          <Lead>{lead}</Lead>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={CTA.demo.href} arrow>
              {CTA.demo.label}
            </Button>
            <Button href={CTA.platform.href} variant="contrast">
              {CTA.platform.label}
            </Button>
          </div>
        </motion.div>
      </Container>
      <Container className="mt-14">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-[#f3eefe] to-[#dcd0ff] px-4 pt-10 sm:px-14 sm:pt-14">
          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <BrowserFrame className="mx-auto max-w-4xl rounded-b-none">
              <PlatformMock />
            </BrowserFrame>
          </motion.div>
        </div>
      </Container>
    </HeroShell>
  );
}

