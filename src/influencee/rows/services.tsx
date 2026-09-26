import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, CalendarDays, FileText, Image, PenLine, Plus, Search, Send, Share2, Sparkles, Target, Users } from 'lucide-react';
import { Card, Container, GAP, Navbar, Section, SectionHeader, TYPE, isDark, reveal, type Tone } from '../ds';
import { CREATORS, IMG, NICHES, SERVICES, STATS, STEPS } from '../content';

/* ─── 16 · Nicchie a pillole ────────────────────────────────────── */
export function NichePills({ tone = 'white', eyebrow = 'Per ogni nicchia', title = 'Creator per\n*il tuo settore*', lead = 'Filtra per nicchia, città, dimensione e performance: troviamo profili affini al tuo pubblico.', items = NICHES }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string; items?: string[] }) {
  const styles = ['bg-brand text-white', 'bg-ink text-white', 'bg-brand-soft text-brand-ink', 'bg-white text-ink ring-1 ring-line'];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} mx-auto flex max-w-3xl flex-wrap justify-center gap-3`}>
          {items.map((it, i) => (
            <motion.span
              key={it}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              whileHover={{ y: -4, rotate: i % 2 ? 2 : -2 }}
              className={`cursor-default rounded-full px-6 py-3 font-heading text-lg font-semibold tracking-tight ${styles[i % styles.length]}`}
            >
              {it}
            </motion.span>
          ))}
        </div>
      </Container>
    </Section>
  );
}

const STAT_BG = ['bg-brand text-white', 'bg-ink text-white', 'bg-acid text-ink'];

/* ─── 19 · About / valori + statistiche ─────────────────────────── */
export function AboutValues({ tone = 'white', showNav = true, eyebrow = 'Chi siamo', title = 'Autenticità e dati\nal centro di *ogni scelta*', lead = 'Crediamo nelle collaborazioni vere tra brand e creator: per questo selezioniamo con metodo e misuriamo tutto.', images = [IMG.event, IMG.people[0]] }: { tone?: Tone; showNav?: boolean; eyebrow?: string; title?: string; lead?: string; images?: string[] }) {
  return (
    <Section tone={tone} pad={showNav ? 'hero' : 'default'}>
      {showNav && <Navbar />}
      <Container className={showNav ? 'pt-12 sm:pt-16' : ''}>
        <SectionHeader align="left" eyebrow={eyebrow} title={title} lead={lead} size="display" as={showNav ? 'h1' : 'h2'} />
        <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-[2fr_1fr]`}>
          {images.map((src, i) => (
            <motion.img key={i} {...reveal(i)} src={src} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover sm:aspect-auto sm:h-[420px]" />
          ))}
        </div>
        <div className={`mt-5 grid ${GAP.grid} sm:grid-cols-3`}>
          {STATS.slice(0, 3).map((s, i) => (
            <motion.div key={s.label} {...reveal(i + 1)} className={`rounded-3xl p-7 ${STAT_BG[i % STAT_BG.length]}`}>
              <p className={TYPE.number}>
                {s.value.toLocaleString('it-IT')}
                {s.suffix}
              </p>
              <p className="mt-3 text-sm opacity-80">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 22 · Processo in step (dark) ──────────────────────────────── */
const ORBIT = [FileText, Users, Image, Share2, BarChart3, Sparkles];
const ACTIONS: [typeof PenLine, string][] = [
  [Search, 'Seleziona'],
  [PenLine, 'Brief'],
  [CalendarDays, 'Pianifica'],
  [Send, 'Pubblica'],
];

export function ProcessSteps({ tone = 'ink', eyebrow = 'Come funziona', title = 'Dalla strategia ai risultati,\n*senza fatica*', lead = 'Pianifichiamo, selezioniamo e lanciamo campagne con i creator che portano engagement e vendite in modo costante.', steps = STEPS.slice(0, 3) }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string; steps?: typeof STEPS }) {
  const bars = [84, 46, 68, 58, 85, 62];
  const acc = isDark(tone) ? 'bg-acid text-ink' : 'bg-brand text-white';
  const visuals = [
    <div key="o" className="relative mx-auto h-44 w-44">
      <div className="absolute inset-4 rounded-full border border-white/15" />
      <div className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl ${acc}`}>
        <Target className="h-6 w-6" />
      </div>
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
        {ORBIT.map((Icon, i) => {
          const a = (i / ORBIT.length) * Math.PI * 2;
          return (
            <span key={i} className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink ring-1 ring-white/15" style={{ left: `${50 + Math.cos(a) * 40}%`, top: `${50 + Math.sin(a) * 40}%` }}>
              <Icon className="h-3.5 w-3.5 text-white/80" />
            </span>
          );
        })}
      </motion.div>
    </div>,
    <div key="a" className="grid grid-cols-2 gap-2">
      {ACTIONS.map(([Icon, l]) => (
        <div key={l} className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 py-5 text-xs text-white">
          <Icon className="h-5 w-5" /> {l}
        </div>
      ))}
    </div>,
    <div key="b" className="flex h-44 items-end justify-center gap-2">
      {bars.map((v, i) => (
        <div key={i} className="flex h-36 w-7 items-end rounded-lg bg-white/5">
          <motion.div initial={{ height: 0 }} whileInView={{ height: `${v}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} className={`w-full rounded-lg ${acc}`}>
            <span className="block pt-1 text-center text-[8px] font-bold">{v}%</span>
          </motion.div>
        </div>
      ))}
    </div>,
  ];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} grid ${GAP.grid} md:grid-cols-3`}>
          {steps.map((s, i) => (
            <motion.div key={s.title} {...reveal(i)}>
              <Card className="h-full p-2">
                <div className="relative rounded-2xl bg-white/5 p-5 pt-12">
                  <span className={`absolute left-4 top-4 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${acc}`}>Step 0{i + 1}</span>
                  {visuals[i % visuals.length]}
                </div>
                <div className="p-5">
                  <p className={TYPE.h3}>{s.title}</p>
                  <p className="mt-2 text-sm text-white/60">{s.text}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 25 · Servizi ad accordion ─────────────────────────────────── */
export function ServicesAccordion({ tone = 'ink', eyebrow = 'Servizi', title = 'Come possiamo aiutarti\na *crescere con i creator*', lead = 'Per brand, agenzie e centri media in tutta Italia.', items = SERVICES }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string; items?: typeof SERVICES }) {
  const [open, setOpen] = useState(0);
  const { line, lead: leadCls } = useInkFor(tone);
  const imgs = [IMG.campaign1, IMG.campaign2, IMG.campaign3, IMG.event];
  return (
    <Section tone={tone} id="brand">
      <Container>
        <SectionHeader align="split" eyebrow={eyebrow} title={title} lead={lead} />
        <div className={GAP.header}>
          {items.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.title} className={`border-b ${line}`}>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center gap-6 py-7 text-left">
                  <span className={`w-8 text-xs ${leadCls}`}>{String(i + 1).padStart(3, '0')}</span>
                  <span className={`flex-1 ${TYPE.h3}`}>{s.title}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark(tone) ? 'bg-acid text-ink' : 'bg-brand text-white'}`}>
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid items-end gap-6 pb-8 sm:grid-cols-[1fr_1.6fr_auto] sm:pl-14">
                        <div className="relative h-24 w-40">
                          {[0, 1].map((k) => (
                            <img key={k} src={imgs[(i + k) % imgs.length]} alt="" className="absolute h-20 w-32 rounded-xl object-cover shadow-float" style={{ left: k * 24, top: k * 6, transform: `rotate(${k ? 4 : -6}deg)` }} />
                          ))}
                        </div>
                        <p className={`max-w-sm ${TYPE.body} ${leadCls}`}>{s.text}</p>
                        <span className={`${TYPE.label} ${leadCls}`}>{s.count}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
