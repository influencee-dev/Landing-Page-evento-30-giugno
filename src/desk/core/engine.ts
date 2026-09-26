// Motore di dominio del Trading Desk: funzioni pure su DeskState.
// Il frontend le usa in "demo mode" (stato in memoria), l'API Node le usa
// come service layer sopra lo store (vedi server/index.ts).

import type {
  AdSet,
  Campaign,
  CampaignStatus,
  CreatorProfile,
  DeskEvent,
  DeskState,
  LatLng,
  MediaPlanPayload,
  ModuleType,
  PerformanceMetrics,
  TaskAd,
  TaskStatus,
  TransactionStatus,
  TransactionType,
  WalletTransaction,
} from './types';
import { DELIVERABLE_BY_MODULE } from './planner';

export class DeskError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function uid(prefix = ''): string {
  const id = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(16).slice(2) + Date.now().toString(16);
  return prefix ? `${prefix}_${id.slice(0, 8)}` : id;
}

const now = () => new Date().toISOString();

function event(type: string, payload: Record<string, unknown>): DeskEvent {
  return { id: uid('evt'), at: now(), type, payload };
}

function tx(
  user_id: string,
  transaction_type: TransactionType,
  amount: number,
  status: TransactionStatus,
  task_id: string | null,
  note?: string,
): WalletTransaction {
  return { id: uid('tx'), user_id, task_id, transaction_type, amount, status, created_at: now(), note };
}

// ---------------------------------------------------------------------
// Geospatial (fallback JS di ST_DWithin per la demo)
// ---------------------------------------------------------------------
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ---------------------------------------------------------------------
// Matching Engine
// ---------------------------------------------------------------------
export function matchCreators(creators: CreatorProfile[], adSet: AdSet): CreatorProfile[] {
  const r = adSet.targeting_rules;
  return creators
    .filter((c) => {
      if (r.tiers?.length && !r.tiers.includes(c.tier)) return false;
      if (r.min_followers && c.metrics.follower_count < r.min_followers) return false;
      if (r.max_followers && c.metrics.follower_count > r.max_followers) return false;
      if (r.min_er && c.metrics.engagement_rate_real < r.min_er) return false;
      if (r.min_barter_score && c.barter_eligibility_score < r.min_barter_score) return false;
      if (adSet.module_type === 'SMART_BARTER') {
        if (!r.center) return false;
        if (haversineKm(r.center, c.location) > (r.radius_km ?? 10)) return false;
        // Il barter richiede un creator registrato (deve fare check-in con l'app)
        if (c.origin !== 'AUTHENTICATED') return false;
      }
      if (adSet.module_type === 'PREMIUM_VIP' && !c.agency) return false;
      if (adSet.module_type === 'UGC_FACTORY' && !c.categories.includes('ugc')) return false;
      if (r.categories?.length && adSet.module_type !== 'UGC_FACTORY') {
        if (!c.categories.some((cat) => r.categories!.includes(cat))) return false;
      }
      return true;
    })
    .sort((a, b) => score(b, adSet.module_type) - score(a, adSet.module_type));
}

function score(c: CreatorProfile, module: ModuleType): number {
  const er = c.metrics.engagement_rate_real;
  switch (module) {
    case 'PREMIUM_VIP':
      return c.metrics.avg_reach;
    case 'SMART_BARTER':
      return c.barter_eligibility_score * 10 + er;
    case 'UGC_FACTORY':
      return er * 100 - c.base_fee;
    default:
      return (c.metrics.avg_reach * er) / Math.max(c.base_fee, 1);
  }
}

// ---------------------------------------------------------------------
// Campaign hierarchy
// ---------------------------------------------------------------------
export function materializePlan(
  state: DeskState,
  plan: MediaPlanPayload,
  status: CampaignStatus = 'DRAFT',
): { state: DeskState; campaign: Campaign } {
  const campaign: Campaign = {
    id: uid('cmp'),
    advertiser_id: state.advertiserId,
    ...plan.campaign,
    status,
    created_at: now(),
  };
  const adSets: AdSet[] = plan.ad_sets.map((p) => ({
    id: uid('ads'),
    campaign_id: campaign.id,
    name: p.name,
    module_type: p.module_type,
    targeting_rules: p.targeting_rules,
    budget_allocation: p.budget_allocation,
    barter_unit_value: p.barter_unit_value ?? 0,
    barter_inventory_count: p.barter_inventory_count ?? 0,
    barter_inventory_initial: p.barter_inventory_count ?? 0,
    brief: p.brief,
    status,
  }));
  return {
    campaign,
    state: {
      ...state,
      campaigns: [campaign, ...state.campaigns],
      adSets: [...state.adSets, ...adSets],
      events: [event('campaign.created', { campaign_id: campaign.id, ad_sets: adSets.length }), ...state.events],
    },
  };
}

