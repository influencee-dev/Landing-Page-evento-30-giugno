import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, CheckCircle2, ChevronDown, FileSignature, Handshake, LayoutGrid, Megaphone, Rocket, Search, Sparkles, UserPlus, Users, XCircle, Zap } from 'lucide-react';
import { AvatarStack, Button, Card, Container, GAP, IconBadge, Lead, Section, SectionHeader, TYPE, reveal, type Tone } from '../ds';
import { BRAND, CTA, FAQS, IMG, PLATFORMS, SERVICES, STEPS } from '../content';
import { BrowserFrame, PlatformMock } from '../mocks';

interface Head {
  tone?: Tone;
  eyebrow?: string;
  title?: string;
  lead?: string;
}

/* ─── 35 · Griglia vantaggi ─────────────────────────────────────── */
const BENEFIT_ICONS = [Search, Megaphone, Handshake, Sparkles, LayoutGrid, BarChart3];
export function BenefitsGrid({ tone = 'white', eyebrow = 'Vantaggi', title = 'Più risultati,\n*meno fatica*', lead = 'Cosa cambia quando lavori con i creator in modo strutturato.', items = SERVICES }: Head & { items?: typeof SERVICES }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-3`}>
          {items.map((it, i) => (
            <motion.div key={it.title} {...reveal(i % 3)}>
              <Card className="h-full p-7 transition duration-300 hover:-translate-y-1">
                <IconBadge icon={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} />
                <p className={`mt-6 ${TYPE.h3}`}>{it.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-mute">{it.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 36 · Step con card evidenziata ────────────────────────────── */
const STEP_ICONS = [UserPlus, Users, FileSignature, Rocket];
export function StepsHighlight({ tone = 'white', eyebrow = 'Come iniziare', title = 'Operativi\nin *una settimana*', lead = 'Nessuna complessità: quattro passaggi tra te e la tua prossima campagna con i creator.', steps = STEPS }: Head & { steps?: typeof STEPS }) {
  const [hl, setHl] = useState(0);
  return (
    <Section tone={tone}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div className="flex flex-col">
          <SectionHeader align="left" eyebrow={eyebrow} title={title} lead={lead} />
          <div className="mt-8 lg:mt-auto">
            <Button href={CTA.demo.href}>{CTA.demo.label}</Button>
          </div>
        </div>
        <div className={`grid ${GAP.grid} sm:grid-cols-2`}>
          {steps.map((s, i) => {
            const on = i === hl;
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <motion.div key={s.title} {...reveal(i)} onMouseEnter={() => setHl(i)} className={`rounded-3xl p-7 transition-colors duration-300 ${on ? 'bg-brand text-white shadow-[0_20px_40px_-16px_rgba(255,31,143,0.6)]' : 'bg-paper ring-1 ring-line/70'}`}>
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${on ? 'bg-white/15' : 'bg-brand-soft text-brand'}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className={`mt-10 ${TYPE.h3}`}>{s.title}</p>
                <p className={`mt-2 text-sm leading-relaxed ${on ? 'text-white/80' : 'text-mute'}`}>{s.text}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 37 · Griglia piattaforme ──────────────────────────────────── */
export function PlatformsGrid({ tone = 'white', eyebrow = 'Dove lavoriamo', title = 'Su tutte le piattaforme\n*che contano*', items = PLATFORMS }: Head & { items?: string[] }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className={`${GAP.header} grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-4`}>
          {items.map((p, i) => (
            <motion.div key={p} {...reveal(i % 4)} className="group flex items-center justify-center gap-2 bg-white py-10 font-heading text-lg font-semibold tracking-tight text-ink/60 transition hover:text-ink">
              <span className="h-2.5 w-2.5 rounded-full bg-line transition group-hover:bg-brand" />
              {p}
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 38 · FAQ ──────────────────────────────────────────────────── */
export function Faq({ tone = 'white', eyebrow = 'FAQ', title = 'Hai\n*domande?*', lead = 'Tutto quello che brand, agenzie e creator ci chiedono più spesso.', items = FAQS }: Head & { items?: typeof FAQS }) {
  const [open, setOpen] = useState(0);
  return (
    <Section tone={tone} id="faq">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHeader align="left" eyebrow={eyebrow} title={title} lead={lead} />
          <div className="mt-8">
            <Button href={`mailto:${BRAND.email}`} variant="secondary">
              Scrivici
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className={`rounded-3xl p-2 transition ${isOpen ? 'bg-paper ring-1 ring-line' : 'bg-paper/60'}`}>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-lg font-semibold tracking-tight">
                  {it.q}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isOpen ? 'bg-brand text-white' : 'bg-white text-ink ring-1 ring-line'}`}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className={`mx-2 mb-2 rounded-2xl bg-white p-4 text-mute ${TYPE.body}`}>{it.a}</p>
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

