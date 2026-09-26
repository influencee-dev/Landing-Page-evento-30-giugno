import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Box, Lock } from 'lucide-react';
import { AvatarStack, type Cta, type NavLink } from './shared';

/**
 * Row 09 — Hero split + showcase prodotto (ref. Machina)
 * Nav e bottoni in monospace maiuscolo, titolo a due righe con seconda
 * riga colorata, testo e CTA a destra; sotto, finestra browser su sfondo illustrato.
 */
export interface HeroProductShowcaseProps {
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  proof?: { avatars: string[]; label: string };
  title?: string;
  titleAccent?: string;
  text?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Immagine mostrata dentro la finestra del browser. */
  screenshot?: string;
  url?: string;
  background?: string;
  accent?: string;
}

const DEFAULTS: Required<HeroProductShowcaseProps> = {
  brand: 'SOCIALEE',
  nav: [
    { label: 'Evento', href: '#evento' },
    { label: 'Programma', href: '#programma' },
    { label: 'Servizi', href: '#servizi' },
    { label: 'FAQ', href: '#faq' },
  ],
  navCta: { label: 'Contattaci', href: '#contatti' },
  proof: { avatars: ['giorgia.png', 'giuseppe.png', 'manuel.png'], label: 'Guidato dal team Socialee,\nspecialisti in social e AI' },
  title: 'La tua comunicazione,',
  titleAccent: 'reinventata con l’AI.',
  text: 'Ti mostriamo dal vivo come trasformare ore di lavoro manuale in pochi minuti: locandine, menu, promo e testi generati con metodo, pronti da pubblicare.',
  primaryCta: { label: 'Prenota il posto', href: '#iscrizione' },
  secondaryCta: { label: 'Come funziona', href: '#programma' },
  screenshot: 'spiegazione.png',
  url: 'socialee.it/evento',
  background: 'linear-gradient(135deg,#fde2e4 0%,#fbc4ab 35%,#f8edeb 60%,#cde7d8 100%)',
  accent: '#ea580c',
};

export default function HeroProductShowcase(props: HeroProductShowcaseProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-white font-sans text-zinc-950">
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 font-mono text-sm uppercase sm:px-6">
          <a href="#" className="flex items-center gap-2 font-sans text-lg font-bold">
            <Box className="h-5 w-5" /> {p.brand}
          </a>
          <nav className="hidden gap-10 md:flex">
            {p.nav.map((l) => (
              <a key={l.href} href={l.href} className="hover:opacity-60">
                {l.label}
              </a>
            ))}
          </nav>
          <a href={p.navCta.href} className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 hover:bg-zinc-50">
            {p.navCta.label} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <AvatarStack src={p.proof.avatars} size="h-8 w-8" />
            <p className="whitespace-pre-line font-mono text-xs uppercase leading-tight">{p.proof.label}</p>
          </div>
          <h1 className="mt-5 text-5xl font-medium leading-[1] tracking-[-0.04em] sm:text-7xl">
            {p.title}
            <br />
            <span style={{ color: p.accent }}>{p.titleAccent}</span>
          </h1>
        </div>
        <div>
          <p className="max-w-lg text-lg leading-relaxed text-zinc-500">{p.text}</p>
          <div className="mt-7 flex flex-wrap gap-3 font-mono text-sm uppercase">
            <a href={p.primaryCta.href} className="flex items-center gap-2 rounded-full px-5 py-3 text-white transition hover:brightness-110" style={{ background: p.accent }}>
              {p.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </a>
            <a href={p.secondaryCta.href} className="rounded-full bg-zinc-950 px-5 py-3 text-white hover:bg-zinc-800">
              {p.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl px-4 pt-10 sm:px-16 sm:pt-16" style={{ background: p.background }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl overflow-hidden rounded-t-xl border border-zinc-200 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </span>
              <span className="mx-auto flex items-center gap-1.5 rounded-md bg-zinc-100 px-6 py-1 text-xs text-zinc-500">
                <Lock className="h-3 w-3" /> {p.url}
              </span>
            </div>
            <img src={p.screenshot} alt="" className="aspect-[16/9] w-full object-cover object-top" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
