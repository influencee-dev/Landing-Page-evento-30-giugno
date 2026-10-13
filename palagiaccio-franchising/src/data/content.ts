/* ==========================================================================
   TESTI DELLA LANDING
   Fonte vincolante: documento "Landing Page Palagiaccio – Testi".
   Modificare qui i testi: i componenti non contengono copy.
   I dati economici sono in ./franchise.ts.
   ========================================================================== */

export const site = {
  brand: 'Il Palagiaccio',
  officialUrl: 'https://palagiaccio.com/',
  officialUrlLabel: 'palagiaccio.com',
  /** ⚠ Da verificare: link all'informativa privacy pubblicata sul sito ufficiale. */
  privacyUrl: 'https://suite.vivocreativo.com/WEMSDhbSQ15SfTVwQaXZoaw8x3pkwcHp/privacy_it.html',
  /** Dati societari come riportati nel footer di palagiaccio.com. */
  company: 'Storica Fattoria Palagiaccio s.s.a.',
  vat: 'P.IVA 06083140480',
};

export const nav = [
  { id: 'storia', label: 'La storia' },
  { id: 'format', label: 'Il format' },
  { id: 'prodotti', label: 'Prodotti' },
  { id: 'investimento', label: 'Investimento' },
  { id: 'supporto', label: 'Supporto' },
  { id: 'percorso', label: 'Percorso' },
] as const;

export const ctas = {
  primary: 'Scopri come affiliarti',
  dossier: 'Richiedi il dossier franchising',
  submit: 'Richiedi informazioni sul franchising',
  header: 'Richiedi informazioni',
  sticky: 'Richiedi informazioni',
  formAnchor: 'contatti',
};

/* 01 — HERO ------------------------------------------------------------- */
export const hero = {
  label: 'Il Palagiaccio Franchising',
  kicker: 'Dal 1100, la bontà del Mugello. Oggi, una nuova opportunità di impresa.',
  /** H1: "Apri la tua Bottega Il Palagiaccio." (la seconda parte è evidenziata in bordeaux) */
  title: 'Apri la tua',
  titleAccent: 'Bottega Il\u00a0Palagiaccio.',
  paragraphs: [
    'Entra nel settore della gastronomia premium con un marchio storico toscano, una filiera produttiva interna e un modello di business che unisce vendita di prodotti tipici, specialità gastronomiche e degustazioni.',
    "Un format pensato per portare nelle città italiane l'autenticità del Mugello, attraverso botteghe moderne, riconoscibili e organizzate per una gestione efficiente.",
  ],
  investmentLabel: 'Investimento a partire da',
  secondaryLink: 'Scopri il format',
};

/* 02 — STORIA ----------------------------------------------------------- */
export const story = {
  label: 'La storia',
  title: 'Una storia dal 1100. Un business per il futuro.',
  kicker: 'Dal cuore della Toscana nasce un nuovo modo di fare impresa nel food.',
  year: '1100',
  paragraphs: [
    "A nord di Firenze si estende il Mugello, una delle vallate più caratteristiche della Toscana. Terra d'origine della famiglia Medici e luogo natale di grandi artisti come Giotto e Beato Angelico, è un territorio nel quale storia, cultura e tradizione agricola convivono da secoli.",
    'Proprio qui, nel 1100, affondano le radici della Fattoria Il Palagiaccio.',
    "Da questa storia secolare è nata un'azienda che ha saputo evolversi, investendo nella produzione, nella trasformazione e nella vendita diretta dei propri prodotti.",
    'Oggi Il Palagiaccio dispone di una filiera interna completa, dal latte alla lavorazione casearia, fino alla distribuzione e alla vendita nelle proprie botteghe.',
    "Una storia autentica, una competenza produttiva consolidata e un'identità territoriale distintiva costituiscono le fondamenta del nuovo progetto franchising.",
  ],
  closing: "Il nostro obiettivo è semplice: portare l'eccellenza gastronomica del Mugello in tutta Italia, una bottega alla volta.",
  /** Filiera citata nel testo, resa come sequenza tipografica. */
  chain: ['Latte', 'Lavorazione casearia', 'Distribuzione', 'Vendita in bottega'],
};

