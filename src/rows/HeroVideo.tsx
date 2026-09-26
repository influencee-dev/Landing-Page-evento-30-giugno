import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { AvatarStack, type Cta } from './shared';

/**
 * Row 02 — Hero VSL con video centrale (ref. SaaS dark + Meta Ads light)
 * Badge, titolo centrato (con parte finale attenuata), sottotitolo,
 * player video con cornice glow, CTA e social proof con avatar + stelle.
 */
export interface HeroVideoProps {
  theme?: 'dark' | 'light';
  badge?: { label: string; href?: string };
  title?: string;
  /** Parte finale del titolo resa in grigio (stile ref. light). */
  titleMuted?: string;
  subtitle?: string;
  poster?: string;
  /** URL embed (YouTube/Vimeo) o file mp4. Se assente il play non fa nulla. */
  videoSrc?: string;
  cta?: Cta;
  proof?: { avatars: string[]; label: string };
}

const DEFAULTS: Required<Omit<HeroVideoProps, 'videoSrc'>> = {
  theme: 'dark',
  badge: { label: '30 giugno · Evento dal vivo', href: '#iscrizione' },
  title: 'Trasforma l’AI in locandine, menu e promo',
  titleMuted: 'che portano clienti veri',
  subtitle:
    'Guarda in 2 minuti cosa costruiremo insieme durante l’aperitivo: un metodo pratico per creare contenuti in tempo reale, senza agenzia e senza perdere ore.',
  poster: 'spiegazione.png',
  cta: { label: 'Prenota il posto', href: '#iscrizione' },
  proof: {
    avatars: ['giorgia.png', 'giuseppe.png', 'noemi.png', 'manuel.png'],
    label: 'Scelto da 250+ imprenditori',
  },
};

const THEMES = {
  dark: {
    section: 'bg-[#0b0b0f] text-white',
    glow: 'bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_60%)]',
    badge: 'border-white/15 bg-white/5 text-white/80',
    sub: 'text-white/60',
    muted: 'text-white/45',
    frame: 'border-white/20 shadow-[0_0_80px_-10px_rgba(255,255,255,0.25)]',
    cta: 'border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 shadow-[0_0_30px_-5px_rgba(255,255,255,0.35)]',
    star: 'bg-white/10 text-white',
    proof: 'text-white/50',
    ring: 'ring-[#0b0b0f]',
  },
  light: {
    section: 'bg-white text-zinc-900',
    glow: '',
    badge: 'border-transparent bg-transparent text-zinc-600',
    sub: 'text-zinc-500',
    muted: 'text-zinc-400',
    frame: 'border-zinc-200 shadow-xl',
    cta: 'bg-zinc-950 text-white hover:bg-zinc-800',
    star: 'bg-zinc-100 text-zinc-900',
    proof: 'text-zinc-500',
    ring: 'ring-white',
  },
};

export default function HeroVideo(props: HeroVideoProps) {
  const p = { ...DEFAULTS, ...props };
  const t = THEMES[p.theme];
  const [playing, setPlaying] = useState(false);
  const isFile = p.videoSrc?.endsWith('.mp4');

  return (
    <section className={`relative overflow-hidden font-tight ${t.section}`}>
      {t.glow && <div className={`pointer-events-none absolute inset-0 ${t.glow}`} />}

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <a
          href={p.badge.href}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs sm:text-sm ${t.badge}`}
        >
          {p.theme === 'light' && <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />}
          {p.badge.label}
          {p.theme === 'dark' && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
              <ArrowRight className="h-3 w-3" />
            </span>
          )}
        </a>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
        >
          {p.title} {p.titleMuted && <span className={t.muted}>{p.titleMuted}</span>}
        </motion.h1>

        <p className={`mx-auto mt-5 max-w-2xl text-sm sm:text-base ${t.sub}`}>{p.subtitle}</p>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className={`relative mx-auto mt-10 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border-2 ${t.frame}`}
        >
          {playing && p.videoSrc ? (
            isFile ? (
              <video src={p.videoSrc} autoPlay controls className="h-full w-full object-cover" />
            ) : (
              <iframe src={p.videoSrc} allow="autoplay; fullscreen" className="h-full w-full" title="Video" />
            )
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full"
              aria-label="Riproduci video"
            >
              <img src={p.poster} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-black/20" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 ring-4 ring-white/20 backdrop-blur transition group-hover:scale-110">
                <Play className="ml-1 h-6 w-6 fill-white text-white" />
              </span>
            </button>
          )}
        </motion.div>

        <a
          href={p.cta.href}
          className={`mt-8 inline-block rounded-xl px-6 py-3 text-sm font-medium transition hover:-translate-y-0.5 ${t.cta}`}
        >
          {p.cta.label}
        </a>

        <div className="mt-5 flex items-center justify-center gap-3">
          <AvatarStack src={p.proof.avatars} ring={t.ring} />
          <div className="text-left">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`flex h-4 w-4 items-center justify-center rounded-sm text-[9px] ${t.star}`}>
                  ★
                </span>
              ))}
            </div>
            <p className={`mt-1 text-xs ${t.proof}`}>{p.proof.label}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
