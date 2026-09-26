// API REST del Trading Desk (Express).
// Store in memoria inizializzato con il dataset demo: la persistenza su
// PostgreSQL segue db/schema.sql (stesse entità, stessi enum, stessa logica
// di redeem_barter / eligible_barter_creators).
//
// Avvio: npm run desk:api   (porta DESK_API_PORT, default 8787)

import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import QRCode from 'qrcode';
import {
  aggregate,
  DeskError,
  inviteCreators,
  issueRedeemToken,
  matchCreators,
  materializePlan,
  redeemBarter,
  setCampaignStatus,
  submitProof,
  transitionTask,
} from '../src/desk/core/engine';
import { nextStep, STEPS, type StepId } from '../src/desk/core/nlu';
import { buildMediaPlan } from '../src/desk/core/planner';
import { demoState } from '../src/desk/core/seed';
import type { BuilderAnswers, DeskState, MediaPlanPayload } from '../src/desk/core/types';
import { dispatchWebhooks, extractAnswer, markDelivered, ocrImage } from './integrations';

const PORT = Number(process.env.DESK_API_PORT || 8787);
const QR_SECRET = process.env.BARTER_QR_SECRET || 'dev-only-secret-change-me';
if (!process.env.BARTER_QR_SECRET) console.warn('[desk] BARTER_QR_SECRET non impostato: uso un segreto di sviluppo');

let state: DeskState = demoState();
markDelivered(state.events);

function commit(next: DeskState) {
  state = next;
  dispatchWebhooks(state.events);
  return state;
}

const app = express();
app.use(express.json({ limit: '8mb' }));

// Wrapper per handler async: gli errori di dominio diventano 4xx
const h =
  (fn: (req: Request, res: Response) => unknown) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, llm: !!process.env.GEMINI_API_KEY, ocr: !!process.env.GOOGLE_VISION_API_KEY });
});

app.get('/api/state', (_req, res) => res.json({ state }));

app.post('/api/reset', (_req, res) => {
  state = demoState();
  markDelivered(state.events);
  res.json({ state });
});

// ---- Open Discovery: ricerca nel database creator -------------------
app.get('/api/creators/search', (req, res) => {
  const q = String(req.query.q ?? '').toLowerCase();
  const tier = req.query.tier ? String(req.query.tier).split(',') : null;
  const minEr = Number(req.query.min_er ?? 0);
  const minFollowers = Number(req.query.min_followers ?? 0);
  const results = state.creators.filter(
    (c) =>
      (!q ||
        c.display_name.toLowerCase().includes(q) ||
        c.categories.some((x) => x.includes(q)) ||
        c.city.toLowerCase().includes(q) ||
        Object.values(c.social_handles).some((h) => h?.toLowerCase().includes(q))) &&
      (!tier || tier.includes(c.tier)) &&
      c.metrics.engagement_rate_real >= minEr &&
      c.metrics.follower_count >= minFollowers,
  );
  res.json({ results });
});

// ---- AI Campaign Builder --------------------------------------------
app.post(
  '/api/ai/step',
  h(async (req, res) => {
    const { step, text, answers = {}, answered = [] } = req.body as {
      step: StepId;
      text: string;
      answers: Partial<BuilderAnswers>;
      answered: StepId[];
    };
    const current = STEPS.find((s) => s.id === step);
    if (!current) throw new DeskError('BAD_STEP', 'Step sconosciuto');
    const { patch, engine } = await extractAnswer(step, current.question, text);
    const merged = { ...answers, ...patch };
    res.json({ patch, engine, next: nextStep(merged, new Set([...answered, step])) });
  }),
);

app.post('/api/ai/plan', (req, res) => {
  const answers = req.body.answers as BuilderAnswers;
  res.json({ plan: buildMediaPlan({ categories: [], ...answers }) });
});

// ---- Gerarchia Campagna > Ad Set > Task ----------------------------
app.post('/api/campaigns', (req, res) => {
  const { plan, status = 'DRAFT' } = req.body as { plan: MediaPlanPayload; status?: 'DRAFT' | 'ACTIVE' };
  const out = materializePlan(state, plan, status);
  res.status(201).json({ state: commit(out.state), campaign: out.campaign });
});

app.patch('/api/campaigns/:id', (req, res) => {
  res.json({ state: commit(setCampaignStatus(state, req.params.id, req.body.status)) });
});

app.get('/api/campaigns/:id/metrics', (req, res) => res.json({ metrics: aggregate(state, req.params.id) }));
app.get('/api/metrics', (_req, res) => res.json({ metrics: aggregate(state) }));

app.get('/api/ad-sets/:id/matches', (req, res) => {
  const adSet = state.adSets.find((a) => a.id === req.params.id);
  if (!adSet) throw new DeskError('NOT_FOUND', 'Ad Set inesistente');
  res.json({ results: matchCreators(state.creators, adSet) });
});

app.post('/api/ad-sets/:id/invite', (req, res) => {
  res.json({ state: commit(inviteCreators(state, req.params.id, req.body.creator_ids ?? [])) });
});

app.post('/api/tasks/:id/transition', (req, res) => {
  res.json({ state: commit(transitionTask(state, req.params.id, req.body.to)) });
});

app.post(
  '/api/tasks/:id/proof',
  h(async (req, res) => {
    const { proof_url, image_base64, ocr_text } = req.body as { proof_url: string; image_base64?: string; ocr_text?: string };
    const text = (image_base64 && (await ocrImage(image_base64))) ?? ocr_text ?? '';
    res.json({ state: commit(submitProof(state, req.params.id, proof_url, text)), ocr_text: text });
  }),
);

// ---- Smart Barter QR Flow -------------------------------------------
// 1. App creator: "Redeem" → JWT firmato (TTL 5 min) + QR
app.post(
  '/api/barter/redeem',
  h(async (req, res) => {
    const { token, claims } = await issueRedeemToken(state, req.body.task_id, QR_SECRET);
    res.json({ token, expires_at: claims.exp, qr: await QRCode.toDataURL(token, { margin: 1, width: 280 }) });
  }),
);

// 2. App negoziante: scansiona il QR → verifica, scala l'inventory, registra la transazione
app.post(
  '/api/barter/verify',
  h(async (req, res) => {
    const next = await redeemBarter(state, req.body.token, QR_SECRET);
    res.json({ ok: true, state: commit(next) });
  }),
);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof DeskError) {
    const status = err.code === 'NOT_FOUND' ? 404 : err.code === 'EXPIRED' || err.code.startsWith('BAD_') ? 401 : 409;
    res.status(status).json({ error: err.code, message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: err.message });
});

app.listen(PORT, () => console.log(`[desk] API in ascolto su http://localhost:${PORT}`));
