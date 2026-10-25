import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, CalendarDays, Store, TrendingUp, Users } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { APP, MARKET, TIERS, type QA } from '../data';
import { AnswerBox, CtaDual, FaqSeo, FeatureSplit, HeroPlatform, Related } from '../rows';
import { ToolLead, ToolsHubGrid } from '../tools';
import type { ExPage } from './types';

/* /guide-e-risorse/ — pagina ex Elementor rifatta nel template v2 (testo originale: copia del 22/10/2026).
   Hub delle risorse gratuite. Le guide linkate sono solo quelle presenti in embed/wp-paths.json
   (URL pubblicati oggi). Tolti: i PDF da scaricare (il modulo era "in attivazione"), il corso Social Ads 2025,
   "piattaforma #1 in Italia". */

type Guide = { tag: string; t: string; x: string; href: string; icon: typeof BookOpen; c: string };

/** Le tre guide 2026 della vecchia pagina (gli articoli esistono ancora). */
const GUIDE_2026: Guide[] = [
  { tag: 'Dati', t: 'Benchmark influencer 2026', x: 'I nuovi standard del mercato: costi medi, engagement e come leggerli prima di scegliere un creator.', href: '#/benchmark-influencer-2026-i-nuovi-standard-del-mercato/', icon: TrendingUp, c: 'bg-ink text-white' },
  { tag: 'Strategia', t: 'Trasformare i clienti in brand ambassador', x: 'Un metodo pratico per attivare i clienti più affezionati e ottenere contenuti UGC autentici.', href: '#/come-trasformare-clienti-brand-ambassador/', icon: Users, c: 'bg-brand text-white' },
  { tag: 'Retail', t: 'Creator geolocalizzati per il retail', x: 'Come pianificare campagne con creator della zona per portare persone in negozio.', href: '#/guida-alla-pianificazione-content-creator-geolocalizzati-per-retail-nel-2026/', icon: Store, c: 'bg-acid text-ink' },
];

/** Altre guide del blog, per brand e per creator (URL presenti in wp-paths.json). */
const BRAND_GUIDES = [
  { label: 'Micro influencer marketing', text: 'La guida definitiva 2026', href: '#/guida-definitiva-al-micro-influencer-marketing-2026/' },
  { label: 'Costo di una campagna social', text: 'Come calcolarlo, guida 2026', href: '#/come-calcolare-il-costo-di-una-campagna-social-guida-2026/' },
  { label: 'Cosa fa un brand ambassador', text: 'Ruolo, compiti e come sceglierlo', href: '#/guida-completa-che-cosa-fa-un-brand-ambassador/' },
  { label: 'Scegliere l’influencer giusto', text: '5 consigli per la tua azienda', href: '#/5-consigli-per-scegliere-linfluencer-giusto-per-la-tua-azienda/' },
];
const CREATOR_GUIDES = [
  { label: 'Come diventare influencer', text: 'La guida completa 2026', href: '#/come-diventare-influencer-la-guida-completa-2026/' },
  { label: 'Media kit perfetto', text: 'Crearlo in 5 passi', href: '#/creare-un-media-kit-perfetto-per-influencer-guida-in-5-step/' },
  { label: 'Piano editoriale efficace', text: 'Guida pratica', href: '#/come-fare-un-piano-editoriale-efficace-guida-pratica-2025/' },
  { label: 'Personal branding', text: 'Le 8 regole essenziali', href: '#/le-8-regole-del-personal-branding-una-guida-essenziale/' },
];

const FAQ_RISORSE: QA[] = [
  { q: 'Le guide e i tool sono gratuiti?', a: 'Sì. Le guide sono articoli liberi da leggere e i tool di influencer marketing funzionano dal browser, gratis e senza registrazione.' },
  { q: 'Qual è un buon engagement rate su Instagram?', a: `Dipende dalla fascia di follower. Secondo le fonti italiane raccolte da Influencee la media è circa ${MARKET.erIG[0].v.toLocaleString('it-IT')}% per i nano influencer, ${MARKET.erIG[1].v.toLocaleString('it-IT')}% per i micro e ${MARKET.erIG[4].v.toLocaleString('it-IT')}% per i profili oltre il milione di follower.` },
  { q: 'Come si pianificano i contenuti con creator e UGC?', a: 'Con un calendario che raccoglie date di consegna e di pubblicazione di ogni creator. Per il piano editoriale dei tuoi canali c’è il calendario editoriale gratuito; nella piattaforma il calendario delle campagne mostra le scadenze di tutte le collaborazioni.' },
  { q: 'Posso farmi aiutare dal team di Influencee?', a: 'Sì: puoi chiedere una demo della piattaforma con creator del tuo settore, oppure affidare al team l’intera campagna con il servizio gestito.' },
];

