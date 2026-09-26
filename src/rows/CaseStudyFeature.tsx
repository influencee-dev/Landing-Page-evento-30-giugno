import React from 'react';
import { motion } from 'motion/react';

/**
 * Row 21 — Case study in evidenza (ref. Kyan / "our projects.")
 * Titolo gigante grigio, riga con logo cliente e nota, tag + headline lunga,
 * descrizione con grassetti, CTA; in basso card risultati, card citazione e foto grande.
 */
export interface CaseStudyFeatureProps {
  bigTitle?: string;
  client?: string;
  note?: string;
  tags?: string[];
  headline?: string;
  /** Testo con **grassetto** in stile markdown minimale. */
  description?: string;
  cta?: { label: string; href: string };
  result?: { title: string; label: string; value: string };
  quote?: { text: string; name: string; role: string; avatar: string };
  image?: string;
}

const DEFAULTS: Required<CaseStudyFeatureProps> = {
  bigTitle: 'i nostri\nprogetti.',
  client: 'Festival del Nerd',
  note: '*Case study in evidenza.',
  tags: ['Social', 'Eventi', 'Video'],
  headline: 'Abbiamo ripensato tutta la comunicazione del festival, dalla strategia ai contenuti fino alle campagne.',
  description:
    'Dopo un’analisi del pubblico e della percezione del brand, **abbiamo costruito un nuovo piano editoriale e un format video** pensato per lo short-form, con messaggi chiari e un approccio mobile-first.',
  cta: { label: 'Vedi il progetto', href: '#' },
  result: { title: 'Risultati.', label: 'Views organiche', value: '2M → 30M' },
  quote: { text: 'Il team ha capito il nostro pubblico meglio di noi. Non hanno solo fatto contenuti: hanno costruito una community.', name: 'Organizzazione', role: 'Festival del Nerd', avatar: 'giuseppe.png' },
  image: 'card1.png',
};

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i} className="font-medium text-zinc-900">{part}</b> : part))}
    </>
  );
}

export default function CaseStudyFeature(props: CaseStudyFeatureProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-[#f3f3f5] px-4 py-16 font-sans text-zinc-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="whitespace-pre-line text-center font-work text-6xl font-semibold leading-[0.85] tracking-[-0.05em] text-zinc-400 sm:text-8xl">{p.bigTitle}</h2>

        <div className="mt-10 flex items-center gap-4 text-sm">
          <b className="shrink-0 font-semibold">{p.client}</b>
          <span className="h-px flex-1 bg-zinc-300" />
          <span className="shrink-0 font-medium">{p.note}</span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              <span className="mr-3 inline-flex translate-y-[-4px] gap-1.5 align-middle">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-[10px] font-normal text-zinc-500">
                    • {t}
                  </span>
                ))}
              </span>
              {p.headline}
            </h3>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-zinc-500">
              <Rich text={p.description} />
            </p>
            <a href={p.cta.href} className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700">
              {p.cta.label}
            </a>

            <div className="mt-14 grid grid-cols-2 items-end gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-white p-5 text-sm">
                <b className="font-medium">{p.result.title}</b>
                <div>
                  <p className="text-zinc-400">{p.result.label}</p>
                  <p className="text-lg font-medium">{p.result.value}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="-mt-16 flex aspect-[4/6] flex-col justify-between rounded-2xl bg-white p-5"
              >
                <div>
                  <img src={p.quote.avatar} alt="" className="h-9 w-9 rounded-md object-cover" />
                  <p className="mt-2 text-sm font-medium">{p.quote.name}</p>
                  <p className="text-xs text-zinc-400">{p.quote.role}</p>
                </div>
                <p className="text-sm font-medium leading-snug">“{p.quote.text}”</p>
              </motion.div>
            </div>
          </div>
          <motion.img
            src={p.image}
            alt=""
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/5] w-full self-end rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
