/* ════════════════════════════════════════════════════════════════════
   SITO INFLUENCEE v2 — dati, keyword e fatti reali della piattaforma
   Fonte delle funzioni: repo influencee-dev/appinfluencee (ottobre 2026).
   Regola: sul sito solo ciò che l'app fa davvero. Niente AI, niente dati
   "in tempo reale", niente numeri di creator non verificati, solo creator
   italiani. Vedi SEO-PIANO.md per keyword, redirect e regole GEO/AEO.
   ════════════════════════════════════════════════════════════════════ */

export const SITE = {
  name: 'Influencee',
  url: 'https://influencee.it',
  company: 'Partidea SRL',
  tagline: 'La piattaforma italiana per trovare creator e gestire collaborazioni',
};

/** Link all'app (le CTA portano qui). */
export const APP = {
  base: 'https://app.influencee.it',
  signup: 'https://app.influencee.it/iscriviti/',
  creator: 'https://app.influencee.it/iscriviti/creator/',
  brand: 'https://app.influencee.it/iscriviti/brand/',
  login: 'https://app.influencee.it/accounts/login/',
  annunci: 'https://app.influencee.it/annunci/',
  benchmark: 'https://app.influencee.it/benchmark/',
  check: 'https://app.influencee.it/benchmark/engagement-ratio/',
};

/** Preventivo per progetti gestiti dal team: WhatsApp. */
export const WHATSAPP = {
  number: '+39 351 342 1629',
  tel: '+393513421629',
  href: `https://wa.me/393513421629?text=${encodeURIComponent('Ciao Influencee, vorrei un preventivo per un progetto con i creator gestito da voi.')}`,
};

/** Fatti verificati nel codice dell'app: gli unici numeri da usare. */
export const FACTS = {
  trialDays: 3,
  freeResults: 5,
  freeLinks: 10,
  maxCategories: 5,
  categories: 18,
  /** ⚠ Dato fornito dal titolare (ottobre 2026), non verificabile dal codice dell'app: confermare prima del lancio. */
  clients: '+5.000',
};

/* ─── Fasce di follower (intelligence/0014) ─────────────────────── */
export const TIERS = [
  { id: 'nano', name: 'Nano', range: '1.000 – 10.000' },
  { id: 'micro', name: 'Micro', range: '10.000 – 50.000' },
  { id: 'mid', name: 'Mid', range: '50.000 – 250.000' },
  { id: 'macro', name: 'Macro', range: '250.000 – 1 milione' },
  { id: 'mega', name: 'Mega', range: 'oltre 1 milione' },
];

export const CREATOR_TYPES = [
  { id: 'ugc', name: 'UGC creator', text: 'Creano video e foto per i canali del brand: conta la qualità del contenuto, non i follower.' },
  { id: 'influencer', name: 'Influencer', text: 'Pubblicano sui propri profili e portano il brand davanti alla loro community.' },
  { id: 'professional', name: 'Professionisti', text: 'Medici, nutrizionisti, personal trainer, avvocati: autorevolezza nel proprio settore.' },
  { id: 'vip', name: 'VIP', text: 'Volti noti per lanci e campagne ad alta visibilità.' },
];

/* ─── Categorie (tassonomia dell'app, 18 di primo livello) ──────────
   slug = URL della pagina sul sito vetrina. Gli slug già indicizzati sul
   vecchio sito (food, travel, fitness) restano identici.               */
