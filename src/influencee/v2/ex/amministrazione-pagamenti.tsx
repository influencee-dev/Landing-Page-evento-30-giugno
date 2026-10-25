import React from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import { Button } from '../../ds';
import { AnswerBox, CardGrid, CtaBandV2, FaqSeo, FeatureSplit, HeroPlatform, ManagedRow, Related, Steps } from '../rows';
import { CalendarMock, CollabMock, ContractMock, LinkMock } from '../mocks';
import { APP, FACTS, WHATSAPP, type QA } from '../data';
import type { ExPage } from './types';

/* /amministrazione-pagamenti-influencer/ — pagina ex Elementor (testo originale: copia del 22/10/2026).
   DECISIONE: l'app NON gestisce pagamenti ai creator, fatture, ritenute, firma digitale né un riepilogo
   economico per campagna (in data.ts/pages.tsx: "il compenso del creator si concorda nella collaborazione",
   nessuna commissione per il brand). La pagina quindi non promette pagamenti in piattaforma: parla di
   compenso concordato nei termini (denaro, cambio merce, % sulle vendite…), contratto generato, consegne e
   scadenze, e di come pagare un creator in modo corretto fuori dalla piattaforma. Chi vuole delegare →
   servizio gestito (/agenzia-influencer/). Stesso intento ("contratti e pagamenti influencer"). */

