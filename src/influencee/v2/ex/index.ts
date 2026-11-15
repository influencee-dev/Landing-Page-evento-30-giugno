import { PAGE as P_INFLUENCER } from './influencer';
import { PAGE as P_INFLUENCER_ITALIANE } from './influencer-italiane';
import { PAGE as P_ACADEMY } from './academy';
import { PAGE as P_CHI_SIAMO } from './chi-siamo';
import { PAGE as P_GUIDE_E_RISORSE } from './guide-e-risorse';
import { PAGE as P_TUTORIAL } from './tutorial';
import { PAGE as P_CONTRATTO } from './contratto';
import { PAGE as P_CREATOR_MANAGER } from './creator-manager';
import { PAGE as P_AMMINISTRAZIONE_PAGAMENTI } from './amministrazione-pagamenti';
import type { ExPage } from './types';

/** Le pagine ex Elementor (fase 2 del piano senza Elementor). Solo quelle `ready` vanno nel plugin. */
export const EX_PAGES: ExPage[] = [P_INFLUENCER, P_INFLUENCER_ITALIANE, P_ACADEMY, P_CHI_SIAMO, P_GUIDE_E_RISORSE, P_TUTORIAL, P_CONTRATTO, P_CREATOR_MANAGER, P_AMMINISTRAZIONE_PAGAMENTI];
export const exPage = (path: string) => EX_PAGES.find((x) => x.path === path);
