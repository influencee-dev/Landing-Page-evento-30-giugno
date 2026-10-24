import React from 'react';
import { motion } from 'motion/react';
import { Button, entrance } from '../ds';
import { HeroReels, ReelWall, WorkReelCard } from '../rows/reels';
import { REELS } from '../site/data';
import { APP, CATEGORIES, SUBCATEGORIES, subcategoriesOf, cityPath, regionPath, CREATOR_TYPES, FACTS, FAQ, GESTITO, MARKET, REGIONS, SITE, WHATSAPP, type QA } from './data';
import { AnnunciMock, CalendarMock, CollabMock, ContractMock, DiscoveryMock, KitMock, TrustMock, LinkMock, ProfileMock, SearchMock, SignupMock } from './mocks';
import {
  AnswerBox,
  AudienceRow,
  CardGrid,
  CategoryGrid,
  CtaBandV2,
  CostChart,
  CtaDual,
  DemoForm,
  ErCalculator,
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
import { CreatorDirectory, CreatorList } from './creators';
import { SUB_STORY } from './substory';
import { CostCalcPanel, PreventivoPanel, ToolLead, EmojiTool, FakeFollowerPanel, FakeSignalsGrid, FF_RULES, JobsBoard, PostJobForm, ToolsHubGrid } from './tools';

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
  type?: 'home' | 'software' | 'page' | 'pricing' | 'tool';
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
    href: '#/pubblica-offerta-lavoro/',
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
    <Button href="#/offerte-lavoro-influencer/" variant="secondary">
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
            <motion.div initial={entrance({ opacity: 0, x: -24 })} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute -left-10 top-[58%] hidden w-56 rounded-2xl bg-white p-4 text-left text-ink shadow-float lg:block xl:-left-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Lista salvata</p>
              <p className="mt-1 font-heading font-semibold">Food creator Bologna</p>
              <p className="mt-1 text-xs text-mute">Si aggiorna da sola quando entrano nuovi profili</p>
            </motion.div>
            <motion.div initial={entrance({ opacity: 0, x: 24 })} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute -right-6 bottom-36 hidden w-52 rounded-2xl bg-ink p-4 text-left text-white shadow-float ring-1 ring-white/10 lg:block xl:-right-16">
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
      <CreatorList title={'Creator italiani\n*su Influencee*'} lead="Alcuni dei profili presenti nel sito: nella piattaforma li filtri per categoria, città, fascia di follower ed engagement." filter={{ limit: 8 }} />
      <CategoryGrid />
      <Plans compact />
      <ToolLead tool="demo_home" context="Home" eyebrow="Demo" title={'Ti mostriamo la piattaforma\n*con il tuo settore*'} lead="Lasciaci i contatti: in una call ti mostriamo creator del tuo settore e come si gestisce una campagna." bullets={['Creator del tuo settore e della tua zona', 'Campagne, contratto e link tracciati', 'Nessun impegno']} cta="Richiedi la demo" />
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
      <CtaBandV2 title={'Porta i tuoi clienti\n*su influencee*'} primary={{ label: 'Registra l’agenzia', href: APP.brand }} secondary={{ label: 'Scrivici', href: '#/contatti-influencee/' }} />
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
        { label: 'Annunci di collaborazione', text: 'Le offerte aperte dei brand', href: '#/offerte-lavoro-influencer/' },
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
      <CtaBandV2 tone="soft" title={'Crea il tuo profilo\n*da UGC creator*'} primary={{ label: 'Iscriviti gratis', href: APP.creator }} secondary={{ label: 'Vedi gli annunci', href: '#/offerte-lavoro-influencer/' }} />
    </>
  );
}

/* ─── Offerte di lavoro (ex bacheca WP Job Manager, URL indicizzato) ─ */
const JOBS_FAQ: QA[] = [
  { q: 'Come farsi sponsorizzare da un brand?', a: 'Iscriviti gratis, collega Instagram o TikTok per avere il badge Verificato e indica categorie, città e prezzi indicativi. Poi candidati alle offerte aperte: i brand vedono i tuoi numeri e possono anche invitarti direttamente a una campagna.' },
  { q: 'Dove trovo offerte di lavoro per influencer?', a: 'Nella bacheca di influencee: le aziende pubblicano collaborazioni pagate, in cambio merce o con percentuale sulle vendite e i creator si candidano gratis dall’app con il loro profilo.' },
  { q: 'Serve avere tanti follower per candidarsi?', a: 'No. Molte offerte cercano nano e micro influencer o UGC creator, che girano video per i canali del brand senza pubblicarli sul proprio profilo: per gli UGC creator conta la qualità dei video, non i follower.' },
  { q: 'Candidarsi costa qualcosa?', a: 'No, per i creator l’iscrizione e le candidature sono gratuite.' },
  FAQ.creator[3],
];
function JobsPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Creator' }, { label: 'Offerte di lavoro' }]} eyebrow="Bacheca aggiornata dai brand" title={'Offerte di lavoro per\n*influencer* e UGC creator'} lead="Collaborazioni pagate, cambio merce e percentuale sulle vendite pubblicate dalle aziende. Candidati gratis con il tuo profilo." actions={<><Button href={APP.annunci}>Vedi le offerte aperte</Button><Button href="#/pubblica-offerta-lavoro/" variant="secondary">Sei un’azienda? Pubblica</Button></>} visual={<AnnunciMock className="mx-auto max-w-[520px]" />} />
      <JobsBoard />
      <ToolLead tool="offerte_lavoro" tone="white" eyebrow="Avvisi" title={'Ricevi le nuove offerte\n*della tua categoria*'} lead="Lasciaci email e categoria: ti scriviamo quando un brand pubblica un’offerta adatta a te." bullets={['Solo offerte della tua categoria', 'Collaborazioni pagate, cambio merce, % sulle vendite', 'Ti cancelli quando vuoi']} cta="Avvisami" phone="no" withCategory />
      <AnswerBox q="Come trovare lavoro come influencer?" a="Crea un profilo con categoria, città e social collegati, poi candidati alle offerte dei brand nella bacheca. Su influencee le aziende vedono i tuoi numeri verificati e possono anche invitarti direttamente a una campagna, senza candidatura." points={['Profilo gratuito', 'Social collegati = badge Verificato', 'Candidature dall’app', 'Contratto e pagamento concordati nei termini']} />
      <Steps title={'Dalla candidatura\n*alla collaborazione*'} steps={[
        { t: 'Crea il profilo', x: 'Gratis, con categoria e città.' },
        { t: 'Candidati', x: 'Alle offerte giuste per te.' },
        { t: 'Il brand sceglie', x: 'E ti propone i termini.' },
        { t: 'Lavorate insieme', x: 'Consegne, contratto e link tracciati.' },
      ]} />
      <FaqSeo items={JOBS_FAQ} />
      <Related links={[{ label: 'UGC creator', text: 'Cos’è e come diventarlo', href: '#/ugc-creator/' }, { label: 'Costo di un influencer', text: 'Quanto chiedere per un post', href: '#/social-media-tool/costo-influencer/' }, { label: 'Media kit', text: 'Presentati ai brand', href: '#/funzionalita/media-kit/' }]} />
      <CtaDual title={'Pubblica o candidati,\n*è gratis*'} />
    </>
  );
}

const POST_FAQ: QA[] = [
  { q: 'Pubblicare un annuncio per influencer è gratis?', a: 'Sì. Compili l’offerta in 3 passi e il team ti ricontatta per pubblicarla; con l’account aziendale gratuito le candidature arrivano nell’app. Il Premium serve per funzioni avanzate come la ricerca completa nel database.' },
  { q: 'Come contattare un influencer?', a: 'Su influencee scrivi al creator in chat dalla sua scheda, lo inviti a una campagna oppure pubblichi un annuncio e aspetti le candidature. Termini, consegne e contratto restano nella stessa collaborazione.' },
  { q: 'Che tipo di compenso posso offrire?', a: 'Compenso in denaro, cambio merce, percentuale sulle vendite, formula ibrida, ospitalità o evento. La formula scelta viene scritta nei termini della collaborazione.' },
  { q: 'Come scelgo tra i candidati?', a: 'Ogni candidatura porta al profilo del creator con categoria, città, fascia di follower ed engagement, e indica la fonte dei dati. Scegli e avvii la collaborazione dalla candidatura.' },
  FAQ.brand[0],
];
function PostJobPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Aziende' }, { label: 'Pubblica offerta' }]} eyebrow="Gratis per le aziende" title={'Pubblica un *annuncio*\nper trovare influencer'} lead="Descrivi la collaborazione, ricevi le candidature dei creator italiani e scegli tu. In 3 passi, senza commissioni." actions={<><Button onClick={() => document.getElementById('pubblica')?.scrollIntoView({ behavior: 'smooth' })}>Prepara l’offerta</Button><Button href={WHATSAPP.href} variant="secondary">La gestite voi?</Button></>} visual={<AnnunciMock className="mx-auto max-w-[520px]" />} />
      <PostJobForm />
      <AnswerBox q="Come si trova un influencer per un’azienda?" a="Pubblica un’offerta con cosa cerchi, compenso e scadenza, oppure cerca direttamente nel database per categoria, città e fascia di follower e invita i creator. Su influencee puoi fare entrambe le cose, e gestire termini, contratto e link tracciati nella stessa collaborazione." />
      <FaqSeo items={POST_FAQ} />
      <ManagedRow />
      <Related links={[{ label: 'Database influencer', text: 'Cerca e invita i creator', href: '#/funzionalita/database-influencer/' }, { label: 'Quanto costa un influencer', text: 'Calcola il budget', href: '#/social-media-tool/costo-influencer/' }, { label: 'Contratto influencer', text: 'Generato dai termini', href: '#/funzionalita/contratto-influencer/' }]} />
    </>
  );
}

/* ─── Tool gratuiti: hub, fake follower, emoticon ──────────────── */
const HUB_FAQ: QA[] = [
  { q: 'I tool di influencee sono gratuiti?', a: 'Sì, tutti i tool di questa pagina sono gratuiti e si usano senza registrazione, direttamente dal browser.' },
  { q: 'I tool leggono i dati dai profili social?', a: 'No. Inserisci tu i numeri pubblici del profilo e il calcolo avviene nel browser, senza salvare nulla. Sulla piattaforma, invece, i creator verificati collegano il proprio account e i dati arrivano dalla fonte ufficiale.' },
  { q: 'Quale tool uso prima di pagare un influencer?', a: 'Il fake follower checker per controllare la qualità del pubblico, il calcolo dell’engagement rate per confrontarlo con la sua fascia e il calcolatore del costo per capire se la richiesta è in linea con il mercato.' },
];
function ToolsHubPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Risorse' }, { label: 'Tool gratuiti' }]} eyebrow="Gratis · senza registrazione" title={'Tool gratuiti per\n*influencer marketing*'} lead="Controlla i fake follower, calcola engagement e costo di un creator, trova offerte di collaborazione. Tutto dal browser, con soglie e fonti dichiarate." actions={<><Button onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}>Scegli un tool</Button><Button href={APP.brand} variant="secondary">Prova la piattaforma</Button></>} visual={<FakeFollowerPanel className="mx-auto max-w-[520px]" />} />
      <ToolsHubGrid />
      <AnswerBox q="Quali strumenti servono per l’influencer marketing?" a="Per scegliere un creator servono tre verifiche: qualità del pubblico (fake follower), engagement rispetto alla fascia di follower e costo in linea con il mercato. Poi servono strumenti per gestire la campagna: contratto, scadenze e link tracciati per misurare i risultati." points={['Fake follower checker', 'Calcolo engagement rate', 'Calcolatore costo', 'Piattaforma per gestire le campagne']} />
      <ToolLead tool="hub_tool" tone="white" eyebrow="Nuovi tool" title={'Ti avvisiamo quando escono\n*nuovi tool gratuiti*'} lead="Stiamo restaurando altri tool: preventivo social, piano editoriale, anteprima post. Ti scriviamo quando sono pronti." bullets={['Tool gratuiti, senza registrazione', 'Nessuno spam', 'Ti cancelli quando vuoi']} cta="Avvisami" phone="no" />
      <FaqSeo items={HUB_FAQ} />
      <CtaDual />
    </>
  );
}

