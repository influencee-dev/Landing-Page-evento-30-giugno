import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Instagram, MessageCircle, Facebook, Music2, Plus, LayoutDashboard, Users, FileText, Calendar } from 'lucide-react';
import { AvatarStack, type Cta, type NavLink } from './shared';

/**
 * Row 29 — Hero centrata con icone app flottanti e dashboard (ref. Alytics)
 * Badge con avatar, titolo, CTA blu + nota, 4 tile di app ai lati che fluttuano,
 * mockup dashboard con KPI, gauge obiettivo e grafico.
 */
export interface HeroDashboardProps {
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  badge?: { avatars: string[]; label: string };
  title?: string;
  subtitle?: string;
  cta?: Cta;
  note?: string;
  kpis?: { title: string; value: string; text: string }[];
  goal?: { title: string; value: number };
  accent?: string;
}

const DEFAULTS: Required<HeroDashboardProps> = {
  brand: 'Socialee',
  nav: [
    { label: 'Evento', href: '#evento' },
    { label: 'Vantaggi', href: '#vantaggi' },
    { label: 'Strumenti', href: '#strumenti' },
    { label: 'FAQ', href: '#faq' },
  ],
  navCta: { label: 'Iscriviti', href: '#iscrizione' },
  badge: { avatars: ['giorgia.png', 'noemi.png', 'marika.png'], label: 'Scelto da 250+ imprenditori' },
  title: 'Trasforma idee sparse in\ncontenuti che vendono',
  subtitle: 'Un metodo semplice per creare con l’AI locandine, menu e promo per la tua attività, senza caos.',
  cta: { label: 'Prenota il posto gratis', href: '#iscrizione' },
  note: 'Nessuna carta di credito richiesta',
  kpis: [
    { title: 'Prenotazioni', value: '+15%', text: 'Rispetto alla settimana scorsa' },
    { title: 'Tempo risparmiato', value: '6h', text: 'A settimana sui contenuti' },
  ],
  goal: { title: 'Obiettivo mese', value: 84 },
  accent: '#1f6bff',
};

const TILES = [
  { Icon: Instagram, color: '#e1306c', pos: 'left-[6%] top-24', delay: 0 },
  { Icon: Facebook, color: '#1877f2', pos: 'right-[6%] top-24', delay: 1 },
  { Icon: Music2, color: '#111', pos: 'left-[8%] top-80', delay: 2 },
  { Icon: MessageCircle, color: '#25d366', pos: 'right-[8%] top-80', delay: 1.5 },
];

export default function HeroDashboard(props: HeroDashboardProps) {
  const p = { ...DEFAULTS, ...props };
  const dash = 2 * Math.PI * 40 * 0.5; // semicerchio

  return (
    <section className="relative overflow-hidden bg-[#f6f6f6] font-work text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 text-xl font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: p.accent }}>
              <Plus className="h-4 w-4" strokeWidth={3} />
            </span>
            {p.brand}
          </a>
          <nav className="hidden gap-8 text-zinc-600 md:flex">
            {p.nav.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-zinc-950">
                {l.label}
              </a>
            ))}
          </nav>
          <a href={p.navCta.href} className="rounded-lg px-5 py-2.5 font-medium text-white" style={{ background: p.accent }}>
            {p.navCta.label}
          </a>
        </div>
      </header>

      {TILES.map(({ Icon, color, pos, delay }, i) => (
        <span
          key={i}
          className={`absolute hidden h-20 w-20 animate-float items-center justify-center rounded-2xl border-4 border-white bg-zinc-100 shadow-lg lg:flex ${pos}`}
          style={{ animationDelay: `${delay}s`, ['--r' as string]: `${i % 2 ? 6 : -6}deg` }}
        >
          <Icon className="h-9 w-9" style={{ color }} />
        </span>
      ))}

      <div className="relative mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 py-1 pl-1 pr-3 text-sm" style={{ color: p.accent }}>
          <AvatarStack src={p.badge.avatars} size="h-6 w-6" />
          {p.badge.label}
        </span>
        <h1 className="mt-5 whitespace-pre-line text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">{p.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-600">{p.subtitle}</p>
        <a href={p.cta.href} className="mt-6 inline-block rounded-lg px-6 py-3 font-medium text-white transition hover:brightness-110" style={{ background: p.accent }}>
          {p.cta.label}
        </a>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm">
          <CreditCard className="h-4 w-4" style={{ color: p.accent }} /> {p.note}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto mt-12 max-w-5xl px-4 sm:px-6"
      >
        <div className="grid gap-4 rounded-t-2xl border border-b-0 border-zinc-200 bg-white p-5 shadow-[0_-10px_60px_rgba(31,107,255,0.15)] md:grid-cols-[180px_1fr]">
          <aside className="hidden space-y-3 text-xs text-zinc-600 md:block">
            <p className="flex items-center gap-2 text-base font-semibold text-zinc-950">
              <span className="flex h-5 w-5 items-center justify-center rounded text-white" style={{ background: p.accent }}>
                <Plus className="h-3 w-3" />
              </span>
              {p.brand}
            </p>
            {[
              [LayoutDashboard, 'Dashboard'],
              [Users, 'Clienti'],
              [FileText, 'Contenuti'],
              [Calendar, 'Calendario'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Users;
              return (
                <p key={label as string} className="flex items-center gap-2">
                  <I className="h-3.5 w-3.5" /> {label as string}
                </p>
              );
            })}
          </aside>
          <div className="grid gap-4 sm:grid-cols-3">
            {p.kpis.map((k) => (
              <div key={k.title} className="rounded-xl border border-zinc-200 p-4">
                <p className="text-sm font-medium">{k.title}</p>
                <p className="mt-3 text-3xl">{k.value}</p>
                <p className="mt-1 text-[10px] text-zinc-500">{k.text}</p>
              </div>
            ))}
            <div className="rounded-xl border border-zinc-200 p-4 text-center">
              <p className="text-sm font-medium">{p.goal.title}</p>
              <svg viewBox="0 0 100 60" className="mx-auto mt-2 w-32">
                <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="#e4ecff" strokeWidth="9" strokeLinecap="round" />
                <motion.path
                  d="M10 55 A40 40 0 0 1 90 55"
                  fill="none"
                  stroke={p.accent}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={dash}
                  initial={{ strokeDashoffset: dash }}
                  whileInView={{ strokeDashoffset: dash * (1 - p.goal.value / 100) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                />
                <text x="50" y="52" textAnchor="middle" fontSize="14" fontWeight="600">
                  {p.goal.value}%
                </text>
              </svg>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 sm:col-span-3">
              <p className="text-sm font-medium">Crescita</p>
              <svg viewBox="0 0 300 70" className="mt-2 h-20 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hdg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={p.accent} stopOpacity="0.3" />
                    <stop offset="1" stopColor={p.accent} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 65 L50 55 L100 30 L140 22 L180 58 L220 45 L260 20 L300 8 L300 70 L0 70Z" fill="url(#hdg)" />
                <path d="M0 65 L50 55 L100 30 L140 22 L180 58 L220 45 L260 20 L300 8" fill="none" stroke={p.accent} strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
