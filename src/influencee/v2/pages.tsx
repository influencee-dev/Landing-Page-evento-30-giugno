import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ds';
import { HeroReels, ReelWall, WorkReelCard } from '../rows/reels';
import { REELS } from '../site/data';
import { CtaForm } from '../rows/spoki';
import { APP, CATEGORIES, CREATOR_TYPES, FACTS, FAQ, REGIONS, SITE, WHATSAPP, type QA } from './data';
import { AnnunciMock, CollabMock, DiscoveryMock, KitMock, LinkMock, ProfileMock, SearchMock, SignupMock } from './mocks';
import {
  AnswerBox,
  AudienceRow,
  CardGrid,
  CategoryGrid,
  CtaBandV2,
  CtaDual,
  FactsBand,
  FaqSeo,
  FeatureSplit,
  HeroCenter,
  HeroPlatform,
  ManagedRow,
  Plans,
  Prose,
  RegionGrid,
  Related,
  Steps,
  TiersRow,
  type Crumb,
  type FeatureItem,
} from './rows';

/* ════════════════════════════════════════════════════════════════════
   PAGINE v2 — ogni route restituisce contenuto + metadati SEO.
   Gli URL (path dopo #) sono quelli definitivi del sito: dove esisteva
   già una pagina indicizzata lo slug resta identico.
   ════════════════════════════════════════════════════════════════════ */

export interface Meta {
  path: string;
  title: string; // ≤ 60 caratteri
  description: string; // ≤ 155 caratteri
  kw: string; // keyword principale
  label: string; // nome breve (sipario, breadcrumb)
  crumbs?: Crumb[];
  faq?: QA[];
  type?: 'home' | 'software' | 'page' | 'pricing';
}
export interface Resolved {
  meta: Meta;
  el: React.ReactNode;
}

/* ─── Blocchi funzione riusati in più pagine ────────────────────── */
const F = {
  ricerca: {
    eyebrow: 'Database influencer',
    title: 'Cerca tra i creator italiani con filtri veri',
    text: 'Dieci gruppi di filtri: categoria, città e regione, fascia di follower, tipo di creator, piattaforma, engagement, crescita, badge di fiducia. Salvi la ricerca come lista e la lista si aggiorna da sola.',
    bullets: ['Vista a riquadri, tabella o mappa', 'Liste salvate e preferiti', 'Export CSV con Premium'],
    visual: <SearchMock />,
    href: '#/funzionalita/database-influencer/',
    cta: 'Come funziona la ricerca',
  },
  scheda: {
    eyebrow: 'Scheda creator',
    title: 'Numeri con la loro fonte, non promesse',
    text: 'Per ogni piattaforma: follower, engagement rispetto alla fascia, crescita a 30 e 90 giorni, contenuti recenti e brand citati con #adv. Ogni dato dice se è dichiarato, autenticato, osservato o stimato, e quando è stato aggiornato.',
    bullets: ['Badge Verificato da account collegato', 'Prezzi indicativi dichiarati dal creator', 'Contatti solo se il creator è contattabile'],
    visual: <ProfileMock />,
  },
  campagne: {
    eyebrow: 'Campagne e collaborazioni',
    title: 'Dal brief al contratto, senza email sparse',
    text: 'Scegli l’obiettivo e come trovare i creator: ti guidiamo noi, pubblichi un annuncio o li scegli tu. Brief, termini, consegne e approvazioni stanno nella collaborazione, e il contratto si genera dai termini accettati da entrambi.',
    bullets: ['Termini in versioni: attiva solo con doppia accettazione', 'Consegne, richieste di modifica e scadenze', 'Contratto generato e valutazione finale'],
    visual: <CollabMock />,
    href: '#/funzionalita/gestione-campagne/',
    cta: 'Scopri la gestione campagne',
  },
  link: {
    eyebrow: 'Link tracciati',
    title: 'Sai quanti click porta ogni contenuto',
    text: 'Ogni contenuto ha il suo link con i parametri UTM già inseriti: click e visitatori unici, senza salvare indirizzi IP e con i bot esclusi. Puoi creare link anche per bio, newsletter, QR e volantini.',
    bullets: [`${FACTS.freeLinks} link attivi gratis, illimitati con Premium`, 'QR scaricabile', 'Pagina risultati per ogni collaborazione'],
    visual: <LinkMock />,
    href: '#/funzionalita/link-tracciati/',
    cta: 'Scopri i link tracciati',
  },
  kit: {
    eyebrow: 'Media kit',
    title: 'Il media kit che si aggiorna da solo',
    text: 'Il creator ha un media kit con i suoi numeri, i contenuti in vetrina e le collaborazioni, con la data dei dati sempre visibile. Si scarica in PDF e si condivide con un link pubblico.',
    bullets: ['Numeri presi dagli account collegati', 'Contenuti in vetrina scelti dal creator', 'Link pubblico solo con il consenso del creator'],
    visual: <KitMock />,
    href: '#/funzionalita/media-kit/',
    cta: 'Scopri il media kit',
  },
  annunci: {
    eyebrow: 'Annunci',
    title: 'Pubblica un annuncio, i creator si candidano',
    text: 'L’annuncio veloce va online subito nella bacheca pubblica: descrivi cosa cerchi, il compenso e la scadenza. I creator iscritti si candidano e tu scegli.',
    bullets: ['Compenso, cambio merce, affiliazione, ospitalità', 'Bacheca pubblica indicizzata', 'Candidature in un’unica lista'],
    visual: <AnnunciMock />,
    href: '#/annunci-collaborazioni/',
    cta: 'Vedi come funzionano gli annunci',
  },
} satisfies Record<string, FeatureItem>;

const brandCtas = (
  <>
    <Button href={APP.brand}>Prova gratis 3 giorni</Button>
    <Button href="#/prezzi/" variant="secondary">
      Vedi i prezzi
    </Button>
  </>
);
const creatorCtas = (
  <>
    <Button href={APP.creator}>Iscriviti gratis</Button>
    <Button href="#/annunci-collaborazioni/" variant="secondary">
      Vedi gli annunci
    </Button>
  </>
);

const FACTS_BAND = [
  { v: '100%', l: 'creator italiani' },
  { v: String(FACTS.categories), l: 'categorie e 5 fasce di follower' },
  { v: `${FACTS.trialDays} gg`, l: 'di Premium in prova, senza carta' },
  { v: '0 %', l: 'di commissione per il brand' },
];

