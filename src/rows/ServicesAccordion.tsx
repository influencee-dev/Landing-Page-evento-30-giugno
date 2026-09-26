import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

/**
 * Row 25 — Servizi ad accordion, dark (ref. Funnelz "How can we help")
 * Titolo a due toni, righe numerate 001/002…, la riga aperta mostra
 * immagini sovrapposte, descrizione e contatore progetti.
 */
export interface ServiceRow {
  title: string;
  text: string;
  count?: string;
  images?: string[];
}

export interface ServicesAccordionProps {
  eyebrow?: string;
  titleMuted?: string;
  title?: string;
  claim?: string;
  services?: ServiceRow[];
  accent?: string;
}

const DEFAULTS: Required<ServicesAccordionProps> = {
  eyebrow: 'Servizi',
  titleMuted: 'Come possiamo aiutarti',
  title: 'a far crescere la tua attività',
  claim: 'Obiettivi raggiunti per attività e imprenditori in tutta Italia.',
  services: [
    { title: 'Contenuti social', text: 'Foto, video e grafiche pensate per fermare lo scroll e trasformare follower in clienti.', count: '120+ progetti', images: ['card1.png', 'card2.png'] },
    { title: 'Campagne Meta & Google', text: 'Advertising mirato su pubblico locale e nazionale, ottimizzato su costo per contatto.', count: '80+ campagne', images: ['card3.png', 'spiegazione.png'] },
    { title: 'AI per la tua attività', text: 'Formazione e strumenti per creare in autonomia locandine, menu e promo con l’AI.', count: '250+ imprenditori', images: ['spiegazione.png', 'card1.png'] },
    { title: 'Automazioni & chatbot', text: 'Prenotazioni, risposte e follow-up automatici su WhatsApp e Instagram.', count: '30+ sistemi', images: ['card3.png', 'card2.png'] },
  ],
  accent: '#ff5a36',
};

export default function ServicesAccordion(props: ServicesAccordionProps) {
  const p = { ...DEFAULTS, ...props };
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-gradient-to-br from-[#1b1b1b] to-[#262626] px-4 py-20 font-sans text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase" style={{ color: p.accent }}>
          {p.eyebrow}
        </span>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
            <span className="text-white/45">{p.titleMuted}</span>
            <br />
            {p.title}
          </h2>
          <p className="max-w-[16rem] text-sm text-white/70">{p.claim}</p>
        </div>

        <div className="mt-10">
          {p.services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.title} className="border-b border-white/15">
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center gap-6 py-7 text-left">
                  <span className="text-[10px] text-white/50">{String(i + 1).padStart(3, '0')}</span>
                  <span className="flex-1 text-xl sm:text-2xl">{s.title}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
                    style={{ color: p.accent }}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid items-end gap-6 pb-8 sm:grid-cols-[1fr_1.5fr_auto]">
                        <div className="relative h-24 w-40">
                          {s.images?.map((src, k) => (
                            <img
                              key={k}
                              src={src}
                              alt=""
                              className="absolute h-20 w-32 rounded-lg object-cover shadow-xl"
                              style={{ left: k * 24, top: k * 6, transform: `rotate(${k ? 4 : -6}deg)` }}
                            />
                          ))}
                        </div>
                        <p className="max-w-sm text-white/90">{s.text}</p>
                        <span className="text-[10px] font-semibold uppercase text-white/70">{s.count}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
