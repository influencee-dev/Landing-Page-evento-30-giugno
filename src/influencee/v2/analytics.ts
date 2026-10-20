/* ════════════════════════════════════════════════════════════════════
   TRACCIAMENTO GA4 DEL SITO v2
   Piano completo (eventi, parametri, report, decisioni): ANALYTICS-PIANO.md

   Come funziona
   · Ogni evento va nel dataLayer (compatibile con Google Tag Manager) e,
     se è impostato GA4_ID, direttamente a GA4 con gtag.
   · Un solo ascoltatore globale intercetta TUTTI i clic su link e
     pulsanti: nessun pulsante resta senza evento, anche quelli futuri.
   · Il tipo di clic si deduce dalla destinazione (iscrizione brand,
     iscrizione creator, WhatsApp, pagina interna, sito esterno…) e la
     posizione dal contesto (header, footer, sezione con il suo titolo).
   · Consent Mode v2: i cookie di analisi partono negati e si attivano
     solo se l'utente accetta il banner.
   · Debug: aggiungi ?debug_analytics all'indirizzo per vedere gli eventi
     nella console del browser.
   ════════════════════════════════════════════════════════════════════ */

/** ⚠ Inserire l'ID della proprietà GA4 (Amministrazione → Stream di dati). */
export const GA4_ID = '';
/** Domini collegati: il visitatore resta lo stesso tra sito e app. */
const LINKED_DOMAINS = ['influencee.it', 'app.influencee.it'];

type Params = Record<string, string | number | boolean | undefined>;
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const DEBUG = typeof window !== 'undefined' && /debug_analytics/.test(window.location.href);
let ctx: { page_path: string; page_type: string; audience: string } = { page_path: '/', page_type: 'home', audience: 'misto' };

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // gtag vuole l'oggetto arguments, non un array
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
  void args;
}

/** Invia un evento. I parametri di pagina vengono aggiunti sempre. */
export function track(event: string, params: Params = {}) {
  const payload = { ...ctx, ...params };
  if (DEBUG) console.info('%c[GA4]', 'color:#ff1f8f;font-weight:bold', event, payload);
  if (typeof window === 'undefined') return;
  gtag('event', event, payload);
}

/* ─── Tipo di pagina e pubblico: diventano dimensioni personalizzate ─ */
export function pageTypeOf(path: string): { page_type: string; audience: string } {
  if (path === '/') return { page_type: 'home', audience: 'misto' };
  if (path === '/prezzi/') return { page_type: 'prezzi', audience: 'brand' };
  if (path.startsWith('/funzionalita/') || path === '/piattaforma-influencer/') return { page_type: 'prodotto', audience: 'brand' };
  if (['/influencer-marketing-aziende/', '/piattaforma-agenzie/', '/micro-influencer/', '/contenuti-ugc/', '/influencer-marketing-locale/', '/creator-professionisti/'].includes(path)) return { page_type: 'soluzione', audience: 'brand' };
  if (['/diventa-creator/', '/ugc-creator/'].includes(path)) return { page_type: 'creator', audience: 'creator' };
  if (path === '/offerte-lavoro-influencer/') return { page_type: 'offerte_lavoro', audience: 'creator' };
  if (path === '/preventivo-campagne/') return { page_type: 'servizio_gestito', audience: 'brand' };
  if (path === '/pubblica-offerta-lavoro/') return { page_type: 'pubblica_offerta', audience: 'brand' };
  if (path === '/social-media-tool/emoticon-da-copiare/') return { page_type: 'strumento', audience: 'creator' };
  if (path === '/social-media-tool/' ) return { page_type: 'hub_strumenti', audience: 'misto' };
  if (['/benchmark-engagement-rate/', '/come-calcolare-engagement-rate/', '/social-media-tool/costo-influencer/', '/followe-instagram-fake-follower/'].includes(path)) return { page_type: 'strumento', audience: 'brand' };
  if (path === '/creator-verificati/') return { page_type: 'prodotto', audience: 'brand' };
  if (path.startsWith('/influencer-italiani/influencer-')) return { page_type: path.split('/').filter(Boolean).length > 2 ? 'citta' : 'regione', audience: 'brand' };
  if (path === '/influencer-italiani/') return { page_type: 'hub_influencer', audience: 'brand' };
  if (path.endsWith('-influencers/')) return { page_type: 'categoria', audience: 'brand' };
  if (path === '/contatti/') return { page_type: 'contatti', audience: 'brand' };
  if (path === '/blog/') return { page_type: 'blog', audience: 'misto' };
  return { page_type: 'altro', audience: 'misto' };
}