/* ─── HOME ──────────────────────────────────────────────────────── */
function Home() {
  return (
    <>
      <HeroCenter
        eyebrow="Piattaforma di influencer marketing"
        title={'La piattaforma di influencer marketing\n*per trovare creator italiani*'}
        lead="Cerca influencer e UGC creator in Italia con filtri e numeri verificabili, lancia campagne, firma l’accordo e conta i click di ogni contenuto. Tutto in un unico posto."
        actions={
          <>
            <Button href={APP.brand}>Prova gratis 3 giorni</Button>
            <Button href={APP.creator} variant="secondary">
              Sono un creator
            </Button>
          </>
        }
        note="Nessuna carta richiesta · solo creator italiani · i creator si iscrivono gratis"
        visual={<DiscoveryMock />}
        floats={
          <>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute -left-10 top-[58%] hidden w-56 rounded-2xl bg-white p-4 text-left text-ink shadow-float lg:block xl:-left-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Lista salvata</p>
              <p className="mt-1 font-heading font-semibold">Food creator Bologna</p>
              <p className="mt-1 text-xs text-mute">Si aggiorna da sola quando entrano nuovi profili</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute -right-6 bottom-36 hidden w-52 rounded-2xl bg-ink p-4 text-left text-white shadow-float ring-1 ring-white/10 lg:block xl:-right-16">
              <p className="text-[10px] text-white/60">Collaborazione</p>
              <p className="mt-1 font-heading font-semibold">Termini v3 accettati</p>
              <p className="mt-1 text-xs text-acid">Contratto generato ✓</p>
            </motion.div>
          </>
        }
      />
      <AnswerBox
        q="Cos’è influencee?"
        a="Influencee è una piattaforma italiana di influencer marketing. Le aziende e le agenzie trovano creator italiani con filtri e numeri verificabili, pubblicano annunci o invitano i profili scelti, gestiscono accordo, contratto e contenuti e misurano i click con i link tracciati. I creator si iscrivono gratis e ricevono proposte."
        points={['Ricerca per categoria, città e fascia di follower', 'Annunci pubblici e inviti diretti', 'Contratto generato dai termini accettati', 'Link tracciati per ogni contenuto']}
      />
      <FeatureSplit eyebrow="Come funziona" title={'Tutto il lavoro con i creator,\n*in un unico posto*'} items={[F.ricerca, F.campagne, F.link]} />
      <FactsBand items={FACTS_BAND} />
      <ReelWall tone="white" eyebrow="Contenuti" title={'Reel veri,\n*fatti per brand veri*'} lead="Alcuni contenuti realizzati per attività italiane: ristoranti, palestre, farmacie, centri estetici." stats={[['UGC', 'video per i canali del brand'], ['Influencer', 'post sui profili dei creator'], ['Locale', 'campagne per negozi ed eventi']]} />
      <AudienceRow
        tone="white"
        items={[
          { tag: 'Aziende', title: 'Fai da te, con i dati', text: 'Cerchi i creator, pubblichi un annuncio e gestisci la collaborazione senza intermediari e senza commissioni sul brand.', href: '#/influencer-marketing-aziende/', cta: 'Per le aziende', visual: <SearchMock locked={false} /> },
          { tag: 'Agenzie', title: 'Più clienti, meno Excel', text: 'Liste per cliente, campagne parallele, contratti standard e link tracciati per ogni collaborazione.', href: '#/piattaforma-agenzie/', cta: 'Per le agenzie', visual: <LinkMock />, dark: true },
          { tag: 'Creator', title: 'Il tuo lavoro in ordine', text: 'Media kit aggiornato, proposte dai brand, contratti e scadenze in un posto solo. Iscrizione gratuita.', href: '#/diventa-creator/', cta: 'Per i creator', visual: <KitMock /> },
        ]}
      />
      <CategoryGrid />
      <Plans compact />
      <FaqSeo items={[...FAQ.piattaforma.slice(0, 2), FAQ.brand[0], FAQ.creator[0], FAQ.creator[1]]} />
      <ManagedRow />
      <CtaDual />
    </>
  );
}

/* ─── PIATTAFORMA (panoramica) — URL già indicizzato ────────────── */
function Platform() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Piattaforma influencer' }]} eyebrow="Piattaforma influencer" title={'La piattaforma per l’influencer marketing\n*in Italia*'} lead="Ricerca dei creator, campagne, contratti, contenuti e link tracciati: un solo strumento per brand e agenzie, con dati che dichiarano sempre la loro fonte." actions={brandCtas} visual={<CollabMock className="mx-auto max-w-[520px]" />} />
      <AnswerBox q="Cosa fa una piattaforma per influencer?" a="Una piattaforma per influencer mette in contatto aziende e creator e organizza tutto il lavoro: trovare i profili adatti, proporre la collaborazione, firmare l’accordo, ricevere e approvare i contenuti e misurarne i risultati. Su influencee tutto questo avviene in un unico posto, solo con creator italiani." />
      <FeatureSplit items={[F.ricerca, F.scheda, F.campagne, F.link, F.kit]} />
      <TiersRow tone="paper" />
      <FaqSeo items={FAQ.piattaforma} />
      <Related links={[
        { label: 'Per le aziende', text: 'Come un brand usa influencee da solo', href: '#/influencer-marketing-aziende/' },
        { label: 'Per le agenzie', text: 'Gestire più clienti e campagne', href: '#/piattaforma-agenzie/' },
        { label: 'Prezzi', text: 'Gratis, mensile, trimestrale o annuale', href: '#/prezzi/' },
        { label: 'Benchmark engagement', text: 'Valori di riferimento per fascia', href: '#/benchmark-engagement-rate/' },
      ]} />
      <CtaDual />
    </>
  );
}

/* ─── Pagine funzione ───────────────────────────────────────────── */
function FeaturePage({ crumb, eyebrow, title, lead, visual, answer, items, faq, related }: { crumb: string; eyebrow: string; title: string; lead: string; visual: React.ReactNode; answer: { q: string; a: string; points?: string[] }; items: FeatureItem[]; faq: QA[]; related: { label: string; text: string; href: string }[] }) {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: crumb }]} eyebrow={eyebrow} title={title} lead={lead} actions={brandCtas} visual={visual} />
      <AnswerBox {...answer} />
      <FeatureSplit items={items} />
      <FaqSeo items={faq} />
      <Related links={related} />
      <CtaBandV2 title={'Provalo con\n*il tuo brand*'} lead={`${FACTS.trialDays} giorni di Premium gratis, senza carta.`} primary={{ label: 'Registra la tua azienda', href: APP.brand }} secondary={{ label: 'Vedi i prezzi', href: '#/prezzi/' }} />
    </>
  );
}

const FEATURE_FAQ = {
  ricerca: [
    { q: 'Come trovare influencer per la mia azienda?', a: 'Su influencee filtri i creator italiani per categoria, città, fascia di follower, tipo e piattaforma, poi confronti le schede: engagement rispetto alla fascia, crescita e contenuti recenti. Puoi salvare la ricerca come lista che si aggiorna da sola.' },
    { q: 'La ricerca è gratuita?', a: `Sì: con il piano gratuito vedi in chiaro i primi ${FACTS.freeResults} risultati di ogni ricerca. Con Premium vedi tutti i risultati, usi tutti i filtri, i contatti e l’export CSV.` },
    { q: 'Cosa significa il badge Verificato?', a: 'Il creator ha collegato un suo account con il login ufficiale della piattaforma social, oppure è stato verificato dallo staff. Il badge Premium lo assegna solo lo staff.' },
  ],
  campagne: [
    { q: 'Come si gestisce una campagna con gli influencer?', a: 'Definisci obiettivo, brief, target, offerta e termini. Poi inviti i creator o pubblichi un annuncio. Quando brand e creator accettano la stessa versione dei termini la collaborazione è attiva: il creator consegna, tu approvi o chiedi modifiche, e il contratto viene generato in automatico.' },
    { q: 'Posso offrire prodotti invece di un compenso?', a: 'Sì: oltre al compenso in denaro puoi offrire cambio merce, affiliazione, formula ibrida, ospitalità o un evento.' },
    { q: 'Cosa succede se il creator propone condizioni diverse?', a: 'Ogni controproposta crea una nuova versione dei termini e azzera le accettazioni: la collaborazione parte solo quando entrambi accettano la stessa versione.' },
  ],
  link: [
    { q: 'Come si misurano i risultati di un influencer?', a: 'Con un link tracciato per ogni contenuto: conti click e visitatori unici e li confronti tra creator. Su influencee i link hanno i parametri UTM già inseriti, quindi li ritrovi anche in Google Analytics.' },
    { q: 'I link tracciati sono gratuiti?', a: `Sì, fino a ${FACTS.freeLinks} link attivi insieme. Con Premium non ci sono limiti.` },
    { q: 'Salvate i dati personali di chi clicca?', a: 'No: non salviamo l’indirizzo IP e i bot vengono esclusi dal conteggio.' },
  ],
  kit: [
    { q: 'Cos’è un media kit per influencer?', a: 'È la presentazione del creator per i brand: numeri dei profili, pubblico, contenuti migliori e collaborazioni passate. Su influencee si compila da solo con i dati degli account collegati e mostra la data dell’ultimo aggiornamento.' },
    { q: 'Posso condividere il media kit fuori da influencee?', a: 'Sì, con un link pubblico che attivi tu, oppure scaricandolo in PDF.' },
    { q: 'Quanto costa il media kit?', a: 'È incluso gratis nel profilo del creator.' },
  ],
};

