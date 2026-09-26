import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { AvatarStack, Stars, type Cta, type NavLink } from './shared';

/**
 * Row 05 — Hero split con ritratto (ref. Digiket)
 * Testo a sinistra, ritratto a destra su pattern chevron,
 * badge flottanti (utenti + recensioni Google), linee verticali di griglia.
 */
export interface HeroSplitPortraitProps {
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  eyebrow?: string;
  title?: string;
  text?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  portrait?: string;
  usersBadge?: { label: string; avatars: string[] };
  reviews?: { value: number; label: string };
}

const DEFAULTS: Required<HeroSplitPortraitProps> = {
  brand: 'Socialee',
  nav: [
    { label: 'Evento', href: '#evento' },
    { label: 'Chi siamo', href: '#team' },
    { label: 'Servizi', href: '#servizi' },
    { label: 'Casi studio', href: '#casi' },
  ],
  navCta: { label: 'Iscriviti', href: '#iscrizione' },
  eyebrow: '👋 Ciao! Siamo Socialee',
  title: 'L’AI che lavora per la tua attività locale',
  text: 'In un’ora e mezza ti mostriamo dal vivo come usare l’intelligenza artificiale per creare contenuti, offerte e comunicazioni che portano clienti in negozio.',
  primaryCta: { label: 'Prenota il posto', href: '#iscrizione' },
  secondaryCta: { label: 'Chi siamo', href: '#team' },
  portrait: 'giuseppe.png',
  usersBadge: { label: '250+ imprenditori', avatars: ['giorgia.png', 'noemi.png', 'manuel.png'] },
  reviews: { value: 4.8, label: '(4.8) Recensioni' },
};

export const ORANGE = '#ff7a45';

/** Linee verticali decorative a 1/3 e 2/3 (tratto distintivo Digiket). */
export function GridLines({ className = 'border-orange-200/50' }: { className?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-6xl grid-cols-3 lg:grid">
      <div className={`border-r ${className}`} />
      <div className={`border-r ${className}`} />
    </div>
  );
}

function Chevrons() {
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="chev" width="44" height="36" patternUnits="userSpaceOnUse">
          <path d="M2 4 L22 18 L42 4 M2 20 L22 34 L42 20" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#chev)" />
    </svg>
  );
}

export function GoogleG({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function HeroSplitPortrait(props: HeroSplitPortraitProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf3ee] to-white font-work text-[#0f1629]">
      <header className="relative z-10 border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 text-2xl font-semibold">
            <Layers className="h-7 w-7" style={{ color: ORANGE }} />
            {p.brand}
          </a>
          <nav className="hidden gap-7 text-sm font-medium md:flex">
            {p.nav.map((l) => (
              <a key={l.href} href={l.href} className="hover:opacity-70">
                {l.label}
              </a>
            ))}
          </nav>
          <a href={p.navCta.href} className="flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: ORANGE }}>
            {p.navCta.label} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <GridLines />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-sm font-semibold" style={{ color: ORANGE }}>
            {p.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">{p.title}</h1>
          <p className="mt-6 max-w-md leading-relaxed text-zinc-600">{p.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={p.primaryCta.href} className="flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5" style={{ background: ORANGE }}>
              {p.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={p.secondaryCta.href} className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5">
              {p.secondaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Chevrons />
            <img
              src={p.portrait}
              alt=""
              className="absolute inset-x-6 bottom-0 top-10 h-[calc(100%-2.5rem)] w-[calc(100%-3rem)] rounded-t-[2rem] object-cover [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
            />
          </div>
          <div className="absolute -left-6 top-1/4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium shadow-lg sm:-left-16">
            {p.usersBadge.label}
            <AvatarStack src={p.usersBadge.avatars} size="h-6 w-6" />
          </div>
          <div className="absolute -right-4 bottom-16 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-right-10">
            <GoogleG />
            <Stars value={5} color="text-amber-500" className="h-4 w-4" />
            <span className="text-xs text-zinc-500">{p.reviews.label}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
