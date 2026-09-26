-- =====================================================================
-- Influencer & UGC Trading Desk (DSP) — PostgreSQL schema
-- Gerarchia CBO: campaigns (L1) > ad_sets (L2) > tasks_ads (L3)
-- Richiede: PostgreSQL 14+, estensioni pgcrypto + postgis
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
CREATE TYPE user_role            AS ENUM ('BRAND', 'LOCAL_BIZ', 'CREATOR', 'AGENCY', 'ADMIN');
CREATE TYPE subscription_status  AS ENUM ('NONE', 'TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED');
CREATE TYPE creator_tier         AS ENUM ('NANO', 'MICRO', 'MID', 'MACRO', 'VIP');
CREATE TYPE creator_origin       AS ENUM ('AUTHENTICATED', 'SCRAPED', 'IMPORTED');
CREATE TYPE campaign_objective   AS ENUM ('REACH', 'UGC', 'DRIVE_TO_STORE', 'CONVERSIONS');
CREATE TYPE campaign_status      AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE module_type          AS ENUM ('PREMIUM_VIP', 'OPEN_DISCOVERY', 'SMART_BARTER', 'UGC_FACTORY');
CREATE TYPE deliverable_type     AS ENUM ('IG_STORY', 'TIKTOK_VIDEO', 'RAW_UGC', 'COLLAB_POST');
CREATE TYPE task_status          AS ENUM ('PENDING_ACCEPTANCE', 'ACCEPTED', 'IN_PROGRESS', 'REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE transaction_type     AS ENUM ('CASH_PAYMENT', 'BARTER_REDEEM', 'PENALTY_FEE');
CREATE TYPE transaction_status   AS ENUM ('HOLD', 'CLEARED', 'FAILED');
CREATE TYPE rfp_status           AS ENUM ('SENT', 'NEGOTIATING', 'ACCEPTED', 'DECLINED', 'CONTRACTED');
CREATE TYPE outreach_status      AS ENUM ('QUEUED', 'SENT', 'OPENED', 'ONBOARDED', 'BOUNCED');

-- ---------------------------------------------------------------------
-- 1. users
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               CITEXT UNIQUE,
  role                user_role NOT NULL,
  company_details     JSONB NOT NULL DEFAULT '{}'::jsonb,
  subscription_status subscription_status NOT NULL DEFAULT 'NONE',  -- es. 10€/mese per LOCAL_BIZ
  subscription_plan   TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. creators_profile
-- ---------------------------------------------------------------------
CREATE TABLE creators_profile (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL se solo scrapato
  display_name             TEXT NOT NULL,
  social_handles           JSONB NOT NULL DEFAULT '{}'::jsonb,           -- {"ig":"@x","tiktok":"@x","yt":"..."}
  tier                     creator_tier NOT NULL,
  origin                   creator_origin NOT NULL,
  categories               TEXT[] NOT NULL DEFAULT '{}',                  -- aggiornate dall'LLM sulla bio
  metrics                  JSONB NOT NULL DEFAULT '{}'::jsonb,           -- follower_count, avg_reach, engagement_rate_real
  barter_eligibility_score INT NOT NULL DEFAULT 0 CHECK (barter_eligibility_score BETWEEN 0 AND 100),
  agency_id                UUID REFERENCES users(id),                     -- talent agency (modulo VIP)
  location                 GEOGRAPHY(POINT, 4326),
  raw_scrape               JSONB,                                          -- payload non strutturato da scraping
  last_scraped_at          TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX creators_location_gix   ON creators_profile USING GIST (location);
CREATE INDEX creators_categories_gin ON creators_profile USING GIN (categories);
CREATE INDEX creators_metrics_gin    ON creators_profile USING GIN (metrics jsonb_path_ops);
CREATE INDEX creators_tier_idx       ON creators_profile (tier);

-- ---------------------------------------------------------------------
-- 3. campaigns (Livello 1 — CBO)
-- ---------------------------------------------------------------------
CREATE TABLE campaigns (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id      UUID NOT NULL REFERENCES users(id),
  name               TEXT NOT NULL,
  objective          campaign_objective NOT NULL,
  total_cash_budget  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_cash_budget >= 0),
  total_barter_value NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_barter_value >= 0),
  status             campaign_status NOT NULL DEFAULT 'DRAFT',
  ai_plan_payload    JSONB,                                             -- output dell'AI Campaign Builder
  starts_at          DATE,
  ends_at            DATE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 4. ad_sets (Livello 2 — Targeting & Modulo)
-- ---------------------------------------------------------------------
CREATE TABLE ad_sets (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id            UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name                   TEXT NOT NULL,
  module_type            module_type NOT NULL,
  targeting_rules        JSONB NOT NULL DEFAULT '{}'::jsonb,           -- radius_km, min_followers, min_er, categories, tiers
  target_location        GEOGRAPHY(POINT, 4326),                       -- centro per SMART_BARTER
  budget_allocation      NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (budget_allocation >= 0),
  barter_unit_value      NUMERIC(10,2),                                -- valore percepito di 1 unità merce
  barter_inventory_count INT NOT NULL DEFAULT 0 CHECK (barter_inventory_count >= 0),
  brief                  TEXT,
  status                 campaign_status NOT NULL DEFAULT 'DRAFT',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ad_sets_campaign_idx ON ad_sets (campaign_id);

-- ---------------------------------------------------------------------
-- 5. tasks_ads (Livello 3 — Execution)
-- ---------------------------------------------------------------------
CREATE TABLE tasks_ads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_set_id           UUID NOT NULL REFERENCES ad_sets(id) ON DELETE CASCADE,
  creator_id          UUID REFERENCES creators_profile(id),
  deliverable_type    deliverable_type NOT NULL,
  status              task_status NOT NULL DEFAULT 'PENDING_ACCEPTANCE',
  agreed_fee          NUMERIC(10,2) NOT NULL DEFAULT 0,
  qr_code_hash        TEXT UNIQUE,                                     -- SHA-256 del JWT emesso (Smart Barter)
  redeemed_at         TIMESTAMPTZ,
  proof_of_work_url   TEXT,
  usage_rights        JSONB,                                           -- UGC: whitelisting / dark posting, durata, territori
  performance_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,              -- OCR / API insight
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX tasks_ad_set_idx  ON tasks_ads (ad_set_id);
CREATE INDEX tasks_creator_idx ON tasks_ads (creator_id);

-- ---------------------------------------------------------------------
-- 6. wallet_transactions (Clearing House)
-- ---------------------------------------------------------------------
CREATE TABLE wallet_transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  task_id          UUID REFERENCES tasks_ads(id),
  transaction_type transaction_type NOT NULL,
  amount           NUMERIC(12,2) NOT NULL,
  status           transaction_status NOT NULL DEFAULT 'HOLD',
  meta             JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX wallet_user_idx ON wallet_transactions (user_id);

-- ---------------------------------------------------------------------
-- Tabelle di supporto ai moduli
-- ---------------------------------------------------------------------
-- A. VIP Premium — RFP verso talent agency
CREATE TABLE rfps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_set_id      UUID NOT NULL REFERENCES ad_sets(id) ON DELETE CASCADE,
  agency_id      UUID NOT NULL REFERENCES users(id),
  creator_id     UUID REFERENCES creators_profile(id),
  pricing_model  TEXT NOT NULL CHECK (pricing_model IN ('FLAT_FEE', 'CPM_GUARANTEED')),
  proposed_fee   NUMERIC(10,2),
  guaranteed_cpm NUMERIC(8,2),
  status         rfp_status NOT NULL DEFAULT 'SENT',
  contract_url   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- B. Open Discovery — cold outreach
CREATE TABLE outreach_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_set_id    UUID NOT NULL REFERENCES ad_sets(id) ON DELETE CASCADE,
  creator_id   UUID NOT NULL REFERENCES creators_profile(id),
  channel      TEXT NOT NULL CHECK (channel IN ('EMAIL', 'DM')),
  onboarding_token TEXT UNIQUE NOT NULL,
  status       outreach_status NOT NULL DEFAULT 'QUEUED',
  sent_at      TIMESTAMPTZ
);

-- Webhook out (Spoki, Meta Custom Audiences, ...)
CREATE TABLE webhook_subscriptions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   UUID NOT NULL REFERENCES users(id),
  event      TEXT NOT NULL,           -- es. barter.redeemed, task.approved
  target_url TEXT NOT NULL,
  secret     TEXT NOT NULL,
  active     BOOLEAN NOT NULL DEFAULT true
);

