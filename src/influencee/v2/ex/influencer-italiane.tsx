import React from 'react';
import { Button } from '../../ds';
import { APP, FACTS, FAQ, SUBCATEGORIES, type QA } from '../data';
import { SearchMock } from '../mocks';
import { AnswerBox, CategoryGrid, CtaDual, FaqSeo, FeatureSplit, HeroPlatform, Prose, RegionGrid, Related } from '../rows';
import { CreatorList } from '../creators';
import { ToolLead } from '../tools';
import type { ExPage } from './types';

/* /influencer-italiane/ — ex Elementor (copia del 22/10/2026), stesso URL. La pagina vecchia con più clic
   (455 clic, 46.000 impressioni, posizione 9,6): resta un articolo sulla keyword al femminile «influencer italiane»
   con le risposte che si posizionano (chi sono, le più famose, come trovarle, la prima) e la griglia per categoria
   e le FAQ. Non cannibalizza l'hub /influencer-italiani/ (lista per categoria e città): lo linka.
   Tolti: gli embed Instagram di Ferragni, Valli, Nargi e V. Ferragni presentati come «i nostri creator» (non lo sono),
   «conosciamo i costi esatti di ogni influencer», «Facebook» tra le piattaforme collegate.
   Nessun filtro per genere: i dati dei creator non lo hanno. */

const FAQ_ITALIANE: QA[] = [
  { q: 'Chi sono le influencer italiane più famose?', a: 'Tra le più seguite ci sono Chiara Ferragni, imprenditrice digitale e icona della moda, Benedetta Rossi, amata per le sue ricette semplici, e Alice Campello, modella e imprenditrice nel beauty. Spiccano anche Veronica Ferraro nella moda e Giorgia Soleri, attivista e scrittrice.' },
  { q: 'Chi è stata la prima influencer italiana?', a: 'Una delle prime vere influencer italiane è Chiara Ferragni, che ha trasformato il blog «The Blonde Salad» in un marchio globale. Dopo di lei molte creator italiane hanno costruito carriere sui social, anche a livello internazionale.' },
  FAQ.piattaforma[0],
  { q: 'Lavorate con influencer di nicchia?', a: `Sì. Su Influencee i creator italiani sono divisi in ${FACTS.categories} categorie, 5 fasce di follower e per città: puoi cercare un pubblico specifico, una nicchia (fitness, food, beauty…) o una zona precisa, anche tra nano e micro influencer.` },
  { q: 'Posso collaborare con una sola influencer?', a: 'Sì. Puoi invitare un singolo creator a una campagna o pubblicare un annuncio e scegliere tra chi si candida: non ci sono minimi di creator né commissioni per il brand sulle collaborazioni.' },
  { q: 'Conoscete i prezzi di ogni influencer?', a: 'Molti creator indicano nella scheda un prezzo indicativo per reel, storia e post; il compenso finale si concorda nella collaborazione, anche con cambio merce o affiliazione. Per una stima veloce c’è il calcolatore gratuito del costo di un influencer.' },
  { q: 'Cos’è l’UGC e lo gestite?', a: 'L’UGC (user generated content) sono video e foto in stile spontaneo che i creator realizzano per i canali e le inserzioni del brand. Su Influencee trovi creator con il tipo UGC; se preferisci delegare, il team può gestire la campagna per te.' },
  { q: 'Posso geolocalizzare la campagna?', a: 'Sì. La posizione dei creator segue i comuni italiani: cerchi per regione, provincia e città, ideale per negozi, ristoranti ed eventi locali.' },
  { q: 'Su quali piattaforme lavorano le creator?', a: 'Soprattutto Instagram, TikTok e YouTube. I creator possono collegare questi account in sola lettura: così i numeri della scheda arrivano dalla fonte ufficiale e il profilo riceve il badge Verificato.' },
  { q: 'Posso cercare solo influencer donne?', a: 'Oggi la ricerca non ha un filtro per genere: filtri per categoria, città, fascia di follower, tipo di creator e piattaforma, poi apri le schede dei profili. Se vuoi, il team ti prepara una selezione su misura.' },
];