/* ─── Aziende ───────────────────────────────────────────────────── */
function Brands() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Influencer marketing per aziende' }]} eyebrow="Per le aziende" title={'Influencer marketing\n*per aziende*, senza intermediari'} lead="Trova i creator adatti al tuo pubblico, pubblica un annuncio o invitali direttamente e segui la collaborazione fino ai click. Nessuna commissione per il brand." actions={brandCtas} visual={<SearchMock className="mx-auto max-w-[520px]" />} />
      <AnswerBox q="Come fa un’azienda a lavorare con gli influencer?" a="Si parte dall’obiettivo (farsi conoscere, vendere online, contenuti UGC, promuovere un locale o un evento), si scelgono creator coerenti per categoria, zona e fascia di follower, si concordano compenso e contenuti in un accordo scritto e si misura il risultato con link tracciati. Influencee raccoglie tutti questi passaggi." />
      <Steps title={'Quattro obiettivi,\n*una sola procedura*'} lead="Nella nuova campagna scegli l’obiettivo e il modo di trovare i creator: ti guidiamo, pubblichi un annuncio o scegli tu." steps={[
        { t: 'Far conoscere il brand', x: 'Influencer della tua categoria che parlano al tuo pubblico.' },
        { t: 'Vendere online', x: 'Link tracciati per contare i click di ogni contenuto.' },
        { t: 'Contenuti UGC', x: 'Video per i tuoi canali e le tue inserzioni.' },
        { t: 'Locale o evento', x: 'Creator della tua città per aperture, menu ed eventi.' },
      ]} />
      <FeatureSplit tone="white" items={[F.ricerca, F.annunci, F.campagne, F.link]} />
      <ReelWall eyebrow="Esempi" title={'Contenuti per\n*attività come la tua*'} lead="Reel realizzati per ristoranti, palestre, farmacie e centri estetici italiani." stats={[['Food', 'ristoranti e prodotti'], ['Fitness', 'palestre e corsi'], ['Salute', 'farmacie e benessere']]} />
      <Plans compact tone="paper" />
      <ManagedRow />
      <FaqSeo items={FAQ.brand} />
      <Related links={[
        { label: 'Micro influencer', text: 'Perché funzionano per le PMI', href: '#/micro-influencer/' },
        { label: 'Influencer per città', text: 'Campagne locali in tutta Italia', href: '#/influencer-italiani/' },
        { label: 'Benchmark engagement', text: 'Valori di riferimento prima di scegliere', href: '#/benchmark-engagement-rate/' },
      ]} />
      <CtaDual />
    </>
  );
}

/* ─── Agenzie ───────────────────────────────────────────────────── */
function Agencies() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Piattaforma per agenzie' }]} eyebrow="Per le agenzie" title={'La piattaforma per agenzie\n*di influencer marketing*'} lead="Liste di creator per ogni cliente, campagne in parallelo, accordi e contratti standard, link tracciati e una pagina risultati per ogni collaborazione." actions={brandCtas} visual={<LinkMock className="mx-auto max-w-[500px]" />} />
      <AnswerBox q="Perché un’agenzia dovrebbe usare una piattaforma?" a="Perché riduce il lavoro manuale: la ricerca dei creator avviene con filtri e liste salvate, la trattativa e il contratto stanno nella collaborazione e i click arrivano da link tracciati invece che da screenshot. Si gestiscono più clienti senza fogli di calcolo e catene di email." />
      <CardGrid tone="white" title={'Cosa cambia\n*per la tua agenzia*'} items={[
        { t: 'Liste per cliente', x: 'Salvi una ricerca per ogni cliente: la lista si aggiorna da sola quando entrano nuovi creator.' },
        { t: 'Campagne parallele', x: 'Calendario unico di campagne e scadenze, con l’etichetta "In ritardo" sulle consegne.' },
        { t: 'Accordi standard', x: 'Termini in versioni, doppia accettazione e contratto generato: meno revisioni legali ripetitive.' },
        { t: 'Export e report', x: 'Export CSV dei risultati di ricerca e pagina risultati per ogni collaborazione.' },
        { t: 'Benchmark per fascia', x: 'Valori di riferimento di engagement per confrontare i profili prima della proposta.' },
        { t: 'Nessuna commissione', x: 'Abbonamento fisso, nessuna percentuale sul budget dei tuoi clienti.' },
      ]} />
      <FeatureSplit tone="paper" items={[F.ricerca, F.campagne]} />
      <ManagedRow />
      <Plans compact />
      <FaqSeo items={[FAQ.brand[0], FAQ.piattaforma[1], FAQ.piattaforma[2], FEATURE_FAQ.campagne[2]]} />
      <CtaBandV2 title={'Porta i tuoi clienti\n*su influencee*'} primary={{ label: 'Registra l’agenzia', href: APP.brand }} secondary={{ label: 'Scrivici', href: '#/contatti/' }} />
    </>
  );
}

/* ─── Micro influencer (keyword 480/mese) ───────────────────────── */
function Micro() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Micro influencer' }]} eyebrow="Micro influencer" title={'Micro influencer:\n*cosa sono e come trovarli*'} lead="I micro influencer hanno tra 10.000 e 50.000 follower: community più raccolte, costi più accessibili e spesso un engagement più alto dei grandi profili." actions={brandCtas} visual={<ProfileMock className="mx-auto max-w-[460px]" />} />
      <AnswerBox q="Chi sono i micro influencer?" a="Un micro influencer è un creator con un pubblico tra 10.000 e 50.000 follower. Sotto i 10.000 si parla di nano influencer, sopra i 50.000 di mid e macro. Sono adatti a PMI, campagne locali e lanci di nicchia perché parlano a community specifiche e hanno costi più bassi." points={['Fascia micro: 10.000 – 50.000 follower', 'Ideali per campagne locali e di nicchia', 'Spesso più engagement della media', 'Su influencee si filtrano per fascia']} />
      <TiersRow highlight="micro" title={'Quanti follower ha\n*un micro influencer?*'} />
      <Prose blocks={[
        { h: 'Perché scegliere i micro influencer', p: ['Un pubblico più piccolo è spesso un pubblico più attento: i contenuti ricevono più commenti e salvataggi in proporzione ai follower, e la raccomandazione suona più personale.', 'Per un’attività locale contano anche la città e la categoria: un food creator della tua zona porta clienti più facilmente di un profilo nazionale con milioni di follower.'] },
        { h: 'Quanto costa un micro influencer', p: ['Non esiste un listino unico: il compenso dipende da formato, numero di contenuti, diritti d’uso ed esclusiva. Molte collaborazioni con micro influencer usano anche cambio merce, affiliazione o ospitalità.', 'Su influencee molti creator dichiarano un prezzo indicativo per reel, storia e post, visibile nella scheda, e il compenso finale si concorda nella collaborazione.'] },
        { h: 'Come trovare micro influencer in Italia', p: ['Filtra per fascia Micro, poi aggiungi categoria, regione o città. Confronta l’engagement con quello della stessa fascia: è il modo corretto per capire se un profilo funziona.', 'In alternativa pubblica un annuncio nella bacheca: i micro influencer interessati si candidano e tu scegli.'] },
      ]} aside={<div className="grid grid-cols-2 gap-3"><WorkReelCard r={REELS.find((r) => r.id === 'fitness-scegli-corso')!} delay={0} className="" /><WorkReelCard r={REELS.find((r) => r.id === 'food-sushi-umore')!} delay={1} className="mt-10" /><WorkReelCard r={REELS.find((r) => r.id === 'salute-farmacia-influenza')!} delay={2} className="" /><WorkReelCard r={REELS.find((r) => r.id === 'fitness-posturale')!} delay={3} className="mt-10" /></div>} />
      <FaqSeo items={[
        { q: 'Quanti follower deve avere un micro influencer?', a: 'Tra 10.000 e 50.000. Con meno di 10.000 follower si parla di nano influencer.' },
        { q: 'I micro influencer funzionano per le piccole aziende?', a: 'Sì, soprattutto per attività locali e prodotti di nicchia: costano meno, parlano a community specifiche e permettono di testare più creator con lo stesso budget.' },
        { q: 'Come contatto un micro influencer?', a: 'Su influencee lo inviti a una campagna o gli scrivi in chat dalla sua scheda; con Premium vedi anche i contatti dei creator che li hanno resi disponibili.' },
        FAQ.brand[0],
      ]} />
      <Related links={[
        { label: 'Influencer per città', text: 'Trova creator della tua zona', href: '#/influencer-italiani/' },
        { label: 'UGC creator', text: 'Contenuti per i tuoi canali', href: '#/ugc-creator/' },
        { label: 'Benchmark engagement', text: 'Valori di riferimento per fascia', href: '#/benchmark-engagement-rate/' },
      ]} />
      <CtaDual />
    </>
  );
}

