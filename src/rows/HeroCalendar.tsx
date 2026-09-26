import React from 'react';
import { motion } from 'motion/react';
import { Filter, PlayCircle, TrendingUp } from 'lucide-react';
import { AvatarStack, type Cta } from './shared';

/**
 * Row 24 — Hero con calendario che scorre (ref. Funnelz)
 * Badge disponibilità, titolo con icona "tile" inline, CTA, riprova sociale;
 * a destra colonna di appuntamenti che scorre all'infinito in verticale.
 */
export interface CalendarDay {
  day: string;
  date: string;
  events: { title: string; time: string; duration: string; avatar: string }[];
}

export interface HeroCalendarProps {
  brand?: string;
  navCta?: Cta;
  badge?: string;
  titleBefore?: string;
  titleAfter?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  partners?: string[];
  rating?: string;
  days?: CalendarDay[];
  accent?: string;
}

const DEFAULTS: Required<HeroCalendarProps> = {
  brand: 'Socialee',
  navCta: { label: 'Prenota una call', href: '#contatti' },
  badge: 'Posti disponibili a giugno',
  titleBefore: 'Più clienti',
  titleAfter: 'a ogni contenuto',
  subtitle: 'Dalle locandine alle automazioni: creiamo sistemi di comunicazione che fanno crescere la tua attività in automatico.',
  primaryCta: { label: 'Prenota il posto', href: '#iscrizione' },
  secondaryCta: { label: 'Scopri di più', href: '#programma' },
  partners: ['giorgia.png', 'giuseppe.png', 'noemi.png', 'manuel.png'],
  rating: 'Valutazione eccellente: 5/5',
  days: [
    { day: 'LUN', date: '22 GIU', events: [{ title: 'Nuova prenotazione: Davide', time: '19:30 – 21:00', duration: '4 pers.', avatar: 'giuseppe.png' }] },
    {
      day: 'MAR',
      date: '23 GIU',
      events: [
        { title: 'Nuova prenotazione: Sara', time: '20:00 – 21:30', duration: '2 pers.', avatar: 'noemi.png' },
        { title: 'Nuova prenotazione: Lea', time: '12:45 – 14:00', duration: '6 pers.', avatar: 'marika.png' },
      ],
    },
    { day: 'GIO', date: '25 GIU', events: [{ title: 'Nuova prenotazione: Luca', time: '19:30 – 21:00', duration: '3 pers.', avatar: 'carlo.png' }] },
    { day: 'SAB', date: '27 GIU', events: [{ title: 'Nuova prenotazione: Edoardo', time: '21:00 – 23:00', duration: '8 pers.', avatar: 'manuel.png' }] },
    { day: 'MAR', date: '30 GIU', events: [{ title: 'A(I)peritivo Socialee', time: '18:30 – 21:00', duration: 'evento', avatar: 'giorgia.png' }] },
  ],
  accent: '#ff4f2b',
};

function DayCard({ d, i }: { d: CalendarDay; i: number; key?: React.Key }) {
  return (
    <div className={`rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1deg]'}`}>
      <div className="flex justify-between border-b border-dashed border-zinc-200 px-4 py-2.5 text-xs text-zinc-500">
        <span>{d.day}</span>
        <span>{d.date}</span>
      </div>
      {d.events.map((e, k) => (
        <div key={k} className={`flex items-center gap-3 px-4 py-3 ${k ? 'border-t border-dashed border-zinc-200' : ''}`}>
          <img src={e.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">{e.title}</p>
            <p className="text-xs text-zinc-500">{e.time}</p>
          </div>
          <span className="text-[10px] text-zinc-400">{e.duration}</span>
        </div>
      ))}
    </div>
  );
}

export default function HeroCalendar(props: HeroCalendarProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="relative overflow-hidden bg-[#f5f5f5] font-sans text-zinc-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="py-8">
          <a href="#" className="flex items-center gap-2 font-medium">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-lg">
              <Filter className="h-4 w-4" />
            </span>
            {p.brand}
          </a>
          <div className="pb-8 pt-20 lg:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase text-green-600">
              <span className="h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-200" />
              {p.badge}
            </span>
            <h1 className="mt-5 text-5xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-7xl">
              {p.titleBefore}{' '}
              <span className="inline-flex h-[0.85em] w-[0.85em] -rotate-6 items-center justify-center rounded-2xl align-middle text-white shadow-xl shadow-orange-500/40" style={{ background: p.accent }}>
                <TrendingUp className="h-1/2 w-1/2" strokeWidth={3} />
              </span>{' '}
              {p.titleAfter}
            </h1>
            <p className="mt-5 max-w-md text-lg text-zinc-500">{p.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={p.primaryCta.href} className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]">
                {p.primaryCta.label}
              </a>
              <a href={p.secondaryCta.href} className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-medium">
                <PlayCircle className="h-4 w-4" /> {p.secondaryCta.label}
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-[10px] font-semibold uppercase text-zinc-500">
              <div>
                <p>Partner di fiducia</p>
                <div className="mt-2">
                  <AvatarStack src={p.partners} />
                </div>
              </div>
              <span className="h-10 w-px bg-zinc-300" />
              <div>
                <p>{p.rating}</p>
                <p className="mt-1 text-xl tracking-wider text-amber-400">★★★★★</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden h-[640px] overflow-hidden lg:block [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_85%,transparent)]">
          <a href={p.navCta.href} className="absolute right-0 top-6 z-10 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium shadow">
            <img src={p.partners[0]} alt="" className="h-5 w-5 rounded-full object-cover" /> {p.navCta.label}
          </a>
          <motion.div className="space-y-6 px-2" animate={{ y: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
            {[...p.days, ...p.days].map((d, i) => (
              <DayCard key={i} d={d} i={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
