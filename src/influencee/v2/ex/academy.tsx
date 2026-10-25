import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, GraduationCap, Megaphone, Sparkles, TrendingUp, Wrench } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { APP, SITE, type QA } from '../data';
import { AnnunciMock, KitMock, ProfileMock } from '../mocks';
import { AnswerBox, CtaBandV2, FaqSeo, FeatureSplit, HeroPlatform, Related, Steps } from '../rows';
import { ToolLead, ToolsHubGrid } from '../tools';
import type { ExPage } from './types';

/* /academy-influencer-marketing/ — ex Elementor (copia del 22/10/2026), stesso URL.
   I 5 corsi figli (/academy-influencer-marketing/corso-…/) e i corsi content creator sono in pausa e vanno in redirect
   qui (wp-plugin/PAGINE-VECCHIE.md, sezione D): la pagina diventa l'hub della formazione gratuita (guide del blog,
   tool gratuiti, benchmark), senza promettere corsi. Tolti: «Corso del mese», l'elenco dei corsi Facebook/Instagram/
   LinkedIn/TikTok, «gratis per sempre» riferito ai corsi e la citazione di Valentina Audaci (testimonianza non verificabile). */

/** Guide del blog (articoli WordPress già online, stesso URL: fuori dal sito v2, quindi link assoluti). */
const post = (slug: string) => `${SITE.url}/${slug}/`;
type Guide = { t: string; x: string; href: string; tag: string };
const GUIDE_CREATOR: Guide[] = [
  { tag: 'Da dove partire', t: 'Come diventare influencer: la guida completa', x: 'Canali, obiettivi del profilo e sbocchi di lavoro: il punto di partenza.', href: post('come-diventare-influencer-la-guida-completa-2026') },
  { tag: 'Instagram', t: 'Come diventare influencer su Instagram', x: 'Profilo, formati e contenuti per crescere sul social più usato dai brand.', href: post('come-diventare-influencer-instagram-nel-2026') },
  { tag: 'TikTok', t: 'Come diventare influencer su TikTok', x: 'Il social con la crescita più rapida: come farsi notare e restare costanti.', href: post('come-diventare-influencer-tiktok-2026') },
  { tag: 'YouTube', t: 'Collaborazioni con i brand su YouTube', x: 'Sei consigli per proporsi e lavorare bene con le aziende.', href: post('6-consigli-per-avere-successo-nelle-collaborazioni-con-i-brand-su-youtube') },
  { tag: 'Media kit', t: 'Creare un media kit in 5 step', x: 'Cosa mettere nel media kit per presentarti ai brand.', href: post('creare-un-media-kit-perfetto-per-influencer-guida-in-5-step') },
  { tag: 'Personal branding', t: 'Le 8 regole del personal branding', x: 'Come rendere riconoscibile il tuo profilo e il tuo stile.', href: post('le-8-regole-del-personal-branding-una-guida-essenziale') },
];
const GUIDE_BRAND: Guide[] = [
  { tag: 'Strategia', t: 'Come creare una influencer marketing strategy', x: 'Obiettivi, scelta dei creator, budget e misurazione.', href: post('come-creare-una-influencer-marketing-strategy-nel-2026') },
  { tag: 'Micro influencer', t: 'Micro influencer: chi sono e come trovarli', x: 'Perché funzionano per PMI e campagne locali.', href: '#/micro-influencer/' },
  { tag: 'Engagement', t: 'Come calcolare l’engagement rate', x: 'La formula, il calcolatore e il confronto con la fascia di follower.', href: '#/come-calcolare-engagement-rate/' },
  { tag: 'Budget', t: 'Quanto costa un influencer', x: 'Costi medi per fascia, con la fonte di ogni valore.', href: '#/social-media-tool/costo-influencer/' },
  { tag: 'UGC', t: 'Integrare gli UGC nella strategia social', x: 'Come usare i contenuti dei creator su canali e inserzioni.', href: post('come-integrare-gli-ugc-nella-tua-strategia-di-social-media') },
  { tag: 'Locale', t: 'Influencer per ristoranti, negozi ed eventi', x: 'Campagne con creator della tua città, passo per passo.', href: '#/influencer-marketing-locale/' },
];

