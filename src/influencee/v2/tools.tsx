import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Calculator, Check, Copy, Gauge, Megaphone, Search, Smile, TrendingUp, Briefcase, AlertTriangle, MapPin } from 'lucide-react';
import { Container, Section, SectionHeader, GAP, TYPE, reveal, type Tone } from '../ds';
import { track } from './analytics';
import { APP, COMPENSI, GESTITO, JOBS, MARKET, WHATSAPP, type Compenso } from './data';

/* ════════════════════════════════════════════════════════════════════
   TOOL GRATUITI RESTAURATI (lead magnet del vecchio sito)
   Design: Figma "Influencee – Tool lead magnet e bacheca offerte".
   Regole: soglie sempre dichiarate, nessun dato letto dai social,
   nessun numero inventato. Ogni uso invia `calculator_use` o `tool_use`.
   ════════════════════════════════════════════════════════════════════ */

const num = (s: string) => Math.max(0, Number(String(s).replace(/\./g, '').replace(',', '.')) || 0);
const it = (n: number, d = 0) => n.toLocaleString('it-IT', { maximumFractionDigits: d });
export const tierOf = (f: number) => (f < 10000 ? 0 : f < 50000 ? 1 : f < 250000 ? 2 : f < 1000000 ? 3 : 4);

/** Invia l'evento dopo una pausa nella digitazione, per non contare ogni tasto. */
function useDebouncedTrack(event: string, params: Record<string, string | number>, deps: unknown[]) {
  useEffect(() => {
    const t = setTimeout(() => track(event, params), 1200);
    return () => clearTimeout(t);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

function Field({ id, label, value, set, hint }: { id: string; label: string; value: string; set: (s: string) => void; hint?: string }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-semibold text-mute">{label}</span>
      <input id={id} inputMode="numeric" value={value} placeholder={hint} onChange={(e) => set(e.target.value)} className="mt-1.5 h-12 w-full rounded-2xl bg-paper px-4 font-heading text-lg font-semibold text-ink outline-none ring-1 ring-line placeholder:text-mute/60 focus:ring-brand" />
    </label>
  );
}

function Tabs<T extends string>({ value, set, items }: { value: T; set: (v: T) => void; items: [T, string][] }) {
  return (
    <div className="flex gap-1 rounded-full bg-paper p-1 text-sm font-semibold" role="tablist">
      {items.map(([k, l]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k} onClick={() => set(k)} className={`flex-1 rounded-full px-4 py-2 transition ${value === k ? 'bg-ink text-white' : 'text-mute'}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

/* ─── 1. Fake follower checker ──────────────────────────────────── */
type Level = 'risk' | 'warn' | 'ok' | 'na';
interface Signal {
  k: string;
  t: string;
  v: string;
  x: string;
  level: Level;
}

/** Soglie indicative usate dal checker (dichiarate anche nella pagina). */
export const FF_RULES = {
  erRisk: 0.5, // ER sotto il 50% della media di fascia
  erWarn: 0.85,
  growthRisk: 20, // % follower in 30 giorni
  growthWarn: 10,
  viewsRisk: 5, // visualizzazioni reel / follower, in %
  viewsWarn: 10,
  commentsRisk: 1, // commenti / like, in %
  commentsWarn: 2,
};

export function fakeFollowerSignals(i: { platform: 'ig' | 'tt'; f: number; likes: number; comments: number; views: number; reelInter: number; f30: number }): Signal[] {
  const out: Signal[] = [];
  const tier = tierOf(i.f);
  const er = i.f ? ((i.likes + i.comments) / i.f) * 100 : 0;
  if (i.platform === 'ig') {
    const ref = MARKET.erIG[tier].v;
    const r = er / ref;
    out.push({ k: 'er', t: `Engagement rate ${it(er, 2)}%`, v: `${it(er, 2)}%`, x: `Media ${MARKET.tiers[tier].toLowerCase()} su Instagram: ${it(ref, 2)}%. ${r < 1 ? `Sotto del ${it((1 - r) * 100)}%.` : 'In linea o sopra.'}`, level: !i.f ? 'na' : r < FF_RULES.erRisk ? 'risk' : r < FF_RULES.erWarn ? 'warn' : 'ok' });
  } else {
    out.push({ k: 'er', t: `Engagement rate ${it(er, 2)}%`, v: `${it(er, 2)}%`, x: 'Per TikTok non abbiamo una media di fascia affidabile: guarda soprattutto visualizzazioni e check sponsor.', level: 'na' });
  }
  if (i.f30 > 0) {
    const g = ((i.f - i.f30) / i.f30) * 100;
    out.push({ k: 'growth', t: `${g >= 0 ? '+' : ''}${it(g, 1)}% follower in 30 giorni`, v: `${it(g, 1)}%`, x: g > FF_RULES.growthRisk ? 'Crescita molto rapida: controlla se c’è un contenuto virale che la spiega.' : g > FF_RULES.growthWarn ? 'Crescita veloce: verifica i picchi nel grafico del profilo.' : 'Crescita regolare.', level: g > FF_RULES.growthRisk ? 'risk' : g > FF_RULES.growthWarn ? 'warn' : 'ok' });
  } else out.push({ k: 'growth', t: 'Crescita follower', v: '—', x: 'Inserisci i follower di 30 giorni fa per controllare i picchi.', level: 'na' });
  if (i.views > 0 && i.reelInter > 0) {
    const cs = (i.reelInter / i.views) * 100;
    const band = MARKET.sponsor.find((x) => cs < x.max)!;
    out.push({ k: 'sponsor', t: `Check sponsor ${it(cs, 2)}%`, v: `${it(cs, 2)}%`, x: band.label + '.', level: band.tone === 'bad' ? 'risk' : band.tone === 'warn' ? 'warn' : 'ok' });
  } else out.push({ k: 'sponsor', t: 'Check sponsor', v: '—', x: 'Servono visualizzazioni e interazioni medie dei reel.', level: 'na' });
  if (i.views > 0 && i.f > 0) {
    const vr = (i.views / i.f) * 100;
    out.push({ k: 'views', t: `Visualizzazioni = ${it(vr, 1)}% dei follower`, v: `${it(vr, 1)}%`, x: vr < FF_RULES.viewsRisk ? 'Pochissimi follower vedono i contenuti: pubblico poco attivo o non reale.' : vr < FF_RULES.viewsWarn ? 'Visualizzazioni basse rispetto ai follower.' : 'Nella norma.', level: vr < FF_RULES.viewsRisk ? 'risk' : vr < FF_RULES.viewsWarn ? 'warn' : 'ok' });
  } else out.push({ k: 'views', t: 'Visualizzazioni / follower', v: '—', x: 'Inserisci le visualizzazioni medie dei reel.', level: 'na' });
  if (i.likes > 0) {
    const cl = (i.comments / i.likes) * 100;
    out.push({ k: 'comments', t: `Commenti = ${it(cl, 1)}% dei like`, v: `${it(cl, 1)}%`, x: cl < FF_RULES.commentsRisk ? 'Quasi nessun commento: possibili like acquistati.' : cl < FF_RULES.commentsWarn ? 'Pochi commenti rispetto ai like.' : 'Nella norma.', level: cl < FF_RULES.commentsRisk ? 'risk' : cl < FF_RULES.commentsWarn ? 'warn' : 'ok' });
  } else out.push({ k: 'comments', t: 'Commenti / like', v: '—', x: 'Inserisci like e commenti medi.', level: 'na' });
  return out;
}

const DOT: Record<Level, string> = { risk: 'bg-brand text-white', warn: 'bg-[#f5a623] text-white', ok: 'bg-acid text-ink', na: 'bg-white/15 text-white/70' };
const DOT_TXT: Record<Level, string> = { risk: '!', warn: '~', ok: '✓', na: '–' };

export function FakeFollowerPanel({ className = '' }: { className?: string }) {
  const [platform, setPlatform] = useState<'ig' | 'tt'>('ig');
  const [f, setF] = useState('38400');
  const [likes, setLikes] = useState('290');
  const [comments, setComments] = useState('12');
  const [views, setViews] = useState('2100');
  const [reelInter, setReelInter] = useState('31');
  const [f30, setF30] = useState('29800');
  const [copied, setCopied] = useState(false);
  const signals = useMemo(() => fakeFollowerSignals({ platform, f: num(f), likes: num(likes), comments: num(comments), views: num(views), reelInter: num(reelInter), f30: num(f30) }), [platform, f, likes, comments, views, reelInter, f30]);
  const checked = signals.filter((s) => s.level !== 'na');
  const risk = signals.filter((s) => s.level === 'risk').length;
  const warn = signals.filter((s) => s.level === 'warn').length;
  const verdict = risk >= 2 ? { l: 'Verifica prima di pagare', c: 'bg-brand text-white' } : risk === 1 || warn >= 2 ? { l: 'Da approfondire', c: 'bg-[#fff1cc] text-[#8a5a00]' } : { l: 'Nessun segnale forte', c: 'bg-acid text-ink' };
  useDebouncedTrack('calculator_use', { calculator: 'fake_follower', platform, tier: MARKET.tiers[tierOf(num(f))], risk_signals: risk, warn_signals: warn, result_band: verdict.l }, [platform, f, likes, comments, views, reelInter, f30]);
  const copy = () => {
    const txt = `Controllo fake follower (influencee.it)\nSegnali di rischio: ${risk} su ${checked.length}\n` + signals.map((s) => `- ${s.t}: ${s.x}`).join('\n');
    navigator.clipboard?.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
    track('tool_use', { tool: 'fake_follower', action: 'copia_risultato' });
  };
  return (
    <div id="checker" className={`rounded-[28px] bg-white p-5 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-7 ${className}`}>
      <p className="font-heading text-xl font-semibold tracking-tight">Controlla un profilo</p>
      <p className="mt-1 text-xs text-mute">Media degli ultimi 10 contenuti, esclusi quelli sponsorizzati.</p>
      <div className="mt-4">
        <Tabs value={platform} set={setPlatform} items={[['ig', 'Instagram'], ['tt', 'TikTok']]} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field id="ff-f" label="Follower" value={f} set={setF} />
        <Field id="ff-l" label="Like medi per post" value={likes} set={setLikes} />
        <Field id="ff-c" label="Commenti medi" value={comments} set={setComments} />
        <Field id="ff-v" label="Visualizzazioni medie reel" value={views} set={setViews} />
        <Field id="ff-30" label="Follower 30 giorni fa" value={f30} set={setF30} hint="facoltativo" />
        <Field id="ff-ri" label="Interazioni medie reel" value={reelInter} set={setReelInter} />
      </div>
      <div className="mt-4 rounded-[22px] bg-ink p-5 text-white" aria-live="polite">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`${TYPE.label} text-white/55`}>Segnali di rischio</p>
            <p className="mt-1 font-heading text-4xl font-semibold tracking-tight tabular-nums">
              {risk} su {checked.length}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${verdict.c}`}>{verdict.l}</span>
        </div>
        <ul className="mt-3">
          {signals.map((s) => (
            <li key={s.k} className="flex gap-3 border-t border-white/10 py-2.5 text-sm">
              <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold ${DOT[s.level]}`}>{DOT_TXT[s.level]}</span>
              <span>
                <b className="font-semibold">{s.t}</b>
                <span className="block text-xs text-white/55">{s.x}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={APP.brand} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-acid px-4 text-sm font-semibold text-ink">
            <BadgeCheck className="h-4 w-4" /> Cerca creator verificati
          </a>
          <button type="button" onClick={copy} className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white ring-1 ring-white/25">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copiato' : 'Copia risultato'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Le soglie del checker, mostrate in pagina (trasparenza = AEO + fiducia). */
export function FakeSignalsGrid({ tone = 'paper' }: { tone?: Tone }) {
  const cards = [
    { t: 'Engagement rate', tag: `Rischio sotto il ${FF_RULES.erRisk * 100}% della media`, tagC: 'bg-[#ffe1dc] text-[#b42318]', body: <ErBars />, x: 'Interazioni medie ÷ follower, confrontate con la media della stessa fascia.' },
    { t: 'Crescita follower', tag: `Rischio oltre +${FF_RULES.growthRisk}% al mese`, tagC: 'bg-[#ffe1dc] text-[#b42318]', body: <GrowthLine />, x: 'Un salto improvviso senza un contenuto virale è il segnale più tipico di follower comprati.' },
    { t: 'Check sponsor', tag: 'Soglia 1,5%', tagC: 'bg-[#fff1cc] text-[#8a5a00]', body: <SponsorBar />, x: 'Interazioni ÷ visualizzazioni dei reel: sotto l’1,5% la reach arriva probabilmente da pubblicità.' },
    { t: 'Visualizzazioni / follower', tag: `Rischio sotto il ${FF_RULES.viewsRisk}%`, tagC: 'bg-[#ffe1dc] text-[#b42318]', x: 'Se i reel li vede una piccolissima parte dei follower, il pubblico è poco attivo o non reale.' },
    { t: 'Commenti / like', tag: `Rischio sotto l’${FF_RULES.commentsRisk}%`, tagC: 'bg-[#ffe1dc] text-[#b42318]', x: 'Migliaia di like e quasi nessun commento indicano spesso like acquistati.' },
    { t: 'Controlli a mano', tag: 'Sempre', tagC: 'bg-paper text-ink', x: 'Apri qualche follower: profili senza foto né post, commenti generici o in lingue strane, picchi in giorni senza contenuti.' },
  ];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="left" eyebrow="Il metodo" title={'I segnali\n*che controlliamo*'} lead="Ogni segnale ha una soglia dichiarata. Le medie di engagement per fascia vengono dal benchmark di mercato con la loro fonte." />
        <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-3`}>
          {cards.map((c, i) => (
            <motion.div key={c.t} {...reveal(i % 3)} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <p className={TYPE.h3}>{c.t}</p>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.tagC}`}>{c.tag}</span>
              </div>
              {c.body && <div className="mt-5">{c.body}</div>}
              <p className="mt-4 text-sm leading-relaxed text-mute">{c.x}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
function ErBars() {
  const max = MARKET.erIG[0].v;
  return (
    <div>
      <div className="flex h-24 items-end gap-2">
        {MARKET.erIG.map((e, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[11px] font-semibold tabular-nums">{it(e.v, 2)}%</span>
            <span className="w-full rounded-lg bg-acid" style={{ height: `${(e.v / max) * 70}px` }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-2 text-[10px] text-mute">
        {MARKET.tiers.map((t) => (
          <span key={t} className="flex-1 text-center">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
function GrowthLine() {
  return (
    <svg viewBox="0 0 300 100" className="h-24 w-full" aria-hidden>
      <polyline points="0,88 60,84 120,80 150,78 172,26 230,22 300,18" fill="none" stroke="#ff1f8f" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="172" cy="26" r="7" fill="#ff1f8f" />
      <text x="182" y="52" fontSize="12" fill="#6e6e73">picco anomalo</text>
    </svg>
  );
}
function SponsorBar() {
  return (
    <div>
      <div className="flex h-4 overflow-hidden rounded-full">
        <span className="w-[30%] bg-brand" />
        <span className="w-[12%] bg-[#f5a623]" />
        <span className="w-[28%] bg-acid-soft" />
        <span className="flex-1 bg-acid" />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-mute">
        <span>&lt;1,5% a pagamento</span>
        <span>1,9–2,7% sana</span>
        <span>&gt;2,7% ottima</span>
      </div>
    </div>
  );
}

/* ─── 2. Calcolatore costo influencer ───────────────────────────── */
export function costEstimate(platform: 'ig' | 'tt', f: number, er: number) {
  const tier = tierOf(f);
  const w = MARKET.priceWeights.find((x) => f < x.upTo)!.w;
  const formula = Math.round(f * w);
  const market = (platform === 'ig' ? MARKET.costIG : MARKET.costTT)[tier];
  const lo = Math.min(formula, market.v);
  const hi = Math.max(formula, market.v);
  const ref = MARKET.erIG[tier].v;
  const erNote = !er ? '' : er >= ref * 1.15 ? 'Engagement sopra la media della fascia: puoi stare nella parte alta.' : er >= ref * 0.85 ? 'Engagement in linea con la media della fascia.' : 'Engagement sotto la media della fascia: tratta verso la parte bassa.';
  return { tier, formula, market, lo, hi, erNote };
}

export function CostCalcPanel({ className = '' }: { className?: string }) {
  const [platform, setPlatform] = useState<'ig' | 'tt'>('ig');
  const [f, setF] = useState('24000');
  const [er, setEr] = useState('5,2');
  const [qty, setQty] = useState(3);
  const e = costEstimate(platform, num(f), num(er));
  useDebouncedTrack('calculator_use', { calculator: 'costo_influencer', platform, tier: MARKET.tiers[e.tier], quantity: qty, result_band: `${e.lo}-${e.hi}` }, [platform, f, er, qty]);
  const srcLabel = e.market.o === 'IT' ? `media di mercato ${MARKET.tiers[e.tier].toLowerCase()}, fonte ${e.market.src}` : `media ${MARKET.tiers[e.tier].toLowerCase()}, ${e.market.o === 'proxy' ? 'valore indicativo' : 'stima'}`;
  return (
    <div id="calcolatore" className={`rounded-[28px] bg-white p-5 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-7 ${className}`}>
      <p className="font-heading text-xl font-semibold tracking-tight">Calcola il costo</p>
      <p className="mt-1 text-xs text-mute">Stima indicativa: il prezzo finale lo concordi con il creator.</p>
      <div className="mt-4">
        <Tabs value={platform} set={setPlatform} items={[['ig', 'Instagram'], ['tt', 'TikTok']]} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field id="cc-f" label="Follower" value={f} set={setF} />
        <Field id="cc-er" label="Engagement rate % (facoltativo)" value={er} set={setEr} />
      </div>
      <div className="mt-3">
        <span className="text-xs font-semibold text-mute">Numero di contenuti</span>
        <div className="mt-1.5 flex h-12 items-center justify-between rounded-2xl bg-paper px-2 ring-1 ring-line">
          <button type="button" aria-label="Meno contenuti" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-xl bg-white text-lg font-semibold">
            −
          </button>
          <span className="font-heading text-lg font-semibold tabular-nums">{qty}</span>
          <button type="button" aria-label="Più contenuti" onClick={() => setQty((q) => Math.min(20, q + 1))} className="h-9 w-9 rounded-xl bg-white text-lg font-semibold">
            +
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-[22px] bg-ink p-5 text-white" aria-live="polite">
        <p className={`${TYPE.label} text-white/55`}>Stima per {qty} contenut{qty === 1 ? 'o' : 'i'}</p>
        <p className="mt-1 font-heading text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
          {it(e.lo * qty)} – {it(e.hi * qty)} €
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/60">
          A contenuto: da {it(e.lo)} € a {it(e.hi)} €. Un estremo è la formula di prezzo di Influencee ({it(e.formula)} €), l’altro è la {srcLabel} ({it(e.market.v)} € a post). {e.erNote}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={APP.brand} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-acid px-4 text-sm font-semibold text-ink">
            Trova creator in questa fascia <ArrowRight className="h-4 w-4" />
          </a>
          <a href={WHATSAPP.href} className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-white ring-1 ring-white/25">
            Preventivo su WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Hub dei tool ───────────────────────────────────────────── */
type Aud = 'tutti' | 'brand' | 'creator' | 'smm';
const HUB: { t: string; x: string; href: string; aud: Aud[]; icon: typeof Gauge; tag?: string; dark?: boolean; acid?: boolean; preview: React.ReactNode }[] = [
  { t: 'Fake follower checker', x: 'Confronta engagement, crescita e visualizzazioni con la media della fascia.', href: '#/followe-instagram-fake-follower/', aud: ['brand', 'smm'], icon: AlertTriangle, tag: 'Più usato', dark: true, preview: <MiniStat k="Segnali di rischio" v="2 su 5" pill="Da approfondire" /> },
  { t: 'Calcolatore costo influencer', x: 'Quanto pagare un creator in base a follower ed engagement, con la media di mercato.', href: '#/social-media-tool/costo-influencer/', aud: ['brand', 'creator'], icon: Calculator, preview: <MiniStat k="Stima a contenuto" v="290–950 €" /> },
  { t: 'Calcolo engagement rate', x: 'Engagement rate e check sponsor, con le soglie per fascia di follower.', href: '#/come-calcolare-engagement-rate/', aud: ['brand', 'creator', 'smm'], icon: Gauge, acid: true, preview: <MiniStat k="Engagement rate" v="5,8%" pill="Sopra la media" /> },
  { t: 'Benchmark engagement', x: 'I valori di riferimento per Nano, Micro, Mid, Macro e Mega, con le fonti.', href: '#/benchmark-engagement-rate/', aud: ['brand', 'smm'], icon: TrendingUp, preview: <MiniStat k="Micro · Instagram" v="4,6%" /> },
  { t: 'Emoticon da copiare', x: 'Faccine, cuori, mani e simboli: copi con un clic e incolli dove vuoi.', href: '#/social-media-tool/emoticon-da-copiare/', aud: ['creator', 'smm'], icon: Smile, preview: <p className="text-3xl tracking-widest">😍🔥✨🙌</p> },
  { t: 'Offerte di lavoro per influencer', x: 'Le collaborazioni pubblicate dai brand: pagate, cambio merce, % sulle vendite.', href: '#/offerte-lavoro-influencer/', aud: ['creator'], icon: Briefcase, preview: <MiniStat k="Offerte aperte" v="Bacheca" pill="Gratis" /> },
  { t: 'Preventivo campagna gestita', x: 'Quanti influencer e video UGC: vedi il prezzo con il listino del nostro team.', href: '#/preventivo-campagne/', aud: ['brand'], icon: Calculator, preview: <MiniStat k="3 influencer · 3 mesi" v="Preventivo" pill="Listino chiaro" /> },
  { t: 'Pubblica un’offerta', x: 'Per le aziende: descrivi la collaborazione e ricevi candidature dai creator.', href: '#/pubblica-offerta-lavoro/', aud: ['brand'], icon: Megaphone, preview: <MiniStat k="In 3 passi" v="Offerta pronta" /> },
];
function MiniStat({ k, v, pill }: { k: string; v: string; pill?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-mute">{k}</span>
        {pill && <span className="rounded-full bg-acid-soft px-2 py-0.5 text-[10px] font-semibold">{pill}</span>}
      </div>
      <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">{v}</p>
    </div>
  );
}

export function ToolsHubGrid({ tone = 'paper' }: { tone?: Tone }) {
  const [aud, setAud] = useState<Aud>('tutti');
  const list = HUB.filter((h) => aud === 'tutti' || h.aud.includes(aud));
  return (
    <Section tone={tone} id="tool">
      <Container>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtra i tool">
          {([['tutti', 'Tutti'], ['brand', 'Per brand e agenzie'], ['creator', 'Per creator'], ['smm', 'Per social media manager']] as [Aud, string][]).map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={aud === k} onClick={() => { setAud(k); track('tool_filter', { filter: k }); }} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${aud === k ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className={`mt-8 grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-3`}>
          {list.map((h, i) => (
            <motion.a key={h.href} href={h.href} {...reveal(i % 3)} className={`group flex min-h-[300px] flex-col justify-between rounded-3xl p-6 transition hover:-translate-y-1 ${h.dark ? 'bg-ink text-white' : h.acid ? 'bg-acid text-ink' : 'bg-white text-ink ring-1 ring-line'}`}>
              <div>{h.preview}</div>
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${h.dark ? 'bg-acid text-ink' : 'bg-ink text-white'}`}>
                    <h.icon className="h-4 w-4" />
                  </span>
                  {h.tag && <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white">{h.tag}</span>}
                </div>
                <p className={`mt-4 ${TYPE.h3}`}>{h.t}</p>
                <p className={`mt-2 text-sm leading-relaxed ${h.dark ? 'text-white/60' : h.acid ? 'text-ink/70' : 'text-mute'}`}>{h.x}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                  Apri il tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 4. Bacheca offerte di lavoro ──────────────────────────────── */
const TYPE_C: Record<Compenso, string> = { pagata: 'bg-[#e3f9d8] text-[#246b0b]', 'cambio-merce': 'bg-paper text-ink', percentuale: 'bg-paper text-ink', collaborazione: 'bg-paper text-ink' };
const fmtDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export function JobCard({ title, company, location, types, date, cta = true }: { title: string; company: string; location: string; types: Compenso[]; date?: string; cta?: boolean }) {
  return (
    <div className="grid grid-cols-[48px_1fr] items-center gap-4 rounded-[22px] bg-white p-5 ring-1 ring-line sm:grid-cols-[56px_1fr_auto]">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-acid font-heading text-base font-semibold sm:h-14 sm:w-14">{initials(company || 'Az')}</span>
      <div className="min-w-0">
        <p className="font-heading text-lg font-semibold leading-snug tracking-tight">{title || 'Titolo dell’offerta'}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-mute">
          <span>{company || 'La tua azienda'}</span>·
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {location || 'Italia'}
          </span>
          {date && <>· <span>{fmtDate(date)}</span></>}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {types.map((t) => (
            <span key={t} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_C[t]}`}>
              {COMPENSI.find((c) => c.k === t)!.label}
            </span>
          ))}
        </div>
      </div>
      {cta && (
        <a href={APP.annunci} className="col-span-2 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white sm:col-span-1">
          Candidati
        </a>
      )}
    </div>
  );
}

export function JobsBoard({ tone = 'paper' }: { tone?: Tone }) {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [type, setType] = useState<Compenso | 'tutte'>('tutte');
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const list = JOBS.filter((j) => (type === 'tutte' || j.types.includes(type)) && (!q || norm(j.title + ' ' + j.company).includes(norm(q))) && (!loc || norm(j.location).includes(norm(loc)) || (j.remote && /remot/.test(norm(loc)))));
  useDebouncedTrack('job_search', { has_keyword: q ? 1 : 0, has_location: loc ? 1 : 0, compenso: type, results: list.length }, [q, loc, type]);
  return (
    <Section tone={tone} id="offerte">
      <Container>
        <div className="rounded-[24px] bg-white p-2.5 ring-1 ring-line sm:grid sm:grid-cols-[1.4fr_1fr] sm:gap-2.5">
          <label className="flex h-12 items-center gap-2 rounded-2xl bg-paper px-4">
            <Search className="h-4 w-4 text-mute" />
            <input aria-label="Settore o parola chiave" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Settore o parola chiave" className="w-full bg-transparent text-[15px] outline-none" />
          </label>
          <label className="mt-2.5 flex h-12 items-center gap-2 rounded-2xl bg-paper px-4 sm:mt-0">
            <MapPin className="h-4 w-4 text-mute" />
            <input aria-label="Città o da remoto" value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Città o “da remoto”" className="w-full bg-transparent text-[15px] outline-none" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Tipo di compenso">
          {([['tutte', 'Tutte'], ...COMPENSI.map((c) => [c.k, c.label])] as [Compenso | 'tutte', string][]).map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={type === k} onClick={() => setType(k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${type === k ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">Offerte recenti</p>
              <a href={APP.annunci} className="text-sm font-semibold text-brand-ink">
                Tutte le offerte aperte nell’app →
              </a>
            </div>
            <div className="grid gap-3">
              {list.map((j) => (
                <JobCard key={j.title} {...j} />
              ))}
              {!list.length && (
                <div className="rounded-[22px] bg-white p-8 text-center ring-1 ring-line">
                  <p className="font-heading text-xl font-semibold">Nessuna offerta con questi filtri</p>
                  <p className="mt-2 text-sm text-mute">Le nuove offerte arrivano ogni settimana nell’app: crea il profilo e i brand ti trovano anche senza candidatura.</p>
                  <a href={APP.creator} className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
                    Iscriviti gratis
                  </a>
                </div>
              )}
            </div>
          </div>
          <aside className="grid content-start gap-4">
            <div className="rounded-[24px] bg-ink p-6 text-white">
              <p className={`${TYPE.label} text-acid`}>Per i creator</p>
              <p className="mt-2 font-heading text-2xl font-semibold tracking-tight">Ricevi le offerte della tua categoria</p>
              <p className="mt-2 text-sm text-white/60">Crea il profilo gratis: i brand ti trovano anche senza candidatura.</p>
              <a href={APP.creator} className="mt-5 inline-flex h-10 items-center rounded-full bg-acid px-4 text-sm font-semibold text-ink">
                Iscriviti gratis
              </a>
            </div>
            <div className="rounded-[24px] bg-white p-6 ring-1 ring-line">
              <p className={`${TYPE.label} text-mute`}>Per le aziende</p>
              <p className="mt-2 font-heading text-xl font-semibold tracking-tight">Pubblica un’offerta</p>
              <p className="mt-2 text-sm text-mute">Gratis. Ricevi candidature da creator italiani.</p>
              <a href="#/pubblica-offerta-lavoro/" className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
                Pubblica offerta
              </a>
            </div>
            <div className="rounded-[24px] bg-acid-soft p-6">
              <p className={`${TYPE.label} text-mute`}>Hai poco tempo?</p>
              <p className="mt-2 font-semibold">Scegliamo noi i creator e gestiamo la campagna.</p>
              <a href={WHATSAPP.href} className="mt-4 inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-line">
                Chiedi su WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 5. Pubblica offerta (3 passi + anteprima) ─────────────────── */
export function PostJobForm({ tone = 'paper' }: { tone?: Tone }) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState({ company: '', site: '', title: '', types: ['pagata'] as Compenso[], platform: 'Instagram', tier: 'Micro (10K–50K)', location: '', desc: '' });
  const [copied, setCopied] = useState(false);
  const up = (k: keyof typeof d, v: string | Compenso[]) => setD((x) => ({ ...x, [k]: v }));
  const go = (n: number) => {
    setStep(n);
    track('job_post_step', { step: n, compenso: d.types.join('+') });
  };
  const toggle = (k: Compenso) => up('types', d.types.includes(k) ? d.types.filter((t) => t !== k) : [...d.types, k]);
  const text = `${d.title}\n${d.company}${d.site ? ` · ${d.site}` : ''}\nCompenso: ${d.types.map((t) => COMPENSI.find((c) => c.k === t)!.label).join(', ')}\nPiattaforma: ${d.platform} · Fascia: ${d.tier} · Luogo: ${d.location || 'Italia'}\n\n${d.desc}`;
  const input = (id: string, label: string, k: keyof typeof d, ph = '', area = false) => (
    <label htmlFor={id} className="block">
      <span className="text-xs font-semibold text-mute">{label}</span>
      {area ? (
        <textarea id={id} value={d[k] as string} placeholder={ph} onChange={(e) => up(k, e.target.value)} rows={4} className="mt-1.5 w-full rounded-2xl bg-paper px-4 py-3 text-[15px] outline-none ring-1 ring-line focus:ring-brand" />
      ) : (
        <input id={id} value={d[k] as string} placeholder={ph} onChange={(e) => up(k, e.target.value)} className="mt-1.5 h-12 w-full rounded-2xl bg-paper px-4 text-[15px] outline-none ring-1 ring-line focus:ring-brand" />
      )}
    </label>
  );
  const select = (id: string, label: string, k: keyof typeof d, opts: string[]) => (
    <label htmlFor={id} className="block">
      <span className="text-xs font-semibold text-mute">{label}</span>
      <select id={id} value={d[k] as string} onChange={(e) => up(k, e.target.value)} className="mt-1.5 h-12 w-full rounded-2xl bg-paper px-4 text-[15px] outline-none ring-1 ring-line">
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
  return (
    <Section tone={tone} id="pubblica">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-line sm:p-8" data-track-zone="form_pubblica_offerta">
            <div className="flex gap-2" aria-hidden>
              {[1, 2, 3].map((n) => (
                <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-ink' : 'bg-line'}`} />
              ))}
            </div>
            <p className={`mt-6 ${TYPE.label} text-mute`}>Passo {step} di 3</p>
            {step === 1 && (
              <>
                <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">Chi pubblica l’offerta?</p>
                <div className="mt-6 grid gap-4">
                  {input('po-company', 'Nome dell’azienda', 'company', 'Es. Pastificio Rossi')}
                  {input('po-site', 'Sito web (facoltativo)', 'site', 'www.esempio.it')}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">Che collaborazione proponi?</p>
                <div className="mt-6 grid gap-4">
                  {input('po-title', 'Titolo', 'title', 'Es. UGC creator food per video ricette')}
                  <div>
                    <span className="text-xs font-semibold text-mute">Tipo di compenso</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {COMPENSI.map((c) => (
                        <button key={c.k} type="button" aria-pressed={d.types.includes(c.k)} onClick={() => toggle(c.k)} className={`rounded-full px-4 py-2.5 text-sm font-semibold ${d.types.includes(c.k) ? 'bg-ink text-white' : 'bg-paper text-ink'}`}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {select('po-pl', 'Piattaforma', 'platform', ['Instagram', 'TikTok', 'YouTube', 'Instagram e TikTok', 'Solo contenuti UGC'])}
                    {select('po-tier', 'Fascia follower', 'tier', ['Nano (1K–10K)', 'Micro (10K–50K)', 'Mid (50K–250K)', 'Macro (250K–1M)', 'VIP (oltre 1M)', 'Indifferente'])}
                  </div>
                  {input('po-loc', 'Luogo', 'location', 'Es. Milano, oppure “da remoto”')}
                  {input('po-desc', 'Descrizione', 'desc', 'Cosa deve fare il creator, quanti contenuti, entro quando…', true)}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">L’offerta è pronta. Pubblicala dal tuo account</p>
                <p className="mt-3 text-[15px] leading-relaxed text-mute">Le offerte si pubblicano dall’account aziendale gratuito: così ricevi le candidature con i profili dei creator e gestisci tutto nell’app. Copia il testo e incollalo nell’annuncio.</p>
                <pre className="mt-5 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl bg-paper p-4 font-sans text-sm">{text}</pre>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={`${APP.brand}?da=pubblica-offerta`} className="inline-flex h-12 items-center gap-1.5 rounded-full bg-ink px-5 text-[15px] font-semibold text-white">
                    Crea l’account e pubblica <ArrowRight className="h-4 w-4" />
                  </a>
                  <button type="button" onClick={() => { navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); track('tool_use', { tool: 'pubblica_offerta', action: 'copia_testo' }); }} className="inline-flex h-12 items-center gap-1.5 rounded-full px-5 text-[15px] font-semibold ring-1 ring-line">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copiato' : 'Copia il testo'}
                  </button>
                </div>
                <p className="mt-4 text-sm text-mute">
                  Preferisci che scegliamo noi i creator?{' '}
                  <a href={WHATSAPP.href} className="font-semibold text-brand-ink">
                    Scrivici su WhatsApp
                  </a>
                </p>
              </>
            )}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button type="button" onClick={() => go(step - 1)} className="inline-flex h-12 items-center rounded-full px-5 text-[15px] font-semibold ring-1 ring-line">
                  Indietro
                </button>
              ) : (
                <span />
              )}
              {step < 3 && (
                <button type="button" onClick={() => go(step + 1)} className="inline-flex h-12 items-center gap-1.5 rounded-full bg-ink px-5 text-[15px] font-semibold text-white">
                  Continua <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="grid content-start gap-4 lg:pt-6">
            <p className={`${TYPE.label} text-mute`}>Anteprima nella bacheca</p>
            <JobCard title={d.title} company={d.company} location={d.location} types={d.types.length ? d.types : ['collaborazione']} cta={false} />
            <div className="rounded-[24px] bg-ink p-6 text-white">
              {['Candidature solo da creator italiani', 'Contratto e link tracciati nell’app', 'Nessuna commissione sulle collaborazioni'].map((x) => (
                <p key={x} className="flex items-center gap-3 border-t border-white/10 py-3 text-sm first:border-0 first:pt-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-acid text-ink">
                    <Check className="h-3 w-3" />
                  </span>
                  {x}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 6. Emoticon da copiare ────────────────────────────────────── */
const EMOJI: { k: string; e: string }[] = [
  { k: 'Più usate', e: '😂 ❤️ 😍 🔥 ✨ 🙏 😭 🥰 👍 😊 🎉 💕 🤩 😎 💯 🙌 👏 🤣 😘 💪 🌟 ✅ 👀 🫶' },
  { k: 'Faccine', e: '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😋 😜 🤪 😎 🤓 🥳 😏 😒 😔 😢 😭 😤 😡 🤯 😱 🥺 🤔 🤫 🤭 🙄 😴 🤤' },
  { k: 'Cuori', e: '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💖 💗 💓 💞 💕 💘 💝 💟 ❣️ 💔 ❤️‍🔥 🫶 😻 💌 💋' },
  { k: 'Mani', e: '👍 👎 👏 🙌 👐 🤲 🙏 🤝 ✌️ 🤞 🤟 🤘 👌 🤌 👈 👉 👆 👇 ☝️ ✋ 🖐️ 👋 💪 ✍️' },
  { k: 'Natura', e: '🌸 🌺 🌻 🌹 🌷 🌼 🍀 🌿 🌱 🌴 🌵 🍁 🍂 🌊 ☀️ 🌙 ⭐ 🌈 ⚡ ❄️ 🔥 💧 🐶 🐱' },
  { k: 'Cibo', e: '🍕 🍔 🍟 🌭 🍝 🍣 🥗 🥑 🍓 🍒 🍑 🍋 🍉 🍇 🍰 🧁 🍩 🍪 🍫 🍦 ☕ 🍷 🍹 🥂' },
  { k: 'Viaggi', e: '✈️ 🚗 🚆 🚲 🛵 ⛵ 🏖️ 🏝️ 🏔️ 🏕️ 🗺️ 🧳 🏨 🗼 🏛️ 🎡 🌍 📍 🇮🇹 🛫 🌅 🌄 🚀 🏰' },
  { k: 'Oggetti', e: '📱 💻 📷 🎥 🎧 🎤 💡 📚 ✏️ 📌 📎 🛍️ 🎁 💄 👗 👟 👜 💍 ⌚ 🏆 🎯 🎮 💸 🔑' },
  { k: 'Simboli', e: '✅ ❌ ⚠️ ❗ ❓ 💯 🔝 🆕 🆓 🔥 ⭐ ✨ 💫 ➡️ ⬅️ ⬆️ ⬇️ 🔗 📣 📢 🔔 ♻️ ™️ ©️' },
];

export function EmojiTool({ tone = 'paper' }: { tone?: Tone }) {
  const [cat, setCat] = useState(EMOJI[0].k);
  const [text, setText] = useState('');
  const [toast, setToast] = useState('');
  const list = EMOJI.find((c) => c.k === cat)!.e.split(' ');
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 1400);
  };
  const pick = (e: string) => {
    navigator.clipboard?.writeText(e).catch(() => undefined);
    setText((t) => t + e);
    flash(`${e} copiata`);
    track('tool_use', { tool: 'emoticon', action: 'copia_emoji', category: cat });
  };
  return (
    <Section tone={tone} id="emoticon">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[28px] bg-white p-5 ring-1 ring-line sm:p-7">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categorie di emoticon">
              {EMOJI.map((c) => (
                <button key={c.k} type="button" role="tab" aria-selected={cat === c.k} onClick={() => setCat(c.k)} className={`rounded-full px-4 py-2 text-sm font-semibold ${cat === c.k ? 'bg-ink text-white' : 'bg-paper text-ink'}`}>
                  {c.k}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-10">
              {list.map((e, i) => (
                <button key={e + i} type="button" data-track-ignore onClick={() => pick(e)} aria-label={`Copia ${e}`} className="flex aspect-square items-center justify-center rounded-2xl bg-paper text-3xl transition hover:scale-110 hover:bg-acid-soft active:scale-95">
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] bg-ink p-6 text-white lg:sticky lg:top-24 lg:self-start">
            <p className={`${TYPE.label} text-acid`}>Il tuo testo</p>
            <textarea aria-label="Testo con emoticon" value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Clicca le emoticon per aggiungerle qui, poi copia tutto." className="mt-3 w-full rounded-2xl bg-white/10 p-4 text-lg outline-none placeholder:text-white/40" />
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => { navigator.clipboard?.writeText(text); flash('Testo copiato'); track('tool_use', { tool: 'emoticon', action: 'copia_testo' }); }} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-acid px-4 text-sm font-semibold text-ink">
                <Copy className="h-4 w-4" /> Copia tutto
              </button>
              <button type="button" onClick={() => setText('')} className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold ring-1 ring-white/25">
                Svuota
              </button>
            </div>
            <p className="mt-5 text-sm text-white/55">Funzionano su Instagram, TikTok, WhatsApp, Facebook e LinkedIn: sono caratteri Unicode, non immagini.</p>
          </div>
        </div>
        <div aria-live="polite" className={`pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lg transition ${toast ? 'opacity-100' : 'opacity-0'}`}>
          {toast}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 7. Preventivo campagna gestita (listino GESTITO) ──────────── */
export function gestitoQuote(n: number, contents: number, ugc: number, months: number) {
  const g = GESTITO;
  const creators = n * g.creator + n * Math.max(0, contents - 1) * g.extraContent;
  const fees = n * g.creatorFee + ugc * g.ugcFee;
  const ugcCost = ugc * g.ugc;
  const base = creators + fees + ugcCost;
  const monthly = months === 1 ? base * (1 + g.oneMonthSurcharge) : base;
  const discount = g.discounts[months] ?? 0;
  const total = monthly * months * (1 - discount);
  return { creators, fees, ugcCost, monthly, discount, total };
}

function Stepper({ label, value, set, min = 0, max = 20, id }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number; id: string }) {
  return (
    <div>
      <span id={id} className="text-xs font-semibold text-mute">{label}</span>
      <div className="mt-1.5 flex h-12 items-center justify-between rounded-2xl bg-paper px-2 ring-1 ring-line" role="group" aria-labelledby={id}>
        <button type="button" aria-label={`${label}: meno`} onClick={() => set(Math.max(min, value - 1))} className="h-9 w-9 rounded-xl bg-white text-lg font-semibold">−</button>
        <span className="font-heading text-lg font-semibold tabular-nums">{value}</span>
        <button type="button" aria-label={`${label}: più`} onClick={() => set(Math.min(max, value + 1))} className="h-9 w-9 rounded-xl bg-white text-lg font-semibold">+</button>
      </div>
    </div>
  );
}

export function PreventivoPanel({ className = '' }: { className?: string }) {
  const [n, setN] = useState(3);
  const [contents, setContents] = useState(2);
  const [ugc, setUgc] = useState(2);
  const [months, setMonths] = useState(3);
  const q = gestitoQuote(n, contents, ugc, months);
  useDebouncedTrack('calculator_use', { calculator: 'preventivo_campagna', creators: n, contents, ugc, months, result_band: `${Math.round(q.monthly)}/mese` }, [n, contents, ugc, months]);
  const msg = `Ciao Influencee, vorrei un preventivo per una campagna gestita da voi: ${n} influencer con ${contents} contenut${contents === 1 ? 'o' : 'i'} al mese, ${ugc} video UGC al mese, durata ${months} mes${months === 1 ? 'e' : 'i'}. Stima dal sito: ${it(q.monthly)} € al mese.`;
  const wa = `https://wa.me/${WHATSAPP.tel.replace('+', '')}?text=${encodeURIComponent(msg)}`;
  const rows: [string, number][] = [['Creator', q.creators], ['Video UGC', q.ugcCost], ['Gestione del team', q.fees]];
  return (
    <div id="preventivo" className={`rounded-[28px] bg-white p-5 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-7 ${className}`}>
      <p className="font-heading text-xl font-semibold tracking-tight">Calcola il preventivo</p>
      <p className="mt-1 text-xs text-mute">Listino per creator fino a {it(GESTITO.maxFollower)} follower. Il preventivo finale te lo mandiamo su WhatsApp.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stepper id="pv-n" label="Influencer" value={n} set={setN} />
        <Stepper id="pv-c" label="Contenuti al mese per influencer" value={contents} set={setContents} min={1} max={10} />
        <Stepper id="pv-u" label="Video UGC al mese" value={ugc} set={setUgc} />
        <div>
          <span className="text-xs font-semibold text-mute">Durata</span>
          <div className="mt-1.5 grid h-12 grid-cols-4 gap-1 rounded-2xl bg-paper p-1 ring-1 ring-line" role="tablist" aria-label="Durata in mesi">
            {[1, 3, 6, 12].map((m) => (
              <button key={m} type="button" role="tab" aria-selected={months === m} onClick={() => setMonths(m)} className={`rounded-xl text-sm font-semibold ${months === m ? 'bg-ink text-white' : 'text-mute'}`}>
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-[22px] bg-ink p-5 text-white" aria-live="polite">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className={`${TYPE.label} text-white/55`}>Al mese</p>
            <p className="mt-1 font-heading text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">{it(q.monthly)} €</p>
          </div>
          <div className="text-right">
            <p className={`${TYPE.label} text-white/55`}>Totale {months} mes{months === 1 ? 'e' : 'i'}</p>
            <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-acid">{it(q.total)} €</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {rows.map(([l, v]) => (
            <div key={l} className="text-xs">
              <div className="flex justify-between text-white/70"><span>{l}</span><span className="tabular-nums">{it(v)} €</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-acid" style={{ width: `${q.creators + q.ugcCost + q.fees ? (v / (q.creators + q.ugcCost + q.fees)) * 100 : 0}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/55">{months === 1 ? `Campagna di un mese: +${GESTITO.oneMonthSurcharge * 100}% sul mensile.` : `Sconto durata: ${it(q.discount * 100)}% sul totale.`}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={wa} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#25d366] px-4 text-sm font-semibold text-white">Invia su WhatsApp <ArrowRight className="h-4 w-4" /></a>
          <a href={APP.brand} className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-white ring-1 ring-white/25">Preferisco fare da solo</a>
        </div>
      </div>
    </div>
  );
}
