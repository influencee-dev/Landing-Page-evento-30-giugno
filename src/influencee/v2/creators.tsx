import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { track } from './analytics';
import { Container, GAP, Pill, Section, SectionHeader, type Tone } from '../ds';
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: Math.min(filter.limit ?? 12, 8) }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
            <div className="h-[84px] bg-[linear-gradient(135deg,#E6007E_0%,#A3005E_55%,#0A0A0A_100%)] opacity-30" />
            <div className="relative z-[2] -mt-11 flex justify-center"><span className="h-[88px] w-[88px] rounded-full border-4 border-white bg-paper" /></div>
            <div className="mx-auto mt-3 h-3 w-24 rounded bg-paper" />
            <div className="grid grid-cols-3 gap-2 px-3 py-3">
              <span className="h-3 rounded bg-line/70" />
              <span className="h-3 rounded bg-line/70" />
              <span className="h-3 rounded bg-line/70" />
            </div>
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
  'group block overflow-hidden rounded-3xl bg-white ring-1 ring-line transition hover:-translate-y-1 hover:shadow-card relative h-[84px] bg-[linear-gradient(135deg,#E6007E_0%,#A3005E_55%,#0A0A0A_100%)] absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink z-[2] -mt-11 flex justify-center h-[88px] w-[88px] border-4 border-white object-cover text-[0px] shadow-[0_8px_22px_-10px_rgba(10,10,10,.45)] duration-500 group-hover:scale-105 items-center bg-acid font-heading text-2xl px-4 pb-3.5 pt-3 text-center text-mute grid grid-cols-3 divide-x divide-line border-t border-line px-2 py-3 min-w-0 px-1 text-[11px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 col-span-full p-8 text-lg mt-2 text-sm rounded-2xl';

/* ════════════════════════════════════════════════════════════════════
   SCHEDA CREATOR (card) ed ELENCO CON FILTRI — design del sito
   (site/creators.tsx: foto grande 4:5, categoria in alto, nome e handle
   sulla foto, tre numeri sotto). Solo dati veri: follower, fascia, città.
   Le stesse classi sono usate dalle card generate in PHP dal plugin.
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

export const DIR_TIERS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'nano', label: 'Nano', min: 0, max: 10000 },
  { id: 'micro', label: 'Micro', min: 10000, max: 50000 },
  { id: 'mid', label: 'Mid', min: 50000, max: 250000 },
  { id: 'macro', label: 'Macro', min: 250000, max: 1000000 },
  { id: 'mega', label: 'Mega', min: 1000000, max: Infinity },
];
const PAGE = 24;
const shortN = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace('.0', '').replace('.', ',')}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace('.0', '').replace('.', ',')}K` : String(n));
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const catOf = (k: string[]) => CATEGORIES.find((c) => c.wp.some((t) => k.includes(t)))?.name ?? 'Lifestyle';
const tierOfN = (f: number) => (f ? DIR_TIERS.find((t) => f >= t.min && f < t.max)?.label ?? '' : '');
export const CREATOR_GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4';

/** Scheda creator (design del sito: fascia colorata, foto tonda sovrapposta, tre numeri sotto). */
export function CreatorTile({ p }: { p: DirItem; key?: React.Key }) {
  const stats: [string, string][] = [
    [p.f ? shortN(p.f) : '—', 'follower'],
    [tierOfN(p.f) || '—', 'fascia'],
    [p.c || 'Italia', 'città'],
  ];
  return (
    <a href={p.u} className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-line transition hover:-translate-y-1 hover:shadow-card">
      <span className="relative block h-[84px] bg-[linear-gradient(135deg,#E6007E_0%,#A3005E_55%,#0A0A0A_100%)]">
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink">{catOf(p.k)}</span>
      </span>
      <span className="relative z-[2] -mt-11 flex justify-center">
        {p.i ? (
          <img src={p.i} alt={p.n} loading="lazy" width={88} height={88} className="h-[88px] w-[88px] rounded-full border-4 border-white bg-white object-cover text-[0px] shadow-[0_8px_22px_-10px_rgba(10,10,10,.45)] transition duration-500 group-hover:scale-105" />
        ) : (
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-4 border-white bg-acid font-heading text-2xl font-semibold text-ink shadow-[0_8px_22px_-10px_rgba(10,10,10,.45)]">{p.n.slice(0, 2).toUpperCase()}</span>
        )}
      </span>
      <span className="block px-4 pb-3.5 pt-3 text-center">
        <span className="block truncate font-heading font-semibold text-ink">{p.n}</span>
        <span className="block truncate text-xs text-mute">{p.h ? `@${p.h}` : ' '}</span>
      </span>
      <span className="grid grid-cols-3 divide-x divide-line border-t border-line px-2 py-3 text-center">
        {stats.map(([v, l]) => (
          <span key={l} className="block min-w-0">
            <span className="block truncate px-1 font-heading font-semibold">{v}</span>
            <span className="block text-[11px] text-mute">{l}</span>
          </span>
        ))}
      </span>
    </a>
  );
}

function FilterSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.14em] text-mute">
      {label}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} data-track-ignore className="mt-2 h-11 w-full rounded-full bg-white px-4 text-sm font-medium normal-case tracking-normal text-ink outline-none ring-1 ring-line focus:ring-brand">
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const SORTS = [
  { id: 'followers', label: 'Più follower' },
  { id: 'name', label: 'Nome (A-Z)' },
];