export interface Category {
  slug: string;
  name: string;
  short: string;
  kw: string;
  lead: string;
  /** title SEO quando serve più del modello "<Short> influencer italiani" (query reali da Ubersuggest) */
  title?: string;
  /** categorie dei profili creator su WordPress (tassonomia creator_category) che rientrano qui */
  wp: string[];
}
export const CATEGORIES: Category[] = [
  { slug: 'food-influencers', name: 'Cucina e food', short: 'Food', kw: 'food influencer italiani', lead: 'Chef, food creator e appassionati di cucina che raccontano ricette, locali e prodotti.', wp: ['food', 'chef', 'nutrizione'], title: 'Food influencer e food blogger italiani' },
  { slug: 'travel-influencers', name: 'Viaggi', short: 'Travel', kw: 'travel influencer italiani', lead: 'Creator di viaggio che ispirano weekend, destinazioni e prenotazioni.', wp: ['travel'], title: 'Travel influencer e travel blogger italiani' },
  { slug: 'fashion-influencers', name: 'Moda', short: 'Fashion', kw: 'fashion influencer italiani', lead: 'Outfit, tendenze e brand emergenti: profili per collezioni e campagne stagionali.', wp: ['fashion', 'model', 'model-photographer'], title: 'Fashion influencer e fashion blogger italiani' },
  { slug: 'beauty-influencers', name: 'Beauty', short: 'Beauty', kw: 'beauty influencer italiani', lead: 'Skincare, make-up e routine raccontati da creator seguiti per i loro consigli.', wp: ['beauty'] },
  { slug: 'fitness-influencers', name: 'Fitness e sport', short: 'Fitness', kw: 'fitness influencer italiani', lead: 'Allenamento, sport e nutrizione con community motivate e attive.', wp: ['fitness', 'sport', 'fit', 'gym', 'athlete'], title: 'Fitness e sport influencer italiani' },
  { slug: 'tech-influencers', name: 'Tecnologia', short: 'Tech', kw: 'tech influencer italiani', lead: 'Recensioni, unboxing e tutorial su prodotti e servizi digitali.', wp: [] },
  { slug: 'gaming-influencers', name: 'Gaming', short: 'Gaming', kw: 'gaming influencer italiani', lead: 'Streamer e gamer con community fedeli su YouTube e TikTok.', wp: [] },
  { slug: 'mom-influencers', name: 'Famiglia e genitorialità', short: 'Family', kw: 'mamme influencer', lead: 'Genitori che raccontano quotidianità, casa e prodotti per i più piccoli.', wp: ['mom', 'mum', 'parenting'], title: 'Mamme influencer italiane' },
  { slug: 'pets-influencers', name: 'Animali', short: 'Pet', kw: 'pet influencer', lead: 'Cani, gatti e i loro umani: contenuti amati e molto condivisi.', wp: [], title: 'Pet influencer italiani: cani e gatti' },
  { slug: 'music-influencers', name: 'Musica', short: 'Musica', kw: 'music influencer', lead: 'Musicisti e creator musicali per lanci, eventi e campagne audio.', wp: ['music', 'producer'] },
  { slug: 'lifestyle-influencers', name: 'Lifestyle', short: 'Lifestyle', kw: 'lifestyle influencer italiani', lead: 'Vita quotidiana, consigli e scoperte: il formato più versatile per i brand.', wp: ['lifestyle', 'content-creator', 'digital-creator', 'blogger', 'personal-blog', 'public-figure'] },
  { slug: 'home-influencers', name: 'Casa e design', short: 'Casa', kw: 'home influencer', lead: 'Arredo, design e organizzazione della casa raccontati con gusto.', wp: ['design'] },
  { slug: 'motori-influencers', name: 'Motori', short: 'Motori', kw: 'influencer motori', lead: 'Auto, moto e mobilità: creator competenti per un pubblico appassionato.', wp: [] },
  { slug: 'finanza-influencers', name: 'Finanza personale', short: 'Finanza', kw: 'finfluencer italiani', lead: 'Risparmio, investimenti e lavoro spiegati in modo semplice.', wp: [] },
  { slug: 'health-influencers', name: 'Salute e benessere', short: 'Salute', kw: 'influencer salute e benessere', lead: 'Benessere, prevenzione e stile di vita, anche con professionisti della salute.', wp: ['health', 'nutrizione'], title: 'Influencer salute e benessere italiani' },
  { slug: 'photography-influencers', name: 'Arte e fotografia', short: 'Arte', kw: 'influencer fotografia', lead: 'Fotografi, illustratori e artisti con un’estetica riconoscibile.', wp: ['photographer', 'photograph', 'photography', 'artist', 'art', 'model-photographer'], title: 'Fotografi e artisti influencer italiani' },
  { slug: 'book-influencers', name: 'Libri e cultura', short: 'Libri', kw: 'book influencer italiani', lead: 'Lettori, divulgatori e creator culturali per editoria ed eventi.', wp: ['cultura', 'editor', 'journalist', 'journalism'] },
  { slug: 'comic-influencers', name: 'Intrattenimento e comicità', short: 'Comicità', kw: 'influencer comici italiani', lead: 'Sketch, ironia e format virali che fanno girare il brand.', wp: ['comic', 'comedy', 'comedian', 'actor'], title: 'Influencer comici italiani' },
];

/* ─── Regioni e città (schema URL del vecchio sito, già indicizzato) ─
   /influencer-italiani/influencer-<regione>/influencer-<città>/        */
