/* ════════════════════════════════════════════════════════════════════
   DATI DEL SITO INFLUENCEE (menu, creator, nicchie, blog)
   ⚠ Creator, numeri e articoli sono SEGNAPOSTO di esempio: sostituirli
     con dati reali (e foto con liberatoria) prima della pubblicazione.
   ════════════════════════════════════════════════════════════════════ */

export interface MenuItem {
  label: string;
  href: string;
  text?: string;
}
export interface MenuGroup {
  label: string;
  href?: string;
  items?: MenuItem[];
  wide?: boolean;
}

/* ─── Nicchie (pagine categoria dei creator) ────────────────────── */
export const NICHE_INFO: Record<string, { name: string; lead: string }> = {
  food: { name: 'Food', lead: 'Chef, food blogger e appassionati di cucina che raccontano ricette, locali e prodotti con credibilità.' },
  beauty: { name: 'Beauty', lead: 'Skincare, make-up e routine: creator che la community segue per consigli e recensioni sincere.' },
  fashion: { name: 'Fashion', lead: 'Stile, outfit e tendenze: profili perfetti per lanci di collezioni e campagne stagionali.' },
  travel: { name: 'Travel', lead: 'Viaggi, weekend e destinazioni: contenuti che ispirano prenotazioni e scoperte.' },
  fitness: { name: 'Fitness', lead: 'Allenamento, nutrizione e benessere: audience motivate e con alto engagement.' },
  tech: { name: 'Tech', lead: 'Recensioni, unboxing e tutorial: creator che spiegano prodotti e servizi digitali.' },
  family: { name: 'Family', lead: 'Genitori e famiglie che condividono quotidianità, prodotti per la casa e per i più piccoli.' },
  gaming: { name: 'Gaming', lead: 'Streamer e gamer con community fedeli su Twitch, YouTube e TikTok.' },
};
export const NICHE_SLUGS = Object.keys(NICHE_INFO);

/* ─── Blog: categorie ───────────────────────────────────────────── */
export const BLOG_CATEGORIES: Record<string, { name: string; lead: string }> = {
  strategia: { name: 'Strategia', lead: 'Come pianificare campagne con i creator che portano risultati misurabili.' },
  guide: { name: 'Guide pratiche', lead: 'Passo per passo: brief, contratti, selezione dei profili e report.' },
  'creator-economy': { name: 'Creator economy', lead: 'Numeri, tendenze e cambiamenti del mercato dei creator in Italia.' },
  'casi-studio': { name: 'Casi studio', lead: 'Campagne reali raccontate dall’idea ai risultati.' },
  creator: { name: 'Per i creator', lead: 'Consigli per chi crea contenuti e vuole collaborare con i brand.' },
};

/* ─── Menu principale ───────────────────────────────────────────── */
export const MENU: MenuGroup[] = [
  {
    label: 'Soluzioni',
    items: [
      { label: 'Per i brand', href: '#brand', text: 'Campagne con i creator gestite dall’inizio alla fine' },
      { label: 'Per le agenzie', href: '#agenzie', text: 'Piattaforma e supporto per gestire più clienti' },
      { label: 'Per i creator', href: '#diventa-creator', text: 'Entra nel network e ricevi proposte in linea con te' },
    ],
  },
  {
    label: 'Piattaforma',
    href: '#piattaforma',
    items: [
      { label: 'Panoramica', href: '#piattaforma', text: 'Come funziona la piattaforma, dalla ricerca al report' },
      { label: 'Funzionalità', href: '#funzionalita', text: 'Tutto quello che puoi fare con influencee' },
    ],
  },
  {
    label: 'Creator',
    href: '#creator',
    wide: true,
    items: [{ label: 'Tutti i creator', href: '#creator', text: 'Cerca per nicchia, città e follower' }, ...NICHE_SLUGS.map((s) => ({ label: NICHE_INFO[s].name, href: `#nicchia.${s}` }))],
  },
  { label: 'Casi studio', href: '#casi-studio' },
  {
    label: 'Blog',
    href: '#blog',
    items: [{ label: 'Tutti gli articoli', href: '#blog' }, ...Object.entries(BLOG_CATEGORIES).map(([s, c]) => ({ label: c.name, href: `#categoria.${s}` }))],
  },
];

