import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

/**
 * Row 13 — Storytelling con tre media sfalsati (ref. "Storytelling, not technical demos")
 * Pill eyebrow, titolo a sinistra e paragrafo a destra; sotto tre media verticali
 * a altezze sfalsate, quello centrale con play.
 */
export interface MediaItem {
  image: string;
  video?: string;
}

export interface MediaTrioProps {
  eyebrow?: string;
  title?: string;
  text?: string;
  media?: [MediaItem, MediaItem, MediaItem];
  accent?: string;
}

const DEFAULTS: Required<MediaTrioProps> = {
  eyebrow: 'Il nostro approccio',
  title: 'Esempi pratici,\nnon demo tecniche',
  text: 'Niente slide infinite sugli strumenti: partiamo dai problemi di tutti i giorni della tua attività e ti mostriamo prima e dopo, flussi reali e risultati che contano davvero.',
  media: [{ image: 'card1.png' }, { image: 'spiegazione.png' }, { image: 'card3.png' }],
  accent: '#f5a3ec',
};

const OFFSETS = ['lg:mt-24', 'lg:mt-12', 'lg:mt-0'];

export default function MediaTrio(props: MediaTrioProps) {
  const p = { ...DEFAULTS, ...props };
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <section className="bg-[#f4f4f4] px-4 py-20 font-tight text-zinc-950 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-end">
        <div>
          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide" style={{ background: p.accent }}>
            {p.eyebrow}
          </span>
          <h2 className="mt-3 whitespace-pre-line text-4xl font-semibold leading-[1] tracking-[-0.04em] sm:text-5xl">{p.title}</h2>
        </div>
        <p className="max-w-md text-zinc-600 lg:justify-self-end">{p.text}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 items-start gap-5 sm:grid-cols-3">
        {p.media.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className={`relative aspect-[9/16] overflow-hidden rounded-2xl ${OFFSETS[i]}`}
          >
            {playing === i && m.video ? (
              <video src={m.video} autoPlay controls className="h-full w-full object-cover" />
            ) : (
              <>
                <img src={m.image} alt="" className="h-full w-full object-cover" />
                {i === 1 && (
                  <button
                    type="button"
                    onClick={() => setPlaying(i)}
                    aria-label="Riproduci"
                    className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/80 transition hover:scale-110"
                  >
                    <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                  </button>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
