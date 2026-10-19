/**
 * FunnyGameRick — dati del media kit.
 *
 * QUESTO È L'UNICO FILE DA MODIFICARE per aggiornare i contenuti della pagina.
 *
 * Regole:
 * - Un dato sconosciuto si lascia `null` (o un array vuoto): la pagina lo nasconde da sola.
 *   Non scrivere mai 0 o numeri stimati al posto di un dato mancante.
 * - I numeri vanno inseriti come valori interi (es. 75200, non "75,2K"):
 *   la formattazione italiana la fa la pagina.
 * - Ogni volta che aggiorni le metriche, aggiorna anche `metricsUpdatedAt`.
 *
 * Fonti dei dati già presenti (verificati il 19/10/2026):
 * - Iscritti e numero video YouTube, link social, storia del canale: pagina pubblica
 *   https://www.youtube.com/@FunnyGameRick (descrizione e link del canale).
 * - Partnership: indicazioni fornite dal creator (brief di progetto).
 */

import type {
  AudienceData,
  CollaborationFormat,
  ContentPillar,
  CreatorData,
} from './types';

export type * from './types';

const contentPillars: ContentPillar[] = [
  {
    id: 'gameplay',
    title: 'Gameplay',
    description:
      'Serie walkthrough complete al 100%, storia e missioni secondarie incluse. In video o in live, dall’inizio ai titoli di coda.',
    tags: ['Walkthrough', 'Live', '100%'],
    icon: 'gamepad',
    size: 'large',
  },
  {
    id: 'short',
    title: 'Short form content',
    description:
      'Da 1 a 4 short al giorno: clip rapide, ironiche e pensate per TikTok, YouTube Shorts e Instagram Reels.',
    tags: ['TikTok', 'Shorts', 'Reels'],
    icon: 'zap',
    size: 'tall',
  },
  {
    id: 'meme',
    title: 'Meme & humor',
    description:
      'Ironia, trend e meme del mondo gaming. Contenuti leggeri, nati per strappare un sorriso.',
    tags: ['Meme', 'Trend', 'Ironia'],
    icon: 'laugh',
    size: 'regular',
  },
  {
    id: 'culture',
    title: 'Gaming culture',
    description:
      'L’immaginario videoludico e, quando ha senso, la cultura pop che gli gira intorno: anime, manga, saghe e personaggi.',
    tags: ['Pop culture', 'Anime', 'Manga'],
    icon: 'sparkles',
    size: 'regular',
  },
];

const collaborationFormats: CollaborationFormat[] = [
  {
    id: 'short-sponsored',
    title: 'Video brevi sponsorizzati',
    description: 'Short verticali nel suo stile, con il prodotto dentro la gag e non appiccicato sopra.',
    icon: 'smartphone',
  },
  {
    id: 'stories',
    title: 'Instagram Stories e integrazioni social',
    description: 'Stories, menzioni e contenuti di supporto per dare continuità alla campagna.',
    icon: 'layers',
  },
  {
    id: 'youtube-dedicated',
    title: 'Video YouTube e gameplay dedicati',
    description: 'Gameplay, prime impressioni o serie dedicate a un titolo, in video o in live.',
    icon: 'monitor-play',
  },
  {
    id: 'placement',
    title: 'Product placement e integrazioni branded',
    description: 'Integrazioni naturali dentro i contenuti abituali, anche fuori dal mondo gaming se coerenti.',
    icon: 'package',
  },
  {
    id: 'review',
    title: 'Test e presentazione di prodotti',
    description: 'Unboxing, prove sul campo e racconto onesto di periferiche, accessori e prodotti.',
    icon: 'scan-search',
  },
  {
    id: 'multiplatform',
    title: 'Campagne multipiattaforma',
    description: 'Un’unica idea declinata su YouTube, TikTok, Instagram e gli altri canali attivi.',
    icon: 'network',
  },
  {
    id: 'events',
    title: 'Eventi gaming, fiere e manifestazioni',
    description: 'Presenza a eventi, fiere e trasferte, con condizioni da concordare.',
    icon: 'map-pin',
  },
];

/**
 * Dati demografici: oggi nessun dato è stato fornito, quindi tutti gli array sono vuoti
 * e la pagina mostra un testo editoriale al posto dei grafici.
 * Per attivare i grafici basta compilare gli array (percentuali da 0 a 100) con i dati
 * presi da YouTube Studio / TikTok Analytics / Instagram Insights.
 *
 * Esempio (NON sono dati reali):
 *   ageRanges: [{ label: '18-24', value: 38 }, { label: '25-34', value: 31 }]
 */