/** I termini della collaborazione: forma del compenso e condizioni accettate da entrambi. */
function TermsMock({ className = '' }: { className?: string }) {
  const forms = ['Denaro', 'Cambio merce', '% sulle vendite', 'Ibrida', 'Ospitalità'];
  return (
    <div className={`overflow-hidden rounded-[22px] bg-white text-left text-ink shadow-float ring-1 ring-line ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 truncate rounded-full bg-paper px-3 py-0.5 text-[10px] text-mute">Termini della collaborazione</span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading font-semibold">Lancio menu autunno</p>
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-brand-ink">Termini v3</span>
        </div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-mute">Forma del compenso</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {forms.map((f) => (
            <span key={f} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${f === 'Ibrida' ? 'bg-ink text-white' : 'bg-paper text-mute'}`}>
              {f}
            </span>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {[
            ['Compenso concordato', '400 € + cena per due'],
            ['Contenuti', '2 reel · 3 storie entro il 18/11'],
            ['Diritti d’uso', 'Organico, 6 mesi'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2 text-[11px]">
              <span className="text-mute">{k}</span>
              <span className="text-right font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1.5 rounded-xl bg-acid px-2.5 py-2 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Accettato da brand e creator
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-ink px-2.5 py-2 font-semibold text-white">
            <FileText className="h-3.5 w-3.5 text-acid" /> Contratto generato
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ: QA[] = [
  { q: 'Come si gestiscono i contratti con gli influencer?', a: 'Con un accordo scritto per ogni collaborazione: contenuti, scadenze, compenso, diritti d’uso ed eventuale esclusiva. Su influencee brand e creator concordano i termini in versioni e, quando accettano la stessa versione, la piattaforma genera il contratto in DOCX (o PDF) e ne registra l’impronta.' },
  { q: 'Come pagare un influencer in modo corretto?', a: 'Paghi il compenso concordato nei termini dopo aver ricevuto il documento fiscale del creator: fattura se ha la partita IVA, oppure ricevuta per prestazione occasionale (con ritenuta d’acconto se sei un’azienda o un professionista). Conserva contratto e documento insieme. Per i dettagli fiscali chiedi al tuo commercialista.' },
  { q: 'Influencee gestisce i pagamenti ai creator?', a: 'No. Su influencee il compenso si concorda nei termini della collaborazione e il brand lo paga direttamente al creator, fuori dalla piattaforma. Influencee non trattiene commissioni sulle collaborazioni: il brand paga solo l’eventuale abbonamento Premium.' },
  { q: 'Si può pagare un influencer con i prodotti?', a: 'Sì. Oltre al compenso in denaro puoi offrire cambio merce, affiliazione con una percentuale sulle vendite, una formula ibrida, ospitalità o un evento. La formula scelta viene scritta nei termini e nel contratto generato.' },
  { q: 'Come si tiene traccia dei costi di una campagna con influencer?', a: 'Partendo dai termini: ogni collaborazione riporta il compenso concordato, i contenuti e le scadenze. Con i link tracciati vedi click e visitatori unici di ogni contenuto, così confronti quanto hai speso con quello che ha portato ciascun creator.' },
  { q: 'Potete gestire voi contratti e creator per la mia azienda?', a: `Sì. Con il servizio gestito il team di Influencee sceglie i creator con te, prepara brief e accordi, segue consegne e approvazioni e misura i risultati. Chiedi un preventivo su WhatsApp al ${WHATSAPP.number}.` },
];

function AdminPage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Contratti e pagamenti' }]}
        eyebrow="Contratti e compensi"
        title={'Contratti e pagamenti\ninfluencer, *senza caos*'}
        lead="Compenso, contenuti, scadenze e diritti d’uso concordati nei termini, accettati da entrambi e trasformati in contratto. Sai sempre cosa devi pagare, a chi e per quale contenuto."
        actions={
          <>
            <Button href={APP.brand}>Prova gratis {FACTS.trialDays} giorni</Button>
            <Button href="#/agenzia-influencer/" variant="secondary">Gestiamo noi</Button>
          </>
        }
        visual={<TermsMock className="mx-auto max-w-[500px]" />}
        note="Nessuna commissione sulle collaborazioni: il compenso va tutto al creator."
      />
      <AnswerBox q="Come si paga un influencer?" a="Si concorda per iscritto il compenso (in denaro, in prodotti, con una percentuale sulle vendite o in formula mista) insieme a contenuti, scadenze e diritti d’uso. Il creator consegna, il brand approva, poi il creator emette fattura o ricevuta e il brand paga quanto concordato. Su influencee accordo e contratto stanno nella collaborazione; il pagamento avviene direttamente tra brand e creator." points={['Compenso scritto nei termini', 'Contratto generato', 'Consegne approvate', '0% di commissione']} />
      <CardGrid tone="white" eyebrow="Forme di compenso" title={'Non solo denaro:\n*le formule che puoi offrire*'} lead="Nei termini della collaborazione scegli la formula: viene riportata nel contratto generato." cols={3} items={[
        { tag: 'Pagata', t: 'Compenso in denaro', x: 'Un importo per i contenuti concordati. È la formula più comune con micro e mid influencer.' },
        { tag: 'Prodotti', t: 'Cambio merce', x: 'Il creator riceve prodotti o servizi al posto del compenso: funziona bene con nano e micro.' },
        { tag: 'Vendite', t: 'Affiliazione', x: 'Una percentuale sulle vendite generate dal creator, misurabili con un link o un codice.' },
        { tag: 'Mista', t: 'Formula ibrida', x: 'Un compenso fisso più prodotti o una percentuale: utile per lanci e collaborazioni lunghe.' },
        { tag: 'Locali', t: 'Ospitalità o evento', x: 'Una cena, un soggiorno, un’anteprima: la formula tipica per ristoranti, hotel ed eventi.' },
        { tag: 'Brand', t: '0% di commissione', x: 'Influencee non prende percentuali sulle collaborazioni: il brand paga solo l’eventuale Premium.' },
      ]} />
      <FeatureSplit tone="paper" items={[
        { eyebrow: 'Termini in versioni', title: 'Il compenso si concorda, non si rincorre', text: 'Il brand propone compenso, contenuti e scadenze; il creator accetta o fa una controproposta. Ogni controproposta crea una nuova versione dei termini e azzera le accettazioni: la collaborazione parte solo quando entrambi accettano la stessa versione.', bullets: ['Storico delle versioni', 'Doppia accettazione', 'Nessun accordo perso nelle email'], visual: <CollabMock />, href: '#/funzionalita/gestione-campagne/', cta: 'Scopri la gestione campagne' },
        { eyebrow: 'Contratto generato', title: 'Il contratto nasce dai termini accettati', text: 'La piattaforma genera il contratto con parti, contenuti, scadenze, compenso e diritti d’uso e ne registra l’impronta, così resta traccia di cosa è stato concordato. È il documento da conservare insieme alla fattura o alla ricevuta del creator.', bullets: ['DOCX, PDF quando disponibile', 'Impronta del documento', 'Sempre legato alla collaborazione'], visual: <ContractMock />, href: '#/funzionalita/contratto-influencer/', cta: 'Come funziona il contratto' },
        { eyebrow: 'Consegne e scadenze', title: 'Paghi quello che è stato consegnato', text: 'Consegne, richieste di modifica e approvazioni stanno nella collaborazione, e il calendario mostra le scadenze di tutti i creator con le consegne in ritardo in evidenza. Prima di pagare sai cosa è stato approvato.', bullets: ['Stato di ogni contenuto', 'Etichetta "In ritardo"', 'Chat con ogni creator'], visual: <CalendarMock />, href: '#/funzionalita/calendario-campagne/', cta: 'Scopri il calendario' },
        { eyebrow: 'Risultati', title: 'Confronta il compenso con i click', text: 'Ogni contenuto ha il suo link tracciato: click e visitatori unici per collaborazione, senza salvare indirizzi IP e con i bot esclusi. Così sai quali creator valgono il loro compenso.', bullets: [`${FACTS.freeLinks} link attivi gratis, illimitati con Premium`, 'Parametri UTM già inseriti', 'Pagina risultati per ogni collaborazione'], visual: <LinkMock />, href: '#/funzionalita/link-tracciati/', cta: 'Scopri i link tracciati' },
      ]} />
      <Steps title={'Pagare un creator\n*in quattro passaggi*'} lead="La parte fiscale resta tra brand e creator: per i dettagli chiedi al tuo commercialista." steps={[
        { t: 'Accordo scritto', x: 'Compenso, contenuti, scadenze e diritti d’uso nei termini accettati da entrambi.' },
        { t: 'Consegna e approvazione', x: 'Il creator consegna, tu approvi o chiedi modifiche nella collaborazione.' },
        { t: 'Documento fiscale', x: 'Fattura se il creator ha la partita IVA, altrimenti ricevuta per prestazione occasionale.' },
        { t: 'Pagamento', x: 'Paghi direttamente il creator, con i tempi concordati, e conservi contratto e documento.' },
      ]} />
      <ManagedRow />
      <FaqSeo items={FAQ} />
      <Related links={[
        { label: 'Modello di contratto', text: 'Social media, influencer e UGC', href: '#/contratto-social-media-influencer-ugc/' },
        { label: 'Quanto costa un influencer', text: 'Prezzi medi per fascia', href: '#/social-media-tool/costo-influencer/' },
        { label: 'Creator manager', text: 'Liste, collaborazioni e risultati', href: '#/creator-manager/' },
        { label: 'Agenzia influencer', text: 'Il servizio gestito di Influencee', href: '#/agenzia-influencer/' },
      ]} />
      <CtaBandV2 title={'Preferisci delegare\n*contratti e creator?*'} lead="Il team di Influencee sceglie i creator con te, prepara accordi e brief e segue consegne e risultati." primary={{ label: 'Scopri il servizio gestito', href: '#/agenzia-influencer/' }} secondary={{ label: 'Registra la tua azienda', href: APP.brand }} />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/amministrazione-pagamenti-influencer/',
  ready: true,
  titles: ['Contratti e pagamenti influencer, senza caos', 'Contratti e pagamenti influencer', 'Pagamenti influencer'],
  meta: {
    label: 'Contratti e pagamenti',
    type: 'software',
    kw: 'pagamenti influencer',
    description: 'Come gestire contratti e pagamenti degli influencer: compenso concordato nei termini, contratto generato, consegne approvate. Nessuna commissione.',
    crumbs: [{ label: 'Piattaforma', href: '#/piattaforma-influencer/' }, { label: 'Contratti e pagamenti' }],
    faq: FAQ,
  },
  el: () => <AdminPage />,
};
