import React from 'react';
import { motion } from 'motion/react';

/**
 * Row 16 — Settori a pillole colorate (ref. "Industry-Specific Expertise")
 * Eyebrow a etichetta, titolo centrato e pillole multicolore che entrano a cascata.
 */
export interface IndustryPillsProps {
  eyebrow?: string;
  title?: string;
  items?: { label: string; color: string; text?: string }[];
}

const DEFAULTS: Required<IndustryPillsProps> = {
  eyebrow: 'Per chi è',
  title: 'Competenze pensate per\nil tuo settore',
  items: [
    { label: 'Ristoranti', color: '#3b5bdb', text: '#fff' },
    { label: 'Bar & cocktail', color: '#ff6b3d', text: '#fff' },
    { label: 'Negozi', color: '#63c7b2' },
    { label: 'Beauty & benessere', color: '#fcd97a' },
    { label: 'Palestre', color: '#2f4fd8', text: '#fff' },
    { label: 'Studi medici', color: '#f5a3b5' },
    { label: 'Hotel & B&B', color: '#7ea6e0' },
    { label: 'Professionisti', color: '#ff6b3d', text: '#fff' },
  ],
};

export default function IndustryPills(props: IndustryPillsProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-white px-4 py-20 text-center font-work text-zinc-950 sm:px-6">
      <span className="rounded bg-[#ff6b3d] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">{p.eyebrow}</span>
      <h2 className="mt-4 whitespace-pre-line text-3xl font-medium leading-tight tracking-tight sm:text-5xl">{p.title}</h2>
      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
        {p.items.map((it, i) => (
          <motion.span
            key={it.label}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, type: 'spring' }}
            whileHover={{ y: -4, rotate: i % 2 ? 2 : -2 }}
            className="cursor-default rounded-full px-6 py-3 text-sm font-medium shadow-sm"
            style={{ background: it.color, color: it.text ?? '#111' }}
          >
            {it.label}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