export interface City {
  slug: string;
  name: string;
  /** segmento dell'URL quando non è influencer-<slug> (es. il refuso indicizzato infleuncer-ravenna) */
  seg?: string;
  /** abitanti, usato nei title: "influencer napoletani" ha più ricerche di "influencer napoli" */
  demonym?: string;
}
export interface Region {
  slug: string;
  name: string;
  demonym?: string;
  cities: City[];
}
/** Regioni e città con gli slug esatti delle pagine già indicizzate su influencee.it (REST API, 21/10/2026),
 *  in ordine di clic da Search Console. */
export const REGIONS: Region[] = [
  { slug: 'lombardia', name: 'Lombardia', demonym: 'lombardi', cities: [{ slug: 'milano', name: 'Milano', demonym: 'milanesi' }, { slug: 'monza', name: 'Monza', demonym: 'monzesi' }, { slug: 'varese', name: 'Varese', demonym: 'varesini' }, { slug: 'como', name: 'Como', demonym: 'comaschi' }, { slug: 'bergamo', name: 'Bergamo', demonym: 'bergamaschi' }, { slug: 'brescia', name: 'Brescia', demonym: 'bresciani' }, { slug: 'pavia', name: 'Pavia' }, { slug: 'lecco', name: 'Lecco' }, { slug: 'lodi', name: 'Lodi' }, { slug: 'cremona', name: 'Cremona' }, { slug: 'mantova', name: 'Mantova' }] },
  { slug: 'emilia-romagna', name: 'Emilia-Romagna', demonym: 'emiliani', cities: [{ slug: 'bologna', name: 'Bologna', demonym: 'bolognesi' }, { slug: 'reggioemilia', name: 'Reggio Emilia' }, { slug: 'parma', name: 'Parma', demonym: 'parmigiani' }, { slug: 'piacenza', name: 'Piacenza' }, { slug: 'modena', name: 'Modena', demonym: 'modenesi' }, { slug: 'ferrara', name: 'Ferrara' }, { slug: 'forli-cesena', name: 'Forlì-Cesena' }, { slug: 'rimini', name: 'Rimini' }, { slug: 'infleuncer-ravenna', name: 'Ravenna', seg: 'infleuncer-ravenna' }] },
  { slug: 'veneto', name: 'Veneto', demonym: 'veneti', cities: [{ slug: 'venezia', name: 'Venezia', demonym: 'veneziani' }, { slug: 'padova', name: 'Padova', demonym: 'padovani' }, { slug: 'vicenza', name: 'Vicenza', demonym: 'vicentini' }, { slug: 'verona', name: 'Verona', demonym: 'veronesi' }, { slug: 'treviso', name: 'Treviso', demonym: 'trevigiani' }, { slug: 'belluno', name: 'Belluno' }, { slug: 'rovigo', name: 'Rovigo' }] },
  { slug: 'campania', name: 'Campania', demonym: 'campani', cities: [{ slug: 'napoli', name: 'Napoli', demonym: 'napoletani' }, { slug: 'salerno', name: 'Salerno', demonym: 'salernitani' }, { slug: 'benevento', name: 'Benevento' }, { slug: 'caserta', name: 'Caserta' }, { slug: 'avellino', name: 'Avellino' }] },
  { slug: 'toscana', name: 'Toscana', demonym: 'toscani', cities: [{ slug: 'firenze', name: 'Firenze', demonym: 'fiorentini' }, { slug: 'pisa', name: 'Pisa' }, { slug: 'livorno', name: 'Livorno' }, { slug: 'lucca', name: 'Lucca' }, { slug: 'pistoia', name: 'Pistoia' }, { slug: 'prato', name: 'Prato' }, { slug: 'arezzo', name: 'Arezzo' }, { slug: 'siena', name: 'Siena' }] },
  { slug: 'puglia', name: 'Puglia', demonym: 'pugliesi', cities: [{ slug: 'bari', name: 'Bari', demonym: 'baresi' }, { slug: 'lecce', name: 'Lecce', demonym: 'leccesi' }, { slug: 'foggia', name: 'Foggia' }, { slug: 'taranto', name: 'Taranto', demonym: 'tarantini' }, { slug: 'brindisi', name: 'Brindisi' }] },
  { slug: 'sicilia', name: 'Sicilia', demonym: 'siciliani', cities: [{ slug: 'catania', name: 'Catania', demonym: 'catanesi' }, { slug: 'palermo', name: 'Palermo', demonym: 'palermitani' }, { slug: 'siracusa', name: 'Siracusa' }, { slug: 'messina', name: 'Messina', demonym: 'messinesi' }, { slug: 'trapani', name: 'Trapani' }, { slug: 'ragusa', name: 'Ragusa' }, { slug: 'agrigento', name: 'Agrigento' }] },
  { slug: 'lazio', name: 'Lazio', demonym: 'laziali', cities: [{ slug: 'roma', name: 'Roma', demonym: 'romani' }, { slug: 'latina', name: 'Latina' }, { slug: 'frosinone', name: 'Frosinone' }, { slug: 'viterbo', name: 'Viterbo' }, { slug: 'rieti', name: 'Rieti' }] },
  { slug: 'abruzzo', name: 'Abruzzo', demonym: 'abruzzesi', cities: [{ slug: 'pescara', name: 'Pescara', demonym: 'pescaresi' }, { slug: 'teramo', name: 'Teramo' }, { slug: 'laquila', name: 'L’Aquila' }, { slug: 'chieti', name: 'Chieti' }] },
  { slug: 'marche', name: 'Marche', demonym: 'marchigiani', cities: [{ slug: 'ancona', name: 'Ancona' }, { slug: 'pesaro', name: 'Pesaro' }, { slug: 'ascoli-piceno', name: 'Ascoli Piceno' }, { slug: 'macerata', name: 'Macerata' }] },
  { slug: 'piemonte', name: 'Piemonte', demonym: 'piemontesi', cities: [{ slug: 'torino', name: 'Torino', demonym: 'torinesi' }, { slug: 'cuneo', name: 'Cuneo' }, { slug: 'alessandria', name: 'Alessandria' }, { slug: 'novara', name: 'Novara' }, { slug: 'asti', name: 'Asti' }] },
  { slug: 'liguria', name: 'Liguria', demonym: 'liguri', cities: [{ slug: 'genova', name: 'Genova', demonym: 'genovesi' }, { slug: 'la-spezia', name: 'La Spezia' }, { slug: 'savona', name: 'Savona' }, { slug: 'imperia', name: 'Imperia' }] },
  { slug: 'friuli-venezia-giulia', name: 'Friuli-Venezia Giulia', demonym: 'friulani', cities: [{ slug: 'pordenone', name: 'Pordenone' }, { slug: 'udine', name: 'Udine' }, { slug: 'trieste', name: 'Trieste', demonym: 'triestini' }, { slug: 'gorizia', name: 'Gorizia' }] },
  { slug: 'umbria', name: 'Umbria', demonym: 'umbri', cities: [{ slug: 'perugia', name: 'Perugia', demonym: 'perugini' }, { slug: 'terni', name: 'Terni' }] },
  { slug: 'trentino-alto-adige', name: 'Trentino-Alto Adige', demonym: 'trentini', cities: [{ slug: 'bolzano', name: 'Bolzano' }, { slug: 'trento', name: 'Trento' }] },
  { slug: 'calabria', name: 'Calabria', demonym: 'calabresi', cities: [{ slug: 'reggio-calabria', name: 'Reggio Calabria' }, { slug: 'cosenza', name: 'Cosenza' }, { slug: 'catanzaro', name: 'Catanzaro' }] },
  { slug: 'sardegna', name: 'Sardegna', demonym: 'sardi', cities: [{ slug: 'nuoro', name: 'Nuoro' }, { slug: 'cagliari', name: 'Cagliari', demonym: 'cagliaritani' }, { slug: 'sassari', name: 'Sassari' }] },
  { slug: 'valle-daosta', name: 'Valle d’Aosta', demonym: 'valdostani', cities: [{ slug: 'aosta', name: 'Aosta' }] },
  { slug: 'basilicata', name: 'Basilicata', demonym: 'lucani', cities: [{ slug: 'potenza', name: 'Potenza' }, { slug: 'matera', name: 'Matera' }] },
  { slug: 'molise', name: 'Molise', demonym: 'molisani', cities: [{ slug: 'campobasso', name: 'Campobasso' }] },
];
export const regionPath = (r: Region) => `/influencer-italiani/influencer-${r.slug}/`;
export const cityPath = (r: Region, ct: City) => `${regionPath(r)}${ct.seg ?? `influencer-${ct.slug}`}/`;


