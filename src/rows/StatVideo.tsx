import React from 'react';
import { motion } from 'motion/react';

/**
 * Row 15 — Video UGC + statistica (ref. Shinta "High-performing UGC")
 * Video verticale con sottotitolo in sovrimpressione e badge numerico,
 * a fianco titolo con gradiente in dissolvenza e paragrafo.
 */
export interface StatVideoProps {
  image?: string;
  video?: string;
  caption?: string;
  stat?: { value: string; label: string };
  title?: string;
  text?: string;
  accent?: string;
  reverse?: boolean;
}

const DEFAULTS: Required<Omit<StatVideoProps, 'video'>> = {
  image: 'card2.png',
  caption: 'Non pensavo bastasse una sera per imparare tutto questo…',
  stat: { value: '200%', label: 'Crescita follower organica' },
  title: 'Contenuti UGC che portano risultati veri',
  text: 'Il nostro approccio unisce insight di performance e creatività: ogni contenuto viene testato e migliorato per generare crescita misurabile per il tuo brand.',
  accent: '#f9a8e8',
  reverse: false,
};

export default function StatVideo(props: StatVideoProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="overflow-hidden bg-[#f4f4f5] px-4 py-20 font-tight text-zinc-950 sm:px-6">
      <div className={`mx-auto flex max-w-5xl flex-col items-center gap-14 lg:flex-row ${p.reverse ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[9/14] w-full max-w-[300px] shrink-0"
        >
          {props.video ? (
            <video src={props.video} autoPlay muted loop playsInline className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <img src={p.image} alt="" className="h-full w-full rounded-2xl object-cover" />
          )}
          <p className="absolute inset-x-6 bottom-28 text-center text-sm font-semibold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">{p.caption}</p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute -left-6 bottom-6 w-52 rounded-xl px-5 py-4"
            style={{ background: p.accent }}
          >
            <p className="text-3xl font-semibold">{p.stat.value}</p>
            <p className="text-sm text-zinc-700">{p.stat.label}</p>
          </motion.div>
        </motion.div>

        <div>
          <h2 className="bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-300 bg-clip-text text-4xl font-semibold leading-[1] tracking-[-0.04em] text-transparent sm:text-6xl">
            {p.title}
          </h2>
          <p className="mt-6 max-w-md text-zinc-500">{p.text}</p>
        </div>
      </div>
    </section>
  );
}