/* ─── Visual hero: copertine delle guide ─────────────────────────── */
function GuideStack({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {GUIDE_2026.map((g, i) => (
        <div key={g.t} className={`relative h-44 rounded-[26px] p-6 shadow-float ${g.c} ${i === 0 ? '' : '-mt-16'} ${i === 1 ? 'ml-6 sm:ml-12' : i === 2 ? 'ml-12 sm:ml-24' : ''}`} style={{ zIndex: i + 1 }}>
          <div className="flex items-center justify-between">
            <span className={`${TYPE.label} opacity-70`}>{g.tag} · 2026</span>
            <g.icon className="h-5 w-5" />
          </div>
          <p className="mt-3 max-w-[16rem] font-heading text-lg font-semibold leading-tight tracking-tight sm:text-xl">{g.t}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Le guide 2026: card copertina + link all'articolo ──────────── */
function GuideCards() {
  return (
    <Section tone="white" id="guide">
      <Container>
        <SectionHeader eyebrow="Guide 2026" title={'Dati e strategie\n*per l’influencer marketing*'} lead="Tre guide pratiche per brand, agenzie e negozi: leggile gratis sul blog." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} md:grid-cols-3`}>
          {GUIDE_2026.map((g, i) => (
            <motion.a key={g.href} href={g.href} {...reveal(i)} className="group flex flex-col overflow-hidden rounded-3xl bg-paper transition hover:-translate-y-1">
              <div className={`flex aspect-[16/10] flex-col justify-between p-6 ${g.c}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <g.icon className="h-5 w-5" />
                </span>
                <span className={`${TYPE.label} opacity-75`}>{g.tag} · 0{i + 1}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className={TYPE.h3}>{g.t}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{g.x}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                  Leggi la guida <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Altre guide del blog, divise per pubblico ──────────────────── */
function GuideLists() {
  const cols = [
    { tag: 'Per brand e agenzie', items: BRAND_GUIDES, dark: true },
    { tag: 'Per creator', items: CREATOR_GUIDES, dark: false },
  ];
  return (
    <Section tone="paper">
      <Container>
        <SectionHeader eyebrow="Dal blog" title={'Altre guide\n*da leggere*'} lead="Articoli pratici scelti per chi lancia campagne e per chi lavora con i brand." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} lg:grid-cols-2`}>
          {cols.map((c, k) => (
            <motion.div key={c.tag} {...reveal(k)} className={`rounded-3xl p-6 sm:p-8 ${c.dark ? 'bg-ink text-white' : 'bg-white ring-1 ring-line'}`}>
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.dark ? 'bg-acid text-ink' : 'bg-brand text-white'}`}>
                  <BookOpen className="h-5 w-5" />
                </span>
                <p className="font-heading text-xl font-semibold tracking-tight">{c.tag}</p>
              </div>
              <ul className={`mt-6 divide-y ${c.dark ? 'divide-white/10' : 'divide-line'}`}>
                {c.items.map((it) => (
                  <li key={it.href}>
                    <a href={it.href} className="group flex items-center justify-between gap-4 py-4">
                      <span className="min-w-0">
                        <span className="block font-semibold">{it.label}</span>
                        <span className={`block text-sm ${c.dark ? 'text-white/60' : 'text-mute'}`}>{it.text}</span>
                      </span>
                      <ArrowRight className={`h-5 w-5 flex-none transition group-hover:translate-x-1 ${c.dark ? 'text-acid' : 'text-brand'}`} />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="#/blog/" variant="secondary">
            Tutti gli articoli del blog
          </Button>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Visual: settimana del calendario editoriale ────────────────── */
function EditorialWeek() {
  const days = [
    ['Lun', 'Reel', 'bg-brand text-white'],
    ['Mar', '', ''],
    ['Mer', 'Post UGC', 'bg-acid text-ink'],
    ['Gio', 'Storie', 'bg-ink text-white'],
    ['Ven', '', ''],
    ['Sab', 'Reel creator', 'bg-brand text-white'],
    ['Dom', '', ''],
  ];
  return (
    <div className="mx-auto max-w-[480px] rounded-[28px] bg-white p-5 shadow-float ring-1 ring-line sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-semibold">Calendario editoriale</p>
        <CalendarDays className="h-5 w-5 text-brand" />
      </div>
      <p className="mt-1 text-xs text-mute">Esempio di settimana con contenuti dei creator e UGC</p>
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {days.map(([d, t, c]) => (
          <div key={d} className="flex flex-col gap-1.5">
            <span className="text-center text-[10px] font-semibold text-mute">{d}</span>
            <span className={`flex h-20 items-end rounded-xl p-1.5 text-[9px] font-semibold leading-tight sm:text-[10px] ${t ? c : 'bg-paper'}`}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Visual: engagement medio per fascia (MARKET, con fonte) ────── */
function ErBars() {
  const max = Math.max(...MARKET.erIG.map((e) => e.v));
  return (
    <div className="mx-auto max-w-[480px] rounded-[28px] bg-ink p-6 text-white shadow-float">
      <p className={`${TYPE.label} text-white/55`}>Engagement medio Instagram</p>
      <div className="mt-6 flex h-48 items-end gap-3">
        {MARKET.erIG.map((e, i) => (
          <div key={TIERS[i].id} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-semibold">{e.v.toLocaleString('it-IT')}%</span>
            <span className={`w-full rounded-t-xl ${i === 1 ? 'bg-acid' : 'bg-white/25'}`} style={{ height: `${(e.v / max) * 130}px` }} />
            <span className="text-[11px] text-white/65">{TIERS[i].name}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-white/50">Fonti: ONIM, DeRev; la fascia Macro è un valore indicativo.</p>
    </div>
  );
}

function GuideRisorse() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Risorse' }, { label: 'Guide e risorse' }]}
        eyebrow="Risorse gratuite"
        title={'Guide e risorse\n*di influencer marketing*'}
        lead="Dati, strategie e strumenti gratuiti per lavorare con i creator nel 2026: guide pratiche, benchmark di engagement e tool da usare subito dal browser."
        actions={
          <>
            <Button href="#/social-media-tool/">Apri i tool gratuiti</Button>
            <Button href={APP.brand} variant="secondary">
              Prova la piattaforma
            </Button>
          </>
        }
        visual={<GuideStack className="mx-auto max-w-[440px]" />}
      />
      <AnswerBox
        q="Dove trovo guide gratuite di influencer marketing?"
        a="In questa pagina trovi le guide di Influencee per brand, agenzie e creator, i valori di riferimento dell’engagement per fascia di follower e i tool gratuiti: fake follower checker, calcolo dell’engagement rate, costo di un influencer, calendario editoriale e preventivo per una campagna gestita."
        points={['Guide 2026 sul blog', 'Benchmark con le fonti', 'Tool senza registrazione', 'Calendario editoriale']}
      />
      <GuideCards />
      <FeatureSplit
        tone="paper"
        eyebrow="Strumenti di pianificazione"
        title={'Pianifica e confronta\n*con i numeri giusti*'}
        items={[
          {
            eyebrow: 'Tool gratuito',
            title: 'Calendario editoriale',
            text: 'Organizza in un unico calendario i contenuti dei tuoi canali, dei creator e degli UGC. Quando lavori con più creator, nella piattaforma il calendario delle campagne raccoglie consegne, revisioni e pubblicazioni.',
            bullets: ['Gratuito, dal browser', 'Contenuti dei creator e UGC insieme', 'Nella piattaforma: scadenze di ogni collaborazione'],
            visual: <EditorialWeek />,
            href: '#/social-media-tool/calendario-editoriale/',
            cta: 'Apri il calendario editoriale',
          },
          {
            eyebrow: 'Benchmark',
            title: 'Engagement di riferimento per fascia',
            text: 'Un buon engagement dipende dalla dimensione del profilo: confronta sempre un creator con la media della sua fascia di follower. I valori indicano la fonte, italiana o indicativa.',
            bullets: ['Nano, Micro, Mid, Macro e Mega', 'Fonti dichiarate', 'Calcolatore e check sponsor'],
            visual: <ErBars />,
            href: '#/benchmark-engagement-rate/',
            cta: 'Vedi il benchmark',
          },
        ]}
      />
      <Section tone="white" pad="none" className="pt-20 sm:pt-28">
        <Container>
          <SectionHeader eyebrow="Tool gratuiti" title={'Strumenti da usare\n*subito*'} lead="Gratis e senza registrazione: scegli quelli per il tuo ruolo." />
        </Container>
      </Section>
      <div className="[&>section]:!pt-10 sm:[&>section]:!pt-12">
        <ToolsHubGrid tone="white" />
      </div>
      <GuideLists />
      <ToolLead
        tool="guide_risorse"
        tone="white"
        context="Pagina: Guide e risorse"
        eyebrow="Demo"
        title={'Vuoi vedere la piattaforma\n*con il tuo settore?*'}
        lead="Lasciaci i contatti: in una call ti mostriamo creator del tuo settore e come si gestisce una campagna, dal brief ai click."
        bullets={['Creator del tuo settore e della tua zona', 'Campagne, contratto e link tracciati', 'Nessun impegno']}
        cta="Richiedi la demo"
      />
      <FaqSeo items={FAQ_RISORSE} />
      <Related
        links={[
          { label: 'Come funziona Influencee', text: 'Il tutorial della piattaforma', href: '#/tutorial-piattaforma-influencee/' },
          { label: 'Quanto costa un influencer', text: 'Calcolatore con la media di mercato', href: '#/social-media-tool/costo-influencer/' },
          { label: 'Preventivo campagna', text: 'La campagna gestita dal team', href: '#/preventivo-campagne/' },
          { label: 'Agenzia influencer', text: 'Deleghi tutto a noi', href: '#/agenzia-influencer/' },
        ]}
      />
      <CtaDual />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/guide-e-risorse/',
  ready: true,
  titles: ['Guide e risorse gratuite di influencer marketing', 'Guide e risorse di influencer marketing', 'Guide e risorse'],
  meta: {
    label: 'Guide e risorse',
    type: 'page',
    kw: 'guide influencer marketing',
    description: 'Guide e risorse gratuite di influencer marketing: benchmark 2026, strategie per brand e creator, calendario editoriale e tool gratuiti.',
    crumbs: [{ label: 'Risorse' }, { label: 'Guide e risorse' }],
    faq: FAQ_RISORSE,
  },
  el: () => <GuideRisorse />,
};
