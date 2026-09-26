import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk } from 'lucide-react';
import CurvedMarquee, { CURVES } from './CurvedMarquee';
import type { Cta, NavLink } from './shared';

/**
 * Row 12 — Hero UGC a tre colonne (ref. Shinta)
 * Titolo + lista servizi a sinistra, pila di card sfogliabile ("Swipe") al centro,
 * mini-card novità + testo + CTA a destra, nastro ondulato rosa che attraversa tutto.
 */
export interface HeroUGCProps {
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  title?: string;
  services?: string[];
  images?: string[];
  news?: { image: string; tag: string; title: string; href: string };
  text?: string;
  textBold?: string;
  cta?: Cta;
  accent?: string;
}

const DEFAULTS: Required<HeroUGCProps> = {
  brand: 'Socialee',
  nav: [
    { label: 'Progetti', href: '#casi' },
    { label: 'Chi siamo', href: '#team' },
    { label: 'Evento', href: '#evento' },
    { label: 'Contatti', href: '#contatti' },
  ],
  navCta: { label: 'Prenota una call', href: '#contatti' },
  title: 'Contenuti che fanno crescere il tuo brand.',
  services: ['Contenuti short form', 'Social media management', 'AI per le attività locali'],
  images: ['card1.png', 'card2.png', 'card3.png'],
  news: { image: 'spiegazione.png', tag: 'NOVITÀ!', title: 'A(I)peritivo: il 30 giugno dal vivo', href: '#evento' },
  text: 'Socialee aiuta le attività a creare contenuti che si connettono davvero con il pubblico, in modo costante e',
  textBold: 'strategico su tutti i social.',
  cta: { label: 'Prenota una call', href: '#contatti' },
  accent: '#f9a8e8',
};

export default function HeroUGC(props: HeroUGCProps) {
  const p = { ...DEFAULTS, ...props };
  const [i, setI] = useState(0);
  const n = p.images.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <section className="relative overflow-hidden bg-white font-tight text-zinc-950">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <a href="#" className="flex items-center gap-2 rounded-full bg-zinc-950 py-1.5 pl-1.5 pr-4 font-semibold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: p.accent }}>
            <span className="text-sm text-zinc-950">S</span>
          </span>
          {p.brand}
        </a>
        <nav className="hidden gap-6 text-sm md:flex">
          {p.nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:opacity-60">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={p.navCta.href} className="rounded-full bg-zinc-950 p-1">
          <span className="block rounded-full bg-white px-4 py-1.5 text-sm font-medium">{p.navCta.label}</span>
        </a>
      </header>

      <CurvedMarquee
        items={p.services.map((s) => s.toUpperCase())}
        path={CURVES.wave}
        bg={p.accent}
        color="#111"
        separator="•"
        className="absolute inset-x-0 top-[48%] z-[1] h-[45%] w-full"
        fontClass="font-tight font-semibold"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="relative z-[2]">
          <h1 className="max-w-xs text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">{p.title}</h1>
          <ul className="mt-6 space-y-1 text-xs font-semibold uppercase tracking-wide">
            {p.services.map((s) => (
              <li key={s} className="flex items-center gap-1.5">
                <Asterisk className="h-4 w-4" style={{ color: p.accent }} /> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-[2] mx-auto h-[420px] w-[260px]">
          {[2, 1].map((off) => (
            <div
              key={off}
              className="absolute inset-0 overflow-hidden rounded-3xl bg-zinc-200"
              style={{ transform: `translateX(${-off * 18}px) scale(${1 - off * 0.05})`, opacity: 0.9 }}
            >
              <img src={p.images[(i + off) % n]} alt="" className="h-full w-full object-cover opacity-60" />
            </div>
          ))}
          <AnimatePresence mode="popLayout">
            <motion.img
              key={i}
              src={p.images[i]}
              alt=""
              initial={{ opacity: 0, x: 60, rotate: 4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -60, rotate: -4 }}
              className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-2xl"
            />
          </AnimatePresence>
          <div className="absolute -right-8 bottom-24 flex items-center gap-2 rounded-full bg-zinc-950 px-3 py-2 text-sm text-white">
            <button type="button" onClick={() => go(-1)} aria-label="Precedente">
              <ArrowLeft className="h-4 w-4" />
            </button>
            Sfoglia
            <button type="button" onClick={() => go(1)} aria-label="Successiva">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative z-[2] flex flex-col justify-between gap-16 lg:h-[420px]">
          <a href={p.news.href} className="group flex items-start gap-3">
            <img src={p.news.image} alt="" className="h-20 w-16 rounded-xl object-cover" />
            <span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: p.accent }}>
                {p.news.tag}
              </span>
              <span className="mt-1 block max-w-[10rem] font-semibold leading-tight">{p.news.title}</span>
            </span>
            <ArrowUpRight className="ml-auto h-7 w-7 rounded-full bg-zinc-100 p-1.5 transition group-hover:rotate-45" />
          </a>
          <div>
            <p className="max-w-xs text-zinc-600">
              {p.text} <b className="text-zinc-950">{p.textBold}</b>
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href={p.cta.href} className="rounded-full bg-zinc-950 px-8 py-3.5 text-sm font-medium text-white">
                {p.cta.label}
              </a>
              <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: p.accent }}>
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
