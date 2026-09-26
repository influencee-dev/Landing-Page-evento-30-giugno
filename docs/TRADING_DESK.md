# Creator Trading Desk (DSP) — prototipo

Modulo separato dalla landing dell'evento: la landing resta su `/`, il desk è su `/desk.html`.

## Avvio

```bash
npm install
npm run desk:api   # API Express su :8787 (opzionale)
npm run dev        # poi apri http://localhost:3000/desk.html
```

Senza API il frontend gira in **modalità demo**: lo stesso motore viene eseguito nel browser.

## Struttura

| Percorso | Contenuto |
|---|---|
| `db/schema.sql` | Schema PostgreSQL + PostGIS (users, creators_profile, campaigns, ad_sets, tasks_ads, wallet_transactions, rfps, outreach, webhook) + funzioni `eligible_barter_creators()` e `redeem_barter()` |
| `src/desk/core/` | Dominio condiviso FE/BE: tipi, planner AI (CBO), matching geospaziale, QR JWT HS256 (TTL 5 min), OCR anti-frode, clearing/escrow, metriche aggregate |
| `src/desk/components/` | Campaign Plan (God Mode), Ads Manager (Campagna › Ad Set › Task), AI Builder, Open Discovery, Smart Barter (QR + POS), Clearing House |
| `server/` | API REST + integrazioni opzionali |

## Variabili d'ambiente (server)

| Variabile | Effetto |
|---|---|
| `BARTER_QR_SECRET` | Segreto di firma dei QR (obbligatorio in produzione) |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Estrazione LLM delle risposte dell'AI Builder (fallback a regole) |
| `GOOGLE_VISION_API_KEY` | OCR reale degli screenshot di Proof of Work |
| `WEBHOOK_URL_SPOKI` | Riceve gli eventi `webhook.*` (check-in, task approvate) |
| `WEBHOOK_URL_META` | Riceve gli eventi `meta.*` (asset UGC approvati) |

## Endpoint principali

`GET /api/state` · `POST /api/ai/step` · `POST /api/ai/plan` · `POST /api/campaigns` · `PATCH /api/campaigns/:id` ·
`GET /api/ad-sets/:id/matches` · `POST /api/ad-sets/:id/invite` · `POST /api/tasks/:id/transition` · `POST /api/tasks/:id/proof` ·
`POST /api/barter/redeem` · `POST /api/barter/verify` · `GET /api/metrics`

## Limiti attuali

- Store in memoria: lo schema SQL è pronto ma l'API non è ancora collegata a PostgreSQL (schema non ancora eseguito su un DB reale).
- Scraping/worker BullMQ, invio email/DM reale e pagamenti non sono implementati: vengono registrati come eventi.
