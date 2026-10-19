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

/** Fatti verificati nel codice dell'app: gli unici numeri da usare. */
export const FACTS = {
  trialDays: 3,
  freeResults: 5,
  freeLinks: 10,
  maxCategories: 5,
  categories: 18,
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
}
export const CATEGORIES: Category[] = [
  { slug: 'food-influencers', name: 'Cucina e food', short: 'Food', kw: 'food influencer italiani', lead: 'Chef, food creator e appassionati di cucina che raccontano ricette, locali e prodotti.' },
  { slug: 'travel-influencers', name: 'Viaggi', short: 'Travel', kw: 'travel influencer italiani', lead: 'Creator di viaggio che ispirano weekend, destinazioni e prenotazioni.' },
  { slug: 'fashion-influencers', name: 'Moda', short: 'Fashion', kw: 'fashion influencer italiani', lead: 'Outfit, tendenze e brand emergenti: profili per collezioni e campagne stagionali.' },
  { slug: 'beauty-influencers', name: 'Beauty', short: 'Beauty', kw: 'beauty influencer italiani', lead: 'Skincare, make-up e routine raccontati da creator seguiti per i loro consigli.' },
  { slug: 'fitness-influencers', name: 'Fitness e sport', short: 'Fitness', kw: 'fitness influencer italiani', lead: 'Allenamento, sport e nutrizione con community motivate e attive.' },
  { slug: 'tech-influencers', name: 'Tecnologia', short: 'Tech', kw: 'tech influencer italiani', lead: 'Recensioni, unboxing e tutorial su prodotti e servizi digitali.' },
  { slug: 'gaming-influencers', name: 'Gaming', short: 'Gaming', kw: 'gaming influencer italiani', lead: 'Streamer e gamer con community fedeli su YouTube e TikTok.' },
  { slug: 'family-influencers', name: 'Famiglia e genitorialità', short: 'Family', kw: 'mamme influencer', lead: 'Genitori che raccontano quotidianità, casa e prodotti per i più piccoli.' },
  { slug: 'pet-influencers', name: 'Animali', short: 'Pet', kw: 'pet influencer', lead: 'Cani, gatti e i loro umani: contenuti amati e molto condivisi.' },
  { slug: 'music-influencers', name: 'Musica', short: 'Musica', kw: 'music influencer', lead: 'Musicisti e creator musicali per lanci, eventi e campagne audio.' },
  { slug: 'lifestyle-influencers', name: 'Lifestyle', short: 'Lifestyle', kw: 'lifestyle influencer italiani', lead: 'Vita quotidiana, consigli e scoperte: il formato più versatile per i brand.' },
  { slug: 'home-influencers', name: 'Casa e design', short: 'Casa', kw: 'home influencer', lead: 'Arredo, design e organizzazione della casa raccontati con gusto.' },
  { slug: 'motori-influencers', name: 'Motori', short: 'Motori', kw: 'influencer motori', lead: 'Auto, moto e mobilità: creator competenti per un pubblico appassionato.' },
  { slug: 'finanza-influencers', name: 'Finanza personale', short: 'Finanza', kw: 'finfluencer italiani', lead: 'Risparmio, investimenti e lavoro spiegati in modo semplice.' },
  { slug: 'salute-influencers', name: 'Salute e benessere', short: 'Salute', kw: 'influencer salute e benessere', lead: 'Benessere, prevenzione e stile di vita, anche con professionisti della salute.' },
  { slug: 'arte-influencers', name: 'Arte e fotografia', short: 'Arte', kw: 'influencer fotografia', lead: 'Fotografi, illustratori e artisti con un’estetica riconoscibile.' },
  { slug: 'book-influencers', name: 'Libri e cultura', short: 'Libri', kw: 'book influencer italiani', lead: 'Lettori, divulgatori e creator culturali per editoria ed eventi.' },
  { slug: 'comici-influencers', name: 'Intrattenimento e comicità', short: 'Comicità', kw: 'influencer comici italiani', lead: 'Sketch, ironia e format virali che fanno girare il brand.' },
];

/* ─── Regioni e città (schema URL del vecchio sito, già indicizzato) ─
   /influencer-italiani/influencer-<regione>/influencer-<città>/        */