const FF_FAQ: QA[] = [
  { q: 'Come capire se un influencer ha follower falsi?', a: 'Controlla tre numeri: engagement rate molto sotto la media della sua fascia, crescita improvvisa di follower senza un contenuto virale e visualizzazioni basse rispetto ai follower. Un solo segnale non basta: conta quando ne compaiono più insieme.' },
  { q: 'Il tool legge i dati da Instagram?', a: 'No. Inserisci tu i numeri pubblici del profilo (follower, like, commenti, visualizzazioni) e il calcolo avviene nel browser. Non serve il login a Instagram e non salviamo nulla.' },
  { q: 'Che soglie usa il fake follower checker?', a: `Engagement sotto il ${FF_RULES.erRisk * 100}% della media della fascia, crescita oltre il ${FF_RULES.growthRisk}% in 30 giorni, check sponsor sotto l’1,5%, visualizzazioni dei reel sotto il ${FF_RULES.viewsRisk}% dei follower e commenti sotto l’${FF_RULES.commentsRisk}% dei like. Sono soglie indicative per una prima verifica.` },
  { q: 'Che differenza c’è tra follower falsi e reach a pagamento?', a: 'I follower falsi gonfiano il numero di follower; la reach a pagamento gonfia le visualizzazioni di un contenuto con la pubblicità. Il check sponsor (interazioni ÷ visualizzazioni) aiuta a riconoscere la seconda.' },
  { q: 'Come vedere se i follower di un profilo sono veri?', a: 'Apri un campione di follower: profili senza foto né post, commenti generici o in lingue diverse da quella del creator e picchi di follower in giorni senza contenuti sono i segnali tipici. Poi inserisci i numeri del profilo nel checker per confrontarli con la media della sua fascia.' },
  { q: 'Come scoprire chi compra like su Instagram?', a: `Guarda il rapporto tra commenti e like: migliaia di like con quasi nessun commento (sotto l’${FF_RULES.commentsRisk}%) sono il segnale più tipico di like acquistati. Conferma con il check sponsor: interazioni basse rispetto alle visualizzazioni indicano reach comprata con la pubblicità.` },
  { q: 'Cosa succede se compri follower?', a: 'Il numero di follower sale ma le interazioni no: l’engagement rate scende sotto la media della fascia e le visualizzazioni dei reel restano basse rispetto ai follower. Sono proprio i segnali che un brand controlla prima di pagare una collaborazione.' },
  { q: 'Come evito i fake follower nelle mie campagne?', a: 'Lavora con creator che hanno collegato il proprio account: su influencee il badge Verificato indica che i dati arrivano dal login ufficiale di Instagram o TikTok, o da una verifica dello staff.' },
];
function FakeFollowerPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Tool gratuiti', href: '#/social-media-tool/' }, { label: 'Fake follower' }]} eyebrow="Tool gratuito" title={'Fake follower Instagram:\n*controlla* i follower falsi'} lead="Inserisci i numeri pubblici del profilo: il tool li confronta con la media della sua fascia di follower e ti mostra i segnali di rischio, uno per uno." note="Nessun login a Instagram · nessun dato salvato · soglie dichiarate" actions={<Button href="#/creator-verificati/" variant="secondary">Come verifichiamo i creator</Button>} visual={<FakeFollowerPanel className="mx-auto max-w-[540px]" />} />
      <ToolLead tool="fake_follower" eyebrow="Secondo parere" title={'Vuoi che controlliamo noi\n*questo profilo?*'} lead="Lasciaci i contatti: il team guarda il profilo con te e ti propone creator verificati della stessa fascia e categoria." bullets={['Controllo a mano dei follower', 'Alternative verificate nella stessa categoria', 'Nessun impegno']} cta="Chiedi il controllo" />
      <AnswerBox q="Come capire se un influencer ha follower falsi?" a={FF_FAQ[0].a} points={['Engagement vs media di fascia', 'Picchi di crescita', 'Visualizzazioni / follower', 'Check sponsor']} />
      <FakeSignalsGrid />
      <FeatureSplit items={[{ eyebrow: 'Creator verificati', title: 'Su influencee i dati arrivano dall’account collegato', text: 'Il badge Verificato vuol dire che il creator ha collegato Instagram o TikTok con il login ufficiale, o che lo staff ha verificato il profilo. Ogni numero nella scheda indica la sua fonte e la data di aggiornamento.', bullets: ['Badge Verificato', 'Engagement sulla mediana degli ultimi 90 giorni', 'Data di aggiornamento visibile'], visual: <TrustMock />, href: '#/creator-verificati/', cta: 'Scopri la verifica' }]} />
      <FaqSeo items={FF_FAQ} />
      <Related links={[{ label: 'Calcolo engagement rate', text: 'Con check sponsor', href: '#/come-calcolare-engagement-rate/' }, { label: 'Quanto costa un influencer', text: 'Calcolatore del costo', href: '#/social-media-tool/costo-influencer/' }, { label: 'Follower gratis: perché evitarli', text: 'Guida per i creator', href: `${SITE.url}/instagram-follower-gratis-perche-evitarli-e-come-crescere-davvero/` }]} />
      <CtaDual />
    </>
  );
}

const EMOJI_FAQ: QA[] = [
  { q: 'Come mettere le emoji su Instagram?', a: 'Copia l’emoji con un clic in questa pagina e incollala nella caption, nella bio o in un commento. Puoi anche comporre tutto il testo nel riquadro “Il tuo testo” e copiarlo in una volta sola.' },
  { q: 'Come si copiano le emoticon?', a: 'Clicca un’emoticon: viene copiata negli appunti e aggiunta al riquadro “Il tuo testo”. Poi incolla dove vuoi, oppure copia tutto il testo insieme.' },
  { q: 'Le emoticon funzionano su Instagram e TikTok?', a: 'Sì: sono caratteri Unicode, non immagini, quindi funzionano su Instagram, TikTok, WhatsApp, Facebook e LinkedIn. L’aspetto cambia un po’ in base al telefono.' },
  { q: 'Quante emoticon usare in una caption?', a: 'Poche e coerenti con il tono del brand: servono a dare ritmo e a guidare l’occhio, ad esempio a inizio riga negli elenchi o accanto alla call to action.' },
];
function EmojiPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Tool gratuiti', href: '#/social-media-tool/' }, { label: 'Emoticon da copiare' }]} eyebrow="Tool gratuito" title={'Emoticon ed emoji\nda *copiare* e incollare'} lead="Faccine, cuori, mani, cibo, viaggi e simboli per caption, bio e messaggi. Un clic per copiare, poi incolli dove vuoi." actions={<Button onClick={() => document.getElementById('emoticon')?.scrollIntoView({ behavior: 'smooth' })}>Scegli le emoticon</Button>} visual={<div className="mx-auto grid max-w-[460px] grid-cols-4 gap-3">{['😍', '🔥', '✨', '🙌', '❤️', '😂', '🎉', '💯'].map((e, i) => <div key={e} className={`flex aspect-square items-center justify-center rounded-3xl text-5xl ${i % 3 === 0 ? 'bg-acid' : i % 3 === 1 ? 'bg-white' : 'bg-white/10'}`}>{e}</div>)}</div>} />
      <EmojiTool />
      <ToolLead tool="emoticon" tone="white" eyebrow="Nuovi tool" title={'Ti avvisiamo quando escono\n*nuovi tool gratuiti*'} lead="Calcolatori, template e strumenti per creator e social media manager: ti scriviamo solo quando c’è qualcosa di nuovo." bullets={['Tool gratuiti, senza registrazione', 'Nessuno spam', 'Ti cancelli quando vuoi']} cta="Avvisami" phone="no" />
      <FaqSeo items={EMOJI_FAQ} />
      <Related links={[{ label: 'Tutti i tool gratuiti', text: 'Per social media manager e creator', href: '#/social-media-tool/' }, { label: 'Offerte per influencer', text: 'Collaborazioni con i brand', href: '#/offerte-lavoro-influencer/' }, { label: 'Diventa creator', text: 'Iscrizione gratuita', href: '#/diventa-creator/' }]} />
    </>
  );
}

