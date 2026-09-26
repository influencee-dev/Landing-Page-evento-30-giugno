// Dataset demo: creator geolocalizzati su Milano/Roma + una campagna già in volo.
// In produzione questi record arrivano da creators_profile (scraping + onboarding).

import { inviteCreators, materializePlan, setCampaignStatus, transitionTask } from './engine';
import { buildMediaPlan } from './planner';
import type { CreatorProfile, CreatorTier, DeskState, LatLng } from './types';

export const CITIES: Record<string, LatLng> = {
  Milano: { lat: 45.4642, lng: 9.19 },
  Roma: { lat: 41.9028, lng: 12.4964 },
  Napoli: { lat: 40.8518, lng: 14.2681 },
  Torino: { lat: 45.0703, lng: 7.6869 },
};

type Row = [
  name: string,
  handle: string,
  tier: CreatorTier,
  origin: CreatorProfile['origin'],
  followers: number,
  er: number,
  barterScore: number,
  fee: number,
  city: keyof typeof CITIES,
  categories: string[],
  agency?: string,
];

const ROWS: Row[] = [
  ['Giulia Ferri', 'giuliaferri', 'VIP', 'IMPORTED', 1_450_000, 2.1, 0, 9000, 'Milano', ['fashion', 'lifestyle'], 'Stardust Talent'],
  ['Marco Ranieri', 'marcoranieri', 'MACRO', 'IMPORTED', 620_000, 3.4, 0, 4200, 'Milano', ['food', 'travel'], 'Show Reel Agency'],
  ['Sofia Leone', 'sofialeone', 'MACRO', 'IMPORTED', 310_000, 4.1, 0, 2600, 'Roma', ['beauty', 'lifestyle'], 'Stardust Talent'],
  ['Luca Bassi', 'lucabassi.eats', 'MACRO', 'SCRAPED', 240_000, 3.8, 0, 2200, 'Milano', ['food'], 'Show Reel Agency'],
  ['Chiara Monti', 'chiaramonti', 'MID', 'SCRAPED', 92_000, 4.6, 0, 850, 'Milano', ['fashion', 'beauty']],
  ['Davide Rizzo', 'davidetech', 'MID', 'SCRAPED', 78_000, 5.2, 0, 700, 'Torino', ['tech']],
  ['Elena Gatti', 'elenagatti', 'MID', 'SCRAPED', 55_000, 3.9, 0, 520, 'Roma', ['food', 'lifestyle']],
  ['Paolo Neri', 'paoloneri', 'MICRO', 'SCRAPED', 38_000, 6.1, 0, 380, 'Milano', ['fitness', 'lifestyle']],
  ['Alessia Conti', 'alessiaconti', 'MICRO', 'SCRAPED', 24_000, 5.5, 0, 300, 'Napoli', ['food', 'travel']],
  ['Federico Sala', 'fedesala', 'MICRO', 'IMPORTED', 17_500, 4.8, 0, 250, 'Milano', ['tech', 'lifestyle']],
  ['Martina Greco', 'martinagreco', 'MICRO', 'AUTHENTICATED', 14_200, 7.2, 82, 180, 'Milano', ['food', 'lifestyle', 'ugc']],
  ['Simone Villa', 'simonevilla', 'MICRO', 'AUTHENTICATED', 11_800, 5.9, 74, 160, 'Milano', ['food', 'fitness']],
  ['Irene Colombo', 'irenecolombo', 'NANO', 'AUTHENTICATED', 6_400, 8.4, 66, 90, 'Milano', ['food', 'fashion', 'ugc']],
  ['Tommaso Fabbri', 'tommifabbri', 'NANO', 'AUTHENTICATED', 4_900, 9.1, 71, 80, 'Milano', ['food', 'travel']],
  ['Beatrice Marino', 'bea.marino', 'NANO', 'AUTHENTICATED', 3_200, 10.3, 58, 70, 'Milano', ['beauty', 'ugc']],
  ['Nicolò Ferrara', 'nicoferrara', 'NANO', 'AUTHENTICATED', 2_100, 6.7, 45, 60, 'Milano', ['food']],
  ['Giorgia Lombardi', 'giorgialomb', 'NANO', 'AUTHENTICATED', 1_200, 4.2, 30, 50, 'Milano', ['food']],
  ['Anna Ricci', 'annaricci.ugc', 'MICRO', 'AUTHENTICATED', 9_800, 6.3, 60, 120, 'Roma', ['ugc', 'beauty']],
  ['Kevin Esposito', 'kevin.creates', 'NANO', 'AUTHENTICATED', 3_900, 7.5, 52, 95, 'Napoli', ['ugc', 'tech']],
  ['Laura Vitale', 'lauravitale.ugc', 'NANO', 'AUTHENTICATED', 2_700, 8.9, 48, 85, 'Torino', ['ugc', 'food', 'fashion']],
  ['Pietro Galli', 'pietrogalli', 'MICRO', 'AUTHENTICATED', 19_000, 5.1, 77, 220, 'Roma', ['food', 'lifestyle']],
  ['Carla De Luca', 'carladeluca', 'NANO', 'AUTHENTICATED', 5_300, 7.8, 69, 75, 'Roma', ['food']],
];

