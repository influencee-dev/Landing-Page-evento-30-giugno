import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, type PanInfo } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Row 34 — Customer Storywell
 * Indice delle storie a sinistra (con barra di progresso autoplay), al centro
 * logo, contatore, metrica animata, citazione che appare parola per parola e
 * persona con frecce; a destra foto con transizione Slide / Rise / Iris e tag categoria.
 * Swipe sulla foto, frecce della tastiera, pausa in hover, layout impilato su mobile.
 */
export interface Story {
  name: string;
  role: string;
  avatar: string;
  photo: string;
  /** Nome azienda (testo) o URL del logo. */
  logo?: string;
  metric: number;
  metricSuffix?: string;
  metricPrefix?: string;
  metricLabel: string;
  quote: string;
  tag?: string;
  href?: string;
}

export interface CustomerStorywellProps {
  stories?: Story[];
  heading?: string;
  transition?: 'slide' | 'rise' | 'iris';
  autoplay?: number;
  accent?: string;
  background?: string;
  panelBg?: string;
  quoteClass?: string;
}

const DEFAULT_STORIES: Story[] = [
  { name: 'Roberto Gallo', role: 'Titolare, Trattoria Il Porto', avatar: 'carlo.png', photo: 'card2.png', logo: 'IL PORTO', metric: 62, metricSuffix: '%', metricLabel: 'prenotazioni in più nei giorni feriali', quote: 'Abbiamo smesso di improvvisare i post e iniziato a riempire i tavoli. Tutto lo staff ha sentito la differenza dalla prima settimana.', tag: 'Ristorazione' },
  { name: 'Laura Bianchi', role: 'Fondatrice, Studio Beauty', avatar: 'noemi.png', photo: 'noemi.png', logo: 'STUDIO B', metric: 6, metricSuffix: 'h', metricLabel: 'risparmiate ogni settimana', quote: 'Prima i contenuti erano un peso. Ora in mezz’ora preparo tutta la settimana con l’AI.', tag: 'Beauty' },
  { name: 'Festival del Nerd', role: 'Organizzazione', avatar: 'giuseppe.png', photo: 'card1.png', logo: 'FDN', metric: 30, metricSuffix: 'M', metricLabel: 'views organiche', quote: 'Un format pensato per lo short-form ci ha portato davanti a un pubblico che non avevamo mai raggiunto.', tag: 'Eventi' },
  { name: 'Papone 2.0', role: 'Ristorante', avatar: 'manuel.png', photo: 'card3.png', logo: 'PAPONE', metric: 98, metricSuffix: '%', metricLabel: 'richieste gestite in automatico', quote: 'Il chatbot risponde e prenota anche a locale chiuso. Noi pensiamo solo alla cucina.', tag: 'Automazioni' },
  { name: 'Marika M.', role: 'Negozio di abbigliamento', avatar: 'marika.png', photo: 'marika.png', logo: 'MM STORE', metric: 3, metricSuffix: 'x', metricLabel: 'messaggi da Instagram', quote: 'Finalmente so cosa pubblicare e perché. Le clienti arrivano in negozio con lo screenshot del post.', tag: 'Retail' },
];

const TRANSITIONS = {
  slide: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '-30%', opacity: 0 } },
  rise: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '-20%', opacity: 0 } },
  iris: { initial: { clipPath: 'circle(0% at 50% 50%)' }, animate: { clipPath: 'circle(75% at 50% 50%)' }, exit: { opacity: 0 } },
};

function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1000);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, inView]);
  return (
    <span ref={ref}>
      {prefix}
      {v}
      {suffix}
    </span>
  );
}