/* ─── 39 · Feature alternate ────────────────────────────────────── */
export function FeatureRows({ tone = 'white', eyebrow = 'Piattaforma', title = 'Strumenti che fanno\n*lavorare meglio*', lead = 'Pensata per brand, agenzie e centri media che gestiscono più campagne in parallelo.' }: Head) {
  const rows = [
    { icon: Search, title: 'Ricerca creator intelligente', text: 'Filtra migliaia di profili per nicchia, città, dimensione ed engagement, con un punteggio di affinità al brand.', bullets: ['Filtri avanzati', 'Match score', 'Dati audience', 'Liste condivise'], visual: <BrowserFrame><PlatformMock rows={3} compact /></BrowserFrame> },
    { icon: Megaphone, title: 'Campagne in un solo posto', text: 'Brief, contratti, approvazione dei contenuti e calendario delle pubblicazioni, con tutti i creator coordinati.', bullets: ['Brief condivisi', 'Approvazioni', 'Calendario', 'Contratti'], visual: <img src={IMG.event} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" /> },
    { icon: BarChart3, title: 'Report in tempo reale', text: 'Reach, interazioni, click e vendite raccolti in report chiari, pronti da condividere con il cliente.', bullets: ['KPI live', 'Export PDF', 'Tracking link', 'Codici sconto'], visual: <img src={IMG.campaign3} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" /> },
  ];
  return (
    <Section tone={tone} id="agenzie">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} space-y-16 sm:space-y-24`}>
          {rows.map((r, i) => (
            <motion.div key={r.title} {...reveal()} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="rounded-3xl bg-gradient-to-br from-brand-soft to-white p-4 ring-1 ring-brand/15 sm:p-6">{r.visual}</div>
              <div>
                <IconBadge icon={r.icon} />
                <p className={`mt-5 ${TYPE.h3} sm:!text-3xl`}>{r.title}</p>
                <Lead className="mt-3 max-w-md !text-base">{r.text}</Lead>
                <ul className="mt-6 grid grid-cols-2 gap-3 text-sm font-medium">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand" /> {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button href={CTA.platform.href} variant="secondary" size="sm" arrow>
                    Scopri di più
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── 40 · Newsletter ───────────────────────────────────────────── */
export function Newsletter({ tone = 'brand', title = 'Resta *aggiornato.*', lead = 'Trend, casi studio e opportunità di collaborazione: una mail al mese, niente spam.', perks = ['Casi studio in anteprima', 'Trend del creator marketing', 'Zero spam'] }: Head & { perks?: string[] }) {
  const [sent, setSent] = useState(false);
  return (
    <Section tone={tone}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <SectionHeader align="left" title={title} lead={lead} />
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-3 rounded-3xl bg-white p-2 sm:flex-row"
          >
            <input type="email" required placeholder="La tua email di lavoro" className="h-12 flex-1 rounded-full bg-transparent px-5 text-ink outline-none placeholder:text-mute" />
            <button type="submit" className="h-12 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition hover:bg-ink-2">
              {sent ? 'Iscritto ✓' : 'Iscriviti'}
            </button>
          </form>
          <div className="mt-6 flex items-center gap-3 text-sm text-white/85">
            <AvatarStack src={IMG.people.slice(0, 4)} size="h-7 w-7" /> Unisciti a 2.000+ marketer e creator
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 41 · Vecchio metodo vs influencee ─────────────────────────── */
export function Comparison({ tone = 'white', eyebrow = 'Perché noi', title = 'Un’alternativa\n*più intelligente*', lead = 'Pensata per farti risparmiare tempo e investire solo sui creator che rendono.', rows = [
  { topic: 'Selezione creator', old: 'Scelti per numero di follower, contattati uno a uno in DM, senza dati sull’audience.', next: 'Shortlist basata su audience, engagement e affinità, con stima dei risultati.' },
  { topic: 'Gestione campagna', old: 'Email, fogli Excel e messaggi sparsi. Contenuti che arrivano in ritardo.', next: 'Brief, approvazioni e calendario in un unico posto, con un referente dedicato.' },
  { topic: 'Misurazione', old: 'Screenshot degli insight e nessuna idea del ritorno reale.', next: 'Report con reach, click e vendite tracciate da link e codici sconto.' },
] }: Head & { rows?: { topic: string; old: string; next: string }[] }) {
  const icons = [Search, Zap, BarChart3];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} grid ${GAP.grid} md:grid-cols-3`}>
          {rows.map((r, i) => (
            <motion.div key={r.topic} {...reveal(i)}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-3">
                  <IconBadge icon={icons[i % icons.length]} />
                  <p className="font-heading text-lg font-semibold tracking-tight">{r.topic}</p>
                </div>
                <p className={`mt-6 flex items-center gap-1.5 ${TYPE.label} text-mute`}>
                  <XCircle className="h-3.5 w-3.5" /> Il vecchio metodo
                </p>
                <p className="mt-2 text-sm text-mute line-through decoration-line">{r.old}</p>
                <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-brand/20">
                  <p className={`flex items-center gap-1.5 ${TYPE.label} text-brand`}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Con {BRAND.name}
                  </p>
                  <p className="mt-2 text-sm font-medium">{r.next}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
