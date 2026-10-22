import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { track } from './analytics';
import { Container, GAP, Section, SectionHeader, type Tone } from '../ds';
import { CATEGORIES, REGIONS, WHATSAPP } from './data';
import { ENV } from './env';

/* ════════════════════════════════════════════════════════════════════
   PROFILI DEI CREATOR (dal sito WordPress, tipo di contenuto "creator")
   Sulle pagine città, regione, categoria, hub e home le ricerche sono
   di tipo "lista" ("influencer napoletani", "creator italiani"): servono
   i profili veri. Li inserisce il plugin WordPress nell'HTML (segnaposto
   <!--INFLUENCEE_CREATORS:filtro-->) con il dato strutturato ItemList.
   Nell'anteprima v2 si vedono solo schede vuote: nessun profilo inventato.
   Mostriamo nome, handle, città, categoria e foto: mai email o telefoni
   presenti nelle bio.
   ════════════════════════════════════════════════════════════════════ */

export interface CreatorFilter {
  city?: string; // slug tassonomia creator_city
  region?: string; // slug creator_region (o regione per riempire la città)
  cat?: string[]; // slug creator_category
  limit?: number;
  exclude?: number | string; // id del profilo da non ripetere (pagina profilo)
}

export const creatorKey = (f: CreatorFilter) =>
  [f.city && `city=${f.city}`, f.region && `region=${f.region}`, f.cat?.length && `cat=${f.cat.join(',')}`, `limit=${f.limit ?? 12}`, f.exclude && `exclude=${f.exclude}`].filter(Boolean).join('&');

export function CreatorList({ title, lead, filter, tone = 'white' }: { title: string; lead?: string; filter: CreatorFilter; tone?: Tone }) {
  const key = creatorKey(filter);
  const live = typeof window !== 'undefined' ? window.INFLUENCEE_TOOLS?.creators?.[key] : undefined;
  let body: React.ReactNode;
  if (ENV.embed && ENV.ssr) body = <div dangerouslySetInnerHTML={{ __html: `<!--INFLUENCEE_CREATORS:${key}-->` }} />;
  else if (ENV.embed && live !== undefined) body = <div dangerouslySetInnerHTML={{ __html: live }} />;
  else
    body = (
      // anteprima v2: stesse classi delle card generate da WordPress (così il CSS le contiene)
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: Math.min(filter.limit ?? 12, 8) }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
            <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-paper font-heading text-sm font-semibold text-mute">··</span>
            <span className="min-w-0">
              <span className="block h-3 w-24 rounded bg-paper" />
              <span className="mt-2 block h-2.5 w-16 rounded bg-paper" />
            </span>
          </div>
        ))}
        <p className="col-span-full text-xs text-mute">Anteprima: su influencee.it qui compaiono i profili dei creator.</p>
      </div>
    );
  return (
    <Section tone={tone} id="creator">
      <Container>
        <SectionHeader align="left" eyebrow="Creator" title={title} lead={lead} />
        <div className={GAP.header}>{body}</div>
        <p className="mt-6 text-xs text-mute">
          Sei uno di questi creator? Puoi chiedere di modificare o togliere il tuo profilo:{' '}
          <a href={WHATSAPP.href} className="font-semibold text-brand-ink underline">
            scrivici
          </a>
          .
        </p>
      </Container>
    </Section>
  );
}

/* Classi usate dalle card generate in PHP (wp-plugin/influencee-tools): elencate qui perché Tailwind le includa nel CSS. */
export const CREATOR_CARD_CLASSES =
  'group flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand h-12 w-12 flex-none overflow-hidden rounded-full bg-acid object-cover font-heading text-sm font-semibold min-w-0 block truncate text-[15px] text-xs text-mute text-brand-ink grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 col-span-full p-8 text-center';

/* ════════════════════════════════════════════════════════════════════
   ELENCO COMPLETO CON FILTRI (pagina /influencer-italiani/)
   HTML per Google: le prime 24 card generate da WordPress (stesso segnaposto
   di CreatorList). Nel browser: tutti i profili pubblicati, con ricerca,
   categoria, regione e fascia di follower. Dati da window.INFLUENCEE_TOOLS.directory.
   ════════════════════════════════════════════════════════════════════ */

/** Un profilo dell'elenco (chiavi corte: arrivano tutti insieme nella pagina). */
export interface DirItem {
  n: string; // nome
  u: string; // url del profilo
  i: string; // foto
  h: string; // handle instagram
  f: number; // follower
  k: string[]; // termini categoria (creator_category)
  r: string; // regione (slug)
  c: string; // città (nome)
}