const audience: AudienceData = {
  source: null, // es. 'YouTube Studio, ultimi 90 giorni'
  ageRanges: [],
  gender: [],
  topCountries: [],
  platformSplit: [],
  engagement: [],
};

export const creator: CreatorData = {
  name: 'FunnyGameRick',
  realName: 'Riccardo Buttitta',
  handle: '@FunnyGameRick',
  claim: 'Non solo un gamer.',
  bannerTagline: 'Storia · Secondarie · 100% · Meme',
  heroEyebrow: ['Gaming', 'Entertainment', 'Content creator'],
  heroSubtitle: 'Gameplay, ironia e contenuti che trasformano ogni partita in intrattenimento.',
  heroIntro:
    'Sono Riccardo, in arte FunnyGameRick. Ogni giorno pubblico short ironici e serie gameplay complete al 100%, e parlo direttamente con chi mi segue. È questo che porto nei progetti con i brand.',
  heroLabels: ['Gaming', 'Meme', 'Creator'],

  images: {
    avatar: {
      src: 'images/avatar-800.webp',
      srcSet: 'images/avatar-400.webp 400w, images/avatar-800.webp 800w',
      alt: 'Illustrazione ufficiale di FunnyGameRick: Riccardo con occhiali e un controller in mano',
      width: 800,
      height: 800,
    },
    banner: {
      src: 'images/banner-youtube.webp',
      alt: 'Banner del canale YouTube FunnyGameRick con la scritta "Non solo un gamer"',
      width: 2560,
      height: 424,
    },
    // Foto reale per la sezione "Dietro il controller". Lasciare null finché non viene fornita.
    aboutPhoto: null,
  },

  /** Fatti verificabili mostrati in hero e nella sezione "chi è". */
  highlights: [
    { value: '2022', label: 'Primo video, su TikTok' },
    { value: '1–4', label: 'Short pubblicati ogni giorno' },
    { value: '100%', label: 'Completamento dei giochi, secondarie incluse' },
  ],

  about: {
    paragraphs: [
      'FunnyGameRick nasce dalla voglia di rimettersi in gioco. Nel 2022, in un momento in cui Riccardo cercava una nuova strada, pubblica i primi video su TikTok quasi per curiosità. Alcuni girano molto più del previsto.',
      'Da lì il passo verso YouTube è breve: prima gli stessi short ironici, poi le serie walkthrough, completando i giochi al 100% con tutte le missioni secondarie. Più completista che cacciatore di trofei.',
      'Oggi FunnyGameRick unisce gameplay, meme e contenuti ironici. Riccardo scrive, registra e monta tutto da solo, e risponde personalmente ai messaggi della sua community.',
    ],
    pillars: [
      {
        title: 'Autenticità',
        description: 'Un’identità costruita in modo spontaneo, video dopo video, senza filtri da studio.',
      },
      {
        title: 'Creatività',
        description: 'Gameplay, ironia e nuovi format: lo stesso gioco raccontato in modi diversi.',
      },
      {
        title: 'Community',
        description: 'Un rapporto diretto: commenti e messaggi hanno una risposta, e la dà lui.',
      },
    ],
  },

  /**
   * Metriche. `value: null` = dato non disponibile → la card non viene mostrata.
   * `approximate: true` mostra il valore come arrotondato (es. "75,2K").
   */
  metricsUpdatedAt: '2026-10-19',
  metricsSource: 'Dati pubblici delle piattaforme',
  platforms: [
    {
      id: 'youtube',
      label: 'YouTube',
      handle: '@FunnyGameRick',
      url: 'https://www.youtube.com/@FunnyGameRick',
      metrics: [
        { label: 'Iscritti', value: 75200, approximate: true, primary: true },
        { label: 'Video pubblicati', value: 6600, approximate: true },
      ],
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      handle: '@riccardobuttitta91',
      url: 'https://www.tiktok.com/@riccardobuttitta91',
      metrics: [{ label: 'Follower', value: null, primary: true }],
    },
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@funnygamerick',
      url: 'https://www.instagram.com/funnygamerick',
      metrics: [{ label: 'Follower', value: null, primary: true }],
    },
    {
      id: 'twitch',
      label: 'Twitch',
      handle: 'funnygamerick',
      url: 'https://www.twitch.tv/funnygamerick',
      metrics: [{ label: 'Follower', value: null, primary: true }],
    },
    {
      id: 'facebook',
      label: 'Facebook',
      handle: 'Riccardo Buttitta',
      url: 'https://www.facebook.com/riccardo.buttitta.14',
      metrics: [{ label: 'Follower', value: null, primary: true }],
    },
    {
      id: 'telegram',
      label: 'Telegram',
      handle: 't.me/FunnyGameRick',
      url: 'https://t.me/FunnyGameRick',
      metrics: [{ label: 'Iscritti', value: null, primary: true }],
      showInStats: false,
    },
  ],

  /** Metriche aggregate: compilare quando disponibili, altrimenti restano nascoste. */
  aggregateMetrics: [
    { label: 'Visualizzazioni medie per video', value: null },
    { label: 'Reach mensile', value: null },
    { label: 'Engagement rate', value: null, unit: '%' },
  ],

  contentPillars,

  /**
   * Partnership. `kind` distingue la natura del rapporto: non tutto è una sponsorizzazione.
   *  - 'creator-program'  → programma creator dell'editore
   *  - 'game-access'      → accesso a giochi/codici tramite piattaforma
   *  - 'commercial'       → collaborazione commerciale confermata
   *  - 'affiliate'        → programma di affiliazione
   * `logo` resta null finché non ci sono loghi ufficiali utilizzabili.
   */
  partnerships: [
    {
      name: 'Ubisoft Creator Program',
      kind: 'creator-program',
      description: 'Partecipazione al programma creator di Ubisoft, con accesso a titoli e contenuti dell’editore.',
      logo: null,
    },
    {
      name: 'Deep Silver Collective',
      kind: 'creator-program',
      description: 'Partecipazione alle iniziative creator di Deep Silver, tra cui quelle legate a Kingdom Come: Deliverance II.',
      logo: null,
      highlight: 'Kingdom Come: Deliverance II',
    },
    {
      name: 'Keymailer',
      kind: 'game-access',
      description: 'Utilizzo della piattaforma per ricevere codici e opportunità legate all’uscita di nuovi videogiochi.',
      logo: null,
    },
  ],
  affiliatePrograms: {
    note: 'Programmi di affiliazione attivi, dichiarati pubblicamente sul canale:',
    names: ['Amazon', 'Instant Gaming', 'AliExpress', 'Shein'],
  },

  audience,
  communityNote:
    'Dietro i numeri ci sono persone vere. Riccardo legge i commenti, risponde ai messaggi e costruisce i contenuti anche a partire da quello che chiede la sua community. Per un brand significa parlare a un pubblico che si fida della voce che lo racconta.',

  collaborationFormats,
  collaborationNote:
    'Ogni collaborazione viene progettata sugli obiettivi del brand e sulla coerenza con il pubblico di FunnyGameRick. Nessun pacchetto preconfezionato: si parte da un’idea e la si costruisce insieme.',
  eventsNote: 'Disponibile per eventi e trasferte, con condizioni da concordare.',

  /**
   * Contenuti in evidenza. Array vuoto = sezione "Press play" nascosta.
   * Il primo elemento diventa la card grande. Esempio di voce (sostituire con link reali):
   * {
   *   title: 'Titolo del video',
   *   platform: 'youtube',             // 'youtube' | 'tiktok' | 'instagram' | 'twitch'
   *   url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
   *   thumbnail: 'images/video-1.webp', // opzionale: per YouTube viene ricavata dal link
   *   meta: 'Walkthrough · Episodio 1', // opzionale
   * }
   */
  featuredContent: [],

  contact: {
    /** Email professionale. null = nessun pulsante email (la CTA usa `fallbackUrl`). */
    email: null,
    /** Canale da usare per la CTA quando l'email non è ancora disponibile. */
    fallbackUrl: 'https://www.instagram.com/funnygamerick',
    fallbackLabel: 'Scrivi su Instagram',
    fallbackNote: 'Per un primo contatto, scrivi in direct su Instagram.',
    emailSubject: 'Proposta di collaborazione — FunnyGameRick',
    /** Altri link utili mostrati nel footer (non social). */
    extraLinks: [{ label: 'Linktree', url: 'https://linktr.ee/RICCARDOBUTTITTA' }],
  },

  seo: {
    title: 'FunnyGameRick | Gaming Creator & Media Kit',
    description:
      'Scopri FunnyGameRick, content creator italiano tra gaming, gameplay, meme e intrattenimento. Esplora il media kit e proponi una collaborazione.',
  },
};
