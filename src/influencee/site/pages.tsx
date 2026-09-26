import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button, Card, Container, Heading, Lead, Pill, Section, SectionHeader, TYPE } from '../ds';
import { CTA } from '../content';
import { HeroPill, HeroShowcase } from '../rows/heroes-a';
import { HeroCentered, HeroDashboard, HeroWidgets } from '../rows/heroes-b';
import { HeroReels, ReelWall, ReelsStrip } from '../rows/reels';
import { Breadcrumbs } from './shell';
import { StatsBento, ResultsList, TestimonialFeature } from '../rows/proof';
import { NichePills, ProcessSteps, ServicesAccordion, FeatureCardsUI } from '../rows/services';
import { CaseCards, CaseStudyFeature, ProjectsBento } from '../rows/work';
import { Storywell, TestimonialSwipe } from '../rows/carousels';
import { BenefitsGrid, Comparison, Faq, FeatureRows, PlatformsGrid, StepsHighlight } from '../rows/saas';
import { CtaBand } from '../rows/footer';
import { Rules } from '../Gallery';
import { ROWS, ROW_COUNT } from '../registry';
import { FeaturedCreators } from './creators';
import { LatestArticles } from './blog';
import { PlatformTour } from './platform';
import { NICHE_INFO, NICHE_SLUGS } from './data';
import { PageHero } from './shell';

export function HomePage() {
  return (
    <>
      <HeroPill showNav={false} />
      <StatsBento />
      <ServicesAccordion />
      <ReelsStrip />
      <FeaturedCreators />
      <PlatformTour />
      <ProjectsBento />
      <TestimonialSwipe />
      <LatestArticles />
      <Faq />
      <CtaBand />
    </>
  );
}

export function BrandPage() {
  return (
    <>
      <HeroWidgets showNav={false} title={'*Influencer marketing*\nper brand che vogliono crescere'} lead="Selezione dei creator, brief, contratti, contenuti e report: gestiamo tutto noi, tu approvi e leggi i risultati." />
      <BenefitsGrid />
      <ReelWall />
      <ProcessSteps />
      <NichePills />
      <CaseCards />
      <Comparison />
      <Faq />
      <CtaBand />
    </>
  );
}

export function AgenciesPage() {
  return (
    <>
      <HeroShowcase showNav={false} title={'Più clienti, più campagne,\n*meno fogli Excel*'} lead="La piattaforma per agenzie e centri media: ricerca creator, gestione campagne e report condivisibili con i clienti." />
      <ReelsStrip title={'I contenuti che gestirai\n*per i tuoi clienti*'} />
      <PlatformTour eyebrow="Per le agenzie" title={'Tutto il flusso,\n*in una piattaforma*'} />
      <FeatureCardsUI />
      <StepsHighlight />
      <TestimonialFeature />
      <CtaBand title={'Porta la tua agenzia\n*su influencee*'} lead="Una demo di 30 minuti per vedere la piattaforma con i tuoi casi reali." />
    </>
  );
}

export function PlatformPage() {
  return (
    <>
      <HeroDashboard showNav={false} />
      <PlatformTour />
      <ReelsStrip title={'Dalla piattaforma\n*ai reel pubblicati*'} lead="Ogni contenuto che vedi qui è passato da brief, approvazione e report dentro la piattaforma." />
      <FeatureRows />
      <PlatformsGrid />
      <Faq />
      <CtaBand />
    </>
  );
}

export function CasesPage() {
  return (
    <>
      <HeroCentered showNav={false} variant="work" />
      <ReelWall eyebrow="Dalle campagne" title={'I contenuti\n*delle nostre campagne*'} />
      <CaseStudyFeature />
      <ResultsList />
      <Storywell />
      <CtaBand />
    </>
  );
}