/* ─── Piani in vendita oggi (app: switch piani_2026 spento) ─────────
   ⚠ Se si accendono i piani 2026 (Base 35 €, Business 57 €, Illimitato
   99 € + IVA) aggiornare qui e la pagina /prezzi/.                      */
export const PLANS = [
  {
    name: 'Gratis',
    price: '0 €',
    period: 'per sempre',
    text: 'Per provare la ricerca e pubblicare annunci.',
    features: [`Ricerca creator con i primi ${FACTS.freeResults} risultati in chiaro`, 'Annunci di collaborazione nella bacheca pubblica', `${FACTS.freeLinks} link tracciati attivi`, 'Chat con i creator delle tue collab'],
    cta: 'Inizia gratis',
  },
  {
    name: 'Premium mensile',
    price: '19 €',
    period: 'al mese, IVA inclusa',
    text: 'Per chi cerca creator con continuità.',
    features: ['Tutti i risultati della ricerca', 'Filtri completi: categoria, città, fascia di follower', 'Contatti dei creator contattabili', 'Export CSV dei risultati', 'Link tracciati senza limiti'],
    cta: 'Prova 3 giorni gratis',
    featured: true,
  },
  {
    name: 'Premium trimestrale',
    price: '49 €',
    period: 'ogni 3 mesi, IVA inclusa',
    text: 'Le funzioni Premium a un prezzo più basso.',
    features: ['Tutto quello che c’è nel mensile', 'Circa 16 € al mese'],
    cta: 'Prova 3 giorni gratis',
  },
  {
    name: 'Premium annuale',
    price: '199 €',
    period: 'all’anno, IVA inclusa',
    text: 'La scelta più conveniente per brand e agenzie.',
    features: ['Tutto quello che c’è nel mensile', 'Circa 17 € al mese, due mesi risparmiati'],
    cta: 'Prova 3 giorni gratis',
  },
];

