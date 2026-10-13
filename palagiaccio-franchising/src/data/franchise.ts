/* ==========================================================================
   DATI ECONOMICI E CONDIZIONI DI AFFILIAZIONE
   Unico file da modificare per investimenti, superfici e condizioni.
   Fonte: documento "Landing Page Palagiaccio – Testi".

   ⚠ needsReview: true = dato segnalato nelle note strategiche del documento
   come da confermare con il cliente prima della pubblicazione (SOE v3).
   In sviluppo questi valori mostrano il contrassegno "DA VALIDARE".
   ========================================================================== */

export interface ReviewNote {
  needsReview: boolean;
  /** Motivo della verifica, solo uso interno (non mostrato agli utenti). */
  reviewNote?: string;
}

export interface FormatOption extends ReviewNote {
  id: 'ridotto' | 'standard';
  name: string;
  investment: string;
  surface: string;
  concept: string;
  imageKey: 'formatCompact' | 'formatStandard';
}

export interface Condition extends ReviewNote {
  label: string;
  value: string;
}

/** Investimento minimo mostrato in hero, CTA finale e altri richiami. */
export const startingInvestment = {
  value: '€55.000',
  needsReview: true,
  reviewNote:
    'Le fasce di investimento escludono i lavori edili: verificare quali voci siano comprese (fee, prima fornitura, attrezzature).',
} as const;

export const formats: FormatOption[] = [
  {
    id: 'ridotto',
    name: 'Format ridotto',
    investment: '€55.000 – €75.000',
    surface: '50–70 mq',
    concept: 'Bottega gastronomica compatta',
    imageKey: 'formatCompact',
    needsReview: true,
    reviewNote: startingInvestment.reviewNote,
  },
  {
    id: 'standard',
    name: 'Format standard',
    investment: '€85.000 – €110.000',
    surface: '90–120 mq',
    concept: 'Bottega con maggiore spazio per vendita e degustazioni',
    imageKey: 'formatStandard',
    needsReview: true,
    reviewNote: startingInvestment.reviewNote,
  },
];

export const formatLabels = {
  investment: 'Investimento indicativo',
  surface: 'Superficie indicativa',
  concept: 'Concept',
} as const;

export const investmentNote =
  'Gli investimenti sono indicativi ed escludono eventuali lavori edili. La configurazione definitiva viene valutata in base al locale e alle caratteristiche del progetto.';

const feeReview =
  'Corrispettivi indicati nel SOE come formule consigliate: confermarli come condizioni commerciali definitive.';

export const conditions: Condition[] = [
  { label: "Fee d'ingresso", value: '€10.000', needsReview: true, reviewNote: feeReview },
  { label: 'Royalty', value: 'dal 2% al 3% del fatturato', needsReview: true, reviewNote: feeReview },
  { label: 'Contributo marketing', value: '€600 al mese', needsReview: true, reviewNote: feeReview },
  { label: 'Durata contrattuale', value: '6 anni, rinnovabili', needsReview: false },
  { label: 'Bacino di riferimento', value: 'a partire da 20.000 abitanti', needsReview: false },
];

/** Modello di approvvigionamento indicativo (sezione Prodotti). */
export const sourcing = {
  casaMadre: 80,
  territorio: 20,
  references: 'circa 150',
} as const;

/**
 * Opzioni del campo "Disponibilità di investimento" del modulo.
 * Derivate dalle due configurazioni del documento: modificabili liberamente.
 */
export const investmentOptions = [
  { value: '55-75k', label: '€55.000 – €75.000 (format ridotto)' },
  { value: '85-110k', label: '€85.000 – €110.000 (format standard)' },
  { value: 'da-valutare', label: 'Da valutare insieme' },
] as const;

/**
 * Note operative da verificare che non riguardano un singolo valore numerico.
 * Elencate anche nel README.
 */
export const openReviewItems = [
  feeReview,
  startingInvestment.reviewNote,
  'Degustazioni: verificare configurazione operativa definitiva e requisiti autorizzativi prima di presentarle come disponibili in ogni tipologia di negozio.',
  "Informativa privacy: verificare che il link ufficiale copra anche il trattamento dei dati raccolti da questa landing.",
];
