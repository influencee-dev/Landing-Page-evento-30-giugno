// AI Campaign Builder — motore di pianificazione deterministico.
// L'LLM (server/ai.ts) raccoglie le risposte in linguaggio naturale e le
// normalizza in BuilderAnswers; questa funzione produce il MediaPlanPayload
// che viene poi materializzato in Campagna > Ad Set > Task.

import type {
  BuilderAnswers,
  CampaignObjective,
  DeliverableType,
  MediaPlanPayload,
  ModuleType,
  PlanAdSet,
} from './types';

type Split = Record<Exclude<ModuleType, 'SMART_BARTER'>, number>;

// Ripartizione CBO del budget cash per obiettivo
export const OBJECTIVE_SPLITS: Record<CampaignObjective, Split> = {
  REACH: { PREMIUM_VIP: 0.5, OPEN_DISCOVERY: 0.35, UGC_FACTORY: 0.15 },
  DRIVE_TO_STORE: { PREMIUM_VIP: 0.3, OPEN_DISCOVERY: 0.5, UGC_FACTORY: 0.2 },
  UGC: { PREMIUM_VIP: 0, OPEN_DISCOVERY: 0.2, UGC_FACTORY: 0.8 },
  CONVERSIONS: { PREMIUM_VIP: 0.3, OPEN_DISCOVERY: 0.4, UGC_FACTORY: 0.3 },
};

// Benchmark unitari (EUR) usati per stimare volumi e reach
export const UNIT_BENCHMARKS = {
  PREMIUM_VIP: { fee: 2500, reach: 150_000 },
  OPEN_DISCOVERY: { fee: 350, reach: 18_000 },
  SMART_BARTER: { reach: 2_500 },
  UGC_FACTORY: { fee: 100, reach: 0 },
} as const;

// Sotto questa soglia il modulo VIP non ha senso (un solo macro creator mangia tutto)
export const VIP_MIN_BUDGET = 4000;

export const OBJECTIVE_LABELS: Record<CampaignObjective, string> = {
  REACH: 'Brand Awareness',
  CONVERSIONS: 'Vendite e-commerce',
  DRIVE_TO_STORE: 'Traffico in negozio',
  UGC: 'Contenuti per i tuoi social / Ads',
};

export const MODULE_LABELS: Record<ModuleType, string> = {
  PREMIUM_VIP: 'VIP Premium',
  OPEN_DISCOVERY: 'Open Discovery',
  SMART_BARTER: 'Smart Barter',
  UGC_FACTORY: 'Social Content Factory',
};

export const DELIVERABLE_BY_MODULE: Record<ModuleType, DeliverableType> = {
  PREMIUM_VIP: 'COLLAB_POST',
  OPEN_DISCOVERY: 'IG_STORY',
  SMART_BARTER: 'IG_STORY',
  UGC_FACTORY: 'RAW_UGC',
};

function round(n: number, step = 10) {
  return Math.round(n / step) * step;
}

function draftBrief(module: ModuleType, a: BuilderAnswers): string {
  const brand = a.brandName || 'il brand';
  const goal = OBJECTIVE_LABELS[a.objective].toLowerCase();
  switch (module) {
    case 'PREMIUM_VIP':
      return `RFP per talent agency: ${brand} cerca 1-2 hero creator per una collab post + 3 stories. Obiettivo: ${goal}. Richiesta quotazione flat fee o CPM garantito, esclusiva di categoria 30 giorni, usage rights 3 mesi.`;
    case 'OPEN_DISCOVERY':
      return `Ciao! Siamo ${brand}. Ti abbiamo selezionato per la tua community${a.categories.length ? ` ${a.categories.join('/')}` : ''}. Ti proponiamo 1 IG story con link sticker e codice sconto personale. Accetta dal link di onboarding per vedere compenso e tempistiche.`;
    case 'SMART_BARTER':
      return `Vieni a provare ${a.barterProduct || 'il nostro prodotto'} da ${brand}${a.city ? ` a ${a.city}` : ''}. Mostra il QR in cassa, pubblica 1 story con tag + location entro 24h e carica lo screenshot degli insight per chiudere la task.`;
    case 'UGC_FACTORY':
      return `Produci un video verticale 9:16 (15-30s) per le Meta/TikTok Ads di ${brand}: hook nei primi 2s, problema > prodotto > CTA. Nessuna pubblicazione sul tuo profilo. Consegna .mp4 senza musica + cessione diritti (whitelisting/dark posting) 12 mesi.`;
  }
}

