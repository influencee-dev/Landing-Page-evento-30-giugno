import React from 'react';
import { motion } from 'motion/react';

/**
 * Row 18 — Casi di successo a card (ref. "Our Solutions Drive Success for Clients")
 * Titolo a sinistra + bottone "esplora" a destra, card con foto, tag e titolo.
 */
export interface CaseCard {
  image: string;
  tag: string;
  title: string;
  href?: string;
}

export interface CaseCardsProps {
  eyebrow?: string;
  title?: string;
  cta?: { label: string; href: string };
  cases?: CaseCard[];
  accent?: string;
}

const DEFAULTS: Required<CaseCardsProps> = {
  eyebrow: 'Casi studio',
  title: 'Le nostre soluzioni portano\nrisultati ai clienti',
  cta: { label: 'Vedi tutti', href: '#casi' },
  cases: [
    { image: 'card1.png', tag: 'Eventi', title: 'Festival del Nerd: 30M di views con una strategia short-form', href: '#' },
    { image: 'spiegazione.png', tag: 'Formazione', title: 'A(I)peritivo: imprenditori che creano contenuti con l’AI', href: '#' },
  ],
  accent: '#ff6b3d',
};

export default function CaseCards(props: CaseCardsProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-[#fdf7f1] px-4 py-20 font-work text-zinc-950 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white" style={{ background: p.accent }}>
            {p.eyebrow}
          </span>
          <h2 className="mt-4 whitespace-pre-line text-3xl font-medium leading-tight tracking-tight sm:text-5xl">{p.title}</h2>
        </div>
        <a href={p.cta.href} className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm hover:border-zinc-500">
          {p.cta.label}
        </a>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
        {p.cases.map((c, i) => (
          <motion.a
            key={i}
            href={c.href}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group block"
          >
            <div className="overflow-hidden rounded-2xl">
              <img src={c.image} alt="" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <span className="mt-4 inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase text-white" style={{ background: p.accent }}>
              {c.tag}
            </span>
            <h3 className="mt-2 text-xl font-medium leading-snug group-hover:underline">{c.title}</h3>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