/* 03 — FORMAT ----------------------------------------------------------- */
export const format = {
  label: 'Il format',
  title: "Non una semplice bottega. Un'esperienza gastronomica toscana.",
  paragraphs: [
    "La Bottega Il Palagiaccio è un format retail che combina la vendita di prodotti alimentari premium con un'esperienza di degustazione pensata per valorizzare l'assortimento e creare nuove occasioni di consumo.",
    "Un ambiente caldo e contemporaneo, nel quale il banco formaggi e salumi rappresenta il cuore dell'attività, affiancato da prodotti gastronomici selezionati, specialità toscane e proposte regalo.",
  ],
  intro: 'Il modello integra tre opportunità commerciali:',
  pillars: [
    {
      number: '01',
      title: 'Vendita al dettaglio',
      text: 'Formaggi freschi e stagionati, latticini, salumi e specialità alimentari per gli acquisti quotidiani e le occasioni speciali.',
      imageKey: 'formatRetail',
    },
    {
      number: '02',
      title: 'Degustazioni e gastronomia',
      text: 'Taglieri, assaggi e proposte gastronomiche semplici, pensate per aumentare le occasioni di visita e valorizzare i prodotti della bottega, senza le complessità di una cucina tradizionale.',
      imageKey: 'formatTasting',
      /** ⚠ Note strategiche: verificare configurazione operativa e requisiti autorizzativi delle degustazioni. */
      needsReview: true,
    },
    {
      number: '03',
      title: 'Confezioni regalo e vendita corporate',
      text: 'Box gastronomiche, selezioni premium e confezioni dedicate a regali personali e aziendali, con opportunità commerciali legate anche alle principali ricorrenze.',
      imageKey: 'formatGifts',
    },
  ],
  closing: 'Un unico punto vendita, diverse occasioni di acquisto.',
} as const;

/* 04 — PERCHÉ SCEGLIERE -------------------------------------------------- */
export const advantages = {
  label: 'Perché scegliere Il Palagiaccio?',
  title: 'Un progetto imprenditoriale che parte da vantaggi concreti.',
  items: [
    {
      title: 'Una storia autentica dal 1100',
      text: "Un'identità costruita attraverso secoli di tradizione agricola e casearia nel Mugello, capace di distinguere il marchio dalle proposte gastronomiche più generiche.",
    },
    {
      title: 'Una filiera produttiva interna',
      text: 'Il Palagiaccio gestisce direttamente importanti fasi della produzione, della trasformazione e della distribuzione, offrendo agli affiliati accesso a una gamma di prodotti a marchio proprio.',
    },
    {
      title: 'Prodotti distintivi e riconoscibili',
      text: 'Fior di Mugello, Gran Mugello, Blu Mugello e altre specialità rappresentano il cuore di un assortimento selezionato, progettato per valorizzare qualità, provenienza e identità del brand.',
    },
    {
      title: 'Un modello già sperimentato nella vendita diretta',
      text: "Il progetto franchising nasce dall'esperienza maturata nella gestione dei punti vendita esistenti, con l'obiettivo di trasferire procedure, competenze e strumenti operativi ai nuovi affiliati.",
    },
    {
      title: 'Un format organizzato per essere replicabile',
      text: "Layout modulari, assortimento definito, procedure standardizzate e formazione permettono di affrontare l'attività con un modello di gestione strutturato.",
    },
    {
      title: 'Il supporto di una Casa Madre produttrice',
      text: "L'affiliato non deve costruire autonomamente la propria rete di approvvigionamento per i prodotti principali: può contare sulla fornitura diretta e sull'assistenza della Casa Madre.",
    },
  ],
};