/* ─── Benchmark (lead magnet) ───────────────────────────────────── */
function Benchmark() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Benchmark engagement rate' }]} eyebrow="Strumento gratuito" title={'Engagement rate:\n*valori di riferimento per fascia*'} lead="Come si calcola l’engagement rate, perché va confrontato con la fascia di follower e come verificare in pochi secondi se un post sponsorizzato rende." actions={<><Button href={APP.check}>Fai il check sponsor</Button><Button href={APP.benchmark} variant="secondary">Apri il benchmark</Button></>} visual={<ProfileMock className="mx-auto max-w-[460px]" />} />
      <AnswerBox q="Come si calcola l’engagement rate?" a="L’engagement rate è il rapporto tra interazioni e follower. Su influencee usiamo la mediana delle interazioni (like, commenti, condivisioni e salvataggi) su reel e video degli ultimi 90 giorni, esclusa l’ultima settimana, divisa per i follower. Con meno di 5 video il valore non viene calcolato." points={['Mediana, non media: un post virale non falsa il dato', 'Ultimi 90 giorni, esclusa l’ultima settimana', 'Confronto con la stessa fascia di follower', 'Benchmark pubblico solo con almeno 30 profili']} />
      <TiersRow tone="paper" title={'Confronta l’engagement\n*nella stessa fascia*'} lead="Un 3% può essere ottimo per un macro influencer e basso per un nano: per questo il benchmark mostra 25° percentile, mediana e 75° percentile per fascia." />
      <FaqSeo items={[
        { q: 'Qual è un buon engagement rate su Instagram?', a: 'Dipende dalla fascia di follower e dalla categoria: i profili più piccoli hanno di solito valori più alti. Confronta il creator con la mediana della sua fascia invece che con un numero unico.' },
        { q: 'Cos’è il check sponsor?', a: 'Uno strumento gratuito che divide le interazioni di un contenuto per le sue visualizzazioni. Sotto l’1,5% la reach arriva probabilmente da pubblicità; tra 1,9% e 2,7% è una media organica sana; sopra il 2,7% il contenuto va molto bene in modo organico.' },
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
      <HeroReels crumbs={<CrumbsDark items={[{ label: 'Influencer italiani' }]} />} eyebrow="Influencer italiani" title={'Influencer italiani:\n*la lista per categoria e città*'} lead={`Creator italiani divisi in ${FACTS.categories} categorie, 5 fasce di follower e tutte le regioni. Trova il profilo giusto per la tua campagna.`} actions={brandCtas} />
      <AnswerBox q="Come trovare influencer italiani?" a="Parti da categoria e zona: food a Napoli, fitness a Milano, viaggi in Sicilia. Poi scegli la fascia di follower in base all’obiettivo, nano e micro per campagne locali e di nicchia, mid e macro per la visibilità nazionale. Su influencee filtri tutto questo in un’unica ricerca, solo tra creator italiani." />
      <CreatorDirectory title={'Tutti i creator italiani\n*su Influencee*'} lead="Cerca per nome o città e filtra per categoria, regione e fascia di follower. Apri il profilo per vedere dati e costo medio." />
      <CategoryGrid />
      <RegionGrid tone="paper" />
      <ToolLead tool="creator_hub" context="Hub influencer italiani" eyebrow="Selezione gratuita" title={'Ti mandiamo i creator\n*adatti alla tua campagna*'} lead="Dicci categoria, zona e budget: il team ti propone una prima selezione di creator italiani." bullets={['Creator italiani per categoria e città', 'Prezzo indicativo di ogni profilo', 'Nessun impegno']} cta="Ricevi la selezione" />
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

/** «un/uno food influencer», «i/gli sport influencer»: articolo giusto in italiano (s+consonante, z, vocale). */
function catOne(k: { short: string; slug: string }) {
  if (k.slug === 'entrepreneur-influencers') return 'un imprenditore influencer';
  const w = k.short.toLowerCase();
  return `${/^(s[^aeiou]|z|gn|ps|x|y)/.test(w) ? 'uno' : 'un'} ${w} influencer`;
}
function catMany(k: { short: string; slug: string }) {
  const w = k.short.toLowerCase();
  return `${/^(s[^aeiou]|z|gn|ps|x|y|[aeiou])/.test(w) ? 'gli' : 'i'} ${w} influencer`;
}

const catFaq = (k: { short: string; slug: string }): QA[] => [
  { q: `Quanto costa ${catOne(k)}?`, a: 'Dipende da fascia di follower, formato e diritti d’uso. Molti creator indicano nella scheda un prezzo indicativo per reel, storia e post; il compenso finale si concorda nella collaborazione, anche in cambio merce o affiliazione.' },
  { q: `Come contattare ${k.short.toLowerCase()} influencer italiani?`, a: 'Su influencee li inviti a una campagna o pubblichi un annuncio a cui si candidano. Con Premium vedi anche i contatti dei creator che li hanno resi disponibili.' },
  FAQ.brand[0],
];
const placeFaq = (place: string): QA[] => [
  { q: `Quanto costa un influencer a ${place}?`, a: 'Dipende da fascia di follower, formato e diritti d’uso. Per attività locali funzionano bene nano e micro influencer, spesso anche con ospitalità o cambio merce.' },
  { q: 'Meglio un influencer locale o nazionale?', a: 'Per un negozio, un ristorante o un evento conviene un creator locale: il suo pubblico può davvero venire da te. Per un e-commerce nazionale conta di più la categoria.' },
  FAQ.brand[2],
];

function SubCategoryRow({ parent, current }: { parent: string; current?: string }) {
  const p = CATEGORIES.find((x) => x.slug === parent)!;
  const list = [{ slug: p.slug, short: p.short, lead: `Tutti i creator ${p.name.toLowerCase()}` }, ...subcategoriesOf(parent).map((x) => ({ slug: x.slug, short: x.short, lead: x.lead }))];
  if (list.length < 2) return null;
  return (
    <Related title={`${p.short} influencer\n*per specialità*`} links={list.filter((x) => x.slug !== current).map((x) => ({ label: `${x.short} influencer`, text: x.lead, href: `#/${x.slug}/` }))} />
  );
}

function CategoryPage({ slug }: { slug: string }) {
  const sub = SUBCATEGORIES.find((x) => x.slug === slug);
  const k = sub ?? CATEGORIES.find((x) => x.slug === slug)!;
  const parent = sub ? CATEGORIES.find((x) => x.slug === sub.parent)! : undefined;
  const cats = sub?.fill ? [...k.wp, ...sub.fill] : k.wp;
  const story = sub ? SUB_STORY[sub.slug] : undefined; // testi della vecchia pagina che si posizionano
  const listLead = sub?.fill
    ? `I creator con l’etichetta ${k.name} e i profili ${sub.fill.join(', ')} adatti ai brand ${k.name.toLowerCase()}: apri il profilo o filtra per fascia di follower nella piattaforma.`
    : `Alcuni dei creator ${k.name.toLowerCase()} presenti nel sito: apri il profilo o cercane altri con i filtri della piattaforma.`;
  return (
    <>
      <HeroReels crumbs={<CrumbsDark items={[{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, ...(parent ? [{ label: `${parent.short} influencer`, href: `#/${parent.slug}/` }] : []), { label: `${k.short} influencer` }]} />} eyebrow={story ? story.h1 : k.name} title={`${k.short} influencer\n*italiani*`} lead={story ? story.hero : `${k.lead} Cercali per città e fascia di follower e lancia la tua campagna.`} actions={<><Button href={APP.brand}>Cerca creator {k.short}</Button><Button href={APP.creator} variant="secondary">Sei un creator {k.short}? Iscriviti</Button></>} />
      <AnswerBox q={`Come scegliere ${catOne(k)}?`} a={`Guarda tre cose: la coerenza dei contenuti con il tuo prodotto, l’engagement confrontato con quello della stessa fascia di follower e la zona del pubblico se la campagna è locale. Su influencee filtri i creator della categoria ${k.name} per città, fascia e tipo, e in ogni scheda vedi numeri, crescita e brand con cui hanno già collaborato.`} />
      {cats.length > 0 && <CreatorList title={`${k.short} influencer\n*italiani su Influencee*`} lead={listLead} filter={{ cat: cats, limit: 12 }} />}
      {story && (
        <Prose
          tone="paper"
          blocks={[
            { h: story.h2, p: [story.intro] },
            { h: story.perche.h, p: [story.perche.intro], list: story.perche.list },
            { h: story.come.h, p: [story.come.p] },
            { h: story.costo.h, p: [story.costo.p] },
          ]}
          aside={
            <div className="rounded-[28px] bg-ink p-7 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-acid">Calcolatore gratuito</p>
              <p className="mt-3 font-heading text-2xl font-semibold tracking-[-0.02em]">Quanto costa {catOne(k)}?</p>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">Scegli piattaforma, fascia di follower e tipo di contenuto: ottieni una stima del compenso in pochi secondi.</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href="#/social-media-tool/costo-influencer/">Calcola il costo</Button>
                <Button href="#/preventivo-campagne/" variant="secondary">Preventivo della campagna</Button>
              </div>
            </div>
          }
        />
      )}
      <SubCategoryRow parent={parent ? parent.slug : k.slug} current={k.slug} />
      <ToolLead tool="creator_categoria" context={`Categoria: ${k.name}`} eyebrow="Selezione gratuita" title={`Ti mandiamo ${catMany(k)}\n*adatti alla tua campagna*`} lead="Dicci prodotto e budget: il team ti propone una prima selezione di creator della categoria, con prezzo indicativo." bullets={[`Creator ${k.name.toLowerCase()} italiani`, 'Prezzo indicativo di ogni profilo', 'Nessun impegno']} cta="Ricevi la selezione" />
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
  const crumbs: Crumb[] = [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `Influencer ${r.name}`, href: ct ? `#${regionPath(r)}` : undefined }];
  if (ct) crumbs.push({ label: `Influencer ${ct.name}` });
  return (
    <>
      <HeroReels crumbs={<CrumbsDark items={crumbs} />} eyebrow={ct ? `${r.name}` : 'Regione'} title={ct ? (ct.demonym ? `Influencer ${ct.demonym}:\n*creator di ${place}*` : `Influencer a *${place}*`) : r.demonym ? `Influencer ${r.demonym}:\n*creator in ${place}*` : `Influencer in *${place}*`} lead={`Creator ${ct ? 'di ' : 'in '}${place} per campagne locali: ristoranti, negozi, palestre, eventi e aperture. Filtra per categoria e fascia di follower.`} actions={<><Button href={APP.brand}>Cerca creator a {place}</Button><Button href={APP.creator} variant="secondary">Sei di {place}? Iscriviti</Button></>} />
      <AnswerBox q={`Come trovare influencer a ${place}?`} a={`Per una campagna a ${place} conta il pubblico locale: scegli creator che vivono in zona e raccontano la città, poi filtra per categoria (food, fitness, beauty…) e fascia di follower. Su influencee la posizione dei creator segue i comuni ISTAT, quindi puoi cercare per regione, provincia e città.`} />
      <CreatorList title={ct ? `Influencer ${ct.demonym ?? `di ${ct.name}`}\n*su Influencee*` : `Influencer ${r.demonym ?? `in ${r.name}`}\n*su Influencee*`} lead={`Creator ${ct ? `di ${ct.name}` : `in ${r.name}`} presenti nel sito. Apri il profilo o cercane altri con i filtri della piattaforma.`} filter={ct ? { city: ct.slug, region: r.slug, limit: 9 } : { region: r.slug, limit: 12 }} />
      <ToolLead tool={ct ? 'creator_citta' : 'creator_regione'} context={ct ? `Città: ${ct.name} (${r.name})` : `Regione: ${r.name}`} eyebrow="Selezione gratuita" title={`Ti mandiamo i creator ${ct ? `di ${ct.name}` : `in ${r.name}`}\n*adatti alla tua campagna*`} lead="Dicci attività e budget: il team ti propone una prima selezione di creator della zona, con prezzo indicativo." bullets={[`Creator ${ct ? `di ${ct.name}` : `in ${r.name}`} per la tua categoria`, 'Prezzo indicativo di ogni profilo', 'Nessun impegno']} cta="Ricevi la selezione" />
      <CategoryGrid title={`Influencer a ${place}\n*per categoria*`} lead="Scegli il settore della tua campagna." />
      {!ct && r.cities.length > 0 && <RegionGrid tone="paper" only={r.slug} title={`Città della\n*regione ${r.name}*`} lead="Apri la pagina della città." />}
      <FaqSeo items={placeFaq(place)} />
      <Related links={[{ label: 'Micro influencer', text: 'Perfetti per le campagne locali', href: '#/micro-influencer/' }, { label: 'Annunci', text: 'Pubblica un annuncio per la tua città', href: '#/offerte-lavoro-influencer/' }, { label: 'Tutte le regioni', text: 'Influencer in tutta Italia', href: '#/influencer-italiani/' }]} />
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
      <HeroPlatform crumbs={[{ label: 'Contatti' }]} eyebrow="Contatti" title={'Parliamo della\n*tua campagna*'} lead="Vuoi vedere la piattaforma con il tuo settore o hai bisogno di aiuto per partire? Scrivici su WhatsApp: ti rispondiamo lì, con una persona del team." actions={<><Button href={WHATSAPP.href}>Preventivo su WhatsApp</Button><Button href={APP.brand} variant="secondary">Registrati e prova</Button></>} visual={<CollabMock className="mx-auto max-w-[480px]" />} />
      <ManagedRow />
      <DemoForm />
      <FaqSeo items={[FAQ.piattaforma[0], FAQ.brand[0], FAQ.creator[0]]} />
    </>
  );
}

/* ─── Blog (struttura: gli articoli vengono migrati dal sito attuale) ─ */
/** Articoli che restano sul sito attuale (stesso URL): nell'anteprima puntano a influencee.it. */
const V2_PATHS = new Set(['/come-calcolare-engagement-rate/', '/influencer-italiani/', '/social-media-tool/emoticon-da-copiare/']);
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
      <HeroPlatform crumbs={[{ label: 'Blog' }]} eyebrow="Blog" title={'Guide di influencer marketing\n*per brand e creator*'} lead="Articoli pratici su creator, campagne, engagement e strumenti social." actions={<Button href="#/influencer-italiani/">Influencer italiani</Button>} visual={<KitMock className="mx-auto max-w-[480px]" />} />
      <Related title={'Articoli\n*più letti*'} links={posts.map(([t, href, tag]) => ({ label: t, text: tag, href: V2_PATHS.has(href) ? `#${href}` : SITE.url + href }))} />
    </>
  );
}


/* ─── Campagna gestita: preventivo online (ex /preventivo-campagne/) ─ */
const GESTITO_FAQ: QA[] = [
  { q: 'Quanto costa una campagna con influencer gestita dal team?', a: `Con il listino di Influencee, per creator fino a ${GESTITO.maxFollower.toLocaleString('it-IT')} follower: ${GESTITO.creator} € al mese per ogni influencer (${GESTITO.extraContent} € per ogni contenuto in più), ${GESTITO.creatorFee} € di gestione per influencer, ${GESTITO.ugc} € per video UGC più ${GESTITO.ugcFee} € di gestione. Le campagne di 3, 6 e 12 mesi hanno uno sconto del 5, 6 e 8%.` },
  { q: 'Cosa comprende il servizio gestito?', a: 'Il team sceglie i creator con te, prepara brief e termini, segue consegne e approvazioni e misura i risultati con i link tracciati della piattaforma. Tu approvi creator e contenuti.' },
  { q: 'E per creator con più di 70.000 follower?', a: 'Il listino vale fino a 70.000 follower. Per profili più grandi, VIP o campagne con molti creator facciamo un preventivo su misura: scrivici su WhatsApp.' },
  { q: 'Quanto costa un video UGC?', a: `Nel listino del servizio gestito un video UGC costa ${GESTITO.ugc} € più ${GESTITO.ugcFee} € di gestione del team. Il prezzo vale per i creator fino a ${GESTITO.maxFollower.toLocaleString('it-IT')} follower.` },
  { q: 'Perché una campagna di un mese costa di più?', a: `Le campagne di un solo mese hanno una maggiorazione del ${GESTITO.oneMonthSurcharge * 100}% sul totale mensile. Dai 3 mesi in su c’è uno sconto: 5% a 3 mesi, 6% a 6 mesi, 8% a 12 mesi.` },
  { q: 'Meglio un’agenzia o la piattaforma?', a: 'Se hai tempo per scegliere i creator e seguire le consegne, la piattaforma ti basta e non ci sono commissioni sulle collaborazioni. Se preferisci delegare, la campagna la gestisce il team di Influencee come agenzia di influencer marketing.' },
  { q: 'Posso gestire la campagna da solo?', a: 'Sì: con la piattaforma cerchi i creator, pubblichi annunci e gestisci contratti e link tracciati in autonomia, senza commissioni sulle collaborazioni. Il servizio gestito è per chi preferisce delegare.' },
];
function GestitoPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Soluzioni' }, { label: 'Campagna gestita' }]} eyebrow="Campagna gestita dal team" title={'Quanto costa una campagna\ncon influencer? *Calcolala*'} lead="Scegli quanti influencer e video UGC ti servono e vedi subito il preventivo con il nostro listino. Il team segue creator, contenuti e risultati." actions={<Button href={WHATSAPP.href} variant="secondary">Parla con il team</Button>} visual={<PreventivoPanel className="mx-auto max-w-[540px]" />} />
      <ToolLead tool="preventivo_campagna" eyebrow="Preferisci una chiamata?" title={'Ti richiamiamo\n*con il preventivo*'} lead="Lascia i contatti: il team ti richiama, rivede il preventivo con te e ti propone i primi creator." bullets={['Preventivo confermato per iscritto', 'Prima selezione di creator', 'Nessun impegno']} cta="Richiamatemi" phone="obbligatorio" />
      <AnswerBox q="Quanto costa una campagna con influencer?" a={`${GESTITO_FAQ[0].a} Esempio: 3 influencer con un contenuto al mese per 3 mesi costano 6.412,50 €, con lo sconto del 5%.`} points={[`${GESTITO.creator} € a influencer al mese`, `${GESTITO.ugc} € a video UGC`, 'Gestione del team inclusa nel listino', 'Sconti fino all’8% sulla durata']} />
      <Steps title={'Come lavoriamo\n*per te*'} steps={[
        { t: 'Brief e budget', x: 'Obiettivo, prodotto e pubblico, in una call.' },
        { t: 'Scelta dei creator', x: 'Ti proponiamo i profili, tu approvi.' },
        { t: 'Contenuti', x: 'Brief, consegne e approvazioni nella piattaforma.' },
        { t: 'Risultati', x: 'Click e visitatori dai link tracciati.' },
      ]} />
      <FeatureSplit items={[F.campagne, F.link]} />
      <FaqSeo items={GESTITO_FAQ} />
      <Related links={[{ label: 'Quanto costa un influencer', text: 'Prezzo di un singolo creator', href: '#/social-media-tool/costo-influencer/' }, { label: 'Fake follower checker', text: 'Controlla un profilo', href: '#/followe-instagram-fake-follower/' }, { label: 'Agenzia influencer', text: 'Il servizio gestito di Influencee', href: `${SITE.url}/agenzia-influencer/` }]} />
      <CtaDual />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGINE MODULO (seconda ondata): una pagina per ogni funzione del tool
   ════════════════════════════════════════════════════════════════════ */
const reel = (id: string) => REELS.find((r) => r.id === id)!;
function ReelTrio({ ids }: { ids: string[] }) {
  return (
    <div className="relative mx-auto grid max-w-[480px] grid-cols-3 items-end gap-3">
      {ids.map((id, i) => (
        <div key={id} className={i === 1 ? '-translate-y-6' : ''}>
          <WorkReelCard r={reel(id)} delay={i * 0.6} />
        </div>
      ))}
    </div>
  );
}

const CALC_FAQ: QA[] = [
  { q: 'Cos’è l’engagement rate?', a: 'È la percentuale di follower che interagisce con i contenuti di un profilo: interazioni divise per follower, per 100. Misura quanto è attiva la community ed è più utile del numero di follower per scegliere un creator.' },
  { q: 'Come si calcola l’engagement rate su TikTok?', a: 'Con la stessa formula: interazioni (like, commenti, condivisioni e salvataggi) divise per follower, per 100. Su TikTok conviene guardare anche il rapporto tra interazioni e visualizzazioni, perché molti video arrivano a persone che non seguono il profilo.' },
  { q: 'Come si calcola l’engagement rate?', a: 'Si sommano le interazioni di un contenuto (like, commenti, condivisioni e salvataggi), si divide per il numero di follower e si moltiplica per 100. Per un valore affidabile usa la mediana degli ultimi contenuti invece della media, così un singolo post virale non falsa il risultato.' },
  { q: 'Qual è un buon engagement rate su Instagram?', a: `Dipende dalla fascia di follower. Secondo le fonti italiane raccolte da influencee la media è circa ${MARKET.erIG[0].v.toLocaleString('it-IT')}% per i nano influencer, ${MARKET.erIG[1].v.toLocaleString('it-IT')}% per i micro e ${MARKET.erIG[4].v.toLocaleString('it-IT')}% per i profili oltre il milione di follower.` },
  { q: 'Che differenza c’è tra engagement sui follower e sulle visualizzazioni?', a: 'L’engagement sui follower misura quanto la community interagisce con il creator. Il rapporto tra interazioni e visualizzazioni misura quanto un singolo contenuto coinvolge chi lo vede: è la base del check sponsor.' },
  { q: 'Il calcolatore è gratuito?', a: 'Sì, gratuito e senza registrazione. Su influencee l’engagement di ogni creator viene calcolato in automatico sulla mediana degli ultimi 90 giorni.' },
];
const COST_FAQ: QA[] = [
  { q: 'Quanto costa un influencer in Italia?', a: `In media un post su Instagram costa circa ${MARKET.costIG[0].v} € per un nano influencer, ${MARKET.costIG[1].v} € per un micro, ${MARKET.costIG[2].v.toLocaleString('it-IT')} € per un mid e ${MARKET.costIG[4].v.toLocaleString('it-IT')} € per un profilo oltre il milione di follower (fonte DeRev). Il prezzo finale dipende da formato, diritti d’uso ed esclusiva.` },
  { q: 'Quanto costa un micro influencer?', a: `Circa ${MARKET.costIG[1].v} € per un post su Instagram e ${MARKET.costTT[1].v} € su TikTok, come valori medi indicativi. Molte collaborazioni con micro influencer usano anche cambio merce, affiliazione o ospitalità.` },
  { q: 'Si può pagare un influencer con i prodotti?', a: 'Sì. Su influencee puoi offrire compenso in denaro, cambio merce, affiliazione, formula ibrida, ospitalità o evento, e revenue share. La formula scelta viene scritta nell’accordo.' },
  { q: 'Quanto costa un influencer su TikTok?', a: `Come valori indicativi, circa ${MARKET.costTT[0].v} € a contenuto per un nano influencer, ${MARKET.costTT[1].v} € per un micro, ${MARKET.costTT[2].v.toLocaleString('it-IT')} € per un mid e ${MARKET.costTT[4].v.toLocaleString('it-IT')} € oltre il milione di follower. Sono valori da fonti estere o interpolazioni: il calcolatore mostra l’origine di ogni numero.` },
  { q: 'Quanto guadagna un influencer con 10 mila follower?', a: `Con 10.000 follower si entra nella fascia micro: la stima va da circa ${Math.round(10000 * MARKET.priceWeights.find((x) => 10000 < x.upTo)!.w)} € a post con la formula di Influencee a ${MARKET.costIG[1].v} € a post come media di mercato della fascia (DeRev). Engagement alto e diritti d’uso spostano il prezzo verso l’alto.` },
  { q: 'Da cosa dipende il prezzo di un influencer?', a: 'Fascia di follower, piattaforma, formato (reel, storie, post, video), numero di contenuti, diritti d’uso per le inserzioni, durata della licenza ed esclusiva di settore.' },
];
const UGC_FAQ: QA[] = [
  { q: 'Cosa sono i contenuti UGC?', a: 'Sono video e foto in stile spontaneo, realizzati da creator (user generated content), che un brand pubblica sui propri canali e nelle inserzioni: recensioni, unboxing, tutorial, prove prodotto. Funzionano perché sembrano consigli di persone reali.' },
  { q: 'Quanto costa un video UGC?', a: 'Dipende da durata, numero di varianti e diritti d’uso. Su influencee molti creator UGC indicano un prezzo indicativo per video nella scheda e il compenso si concorda nella collaborazione.' },
  { q: 'Chi possiede i diritti dei contenuti UGC?', a: 'Quelli concordati nei termini: canali, durata della licenza e uso nelle inserzioni vengono scritti nell’accordo e riportati nel contratto generato.' },
  FAQ.brand[2],
];
const CONTRACT_FAQ: QA[] = [
  { q: 'Cosa deve contenere un contratto con un influencer?', a: 'Le parti, i contenuti da consegnare con formati e scadenze, il compenso e la sua forma, i diritti d’uso e la loro durata, l’eventuale esclusiva, le revisioni previste e l’obbligo di segnalare la collaborazione come pubblicità.' },
  { q: 'Come viene creato il contratto su influencee?', a: 'Dai termini che brand e creator hanno accettato nella stessa versione: la piattaforma genera il documento in DOCX (o PDF) e ne registra l’impronta, così resta traccia di cosa è stato concordato.' },
  { q: 'Il contratto generato basta in ogni caso?', a: 'Copre le collaborazioni standard. Per accordi complessi, come esclusive lunghe o licenze internazionali, conviene una verifica del proprio legale.' },
];
const CAL_FAQ: QA[] = [
  { q: 'Come si organizza il calendario di una campagna con influencer?', a: 'Si fissano le date di consegna e di pubblicazione per ogni creator e si segue lo stato dei contenuti: consegnato, da modificare, approvato, pubblicato. Su influencee il calendario raccoglie tutte le scadenze delle tue collaborazioni.' },
  { q: 'Cosa succede se un creator consegna in ritardo?', a: 'La consegna viene segnata come "In ritardo" e la vedi subito nel calendario e nella collaborazione, insieme alla chat con il creator.' },
  { q: 'Il calendario c’è anche per i creator?', a: 'Sì: anche il creator vede in calendario le scadenze di tutte le sue collaborazioni.' },
];
const TRUST_FAQ: QA[] = [
  { q: 'Come si verifica se un influencer è affidabile?', a: 'Controlla che i numeri arrivino dall’account ufficiale, che l’engagement sia in linea con la sua fascia di follower, che la crescita non abbia picchi anomali e con quali brand ha già collaborato. Su influencee ogni dato indica la sua fonte e la data di aggiornamento.' },
  { q: 'Cosa significa il badge Verificato?', a: FEATURE_FAQ.ricerca[2].a },
  { q: 'Come riconoscere follower falsi?', a: 'Segnali tipici: engagement molto più basso della media della fascia, crescita improvvisa senza contenuti virali, commenti generici e ripetitivi. Il calcolatore di engagement rate e il check sponsor aiutano a fare una prima verifica.' },
];
const LOCAL_FAQ: QA[] = [
  { q: 'Come promuovere un ristorante o un negozio con gli influencer?', a: 'Scegli creator della tua città, offri un’esperienza (ospitalità, menu degustazione, anteprima) e chiedi contenuti che mostrino il locale e come raggiungerlo. Con un link tracciato o un QR sai quante persone arrivano dai contenuti.' },
  { q: 'Meglio pagare o offrire ospitalità?', a: 'Per nano e micro influencer locali l’ospitalità o il cambio merce sono spesso sufficienti; per profili più grandi si aggiunge un compenso. Su influencee la formula viene scritta nell’accordo.' },
  FAQ.brand[0],
];
const PRO_FAQ: QA[] = [
  { q: 'Chi sono i creator professionisti?', a: 'Professionisti che fanno divulgazione sui social nel loro campo: medici, dentisti, nutrizionisti, psicologi, fisioterapisti, personal trainer, avvocati, consulenti finanziari, esperti di marketing e formatori.' },
  { q: 'Perché un brand dovrebbe collaborare con un professionista?', a: 'Per autorevolezza: un parere competente rende credibili prodotti e servizi in salute, benessere, finanza e formazione, dove il pubblico cerca fonti affidabili.' },
  { q: 'Ci sono regole particolari?', a: 'Sì: i professionisti seguono anche le regole del proprio ordine, e la collaborazione va sempre dichiarata come pubblicità. Va considerato già nel brief.' },
];

function CalcPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Risorse' }, { label: 'Calcolo engagement rate' }]} eyebrow="Strumento gratuito" title={'Come calcolare\nl’*engagement rate*'} lead="Inserisci follower e interazioni e scopri subito l’engagement rate di un profilo, confrontato con la media della sua fascia. C’è anche il check sponsor per i singoli contenuti." actions={<><Button onClick={() => document.getElementById('calcolatore')?.scrollIntoView({ behavior: 'smooth' })}>Calcola ora</Button><Button href={APP.brand} variant="secondary">Confronta i creator</Button></>} visual={<ProfileMock className="mx-auto max-w-[460px]" />} />
      <ErCalculator />
      <ToolLead tool="engagement_rate" tone="paper" eyebrow="Confronto" title={'Vuoi confrontare il creator\n*con altri della sua fascia?*'} lead="Lasciaci i contatti: ti mostriamo creator della stessa fascia e categoria con engagement verificato." bullets={['Engagement calcolato sulla mediana di 90 giorni', 'Badge Verificato da account collegato', 'Nessun impegno']} cta="Voglio il confronto" />
      <AnswerBox q="Come si calcola l’engagement rate?" a={CALC_FAQ[0].a} points={['Interazioni ÷ follower × 100', 'Usa la mediana, non la media', 'Confronta con la stessa fascia', 'Check sponsor: interazioni ÷ views']} />
      <FeatureSplit items={[{ ...F.scheda, title: 'Su influencee l’engagement è già calcolato' }, { ...F.ricerca, title: 'Filtra i creator per engagement e fascia' }]} />
      <FaqSeo items={CALC_FAQ} />
      <Related links={[{ label: 'Benchmark engagement', text: 'Valori di riferimento per fascia', href: '#/benchmark-engagement-rate/' }, { label: 'Quanto costa un influencer', text: 'Costi medi per fascia', href: '#/social-media-tool/costo-influencer/' }, { label: 'Creator verificati', text: 'Come verifichiamo i dati', href: '#/creator-verificati/' }]} />
      <CtaDual />
    </>
  );
}

function CostPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Tool gratuiti', href: '#/social-media-tool/' }, { label: 'Quanto costa un influencer' }]} eyebrow="Calcolatore gratuito" title={'Quanto costa un influencer?\n*Calcola* il costo per post'} lead="Una stima per contenuto a partire da follower ed engagement, accanto al costo medio di mercato della stessa fascia, con la fonte di ogni valore." actions={<Button href={WHATSAPP.href} variant="secondary">Preventivo per un progetto</Button>} visual={<CostCalcPanel className="mx-auto max-w-[540px]" />} />
      <ToolLead tool="costo_influencer" eyebrow="Selezione creator" title={'Ti mandiamo i creator\n*di questa fascia*'} lead="Dicci cosa ti serve: ti proponiamo una prima selezione di creator italiani in linea con il budget che hai calcolato." bullets={['Creator della fascia e categoria scelte', 'Prezzo indicativo di ogni profilo', 'Nessun impegno']} cta="Ricevi la selezione" />
      <AnswerBox q="Quanto costa un influencer?" a={COST_FAQ[0].a} points={[`Nano: circa ${MARKET.costIG[0].v} € a post`, `Micro: circa ${MARKET.costIG[1].v} € a post`, `Mid: circa ${MARKET.costIG[2].v.toLocaleString('it-IT')} € a post`, `Mega: oltre ${MARKET.costIG[4].v.toLocaleString('it-IT')} € a post`]} />
      <CostChart tone="white" />
      <FactsBand items={MARKET.context.map((c) => ({ v: c.v, l: `${c.l} · ${c.src}` }))} />
      <Prose blocks={[
        { h: 'Da cosa dipende il prezzo di un influencer?', p: ['Il numero di follower conta, ma non è l’unico fattore. Pesano il formato (un reel costa più di una storia), il numero di contenuti, la produzione richiesta e soprattutto i diritti d’uso: usare il video nelle inserzioni o per molti mesi ha un valore in più.', 'Anche l’esclusiva di settore alza il prezzo: chiedere a un creator di non lavorare con concorrenti per un periodo è un costo per lui.'] },
        { h: 'Come risparmiare senza perdere risultati?', p: ['Più micro influencer al posto di un solo grande profilo: stesso budget, più contenuti, community più attente. Oppure formule ibride: un compenso più basso più prodotto o affiliazione sulle vendite.', 'Su influencee molti creator dichiarano un prezzo indicativo per reel, storia e post: lo vedi nella scheda prima di contattarli.'] },
      ]} aside={<KitMock />} />
      <CardGrid tone="paper" title={'Le formule\n*di compenso*'} lead="Tutte disponibili nelle offerte delle campagne su influencee." items={[
        { t: 'Compenso in denaro', x: 'Un importo fisso per i contenuti concordati.' },
        { t: 'Cambio merce', x: 'Prodotti o servizi al posto del compenso, utile con nano e micro.' },
        { t: 'Affiliazione', x: 'Una percentuale sulle vendite generate dal creator.' },
        { t: 'Ibrida', x: 'Una parte fissa più prodotto o affiliazione.' },
        { t: 'Ospitalità o evento', x: 'Esperienze per ristoranti, hotel, locali ed eventi.' },
        { t: 'Revenue share', x: 'Condivisione dei ricavi su progetti continuativi.' },
      ]} />
      <FaqSeo items={COST_FAQ} />
      <ManagedRow />
      <Related links={[{ label: 'Micro influencer', text: 'Il miglior rapporto costo/risultato', href: '#/micro-influencer/' }, { label: 'Preventivo campagna gestita', text: 'Quanto costa una campagna completa', href: '#/preventivo-campagne/' }, { label: 'Calcolo engagement rate', text: 'Verifica prima di pagare', href: '#/come-calcolare-engagement-rate/' }]} />
      <CtaDual />
    </>
  );
}

function UgcBrandPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Contenuti UGC' }]} eyebrow="Contenuti UGC per brand" title={'Contenuti UGC\n*per i tuoi canali e le tue ads*'} lead="Video spontanei di creator italiani da pubblicare sui tuoi profili e nelle inserzioni. Scegli l’obiettivo UGC, trova i creator e definisci i diritti d’uso nel contratto." actions={brandCtas} visual={<ReelTrio ids={['beauty-body-project', 'food-salse-zero', 'fitness-scegli-corso']} />} />
      <AnswerBox q="Cosa sono i contenuti UGC?" a={UGC_FAQ[0].a} points={['Recensioni e unboxing', 'Tutorial e prove prodotto', 'Per organico e inserzioni', 'Diritti d’uso nel contratto']} />
      <Steps title={'Come ottenere contenuti UGC\n*in 4 passi*'} steps={[
        { t: 'Scegli l’obiettivo UGC', x: 'Nella nuova campagna seleziona "Contenuti UGC".' },
        { t: 'Trova i creator', x: 'Filtra per tipo UGC e categoria, oppure pubblica un annuncio.' },
        { t: 'Concorda i diritti', x: 'Canali, durata e uso nelle ads finiscono nel contratto.' },
        { t: 'Ricevi e approva', x: 'Consegne, richieste di modifica e approvazione finale.' },
      ]} />
      <FeatureSplit tone="white" items={[F.annunci, { ...F.campagne, title: 'Brief, consegne e revisioni in un posto' }]} />
      <ReelWall eyebrow="Esempi" title={'Video in stile UGC\n*fatti per attività italiane*'} lead="Contenuti realizzati per ristoranti, palestre, centri estetici e farmacie." stats={[['Unboxing', 'prodotto in mano'], ['Tutorial', 'come si usa'], ['Recensione', 'parere sincero']]} />
      <FaqSeo items={UGC_FAQ} />
      <ManagedRow />
      <Related links={[{ label: 'UGC creator', text: 'Se sei un creator', href: '#/ugc-creator/' }, { label: 'Contratto', text: 'Diritti d’uso scritti', href: '#/funzionalita/contratto-influencer/' }, { label: 'Quanto costa', text: 'Costi medi dei creator', href: '#/social-media-tool/costo-influencer/' }]} />
      <CtaDual />
    </>
  );
}

function LocalPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Campagne locali' }]} eyebrow="Influencer marketing locale" title={'Influencer per ristoranti,\n*negozi ed eventi*'} lead="Creator della tua città per aperture, menu, eventi e promozioni. Filtri per comune e regione, ospitalità o cambio merce e link tracciati anche per QR e volantini." actions={brandCtas} visual={<ReelTrio ids={['food-sushi-morso', 'eventi-inaugurazione', 'fitness-ogni-orario']} />} />
      <AnswerBox q="Come promuovere un locale con gli influencer?" a={LOCAL_FAQ[0].a} points={['Creator della tua città', 'Ospitalità o cambio merce', 'QR e link tracciati', 'Obiettivo "Locale o evento"']} />
      <ReelWall eyebrow="Casi reali" title={'Contenuti per\n*attività locali*'} lead="Reel realizzati per ristoranti, palestre, farmacie, centri estetici e inaugurazioni." stats={[['Food', 'ristoranti e locali'], ['Fitness', 'palestre e corsi'], ['Eventi', 'aperture e inaugurazioni']]} />
      <Steps title={'Una campagna locale\n*passo per passo*'} steps={[
        { t: 'Obiettivo "Locale o evento"', x: 'Indica città, data e cosa vuoi promuovere.' },
        { t: 'Creator della zona', x: 'Filtra per comune, provincia o regione.' },
        { t: 'Offerta', x: 'Ospitalità, cambio merce o compenso, scritti nell’accordo.' },
        { t: 'Misura', x: 'Link tracciati e QR per contare chi arriva.' },
      ]} />
      <RegionGrid tone="paper" title={'Trova creator\n*nella tua città*'} />
      <FaqSeo items={LOCAL_FAQ} />
      <ManagedRow />
      <CtaDual />
    </>
  );
}

function ProPage() {
  const pros = ['Medicina', 'Odontoiatria', 'Nutrizione', 'Psicologia', 'Fisioterapia', 'Personal trainer', 'Legale', 'Consulenza finanziaria', 'Marketing e social media', 'Formazione'];
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Creator professionisti' }]} eyebrow="Creator professionisti" title={'Medici, nutrizionisti, esperti:\n*creator con autorevolezza*'} lead="Professionisti che fanno divulgazione sui social, per brand di salute, benessere, finanza e formazione. Cercali con il tipo Professionista e la loro professione." actions={<><Button href={APP.brand}>Cerca professionisti</Button><Button href={APP.creator} variant="secondary">Sono un professionista</Button></>} visual={<ReelTrio ids={['salute-farmacia-vaccini', 'salute-farmacia-antibiotico', 'fitness-percorso']} />} />
      <AnswerBox q="Chi sono i creator professionisti?" a={PRO_FAQ[0].a} points={['Tipo creator dedicato', '10 professioni', 'Autorevolezza nel settore', 'Per salute, finanza, formazione']} />
      <CardGrid title={'Le professioni\n*sulla piattaforma*'} items={pros.map((p) => ({ t: p, x: 'Creator con il tipo Professionista e questa professione nel profilo.' }))} cols={4} />
      <ReelWall eyebrow="Esempi" title={'Divulgazione\n*che crea fiducia*'} lead="Contenuti di professionisti per farmacie e centri specializzati." stats={[['Salute', 'farmacie e prevenzione'], ['Benessere', 'nutrizione e movimento'], ['Servizi', 'consulenza e formazione']]} />
      <FaqSeo items={PRO_FAQ} />
      <CtaDual />
    </>
  );
}

