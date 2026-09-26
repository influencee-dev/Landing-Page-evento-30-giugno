import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { AvatarStack } from './shared';
import { GridLines, ORANGE } from './HeroSplitPortrait';

/**
 * Row 06 — Testimonianze su card scura (ref. Digiket)
 * Card navy con texture a puntini, citazione a slider con dots,
 * valutazione a stelline quadrate, foto con badge flottanti.
 */
export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface TestimonialDarkProps {
  title?: string;
  testimonials?: Testimonial[];
  rating?: { value: string; source: string };
  image?: string;
  usersBadge?: { label: string; avatars: string[] };
  scoreBadge?: { label: string; sub: string; value: string };
  /** Intervallo autoplay in ms (0 = disattivato). */
  autoplay?: number;
}

const DEFAULTS: Required<TestimonialDarkProps> = {
  title: 'Cosa dicono gli imprenditori di noi',
  testimonials: [
    {
      name: 'Roberto Gallo',
      role: 'Titolare, Trattoria Il Porto',
      quote:
        'In una sera ho imparato a creare da solo le locandine del weekend. Il menu estivo l’abbiamo rifatto con l’AI e i tavoli del pranzo si sono riempiti già dalla prima settimana.',
    },
    {
      name: 'Laura Bianchi',
      role: 'Fondatrice, Studio Beauty',
      quote:
        'Pratico, concreto, zero fuffa. Sono uscita con tre promo pronte da pubblicare e un metodo che uso ogni settimana.',
    },
    {
      name: 'Marco Rossi',
      role: 'CEO, Palestra Urban Fit',
      quote:
        'Finalmente qualcuno che spiega l’AI a chi ha un’attività vera. Il team Socialee ci ha poi seguito anche nelle campagne.',
    },
  ],
  rating: { value: '4.9/5', source: 'su Google' },
  image: 'spiegazione.png',
  usersBadge: { label: '250+ partecipanti', avatars: ['giorgia.png', 'carlo.png', 'marika.png'] },
  scoreBadge: { label: 'Soddisfazione', sub: 'Edizione 2025', value: '96%' },
  autoplay: 6000,
};

export default function TestimonialDark(props: TestimonialDarkProps) {
  const p = { ...DEFAULTS, ...props };
  const [i, setI] = useState(0);
  const t = p.testimonials[i];

  useEffect(() => {
    if (!p.autoplay || p.testimonials.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % p.testimonials.length), p.autoplay);
    return () => clearInterval(id);
  }, [p.autoplay, p.testimonials.length]);

  return (
    <section className="relative bg-[#fdf3ee] px-4 py-16 font-work sm:px-6">
      <GridLines />
      <div
        className="relative mx-auto grid max-w-6xl items-center gap-12 overflow-hidden rounded-2xl bg-[#0b1230] px-6 py-14 text-white sm:px-14 lg:grid-cols-2"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      >
        <div>
          <h2 className="max-w-sm text-3xl font-semibold leading-tight sm:text-4xl">{p.title}</h2>

          <div className="mt-12 min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: ORANGE }}>
                    <Quote className="h-4 w-4 fill-white text-white" />
                  </span>
                  <p className="text-lg font-semibold">
                    {t.name} <span className="text-sm font-normal text-white/70">/ {t.role}</span>
                  </p>
                </div>
                <p className="mt-6 max-w-lg leading-relaxed text-white/85">{t.quote}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm">
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, k) => (
                <span key={k} className="flex h-5 w-5 items-center justify-center" style={{ background: ORANGE }}>
                  <Star className="h-3 w-3 fill-white text-white" />
                </span>
              ))}
            </span>
            <span style={{ color: ORANGE }}>{p.rating.value}</span> {p.rating.source}
          </div>

          <div className="mt-8 flex gap-2">
            {p.testimonials.map((_, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Testimonianza ${k + 1}`}
                onClick={() => setI(k)}
                className={`h-2 w-2 rounded-full border transition ${k === i ? 'border-transparent' : 'border-white/40'}`}
                style={k === i ? { background: ORANGE } : undefined}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <img src={p.image} alt="" className="aspect-[5/6] w-full rounded-lg object-cover" />
          <div className="absolute -left-4 top-12 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white shadow-lg sm:-left-12" style={{ background: ORANGE }}>
            {p.usersBadge.label}
            <AvatarStack src={p.usersBadge.avatars} size="h-6 w-6" ring="ring-white/60" />
          </div>
          <div className="absolute -right-3 bottom-12 flex items-center gap-6 rounded-xl bg-white px-4 py-3 text-[#0f1629] shadow-xl sm:-right-8">
            <div>
              <p className="text-sm font-semibold">{p.scoreBadge.label}</p>
              <p className="text-xs text-zinc-500">{p.scoreBadge.sub}</p>
            </div>
            <p className="text-3xl font-semibold">{p.scoreBadge.value}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
