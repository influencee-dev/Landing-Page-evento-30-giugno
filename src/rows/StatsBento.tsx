import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { AvatarStack } from './shared';

/**
 * Row 23 — Mission + bento di numeri (ref. Funnelz "Design to convert")
 * Titolo a due toni (grigio + nero), claim a destra, griglia di card
 * chiare con numeri grandi e card scura con rating e freccia di crescita.
 */
export interface StatsBentoProps {
  eyebrow?: string;
  titleMuted?: string;
  title?: string;
  claim?: string;
  partners?: { avatars: string[]; label: string };
  roi?: { text: string; value: string; unit: string; label: string };
  revenue?: { text: string; value: string; unit: string; label: string };
  availability?: string;
  dark?: { text: string; value: string; unit: string; label: string };
  accent?: string;
}

const DEFAULTS: Required<StatsBentoProps> = {
  eyebrow: 'Missione',
  titleMuted: 'Il nostro obiettivo è semplice',
  title: 'Comunicare per vendere',
  claim: 'Ti promettiamo risultati oltre le aspettative per la tua attività.',
  partners: { avatars: ['giorgia.png', 'giuseppe.png', 'noemi.png', 'manuel.png', 'carlo.png'], label: '40+ partner' },
  roi: { text: 'Rientri dell’investimento in 30 giorni', value: '90', unit: '%', label: 'Ritorno sull’investimento' },
  revenue: { text: 'Grazie a strategie su misura per ogni attività', value: '8M', unit: '+', label: 'Views generate' },
  availability: 'Posti disponibili per il 30 giugno',
  dark: { text: 'Abbiamo seguito 50+ progetti aiutando attività locali a trovare più clienti', value: '4.9', unit: '/5', label: 'Valutazione media dei clienti' },
  accent: '#e8472b',
};

const card = 'rounded-2xl border border-zinc-200 bg-[#f7f7f7]';

export default function StatsBento(props: StatsBentoProps) {
  const p = { ...DEFAULTS, ...props };
  const fade = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d } });

  return (
    <section className="bg-[#f5f5f5] px-4 py-20 font-sans text-zinc-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full border border-zinc-300 px-3 py-1 text-[10px] font-semibold uppercase" style={{ color: p.accent }}>
          {p.eyebrow}
        </span>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
            <span className="text-zinc-400">{p.titleMuted}</span>
            <br />
            {p.title}
          </h2>
          <p className="max-w-[16rem] text-zinc-500">{p.claim}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <motion.div {...fade(0)} className={`${card} flex items-center justify-between px-5 py-4`}>
              <AvatarStack src={p.partners.avatars} size="h-8 w-8" />
              <span className="text-[10px] font-semibold uppercase text-zinc-500">{p.partners.label}</span>
            </motion.div>
            <motion.div {...fade(0.05)} className={`${card} flex flex-1 flex-col justify-between p-6`}>
              <p className="max-w-[14rem]">{p.roi.text}</p>
              <div className="mt-16">
                <p className="text-6xl font-medium tracking-tight">
                  {p.roi.value}
                  <span className="text-zinc-400">{p.roi.unit}</span>
                </p>
                <p className="mt-1 text-sm text-zinc-500">{p.roi.label}</p>
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col gap-4">
            <motion.div {...fade(0.1)} className={`${card} flex flex-1 flex-col justify-between p-6`}>
              <p className="max-w-[14rem]">{p.revenue.text}</p>
              <div className="mt-16">
                <p className="text-6xl font-medium tracking-tight">
                  {p.revenue.value}
                  <span className="text-zinc-400">{p.revenue.unit}</span>
                </p>
                <p className="mt-1 text-sm text-zinc-500">{p.revenue.label}</p>
              </div>
            </motion.div>
            <motion.div {...fade(0.15)} className={`${card} flex items-center gap-3 px-5 py-4 text-[10px] font-semibold uppercase text-zinc-500`}>
              <span className="relative flex h-3 w-3">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-400/60" />
                <span className="relative h-3 w-3 rounded-full bg-green-500" />
              </span>
              {p.availability}
            </motion.div>
          </div>
          <motion.div {...fade(0.2)} className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl bg-[#1f1f1f] p-7 text-white shadow-2xl">
            <TrendingUp className="absolute -bottom-6 -right-4 h-64 w-64 text-white/5" strokeWidth={2.5} />
            <p className="relative text-white/80">{p.dark.text}</p>
            <div className="relative flex items-end justify-between">
              <p className="text-6xl font-medium tracking-tight">
                {p.dark.value}
                <span className="text-2xl text-white/50">{p.dark.unit}</span>
              </p>
              <div className="text-right">
                <p className="text-amber-400">★★★★★</p>
                <p className="max-w-[8rem] text-[10px] font-semibold uppercase text-white/80">{p.dark.label}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
