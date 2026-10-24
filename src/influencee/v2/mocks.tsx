import React from 'react';
import { motion } from 'motion/react';
import { entrance } from '../ds';
import { BadgeCheck, CheckCircle2, Copy, FileText, Link2, MapPin, MousePointerClick, QrCode, Search, SlidersHorizontal, Star } from 'lucide-react';

/* Schermate della piattaforma ricostruite in HTML, fedeli alle funzioni
   dell'app. Profili di esempio: iniziali al posto delle foto, numeri
   dimostrativi (dichiarato nei testi vicini).                          */

const HUES = ['bg-brand-soft text-brand-ink', 'bg-acid-soft text-ink', 'bg-paper text-ink', 'bg-ink text-white'];
export function Initials({ name, i = 0, className = 'h-9 w-9 text-xs' }: { name: string; i?: number; className?: string }) {
  const ini = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
  return <span className={`flex shrink-0 items-center justify-center rounded-full font-heading font-semibold ${HUES[i % HUES.length]} ${className}`}>{ini}</span>;
}

function Frame({ children, className = '', label }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <div className={`overflow-hidden rounded-[22px] bg-white text-left text-ink shadow-float ring-1 ring-line ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        {label && <span className="ml-3 truncate rounded-full bg-paper px-3 py-0.5 text-[10px] text-mute">{label}</span>}
      </div>
      {children}
    </div>
  );
}

const ROWS = [
  { n: 'Marta Lombardi', cat: 'Cucina e food', city: 'Bologna', tier: 'Micro', f: '34K', er: '4,1%', v: true },
  { n: 'Luca Ferri', cat: 'Fitness e sport', city: 'Milano', tier: 'Mid', f: '86K', er: '2,9%', v: true },
  { n: 'Sara Conte', cat: 'Beauty', city: 'Napoli', tier: 'Micro', f: '22K', er: '5,3%', v: false },
  { n: 'Davide Greco', cat: 'Viaggi', city: 'Palermo', tier: 'Nano', f: '8,4K', er: '6,0%', v: true },
];

/** Ricerca creator: filtri a chip, risultati, piano gratuito con oscurati. */
export function SearchMock({ className = '', locked = true }: { className?: string; locked?: boolean }) {
  return (
    <Frame className={className} label="app.influencee.it/people">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-xs text-mute">
          <Search className="h-3.5 w-3.5" /> Cerca per nome, handle o parola chiave
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['Categoria: Food', 'Fascia: Micro', 'Regione: Emilia-Romagna', 'Verificato', 'Instagram'].map((t, i) => (
            <span key={t} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${i === 0 ? 'bg-ink text-white' : 'bg-brand-soft text-brand-ink'}`}>
              {t}
            </span>
          ))}
          <span className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] text-mute ring-1 ring-line">
            <SlidersHorizontal className="h-3 w-3" /> Altri filtri
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {ROWS.map((r, i) => (
            <motion.div key={r.n} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`flex items-center gap-3 rounded-2xl bg-paper/70 px-3 py-2.5 ${locked && i === 3 ? 'blur-[3px]' : ''}`}>
              <Initials name={r.n} i={i} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-[12px] font-semibold">
                  {r.n} {r.v && <BadgeCheck className="h-3.5 w-3.5 fill-brand text-white" />}
                </p>
                <p className="flex items-center gap-1 truncate text-[10px] text-mute">
                  {r.cat} · <MapPin className="h-2.5 w-2.5" /> {r.city}
                </p>
              </div>
              <span className="hidden rounded-full bg-white px-2 py-0.5 text-[10px] font-medium sm:block">{r.tier}</span>
              <div className="text-right">
                <p className="font-heading text-[13px] font-semibold tabular-nums">{r.f}</p>
                <p className="text-[10px] text-mute">ER {r.er}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {locked && <p className="mt-3 rounded-xl bg-acid-soft px-3 py-2 text-center text-[10px] font-semibold">Piano gratuito: i primi 5 risultati in chiaro · Premium per vederli tutti</p>}
      </div>
    </Frame>
  );
}

