// Dominio del Trading Desk — specchio 1:1 di db/schema.sql.
// Condiviso tra frontend (src/desk) e API Node (server/).

export type UserRole = 'BRAND' | 'LOCAL_BIZ' | 'CREATOR' | 'AGENCY' | 'ADMIN';
export type CreatorTier = 'NANO' | 'MICRO' | 'MID' | 'MACRO' | 'VIP';
export type CreatorOrigin = 'AUTHENTICATED' | 'SCRAPED' | 'IMPORTED';
export type CampaignObjective = 'REACH' | 'UGC' | 'DRIVE_TO_STORE' | 'CONVERSIONS';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type ModuleType = 'PREMIUM_VIP' | 'OPEN_DISCOVERY' | 'SMART_BARTER' | 'UGC_FACTORY';
export type DeliverableType = 'IG_STORY' | 'TIKTOK_VIDEO' | 'RAW_UGC' | 'COLLAB_POST';
export type TaskStatus =
  | 'PENDING_ACCEPTANCE'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'APPROVED'
  | 'REJECTED';
export type TransactionType = 'CASH_PAYMENT' | 'BARTER_REDEEM' | 'PENALTY_FEE';
export type TransactionStatus = 'HOLD' | 'CLEARED' | 'FAILED';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface CreatorMetrics {
  follower_count: number;
  avg_reach: number;
  engagement_rate_real: number; // percentuale, es. 4.2
}

export interface CreatorProfile {
  id: string;
  user_id: string | null;
  display_name: string;
  social_handles: { ig?: string; tiktok?: string; yt?: string };
  tier: CreatorTier;
  origin: CreatorOrigin;
  categories: string[];
  metrics: CreatorMetrics;
  barter_eligibility_score: number;
  agency?: string;
  base_fee: number; // tariffa indicativa per deliverable
  location: LatLng;
  city: string;
}

export interface TargetingRules {
  radius_km?: number;
  min_followers?: number;
  max_followers?: number;
  min_er?: number;
  min_barter_score?: number;
  categories?: string[];
  tiers?: CreatorTier[];
  center?: LatLng;
}

export interface Campaign {
  id: string;
  advertiser_id: string;
  name: string;
  objective: CampaignObjective;
  total_cash_budget: number;
  total_barter_value: number;
  status: CampaignStatus;
  created_at: string;
}

export interface AdSet {
  id: string;
  campaign_id: string;
  name: string;
  module_type: ModuleType;
  targeting_rules: TargetingRules;
  budget_allocation: number;
  barter_unit_value: number;
  barter_inventory_count: number;
  barter_inventory_initial: number;
  brief: string;
  status: CampaignStatus;
}

export interface PerformanceMetrics {
  views?: number;
  reach?: number;
  likes?: number;
  conversions?: number;
  ocr_text?: string;
  ocr_validated?: boolean;
}

export interface TaskAd {
  id: string;
  ad_set_id: string;
  creator_id: string;
  deliverable_type: DeliverableType;
  status: TaskStatus;
  agreed_fee: number;
  qr_code_hash: string | null;
  redeemed_at: string | null;
  proof_of_work_url: string | null;
  performance_metrics: PerformanceMetrics;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  task_id: string | null;
  transaction_type: TransactionType;
  amount: number;
  status: TransactionStatus;
  created_at: string;
  note?: string;
}

export interface DeskState {
  advertiserId: string;
  creators: CreatorProfile[];
  campaigns: Campaign[];
  adSets: AdSet[];
  tasks: TaskAd[];
  wallet: WalletTransaction[];
  events: DeskEvent[];
}

// Log eventi / webhook in uscita (Spoki, Meta CAPI, ...)
export interface DeskEvent {
  id: string;
  at: string;
  type: string;
  payload: Record<string, unknown>;
}

// ---------------------------------------------------------------------
// AI Campaign Builder — JSON payload del media plan
// ---------------------------------------------------------------------
export interface PlanAdSet {
  name: string;
  module_type: ModuleType;
  budget_allocation: number;
  barter_unit_value?: number;
  barter_inventory_count?: number;
  targeting_rules: TargetingRules;
  deliverable_type: DeliverableType;
  brief: string;
  estimated_creators: number;
  estimated_reach: number;
}

export interface MediaPlanPayload {
  campaign: {
    name: string;
    objective: CampaignObjective;
    total_cash_budget: number;
    total_barter_value: number;
  };
  ad_sets: PlanAdSet[];
  rationale: string[];
}

export interface BuilderAnswers {
  brandName: string;
  objective: CampaignObjective;
  cashBudget: number;
  hasBarter: boolean;
  barterProduct?: string;
  barterUnitValue?: number;
  barterUnits?: number;
  city?: string;
  center?: LatLng;
  categories: string[];
}