export function buildMediaPlan(a: BuilderAnswers): MediaPlanPayload {
  const split = { ...OBJECTIVE_SPLITS[a.objective] };
  const rationale: string[] = [];
  const cash = Math.max(0, a.cashBudget);

  // Budget troppo basso per i VIP: ridistribuisci su Discovery/UGC
  if (split.PREMIUM_VIP > 0 && cash * split.PREMIUM_VIP < VIP_MIN_BUDGET) {
    const freed = split.PREMIUM_VIP;
    split.PREMIUM_VIP = 0;
    const rest = split.OPEN_DISCOVERY + split.UGC_FACTORY || 1;
    split.OPEN_DISCOVERY += (freed * split.OPEN_DISCOVERY) / rest;
    split.UGC_FACTORY += (freed * split.UGC_FACTORY) / rest;
    if (cash > 0) {
      rationale.push(
        `Quota VIP sotto ${VIP_MIN_BUDGET}€: ridistribuita su Discovery e UGC per non concentrare tutto su un solo macro creator.`,
      );
    }
  }

  const adSets: PlanAdSet[] = [];
  const baseTargeting = { categories: a.categories, center: a.center };

  if (split.PREMIUM_VIP > 0) {
    const budget = round(cash * split.PREMIUM_VIP);
    const n = Math.max(1, Math.floor(budget / UNIT_BENCHMARKS.PREMIUM_VIP.fee));
    adSets.push({
      name: 'VIP Premium · Hero creator',
      module_type: 'PREMIUM_VIP',
      budget_allocation: budget,
      targeting_rules: { ...baseTargeting, tiers: ['MACRO', 'VIP'], min_followers: 200_000 },
      deliverable_type: DELIVERABLE_BY_MODULE.PREMIUM_VIP,
      brief: draftBrief('PREMIUM_VIP', a),
      estimated_creators: n,
      estimated_reach: n * UNIT_BENCHMARKS.PREMIUM_VIP.reach,
    });
    rationale.push(`${Math.round(split.PREMIUM_VIP * 100)}% cash ai VIP via RFP alle agenzie: credibilità e picco di reach.`);
  }

  if (split.OPEN_DISCOVERY > 0 && cash > 0) {
    const budget = round(cash * split.OPEN_DISCOVERY);
    const n = Math.max(1, Math.floor(budget / UNIT_BENCHMARKS.OPEN_DISCOVERY.fee));
    adSets.push({
      name: 'Open Discovery · Micro & Mid',
      module_type: 'OPEN_DISCOVERY',
      budget_allocation: budget,
      targeting_rules: { ...baseTargeting, tiers: ['MICRO', 'MID'], min_followers: 10_000, min_er: 2.5 },
      deliverable_type: DELIVERABLE_BY_MODULE.OPEN_DISCOVERY,
      brief: draftBrief('OPEN_DISCOVERY', a),
      estimated_creators: n,
      estimated_reach: n * UNIT_BENCHMARKS.OPEN_DISCOVERY.reach,
    });
    rationale.push(`${Math.round(split.OPEN_DISCOVERY * 100)}% cash in scouting data-driven con cold outreach automatico.`);
  }

  if (a.hasBarter && (a.barterUnits ?? 0) > 0) {
    const units = a.barterUnits!;
    const unitValue = a.barterUnitValue ?? 0;
    adSets.push({
      name: `Smart Barter · ${a.barterProduct || 'Cambio merci'}`,
      module_type: 'SMART_BARTER',
      budget_allocation: 0,
      barter_unit_value: unitValue,
      barter_inventory_count: units,
      targeting_rules: {
        ...baseTargeting,
        tiers: ['NANO', 'MICRO'],
        radius_km: 10,
        min_followers: 1_500,
        min_er: 3,
        min_barter_score: 40,
      },
      deliverable_type: DELIVERABLE_BY_MODULE.SMART_BARTER,
      brief: draftBrief('SMART_BARTER', a),
      estimated_creators: units,
      estimated_reach: units * UNIT_BENCHMARKS.SMART_BARTER.reach,
    });
    rationale.push(
      `${units} unità di ${a.barterProduct || 'merce'} (${(units * unitValue).toLocaleString('it-IT')}€ valore) per saturare la città con micro-creator locali in 10 km.`,
    );
  }

  if (split.UGC_FACTORY > 0 && cash > 0) {
    const budget = round(cash * split.UGC_FACTORY);
    const n = Math.max(1, Math.floor(budget / UNIT_BENCHMARKS.UGC_FACTORY.fee));
    adSets.push({
      name: 'Social Content Factory · Video Ads',
      module_type: 'UGC_FACTORY',
      budget_allocation: budget,
      targeting_rules: { categories: ['ugc', ...a.categories] },
      deliverable_type: DELIVERABLE_BY_MODULE.UGC_FACTORY,
      brief: draftBrief('UGC_FACTORY', a),
      estimated_creators: n,
      estimated_reach: 0,
    });
    rationale.push(`${budget.toLocaleString('it-IT')}€ per ~${n} video raw in escrow, pronti per il Business Manager.`);
  }

  // Gli arrotondamenti non devono far sforare/avanzare il budget: il resto va all'ultimo Ad Set cash
  const cashSets = adSets.filter((s) => s.module_type !== 'SMART_BARTER');
  const allocated = cashSets.reduce((sum, s) => sum + s.budget_allocation, 0);
  if (cashSets.length && allocated !== cash) {
    cashSets[cashSets.length - 1].budget_allocation += cash - allocated;
  }

  return {
    campaign: {
      name: `${a.brandName || 'Nuova campagna'} · ${OBJECTIVE_LABELS[a.objective]}`,
      objective: a.objective,
      total_cash_budget: cash,
      total_barter_value: a.hasBarter ? (a.barterUnits ?? 0) * (a.barterUnitValue ?? 0) : 0,
    },
    ad_sets: adSets,
    rationale,
  };
}
