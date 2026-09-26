import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';

/**
 * Row 33 — Testimonial Swipe
 * Testo della storia a sinistra (contatore, headline, citazione, persona) e
 * mazzo di card a destra: la card in cima si trascina e si "lancia" via per
 * passare alla storia successiva. Autoplay con anello di progresso sul bottone
 * "avanti", pausa in hover, frecce della tastiera, logo e link opzionali.
 */
export interface SwipeStory {
  headline: string;
  quote: string;
  name: string;
  role: string;
  image: string;
  avatar?: string;
  logo?: string;
  href?: string;
}

export interface TestimonialSwipeProps {
  /** Senza padding/sfondo propri: per l'uso dentro un pannello del design system. */
  embedded?: boolean;
  stories?: SwipeStory[];
  /** ms; 0 = autoplay disattivato. */
  autoplay?: number;
  cardWidth?: number;
  /** Altezza/larghezza della card. */
  ratio?: number;
  /** Quante card si vedono dietro. */
  depth?: number;
  spread?: number;
  tilt?: number;
  radius?: number;
  accent?: string;
  cardBg?: string;
  background?: string;
  panelBg?: string;
}

const DEFAULT_STORIES: SwipeStory[] = [
  { headline: 'Tavoli pieni anche il martedì', quote: 'Con le promo create all’evento abbiamo riempito le serate che prima erano vuote.', name: 'Roberto Gallo', role: 'Titolare, Trattoria Il Porto', image: 'card2.png', avatar: 'carlo.png' },
  { headline: '6 ore risparmiate a settimana', quote: 'Locandine e post che prima mi rubavano la domenica ora li faccio in mezz’ora.', name: 'Laura Bianchi', role: 'Beauty center', image: 'noemi.png', avatar: 'noemi.png' },
  { headline: '30 milioni di views', quote: 'Il format short-form di Socialee ha portato il festival davanti a un pubblico nuovo.', name: 'Festival del Nerd', role: 'Organizzazione', image: 'card1.png', avatar: 'giuseppe.png' },
  { headline: 'Prenotazioni in automatico', quote: 'Il chatbot risponde e prenota anche quando siamo chiusi. Una svolta.', name: 'Papone 2.0', role: 'Ristorante', image: 'card3.png', avatar: 'manuel.png' },
  { headline: 'Zero ansia da contenuti', quote: 'Finalmente so cosa pubblicare e perché. Il metodo è semplice e funziona.', name: 'Marika M.', role: 'Negozio di abbigliamento', image: 'marika.png', avatar: 'marika.png' },
];

export default function TestimonialSwipe({
  stories = DEFAULT_STORIES,
  autoplay = 6000,
  cardWidth = 250,
  ratio = 1.3,
  depth = 3,
  spread = 14,
  tilt = 4,
  radius = 16,
  accent = '#e8793a',
  cardBg = '#ffffff',
  background = '#ffa800',
  panelBg = '#faf7f2',
  embedded = false,
}: TestimonialSwipeProps) {
  const n = stories.length;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [thrown, setThrown] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const s = stories[i];

  const next = useCallback(() => {
    setDir(1);
    setI((v) => (v + 1) % n);
  }, [n]);
  const prev = useCallback(() => {
    setDir(-1);
    setI((v) => (v - 1 + n) % n);
  }, [n]);


  const onDragEnd = (_: unknown, info: PanInfo) => {
    const power = info.offset.x + info.velocity.x * 0.25;
    if (Math.abs(power) > 110) setThrown(Math.sign(power));
  };

  const R = 22;
  const C = 2 * Math.PI * R;

  return (
    <section
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
      className={embedded ? 'outline-none' : 'px-4 py-20 outline-none font-work sm:px-6'} style={{ background: embedded ? undefined : background }}>
      <div
        className={`mx-auto grid max-w-4xl items-center gap-10 p-8 sm:p-12 md:grid-cols-2 ${embedded ? 'rounded-3xl' : 'rounded-[2rem] shadow-2xl'}`}
        style={{ background: panelBg }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
            <span>
              <span className="text-zinc-500">{String(i + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
            </span>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <h3 className="mt-5 text-3xl leading-tight tracking-tight text-zinc-900 sm:text-4xl">{s.headline}</h3>
              <p className="mt-4 text-lg leading-relaxed text-zinc-700">“{s.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                {s.avatar && <img src={s.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />}
                <div className="text-sm leading-tight">
                  <p className="text-zinc-800">{s.name}</p>
                  <p className="text-xs text-zinc-500">{s.role}</p>
                </div>
                {s.href && (
                  <a href={s.href} className="ml-auto text-xs underline">
                    Leggi il caso
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center gap-3">
            <button type="button" aria-label="Precedente" onClick={prev} className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Successiva" onClick={next} className="relative flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white">
              <ChevronRight className="h-4 w-4" />
              {autoplay > 0 && (
                <svg className="absolute -inset-1 -rotate-90" viewBox="0 0 56 56">
                  <circle
                    key={i}
                    cx="28"
                    cy="28"
                    r={R + 3}
                    fill="none"
                    stroke={accent}
                    strokeWidth="2"
                    strokeDasharray={C * 1.14}
                    style={{
                      animation: `swipe-ring ${autoplay}ms linear forwards`,
                      animationPlayState: paused ? 'paused' : 'running',
                      ['--c' as string]: `${C * 1.14}`,
                    }}
                    onAnimationEnd={next}
                  />
                </svg>
              )}
            </button>
            <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              <MoveHorizontal className="h-3.5 w-3.5" /> Trascina la card
            </span>
          </div>
        </div>

        <div className="relative order-1 mx-auto md:order-2" style={{ width: cardWidth, height: cardWidth * ratio }}>
          {Array.from({ length: Math.min(depth + 1, n) })
            .map((_, k) => k)
            .reverse()
            .map((k) => {
              const idx = (i + k) % n;
              const top = k === 0;
              return (
                <motion.div
                  key={`${idx}-${i}`}
                  className="absolute inset-0 overflow-hidden p-1.5 shadow-xl"
                  style={{ borderRadius: radius, background: cardBg, zIndex: 10 - k, touchAction: 'pan-y' }}
                  initial={top ? { x: dir * -40, opacity: 0 } : false}
                  animate={
                    top && thrown
                      ? { x: thrown * 700, rotate: thrown * 25, opacity: 0 }
                      : { x: k * spread, y: k * -spread * 0.4, rotate: k * tilt, scale: 1 - k * 0.04, opacity: 1 }
                  }
                  transition={top && thrown ? { duration: 0.45, ease: 'easeIn' } : { type: 'spring', stiffness: 200, damping: 24 }}
                  onAnimationComplete={() => {
                    if (top && thrown) {
                      setThrown(null);
                      thrown > 0 ? next() : prev();
                    }
                  }}
                  drag={top && !thrown ? 'x' : false}
                  dragSnapToOrigin
                  whileDrag={{ rotate: 0, cursor: 'grabbing' }}
                  onDragEnd={onDragEnd}
                >
                  <img src={stories[idx].image} alt="" draggable={false} className="h-full w-full select-none object-cover" style={{ borderRadius: radius - 4 }} />
                  {stories[idx].logo && <img src={stories[idx].logo} alt="" className="absolute bottom-4 left-4 h-6" />}
                </motion.div>
              );
            })}
        </div>
      </div>
      <style>{`@keyframes swipe-ring { from { stroke-dashoffset: var(--c); } to { stroke-dashoffset: 0; } }`}</style>
    </section>
  );
}
