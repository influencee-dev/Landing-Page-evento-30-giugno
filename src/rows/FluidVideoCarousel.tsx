import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';

/**
 * Row 31 — Fluid Video Carousel
 * Nastro infinito di video/immagini che scorre da solo; si può trascinare
 * (con inerzia), usare la rotella, si ferma in hover. Hover B/N → colore,
 * click apre una lightbox con frecce, tastiera e audio. Titoli e tag in mono.
 */
export interface FluidItem {
  poster: string;
  video?: string;
  title: string;
  tag?: string;
  href?: string;
  /** Altezza relativa della card (1 = standard) per il ritmo "editoriale". */
  height?: number;
  width?: number;
}

export interface FluidVideoCarouselProps {
  /** Senza padding/sfondo propri: per l'uso dentro un pannello del design system. */
  embedded?: boolean;
  items?: FluidItem[];
  /** px/secondo; negativo = verso destra. */
  speed?: number;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  radius?: number;
  pauseOnHover?: boolean;
  /** Parte in bianco e nero e si colora in hover. */
  monochrome?: boolean;
  showModeToggle?: boolean;
  edgeFade?: boolean;
  lightbox?: boolean;
  wheel?: boolean;
  background?: string;
  titleClass?: string;
}

const DEFAULT_ITEMS: FluidItem[] = [
  { poster: 'card1.png', title: 'Festival del Nerd', tag: 'Eventi · 2025', height: 1.1, width: 1 },
  { poster: 'card2.png', title: 'Cru Vineria', tag: 'Food · Reel', height: 0.8, width: 1.05 },
  { poster: 'spiegazione.png', title: 'A(I)peritivo', tag: 'Formazione', height: 0.9, width: 1.35 },
  { poster: 'card3.png', title: 'Papone 2.0', tag: 'Chatbot', height: 1.2, width: 0.9 },
  { poster: 'giorgia.png', title: 'Giorgia Palazzo', tag: 'Founder', height: 0.85, width: 0.95 },
  { poster: 'simona.png', title: 'Dietro le quinte', tag: 'Video', height: 1.05, width: 0.9 },
];