/* ─── Creator (hero nera con reel, regola delle pagine creator) ──── */
function CreatorJoin() {
  return (
    <>
      <HeroReels crumbs={<CrumbsDark items={[{ label: 'Diventa creator' }]} />} eyebrow="Per i creator" title={'Collaborazioni con i brand,\n*iscriviti gratis*'} lead="Crea il tuo profilo in pochi minuti, collega i social e ricevi proposte da aziende italiane. Media kit, contratti e scadenze in un posto solo." actions={creatorCtas} />
      <AnswerBox q="Come si ottengono collaborazioni con i brand?" a="Serve un profilo chiaro (chi sei, cosa crei, dove sei), numeri verificabili e un modo semplice per farsi trovare. Su influencee ti iscrivi gratis, colleghi Instagram, TikTok o YouTube in sola lettura e i brand ti trovano nella ricerca. Puoi anche candidarti agli annunci aperti." />
      <FeatureSplit title={'Cosa ottieni\n*da creator*'} items={[
        { eyebrow: 'Iscrizione', title: 'Pochi minuti, nessuna password', text: 'Accedi con Google o con un link via email, scrivi chi sei e colleghi i social. Il profilo si completa passo passo e collegando un social ottieni il badge Verificato.', bullets: ['Google o link magico via email', 'Social collegati in sola lettura', 'Badge Verificato automatico'], visual: <SignupMock /> },
        { ...F.kit, href: undefined },
        { eyebrow: 'Proposte', title: 'Proposte chiare, contratti veri', text: 'I brand ti invitano alle campagne o ti candidi agli annunci. Termini, consegne e scadenze sono nella collaborazione e il contratto nasce dalle condizioni che hai accettato.', bullets: ['Controproposte con versioni dei termini', 'Calendario delle scadenze', 'Valutazione a fine collaborazione'], visual: <CollabMock /> },
      ]} />
      <CardGrid tone="paper" title={'Quattro modi\n*di essere creator*'} lead="Scegli il tipo che ti rappresenta, puoi indicare fino a 5 categorie." items={CREATOR_TYPES.map((t) => ({ t: t.name, x: t.text }))} cols={4} />
      <Steps title={'Come iscriversi\n*in 4 passi*'} steps={[
        { t: 'Accedi', x: 'Con Google o con un link via email, senza password.' },
        { t: 'Chi sei', x: 'Nome e comune. Serve avere almeno 18 anni.' },
        { t: 'I tuoi social', x: 'Collega Instagram, TikTok, YouTube o LinkedIn, oppure inserisci gli handle.' },
        { t: 'Bonus', x: 'Tipo di creator, categorie, prezzo indicativo e modalità che accetti.' },
      ]} action={<Button href={APP.creator}>Inizia l’iscrizione</Button>} />
      <FaqSeo items={FAQ.creator} />
      <Related links={[
        { label: 'UGC creator', text: 'Lavorare con i brand senza tanti follower', href: '#/ugc-creator/' },
        { label: 'Annunci di collaborazione', text: 'Le offerte aperte dei brand', href: '#/annunci-collaborazioni/' },
        { label: 'Media kit', text: 'Il tuo media kit sempre aggiornato', href: '#/funzionalita/media-kit/' },
      ]} />
      <CtaBandV2 tone="soft" title={'Il tuo lavoro da creator,\n*finalmente in ordine*'} primary={{ label: 'Iscriviti gratis', href: APP.creator }} />
    </>
  );
}

/* ─── UGC creator (keyword 4.400/mese) ──────────────────────────── */
function Ugc() {
  return (
    <>
      <HeroReels crumbs={<CrumbsDark items={[{ label: 'UGC creator' }]} />} eyebrow="UGC creator" title={'UGC creator:\n*cos’è e come diventarlo*'} lead="Gli UGC creator realizzano video e foto che i brand pubblicano sui propri canali e nelle inserzioni. Non servono tanti follower: serve saper raccontare un prodotto." actions={creatorCtas} />
      <AnswerBox q="Cosa fa un UGC creator?" a="Un UGC creator (user generated content creator) produce contenuti in stile spontaneo, come recensioni, unboxing, tutorial e prove prodotto, che il brand usa sui suoi profili e nelle pubblicità. A differenza dell’influencer non pubblica necessariamente sul proprio profilo: viene pagato per il contenuto e per i diritti d’uso." points={['Non servono follower', 'Conta la qualità del video', 'Compenso per contenuto e diritti d’uso', 'Profilo UGC dedicato su influencee']} />
      <Prose blocks={[
        { h: 'UGC creator e influencer: la differenza', p: ['L’influencer viene scelto per il suo pubblico: il valore è la visibilità sui suoi profili. L’UGC creator viene scelto per i contenuti: il brand li pubblica dove vuole, spesso come inserzioni.', 'Per questo un UGC creator può lavorare anche con pochi follower, purché sappia girare video chiari, credibili e adatti al formato verticale.'] },
        { h: 'Come diventare UGC creator in Italia', p: ['Prepara qualche video di prova su prodotti che usi davvero: unboxing, tutorial, prima e dopo, recensione onesta. Sono il tuo portfolio.', 'Crea un profilo su influencee scegliendo il tipo UGC: indica le categorie (fino a 5), il prezzo indicativo per un video e le modalità che accetti. Poi candidati agli annunci che cercano UGC.'] },
        { h: 'Quanto guadagna un UGC creator', p: ['Dipende da durata del video, numero di varianti, diritti d’uso e durata della licenza. Molti brand propongono compenso in denaro, altri cambio merce o formule ibride.', 'Il consiglio: indica un prezzo indicativo chiaro nel profilo e specifica sempre nei termini per quanto tempo e dove il brand può usare il contenuto.'] },
      ]} aside={<div className="grid grid-cols-2 gap-3"><WorkReelCard r={REELS.find((r) => r.id === 'beauty-body-project')!} delay={0} className="" /><WorkReelCard r={REELS.find((r) => r.id === 'food-salse-zero')!} delay={1} className="mt-10" /><WorkReelCard r={REELS.find((r) => r.id === 'casa-legno')!} delay={2} className="" /><WorkReelCard r={REELS.find((r) => r.id === 'servizi-fornitore')!} delay={3} className="mt-10" /></div>} />
      <FaqSeo items={[
        { q: 'Serve la partita IVA per fare l’UGC creator?', a: 'Dipende da quanto e con che continuità lavori: per collaborazioni occasionali può bastare la prestazione occasionale, per un’attività continuativa serve la partita IVA. Chiedi conferma al tuo commercialista. Su influencee puoi indicare la partita IVA nel profilo.' },
        { q: 'Dove trovo brand che cercano UGC creator?', a: 'Nella bacheca annunci di influencee: i brand pubblicano offerte con compenso e scadenza e i creator iscritti si candidano.' },
        FAQ.creator[1],
        FAQ.creator[0],
      ]} />
      <CtaBandV2 tone="soft" title={'Crea il tuo profilo\n*da UGC creator*'} primary={{ label: 'Iscriviti gratis', href: APP.creator }} secondary={{ label: 'Vedi gli annunci', href: '#/annunci-collaborazioni/' }} />
    </>
  );
}

