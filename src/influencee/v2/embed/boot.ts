import { REPLAY, initEmbedAnalytics, observeEmbedSections } from '../analytics';
import { animaSezioniSotto } from './boot-anim';

/* Caricatore leggero delle pagine WordPress (pochi KB, al posto del bundle React al primo caricamento).
   L'HTML pre-renderizzato è già la pagina completa: qui partono subito il tracciamento GA4 (clic, moduli,
   scroll, sezioni viste) e la dissolvenza delle sezioni sotto la prima schermata. Il bundle React
   (influencee-tools.js: calcolatori, filtri, FAQ, moduli lead) arriva dopo, senza rallentare la prima
   schermata: al primo segno di interazione (tocco, scroll, mouse, tastiera) oppure, se non succede niente,
   poco dopo il caricamento della pagina. Un clic su un pulsante fatto prima che il bundle sia pronto viene
   ripetuto appena la pagina è interattiva; i valori già scritti nei campi restano. */

type Booter = {
  /** chiamato dal bundle subito prima di sostituire l'HTML statico */
  before: (root: HTMLElement) => void;
  /** chiamato dal bundle appena React ha sostituito l'HTML (prima che il browser disegni) */
  done: (root: HTMLElement) => void;
};
declare global {
  interface Window {
    __inftBoot?: Booter;
  }
}

const IDLE_AFTER_LOAD = 3500; // ms dopo l'evento load, se il visitatore non ha ancora interagito
const INTENT = ['pointerdown', 'touchstart', 'keydown', 'focusin', 'wheel', 'scroll', 'mousemove'] as const;
/** elementi che senza React non farebbero niente (o invierebbero il modulo alla pagina stessa) */
const NEEDS_REACT = 'button, [role="tab"], [role="button"], summary, label, select, input[type="checkbox"], input[type="radio"], input[type="range"]';

/** Chiave stabile di un elemento tra HTML statico e HTML di React (che può avere qualche contenitore in più o in meno). */
function keyOf(el: Element) {
  const a = (n: string) => el.getAttribute(n) || '';
  const txt = el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement ? '' : (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  return [el.tagName, a('name'), a('id'), a('type'), a('placeholder'), a('aria-label'), a('role'), txt].join('|');
}
function locate(root: HTMLElement, el: Element) {
  const k = keyOf(el);
  const same = Array.from(root.querySelectorAll(el.tagName)).filter((x) => keyOf(x) === k);
  return { tag: el.tagName, k, n: same.indexOf(el) };
}
function find(root: HTMLElement, ref: { tag: string; k: string; n: number }) {
  return Array.from(root.querySelectorAll(ref.tag)).filter((x) => keyOf(x) === ref.k)[ref.n] as HTMLElement | undefined;
}


function start() {
  const root = document.getElementById('influencee-tools');
  const bundle = window.INFLUENCEE_TOOLS?.bundle;
  if (!root || !bundle) return;
  const path = root.getAttribute('data-route') || window.location.pathname;
  initEmbedAnalytics(root, path);
  animaSezioniSotto(root);

  let ready = false;
  const queue: { ref: ReturnType<typeof locate>; kind: 'click' | 'submit' }[] = [];
  let fields: { ref: ReturnType<typeof locate>; value: string; checked: boolean }[] = [];
  let anchor: { i: number; top: number } | null = null;

  // pulsanti premuti e moduli inviati prima che React sia pronto: fermati ora, ripetuti dopo
  root.addEventListener('click', (e) => {
    if (ready || REPLAY.on) return;
    const el = (e.target as Element | null)?.closest(NEEDS_REACT);
    if (!el || !root.contains(el) || el.closest('a[href]')) return;
    const tag = el.tagName;
    if (tag === 'SELECT' || (tag === 'INPUT' && (el as HTMLInputElement).type !== 'range')) return; // funzionano da soli, il valore passa dopo
    if (tag === 'LABEL' && (el as HTMLLabelElement).control) return;
    e.preventDefault();
    queue.push({ ref: locate(root, el), kind: 'click' });
    load();
  }, true);
  root.addEventListener('submit', (e) => {
    if (ready || REPLAY.on) return;
    e.preventDefault();
    queue.push({ ref: locate(root, e.target as Element), kind: 'submit' });
    load();
  }, true);

  window.__inftBoot = {
    before(r) {
      // campi già compilati e posizione nella pagina (prima sezione visibile), da ritrovare dopo
      fields = Array.from(r.querySelectorAll<HTMLInputElement>('input, select, textarea'))
        .filter((f) => (f instanceof HTMLSelectElement ? Array.from(f.options).some((o) => o.selected !== o.defaultSelected) : f.type === 'checkbox' || f.type === 'radio' ? f.checked !== f.defaultChecked : f.value !== f.defaultValue))
        .map((f) => ({ ref: locate(r, f), value: f.value, checked: !!f.checked }));
      const secs = Array.from(r.querySelectorAll('section'));
      const i = secs.findIndex((s) => s.getBoundingClientRect().bottom > 0);
      anchor = window.scrollY > 0 && i >= 0 ? { i, top: secs[i].getBoundingClientRect().top + window.scrollY } : null;
    },
    done(r) {
      if (anchor) {
        const s = r.querySelectorAll('section')[anchor.i];
        if (s) {
          const d = s.getBoundingClientRect().top + window.scrollY - anchor.top;
          if (Math.abs(d) > 1) window.scrollTo(window.scrollX, window.scrollY + d);
        }
      }
      ready = true;
      observeEmbedSections(r);
      // dopo il commit di React: valori dei campi e clic in coda
      setTimeout(() => {
        REPLAY.on = true;
        try {
          for (const f of fields) {
            const el = find(r, f.ref) as HTMLInputElement | undefined;
            if (!el) continue;
            if (el.type === 'checkbox' || el.type === 'radio') {
              if (el.checked !== f.checked) el.click();
              continue;
            }
            const proto = el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, f.value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
          for (const q of queue.splice(0)) {
            const el = find(r, q.ref);
            if (!el) continue;
            if (q.kind === 'click') el.click();
            else (el as HTMLFormElement).requestSubmit?.();
          }
        } finally {
          REPLAY.on = false;
        }
      }, 0);
    },
  };

  let loading = false;
  function load() {
    if (loading) return;
    loading = true;
    INTENT.forEach((t) => window.removeEventListener(t, load, true));
    const s = document.createElement('script');
    s.src = bundle!;
    s.async = true;
    document.head.appendChild(s);
  }
  INTENT.forEach((t) => window.addEventListener(t, load, { capture: true, passive: true }));
  const later = () => setTimeout(() => ('requestIdleCallback' in window ? window.requestIdleCallback(load, { timeout: 2000 }) : load()), IDLE_AFTER_LOAD);
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
