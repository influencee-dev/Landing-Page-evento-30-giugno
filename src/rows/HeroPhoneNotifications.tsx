import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Bell } from 'lucide-react';
import type { Cta, NavLink } from './shared';
import { GoogleG } from './HeroSplitPortrait';

/**
 * Row 07 — Hero con telefono e notifiche (ref. AdScale)
 * Titolo sans leggero con parola in serif corsivo, badge metrica,
 * mockup iPhone con notifiche che entrano in sequenza e alone viola.
 */
export interface PhoneNotification {
  app: string;
  text: string;
  time: string;
}

export interface HeroPhoneNotificationsProps {
  brand?: string;
  nav?: NavLink[];
  navCtas?: [Cta, Cta];
  badge?: { highlight: string; label: string };
  title?: string;
  titleItalic?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  reviews?: { value: number; label: string };
  phone?: { date: string; time: string };
  notifications?: PhoneNotification[];
}

const DEFAULTS: Required<HeroPhoneNotificationsProps> = {
  brand: 'Socialee',
  nav: [
    { label: 'Evento', href: '#evento' },
    { label: 'Servizi', href: '#servizi' },
    { label: 'Casi studio', href: '#casi' },
    { label: 'Recensioni', href: '#recensioni' },
  ],
  navCtas: [
    { label: 'Parla con noi', href: '#contatti' },
    { label: 'Prenota il posto', href: '#iscrizione' },
  ],
  badge: { highlight: '250+', label: 'attività già formate' },
  title: 'Trasformiamo i tuoi contenuti in',
  titleItalic: 'clienti veri',
  subtitle: 'Social, AI e advertising per attività locali che vogliono crescere davvero.',
  primaryCta: { label: 'Prenota il posto', href: '#iscrizione' },
  secondaryCta: { label: 'Vedi i casi studio', href: '#casi' },
  reviews: { value: 4, label: 'Basato su 120+ recensioni' },
  phone: { date: 'Martedì 30 giugno', time: '18:30' },
  notifications: [
    { app: 'WhatsApp', text: 'Ciao! Avete ancora posto per stasera? Ho visto la promo.', time: '18:02' },
    { app: 'Instagram', text: 'La tua locandina ha raggiunto 12.400 persone.', time: '18:14' },
    { app: 'Prenotazioni', text: 'Nuova prenotazione: tavolo per 4 alle 20:30.', time: '18:21' },
    { app: 'Prenotazioni', text: 'Nuova prenotazione: tavolo per 6 alle 21:00 dalla campagna Meta.', time: '18:29' },
  ],
};

export default function HeroPhoneNotifications(props: HeroPhoneNotificationsProps) {
  const p = { ...DEFAULTS, ...props };
  const last = p.notifications.length - 1;

  return (
    <section className="overflow-hidden bg-[#f5f5f5] font-tight text-zinc-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <a href="#" className="flex items-center gap-2 text-xl font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 text-white">
            <TrendingUp className="h-5 w-5" />
          </span>
          {p.brand}
        </a>
        <nav className="hidden gap-8 text-sm text-zinc-500 lg:flex">
          {p.nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-zinc-900">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex gap-2">
          <a href={p.navCtas[0].href} className="hidden rounded-xl bg-white px-4 py-2.5 text-sm shadow-sm sm:block">
            {p.navCtas[0].label}
          </a>
          <a href={p.navCtas[1].href} className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm text-white">
            {p.navCtas[1].label}
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-sm">
            <span className="text-violet-600">{p.badge.highlight}</span> {p.badge.label}
          </span>
          <h1 className="mt-6 text-5xl font-normal leading-[1.02] tracking-[-0.04em] sm:text-7xl">
            {p.title} <em className="font-serif font-normal tracking-normal">{p.titleItalic}</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-zinc-500">{p.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={p.secondaryCta.href} className="rounded-xl border border-zinc-200 bg-white px-5 py-3.5 text-sm">
              {p.secondaryCta.label}
            </a>
            <a href={p.primaryCta.href} className="rounded-xl bg-zinc-900 px-5 py-3.5 text-sm text-white hover:bg-zinc-700">
              {p.primaryCta.label}
            </a>
          </div>
          <div className="mt-7 flex items-center gap-3 text-sm">
            <GoogleG className="h-5 w-5" />
            <span className="tracking-widest">
              {'★'.repeat(p.reviews.value)}
              <span className="text-zinc-400">{'★'.repeat(5 - p.reviews.value)}</span>
            </span>
            <span className="h-5 w-px bg-zinc-300" />
            <span className="text-zinc-600">{p.reviews.label}</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px]">
          <div className="absolute -inset-10 rounded-full bg-violet-500/40 blur-3xl" />
          <div className="relative aspect-[9/19] rounded-[3rem] border-[6px] border-zinc-900 bg-gradient-to-b from-[#1e3a8a] via-[#3b5bdb] to-[#7c6cf2] p-3 shadow-2xl">
            <div className="mx-auto h-6 w-24 rounded-full bg-black" />
            <p className="mt-6 text-center text-sm text-white/80">{p.phone.date}</p>
            <p className="text-center text-6xl font-semibold text-white">{p.phone.time}</p>
            <div className="mt-6 space-y-2">
              {p.notifications.slice(0, last).map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.35 }}
                  className="flex gap-2 rounded-2xl bg-black/40 p-2.5 text-white backdrop-blur"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/90 text-violet-600">
                    <Bell className="h-4 w-4" />
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
          {/* Notifica "in primo piano" che esce dal telefono */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + last * 0.35, type: 'spring' }}
            className="absolute -left-10 bottom-16 flex w-[340px] max-w-[calc(100vw-2rem)] gap-3 rounded-2xl bg-zinc-800/95 p-3.5 text-white shadow-2xl backdrop-blur sm:-left-16"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600">
              <Bell className="h-5 w-5" />
            </span>
            <span className="min-w-0 text-sm leading-snug">
              <span className="flex justify-between text-base font-semibold">
                {p.notifications[last].app} <span className="text-xs font-normal text-white/60">{p.notifications[last].time}</span>
              </span>
              <span className="text-white/80">{p.notifications[last].text}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