/* ─── Benchmark di mercato (app: rinnovo/benchmark_mercato.py) ─────
   Valori pubblicati con la loro origine: IT = fonte italiana, proxy =
   fonte estera o interpolazione, stima. Non cambiarli senza la fonte.   */
export type Origin = 'IT' | 'proxy' | 'stima';
export const MARKET = {
  tiers: ['Nano', 'Micro', 'Mid', 'Macro', 'Mega'], // stessi nomi delle fasce dell'app (TIERS); "VIP" è un tipo di creator, non una fascia
  costIG: [
    { v: 200, o: 'IT' as Origin, src: 'DeRev' },
    { v: 950, o: 'IT' as Origin, src: 'DeRev' },
    { v: 3550, o: 'IT' as Origin, src: 'DeRev' },
    { v: 8000, o: 'stima' as Origin, src: 'stima' },
    { v: 23750, o: 'IT' as Origin, src: 'DeRev' },
  ],
  costTT: [
    { v: 180, o: 'proxy' as Origin, src: 'proxy' },
    { v: 850, o: 'proxy' as Origin, src: 'proxy' },
    { v: 3200, o: 'proxy' as Origin, src: 'proxy' },
    { v: 7200, o: 'stima' as Origin, src: 'stima' },
    { v: 21000, o: 'proxy' as Origin, src: 'proxy' },
  ],
  erIG: [
    { v: 7.7, o: 'IT' as Origin, src: 'ONIM' },
    { v: 4.6, o: 'IT' as Origin, src: 'ONIM' },
    { v: 4.56, o: 'IT' as Origin, src: 'DeRev' },
    { v: 2.5, o: 'proxy' as Origin, src: 'interpolazione' },
    { v: 1.61, o: 'IT' as Origin, src: 'DeRev' },
  ],
  /** Formula prezzo dell'app (legacy, influencer/models calc_price): € per follower per fascia.
   *  Usata dal calcolatore come stima bassa; la stima alta è la media di mercato (costIG / costTT). */
  priceWeights: [
    { upTo: 1000, w: 0.036 },
    { upTo: 5000, w: 0.026 },
    { upTo: 10000, w: 0.016 },
    { upTo: 25000, w: 0.012 },
    { upTo: 50000, w: 0.009 },
    { upTo: 250000, w: 0.007 },
    { upTo: 500000, w: 0.005 },
    { upTo: 750000, w: 0.0045 },
    { upTo: 1000000, w: 0.003 },
    { upTo: Infinity, w: 0.0025 },
  ],
  /** Check sponsor: interazioni / visualizzazioni (rinnovo/views_strumenti.py). */
  sponsor: [
    { max: 1.5, label: 'Probabile contenuto sponsorizzato (reach a pagamento)', tone: 'bad' },
    { max: 1.9, label: 'Sotto la media: possibile mix di organico e ads', tone: 'warn' },
    { max: 2.7, label: 'Media organica sana', tone: 'ok' },
    { max: Infinity, label: 'Ottimo organico, potenziale virale', tone: 'great' },
  ],
  context: [
    { v: '425 mln €', l: 'mercato dell’influencer marketing in Italia nel 2026 (+10,4%)', src: 'Il Sole 24 Ore' },
  ],
};

