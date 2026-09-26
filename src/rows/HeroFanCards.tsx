import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import CurvedMarquee from './CurvedMarquee';
import type { Cta, NavLink } from './shared';

/**
 * Row 10 — Hero centrata con card a ventaglio
 * Unisce due reference:
 *  - variant "signal": fondo chiaro, story card verticali + nastro curvo che scorre
 *  - variant "looped": fondo verde scuro, titolo condensato, post Instagram inclinati
 */
export interface FanCard {
  image: string;
  user: string;
  meta?: string;
  avatar?: string;
}

export interface HeroFanCardsProps {
  variant?: 'signal' | 'looped';
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  /** Segmenti del titolo; `accent: true` li colora con il colore evidenza. */
  title?: { text: string; accent?: boolean }[];
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta | null;
  cards?: FanCard[];
  ribbon?: string[] | null;
}

const CARDS: FanCard[] = [
  { image: 'card2.png', user: '@socialee.it', meta: '2M views', avatar: 'giorgia.png' },
  { image: 'card1.png', user: '@festivaldelnerd', meta: '2M ago', avatar: 'giuseppe.png' },
  { image: 'card3.png', user: '@brand.partner', meta: '3M', avatar: 'noemi.png' },
];

const VARIANTS = {
  signal: {
    section: 'bg-[#f7f6f3] text-[#6b6f68] font-work',
    title: 'text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] leading-[0.95]',
    accent: 'text-[#1f2a1f]',
    sub: 'text-zinc-600 font-medium',
    nav: 'text-zinc-500',
    navCta: 'text-[#ff6a2b]',
    primary: 'bg-[#1f2a1f] text-white',
    secondary: 'border border-zinc-300 text-zinc-800',
  },
  looped: {
    section: 'bg-[#083d36] text-white font-work',
    title: 'font-anton uppercase text-5xl sm:text-8xl leading-[1.05]',
    accent: 'text-[#9ee26b]',
    sub: 'text-white/85',
    nav: 'text-white',
    navCta: 'rounded-full bg-[#9ee26b] px-5 py-2 text-[#083d36] font-semibold',
    primary: 'bg-[#9ee26b] text-[#083d36]',
    secondary: 'border border-white text-white',
  },
};

const DEFAULTS = {
  signal: {
    title: [{ text: 'Contenuti social' }, { text: '\ncostruiti per ' }, { text: 'fermare lo scroll', accent: true }],
    ribbon: ['Il tuo motore di crescita social', '8M+ views generate per i nostri clienti'],
  },
  looped: {
    title: [{ text: 'Domina i ' }, { text: 'social', accent: true }, { text: '\ncon l’' }, { text: 'AI', accent: true }, { text: ' e metodo' }],
    ribbon: null,
  },
};

function StoryCard({ card }: { card: FanCard }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-zinc-300 shadow-2xl ring-4 ring-white">
      <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-x-0 top-0 flex justify-between bg-gradient-to-b from-black/40 to-transparent p-3 text-xs text-white">
        <span>{card.user}</span>
        <span>{card.meta}</span>
      </div>
    </div>
  );
}

function PostCard({ card }: { card: FanCard }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white text-zinc-900 shadow-2xl">
      <div className="flex items-center gap-2 p-3">
        {card.avatar && <img src={card.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />}
        <div className="leading-tight">
          <p className="text-[11px] font-semibold">{card.user}</p>
          <p className="text-[9px] text-zinc-500">{card.meta}</p>
        </div>
      </div>
      <img src={card.image} alt="" className="min-h-0 flex-1 object-cover" />
      <div className="flex items-center gap-2.5 p-3">
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        <MessageCircle className="h-4 w-4" />
        <Send className="h-4 w-4" />
        <Bookmark className="ml-auto h-4 w-4" />
      </div>
    </div>
  );
}