export function setCampaignStatus(state: DeskState, campaignId: string, status: CampaignStatus): DeskState {
  return {
    ...state,
    campaigns: state.campaigns.map((c) => (c.id === campaignId ? { ...c, status } : c)),
    adSets: state.adSets.map((a) => (a.campaign_id === campaignId ? { ...a, status } : a)),
    events: [event('campaign.status', { campaign_id: campaignId, status }), ...state.events],
  };
}

/** Budget cash già impegnato su un Ad Set (task non rifiutate). */
export function committedBudget(state: DeskState, adSetId: string): number {
  return state.tasks
    .filter((t) => t.ad_set_id === adSetId && t.status !== 'REJECTED')
    .reduce((s, t) => s + t.agreed_fee, 0);
}

/**
 * Invia l'Ad Set ai creator selezionati. Genera le task e l'evento del modulo:
 * VIP → RFP all'agenzia, Discovery → cold outreach, Barter → push notification,
 * UGC → brief di produzione.
 */
export function inviteCreators(state: DeskState, adSetId: string, creatorIds: string[]): DeskState {
  const adSet = state.adSets.find((a) => a.id === adSetId);
  if (!adSet) throw new DeskError('NOT_FOUND', 'Ad Set inesistente');
  const already = new Set(state.tasks.filter((t) => t.ad_set_id === adSetId).map((t) => t.creator_id));
  let remaining = adSet.budget_allocation - committedBudget(state, adSetId);
  const newTasks: TaskAd[] = [];
  const events: DeskEvent[] = [];

  for (const cid of creatorIds) {
    if (already.has(cid)) continue;
    const c = state.creators.find((x) => x.id === cid);
    if (!c) continue;
    const fee = adSet.module_type === 'SMART_BARTER' ? 0 : c.base_fee;
    if (adSet.module_type !== 'SMART_BARTER' && fee > remaining) {
      events.push(event('budget.exceeded', { ad_set_id: adSetId, creator_id: cid, fee, remaining }));
      continue;
    }
    if (adSet.module_type === 'SMART_BARTER') {
      const open = state.tasks.filter((t) => t.ad_set_id === adSetId && t.status !== 'REJECTED').length;
      if (open + newTasks.length >= adSet.barter_inventory_initial) break;
    }
    remaining -= fee;
    newTasks.push({
      id: uid('task'),
      ad_set_id: adSetId,
      creator_id: cid,
      deliverable_type: DELIVERABLE_BY_MODULE[adSet.module_type],
      status: 'PENDING_ACCEPTANCE',
      agreed_fee: fee,
      qr_code_hash: null,
      redeemed_at: null,
      proof_of_work_url: null,
      performance_metrics: {},
    });
    const type = {
      PREMIUM_VIP: 'rfp.sent',
      OPEN_DISCOVERY: 'outreach.sent',
      SMART_BARTER: 'barter.push_notified',
      UGC_FACTORY: 'ugc.brief_sent',
    }[adSet.module_type];
    events.push(
      event(type, {
        ad_set_id: adSetId,
        creator: c.display_name,
        ...(c.agency ? { agency: c.agency } : {}),
        ...(adSet.module_type === 'OPEN_DISCOVERY' ? { channel: 'EMAIL', onboarding_link: `/onboard/${uid()}` } : {}),
      }),
    );
  }
  return {
    ...state,
    tasks: [...state.tasks, ...newTasks],
    events: [...events.reverse(), ...state.events],
  };
}

const TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  PENDING_ACCEPTANCE: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['REVIEW', 'REJECTED'],
  REVIEW: ['APPROVED', 'REJECTED', 'IN_PROGRESS'],
  APPROVED: [],
  REJECTED: [],
};

function patchTask(state: DeskState, taskId: string, patch: Partial<TaskAd>): DeskState {
  return { ...state, tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) };
}

function getTask(state: DeskState, taskId: string) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) throw new DeskError('NOT_FOUND', 'Task inesistente');
  const adSet = state.adSets.find((a) => a.id === task.ad_set_id)!;
  return { task, adSet };
}