/* ─── Classificazione della destinazione di un clic ─────────────── */
function classify(href: string): { event: string; link_type: string; key?: string } {
  if (/wa\.me|whatsapp/i.test(href)) return { event: 'whatsapp_click', link_type: 'whatsapp', key: 'whatsapp' };
  if (href.startsWith('tel:')) return { event: 'phone_click', link_type: 'telefono', key: 'telefono' };
  if (href.startsWith('mailto:')) return { event: 'email_click', link_type: 'email', key: 'email' };
  if (/app\.influencee\.it\/iscriviti\/brand/.test(href)) return { event: 'signup_brand_click', link_type: 'iscrizione_brand' };
  if (/app\.influencee\.it\/iscriviti\/creator/.test(href)) return { event: 'signup_creator_click', link_type: 'iscrizione_creator' };
  if (/app\.influencee\.it\/iscriviti\/?$/.test(href)) return { event: 'signup_choice_click', link_type: 'iscrizione_scelta' };
  if (/app\.influencee\.it\/accounts\/login/.test(href)) return { event: 'login_click', link_type: 'accesso' };
  if (/app\.influencee\.it\/annunci/.test(href)) return { event: 'app_tool_click', link_type: 'annunci_app' };
  if (/app\.influencee\.it\/benchmark/.test(href)) return { event: 'app_tool_click', link_type: 'benchmark_app' };
  if (/app\.influencee\.it/.test(href)) return { event: 'app_link_click', link_type: 'app_altro' };
  if (href.startsWith('#/') || href.startsWith('/')) return { event: 'internal_link_click', link_type: 'interno' };
  if (/^https?:/.test(href)) return { event: 'outbound_click', link_type: 'esterno' };
  return { event: 'ui_click', link_type: 'interfaccia' };
}

/** Dove si trova l'elemento cliccato: zona e titolo della sezione. */
function locate(el: Element): { cta_location: string; section_name: string; section_index: number } {
  const zone = el.closest('[data-track-zone]')?.getAttribute('data-track-zone');
  if (zone) return { cta_location: zone, section_name: zone, section_index: -1 };
  if (el.closest('header, [aria-label="Menu principale"], [aria-label="Menu mobile"]')) return { cta_location: el.closest('[aria-label="Menu mobile"]') ? 'menu_mobile' : 'header', section_name: 'header', section_index: 0 };
  if (el.closest('footer')) return { cta_location: 'footer', section_name: 'footer', section_index: 99 };
  if (el.closest('nav[aria-label="Percorso"]')) return { cta_location: 'breadcrumb', section_name: 'breadcrumb', section_index: 0 };
  const sec = el.closest('main section');
  const all = Array.from(document.querySelectorAll('main section'));
  const idx = sec ? all.indexOf(sec) : -1;
  const title = sec?.querySelector('h1, h2')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 60) ?? '';
  return { cta_location: idx === 0 ? 'hero' : `sezione_${idx + 1}`, section_name: title || 'senza_titolo', section_index: idx + 1 };
}

/** Eventi chiave: inviati anche come eventi GA4 consigliati. */
function keyEvents(kind: string, params: Params) {
  if (kind === 'signup_brand_click' || kind === 'signup_creator_click' || kind === 'signup_choice_click') track('begin_sign_up', { ...params, signup_audience: kind.includes('brand') ? 'brand' : kind.includes('creator') ? 'creator' : 'da_scegliere' });
  if (kind === 'whatsapp_click' || kind === 'phone_click' || kind === 'email_click') track('generate_lead', { ...params, lead_source: params.link_type as string, currency: 'EUR', value: 0 });
}

