import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Briefcase, MessageCircle, UserPlus } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { WorkReelCard } from '../../rows/reels';
import { REELS } from '../../site/data';
import { APP, FAQ, WHATSAPP, type QA } from '../data';
import { AnnunciMock, CalendarMock, CollabMock, ContractMock, KitMock } from '../mocks';
import { AnswerBox, CardGrid, CtaBandV2, FaqSeo, FeatureSplit, HeroPlatform, Related, Steps } from '../rows';
import { ToolLead } from '../tools';
import type { ExPage } from './types';

/* /influencer/ — ex Elementor «piattaforma per creator» (copia del 22/10/2026), stesso URL.
   Intento: la piattaforma per i creator che vogliono lavorare con brand e agenzie (come funziona,
   cosa trovi dentro). /diventa-creator/ resta la pagina dell'iscrizione (4 passi, tipi di creator):
   qui si collega, non si duplica. Tolti: «brand verificati», «pagamenti sicuri e puntuali»,
   «migliaia di creator», Academy & Consulenza Creator Upgrade (in pausa). */

const FAQ_INFLUENCER: QA[] = [
  { q: 'Cos’è una piattaforma per influencer e creator?', a: 'È uno strumento dove i creator si fanno trovare dai brand e gestiscono le collaborazioni: profilo con i numeri dei social, proposte e annunci, termini concordati, consegne e scadenze. Su Influencee è gratuita per i creator e contiene solo creator italiani.' },
  FAQ.creator[0],
  FAQ.creator[1],
  { q: 'Come si lavora con brand e agenzie su Influencee?', a: 'I brand e le agenzie ti trovano nella ricerca e ti invitano a una campagna, oppure ti candidi agli annunci della bacheca. Brief, termini, consegne e scadenze stanno nella collaborazione e il contratto viene generato dalle condizioni che avete accettato entrambi.' },
  { q: 'Come viene concordato il compenso?', a: 'Nei termini della collaborazione: compenso in denaro, cambio merce, affiliazione, formula ibrida, ospitalità o evento. Puoi fare una controproposta e la collaborazione parte solo quando tu e il brand accettate la stessa versione.' },
  FAQ.creator[2],
];

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

