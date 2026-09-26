import React from 'react';
import { ROWS } from './registry';
import { Button, Card, Container, Eyebrow, Heading, Lead, Pill, Section, TYPE } from './ds';
import { HeroPill } from './rows/heroes-a';
import { StatsBento } from './rows/proof';
import { ServicesAccordion } from './rows/services';
import { FluidCarousel, TestimonialSwipe } from './rows/carousels';
import { FeatureRows, StepsHighlight, Faq } from './rows/saas';
import { ProjectsBento } from './rows/work';
import { TeamBento } from './rows/team';
import { CtaBand, Footer } from './rows/footer';

/* Pagina delle regole del design system (in cima alla gallery). */
function Rules() {
  const colors = [
    ['white', '#ffffff', 'bg-white ring-1 ring-inset ring-line'],
    ['ink (nero)', '#0a0a0a', 'bg-ink'],
    ['ink-2', '#1c1c1c', 'bg-ink-2'],
    ['canvas', '#ebebeb', 'bg-canvas'],
    ['paper', '#f6f6f6', 'bg-paper'],
    ['line', '#e4e4e4', 'bg-line'],
    ['mute', '#6b6b6b', 'bg-mute'],
    ['brand (fucsia)', '#ff1f8f', 'bg-brand'],
    ['brand-ink', '#d6006f', 'bg-brand-ink'],
    ['brand-soft', '#ffe3f1', 'bg-brand-soft'],
    ['acid (verde)', '#c8ff1a', 'bg-acid'],
    ['acid-soft', '#f2ffc9', 'bg-acid-soft'],
  ];
  const tones = ['white', 'paper', 'muted', 'soft', 'ink', 'brand'] as const;
  return (
    <>
      <Section tone="white">
        <Container>
          <Eyebrow>Design system</Eyebrow>
          <Heading as="h1" size="display" text="Una sola regola,\n*43 row*" className="mt-5" />
          <Lead className="mt-5 max-w-2xl">Tutte le row usano gli stessi token di colore, la stessa scala tipografica, gli stessi raggi e lo stesso layout: pannello a tutta larghezza con margine esterno, contenuto in un contenitore da 1200px.</Lead>

          <p className={`mt-14 ${TYPE.label} text-mute`}>Colori</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {colors.map(([n, hex, cls]) => (
              <div key={n} className="overflow-hidden rounded-2xl ring-1 ring-line">
                <div className={`h-16 ${cls}`} />
                <div className="p-3 text-xs">
                  <p className="font-semibold">{n}</p>
                  <p className="text-mute">{hex}</p>
                </div>
              </div>
            ))}
          </div>

          <p className={`mt-14 ${TYPE.label} text-mute`}>Tipografia</p>
          <div className="mt-4 divide-y divide-line rounded-3xl bg-paper px-6">
            {[
              ['display', 'Creator giusti, *risultati*'],
              ['h2', 'Titolo di sezione *con accento*'],
              ['h3', 'Titolo di card'],
            ].map(([k, t]) => (
              <div key={k} className="grid items-baseline gap-2 py-6 sm:grid-cols-[120px_1fr]">
                <span className="text-xs text-mute">{k}</span>
                <Heading size={k as 'display'} as="h3" text={t} />
              </div>
            ))}
            <div className="grid items-baseline gap-2 py-6 sm:grid-cols-[120px_1fr]">
              <span className="text-xs text-mute">lead / body / label</span>
              <div className="space-y-2">
                <p className={`${TYPE.lead} text-mute`}>Lead — Inter 18px, interlinea ampia, colore mute.</p>
                <p className={TYPE.body}>Body — Inter 15px per testi di card e descrizioni.</p>
                <p className={`${TYPE.label} text-brand`}>Label — 12px maiuscolo spaziato</p>
              </div>
            </div>
          </div>

          <p className={`mt-14 ${TYPE.label} text-mute`}>Controlli</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button>Primario</Button>
            <Button variant="secondary">Secondario</Button>
            <Button variant="contrast" arrow>
              Contrasto
            </Button>
            <Button size="sm">Piccolo</Button>
            <Pill>Pill</Pill>
            <Pill active>Pill attiva</Pill>
            <Eyebrow>Eyebrow</Eyebrow>
          </div>
        </Container>
      </Section>
      <p className="px-6 pb-1 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-mute">Toni dei pannelli</p>
      <div className="grid gap-0 sm:grid-cols-3">
        {tones.map((t) => (
          <Section key={t} tone={t} pad="none">
            <div className="p-8">
              <Heading size="h3" as="h3" text={`Tono *${t}*`} />
              <Lead className="mt-2 !text-sm">Testo, card e bottoni si adattano da soli.</Lead>
              <div className="mt-5 flex gap-2">
                <Button size="sm">CTA</Button>
                <Button size="sm" variant="secondary">
                  Altro
                </Button>
              </div>
              <Card className="mt-5 p-4 text-sm">Card su tono {t}</Card>
            </div>
          </Section>
        ))}
      </div>
    </>
  );
}

/** Gallery di tutte le row: /?influencee  ·  filtro: /?influencee=hero */
export function InfluenceeGallery() {
  const q = (new URLSearchParams(window.location.search).get('influencee') ?? '').toLowerCase();
  const rows = ROWS.filter((r) => !q || r.id.includes(q) || r.name.toLowerCase().includes(q) || r.family.toLowerCase().includes(q));
  return (
    <div className="min-h-screen bg-canvas pb-3 font-sans text-ink">
      <nav className="sticky top-0 z-50 flex gap-2 overflow-x-auto border-b border-black/5 bg-canvas/90 px-4 py-2.5 text-xs backdrop-blur">
        <a href="?influencee=home" className="shrink-0 rounded-full bg-brand px-3 py-1 font-semibold text-white">
          Home composta →
        </a>
        <a href="#regole" className="shrink-0 rounded-full bg-ink px-3 py-1 font-semibold text-white">
          Regole
        </a>
        {rows.map((r) => (
          <a key={r.id} href={`#${r.id}`} className="shrink-0 rounded-full bg-white px-3 py-1 ring-1 ring-line hover:ring-ink/30">
            {r.num} {r.name}
          </a>
        ))}
      </nav>
      {!q && (
        <div id="regole" className="scroll-mt-12">
          <Rules />
        </div>
      )}
      {rows.map(({ id, num, name, family, Component, props }) => (
        <div key={id} id={id} className="scroll-mt-12">
          <p className="flex items-center gap-3 px-6 pb-1 pt-8 text-xs text-mute">
            <b className="font-semibold text-brand">{num}</b>
            <span className="font-semibold text-ink">{name}</span>
            <span>· {family}</span>
          </p>
          <Component {...(props ?? {})} />
        </div>
      ))}
    </div>
  );
}

/** Esempio di home completa composta con le row: /?influencee=home */
export function InfluenceeHome() {
  return (
    <div className="min-h-screen bg-canvas pb-3 font-sans text-ink">
      <HeroPill />
      <StatsBento />
      <ServicesAccordion />
      <FluidCarousel />
      <FeatureRows />
      <StepsHighlight />
      <ProjectsBento />
      <TestimonialSwipe />
      <TeamBento />
      <Faq />
      <CtaBand />
      <Footer />
    </div>
  );
}