export interface Region {
  slug: string;
  name: string;
  cities: { slug: string; name: string }[];
}
const c = (name: string) => ({ slug: name.toLowerCase().replace(/[’'\s]+/g, '-'), name });
export const REGIONS: Region[] = [
  { slug: 'lombardia', name: 'Lombardia', cities: [c('Milano'), c('Bergamo'), c('Brescia')] },
  { slug: 'lazio', name: 'Lazio', cities: [c('Roma'), c('Latina')] },
  { slug: 'campania', name: 'Campania', cities: [c('Napoli'), c('Salerno')] },
  { slug: 'sicilia', name: 'Sicilia', cities: [c('Palermo'), c('Catania')] },
  { slug: 'veneto', name: 'Veneto', cities: [c('Venezia'), c('Verona'), c('Padova')] },
  { slug: 'emilia-romagna', name: 'Emilia-Romagna', cities: [c('Bologna'), c('Modena'), c('Rimini')] },
  { slug: 'piemonte', name: 'Piemonte', cities: [c('Torino')] },
  { slug: 'puglia', name: 'Puglia', cities: [c('Bari'), c('Lecce'), c('Foggia')] },
  { slug: 'toscana', name: 'Toscana', cities: [c('Firenze'), c('Pisa')] },
  { slug: 'liguria', name: 'Liguria', cities: [c('Genova')] },
  { slug: 'sardegna', name: 'Sardegna', cities: [c('Cagliari')] },
  { slug: 'calabria', name: 'Calabria', cities: [c('Reggio Calabria'), c('Cosenza')] },
  { slug: 'marche', name: 'Marche', cities: [c('Ancona')] },
  { slug: 'abruzzo', name: 'Abruzzo', cities: [c('Pescara')] },
  { slug: 'friuli-venezia-giulia', name: 'Friuli-Venezia Giulia', cities: [c('Trieste'), c('Udine')] },
  { slug: 'trentino-alto-adige', name: 'Trentino-Alto Adige', cities: [c('Trento'), c('Bolzano')] },
  { slug: 'umbria', name: 'Umbria', cities: [c('Perugia')] },
  { slug: 'basilicata', name: 'Basilicata', cities: [c('Potenza'), c('Matera')] },
  { slug: 'molise', name: 'Molise', cities: [c('Campobasso')] },
  { slug: 'valle-d-aosta', name: 'Valle d’Aosta', cities: [c('Aosta')] },
];

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
      { label: 'Media kit', href: '#/funzionalita/media-kit/', text: 'Il media kit del creator, sempre aggiornato' },
      { label: 'Benchmark engagement', href: '#/benchmark-engagement-rate/', text: 'Valori di riferimento e check sponsor' },
    ],
  },
  {
    label: 'Soluzioni',
    items: [
      { label: 'Per le aziende', href: '#/influencer-marketing-aziende/', text: 'Trova creator e lancia campagne da solo' },
      { label: 'Per le agenzie', href: '#/piattaforma-agenzie/', text: 'Più clienti e campagne in un unico posto' },
      { label: 'Micro influencer', href: '#/micro-influencer/', text: 'Campagne con creator da 10 a 50 mila follower' },
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
  { label: 'Blog', href: '#/blog/' },
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
    { q: 'Che tipo di compenso posso offrire?', a: 'Compenso in denaro, cambio merce, affiliazione, formula ibrida, ospitalità o evento. Le condizioni sono scritte nell’accordo che accettate entrambi.' },
  ] as QA[],
  creator: [
    { q: 'Iscriversi a influencee costa?', a: 'No, per i creator l’iscrizione è gratuita. Ti servono pochi minuti: accesso con Google o email, chi sei, i tuoi social e, se vuoi, categorie e prezzi indicativi.' },
    { q: 'Quanti follower servono?', a: 'Nessun minimo. Con il profilo UGC lavori sui contenuti per i canali del brand, quindi conta la qualità dei video, non il numero di follower.' },
    { q: 'Pubblicate qualcosa sui miei social?', a: 'No. Il collegamento con Instagram, TikTok e YouTube è in sola lettura e serve a mostrare ai brand numeri verificati. Collegando un social ricevi il badge Verificato.' },
    { q: 'Come ricevo le proposte?', a: 'I brand ti invitano alle campagne o ti scrivono in chat, oppure ti candidi agli annunci aperti. Termini, scadenze e contenuti sono tutti nella collaborazione, con un contratto generato dalle condizioni accettate.' },
  ] as QA[],
};
