import React from 'react';
import { motion } from 'motion/react';
import { Building2, Sparkles } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { APP, FACTS, type QA } from '../data';
import { AnnunciMock, CalendarMock, CollabMock, ContractMock, KitMock, LinkMock, ProfileMock, SearchMock, SignupMock } from '../mocks';
import { AnswerBox, CtaDual, FaqSeo, FeatureSplit, HeroPlatform, Plans, Related, Steps, type FeatureItem } from '../rows';
import type { ExPage } from './types';

/* /tutorial-piattaforma-influencee/ — pagina ex Elementor rifatta nel template v2 (testo originale: copia del 22/10/2026).
   Il vecchio tutorial descriveva l'app precedente (dashboard, assistente AI, liste condivise, documenti e fatture,
   creator manager, impostazioni). Qui resta "come funziona Influencee", riscritto sulle funzioni dell'app di oggi
   (le stesse delle pagine /funzionalita/ in pages.tsx), con una parte per i brand e una per i creator. */

/* ─── Visual: avvio dell'account azienda (piani reali, data.ts) ──── */
function BrandStartCard() {
  const rows = [
    { t: 'Account azienda o agenzia', x: 'Pochi minuti, nessuna carta', on: true },
    { t: `Premium in prova ${FACTS.trialDays} giorni`, x: 'Tutti i risultati, filtri e contatti', on: true },
    { t: 'Dopo la prova', x: 'Gratis, oppure 19 € al mese · 49 € a trimestre · 199 € all’anno', on: false },
  ];
  return (
    <div className="mx-auto max-w-[460px] rounded-[28px] bg-white p-5 shadow-float ring-1 ring-line sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-semibold">Registra l’azienda</p>
        <span className="rounded-full bg-acid px-2.5 py-1 text-[11px] font-semibold">Prova gratuita</span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {rows.map((r, i) => (
          <li key={r.t} className={`flex items-center gap-3 rounded-2xl p-3 ${r.on ? 'bg-paper' : 'bg-ink text-white'}`}>
            <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-semibold ${r.on ? 'bg-brand text-white' : 'bg-acid text-ink'}`}>{i + 1}</span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold">{r.t}</span>
              <span className={`block text-[11px] ${r.on ? 'text-mute' : 'text-white/65'}`}>{r.x}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-[11px] text-mute">Prezzi IVA inclusa · nessuna commissione sulle collaborazioni</p>
    </div>
  );
}

const BRAND_FIND: FeatureItem[] = [
  {
    eyebrow: 'Passo 1 · Iscrizione',
    title: 'Registra l’azienda e prova Premium',
    text: `Crei l’account dell’azienda o dell’agenzia in pochi minuti. Hai ${FACTS.trialDays} giorni di Premium in prova, senza carta: poi puoi restare gratis o scegliere il piano mensile, trimestrale o annuale.`,
    bullets: ['Nessuna carta per la prova', `Piano gratuito con i primi ${FACTS.freeResults} risultati in chiaro`, 'Nessuna commissione per il brand'],
    visual: <BrandStartCard />,
    href: APP.brand,
    cta: 'Registra la tua azienda',
  },
  {
    eyebrow: 'Passo 2 · Ricerca',
    title: 'Cerca i creator con i filtri',
    text: 'Dieci gruppi di filtri: categoria, città e regione, fascia di follower, tipo di creator, piattaforma, engagement, crescita e badge di fiducia. Scegli la vista a riquadri, tabella o mappa e salva la ricerca come lista: si aggiorna da sola quando entrano nuovi profili.',
    bullets: ['Liste salvate e preferiti', 'Vista a riquadri, tabella o mappa', 'Export CSV con Premium'],
    visual: <SearchMock />,
    href: '#/funzionalita/database-influencer/',
    cta: 'Come funziona la ricerca',
  },
  {
    eyebrow: 'Passo 3 · Valutazione',
    title: 'Apri la scheda e valuta il creator',
    text: 'Per ogni piattaforma vedi follower, engagement rispetto alla fascia, crescita a 30 e 90 giorni, contenuti recenti e brand citati con #adv. Ogni numero dice se è dichiarato, autenticato, osservato o stimato, e quando è stato aggiornato.',
    bullets: ['Badge Verificato da account collegato', 'Prezzi indicativi dichiarati dal creator', 'Contatti solo se il creator è contattabile'],
    visual: <ProfileMock />,
    href: '#/creator-verificati/',
    cta: 'Come leggiamo i dati',
  },
  {
    eyebrow: 'In alternativa · Annuncio',
    title: 'Pubblica un annuncio e fai candidare i creator',
    text: 'Con l’annuncio veloce descrivi cosa cerchi, il compenso e la scadenza: va online subito nella bacheca pubblica, i creator iscritti si candidano e tu scegli dalla lista delle candidature.',
    bullets: ['Compenso, cambio merce, affiliazione, ospitalità', 'Bacheca pubblica', 'Candidature in un’unica lista'],
    visual: <AnnunciMock />,
    href: '#/pubblica-offerta-lavoro/',
    cta: 'Come funzionano gli annunci',
  },
];

const BRAND_MANAGE: FeatureItem[] = [
  {
    eyebrow: 'Passo 4 · Campagna',
    title: 'Crea la campagna e invita i creator',
    text: 'Scegli l’obiettivo e come trovare i creator: ti guidiamo noi, pubblichi un annuncio o li scegli tu. Scrivi brief, target, offerta e termini, poi invita i profili scelti. Puoi scrivere a ogni creator in chat dentro la collaborazione.',
    bullets: ['Brief, target, offerta e termini', 'Compenso in denaro, cambio merce, affiliazione, formula ibrida, ospitalità o evento', 'Chat con i creator delle tue collaborazioni'],
    visual: <CollabMock />,
    href: '#/funzionalita/gestione-campagne/',
    cta: 'Scopri la gestione campagne',
  },
  {
    eyebrow: 'Passo 5 · Accordo e contratto',
    title: 'Termini accettati da entrambi, contratto generato',
    text: 'Ogni controproposta crea una nuova versione dei termini: la collaborazione diventa attiva solo quando brand e creator accettano la stessa versione. A quel punto la piattaforma genera il contratto con contenuti, scadenze, compenso e diritti d’uso.',
    bullets: ['Termini in versioni con doppia accettazione', 'Contratto in DOCX (o PDF) con impronta', 'Valutazione reciproca a fine collaborazione'],
    visual: <ContractMock />,
    href: '#/funzionalita/contratto-influencer/',
    cta: 'Come nasce il contratto',
  },
  {
    eyebrow: 'Passo 6 · Consegne',
    title: 'Segui consegne e scadenze nel calendario',
    text: 'Il creator consegna i contenuti nella collaborazione: tu approvi o chiedi modifiche. Il calendario raccoglie consegne, revisioni e pubblicazioni di tutte le campagne, con le consegne in ritardo in evidenza.',
    bullets: ['Vista calendario o lista', 'Stato di ogni contenuto', 'Etichetta "In ritardo"'],
    visual: <CalendarMock />,
    href: '#/funzionalita/calendario-campagne/',
    cta: 'Scopri il calendario',
  },
  {
    eyebrow: 'Passo 7 · Risultati',
    title: 'Misura i click di ogni contenuto',
    text: 'Ogni contenuto ha il suo link con i parametri UTM già inseriti: conti click e visitatori unici, senza salvare indirizzi IP e con i bot esclusi. Puoi creare link anche per bio, newsletter, QR e volantini.',
    bullets: [`${FACTS.freeLinks} link attivi gratis, illimitati con Premium`, 'QR scaricabile', 'Pagina risultati per ogni collaborazione'],
    visual: <LinkMock />,
    href: '#/funzionalita/link-tracciati/',
    cta: 'Scopri i link tracciati',
  },
];

const CREATOR_ITEMS: FeatureItem[] = [
  {
    eyebrow: 'Creator · Iscrizione',
    title: 'Profilo in pochi minuti, gratis',
    text: 'Accedi con Google o con un link via email, scrivi chi sei e collega Instagram, TikTok, YouTube o LinkedIn in sola lettura. Collegando un social ottieni il badge Verificato.',
    bullets: ['Nessuna password', 'Social collegati in sola lettura', 'Fino a 5 categorie e prezzo indicativo'],
    visual: <SignupMock />,
    href: '#/diventa-creator/',
    cta: 'Come iscriversi',
  },
  {
    eyebrow: 'Creator · Media kit',
    title: 'Il media kit che si aggiorna da solo',
    text: 'Il media kit raccoglie i tuoi numeri dagli account collegati, i contenuti in vetrina e le collaborazioni, con la data dei dati sempre visibile. Lo scarichi in PDF o lo condividi con un link pubblico.',
    bullets: ['Numeri presi dagli account collegati', 'Contenuti in vetrina scelti da te', 'Link pubblico solo se lo attivi tu'],
    visual: <KitMock />,
    href: '#/funzionalita/media-kit/',
    cta: 'Scopri il media kit',
  },
  {
    eyebrow: 'Creator · Proposte',
    title: 'Ricevi inviti e candidati agli annunci',
    text: 'I brand ti invitano alle campagne o ti scrivono in chat, oppure ti candidi agli annunci aperti. Puoi fare una controproposta sui termini; quando accettate la stessa versione la collaborazione parte e il contratto viene generato.',
    bullets: ['Controproposte con versioni dei termini', 'Consegne e richieste di modifica nella collaborazione', 'Scadenze di tutte le collaborazioni in calendario'],
    visual: <CollabMock />,
    href: '#/offerte-lavoro-influencer/',
    cta: 'Vedi gli annunci aperti',
  },
];

const FAQ_TUTORIAL: QA[] = [
  { q: 'Come funziona Influencee?', a: 'Il brand cerca creator italiani con i filtri oppure pubblica un annuncio, crea la campagna con brief e termini e invita i profili scelti. Quando entrambi accettano la stessa versione dei termini la collaborazione parte: il creator consegna, il brand approva, il contratto viene generato e i link tracciati contano i click di ogni contenuto.' },
  { q: 'Quanto costa usare Influencee?', a: `Per i creator è gratis. Le aziende possono iniziare gratis; Premium costa 19 € al mese, 49 € a trimestre o 199 € all’anno, IVA inclusa, con ${FACTS.trialDays} giorni di prova senza carta.` },
  { q: 'Posso chiedere al creator una controproposta?', a: 'Sì: ogni controproposta crea una nuova versione dei termini e azzera le accettazioni. La collaborazione parte solo quando brand e creator accettano la stessa versione.' },
  { q: 'Influencee usa l’intelligenza artificiale per la ricerca?', a: 'No. Ricerca, categorie e fasce di follower seguono regole chiare e verificabili: ogni numero mostra da dove arriva e la data dell’ultimo aggiornamento.' },
  { q: 'Come parlo con un creator?', a: 'Dalla collaborazione, con la chat: lì restano anche termini, consegne e scadenze. Con Premium vedi anche i contatti dei creator che li hanno resi disponibili.' },
  { q: 'Il team può gestire la campagna al posto mio?', a: 'Sì. Se preferisci delegare, il team di Influencee sceglie i creator con te, prepara brief e accordi, segue i contenuti e misura i risultati, come un’agenzia di influencer marketing.' },
];

/* ─── Scelta del percorso: brand o creator ───────────────────────── */
function PathPicker() {
  const paths = [
    { icon: Building2, tag: 'Per aziende e agenzie', t: 'Trovare creator e gestire le campagne', x: 'Iscrizione, ricerca, scheda, annuncio, campagna, contratto, calendario e link tracciati: 7 passi.', c: 'bg-ink text-white', id: 'brand', steps: ['Iscrizione', 'Ricerca', 'Valutazione', 'Campagna', 'Contratto', 'Consegne', 'Risultati'] },
    { icon: Sparkles, tag: 'Per i creator', t: 'Ricevere proposte dai brand', x: 'Iscrizione gratuita, media kit, inviti, annunci, termini, consegne e scadenze.', c: 'bg-acid text-ink', id: 'creator', steps: ['Iscrizione', 'Media kit', 'Proposte', 'Contratto'] },
  ];
  return (
    <Section tone="white">
      <Container>
        <SectionHeader eyebrow="Indice della guida" title={'Da dove\n*vuoi iniziare?*'} lead="La guida ha due parti: una per chi cerca creator e una per chi è creator. Scegli la tua." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} md:grid-cols-2`}>
          {paths.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              {...reveal(i)}
              onClick={() => document.getElementById(`tutorial-${p.id}`)?.scrollIntoView({ behavior: 'smooth' })}
              className={`group rounded-3xl p-7 text-left transition hover:-translate-y-1 sm:p-8 ${p.c}`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${i ? 'bg-ink text-white' : 'bg-acid text-ink'}`}>
                <p.icon className="h-5 w-5" />
              </span>
              <p className={`mt-6 ${TYPE.label} opacity-70`}>{p.tag}</p>
              <p className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{p.t}</p>
              <p className="mt-3 text-sm opacity-75">{p.x}</p>
              <ol className="mt-6 flex flex-wrap gap-2">
                {p.steps.map((s, k) => (
                  <li key={s} className={`rounded-full px-3 py-1 text-xs font-semibold ${i ? 'bg-ink/10' : 'bg-white/10'}`}>
                    {k + 1}. {s}
                  </li>
                ))}
              </ol>
            </motion.button>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Intestazione di una parte della guida (ancora per l'indice). */
function PartHeader({ id, tone, eyebrow, title, lead }: { id: string; tone: 'ink' | 'paper' | 'white'; eyebrow: string; title: string; lead: string }) {
  return (
    <Section tone={tone} id={id} pad="none" className="pb-4 pt-20 sm:pt-28">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
      </Container>
    </Section>
  );
}

function Tutorial() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Tutorial' }]}
        eyebrow="Tutorial della piattaforma"
        title={'Come funziona\n*Influencee*'}
        lead="La guida passo passo per usare la piattaforma: per i brand, dalla ricerca dei creator ai click di ogni contenuto; per i creator, dall’iscrizione alle collaborazioni."
        actions={
          <>
            <Button href={APP.brand}>Prova gratis {FACTS.trialDays} giorni</Button>
            <Button href={APP.creator} variant="secondary">
              Sono un creator
            </Button>
          </>
        }
        visual={<SearchMock className="mx-auto max-w-[520px]" />}
        note="Nessuna carta richiesta · i creator si iscrivono gratis"
      />
      <AnswerBox
        q="Come funziona Influencee in breve?"
        a={FAQ_TUTORIAL[0].a}
        points={['Cerchi o pubblichi un annuncio', 'Termini accettati da entrambi', 'Contratto generato', 'Click di ogni contenuto']}
      />
      <PathPicker />
      <Steps
        tone="paper"
        eyebrow="Per i brand in breve"
        title={'Una campagna\n*in 4 mosse*'}
        steps={[
          { t: 'Trova', x: 'Cerca i creator con i filtri o pubblica un annuncio e ricevi candidature.' },
          { t: 'Proponi', x: 'Crea la campagna con brief, offerta e termini e invita i profili scelti.' },
          { t: 'Concorda', x: 'Quando accettate la stessa versione dei termini, il contratto si genera da solo.' },
          { t: 'Misura', x: 'Approvi i contenuti e conti i click con un link tracciato per ognuno.' },
        ]}
        action={<Button href={APP.brand}>Registra la tua azienda</Button>}
      />
      <PartHeader id="tutorial-brand" tone="white" eyebrow="Parte 1 · Brand e agenzie" title={'Trovare\n*i creator giusti*'} lead="Iscrizione, ricerca, valutazione della scheda e, se preferisci, un annuncio a cui i creator si candidano." />
      <FeatureSplit tone="white" items={BRAND_FIND} />
      <PartHeader id="tutorial-campagne" tone="paper" eyebrow="Parte 1 · Brand e agenzie" title={'Gestire\n*la collaborazione*'} lead="Dalla campagna al contratto, dalle consegne ai click: tutto resta nella stessa collaborazione." />
      <FeatureSplit tone="paper" items={BRAND_MANAGE} />
      <PartHeader id="tutorial-creator" tone="white" eyebrow="Parte 2 · Creator" title={'Lavorare con i brand\n*da creator*'} lead="L’iscrizione è gratuita e non serve un numero minimo di follower: con il profilo UGC conta la qualità dei contenuti." />
      <FeatureSplit tone="white" items={CREATOR_ITEMS} />
      <Plans tone="paper" compact />
      <FaqSeo items={FAQ_TUTORIAL} />
      <Related
        links={[
          { label: 'Piattaforma influencer', text: 'Panoramica delle funzioni', href: '#/piattaforma-influencer/' },
          { label: 'Prezzi', text: 'Gratis o Premium', href: '#/prezzi/' },
          { label: 'Guide e risorse', text: 'Guide e tool gratuiti', href: '#/guide-e-risorse/' },
          { label: 'Agenzia influencer', text: 'La campagna gestita dal team', href: '#/agenzia-influencer/' },
        ]}
      />
      <CtaDual />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/tutorial-piattaforma-influencee/',
  ready: true,
  titles: ['Come funziona Influencee: tutorial della piattaforma', 'Come funziona Influencee: tutorial', 'Tutorial piattaforma Influencee'],
  meta: {
    label: 'Tutorial',
    type: 'page',
    kw: 'come funziona influencee',
    description: 'Come funziona Influencee passo passo: per i brand ricerca, annunci, campagne, contratto, calendario e link tracciati; per i creator iscrizione e media kit.',
    crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Tutorial' }],
    faq: FAQ_TUTORIAL,
  },
  el: () => <Tutorial />,
};