-- ---------------------------------------------------------------------
-- Matching Engine (Smart Barter): creator eleggibili nel raggio dell'Ad Set
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION eligible_barter_creators(p_ad_set UUID)
RETURNS SETOF creators_profile LANGUAGE sql STABLE AS $$
  SELECT c.*
  FROM ad_sets a
  JOIN creators_profile c
    ON ST_DWithin(c.location, a.target_location,
                  COALESCE((a.targeting_rules->>'radius_km')::numeric, 10) * 1000)
  WHERE a.id = p_ad_set
    AND a.module_type = 'SMART_BARTER'
    AND c.tier IN ('NANO', 'MICRO')
    AND COALESCE((c.metrics->>'follower_count')::int, 0)
        >= COALESCE((a.targeting_rules->>'min_followers')::int, 0)
    AND COALESCE((c.metrics->>'engagement_rate_real')::numeric, 0)
        >= COALESCE((a.targeting_rules->>'min_er')::numeric, 0)
    AND c.barter_eligibility_score >= COALESCE((a.targeting_rules->>'min_barter_score')::int, 0)
$$;

-- ---------------------------------------------------------------------
-- Erogazione Barter: decremento atomico dell'inventory + wallet record
-- Da chiamare dentro /api/barter/verify dopo la validazione del JWT.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION redeem_barter(p_task UUID, p_qr_hash TEXT)
RETURNS wallet_transactions LANGUAGE plpgsql AS $$
DECLARE
  v_task   tasks_ads;
  v_adset  ad_sets;
  v_camp   campaigns;
  v_tx     wallet_transactions;
