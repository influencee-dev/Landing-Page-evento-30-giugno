import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { Button, Container, Eyebrow, GAP, Heading, Lead, Logo, Section, SectionHeader, TYPE, reveal, useInk, type Tone } from '../ds';
import { APP, CATEGORIES, FACTS, PLANS, REGIONS, SITE, TIERS, type QA } from './data';

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
    <Section tone="white" pad="none" className="pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(255,31,143,0.10),transparent_55%),radial-gradient(ellipse_at_70%_90%,rgba(200,255,26,0.18),transparent_50%)]" />
      <Container>
        {crumbs && <Crumbs items={crumbs} />}
        <div className="mt-8 grid items-center gap-12 lg:mt-10 lg:grid-cols-[1fr_1.05fr]">
          <motion.div {...reveal()}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading as="h1" size="display" text={title} className="mt-6 lg:!text-[4rem]" />
            <Lead className="mt-6 max-w-lg">{lead}</Lead>
            <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
            {note && <p className="mt-4 text-sm text-mute">{note}</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative">
            {visual}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── In breve: risposta diretta, citabile dai motori AI (AEO/GEO) ── */
export function AnswerBox({ q, a, points }: { q: string; a: string; points?: string[] }) {
  return (
    <Section tone="paper" pad="none" className="py-12 sm:py-16">
      <Container>
        <motion.div {...reveal()} className="grid gap-8 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <p className={`${TYPE.label} text-brand`}>In breve</p>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{q}</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-ink/85 sm:text-xl">{a}</p>
            {points && (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[15px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
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
            <div key={it.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
export function FactsBand({ items, tone = 'ink' }: { items: { v: string; l: string }[]; tone?: Tone }) {
  return (
    <Section tone={tone} pad="none" className="py-14 sm:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {items.map((f, i) => (
            <motion.div key={f.l} {...reveal(i)}>
              <p className={`font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-5xl ${tone === 'ink' ? 'text-acid' : 'text-brand'}`}>{f.v}</p>
              <p className={`mt-2 text-sm ${tone === 'ink' ? 'text-white/65' : 'text-mute'}`}>{f.l}</p>
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
        <ol className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-${Math.min(steps.length, 4)}`}>
          {steps.map((s, i) => (
            <motion.li key={s.t} {...reveal(i)} className="relative rounded-3xl bg-paper p-7 ring-1 ring-line/60">
              <span className="font-heading text-5xl font-semibold tracking-[-0.05em] text-brand">{String(i + 1).padStart(2, '0')}</span>
              <p className={`mt-6 ${TYPE.h3}`}>{s.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{s.x}</p>
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
              {it.tag && <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone === 'ink' ? 'bg-acid text-ink' : 'bg-brand-soft text-brand-ink'}`}>{it.tag}</span>}
              <p className={`${it.tag ? 'mt-5' : ''} ${TYPE.h3}`}>{it.t}</p>
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
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Fasce" title={title} lead={lead} />
        <div className={`${GAP.header} grid gap-3 sm:grid-cols-5`}>
          {TIERS.map((t, i) => {
            const on = t.id === highlight;
            return (
              <motion.div key={t.id} {...reveal(i)} className={`rounded-3xl p-6 ${on ? 'bg-brand text-white' : 'bg-paper'}`}>
                <p className="font-heading text-2xl font-semibold tracking-tight">{t.name}</p>
                <p className={`mt-1 text-sm ${on ? 'text-white/80' : 'text-mute'}`}>{t.range} follower</p>
              </motion.div>
            );
          })}
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
        <div className={`${GAP.header} grid ${GAP.grid} ${compact ? 'mx-auto max-w-3xl sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
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
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow="Categorie" title={title} lead={lead} />
        <div className={`${GAP.header} grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6`}>
          {CATEGORIES.filter((k) => k.slug !== exclude).map((k, i) => (
            <motion.a key={k.slug} href={`#/${k.slug}/`} {...reveal(i % 6)} className="group rounded-2xl bg-paper px-4 py-4 transition hover:bg-ink hover:text-white">
              <span className="block font-heading font-semibold tracking-tight">{k.short}</span>
              <span className="mt-0.5 block text-xs text-mute group-hover:text-white/60">
                {k.name}
                {suffix}
              </span>
            </motion.a>
          ))}
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
        <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-4`}>
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
export function FaqSeo({ tone = 'white', title = 'Domande\n*frequenti*', items }: { tone?: Tone; title?: string; items: QA[] }) {
  const [open, setOpen] = useState(0);
  return (
    <Section tone={tone}>
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
        <SectionHeader align="left" eyebrow="FAQ" title={title} />
        <div className="divide-y divide-line border-y border-line">
          {items.map((it, i) => (
            <div key={it.q}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <h3 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">{it.q}</h3>
                <ChevronDown className={`h-5 w-5 shrink-0 transition ${open === i ? 'rotate-180 text-brand' : 'text-mute'}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-mute">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
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
        <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-${Math.min(links.length, 4)}`}>
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
        <div className={`${GAP.header} grid ${GAP.grid} md:grid-cols-2`}>
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
export function Prose({ tone = 'white', blocks }: { tone?: Tone; blocks: { h: string; p: string[] }[] }) {
  return (
    <Section tone={tone}>
      <Container>
        <div className="mx-auto max-w-3xl space-y-12">
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
        ['Media kit', '#/funzionalita/media-kit/'],
        ['Benchmark engagement', '#/benchmark-engagement-rate/'],
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
        ['Annunci di collaborazione', '#/annunci-collaborazioni/'],
      ],
    },
    { t: 'Influencer italiani', l: [['Tutti', '#/influencer-italiani/'], ...CATEGORIES.slice(0, 8).map((k) => [k.short + ' influencer', `#/${k.slug}/`])] },
    { t: 'Città', l: REGIONS.slice(0, 8).map((r) => [`Influencer ${r.cities[0].name}`, `#/influencer-italiani/influencer-${r.slug}/influencer-${r.cities[0].slug}/`]) },
  ];
  return (
    <footer className="border-t border-line bg-white font-sans text-ink">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
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

export function SparkNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-acid-soft px-3 py-1 text-xs font-semibold">
      <Sparkles className="h-3.5 w-3.5" /> {children}
    </span>
  );
}
