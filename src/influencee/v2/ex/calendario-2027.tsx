import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Check, Download, Flame, MapPin, MousePointerClick, ShoppingBag, Sparkles, Store, TrendingUp, Users } from 'lucide-react';
import { Button, Container, Eyebrow, GAP, Heading, Lead, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { asset } from '../env';
import type { QA } from '../data';
import { AnswerBox, Crumbs, CtaDual, FaqSeo, Related } from '../rows';
import DATI from '../calendario-2027.json';
import { Copertina, GUIDE_2027, GuideScaffale, HUB_2027 } from './guide-pdf';
import type { ExPage } from './types';

/* «Calendario marketing 2027» (15/11/2026): pagina principale + 7 guide di settore, nel template del sito.
   Dati: calendario-2027.json, esportato dai file della guida (appinfluencee, docs/interno/guide-2027: dati_*.py,
   testi_*.py, wp/genera_pagine.py). Nessun numero aggiunto qui: date, «quanto sale», regolarità e tendenze sono
   quelli del calcolo Influencee Trends (visite di persone alla Wikipedia italiana dal 2016).
   Impianto (benchmark delle landing per lead magnet): una sola azione (scaricare la guida), copertina e anteprima
   delle pagine, contenuto utile visibile in HTML per Google e motori di risposta (date, tabelle, FAQ), modulo corto
   (nome, email, azienda facoltativa) e gioco leggero: «costruisci il tuo piano» sceglie i temi e mostra i giorni
   che mancano; il piano viaggia con il lead (campo risultato_tool) e dopo l'invio si scarica il PDF.
   Il lead va a tandem-forms (<form data-tandem>); GA4: form_submit + generate_lead (lead_guida_2027_<settore>),
   guide_download sul PDF. */

type Stagione = { nome: string; da: string; picco: string; sale: string; reg: string; trimestre?: string; negozio: string; online: string; creator: string; b2b?: string };
type Trimestre = { titolo: string; sotto: string; temi: string[] };
type Guida = {
  slug: string;
  categoria: string;
  del_: string;
  aggiornato: string;
  sottotitolo: string;
  stagioni: Stagione[];
  trimestri: Trimestre[];
  ricorrenze: { nome: string; data: string; idea: string }[];
  cresce: [string, string][];
  etichette: Record<string, string>;
  foto_copertina: string[];
  intro: string;
  faq: [string, string][];
  creator_link: [string, string];
  metodo: string;
};
const D = DATI as unknown as {
  date_2027: { data: string; nome: string; tipo: string; nota: string }[];
  giornate: { data: string; nome: string; fonte: string; settore: string }[];
  settori: [string, string, string][];
  hub_faq: [string, string][];
  guide: Record<string, Guida>;
};

const PDF: Record<string, string> = {
  food: 'Food', viaggi: 'Viaggi', casa: 'Casa', famiglia: 'Famiglia', 'sport-benessere': 'Sport-benessere', 'moda-beauty': 'Moda-beauty', 'tech-mobilita': 'Tech-mobilita',
};
const pdfUrl = (slug: string) => `https://influencee.it/wp-content/uploads/2026/11/${PDF[slug]}-2027-guida-Influencee-Trends.pdf`;
const pagine = (slug: string) => GUIDE_2027.find((g) => g.slug === slug)?.pagine ?? 12;
const nomeSettore = (slug: string) => GUIDE_2027.find((g) => g.slug === slug)?.tag ?? slug;

/* ─── Date in italiano ──────────────────────────────────────────── */
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MESI_BREVI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const dt = (s: string) => new Date(`${s}T12:00:00Z`);
function data(s: string, giorno = false) {
  const d = dt(s);
  const t = `${d.getUTCDate()} ${MESI[d.getUTCMonth()]}${d.getUTCFullYear() !== 2027 ? ` ${d.getUTCFullYear()}` : ''}`;
  return giorno ? `${GIORNI[d.getUTCDay()]} ${t}` : t;
}
/** Giorni che mancano a una data (solo nel browser, dopo il caricamento: niente differenze col pre-rendering). */
function useOggi() {
  const [oggi, set] = useState<Date | null>(null);
  useEffect(() => set(new Date()), []);
  return oggi;
}
const mancano = (oggi: Date, s: string) => Math.ceil((dt(s).getTime() - oggi.getTime()) / 86_400_000);
const tra = (n: number) => (n > 1 ? `tra ${n} giorni` : n === 1 ? 'domani' : n === 0 ? 'oggi' : 'già iniziata');

/** Testi delle FAQ: le guide ora si scaricano lasciando nome ed email. */
const faqSito = (f: [string, string][]): QA[] => f.map(([q, a]) => ({ q, a: a.replace(/,? senza registrazione/gi, ' lasciando nome ed email').replace(/Gratis, senza registrazione\.?/gi, 'Gratis.') }));

/* ─── Hero (su nero, evidenza verde acido) ──────────────────────── */
function Hero({ crumbs, eyebrow, title, lead, cta, cta2, visual, chips }: { crumbs: { label: string; href?: string }[]; eyebrow: string; title: string; lead: string; cta: string; cta2?: [string, string]; visual: React.ReactNode; chips: string[] }) {
  return (
    <Section tone="ink" pad="none" className="pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(255,31,143,0.22),transparent_55%),radial-gradient(ellipse_at_70%_95%,rgba(200,255,26,0.12),transparent_50%)]" />
      <Container>
        <Crumbs items={crumbs} />
        <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:mt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div {...reveal()}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading as="h1" size="display" text={title} className="mt-6 lg:!text-[3.8rem]" />
            <Lead className="mt-6 max-w-xl">{lead}</Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#scarica" arrow>{cta}</Button>
              {cta2 && <Button href={cta2[1]} variant="secondary">{cta2[0]}</Button>}
            </div>
            <ul className="mt-7 flex flex-wrap gap-2 text-sm text-white/75">
              {chips.map((c) => (
                <li key={c} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5"><Check className="h-3.5 w-3.5 text-acid" />{c}</li>
              ))}
            </ul>
          </motion.div>
          <div className="relative">{visual}</div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Visual: copertina + «prossima stagione» ───────────────────── */
function CopertinaProssima({ g }: { g: Guida }) {
  const oggi = useOggi();
  const ordinate = [...g.stagioni].sort((a, b) => a.da.localeCompare(b.da));
  const prossima = (oggi && ordinate.find((s) => mancano(oggi, s.picco) >= 0)) || ordinate[0];
  const guida = GUIDE_2027.find((x) => x.slug === g.slug)!;
  return (
    <div className="relative mx-auto max-w-[420px] pb-10">
      <div className="absolute inset-x-6 bottom-0 top-10 rounded-[40px] bg-gradient-to-br from-brand/40 via-white/5 to-acid/20 blur-2xl" />
      <Copertina g={guida} className="w-[230px] sm:w-[270px]" eager />
      <span className="absolute left-0 top-6 rounded-full bg-acid px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink shadow-float sm:left-4">Gratis · PDF</span>
      <div className="absolute -bottom-2 right-0 w-[230px] rounded-2xl bg-white p-4 text-ink shadow-float sm:right-2">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-ink"><Flame className="h-3.5 w-3.5" /> Prossima stagione</p>
        <p className="mt-1 font-heading text-lg font-semibold leading-tight">{prossima.nome}</p>
        <p className="mt-1 text-xs text-mute">Inizia a salire il {data(prossima.da)} · picco il {data(prossima.picco)}</p>
        {oggi && <p className="mt-2 inline-flex rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold">{mancano(oggi, prossima.da) > 0 ? `Prepararsi ${tra(mancano(oggi, prossima.da))}` : `Picco ${tra(mancano(oggi, prossima.picco))}`}</p>}
      </div>
    </div>
  );
}

/* ─── Linea del tempo 2027 (stagioni da «inizia a salire» al picco) ─ */
function LineaTempo({ g }: { g: Guida }) {
  const anno0 = dt('2027-01-01').getTime();
  const anno1 = dt('2027-12-31').getTime();
  const pos = (s: string) => Math.min(1, Math.max(0, (dt(s).getTime() - anno0) / (anno1 - anno0)));
  const ordinate = [...g.stagioni].sort((a, b) => a.da.localeCompare(b.da));
  const colori = ['bg-brand', 'bg-ink', 'bg-acid'];
  return (
    <div className="overflow-x-auto rounded-[28px] bg-white p-4 ring-1 ring-line sm:p-6">
      <div className="min-w-[680px]">
        <div className="ml-[150px] grid grid-cols-12 border-b border-line pb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-mute">
          {MESI_BREVI.map((m) => <span key={m}>{m}</span>)}
        </div>
        <ul className="mt-2 space-y-1.5">
          {ordinate.map((s, i) => {
            const a = pos(s.da);
            const b = pos(s.picco);
            const prima = dt(s.da).getUTCFullYear() < 2027;
            return (
              <li key={s.nome} className="flex items-center">
                <span className="w-[150px] flex-none truncate pr-3 text-sm font-semibold">{s.nome}</span>
                <span className="relative h-7 flex-1 rounded-full bg-paper">
                  <span className={`absolute inset-y-1 rounded-full ${colori[i % 3]} ${prima ? 'rounded-l-none' : ''}`} style={{ left: `${a * 100}%`, width: `${Math.max(1.2, (b - a) * 100)}%` }} title={`${s.nome}: dal ${data(s.da)} al picco del ${data(s.picco)}`} />
                  <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow" style={{ left: `${b * 100}%` }} />
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex flex-wrap items-center gap-4 text-xs text-mute">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-6 rounded-full bg-brand" /> da quando l’interesse inizia a salire</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-white bg-brand shadow" /> picco</span>
        </p>
      </div>
    </div>
  );
}

/* ─── Tabella delle stagioni (HTML visibile: Google e motori di risposta) ─ */
function TabellaStagioni({ g }: { g: Guida }) {
  const ordinate = [...g.stagioni].sort((a, b) => a.da.localeCompare(b.da));
  return (
    <div className="mt-6 overflow-x-auto rounded-[28px] bg-white ring-1 ring-line">
      <table className="w-full min-w-[620px] text-left text-sm">
        <caption className="sr-only">Stagioni {g.del_} nel 2027: quando inizia a salire l’interesse e quando arriva il picco</caption>
        <thead className="bg-ink text-white">
          <tr>{['Tema', 'Inizia a salire', 'Picco', 'Quanto sale', 'Regolarità'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {ordinate.map((s) => (
            <tr key={s.nome}>
              <th scope="row" className="px-4 py-3 font-semibold">{s.nome}</th>
              <td className="px-4 py-3">{data(s.da)}</td>
              <td className="px-4 py-3">{data(s.picco)}</td>
              <td className="px-4 py-3">{s.sale}</td>
              <td className="px-4 py-3 text-mute">{s.reg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Modulo: lead → tandem-forms, poi il PDF ───────────────────── */
function ModuloGuida({ slug, piano, titolo, select }: { slug: string; piano: string; titolo: string; select?: { value: string; set: (v: string) => void } }) {
  const [inviato, setInviato] = useState(false);
  const scelta = select ? select.value : slug;
  const field = 'mt-1.5 h-12 w-full rounded-2xl bg-paper px-4 text-[15px] text-ink outline-none ring-1 ring-line focus:ring-brand';
  const id = `g27-${slug}`;
  if (inviato)
    return (
      <div className="rounded-[28px] bg-ink p-7 text-white sm:p-8" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-acid text-ink"><Check className="h-5 w-5" /></span>
        <p className="mt-5 font-heading text-2xl font-semibold tracking-tight">La tua guida è pronta</p>
        <p className="mt-2 text-white/65">Il PDF si apre in una nuova scheda: salvalo o stampalo e appendilo dove lavori.</p>
        <a href={pdfUrl(scelta)} target="_blank" rel="noopener" download className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-acid px-6 font-semibold text-ink">
          <Download className="h-4 w-4" /> Scarica la guida {nomeSettore(scelta)} 2027
        </a>
        {piano && (
          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">
            <p className="font-semibold text-acid">Il tuo piano</p>
            <p className="mt-1 whitespace-pre-line text-white/80">{piano}</p>
          </div>
        )}
        <a href={`#${HUB_2027}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 underline decoration-acid underline-offset-4">Vedi le altre guide 2027 <ArrowRight className="h-4 w-4" /></a>
      </div>
    );
  return (
    <form
      id={`lead-form-${id}`}
      name={`Guida 2027: ${titolo}`}
      aria-label={`Scarica la guida ${titolo}`}
      data-tandem=""
      data-form={`lead_guida_2027_${(select ? 'hub' : slug).replace(/-/g, '_')}`}
      onSubmit={(e) => {
        e.preventDefault();
        setInviato(true);
      }}
      className="grid grid-cols-1 gap-3 rounded-[28px] bg-white p-5 text-ink shadow-[0_24px_60px_-30px_rgba(29,29,31,0.35)] ring-1 ring-line sm:grid-cols-2 sm:p-7"
    >
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-ink sm:col-span-2"><Download className="h-4 w-4" /> Guida gratuita · PDF di {pagine(scelta)} pagine</p>
      {select && (
        <label htmlFor={`${id}-settore`} className="sm:col-span-2"><span className="text-xs font-semibold text-mute">Il tuo settore</span>
          <select id={`${id}-settore`} name="settore" value={select.value} onChange={(e) => select.set(e.target.value)} className={field}>
            {GUIDE_2027.map((g) => <option key={g.slug} value={g.slug}>{g.tag}</option>)}
          </select>
        </label>
      )}
      <label htmlFor={`${id}-nome`}><span className="text-xs font-semibold text-mute">Nome</span><input id={`${id}-nome`} name="nome" autoComplete="given-name" required className={field} /></label>
      <label htmlFor={`${id}-email`}><span className="text-xs font-semibold text-mute">Email di lavoro</span><input id={`${id}-email`} name="email" type="email" autoComplete="email" required className={field} /></label>
      <label htmlFor={`${id}-azienda`} className="sm:col-span-2"><span className="text-xs font-semibold text-mute">Negozio o azienda (facoltativo)</span><input id={`${id}-azienda`} name="azienda" autoComplete="organization" className={field} /></label>
      <label htmlFor={`${id}-guida`} className="sm:col-span-2"><span className="text-xs font-semibold text-mute">Guida richiesta{piano ? ' e il tuo piano' : ''}</span>
        <textarea id={`${id}-guida`} name="risultato_tool" readOnly rows={piano ? 3 : 1} value={`Guida ${nomeSettore(scelta)} 2027${piano ? `\n${piano}` : ''}`} className="mt-1.5 w-full resize-none rounded-2xl bg-ink px-4 py-3 text-xs leading-relaxed text-white/85 outline-none" />
      </label>
      <label className="flex items-start gap-2 text-xs text-mute sm:col-span-2"><input type="checkbox" name="consenso_marketing" value="Sì" className="mt-0.5 h-4 w-4 accent-[#ff1f8f]" /> Voglio ricevere le prossime guide e le date da non perdere (facoltativo)</label>
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,31,143,0.55)] sm:col-span-2"><Download className="h-4 w-4" /> Scarica la guida gratis</button>
      <p className="text-[11px] leading-relaxed text-mute sm:col-span-2">Usiamo i tuoi dati per inviarti la guida e, solo se lo scegli, le prossime. <a href="/privacy-policy/" className="underline">Informativa privacy</a></p>
    </form>
  );
}

/* ─── Gioco: «costruisci il tuo piano» + modulo ─────────────────── */
function PianoEModulo({ g }: { g: Guida }) {
  const oggi = useOggi();
  const [scelti, setScelti] = useState<string[]>([]);
  const ordinate = useMemo(() => [...g.stagioni].sort((a, b) => a.da.localeCompare(b.da)), [g]);
  const lista = ordinate.filter((s) => scelti.includes(s.nome));
  const piano = lista.map((s) => `${s.nome}: pronto dal ${data(s.da)}, picco il ${data(s.picco)}`).join('\n');
  const toggle = (n: string) => setScelti((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));
  const passi = [scelti.length > 0, false];
  return (
    <Section tone="paper" id="scarica">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <SectionHeader align="left" eyebrow="Il tuo piano 2027" title={'Scegli i tuoi temi,\n*ricevi la guida*'} lead={`Tocca i temi che vendi: vedi subito da quando prepararti. Poi scarica la guida completa con tutto il calendario ${g.del_}.`} />
            <ol className="mt-6 flex gap-2 text-xs font-semibold">
              {['Scegli i temi', 'Scarica la guida'].map((p, i) => (
                <li key={p} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${passi[i] ? 'bg-acid text-ink' : 'bg-white text-mute ring-1 ring-line'}`}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">{i + 1}</span>{p}
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Temi della guida">
              {ordinate.map((s) => {
                const on = scelti.includes(s.nome);
                return (
                  <button key={s.nome} type="button" aria-pressed={on} onClick={() => toggle(s.nome)} data-track="guida_tema_click" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${on ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink'}`}>
                    {on ? '✓ ' : '+ '}{s.nome}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 rounded-[24px] bg-white p-5 ring-1 ring-line">
              {lista.length === 0 ? (
                <p className="text-sm text-mute">Nessun tema scelto: tocca qui sopra quelli che ti interessano.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {lista.map((s) => (
                    <li key={s.nome} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <span><b>{s.nome}</b><span className="block text-mute">pronto dal {data(s.da)} · picco il {data(s.picco)}</span></span>
                      {oggi && <span className="flex-none rounded-full bg-acid px-2.5 py-1 text-[11px] font-bold text-ink">{mancano(oggi, s.da) > 0 ? tra(mancano(oggi, s.da)) : `picco ${tra(mancano(oggi, s.picco))}`}</span>}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-mute">{scelti.length} di {ordinate.length} temi nel tuo piano</p>
            </div>
          </div>
          <ModuloGuida slug={g.slug} piano={piano} titolo={`Calendario marketing ${g.categoria.toLowerCase()} 2027`} />
        </div>
      </Container>
    </Section>
  );
}

/* ─── Trimestre per trimestre: cosa fare in negozio, online, con i creator ─ */
function Trimestri({ g }: { g: Guida }) {
  const per = Object.fromEntries(g.stagioni.map((s) => [s.nome, s]));
  const lab = { negozio: g.etichette.negozio ?? 'In negozio', online: 'Online', creator: 'Con i creator' };
  const icone = { negozio: Store, online: MousePointerClick, creator: Users };
  return (
    <Section tone="white" id="trimestri">
      <Container>
        <SectionHeader eyebrow="Trimestre per trimestre" title={'Cosa fare,\n*e quando farlo*'} lead="Per ogni tema tre mosse pronte: nel punto vendita, sui tuoi canali e con i creator della tua zona." />
        <div className={`${GAP.header} space-y-10`}>
          {g.trimestri.map((t, k) => (
            <motion.div key={t.titolo} {...reveal(k)}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className={TYPE.h3}>{t.titolo}</h3>
                <span className="text-sm font-semibold text-brand-ink">{t.sotto}</span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {t.temi.filter((n) => per[n]).map((n) => {
                  const s = per[n];
                  return (
                    <article key={n} className="rounded-[24px] bg-paper p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-heading text-xl font-semibold tracking-tight">{n}</h4>
                        <span className="flex-none rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-line">sale {s.sale}</span>
                      </div>
                      <p className="mt-1 text-sm text-mute">Pronto dal <b className="text-ink">{data(s.da)}</b> · picco il <b className="text-ink">{data(s.picco)}</b></p>
                      <dl className="mt-4 space-y-3 text-[15px] leading-relaxed">
                        {(['negozio', 'online', 'creator'] as const).map((c) => {
                          const I = icone[c];
                          return (
                            <div key={c} className="flex gap-3">
                              <dt className="sr-only">{lab[c]}</dt>
                              <span className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl ${c === 'negozio' ? 'bg-acid text-ink' : c === 'online' ? 'bg-brand text-white' : 'bg-ink text-white'}`}><I className="h-4 w-4" /></span>
                              <dd><span className="font-semibold">{lab[c]}:</span> {s[c]}</dd>
                            </div>
                          );
                        })}
                      </dl>
                    </article>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Ricorrenze + tendenze ─────────────────────────────────────── */
function Ricorrenze({ g }: { g: Guida }) {
  const lista = [...g.ricorrenze].sort((a, b) => a.data.localeCompare(b.data));
  return (
    <Section tone="paper" id="ricorrenze">
      <Container>
        <SectionHeader eyebrow="Ricorrenze 2027" title={'Le date\n*che contano*'} lead={`Le feste e le occasioni dell’anno, con il giorno della settimana e un’idea pronta per chi lavora nel settore ${nomeSettore(g.slug).toLowerCase()}.`} />
        <div className={`${GAP.header} grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3`}>
          {lista.map((r, i) => (
            <motion.div key={r.nome} {...reveal(i % 3)} className="flex gap-4 rounded-[22px] bg-white p-5 ring-1 ring-line">
              <span className="flex h-14 w-14 flex-none flex-col items-center justify-center rounded-2xl bg-ink text-white">
                <span className="font-heading text-xl font-semibold leading-none">{dt(r.data).getUTCDate()}</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase text-acid">{MESI_BREVI[dt(r.data).getUTCMonth()]}</span>
              </span>
              <span>
                <span className="block font-semibold">{r.nome}</span>
                <span className="block text-xs text-mute">{data(r.data, true)}</span>
                <span className="mt-1 block text-sm leading-relaxed">{r.idea}</span>
              </span>
            </motion.div>
          ))}
        </div>
        {g.cresce.length > 0 && (
          <div className="mt-12 rounded-[28px] bg-ink p-6 text-white sm:p-8">
            <p className="flex items-center gap-2 font-heading text-xl font-semibold"><TrendingUp className="h-5 w-5 text-acid" /> Cosa cresce</p>
            <p className="mt-1 text-sm text-white/65">Temi cresciuti più della media di Wikipedia negli ultimi dodici mesi, rispetto ai dodici precedenti.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.cresce.map(([n, v]) => <li key={n} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">{n} <span className="ml-1 text-acid">{v}</span></li>)}
            </ul>
          </div>
        )}
        <p className="mt-6 text-center text-sm text-mute">Festività, ponti e giornate mondiali di tutto l’anno: <a href={`#${HUB_2027}`} className="font-semibold text-ink underline decoration-brand underline-offset-4">calendario marketing 2027</a>.</p>
      </Container>
    </Section>
  );
}

/* ─── Sfoglia la guida ──────────────────────────────────────────── */
function Sfoglia({ g }: { g: Guida }) {
  const guida = GUIDE_2027.find((x) => x.slug === g.slug)!;
  return (
    <Section tone="white" id="anteprima">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader align="left" eyebrow="Dentro la guida" title={`Sfoglia\n*${pagine(g.slug)} pagine in formato rivista*`} lead="L’inchiesta sulle stagioni, i capitoli trimestre per trimestre, le ricorrenze, le tendenze e una checklist mese per mese da appendere dove lavori." />
            <ul className="mt-6 grid gap-2 text-[15px]">
              {['Le stagioni con le date esatte', 'Tre mosse per ogni tema: negozio, online, creator', 'Ricorrenze e tendenze dell’anno', 'Checklist mese per mese'].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand" />{t}</li>
              ))}
            </ul>
            <div className="mt-8"><Button href="#scarica" arrow>Scarica la guida gratis</Button></div>
          </div>
          <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
            <Copertina g={guida} className="w-full" />
            {[2, 3].map((n) => (
              <motion.img key={n} {...reveal(n)} src={asset(`guida27-${g.slug}-p${n}.webp`)} alt={`Pagina ${n} della guida ${nomeSettore(g.slug)} 2027`} width={520} height={735} loading="lazy" decoding="async" className="block w-full rounded-md bg-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.4)] ring-1 ring-line" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Pagina della guida di settore ─────────────────────────────── */
function PaginaGuida({ slug }: { slug: string }) {
  const g = D.guide[slug];
  const cat = g.categoria;
  const ordinate = [...g.stagioni].sort((a, b) => a.da.localeCompare(b.da));
  const primi = ordinate.slice(0, 3).map((s) => `${s.nome.toLowerCase()} dal ${data(s.da)}`);
  const [link, nomeLink] = g.creator_link;
  return (
    <>
      <Hero
        crumbs={[{ label: 'Guide e risorse', href: '#/guide-e-risorse/' }, { label: 'Calendario marketing 2027', href: `#${HUB_2027}` }, { label: cat }]}
        eyebrow={`Guida ${cat} 2027 · Influencee Trends`}
        title={`Calendario marketing\n*${cat.toLowerCase()} 2027*`}
        lead={g.intro}
        cta="Scarica la guida gratis"
        cta2={['Vedi le date', '#stagioni']}
        chips={[`${g.stagioni.length} stagioni con le date`, `${g.ricorrenze.length} ricorrenze`, `PDF di ${pagine(slug)} pagine`, `Aggiornata al ${g.aggiornato}`]}
        visual={<CopertinaProssima g={g} />}
      />
      <AnswerBox
        q={`Quando promuovere cosa nel settore ${nomeSettore(slug).toLowerCase()} nel 2027?`}
        a={`Il momento giusto è quando l’interesse comincia a salire, non al picco: nel 2027 ${primi.join(', ')}. Per ogni tema la guida indica il giorno da cui farsi trovare pronti e il giorno del picco, con dati sulle visite alla Wikipedia italiana dal 2016.`}
        points={ordinate.slice(0, 4).map((s) => `${s.nome}: dal ${data(s.da)}`)}
      />
      <PianoEModulo g={g} />
      <Section tone="white" id="stagioni">
        <Container>
          <SectionHeader eyebrow={`${g.stagioni.length} stagioni`} title={`Le stagioni ${g.del_}\n*nel 2027*`} lead="«Inizia a salire» è il giorno da cui conviene essere pronti: vetrina, offerta, contenuti. Il picco arriva dopo, quando molti stanno già scegliendo da chi comprare." />
          <div className={GAP.header}><LineaTempo g={g} /></div>
          <TabellaStagioni g={g} />
        </Container>
      </Section>
      <Trimestri g={g} />
      <Section tone="brand" pad="none" className="py-12 sm:py-14">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <p className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">Tutte le stagioni {g.del_} in un PDF da appendere in negozio.</p>
            <Button href="#scarica" arrow>Scarica la guida gratis</Button>
          </div>
        </Container>
      </Section>
      <Ricorrenze g={g} />
      <Sfoglia g={g} />
      <Section tone="ink">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>Influencee</Eyebrow>
              <Heading text={'Il passaparola\n*si prepara in anticipo*'} className="mt-5" />
              <Lead className="mt-5 max-w-xl">Un contenuto di un creator della tua zona, uscito quando l’interesse comincia a salire, è online proprio quando le persone cercano. Su Influencee trovi creator italiani per categoria e città e gestisci la campagna dal brief ai click.</Lead>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button href={`#${link}`} arrow>Trova i {nomeLink}</Button>
              <Button href="#/influencer-marketing-locale/" variant="secondary">Influencer marketing locale</Button>
            </div>
          </div>
        </Container>
      </Section>
      <FaqSeo items={faqSito(g.faq)} />
      <GuideScaffale escludi={slug} eyebrow="Altre guide 2027" title={'Le guide\n*degli altri settori*'} lead="Sei guide gratuite, una per settore, con le stagioni e le date del 2027." />
      <div className="bg-white pb-10"><Container><p className="text-center text-xs text-mute">Metodo: {g.metodo} Aggiornato al {g.aggiornato}. Foto di copertina: {g.foto_copertina[0]}, {g.foto_copertina[1]}, da Wikimedia Commons.</p></Container></div>
      <CtaDual />
    </>
  );
}

/* ─── Pagina principale: /calendario-marketing-2027/ ─────────────── */
function TrovaGuida() {
  const oggi = useOggi();
  const [s, set] = useState('food');
  const g = D.guide[s];
  const prossime = [...g.stagioni].sort((a, b) => a.da.localeCompare(b.da)).filter((x) => !oggi || mancano(oggi, x.picco) >= 0).slice(0, 3);
  return (
    <Section tone="paper" id="trova">
      <Container>
        <SectionHeader eyebrow="Trova la tua guida" title={'Che attività hai?\n*Ecco le tue prossime date*'} lead="Scegli il settore: vedi le prossime tre stagioni da preparare e apri la guida completa." />
        <div className={`${GAP.header} mx-auto max-w-4xl`}>
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Settore">
            {GUIDE_2027.map((x) => (
              <button key={x.slug} type="button" role="tab" aria-selected={s === x.slug} onClick={() => set(x.slug)} data-track="guida_settore_click" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${s === x.slug ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink'}`}>
                {x.tag}
              </button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {prossime.map((x, i) => (
              <motion.div key={`${s}-${x.nome}`} initial={false} className={`rounded-[24px] p-5 ${['bg-brand text-white', 'bg-acid text-ink', 'bg-ink text-white'][i]}`}>
                <p className="text-xs font-bold uppercase tracking-wide opacity-75">Stagione {i + 1}</p>
                <p className="mt-2 font-heading text-2xl font-semibold leading-tight">{x.nome}</p>
                <p className="mt-2 text-sm opacity-80">Pronto dal {data(x.da)}<br />picco il {data(x.picco)}</p>
                {oggi && <p className="mt-3 inline-flex rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">{mancano(oggi, x.da) > 0 ? tra(mancano(oggi, x.da)) : `picco ${tra(mancano(oggi, x.picco))}`}</p>}
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href={`#${HUB_2027}${s}/`} arrow>Apri la guida {nomeSettore(s)} 2027</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function TabellaDate({ righe, cols, caption }: { righe: React.ReactNode[][]; cols: string[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-[28px] bg-white ring-1 ring-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-ink text-white"><tr>{cols.map((c) => <th key={c} scope="col" className="px-4 py-3 font-semibold">{c}</th>)}</tr></thead>
        <tbody className="divide-y divide-line">
          {righe.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="whitespace-nowrap px-4 py-3 font-semibold">{c}</th> : <td key={j} className={`px-4 py-3 ${j === r.length - 1 ? 'text-mute' : ''}`}>{c}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Giornate() {
  const [f, set] = useState<'tutte' | 'food' | 'tutti'>('tutte');
  const lista = D.giornate.filter((x) => f === 'tutte' || x.settore === f);
  return (
    <Section tone="white" id="giornate-mondiali">
      <Container>
        <SectionHeader eyebrow="Giornate mondiali 2027" title={'Giornate mondiali 2027\n*da segnare in calendario*'} lead="Una giornata mondiale è un pretesto pronto per un post, una vetrina o un’iniziativa in negozio. Qui solo quelle riconosciute da un’istituzione, con la fonte." />
        <div className={`${GAP.header} mb-5 flex flex-wrap justify-center gap-2`}>
          {([['tutte', 'Tutte'], ['tutti', 'Per tutti i settori'], ['food', 'Food']] as const).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={f === k} onClick={() => set(k)} className={`rounded-full px-4 py-2 text-sm font-semibold ${f === k ? 'bg-ink text-white' : 'bg-paper text-ink'}`}>{l}</button>
          ))}
        </div>
        <TabellaDate caption="Giornate mondiali e internazionali 2027 con la data e l’istituzione che le promuove" cols={['Data', 'Giornata', 'Chi la promuove']} righe={lista.map((x) => [data(x.data, true), x.nome, x.fonte])} />
        <p className="mt-4 text-xs text-mute">Fonti: elenco delle giornate internazionali delle Nazioni Unite (un.org/en/observances), Parlamento europeo, Wikipedia italiana. Giorni della settimana calcolati sul calendario 2027.</p>
      </Container>
    </Section>
  );
}

function PaginaHub() {
  const [settore, setSettore] = useState('food');
  const ventaglio = ['food', 'viaggi', 'moda-beauty'].map((s) => GUIDE_2027.find((g) => g.slug === s)!);
  return (
    <>
      <Hero
        crumbs={[{ label: 'Guide e risorse', href: '#/guide-e-risorse/' }, { label: 'Calendario marketing 2027' }]}
        eyebrow="Influencee Trends · Guide 2027"
        title={'Calendario marketing 2027:\n*festività, ponti e giornate mondiali*'}
        lead="Le date che contano nel 2027, settore per settore: quando gli italiani cominciano a cercare un prodotto, quando arriva il picco e quali ricorrenze cadono nell’anno. Sette guide gratuite in PDF."
        cta="Scarica la tua guida"
        cta2={['Trova le tue date', '#trova']}
        chips={['7 guide per settore', `${D.date_2027.length} date commerciali`, `${D.giornate.length} giornate mondiali`]}
        visual={
          <div className="relative mx-auto flex max-w-[460px] items-end justify-center pb-6">
            <div className="absolute inset-x-8 bottom-0 top-10 rounded-[40px] bg-gradient-to-br from-brand/40 via-white/5 to-acid/20 blur-2xl" />
            {ventaglio.map((g, i) => (
              <div key={g.slug} className={`w-[42%] flex-none ${i === 0 ? 'translate-y-4 -rotate-6' : i === 2 ? 'translate-y-4 rotate-6' : 'z-10 -mx-8 sm:-mx-10'}`}>
                <Copertina g={g} className="w-full" eager />
              </div>
            ))}
          </div>
        }
      />
      <AnswerBox
        q="Quali sono le date chiave del 2027 per il marketing?"
        a="Pasqua cade domenica 28 marzo, presto: colombe e uova si preparano da febbraio. Il Black Friday è venerdì 26 novembre, il Cyber Monday lunedì 29. I ponti sono pochi: il 25 aprile è domenica e il 1° maggio sabato; i weekend lunghi sono Capodanno, Ognissanti e Natale."
        points={['Pasqua: 28 marzo', 'Black Friday: 26 novembre', 'Ognissanti: lunedì 1° novembre', 'Natale: sabato 25 dicembre']}
      />
      <TrovaGuida />
      <GuideScaffale title={'Le guide gratuite\n*per settore*'} eyebrow="7 guide in PDF" lead="Stagioni con le date esatte, cosa fare in negozio, online e con i creator, ricorrenze e tendenze. Scegli la tua." />
      <Section tone="paper" id="festivita">
        <Container>
          <SectionHeader eyebrow="Festività 2027" title={'Festività e date commerciali\n*del 2027*'} lead="Il giorno della settimana cambia tutto: un 25 aprile di domenica non fa ponte, un Halloween attaccato a Ognissanti allunga il weekend." />
          <div className={GAP.header}>
            <TabellaDate caption="Festività e date commerciali 2027 con il giorno della settimana" cols={['Data', 'Ricorrenza', 'Tipo', 'Cosa cambia per chi vende']} righe={D.date_2027.map((x) => [data(x.data, true), x.nome, x.tipo, x.nota])} />
          </div>
        </Container>
      </Section>
      <Giornate />
      <Section tone="paper">
        <Container>
          <SectionHeader eyebrow="Il metodo" title={'Dati pubblici,\n*regole fisse*'} />
          <div className={`${GAP.header} grid grid-cols-1 gap-4 md:grid-cols-3`}>
            {[
              [Sparkles, 'Dati pubblici, regole fisse', 'Dieci anni di visite alla Wikipedia italiana, letti sempre allo stesso modo. Nessuna stima a occhio.'],
              [CalendarDays, 'La data giusta, non solo il mese', 'Per ogni tema: quando l’interesse comincia a salire e quando tocca il massimo.'],
              [ShoppingBag, 'Pensate per chi vende', 'Cosa fare in negozio, online e con i creator della tua città, trimestre per trimestre.'],
            ].map(([I, t, x], i) => {
              const Icon = I as typeof Sparkles;
              return (
                <motion.div key={t as string} {...reveal(i)} className="rounded-[24px] bg-white p-6 ring-1 ring-line">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${['bg-brand text-white', 'bg-acid text-ink', 'bg-ink text-white'][i]}`}><Icon className="h-5 w-5" /></span>
                  <p className="mt-5 font-heading text-xl font-semibold tracking-tight">{t as string}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">{x as string}</p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>
      <Section tone="white" id="scarica">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeader align="left" eyebrow="Scarica gratis" title={'La tua guida 2027\n*in un minuto*'} lead="Scegli il settore, lascia nome ed email e scarica il PDF. Da stampare e appendere dove lavori." />
              <div className="mt-8 w-[200px]"><Copertina g={GUIDE_2027.find((x) => x.slug === settore)!} className="w-full" /></div>
              <p className="mt-6 flex items-center gap-2 text-sm text-mute"><MapPin className="h-4 w-4 text-brand" /> Pensata per negozi, PMI e aziende italiane</p>
            </div>
            <ModuloGuida slug="hub" piano="" titolo="Calendario marketing 2027" select={{ value: settore, set: setSettore }} />
          </div>
        </Container>
      </Section>
      <FaqSeo items={faqSito(D.hub_faq)} />
      <Related
        links={[
          { label: 'Calendario editoriale', text: 'Il tool gratuito per pianificare i post', href: '#/social-media-tool/calendario-editoriale/' },
          { label: 'Influencer marketing locale', text: 'Creator della tua città', href: '#/influencer-marketing-locale/' },
          { label: 'Guide e risorse', text: 'Tutte le guide e i tool gratuiti', href: '#/guide-e-risorse/' },
          { label: 'Preventivo campagna', text: 'La campagna gestita dal team', href: '#/preventivo-campagne/' },
        ]}
      />
      <CtaDual />
    </>
  );
}

/* ─── Registro delle pagine ─────────────────────────────────────── */
const SEO: Record<string, { titles: string[]; description: string; kw: string }> = {
  hub: { titles: ['Calendario marketing 2027 e giornate mondiali', 'Calendario marketing 2027'], description: "Le date del 2027 per negozi e PMI: festività, ponti, giornate mondiali e le guide gratuite per settore con le stagioni di vendita.", kw: 'calendario marketing 2027' },
  'food': { titles: ["Calendario marketing food 2027 + guida PDF", "Calendario marketing food 2027"], description: "Quando promuovere panettone, colomba, gelato e altri 13 temi nel 2027: date di inizio e picco, giornate del cibo e guida PDF gratuita.", kw: "calendario marketing food 2027" },
  'viaggi': { titles: ["Calendario marketing viaggi 2027 + guida PDF", "Calendario marketing viaggi 2027"], description: "Quando gli italiani cercano sci, mare, Ferragosto, mercatini e Capodanno nel 2027: 10 stagioni con le date e la guida PDF gratuita.", kw: "calendario marketing viaggi 2027" },
  'casa': { titles: ["Calendario marketing casa 2027 + guida PDF", "Calendario marketing casa 2027"], description: "Quando promuovere condizionatori, giardino, fotovoltaico, Halloween e Natale nel 2027: 8 stagioni con le date e la guida PDF gratuita.", kw: "calendario marketing casa 2027" },
  'famiglia': { titles: ["Calendario marketing famiglia 2027 + guida PDF", "Calendario marketing famiglia 2027"], description: "Befana, Carnevale, maturità, estate e Babbo Natale: le 7 stagioni 2027 della famiglia con le date e la guida PDF gratuita.", kw: "calendario marketing famiglia 2027" },
  'sport-benessere': { titles: ["Calendario marketing sport e benessere 2027 + guida PDF", "Calendario marketing sport e benessere 2027"], description: "Tennis, Giro d'Italia, corsa, piscina, allergie e sauna: le stagioni 2027 di sport e benessere con le date e la guida PDF gratuita.", kw: "calendario marketing sport e benessere 2027" },
  'moda-beauty': { titles: ["Calendario marketing moda e beauty 2027 + guida PDF", "Calendario marketing moda e beauty 2027"], description: "Costumi, abbronzatura, Black Friday e le tendenze che crescono: il calendario 2027 di moda e beauty con la guida PDF gratuita.", kw: "calendario marketing moda e beauty 2027" },
  'tech-mobilita': { titles: ["Calendario marketing tech e mobilità 2027 + guida PDF", "Calendario marketing tech e mobilità 2027"], description: "Black Friday, Cyber Monday, gomme invernali e bollo: le date 2027 di tecnologia e mobilità con la guida PDF gratuita.", kw: "calendario marketing tech e mobilità 2027" },
};

export const CALENDARIO_2027_PAGES: ExPage[] = [
  {
    path: HUB_2027,
    ready: true,
    titles: SEO.hub.titles,
    meta: { label: 'Calendario marketing 2027', type: 'page', kw: SEO.hub.kw, description: SEO.hub.description, crumbs: [{ label: 'Guide e risorse', href: '#/guide-e-risorse/' }, { label: 'Calendario marketing 2027' }], faq: faqSito(D.hub_faq) },
    el: () => <PaginaHub />,
  },
  ...GUIDE_2027.map((x) => {
    const g = D.guide[x.slug];
    const t = `Calendario marketing ${g.categoria.toLowerCase()} 2027`;
    const s = SEO[x.slug] ?? { titles: [`${t} + guida PDF`, t], description: x.testo, kw: t.toLowerCase() };
    return {
      path: `${HUB_2027}${x.slug}/`,
      ready: true,
      titles: s.titles,
      meta: { label: t, type: 'page' as const, kw: s.kw, description: s.description, crumbs: [{ label: 'Guide e risorse', href: '#/guide-e-risorse/' }, { label: 'Calendario marketing 2027', href: `#${HUB_2027}` }, { label: g.categoria }], faq: faqSito(g.faq) },
      el: () => <PaginaGuida slug={x.slug} />,
    };
  }),
];