function TrustPage() {
  return (
    <>
      <HeroPlatform crumbs={[{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Creator verificati' }]} eyebrow="Creator verificati" title={'Creator verificati,\n*dati con la loro fonte*'} lead="Badge Verificato da account collegato, livello di ogni dato e data dell’ultimo aggiornamento: per scegliere i creator su numeri di cui ti puoi fidare." actions={brandCtas} visual={<TrustMock className="mx-auto max-w-[460px]" />} />
      <AnswerBox q="Come si verifica un influencer?" a={TRUST_FAQ[0].a} points={['Account collegato in sola lettura', 'Livello del dato sempre visibile', 'Engagement rispetto alla fascia', 'Brand già citati con #adv']} />
      <FeatureSplit items={[
        { eyebrow: 'Fonte dei dati', title: 'Quattro livelli, sempre dichiarati', text: 'Ogni numero dice se è autenticato dall’account collegato, dichiarato dal creator, osservato da fonti pubbliche o stimato con regole note. Niente scatole nere.', bullets: ['Autenticato › dichiarato › osservato › stimato', 'Data dell’ultimo aggiornamento', 'Nessuna stima spacciata per dato'], visual: <TrustMock /> },
        { ...F.scheda },
        { eyebrow: 'Collegamento social', title: 'Verificato con il login ufficiale', text: 'Il creator collega Instagram, TikTok o YouTube con il login ufficiale, in sola lettura: niente password condivise, nessuna pubblicazione a suo nome. Così ottiene il badge Verificato.', bullets: ['Token cifrati e in sola lettura', 'Badge Premium assegnato dallo staff', 'Nessun minorenne in piattaforma'], visual: <SignupMock /> },
      ]} />
      <FaqSeo items={TRUST_FAQ} />
      <Related links={[{ label: 'Calcolo engagement rate', text: 'Verifica un profilo in pochi secondi', href: '#/come-calcolare-engagement-rate/' }, { label: 'Database influencer', text: 'Filtra solo i Verificati', href: '#/funzionalita/database-influencer/' }, { label: 'Diventa creator', text: 'Ottieni il badge', href: '#/diventa-creator/' }]} />
      <CtaDual />
    </>
  );
}

/* ─── Risolutore delle route ────────────────────────────────────── */
const T = (s: string) => `${s} | ${SITE.name}`;
/** Modulo lead (tandem) in fondo alle pagine che non ne hanno già uno: demo per i brand, avvisi per i creator. */
const BRAND_LEAD = ['/piattaforma-influencer/', '/influencer-marketing-aziende/', '/piattaforma-agenzie/', '/micro-influencer/', '/prezzi/', '/contenuti-ugc/', '/influencer-marketing-locale/', '/creator-professionisti/', '/creator-verificati/'];
const CREATOR_LEAD = ['/diventa-creator/', '/ugc-creator/'];
function withLead(r: Resolved): Resolved {
  const p = r.meta.path;
  if (BRAND_LEAD.includes(p) || p.startsWith('/funzionalita/'))
    return { ...r, el: <>{r.el}<ToolLead tool="demo" context={`Pagina: ${r.meta.label}`} tone="paper" eyebrow="Demo" title={'Ti mostriamo la piattaforma\n*con il tuo settore*'} lead="Lasciaci i contatti: in una call ti mostriamo creator del tuo settore e come si gestisce una campagna su Influencee." bullets={['Creator del tuo settore e della tua zona', 'Campagne, contratto e link tracciati', 'Nessun impegno']} cta="Richiedi la demo" /></> };
  if (CREATOR_LEAD.includes(p))
    return { ...r, el: <>{r.el}<ToolLead tool="creator_avvisi" context={`Pagina: ${r.meta.label}`} tone="paper" eyebrow="Per i creator" title={'Ricevi le offerte\n*della tua categoria*'} lead="Lasciaci email e categoria: ti scriviamo quando un brand cerca creator come te." bullets={['Solo offerte della tua categoria', 'Iscrizione gratuita', 'Ti cancelli quando vuoi']} cta="Avvisami" phone="no" withCategory /></> };
  return r;
}

/** Primo title che resta entro 60 caratteri (con il nome del sito). */
const fit = (opts: string[]) => opts.map(T).find((t) => t.length <= 60) ?? T(opts[opts.length - 1]);

export function resolve(path: string): Resolved | null {
  const p = path.replace(/\/?$/, '/');
  const seg = p.split('/').filter(Boolean);

  const fixed: Record<string, () => Resolved> = {
    '/': () => ({ meta: { path: '/', label: 'Home', type: 'home', kw: 'piattaforma influencer marketing', title: 'Influencee: piattaforma di influencer marketing in Italia', description: 'Trova influencer e UGC creator italiani, lancia campagne e misura i click di ogni contenuto. Prova gratis, i creator si iscrivono gratis.', faq: [...FAQ.piattaforma.slice(0, 2), FAQ.brand[0], FAQ.creator[0], FAQ.creator[1]] }, el: <Home /> }),
    '/piattaforma-influencer/': () => ({ meta: { path: p, label: 'Piattaforma', type: 'software', kw: 'piattaforma influencer', title: T('Piattaforma influencer per brand e agenzie'), description: 'Ricerca creator italiani, campagne, contratti e link tracciati in un’unica piattaforma di influencer marketing. Dati con la loro fonte, niente AI.', crumbs: [{ label: 'Piattaforma influencer' }], faq: FAQ.piattaforma }, el: <Platform /> }),
    '/funzionalita/database-influencer/': () => ({ meta: { path: p, label: 'Database influencer', type: 'software', kw: 'database influencer italiani', title: T('Database influencer italiani con filtri'), description: 'Cerca influencer e UGC creator italiani per categoria, città, fascia di follower ed engagement. Liste salvate, schede con dati verificabili.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Database influencer' }], faq: FEATURE_FAQ.ricerca }, el: <FeaturePage crumb="Database influencer" eyebrow="Database influencer" title={'Database di influencer\n*italiani*'} lead="Cerca creator per categoria, città, fascia di follower, tipo e piattaforma. Ogni scheda mostra numeri, crescita e fonte del dato." visual={<SearchMock className="mx-auto max-w-[520px]" />} answer={{ q: 'Cos’è un database di influencer?', a: 'È un archivio ricercabile di creator con i loro dati: categoria, città, follower, engagement e contenuti. Su influencee contiene solo creator italiani, con filtri combinabili e liste salvate che si aggiornano da sole quando entrano nuovi profili.' }} items={[F.ricerca, F.scheda]} faq={FEATURE_FAQ.ricerca} related={[{ label: 'Influencer per categoria', text: '18 categorie', href: '#/influencer-italiani/' }, { label: 'Micro influencer', text: 'Filtra la fascia 10–50 mila', href: '#/micro-influencer/' }, { label: 'Prezzi', text: 'Gratis o Premium', href: '#/prezzi/' }]} /> }),
    '/funzionalita/gestione-campagne/': () => ({ meta: { path: p, label: 'Gestione campagne', type: 'software', kw: 'gestione campagne influencer', title: T('Gestione campagne influencer e contratti'), description: 'Brief, termini con doppia accettazione, consegne, approvazioni e contratto generato: gestisci le collaborazioni con i creator in un unico posto.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Gestione campagne' }], faq: FEATURE_FAQ.campagne }, el: <FeaturePage crumb="Gestione campagne" eyebrow="Campagne e collaborazioni" title={'Gestione delle campagne\n*con gli influencer*'} lead="Obiettivo, brief, offerta e termini; poi consegne, approvazioni e contratto. Tutto nella collaborazione, senza email e fogli sparsi." visual={<CollabMock className="mx-auto max-w-[520px]" />} answer={{ q: 'Come si gestisce una campagna di influencer marketing?', a: FEATURE_FAQ.campagne[0].a }} items={[F.campagne, F.annunci]} faq={FEATURE_FAQ.campagne} related={[{ label: 'Link tracciati', text: 'Misura i click', href: '#/funzionalita/link-tracciati/' }, { label: 'Annunci', text: 'Fai candidare i creator', href: '#/offerte-lavoro-influencer/' }, { label: 'Per le agenzie', text: 'Più campagne in parallelo', href: '#/piattaforma-agenzie/' }]} /> }),
    '/funzionalita/link-tracciati/': () => ({ meta: { path: p, label: 'Link tracciati', type: 'software', kw: 'link tracciati influencer', title: T('Link tracciati per misurare gli influencer'), description: 'Un link con UTM per ogni contenuto: click e visitatori unici, senza salvare IP e senza bot. 10 link gratis, illimitati con Premium.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Link tracciati' }], faq: FEATURE_FAQ.link }, el: <FeaturePage crumb="Link tracciati" eyebrow="Link tracciati" title={'Misura i risultati\n*di ogni influencer*'} lead="Link con UTM già inseriti per ogni contenuto, per bio, newsletter e QR. Click e visitatori unici in una pagina risultati." visual={<LinkMock className="mx-auto max-w-[500px]" />} answer={{ q: 'Come si misurano i risultati di una campagna con influencer?', a: FEATURE_FAQ.link[0].a }} items={[F.link]} faq={FEATURE_FAQ.link} related={[{ label: 'Gestione campagne', text: 'Dal brief al contratto', href: '#/funzionalita/gestione-campagne/' }, { label: 'Benchmark', text: 'Engagement di riferimento', href: '#/benchmark-engagement-rate/' }, { label: 'Prezzi', text: 'Link illimitati con Premium', href: '#/prezzi/' }]} /> }),
    '/funzionalita/media-kit/': () => ({ meta: { path: p, label: 'Media kit', type: 'software', kw: 'media kit influencer', title: T('Media kit influencer sempre aggiornato'), description: 'Il media kit del creator con numeri dagli account collegati, contenuti in vetrina e collaborazioni. PDF e link pubblico, gratis per i creator.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Media kit' }], faq: FEATURE_FAQ.kit }, el: <FeaturePage crumb="Media kit" eyebrow="Media kit" title={'Il media kit per influencer\n*che si aggiorna da solo*'} lead="Numeri dagli account collegati, contenuti in vetrina, collaborazioni e data dei dati sempre visibile. PDF e link pubblico." visual={<KitMock className="mx-auto max-w-[520px]" />} answer={{ q: 'Cos’è un media kit per influencer?', a: FEATURE_FAQ.kit[0].a }} items={[F.kit]} faq={FEATURE_FAQ.kit} related={[{ label: 'Diventa creator', text: 'Iscrizione gratuita', href: '#/diventa-creator/' }, { label: 'UGC creator', text: 'Cos’è e come diventarlo', href: '#/ugc-creator/' }, { label: 'Annunci', text: 'Candidati alle offerte', href: '#/offerte-lavoro-influencer/' }]} /> }),
    '/influencer-marketing-aziende/': () => ({ meta: { path: p, label: 'Per le aziende', type: 'software', kw: 'influencer marketing aziende', title: T('Influencer marketing per aziende'), description: 'Trova influencer italiani per il tuo brand, pubblica annunci e gestisci collaborazioni e risultati senza intermediari. Nessuna commissione per il brand.', crumbs: [{ label: 'Influencer marketing per aziende' }], faq: FAQ.brand }, el: <Brands /> }),
    '/piattaforma-agenzie/': () => ({ meta: { path: p, label: 'Per le agenzie', type: 'software', kw: 'piattaforma influencer marketing agenzie', title: T('Piattaforma per agenzie di influencer marketing'), description: 'Liste di creator per cliente, campagne parallele, contratti standard e link tracciati. La piattaforma per agenzie e centri media, senza commissioni.', crumbs: [{ label: 'Piattaforma per agenzie' }], faq: [FAQ.brand[0], FAQ.piattaforma[1], FAQ.piattaforma[2], FEATURE_FAQ.campagne[2]] }, el: <Agencies /> }),
    '/micro-influencer/': () => ({ meta: { path: p, label: 'Micro influencer', type: 'page', kw: 'micro influencer', title: T('Micro influencer: chi sono e come trovarli'), description: 'I micro influencer hanno 10–50 mila follower: costi accessibili e alto engagement. Cosa sono, quanto costano e come trovarli in Italia.', crumbs: [{ label: 'Micro influencer' }], faq: [{ q: 'Quanti follower deve avere un micro influencer?', a: 'Tra 10.000 e 50.000. Con meno di 10.000 follower si parla di nano influencer.' }, { q: 'I micro influencer funzionano per le piccole aziende?', a: 'Sì, soprattutto per attività locali e prodotti di nicchia: costano meno, parlano a community specifiche e permettono di testare più creator con lo stesso budget.' }, { q: 'Come contatto un micro influencer?', a: 'Su influencee lo inviti a una campagna o gli scrivi in chat dalla sua scheda; con Premium vedi anche i contatti dei creator che li hanno resi disponibili.' }, FAQ.brand[0]] }, el: <Micro /> }),
    '/diventa-creator/': () => ({ meta: { path: p, label: 'Diventa creator', type: 'page', kw: 'collaborazioni con brand', title: T('Collaborazioni con brand: iscriviti gratis'), description: 'Sei un creator o un influencer? Iscriviti gratis, collega i social e ricevi proposte dai brand italiani. Media kit, contratti e scadenze in un posto.', crumbs: [{ label: 'Diventa creator' }], faq: FAQ.creator }, el: <CreatorJoin /> }),
    '/ugc-creator/': () => ({ meta: { path: p, label: 'UGC creator', type: 'page', kw: 'ugc creator', title: T('UGC creator: cos’è e come diventarlo in Italia'), description: 'Cosa fa un UGC creator, differenza con l’influencer, quanto guadagna e come trovare brand che cercano UGC creator in Italia. Iscrizione gratuita.', crumbs: [{ label: 'UGC creator' }], faq: [{ q: 'Serve la partita IVA per fare l’UGC creator?', a: 'Dipende da quanto e con che continuità lavori: per collaborazioni occasionali può bastare la prestazione occasionale, per un’attività continuativa serve la partita IVA. Chiedi conferma al tuo commercialista. Su influencee puoi indicare la partita IVA nel profilo.' }, { q: 'Dove trovo brand che cercano UGC creator?', a: 'Nella bacheca annunci di influencee: i brand pubblicano offerte con compenso e scadenza e i creator iscritti si candidano.' }, FAQ.creator[1], FAQ.creator[0]] }, el: <Ugc /> }),
    '/offerte-lavoro-influencer/': () => ({ meta: { path: p, label: 'Offerte di lavoro', type: 'page', kw: 'offerte lavoro influencer', title: T('Offerte di lavoro per influencer e UGC creator'), description: 'Collaborazioni con i brand per influencer e UGC creator: offerte pagate, cambio merce e % sulle vendite. Cerca per settore e città e candidati gratis.', crumbs: [{ label: 'Creator' }, { label: 'Offerte di lavoro' }], faq: JOBS_FAQ }, el: <JobsPage /> }),
    '/pubblica-offerta-lavoro/': () => ({ meta: { path: p, label: 'Pubblica offerta', type: 'software', kw: 'annuncio per influencer', title: T('Pubblica un annuncio per influencer, gratis'), description: 'Pubblica gratis un’offerta di collaborazione per influencer e UGC creator italiani: compenso, cambio merce o % sulle vendite. Ti ricontattiamo noi.', crumbs: [{ label: 'Aziende' }, { label: 'Pubblica offerta' }], faq: POST_FAQ }, el: <PostJobPage /> }),
    '/preventivo-campagne/': () => ({ meta: { path: p, label: 'Campagna gestita', type: 'tool', kw: 'preventivo campagna influencer marketing', title: T('Preventivo campagna influencer marketing'), description: 'Quanto costa una campagna con influencer e UGC creator gestita dal team Influencee: 500 € a influencer al mese, 150 € a video UGC, sconti fino all’8%.', crumbs: [{ label: 'Soluzioni' }, { label: 'Campagna gestita' }], faq: GESTITO_FAQ }, el: <GestitoPage /> }),
    '/social-media-tool/': () => ({ meta: { path: p, label: 'Tool gratuiti', type: 'page', kw: 'tool influencer marketing', title: T('Tool influencer marketing gratuiti'), description: 'Tool gratuiti per influencer marketing: fake follower checker, calcolo engagement rate, costo influencer, preventivo campagna ed emoticon da copiare.', crumbs: [{ label: 'Risorse' }, { label: 'Tool gratuiti' }], faq: HUB_FAQ }, el: <ToolsHubPage /> }),
    '/followe-instagram-fake-follower/': () => ({ meta: { path: p, label: 'Fake follower', type: 'tool', kw: 'fake follower instagram', title: T('Fake follower Instagram: check gratuito e guida'), description: 'Controlla gratis i follower falsi di un profilo Instagram o TikTok: 5 segnali con soglie dichiarate, senza login. Più la guida per riconoscerli a mano.', crumbs: [{ label: 'Tool gratuiti', href: '#/social-media-tool/' }, { label: 'Fake follower' }], faq: FF_FAQ }, el: <FakeFollowerPage /> }),
    '/social-media-tool/emoticon-da-copiare/': () => ({ meta: { path: p, label: 'Emoticon da copiare', type: 'tool', kw: 'emoji da copiare', title: T('Emoticon ed emoji da copiare e incollare'), description: 'Emoji ed emoticon da copiare e incollare gratis: faccine, cuori, mani, cibo, viaggi e simboli. Un clic per copiare su Instagram, TikTok e WhatsApp.', crumbs: [{ label: 'Tool gratuiti', href: '#/social-media-tool/' }, { label: 'Emoticon da copiare' }], faq: EMOJI_FAQ }, el: <EmojiPage /> }),
    '/benchmark-engagement-rate/': () => ({ meta: { path: p, label: 'Benchmark', type: 'page', kw: 'engagement rate instagram', title: T('Engagement rate per fascia: i valori medi'), description: 'Valori di riferimento dell’engagement rate per fascia di follower e metodo di influencee. Benchmark pubblico gratuito, solo dati aggregati.', crumbs: [{ label: 'Benchmark engagement rate' }], faq: [{ q: 'Qual è un buon engagement rate su Instagram?', a: 'Dipende dalla fascia di follower e dalla categoria: i profili più piccoli hanno di solito valori più alti. Confronta il creator con la mediana della sua fascia invece che con un numero unico.' }, { q: 'Cos’è il check sponsor?', a: 'Uno strumento gratuito che divide le interazioni di un contenuto per le sue visualizzazioni. Sotto l’1,5% la reach arriva probabilmente da pubblicità; tra 1,9% e 2,7% è una media organica sana; sopra il 2,7% il contenuto va molto bene in modo organico.' }, { q: 'Il benchmark è gratuito?', a: 'Sì, il benchmark pubblico è consultabile senza registrazione. Mostra solo valori aggregati, mai dati di singoli creator.' }] }, el: <Benchmark /> }),
    '/prezzi/': () => ({ meta: { path: p, label: 'Prezzi', type: 'pricing', kw: 'prezzi piattaforma influencer', title: T('Prezzi: gratis o Premium da 19 € al mese'), description: `Piano gratuito per sempre e Premium da 19 € al mese, 49 € a trimestre o 199 € all’anno IVA inclusa. ${FACTS.trialDays} giorni di prova, nessuna carta.`, crumbs: [{ label: 'Prezzi' }], faq: [FAQ.brand[0]] }, el: <Pricing /> }),
    '/influencer-italiani/': () => ({ meta: { path: p, label: 'Influencer italiani', type: 'page', kw: 'influencer italiani', title: T('Influencer italiani: lista di creator per città'), description: 'La lista degli influencer e creator italiani per categoria, regione e città, in 5 fasce di follower. Trova il creator giusto per la tua campagna.', crumbs: [{ label: 'Influencer italiani' }], faq: [FAQ.piattaforma[3], FEATURE_FAQ.ricerca[0]] }, el: <ItaliansHub /> }),
    '/come-calcolare-engagement-rate/': () => ({ meta: { path: p, label: 'Calcolo engagement rate', type: 'tool', kw: 'engagement rate instagram', title: T('Engagement rate Instagram: come calcolarlo'), description: 'Come calcolare l’engagement rate: formula, calcolatore gratuito per Instagram e TikTok e confronto con la media della fascia. Con check sponsor dei reel.', crumbs: [{ label: 'Risorse' }, { label: 'Calcolo engagement rate' }], faq: CALC_FAQ }, el: <CalcPage /> }),
    '/social-media-tool/costo-influencer/': () => ({ meta: { path: p, label: 'Quanto costa un influencer', type: 'tool', kw: 'quanto costa un influencer', title: T('Quanto costa un influencer? Prezzi e calcolo'), description: 'Quanto costa un post di un influencer in Italia: nano circa 200 €, micro 950 €, mid 3.550 € (DeRev). Calcola la stima per Instagram e TikTok, gratis.', crumbs: [{ label: 'Tool gratuiti', href: '#/social-media-tool/' }, { label: 'Quanto costa un influencer' }], faq: COST_FAQ }, el: <CostPage /> }),
    '/contenuti-ugc/': () => ({ meta: { path: p, label: 'Contenuti UGC', type: 'software', kw: 'contenuti ugc', title: T('Contenuti UGC per brand: video dei creator'), description: 'Cosa sono i contenuti UGC e come ottenerli: creator italiani, brief, consegne e diritti d’uso nel contratto. Per i tuoi canali e le inserzioni.', crumbs: [{ label: 'Contenuti UGC' }], faq: UGC_FAQ }, el: <UgcBrandPage /> }),
    '/influencer-marketing-locale/': () => ({ meta: { path: p, label: 'Campagne locali', type: 'software', kw: 'influencer per ristoranti', title: T('Influencer per ristoranti, negozi ed eventi'), description: 'Campagne con creator della tua città per locali, negozi, palestre ed eventi: ospitalità o compenso, QR e link tracciati per misurare.', crumbs: [{ label: 'Campagne locali' }], faq: LOCAL_FAQ }, el: <LocalPage /> }),
    '/creator-professionisti/': () => ({ meta: { path: p, label: 'Creator professionisti', type: 'page', kw: 'medici influencer italiani', title: T('Creator professionisti: medici e nutrizionisti'), description: 'Medici, nutrizionisti, personal trainer e altri professionisti che fanno divulgazione: creator autorevoli per brand di salute, finanza e formazione.', crumbs: [{ label: 'Creator professionisti' }], faq: PRO_FAQ }, el: <ProPage /> }),
    '/creator-verificati/': () => ({ meta: { path: p, label: 'Creator verificati', type: 'software', kw: 'influencer verificati', title: T('Creator verificati e dati con la loro fonte'), description: 'Come verifichiamo i creator: badge da account collegato, livello di ogni dato e data di aggiornamento. Come riconoscere follower falsi.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Creator verificati' }], faq: TRUST_FAQ }, el: <TrustPage /> }),
    '/funzionalita/contratto-influencer/': () => ({ meta: { path: p, label: 'Contratto influencer', type: 'software', kw: 'contratto influencer', title: T('Contratto influencer generato dai termini'), description: 'Il contratto con il creator nasce dai termini accettati da entrambi: contenuti, scadenze, compenso e diritti d’uso. DOCX o PDF con impronta.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Contratto' }], faq: CONTRACT_FAQ }, el: <FeaturePage crumb="Contratto" eyebrow="Contratto" title={'Il contratto con l’influencer,\n*generato in automatico*'} lead="Termini in versioni, doppia accettazione e un contratto generato dalle condizioni concordate. Con valutazione reciproca a fine collaborazione." visual={<ContractMock className="mx-auto max-w-[500px]" />} answer={{ q: 'Cosa deve contenere un contratto con un influencer?', a: CONTRACT_FAQ[0].a, points: ['Contenuti e scadenze', 'Compenso e formula', 'Diritti d’uso e durata', 'Versione accettata da entrambi'] }} items={[{ eyebrow: 'Contratto', title: 'Dai termini al documento', text: 'Quando brand e creator accettano la stessa versione dei termini, la piattaforma genera il contratto con parti, contenuti, scadenze, compenso e diritti d’uso, e ne registra l’impronta.', bullets: ['DOCX, PDF quando disponibile', 'Impronta del documento', 'Sempre legato alla collaborazione'], visual: <ContractMock /> }, F.campagne]} faq={CONTRACT_FAQ} related={[{ label: 'Calendario', text: 'Scadenze e consegne', href: '#/funzionalita/calendario-campagne/' }, { label: 'Contenuti UGC', text: 'Diritti d’uso per le ads', href: '#/contenuti-ugc/' }, { label: 'Quanto costa', text: 'Formule di compenso', href: '#/social-media-tool/costo-influencer/' }]} /> }),
    '/funzionalita/calendario-campagne/': () => ({ meta: { path: p, label: 'Calendario campagne', type: 'software', kw: 'calendario campagne influencer', title: T('Calendario campagne influencer e scadenze'), description: 'Tutte le scadenze delle collaborazioni in un calendario: consegne, revisioni, pubblicazioni e contenuti in ritardo, per brand e creator.', crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Calendario campagne' }], faq: CAL_FAQ }, el: <FeaturePage crumb="Calendario campagne" eyebrow="Calendario" title={'Il calendario delle campagne\n*con gli influencer*'} lead="Consegne, revisioni e pubblicazioni di tutti i creator in una vista a calendario o a lista, con le consegne in ritardo in evidenza." visual={<CalendarMock className="mx-auto max-w-[480px]" />} answer={{ q: 'Come si organizza una campagna con più influencer?', a: CAL_FAQ[0].a, points: ['Vista calendario o lista', 'Stato di ogni contenuto', 'Etichetta "In ritardo"', 'Chat con ogni creator'] }} items={[{ eyebrow: 'Calendario', title: 'Tutte le scadenze in una vista', text: 'Ogni collaborazione porta in calendario le sue date: brief, consegne, revisioni e pubblicazione. Passa dalla vista mensile alla lista quando gestisci molte campagne insieme.', bullets: ['Campagne e scadenze insieme', 'Vista per periodo', 'Anche per i creator'], visual: <CalendarMock /> }, { ...F.campagne, title: 'Consegne, modifiche e approvazioni' }, F.link]} faq={CAL_FAQ} related={[{ label: 'Contratto', text: 'Termini e documento', href: '#/funzionalita/contratto-influencer/' }, { label: 'Per le agenzie', text: 'Più campagne in parallelo', href: '#/piattaforma-agenzie/' }, { label: 'Link tracciati', text: 'Misura i risultati', href: '#/funzionalita/link-tracciati/' }]} /> }),
    '/contatti-influencee/': () => ({ meta: { path: p, label: 'Contatti', type: 'page', kw: 'contatti influencee', title: T('Contatti'), description: 'Scrivi al team di influencee per una demo con il tuo settore o per aiuto con la piattaforma.', crumbs: [{ label: 'Contatti' }] }, el: <Contacts /> }),
    '/blog/': () => ({ meta: { path: p, label: 'Blog', type: 'page', kw: 'blog influencer marketing', title: T('Blog di influencer marketing'), description: 'Guide pratiche di influencer marketing per brand e creator: engagement, campagne, strumenti social.', crumbs: [{ label: 'Blog' }] }, el: <Blog /> }),
  };
  // Alias (in produzione: 301). /annunci-collaborazioni/ era una pagina nuova, accorpata alla bacheca indicizzata.
  const alias: Record<string, string> = { '/annunci-collaborazioni/': '/offerte-lavoro-influencer/', '/preventivi-influencer/': '/preventivo-campagne/', '/contatti/': '/contatti-influencee/' };
  if (alias[p]) return fixed[alias[p]]();
  if (fixed[p]) return withLead(fixed[p]());

  // Pagine per categoria: /<slug>/
  const cat = seg.length === 1 ? (CATEGORIES.find((k) => k.slug === seg[0]) ?? SUBCATEGORIES.find((k) => k.slug === seg[0])) : undefined;
  const catParent = cat && 'parent' in cat ? CATEGORIES.find((k) => k.slug === (cat as { parent: string }).parent) : undefined;
  if (cat)
    return {
      meta: { path: p, label: `${cat.short} influencer`, type: 'page', kw: cat.kw, title: T(cat.title ?? `${cat.short} influencer italiani`), description: `${cat.lead} Trova ${cat.short.toLowerCase()} influencer italiani per città e fascia di follower e lancia la tua campagna.`.slice(0, 155), crumbs: [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, ...(catParent ? [{ label: `${catParent.short} influencer`, href: `#/${catParent.slug}/` }] : []), { label: `${cat.short} influencer` }], faq: catFaq(cat) },
      el: <CategoryPage slug={cat.slug} />,
    };

  // Regioni e città: /influencer-italiani/influencer-<regione>/[influencer-<città>/]
  if (seg[0] === 'influencer-italiani' && seg[1]?.startsWith('influencer-')) {
    const r = REGIONS.find((x) => x.slug === seg[1].replace('influencer-', ''));
    if (!r) return null;
    if (seg[2]) {
      const ct = r.cities.find((x) => (x.seg ?? `influencer-${x.slug}`) === seg[2]);
      if (!ct) return null;
      return { meta: { path: p, label: `Influencer ${ct.name}`, type: 'page', kw: `influencer ${ct.name.toLowerCase()}`, title: fit([...(ct.demonym ? [`Influencer ${ct.demonym}: creator di ${ct.name}`] : []), `Influencer ${ct.name}: creator per campagne locali`, `Influencer ${ct.name}: creator locali`, `Influencer ${ct.name}`]), description: `${ct.demonym ? `Influencer ${ct.demonym} e ` : 'Influencer e '}content creator di ${ct.name}: profili per categoria, per campagne locali con ristoranti, negozi, palestre ed eventi.`.slice(0, 155), crumbs: [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `Influencer ${r.name}`, href: `#/influencer-italiani/influencer-${r.slug}/` }, { label: `Influencer ${ct.name}` }], faq: placeFaq(ct.name) }, el: <RegionPage region={r.slug} city={ct.slug} /> };
    }
    return { meta: { path: p, label: `Influencer ${r.name}`, type: 'page', kw: `influencer ${r.name.toLowerCase()}`, title: fit([...(r.demonym ? [`Influencer ${r.demonym}: creator in ${r.name}`] : []), `Influencer ${r.name}: creator per città`, `Influencer ${r.name}: creator`, `Influencer ${r.name}`]), description: `Influencer e content creator in ${r.name} per campagne locali. Cerca per città, categoria e fascia di follower.`, crumbs: [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: `Influencer ${r.name}` }], faq: placeFaq(r.name) }, el: <RegionPage region={r.slug} /> };
  }
  return null;
}