function ItalianePage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: 'Influencer italiane' }]}
        eyebrow="Influencer italiane"
        title={'Influencer italiane:\n*chi sono e come trovarle*'}
        lead="Le creator italiane più seguite, chi è stata la prima e come trovare le influencer giuste per il tuo brand: per categoria, città e fascia di follower."
        actions={
          <>
            <Button href={APP.brand}>Trova influencer</Button>
            <Button href="#/influencer-italiani/" variant="secondary">
              Tutti gli influencer italiani
            </Button>
          </>
        }
        visual={<SearchMock className="mx-auto max-w-[520px]" />}
        note={`Solo creator italiani · ${FACTS.categories} categorie · ${FACTS.trialDays} giorni di prova senza carta`}
      />
      <AnswerBox
        q="Chi sono le influencer italiane?"
        a="Le influencer italiane sono creator che, con contenuti creativi e autentici, orientano tendenze e scelte di acquisto del loro pubblico. Sono attive su Instagram, TikTok, YouTube e blog e spaziano tra moda, beauty, fitness, lifestyle, viaggi e benessere. Collaborano con brand e aziende per far conoscere prodotti, servizi ed eventi."
        points={['Moda, beauty e lifestyle', 'Fitness, food e viaggi', 'Instagram, TikTok, YouTube', 'Nano, micro e macro']}
      />
      <Prose
        tone="white"
        blocks={[
          {
            h: 'Chi sono le influencer italiane più famose?',
            p: [
              'Tra le influencer italiane più seguite troviamo Chiara Ferragni, imprenditrice digitale e icona della moda, Benedetta Rossi, food blogger amata per le sue ricette semplici e genuine, e Alice Campello, modella e imprenditrice nel settore beauty.',
              'Chiara Ferragni ha trasformato un blog di moda in un’impresa; Benedetta Rossi ha reso la cucina di casa accessibile a tutti con video e libri; Alice Campello ha unito beauty e moda costruendo un suo brand. Accanto a loro spiccano Veronica Ferraro, fashion influencer, e Giorgia Soleri, attivista e scrittrice che usa la sua voce sui temi sociali.',
            ],
          },
          {
            h: 'Chi è stata la prima influencer italiana?',
            p: ['Una delle prime vere influencer italiane è stata Chiara Ferragni, che ha trasformato il blog «The Blonde Salad» in un marchio globale. Dopo di lei molte creator italiane hanno costruito carriere di successo grazie ai social, affermandosi anche all’estero.'],
          },
          {
            h: 'Come trovare le influencer italiane?',
            p: ['Per una campagna non servono per forza i nomi più famosi: spesso funzionano meglio nano e micro influencer coerenti con il tuo prodotto e la tua zona. Le strade più usate sono queste.'],
            list: [
              { t: 'Hashtag e ricerca sui social', x: 'Hashtag come #influenceritaliane, #fashionblogger o #beautyinfluencer su Instagram e TikTok per trovare i profili più attivi.' },
              { t: 'Eventi di settore', x: 'Fashion week, fiere e festival sono occasioni per incontrare creator e capire con chi lavorano.' },
              { t: 'YouTube e podcast', x: 'Molte creator italiane parlano di moda, beauty, viaggi e crescita personale in video lunghi e podcast.' },
              { t: 'Una piattaforma con filtri', x: 'Su Influencee filtri per categoria, città, fascia di follower ed engagement e confronti le schede con dati di cui vedi la fonte.' },
            ],
          },
        ]}
        aside={
          <div className="rounded-[28px] bg-ink p-7 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-acid">Hub influencer italiani</p>
            <p className="mt-3 font-heading text-2xl font-semibold tracking-[-0.02em]">Cerchi una lista per categoria o città?</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">Nell’hub trovi tutti i creator italiani del sito, divisi per {FACTS.categories} categorie, regioni e città, con filtri per fascia di follower.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="#/influencer-italiani/">Vai all’hub</Button>
              <Button href="#/social-media-tool/costo-influencer/" variant="secondary">Quanto costa un’influencer</Button>
            </div>
          </div>
        }
      />
      <CreatorList
        tone="paper"
        title={'Creator italiane e italiani\n*su Influencee*'}
        lead="Alcuni profili di moda, beauty, lifestyle, fitness e viaggi presenti nel sito: apri la scheda o cercane altri con i filtri della piattaforma."
        filter={{ cat: ['fashion', 'beauty', 'lifestyle', 'fitness', 'travel'], limit: 12 }}
      />
      <CategoryGrid title={'Trova influencer\n*per categoria*'} lead="Vuoi pianificare una campagna in un settore preciso o con creator della tua zona? Scegli la categoria e filtra per città e fascia di follower." />
      <Related
        tone="white"
        title={'Influencer per\n*specialità*'}
        links={SUBCATEGORIES.map((s) => ({ label: `${s.short} influencer`, text: s.lead, href: `#/${s.slug}/` }))}
      />
      <RegionGrid tone="paper" title={'Influencer italiane\n*per regione e città*'} lead="Per campagne geolocalizzate: negozi, ristoranti, eventi e aperture." />
      <ToolLead tool="creator_italiane" context="Pagina: Influencer italiane" eyebrow="Selezione gratuita" title={'Ti mandiamo le creator\n*adatte alla tua campagna*'} lead="Dicci categoria, zona e budget: il team ti propone una prima selezione di creator italiani, anche solo donne se la campagna lo richiede." bullets={['Creator italiani per categoria e città', 'Prezzo indicativo di ogni profilo', 'Nessun impegno']} cta="Ricevi la selezione" />
      <FeatureSplit
        items={[
          { eyebrow: 'Database influencer', title: 'Cerca tra le creator italiane con filtri veri', text: 'Categoria, città e regione, fascia di follower, tipo di creator, piattaforma, engagement e badge di fiducia. Salvi la ricerca come lista e la lista si aggiorna da sola quando entrano nuovi profili.', bullets: ['Vista a riquadri, tabella o mappa', 'Liste salvate e preferiti', 'Numeri con la loro fonte e data'], visual: <SearchMock />, href: '#/funzionalita/database-influencer/', cta: 'Come funziona la ricerca' },
        ]}
      />
      <FaqSeo items={FAQ_ITALIANE} />
      <Related
        tone="white"
        links={[
          { label: 'Influencer italiani', text: 'La lista per categoria, regione e città', href: '#/influencer-italiani/' },
          { label: 'Mamme influencer', text: 'Creator di famiglia e genitorialità', href: '#/mom-influencers/' },
          { label: 'Micro influencer', text: 'Chi sono e perché funzionano', href: '#/micro-influencer/' },
          { label: 'Fake follower', text: 'Controlla un profilo prima di pagare', href: '#/followe-instagram-fake-follower/' },
        ]}
      />
      <CtaDual />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/influencer-italiane/',
  ready: true,
  titles: ['Influencer italiane: chi sono e come trovarle', 'Influencer italiane più famose', 'Influencer italiane'],
  meta: {
    label: 'Influencer italiane',
    type: 'page',
    kw: 'influencer italiane',
    description: 'Chi sono le influencer italiane più famose, chi è stata la prima e come trovare creator italiane per categoria e città per la campagna del tuo brand.',
    crumbs: [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }, { label: 'Influencer italiane' }],
    faq: FAQ_ITALIANE,
  },
  el: () => <ItalianePage />,
};
