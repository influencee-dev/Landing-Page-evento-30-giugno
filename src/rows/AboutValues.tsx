import React from 'react';
import { motion } from 'motion/react';
import type { Cta, NavLink } from './shared';

/**
 * Row 19 — About / valori (ref. Flexio)
 * Navbar a capsula color pesca, etichetta, titolo grande allineato a sinistra,
 * due foto affiancate (larga + stretta) e riga di card statistiche arancio.
 */
export interface AboutValuesProps {
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  eyebrow?: string;
  title?: string;
  text?: string;
  images?: [string, string];
  stats?: { value: string; label: string }[];
  accent?: string;
  showNav?: boolean;
}

const DEFAULTS: Required<AboutValuesProps> = {
  brand: 'Socialee',
  nav: [
    { label: 'Home', href: '#' },
    { label: 'Servizi', href: '#servizi' },
    { label: 'Chi siamo', href: '#team' },
    { label: 'Casi studio', href: '#casi' },
    { label: 'Contatti', href: '#contatti' },
  ],
  navCta: { label: 'Parliamone', href: '#contatti' },
  eyebrow: 'Chi siamo',
  title: 'I nostri valori al centro\ndi tutto quello che facciamo',
  text: 'Scopri il nostro percorso, i valori e la passione con cui aiutiamo ogni giorno attività come la tua a comunicare meglio.',
  images: ['spiegazione.png', 'giorgia.png'],
  stats: [
    { value: '250+', label: 'Imprenditori formati' },
    { value: '8M+', label: 'Views generate' },
    { value: '7', label: 'Professionisti nel team' },
  ],
  accent: '#ff6436',
  showNav: true,
};

export default function AboutValues(props: AboutValuesProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-white px-4 pb-20 pt-5 font-work text-zinc-900 sm:px-6">
      {p.showNav && (
        <header className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-[#fdebdc] py-2 pl-4 pr-2">
          <a href="#" className="flex items-center gap-2 text-xl font-medium">
            <span className="relative h-7 w-8 overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-4 rounded-t-full" style={{ background: p.accent }} />
              <span className="absolute inset-x-0 bottom-0 h-3 rounded-t-full bg-zinc-900" />
            </span>
            {p.brand}
          </a>
          <nav className="hidden gap-6 text-sm md:flex">
            {p.nav.map((l) => (
              <a key={l.href + l.label} href={l.href} className="hover:opacity-60">
                {l.label}
              </a>
            ))}
          </nav>
          <a href={p.navCta.href} className="rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-md" style={{ background: p.accent }}>
            {p.navCta.label}
          </a>
        </header>
      )}

      <div className="mx-auto mt-14 max-w-5xl">
        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white" style={{ background: p.accent }}>
          {p.eyebrow}
        </span>
        <h2 className="mt-3 whitespace-pre-line text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">{p.title}</h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-700">{p.text}</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-[2fr_1fr]">
          {p.images.map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt=""
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-auto sm:h-96"
            />
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {p.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-2xl px-6 py-8 text-white"
              style={{ background: p.accent }}
            >
              <p className="text-5xl font-medium tracking-tight">{s.value}</p>
              <p className="mt-2 text-sm text-white/85">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