BEGIN
  SELECT * INTO v_task FROM tasks_ads WHERE id = p_task FOR UPDATE;
  IF v_task.id IS NULL OR v_task.redeemed_at IS NOT NULL THEN
    RAISE EXCEPTION 'TASK_NOT_REDEEMABLE';
  END IF;

  UPDATE ad_sets SET barter_inventory_count = barter_inventory_count - 1
   WHERE id = v_task.ad_set_id AND barter_inventory_count > 0
  RETURNING * INTO v_adset;
  IF v_adset.id IS NULL THEN
    RAISE EXCEPTION 'INVENTORY_EXHAUSTED';
  END IF;

  SELECT * INTO v_camp FROM campaigns WHERE id = v_adset.campaign_id;

  UPDATE tasks_ads
     SET redeemed_at = now(), qr_code_hash = p_qr_hash, status = 'IN_PROGRESS', updated_at = now()
   WHERE id = p_task;

  INSERT INTO wallet_transactions (user_id, task_id, transaction_type, amount, status, meta)
  VALUES (v_camp.advertiser_id, p_task, 'BARTER_REDEEM', COALESCE(v_adset.barter_unit_value, 0), 'CLEARED',
          jsonb_build_object('ad_set_id', v_adset.id, 'inventory_left', v_adset.barter_inventory_count))
  RETURNING * INTO v_tx;
  RETURN v_tx;
END $$;