export default function CustomerStorywell({
  stories = DEFAULT_STORIES,
  heading = 'Storie dei clienti',
  transition = 'iris',
  autoplay = 7000,
  accent = '#e0512f',
  background = '#efebe4',
  panelBg = '#ffffff',
  quoteClass = 'font-serif',
}: CustomerStorywellProps) {
  const n = stories.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const s = stories[i];
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);


  const isLogoImg = s.logo && /\.(png|jpe?g|svg|webp)$/i.test(s.logo);
  const tr = TRANSITIONS[transition];

  return (
    <section
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(-1);
      }}
      className="px-4 py-20 outline-none font-sans sm:px-6" style={{ background }}>
      <div
        className="mx-auto grid max-w-6xl gap-6 rounded-[2rem] p-4 sm:p-5 lg:grid-cols-[210px_1fr_340px]"
        style={{ background: panelBg }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Indice */}
        <nav className="order-3 min-w-0 lg:order-1 lg:py-3">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{heading}</p>
          <ul className="mt-3 flex gap-2 overflow-x-auto lg:block lg:space-y-1">
            {stories.map((st, k) => (
              <li key={st.name} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setI(k)}
                  className={`relative flex w-full items-center gap-3 rounded-xl py-2 pl-4 pr-3 text-left transition ${k === i ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                >
                  <span className="absolute bottom-2 left-1.5 top-2 w-0.5 overflow-hidden rounded bg-zinc-200">
                    {k === i && autoplay > 0 && (
                      <span
                        key={i}
                        className="absolute inset-x-0 top-0 block"
                        style={{ background: accent, animation: `story-bar ${autoplay}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }}
                        onAnimationEnd={() => go(1)}
                      />
                    )}
                  </span>
                  <img src={st.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <span className="min-w-0 leading-tight">
                    <span className={`block truncate text-sm ${k === i ? 'text-zinc-900' : 'text-zinc-600'}`}>{st.name}</span>
                    <span className="block truncate text-[11px] text-zinc-400">{st.role}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenuto */}
        <div className="order-2 flex min-w-0 flex-col py-3 lg:px-4">
          <div className="flex items-center justify-between">
            {isLogoImg ? <img src={s.logo} alt="" className="h-6" /> : <span className="border border-zinc-800 px-1.5 text-xs font-bold tracking-wide">{s.logo}</span>}
            <span className="text-xs text-zinc-400">
              <span className="text-zinc-800">{String(i + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
              <p className="mt-10 text-6xl font-light tracking-tight" style={{ color: accent }}>
                <CountUp to={s.metric} prefix={s.metricPrefix} suffix={s.metricSuffix} />
              </p>
              <p className="text-sm text-zinc-500">{s.metricLabel}</p>
              <p className={`mt-7 text-2xl leading-snug text-zinc-800 sm:text-3xl ${quoteClass}`}>
                {`“${s.quote}”`.split(' ').map((w, k) => (
                  <motion.span key={k} initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ delay: 0.2 + k * 0.035 }}>
                    {w}{' '}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center gap-3 border-t border-zinc-200 pt-4">
            <img src={s.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2" style={{ ['--tw-ring-color' as string]: accent }} />
            <div className="text-sm leading-tight">
              <p>{s.name}</p>
              <p className="text-xs text-zinc-500">{s.role}</p>
            </div>
            {s.href && (
              <a href={s.href} className="ml-4 text-xs underline">
                Caso studio
              </a>
            )}
            <div className="ml-auto flex gap-2">
              <button type="button" aria-label="Precedente" onClick={() => go(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200">
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button type="button" aria-label="Successiva" onClick={() => go(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200">
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Foto */}
        <motion.div
          className="relative order-1 aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200 lg:order-3 lg:aspect-auto lg:min-h-[420px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info: PanInfo) => {
            if (info.offset.x < -50) go(1);
            if (info.offset.x > 50) go(-1);
          }}
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={i}
              src={s.photo}
              alt={s.name}
              draggable={false}
              {...tr}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full select-none object-cover"
            />
          </AnimatePresence>
          {s.tag && <span className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-0.5 text-[11px] backdrop-blur">{s.tag}</span>}
        </motion.div>
      </div>
      <style>{`@keyframes story-bar { from { height: 0%; } to { height: 100%; } }`}</style>
    </section>
  );
}