export default function HeroFanCards(props: HeroFanCardsProps) {
  const variant = props.variant ?? 'signal';
  const v = VARIANTS[variant];
  const d = DEFAULTS[variant];
  const p = {
    brand: 'Socialee',
    nav: [
      { label: 'Lavori', href: '#casi' },
      { label: 'Servizi', href: '#servizi' },
      { label: 'Chi siamo', href: '#team' },
      { label: 'Evento', href: '#evento' },
    ],
    navCta: { label: 'Scrivici', href: '#contatti' },
    subtitle: 'Pianifichiamo, produciamo e ottimizziamo contenuti social per lanci, feed sempre attivi e campagne a pagamento.',
    primaryCta: { label: 'Prenota una call strategica', href: '#contatti' },
    secondaryCta: variant === 'looped' ? { label: 'Contattaci', href: '#contatti' } : null,
    cards: CARDS,
    ...d,
    ...props,
  };
  const isStory = variant === 'signal';
  const Card = isStory ? StoryCard : PostCard;
  // posizione/rotazione delle 3 card: sinistra, centro, destra
  const fan = isStory
    ? [
        { x: '-62%', r: -6, s: 0.86, z: 0 },
        { x: '0%', r: 0, s: 1, z: 2 },
        { x: '62%', r: 6, s: 0.86, z: 0 },
      ]
    : [
        { x: '-92%', r: -14, s: 0.95, z: 0 },
        { x: '0%', r: 0, s: 1, z: 2 },
        { x: '92%', r: 14, s: 0.95, z: 0 },
      ];

  return (
    <section className={`relative overflow-hidden ${v.section}`}>
      <header className={`mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-sm sm:px-6 ${variant === 'looped' ? 'border-b border-white/10' : ''}`}>
        <a href="#" className={`flex items-center gap-2 text-lg ${variant === 'looped' ? 'font-anton uppercase tracking-wide' : 'font-mono text-zinc-800'}`}>
          <span className="grid grid-cols-2 gap-0.5">
            <span className="h-2 w-2 rounded-sm bg-[#ff6a2b]" />
            <span className="h-2 w-2 rounded-sm bg-[#ffb18c]" />
            <span className="h-2 w-2 rounded-sm bg-[#ffb18c]" />
            <span className="h-2 w-2 rounded-sm bg-[#ff6a2b]" />
          </span>
          {p.brand}
        </a>
        <nav className={`hidden gap-7 md:flex ${v.nav}`}>
          {p.nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:opacity-70">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={p.navCta.href} className={v.navCta}>
          {p.navCta.label}
        </a>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-14 text-center sm:px-6 sm:pt-20">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`whitespace-pre-line ${v.title}`}>
          {p.title.map((s, i) => (
            <span key={i} className={s.accent ? v.accent : undefined}>
              {s.text}
            </span>
          ))}
        </motion.h1>
        <p className={`mx-auto mt-6 max-w-lg ${v.sub}`}>{p.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={p.primaryCta.href} className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${v.primary}`}>
            {p.primaryCta.label}
            {!isStory && <ArrowRight className="h-4 w-4" />}
          </a>
          {isStory && (
            <span className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe1d3] text-[#ff6a2b]">
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
          {p.secondaryCta && (
            <a href={p.secondaryCta.href} className={`rounded-full px-5 py-3 text-sm font-semibold ${v.secondary}`}>
              {p.secondaryCta.label}
            </a>
          )}
        </div>
      </div>

      <div className="relative mt-16 h-[340px] sm:h-[440px]">
        {p.ribbon && (
          <>
            <CurvedMarquee items={p.ribbon} bg="#ffe1d3" color="#1f2a1f" className="absolute inset-x-0 top-24 h-48 w-full" duration={40} />
            <CurvedMarquee items={p.ribbon} className="absolute inset-x-0 top-32 z-[3] h-48 w-full" duration={34} />
          </>
        )}
        {p.cards.slice(0, 3).map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: fan[i].r }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 80 }}
            style={{ zIndex: fan[i].z, x: fan[i].x, scale: fan[i].s }}
            className={`absolute left-1/2 top-0 -ml-[110px] w-[220px] sm:-ml-[140px] sm:w-[280px] ${isStory ? 'aspect-[9/14]' : 'aspect-[4/5]'}`}
          >
            <Card card={c} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
