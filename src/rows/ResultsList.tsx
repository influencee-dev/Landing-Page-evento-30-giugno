import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

/**
 * Row 26 — Risultati in lista (ref. Impacta "Results That Speak For Themselves")
 * Etichetta, titolo con parola accento, righe con descrizione a sinistra
 * e numero gigante a destra che conta fino al valore quando entra in vista.
 */
export interface ResultRow {
  title: string;
  text: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export interface ResultsListProps {
  badge?: string;
  titleAccent?: string;
  title?: string;
  subtitle?: string;
  results?: ResultRow[];
  accent?: string;
}

const DEFAULTS: Required<ResultsListProps> = {
  badge: 'Risultati',
  titleAccent: 'Risultati',
  title: 'che parlano da soli',
  subtitle: 'Campagne social costruite sul pubblico, con crescita, engagement e fatturato reali.',
  results: [
    { title: 'Views totali', text: 'Contenuti short-form che raggiungono le persone giuste su tutte le piattaforme.', value: 8, suffix: 'M', decimals: 1 },
    { title: 'Like totali', text: 'Contenuti pensati per generare interazioni, salvataggi e condivisioni.', value: 2.5, suffix: 'M', decimals: 1 },
    { title: 'Imprenditori formati', text: 'Titolari che oggi creano da soli contenuti con l’AI grazie ai nostri eventi.', value: 250 },
  ],
  accent: '#ff0f4f',
};

function Counter({ r }: { r: ResultRow }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1400);
      setV(r.value * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, r.value]);
  return (
    <span ref={ref}>
      {r.prefix}
      {v.toFixed(r.decimals ?? 0)}
      {r.suffix}
    </span>
  );
}

export default function ResultsList(props: ResultsListProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-[#efefef] px-4 py-20 font-tight text-zinc-900 sm:px-6">
      <div className="text-center">
        <span className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs">{p.badge}</span>
        <h2 className="mx-auto mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
          <span style={{ color: p.accent }}>{p.titleAccent}</span> {p.title}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-zinc-600">{p.subtitle}</p>
      </div>
      <div className="mx-auto mt-14 max-w-4xl space-y-14">
        {p.results.map((r) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="max-w-xs">
              <h3 className="text-xl font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{r.text}</p>
            </div>
            <p className="text-6xl font-semibold tracking-[-0.04em] sm:text-8xl">
              <Counter r={r} />
              <span className="ml-2 font-light" style={{ color: p.accent }}>
                +
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
