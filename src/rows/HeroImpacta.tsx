import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Zap } from 'lucide-react';
import { AvatarStack, type Cta, type NavLink } from './shared';

/**
 * Row 27 — Hero centrata "Impacta" con 3 varianti di contenuto sotto:
 *  - "marquee": nastro di card verticali che scorre
 *  - "work": filtri a pillola + griglia di lavori
 *  - "contact": step numerati + form con scelta servizio e budget
 * Stessa testata (nav, titolo con parola accento, riprova sociale).
 */
export interface HeroImpactaProps {
  variant?: 'marquee' | 'work' | 'contact';
  brand?: string;
  nav?: NavLink[];
  navCta?: Cta;
  title?: string;
  titleAccent?: string;
  /** "after" = parola accento a fine titolo, "line" = su riga propria. */
  accentPosition?: 'after' | 'line' | 'middle';
  titleEnd?: string;
  subtitle?: string;
  primaryCta?: Cta | null;
  secondaryCta?: Cta | null;
  proof?: { avatars: string[]; rating: string; label: string };
  images?: string[];
  work?: { image: string; category: string }[];
  categories?: string[];
  contact?: {
    steps: { title: string; text: string }[];
    services: string[];
    budgets: string[];
  };
  accent?: string;
}

const COPY = {
  marquee: { title: 'Aiutiamo le attività', titleAccent: 'a vincere sui social', accentPosition: 'line' as const, titleEnd: '' },
  work: { title: 'Dentro i nostri lavori', titleAccent: 'migliori', accentPosition: 'after' as const, titleEnd: '' },
  contact: { title: 'Facciamo', titleAccent: 'crescere', accentPosition: 'middle' as const, titleEnd: 'la tua attività' },
};

const DEFAULTS = {
  brand: 'Socialee',
  nav: [
    { label: 'Home', href: '#' },
    { label: 'Chi siamo', href: '#team' },
    { label: 'Casi studio', href: '#casi' },
    { label: 'Contatti', href: '#contatti' },
  ],
  navCta: { label: 'Prenota una call', href: '#contatti' },
  subtitle: 'Raggiungiamo il pubblico giusto con contenuti, gestione e advertising sui social che contano davvero.',
  primaryCta: { label: 'Facciamoti brillare', href: '#contatti' },
  secondaryCta: { label: 'Vedi i prezzi', href: '#prezzi' },
  proof: { avatars: ['giorgia.png', 'giuseppe.png', 'noemi.png', 'manuel.png'], rating: '4.9/5', label: '250+ attività seguite' },
  images: ['card1.png', 'card2.png', 'card3.png', 'spiegazione.png', 'card1.png', 'card2.png'],
  categories: ['Tutti', 'Ristorazione', 'Beauty', 'Eventi', 'Fitness'],
  work: [
    { image: 'card2.png', category: 'Ristorazione' },
    { image: 'card1.png', category: 'Eventi' },
    { image: 'card3.png', category: 'Ristorazione' },
    { image: 'spiegazione.png', category: 'Eventi' },
  ],
  contact: {
    steps: [
      { title: 'Risposta rapida', text: 'Il tuo messaggio è in buone mani: rispondiamo entro un giorno lavorativo.' },
      { title: 'Soluzioni su misura', text: 'Niente pacchetti generici: tutto parte dai tuoi obiettivi e dalla tua attività.' },
      { title: 'Crescita misurabile', text: 'Dalla visibilità al fatturato, ci concentriamo su risultati concreti.' },
    ],
    services: ['Contenuti', 'Social media management', 'Advertising', 'Tutto'],
    budgets: ['< €1.000', '€1–3K', '€3–5K', '€5K+'],
  },
  accent: '#ff0f4f',
};

function Chips({ items, accent, value, onChange }: { items: string[]; accent: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={it}
          type="button"
          onClick={() => onChange(it)}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs"
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent, opacity: value === it ? 1 : 0.25 }} />
          {it}
        </button>
      ))}
    </div>
  );
}

