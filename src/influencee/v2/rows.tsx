import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Baby, BadgeCheck, BookOpen, Camera, Car, Check, ChevronDown, ChevronRight, Coffee, Dumbbell, FileText, Gamepad2, HeartPulse, Laugh, MousePointerClick, Music2, Megaphone, Users, LayoutGrid, BarChart3, PawPrint, PiggyBank, Plane, Search, Shirt, Smartphone, Sofa, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Button, Container, Eyebrow, GAP, Heading, Lead, Logo, Section, SectionHeader, TYPE, reveal, useInk, type Tone } from '../ds';
import { faqOpen, track } from './analytics';
import { setToolContext } from './tools';
import { APP, CATEGORIES, FACTS, MARKET, PLANS, REGIONS, SITE, TIERS, WHATSAPP, type QA } from './data';

/* ════════════════════════════════════════════════════════════════════
   ROW DEL SITO v2 — stesso design system (fasce a tutta larghezza,
   bianco, nero, fucsia e verde acido), testi orientati a SEO/GEO/AEO:
   · ogni pagina ha un solo H1 con la keyword principale;
   · subito sotto l'hero un box "In breve" con la risposta diretta;
   · H2 in forma di domanda dove l'intento è informativo;
   · FAQ visibili e uguali al JSON-LD FAQPage.
   ════════════════════════════════════════════════════════════════════ */

export type Crumb = { label: string; href?: string };