/* 05 — PRODOTTI --------------------------------------------------------- */
export const products = {
  label: 'I prodotti',
  title: 'Il Mugello è il nostro territorio. La qualità è il nostro prodotto.',
  intro:
    "Il cuore della Bottega Il Palagiaccio è un assortimento selezionato di circa 150 referenze, organizzato per valorizzare i prodotti distintivi del marchio e semplificare la gestione commerciale.",
  referencesLabel: 'referenze in assortimento',
  listTitle: "L'offerta comprende:",
  categories: [
    'Formaggi freschi, semistagionati e stagionati.',
    'Latte, yogurt, ricotte e specialità lattiero-casearie.',
    'Salumi e prodotti gastronomici selezionati.',
    'Pasta fresca, conserve e specialità toscane.',
    'Vini, oli e prodotti complementari.',
    'Taglieri, degustazioni e confezioni regalo.',
  ],
  /** Specialità citate nel documento (sezione "Perché scegliere"). */
  signatureLabel: 'Le specialità del marchio',
  signatures: ['Fior di Mugello', 'Gran Mugello', 'Blu Mugello'],
  signatureNote: 'e altre specialità',
  sourcingTitle: 'Modello di approvvigionamento indicativo',
  sourcingText:
    "Il modello di approvvigionamento prevede indicativamente l'80% dell'assortimento attraverso la Casa Madre e il restante 20% attraverso prodotti territoriali selezionati e approvati.",
  sourcingCasaMadre: 'attraverso la Casa Madre',
  sourcingTerritorio: 'prodotti territoriali selezionati e approvati',
  closing: 'Un catalogo pensato per coniugare riconoscibilità, varietà e gestione efficiente delle scorte.',
};

/* 06 — OPPORTUNITÀ ------------------------------------------------------ */
export const opportunity = {
  label: "L'opportunità franchising",
  title: 'Quanto costa aprire una Bottega Il Palagiaccio?',
  intro:
    'Il progetto prevede due configurazioni, pensate per adattarsi a differenti disponibilità di spazio e capacità di investimento.',
  conditionsTitle: 'Le condizioni di affiliazione',
  conditionsClosing:
    "Un'offerta strutturata per consentire al candidato di valutare fin dalle prime fasi l'impegno economico e organizzativo richiesto.",
};

/* 07 — SUPPORTO --------------------------------------------------------- */
export const support = {
  label: 'Il supporto della Casa Madre',
  title: 'La tua impresa. La nostra esperienza al tuo fianco.',
  intro:
    "Aprire una Bottega Il Palagiaccio significa entrare in un sistema organizzato, nel quale la Casa Madre mette a disposizione strumenti, competenze e servizi per accompagnare l'affiliato dall'avvio alla gestione ordinaria.",
  services: [
    {
      title: 'Progettazione del punto vendita',
      text: "Supporto nella definizione del layout, dell'organizzazione degli spazi, degli arredi e dell'immagine coordinata della bottega.",
    },
    {
      title: 'Formazione iniziale',
      text: 'Un percorso dedicato alla conoscenza dei prodotti, alle tecniche di vendita, al servizio al banco, alla gestione delle scorte e alle procedure operative.',
    },
    {
      title: 'Manuale operativo',
      text: "Procedure e standard per la gestione quotidiana, dalla conservazione dei prodotti all'esposizione, dalla vendita alla qualità del servizio.",
    },
    {
      title: 'Fornitura diretta',
      text: 'Accesso al catalogo della Casa Madre e a un sistema di approvvigionamento strutturato per le principali categorie merceologiche.',
    },
    {
      title: 'Marketing e comunicazione',
      text: "Materiali grafici, contenuti digitali, strumenti promozionali e indicazioni per sviluppare la comunicazione del punto vendita in coerenza con l'identità del brand.",
    },
    {
      title: 'Assistenza continuativa',
      text: "Affiancamento durante l'apertura, supporto gestionale, visite periodiche e attività di verifica degli standard operativi.",
    },
  ],
  closing: "Non parti da zero. Parti dall'esperienza di chi questo lavoro lo conosce da generazioni.",
};

/* 08 — A CHI CI RIVOLGIAMO ---------------------------------------------- */
export const audience = {
  label: 'A chi ci rivolgiamo',
  title: 'Cerchiamo imprenditori che condividano la nostra idea di qualità.',
  paragraphs: [
    "Il Palagiaccio Franchising si rivolge a persone interessate a sviluppare un'attività commerciale nel settore alimentare, valorizzando prodotti distintivi, servizio al cliente e attenzione alla gestione.",
    "Non è indispensabile provenire dal settore caseario. Sono invece importanti l'attitudine commerciale, la capacità organizzativa e la disponibilità a seguire direttamente o attraverso personale qualificato le attività della bottega.",
  ],
  listTitle: 'Il candidato ideale:',
  traits: [
    'Ha spirito imprenditoriale e orientamento al cliente.',
    'È interessato al settore food e ai prodotti gastronomici di qualità.',
    "Dispone delle risorse necessarie per sostenere l'investimento.",
    'Condivide gli standard e i valori del marchio.',
    'È disposto a seguire un percorso di formazione e ad applicare le procedure della rete.',
  ],
  closing: [
    'La conoscenza del prodotto si può acquisire.',
    "La voglia di costruire un'impresa deve essere già tua.",
  ],
};

