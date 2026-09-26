/* ════════════════════════════════════════════════════════════════════
   CONTENUTI INFLUENCEE — unica fonte per testi, link e immagini.
   ⚠ Numeri, testimonianze e nomi dei creator sono SEGNAPOSTO da
     sostituire con dati reali prima della pubblicazione.
   ⚠ Le immagini sono quelle presenti in /public: sostituirle con
     foto di creator e campagne Influencee.
   ════════════════════════════════════════════════════════════════════ */

export const BRAND = {
  name: 'influencee',
  domain: 'influencee.it',
  email: 'info@influencee.it',
  proof: {
    avatars: ['giorgia.png', 'noemi.png', 'marika.png', 'giuseppe.png'],
    rating: '4,9/5',
    label: 'Scelti da 120+ brand e agenzie', // SEGNAPOSTO
  },
};

export const NAV = [
  { label: 'Brand', href: '#brand' },
  { label: 'Agenzie', href: '#agenzie' },
  { label: 'Creator', href: '#creator' },
  { label: 'Piattaforma', href: '#piattaforma' },
  { label: 'Casi studio', href: '#casi-studio' },
];

export const CTA = {
  demo: { label: 'Richiedi una demo', href: '#contatti' },
  campaign: { label: 'Progetta la tua campagna', href: '#contatti' },
  creator: { label: 'Sei un creator?', href: '#diventa-creator' },
  cases: { label: 'Guarda i casi studio', href: '#casi-studio' },
  platform: { label: 'Scopri la piattaforma', href: '#piattaforma' },
};

export const IMG = {
  event: 'spiegazione.png',
  campaign1: 'card1.png',
  campaign2: 'card2.png',
  campaign3: 'card3.png',
  people: ['giorgia.png', 'giuseppe.png', 'noemi.png', 'manuel.png', 'carlo.png', 'marika.png', 'simona.png'],
};

export const NICHES = ['Food', 'Beauty', 'Fashion', 'Travel', 'Fitness', 'Tech', 'Family', 'Gaming', 'Lifestyle', 'Pet', 'Business', 'Sport'];

export const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitch', 'LinkedIn', 'Pinterest', 'Facebook', 'Threads'];

/** SEGNAPOSTO — creator di esempio. */
export const CREATORS = [
  { name: 'Giulia R.', handle: '@giulia.eats', niche: 'Food', followers: '84K', er: '6,2%', match: 96, avatar: 'noemi.png', cover: 'card2.png' },
  { name: 'Marco D.', handle: '@marco.moves', niche: 'Fitness', followers: '152K', er: '4,8%', match: 92, avatar: 'giuseppe.png', cover: 'card1.png' },
  { name: 'Sara L.', handle: '@sara.glow', niche: 'Beauty', followers: '46K', er: '7,9%', match: 90, avatar: 'marika.png', cover: 'card3.png' },
  { name: 'Luca P.', handle: '@luca.travels', niche: 'Travel', followers: '230K', er: '3,9%', match: 88, avatar: 'carlo.png', cover: 'spiegazione.png' },
  { name: 'Elena F.', handle: '@elena.style', niche: 'Fashion', followers: '67K', er: '5,4%', match: 87, avatar: 'giorgia.png', cover: 'card2.png' },
  { name: 'Davide M.', handle: '@davide.tech', niche: 'Tech', followers: '39K', er: '8,1%', match: 85, avatar: 'manuel.png', cover: 'card3.png' },
];

/** SEGNAPOSTO — metriche di esempio. */
export const STATS = [
  { value: 5000, suffix: '+', label: 'Creator italiani nel database' },
  { value: 120, suffix: '+', label: 'Campagne gestite' },
  { value: 38, suffix: 'M', label: 'Persone raggiunte' },
  { value: 4.9, decimals: 1, suffix: '/5', label: 'Soddisfazione dei clienti' },
];

export const SERVICES = [
  { title: 'Selezione dei creator', text: 'Andiamo oltre i follower: analizziamo audience, engagement, qualità dei contenuti e affinità con i valori del brand.', count: 'Database di 5.000+ profili' },
  { title: 'Strategia di campagna', text: 'Obiettivi, formati, calendario e KPI definiti prima di partire, per campagne autentiche e misurabili.', count: 'Brief in 48 ore' },
  { title: 'Gestione end-to-end', text: 'Contatti, contratti, approvazione dei contenuti e pubblicazione: seguiamo ogni fase al posto tuo.', count: '120+ campagne' },
  { title: 'Contenuti UGC', text: 'Video e foto creati da persone reali, pronti per organico e advertising.', count: 'Consegna in 7 giorni' },
  { title: 'Piattaforma per agenzie', text: 'Strumenti per agenzie e centri media: ricerca creator, gestione campagne e report in un unico posto.', count: 'Accesso self-service' },
  { title: 'Report e misurazione', text: 'Reach, engagement, click e conversioni raccolti in report chiari, condivisibili con il cliente.', count: 'Dati in tempo reale' },
];

export const STEPS = [
  { title: 'Brief & obiettivi', text: 'Ci racconti il brand, il pubblico e cosa vuoi ottenere. Definiamo KPI e budget.' },
  { title: 'Selezione creator', text: 'Ti proponiamo una shortlist di profili verificati, con dati di audience e stima dei risultati.' },
  { title: 'Campagna live', text: 'Gestiamo contratti, contenuti e pubblicazioni. Tu approvi, noi coordiniamo.' },
  { title: 'Report & ottimizzazione', text: 'Misuriamo tutto e ti diciamo cosa ha funzionato e come scalare.' },
];