export function transitionTask(state: DeskState, taskId: string, to: TaskStatus): DeskState {
  const { task, adSet } = getTask(state, taskId);
  if (!TRANSITIONS[task.status].includes(to)) {
    throw new DeskError('INVALID_TRANSITION', `Transizione ${task.status} → ${to} non consentita`);
  }
  let next = patchTask(state, taskId, { status: to });
  const events = [event('task.status', { task_id: taskId, from: task.status, to })];

  // Clearing House: all'accettazione il cash va in escrow (HOLD), all'approvazione viene rilasciato
  if (to === 'ACCEPTED' && task.agreed_fee > 0) {
    next = {
      ...next,
      wallet: [tx(state.advertiserId, 'CASH_PAYMENT', task.agreed_fee, 'HOLD', taskId, 'Escrow su accettazione'), ...next.wallet],
    };
  }
  if (to === 'APPROVED' && task.agreed_fee > 0) {
    next = {
      ...next,
      wallet: next.wallet.map((w) =>
        w.task_id === taskId && w.transaction_type === 'CASH_PAYMENT' && w.status === 'HOLD'
          ? { ...w, status: 'CLEARED' as const, note: 'Rilasciato a delivery approvata' }
          : w,
      ),
    };
    if (adSet.module_type === 'UGC_FACTORY') {
      events.push(event('meta.asset_pushed', { task_id: taskId, target: 'Meta Business Manager', rights: 'whitelisting+dark_posting' }));
    }
  }
  if (to === 'REJECTED') {
    next = {
      ...next,
      wallet: next.wallet.map((w) =>
        w.task_id === taskId && w.status === 'HOLD' ? { ...w, status: 'FAILED' as const, note: 'Escrow stornato' } : w,
      ),
    };
  }
  if (to === 'APPROVED') events.push(event('webhook.task.approved', { task_id: taskId, target: 'spoki' }));
  return { ...next, events: [...events.reverse(), ...next.events] };
}

// ---------------------------------------------------------------------
// Smart Barter — QR Flow (JWT HS256, TTL 5 minuti)
// ---------------------------------------------------------------------
export const REDEEM_TTL_SECONDS = 300;

const enc = new TextEncoder();

function b64url(bytes: Uint8Array | string): string {
  const bin = typeof bytes === 'string' ? bytes : String.fromCharCode(...bytes);
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  return typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await globalThis.crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export async function sha256Hex(data: string): Promise<string> {
  const d = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', enc.encode(data)));
  return Array.from(d, (b) => b.toString(16).padStart(2, '0')).join('');
}

export interface RedeemClaims {
  sub: string; // task id
  ads: string; // ad set id
  cre: string; // creator id
  jti: string;
  iat: number;
  exp: number;
}

export async function issueRedeemToken(state: DeskState, taskId: string, secret: string, nowSec = Math.floor(Date.now() / 1000)) {
  const { task, adSet } = getTask(state, taskId);
  if (adSet.module_type !== 'SMART_BARTER') throw new DeskError('NOT_BARTER', 'La task non appartiene a uno Smart Barter');
  if (task.status !== 'ACCEPTED') throw new DeskError('NOT_REDEEMABLE', 'Il creator deve prima accettare la task');
  if (task.redeemed_at) throw new DeskError('ALREADY_REDEEMED', 'QR già utilizzato');
  if (adSet.barter_inventory_count <= 0) throw new DeskError('INVENTORY_EXHAUSTED', 'Inventory esaurito');
  const claims: RedeemClaims = {
    sub: task.id,
    ads: adSet.id,
    cre: task.creator_id,
    jti: uid(),
    iat: nowSec,
    exp: nowSec + REDEEM_TTL_SECONDS,
  };
  const head = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(claims));
  const sig = b64url(await hmac(secret, `${head}.${body}`));
  return { token: `${head}.${body}.${sig}`, claims };
}

export async function verifyRedeemToken(token: string, secret: string, nowSec = Math.floor(Date.now() / 1000)): Promise<RedeemClaims> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new DeskError('BAD_TOKEN', 'QR non valido');
  const [head, body, sig] = parts;
  const expected = b64url(await hmac(secret, `${head}.${body}`));
  if (expected.length !== sig.length || expected !== sig) throw new DeskError('BAD_SIGNATURE', 'Firma QR non valida');
  const claims = JSON.parse(b64urlDecode(body)) as RedeemClaims;
  if (claims.exp < nowSec) throw new DeskError('EXPIRED', 'QR scaduto (TTL 5 minuti): rigenera dal telefono');
  return claims;
}