/* ─── Annunci ───────────────────────────────────────────────────── */
function Annunci() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Annunci di collaborazione' }]} eyebrow="Bacheca annunci" title={'Annunci di collaborazione\n*tra brand e creator*'} lead="I brand pubblicano cosa cercano, i creator si candidano. Una bacheca pubblica con offerte di compenso, cambio merce, affiliazione e ospitalità." actions={<><Button href={APP.annunci}>Vedi gli annunci aperti</Button><Button href={APP.brand} variant="secondary">Pubblica un annuncio</Button></>} visual={<AnnunciMock className="mx-auto max-w-[520px]" />} />
      <AnswerBox q="Come funzionano gli annunci su influencee?" a="Un’azienda pubblica un annuncio in una pagina: descrizione, tipo di creator cercato, compenso e scadenza. L’annuncio va online subito nella bacheca pubblica. I creator iscritti si candidano con il loro profilo e il brand sceglie con chi avviare la collaborazione." />
      <Steps title={'Per i brand\n*e per i creator*'} steps={[
        { t: 'Il brand pubblica', x: 'Annuncio veloce, online subito.' },
        { t: 'I creator si candidano', x: 'Con il loro profilo e i loro numeri.' },
        { t: 'Il brand sceglie', x: 'E avvia la collaborazione dalla candidatura.' },
        { t: 'Si lavora insieme', x: 'Termini, contenuti e link tracciati.' },
      ]} />
      <FaqSeo items={[FAQ.brand[2], FAQ.brand[3], FAQ.creator[3], FAQ.creator[0]]} />
      <CtaDual title={'Pubblica o candidati,\n*è gratis*'} />
    </>
  );
}

/* ─── Benchmark (lead magnet) ───────────────────────────────────── */
function Benchmark() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Benchmark engagement rate' }]} eyebrow="Strumento gratuito" title={'Engagement rate:\n*valori di riferimento e calcolo*'} lead="Come si calcola l’engagement rate, perché va confrontato con la fascia di follower e come verificare in pochi secondi se un post sponsorizzato rende." actions={<><Button href={APP.check}>Fai il check sponsor</Button><Button href={APP.benchmark} variant="secondary">Apri il benchmark</Button></>} visual={<ProfileMock className="mx-auto max-w-[460px]" />} />
      <AnswerBox q="Come si calcola l’engagement rate?" a="L’engagement rate è il rapporto tra interazioni e follower. Su influencee usiamo la mediana delle interazioni (like, commenti, condivisioni e salvataggi) su reel e video degli ultimi 90 giorni, esclusa l’ultima settimana, divisa per i follower. Con meno di 5 video il valore non viene calcolato." points={['Mediana, non media: un post virale non falsa il dato', 'Ultimi 90 giorni, esclusa l’ultima settimana', 'Confronto con la stessa fascia di follower', 'Benchmark pubblico solo con almeno 30 profili']} />
      <TiersRow tone="paper" title={'Confronta l’engagement\n*nella stessa fascia*'} lead="Un 3% può essere ottimo per un macro influencer e basso per un nano: per questo il benchmark mostra 25° percentile, mediana e 75° percentile per fascia." />
      <FaqSeo items={[
        { q: 'Qual è un buon engagement rate su Instagram?', a: 'Dipende dalla fascia di follower e dalla categoria: i profili più piccoli hanno di solito valori più alti. Confronta il creator con la mediana della sua fascia invece che con un numero unico.' },
        { q: 'Cos’è il check sponsor?', a: 'Uno strumento gratuito che confronta l’engagement di un contenuto sponsorizzato con soglie di riferimento, per capire subito se ha reso sotto, in linea o sopra le attese.' },
        { q: 'Il benchmark è gratuito?', a: 'Sì, il benchmark pubblico è consultabile senza registrazione. Mostra solo valori aggregati, mai dati di singoli creator.' },
      ]} />
      <CtaBandV2 title={'Vuoi i valori\n*per il tuo settore?*'} lead="Con un account vedi compensi ed engagement per fascia e categoria, con l’origine di ogni valore." primary={{ label: 'Registrati gratis', href: APP.brand }} />
    </>
  );
}

/* ─── Prezzi ────────────────────────────────────────────────────── */
function Pricing() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Prezzi' }]} eyebrow="Prezzi" title={'Prezzi di influencee:\n*parti gratis*'} lead={`Piano gratuito per sempre, Premium da 19 € al mese con ${FACTS.trialDays} giorni di prova senza carta. Nessuna commissione per il brand sulle collaborazioni.`} actions={brandCtas} visual={<SearchMock className="mx-auto max-w-[500px]" />} />
      <Plans tone="white" />
      <ManagedRow />
      <FaqSeo items={[
        FAQ.brand[0],
        { q: 'Cosa include il piano gratuito?', a: `Ricerca creator con i primi ${FACTS.freeResults} risultati in chiaro, annunci nella bacheca, ${FACTS.freeLinks} link tracciati attivi e chat con i creator delle tue collaborazioni.` },
        { q: 'Come funziona la prova gratuita?', a: `Alla registrazione dell’azienda parte una prova Premium di ${FACTS.trialDays} giorni. Non serve la carta: alla fine scegli se passare a Premium o restare sul piano gratuito.` },
        { q: 'Per i creator è gratis?', a: 'Sì, l’iscrizione dei creator è gratuita.' },
      ]} />
      <CtaDual />
    </>
  );
}

/* ─── Influencer italiani: hub, categoria, regione, città ───────── */
function ItaliansHub() {
  return (
    <>
      <HeroReels crumbs={<CrumbsDark items={[{ label: 'Influencer italiani' }]} />} eyebrow="Influencer italiani" title={'Influencer italiani\n*per categoria e città*'} lead={`Creator italiani divisi in ${FACTS.categories} categorie, 5 fasce di follower e tutte le regioni. Trova il profilo giusto per la tua campagna.`} actions={brandCtas} />
      <AnswerBox q="Come trovare influencer italiani?" a="Parti da categoria e zona: food a Napoli, fitness a Milano, viaggi in Sicilia. Poi scegli la fascia di follower in base all’obiettivo, nano e micro per campagne locali e di nicchia, mid e macro per la visibilità nazionale. Su influencee filtri tutto questo in un’unica ricerca, solo tra creator italiani." />
      <CategoryGrid />
      <RegionGrid tone="paper" />
      <TiersRow />
      <FaqSeo items={[
        { q: 'Quali sono le categorie di influencer?', a: 'Su influencee sono 18: cucina e food, viaggi, moda, beauty, fitness e sport, tecnologia, gaming, famiglia, animali, musica, lifestyle, casa e design, motori, finanza personale, salute e benessere, arte e fotografia, libri e cultura, intrattenimento e comicità.' },
        FAQ.piattaforma[3],
        FEATURE_FAQ.ricerca[0],
      ]} />
      <CtaDual />
    </>
  );
}

const catFaq = (k: { short: string }): QA[] => [
  { q: `Quanto costa un ${k.short.toLowerCase()} influencer?`, a: 'Dipende da fascia di follower, formato e diritti d’uso. Molti creator indicano nella scheda un prezzo indicativo per reel, storia e post; il compenso finale si concorda nella collaborazione, anche in cambio merce o affiliazione.' },
  { q: `Come contattare ${k.short.toLowerCase()} influencer italiani?`, a: 'Su influencee li inviti a una campagna o pubblichi un annuncio a cui si candidano. Con Premium vedi anche i contatti dei creator che li hanno resi disponibili.' },
  FAQ.brand[0],
];
const placeFaq = (place: string): QA[] => [
  { q: `Quanto costa un influencer a ${place}?`, a: 'Dipende da fascia di follower, formato e diritti d’uso. Per attività locali funzionano bene nano e micro influencer, spesso anche con ospitalità o cambio merce.' },
  { q: 'Meglio un influencer locale o nazionale?', a: 'Per un negozio, un ristorante o un evento conviene un creator locale: il suo pubblico può davvero venire da te. Per un e-commerce nazionale conta di più la categoria.' },
  FAQ.brand[2],
];

