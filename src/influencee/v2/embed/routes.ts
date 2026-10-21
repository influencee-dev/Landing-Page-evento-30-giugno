import WP_PATHS_LIST from './wp-paths.json';
import { APP } from '../data';

/* ════════════════════════════════════════════════════════════════════
   PLUGIN WORDPRESS "influencee-tools"
   Le pagine tool della v2 vengono servite su influencee.it con lo stesso URL.
   Questo file decide quali pagine prende in carico il plugin e come
   trasformare i link della v2 (#/percorso/) in link del sito WordPress.
   ════════════════════════════════════════════════════════════════════ */

/** Pagine che il plugin serve al posto della pagina Elementor (stesso URL). */
export const TOOL_ROUTES = [
  '/social-media-tool/',
  '/followe-instagram-fake-follower/',
  '/social-media-tool/costo-influencer/',
  '/come-calcolare-engagement-rate/',
  '/preventivo-campagne/',
  '/offerte-lavoro-influencer/',
  '/pubblica-offerta-lavoro/',
  '/social-media-tool/emoticon-da-copiare/',
] as const;

/** URL pubblicati oggi su influencee.it (pagine + articoli, da REST API, 21/10/2026). */
const WP_PATHS = new Set<string>(WP_PATHS_LIST as string[]);

/** Pagine della v2 che su WordPress non esistono ancora: pagina più vicina. */
const LINK_MAP: Record<string, string> = {
  '/prezzi/': '/piattaforma-influencer/',
  '/contatti/': '/contatti-influencee/',
  '/micro-influencer/': '/guida-definitiva-al-micro-influencer-marketing-2026/',
  '/ugc-creator/': '/content-creator/',
  '/diventa-creator/': APP.creator,
  '/blog/': '/news-influencer-marketing/',
  '/benchmark-engagement-rate/': '/come-calcolare-engagement-rate/',
  '/creator-verificati/': '/piattaforma-influencer/',
  '/influencer-marketing-aziende/': '/piattaforma-influencer-marketing/',
  '/piattaforma-agenzie/': '/agenzie/',
  '/contenuti-ugc/': '/gestione-ugc/',
  '/influencer-marketing-locale/': '/local-influencer-marketing-per-promuovere-le-imprese-locali/',
  '/creator-professionisti/': '/piattaforma-influencer/',
  '/funzionalita/contratto-influencer/': '/contratto-social-media-influencer-ugc/',
  '/annunci-collaborazioni/': '/offerte-lavoro-influencer/',
  '/preventivi-influencer/': '/preventivo-campagne/',
};

/** Trasforma un href della v2 in un href valido su influencee.it. */
export function wpHref(href: string): string {
  if (!href.startsWith('#/')) return href;
  const [raw, hash] = href.slice(1).split('#');
  const path = raw.split('?')[0].replace(/\/?$/, '/');
  let out: string;
  if ((TOOL_ROUTES as readonly string[]).includes(path) || WP_PATHS.has(path)) out = path;
  else if (LINK_MAP[path]) out = LINK_MAP[path];
  else if (path.startsWith('/influencer-italiani/') || path.endsWith('-influencers/')) out = '/influencer-italiani/';
  else out = '/piattaforma-influencer/';
  return hash ? `${out}#${hash}` : out;
}

/** Nome del file HTML pre-renderizzato per una route (es. social-media-tool__costo-influencer). */
export const slugOf = (path: string) => path.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home';
