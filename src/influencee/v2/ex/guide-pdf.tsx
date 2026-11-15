import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Check, Download, FileText, Languages, CalendarDays, Users } from 'lucide-react';
import { Container, Eyebrow, GAP, Heading, Lead, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { asset } from '../env';
import { type QA } from '../data';
import { AnswerBox, Crumbs, CtaDual, FaqSeo } from '../rows';
import type { ExPage } from './types';

/* Guide in PDF da scaricare (15/11/2026). Vetrina in stile libreria online (copertina grande, «sfoglia
   l'anteprima», indice, scheda dei dettagli, «ti potrebbero interessare») e una pagina per guida con il modulo:
   il lead va a tandem-forms (<form data-tandem>), poi compare il pulsante per scaricare il PDF.
   I PDF sono quelli già caricati nella libreria media di WordPress. Testi presi dalle guide, nessun numero aggiunto.
   Immagini: public/guida-<slug>-copertina.webp e -p<n>.webp (pagine del PDF).
   STATO 15/11: struttura pronta ma SPENTA (ready: false) e scaffale non ancora nella pagina Guide e risorse:
   il titolare dice che le guide da mettere non sono questi 5 PDF. Quando arrivano: sostituire GUIDE_PDF e le
   immagini, ready: true, e in guide-e-risorse.tsx mettere <GuideScaffale /> subito dopo la hero. */

export interface GuidaPdf {
  slug: string;
  titolo: string;
  /** titolo con *evidenza* per l'H1 */
  h1: string;
  sottotitolo: string;
  tag: string;
  edizione: string;
  pagine: number;
  formato: string;
  orizzontale?: boolean;
  perChi: string;
  capitoli: string[];
  anteprime: number[];
  pdf: string;
  seo: { title: string; description: string; kw: string };
}

const UP = 'https://influencee.it/wp-content/uploads/';

export const GUIDE_PDF: GuidaPdf[] = [
  {
    slug: 'benchmark-influencer-2026',
    titolo: 'Benchmark Influencer 2026',
    h1: 'Benchmark Influencer *2026*',
    sottotitolo: 'La guida ai KPI, alle metriche di conversione e ai costi reali per campagne guidate dai dati.',
    tag: 'Dati e KPI',
    edizione: 'Gennaio 2026',
    pagine: 5,
    formato: 'PDF, A4',
    perChi: 'Brand, agenzie e marketing manager che devono scegliere i creator e giustificare il budget.',
    capitoli: ['Il panorama influencer 2026: la fine delle vanity metrics', 'Engagement rate medi per fascia di follower su Instagram Reels e TikTok', 'Oltre i like: i 4 KPI che vuole vedere chi approva il budget (EMV, CPM reale, CTR, CAC)', 'Come applicare i benchmark alle campagne del tuo brand'],
    anteprime: [2, 3, 4],
    pdf: `${UP}2026/01/Guida-Benckmark-influencer-2026_compressed.pdf`,
    seo: { title: 'Benchmark Influencer 2026: guida PDF gratuita', description: 'Scarica gratis la guida Benchmark Influencer 2026: engagement rate per fascia, KPI per misurare le campagne e costi di riferimento. PDF di 5 pagine.', kw: 'benchmark influencer 2026' },
  },
  {
    slug: 'creator-geolocalizzati-retail',
    titolo: 'Creator geolocalizzati per il retail fisico',
    h1: 'Creator geolocalizzati\n*per il retail fisico*',
    sottotitolo: 'Il metodo per trasformare le visualizzazioni su TikTok e Instagram in ingressi reali nel tuo punto vendita.',
    tag: 'Retail',
    edizione: '2026',
    pagine: 5,
    formato: 'PDF, A4',
    perChi: 'Catene, franchising e negozi che vogliono portare persone in store con creator della zona.',
    capitoli: ['Il divario tra online e negozio: perché le campagne nazionali non bastano', 'Micro-geotargeting: la pianificazione per codice postale in tre fasi', 'I format video che portano le persone dal feed al negozio', 'Come misurare il ritorno offline di una campagna'],
    anteprime: [2, 3, 4],
    pdf: `${UP}2026/01/Influencee-Guida-Creator-Geolocalizzati-per-il-retail-Fisico-2026_compressed.pdf`,
    seo: { title: 'Creator geolocalizzati per il retail: guida PDF', description: 'Guida gratuita per negozi e catene: come pianificare creator della zona per codice postale e portare persone in store. Scarica il PDF.', kw: 'influencer per negozi' },
  },
  {
    slug: 'clienti-ambassador-ugc-retail',
    titolo: 'Trasforma i clienti in ambassador',
    h1: 'Trasforma i clienti\n*in ambassador*',
    sottotitolo: 'Come progettare l’esperienza in negozio per far nascere contenuti spontanei dei clienti e aumentare le vendite senza budget media.',
    tag: 'UGC e retail',
    edizione: '2026',
    pagine: 5,
    formato: 'PDF, A4',
    perChi: 'Negozi, retail e franchising che vogliono più contenuti autentici (UGC) dai propri clienti.',
    capitoli: ['La fiducia nel retail fisico: perché i contenuti dei clienti contano', 'Rendere il negozio «instagrammabile»: 4 interventi da fare in store', 'Come usare i contenuti dei clienti in pubblicità e sull’e-commerce', 'Diritti e consenso: cosa serve per riusare le foto dei clienti'],
    anteprime: [2, 3, 4],
    pdf: `${UP}2026/01/Influencee-Guida-Come-Trasforma-i-clienti-in-ambassador-2026-compresso.pdf`,
    seo: { title: 'Trasforma i clienti in ambassador: guida PDF', description: 'Guida gratuita per il retail: come far nascere contenuti UGC dei clienti in negozio e usarli per vendere. Scarica il PDF di 5 pagine.', kw: 'clienti brand ambassador' },
  },
  {
    slug: 'report-benchmark-influencer-marketing-2026',
    titolo: 'Report Benchmark Influencer Marketing 2026',
    h1: 'Report benchmark\n*influencer marketing 2026*',
    sottotitolo: 'Guida strategica al mercato, ai costi di TikTok e Instagram Reels, all’engagement rate e ai trend dell’anno.',
    tag: 'Mercato',
    edizione: 'Gennaio 2026',
    pagine: 4,
    formato: 'PDF, A4',
    perChi: 'Chi prepara il piano annuale e vuole un quadro rapido di mercato, costi e strategie.',
    capitoli: ['Panoramica del mercato 2026: social commerce e ritorno sull’investimento', 'Costi medi dei contenuti su TikTok e Instagram Reels', 'Engagement rate: quando è davvero «buono» nel 2026', 'Takeaway operativi per le campagne'],
    anteprime: [2, 3, 4],
    pdf: `${UP}2026/02/Influencee-Benchmark-2026.pdf`,
    seo: { title: 'Report benchmark influencer marketing 2026 (PDF)', description: 'Report gratuito sull’influencer marketing 2026: mercato, costi medi di TikTok e Reels, engagement rate e takeaway operativi. Scarica il PDF.', kw: 'report influencer marketing 2026' },
  },
  {
    slug: 'ristorazione-luxury-bassa-stagione',
    titolo: 'Ristorazione luxury: come gestire la bassa stagione',
    h1: 'Ristorazione luxury:\n*come gestire la bassa stagione*',
    sottotitolo: 'I periodi di calo nella ristorazione di alta gamma e le strategie di marketing per riempire le serate lente.',
    tag: 'Food',
    edizione: 'Marzo 2026',
    pagine: 15,
    formato: 'PDF, slide',
    orizzontale: true,
    perChi: 'Ristoranti di alta gamma e stellati, hotel con ristorazione e chi ne cura il marketing.',
    capitoli: ['I tre periodi critici dell’anno e i giorni più deboli della settimana', 'Strategie per gennaio-febbraio, agosto e settembre-ottobre', 'Marketing automation e prezzi dinamici senza svendere il posizionamento', 'Raccomandazioni e azioni chiave prima della bassa stagione'],
    anteprime: [2, 6, 13],
    pdf: `${UP}2026/03/Influencee_Luxury_White_Stellati_Mar2026_compressed.pdf`,
    seo: { title: 'Ristorazione luxury e bassa stagione: guida PDF', description: 'Guida gratuita per ristoranti di alta gamma: i periodi di calo dell’anno e le strategie di marketing e influencer per riempire le serate lente.', kw: 'marketing ristorante bassa stagione' },
  },
];

export const guidaPath = (g: GuidaPdf) => `/guide-e-risorse/${g.slug}/`;
const img = (g: GuidaPdf, k: string) => asset(`guida-${g.slug}-${k}.webp`);

/* ─── Copertina «da libreria»: dorso, ombra e luce ───────────────── */
export function Copertina({ g, size = 'md', eager = false }: { g: GuidaPdf; size?: 'sm' | 'md' | 'lg'; eager?: boolean }) {
  const w = g.orizzontale ? { sm: 'w-[260px]', md: 'w-full', lg: 'w-full max-w-[560px]' }[size] : { sm: 'w-[168px]', md: 'w-full max-w-[220px]', lg: 'w-full max-w-[340px]' }[size];
  return (
    <div className={`relative mx-auto ${w} [perspective:1400px]`}>
      <div className={`group/book relative transition-transform duration-500 ${g.orizzontale ? '' : '[transform:rotateY(-14deg)] hover:[transform:rotateY(-4deg)]'} [transform-style:preserve-3d]`}>
        <img
          src={img(g, 'copertina')}
          alt={`Copertina della guida «${g.titolo}»`}
          width={g.orizzontale ? 960 : 640}
          height={g.orizzontale ? 540 : 905}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`block w-full ${g.orizzontale ? 'rounded-xl' : 'rounded-r-md rounded-l-sm'} bg-white shadow-[18px_26px_40px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/5`}
        />
        {!g.orizzontale && (
          <>
            {/* dorso e piega della copertina */}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-3 rounded-l-sm bg-gradient-to-r from-black/25 via-black/5 to-transparent" />
            <span className="pointer-events-none absolute inset-y-0 left-3 w-px bg-white/50" />
            {/* spessore delle pagine */}
            <span className="pointer-events-none absolute inset-y-1 -right-1.5 w-1.5 rounded-r-sm bg-[repeating-linear-gradient(90deg,#f3f3f3_0,#f3f3f3_1px,#dcdcdc_1px,#dcdcdc_2px)]" />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Scaffale per la pagina Guide e risorse (seconda riga) ─────── */
export function GuideScaffale({ escludi, tone = 'white', eyebrow = 'Guide in PDF', title = 'Le guide gratuite\n*da scaricare*', lead = 'Benchmark, metodi e casi pratici in formato PDF, scritti dal team di Influencee. Scegli la guida e scaricala gratis.' }: { escludi?: string; tone?: 'white' | 'paper'; eyebrow?: string; title?: string; lead?: string }) {
  const lista = GUIDE_PDF.filter((g) => g.slug !== escludi);
  return (
    <Section tone={tone} id="guide-pdf">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0`}>
          {lista.map((g, i) => (
            <motion.a key={g.slug} href={`#${guidaPath(g)}`} {...reveal(i)} className="group flex w-[220px] flex-none snap-start flex-col lg:w-auto">
              <div className="relative flex h-[300px] items-end justify-center rounded-3xl bg-gradient-to-b from-paper to-[#ececf2] px-6 pb-7 pt-8 transition group-hover:-translate-y-1">
                <Copertina g={g} size={g.orizzontale ? 'md' : 'sm'} />
                <span className="absolute left-4 top-4 rounded-full bg-acid px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">Gratis</span>
                {/* mensola */}
                <span className="pointer-events-none absolute inset-x-4 bottom-4 h-1.5 rounded-full bg-black/10" />
              </div>
              <span className={`${TYPE.label} mt-4 text-brand-ink`}>{g.tag}</span>
              <span className="mt-1 font-heading text-lg font-semibold leading-snug tracking-tight">{g.titolo}</span>
              <span className="mt-1 text-sm text-mute">{g.pagine} pagine · {g.formato}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                Scarica gratis <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Modulo per scaricare: lead a tandem-forms, poi il PDF ───────── */
function ModuloScarica({ g }: { g: GuidaPdf }) {
  const [inviato, setInviato] = useState(false);
  const field = 'mt-1.5 h-12 w-full rounded-2xl bg-paper px-4 text-[15px] text-ink outline-none ring-1 ring-line focus:ring-brand';
  const id = `guida-${g.slug}`;
  if (inviato)
    return (
      <div className="rounded-[28px] bg-ink p-7 text-white sm:p-8" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-acid text-ink"><Check className="h-5 w-5" /></span>
        <p className="mt-5 font-heading text-2xl font-semibold tracking-tight">La tua guida è pronta</p>
        <p className="mt-2 text-white/65">Grazie! Scaricala ora: il PDF si apre in una nuova scheda.</p>
        <a href={g.pdf} target="_blank" rel="noopener" download className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-acid px-6 font-semibold text-ink">
          <Download className="h-4 w-4" /> Scarica il PDF
        </a>
      </div>
    );
  return (
    <form
      id={`lead-form-${id}`}
      name={`Guida PDF: ${g.titolo}`}
      aria-label={`Scarica la guida ${g.titolo}`}
      data-tandem=""
      data-form={`lead_guida_${g.slug.replace(/-/g, '_')}`.slice(0, 40)}
      onSubmit={(e) => {
        e.preventDefault();
        setInviato(true);
      }}
      className="grid grid-cols-1 gap-3 rounded-[28px] bg-white p-5 text-ink shadow-[0_24px_60px_-30px_rgba(29,29,31,0.35)] ring-1 ring-line sm:grid-cols-2 sm:p-7"
    >
      <p className="font-heading text-xl font-semibold tracking-tight sm:col-span-2">Scarica la guida gratis</p>
      <label htmlFor={`${id}-nome`}><span className="text-xs font-semibold text-mute">Nome</span><input id={`${id}-nome`} name="nome" autoComplete="given-name" required className={field} /></label>
      <label htmlFor={`${id}-email`}><span className="text-xs font-semibold text-mute">Email di lavoro</span><input id={`${id}-email`} name="email" type="email" autoComplete="email" required className={field} /></label>
      <label htmlFor={`${id}-azienda`} className="sm:col-span-2"><span className="text-xs font-semibold text-mute">Azienda o attività (facoltativo)</span><input id={`${id}-azienda`} name="azienda" autoComplete="organization" className={field} /></label>
      <label htmlFor={`${id}-guida`} className="sm:col-span-2"><span className="text-xs font-semibold text-mute">Guida richiesta</span><input id={`${id}-guida`} name="guida" readOnly value={g.titolo} className={`${field} bg-ink text-white/85 ring-0`} /></label>
      <label className="flex items-start gap-2 text-xs text-mute sm:col-span-2"><input type="checkbox" name="consenso_marketing" value="Sì" className="mt-0.5 h-4 w-4 accent-[#ff1f8f]" /> Voglio ricevere le prossime guide e le novità di Influencee (facoltativo)</label>
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white sm:col-span-2"><Download className="h-4 w-4" /> Scarica il PDF gratis</button>
      <p className="text-[11px] leading-relaxed text-mute sm:col-span-2">Usiamo i tuoi dati per inviarti la guida richiesta e, solo se lo scegli, le prossime. <a href="/privacy-policy/" className="underline">Informativa privacy</a></p>
    </form>
  );
}

const faqGuida = (g: GuidaPdf): QA[] => [
  { q: `La guida «${g.titolo}» è gratuita?`, a: 'Sì. Lasci nome ed email e scarichi subito il PDF, senza costi e senza abbonamenti.' },
  { q: 'In che formato è la guida?', a: `È un ${g.formato.replace('PDF, ', 'PDF in formato ')} di ${g.pagine} pagine, in italiano: si legge da computer, tablet e telefono e si può stampare.` },
  { q: 'A chi è utile?', a: g.perChi },
  { q: 'Posso applicare la guida con Influencee?', a: 'Sì: nella piattaforma trovi creator italiani per categoria, città e fascia di follower, e gestisci campagne, contratti e link tracciati. Puoi provarla gratis oppure affidare la campagna al team.' },
];

/* ─── Pagina della singola guida ────────────────────────────────── */
function PaginaGuida({ g }: { g: GuidaPdf }) {
  const dettagli: [React.ComponentType<{ className?: string }>, string, string][] = [
    [FileText, 'Formato', `${g.formato} · ${g.pagine} pagine`],
    [CalendarDays, 'Edizione', g.edizione],
    [Languages, 'Lingua', 'Italiano'],
    [Users, 'Per chi è', g.perChi],
    [BookOpen, 'Editore', 'Influencee'],
  ];
  return (
    <>
      {/* Hero su nero: copertina grande a sinistra, scheda «da libreria» a destra */}
      <Section tone="ink" pad="none" className="pb-16 pt-8 sm:pb-24 sm:pt-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(200,255,26,0.14),transparent_55%),radial-gradient(ellipse_at_85%_10%,rgba(255,31,143,0.2),transparent_55%)]" />
        <Container>
          <Crumbs items={[{ label: 'Risorse' }, { label: 'Guide e risorse', href: '#/guide-e-risorse/' }, { label: g.titolo }]} />
          <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:mt-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Copertina g={g} size="lg" eager />
              <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Sfoglia l’anteprima</p>
              <div className="mt-3 flex justify-center gap-3">
                {g.anteprime.map((n) => (
                  <a key={n} href="#anteprima" className={`block overflow-hidden rounded-md ring-1 ring-white/15 transition hover:ring-acid ${g.orizzontale ? 'w-24' : 'w-16'}`}>
                    <img src={img(g, `p${n}`)} alt={`Pagina ${n} della guida`} loading="lazy" decoding="async" className="block w-full" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow>{`Guida gratuita · ${g.tag}`}</Eyebrow>
              <Heading as="h1" size="display" text={g.h1} className="mt-6 lg:!text-[3.4rem]" />
              <Lead className="mt-6 max-w-xl">{g.sottotitolo}</Lead>
              <ul className="mt-7 flex flex-wrap gap-2 text-sm text-white/80">
                {[`${g.pagine} pagine`, g.formato, `Edizione ${g.edizione}`, 'Italiano'].map((t) => (
                  <li key={t} className="rounded-full bg-white/10 px-3.5 py-1.5">{t}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#scarica" className="inline-flex h-12 items-center gap-2 rounded-full bg-acid px-6 font-semibold text-ink">
                  <Download className="h-4 w-4" /> Scarica gratis
                </a>
                <span className="text-sm text-white/55">Gratis · ti chiediamo solo nome ed email</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <AnswerBox q={`Cosa trovi nella guida «${g.titolo}»?`} a={`${g.sottotitolo} È un ${g.formato.replace('PDF, ', 'PDF in formato ')} di ${g.pagine} pagine, gratuito, pensato per: ${g.perChi.charAt(0).toLowerCase()}${g.perChi.slice(1)}`} points={g.capitoli.slice(0, 4).map((c) => c.split(':')[0])} />

      {/* Indice + modulo (come la scheda prodotto: descrizione a sinistra, «acquisto» a destra) */}
      <Section tone="paper" id="scarica">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <SectionHeader align="left" eyebrow="Indice" title={'Cosa trovi\n*dentro la guida*'} lead={`Capitoli della guida «${g.titolo}».`} />
              <ol className="mt-8 grid gap-3">
                {g.capitoli.map((c, i) => (
                  <li key={c} className="flex items-start gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                    <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl font-heading text-sm font-bold ${['bg-acid text-ink', 'bg-brand text-white', 'bg-ink text-white'][i % 3]}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="pt-2 text-[15px] font-semibold leading-snug">{c}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <ModuloScarica g={g} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Anteprima delle pagine («sfoglia») */}
      <Section tone="white" id="anteprima">
        <Container>
          <SectionHeader eyebrow="Anteprima" title={'Sfoglia\n*alcune pagine*'} lead="Uno sguardo all’impaginazione e ai contenuti della guida." />
          <div className={`${GAP.header} grid grid-cols-1 gap-6 ${g.orizzontale ? 'md:grid-cols-3' : 'sm:grid-cols-3'}`}>
            {g.anteprime.map((n, i) => (
              <motion.figure key={n} {...reveal(i)} className="overflow-hidden rounded-2xl bg-paper p-3">
                <img src={img(g, `p${n}`)} alt={`Anteprima della pagina ${n} della guida «${g.titolo}»`} loading="lazy" decoding="async" className="block w-full rounded-lg shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]" />
                <figcaption className="mt-3 text-center text-xs font-semibold text-mute">Pagina {n} di {g.pagine}</figcaption>
              </motion.figure>
            ))}
          </div>
        </Container>
      </Section>

      {/* Dettagli, come la scheda del libro */}
      <Section tone="paper">
        <Container>
          <SectionHeader eyebrow="Dettagli" title={'La scheda\n*della guida*'} />
          <dl className={`${GAP.header} mx-auto grid max-w-3xl grid-cols-1 divide-y divide-line rounded-3xl bg-white px-6 ring-1 ring-line`}>
            {dettagli.map(([Icon, k, v]) => (
              <div key={k} className="flex items-start gap-4 py-4">
                <Icon className="mt-0.5 h-5 w-5 flex-none text-brand" />
                <dt className="w-28 flex-none text-sm font-semibold">{k}</dt>
                <dd className="text-sm text-mute">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex justify-center">
            <a href="#scarica" className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-white">
              <Download className="h-4 w-4" /> Scarica la guida gratis
            </a>
          </div>
        </Container>
      </Section>

      <GuideScaffale escludi={g.slug} eyebrow="Altre guide" title={'Ti potrebbero\n*interessare anche*'} lead="Le altre guide gratuite di Influencee in PDF." />
      <FaqSeo items={faqGuida(g)} />
      <CtaDual />
    </>
  );
}

export const GUIDE_PDF_PAGES: ExPage[] = GUIDE_PDF.map((g) => ({
  path: guidaPath(g),
  ready: false, // SPENTE: le guide giuste sono altre (15/11, da sostituire con quelle indicate dal titolare)
  titles: [g.seo.title, g.titolo],
  meta: {
    label: g.titolo,
    type: 'page',
    kw: g.seo.kw,
    description: g.seo.description,
    crumbs: [{ label: 'Risorse' }, { label: 'Guide e risorse', href: '#/guide-e-risorse/' }, { label: g.titolo }],
    faq: faqGuida(g),
  },
  el: () => <PaginaGuida g={g} />,
}));