export default function FluidVideoCarousel({
  items = DEFAULT_ITEMS,
  speed = 40,
  cardWidth = 280,
  cardHeight = 360,
  gap = 18,
  radius = 0,
  pauseOnHover = true,
  monochrome = false,
  showModeToggle = true,
  edgeFade = true,
  lightbox = true,
  wheel = true,
  background = '#ffffff',
  titleClass = 'font-mono uppercase tracking-wide',
  embedded = false,
}: FluidVideoCarouselProps) {
  const x = useMotionValue(0);
  const track = useRef<HTMLDivElement>(null);
  const setWidth = useRef(0);
  const vel = useRef(0); // velocità extra da drag/rotella
  const drag = useRef<{ x: number; last: number; t: number; moved: number } | null>(null);
  const [hover, setHover] = useState(false);
  const [mono, setMono] = useState(monochrome);
  const [open, setOpen] = useState<number | null>(null);

  // larghezza di un "giro" (il contenuto è duplicato 3 volte)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => (setWidth.current = el.scrollWidth / 3);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  useAnimationFrame((_, delta) => {
    const W = setWidth.current;
    if (!W || drag.current || open !== null) return;
    const base = pauseOnHover && hover ? 0 : speed;
    vel.current *= Math.pow(0.94, delta / 16);
    let nx = x.get() - (base * delta) / 1000 + (vel.current * delta) / 16;
    if (nx <= -2 * W) nx += W;
    if (nx > -W) nx -= W;
    x.set(nx);
  });

  useEffect(() => {
    x.set(-setWidth.current || 0);
  }, [x]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, last: e.clientX, t: performance.now(), moved: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.last;
    d.moved += Math.abs(dx);
    const now = performance.now();
    vel.current = (dx / Math.max(1, now - d.t)) * 16;
    d.last = e.clientX;
    d.t = now;
    const W = setWidth.current;
    let nx = x.get() + dx;
    if (nx <= -2 * W) nx += W;
    if (nx > -W) nx -= W;
    x.set(nx);
  };
  const onUp = () => {
    setTimeout(() => (drag.current = null), 0);
  };
  const clickItem = (i: number) => {
    if (drag.current && drag.current.moved > 6) return;
    if (lightbox) setOpen(i % items.length);
  };

  return (
    <section className={`relative overflow-hidden ${embedded ? '' : 'py-16'}`} style={{ background: embedded ? undefined : background }}>
      {showModeToggle && (
        <div className="mb-6 flex justify-center">
          <button type="button" onClick={() => setMono((m) => !m)} className={`rounded-full border border-zinc-300 px-4 py-1.5 text-xs ${titleClass}`}>
            {mono ? 'B/N → colore in hover' : 'Colore'}
          </button>
        </div>
      )}
      <div
        className={`cursor-grab touch-pan-y select-none active:cursor-grabbing ${edgeFade ? '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={(e) => {
          if (!wheel) return;
          const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
          vel.current -= d * 0.02;
        }}
      >
        <motion.div ref={track} className="flex w-max items-start" style={{ x, gap }}>
          {[...items, ...items, ...items].map((it, i) => (
            <figure key={i} className="group shrink-0" style={{ width: cardWidth * (it.width ?? 1) }} onClick={() => clickItem(i)}>
              <div className="relative overflow-hidden bg-zinc-100" style={{ height: cardHeight * (it.height ?? 1), borderRadius: radius }}>
                {it.video ? (
                  <video
                    src={it.video}
                    poster={it.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className={`h-full w-full object-cover transition duration-500 ${mono ? 'grayscale group-hover:grayscale-0' : ''}`}
                  />
                ) : (
                  <img src={it.poster} alt={it.title} draggable={false} className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${mono ? 'grayscale group-hover:grayscale-0' : ''}`} />
                )}
              </div>
              <figcaption className={`mt-2 text-sm ${titleClass}`}>
                <span className="block text-zinc-800">{it.title}</span>
                {it.tag && <span className="block text-zinc-400">{it.tag}</span>}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onChange={setOpen} titleClass={titleClass} />
    </section>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onChange,
  titleClass,
}: {
  items: FluidItem[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
  titleClass: string;
}) {
  const [muted, setMuted] = useState(true);
  const n = items.length;
  const go = useCallback((d: number) => index !== null && onChange((index + d + n) % n), [index, n, onChange]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go, onClose]);

  const it = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {it && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          <motion.div key={index} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {it.video ? (
              <video src={it.video} poster={it.poster} autoPlay loop playsInline muted={muted} controls className="max-h-[80vh] rounded-lg" />
            ) : (
              <img src={it.poster} alt={it.title} className="max-h-[80vh] rounded-lg object-contain" />
            )}
            <div className={`mt-3 flex items-center justify-between text-sm text-white ${titleClass}`}>
              <span>
                {it.title} <span className="text-white/50">{it.tag}</span>
              </span>
              <span className="flex gap-3">
                {it.video && (
                  <button type="button" onClick={() => setMuted((m) => !m)} aria-label="Audio">
                    {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                )}
                {it.href && (
                  <a href={it.href} className="underline">
                    Apri
                  </a>
                )}
              </span>
            </div>
          </motion.div>
          <button type="button" aria-label="Chiudi" onClick={onClose} className="absolute right-5 top-5 text-white">
            <X className="h-7 w-7" />
          </button>
          <button type="button" aria-label="Precedente" onClick={(e) => (e.stopPropagation(), go(-1))} className="absolute left-4 top-1/2 text-white">
            <ChevronLeft className="h-9 w-9" />
          </button>
          <button type="button" aria-label="Successivo" onClick={(e) => (e.stopPropagation(), go(1))} className="absolute right-4 top-1/2 text-white">
            <ChevronRight className="h-9 w-9" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