function useInkFor(tone: Tone) {
  const dark = tone === 'ink' || tone === 'brand';
  return { line: dark ? 'border-white/12' : 'border-line', lead: dark ? 'text-white/65' : 'text-mute' };
}

/* ─── 28 · Feature con mini-interfacce ──────────────────────────── */
const LINE = 'M0 70 L40 70 L60 55 L80 55 L95 42 L105 48 L120 32 L145 32 L160 22 L175 30 L200 10';
const CURVE = 'M0 70 C 30 70, 40 20, 70 20 S 100 75, 120 72 S 150 30, 165 30 S 190 45, 200 15';

export function FeatureCardsUI({ tone = 'white', eyebrow = 'Piattaforma', title = 'Tutto quello che serve,\n*in un’unica vista*', features = [
  { title: 'Metriche unificate', text: 'Reach, interazioni e click di tutti i creator in un unico cruscotto.' },
  { title: 'Suggerimenti con l’AI', text: 'Idee di format e creator consigliati a partire dai tuoi dati.' },
  { title: 'Performance per creator', text: 'Scopri chi porta davvero risultati e dove conviene investire.' },
  { title: 'Clienti che ritornano', text: 'Misura quanti acquisti arrivano dai codici e dai link dei creator.' },
] }: { tone?: Tone; eyebrow?: string; title?: string; features?: { title: string; text: string }[] }) {
  const panels = [
    <div key="m" className="w-64 rounded-2xl bg-white p-4 shadow-card">
      <div className="flex justify-between text-[10px] text-mute">
        <span>Reach</span>
        <span>Creator attivi</span>
      </div>
      <div className="flex justify-between font-heading text-lg font-semibold">
        <span>
          2,4M <span className="rounded bg-brand-soft px-1 text-[9px] text-brand-ink">+30%</span>
        </span>
        <span>18</span>
      </div>
      <svg viewBox="0 0 200 80" className="mt-2 w-full">
        <motion.path d={LINE} fill="none" stroke="#ff1f8f" strokeWidth="1.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
      </svg>
    </div>,
    <div key="a" className="flex flex-col items-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_0_40px_rgba(255,31,143,0.35)]">
        <Sparkles className="h-8 w-8 fill-brand text-brand" />
      </span>
      <div className="mt-5 flex max-w-xs flex-wrap justify-center gap-2">
        {['Prova i Reel UGC', 'Micro-creator food', 'Codice sconto', 'Live unboxing', 'TikTok challenge'].map((c, i) => (
          <motion.span key={c} {...reveal(i)} className={`rounded-full px-3 py-1 text-[10px] shadow-card ${i === 1 ? 'bg-brand text-white' : 'bg-white'}`} style={{ rotate: `${(i % 3) * 4 - 4}deg` }}>
            {c}
          </motion.span>
        ))}
      </div>
    </div>,
    <div key="c" className="w-64 space-y-2">
      {CREATORS.slice(0, 3).map((c, i) => (
        <div key={c.handle} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
          <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          <div className="flex-1">
            <p className="flex justify-between text-xs font-medium">
              {c.handle}
              <span className={`rounded px-1 text-[9px] ${i === 1 ? 'bg-ink/10 text-ink' : 'bg-brand-soft text-brand-ink'}`}>{i === 1 ? '↓ 4%' : `↑ ${12 - i * 2}%`}</span>
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper">
              <div className="h-full rounded-full bg-brand" style={{ width: `${c.match - 10}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>,
    <div key="r" className="relative w-60 rounded-2xl bg-white p-4 shadow-card">
      <p className="text-xs text-mute">Acquisti da codice creator</p>
      <svg viewBox="0 0 200 80" className="mt-2 w-full">
        <defs>
          <linearGradient id="in-fc" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#ff1f8f" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ff1f8f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${CURVE} L200 80 L0 80Z`} fill="url(#in-fc)" />
        <path d={CURVE} fill="none" stroke="#ff1f8f" strokeWidth="1.8" />
      </svg>
      <span className="absolute -left-8 -top-3 flex items-center gap-1.5 rounded-xl bg-white px-2 py-1 text-[9px] shadow-float">
        <img src={IMG.people[2]} alt="" className="h-4 w-4 rounded-full object-cover" /> Nuovo ordine · GIULIA10
      </span>
    </div>,
  ];
  return (
    <Section tone={tone} id="piattaforma">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className={`${GAP.header} grid ${GAP.grid} md:grid-cols-2`}>
          {features.map((f, i) => (
            <motion.div key={f.title} {...reveal(i % 2)}>
              <Card className="h-full p-3">
                <div className="flex h-60 items-center justify-center overflow-hidden rounded-2xl bg-paper">{panels[i % panels.length]}</div>
                <div className="p-4">
                  <p className={TYPE.h3}>{f.title}</p>
                  <p className="mt-2 text-sm text-mute">{f.text}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