/* 09 — PERCORSO --------------------------------------------------------- */
export const journey = {
  label: 'Come aprire la tua bottega',
  title: "Dalla candidatura all'apertura, un percorso condiviso.",
  steps: [
    {
      number: '01',
      title: 'Primo contatto',
      text: 'Compila il modulo e raccontaci il tuo progetto. Il nostro team ti contatterà per una prima valutazione conoscitiva.',
    },
    {
      number: '02',
      title: "Approfondimento dell'opportunità",
      text: 'Ti presenteremo il format, il modello di affiliazione, i servizi offerti e le condizioni economiche previste.',
    },
    {
      number: '03',
      title: 'Valutazione del territorio e del locale',
      text: 'Analizzeremo insieme la zona di interesse e le caratteristiche del punto vendita, per verificare la compatibilità con gli standard del format.',
    },
    {
      number: '04',
      title: 'Progettazione e formazione',
      text: "Definiremo il progetto della bottega e organizzeremo il percorso formativo necessario per preparare l'avvio dell'attività.",
    },
    {
      number: '05',
      title: 'Apertura e affiancamento',
      text: "La Casa Madre accompagnerà l'affiliato nelle attività di avvio e nelle prime fasi di gestione, con il supporto previsto dal sistema franchising.",
    },
  ],
};

/* 10 — CTA FINALE E MODULO ---------------------------------------------- */
export const contact = {
  label: 'Contatti',
  title: 'Porta il Mugello nella tua città.',
  subtitle: 'Apri la tua Bottega Il Palagiaccio.',
  text: 'Un marchio con una storia secolare, prodotti distintivi, una filiera produttiva interna e un format commerciale pensato per crescere attraverso una rete di imprenditori.',
  investmentLabel: 'Investimento a partire da',
  invite:
    'Compila il modulo per ricevere maggiori informazioni sul progetto franchising, conoscere le condizioni di affiliazione e valutare insieme al nostro team la possibilità di aprire una Bottega Il Palagiaccio.',
  formTitle: 'Modulo di contatto',
  fields: {
    name: 'Nome e cognome',
    email: 'Email',
    phone: 'Numero di telefono',
    city: 'Città o provincia di interesse',
    investment: 'Disponibilità di investimento',
    investmentPlaceholder: 'Seleziona un’opzione',
    message: 'Messaggio',
    messageOptional: '(facoltativo)',
    /** ⚠ Testo del consenso da validare con il consulente privacy del cliente. */
    privacyBefore: 'Ho letto e accetto l’',
    privacyLink: 'informativa privacy',
    privacyAfter: ' e acconsento al trattamento dei dati per essere ricontattato in merito al progetto franchising.',
  },
  disclaimer:
    "L'invio della richiesta non comporta alcun impegno di affiliazione. I dati saranno trattati secondo l'informativa privacy.",
  requiredNote: 'Tutti i campi sono obbligatori, salvo il messaggio.',
  status: {
    sending: 'Invio in corso…',
    successTitle: 'Richiesta inviata.',
    successText:
      'Grazie per il tuo interesse verso il progetto franchising Il Palagiaccio. Il nostro team ti contatterà per una prima valutazione conoscitiva.',
    errorTitle: 'Non è stato possibile inviare la richiesta.',
    errorText: 'Verifica la connessione e riprova tra qualche istante.',
    previewTitle: 'Modalità anteprima — nessun dato è stato inviato.',
    previewText:
      'Il modulo non è ancora collegato a un sistema di raccolta richieste. I dati inseriti sono validi ma non sono stati trasmessi né salvati.',
    invalidSummary: 'Controlla i campi evidenziati.',
  },
};

/* 11 — FOOTER ----------------------------------------------------------- */
export const footer = {
  title: 'Il Palagiaccio — Bontà dal Mugello',
  text: 'Dal 1100, una storia di territorio, tradizione e qualità. Oggi, un progetto imprenditoriale da condividere.',
  officialSite: 'Sito ufficiale',
  privacy: 'Privacy',
  franchising: 'Franchising',
};
