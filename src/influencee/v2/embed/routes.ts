import WP_PATHS_LIST from './wp-paths.json';

/* ════════════════════════════════════════════════════════════════════
   PLUGIN WORDPRESS "influencee-tools"
   Le pagine tool della v2 vengono servite su influencee.it con lo stesso URL.
   Questo file decide quali pagine prende in carico il plugin e come
   trasformare i link della v2 (#/percorso/) in link del sito WordPress.
   ════════════════════════════════════════════════════════════════════ */

/** Tool restaurati (gruppo "tool"): il plugin li serve al posto della pagina Elementor. */
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

/** Pagine della v2 che il plugin non porta su WordPress: link alla pagina più vicina. */
const LINK_MAP: Record<string, string> = {
  '/blog/': '/news-influencer-marketing/', // il blog resta quello di WordPress
  '/benchmark-engagement-rate/': '/come-calcolare-engagement-rate/', // eviterebbe concorrenza su "engagement rate instagram"
  '/contatti/': '/contatti-influencee/',
  '/annunci-collaborazioni/': '/offerte-lavoro-influencer/',
  '/preventivi-influencer/': '/preventivo-campagne/',
};
export const EXCLUDED = new Set(Object.keys(LINK_MAP));

/** Gruppo di una pagina nel plugin: decide se è accesa all'installazione.
 *  tool = i tool restaurati (accesi) · nuova = URL che oggi su WordPress non esiste (accesa)
 *  sostituzione = URL che su WordPress esiste già con traffico (spenta finché il titolare non la accende). */
export function groupOf(path: string): 'tool' | 'nuova' | 'sostituzione' {
  if ((TOOL_ROUTES as readonly string[]).includes(path)) return 'tool';
  return WP_PATHS.has(path) ? 'sostituzione' : 'nuova';
}

/** Trasforma un href della v2 in un href valido su influencee.it. */
export function wpHref(href: string): string {
  if (!href.startsWith('#/')) return href;
  const [raw, hash] = href.slice(1).split('#');
  const path = raw.split('?')[0].replace(/\/?$/, '/');
  let out: string;
  if (LINK_MAP[path]) out = LINK_MAP[path];
  else out = path; // tutte le altre pagine della v2 sono servite dal plugin o esistono già su WordPress
  return hash ? `${out}#${hash}` : out;
}

/** Nome del file HTML pre-renderizzato per una route (es. social-media-tool__costo-influencer). */
export const slugOf = (path: string) => path.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home';