export function Crumbs({ items, center = false }: { items: Crumb[]; center?: boolean }) {
  const { dark } = useInk();
  const all = [{ label: 'Home', href: '#/' }, ...items];
  return (
    <nav aria-label="Percorso" className={`flex flex-wrap items-center gap-1 text-sm ${center ? 'justify-center' : ''} ${dark ? 'text-white/55' : 'text-mute'}`}>
      {all.map((c, i) => (
        <span key={c.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
          {c.href && i < all.length - 1 ? (
            <a href={c.href} className={`transition ${dark ? 'hover:text-white' : 'hover:text-ink'}`}>
              {c.label}
            </a>
          ) : (
            <span className={dark ? 'text-white' : 'text-ink'}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── Hero piattaforma: testo a sinistra, interfaccia in primo piano ─ */
export function HeroPlatform({ crumbs, eyebrow, title, lead, actions, visual, note }: { crumbs?: Crumb[]; eyebrow: string; title: string; lead: string; actions: React.ReactNode; visual: React.ReactNode; note?: string }) {
  return (
    <Section tone="ink" pad="none" className="pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(255,31,143,0.22),transparent_55%),radial-gradient(ellipse_at_70%_95%,rgba(200,255,26,0.12),transparent_50%)]" />
      <Container>
        {crumbs && <Crumbs items={crumbs} />}
        <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:mt-10 lg:grid-cols-[1fr_1.05fr]">
          <motion.div {...reveal()}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading as="h1" size="display" text={title} className="mt-6 lg:!text-[4rem]" />
            <Lead className="mt-6 max-w-lg">{lead}</Lead>
            <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
            {note && <p className="mt-4 text-sm text-white/55">{note}</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative">
            {visual}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Hero centrata (home): testo al centro, piattaforma sotto ───── */
export function HeroCenter({ eyebrow, title, lead, actions, note, visual, floats }: { eyebrow: string; title: string; lead: string; actions: React.ReactNode; note?: string; visual: React.ReactNode; floats?: React.ReactNode }) {
  return (
    <Section tone="ink" pad="none" className="pt-14 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,31,143,0.28),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
      <Container className="text-center">
        <motion.div {...reveal()} className="mx-auto max-w-4xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading as="h1" size="display" text={title} className="mt-6 lg:!text-[4.6rem]" />
          <Lead className="mx-auto mt-6 max-w-2xl">{lead}</Lead>
          <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
          {note && <p className="mt-4 text-sm text-white/55">{note}</p>}
          <ClientsProof />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto mt-14 max-w-[1080px] pb-16 sm:mt-16 sm:pb-24">
          {visual}
          {floats}
        </motion.div>
      </Container>
    </Section>
  );
}

/** Riprova sociale sotto le CTA: avatar + numero clienti. */
export function ClientsProof({ className = 'mt-8' }: { className?: string }) {
  // volti dalle copertine dei reel realizzati per attività clienti (consenso da confermare, vedi Drive)
  const people = ['reel-salute-farmacia-vaccini.webp', 'reel-beauty-estetica-tecnologia.webp', 'reel-casa-spazio-esterno.webp', 'reel-servizi-fornitore.webp', 'reel-fitness-scegli-corso.webp'];
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      <div className="flex -space-x-3">
        {people.map((p, i) => (
          <img key={p} src={p} alt="" className="h-11 w-11 rounded-full object-cover object-[50%_22%] ring-[3px] ring-ink" style={{ zIndex: people.length - i }} />
        ))}
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-acid font-heading text-xs font-semibold text-ink ring-[3px] ring-ink">+5K</span>
      </div>
      <div className="text-left">
        <p className="flex items-center gap-1 text-acid">
          {[0, 1, 2, 3, 4].map((k) => (
            <svg key={k} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" /></svg>
          ))}
        </p>
        <p className="mt-0.5 text-sm text-white/75">
          <span className="font-heading text-base font-semibold text-white">{FACTS.clients} clienti</span> tra brand, agenzie e creator
        </p>
      </div>
    </div>
  );
}

/* ─── In breve: risposta diretta, citabile dai motori AI (AEO/GEO) ── */
export function AnswerBox({ q, a, points, visual }: { q: string; a: string; points?: string[]; visual?: React.ReactNode }) {
  const tiles = (points ?? ['Solo creator italiani', 'Numeri con la loro fonte', 'Contratto dai termini accettati', 'Link tracciati per ogni contenuto']).slice(0, 4);
  const styles = ['bg-brand text-white', 'bg-acid text-ink', 'bg-ink text-white', 'bg-white text-ink ring-1 ring-line'];
  const icons = [BadgeCheck, Search, FileText, MousePointerClick];
  return (
    <Section tone="paper">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <motion.div {...reveal()}>
            <Eyebrow>In breve</Eyebrow>
            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-[2.6rem] sm:leading-[1.05]">{q}</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">{a}</p>
          </motion.div>
          {visual ?? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {tiles.map((t, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <motion.div key={t} {...reveal(i)} className={`flex aspect-square flex-col justify-between rounded-[28px] p-5 sm:p-6 ${styles[i]} ${i % 2 ? 'translate-y-6' : ''}`}>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${i === 1 || i === 3 ? 'bg-ink/[0.07]' : 'bg-white/15'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="font-heading text-lg font-semibold leading-tight tracking-tight sm:text-xl">{t}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Funzioni a righe alterne: testo + interfaccia ─────────────── */
export type FeatureItem = { eyebrow: string; title: string; text: string; bullets?: string[]; visual: React.ReactNode; href?: string; cta?: string };
export function FeatureSplit({ tone = 'white', eyebrow, title, lead, items }: { tone?: Tone; eyebrow?: string; title?: string; lead?: string; items: FeatureItem[] }) {
  return (
    <Section tone={tone}>
      <Container>
        {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />}
        <div className={`${title ? GAP.header : ''} space-y-20 sm:space-y-28`}>
          {items.map((it, i) => (
            <div key={it.title} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <motion.div {...reveal()} className={i % 2 ? 'lg:order-2' : ''}>
                <p className={`${TYPE.label} text-brand`}>{it.eyebrow}</p>
                <h3 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{it.title}</h3>
                <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-mute">{it.text}</p>
                {it.bullets && (
                  <ul className="mt-6 space-y-2.5">
                    {it.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[15px]">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-acid">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {it.href && (
                  <a href={it.href} className="mt-7 inline-flex items-center gap-1.5 font-semibold text-brand-ink hover:gap-2.5">
                    {it.cta ?? 'Scopri di più'} <ArrowRight className="h-4 w-4 transition-all" />
                  </a>
                )}
              </motion.div>
              <motion.div {...reveal(1)} className={`relative ${i % 2 ? 'lg:order-1' : ''}`}>
                <div className="absolute -inset-4 -z-0 rounded-[32px] bg-gradient-to-br from-brand-soft via-white to-acid-soft sm:-inset-8" />
                <div className="relative">{it.visual}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Fatti verificati (nessun numero inventato) ────────────────── */
const FACT_ICONS = [Users, LayoutGrid, BadgeCheck, PiggyBank];
export function FactsBand({ items, tone = 'ink' }: { items: { v: string; l: string }[]; tone?: Tone }) {
  const dark = tone === 'ink';
  return (
    <Section tone={tone} pad="none" className="py-14 sm:py-16">
      <Container>
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${items.length <= 2 ? 'lg:max-w-3xl' : 'lg:grid-cols-4'}`}>
          {items.map((f, i) => (
            <motion.div key={f.l} {...reveal(i)} className={`flex items-start gap-4 rounded-3xl p-6 ${dark ? 'bg-white/[0.06] ring-1 ring-white/10' : 'bg-white ring-1 ring-line'}`}>
              <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${i % 2 ? 'bg-brand text-white' : 'bg-acid text-ink'}`}>{React.createElement(FACT_ICONS[i % FACT_ICONS.length], { className: 'h-5 w-5' })}</span>
              <div>
                <p className={`font-heading text-4xl font-semibold tracking-[-0.04em] ${dark ? 'text-white' : 'text-ink'}`}>{f.v}</p>
                <p className={`mt-1 text-sm ${dark ? 'text-white/65' : 'text-mute'}`}>{f.l}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Passi numerati ────────────────────────────────────────────── */
export function Steps({ tone = 'white', eyebrow, title, lead, steps, action }: { tone?: Tone; eyebrow?: string; title: string; lead?: string; steps: { t: string; x: string }[]; action?: React.ReactNode }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <ol className={`${GAP.header} grid grid-cols-1 ${GAP.grid} sm:grid-cols-2 lg:grid-cols-${Math.min(steps.length, 4)}`}>
          {steps.map((s, i) => (
            <motion.li key={s.t} {...reveal(i)} className={`relative overflow-hidden rounded-3xl p-7 ${STEP_BG[i % STEP_BG.length]}`}>
              <span className="pointer-events-none absolute -right-4 -top-6 font-heading text-[7rem] font-semibold leading-none tracking-[-0.06em] opacity-15">{i + 1}</span>
              <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${i % 4 === 2 ? 'bg-acid text-ink' : 'bg-white text-ink'}`}>{React.createElement(STEP_ICONS[i % STEP_ICONS.length], { className: 'h-5 w-5' })}</span>
              <p className={`relative mt-10 ${TYPE.h3}`}>{s.t}</p>
              <p className="relative mt-2 text-sm leading-relaxed opacity-75">{s.x}</p>
            </motion.li>
          ))}
        </ol>
        {action && <div className="mt-10 flex justify-center">{action}</div>}
      </Container>
    </Section>
  );
}

/* ─── Card semplici a griglia ───────────────────────────────────── */
export function CardGrid({ tone = 'white', eyebrow, title, lead, items, cols = 3 }: { tone?: Tone; eyebrow?: string; title: string; lead?: string; items: { t: string; x: string; tag?: string }[]; cols?: 2 | 3 | 4 }) {
  const grid = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} grid ${GAP.grid} ${grid}`}>
          {items.map((it, i) => (
            <motion.div key={it.t} {...reveal(i % 4)} className={`rounded-3xl p-7 ${tone === 'ink' ? 'bg-white/[0.06] ring-1 ring-white/10' : 'bg-white ring-1 ring-line shadow-[0_18px_40px_-28px_rgba(29,29,31,0.25)]'}`}>
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${['bg-brand text-white', 'bg-acid text-ink', 'bg-ink text-white'][i % 3]}`}>{React.createElement(STEP_ICONS[(i + 1) % STEP_ICONS.length], { className: 'h-5 w-5' })}</span>
                {it.tag && <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone === 'ink' ? 'bg-acid text-ink' : 'bg-brand-soft text-brand-ink'}`}>{it.tag}</span>}
              </div>
              <p className={`mt-6 ${TYPE.h3}`}>{it.t}</p>
              <p className={`mt-2 text-sm leading-relaxed ${tone === 'ink' ? 'text-white/65' : 'text-mute'}`}>{it.x}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Fasce di follower ─────────────────────────────────────────── */
export function TiersRow({ tone = 'white', title = 'Le fasce di follower\n*che usiamo*', lead = 'Ogni creator è classificato in una fascia: così confronti l’engagement con profili della stessa dimensione.', highlight }: { tone?: Tone; title?: string; lead?: string; highlight?: string }) {
  const card = tone === 'paper' || tone === 'soft' ? 'bg-white ring-1 ring-line' : 'bg-paper';
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Fasce" title={title} lead={lead} />
        <div className={`${GAP.header} grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5`}>
          {TIERS.map((t, i) => {
            const on = t.id === highlight;
            const er = MARKET.erIG[i];
            return (
              <motion.div key={t.id} {...reveal(i)} className={`flex flex-col rounded-3xl p-6 ${on ? 'bg-brand text-white' : card}`}>
                <div className="flex h-16 items-end gap-1" aria-hidden>
                  {Array.from({ length: 5 }).map((_, k) => (
                    <span key={k} className={`rounded-full ${k <= i ? (on ? 'bg-white' : 'bg-acid') : on ? 'bg-white/25' : 'bg-line'}`} style={{ width: 10, height: 14 + k * 11 }} />
                  ))}
                </div>
                <p className="mt-5 font-heading text-2xl font-semibold tracking-tight">{t.name}</p>
                <p className={`mt-1 text-sm ${on ? 'text-white/80' : 'text-mute'}`}>{t.range} follower</p>
                <p className={`mt-4 border-t pt-3 text-xs ${on ? 'border-white/25 text-white/85' : 'border-line text-mute'}`}>
                  ER medio Instagram <b className={on ? 'text-white' : 'text-ink'}>{er.v.toLocaleString('it-IT')}%</b>
                  <span className="block opacity-75">{er.o === 'IT' ? `fonte ${er.src}` : 'valore indicativo'}</span>
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Richiesta demo: il modulo apre WhatsApp con il messaggio pronto ─ */
export function DemoForm({ tone = 'soft', title = 'Richiedi una demo\n*con il tuo settore*', lead = 'Ti mostriamo la piattaforma con creator del tuo settore. Compila e premi invia: si apre WhatsApp con la richiesta già scritta.' }: { tone?: Tone; title?: string; lead?: string }) {
  const [d, setD] = useState({ name: '', company: '', sector: '', note: '' });
  const [sent, setSent] = useState(false);
  const field = 'h-12 w-full rounded-2xl bg-paper px-4 text-[15px] outline-none ring-1 ring-line focus:ring-brand';
  return (
    <Section tone={tone} id="demo">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeader align="left" eyebrow="Demo" title={title} lead={lead} />
            <form
              data-form="richiesta_demo_whatsapp"
              onSubmit={(e) => {
                e.preventDefault();
                const msg = `Ciao Influencee, sono ${d.name}${d.company ? ` di ${d.company}` : ''}. Vorrei una demo della piattaforma${d.sector ? ` per il settore ${d.sector}` : ''}.${d.note ? ` ${d.note}` : ''}`;
                window.open(`https://wa.me/${WHATSAPP.tel.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
                setSent(true);
              }}
              className="mt-8 grid grid-cols-1 gap-3 rounded-[28px] bg-white p-5 ring-1 ring-line sm:grid-cols-2 sm:p-6"
            >
              <label htmlFor="df-name"><span className="text-xs font-semibold text-mute">Nome</span><input id="df-name" required value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className={`mt-1.5 ${field}`} /></label>
              <label htmlFor="df-company"><span className="text-xs font-semibold text-mute">Azienda</span><input id="df-company" required value={d.company} onChange={(e) => setD({ ...d, company: e.target.value })} className={`mt-1.5 ${field}`} /></label>
              <label htmlFor="df-sector" className="sm:col-span-2"><span className="text-xs font-semibold text-mute">Settore</span>
                <select id="df-sector" value={d.sector} onChange={(e) => setD({ ...d, sector: e.target.value })} className={`mt-1.5 ${field}`}>
                  <option value="">Scegli il settore</option>
                  {CATEGORIES.map((c) => <option key={c.slug}>{c.short}</option>)}
                </select>
              </label>
              <label htmlFor="df-note" className="sm:col-span-2"><span className="text-xs font-semibold text-mute">Cosa vuoi vedere (facoltativo)</span><input id="df-note" value={d.note} onChange={(e) => setD({ ...d, note: e.target.value })} placeholder="Es. micro influencer food a Milano" className={`mt-1.5 ${field}`} /></label>
              <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white sm:col-span-2"><WaIcon className="h-4 w-4" /> Invia su WhatsApp</button>
              {sent && <p className="text-sm text-mute sm:col-span-2" role="status">Si è aperto WhatsApp con la richiesta pronta: premi invia e ti rispondiamo lì.</p>}
            </form>
          </div>
          <HelpCard />
        </div>
      </Container>
    </Section>
  );
}

/* ─── Prezzi ────────────────────────────────────────────────────── */
export function Plans({ tone = 'white', compact = false }: { tone?: Tone; compact?: boolean }) {
  const list = compact ? PLANS.slice(0, 2) : PLANS;
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Prezzi" title={'Prezzi chiari,\n*senza commissioni per il brand*'} lead={`Inizi gratis. Premium sblocca tutti i risultati e i filtri, con ${FACTS.trialDays} giorni di prova senza carta.`} />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} ${compact ? 'mx-auto max-w-3xl sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          {list.map((p, i) => (
            <motion.div key={p.name} {...reveal(i)} className={`flex flex-col rounded-3xl p-7 ${p.featured ? 'bg-ink text-white shadow-float' : 'bg-white ring-1 ring-line'}`}>
              <div className="flex items-center justify-between">
                <p className="font-heading text-lg font-semibold">{p.name}</p>
                {p.featured && <span className="rounded-full bg-acid px-2.5 py-1 text-[11px] font-semibold text-ink">Il più scelto</span>}
              </div>
              <p className="mt-5 font-heading text-5xl font-semibold tracking-[-0.04em]">{p.price}</p>
              <p className={`mt-1 text-sm ${p.featured ? 'text-white/60' : 'text-mute'}`}>{p.period}</p>
              <p className={`mt-4 text-sm ${p.featured ? 'text-white/80' : 'text-ink/80'}`}>{p.text}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? 'text-acid' : 'text-brand'}`} /> {f}
                  </li>
                ))}
              </ul>
              <a href={APP.brand} className={`mt-8 flex h-12 items-center justify-center rounded-full font-semibold transition ${p.featured ? 'bg-acid text-ink hover:brightness-95' : 'bg-paper hover:bg-brand-soft'}`}>
                {p.cta}
              </a>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-mute">Pagamento con PayPal. Il compenso del creator si concorda nella collaborazione. Per i creator l’iscrizione è gratuita.</p>
      </Container>
    </Section>
  );
}

/* ─── Categorie (link interni verso le pagine per nicchia) ──────── */
export function CategoryGrid({ tone = 'white', title = 'Influencer italiani\n*per categoria*', lead = `Le ${FACTS.categories} categorie della piattaforma: scegli quella del tuo settore.`, exclude, suffix = '' }: { tone?: Tone; title?: string; lead?: string; exclude?: string; suffix?: string }) {
  const list = CATEGORIES.filter((k) => k.slug !== exclude);
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Categorie" title={title} lead={lead} />
        <div className={`${GAP.header} grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6`}>
          {list.map((k, i) => {
            const img = CAT_IMG[k.slug];
            const Icon = CAT_ICON[k.slug] ?? Sparkles;
            return (
              <motion.a key={k.slug} href={`#/${k.slug}/`} {...reveal(i % 6)} className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-4 ${img ? 'text-white' : TILE_BG[i % TILE_BG.length]}`}>
                {img && (
                  <>
                    <img src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  </>
                )}
                <span className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl ${img ? 'bg-white/20 backdrop-blur' : 'bg-white/60'}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="relative block font-heading text-lg font-semibold tracking-tight">{k.short}</span>
                <span className={`relative mt-0.5 block text-xs ${img ? 'text-white/75' : 'opacity-70'}`}>
                  {k.name}
                  {suffix}
                </span>
              </motion.a>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Regioni e città (pagine locali già indicizzate) ───────────── */
export function RegionGrid({ tone = 'white', title = 'Influencer\n*per regione e città*', lead = 'Per campagne locali: negozi, ristoranti, eventi e aperture.', only }: { tone?: Tone; title?: string; lead?: string; only?: string }) {
  const list = only ? REGIONS.filter((r) => r.slug === only) : REGIONS;
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Regioni" title={title} lead={lead} />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} sm:grid-cols-2 lg:grid-cols-4`}>
          {list.map((r, i) => (
            <motion.div key={r.slug} {...reveal(i % 4)} className="rounded-3xl bg-white p-5 ring-1 ring-line">
              <a href={`#/influencer-italiani/influencer-${r.slug}/`} className="font-heading text-lg font-semibold tracking-tight hover:text-brand">
                Influencer {r.name}
              </a>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.cities.map((ct) => (
                  <a key={ct.slug} href={`#/influencer-italiani/influencer-${r.slug}/influencer-${ct.slug}/`} className="rounded-full bg-paper px-3 py-1 text-xs font-medium transition hover:bg-brand hover:text-white">
                    {ct.name}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── FAQ (contenuto identico al JSON-LD FAQPage della pagina) ──── */
export function FaqSeo({ tone = 'white', title = 'Domande\n*frequenti*', items, aside }: { tone?: Tone; title?: string; items: QA[]; aside?: React.ReactNode }) {
  const [open, setOpen] = useState(0);
  return (
    <Section tone={tone}>
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.4fr]">
        <div>
          <SectionHeader align="left" eyebrow="FAQ" title={title} />
          <div className="mt-10">{aside ?? <HelpCard />}</div>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {items.map((it, i) => (
            <div key={it.q}>
              <button type="button" onClick={() => {
                  if (open !== i) faqOpen(it.q, i);
                  setOpen(open === i ? -1 : i);
                }} data-track-ignore="" aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <h3 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">{it.q}</h3>
                <ChevronDown className={`h-5 w-5 shrink-0 transition ${open === i ? 'rotate-180 text-brand' : 'text-mute'}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden" aria-hidden={open !== i}>
                  <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-mute">{it.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Link correlati (collegamenti interni tra pagine) ──────────── */
export function Related({ tone = 'white', title = 'Continua a\n*esplorare*', links }: { tone?: Tone; title?: string; links: { label: string; text: string; href: string }[] }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="left" title={title} />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} sm:grid-cols-2 lg:grid-cols-${Math.min(links.length, 4)}`}>
          {links.map((l, i) => (
            <motion.a key={l.href} href={l.href} {...reveal(i)} className="group flex flex-col rounded-3xl bg-paper p-6 transition hover:bg-brand-soft">
              <span className="font-heading text-lg font-semibold tracking-tight">{l.label}</span>
              <span className="mt-1 flex-1 text-sm text-mute">{l.text}</span>
              <ArrowRight className="mt-6 h-5 w-5 text-brand transition group-hover:translate-x-1" />
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Doppio ingresso: brand e creator ──────────────────────────── */
export function CtaDual({ title = 'Inizia oggi,\n*è gratis*' }: { title?: string }) {
  return (
    <Section tone="ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,31,143,0.3),transparent_55%)]" />
      <Container>
        <SectionHeader title={title} lead="Scegli da che parte stai: l’iscrizione richiede pochi minuti." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} md:grid-cols-2`}>
          <motion.a {...reveal()} href={APP.brand} className="group rounded-3xl bg-white p-8 text-ink transition hover:-translate-y-1">
            <p className={`${TYPE.label} text-brand`}>Aziende e agenzie</p>
            <p className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em]">Trova i creator giusti</p>
            <p className="mt-3 text-mute">{FACTS.trialDays} giorni di Premium in prova, nessuna carta richiesta.</p>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-ink">
              Registra la tua azienda <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </motion.a>
          <motion.a {...reveal(1)} href={APP.creator} className="group rounded-3xl bg-acid p-8 text-ink transition hover:-translate-y-1">
            <p className={`${TYPE.label}`}>Creator</p>
            <p className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em]">Ricevi proposte dai brand</p>
            <p className="mt-3 text-ink/70">Iscrizione gratuita, collega i social e ottieni il badge Verificato.</p>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold">
              Iscriviti come creator <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </motion.a>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Banda CTA singola ─────────────────────────────────────────── */
export function CtaBandV2({ title, lead, primary, secondary, tone = 'soft' }: { title: string; lead?: string; primary: { label: string; href: string }; secondary?: { label: string; href: string }; tone?: Tone }) {
  return (
    <Section tone={tone}>
      <Container className="text-center">
        <Heading text={title} className="mx-auto max-w-3xl" />
        {lead && <Lead className="mx-auto mt-5 max-w-xl">{lead}</Lead>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={primary.href}>{primary.label}</Button>
          {secondary && (
            <Button href={secondary.href} variant="secondary">
              {secondary.label}
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Testo editoriale (pagine guida: UGC, micro influencer) ────── */
export function Prose({ tone = 'white', blocks, aside }: { tone?: Tone; blocks: { h: string; p: string[] }[]; aside: React.ReactNode }) {
  return (
    <Section tone={tone}>
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div className="space-y-12">
          {blocks.map((b) => (
            <motion.div key={b.h} {...reveal()}>
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{b.h}</h2>
              {b.p.map((t) => (
                <p key={t.slice(0, 24)} className="mt-4 text-[17px] leading-relaxed text-ink/80">
                  {t}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">{aside}</div>
      </Container>
    </Section>
  );
}
/* ─── Footer v2: tutta la struttura del sito (link interni) ─────── */
export function FooterV2() {
  const cols = [
    {
      t: 'Piattaforma',
      l: [
        ['Panoramica', '#/piattaforma-influencer/'],
        ['Database influencer', '#/funzionalita/database-influencer/'],
        ['Campagne e collaborazioni', '#/funzionalita/gestione-campagne/'],
        ['Link tracciati', '#/funzionalita/link-tracciati/'],
        ['Contratto', '#/funzionalita/contratto-influencer/'],
        ['Calendario campagne', '#/funzionalita/calendario-campagne/'],
        ['Media kit', '#/funzionalita/media-kit/'],
        ['Creator verificati', '#/creator-verificati/'],
        ['Prezzi', '#/prezzi/'],
      ],
    },
    {
      t: 'Soluzioni',
      l: [
        ['Per le aziende', '#/influencer-marketing-aziende/'],
        ['Per le agenzie', '#/piattaforma-agenzie/'],
        ['Micro influencer', '#/micro-influencer/'],
        ['Per i creator', '#/diventa-creator/'],
        ['UGC creator', '#/ugc-creator/'],
        ['Contenuti UGC', '#/contenuti-ugc/'],
        ['Campagne locali', '#/influencer-marketing-locale/'],
        ['Creator professionisti', '#/creator-professionisti/'],
        ['Campagna gestita', '#/preventivo-campagne/'],
      ],
    },
    {
      t: 'Tool gratuiti',
      l: [
        ['Tutti i tool', '#/social-media-tool/'],
        ['Fake follower checker', '#/followe-instagram-fake-follower/'],
        ['Quanto costa un influencer', '#/social-media-tool/costo-influencer/'],
        ['Calcolo engagement rate', '#/come-calcolare-engagement-rate/'],
        ['Emoticon da copiare', '#/social-media-tool/emoticon-da-copiare/'],
        ['Offerte di lavoro', '#/offerte-lavoro-influencer/'],
        ['Pubblica un’offerta', '#/pubblica-offerta-lavoro/'],
      ],
    },
    { t: 'Influencer italiani', l: [['Tutti', '#/influencer-italiani/'], ...CATEGORIES.slice(0, 8).map((k) => [k.short + ' influencer', `#/${k.slug}/`])] },
    { t: 'Città', l: REGIONS.slice(0, 8).map((r) => [`Influencer ${r.cities[0].name}`, `#/influencer-italiani/influencer-${r.slug}/influencer-${r.cities[0].slug}/`]) },
  ];
  return (
    <footer className="border-t border-line bg-white font-sans text-ink">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-mute">{SITE.tagline}. Solo creator italiani, numeri con la loro fonte.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={APP.brand} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                Registra l’azienda
              </a>
              <a href={APP.creator} className="rounded-full bg-acid px-4 py-2 text-sm font-semibold">
                Sono un creator
              </a>
            </div>
            <a href={WHATSAPP.href} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
              <WaIcon className="h-4 w-4 text-[#25D366]" /> Preventivi: {WHATSAPP.number}
            </a>
          </div>
          {cols.map((col) => (
            <div key={col.t}>
              <p className={`${TYPE.label} text-mute`}>{col.t}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.l.map(([label, href]) => (
                  <li key={href}>
                    <a href={href} className="text-ink/75 transition hover:text-brand">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-mute sm:flex-row sm:justify-between">
          <span>© 2026 {SITE.company} · Influencee è un marchio di {SITE.company}</span>
          <span className="flex gap-4">
            <a href="#/blog/">Blog</a>
            <a href="#/contatti/">Contatti</a>
            <a href="https://app.influencee.it/privacy-policy/">Privacy</a>
            <a href={APP.login}>Accedi</a>
          </span>
        </div>
      </Container>
    </footer>
  );
}

/* ─── Elementi visivi di supporto (nessuna riga solo testo) ──────── */
const CAT_IMG: Record<string, string> = {
  'food-influencers': 'reel-food-sushi-morso.webp',
  'fitness-influencers': 'reel-fitness-scegli-corso.webp',
  'beauty-influencers': 'reel-beauty-estetica-tecnologia.webp',
  'home-influencers': 'reel-casa-spazio-esterno.webp',
  'salute-influencers': 'reel-salute-farmacia-vaccini.webp',
  'lifestyle-influencers': 'reel-eventi-inaugurazione.webp',
};
const CAT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'food-influencers': UtensilsCrossed,
  'travel-influencers': Plane,
  'fashion-influencers': Shirt,
  'beauty-influencers': Sparkles,
  'fitness-influencers': Dumbbell,
  'tech-influencers': Smartphone,
  'gaming-influencers': Gamepad2,
  'family-influencers': Baby,
  'pet-influencers': PawPrint,
  'music-influencers': Music2,
  'lifestyle-influencers': Coffee,
  'home-influencers': Sofa,
  'motori-influencers': Car,
  'finanza-influencers': PiggyBank,
  'salute-influencers': HeartPulse,
  'arte-influencers': Camera,
  'book-influencers': BookOpen,
  'comici-influencers': Laugh,
};
const STEP_BG = ['bg-brand-soft text-ink', 'bg-ink text-white', 'bg-acid text-ink', 'bg-paper text-ink'];
const STEP_ICONS = [Search, Megaphone, FileText, MousePointerClick, BadgeCheck, Users, LayoutGrid, BarChart3];
const TILE_BG = ['bg-brand-soft text-ink', 'bg-acid text-ink', 'bg-ink text-white', 'bg-paper text-ink', 'bg-brand text-white', 'bg-acid-soft text-ink'];

/** Card di aiuto accanto alle FAQ: chat e CTA. */
export function HelpCard() {
  return (
    <motion.div {...reveal(1)} className="relative overflow-hidden rounded-[28px] bg-ink p-6 text-white">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/40 blur-3xl" />
      <div className="relative space-y-2.5">
        <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm">Posso provare la piattaforma senza carta?</p>
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-acid px-4 py-2.5 text-sm font-medium text-ink">Sì, 3 giorni di Premium gratis ✓</p>
        <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm">E per i creator?</p>
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm font-medium">Iscrizione sempre gratuita</p>
      </div>
      <a href={WHATSAPP.href} target="_blank" rel="noopener" className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-acid">
        <WaIcon className="h-4 w-4" /> Altre domande? Scrivici su WhatsApp
      </a>
    </motion.div>
  );
}

/** Tre card per i tre pubblici, ognuna con la sua interfaccia. */
export function AudienceRow({ tone = 'white', items }: { tone?: Tone; items: { tag: string; title: string; text: string; href: string; cta: string; visual: React.ReactNode; dark?: boolean }[] }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Per chi è" title={'Per aziende, agenzie\n*e creator*'} />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} lg:grid-cols-3`}>
          {items.map((it, i) => (
            <motion.a key={it.tag} href={it.href} {...reveal(i)} className={`group flex flex-col overflow-hidden rounded-[30px] ${it.dark ? 'bg-ink text-white' : i === 2 ? 'bg-acid text-ink' : 'bg-brand-soft text-ink'}`}>
              <div className="relative h-64 overflow-hidden px-6 pt-6">
                <div className="origin-top scale-[0.82] transition duration-500 group-hover:-translate-y-2">{it.visual}</div>
              </div>
              <div className="relative flex flex-1 flex-col p-7 pt-2">
                <p className={`${TYPE.label} ${it.dark ? 'text-acid' : 'text-brand-ink'}`}>{it.tag}</p>
                <p className="mt-2 font-heading text-2xl font-semibold tracking-[-0.03em]">{it.title}</p>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${it.dark ? 'text-white/70' : 'text-ink/70'}`}>{it.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                  {it.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── WhatsApp: preventivo per progetti gestiti dal team ─────────── */
export function WaIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm5.8 14.03c-.25.69-1.44 1.32-1.98 1.36-.51.05-.99.24-3.33-.69-2.82-1.11-4.6-3.99-4.74-4.18-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.97-2.31.25-.28.55-.35.73-.35l.53.01c.17.01.4-.06.62.47.25.6.84 2.06.91 2.21.07.15.12.33.02.52-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.69-.18 1.38Z" />
    </svg>
  );
}

/** Banda "lo gestiamo noi": testo + chat WhatsApp illustrata. */
export function ManagedRow({ tone = 'ink' }: { tone?: Tone }) {
  return (
    <Section tone={tone}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(37,211,102,0.18),transparent_55%)]" />
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.div {...reveal()}>
          <Eyebrow>Progetti gestiti</Eyebrow>
          <Heading text={'Preferisci che\n*ce ne occupiamo noi?*'} className="mt-5" />
          <Lead className="mt-5 max-w-lg">Se non hai tempo di usare la piattaforma, il team di influencee gestisce il progetto per te: scelta dei creator, accordi, contenuti e risultati. Scrivici su WhatsApp e ricevi un preventivo.</Lead>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={WHATSAPP.href} target="_blank" rel="noopener" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-95">
              <WaIcon /> Chiedi un preventivo su WhatsApp
            </a>
            <a href="#/preventivo-campagne/" className="inline-flex h-12 items-center rounded-full px-5 text-[15px] font-semibold ring-1 ring-current/25 opacity-90 hover:opacity-100">
              Calcola il preventivo
            </a>
            <a href={`tel:${WHATSAPP.tel}`} className="text-sm font-semibold opacity-75 hover:opacity-100">
              {WHATSAPP.number}
            </a>
          </div>
        </motion.div>
        <motion.div {...reveal(1)} className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-[30px] bg-[#efeae2] text-ink shadow-float ring-1 ring-white/10">
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-heading text-sm font-semibold text-brand">in</span>
              <div>
                <p className="text-sm font-semibold">Influencee</p>
                <p className="text-[11px] text-white/70">di solito risponde entro poche ore</p>
              </div>
            </div>
            <div className="space-y-2.5 p-4 text-[13px]">
              <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-sm">Ciao! Vorrei un preventivo per una campagna con creator food a Milano 🍝</p>
              <p className="w-fit max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">Certo! Ci dici obiettivo, periodo e budget indicativo?</p>
              <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-sm">Apertura nuovo locale, a novembre.</p>
              <p className="w-fit max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">Perfetto, ti preparo una proposta con creator e costi ✓</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

/** Pulsante WhatsApp fisso (desktop). */
export function WhatsAppFab() {
  return (
    <a href={WHATSAPP.href} target="_blank" rel="noopener" aria-label="Chiedi un preventivo su WhatsApp" data-track-zone="pulsante_whatsapp_fisso" className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-ink shadow-float transition hover:pr-5 lg:flex">
      <WaIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[200px]">Chiedi un preventivo</span>
    </a>
  );
}

/* ─── Grafico costi per fascia (benchmark dell'app, con fonte) ───── */
const euro = (n: number) => n.toLocaleString('it-IT') + ' €';
export function CostChart({ tone = 'white' }: { tone?: Tone }) {
  const [pl, setPl] = useState<'ig' | 'tt'>('ig');
  const rows = pl === 'ig' ? MARKET.costIG : MARKET.costTT;
  const max = Math.max(...rows.map((r) => r.v));
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Costi medi" title={'Quanto costa un post\n*per fascia di follower*'} lead="Costo medio di un post sponsorizzato in Italia. Ogni valore indica la sua origine: fonte italiana, dato estero o stima." />
        <div className={`${GAP.header} mx-auto max-w-4xl rounded-[30px] bg-ink p-6 text-white sm:p-10`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-full bg-white/10 p-1 text-sm font-semibold" role="tablist">
              {(['ig', 'tt'] as const).map((k) => (
                <button key={k} type="button" role="tab" aria-selected={pl === k} onClick={() => setPl(k)} className={`rounded-full px-4 py-1.5 transition ${pl === k ? 'bg-acid text-ink' : 'text-white/70'}`}>
                  {k === 'ig' ? 'Instagram' : 'TikTok'}
                </button>
              ))}
            </div>
            <span className="text-xs text-white/50">Fonte: benchmark di mercato influencee</span>
          </div>
          <div className="mt-8 space-y-4">
            {rows.map((r, i) => (
              <div key={MARKET.tiers[i]} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 sm:grid-cols-[110px_1fr_150px]">
                <span className="font-heading font-semibold">{MARKET.tiers[i]}</span>
                <div className="h-9 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div key={pl + i} initial={{ width: 0 }} animate={{ width: `${Math.max((r.v / max) * 100, 6)}%` }} transition={{ duration: 0.7, delay: i * 0.06 }} className={`h-full rounded-full ${i === 1 ? 'bg-acid' : 'bg-brand'}`} />
                </div>
                <span className="text-right">
                  <span className="block font-heading text-lg font-semibold tabular-nums">{euro(r.v)}</span>
                  <span className={`text-[10px] font-semibold ${r.o === 'IT' ? 'text-acid' : 'text-white/45'}`}>{r.o === 'IT' ? `IT · ${r.src}` : r.o}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-white/50">Fasce: Nano 1–10 mila, Micro 10–50 mila, Mid 50–250 mila, Macro 250 mila–1 milione, Mega oltre 1 milione di follower. Prezzi indicativi per un singolo post; formato, diritti d’uso ed esclusiva cambiano il compenso.</p>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Calcolatore engagement rate e check sponsor (interattivo) ──── */
export function ErCalculator({ tone = 'white' }: { tone?: Tone }) {
  const [mode, setMode] = useState<'er' | 'sponsor'>('er');
  const [followers, setFollowers] = useState('25000');
  const [views, setViews] = useState('12000');
  const [inter, setInter] = useState('900');
  const num = (s: string) => Math.max(0, Number(String(s).replace(/\./g, '').replace(',', '.')) || 0);
  const f = num(followers);
  const v = num(views);
  const n = num(inter);
  const tierIdx = f < 10000 ? 0 : f < 50000 ? 1 : f < 250000 ? 2 : f < 1000000 ? 3 : 4;
  const er = f ? (n / f) * 100 : 0;
  const ref = MARKET.erIG[tierIdx];
  const ratio = v ? (n / v) * 100 : 0;
  const sp = MARKET.sponsor.find((x) => ratio < x.max)!;
  const erBand = er >= ref.v * 1.15 ? 'sopra la media' : er >= ref.v * 0.85 ? 'in linea con la media' : 'sotto la media';
  const result = mode === 'er' ? erBand : sp.label;
  React.useEffect(() => setToolContext('engagement_rate', mode === 'er' ? `${f.toLocaleString('it-IT')} follower · ${n.toLocaleString('it-IT')} interazioni medie · ER ${er.toLocaleString('it-IT', { maximumFractionDigits: 2 })}% (${erBand}, fascia ${MARKET.tiers[tierIdx]})` : `Check sponsor ${ratio.toLocaleString('it-IT', { maximumFractionDigits: 2 })}% su ${v.toLocaleString('it-IT')} visualizzazioni: ${sp.label}`), [mode, f, n, v, er, ratio, erBand, sp.label, tierIdx]);
  React.useEffect(() => {
    const t = setTimeout(() => track('calculator_use', { calculator: mode === 'er' ? 'engagement_rate' : 'check_sponsor', result_band: result.slice(0, 60), tier: MARKET.tiers[tierIdx] }), 1200);
    return () => clearTimeout(t);
  }, [mode, followers, views, inter]); // eslint-disable-line react-hooks/exhaustive-deps
  const field = (id: string, label: string, val: string, set: (s: string) => void) => (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input id={id} inputMode="numeric" value={val} onChange={(e) => set(e.target.value)} className="mt-2 h-12 w-full rounded-2xl bg-paper px-4 font-heading text-lg font-semibold outline-none ring-1 ring-line focus:ring-brand" />
    </label>
  );
  const tone2 = mode === 'er' ? (erBand === 'sopra la media' ? 'bg-acid text-ink' : erBand === 'in linea con la media' ? 'bg-white text-ink' : 'bg-brand text-white') : sp.tone === 'bad' ? 'bg-brand text-white' : sp.tone === 'warn' ? 'bg-white text-ink' : 'bg-acid text-ink';
  return (
    <Section tone={tone} id="calcolatore">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] bg-white p-6 ring-1 ring-line shadow-[0_30px_60px_-40px_rgba(29,29,31,0.35)] sm:p-8">
            <div className="flex gap-1 rounded-full bg-paper p-1 text-sm font-semibold" role="tablist">
              {([['er', 'Engagement rate'], ['sponsor', 'Check sponsor']] as const).map(([k, l]) => (
                <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`flex-1 rounded-full px-4 py-2 transition ${mode === k ? 'bg-ink text-white' : 'text-mute'}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {mode === 'er' ? field('calc-f', 'Follower del profilo', followers, setFollowers) : field('calc-v', 'Visualizzazioni del contenuto', views, setViews)}
              {field('calc-i', mode === 'er' ? 'Interazioni medie per contenuto (like, commenti, condivisioni, salvataggi)' : 'Interazioni del contenuto', inter, setInter)}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-mute">{mode === 'er' ? 'Engagement rate = interazioni medie ÷ follower × 100. Per un dato solido usa la mediana degli ultimi contenuti, come fa influencee.' : 'Check sponsor = interazioni ÷ visualizzazioni × 100. Un valore molto basso indica che la reach arriva soprattutto da pubblicità.'}</p>
          </div>
          <motion.div layout className={`flex flex-col justify-between rounded-[30px] p-6 sm:p-8 ${tone2}`}>
            <div>
              <p className={`${TYPE.label} opacity-70`}>Risultato</p>
              <p className="mt-3 font-heading text-6xl font-semibold tracking-[-0.05em] tabular-nums sm:text-7xl">{(mode === 'er' ? er : ratio).toLocaleString('it-IT', { maximumFractionDigits: 2 })}%</p>
              <p className="mt-4 font-heading text-2xl font-semibold tracking-tight">{result.charAt(0).toUpperCase() + result.slice(1)}</p>
              {mode === 'er' && (
                <p className="mt-2 text-sm opacity-75">
                  Fascia {MARKET.tiers[tierIdx]}: media Instagram {ref.v.toLocaleString('it-IT')}% ({ref.o === 'IT' ? `fonte ${ref.src}` : ref.src})
                </p>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={APP.brand} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
                Confronta i creator su influencee
              </a>
              <a href={APP.check} className="inline-flex h-11 items-center rounded-full bg-white/70 px-5 text-sm font-semibold text-ink ring-1 ring-black/10">
                Check sponsor nell’app
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

export function SparkNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-acid-soft px-3 py-1 text-xs font-semibold">
      <Sparkles className="h-3.5 w-3.5" /> {children}
    </span>
  );
}