function CategoryPage({ slug }: { slug: string }) {
  const k = CATEGORIES.find((x) => x.slug === slug)!;
  return (
    <>
      <HeroReels crumbs={<CrumbsDark items={[{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `${k.short} influencer` }]} />} eyebrow={k.name} title={`${k.short} influencer\n*italiani*`} lead={`${k.lead} Cercali per città e fascia di follower e lancia la tua campagna.`} actions={<><Button href={APP.brand}>Cerca creator {k.short}</Button><Button href={APP.creator} variant="secondary">Sei un creator {k.short}? Iscriviti</Button></>} />
      <AnswerBox q={`Come scegliere un ${k.short.toLowerCase()} influencer?`} a={`Guarda tre cose: la coerenza dei contenuti con il tuo prodotto, l’engagement confrontato con quello della stessa fascia di follower e la zona del pubblico se la campagna è locale. Su influencee filtri i creator della categoria ${k.name} per città, fascia e tipo, e in ogni scheda vedi numeri, crescita e brand con cui hanno già collaborato.`} />
      <FeatureSplit items={[{ ...F.ricerca, title: `Trova creator ${k.name.toLowerCase()} con i filtri giusti` }, F.campagne]} />
      <RegionGrid tone="paper" title={`${k.short} influencer\n*per regione*`} />
      <CategoryGrid exclude={k.slug} title={'Altre\n*categorie*'} />
      <FaqSeo items={catFaq(k)} />
      <CtaDual />
    </>
  );
}

function RegionPage({ region, city }: { region: string; city?: string }) {
  const r = REGIONS.find((x) => x.slug === region)!;
  const ct = city ? r.cities.find((x) => x.slug === city)! : undefined;
  const place = ct ? ct.name : r.name;
  const crumbs: Crumb[] = [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `Influencer ${r.name}`, href: ct ? `#/influencer-italiani/influencer-${r.slug}/` : undefined }];
  if (ct) crumbs.push({ label: `Influencer ${ct.name}` });
  return (
    <>
      <HeroReels crumbs={<CrumbsDark items={crumbs} />} eyebrow={ct ? `${r.name}` : 'Regione'} title={`Influencer a *${place}*`} lead={`Creator ${ct ? 'di ' : 'in '}${place} per campagne locali: ristoranti, negozi, palestre, eventi e aperture. Filtra per categoria e fascia di follower.`} actions={<><Button href={APP.brand}>Cerca creator a {place}</Button><Button href={APP.creator} variant="secondary">Sei di {place}? Iscriviti</Button></>} />
      <AnswerBox q={`Come trovare influencer a ${place}?`} a={`Per una campagna a ${place} conta il pubblico locale: scegli creator che vivono in zona e raccontano la città, poi filtra per categoria (food, fitness, beauty…) e fascia di follower. Su influencee la posizione dei creator segue i comuni ISTAT, quindi puoi cercare per regione, provincia e città.`} />
      <CategoryGrid title={`Influencer a ${place}\n*per categoria*`} lead="Scegli il settore della tua campagna." />
      {!ct && r.cities.length > 0 && <RegionGrid tone="paper" only={r.slug} title={`Città della\n*regione ${r.name}*`} lead="Apri la pagina della città." />}
      <FaqSeo items={placeFaq(place)} />
      <Related links={[{ label: 'Micro influencer', text: 'Perfetti per le campagne locali', href: '#/micro-influencer/' }, { label: 'Annunci', text: 'Pubblica un annuncio per la tua città', href: '#/annunci-collaborazioni/' }, { label: 'Tutte le regioni', text: 'Influencer in tutta Italia', href: '#/influencer-italiani/' }]} />
      <CtaDual />
    </>
  );
}

