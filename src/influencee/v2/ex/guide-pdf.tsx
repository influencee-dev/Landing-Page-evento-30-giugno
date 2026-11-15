import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { asset } from '../env';

/* Scaffale delle guide gratuite in PDF (15/11/2026), seconda riga di /guide-e-risorse/, in stile libreria online:
   copertine grandi con dorso e ombra, «Gratis», pagine e link alla pagina della guida.
   Le guide sono quelle del «Calendario marketing 2027» (pagine WordPress create dal plugin Influencee Guide 2027:
   /calendario-marketing-2027/<settore>/, con il modulo prima del download aggiunto dal Core, includes/guide-2027.php).
   Copertine: public/guida27-<settore>.webp (dalle copertine dello zip del plugin). Pagine: conteggio dei PDF. */

export interface Guida {
  slug: string;
  titolo: string;
  tag: string;
  pagine: number;
  testo: string;
}

export const HUB_2027 = '/calendario-marketing-2027/';

export const GUIDE_2027: Guida[] = [
  { slug: 'food', titolo: 'Calendario marketing food 2027', tag: 'Food', pagine: 16, testo: 'Quando promuovere panettone, colomba, gelato e gli altri temi del cibo.' },
  { slug: 'viaggi', titolo: 'Calendario marketing viaggi 2027', tag: 'Viaggi', pagine: 14, testo: 'Sci, mare, Ferragosto, mercatini e Capodanno: quando cercano gli italiani.' },
  { slug: 'casa', titolo: 'Calendario marketing casa 2027', tag: 'Casa', pagine: 12, testo: 'Condizionatori, giardino, fotovoltaico, Halloween e Natale.' },
  { slug: 'famiglia', titolo: 'Calendario marketing famiglia 2027', tag: 'Famiglia', pagine: 14, testo: 'Befana, Carnevale, maturità, estate e Babbo Natale.' },
  { slug: 'sport-benessere', titolo: 'Calendario marketing sport e benessere 2027', tag: 'Sport e benessere', pagine: 12, testo: 'Tennis, Giro d’Italia, corsa, piscina, allergie e sauna.' },
  { slug: 'moda-beauty', titolo: 'Calendario marketing moda e beauty 2027', tag: 'Moda e beauty', pagine: 12, testo: 'Costumi, abbronzatura, Black Friday e le tendenze che crescono.' },
  { slug: 'tech-mobilita', titolo: 'Calendario marketing tech e mobilità 2027', tag: 'Tech e mobilità', pagine: 14, testo: 'Black Friday, Cyber Monday, gomme invernali e bollo.' },
];

export const guidaHref = (g: Guida) => `#${HUB_2027}${g.slug}/`;

/* ─── Copertina «da libreria»: dorso, spessore delle pagine e ombra ─ */
export function Copertina({ g, className = 'w-[150px]', eager = false }: { g: Guida; className?: string; eager?: boolean }) {
  return (
    <div className={`relative mx-auto ${className} [perspective:1200px]`}>
      <div className="relative transition-transform duration-500 [transform:rotateY(-14deg)] [transform-style:preserve-3d] group-hover:[transform:rotateY(-4deg)]">
        <img src={asset(`guida27-${g.slug}.webp`)} alt={`Copertina della guida «${g.titolo}»`} width={480} height={680} loading={eager ? 'eager' : 'lazy'} decoding="async" className="block w-full rounded-l-sm rounded-r-md bg-white shadow-[18px_26px_40px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/5" />
        <span className="pointer-events-none absolute inset-y-0 left-0 w-3 rounded-l-sm bg-gradient-to-r from-black/30 via-black/5 to-transparent" />
        <span className="pointer-events-none absolute inset-y-0 left-3 w-px bg-white/50" />
        <span className="pointer-events-none absolute inset-y-1 -right-1.5 w-1.5 rounded-r-sm bg-[repeating-linear-gradient(90deg,#f3f3f3_0,#f3f3f3_1px,#dcdcdc_1px,#dcdcdc_2px)]" />
      </div>
    </div>
  );
}

/* ─── Scaffale (seconda riga di Guide e risorse) ───────────────── */
export function GuideScaffale({ tone = 'white', escludi, eyebrow = 'Guide gratuite in PDF', title = 'Calendario marketing 2027\n*le guide per settore*', lead = 'Le date, le stagioni di vendita e le giornate da segnare nel 2027, settore per settore. Scegli la tua guida e scaricala gratis.' }: { tone?: 'white' | 'paper'; escludi?: string; eyebrow?: string; title?: string; lead?: string }) {
  return (
    <Section tone={tone} id="guide-pdf">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10 lg:overflow-visible lg:px-0`}>
          {GUIDE_2027.filter((g) => g.slug !== escludi).map((g, i) => (
            <motion.a key={g.slug} href={guidaHref(g)} {...reveal(i % 4)} className="group flex w-[200px] flex-none snap-start flex-col lg:w-auto">
              <div className="relative flex h-[270px] items-end justify-center rounded-3xl bg-gradient-to-b from-paper to-[#ececf2] px-6 pb-7 pt-8 transition group-hover:-translate-y-1">
                <Copertina g={g} />
                <span className="absolute left-4 top-4 rounded-full bg-acid px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">Gratis</span>
                <span className="pointer-events-none absolute inset-x-4 bottom-4 h-1.5 rounded-full bg-black/10" />
              </div>
              <span className={`${TYPE.label} mt-4 text-brand-ink`}>{g.tag}</span>
              <span className="mt-1 font-heading text-lg font-semibold leading-snug tracking-tight">{g.titolo}</span>
              <span className="mt-1 text-sm text-mute">{g.testo}</span>
              <span className="mt-2 text-xs font-semibold text-mute">PDF · {g.pagine} pagine</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                Scarica gratis <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </motion.a>
          ))}
          {/* ultima casella: tutte le date del 2027 */}
          <motion.a href={`#${HUB_2027}`} {...reveal(3)} className="group flex w-[200px] flex-none snap-start flex-col lg:w-auto">
            <div className="flex h-[270px] flex-col justify-between rounded-3xl bg-ink p-6 text-white transition group-hover:-translate-y-1">
              <span className={`${TYPE.label} text-acid`}>Tutte le date</span>
              <span className="font-heading text-2xl font-semibold leading-tight tracking-tight">Festività, ponti e giornate mondiali 2027</span>
              <ArrowRight className="h-6 w-6 text-acid transition group-hover:translate-x-1" />
            </div>
            <span className="mt-4 font-heading text-lg font-semibold leading-snug tracking-tight">Il calendario marketing 2027</span>
            <span className="mt-1 text-sm text-mute">Tutte le guide e le date dell’anno in una pagina.</span>
          </motion.a>
        </div>
        <div className="mt-6 flex justify-center">
          <Button href={`#${HUB_2027}`} variant="secondary">Vai al calendario marketing 2027</Button>
        </div>
      </Container>
    </Section>
  );
}