function GuideTrack({ eyebrow, title, lead, items, dark = false }: { eyebrow: string; title: string; lead: string; items: Guide[]; dark?: boolean }) {
  return (
    <div>
      <div className={`flex items-center gap-4 rounded-3xl p-6 ${dark ? 'bg-ink text-white' : 'bg-acid text-ink'}`}>
        <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${dark ? 'bg-acid text-ink' : 'bg-ink text-white'}`}>{dark ? <Megaphone className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}</span>
        <div>
          <p className={`${TYPE.label} ${dark ? 'text-acid' : ''}`}>{eyebrow}</p>
          <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">{title}</p>
          <p className={`mt-1 text-sm ${dark ? 'text-white/65' : 'text-ink/70'}`}>{lead}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3">
        {items.map((g, i) => (
          <motion.a key={g.href} href={g.href} {...reveal(i % 3)} className="group flex items-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand">
            <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${['bg-brand text-white', 'bg-paper text-ink', 'bg-ink text-white'][i % 3]}`}>
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand-ink">{g.tag}</span>
              <span className="mt-2 block font-heading text-lg font-semibold leading-snug tracking-tight">{g.t}</span>
              <span className="mt-1 block text-sm text-mute">{g.x}</span>
            </span>
            <ArrowRight className="mt-1 h-5 w-5 flex-none text-brand transition group-hover:translate-x-1" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

function GuidesSection() {
  return (
    <Section tone="paper" id="guide">
      <Container>
        <SectionHeader eyebrow="Guide pratiche" title={'Le guide dell’Academy,\n*per creator e per brand*'} lead="Niente teoria: articoli pratici da leggere in pochi minuti e mettere subito in pratica." />
        <div className={`${GAP.header} grid grid-cols-1 gap-8 lg:grid-cols-2`}>
          <GuideTrack eyebrow="Per i creator" title="Diventare creator" lead="Profilo, social e collaborazioni con i brand." items={GUIDE_CREATOR} />
          <GuideTrack dark eyebrow="Per brand e agenzie" title="Lavorare con i creator" lead="Strategia, scelta dei profili, budget e risultati." items={GUIDE_BRAND} />
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="#/blog/">Tutti gli articoli del blog</Button>
          <Button href="#/guide-e-risorse/" variant="secondary">Guide e risorse</Button>
        </div>
      </Container>
    </Section>
  );
}

/** Visual dell'hero: i tre blocchi della formazione gratuita. */
function AcademyMock({ className = '' }: { className?: string }) {
  const rows = [
    { icon: BookOpen, k: 'Guide pratiche', v: '12 guide', pill: 'Creator e brand', c: 'bg-acid text-ink' },
    { icon: Wrench, k: 'Tool gratuiti', v: 'Fake follower, costo, ER', pill: 'Senza registrazione', c: 'bg-brand text-white' },
    { icon: TrendingUp, k: 'Benchmark', v: 'Engagement per fascia', pill: 'Con le fonti', c: 'bg-ink text-white' },
  ];
  return (
    <div className={`rounded-[28px] bg-white p-5 text-ink shadow-float sm:p-6 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-acid"><GraduationCap className="h-5 w-5" /></span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">Academy Influencee</p>
          <p className="font-heading text-lg font-semibold tracking-tight">Formazione gratuita</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center gap-4 rounded-2xl bg-paper p-4">
            <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${r.c}`}><r.icon className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">{r.k}</p>
              <p className="truncate font-heading text-base font-semibold tracking-tight">{r.v}</p>
            </div>
            <span className="hidden rounded-full bg-acid-soft px-2.5 py-1 text-[10px] font-semibold sm:inline">{r.pill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FAQ_ACADEMY: QA[] = [
  { q: 'Cos’è l’Academy di Influencee?', a: 'È la sezione di formazione gratuita di Influencee sull’influencer marketing: guide pratiche per diventare creator e per lavorare con gli influencer, tool gratuiti da usare nel browser e valori di riferimento di engagement per fascia di follower.' },
  { q: 'I corsi dell’Academy sono ancora disponibili?', a: 'No: i vecchi corsi a lezioni (come diventare influencer, Facebook, Instagram, LinkedIn e TikTok) non sono più online. Al loro posto trovi in questa pagina guide pratiche e tool gratuiti sugli stessi temi.' },
  { q: 'L’Academy è gratuita?', a: 'Sì. Guide, tool e benchmark sono gratuiti e si consultano senza registrazione.' },
  { q: 'Rilasciate un attestato?', a: 'No, l’Academy non rilascia attestati o certificati: è una raccolta di guide e strumenti pratici.' },
  { q: 'Da dove inizio se voglio diventare influencer?', a: 'Dalla guida completa su come diventare influencer, poi da quelle dedicate a Instagram e TikTok. Quando sei pronto, crea gratis il profilo su Influencee e candidati alle offerte dei brand.' },
  { q: 'Ci sono contenuti per aziende e agenzie?', a: 'Sì: strategia di influencer marketing, micro influencer, calcolo dell’engagement rate, costo di un influencer e campagne locali, più i tool per controllare un profilo prima di pagarlo.' },
];

function AcademyPage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Risorse' }, { label: 'Academy influencer marketing' }]}
        eyebrow="Influencee presenta"
        title={'Academy influencer marketing:\n*guide e tool gratuiti*'}
        lead="Nessuna teoria, solo pratica: guide per diventare creator e per lavorare con gli influencer, strumenti gratuiti da usare subito e valori di riferimento per fascia. Tutto gratis, senza registrazione."
        actions={
          <>
            <Button onClick={() => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' })}>Inizia dalle guide</Button>
            <Button href="#/social-media-tool/" variant="secondary">
              Tool gratuiti
            </Button>
          </>
        }
        visual={<AcademyMock className="mx-auto max-w-[480px]" />}
        note="Gratis · senza registrazione · per creator, brand e agenzie"
      />
      <AnswerBox
        q="Cos’è l’Academy influencer marketing di Influencee?"
        a="È la formazione gratuita di Influencee: guide pratiche per orientarsi tra canali social, obiettivi del profilo e collaborazioni con i brand, tool per verificare un creator prima di pagarlo e benchmark di engagement per fascia di follower. I vecchi corsi a lezioni sono stati sostituiti da questi contenuti, più brevi e aggiornati."
        points={['Guide per creator', 'Guide per brand e agenzie', 'Tool gratuiti nel browser', 'Benchmark per fascia']}
      />
      <GuidesSection />
      <Steps
        title={'Il percorso consigliato\n*per chi vuole diventare creator*'}
        lead="Dalla teoria alla prima collaborazione, con strumenti gratuiti."
        steps={[
          { t: 'Leggi la guida', x: 'Come diventare influencer: canali, obiettivi e sbocchi di lavoro.' },
          { t: 'Misura il tuo profilo', x: 'Calcola l’engagement rate e confrontalo con la tua fascia.' },
          { t: 'Prepara il media kit', x: 'Crea il profilo gratis: il media kit si compila con i tuoi numeri.' },
          { t: 'Candidati', x: 'Rispondi alle offerte dei brand nella bacheca.' },
        ]}
        action={<Button href={APP.creator}>Crea il profilo gratis</Button>}
      />
      <Section tone="white" pad="none" className="pt-20 sm:pt-28">
        <Container>
          <SectionHeader eyebrow="Tool gratuiti" title={'Metti in pratica\n*con i tool gratuiti*'} lead="Controlla i fake follower, calcola engagement e costo di un creator, trova offerte di collaborazione. Tutto dal browser." />
        </Container>
      </Section>
      <ToolsHubGrid tone="white" />
      <FeatureSplit
        tone="paper"
        eyebrow="Dati e lavoro"
        title={'Dai numeri\n*alle prime collaborazioni*'}
        items={[
          { eyebrow: 'Benchmark', title: 'Engagement rate: i valori per fascia', text: 'Un 3% può essere ottimo per un macro influencer e basso per un nano: il benchmark mostra i valori di riferimento per Nano, Micro, Mid, Macro e Mega, con la fonte di ogni numero.', bullets: ['Mediana, non media', 'Confronto nella stessa fascia', 'Solo valori aggregati'], visual: <ProfileMock />, href: '#/benchmark-engagement-rate/', cta: 'Apri il benchmark' },
          { eyebrow: 'Inizia a lavorare da subito', title: 'Le offerte di lavoro per creator', text: 'Consulta la bacheca e candidati alle collaborazioni pubblicate dalle aziende che cercano creator: pagate, in cambio merce o con percentuale sulle vendite.', bullets: ['Candidature gratuite', 'Profilo con numeri verificati', 'Termini e contratto nella collaborazione'], visual: <AnnunciMock />, href: '#/offerte-lavoro-influencer/', cta: 'Vai alle offerte' },
          { eyebrow: 'Media kit', title: 'Il tuo media kit, già pronto', text: 'Quando crei il profilo su Influencee il media kit si compila con i numeri degli account collegati e mostra la data dell’ultimo aggiornamento. Lo condividi con un link o in PDF.', bullets: ['Gratis per i creator', 'Numeri dagli account collegati', 'PDF e link pubblico'], visual: <KitMock />, href: '#/funzionalita/media-kit/', cta: 'Scopri il media kit' },
        ]}
      />
      <ToolLead tool="academy" context="Pagina: Academy influencer marketing" tone="white" eyebrow="Nuove guide" title={'Ti avvisiamo quando escono\n*nuove guide e nuovi tool*'} lead="Lasciaci nome ed email: ti scriviamo solo quando pubblichiamo una guida o un tool gratuito." bullets={['Guide pratiche per creator e brand', 'Nessuno spam', 'Ti cancelli quando vuoi']} cta="Avvisami" phone="no" />
      <FaqSeo tone="paper" items={FAQ_ACADEMY} />
      <Related
        links={[
          { label: 'Guide e risorse', text: 'Tutte le risorse di Influencee', href: '#/guide-e-risorse/' },
          { label: 'Blog', text: 'Articoli per brand e creator', href: '#/blog/' },
          { label: 'Diventa creator', text: 'Iscrizione gratuita in 4 passi', href: '#/diventa-creator/' },
          { label: 'Tool gratuiti', text: 'Senza registrazione', href: '#/social-media-tool/' },
        ]}
      />
      <CtaBandV2 tone="soft" title={'Inizia a lavorare\n*da subito*'} lead="Consulta le offerte di lavoro ed entra in contatto con le aziende che cercano creator." primary={{ label: 'Vai alle offerte', href: '#/offerte-lavoro-influencer/' }} secondary={{ label: 'Iscriviti gratis', href: APP.creator }} />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/academy-influencer-marketing/',
  ready: true,
  titles: ['Academy influencer marketing: guide gratuite', 'Academy influencer marketing gratuita', 'Academy influencer marketing'],
  meta: {
    label: 'Academy influencer marketing',
    type: 'page',
    kw: 'academy influencer marketing',
    description: 'La formazione gratuita di Influencee: guide pratiche per diventare creator e lavorare con gli influencer, tool gratuiti e benchmark di engagement.',
    crumbs: [{ label: 'Risorse' }, { label: 'Academy influencer marketing' }],
    faq: FAQ_ACADEMY,
  },
  el: () => <AcademyPage />,
};
