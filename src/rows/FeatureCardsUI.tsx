import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

/**
 * Row 28 — Feature a card con mini-interfacce (ref. Alytics features)
 * Griglia 2x2: ogni card ha un pannello grigio con una piccola UI animata
 * (grafico, chip di suggerimenti AI, lista integrazioni, curva retention) + titolo e testo.
 */
export interface FeatureCardsUIProps {
  features?: { title: string; text: string }[];
  chips?: string[];
  channels?: { name: string; delta: string; up: boolean; color: string }[];
  accent?: string;
}

const DEFAULTS: Required<FeatureCardsUIProps> = {
  features: [
    { title: 'Metriche in un colpo d’occhio', text: 'Reach, prenotazioni e contatti in un’unica vista, senza saltare tra mille app.' },
    { title: 'Idee generate con l’AI', text: 'Suggerimenti pratici su cosa pubblicare, partendo dai tuoi dati e dalla stagione.' },
    { title: 'Canali sotto controllo', text: 'Vedi quale canale porta davvero clienti e dove conviene investire.' },
    { title: 'Clienti che ritornano', text: 'Capisci quali promo fanno tornare i clienti e quali no.' },
  ],
  chips: ['Promo happy hour', 'Menu estivo', 'Reel dietro le quinte', 'Offerta weekend', 'Sondaggio stories', 'Recensioni clienti'],
  channels: [
    { name: 'Instagram', delta: '12%', up: true, color: '#e1306c' },
    { name: 'Meta Ads', delta: '8%', up: false, color: '#ff6b3d' },
    { name: 'WhatsApp', delta: '10%', up: true, color: '#25d366' },
  ],
  accent: '#1f6bff',
};

const LINE = 'M0 70 L40 70 L60 55 L80 55 L95 42 L105 48 L120 32 L145 32 L160 22 L175 30 L200 10';
const CURVE = 'M0 70 C 30 70, 40 20, 70 20 S 100 75, 120 72 S 150 30, 165 30 S 190 45, 200 15';

export default function FeatureCardsUI(props: FeatureCardsUIProps) {
  const p = { ...DEFAULTS, ...props };

  const panels = [
    <div key="m" className="w-64 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex justify-between text-[10px] text-zinc-500">
        <span>Contatti</span>
        <span>Prenotazioni</span>
      </div>
      <div className="flex justify-between text-lg font-medium">
        <span>
          1.284 <span className="rounded bg-blue-100 px-1 text-[9px] text-blue-600">+30%</span>
        </span>
        <span>312</span>
      </div>
      <svg viewBox="0 0 200 80" className="mt-2 w-full">
        <motion.path d={LINE} fill="none" stroke={p.accent} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
      </svg>
    </div>,
    <div key="a" className="relative flex h-full w-full flex-col items-center justify-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_0_40px_rgba(31,107,255,0.3)]">
        <Sparkles className="h-8 w-8" style={{ color: p.accent, fill: p.accent }} />
      </span>
      <div className="mt-5 flex max-w-sm flex-wrap justify-center gap-2">
        {p.chips.map((c, i) => (
          <motion.span
            key={c}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-full px-3 py-1 text-[10px] shadow-sm ${i === 1 ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}
            style={{ rotate: `${(i % 3) * 4 - 4}deg` }}
          >
            {c}
          </motion.span>
        ))}
      </div>
    </div>,
    <div key="c" className="w-64 space-y-2">
      {p.channels.map((ch) => (
        <div key={ch.name} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
          <span className="h-8 w-8 rounded-full" style={{ background: ch.color }} />
          <div className="flex-1">
            <p className="flex justify-between text-xs">
              {ch.name}
              <span className={`rounded px-1 text-[9px] ${ch.up ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-500'}`}>
                {ch.up ? '↑' : '↓'} {ch.delta}
              </span>
            </p>
            <div className="mt-1.5 h-1.5 rounded-full bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>,
    <div key="r" className="relative w-60 rounded-xl bg-white p-4 shadow-sm">
      <p className="text-xs text-zinc-500">Clienti di ritorno</p>
      <svg viewBox="0 0 200 80" className="mt-2 w-full">
        <defs>
          <linearGradient id="fcg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={p.accent} stopOpacity="0.25" />
            <stop offset="1" stopColor={p.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${CURVE} L200 80 L0 80Z`} fill="url(#fcg)" />
        <path d={CURVE} fill="none" stroke={p.accent} strokeWidth="1.5" />
      </svg>
      <span className="absolute -left-8 -top-3 flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[9px] shadow">
        <img src="noemi.png" alt="" className="h-4 w-4 rounded-full object-cover" /> Sara è tornata
      </span>
      <span className="absolute -bottom-3 -right-6 flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[9px] shadow">
        <img src="marika.png" alt="" className="h-4 w-4 rounded-full object-cover" /> Giulia è tornata
      </span>
    </div>,
  ];

  return (
    <section className="bg-[#f7f7f7] px-4 py-20 font-work text-zinc-900 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
        {p.features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 2) * 0.08 }}
            className="rounded-2xl bg-white p-3 shadow-sm"
          >
            <div className="flex h-56 items-center justify-center overflow-hidden rounded-xl bg-[#f3f3f3]">{panels[i]}</div>
            <div className="p-3">
              <h3 className="text-xl font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