const DIR_TIERS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'nano', label: 'Nano', min: 0, max: 10000 },
  { id: 'micro', label: 'Micro', min: 10000, max: 50000 },
  { id: 'mid', label: 'Mid', min: 50000, max: 250000 },
  { id: 'macro', label: 'Macro', min: 250000, max: 1000000 },
  { id: 'mega', label: 'Mega', min: 1000000, max: Infinity },
];
const PAGE = 24;
const shortN = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace('.0', '').replace('.', ',')}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace('.0', '').replace('.', ',')}K` : String(n));
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function CreatorDirectory({ title, lead }: { title: string; lead: string }) {
  const all = typeof window !== 'undefined' ? window.INFLUENCEE_TOOLS?.directory : undefined;
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [reg, setReg] = useState('');
  const [tier, setTier] = useState('');
  const [shown, setShown] = useState(PAGE);
  const filterTimer = useRef<number>();

  const list = useMemo(() => {
    if (!all) return [];
    const terms = cat ? CATEGORIES.find((c) => c.slug === cat)?.wp ?? [] : [];
    const t = DIR_TIERS.find((x) => x.id === tier);
    const nq = norm(q.trim().replace(/^@/, ''));
    return all.filter((p) => (!terms.length || p.k.some((k) => terms.includes(k))) && (!reg || p.r === reg) && (!t || (p.f >= t.min && p.f < t.max)) && (!nq || norm(`${p.n} ${p.h} ${p.c}`).includes(nq)));
  }, [all, q, cat, reg, tier]);

  // un evento per combinazione di filtri, non uno per tasto
  useEffect(() => {
    if (!all || (!q && !cat && !reg && !tier)) return;
    window.clearTimeout(filterTimer.current);
    filterTimer.current = window.setTimeout(() => track('tool_filter', { tool_name: 'elenco_creator', filter: [cat && `categoria:${cat}`, reg && `regione:${reg}`, tier && `fascia:${tier}`, q && 'ricerca'].filter(Boolean).join('|'), results: list.length }), 900);
  }, [all, q, cat, reg, tier, list.length]);
  useEffect(() => setShown(PAGE), [q, cat, reg, tier]);

  // HTML per Google (build) o anteprima senza dati: le card di CreatorList
  if (!ENV.embed || ENV.ssr || !all) return <CreatorList title={title} lead={lead} filter={{ limit: PAGE }} />;

  const sel = 'h-11 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-brand';
  return (
    <Section tone="white" id="creator">
      <Container>
        <SectionHeader align="left" eyebrow="Creator" title={title} lead={lead} />
        <div className={`${GAP.header} grid grid-cols-1 gap-3 rounded-3xl bg-paper p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]`}>
          <label className="relative block">
            <span className="sr-only">Cerca per nome, handle o città</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca nome, @handle o città" className={`${sel} pl-9`} data-track-ignore />
          </label>
          <label className="block">
            <span className="sr-only">Categoria</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className={sel} data-track-ignore>
              <option value="">Tutte le categorie</option>
              {CATEGORIES.filter((c) => c.wp.length).map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Regione</span>
            <select value={reg} onChange={(e) => setReg(e.target.value)} className={sel} data-track-ignore>
              <option value="">Tutte le regioni</option>
              {REGIONS.map((r) => (
                <option key={r.slug} value={r.slug}>{r.name}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3" role="group" aria-label="Fascia di follower">
            {[{ id: '', label: 'Tutte le fasce' }, ...DIR_TIERS].map((t) => (
              <button key={t.id} type="button" aria-pressed={tier === t.id} onClick={() => setTier(t.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${tier === t.id ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line'}`} data-track-ignore>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-sm text-mute" aria-live="polite">
          <b className="text-ink">{list.length.toLocaleString('it-IT')}</b> creator {list.length === all.length ? 'nel sito' : list.length === 1 ? 'trovato' : 'trovati'}
        </p>
        {list.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.slice(0, shown).map((p) => (
              <a key={p.u} href={p.u} className="group flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand">
                {p.i ? <img src={p.i} alt={p.n} loading="lazy" width={48} height={48} className="h-12 w-12 flex-none overflow-hidden rounded-full bg-acid-soft object-cover text-[0px]" /> : <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-acid font-heading text-sm font-semibold">{p.n.slice(0, 2).toUpperCase()}</span>}
                <span className="min-w-0">
                  <span className="block truncate font-heading text-[15px] font-semibold">{p.n}</span>
                  <span className="block truncate text-xs text-mute">{[p.f ? `${shortN(p.f)} follower` : '', p.c || (p.h ? `@${p.h}` : '')].filter(Boolean).join(' · ')}</span>
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center ring-1 ring-line">
            <p className="font-heading text-lg font-semibold">Nessun creator con questi filtri</p>
            <p className="mt-2 text-sm text-mute">Prova a togliere un filtro, oppure chiedici una selezione: cerchiamo noi i creator adatti.</p>
            <a href="#lead-creator_hub" className="mt-4 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Chiedi una selezione gratuita</a>
          </div>
        )}
        {shown < list.length && (
          <div className="mt-6 text-center">
            <button type="button" onClick={() => setShown((s) => s + PAGE)} className="rounded-full bg-white px-6 py-3 text-sm font-semibold ring-1 ring-line hover:ring-ink">
              Mostra altri {Math.min(PAGE, list.length - shown)} creator
            </button>
          </div>
        )}
        <p className="mt-6 text-xs text-mute">
          Sei uno di questi creator? Puoi chiedere di modificare o togliere il tuo profilo:{' '}
          <a href={WHATSAPP.href} className="font-semibold text-brand-ink underline">scrivici</a>.
        </p>
      </Container>
    </Section>
  );
}
