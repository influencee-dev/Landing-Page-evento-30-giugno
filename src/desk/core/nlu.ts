// Guided Flow dell'AI Campaign Builder.
// - STEPS definisce le domande della chat (ordine fisso, come da spec).
// - parseAnswer è il parser euristico usato quando l'LLM non è configurato;
//   con GEMINI_API_KEY il server usa l'LLM per l'estrazione (server/ai.ts)
//   e ricade qui in caso di errore.

import { CITIES } from './seed';
import type { BuilderAnswers, CampaignObjective } from './types';

export type StepId = 'brand' | 'objective' | 'cash' | 'barter' | 'barter_detail' | 'location' | 'categories';

export interface Step {
  id: StepId;
  question: string;
  suggestions?: string[];
}

export const STEPS: Step[] = [
  { id: 'brand', question: 'Ciao! Sono il tuo Campaign Builder. Come si chiama il brand o il locale che vuoi promuovere?' },
  {
    id: 'objective',
    question: 'Qual è il tuo obiettivo principale?',
    suggestions: ['Vendite e-commerce', 'Traffico in negozio', 'Contenuti per i tuoi social', 'Brand awareness'],
  },
  { id: 'cash', question: 'Qual è il tuo budget cash per questa campagna?', suggestions: ['1.000€', '5.000€', '15.000€', '50.000€'] },
  {
    id: 'barter',
    question: 'Hai a disposizione prodotti o servizi da scambiare (Cambio Merci)?',
    suggestions: ['Sì', 'No, solo cash'],
  },
  {
    id: 'barter_detail',
    question: 'Perfetto. Cosa metti a disposizione, quante unità e quanto vale ciascuna? (es. "50 cene da 80€")',
    suggestions: ['50 cene da 80€', '100 trattamenti viso da 60€', '30 box prodotti da 45€'],
  },
  { id: 'location', question: 'In quale città vuoi attivare i creator locali?', suggestions: Object.keys(CITIES) },
  {
    id: 'categories',
    question: 'Ultima cosa: in che verticali si muove il tuo pubblico?',
    suggestions: ['food, lifestyle', 'fashion, beauty', 'tech', 'fitness, lifestyle'],
  },
];

export const CATEGORIES = ['food', 'fashion', 'beauty', 'lifestyle', 'tech', 'fitness', 'travel'];

export function nextStep(a: Partial<BuilderAnswers>, answered: Set<StepId>): Step | null {
  for (const s of STEPS) {
    if (answered.has(s.id)) continue;
    if (s.id === 'barter_detail' && !a.hasBarter) continue;
    return s;
  }
  return null;
}

export function parseMoney(text: string): number | undefined {
  const m = text.toLowerCase().replace(/\s/g, '').match(/(\d+(?:[.,]\d+)*)(k|mila|mln)?/);
  if (!m) return undefined;
  let raw = m[1];
  const suffix = m[2];
  // "15.000" / "15,000" → migliaia; "1,5k" → decimale
  raw = suffix ? raw.replace(',', '.') : raw.replace(/[.,](?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return undefined;
  return Math.round(n * (suffix === 'k' || suffix === 'mila' ? 1000 : suffix === 'mln' ? 1_000_000 : 1));
}

export function parseObjective(text: string): CampaignObjective | undefined {
  const t = text.toLowerCase();
  if (/(e-?commerce|vendit|conversion|acquist|sales)/.test(t)) return 'CONVERSIONS';
  if (/(negozi|store|locale|traffic|ristorant|visite|footfall)/.test(t)) return 'DRIVE_TO_STORE';
  if (/(ugc|contenut|video|ads|creativ)/.test(t)) return 'UGC';
  if (/(awareness|notoriet|reach|visibilit|brand)/.test(t)) return 'REACH';
  return undefined;
}

export function parseAnswer(step: StepId, text: string): Partial<BuilderAnswers> {
  const t = text.trim();
  switch (step) {
    case 'brand':
      return { brandName: t.replace(/^(si chiama|è|il brand è)\s+/i, '') };
    case 'objective': {
      const objective = parseObjective(t);
      return objective ? { objective } : {};
    }
    case 'cash': {
      const cashBudget = /^(no|zero|nessuno)/i.test(t) ? 0 : parseMoney(t);
      return cashBudget !== undefined ? { cashBudget } : {};
    }
    case 'barter':
      return { hasBarter: /^(s[iì]|yes|certo|ok|ho)/i.test(t) || /\d+\s+\w+/.test(t) };
    case 'barter_detail': {
      const units = t.match(/(\d+)\s+([^\d€]+?)(?:\s+da|\s+a|\s+del valore di|\s*[,(]|$)/i);
      const value =
        t.match(/(\d+(?:[.,]\d+)?)\s*(?:€|euro)/i) ?? t.match(/\b(?:da|a|valore(?: di)?|valgono|vale)\s*€?\s*(\d+(?:[.,]\d+)?)/i);
      const out: Partial<BuilderAnswers> = {};
      if (units) {
        out.barterUnits = parseInt(units[1], 10);
        out.barterProduct = units[2].trim();
      }
      if (value) out.barterUnitValue = parseFloat(value[1].replace(',', '.'));
      return out;
    }
    case 'location': {
      const city = Object.keys(CITIES).find((c) => t.toLowerCase().includes(c.toLowerCase())) ?? t;
      return { city, center: CITIES[city] };
    }
    case 'categories': {
      const categories = CATEGORIES.filter((c) => t.toLowerCase().includes(c));
      return { categories };
    }
  }
}

/** true se la risposta estratta è sufficiente per chiudere lo step. */
export function isStepSatisfied(step: StepId, patch: Partial<BuilderAnswers>): boolean {
  switch (step) {
    case 'brand':
      return !!patch.brandName;
    case 'objective':
      return !!patch.objective;
    case 'cash':
      return patch.cashBudget !== undefined;
    case 'barter':
      return patch.hasBarter !== undefined;
    case 'barter_detail':
      return !!patch.barterUnits && !!patch.barterUnitValue;
    case 'location':
      return !!patch.city;
    case 'categories':
      return true;
  }
}