/** SEGNAPOSTO — testimonianze di esempio. */
export const TESTIMONIALS = [
  { headline: 'Creator giusti al primo colpo', quote: 'Ci hanno proposto profili che non conoscevamo, ma perfetti per il nostro pubblico. Engagement doppio rispetto alle campagne precedenti.', name: 'Chiara V.', role: 'Marketing Manager, brand beauty', avatar: 'marika.png', image: 'card3.png', metric: 2, metricSuffix: 'x', metricLabel: 'engagement rispetto alla media', tag: 'Beauty' },
  { headline: 'Una campagna, zero stress', quote: 'Dal brief al report non abbiamo dovuto rincorrere nessuno. Contratti, contenuti e pubblicazioni: tutto gestito.', name: 'Andrea T.', role: 'Founder, brand food', avatar: 'carlo.png', image: 'card2.png', metric: 1.2, metricDecimals: 1, metricSuffix: 'M', metricLabel: 'persone raggiunte in 30 giorni', tag: 'Food' },
  { headline: 'La piattaforma che mancava', quote: 'Come agenzia gestiamo più clienti in parallelo: ricerca creator e report condivisi ci fanno risparmiare ore ogni settimana.', name: 'Federica B.', role: 'Account Director, agenzia media', avatar: 'noemi.png', image: 'spiegazione.png', metric: 12, metricSuffix: 'h', metricLabel: 'risparmiate a settimana', tag: 'Agenzie' },
  { headline: 'Numeri, non impressioni', quote: 'Finalmente report chiari con reach, click e vendite. Sappiamo esattamente quanto rende ogni creator.', name: 'Paolo G.', role: 'E-commerce Manager, brand fashion', avatar: 'giuseppe.png', image: 'card1.png', metric: 4.1, metricDecimals: 1, metricSuffix: 'x', metricLabel: 'ritorno sull’investimento', tag: 'Fashion' },
  { headline: 'UGC pronti per le ads', quote: 'I contenuti UGC sono diventati le nostre inserzioni migliori. Costo per acquisizione giù del 35%.', name: 'Martina S.', role: 'Growth Lead, startup tech', avatar: 'giorgia.png', image: 'card3.png', metric: 35, metricSuffix: '%', metricLabel: 'costo per acquisizione in meno', tag: 'Tech' },
];

/** SEGNAPOSTO — casi studio di esempio. */
export const CASES = [
  { title: 'Agenzia media: 40 campagne gestite in piattaforma', tag: 'Agenzie', metric: '40 campagne', image: 'spiegazione.png' },
  { title: 'Food brand: +38% di vendite online in un mese', tag: 'Food', metric: '+38% vendite', image: 'card2.png' },
  { title: 'Evento live raccontato da 8 creator locali', tag: 'Eventi', metric: '30M views', image: 'card1.png' },
  { title: 'Lancio prodotto beauty con 12 micro-creator', tag: 'Beauty', metric: '2,4M views', image: 'card3.png' },
];

export const TEAM = [
  { name: 'Giorgia Palazzo', role: 'Founder & CEO', bio: 'Strategia e visione: trasforma gli obiettivi dei brand in campagne che funzionano.', photo: 'giorgia.png' },
  { name: 'Giuseppe Bonaccorso', role: 'Founder & CEO', bio: 'Progetta ecosistemi digitali e partnership con creator ad alto impatto.', photo: 'giuseppe.png' },
  { name: 'Manuel Arlotti', role: 'Co-founder & COO', bio: 'Coordina processi e piattaforma perché ogni campagna esca in tempo e bene.', photo: 'manuel.png' },
  { name: 'Noemi Vitone', role: 'Creator Relations', bio: 'Il punto di riferimento dei creator: selezione, brief e relazione.', photo: 'noemi.png' },
  { name: 'Carlo Baldassini', role: 'Account Manager', bio: 'Segue i brand dal brief al report, con un occhio sempre sui numeri.', photo: 'carlo.png' },
  { name: 'Marika Malaspina', role: 'Creative & Content', bio: 'Dà forma alle idee: concept creativi e linee guida per i contenuti.', photo: 'marika.png' },
];

export const FAQS = [
  { q: 'Come scegliete i creator?', a: 'Analizziamo audience (età, città, interessi), engagement reale, qualità dei contenuti e coerenza con i valori del brand. Non ci fermiamo al numero di follower.' },
  { q: 'Quanto costa una campagna?', a: 'Dipende da obiettivi, numero di creator e formati. Dopo il brief ricevi una proposta chiara con budget e risultati stimati.' },
  { q: 'Lavorate anche con le agenzie?', a: 'Sì: offriamo una piattaforma pensata per agenzie e centri media, con database creator, gestione campagne e report condivisibili.' },
  { q: 'Sono un creator, come mi candido?', a: 'Compila il modulo nella sezione Creator: valutiamo il profilo e ti contattiamo quando c’è una campagna in linea con te.' },
  { q: 'Come misurate i risultati?', a: 'Raccogliamo reach, interazioni, click e conversioni in un report finale, con dati aggiornati anche durante la campagna.' },
];