/* ─── Sotto-categorie (classificazioni ulteriori dello stesso database) ──
   Pagine di WordPress con traffico (sport, luxury, wedding, model, imprenditori, artisti) che diventano viste
   filtrate dell'elenco dei creator, sotto una delle 18 categorie. `fill`: categorie affini mostrate insieme
   quando nel database ci sono ancora pochi profili con quella etichetta (lo dice il testo della pagina). */
export interface SubCategory extends Category {
  parent: string;
  fill?: string[];
}
export const SUBCATEGORIES: SubCategory[] = [
  { slug: 'sport-influencers', parent: 'fitness-influencers', name: 'Sport', short: 'Sport', kw: 'sport influencer italiani', lead: 'Atleti e creator sportivi: calcio, running, ciclismo, sport outdoor e da palestra, con community appassionate.', wp: ['sport', 'athlete'], title: 'Sport influencer e atleti italiani' },
  { slug: 'model-influencers', parent: 'fashion-influencers', name: 'Model', short: 'Model', kw: 'model influencer italiani', lead: 'Modelle e modelli che collaborano con brand di moda, beauty e lifestyle.', wp: ['model', 'model-photographer'], title: 'Model influencer italiani' },
  { slug: 'luxury-influencers', parent: 'fashion-influencers', name: 'Luxury', short: 'Luxury', kw: 'luxury influencer italiani', lead: 'Creator di moda, viaggi e lifestyle adatti a brand premium e luxury.', wp: ['luxury'], fill: ['fashion', 'travel', 'lifestyle'], title: 'Luxury influencer italiani' },
  { slug: 'wedding-influencers', parent: 'lifestyle-influencers', name: 'Wedding', short: 'Wedding', kw: 'wedding influencer italiani', lead: 'Creator per matrimoni e cerimonie: atelier, location, wedding planner e fornitori.', wp: ['wedding'], fill: ['fashion', 'lifestyle'], title: 'Wedding influencer italiani' },
  { slug: 'entrepreneur-influencers', parent: 'lifestyle-influencers', name: 'Imprenditori', short: 'Imprenditori', kw: 'imprenditori influencer', lead: 'Imprenditori e professionisti che raccontano business, carriera e progetti.', wp: ['entrepreneur'], title: 'Imprenditori influencer italiani' },
  { slug: 'artist-influencer', parent: 'photography-influencers', name: 'Artisti', short: 'Artist', kw: 'artist influencer italiani', lead: 'Artisti, illustratori e designer che portano i brand dentro progetti creativi.', wp: ['artist', 'art', 'design'], title: 'Artist influencer italiani' },
];
export const subcategoriesOf = (parent: string) => SUBCATEGORIES.filter((s) => s.parent === parent);

