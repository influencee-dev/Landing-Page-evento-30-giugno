// Client del Trading Desk.
// "api"  → parla con server/index.ts (npm run desk:api), stato lato server.
// "demo" → nessuna API raggiungibile: stesso motore eseguito nel browser.

import QRCode from 'qrcode';
import {
  inviteCreators,
  issueRedeemToken,
  materializePlan,
  redeemBarter,
  setCampaignStatus,
  submitProof,
  transitionTask,
} from './core/engine';
import { nextStep, parseAnswer, STEPS, type Step, type StepId } from './core/nlu';
import { buildMediaPlan } from './core/planner';
import { demoState } from './core/seed';
import type { BuilderAnswers, CampaignStatus, DeskState, MediaPlanPayload, TaskStatus } from './core/types';

export type Mode = 'api' | 'demo';

// Solo per la modalità demo: in produzione il segreto vive solo sul server
const DEMO_SECRET = 'browser-demo-secret';

export interface RedeemTicket {
  token: string;
  expiresAt: number;
  qr: string;
}

export interface DeskClient {
  mode: Mode;
  llm: boolean;
  load(): Promise<DeskState>;
  reset(): Promise<DeskState>;
  step(step: StepId, text: string, answers: Partial<BuilderAnswers>, answered: StepId[]): Promise<{ patch: Partial<BuilderAnswers>; engine: string; next: Step | null }>;
  plan(answers: BuilderAnswers): Promise<MediaPlanPayload>;
  createCampaign(plan: MediaPlanPayload, status: 'DRAFT' | 'ACTIVE'): Promise<DeskState>;
  setCampaignStatus(id: string, status: CampaignStatus): Promise<DeskState>;
  invite(adSetId: string, creatorIds: string[]): Promise<DeskState>;
  transition(taskId: string, to: TaskStatus): Promise<DeskState>;
  proof(taskId: string, proofUrl: string, ocrText: string, imageBase64?: string): Promise<DeskState>;
  redeem(taskId: string): Promise<RedeemTicket>;
  verify(token: string): Promise<DeskState>;
}

export class ApiError extends Error {}

async function call<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json.message || `Errore ${res.status}`);
  return json as T;
}

function apiClient(llm: boolean): DeskClient {
  const s = async (p: Promise<{ state: DeskState }>) => (await p).state;
  return {
    mode: 'api',
    llm,
    load: () => s(call('GET', '/api/state')),
    reset: () => s(call('POST', '/api/reset')),
    step: (step, text, answers, answered) => call('POST', '/api/ai/step', { step, text, answers, answered }),
    plan: async (answers) => (await call<{ plan: MediaPlanPayload }>('POST', '/api/ai/plan', { answers })).plan,
    createCampaign: (plan, status) => s(call('POST', '/api/campaigns', { plan, status })),
    setCampaignStatus: (id, status) => s(call('PATCH', `/api/campaigns/${id}`, { status })),
    invite: (id, creator_ids) => s(call('POST', `/api/ad-sets/${id}/invite`, { creator_ids })),
    transition: (id, to) => s(call('POST', `/api/tasks/${id}/transition`, { to })),
    proof: (id, proof_url, ocr_text, image_base64) => s(call('POST', `/api/tasks/${id}/proof`, { proof_url, ocr_text, image_base64 })),
    redeem: async (task_id) => {
      const r = await call<{ token: string; expires_at: number; qr: string }>('POST', '/api/barter/redeem', { task_id });
      return { token: r.token, expiresAt: r.expires_at, qr: r.qr };
    },
    verify: (token) => s(call('POST', '/api/barter/verify', { token })),
  };
}

function demoClient(): DeskClient {
  let state = demoState();
  const wrap = async (fn: () => DeskState | Promise<DeskState>) => {
    try {
      state = await fn();
      return state;
    } catch (e) {
      throw new ApiError((e as Error).message);
    }
  };
  return {
    mode: 'demo',
    llm: false,
    load: async () => state,
    reset: () => wrap(() => demoState()),
    step: async (step, text, answers, answered) => {
      const patch = parseAnswer(step, text);
      return { patch, engine: 'rules', next: nextStep({ ...answers, ...patch }, new Set([...answered, step])) };
    },
    plan: async (answers) => buildMediaPlan(answers),
    createCampaign: (plan, status) => wrap(() => materializePlan(state, plan, status).state),
    setCampaignStatus: (id, status) => wrap(() => setCampaignStatus(state, id, status)),
    invite: (id, ids) => wrap(() => inviteCreators(state, id, ids)),
    transition: (id, to) => wrap(() => transitionTask(state, id, to)),
    proof: (id, url, text) => wrap(() => submitProof(state, id, url, text)),
    redeem: async (taskId) => {
      try {
        const { token, claims } = await issueRedeemToken(state, taskId, DEMO_SECRET);
        return { token, expiresAt: claims.exp, qr: await QRCode.toDataURL(token, { margin: 1, width: 280 }) };
      } catch (e) {
        throw new ApiError((e as Error).message);
      }
    },
    verify: (token) => wrap(() => redeemBarter(state, token, DEMO_SECRET)),
  };
}

export async function connect(): Promise<DeskClient> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch('/api/health', { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) {
      const h = await res.json();
      if (h.ok) return apiClient(!!h.llm);
    }
  } catch {
    // nessuna API: modalità demo
  }
  return demoClient();
}

export { STEPS };
