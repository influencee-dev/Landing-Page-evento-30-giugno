import React from 'react';
import { BadgeCheck, Bookmark, MessageCircle, RefreshCw, Star } from 'lucide-react';
import { Button } from '../../ds';
import { AnswerBox, CardGrid, CtaBandV2, FaqSeo, FeatureSplit, HeroPlatform, ManagedRow, Related, Steps } from '../rows';
import { CalendarMock, CollabMock, Initials, KitMock, LinkMock, ProfileMock, SearchMock } from '../mocks';
import { APP, FACTS, FAQ as FAQ_DATA, type QA } from '../data';
import type { ExPage } from './types';

/* /creator-manager/ — pagina ex Elementor (testo originale: copia del 22/10/2026).
   La vecchia pagina prometteva un "CRM privato" con creator aggiunti a mano, note private, documenti
   amministrativi (contratti, fatture) e compensi totali per creator: l'app non ha queste funzioni.
   Riscritta sulle funzioni reali: liste salvate, preferiti, scheda creator, chat, collaborazioni con
   termini e contratto, calendario, media kit, link tracciati, export CSV. */

/** Il "CRM" ricostruito con le funzioni reali: liste salvate, preferiti e stato delle collaborazioni. */
function CrmMock({ className = '' }: { className?: string }) {
  const lists: [string, string, boolean][] = [
    ['Food Bologna · cliente A', '12', true],
    ['Fitness Milano · cliente B', '8', false],
    ['Preferiti', '15', false],
  ];
  const rows: [string, string, string, string][] = [
    ['Marta Lombardi', 'Food · Micro', 'Collaborazione attiva', 'bg-acid text-ink'],
    ['Luca Ferri', 'Fitness · Mid', 'Consegna il 18/11', 'bg-brand text-white'],
    ['Sara Conte', 'Beauty · Micro', 'Contratto generato', 'bg-ink text-white'],
    ['Davide Greco', 'Viaggi · Nano', 'Invitato in chat', 'bg-paper text-ink'],
  ];
  return (
    <div className={`overflow-hidden rounded-[22px] bg-white text-left text-ink shadow-float ring-1 ring-line ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 truncate rounded-full bg-paper px-3 py-0.5 text-[10px] text-mute">I tuoi creator</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr]">
        <div className="border-b border-line p-3 sm:border-b-0 sm:border-r">
          <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-mute">Liste salvate</p>
          <div className="mt-2 space-y-1">
            {lists.map(([l, n, on], i) => (
              <div key={l} className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-[11px] ${on ? 'bg-ink text-white' : 'bg-paper'}`}>
                {i === 2 ? <Star className="h-3.5 w-3.5 flex-none fill-acid text-acid" /> : <Bookmark className={`h-3.5 w-3.5 flex-none ${on ? 'text-acid' : 'text-mute'}`} />}
                <span className="flex-1 truncate font-semibold">{l}</span>
                <span className={on ? 'text-white/60' : 'text-mute'}>{n}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1 px-1 text-[9px] text-mute">
            <RefreshCw className="h-3 w-3" /> La lista si aggiorna da sola
          </p>
        </div>
        <div className="p-3 sm:p-4">
          <div className="space-y-2">
            {rows.map(([n, c, s, cls], i) => (
              <div key={n} className="flex items-center gap-2.5 rounded-2xl bg-paper/70 px-2.5 py-2">
                <Initials name={n} i={i} className="h-8 w-8 text-[10px]" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 truncate text-[12px] font-semibold">
                    {n} {i !== 2 && <BadgeCheck className="h-3.5 w-3.5 flex-none fill-brand text-white" />}
                  </p>
                  <p className="text-[10px] text-mute">{c}</p>
                </div>
                <span className={`hidden rounded-full px-2 py-1 text-[9px] font-semibold min-[400px]:inline ${cls}`}>{s}</span>
                <MessageCircle className="h-3.5 w-3.5 flex-none text-mute" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ: QA[] = [
  { q: 'Che cosa fa un CRM per influencer?', a: 'Tiene in ordine le relazioni con i creator: chi hai già trovato, con chi stai trattando, con chi hai collaborato e con quali risultati. Su influencee lo fai con liste salvate e preferiti, la scheda di ogni creator, la chat e lo storico delle collaborazioni con termini, consegne, contratto e link tracciati.' },
  { q: 'Meglio un CRM generico o uno pensato per i creator?', a: 'I CRM generici come Salesforce o HubSpot gestiscono clienti e trattative commerciali, ma non conoscono follower, engagement, contenuti o diritti d’uso. Uno strumento verticale ti mostra i numeri del creator con la loro fonte e tiene insieme brief, termini, consegne e contratto di ogni collaborazione.' },
  { q: 'Posso aggiungere a mano un creator che non è su influencee?', a: 'No: nel creator manager trovi i creator italiani iscritti alla piattaforma, così i numeri sono verificabili e collaborazione e contratto restano in un unico posto. Se un creator con cui lavori non c’è ancora, può iscriversi gratis e collegare i suoi social.' },
  { q: 'Le liste salvate si aggiornano da sole?', a: 'Sì: salvi una ricerca con i suoi filtri (categoria, città, fascia di follower, tipo di creator, piattaforma) e la lista include anche i nuovi creator che entrano e rispondono a quei filtri.' },
  { q: 'Posso esportare i miei creator?', a: 'Sì, con Premium puoi esportare in CSV i risultati delle ricerche.' },
  FAQ_DATA.brand[0],
];

function CreatorManagerPage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Creator manager' }]}
        eyebrow="Creator manager"
        title={'Creator manager:\n*il CRM dei tuoi creator*'}
        lead="Liste salvate, preferiti, chat, collaborazioni, scadenze e risultati di ogni creator in un unico posto. La tua rete di influencer italiani, senza fogli di calcolo e chat sparse."
        actions={
          <>
            <Button href={APP.brand}>Prova gratis {FACTS.trialDays} giorni</Button>
            <Button href="#/piattaforma-agenzie/" variant="secondary">Sei un’agenzia?</Button>
          </>
        }
        visual={<CrmMock className="mx-auto max-w-[540px]" />}
      />
      <AnswerBox q="Cos’è un creator manager?" a="È lo strumento con cui un brand o un’agenzia gestisce la propria rete di creator: li trova, li raccoglie in liste, li contatta, segue le collaborazioni e ne confronta i risultati. Su influencee non è un archivio separato: liste, chat, collaborazioni, contratti e link tracciati sono collegati alla scheda di ogni creator." points={['Liste salvate e preferiti', 'Chat con i creator', 'Storico delle collaborazioni', 'Click di ogni contenuto']} />
      <Steps title={'Dalla ricerca\n*alla tua rete di creator*'} lead="Ogni passaggio resta collegato al creator, così ritrovi tutto quando lavori di nuovo con lui." steps={[
        { t: 'Trova', x: 'Filtri per categoria, città, fascia di follower, tipo e piattaforma.' },
        { t: 'Organizza', x: 'Salva la ricerca come lista per ogni cliente e segna i preferiti.' },
        { t: 'Collabora', x: 'Chat, invito alla campagna, termini accettati e contratto generato.' },
        { t: 'Misura', x: 'Link tracciati e pagina risultati per ogni collaborazione.' },
      ]} />
      <FeatureSplit tone="paper" items={[
        { eyebrow: 'Liste salvate e preferiti', title: 'Una lista per ogni cliente, sempre aggiornata', text: 'Salvi una ricerca con i suoi filtri e la lista si aggiorna da sola quando entrano nuovi creator. I profili che vuoi tenere a portata di mano li segni come preferiti.', bullets: ['Vista a riquadri, tabella o mappa', 'Liste per cliente o per campagna', 'Export CSV con Premium'], visual: <SearchMock />, href: '#/funzionalita/database-influencer/', cta: 'Come funziona la ricerca' },
        { eyebrow: 'Scheda creator', title: 'Tutto quello che serve per scegliere', text: 'Per ogni piattaforma: follower, engagement rispetto alla fascia, crescita a 30 e 90 giorni, contenuti recenti e brand citati con #adv. Ogni dato dice da dove arriva e quando è stato aggiornato.', bullets: ['Badge Verificato da account collegato', 'Prezzi indicativi dichiarati dal creator', 'Contatti solo se il creator è contattabile'], visual: <ProfileMock />, href: '#/creator-verificati/', cta: 'Come verifichiamo i creator' },
        { eyebrow: 'Storico delle collaborazioni', title: 'Termini, consegne e contratto nella collaborazione', text: 'Brief, termini in versioni, consegne, richieste di modifica e approvazioni stanno nella collaborazione. Quando entrambi accettano la stessa versione dei termini il contratto si genera da solo, e a fine lavoro vi valutate a vicenda.', bullets: ['Doppia accettazione dei termini', 'Contratto generato', 'Valutazione a fine collaborazione'], visual: <CollabMock />, href: '#/funzionalita/gestione-campagne/', cta: 'Scopri la gestione campagne' },
        { eyebrow: 'Calendario', title: 'Le scadenze di tutti i creator in una vista', text: 'Consegne, revisioni e pubblicazioni di tutte le collaborazioni in un calendario o in una lista, con le consegne in ritardo in evidenza.', bullets: ['Vista calendario o lista', 'Etichetta "In ritardo"', 'Chat con ogni creator'], visual: <CalendarMock />, href: '#/funzionalita/calendario-campagne/', cta: 'Scopri il calendario' },
        { eyebrow: 'Link tracciati', title: 'Sai quali creator portano click', text: 'Ogni contenuto ha il suo link con i parametri UTM già inseriti: click e visitatori unici per collaborazione, senza salvare indirizzi IP e con i bot esclusi. Così scegli con chi lavorare di nuovo.', bullets: [`${FACTS.freeLinks} link attivi gratis, illimitati con Premium`, 'QR scaricabile', 'Pagina risultati per ogni collaborazione'], visual: <LinkMock />, href: '#/funzionalita/link-tracciati/', cta: 'Scopri i link tracciati' },
      ]} />
      <CardGrid tone="white" eyebrow="Per chi lavora con molti creator" title={'Perché non basta\n*un foglio di calcolo*'} items={[
        { t: 'Numeri che invecchiano', x: 'Nel foglio i follower restano quelli del giorno in cui li hai copiati. In piattaforma ogni dato ha la sua data di aggiornamento.' },
        { t: 'Trattative nelle email', x: 'Le condizioni finiscono in chat diverse. Qui ogni controproposta è una versione dei termini, con doppia accettazione.' },
        { t: 'Contratti da riscrivere', x: 'Il contratto si genera dai termini accettati, ogni volta con la stessa struttura.' },
        { t: 'Risultati a screenshot', x: 'I click arrivano dai link tracciati, non dagli screenshot degli insight mandati dal creator.' },
        { t: 'Un cliente, una lista', x: 'Liste salvate per cliente o per campagna, che si aggiornano quando entrano nuovi creator.' },
        { t: 'Media kit sempre attuale', x: 'Il creator ha un media kit con i numeri degli account collegati, in PDF o con link pubblico.' },
      ]} />
      <FeatureSplit tone="paper" items={[{ eyebrow: 'Media kit', title: 'Il media kit di ogni creator, aggiornato', text: 'Ogni creator ha un media kit con i numeri dei suoi account, i contenuti in vetrina e le collaborazioni, con la data dei dati sempre visibile. Si scarica in PDF o si condivide con un link pubblico.', bullets: ['Numeri presi dagli account collegati', 'Contenuti in vetrina scelti dal creator', 'Link pubblico solo con il consenso del creator'], visual: <KitMock />, href: '#/funzionalita/media-kit/', cta: 'Scopri il media kit' }]} />
      <ManagedRow />
      <FaqSeo items={FAQ} />
      <Related links={[
        { label: 'Piattaforma per agenzie', text: 'Più clienti e campagne in parallelo', href: '#/piattaforma-agenzie/' },
        { label: 'Database influencer', text: 'Filtri e liste salvate', href: '#/funzionalita/database-influencer/' },
        { label: 'Gestione campagne', text: 'Dal brief al contratto', href: '#/funzionalita/gestione-campagne/' },
        { label: 'Contratti e pagamenti', text: 'Compensi concordati nei termini', href: '#/amministrazione-pagamenti-influencer/' },
      ]} />
      <CtaBandV2 title={'Costruisci la tua rete\n*di creator italiani*'} lead={`${FACTS.trialDays} giorni di Premium gratis, senza carta. Nessuna commissione sulle collaborazioni.`} primary={{ label: 'Registra la tua azienda', href: APP.brand }} secondary={{ label: 'Vedi i prezzi', href: '#/prezzi/' }} />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/creator-manager/',
  ready: true,
  titles: ['Creator manager: il CRM per gestire i creator', 'Creator manager: CRM per influencer', 'Creator manager'],
  meta: {
    label: 'Creator manager',
    type: 'software',
    kw: 'crm influencer',
    description: 'Gestisci la tua rete di influencer italiani: liste salvate, preferiti, chat, collaborazioni, contratti, scadenze e click di ogni creator in un unico posto.',
    crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Creator manager' }],
    faq: FAQ,
  },
  el: () => <CreatorManagerPage />,
};