/* ─── Menu ──────────────────────────────────────────────────────── */
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
export const MENU: MenuGroup[] = [
  {
    label: 'Piattaforma',
    href: '#/piattaforma-influencer/',
    items: [
      { label: 'Panoramica', href: '#/piattaforma-influencer/', text: 'Cosa fa influencee, dalla ricerca al risultato' },
      { label: 'Database influencer', href: '#/funzionalita/database-influencer/', text: 'Cerca creator italiani con filtri e numeri' },
      { label: 'Campagne e collaborazioni', href: '#/funzionalita/gestione-campagne/', text: 'Brief, accordo, contratto e contenuti' },
      { label: 'Link tracciati', href: '#/funzionalita/link-tracciati/', text: 'Click e visitatori per ogni contenuto' },
      { label: 'Contratto', href: '#/funzionalita/contratto-influencer/', text: 'Generato dai termini accettati da entrambi' },
      { label: 'Calendario campagne', href: '#/funzionalita/calendario-campagne/', text: 'Scadenze e consegne di tutti i creator' },
      { label: 'Media kit', href: '#/funzionalita/media-kit/', text: 'Il media kit del creator, sempre aggiornato' },
      { label: 'Creator verificati', href: '#/creator-verificati/', text: 'Badge e fonte di ogni dato' },
    ],
  },
  {
    label: 'Soluzioni',
    items: [
      { label: 'Per le aziende', href: '#/influencer-marketing-aziende/', text: 'Trova creator e lancia campagne da solo' },
      { label: 'Per le agenzie', href: '#/piattaforma-agenzie/', text: 'Più clienti e campagne in un unico posto' },
      { label: 'Micro influencer', href: '#/micro-influencer/', text: 'Campagne con creator da 10 a 50 mila follower' },
      { label: 'Contenuti UGC', href: '#/contenuti-ugc/', text: 'Video dei creator per i tuoi canali e le ads' },
      { label: 'Campagne locali', href: '#/influencer-marketing-locale/', text: 'Ristoranti, negozi, palestre ed eventi' },
      { label: 'Creator professionisti', href: '#/creator-professionisti/', text: 'Medici, nutrizionisti, personal trainer' },
      { label: 'Campagna gestita da noi', href: '#/preventivo-campagne/', text: 'Preventivo online con il nostro listino' },
      { label: 'Per i creator', href: '#/diventa-creator/', text: 'Iscriviti gratis e ricevi proposte dai brand' },
      { label: 'UGC creator', href: '#/ugc-creator/', text: 'Lavora con i brand anche senza tanti follower' },
    ],
  },
  {
    label: 'Influencer italiani',
    href: '#/influencer-italiani/',
    wide: true,
    items: [{ label: 'Tutti gli influencer italiani', href: '#/influencer-italiani/', text: 'Per categoria, regione e città' }, ...CATEGORIES.slice(0, 9).map((k) => ({ label: k.short, href: `#/${k.slug}/` }))],
  },
  { label: 'Prezzi', href: '#/prezzi/' },
  {
    label: 'Risorse',
    items: [
      { label: 'Tool gratuiti', href: '#/social-media-tool/', text: 'Tutti i tool, senza registrazione' },
      { label: 'Fake follower checker', href: '#/followe-instagram-fake-follower/', text: 'Controlla un profilo in 1 minuto' },
      { label: 'Quanto costa un influencer', href: '#/social-media-tool/costo-influencer/', text: 'Calcolatore con la media di mercato' },
      { label: 'Calcolo engagement rate', href: '#/come-calcolare-engagement-rate/', text: 'Calcolatore gratuito e check sponsor' },
      { label: 'Benchmark engagement', href: '#/benchmark-engagement-rate/', text: 'Valori di riferimento per fascia' },
      { label: 'Offerte di lavoro', href: '#/offerte-lavoro-influencer/', text: 'Le offerte aperte dei brand' },
      { label: 'Blog', href: '#/blog/', text: 'Guide per brand e creator' },
    ],
  },
];