/** Equivalente in memoria della funzione SQL redeem_barter(). */
export async function redeemBarter(state: DeskState, token: string, secret: string): Promise<DeskState> {
  const claims = await verifyRedeemToken(token, secret);
  const { task, adSet } = getTask(state, claims.sub);
  if (adSet.id !== claims.ads || task.creator_id !== claims.cre) throw new DeskError('MISMATCH', 'QR non coerente con la task');
  if (task.redeemed_at) throw new DeskError('ALREADY_REDEEMED', 'QR già utilizzato');
  if (adSet.barter_inventory_count <= 0) throw new DeskError('INVENTORY_EXHAUSTED', 'Inventory esaurito');
  const hash = await sha256Hex(token);
  const creator = state.creators.find((c) => c.id === task.creator_id);
  return {
    ...state,
    adSets: state.adSets.map((a) => (a.id === adSet.id ? { ...a, barter_inventory_count: a.barter_inventory_count - 1 } : a)),
    tasks: state.tasks.map((t) =>
      t.id === task.id ? { ...t, status: 'IN_PROGRESS', redeemed_at: now(), qr_code_hash: hash } : t,
    ),
    wallet: [tx(state.advertiserId, 'BARTER_REDEEM', adSet.barter_unit_value, 'CLEARED', task.id, `Check-in ${creator?.display_name ?? ''}`), ...state.wallet],
    events: [
      event('webhook.barter.redeemed', {
        task_id: task.id,
        creator: creator?.display_name,
        inventory_left: adSet.barter_inventory_count - 1,
        target: 'spoki',
        action: 'whatsapp_followup',
      }),
      ...state.events,
    ],
  };
}

// ---------------------------------------------------------------------
// Anti-frode: validazione OCR della Proof of Work
// ---------------------------------------------------------------------
function parseNumber(raw: string): number {
  const m = raw.trim().toLowerCase().replace(/\s/g, '');
  const mult = m.endsWith('k') ? 1_000 : m.endsWith('m') || m.endsWith('mln') ? 1_000_000 : 1;
  const num = m.replace(/[a-z]+$/, '');
  // "12.345" / "12,345" come separatori di migliaia se non ci sono suffissi
  const normalized = mult === 1 ? num.replace(/[.,](?=\d{3}\b)/g, '') : num.replace(',', '.');
  return Math.round(parseFloat(normalized) * mult) || 0;
}

/**
 * Estrae le metriche dal testo OCR (Google Cloud Vision → fullTextAnnotation).
 * Riconosce etichette IT/EN tipiche degli insight Instagram/TikTok.
 */
export function extractMetricsFromOcr(text: string): PerformanceMetrics {
  const grab = (labels: string[]) => {
    for (const l of labels) {
      // [ \t] e non \s: gli insight hanno una metrica per riga, non bisogna leggere il numero della riga sopra
      const re = new RegExp(`(?:${l})[ \\t]*[:\\-]?[ \\t]*([\\d.,]+[ \\t]*[kKmM]?)|([\\d.,]+[ \\t]*[kKmM]?)[ \\t]*(?:${l})`, 'i');
      const m = text.match(re);
      if (m) return parseNumber(m[1] ?? m[2]);
    }
    return undefined;
  };
  const views = grab(['visualizzazioni', 'views', 'impression[si]?', 'riproduzioni', 'plays']);
  const reach = grab(['account raggiunti', 'copertura', 'reach', 'accounts reached']);
  const likes = grab(['mi piace', 'likes']);
  const out: PerformanceMetrics = { ocr_text: text };
  if (views !== undefined) out.views = views;
  if (reach !== undefined) out.reach = reach;
  if (likes !== undefined) out.likes = likes;
  out.ocr_validated = (views ?? 0) > 0 || (reach ?? 0) > 0;
  return out;
}

