import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CreditCard,
  FileText,
  Instagram,
  MessageCircle,
  Music2,
  Search,
  ShoppingBag,
  Sparkles,
  Twitch,
  Users,
  Wallet,
  Youtube,
  CalendarDays,
  Megaphone,
  Link2,
} from 'lucide-react';
import { Button, Container, Eyebrow, GAP, Heading, Lead, Section, SectionHeader, TYPE, reveal, type Tone } from '../ds';
import { CREATORS_DB, fmtFollowers } from '../site/data';

/* ════════════════════════════════════════════════════════════════════
   Composizioni in stile "Spoki": card di interfaccia che fluttuano su un
   fondo chiaro appena colorato, stelline, ombre molto diffuse, bolle di
   chat. Tutto in HTML: testi veri, nitidi e animati.
   ════════════════════════════════════════════════════════════════════ */

const GLOW = 'bg-[radial-gradient(ellipse_at_top_right,rgba(200,255,26,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,31,143,0.12),transparent_55%)]';
const FLOAT_CARD = 'rounded-3xl bg-white shadow-[0_30px_70px_-30px_rgba(29,29,31,0.25)] ring-1 ring-black/[0.04]';

export function Spark({ className = '', color = '#c8ff1a' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0c.9 6.4 3.6 9.6 12 12-8.4 2.4-11.1 5.6-12 12C11.1 17.6 8.4 14.4 0 12 8.4 9.6 11.1 6.4 12 0z" fill={color} />
      <path d="M20 1c.3 2 1.1 2.8 3 3-1.9.2-2.7 1-3 3-.3-2-1.1-2.8-3-3 1.9-.2 2.7-1 3-3z" fill={color} />
    </svg>
  );
}