/* ─── Ascoltatori globali ───────────────────────────────────────── */
let started = false;
export function initAnalytics() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.dataLayer = window.dataLayer || [];

  // Consent Mode v2: tutto negato finché l'utente non sceglie
  const saved = readConsent();
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: saved === 'granted' ? 'granted' : 'denied', wait_for_update: 500 });
  gtag('js', new Date());
  if (GA4_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    window.gtag = gtag;
    gtag('config', GA4_ID, { send_page_view: false, linker: { domains: LINKED_DOMAINS } });
  }

  // Tutti i clic su link e pulsanti
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest('a, button');
      if (!el || el.hasAttribute('data-track-ignore')) return;
      const href = el instanceof HTMLAnchorElement ? el.getAttribute('href') ?? '' : '';
      const text = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      const where = locate(el);
      const override = el.getAttribute('data-track');
      const base = href ? classify(href) : { event: 'ui_click', link_type: el.getAttribute('type') === 'submit' ? 'invio_modulo' : 'interfaccia' };
      const isMenu = where.cta_location === 'header' || where.cta_location === 'menu_mobile';
      const event = override || (base.event === 'internal_link_click' && isMenu ? 'menu_click' : base.event === 'internal_link_click' && where.cta_location === 'footer' ? 'footer_click' : base.event);
      const params: Params = {
        link_text: text,
        link_url: href.startsWith('#') ? href.slice(1) : href,
        link_type: base.link_type,
        element: el.tagName.toLowerCase() === 'a' ? (el.className.includes('rounded-full') ? 'pulsante' : 'link') : 'pulsante',
        ...where,
        menu_group: isMenu ? el.closest('[data-menu-group]')?.getAttribute('data-menu-group') ?? undefined : undefined,
      };
      track(event, params);
      keyEvents(base.event, params);
    },
    { capture: true },
  );

  // Invio di moduli (richiesta demo)
  document.addEventListener(
    'submit',
    (e) => {
      const form = e.target as HTMLFormElement;
      const where = locate(form);
      track('demo_form_submit', { form_name: form.getAttribute('data-form') || 'richiesta_demo', ...where });
      track('generate_lead', { lead_source: form.getAttribute('data-form') || 'modulo_demo', currency: 'EUR', value: 0, ...where });
    },
    { capture: true },
  );

  // Profondità di scroll per pagina
  let marks = new Set<number>();
  const onScroll = () => {
    const h = document.scrollingElement ?? document.documentElement;
    const pct = ((window.scrollY + window.innerHeight) / h.scrollHeight) * 100;
    for (const m of [25, 50, 75, 90]) if (pct >= m && !marks.has(m)) {
      marks.add(m);
      track('scroll_depth', { percent_scrolled: m });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('influencee:page', () => (marks = new Set()));
}

/* ─── Cambio pagina (pagina virtuale) e sezioni viste ──────────── */
let observer: IntersectionObserver | null = null;
let firstPage = true;
export function pageView(path: string, title: string) {
  const t = pageTypeOf(path);
  ctx = { page_path: path, ...t };
  window.dispatchEvent(new Event('influencee:page'));
  const landing = firstPage;
  firstPage = false;
  track('page_view', {
    page_title: title,
    page_location: window.location.origin + path,
    content_group: t.page_type,
    is_landing: landing,
    ...(landing ? landingParams() : {}),
  });
  // sezioni viste almeno al 40%, una volta per pagina
  observer?.disconnect();
  const seen = new Set<Element>();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting || seen.has(en.target)) return;
        seen.add(en.target);
        const all = Array.from(document.querySelectorAll('main section'));
        const idx = all.indexOf(en.target);
        const name = en.target.querySelector('h1, h2')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 60) ?? 'senza_titolo';
        track('section_view', { section_name: name, section_index: idx + 1, sections_total: all.length });
      });
    },
    { threshold: 0.4 },
  );
  setTimeout(() => document.querySelectorAll('main section').forEach((s) => observer?.observe(s)), 400);
}

/** Sorgente della prima visita: utile anche senza GA4 (GTM, CRM). */
function landingParams(): Params {
  const q = new URLSearchParams(window.location.search);
  return {
    landing_referrer: document.referrer ? new URL(document.referrer).hostname : 'diretto',
    utm_source: q.get('utm_source') ?? undefined,
    utm_medium: q.get('utm_medium') ?? undefined,
    utm_campaign: q.get('utm_campaign') ?? undefined,
  };
}

/* ─── Consenso cookie ───────────────────────────────────────────── */
const KEY = 'influencee_consent';
export function readConsent(): 'granted' | 'denied' | null {
  try {
    return (localStorage.getItem(KEY) as 'granted' | 'denied' | null) ?? null;
  } catch {
    return null;
  }
}
export function setConsent(v: 'granted' | 'denied') {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* archivio non disponibile: vale solo per questa visita */
  }
  gtag('consent', 'update', { analytics_storage: v });
  track('consent_choice', { consent: v === 'granted' ? 'accettato' : 'rifiutato' });
}

/** Apertura di una FAQ: chiamata dal componente FAQ. */
export function faqOpen(question: string, index: number) {
  track('faq_open', { faq_question: question.slice(0, 100), faq_index: index + 1 });
}