export function submitProof(state: DeskState, taskId: string, proofUrl: string, ocrText: string): DeskState {
  const { task, adSet } = getTask(state, taskId);
  if (task.status !== 'IN_PROGRESS' && task.status !== 'ACCEPTED') {
    throw new DeskError('INVALID_STATE', `Proof non accettata in stato ${task.status}`);
  }
  const metrics = adSet.module_type === 'UGC_FACTORY' ? { ocr_validated: false } : extractMetricsFromOcr(ocrText);
  let next = patchTask(state, taskId, {
    status: 'REVIEW',
    proof_of_work_url: proofUrl,
    performance_metrics: { ...task.performance_metrics, ...metrics },
  });
  next = { ...next, events: [event('proof.submitted', { task_id: taskId, ocr_validated: metrics.ocr_validated }), ...next.events] };
  // Auto-approve se l'OCR valida metriche coerenti (i file UGC richiedono approvazione umana)
  if (metrics.ocr_validated) next = transitionTask(next, taskId, 'APPROVED');
  return next;
}

// ---------------------------------------------------------------------
// Metriche aggregate (Campaign Plan / God Mode)
// ---------------------------------------------------------------------
export interface Aggregates {
  totalCashBudget: number;
  committedSpend: number;
  clearedSpend: number;
  barterBudgetValue: number;
  barterMediaValue: number; // merce effettivamente erogata
  totalReach: number;
  totalViews: number;
  conversions: number;
  blendedCpa: number | null;
  blendedCpm: number | null;
  approvedAssets: number;
  tasks: number;
  byModule: Record<ModuleType, { budget: number; committed: number; tasks: number; reach: number }>;
}

export function aggregate(state: DeskState, campaignId?: string): Aggregates {
  const campaigns = campaignId ? state.campaigns.filter((c) => c.id === campaignId) : state.campaigns;
  const cIds = new Set(campaigns.map((c) => c.id));
  const adSets = state.adSets.filter((a) => cIds.has(a.campaign_id));
  const aIds = new Map(adSets.map((a) => [a.id, a]));
  const tasks = state.tasks.filter((t) => aIds.has(t.ad_set_id));
  const tIds = new Set(tasks.map((t) => t.id));
  const wallet = state.wallet.filter((w) => w.task_id && tIds.has(w.task_id));

  const byModule = {
    PREMIUM_VIP: { budget: 0, committed: 0, tasks: 0, reach: 0 },
    OPEN_DISCOVERY: { budget: 0, committed: 0, tasks: 0, reach: 0 },
    SMART_BARTER: { budget: 0, committed: 0, tasks: 0, reach: 0 },
    UGC_FACTORY: { budget: 0, committed: 0, tasks: 0, reach: 0 },
  };
  for (const a of adSets) {
    byModule[a.module_type].budget +=
      a.module_type === 'SMART_BARTER' ? a.barter_inventory_initial * a.barter_unit_value : a.budget_allocation;
  }
  let reach = 0;
  let views = 0;
  let conversions = 0;
  for (const t of tasks) {
    const m = byModule[aIds.get(t.ad_set_id)!.module_type];
    m.tasks += 1;
    if (t.status !== 'REJECTED') m.committed += t.agreed_fee;
    const r = t.performance_metrics.reach ?? 0;
    m.reach += r;
    reach += r;
    views += t.performance_metrics.views ?? 0;
    conversions += t.performance_metrics.conversions ?? 0;
  }
  const committedSpend = wallet
    .filter((w) => w.transaction_type === 'CASH_PAYMENT' && w.status !== 'FAILED')
    .reduce((s, w) => s + w.amount, 0);
  const clearedSpend = wallet
    .filter((w) => w.transaction_type === 'CASH_PAYMENT' && w.status === 'CLEARED')
    .reduce((s, w) => s + w.amount, 0);
  const barterMediaValue = wallet.filter((w) => w.transaction_type === 'BARTER_REDEEM').reduce((s, w) => s + w.amount, 0);
  const cost = clearedSpend + barterMediaValue;
  const impressions = views || reach;
  return {
    totalCashBudget: campaigns.reduce((s, c) => s + c.total_cash_budget, 0),
    committedSpend,
    clearedSpend,
    barterBudgetValue: campaigns.reduce((s, c) => s + c.total_barter_value, 0),
    barterMediaValue,
    totalReach: reach,
    totalViews: views,
    conversions,
    blendedCpa: conversions > 0 ? cost / conversions : null,
    blendedCpm: impressions > 0 ? (cost / impressions) * 1000 : null,
    approvedAssets: tasks.filter((t) => t.status === 'APPROVED').length,
    tasks: tasks.length,
    byModule,
  };
}
