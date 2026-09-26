import React from 'react';
import { motion } from 'motion/react';
import { BadgeCheck, MoreHorizontal, X, Sparkles } from 'lucide-react';
import type { Cta, NavLink } from './shared';

/**
 * Row 03 — Hero con story cards (ref. Sociwave)
 * Fondo crema, tag numerato, titolo "tight", CTA chiara + scura,
 * tre card verticali stile Stories con header utente e badge views.
 */
export interface StoryCard {
  image: string;
  user: string;
  avatar: string;
  time: string;
  views: string;
}

export interface HeroStoryCardsProps {
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  tag?: { number: string; label: string };
  title?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  cards?: StoryCard[];
}

const DEFAULTS: Required<HeroStoryCardsProps> = {
  brand: 'Socialee',
  nav: [
    { label: 'Evento', href: '#evento' },
    { label: 'Casi studio', href: '#casi' },
    { label: 'Servizi', href: '#servizi' },
    { label: 'Team', href: '#team' },
  ],
  navCta: { label: 'Contattaci', href: '#contatti' },
  tag: { number: '#001', label: 'Agenzia di social media marketing' },
  title: 'Contenuti che fermano\nil pollice e portano clienti',
  subtitle: 'Strategia, contenuti, community, advertising e gestione: tutto in un unico team.',
  primaryCta: { label: 'Esplora i servizi', href: '#servizi' },
  secondaryCta: { label: 'Vedi i progetti', href: '#casi' },
  cards: [
    { image: 'card1.png', user: 'festivaldelnerd', avatar: 'giorgia.png', time: '6h', views: '30M views' },
    { image: 'card2.png', user: 'socialee.it', avatar: 'giuseppe.png', time: '8h', views: '45M views' },
    { image: 'card3.png', user: 'brand.partner', avatar: 'noemi.png', time: '7h', views: '80M views' },
  ],
};

export default function HeroStoryCards(props: HeroStoryCardsProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-[#fdf6f2] font-tight text-zinc-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <a href="#" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6a3d] text-white shadow-md shadow-orange-500/30">
            <Sparkles className="h-4 w-4" />
          </span>
          {p.brand}
        </a>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {p.nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[#ff6a3d]">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={p.navCta.href}
          className="rounded-full bg-[#ff6a3d] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition hover:bg-[#f25525]"
        >
          {p.navCta.label}
        </a>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-10 text-center sm:px-6 sm:pt-14">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-1.5 py-1 pr-3 text-xs shadow-sm">
          <span className="rounded-full bg-[#ff6a3d] px-2 py-0.5 font-semibold text-white">{p.tag.number}</span>
          {p.tag.label}
        </span>
        <h1 className="mt-5 whitespace-pre-line text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
          {p.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-500">{p.subtitle}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={p.secondaryCta.href} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium shadow-sm transition hover:shadow-md">
            {p.secondaryCta.label}
          </a>
          <a
            href={p.primaryCta.href}
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_16px_rgba(0,0,0,0.25)] transition hover:bg-zinc-800"
          >
            {p.primaryCta.label}
          </a>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 pt-12 sm:grid-cols-3 sm:px-6">
        {p.cards.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="relative aspect-[9/13] overflow-hidden rounded-2xl bg-zinc-200 shadow-md ring-4 ring-white"
          >
            <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/50 to-transparent p-4 text-xs text-white">
              <img src={c.avatar} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-white/60" />
              <span className="font-semibold">{c.user}</span>
              <BadgeCheck className="h-4 w-4 fill-sky-500 text-white" />
              <span className="text-white/70">{c.time}</span>
              <MoreHorizontal className="ml-auto h-4 w-4" />
              <X className="h-4 w-4" />
            </div>
            <span className="absolute bottom-4 right-4 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
              {c.views}
            </span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