/** «Pronto a iniziare?»: i tre percorsi della vecchia pagina, come card con icona. */
function PathCards() {
  const paths = [
    { icon: UserPlus, tag: 'Gratis', t: 'Iscriviti come creator', x: 'Crea il profilo, collega i social e renditi visibile ai brand che cercano creator come te.', href: APP.creator, cta: 'Iscriviti gratis', style: 'bg-acid text-ink' },
    { icon: Briefcase, tag: 'Bacheca', t: 'Sfoglia le offerte di lavoro', x: 'Le collaborazioni pubblicate dai brand: pagate, cambio merce o percentuale sulle vendite. Candidati a quelle giuste per te.', href: '#/offerte-lavoro-influencer/', cta: 'Vedi le offerte', style: 'bg-ink text-white' },
    { icon: MessageCircle, tag: 'Supporto', t: 'Hai delle domande?', x: 'Scrivici su WhatsApp: ti risponde una persona del team, anche per aiutarti a completare il profilo.', href: WHATSAPP.href, cta: 'Scrivici su WhatsApp', style: 'bg-white text-ink ring-1 ring-line' },
  ];
  return (
    <Section tone="paper">
      <Container>
        <SectionHeader eyebrow="Pronto a iniziare?" title={'Scegli il percorso\n*più adatto a te*'} lead="Iscriviti per ricevere proposte, oppure esplora la bacheca e candidati in autonomia." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} md:grid-cols-3`}>
          {paths.map((p, i) => (
            <motion.a key={p.t} href={p.href} {...reveal(i)} className={`group flex min-h-[280px] flex-col justify-between rounded-3xl p-7 transition hover:-translate-y-1 ${p.style}`}>
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${i === 1 ? 'bg-acid text-ink' : 'bg-ink text-white'}`}>
                  <p.icon className="h-5 w-5" />
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 1 ? 'bg-white/10 text-white' : 'bg-brand text-white'}`}>{p.tag}</span>
              </div>
              <div className="mt-10">
                <p className={TYPE.h3}>{p.t}</p>
                <p className={`mt-2 text-sm leading-relaxed ${i === 1 ? 'text-white/65' : 'opacity-75'}`}>{p.x}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {p.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function InfluencerPage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Per i creator' }]}
        eyebrow="Sei un influencer, UGC o content creator?"
        title={'Collabora con *brand e agenzie*\ne fai della passione un lavoro'}
        lead="La piattaforma per creator italiani: un profilo con i tuoi numeri, proposte dai brand, annunci a cui candidarti e collaborazioni gestite dal brief al contratto. Tutto in un unico posto, gratis."
        actions={
          <>
            <Button href={APP.creator}>Iscriviti gratis</Button>
            <Button href="#/offerte-lavoro-influencer/" variant="secondary">
              Sfoglia le offerte
            </Button>
          </>
        }
        visual={<CollabMock className="mx-auto max-w-[500px]" />}
        note="Gratis per i creator · nessun minimo di follower · solo creator italiani"
      />
      <AnswerBox
        q="Come funziona la piattaforma per creator?"
        a="Ti iscrivi gratis, colleghi i social in sola lettura e completi il profilo con categorie, città e prezzi indicativi. I brand e le agenzie ti trovano nella ricerca e ti invitano alle campagne, oppure ti candidi agli annunci. Brief, termini, consegne e contratto restano nella collaborazione: niente email a freddo né trattative sparse."
        points={['Profilo e media kit gratis', 'Proposte dai brand', 'Annunci a cui candidarti', 'Contratto dai termini accettati']}
      />
      <Steps
        title={'Dal profilo alla collaborazione\n*in 4 passi*'}
        lead="Un percorso semplice e trasparente per entrare in contatto con le aziende."
        steps={[
          { t: 'Crea il profilo', x: 'Chi sei, la tua nicchia, i tuoi social e i contenuti migliori in vetrina.' },
          { t: 'Fatti trovare', x: 'Brand e agenzie cercano creator per categoria, città e fascia di follower.' },
          { t: 'Ricevi proposte', x: 'Inviti alle campagne o candidature agli annunci: valuti, negozi, accetti.' },
          { t: 'Lavora in ordine', x: 'Brief, termini, consegne, scadenze e chat in un unico posto.' },
        ]}
        action={<Button href="#/diventa-creator/" variant="secondary">Come iscriversi, passo per passo</Button>}
      />
      <FeatureSplit
        tone="white"
        eyebrow="Cosa trovi dentro"
        title={'Gli strumenti per lavorare\n*con i brand*'}
        items={[
          { eyebrow: 'Profilo e media kit', title: 'Il media kit che si aggiorna da solo', text: 'I tuoi numeri arrivano dagli account collegati, con la data dell’ultimo aggiornamento sempre visibile. Scegli i contenuti in vetrina e condividi il media kit con un link o in PDF.', bullets: ['Badge Verificato collegando un social', 'Contenuti e collaborazioni in vetrina', 'PDF e link pubblico, solo se lo attivi tu'], visual: <KitMock />, href: '#/funzionalita/media-kit/', cta: 'Scopri il media kit' },
          { eyebrow: 'Offerte di lavoro', title: 'Una bacheca di offerte sempre aperta', text: 'Le aziende pubblicano annunci con cosa cercano, il compenso e la scadenza. Ti candidi dall’app con il tuo profilo e il brand vede subito i tuoi numeri.', bullets: ['Collaborazioni pagate, cambio merce, % sulle vendite', 'Candidature gratuite', 'Filtri per categoria e città'], visual: <AnnunciMock />, href: '#/offerte-lavoro-influencer/', cta: 'Vedi le offerte aperte' },
          { eyebrow: 'Chiarezza prima di tutto', title: 'Brief chiari, zero incomprensioni', text: 'Obiettivi, contenuti richiesti, compenso e scadenze sono scritti nei termini della collaborazione. Ogni controproposta crea una nuova versione e si parte solo quando tu e il brand accettate la stessa: il contratto nasce da lì.', bullets: ['Termini in versioni, doppia accettazione', 'Consegne e richieste di modifica', 'Contratto generato e valutazione finale'], visual: <ContractMock />, href: '#/funzionalita/contratto-influencer/', cta: 'Come funziona il contratto' },
          { eyebrow: 'Calendario', title: 'Tutte le scadenze sotto controllo', text: 'Consegne, revisioni e pubblicazioni di tutte le tue collaborazioni in un calendario, con le consegne in ritardo in evidenza e la chat con ogni brand.', bullets: ['Vista calendario o lista', 'Stato di ogni contenuto', 'Chat diretta con le aziende'], visual: <CalendarMock /> },
        ]}
      />
      <CardGrid
        tone="paper"
        eyebrow="Cresci con noi"
        title={'I vantaggi di entrare\n*nella community di Influencee*'}
        lead="Gli strumenti e le opportunità per fare il prossimo passo da creator, che tu sia nano, micro o macro."
        items={[
          { tag: 'Gratis', t: 'Iscrizione gratuita', x: 'Profilo, media kit, candidature e collaborazioni non costano nulla al creator.' },
          { tag: 'Visibilità', t: 'Visibile a brand e agenzie', x: 'Le aziende ti trovano filtrando per categoria, città, fascia di follower e tipo di creator.' },
          { tag: 'Fiducia', t: 'Numeri verificati', x: 'Colleghi Instagram, TikTok o YouTube in sola lettura: nessuna pubblicazione a tuo nome.' },
          { tag: 'Accordi', t: 'Termini scritti', x: 'Compenso, contenuti e diritti d’uso concordati per iscritto, prima di iniziare.' },
          { tag: 'Bacheca', t: 'Offerte sempre aggiornate', x: 'Candidati agli annunci dei brand oppure ricevi gli avvisi della tua categoria.' },
          { tag: 'Chat', t: 'Contatto diretto', x: 'Parli con l’azienda nella chat della collaborazione, senza intermediari.' },
        ]}
      />
      <FeatureSplit
        tone="white"
        items={[
          { eyebrow: 'Specializzato in UGC?', title: 'Monetizza i tuoi contenuti UGC', text: 'I brand cercano contenuti autentici da pubblicare sui loro canali e nelle inserzioni. Se ami girare video e foto spontanee, proponiti come UGC creator: conta la qualità del contenuto, non il numero di follower.', bullets: ['Non servono migliaia di follower', 'Lavori con flessibilità, contenuto per contenuto', 'Richieste precise dai brand, diritti d’uso nei termini'], visual: <ReelTrio ids={['beauty-body-project', 'food-salse-zero', 'casa-legno']} />, href: '#/ugc-creator/', cta: 'UGC creator: cos’è e come diventarlo' },
        ]}
      />
      <PathCards />
      <ToolLead tool="creator_avvisi" context="Pagina: Influencer (piattaforma per creator)" tone="white" eyebrow="Avvisi gratuiti" title={'Ricevi le offerte\n*della tua categoria*'} lead="Lasciaci email e categoria: ti scriviamo quando un brand cerca creator come te." bullets={['Solo offerte della tua categoria', 'Iscrizione gratuita', 'Ti cancelli quando vuoi']} cta="Avvisami" phone="no" withCategory />
      <FaqSeo items={FAQ_INFLUENCER} />
      <Related
        tone="white"
        links={[
          { label: 'Diventa creator', text: 'L’iscrizione in 4 passi e i tipi di creator', href: '#/diventa-creator/' },
          { label: 'UGC creator', text: 'Lavorare con i brand senza tanti follower', href: '#/ugc-creator/' },
          { label: 'Quanto chiedere a un brand', text: 'Calcola il costo di un contenuto', href: '#/social-media-tool/costo-influencer/' },
          { label: 'Academy gratuita', text: 'Guide e tool per crescere da creator', href: '#/academy-influencer-marketing/' },
        ]}
      />
      <CtaBandV2 tone="soft" title={'La tua prossima collaborazione\n*inizia da qui*'} lead="Iscrizione gratuita, pochi minuti, nessuna password: accedi con Google o con un link via email." primary={{ label: 'Iscriviti gratis', href: APP.creator }} secondary={{ label: 'Sfoglia le offerte', href: '#/offerte-lavoro-influencer/' }} />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/influencer/',
  ready: true,
  titles: ['Piattaforma per influencer e creator', 'Piattaforma per creator'],
  meta: {
    label: 'Piattaforma per creator',
    type: 'page',
    kw: 'piattaforma per influencer',
    description: 'Piattaforma gratuita per influencer, UGC e content creator italiani: fatti trovare da brand e agenzie, candidati alle offerte e gestisci le collaborazioni.',
    crumbs: [{ label: 'Per i creator' }],
    faq: FAQ_INFLUENCER,
  },
  el: () => <InfluencerPage />,
};
