import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, type PanInfo } from 'motion/react';

/**
 * Row 30 — Velocity Carousel
 * Carosello a focus centrale: la card attiva è più grande e mostra titolo,
 * testo e bottone; le altre scalano e si sovrappongono ai lati.
 * Swipe/drag, frecce della tastiera, click sulle card laterali, autoplay con pausa in hover.
 * Tutto è configurabile via props (scale, gap, overlap, bordi, overlay, ombra, velocità…).
 */
export interface VelocitySlide {
  image: string;
  title?: string;
  text?: string;
  cta?: { label: string; href: string };
}

export interface VelocityCarouselProps {
  /** Senza padding/sfondo propri: per l'uso dentro un pannello del design system. */
  embedded?: boolean;
  slides?: VelocitySlide[];
  /** Larghezza card attiva in px (desktop). Su mobile si adatta al contenitore. */
  cardWidth?: number;
  /** Rapporto altezza/larghezza della card. */
  aspect?: number;
  activeScale?: number;
  inactiveScale?: number;
  /** Distanza tra i centri delle card laterali, in px (prima della scala). */
  gap?: number;
  /** Sovrapposizione extra su mobile, in px. */
  mobileOverlap?: number;
  radius?: number;
  borderWidth?: number;
  borderColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  /** 0 → nessuna ombra, 1 → ombra piena. */
  shadow?: number;
  /** Durata della transizione in secondi. */
  speed?: number;
  /** Autoplay in ms; 0 = disattivato. */
  autoplay?: number;
  background?: string;
  indicatorColor?: string;
  /** Quante card per lato restano visibili. */
  visible?: number;
  startIndex?: number;
  fontClass?: string;
  /** Opacità delle card laterali più lontane. */
  fade?: boolean;
}

const DEFAULT_SLIDES: VelocitySlide[] = [
  { image: 'card1.png', title: 'Festival del Nerd', text: '30M di views con una strategia short-form costruita sul pubblico.', cta: { label: 'Scopri', href: '#' } },
  { image: 'card2.png', title: 'Cru Vineria', text: 'Contenuti food che riempiono i tavoli anche nei giorni feriali.', cta: { label: 'Scopri', href: '#' } },
  { image: 'spiegazione.png', title: 'A(I)peritivo', text: 'L’evento pratico per imprenditori che vogliono usare l’AI.', cta: { label: 'Prenota', href: '#iscrizione' } },
  { image: 'card3.png', title: 'Chatbot prenotazioni', text: 'Tavoli prenotati su WhatsApp in automatico, 24/7.', cta: { label: 'Scopri', href: '#' } },
  { image: 'giorgia.png', title: 'Il team', text: 'Strategia, contenuti e advertising sotto lo stesso tetto.', cta: { label: 'Conoscici', href: '#team' } },
  { image: 'marika.png', title: 'Design', text: 'Grafiche e visual che si fanno notare nel feed.', cta: { label: 'Scopri', href: '#' } },
];

export default function VelocityCarousel({
  slides = DEFAULT_SLIDES,
  cardWidth = 300,
  aspect = 1,
  activeScale = 1,
  inactiveScale = 0.78,
  gap = 150,
  mobileOverlap = 40,
  radius = 36,
  borderWidth = 4,
  borderColor = '#ffffff',
  overlayColor = '#000000',
  overlayOpacity = 0.3,
  shadow = 0.6,
  speed = 0.6,
  autoplay = 4000,
  background = '#f4f4f4',
  indicatorColor = '#111111',
  visible = 3,
  startIndex,
  fontClass = 'font-sans',
  fade = true,
  embedded = false,
}: VelocityCarouselProps) {
  const n = slides.length;
  const [active, setActive] = useState(startIndex ?? Math.floor(n / 2));
  const [paused, setPaused] = useState(false);
  const [vw, setVw] = useState(1200);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setVw(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((d: number) => setActive((a) => Math.max(0, Math.min(n - 1, a + d))), [n]);

  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), autoplay);
    return () => clearInterval(id);
  }, [autoplay, paused, n]);

  const mobile = vw < 640;
  const w = mobile ? Math.min(cardWidth, vw * 0.62) : cardWidth;
  const step = mobile ? gap * (w / cardWidth) - mobileOverlap * 0.3 : gap;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const t = info.offset.x + info.velocity.x * 0.2;
    if (t < -50) go(1);
    else if (t > 50) go(-1);
  };

  return (
    <section
      ref={wrap}
      className={`relative overflow-hidden outline-none ${embedded ? 'py-4' : 'py-20'} ${fontClass}`}
      style={{ background: embedded ? undefined : background }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      tabIndex={0}
      aria-roledescription="carousel"
    >
      <motion.div
        className="relative mx-auto cursor-grab active:cursor-grabbing"
        style={{ height: w * aspect * activeScale + 40 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={onDragEnd}
      >
        {slides.map((s, i) => {
          const off = i - active;
          const dist = Math.abs(off);
          const hidden = dist > visible;
          const isActive = off === 0;
          const scale = isActive ? activeScale : inactiveScale;
          return (
            <motion.div
              key={i}
              onClick={() => !isActive && setActive(i)}
              initial={false}
              animate={{
                x: off * step,
                scale,
                opacity: hidden ? 0 : fade ? 1 - Math.max(0, dist - 1) * 0.25 : 1,
              }}
              transition={{ duration: speed, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 overflow-hidden"
              style={{
                width: w,
                height: w * aspect,
                marginLeft: -w / 2,
                marginTop: (-w * aspect) / 2,
                zIndex: 100 - dist,
                borderRadius: radius,
                border: `${borderWidth}px solid ${borderColor}`,
                boxShadow: isActive ? `0 30px 60px -20px rgba(0,0,0,${0.55 * shadow})` : `0 10px 30px -15px rgba(0,0,0,${0.3 * shadow})`,
                pointerEvents: hidden ? 'none' : 'auto',
              }}
            >
              <img src={s.image} alt={s.title ?? ''} draggable={false} className="h-full w-full select-none object-cover" />
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: speed * 0.8, delay: isActive ? speed * 0.3 : 0 }}
                style={{ background: `${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')}` }}
              >
                {s.title && <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>}
                {s.text && <p className="mt-2 max-w-[90%] text-xs font-medium leading-snug text-white/90">{s.text}</p>}
                {s.cta && (
                  <a href={s.cta.href} onClick={(e) => e.stopPropagation()} className="mt-4 rounded-full bg-white px-5 py-2 text-xs font-medium text-zinc-900 transition hover:scale-105">
                    {s.cta.label}
                  </a>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-10 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-1.5 rounded-full transition-all"
            style={{ width: i === active ? 16 : 6, background: indicatorColor, opacity: i === active ? 1 : 0.25 }}
          />
        ))}
      </div>
    </section>
  );
}
