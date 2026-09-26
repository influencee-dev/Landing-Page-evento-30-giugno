import React from 'react';
import { motion } from 'motion/react';
import { Stars, type Cta, type NavLink } from './shared';

/**
 * Row 01 — Hero "bold + pill" (ref. AdCrew)
 * Titolo condensato enorme con una parola evidenziata in una pillola,
 * badge recensioni, due CTA, forme 3D fluttuanti e marquee di loghi.
 */
export interface HeroBoldPillProps {
  logo?: React.ReactNode;
  nav?: NavLink[];
  navCta?: Cta;
  rating?: { value: number; label: string };
  /** Righe del titolo; la parola in `highlight` finisce nella pillola. */
  titleLines?: string[];
  highlight?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  logos?: string[];
  accent?: string;
}

const DEFAULTS: Required<Omit<HeroBoldPillProps, 'logo'>> = {
  nav: [
    { label: 'Evento', href: '#evento' },
    { label: 'Programma', href: '#programma' },
    { label: 'Team', href: '#team' },
    { label: 'FAQ', href: '#faq' },
  ],
  navCta: { label: 'Prenota', href: '#iscrizione' },
  rating: { value: 4.9, label: '4.9 stelle · 60+ recensioni' },
  titleLines: ['L’AI per la tua attività,', 'spiegata da veri'],
  highlight: 'esperti.',
  subtitle:
    'Un aperitivo pratico per imprenditori: locandine, menu e promo creati dal vivo con l’intelligenza artificiale. Zero teoria, solo risultati.',
  primaryCta: { label: 'Prenota il posto', href: '#iscrizione' },
  secondaryCta: { label: 'Vedi il programma', href: '#programma' },
  logos: ['Ristorazione', 'Retail', 'Beauty', 'Fitness', 'Studi medici', 'Hospitality', 'E-commerce', 'Servizi'],
  accent: '#a78bfa',
};

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="sparkle-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="55%" stopColor="#09090b" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0Z" fill="url(#sparkle-g)" />
    </svg>
  );
}

function Bolt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="bolt-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="50%" stopColor="#09090b" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <path d="M40 0 L4 58 H30 L20 100 L60 38 H34 Z" fill="url(#bolt-g)" />
    </svg>
  );
}

export default function HeroBoldPill(props: HeroBoldPillProps) {
  const p = { ...DEFAULTS, ...props };
  const lastLine = p.titleLines.length - 1;

  return (
    <section className="relative overflow-hidden bg-[#f4f4f5] font-sans text-zinc-900">
      {/* Navbar */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {props.logo ?? (
            <a href="#" className="flex items-center gap-2 font-anton text-2xl tracking-wide">
              <span className="flex">
                <span className="h-4 w-4 rounded-full" style={{ background: p.accent }} />
                <span className="-ml-1 h-4 w-4 rounded-full" style={{ background: p.accent }} />
              </span>
              SOCIALEE
            </a>
          )}
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {p.nav.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-zinc-500">
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href={p.navCta.href}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            {p.navCta.label}
          </a>
        </div>
      </header>

      {/* Forme 3D fluttuanti */}
      <Sparkle className="pointer-events-none absolute left-[4%] top-28 hidden w-16 animate-float drop-shadow-xl sm:block lg:w-20" />
      <Bolt
        className="pointer-events-none absolute right-[6%] top-[55%] hidden w-10 animate-float drop-shadow-xl sm:block lg:w-14"
        // @ts-expect-error custom property usata dal keyframe float
        style={{ '--r': '-12deg', animationDelay: '1.5s' }}
      />

      <div className="mx-auto max-w-5xl px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm shadow-sm"
        >
          <Stars value={p.rating.value} color="text-violet-500" className="h-4 w-4" />
          <span className="font-medium">{p.rating.label}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 font-anton text-5xl uppercase leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
        >
          {p.titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
              {i === lastLine && (
                <>
                  {' '}
                  <span
                    className="inline-block rounded-full px-4 leading-[1.15] sm:px-6"
                    style={{ background: p.accent }}
                  >
                    {p.highlight}
                  </span>
                </>
              )}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-base text-zinc-700 sm:text-lg"
        >
          {p.subtitle}
        </motion.p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={p.primaryCta.href}
            className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            {p.primaryCta.label}
          </a>
          <a
            href={p.secondaryCta.href}
            className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-zinc-400"
          >
            {p.secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Marquee loghi / settori */}
      <div className="relative overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-14">
          {[...p.logos, ...p.logos].map((l, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap text-lg font-semibold text-zinc-800">
              <span className="h-5 w-5 rotate-45 rounded-[4px] bg-zinc-900" />
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