export default function HeroImpacta(props: HeroImpactaProps) {
  const variant = props.variant ?? 'marquee';
  const p = { ...DEFAULTS, ...COPY[variant], ...(variant === 'marquee' ? {} : { primaryCta: null, secondaryCta: null }), ...props };
  const [cat, setCat] = useState(p.categories[0]);
  const [service, setService] = useState(p.contact.services[0]);
  const [budget, setBudget] = useState(p.contact.budgets[0]);
  const accentSpan = <span style={{ color: p.accent }}>{p.titleAccent}</span>;

  return (
    <section className="overflow-hidden bg-[#efefef] font-tight text-zinc-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <a href="#" className="flex items-center gap-2 text-xl font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-white shadow-lg" style={{ background: p.accent, boxShadow: `0 4px 14px ${p.accent}66` }}>
            <Zap className="h-4 w-4 fill-white" />
          </span>
          {p.brand}
        </a>
        <nav className="hidden gap-6 md:flex">
          {p.nav.map((l) => (
            <a key={l.href + l.label} href={l.href} className="hover:opacity-60">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={p.navCta.href} className="rounded-full px-5 py-2.5 text-sm font-medium text-white" style={{ background: p.accent, boxShadow: `0 6px 18px ${p.accent}55` }}>
          {p.navCta.label}
        </a>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-6xl">
          {p.accentPosition === 'line' && (
            <>
              {p.title}
              <br />
              {accentSpan}
            </>
          )}
          {p.accentPosition === 'after' && (
            <>
              {p.title} {accentSpan}
            </>
          )}
          {p.accentPosition === 'middle' && (
            <>
              {p.title} {accentSpan}
              <br />
              {p.titleEnd}
            </>
          )}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-600">{p.subtitle}</p>
        {(p.primaryCta || p.secondaryCta) && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {p.primaryCta && (
              <a href={p.primaryCta.href} className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg">
                <Phone className="h-4 w-4" /> {p.primaryCta.label}
              </a>
            )}
            {p.secondaryCta && (
              <a href={p.secondaryCta.href} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium shadow">
                {p.secondaryCta.label}
              </a>
            )}
          </div>
        )}
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="flex items-center">
            <AvatarStack src={p.proof.avatars} size="h-8 w-8" />
            <span className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-white ring-2 ring-white" style={{ background: p.accent }}>
              <Zap className="h-4 w-4 fill-white" />
            </span>
          </span>
          <span className="text-left text-xs">
            {p.proof.rating} <span style={{ color: p.accent }}>★★★★★</span>
            <br />
            {p.proof.label}
          </span>
        </div>
      </div>

      {variant === 'marquee' && (
        <div className="mt-14 overflow-hidden pb-16 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
          <div className="flex w-max animate-marquee gap-5">
            {[...p.images, ...p.images].map((src, i) => (
              <div key={i} className="w-60 shrink-0 rounded-2xl bg-white p-1.5 shadow">
                <img src={src} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 'work' && (
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {p.categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2.5 text-sm transition ${cat === c ? 'bg-white shadow' : 'bg-zinc-200 hover:bg-zinc-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2">
            {p.work
              .filter((w) => cat === p.categories[0] || w.category === cat)
              .map((w, i) => (
                <motion.div layout key={w.image + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-white p-1.5 shadow">
                  <img src={w.image} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
                </motion.div>
              ))}
          </motion.div>
        </div>
      )}

      {variant === 'contact' && (
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 px-4 pb-16 sm:px-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-5">
            {p.contact.steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-white/70 p-5">
                <p className="flex items-center gap-2 font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white" style={{ background: p.accent }}>
                    0{i + 1}
                  </span>
                  {s.title}
                </p>
                <p className="mt-2 text-sm text-zinc-600">{s.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5 rounded-2xl bg-white/70 p-6 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                Nome e cognome
                <input className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 outline-none focus:border-zinc-400" placeholder="Mario Rossi" />
              </label>
              <label className="block">
                Email
                <input type="email" className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 outline-none focus:border-zinc-400" placeholder="mario@esempio.it" />
              </label>
            </div>
            <div>
              <p className="mb-2">Che servizio ti interessa?</p>
              <Chips items={p.contact.services} accent={p.accent} value={service} onChange={setService} />
            </div>
            <div>
              <p className="mb-2">Budget indicativo</p>
              <Chips items={p.contact.budgets} accent={p.accent} value={budget} onChange={setBudget} />
            </div>
            <label className="block">
              Raccontaci la tua attività
              <textarea rows={3} className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 outline-none focus:border-zinc-400" placeholder="Scrivi il tuo messaggio" />
            </label>
            <button type="submit" className="rounded-full px-6 py-3 font-medium text-white" style={{ background: p.accent }}>
              Invia richiesta
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