// Jitter deterministico per spargere i creator nel quartiere (0–8 km circa)
function jitter(base: LatLng, i: number): LatLng {
  const angle = (i * 137.5 * Math.PI) / 180;
  const km = ((i * 7) % 9) + 0.5;
  return {
    lat: base.lat + (km / 111) * Math.cos(angle),
    lng: base.lng + (km / (111 * Math.cos((base.lat * Math.PI) / 180))) * Math.sin(angle),
  };
}

export function seedCreators(): CreatorProfile[] {
  return ROWS.map(([name, handle, tier, origin, followers, er, barter, fee, city, categories, agency], i) => ({
    id: `cr_${String(i + 1).padStart(3, '0')}`,
    user_id: origin === 'AUTHENTICATED' ? `usr_cr_${i + 1}` : null,
    display_name: name,
    social_handles: { ig: `@${handle}`, ...(i % 3 === 0 ? { tiktok: `@${handle}` } : {}) },
    tier,
    origin,
    categories,
    metrics: {
      follower_count: followers,
      avg_reach: Math.round(followers * (0.12 + er / 100)),
      engagement_rate_real: er,
    },
    barter_eligibility_score: barter,
    agency,
    base_fee: fee,
    location: jitter(CITIES[city], i),
    city,
  }));
}

export function emptyState(): DeskState {
  return {
    advertiserId: 'usr_brand_demo',
    creators: seedCreators(),
    campaigns: [],
    adSets: [],
    tasks: [],
    wallet: [],
    events: [],
  };
}

/** Stato iniziale con una campagna "Drive-to-Store" già attiva e alcune task avanzate. */
export function demoState(): DeskState {
  let state = emptyState();
  const plan = buildMediaPlan({
    brandName: 'Osteria Navigli',
    objective: 'DRIVE_TO_STORE',
    cashBudget: 15_000,
    hasBarter: true,
    barterProduct: 'Cena degustazione per 2',
    barterUnitValue: 80,
    barterUnits: 50,
    city: 'Milano',
    center: CITIES.Milano,
    categories: ['food', 'lifestyle'],
  });
  const res = materializePlan(state, plan, 'ACTIVE');
  state = res.state;
  const sets = state.adSets.filter((a) => a.campaign_id === res.campaign.id);
  const byType = (m: string) => sets.find((s) => s.module_type === m)!;

  state = inviteCreators(state, byType('PREMIUM_VIP').id, ['cr_002']);
  state = inviteCreators(state, byType('OPEN_DISCOVERY').id, ['cr_005', 'cr_008', 'cr_010']);
  state = inviteCreators(state, byType('SMART_BARTER').id, ['cr_011', 'cr_012', 'cr_013', 'cr_014']);
  state = inviteCreators(state, byType('UGC_FACTORY').id, ['cr_011', 'cr_015']);

  const taskFor = (creator: string, module: string) =>
    state.tasks.find((t) => t.creator_id === creator && t.ad_set_id === byType(module).id)!.id;

  // Qualche task già avanzata per popolare la dashboard
  state = transitionTask(state, taskFor('cr_002', 'PREMIUM_VIP'), 'ACCEPTED');
  state = transitionTask(state, taskFor('cr_005', 'OPEN_DISCOVERY'), 'ACCEPTED');
  state = transitionTask(state, taskFor('cr_005', 'OPEN_DISCOVERY'), 'IN_PROGRESS');
  state = transitionTask(state, taskFor('cr_005', 'OPEN_DISCOVERY'), 'REVIEW');
  state = transitionTask(state, taskFor('cr_005', 'OPEN_DISCOVERY'), 'APPROVED');
  state = {
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === taskFor('cr_005', 'OPEN_DISCOVERY')
        ? { ...t, proof_of_work_url: 'demo://story-insights.png', performance_metrics: { views: 21_400, reach: 18_900, conversions: 37, ocr_validated: true } }
        : t,
    ),
  };
  state = transitionTask(state, taskFor('cr_011', 'SMART_BARTER'), 'ACCEPTED');
  state = transitionTask(state, taskFor('cr_012', 'SMART_BARTER'), 'ACCEPTED');
  state = transitionTask(state, taskFor('cr_011', 'UGC_FACTORY'), 'ACCEPTED');
  state = transitionTask(state, taskFor('cr_011', 'UGC_FACTORY'), 'IN_PROGRESS');
  return state;
}
