import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

/**
 * Row 17 — Carosello testimonianze arancio (ref. "Knowing your name is only the beginning")
 * Card orizzontali (foto + citazione) che scorrono con le card vicine visibili ai lati.
 */
export interface CarouselTestimonial {
  photo: string;
  quote: string;
  name: string;
  role: string;
}

export interface TestimonialCarouselProps {
  eyebrow?: string;
  title?: string;
  items?: CarouselTestimonial[];
  accent?: string;
}

const DEFAULTS: Required<TestimonialCarouselProps> = {
  eyebrow: 'Testimonianze',
  title: 'Conoscere il tuo nome\nè solo l’inizio',
  items: [
    { photo: 'carlo.png', quote: 'Il metodo Socialee ci ha cambiato il modo di comunicare: oggi pubblichiamo ogni settimana senza stress e i clienti se ne accorgono.', name: 'Roberto G.', role: 'Ristoratore' },
    { photo: 'noemi.png', quote: 'In una serata ho capito come usare l’AI per le mie promo. Pratico e zero fuffa, proprio quello che serviva.', name: 'Laura B.', role: 'Beauty center' },
    { photo: 'manuel.png', quote: 'Abbiamo rifatto menu e locandine con l’AI: più ordini al tavolo già dal primo weekend.', name: 'Marco R.', role: 'Cocktail bar' },
  ],
  accent: '#ff6b3d',
};

export default function TestimonialCarousel(props: TestimonialCarouselProps) {
  const p = { ...DEFAULTS, ...props };
  const [i, setI] = useState(0);
  const n = p.items.length;

  return (
    <section className="overflow-hidden bg-[#fdf7f1] py-20 font-work text-zinc-950">
      <div className="px-4 text-center">
        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white" style={{ background: p.accent }}>
          {p.eyebrow}
        </span>
        <h2 className="mt-4 whitespace-pre-line text-3xl font-medium leading-tight tracking-tight sm:text-5xl">{p.title}</h2>
      </div>

      <div className="relative mt-10">
        <motion.div
          className="flex gap-5"
          animate={{ x: `calc(50vw - ${i} * (min(90vw, 720px) + 20px) - min(45vw, 360px))` }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
        >
          {p.items.map((t, k) => (
            <div
              key={k}
              className={`grid w-[min(90vw,720px)] shrink-0 grid-cols-1 gap-5 rounded-2xl p-4 text-white transition-opacity sm:grid-cols-[2fr_3fr] ${k === i ? '' : 'opacity-60'}`}
              style={{ background: p.accent }}
            >
              <img src={t.photo} alt="" className="aspect-[4/3] w-full rounded-xl object-cover sm:aspect-auto sm:h-full" />
              <div className="flex flex-col justify-center py-4 pr-4">
                <Quote className="mx-auto h-9 w-9 rounded-full bg-white p-2 text-zinc-900" />
                <p className="mt-5 leading-relaxed">“{t.quote}”</p>
                <p className="mt-4 text-sm font-semibold">
                  {t.name} <span className="font-normal text-white/80">· {t.role}</span>
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button type="button" aria-label="Precedente" onClick={() => setI((v) => (v - 1 + n) % n)} className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Successiva" onClick={() => setI((v) => (v + 1) % n)} className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: p.accent }}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