/** Scheda creator: numeri per piattaforma, ER rispetto alla fascia, crescita. */
export function ProfileMock({ className = '' }: { className?: string }) {
  return (
    <Frame className={className} label="Scheda creator">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Initials name="Marta Lombardi" className="h-12 w-12 text-sm" />
          <div>
            <p className="flex items-center gap-1 font-heading font-semibold">
              Marta Lombardi <BadgeCheck className="h-4 w-4 fill-brand text-white" />
            </p>
            <p className="text-[11px] text-mute">Cucina e food · Bologna · Micro</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['Follower', '34K'],
            ['Crescita 30 gg', '+3,2%'],
            ['Post 30 gg', '14'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-paper p-2.5">
              <p className="text-[9px] text-mute">{k}</p>
              <p className="font-heading text-base font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-paper p-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-mute">Engagement rispetto alla fascia Micro</span>
            <span className="font-semibold">4,1%</span>
          </div>
          <div className="relative mt-2 h-2 rounded-full bg-white">
            <div className="absolute inset-y-0 left-[25%] right-[25%] rounded-full bg-brand-soft" />
            <motion.span initial={{ left: '20%' }} whileInView={{ left: '68%' }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="absolute -top-1 h-4 w-1.5 rounded-full bg-brand" />
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-mute">
            <span>p25</span>
            <span>mediana</span>
            <span>p75</span>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-mute">Dato autenticato · aggiornato il 12/10</p>
      </div>
    </Frame>
  );
}

/** Accordo con doppia accettazione e versioni dei termini. */
export function CollabMock({ className = '' }: { className?: string }) {
  return (
    <Frame className={className} label="Collaborazione">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading font-semibold">Lancio menu autunno</p>
          <span className="rounded-full bg-acid px-2.5 py-1 text-[10px] font-semibold">Attiva</span>
        </div>
        <div className="mt-4 space-y-2">
          {[
            ['Termini v1', 'Proposta del brand', false],
            ['Termini v2', 'Controproposta del creator', false],
            ['Termini v3', 'Accettata da entrambi', true],
          ].map(([t, s, ok], i) => (
            <div key={t as string} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${ok ? 'bg-brand-soft' : 'bg-paper'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${ok ? 'bg-brand text-white' : 'bg-white text-mute'}`}>v{i + 1}</span>
              <div className="flex-1">
                <p className="text-[12px] font-semibold">{t as string}</p>
                <p className="text-[10px] text-mute">{s as string}</p>
              </div>
              {ok && <CheckCircle2 className="h-4 w-4 text-brand" />}
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-xl bg-paper p-2.5">
            <p className="text-mute">Contenuti</p>
            <p className="font-semibold">2 reel · 3 storie</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-ink p-2.5 text-white">
            <FileText className="h-4 w-4 text-acid" />
            <span className="font-semibold">Contratto generato</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** Link tracciato con click, visitatori unici e QR. */
export function LinkMock({ className = '' }: { className?: string }) {
  const bars = [20, 34, 28, 52, 46, 71, 64];
  return (
    <Frame className={className} label="Link tracciati">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 rounded-2xl bg-paper px-3 py-2.5">
          <Link2 className="h-4 w-4 text-brand" />
          <span className="flex-1 truncate font-mono text-[11px]">app.influencee.it/r/mrt-autunno</span>
          <Copy className="h-3.5 w-3.5 text-mute" />
          <QrCode className="h-3.5 w-3.5 text-mute" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-paper p-3">
            <p className="flex items-center gap-1 text-[10px] text-mute">
              <MousePointerClick className="h-3 w-3" /> Click
            </p>
            <p className="font-heading text-xl font-semibold">1.248</p>
          </div>
          <div className="rounded-xl bg-ink p-3 text-white">
            <p className="text-[10px] text-white/60">Visitatori unici</p>
            <p className="font-heading text-xl font-semibold text-acid">903</p>
          </div>
        </div>
        <div className="mt-3 flex h-20 items-end gap-1.5 rounded-xl bg-paper p-3">
          {bars.map((b, i) => (
            <motion.span key={i} initial={{ height: 0 }} whileInView={{ height: `${b}%` }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`flex-1 rounded-t-md ${i === bars.length - 1 ? 'bg-brand' : 'bg-ink/15'}`} />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-mute">UTM già inseriti · nessun IP salvato · bot esclusi</p>
      </div>
    </Frame>
  );
}

/** Media kit del creator con data dei dati e link pubblico. */
export function KitMock({ className = '' }: { className?: string }) {
  return (
    <Frame className={className} label="influencee.it/kit/marta-lombardi">
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[110px_1fr] sm:p-5">
        <div className="rounded-2xl bg-brand-soft p-3 text-center">
          <Initials name="Marta Lombardi" className="mx-auto h-14 w-14 text-base" />
          <p className="mt-2 text-[11px] font-semibold">Marta Lombardi</p>
          <p className="text-[9px] text-mute">Food · Bologna</p>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              ['IG', '34K'],
              ['TikTok', '12K'],
              ['YouTube', '3,1K'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-paper p-2">
                <p className="text-[9px] text-mute">{k}</p>
                <p className="font-heading text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] font-semibold">In vetrina</p>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((k) => (
              <div key={k} className={`aspect-[9/12] rounded-lg ${['bg-brand-soft', 'bg-acid-soft', 'bg-paper'][k]}`} />
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1 text-[9px] text-mute">
            <Star className="h-3 w-3 fill-acid text-acid" /> Dati al 12/10 · Scarica PDF
          </p>
        </div>
      </div>
    </Frame>
  );
}

/** Bacheca annunci pubblica. */
export function AnnunciMock({ className = '' }: { className?: string }) {
  const items = [
    ['Cerchiamo 5 UGC creator per una linea skincare', 'Beauty · UGC · Compenso in denaro'],
    ['Ristorante a Milano cerca food creator', 'Food · Locale · Ospitalità'],
    ['Video unboxing per un accessorio tech', 'Tech · Cambio merce'],
  ];
  return (
    <Frame className={className} label="app.influencee.it/annunci">
      <div className="space-y-2 p-4 sm:p-5">
        {items.map(([t, s], i) => (
          <div key={t} className="flex items-center gap-3 rounded-2xl bg-paper/70 px-3 py-3">
            <span className={`h-9 w-9 shrink-0 rounded-xl ${['bg-brand', 'bg-acid', 'bg-ink'][i]}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">{t}</p>
              <p className="truncate text-[10px] text-mute">{s}</p>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold ring-1 ring-line">Candidati</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** Iscrizione creator: profilo che si completa con il punteggio. */
export function SignupMock({ className = '' }: { className?: string }) {
  const steps = [
    ['Accedi', 'Google o link via email', 20],
    ['Chi sei', 'Nome e comune', 30],
    ['I tuoi social', 'Instagram, TikTok, YouTube', 30],
    ['Bonus', 'Categorie e prezzi', 10],
  ];
  return (
    <Frame className={className} label="Iscrizione creator">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold">Profilo completato</span>
          <span className="font-heading text-lg font-semibold text-brand">90</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '90%' }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-full bg-brand" />
        </div>
        <div className="mt-4 space-y-2">
          {steps.map(([t, s, p], i) => (
            <div key={t as string} className="flex items-center gap-3 rounded-2xl bg-paper/70 px-3 py-2.5">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${i < 3 ? 'bg-brand text-white' : 'bg-white text-mute'}`}>{i < 3 ? '✓' : i + 1}</span>
              <div className="flex-1">
                <p className="text-[12px] font-semibold">{t as string}</p>
                <p className="text-[10px] text-mute">{s as string}</p>
              </div>
              <span className="text-[10px] font-semibold text-mute">+{p as number}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-acid-soft px-3 py-2 text-[10px] font-semibold">
          <BadgeCheck className="h-3.5 w-3.5 fill-brand text-white" /> Social collegato: badge Verificato
        </p>
      </div>
    </Frame>
  );
}

/* ─── Discovery: la schermata centrale della home ───────────────────
   Griglia di creator come nell'app (/people). Profili di esempio: fino
   all'arrivo dei ritratti generati (Drive 01_creator) si usano tessere
   colorate con le iniziali; passare `photos` per mostrare i ritratti.   */
const GRID = [
  { n: 'Marta Lombardi', cat: 'Cucina e food', city: 'Bologna', tier: 'Micro', f: '34K', er: '4,1%', pl: 'IG · TikTok' },
  { n: 'Luca Ferri', cat: 'Fitness e sport', city: 'Milano', tier: 'Mid', f: '86K', er: '2,9%', pl: 'IG · YouTube' },
  { n: 'Sara Conte', cat: 'Beauty', city: 'Napoli', tier: 'Micro', f: '22K', er: '5,3%', pl: 'TikTok' },
  { n: 'Davide Greco', cat: 'Viaggi', city: 'Palermo', tier: 'Nano', f: '8,4K', er: '6,0%', pl: 'IG' },
  { n: 'Giulia Riva', cat: 'Moda', city: 'Roma', tier: 'Macro', f: '310K', er: '1,8%', pl: 'IG · TikTok' },
  { n: 'Paolo Neri', cat: 'Tecnologia', city: 'Torino', tier: 'Mid', f: '64K', er: '3,4%', pl: 'YouTube' },
  { n: 'Elena Bassi', cat: 'Famiglia', city: 'Bari', tier: 'Micro', f: '41K', er: '4,7%', pl: 'IG' },
  { n: 'Marco Villa', cat: 'Gaming', city: 'Firenze', tier: 'Micro', f: '29K', er: '5,0%', pl: 'TikTok · YouTube' },
];
const TILE = ['from-brand to-[#ff7ac0]', 'from-acid to-[#e8ff8a]', 'from-ink to-[#4a4a52]', 'from-[#ffb3d9] to-brand-soft'];

export function DiscoveryMock({ photos = [], className = '' }: { photos?: string[]; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[26px] bg-white text-left text-ink shadow-[0_40px_120px_-30px_rgba(255,31,143,0.45)] ring-1 ring-white/20 ${className}`}>
      {/* barra superiore */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs text-mute">
          <Search className="h-3.5 w-3.5" /> Cerca creator per nome, handle o parola chiave
        </div>
        <span className="hidden rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white sm:block">Scopri creator</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
        {/* filtri */}
        <aside className="hidden border-r border-line p-4 md:block">
          {[
            ['Categoria', ['Cucina e food', 'Beauty', 'Fitness e sport', 'Moda']],
            ['Fascia', ['Nano', 'Micro', 'Mid', 'Macro']],
            ['Fiducia', ['Verificato', 'Premium']],
          ].map(([t, opts], gi) => (
            <div key={t as string} className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">{t as string}</p>
              <div className="mt-2 space-y-1.5">
                {(opts as string[]).map((o, i) => {
                  const on = (gi === 0 && i < 2) || (gi === 1 && i === 1) || (gi === 2 && i === 0);
                  return (
                    <span key={o} className="flex items-center gap-2 text-[12px]">
                      <span className={`flex h-3.5 w-3.5 items-center justify-center rounded ${on ? 'bg-brand text-white' : 'ring-1 ring-line'}`}>{on && <CheckCircle2 className="h-2.5 w-2.5" />}</span>
                      {o}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Regione</p>
          <span className="mt-2 flex items-center justify-between rounded-lg bg-paper px-2.5 py-1.5 text-[12px]">
            Tutta Italia <SlidersHorizontal className="h-3 w-3 text-mute" />
          </span>
        </aside>
        {/* risultati */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {['Food', 'Beauty', 'Micro', 'Verificato'].map((t) => (
                <span key={t} className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-brand-ink">
                  {t} ×
                </span>
              ))}
            </div>
            <span className="text-[11px] text-mute">Ordina: engagement ↓</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {GRID.map((c, i) => (
              <motion.div key={c.n} initial={entrance({ opacity: 0, y: 14 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }} className={`overflow-hidden rounded-2xl bg-paper/70 ring-1 ring-line/60 ${i > 3 ? 'hidden sm:block' : ''} ${i > 5 ? 'sm:hidden lg:block' : ''}`}>
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${TILE[i % TILE.length]}`}>
                  {photos[i] ? (
                    <img src={photos[i]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <span className={`absolute inset-0 flex items-center justify-center font-heading text-3xl font-semibold tracking-tight ${i % TILE.length === 2 ? 'text-white/90' : 'text-ink/80'}`}>
                      {c.n
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </span>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold">{c.tier}</span>
                  {i !== 2 && <BadgeCheck className="absolute right-2 top-2 h-4 w-4 fill-brand text-white" />}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[12px] font-semibold">{c.n}</p>
                  <p className="truncate text-[10px] text-mute">
                    {c.cat} · {c.city}
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <p className="font-heading text-[14px] font-semibold leading-none">{c.f}</p>
                      <p className="mt-0.5 text-[9px] text-mute">{c.pl}</p>
                    </div>
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold">ER {c.er}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Calendario campagne con scadenze e consegne in ritardo. */
export function CalendarMock({ className = '' }: { className?: string }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const ev: Record<number, [string, string]> = { 3: ['Brief', 'bg-paper'], 7: ['Reel Marta', 'bg-brand text-white'], 11: ['Storie Luca', 'bg-acid'], 14: ['In ritardo', 'bg-ink text-white'], 18: ['Reel Sara', 'bg-brand text-white'], 22: ['Post Davide', 'bg-acid'], 26: ['Report', 'bg-paper'] };
  return (
    <Frame className={className} label="Calendario campagne">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading font-semibold">Novembre</p>
          <div className="flex gap-1 rounded-full bg-paper p-1 text-[10px] font-semibold">
            <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Calendario</span>
            <span className="px-2.5 py-1 text-mute">Lista</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[9px] text-mute">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div key={d} className="flex aspect-square flex-col rounded-lg bg-paper/60 p-1">
              <span className="text-[9px] text-mute">{d}</span>
              {ev[d] && <span className={`mt-auto truncate rounded px-1 py-0.5 text-[7px] font-semibold sm:text-[8px] ${ev[d][1]}`}>{ev[d][0]}</span>}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** Contratto generato dai termini accettati. */
export function ContractMock({ className = '' }: { className?: string }) {
  return (
    <Frame className={className} label="Contratto di collaborazione">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand" />
          <p className="font-heading font-semibold">Contratto · Lancio menu autunno</p>
        </div>
        <div className="mt-4 space-y-2.5">
          {[
            ['Parti', 'Brand ↔ Creator'],
            ['Contenuti', '2 reel · 3 storie entro il 18/11'],
            ['Compenso', 'Denaro + cambio merce'],
            ['Diritti d’uso', 'Organico e ads, 6 mesi'],
            ['Versione accettata', 'Termini v3 · doppia accettazione'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2 text-[11px]">
              <span className="text-mute">{k}</span>
              <span className="text-right font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-ink px-3 py-2.5 text-[11px] text-white">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-acid" /> Impronta del documento registrata
          </span>
          <span className="font-semibold text-acid">DOCX · PDF</span>
        </div>
      </div>
    </Frame>
  );
}

/** Livelli del dato e badge di fiducia. */
export function TrustMock({ className = '' }: { className?: string }) {
  const lv = [
    ['Autenticato', 'Account collegato con login ufficiale', 'bg-brand text-white', 100],
    ['Dichiarato', 'Inserito dal creator in iscrizione', 'bg-acid', 80],
    ['Osservato', 'Letto da fonti pubbliche', 'bg-ink text-white', 60],
    ['Stimato', 'Calcolato con regole note', 'bg-paper', 40],
  ];
  return (
    <Frame className={className} label="Fonte dei dati">
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-semibold text-brand-ink">
            <BadgeCheck className="h-4 w-4 fill-brand text-white" /> Verificato
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-acid-soft px-3 py-1.5 text-[11px] font-semibold">
            <Star className="h-3.5 w-3.5 fill-acid text-ink" /> Premium
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {lv.map(([t, s, c, w], i) => (
            <div key={t as string} className="rounded-xl bg-paper/70 p-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold">{t as string}</span>
                <span className="text-[10px] text-mute">{s as string}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className={`h-full rounded-full ${(c as string).split(' ')[0]}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
