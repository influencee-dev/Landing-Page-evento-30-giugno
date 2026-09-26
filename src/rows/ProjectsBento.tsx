import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Row 14 — Progetti in evidenza, bento (ref. Shinta "Work We're Proud Of")
 * Card ampia in alto + colonna alta e due card impilate; ogni card ha
 * una barra-etichetta con nome cliente, metrica e freccia.
 */
export interface Project {
  name: string;
  metric: string;
  image: string;
  href?: string;
}

export interface ProjectsBentoProps {
  eyebrow?: string;
  title?: string;
  projects?: [Project, Project, Project, Project];
  accent?: string;
}

const DEFAULTS: Required<ProjectsBentoProps> = {
  eyebrow: 'Progetti in evidenza',
  title: 'Lavori di cui\nandiamo fieri',
  projects: [
    { name: 'Festival del Nerd', metric: '/ 30M views organiche', image: 'card1.png', href: '#' },
    { name: 'Brand Partner', metric: '/ 6x prenotazioni', image: 'card2.png', href: '#' },
    { name: 'Socialee Lab', metric: '/ 5M reach', image: 'spiegazione.png', href: '#' },
    { name: 'Local Heroes', metric: '/ 3x fatturato', image: 'card3.png', href: '#' },
  ],
  accent: '#f9a8e8',
};

function Card({ p, className }: { p: Project; className: string }) {
  return (
    <motion.a
      href={p.href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      className={`group relative block overflow-hidden rounded-3xl bg-zinc-900 ${className}`}
    >
      <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-x-2 top-2 flex items-center gap-2">
        <span className="flex flex-1 items-center justify-between rounded-full bg-white/90 px-4 py-1.5 text-sm backdrop-blur">
          <b className="font-medium">{p.name}</b>
          <span className="hidden text-[10px] uppercase tracking-wide text-zinc-500 sm:inline">{p.metric}</span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </motion.a>
  );
}

export default function ProjectsBento(props: ProjectsBentoProps) {
  const p = { ...DEFAULTS, ...props };
  const [a, b, c, d] = p.projects;

  return (
    <section className="bg-gradient-to-b from-[#f4f4f5] to-[#e9e3ff] px-4 py-20 font-tight text-zinc-950 sm:px-6">
      <div className="text-center">
        <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide" style={{ background: p.accent }}>
          {p.eyebrow}
        </span>
        <h2 className="mt-3 whitespace-pre-line text-4xl font-semibold leading-[1] tracking-[-0.04em] sm:text-6xl">{p.title}</h2>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-5">
        <Card p={a} className="aspect-[16/9] sm:col-span-5" />
        <Card p={b} className="aspect-[3/4] sm:col-span-3 sm:row-span-2 sm:aspect-auto" />
        <Card p={c} className="aspect-[4/3] sm:col-span-2" />
        <Card p={d} className="aspect-[4/3] sm:col-span-2" />
      </div>
    </section>
  );
}