/* ─── Creator (generati in modo deterministico da una lista base) ─ */
const PEOPLE = ['noemi.png', 'giuseppe.png', 'marika.png', 'carlo.png', 'giorgia.png', 'manuel.png', 'simona.png'];
const COVERS = ['card2.png', 'card1.png', 'card3.png', 'spiegazione.png'];
const BASE: [string, string, string, string, string[]][] = [
  ['Giulia Rinaldi', 'giulia.eats', 'food', 'Bologna', ['Instagram', 'TikTok']],
  ['Marco De Santis', 'marco.moves', 'fitness', 'Milano', ['Instagram', 'YouTube']],
  ['Sara Lombardi', 'sara.glow', 'beauty', 'Roma', ['Instagram', 'TikTok']],
  ['Luca Pellegrini', 'luca.travels', 'travel', 'Firenze', ['Instagram', 'YouTube']],
  ['Elena Ferri', 'elena.style', 'fashion', 'Milano', ['Instagram', 'TikTok']],
  ['Davide Moretti', 'davide.tech', 'tech', 'Torino', ['YouTube', 'TikTok']],
  ['Chiara Conti', 'chiara.home', 'family', 'Bari', ['Instagram', 'Facebook']],
  ['Andrea Galli', 'andrea.plays', 'gaming', 'Napoli', ['Twitch', 'YouTube']],
  ['Francesca Villa', 'fra.cucina', 'food', 'Napoli', ['Instagram', 'TikTok']],
  ['Matteo Costa', 'matteo.run', 'fitness', 'Verona', ['Instagram', 'TikTok']],
  ['Alice Marino', 'alice.skin', 'beauty', 'Torino', ['TikTok', 'Instagram']],
  ['Giorgio Bruno', 'giorgio.wander', 'travel', 'Palermo', ['Instagram', 'TikTok']],
  ['Martina Greco', 'marti.outfit', 'fashion', 'Roma', ['TikTok', 'Instagram']],
  ['Simone Riva', 'simone.bytes', 'tech', 'Milano', ['YouTube', 'Instagram']],
  ['Laura Fontana', 'laura.mamma', 'family', 'Padova', ['Instagram', 'TikTok']],
  ['Pietro Caruso', 'pietro.live', 'gaming', 'Roma', ['Twitch', 'TikTok']],
  ['Valentina Serra', 'vale.brunch', 'food', 'Milano', ['Instagram', 'YouTube']],
  ['Nicola Barbieri', 'nico.lift', 'fitness', 'Foggia', ['TikTok', 'YouTube']],
];

export interface Creator {
  slug: string;
  name: string;
  handle: string;
  niche: string;
  city: string;
  platforms: string[];
  followers: number;
  er: number;
  match: number;
  avatar: string;
  cover: string;
  gallery: string[];
  bio: string;
  women: number;
  ages: [string, number][];
  cities: [string, number][];
  formats: string[];
}

const seed = (i: number, k: number) => ((i + 3) * 9301 + k * 49297) % 233280 / 233280;

export const CREATORS_DB: Creator[] = BASE.map(([name, handle, niche, city, platforms], i) => {
  const followers = Math.round((15 + seed(i, 1) * 280) * 1000);
  const er = Math.round((2.8 + seed(i, 2) * 6) * 10) / 10;
  const women = Math.round(35 + seed(i, 3) * 45);
  const a = [18 + seed(i, 4) * 14, 30 + seed(i, 5) * 18, 18 + seed(i, 6) * 12, 6 + seed(i, 7) * 8];
  const tot = a.reduce((x, y) => x + y, 0);
  const ages: [string, number][] = ['18–24', '25–34', '35–44', '45+'].map((l, k) => [l, Math.round((a[k] / tot) * 100)]);
  const others = ['Milano', 'Roma', 'Napoli', 'Torino', 'Bologna', 'Bari'].filter((c) => c !== city);
  return {
    slug: handle.replace('.', '-'),
    name,
    handle: `@${handle}`,
    niche,
    city,
    platforms,
    followers,
    er,
    match: Math.round(78 + seed(i, 8) * 20),
    avatar: PEOPLE[i % PEOPLE.length],
    cover: COVERS[i % COVERS.length],
    gallery: [0, 1, 2, 3, 4, 5].map((k) => COVERS[(i + k) % COVERS.length]),
    bio: `Creator ${NICHE_INFO[niche].name.toLowerCase()} da ${city}. Racconta ${
      { food: 'ricette, locali e prodotti del territorio', fitness: 'allenamenti, alimentazione e motivazione', beauty: 'skincare, make-up e routine quotidiane', travel: 'viaggi, weekend e destinazioni italiane', fashion: 'outfit, tendenze e brand emergenti', tech: 'gadget, app e tecnologia spiegata semplice', family: 'la vita di famiglia e i prodotti per la casa', gaming: 'live, videogiochi e community' }[niche]
    } con uno stile diretto e riconoscibile.`,
    women,
    ages,
    cities: [
      [city, Math.round(22 + seed(i, 9) * 15)],
      [others[0], Math.round(10 + seed(i, 10) * 8)],
      [others[1], Math.round(6 + seed(i, 11) * 6)],
    ],
    formats: ['Reel', 'Stories', platforms.includes('TikTok') ? 'TikTok' : 'Post', platforms.includes('YouTube') ? 'Video YouTube' : 'UGC'],
  };
});

