// Integrazioni esterne del Trading Desk. Ognuna è opzionale: senza la
// variabile d'ambiente corrispondente il desk funziona con il fallback locale.
//
//  GEMINI_API_KEY        → estrazione risposte AI Campaign Builder (LLM)
//  GOOGLE_VISION_API_KEY → OCR delle Proof of Work (Cloud Vision REST)
//  WEBHOOK_URL_SPOKI     → follow-up WhatsApp dopo check-in / approvazione
//  WEBHOOK_URL_META      → push asset UGC / audience verso Meta

import { GoogleGenAI, Type } from '@google/genai';
import { isStepSatisfied, parseAnswer, type StepId } from '../src/desk/core/nlu';
import type { BuilderAnswers, DeskEvent } from '../src/desk/core/types';

// ---------------------------------------------------------------------
// LLM: normalizza la risposta libera dell'utente nello step corrente
// ---------------------------------------------------------------------
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const answerSchema = {
  type: Type.OBJECT,
  properties: {
    brandName: { type: Type.STRING },
    objective: { type: Type.STRING, enum: ['REACH', 'UGC', 'DRIVE_TO_STORE', 'CONVERSIONS'] },
    cashBudget: { type: Type.NUMBER },
    hasBarter: { type: Type.BOOLEAN },
    barterProduct: { type: Type.STRING },
    barterUnitValue: { type: Type.NUMBER },
    barterUnits: { type: Type.INTEGER },
    city: { type: Type.STRING },
    categories: {
      type: Type.ARRAY,
      items: { type: Type.STRING, enum: ['food', 'fashion', 'beauty', 'lifestyle', 'tech', 'fitness', 'travel'] },
    },
  },
};

export async function extractAnswer(
  step: StepId,
  question: string,
  text: string,
): Promise<{ patch: Partial<BuilderAnswers>; engine: 'llm' | 'rules' }> {
  if (gemini) {
    try {
      const res = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Sei il Campaign Builder di un trading desk di influencer marketing.
Domanda posta all'utente (step "${step}"): ${question}
Risposta dell'utente: """${text}"""
Estrai SOLO i campi pertinenti allo step. Budget e valori in euro come numeri.
Mappa l'obiettivo: vendite e-commerce→CONVERSIONS, traffico in negozio→DRIVE_TO_STORE, contenuti/UGC→UGC, notorietà→REACH.`,
        config: { responseMimeType: 'application/json', responseSchema: answerSchema, temperature: 0 },
      });
      const patch = JSON.parse(res.text ?? '{}') as Partial<BuilderAnswers>;
      // Il fallback a regole integra i campi che l'LLM non ha restituito (es. center della città)
      const merged = { ...parseAnswer(step, text), ...patch };
      if (step === 'location') Object.assign(merged, parseAnswer('location', merged.city ?? text));
      if (isStepSatisfied(step, merged)) return { patch: merged, engine: 'llm' };
    } catch (err) {
      console.warn('[ai] Gemini non disponibile, uso il parser a regole:', (err as Error).message);
    }
  }
  return { patch: parseAnswer(step, text), engine: 'rules' };
}

// ---------------------------------------------------------------------
// OCR: Google Cloud Vision (TEXT_DETECTION)
// ---------------------------------------------------------------------
export async function ocrImage(imageBase64: string): Promise<string | null> {
  const key = process.env.GOOGLE_VISION_API_KEY;
  if (!key) return null;
  const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{ image: { content: imageBase64.replace(/^data:[^,]+,/, '') }, features: [{ type: 'TEXT_DETECTION' }] }],
    }),
  });
  if (!res.ok) throw new Error(`Cloud Vision ${res.status}`);
  const json = (await res.json()) as { responses?: { fullTextAnnotation?: { text?: string } }[] };
  return json.responses?.[0]?.fullTextAnnotation?.text ?? '';
}

// ---------------------------------------------------------------------
// Webhook out: gli eventi "webhook.*" e "meta.*" vengono inoltrati
// ---------------------------------------------------------------------
const delivered = new Set<string>();

/** Segna come già consegnati gli eventi esistenti (es. quelli del seed demo). */
export function markDelivered(events: DeskEvent[]) {
  for (const e of events) delivered.add(e.id);
}

export function dispatchWebhooks(events: DeskEvent[]) {
  for (const e of events) {
    if (delivered.has(e.id)) continue;
    delivered.add(e.id);
    const target = e.type.startsWith('meta.')
      ? process.env.WEBHOOK_URL_META
      : e.type.startsWith('webhook.')
        ? process.env.WEBHOOK_URL_SPOKI
        : undefined;
    if (!target) continue;
    fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: e.type, id: e.id, at: e.at, data: e.payload }),
    }).catch((err) => console.warn(`[webhook] ${e.type} → ${target} fallito:`, err.message));
  }
}