/* ─── FAQ riutilizzabili (risposte brevi e citabili: AEO) ────────── */
export type QA = { q: string; a: string };
export const FAQ = {
  piattaforma: [
    { q: 'Cos’è influencee?', a: 'Influencee è una piattaforma italiana per l’influencer marketing: le aziende e le agenzie cercano creator italiani con filtri e numeri, lanciano campagne e gestiscono accordo, contenuti e link tracciati in un unico posto. I creator si iscrivono gratis e ricevono proposte.' },
    { q: 'Influencee usa l’intelligenza artificiale?', a: 'No. Ricerca, categorie e fasce di follower seguono regole chiare e verificabili: ogni numero mostra da dove arriva e la data dell’ultimo aggiornamento.' },
    { q: 'Da dove arrivano i dati dei creator?', a: 'Dagli account che i creator collegano con il login ufficiale di Instagram, TikTok e YouTube, da quanto dichiarano in iscrizione e dalle fonti pubbliche. Ogni dato indica il livello: dichiarato, autenticato, osservato o stimato.' },
    { q: 'Ci sono creator stranieri?', a: 'No, il database contiene solo creator italiani. Le aziende possono iscriversi anche dall’estero.' },
  ] as QA[],
  brand: [
    { q: 'Quanto costa influencee per un’azienda?', a: `Puoi iniziare gratis. Premium costa 19 € al mese, 49 € a trimestre o 199 € all’anno, IVA inclusa, con ${FACTS.trialDays} giorni di prova senza carta. Il compenso del creator lo concordate voi in piattaforma.` },
    { q: 'Come trovo l’influencer giusto per il mio brand?', a: 'Filtra per categoria, città, fascia di follower, tipo di creator e piattaforma, poi apri la scheda: follower, engagement rispetto alla fascia, crescita a 30 e 90 giorni, contenuti e brand con cui ha già collaborato.' },
    { q: 'Posso pubblicare un annuncio e far candidare i creator?', a: 'Sì. Con l’annuncio veloce la tua offerta va online subito nella bacheca pubblica e i creator si candidano. In alternativa inviti direttamente i profili che hai scelto.' },
    { q: 'Potete gestire voi il progetto con i creator?', a: 'Sì. Se preferisci non usare la piattaforma in autonomia, il team di influencee può seguire il progetto per te: selezione dei creator, accordi, contenuti e risultati. Chiedi un preventivo su WhatsApp al +39 351 342 1629.' },
    { q: 'Che tipo di compenso posso offrire?', a: 'Compenso in denaro, cambio merce, affiliazione, formula ibrida, ospitalità o evento. Le condizioni sono scritte nell’accordo che accettate entrambi.' },
  ] as QA[],
  creator: [
    { q: 'Iscriversi a influencee costa?', a: 'No, per i creator l’iscrizione è gratuita. Ti servono pochi minuti: accesso con Google o email, chi sei, i tuoi social e, se vuoi, categorie e prezzi indicativi.' },
    { q: 'Quanti follower servono?', a: 'Nessun minimo. Con il profilo UGC lavori sui contenuti per i canali del brand, quindi conta la qualità dei video, non il numero di follower.' },
    { q: 'Pubblicate qualcosa sui miei social?', a: 'No. Il collegamento con Instagram, TikTok e YouTube è in sola lettura e serve a mostrare ai brand numeri verificati. Collegando un social ricevi il badge Verificato.' },
    { q: 'Come ricevo le proposte?', a: 'I brand ti invitano alle campagne o ti scrivono in chat, oppure ti candidi agli annunci aperti. Termini, scadenze e contenuti sono tutti nella collaborazione, con un contratto generato dalle condizioni accettate.' },
  ] as QA[],
};

/* ─── Bacheca offerte di lavoro ─────────────────────────────────────
   Offerte reali pubblicate nella vecchia bacheca (WP Job Manager) nel 2026.
   ⚠ In produzione la bacheca va collegata agli annunci aperti dell'app
   (app.influencee.it/annunci/): queste due voci servono solo finché
   il collegamento non c'è. Le offerte 2022 sono scadute e non si mostrano. */
export type Compenso = 'pagata' | 'cambio-merce' | 'percentuale' | 'collaborazione';
export interface Job {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  types: Compenso[];
  date: string; // ISO
  /** pagina dell'offerta (WP Job Manager) con il pulsante per candidarsi */
  url?: string;
}
export const COMPENSI: { k: Compenso; label: string }[] = [
  { k: 'pagata', label: 'Pagata' },
  { k: 'cambio-merce', label: 'Cambio merce' },
  { k: 'percentuale', label: '% sulle vendite' },
  { k: 'collaborazione', label: 'Collaborazione' },
];
export const JOBS: Job[] = [
  { title: 'Influencer per gadget, giocattoli e porcellane anni 80/90 in vendita su eBay', company: 'Magic House', location: 'Da remoto', remote: true, types: ['cambio-merce', 'collaborazione'], date: '2026-04-17' },
  { title: 'Creator per prodotti per cani e gatti: mangimi, accessori, profumi', company: 'Ingro Pet', location: 'Italia', remote: true, types: ['percentuale', 'cambio-merce', 'collaborazione'], date: '2026-02-18' },
];

/* ─── Listino del servizio gestito (campagne seguite dal team) ─────
   Fonte: calcolatore del vecchio sito /preventivo-campagne/.
   Confermato in chat dal titolare il 20/10/2026. Vale per creator fino a 70.000 follower. */
export const GESTITO = {
  maxFollower: 70000,
  creator: 500, // € al mese per influencer, primo contenuto
  extraContent: 475, // € per ogni contenuto in più dello stesso influencer (95% di 500)
  creatorFee: 250, // € di gestione per influencer
  ugc: 150, // € per video UGC
  ugcFee: 100, // € di gestione per video UGC
  oneMonthSurcharge: 0.1, // +10% se la campagna dura un mese
  discounts: { 1: 0, 3: 0.05, 6: 0.06, 12: 0.08 } as Record<number, number>,
};
