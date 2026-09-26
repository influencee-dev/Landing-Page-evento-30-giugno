import React, { useEffect, useRef, useState } from 'react';
import { motion, type PanInfo } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Row 32 — Editorial Video Card (in pila)
 * Card video centrale con titolo, descrizione, categoria/anno e CTA opzionale;
 * le card vicine sono più piccole, sfocate e trasparenti. Click/drag/frecce per cambiare,
 * audio on/off, autoplay del solo video attivo.
 */
export interface EditorialItem {
  poster: string;
  video?: string;
  title: string;
  text?: string;
  category?: string;
  year?: string;
  cta?: { label: string; href: string };
}

export interface EditorialVideoStackProps {
  /** Senza padding/sfondo propri: per l'uso dentro un pannello del design system. */
  embedded?: boolean;
  items?: EditorialItem[];
  cardWidth?: number;
  aspect?: number;
  radius?: number;
  /** Sfocatura (px) per ogni passo di distanza dalla card attiva. */
  blur?: number;
  sideScale?: number;
  sideOffset?: number;
  overlay?: string;
  fit?: 'cover' | 'contain';
  background?: string;
  speed?: number;
}

const DEFAULT_ITEMS: EditorialItem[] = [
  { poster: 'card2.png', title: 'Una cena raccontata in 30 secondi', text: 'Girato di sera, un solo obiettivo, montato dove la luce finiva.', category: 'Food', year: '2025' },
  { poster: 'card1.png', title: 'Una piazza piena, una storia sola', text: 'Il racconto di tre giorni di festival in un unico reel.', category: 'Eventi', year: '2025' },
  { poster: 'spiegazione.png', title: 'L’AI spiegata a chi lavora davvero', text: 'Un aperitivo, un proiettore e tanti imprenditori curiosi.', category: 'Formazione', year: '2026', cta: { label: 'Prenota', href: '#iscrizione' } },
  { poster: 'card3.png', title: 'Il tavolo si prenota da solo', text: 'Un chatbot WhatsApp che lavora anche quando sei chiuso.', category: 'Automazioni', year: '2026' },
  { poster: 'simona.png', title: 'Dietro l’obiettivo', text: 'Chi cattura le storie dei nostri clienti.', category: 'Team', year: '2026' },
];

export default function EditorialVideoStack({
  items = DEFAULT_ITEMS,
  cardWidth = 310,
  aspect = 1.45,
  radius = 14,
  blur = 3,
  sideScale = 0.14,
  sideOffset = 0.42,
  overlay = 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0) 55%)',
  fit = 'cover',
  background = '#ffffff',
  speed = 0.55,
  embedded = false,
}: EditorialVideoStackProps) {
  const [active, setActive] = useState(Math.floor(items.length / 2));
  const [muted, setMuted] = useState(true);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  const go = (d: number) => setActive((a) => Math.max(0, Math.min(items.length - 1, a + d)));
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40) go(1);
    if (info.offset.x > 40) go(-1);
  };

  return (
    <section
      className={`relative overflow-hidden outline-none ${embedded ? 'py-4' : 'py-20 font-sans'}`}
      style={{ background: embedded ? undefined : background }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
    >
      <motion.div className="relative mx-auto" style={{ height: cardWidth * aspect + 40 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.1} onDragEnd={onDragEnd}>
        {items.map((it, i) => {
          const off = i - active;
          const d = Math.abs(off);
          const isActive = d === 0;
          return (
            <motion.article
              key={i}
              onClick={() => setActive(i)}
              initial={false}
              animate={{
                x: off * cardWidth * sideOffset * (1 - (d - 1) * 0.12),
                scale: 1 - d * sideScale,
                opacity: d > 2 ? 0 : 1 - d * 0.25,
                filter: `blur(${d * blur}px)`,
              }}
              transition={{ duration: speed, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 cursor-pointer overflow-hidden bg-zinc-200 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]"
              style={{ width: cardWidth, height: cardWidth * aspect, marginLeft: -cardWidth / 2, marginTop: (-cardWidth * aspect) / 2, zIndex: 50 - d, borderRadius: radius }}
            >
              {it.video ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={it.video}
                  poster={it.poster}
                  muted={!isActive || muted}
                  loop
                  playsInline
                  className="h-full w-full"
                  style={{ objectFit: fit }}
                />
              ) : (
                <img src={it.poster} alt={it.title} draggable={false} className="h-full w-full" style={{ objectFit: fit }} />
              )}
              <div className="absolute inset-0" style={{ background: overlay }} />
              <motion.div initial={false} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }} transition={{ delay: isActive ? speed * 0.4 : 0 }} className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="block h-px w-8 bg-white/70" />
                {(it.category || it.year) && (
                  <p className="mt-3 text-[10px] uppercase tracking-widest text-white/70">
                    {it.category} {it.year && `· ${it.year}`}
                  </p>
                )}
                <h3 className="mt-2 text-2xl font-medium leading-tight">{it.title}</h3>
                {it.text && <p className="mt-2 text-xs leading-relaxed text-white/75">{it.text}</p>}
                {it.cta && (
                  <a href={it.cta.href} onClick={(e) => e.stopPropagation()} className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-medium text-zinc-900">
                    {it.cta.label}
                  </a>
                )}
              </motion.div>
              {isActive && (
                <button
                  type="button"
                  aria-label={muted ? 'Attiva audio' : 'Disattiva audio'}
                  onClick={(e) => (e.stopPropagation(), setMuted((m) => !m))}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              )}
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