export function CreatorJoinPage() {
  const [sent, setSent] = useState(false);
  const [niches, setNiches] = useState<string[]>([]);
  const toggle = (s: string) => setNiches((n) => (n.includes(s) ? n.filter((x) => x !== s) : [...n, s]));
  return (
    <>
      <HeroReels
        crumbs={<Breadcrumbs center items={[{ label: 'Soluzioni' }, { label: 'Per i creator' }]} />}
        eyebrow="Per i creator"
        title={'Collabora con brand\n*in linea con te*'}
        lead="Entra nel network: ti proponiamo solo campagne coerenti con la tua nicchia e il tuo pubblico, con compensi chiari e pagamenti puntuali."
        actions={<Button onClick={() => document.getElementById('candidatura')?.scrollIntoView({ behavior: 'smooth' })}>Candidati ora</Button>}
      />
      <BenefitsGrid
        eyebrow="Perché influencee"
        title={'Più tempo per creare,\n*meno trattative*'}
        lead="Ci occupiamo noi di brief, contratti e pagamenti."
        items={[
          { title: 'Brand selezionati', text: 'Ricevi proposte solo da brand affini ai tuoi contenuti e ai tuoi valori.', count: '' },
          { title: 'Brief chiari', text: 'Una pagina con obiettivi, date e cosa è richiesto. Niente sorprese.', count: '' },
          { title: 'Contratti trasparenti', text: 'Diritti d’uso, esclusive e compensi scritti prima di iniziare.', count: '' },
          { title: 'Pagamenti puntuali', text: 'Tempi di pagamento concordati e rispettati.', count: '' },
          { title: 'Report sui tuoi risultati', text: 'Dati da usare nel tuo media kit per le collaborazioni future.', count: '' },
          { title: 'Un referente dedicato', text: 'Una persona del team che conosce il tuo profilo.', count: '' },
        ]}
      />
      <Section tone="white" id="candidatura">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeader align="left" eyebrow="Candidatura" title={'Raccontaci\n*chi sei*'} lead="Valutiamo ogni profilo e ti ricontattiamo quando c’è una campagna in linea con te." />
          <Card className="p-6 sm:p-8">
            {sent ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
                <p className={`mt-4 ${TYPE.h3}`}>Candidatura pronta</p>
                <p className="mt-2 text-mute">Questo è un prototipo: il modulo non invia ancora i dati.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-5 text-sm"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['cj-name', 'Nome e cognome', 'text', 'Giulia Rinaldi'],
                    ['cj-email', 'Email', 'email', 'giulia@email.it'],
                    ['cj-handle', 'Profilo principale', 'text', '@giulia.eats'],
                    ['cj-city', 'Città', 'text', 'Bologna'],
                  ].map(([id, l, t, ph]) => (
                    <label key={id} htmlFor={id} className="block font-medium">
                      {l}
                      <input id={id} type={t} required placeholder={ph} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 font-normal outline-none ring-1 ring-line focus:ring-brand" />
                    </label>
                  ))}
                </div>
                <div>
                  <p className="mb-2 font-medium">Le tue nicchie</p>
                  <div className="flex flex-wrap gap-2">
                    {NICHE_SLUGS.map((s) => (
                      <button key={s} type="button" onClick={() => toggle(s)}>
                        <Pill active={niches.includes(s)}>{NICHE_INFO[s].name}</Pill>
                      </button>
                    ))}
                  </div>
                </div>
                <label htmlFor="cj-note" className="block font-medium">
                  Un link a un contenuto di cui vai fiero
                  <input id="cj-note" type="url" placeholder="https://" className="mt-2 w-full rounded-2xl bg-white px-4 py-3 font-normal outline-none ring-1 ring-line focus:ring-brand" />
                </label>
                <Button type="submit">Invia candidatura</Button>
              </form>
            )}
          </Card>
        </Container>
      </Section>
      <Faq />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <HeroCentered showNav={false} variant="contact" />
      <Faq />
    </>
  );
}

export function LegalPage({ kind }: { kind: 'privacy' | 'cookie' | 'termini' }) {
  const title = { privacy: 'Privacy policy', cookie: 'Cookie policy', termini: 'Termini e condizioni' }[kind];
  return (
    <>
      <PageHero crumbs={[{ label: title }]} title={title} lead="Testo di esempio: da sostituire con il documento legale fornito dal consulente prima della pubblicazione." />
      <Section tone="white">
        <Container className="max-w-3xl space-y-5 text-[17px] leading-relaxed text-ink/85">
          <p>Titolare del trattamento: Influencee SRL. Questa pagina descriverà quali dati raccogliamo, per quali finalità, per quanto tempo li conserviamo e quali diritti puoi esercitare.</p>
          <p>Per qualsiasi richiesta scrivi a info@influencee.it.</p>
        </Container>
      </Section>
    </>
  );
}

/** Libreria: regole del design system + tutte le row, pronta da salvare come struttura. */
export function LibraryPage() {
  const families = Array.from(new Set(ROWS.map((r) => r.family)));
  return (
    <>
      <PageHero crumbs={[{ label: 'Libreria row' }]} eyebrow="Struttura del sito" title={`Libreria di *${ROW_COUNT} row*`} lead={`${ROW_COUNT} row (${ROWS.length} contando le varianti) raggruppate per famiglia, con le regole del design system. Ogni row usa gli stessi colori, font, misure e margini.`}>
        <div className="flex flex-wrap gap-2">
          {families.map((f) => (
            <a key={f} href={`#libreria`} onClick={(e) => { e.preventDefault(); document.getElementById(`fam-${f}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Pill>
                {f} · {ROWS.filter((r) => r.family === f).length}
              </Pill>
            </a>
          ))}
        </div>
      </PageHero>
      <Rules />
      {families.map((f) => (
        <div key={f} id={`fam-${f}`} className="scroll-mt-24">
          <Section tone="ink" pad="none" className="py-8">
            <Container className="flex items-baseline justify-between">
              <Heading size="h3" as="h2" text={`*${f}*`} />
              <Lead className="!text-sm">{ROWS.filter((r) => r.family === f).length} row</Lead>
            </Container>
          </Section>
          {ROWS.filter((r) => r.family === f).map(({ id, num, name, Component, props }) => (
            <div key={id}>
              <p className="flex items-center gap-3 px-6 pb-1 pt-6 text-xs text-mute">
                <b className="font-semibold text-brand">{num}</b>
                <span className="font-semibold text-ink">{name}</span>
                <code className="text-mute">{id}</code>
              </p>
              <Component {...(props ?? {})} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