/* ─── 53 · Telefono con ciclo tratteggiato e bolle di chat ──────── */
export function OrbitPhone({ className = '' }: { className?: string }) {
  const c = CREATORS_DB[0];
  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[520px] ${className}`}>
      <div className="absolute inset-[6%] rounded-full bg-[#f4f4f4]" />
      {/* ciclo tratteggiato con frecce */}
      <svg viewBox="0 0 100 100" className="absolute inset-[10%] h-[80%] w-[80%] overflow-visible">
        <motion.circle cx="50" cy="50" r="48" fill="none" stroke="#1d1d1f" strokeWidth="0.45" strokeDasharray="1.4 1.4" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -28 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
        <path d="M96.5 55 l1.5 -3 l1.5 3 z" fill="#1d1d1f" transform="rotate(180 98 53.5)" />
        <path d="M0.5 45 l1.5 -3 l1.5 3 z" fill="#9a9a9a" />
      </svg>
      <span className="absolute left-1/2 top-[7%] z-20 -translate-x-1/2 rounded-full bg-ink px-5 py-2 font-heading text-lg font-semibold text-white">48h</span>
      <Spark className="absolute left-[10%] top-[20%] h-8 w-8" />
      <span className="absolute right-[6%] top-[28%] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-float">
        <Spark className="h-7 w-7" color="#ff1f8f" />
      </span>
      <span className="absolute bottom-[26%] left-[2%] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-float">
        <Instagram className="h-6 w-6" />
      </span>

      {/* telefono */}
      <div className="absolute inset-x-[27%] bottom-0 top-[19%] rounded-t-[2.2rem] border-2 border-b-0 border-ink bg-[#f1efea]">
        <div className="flex items-center gap-2 p-4">
          <img src={c.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="text-xs font-semibold">{c.name}</p>
            <p className="text-[10px] text-mute">Online</p>
          </div>
        </div>
      </div>

      {/* bolle */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="absolute left-[20%] top-[34%] z-10 w-[36%] rounded-2xl rounded-tl-none bg-white p-2.5 shadow-float">
        <img src={c.cover} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
        <p className="mt-2 text-[11px] leading-snug sm:text-xs">Ciao Giulia! Ecco il brief della campagna Estate: 1 reel + 3 stories.</p>
        <p className="mt-2 flex items-center justify-center gap-1 border-t border-line pt-2 text-[11px] font-medium text-brand">
          <FileText className="h-3.5 w-3.5" /> Apri il brief
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="absolute right-[10%] top-[55%] z-10 rounded-2xl rounded-br-none bg-acid-soft px-4 py-3 shadow-float">
        <p className="text-sm">Perfetto, consegno giovedì 😎</p>
        <p className="text-right text-[10px] text-mute">11:14</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }} className="absolute bottom-[10%] left-[16%] z-10 rounded-2xl rounded-tl-none bg-brand-soft px-4 py-3 shadow-float">
        <p className="flex items-center gap-1.5 text-sm">
          Contenuto approvato <Sparkles className="h-4 w-4 text-brand" />
        </p>
      </motion.div>
    </div>
  );
}

/** Row: testo + telefono con ciclo. */
export function OrbitSection({ tone = 'white', eyebrow = 'Collaborazioni', title = 'Dal brief al contenuto\n*in 48 ore*', lead = 'Brand e creator si parlano in un unico posto: brief, consegne, revisioni e approvazioni, senza email che si perdono.', reverse = false }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string; reverse?: boolean }) {
  return (
    <Section tone={tone}>
      <Container className={`grid items-center gap-12 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <SectionHeader align="left" eyebrow={eyebrow} title={title} lead={lead} />
          <ul className="mt-8 space-y-3">
            {['Brief chiaro in una pagina, con date e formati', 'Chat diretta con ogni creator', 'Revisioni e approvazioni tracciate'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[15px]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-acid text-ink">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <OrbitPhone />
      </Container>
    </Section>
  );
}

/* ─── 54 · Scena di card che fluttuano ──────────────────────────── */
export function FloatingScene({ className = '' }: { className?: string }) {
  const c = CREATORS_DB[4];
  return (
    <div className={`relative mx-auto h-[460px] w-full max-w-[560px] ${className}`}>
      <motion.div {...reveal(0)} className={`absolute left-0 top-16 w-[62%] overflow-hidden ${FLOAT_CARD}`}>
        <div className="relative">
          <img src={c.cover} alt="" className="aspect-[16/9] w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-acid px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">Campagna</span>
          <Spark className="absolute -bottom-3 left-3 h-6 w-6" />
        </div>
        <div className="p-5">
          <p className="font-heading text-lg font-semibold tracking-tight">Lancio collezione Estate</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-mute">
            <span className="h-2 w-2 rounded-full bg-acid" /> 12 creator fashion
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-mute">
            <span className="h-2 w-2 rounded-full bg-acid" /> Milano · Roma · Torino
          </p>
        </div>
      </motion.div>

      <motion.div {...reveal(1)} className={`absolute right-0 top-0 w-[58%] ${FLOAT_CARD}`}>
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <b className="font-heading">influencee</b>
          <span className="text-xs text-mute">Online</span>
        </div>
        <div className="space-y-2 p-4 text-[13px]">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-none bg-acid-soft px-3 py-2">Vorrei 10 creator fashion a Milano sotto i 100K.</p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-none bg-[#f4f4f4] px-3 py-2">
            <b>Shortlist pronta ✅</b>
            <br />
            12 profili verificati, match medio 91%.
          </p>
        </div>
      </motion.div>
      <motion.span {...reveal(2)} className="absolute right-[6%] top-[246px] z-10 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-float">
        <Check className="h-4 w-4 text-brand" /> Collaborazione confermata
      </motion.span>

      <motion.div {...reveal(3)} className={`absolute bottom-0 right-[4%] z-20 w-[62%] p-5 ${FLOAT_CARD}`}>
        <p className="font-heading font-semibold">Le campagne influencee</p>
        <div className="relative mt-3 grid grid-cols-3 rounded-2xl bg-[#f6f7f4] p-3 text-xs text-mute">
          {[
            ['Campagne', '120+'],
            ['Creator', '5.000+'],
            ['Città', '40'],
          ].map(([k, v]) => (
            <div key={k}>
              {k}
              <p className="mt-1 flex items-center gap-1.5 font-heading text-xl font-semibold text-ink">
                <span className="h-2 w-2 rounded-full bg-acid" /> {v}
              </p>
            </div>
          ))}
          <Spark className="absolute -right-2 -top-3 h-6 w-6" />
        </div>
      </motion.div>
    </div>
  );
}

/** Hero in stile pagina "Feature" di Spoki: testo a sinistra, scena di card a destra, fondo sfumato. */
export function HeroFeatures({ eyebrow = 'Funzionalità', title = 'Tutto quello che puoi fare\ncon *influencee*', lead = 'Dalla ricerca dei creator al report finale: scopri le funzioni che rendono le campagne più semplici, veloci e misurabili.' }: { eyebrow?: string; title?: string; lead?: string }) {
  return (
    <Section tone="white" pad="none" className="py-14 sm:py-20">
      <div className={`pointer-events-none absolute inset-0 ${GLOW}`} />
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div {...reveal()}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mt-6 lg:!text-[4.2rem]" />
          <Lead className="mt-6 max-w-md">{lead}</Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#contatti">Richiedi una demo</Button>
            <Button href="#piattaforma" variant="secondary" arrow>
              Guarda la piattaforma
            </Button>
          </div>
        </motion.div>
        <FloatingScene />
      </Container>
    </Section>
  );
}

/* ─── 55 · Esplora le funzioni: schede + pannello + griglia ─────── */
const TABS = [
  { id: 'ricerca', label: 'Ricerca creator', icon: Search },
  { id: 'campagne', label: 'Campagne', icon: Megaphone },
  { id: 'contenuti', label: 'Contenuti', icon: CalendarDays },
  { id: 'report', label: 'Report', icon: BarChart3 },
];

function TabPanel({ id }: { id: string }) {
  const list = CREATORS_DB.slice(id === 'campagne' ? 3 : 0, (id === 'campagne' ? 3 : 0) + 3);
  const right: Record<string, React.ReactNode> = {
    ricerca: (
      <>
        <p className="w-fit rounded-2xl rounded-tl-none bg-[#f4f4f4] px-3 py-2 text-[13px]">Filtri: Beauty · 10–100K · ER &gt; 5%</p>
        <p className="ml-auto w-fit rounded-2xl rounded-br-none bg-acid-soft px-3 py-2 text-[13px]">38 creator trovati, ordinati per match</p>
      </>
    ),
    campagne: (
      <>
        <p className="w-fit rounded-2xl rounded-tl-none bg-[#f4f4f4] px-3 py-2 text-[13px]">Brief inviato a 7 creator</p>
        <p className="ml-auto w-fit rounded-2xl rounded-br-none bg-acid-soft px-3 py-2 text-[13px]">5 hanno accettato · 2 in attesa</p>
      </>
    ),
    contenuti: (
      <>
        <p className="w-fit rounded-2xl rounded-tl-none bg-[#f4f4f4] px-3 py-2 text-[13px]">Nuovo reel da approvare</p>
        <p className="ml-auto w-fit rounded-2xl rounded-br-none bg-acid-soft px-3 py-2 text-[13px]">Approvato ✓ · pubblicazione giovedì 18:00</p>
      </>
    ),
    report: (
      <>
        <p className="w-fit rounded-2xl rounded-tl-none bg-[#f4f4f4] px-3 py-2 text-[13px]">Reach 1,2M · ER 5,8%</p>
        <p className="ml-auto w-fit rounded-2xl rounded-br-none bg-acid-soft px-3 py-2 text-[13px]">612 vendite dai codici sconto · ROI 4,1x</p>
      </>
    ),
  };
  return (
    <div className="grid overflow-hidden rounded-3xl bg-white text-left shadow-[0_30px_70px_-30px_rgba(29,29,31,0.22)] ring-1 ring-black/[0.04] sm:grid-cols-[240px_1fr]">
      <div className="border-b border-line p-4 sm:border-b-0 sm:border-r">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mute">{TABS.find((t) => t.id === id)?.label}</p>
        <div className="mt-3 space-y-1.5">
          {list.map((c, i) => (
            <div key={c.slug} className={`flex items-center gap-2 rounded-xl px-2 py-2 text-sm ${i === 0 ? 'bg-brand-soft' : ''}`}>
              <img src={c.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
              <span className="flex-1 truncate">{c.handle}</span>
              <span className="text-[11px] text-mute">{fmtFollowers(c.followers)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative space-y-2 p-5">
        <div className="flex items-center gap-2 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <b className="text-sm">influencee</b>
          <span className="rounded-full bg-acid px-2 text-[10px] font-semibold">live</span>
        </div>
        {right[id]}
        <span className="absolute -bottom-3 right-4 rounded-full bg-acid px-3 py-1 text-xs font-semibold shadow-float">Aggiornato ora</span>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Search, stat: '5.000+ profili', title: 'Database creator', text: 'Solo creator italiani, filtrabili per nicchia, città, fascia ed engagement.' },
  { icon: BadgeCheck, stat: 'Verificato', title: 'Badge di affidabilità', text: 'Badge Verificato e Premium per riconoscere subito i profili migliori.' },
  { icon: Users, stat: 'nano → mega', title: 'Fasce e tipologie', text: 'UGC, influencer, professional e VIP, dalle fasce nano alle mega.' },
  { icon: Megaphone, stat: 'multi-creator', title: 'Gestione campagne', text: 'Brief, inviti, accettazioni e consegne di tutti i creator in una bacheca.' },
  { icon: MessageCircle, stat: 'in tempo reale', title: 'Chat brand-creator', text: 'Messaggi e allegati nella stessa conversazione della campagna.' },
  { icon: FileText, stat: 'PDF in 1 clic', title: 'Media kit', text: 'Il media kit del creator generato dai dati aggiornati del profilo.' },
  { icon: BarChart3, stat: 'per fascia', title: 'Benchmark', text: 'Confronta engagement e costi con i valori medi della fascia.' },
  { icon: Link2, stat: 'link e codici', title: 'Tracker collaborazioni', text: 'Click e vendite tracciate con link dedicati e codici sconto.' },
];

export function FeatureExplorer({ tone = 'white', eyebrow = 'Funzionalità', title = 'Esplora cosa puoi fare\ncon *influencee*', lead = 'Scegli una funzione e guarda come lavora: ogni parte della campagna, dalla ricerca al report.' }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string }) {
  const [tab, setTab] = useState(TABS[0].id);
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} flex flex-wrap justify-center gap-2`} role="tablist">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'bg-acid text-ink' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/30'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
        <div className="relative mx-auto mt-8 max-w-3xl">
          <div className={`pointer-events-none absolute -inset-10 rounded-[48px] ${GLOW}`} />
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="relative">
              <TabPanel id={tab} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.a key={f.title} href="#piattaforma" {...reveal(i % 4)} className="group rounded-3xl bg-white p-6 ring-1 ring-line transition hover:-translate-y-1 hover:shadow-card">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-acid-soft text-ink">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-brand">{f.stat}</span>
              </div>
              <p className={`mt-5 ${TYPE.h3} !text-lg`}>{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{f.text}</p>
              <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-brand">
                Scopri <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </p>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 56 · Integrazioni a raggiera ──────────────────────────────── */
const INTEGRATIONS = [
  { icon: Instagram, label: 'Instagram', color: '#e1306c' },
  { icon: Music2, label: 'TikTok', color: '#1d1d1f' },
  { icon: Youtube, label: 'YouTube', color: '#ff0000' },
  { icon: Twitch, label: 'Twitch', color: '#9146ff' },
  { icon: CreditCard, label: 'Stripe', color: '#635bff' },
  { icon: ShoppingBag, label: 'Shopify', color: '#5e8e3e' },
  { icon: Wallet, label: 'PayPal', color: '#003087' },
  { icon: BarChart3, label: 'Google Analytics', color: '#f9ab00' },
];

export function IntegrationsOrbit({ tone = 'white', title = 'Integrazioni', lead = 'influencee si collega alle piattaforme dei creator e agli strumenti del brand: dati dagli account ufficiali, pagamenti e vendite tracciate nello stesso posto.' }: { tone?: Tone; title?: string; lead?: string }) {
  const R = 40;
  return (
    <Section tone={tone}>
      <Container>
        <div className="grid items-center gap-10 rounded-[32px] bg-white p-8 ring-1 ring-line sm:p-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Heading text={title} />
            <Lead className="mt-5 max-w-md">{lead}</Lead>
            <div className="mt-8">
              <Button href="#contatti" variant="secondary" arrow>
                Parla con noi
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {INTEGRATIONS.map((_, i) => {
                const a = (i / INTEGRATIONS.length) * Math.PI * 2 - Math.PI / 2;
                return <line key={i} x1="50" y1="50" x2={50 + Math.cos(a) * R} y2={50 + Math.sin(a) * R} stroke="#e4e4e4" strokeWidth="0.4" strokeDasharray="1 1" />;
              })}
            </svg>
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-acid px-5 py-2.5 font-heading font-semibold shadow-float">
              <Sparkles className="h-4 w-4" /> influencee
            </span>
            {INTEGRATIONS.map(({ icon: Icon, label, color }, i) => {
              const a = (i / INTEGRATIONS.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, type: 'spring' }}
                  title={label}
                  className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-float ring-1 ring-black/[0.04]"
                  style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%`, color }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute top-full mt-1.5 whitespace-nowrap text-[10px] font-medium text-mute">{label}</span>
                </motion.span>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 57 · Risultati per settore ────────────────────────────────── */
const SECTOR_RESULTS: Record<string, [string, string, string][]> = {
  Food: [
    ['Reach', '+307%', 'persone raggiunte rispetto alle campagne precedenti'],
    ['Vendite', '+40%', 'ordini online nei 30 giorni della campagna'],
    ['Engagement', '+25%', 'interazioni medie per contenuto'],
    ['Costo', '−18%', 'costo per acquisizione con i contenuti UGC'],
  ],
  Beauty: [
    ['Views', '2,4M', 'views in 30 giorni con 12 micro creator'],
    ['Engagement', '2x', 'rispetto alla media del brand'],
    ['Codici', '+612', 'vendite dai codici sconto personali'],
    ['Contenuti', '48', 'contenuti riutilizzati nelle ads'],
  ],
  Agenzie: [
    ['Tempo', '−12h', 'a settimana nella gestione delle campagne'],
    ['Campagne', '40', 'gestite in piattaforma in un anno'],
    ['Report', '100%', 'condivisi con i clienti in tempo reale'],
    ['Creator', '+300', 'profili aggiunti alle shortlist'],
  ],
};

export function SectorResults({ tone = 'white', title = 'Clienti veri, *risultati misurabili*', lead = 'Esempi di risultati per settore. Numeri di esempio da sostituire con i dati reali delle campagne.' }: { tone?: Tone; title?: string; lead?: string }) {
  const sectors = Object.keys(SECTOR_RESULTS);
  const [s, setS] = useState(sectors[0]);
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader title={title} lead={lead} />
        <div className={`${GAP.header} flex justify-center gap-2`}>
          {sectors.map((x) => (
            <button key={x} type="button" onClick={() => setS(x)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${s === x ? 'bg-ink text-white' : 'bg-white ring-1 ring-line'}`}>
              {x}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={s} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTOR_RESULTS[s].map(([k, v, t]) => (
              <div key={k} className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-card">
                <span className="rounded-full bg-acid-soft px-2.5 py-1 text-xs font-semibold">{k}</span>
                <p className={`mt-5 ${TYPE.number}`}>{v}</p>
                <p className="mt-2 text-sm text-mute">{t}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  );
}

/* ─── 58 · Fascia CTA con modulo (verde acido) ──────────────────── */
export function CtaForm({ title = 'Prova influencee per il tuo brand', lead = 'Lasciaci i tuoi dati: ti mostriamo la piattaforma con creator adatti al tuo settore.' }: { title?: string; lead?: string }) {
  const [sent, setSent] = useState(false);
  return (
    <Section tone="soft" id="contatti">
      <Container className="max-w-2xl text-center">
        <Heading text={title} />
        <Lead className="mx-auto mt-4 max-w-md !text-ink/70">{lead}</Lead>
        {sent ? (
          <p className="mt-10 rounded-3xl bg-white p-8 font-heading text-lg font-semibold">Richiesta pronta ✓ (prototipo: il modulo non invia ancora i dati)</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-10 grid gap-3 text-left sm:grid-cols-2"
          >
            {[
              ['cf-name', 'Nome', 'text', ''],
              ['cf-surname', 'Cognome', 'text', ''],
              ['cf-email', 'Email aziendale', 'email', 'sm:col-span-2'],
              ['cf-company', 'Azienda', 'text', 'sm:col-span-2'],
            ].map(([id, l, t, span]) => (
              <label key={id} htmlFor={id} className={span}>
                <span className="sr-only">{l}</span>
                <input id={id} type={t} required={id !== 'cf-company'} placeholder={l} className="h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 ring-black/10 focus:ring-ink" />
              </label>
            ))}
            <button type="submit" className="h-12 rounded-xl bg-ink font-semibold text-white transition hover:bg-ink-2 sm:col-span-2">
              Richiedi una demo
            </button>
          </form>
        )}
      </Container>
    </Section>
  );
}