/** Elenco di tutte le route (sitemap e test). */
export function allPaths() {
  const out = ['/', '/piattaforma-influencer/', '/funzionalita/database-influencer/', '/funzionalita/gestione-campagne/', '/funzionalita/link-tracciati/', '/funzionalita/media-kit/', '/influencer-marketing-aziende/', '/piattaforma-agenzie/', '/micro-influencer/', '/diventa-creator/', '/ugc-creator/', '/offerte-lavoro-influencer/', '/pubblica-offerta-lavoro/', '/preventivo-campagne/', '/social-media-tool/', '/followe-instagram-fake-follower/', '/social-media-tool/emoticon-da-copiare/', '/benchmark-engagement-rate/', '/prezzi/', '/influencer-italiani/', '/contatti-influencee/', '/blog/', '/come-calcolare-engagement-rate/', '/social-media-tool/costo-influencer/', '/contenuti-ugc/', '/influencer-marketing-locale/', '/creator-professionisti/', '/creator-verificati/', '/funzionalita/contratto-influencer/', '/funzionalita/calendario-campagne/'];
  CATEGORIES.forEach((k) => out.push(`/${k.slug}/`));
  SUBCATEGORIES.forEach((k) => out.push(`/${k.slug}/`));
  REGIONS.forEach((r) => {
    out.push(regionPath(r));
    r.cities.forEach((ct) => out.push(cityPath(r, ct)));
  });
  return out;
}
