import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

/**
 * Row 08 — Team bento (ref. AdScale)
 * Griglia a 3 colonne sfalsate: card testo (ruolo + bio + nome), card foto,
 * card statistica scura e foto alta di team al lavoro.
 */
export type BentoItem =
  | { type: 'bio'; title: string; text: string; name: string; role: string }
  | { type: 'photo'; src: string; alt?: string; tall?: boolean }
  | { type: 'stat'; text: string; value: string; label: string };

export interface TeamBentoProps {
  badge?: string;
  title?: string;
  titleItalic?: string;
  subtitle?: string;
  /** Tre colonne, ognuna con la propria pila di elementi. */
  columns?: BentoItem[][];
}

const DEFAULTS: Required<TeamBentoProps> = {
  badge: 'Chi siamo',
  title: 'Il team dietro',
  titleItalic: 'Socialee',
  subtitle: 'Le persone che ogni giorno fanno crescere attività locali e brand.',
  columns: [
    [
      { type: 'bio', title: 'Strategia & visione', text: 'Disegna la strategia e fa in modo che ogni euro investito torni indietro.', name: 'Giorgia Palazzo', role: 'Founder & CEO' },
      { type: 'photo', src: 'giuseppe.png' },
      { type: 'bio', title: 'Design', text: 'Trasforma le idee in locandine, grafiche e visual che si fanno notare.', name: 'Marika Malaspina', role: 'Graphic Designer' },
    ],
    [
      { type: 'photo', src: 'giorgia.png' },
      { type: 'bio', title: 'Operations', text: 'Coordina processi e produzione perché tutto esca in tempo e fatto bene.', name: 'Manuel Arlotti', role: 'Co-founder & COO' },
      { type: 'photo', src: 'marika.png' },
    ],
    [
      { type: 'stat', text: 'Aiutiamo attività locali a crescere con contenuti e campagne misurabili.', value: '250+', label: 'Imprenditori formati sull’AI' },
      { type: 'photo', src: 'spiegazione.png', tall: true },
    ],
  ],
};

function Item({ item }: { item: BentoItem }) {
  if (item.type === 'photo')
    return <img src={item.src} alt={item.alt ?? ''} className={`w-full rounded-3xl object-cover ${item.tall ? 'aspect-[3/5]' : 'aspect-square'}`} />;
  if (item.type === 'stat')
    return (
      <div className="flex aspect-square flex-col justify-between rounded-3xl bg-[#1a1a1a] p-7 text-white sm:aspect-auto sm:min-h-[220px]">
        <p className="max-w-[16rem] text-sm text-white/70">{item.text}</p>
        <div>
          <p className="text-5xl tracking-tight">{item.value}</p>
          <p className="mt-1 text-sm text-white/80">{item.label}</p>
        </div>
      </div>
    );
  return (
    <div className="flex aspect-square flex-col justify-between rounded-3xl bg-white p-6">
      <div>
        <p className="text-lg">{item.title}</p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600">{item.text}</p>
      </div>
      <div>
        <p>{item.name}</p>
        <p className="text-xs text-zinc-500">{item.role}</p>
      </div>
    </div>
  );
}

export default function TeamBento(props: TeamBentoProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-[#f0f0f0] px-4 py-20 font-tight text-zinc-900 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs">
          <BookOpen className="h-3 w-3" />
          {p.badge}
        </span>
        <h2 className="mt-4 text-4xl tracking-[-0.03em] sm:text-6xl">
          {p.title} <em className="font-serif tracking-normal">{p.titleItalic}</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xs text-sm text-zinc-500">{p.subtitle}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
        {p.columns.map((col, c) => (
          <div key={c} className={`flex flex-col gap-5 ${c === 1 ? 'sm:pt-0' : ''}`}>
            {col.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: c * 0.08 + i * 0.05 }}
              >
                <Item item={item} />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