export const fmtFollowers = (n: number) => (n >= 1000000 ? `${(n / 1000000).toLocaleString('it-IT', { maximumFractionDigits: 1 })}M` : `${Math.round(n / 1000)}K`);
export const fmtEr = (n: number) => `${n.toLocaleString('it-IT', { minimumFractionDigits: 1 })}%`;

/* ─── Articoli del blog ─────────────────────────────────────────── */
export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  cover: string;
  author: string;
  authorPhoto: string;
  date: string;
  read: number;
  sections: { h: string; p: string[]; list?: string[]; quote?: string }[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'micro-o-macro-influencer',
    title: 'Micro o macro influencer: quale scegliere per la tua campagna',
    category: 'strategia',
    excerpt: 'Più follower non significa più risultati. Come scegliere la dimensione giusta dei creator in base all’obiettivo.',
    cover: 'card2.png',
    author: 'Giorgia Palazzo',
    authorPhoto: 'giorgia.png',
    date: '18 settembre 2026',
    read: 6,
    sections: [
      { h: 'Parti dall’obiettivo, non dai follower', p: ['La prima domanda non è “quanto è grande il creator?”, ma “cosa vogliamo ottenere?”. Notorietà, vendite, contenuti per le ads o traffico in negozio chiedono profili diversi.', 'Un macro creator porta reach in poco tempo; un gruppo di micro creator costruisce fiducia e conversazioni in nicchie precise.'] },
      { h: 'Quando conviene lavorare con i micro creator', p: ['I profili tra 10 e 100 mila follower hanno spesso community più vicine e tassi di interazione più alti. Sono ideali per prodotti di nicchia, lanci locali e test creativi.'], list: ['Budget distribuito su più voci e meno rischio', 'Contenuti più autentici e variati', 'Più materiale riutilizzabile per l’advertising'] },
      { h: 'Quando serve un macro creator', p: ['Per un lancio nazionale o un evento con una data precisa, la reach concentrata di un profilo grande fa la differenza. Conviene affiancarlo a micro creator che mantengano viva la conversazione nelle settimane successive.'], quote: 'La combinazione che funziona più spesso: un volto riconoscibile per il lancio, dieci voci credibili per la continuità.' },
      { h: 'Come misurare il risultato', p: ['Stabilisci i KPI prima di partire: reach e frequenza per la notorietà, click e codici sconto per le vendite, costo per contenuto per l’UGC. Solo così il confronto tra creator è davvero possibile.'] },
    ],
  },
  {
    slug: 'come-scrivere-un-brief-per-creator',
    title: 'Come scrivere un brief che i creator amano (e rispettano)',
    category: 'guide',
    excerpt: 'Obiettivi chiari, libertà creativa e vincoli precisi: la struttura di un brief che produce contenuti migliori.',
    cover: 'spiegazione.png',
    author: 'Noemi Vitone',
    authorPhoto: 'noemi.png',
    date: '10 settembre 2026',
    read: 5,
    sections: [
      { h: 'Una pagina, non un manuale', p: ['Un buon brief si legge in tre minuti. Il creator deve capire subito cosa promuovere, a chi parla e cosa deve succedere dopo la visione del contenuto.'] },
      { h: 'I sei blocchi indispensabili', p: ['Ogni brief dovrebbe contenere sempre le stesse informazioni, nello stesso ordine.'], list: ['Obiettivo della campagna e KPI', 'Messaggio chiave in una frase', 'Cosa è obbligatorio dire o mostrare', 'Cosa evitare', 'Formati, quantità e date di pubblicazione', 'Indicazioni su trasparenza (#adv) e diritti d’uso'] },
      { h: 'Lascia spazio al tono del creator', p: ['I follower seguono un creator per il suo modo di raccontare. Un copione rigido abbassa l’engagement: meglio fornire i punti chiave e lasciare libera la forma.'], quote: 'Il brief dice cosa. Il creator decide come.' },
      { h: 'Approvazione e revisioni', p: ['Concorda fin dall’inizio quante revisioni sono previste e in quanto tempo arriva il feedback. Una piattaforma condivisa evita catene di email e versioni perse.'] },
    ],
  },
  {
    slug: 'kpi-influencer-marketing',
    title: 'I KPI dell’influencer marketing che contano davvero',
    category: 'strategia',
    excerpt: 'Reach, engagement, click, vendite: quali metriche guardare in base all’obiettivo e come leggerle.',
    cover: 'card3.png',
    author: 'Carlo Baldassini',
    authorPhoto: 'carlo.png',
    date: '2 settembre 2026',
    read: 7,
    sections: [
      { h: 'Metriche di notorietà', p: ['Reach, impression e frequenza dicono quante persone hanno visto il contenuto e quante volte. Sono il primo livello, utile per lanci e campagne di brand.'] },
      { h: 'Metriche di interazione', p: ['L’engagement rate misura quanto la community reagisce. Più dei like contano salvataggi, condivisioni e commenti pertinenti.'] },
      { h: 'Metriche di conversione', p: ['Link tracciati e codici sconto personali collegano ogni vendita al creator che l’ha generata. È il modo più semplice per calcolare il ritorno sull’investimento.'], list: ['Click sul link in bio o nelle stories', 'Utilizzi del codice sconto', 'Costo per acquisizione per creator'] },
      { h: 'Un report che il cliente capisce', p: ['Un buon report si apre con tre numeri e una frase di sintesi. Il dettaglio per creator e per contenuto viene dopo, per chi vuole approfondire.'] },
    ],
  },
  {
    slug: 'ugc-per-le-ads',
    title: 'UGC: perché i contenuti dei creator funzionano nelle ads',
    category: 'creator-economy',
    excerpt: 'Video girati da persone reali, pensati per l’advertising: come ottenerli, testarli e riutilizzarli.',
    cover: 'card1.png',
    author: 'Marika Malaspina',
    authorPhoto: 'marika.png',
    date: '26 agosto 2026',
    read: 5,
    sections: [
      { h: 'Cos’è l’UGC per i brand', p: ['UGC significa contenuti generati da utenti. Nel marketing indica video e foto realizzati da creator per il brand, spesso senza pubblicazione sul loro profilo, da usare nelle campagne a pagamento.'] },
      { h: 'Perché converte', p: ['Un volto reale che mostra il prodotto in un contesto quotidiano è percepito come un consiglio, non come una pubblicità. Per questo gli UGC reggono bene nei feed di Instagram e TikTok.'] },
      { h: 'Come organizzare la produzione', p: ['Chiedi più varianti dello stesso concept: aperture diverse nei primi tre secondi permettono di testare cosa ferma lo scroll.'], list: ['3 hook diversi per ogni video', 'Formato verticale 9:16', 'Versione con e senza sottotitoli', 'Diritti d’uso per le ads chiari nel contratto'] },
    ],
  },
  {
    slug: 'lancio-beauty-12-creator',
    title: 'Caso studio: lancio beauty con 12 micro creator',
    category: 'casi-studio',
    excerpt: 'Dalla selezione dei profili al codice sconto tracciato: come abbiamo portato una nuova linea skincare a 2,4 milioni di views.',
    cover: 'card3.png',
    author: 'Giuseppe Bonaccorso',
    authorPhoto: 'giuseppe.png',
    date: '19 agosto 2026',
    read: 8,
    sections: [
      { h: 'L’obiettivo', p: ['Il brand voleva far conoscere una nuova linea skincare a un pubblico femminile 25–34 anni e misurare le vendite generate direttamente dai creator.'] },
      { h: 'La selezione', p: ['Abbiamo analizzato oltre 300 profili beauty e scelto 12 micro creator con audience affine, engagement sopra la media e nessuna collaborazione recente con competitor.'] },
      { h: 'La campagna', p: ['Ogni creator ha ricevuto il prodotto, un brief di una pagina e un codice sconto personale. I contenuti sono stati pubblicati in tre settimane per mantenere costante la visibilità.'], quote: 'Il valore è arrivato dalla varietà: dodici routine diverse, dodici modi di raccontare lo stesso prodotto.' },
      { h: 'I risultati', p: ['2,4 milioni di views in 30 giorni, engagement medio doppio rispetto alle campagne precedenti del brand e un ritorno misurabile grazie ai codici sconto. I contenuti migliori sono diventati inserzioni.'] },
    ],
  },
  {
    slug: 'come-farsi-notare-dai-brand',
    title: 'Sei un creator? Come farti notare dai brand giusti',
    category: 'creator',
    excerpt: 'Media kit, nicchia chiara e dati aggiornati: cosa guardano davvero i brand quando scelgono un creator.',
    cover: 'card2.png',
    author: 'Noemi Vitone',
    authorPhoto: 'noemi.png',
    date: '12 agosto 2026',
    read: 4,
    sections: [
      { h: 'Una nicchia chiara', p: ['I brand cercano creator che parlano a un pubblico preciso. Un profilo coerente è più facile da proporre di uno che parla di tutto.'] },
      { h: 'Un media kit aggiornato', p: ['Una o due pagine con dati di audience, esempi di collaborazioni e formati disponibili fanno risparmiare tempo a chi deve valutarti.'], list: ['Età, genere e città principali del pubblico', 'Engagement medio degli ultimi 30 giorni', 'Tre collaborazioni di cui vai fiero', 'Contatti e tempi di risposta'] },
      { h: 'Professionalità nelle collaborazioni', p: ['Rispettare date, brief e indicazioni di trasparenza è ciò che fa tornare un brand una seconda volta.'] },
    ],
  },
];
