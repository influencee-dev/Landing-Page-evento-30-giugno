import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { Cta, NavLink } from './shared';

/**
 * Row 11 — Hero con telefono "live" e widget flottanti (ref. performance marketing verde)
 * Titolo a due righe (prima riga colorata), CTA pillola, telefono centrale
 * con badge Live e widget analytics/ROI/vendite/post che fluttuano attorno.
 */
export interface HeroPhoneWidgetsProps {
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  titleAccent?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  phone?: { image: string; user: string; handle: string };
  widgets?: {
    donut: { title: string; total: string };
    roi: { label: string; value: string };
    sales: { title: string; sub: string; price: string; image: string };
    post: { image: string; likes: string };
  };
  trusted?: string;
  accent?: string;
}

const DEFAULTS: Required<HeroPhoneWidgetsProps> = {
  brand: 'Socialee',
  nav: [
    { label: 'Home', href: '#' },
    { label: 'Servizi', href: '#servizi' },
    { label: 'Casi studio', href: '#casi' },
    { label: 'Chi siamo', href: '#team' },
  ],
  navCta: { label: 'Contattaci', href: '#contatti' },
  titleAccent: 'AI & Social Marketing',
  title: 'per attività locali e creator',
  subtitle: 'Dalle campagne performance alla produzione video: risultati misurabili che fanno crescere il tuo business.',
  primaryCta: { label: 'Prenota il posto', href: '#iscrizione' },
  secondaryCta: { label: 'Scopri i servizi', href: '#servizi' },
  phone: { image: 'noemi.png', user: 'Noemi', handle: '@socialee.it' },
  widgets: {
    donut: { title: 'Panoramica', total: '20.122' },
    roi: { label: 'ROI migliorato', value: '+16%' },
    sales: { title: '8 prenotazioni', sub: 'oggi', price: '€20', image: 'card3.png' },
    post: { image: 'card2.png', likes: '29,2K' },
  },
  trusted: '250+ attività si fidano di noi',
  accent: '#2f9e2f',
};

const floatIn = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, type: 'spring' as const },
});

export default function HeroPhoneWidgets(props: HeroPhoneWidgetsProps) {
  const p = { ...DEFAULTS, ...props };
  const w = p.widgets;

  return (
    <section className="overflow-hidden bg-[#fdfcf3] font-work text-zinc-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
            <span className="h-5 w-5 rounded-full border-[5px]" style={{ borderColor: p.accent }} />
          </span>
          {p.brand}
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {p.nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:opacity-70">
              {l.label}
            </a>
          ))}
          <span className="flex items-center gap-1">
            Altro <ChevronDown className="h-4 w-4" />
          </span>
        </nav>
        <a href={p.navCta.href} className="rounded-full bg-black px-5 py-2.5 text-sm text-white">
          {p.navCta.label}
        </a>
      </header>

      <div className="mx-auto max-w-4xl px-4 pt-12 text-center sm:px-6">
        <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-6xl">
          <span style={{ color: p.accent }}>{p.titleAccent}</span>
          <br />
          {p.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-zinc-600">{p.subtitle}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={p.primaryCta.href} className="rounded-full px-5 py-3 text-sm font-medium text-white transition hover:brightness-110" style={{ background: p.accent }}>
            {p.primaryCta.label}
          </a>
          <a href={p.secondaryCta.href} className="rounded-full bg-zinc-100 px-5 py-3 text-sm font-medium hover:bg-zinc-200">
            {p.secondaryCta.label}
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-5xl justify-center px-4">
        {/* Widget sinistra */}
        <div className="absolute left-4 top-0 hidden w-48 space-y-4 md:block lg:left-16">
          <motion.div {...floatIn(0.2)} className="rounded-xl bg-white p-4 shadow-xl">
            <p className="text-sm">{w.donut.title}</p>
            <div className="relative mx-auto mt-3 h-24 w-24 rounded-full" style={{ background: 'conic-gradient(#f472b6 0 30%, #fdba74 30% 78%, #60a5fa 78% 100%)' }}>
              <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-[10px]">{w.donut.total}</div>
            </div>
          </motion.div>
          <motion.div {...floatIn(0.35)} className="-ml-8 w-40 rounded-lg bg-zinc-950 p-3 text-white shadow-xl">
            <p className="text-right text-xs text-white/60">{w.roi.label}</p>
            <div className="flex items-end justify-between">
              <span className="flex items-end gap-0.5">
                {[3, 6, 4, 10].map((h, i) => (
                  <span key={i} className="w-2 bg-emerald-400" style={{ height: h * 1.5 }} />
                ))}
              </span>
              <span className="text-xl font-semibold">{w.roi.value}</span>
            </div>
          </motion.div>
        </div>

        {/* Telefono */}
        <motion.div {...floatIn(0.1)} className="relative aspect-[9/13] w-60 overflow-hidden rounded-t-[2.5rem] border-[6px] border-b-0 border-zinc-900 sm:w-72 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
          <img src={p.phone.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-4 text-white">
            <img src={p.phone.image} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
            <span className="text-xs leading-tight">
              <b className="block">{p.phone.user}</b>
              {p.phone.handle}
            </span>
            <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold">● Live</span>
          </div>
        </motion.div>

        {/* Widget destra */}
        <div className="absolute right-4 top-0 hidden w-48 space-y-4 md:block lg:right-16">
          <motion.div {...floatIn(0.25)} className="flex gap-2 rounded-xl bg-zinc-100 p-3 shadow-lg">
            <div className="flex-1">
              <p className="text-sm font-medium">{w.sales.title}</p>
              <p className="text-xs text-zinc-500">{w.sales.sub}</p>
              <span className="mt-2 inline-block rounded bg-zinc-900 px-1.5 text-xs text-white">{w.sales.price}</span>
            </div>
            <img src={w.sales.image} alt="" className="h-16 w-14 rounded object-cover" />
          </motion.div>
          <motion.div {...floatIn(0.4)} className="relative ml-6 rounded-xl bg-white p-2 shadow-xl">
            <img src={w.post.image} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <span className="absolute -left-4 top-1/2 rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-white">{w.post.likes}</span>
            <p className="mt-1 text-sm">❤️ 💬</p>
          </motion.div>
        </div>
      </div>

      <p className="pb-12 pt-4 text-center text-lg font-medium">{p.trusted}</p>
    </section>
  );
}