function CrumbsDark({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Percorso" className="flex flex-wrap items-center justify-center gap-1 text-sm text-white/55">
      {[{ label: 'Home', href: '#/' }, ...items].map((c, i, all) => (
        <span key={c.label} className="flex items-center gap-1">
          {i > 0 && <span className="opacity-60">›</span>}
          {c.href && i < all.length - 1 ? <a href={c.href} className="hover:text-white">{c.label}</a> : <span className="text-white">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ─── Contatti ──────────────────────────────────────────────────── */
function Contacts() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Contatti' }]} eyebrow="Contatti" title={'Parliamo della\n*tua campagna*'} lead="Vuoi vedere la piattaforma con il tuo settore o hai bisogno di aiuto per partire? Scrivici: lasciaci i tuoi dati e ti ricontattiamo." actions={<><Button href={WHATSAPP.href}>Preventivo su WhatsApp</Button><Button href={APP.brand} variant="secondary">Registrati e prova</Button></>} visual={<CollabMock className="mx-auto max-w-[480px]" />} />
      <ManagedRow />
      <CtaForm title="Richiedi una demo per il tuo brand" lead="Lasciaci i tuoi dati: ti mostriamo la piattaforma con creator del tuo settore." />
      <FaqSeo items={[FAQ.piattaforma[0], FAQ.brand[0], FAQ.creator[0]]} />
    </>
  );
}

/* ─── Blog (struttura: gli articoli vengono migrati dal sito attuale) ─ */
function Blog() {
  const posts = [
    ['Come calcolare l’engagement rate', '/come-calcolare-engagement-rate/', 'Guide'],
    ['Influencer italiani: la guida', '/influencer-italiani/', 'Creator'],
    ['Le migliori app per gestire i follower', '/migliori-app-gestione-follower/', 'Strumenti'],
    ['Follower Instagram gratis: perché evitarli', '/instagram-follower-gratis-perche-evitarli-e-come-crescere-davvero/', 'Guide'],
    ['Emoticon da copiare', '/social-media-tool/emoticon-da-copiare/', 'Strumenti'],
    ['I migliori beauty influencer su Instagram', '/i-migliori-beauty-influencer-su-instagram/', 'Creator'],
  ];
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Blog' }]} eyebrow="Blog" title={'Guide di influencer marketing\n*per brand e creator*'} lead="Articoli pratici su creator, campagne, engagement e strumenti social. Gli articoli del sito attuale restano agli stessi indirizzi." actions={<Button href="#/influencer-italiani/">Influencer italiani</Button>} visual={<KitMock className="mx-auto max-w-[480px]" />} />
      <Related title={'Articoli\n*più letti*'} links={posts.map(([t, href, tag]) => ({ label: t, text: `${tag} · stesso URL del sito attuale`, href: `#${href}` }))} />
    </>
  );
}

/* ─── Risolutore delle route ────────────────────────────────────── */
const T = (s: string) => `${s} | ${SITE.name}`;

export function resolve(path: string): Resolved | null {
  const p = path.replace(/\/?$/, '/');
  const seg = p.split('/').filter(Boolean);

  const fixed: Record<string, () => Resolved> = {
    '/': () => ({ meta: { path: '/', label: 'Home', type: 'home', kw: 'piattaforma influencer marketing', title: 'Influencee: piattaforma di influencer marketing in Italia', description: 'Trova influencer e UGC creator italiani, lancia campagne e misura i click di ogni contenuto. Prova gratis, i creator si iscrivono gratis.', faq: [...FAQ.piattaforma.slice(0, 2), FAQ.brand[0], FAQ.creator[0], FAQ.creator[1]] }, el: <Home /> }),
    '/piattaforma-influencer/': () => ({ meta: { path: p, label: 'Piattaforma', type: 'software', kw: 'piattaforma influencer', title: T('Piattaforma influencer per brand e agenzie'), description: 'Ricerca creator italiani, campagne, contratti e link tracciati in un’unica piattaforma di influencer marketing. Dati con la loro fonte, niente AI.', crumbs: [{ label: 'Piattaforma influencer' }], faq: FAQ.piattaforma }, el: <Platform /> }),
    '/funzionalita/database-influencer/': () => ({ meta: { path: p, label: 'Database influencer', type: 'software', kw: 'database influencer italiani', title: T('Database influencer italiani con filtri'), description: 'Cerca influencer e UGC creator italiani per categoria, città, fascia di follower ed engagement. Liste salvate, schede con dati verificabili.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Database influencer' }], faq: FEATURE_FAQ.ricerca }, el: <FeaturePage crumb="Database influencer" eyebrow="Database influencer" title={'Database di influencer\n*italiani*'} lead="Cerca creator per categoria, città, fascia di follower, tipo e piattaforma. Ogni scheda mostra numeri, crescita e fonte del dato." visual={<SearchMock className="mx-auto max-w-[520px]" />} answer={{ q: 'Cos’è un database di influencer?', a: 'È un archivio ricercabile di creator con i loro dati: categoria, città, follower, engagement e contenuti. Su influencee contiene solo creator italiani, con filtri combinabili e liste salvate che si aggiornano da sole quando entrano nuovi profili.' }} items={[F.ricerca, F.scheda]} faq={FEATURE_FAQ.ricerca} related={[{ label: 'Influencer per categoria', text: '18 categorie', href: '#/influencer-italiani/' }, { label: 'Micro influencer', text: 'Filtra la fascia 10–50 mila', href: '#/micro-influencer/' }, { label: 'Prezzi', text: 'Gratis o Premium', href: '#/prezzi/' }]} /> }),
    '/funzionalita/gestione-campagne/': () => ({ meta: { path: p, label: 'Gestione campagne', type: 'software', kw: 'gestione campagne influencer', title: T('Gestione campagne influencer e contratti'), description: 'Brief, termini con doppia accettazione, consegne, approvazioni e contratto generato: gestisci le collaborazioni con i creator in un unico posto.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Gestione campagne' }], faq: FEATURE_FAQ.campagne }, el: <FeaturePage crumb="Gestione campagne" eyebrow="Campagne e collaborazioni" title={'Gestione delle campagne\n*con gli influencer*'} lead="Obiettivo, brief, offerta e termini; poi consegne, approvazioni e contratto. Tutto nella collaborazione, senza email e fogli sparsi." visual={<CollabMock className="mx-auto max-w-[520px]" />} answer={{ q: 'Come si gestisce una campagna di influencer marketing?', a: FEATURE_FAQ.campagne[0].a }} items={[F.campagne, F.annunci]} faq={FEATURE_FAQ.campagne} related={[{ label: 'Link tracciati', text: 'Misura i click', href: '#/funzionalita/link-tracciati/' }, { label: 'Annunci', text: 'Fai candidare i creator', href: '#/annunci-collaborazioni/' }, { label: 'Per le agenzie', text: 'Più campagne in parallelo', href: '#/piattaforma-agenzie/' }]} /> }),
    '/funzionalita/link-tracciati/': () => ({ meta: { path: p, label: 'Link tracciati', type: 'software', kw: 'link tracciati influencer', title: T('Link tracciati per misurare gli influencer'), description: 'Un link con UTM per ogni contenuto: click e visitatori unici, senza salvare IP e senza bot. 10 link gratis, illimitati con Premium.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Link tracciati' }], faq: FEATURE_FAQ.link }, el: <FeaturePage crumb="Link tracciati" eyebrow="Link tracciati" title={'Misura i risultati\n*di ogni influencer*'} lead="Link con UTM già inseriti per ogni contenuto, per bio, newsletter e QR. Click e visitatori unici in una pagina risultati." visual={<LinkMock className="mx-auto max-w-[500px]" />} answer={{ q: 'Come si misurano i risultati di una campagna con influencer?', a: FEATURE_FAQ.link[0].a }} items={[F.link]} faq={FEATURE_FAQ.link} related={[{ label: 'Gestione campagne', text: 'Dal brief al contratto', href: '#/funzionalita/gestione-campagne/' }, { label: 'Benchmark', text: 'Engagement di riferimento', href: '#/benchmark-engagement-rate/' }, { label: 'Prezzi', text: 'Link illimitati con Premium', href: '#/prezzi/' }]} /> }),
    '/funzionalita/media-kit/': () => ({ meta: { path: p, label: 'Media kit', type: 'software', kw: 'media kit influencer', title: T('Media kit influencer sempre aggiornato'), description: 'Il media kit del creator con numeri dagli account collegati, contenuti in vetrina e collaborazioni. PDF e link pubblico, gratis per i creator.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Media kit' }], faq: FEATURE_FAQ.kit }, el: <FeaturePage crumb="Media kit" eyebrow="Media kit" title={'Il media kit per influencer\n*che si aggiorna da solo*'} lead="Numeri dagli account collegati, contenuti in vetrina, collaborazioni e data dei dati sempre visibile. PDF e link pubblico." visual={<KitMock className="mx-auto max-w-[520px]" />} answer={{ q: 'Cos’è un media kit per influencer?', a: FEATURE_FAQ.kit[0].a }} items={[F.kit]} faq={FEATURE_FAQ.kit} related={[{ label: 'Diventa creator', text: 'Iscrizione gratuita', href: '#/diventa-creator/' }, { label: 'UGC creator', text: 'Cos’è e come diventarlo', href: '#/ugc-creator/' }, { label: 'Annunci', text: 'Candidati alle offerte', href: '#/annunci-collaborazioni/' }]} /> }),
    '/influencer-marketing-aziende/': () => ({ meta: { path: p, label: 'Per le aziende', type: 'software', kw: 'influencer marketing aziende', title: T('Influencer marketing per aziende'), description: 'Trova influencer italiani per il tuo brand, pubblica annunci e gestisci collaborazioni e risultati senza intermediari. Nessuna commissione per il brand.', crumbs: [{ label: 'Influencer marketing per aziende' }], faq: FAQ.brand }, el: <Brands /> }),
    '/piattaforma-agenzie/': () => ({ meta: { path: p, label: 'Per le agenzie', type: 'software', kw: 'piattaforma influencer marketing agenzie', title: T('Piattaforma per agenzie di influencer marketing'), description: 'Liste di creator per cliente, campagne parallele, contratti standard e link tracciati. La piattaforma per agenzie e centri media, senza commissioni.', crumbs: [{ label: 'Piattaforma per agenzie' }], faq: [FAQ.brand[0], FAQ.piattaforma[1], FAQ.piattaforma[2], FEATURE_FAQ.campagne[2]] }, el: <Agencies /> }),
    '/micro-influencer/': () => ({ meta: { path: p, label: 'Micro influencer', type: 'page', kw: 'micro influencer', title: T('Micro influencer: chi sono e come trovarli'), description: 'I micro influencer hanno 10–50 mila follower: costi accessibili e alto engagement. Cosa sono, quanto costano e come trovarli in Italia.', crumbs: [{ label: 'Micro influencer' }], faq: [{ q: 'Quanti follower deve avere un micro influencer?', a: 'Tra 10.000 e 50.000. Con meno di 10.000 follower si parla di nano influencer.' }, { q: 'I micro influencer funzionano per le piccole aziende?', a: 'Sì, soprattutto per attività locali e prodotti di nicchia: costano meno, parlano a community specifiche e permettono di testare più creator con lo stesso budget.' }, { q: 'Come contatto un micro influencer?', a: 'Su influencee lo inviti a una campagna o gli scrivi in chat dalla sua scheda; con Premium vedi anche i contatti dei creator che li hanno resi disponibili.' }, FAQ.brand[0]] }, el: <Micro /> }),
    '/diventa-creator/': () => ({ meta: { path: p, label: 'Diventa creator', type: 'page', kw: 'collaborazioni con brand', title: T('Collaborazioni con brand: iscriviti gratis'), description: 'Sei un creator o un influencer? Iscriviti gratis, collega i social e ricevi proposte dai brand italiani. Media kit, contratti e scadenze in un posto.', crumbs: [{ label: 'Diventa creator' }], faq: FAQ.creator }, el: <CreatorJoin /> }),
    '/ugc-creator/': () => ({ meta: { path: p, label: 'UGC creator', type: 'page', kw: 'ugc creator', title: T('UGC creator: cos’è e come diventarlo in Italia'), description: 'Cosa fa un UGC creator, differenza con l’influencer, quanto guadagna e come trovare brand che cercano UGC creator in Italia. Iscrizione gratuita.', crumbs: [{ label: 'UGC creator' }], faq: [{ q: 'Serve la partita IVA per fare l’UGC creator?', a: 'Dipende da quanto e con che continuità lavori: per collaborazioni occasionali può bastare la prestazione occasionale, per un’attività continuativa serve la partita IVA. Chiedi conferma al tuo commercialista. Su influencee puoi indicare la partita IVA nel profilo.' }, { q: 'Dove trovo brand che cercano UGC creator?', a: 'Nella bacheca annunci di influencee: i brand pubblicano offerte con compenso e scadenza e i creator iscritti si candidano.' }, FAQ.creator[1], FAQ.creator[0]] }, el: <Ugc /> }),
    '/annunci-collaborazioni/': () => ({ meta: { path: p, label: 'Annunci', type: 'page', kw: 'annunci collaborazioni influencer', title: T('Annunci di collaborazione per creator'), description: 'Bacheca di annunci tra brand e creator: offerte con compenso, cambio merce, affiliazione e ospitalità. Pubblica o candidati gratis.', crumbs: [{ label: 'Annunci di collaborazione' }], faq: [FAQ.brand[2], FAQ.brand[3], FAQ.creator[3], FAQ.creator[0]] }, el: <Annunci /> }),
    '/benchmark-engagement-rate/': () => ({ meta: { path: p, label: 'Benchmark', type: 'page', kw: 'engagement rate instagram', title: T('Engagement rate: calcolo e benchmark per fascia'), description: 'Come si calcola l’engagement rate e quali sono i valori di riferimento per fascia di follower. Benchmark pubblico e check sponsor gratuiti.', crumbs: [{ label: 'Benchmark engagement rate' }], faq: [{ q: 'Qual è un buon engagement rate su Instagram?', a: 'Dipende dalla fascia di follower e dalla categoria: i profili più piccoli hanno di solito valori più alti. Confronta il creator con la mediana della sua fascia invece che con un numero unico.' }, { q: 'Cos’è il check sponsor?', a: 'Uno strumento gratuito che confronta l’engagement di un contenuto sponsorizzato con soglie di riferimento, per capire subito se ha reso sotto, in linea o sopra le attese.' }, { q: 'Il benchmark è gratuito?', a: 'Sì, il benchmark pubblico è consultabile senza registrazione. Mostra solo valori aggregati, mai dati di singoli creator.' }] }, el: <Benchmark /> }),
    '/prezzi/': () => ({ meta: { path: p, label: 'Prezzi', type: 'pricing', kw: 'prezzi piattaforma influencer', title: T('Prezzi: gratis o Premium da 19 € al mese'), description: `Piano gratuito per sempre e Premium da 19 € al mese, 49 € a trimestre o 199 € all’anno IVA inclusa. ${FACTS.trialDays} giorni di prova, nessuna carta.`, crumbs: [{ label: 'Prezzi' }], faq: [FAQ.brand[0]] }, el: <Pricing /> }),
    '/influencer-italiani/': () => ({ meta: { path: p, label: 'Influencer italiani', type: 'page', kw: 'influencer italiani', title: T('Influencer italiani per categoria e città'), description: 'Influencer e content creator italiani per categoria, regione e città, in 5 fasce di follower. Trova il creator giusto per la tua campagna.', crumbs: [{ label: 'Influencer italiani' }], faq: [FAQ.piattaforma[3], FEATURE_FAQ.ricerca[0]] }, el: <ItaliansHub /> }),
    '/contatti/': () => ({ meta: { path: p, label: 'Contatti', type: 'page', kw: 'contatti influencee', title: T('Contatti'), description: 'Scrivi al team di influencee per una demo con il tuo settore o per aiuto con la piattaforma.', crumbs: [{ label: 'Contatti' }] }, el: <Contacts /> }),
    '/blog/': () => ({ meta: { path: p, label: 'Blog', type: 'page', kw: 'blog influencer marketing', title: T('Blog di influencer marketing'), description: 'Guide pratiche di influencer marketing per brand e creator: engagement, campagne, strumenti social.', crumbs: [{ label: 'Blog' }] }, el: <Blog /> }),
  };
  if (fixed[p]) return fixed[p]();

  // Pagine per categoria: /<slug>/
  const cat = seg.length === 1 ? CATEGORIES.find((k) => k.slug === seg[0]) : undefined;
  if (cat)
    return {
      meta: { path: p, label: `${cat.short} influencer`, type: 'page', kw: cat.kw, title: T(`${cat.short} influencer italiani`), description: `${cat.lead} Trova ${cat.short.toLowerCase()} influencer italiani per città e fascia di follower e lancia la tua campagna.`.slice(0, 155), crumbs: [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `${cat.short} influencer` }], faq: catFaq(cat) },
      el: <CategoryPage slug={cat.slug} />,
    };

  // Regioni e città: /influencer-italiani/influencer-<regione>/[influencer-<città>/]
  if (seg[0] === 'influencer-italiani' && seg[1]?.startsWith('influencer-')) {
    const r = REGIONS.find((x) => x.slug === seg[1].replace('influencer-', ''));
    if (!r) return null;
    if (seg[2]) {
      const ct = r.cities.find((x) => `influencer-${x.slug}` === seg[2]);
      if (!ct) return null;
      return { meta: { path: p, label: `Influencer ${ct.name}`, type: 'page', kw: `influencer ${ct.name.toLowerCase()}`, title: T(`Influencer ${ct.name}: creator per campagne locali`), description: `Trova influencer e content creator a ${ct.name} per ristoranti, negozi, palestre ed eventi. Filtra per categoria e fascia di follower.`, crumbs: [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `Influencer ${r.name}`, href: `#/influencer-italiani/influencer-${r.slug}/` }, { label: `Influencer ${ct.name}` }], faq: placeFaq(ct.name) }, el: <RegionPage region={r.slug} city={ct.slug} /> };
    }
    return { meta: { path: p, label: `Influencer ${r.name}`, type: 'page', kw: `influencer ${r.name.toLowerCase()}`, title: T(`Influencer ${r.name}: creator per città`), description: `Influencer e content creator in ${r.name} per campagne locali. Cerca per città, categoria e fascia di follower.`, crumbs: [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `Influencer ${r.name}` }], faq: placeFaq(r.name) }, el: <RegionPage region={r.slug} /> };
  }
  return null;
}

/** Elenco di tutte le route (sitemap e test). */
export function allPaths() {
  const out = ['/', '/piattaforma-influencer/', '/funzionalita/database-influencer/', '/funzionalita/gestione-campagne/', '/funzionalita/link-tracciati/', '/funzionalita/media-kit/', '/influencer-marketing-aziende/', '/piattaforma-agenzie/', '/micro-influencer/', '/diventa-creator/', '/ugc-creator/', '/annunci-collaborazioni/', '/benchmark-engagement-rate/', '/prezzi/', '/influencer-italiani/', '/contatti/', '/blog/'];
  CATEGORIES.forEach((k) => out.push(`/${k.slug}/`));
  REGIONS.forEach((r) => {
    out.push(`/influencer-italiani/influencer-${r.slug}/`);
    r.cities.forEach((ct) => out.push(`/influencer-italiani/influencer-${r.slug}/influencer-${ct.slug}/`));
  });
  return out;
}