export function CreatorDirectory({ title, lead }: { title: string; lead: string }) {
  const all = typeof window !== 'undefined' ? window.INFLUENCEE_TOOLS?.directory : undefined;
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [reg, setReg] = useState('');
  const [city, setCity] = useState('');
  const [tier, setTier] = useState('');
  const [sort, setSort] = useState('followers');
  const [showFilters, setShowFilters] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const filterTimer = useRef<number>();

  const list = useMemo(() => {
    if (!all) return [];
    const terms = cat ? CATEGORIES.find((c) => c.slug === cat)?.wp ?? [] : [];
    const t = DIR_TIERS.find((x) => x.id === tier);
    const nq = norm(q.trim().replace(/^@/, ''));
    return all
      .filter((p) => (!terms.length || p.k.some((k) => terms.includes(k))) && (!reg || p.r === reg) && (!city || p.c === city) && (!t || (p.f >= t.min && p.f < t.max)) && (!nq || norm(`${p.n} ${p.h} ${p.c}`).includes(nq)))
      .sort((a, b) => (sort === 'name' ? a.n.localeCompare(b.n, 'it') : b.f - a.f));
  }, [all, q, cat, reg, city, tier, sort]);

  // un evento per combinazione di filtri, non uno per tasto
  useEffect(() => {
    if (!all || (!q && !cat && !reg && !city && !tier)) return;
    window.clearTimeout(filterTimer.current);
    filterTimer.current = window.setTimeout(() => track('tool_filter', { tool_name: 'elenco_creator', filter: [cat && `categoria:${cat}`, reg && `regione:${reg}`, tier && `fascia:${tier}`, city && `citta:${city}`, q && 'ricerca'].filter(Boolean).join('|'), results: list.length }), 900);
  }, [all, q, cat, reg, city, tier, list.length]);
  useEffect(() => setShown(PAGE), [q, cat, reg, city, tier, sort]);

  // HTML per Google (build) o anteprima senza dati: le card generate da WordPress
  if (!ENV.embed || ENV.ssr || !all) return <CreatorList title={title} lead={lead} filter={{ limit: PAGE }} />;

  const reset = () => {
    setQ('');
    setCat('');
    setReg('');
    setCity('');
    setTier('');
  };
  const cats = CATEGORIES.filter((c) => c.wp.length && all.some((p) => p.k.some((k) => c.wp.includes(k))));
  const cities = [...new Set(all.map((p) => p.c).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'it'));
  return (
    <Section tone="white" id="creator">
      <Container>
        <SectionHeader align="left" eyebrow="Creator" title={title} lead={lead} />
        <div className={`${GAP.header} flex flex-wrap items-center gap-3`}>
          <label htmlFor="creator-search" className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-paper px-5 ring-1 ring-line focus-within:ring-brand">
            <Search className="h-4 w-4 text-mute" />
            <input id="creator-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca per nome, handle, città…" data-track-ignore className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-mute" />
          </label>
          <button type="button" onClick={() => setShowFilters((v) => !v)} data-track-ignore className="flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filtri
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[{ slug: '', name: 'Tutte le nicchie' }, ...cats].map((c) => (
            <button key={c.slug} type="button" onClick={() => setCat(c.slug)} aria-pressed={cat === c.slug} data-track-ignore>
              <Pill active={cat === c.slug}>{c.name}</Pill>
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <aside className={`${showFilters ? 'block' : 'hidden'} space-y-5 rounded-3xl bg-paper p-5 lg:block lg:self-start`}>
            <FilterSelect id="f-tier" label="Dimensione" value={tier} onChange={setTier} options={[{ id: '', label: 'Tutte le dimensioni' }, ...DIR_TIERS.map((t) => ({ id: t.id, label: t.label + (t.id === 'nano' ? ' · fino a 10K' : t.id === 'micro' ? ' · 10–50K' : t.id === 'mid' ? ' · 50–250K' : t.id === 'macro' ? ' · 250K–1M' : ' · 1M+') }))]} />
            <FilterSelect id="f-region" label="Regione" value={reg} onChange={setReg} options={[{ id: '', label: 'Tutte le regioni' }, ...REGIONS.filter((r) => all.some((p) => p.r === r.slug)).map((r) => ({ id: r.slug, label: r.name }))]} />
            <FilterSelect id="f-city" label="Città" value={city} onChange={setCity} options={[{ id: '', label: 'Tutte' }, ...cities.map((c) => ({ id: c, label: c }))]} />
            <FilterSelect id="f-sort" label="Ordina per" value={sort} onChange={setSort} options={SORTS} />
            <button type="button" onClick={reset} data-track-ignore className="text-sm font-semibold text-brand hover:underline">
              Azzera filtri
            </button>
          </aside>
          <div className="min-w-0">
            <p className="text-sm text-mute" aria-live="polite">
              <b className="text-ink">{list.length.toLocaleString('it-IT')}</b> creator {list.length === 1 ? 'trovato' : 'trovati'} · profili reali da influencee.it
            </p>
            {list.length ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {list.slice(0, shown).map((p) => (
                  <CreatorTile key={p.u} p={p} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-3xl bg-paper p-10 text-center">
                <p className="font-heading text-lg font-semibold">Nessun creator con questi filtri</p>
                <p className="mt-1 text-sm text-mute">Prova a togliere un filtro, oppure chiedici una selezione: cerchiamo noi i creator adatti.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  <button type="button" onClick={reset} data-track-ignore className="text-sm font-semibold text-brand">
                    Azzera filtri
                  </button>
                  <a href="#lead-creator_hub" className="text-sm font-semibold text-ink underline">
                    Chiedi una selezione gratuita
                  </a>
                </div>
              </div>
            )}
            {shown < list.length && (
              <div className="mt-8 text-center">
                <button type="button" onClick={() => setShown((v) => v + PAGE)} data-track-ignore className="rounded-full bg-white px-6 py-3 text-sm font-semibold ring-1 ring-line hover:ring-ink">
                  Mostra altri {Math.min(PAGE, list.length - shown)} creator
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="mt-8 text-xs text-mute">
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
