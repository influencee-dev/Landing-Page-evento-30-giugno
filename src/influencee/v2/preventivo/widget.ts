import { BUDGET, FASCE, NICCHIA, TIPI_AZIENDA, UGC, euro, range } from './listino';

/* ════════════════════════════════════════════════════════════════════
   CALCOLATORE DEL PREVENTIVO A PASSI (un solo componente per tutto il sito)
   Senza React e con CSS proprio (classi .ipv-*): lo stesso codice gira
   · nelle pagine nuove (React: PreventivoWidget in tools.tsx),
   · negli articoli e nelle pagine WordPress (Core: assets/inft-preventivo.js + .css).
   Il visitatore sceglie influencer o UGC, fascia, tipo di creator, quantità, città e budget,
   lascia nome, cognome, email e tipo di azienda e preme «Calcola il preventivo»: solo ADESSO vede il preventivo
   indicativo e il listino (mai prima, richiesta di Giorgia) e «ti contatteremo al più presto per inviarti il preventivo».
   Invio: <form data-tandem> (lo raccoglie tandem-forms → Tandem) e in più una richiesta a
   /wp-json/influencee/v1/preventivo (Core) che manda la guida via email e avvisa il team.
   ════════════════════════════════════════════════════════════════════ */

export interface PreventivoOpts {
  /** chiave breve della pagina: modulo «preventivo_<page>» in Tandem e GA4 */
  page: string;
  /** pagina di origine leggibile, inviata con la richiesta */
  origin: string;
  variant?: 'full' | 'compact';
  city?: string;
  sector?: string;
  title?: string;
  /** indirizzo dell'invio della guida (Core); vuoto = nessun invio */
  endpoint?: string;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const STEPS = 5;
const ENDPOINT = '/wp-json/influencee/v1/preventivo';

function card(name: string, value: string, title: string, text: string, extra = '') {
  return `<label class="ipv-card"><input type="radio" name="${name}" value="${esc(value)}"${extra}><span class="ipv-card-b"><span class="ipv-card-t">${title}</span><span class="ipv-card-x">${text}</span></span></label>`;
}

export function preventivoHTML(o: PreventivoOpts): string {
  const key = `preventivo_${o.page.replace(/[^a-z0-9_]/gi, '_')}`;
  const id = (s: string) => `ipv-${key}-${s}`;
  const full = o.variant !== 'compact';
  const field = (n: string, label: string, type = 'text', req = false, ac = '', val = '') =>
    `<label class="ipv-field" for="${id(n)}"><span>${label}</span><input id="${id(n)}" name="${n}" type="${type}"${req ? ' required' : ''}${ac ? ` autocomplete="${ac}"` : ''}${val ? ` value="${esc(val)}"` : ''}></label>`;
  const FX = ['Nano creator: community piccole e molto vicine', 'Micro creator: il miglior rapporto tra pubblico e costo', 'Creator medi: più visibilità, prezzo più alto', 'Macro creator: grande visibilità, preventivo su misura'];
  const fasce = FASCE.map((f, i) => card('fascia', f.l, f.l, FX[i] ?? '')).join('') + card('fascia', 'Non lo so, consigliatemi voi', 'Non lo so', 'Ti consigliamo noi la fascia giusta');
  return `<div class="ipv ipv--${full ? 'full' : 'compact'}" data-inft-preventivo="${key}" data-endpoint="${esc(o.endpoint ?? ENDPOINT)}">
<div class="ipv-grid">
<form class="ipv-form" id="lead-form-${key}" name="Lead tool: ${key}" aria-label="Calcola il preventivo della campagna" data-tandem="" data-form="lead_${key}" data-lead-type="brand">
<div class="ipv-top"><p class="ipv-kicker">${esc(o.title ?? 'Calcola il preventivo')}</p><p class="ipv-count"><span data-ipv-n>1</span> di ${STEPS}</p></div>
<div class="ipv-bar" aria-hidden="true"><span data-ipv-bar style="width:${100 / STEPS}%"></span></div>

<fieldset class="ipv-step" data-step="1"><legend>Cosa ti serve per la campagna?</legend>
<div class="ipv-cards">
${card('tipo', 'Influencer', 'Influencer', 'Pubblicano sul <b>loro profilo</b>: il tuo prodotto arriva alla loro community. Paghi la visibilità, oltre al contenuto.')}
${card('tipo', 'UGC creator', 'UGC creator', 'Girano video <b>per i tuoi canali</b> e le tue inserzioni, senza usare la loro community: tanti micro creator, anche non famosi, per riempire i tuoi social.')}
${card('tipo', 'Influencer e UGC', 'Tutti e due', 'Visibilità dagli influencer e video UGC per i tuoi canali.')}
${card('tipo', 'Non lo so', 'Non lo so ancora', 'Ti aiutiamo noi a scegliere in base all’obiettivo.')}
</div><p class="ipv-err" data-ipv-err hidden>Scegli una risposta per andare avanti.</p></fieldset>

<fieldset class="ipv-step" data-step="2" hidden><legend>Con che creator vuoi lavorare?</legend>
<div data-ipv-only="influencer"><p class="ipv-q">Quanti follower devono avere gli influencer?</p><div class="ipv-cards ipv-cards--2">${fasce}</div>
<p class="ipv-hint">Più follower ha il creator, più sale il prezzo: il tuo preventivo indicativo lo vedi alla fine.</p></div>
<div data-ipv-only="ugc" hidden><p class="ipv-q">Video UGC</p><p class="ipv-hint ipv-hint--box">Nei video UGC conta poco la community del creator: conta saper girare video che funzionano sui tuoi canali. Per questo costano meno di un influencer.</p></div>
<p class="ipv-q">Che tipo di creator?</p>
<div class="ipv-cards ipv-cards--2">
${card('nicchia', 'Generici', 'Generici', 'Lifestyle, food, moda, famiglia, viaggi…', ' checked')}
${card('nicchia', 'Di nicchia o professionisti', 'Di nicchia o professionisti', 'Nutrizionisti, medici, avvocati, notai, esperti di settore: il prezzo sale.')}
</div>
<p class="ipv-hint ipv-hint--ok">Tranquillo: per ogni budget costruiamo un progetto e la trattativa con i creator la facciamo noi, per ottenere il prezzo migliore per te.</p>
<p class="ipv-err" data-ipv-err hidden>Scegli la fascia di follower.</p></fieldset>

<fieldset class="ipv-step" data-step="3" hidden><legend>Quanto grande è il progetto?</legend>
<div class="ipv-row">
<div class="ipv-field"><span id="${id('nl')}">Quanti creator?</span><div class="ipv-num" role="group" aria-labelledby="${id('nl')}"><button type="button" data-ipv-step="creator:-1" aria-label="Meno creator">−</button><input name="creator" inputmode="numeric" value="3" aria-labelledby="${id('nl')}"><button type="button" data-ipv-step="creator:1" aria-label="Più creator">+</button></div></div>
<div class="ipv-field"><span id="${id('cl')}">Contenuti al mese per creator</span><div class="ipv-num" role="group" aria-labelledby="${id('cl')}"><button type="button" data-ipv-step="contenuti:-1" aria-label="Meno contenuti">−</button><input name="contenuti" inputmode="numeric" value="2" aria-labelledby="${id('cl')}"><button type="button" data-ipv-step="contenuti:1" aria-label="Più contenuti">+</button></div></div>
</div>
<p class="ipv-q">Per quanto tempo?</p>
<div class="ipv-pills">${['Un solo mese', '3 mesi', '6 mesi', '12 mesi'].map((d, i) => `<label class="ipv-pill"><input type="radio" name="durata" value="${d}"${i === 1 ? ' checked' : ''}><span>${d}</span></label>`).join('')}</div>
<p class="ipv-hint">Le campagne di più mesi costano meno al mese: i creator lavorano meglio e il prezzo si contratta una volta sola.</p></fieldset>

<fieldset class="ipv-step" data-step="4" hidden><legend>Dove e con quale budget?</legend>
${field('citta', 'In che città o zona vuoi i creator?', 'text', false, 'address-level2', o.city ?? '')}
${o.sector ? `<input type="hidden" name="settore" value="${esc(o.sector)}">` : ''}
<label class="ipv-field" for="${id('budget')}"><span>Quanto sei disposto a investire in tutto?</span><select id="${id('budget')}" name="budget"><option value="">Scegli</option>${BUDGET.map((b) => `<option>${b}</option>`).join('')}</select></label>
<p class="ipv-hint ipv-hint--ok">Il budget ci serve per proporti i creator giusti: con qualsiasi cifra ti diciamo cosa si può fare, senza impegno.</p></fieldset>

<fieldset class="ipv-step" data-step="5" hidden><legend>A chi mandiamo il preventivo?</legend>
<div class="ipv-row">${field('nome', 'Nome', 'text', true, 'given-name')}${field('cognome', 'Cognome', 'text', true, 'family-name')}</div>
<div class="ipv-row">${field('email', 'Email', 'email', true, 'email')}<label class="ipv-field" for="${id('tipo')}"><span>Tipo di azienda</span><select id="${id('tipo')}" name="tipo_azienda" required><option value="">Scegli</option>${TIPI_AZIENDA.map((t) => `<option>${t}</option>`).join('')}</select></label></div>
<label class="ipv-field" for="${id('ctx')}"><span>Riepilogo della richiesta</span><textarea id="${id('ctx')}" name="risultato_tool" rows="3" readonly></textarea></label>
<label class="ipv-check"><input type="checkbox" name="consenso_marketing" value="Sì"> Voglio ricevere novità e guide di Influencee (facoltativo)</label>
<input class="ipv-hp" type="text" name="sito_web" tabindex="-1" autocomplete="off" aria-hidden="true">
<p class="ipv-small">Premendo «Calcola il preventivo» vedi subito il preventivo indicativo e il listino. Usiamo i tuoi dati solo per mandarti il preventivo e la guida. <a href="/privacy-policy/">Informativa privacy</a></p>
<p class="ipv-err" data-ipv-err hidden>Controlla nome, cognome, email e tipo di azienda.</p></fieldset>

<div class="ipv-nav"><button type="button" class="ipv-back" data-ipv-back hidden>Indietro</button><button type="button" class="ipv-next" data-ipv-next>Avanti →</button><button type="submit" class="ipv-next ipv-submit" data-ipv-submit hidden>Calcola il preventivo →</button></div>
<textarea name="pagina_origine" class="ipv-hp" tabindex="-1" aria-hidden="true" readonly>${esc(o.origin)}</textarea>
</form>
${full ? `<aside class="ipv-side" aria-live="polite"><p class="ipv-side-k">Il tuo preventivo</p>
<dl class="ipv-sum"><div><dt>Cosa</dt><dd data-ipv-sum="tipo">—</dd></div><div><dt>Creator</dt><dd data-ipv-sum="creator">—</dd></div><div><dt>Prezzo</dt><dd data-ipv-sum="prezzo">lo vedi alla fine</dd></div><div><dt>Progetto</dt><dd data-ipv-sum="progetto">—</dd></div><div><dt>Zona e budget</dt><dd data-ipv-sum="zona">—</dd></div></dl>
<p class="ipv-side-x">Il preventivo indicativo e il listino li vedi appena compili il modulo. Il prezzo finale dipende dai creator che scegli con noi. Ti mandiamo un progetto completo e trattiamo noi con i creator il prezzo migliore per te.</p></aside>` : ''}
</div>
<div class="ipv-wait" data-ipv-wait hidden role="status"><span class="ipv-spin"></span><p>Sto calcolando il tuo preventivo…</p></div>
<div class="ipv-done" data-ipv-done hidden role="status"><p class="ipv-done-t">Grazie, <span data-ipv-name></span>!</p><p>Ti contatteremo al più presto per inviarti il preventivo definitivo. Intanto ecco la stima.</p>
<div class="ipv-res"><p class="ipv-res-k">Il tuo preventivo indicativo</p><p class="ipv-res-v" data-ipv-res-tot></p><p class="ipv-res-x" data-ipv-res-x></p></div>
<div class="ipv-list" data-ipv-list></div>
<p class="ipv-done-x">Ti abbiamo scritto anche un’email con una guida su come funzionano le campagne con influencer: puoi partire da solo con la piattaforma o lasciare che la gestiamo noi.</p><p class="ipv-done-a"><a class="ipv-next" href="https://app.influencee.it/iscriviti/brand/">Prova la piattaforma gratis</a></p></div>
</div>`;
}

/** Listino indicativo: si mostra solo dopo l'invio del modulo (richiesta di Giorgia). */
function listinoHTML() {
  return `<p class="ipv-res-k">Il listino indicativo</p><table><tbody>${FASCE.map((f) => `<tr><td>${f.l}</td><td>${range(f.lo, f.hi, false)}</td></tr>`).join('')}<tr><td>Video UGC</td><td>${range(UGC.lo, UGC.hi, false)}</td></tr></tbody></table>
<p class="ipv-res-x">A contenuto, compenso del creator. Creator di nicchia e professionisti: dal ${Math.round((NICCHIA.lo - 1) * 100)}% al ${Math.round((NICCHIA.hi - 1) * 100)}% in più. La trattativa con i creator la facciamo noi, per ottenere il prezzo migliore per te.</p>`;
}

/* ─── comportamento ─────────────────────────────────────────────── */
type W = Window & { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
function send(event: string, params: Record<string, unknown>) {
  const w = window as W;
  if (typeof w.gtag === 'function') w.gtag('event', event, params);
  else (w.dataLayer = w.dataLayer || []).push({ event, ...params });
}

export function bindPreventivo(root: HTMLElement) {
  if (root.dataset.ipvBound) return;
  root.dataset.ipvBound = '1';
  const key = root.dataset.inftPreventivo || 'preventivo';
  const formName = `lead_${key}`;
  const form = root.querySelector<HTMLFormElement>('form')!;
  const steps = Array.from(root.querySelectorAll<HTMLFieldSetElement>('.ipv-step'));
  const $ = <T extends Element>(s: string) => root.querySelector<T>(s);
  const val = (n: string) => {
    const els = form.elements.namedItem(n);
    if (!els) return '';
    if (els instanceof RadioNodeList) return els.value;
    return (els as HTMLInputElement).value.trim();
  };
  // nelle pagine nuove gli invii li conta già il tracciamento del sito (ascoltatore su #influencee-tools)
  const tracked = !!root.closest('#influencee-tools');
  let cur = 1;
  let started = false;

  const tipo = () => val('tipo');
  const wantsInf = () => /Influencer/.test(tipo()) || tipo() === 'Non lo so';
  const wantsUgc = () => /UGC/.test(tipo());
  const nicchia = () => /nicchia/i.test(val('nicchia'));

  function prezzo() {
    const parts: string[] = [];
    const f = FASCE.find((x) => x.l === val('fascia'));
    if (wantsInf()) parts.push(f ? `${range(f.lo, f.hi, nicchia())} a contenuto` : val('fascia') ? 'te lo consigliamo noi' : '—');
    if (wantsUgc()) parts.push(`UGC ${range(UGC.lo, UGC.hi, nicchia())} a video`);
    return parts.join(' · ') || '—';
  }
  function summary() {
    const n = val('creator') || '0';
    const c = val('contenuti') || '0';
    const zona = [val('citta') || 'tutta Italia', val('budget')].filter(Boolean).join(' · ');
    const s = {
      tipo: tipo() || '—',
      creator: [wantsInf() ? val('fascia') : '', val('nicchia')].filter(Boolean).join(' · ') || '—',
      prezzo: 'lo vedi alla fine',
      progetto: `${n} creator × ${c} contenuti al mese · ${val('durata')}`,
      zona,
    };
    root.querySelectorAll<HTMLElement>('[data-ipv-sum]').forEach((el) => (el.textContent = s[el.dataset.ipvSum as keyof typeof s]));
    const sector = val('settore');
    const ctx = root.querySelector<HTMLTextAreaElement>('textarea[name="risultato_tool"]');
    if (ctx) ctx.value = `Pagina di origine: ${val('pagina_origine')} · ${s.tipo} · ${s.creator} · ${s.progetto} · zona: ${val('citta') || 'tutta Italia'}${sector ? ` · settore: ${sector}` : ''} · budget: ${val('budget') || 'non indicato'}`;
  }

  /** Stima mostrata solo dopo l'invio: compenso dei creator al mese (fascia × creator × contenuti, più UGC). */
  function stima() {
    const n = Math.max(1, Number(val('creator')) || 1);
    const c = Math.max(1, Number(val('contenuti')) || 1);
    const f = FASCE.find((x) => x.l === val('fascia'));
    const k = nicchia() ? NICCHIA : { lo: 1, hi: 1 };
    let lo = 0;
    let hi = 0;
    let suMisura = false;
    if (wantsInf()) {
      const b = f ?? FASCE[1]; // «non lo so»: stima sulla fascia micro
      lo += b.lo * k.lo * n * c;
      if (b.hi === null) suMisura = true;
      else hi += b.hi * k.hi * n * c;
    }
    if (wantsUgc()) {
      lo += UGC.lo * k.lo * n * c;
      hi += UGC.hi * k.hi * n * c;
    }
    const r = (x: number) => Math.round(x / 50) * 50;
    const tot = suMisura ? `da ${euro(r(lo))} al mese, su misura` : `${euro(r(lo))} – ${euro(r(hi))} al mese`;
    return { tot, dettaglio: `${prezzo()} · ${n} creator × ${c} contenuti al mese · ${val('durata')}. Compenso dei creator; gestione del team e diritti d’uso nel preventivo definitivo.` };
  }

  function show(n: number) {
    cur = n;
    steps.forEach((s) => (s.hidden = Number(s.dataset.step) !== n));
    $<HTMLElement>('[data-ipv-n]')!.textContent = String(n);
    $<HTMLElement>('[data-ipv-bar]')!.style.width = `${(n / STEPS) * 100}%`;
    $<HTMLButtonElement>('[data-ipv-back]')!.hidden = n === 1;
    $<HTMLButtonElement>('[data-ipv-next]')!.hidden = n === STEPS;
    $<HTMLButtonElement>('[data-ipv-submit]')!.hidden = n !== STEPS;
    const inf = root.querySelector<HTMLElement>('[data-ipv-only="influencer"]');
    const ugc = root.querySelector<HTMLElement>('[data-ipv-only="ugc"]');
    if (inf) inf.hidden = !wantsInf();
    if (ugc) ugc.hidden = !wantsUgc();
    root.querySelectorAll<HTMLElement>('[data-ipv-err]').forEach((e) => (e.hidden = true));
    summary();
  }

  function ok(n: number) {
    const err = steps[n - 1].querySelector<HTMLElement>('[data-ipv-err]');
    let good = true;
    if (n === 1) good = !!tipo();
    if (n === 2) good = !wantsInf() || !!val('fascia');
    if (n === STEPS) good = Array.from(steps[n - 1].querySelectorAll<HTMLInputElement>('input[required]')).every((i) => i.checkValidity());
    if (err) err.hidden = good;
    return good;
  }

  function next() {
    if (!ok(cur)) return;
    send('preventivo_step', { step: cur, form_name: formName, lead_type: 'brand', scelta: cur === 1 ? tipo() : cur === 2 ? val('fascia') || val('nicchia') : cur === 4 ? val('budget') : '' });
    show(Math.min(STEPS, cur + 1));
    const top = root.getBoundingClientRect().top;
    if (top < 0) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  root.addEventListener('click', (e) => {
    const t = e.target as Element;
    const b = t.closest<HTMLElement>('[data-ipv-step]');
    if (b) {
      const [n, d] = b.dataset.ipvStep!.split(':');
      const input = form.elements.namedItem(n) as HTMLInputElement;
      input.value = String(Math.max(1, Math.min(50, (Number(input.value) || 0) + Number(d))));
      summary();
      return;
    }
    if (t.closest('[data-ipv-next]')) next();
    if (t.closest('[data-ipv-back]')) show(Math.max(1, cur - 1));
  });
  root.addEventListener('change', (e) => {
    if (!started) {
      started = true;
      (window as W & { __ipvStarted?: boolean }).__ipvStarted = true; // chi ha già iniziato un calcolatore non vede il popup
      send('preventivo_start', { form_name: formName, lead_type: 'brand' });
    }
    const t = e.target as HTMLInputElement;
    summary();
    if (t.name === 'tipo') show(1);
    // la scelta del primo passo porta da sola al secondo
    if (t.name === 'tipo' && cur === 1) setTimeout(next, 180);
  });
  root.addEventListener('input', summary);
  // Invio a metà percorso (tasto Invio in un campo): avanti di un passo, senza inviare
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && cur < STEPS && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      next();
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cur < STEPS) return next();
    if (!ok(STEPS)) return;
    summary();
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const st = stima();
    $<HTMLElement>('[data-ipv-res-tot]')!.textContent = st.tot;
    $<HTMLElement>('[data-ipv-res-x]')!.textContent = st.dettaglio;
    // il listino si crea solo adesso: prima dell'invio non è nemmeno nell'HTML della pagina
    $<HTMLElement>('[data-ipv-list]')!.innerHTML = listinoHTML();
    if (!tracked) {
      send('form_submit', { form_name: formName, lead_type: 'brand' });
      send('generate_lead', { lead_source: formName, form_name: formName, lead_type: 'brand', currency: 'EUR', value: 0 });
    }
    const endpoint = root.dataset.endpoint;
    if (endpoint && !data.sito_web) {
      try {
        void fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, preventivo_indicativo: `${st.tot} (${st.dettaglio})`, modulo: key, pagina: location.pathname }), keepalive: true, credentials: 'omit' }).catch(() => undefined);
      } catch {
        /* nessun invio: il lead arriva comunque a Tandem */
      }
    }
    // effetto «sto calcolando», poi il grazie
    $<HTMLElement>('.ipv-grid')!.hidden = true;
    const wait = $<HTMLElement>('[data-ipv-wait]')!;
    wait.hidden = false;
    try {
      localStorage.setItem(POP_SENT, String(Date.now())); // niente popup a chi ha già chiesto il preventivo
    } catch {
      /* archivio non disponibile */
    }
    $<HTMLElement>('[data-ipv-name]')!.textContent = data.nome || '';
    setTimeout(() => {
      wait.hidden = true;
      $<HTMLElement>('[data-ipv-done]')!.hidden = false;
    }, 1400);
  });
  show(1);
}

/** Collega tutti i calcolatori presenti (o dentro root). */
export function initPreventivi(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-inft-preventivo]').forEach(bindPreventivo);
}

/* ─── Popup dopo un minuto (richiesta di Giorgia, 13/11/2026) ─────────
   Sulle pagine per aziende e negli articoli: dopo 60 secondi sulla pagina si apre il calcolatore compatto.
   Non si apre a chi ha già iniziato un calcolatore nella pagina, a chi ha già chiesto il preventivo (mai più),
   né più di una volta ogni 7 giorni. Si chiude con la X, con Esc o cliccando fuori. */
const POP_SEEN = 'inft_pv_popup';
const POP_SENT = 'inft_pv_sent';
const WEEK = 7 * 24 * 3600 * 1000;

function popupAllowed() {
  try {
    if (localStorage.getItem(POP_SENT)) return false;
    const seen = Number(localStorage.getItem(POP_SEEN) || 0);
    if (seen && Date.now() - seen < WEEK) return false;
  } catch {
    /* senza archivio: il popup può comparire, una volta per pagina */
  }
  return !(window as W & { __ipvStarted?: boolean }).__ipvStarted && !document.querySelector('.ipv-pop');
}

export function openPreventivoPopup(container: HTMLElement, o: PreventivoOpts) {
  try {
    localStorage.setItem(POP_SEEN, String(Date.now()));
  } catch {
    /* niente */
  }
  const key = `preventivo_${o.page.replace(/[^a-z0-9_]/gi, '_')}`;
  const pop = document.createElement('div');
  pop.className = 'ipv-pop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-modal', 'true');
  pop.setAttribute('aria-labelledby', `ipv-pop-t-${key}`);
  const check = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  pop.innerHTML = `<div class="ipv-pop-box"><button type="button" class="ipv-pop-x" aria-label="Chiudi" data-track="preventivo_popup_close">×</button>
<div class="ipv-pop-side"><span class="ipv-pop-glow" aria-hidden="true"></span>
<p class="ipv-pop-pill"><span class="ipv-pop-dot"></span>Preventivo gratuito · 1 minuto</p>
<p class="ipv-pop-t" id="ipv-pop-t-${key}">Quanto costerebbe la tua <span>campagna</span> con i creator?</p>
<p class="ipv-pop-x2">Influencer o UGC, che creator, dove e con quale budget: rispondi a poche domande e vedi subito la stima.</p>
<div class="ipv-pop-tease" aria-hidden="true"><p class="ipv-pop-tease-k">Il tuo preventivo indicativo</p><p class="ipv-pop-tease-v">2.400 € – 4.800 €<small>/mese</small></p><p class="ipv-pop-lock"><svg viewBox="0 0 24 24" width="13" height="13"><path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg> Si sblocca alla fine</p></div>
<ul class="ipv-pop-list"><li>${check}Creator italiani verificati</li><li>${check}La trattativa la facciamo noi</li><li>${check}Nessun impegno</li></ul></div>
<div class="ipv-pop-main">${preventivoHTML({ ...o, variant: 'compact', title: 'Il tuo preventivo' })}</div></div>`;
  container.appendChild(pop);
  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  const close = () => {
    pop.remove();
    document.documentElement.style.overflow = prevOverflow;
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      send('preventivo_popup_close', { form_name: `lead_${key}`, modo: 'esc' });
      close();
    }
  };
  document.addEventListener('keydown', onKey);
  pop.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t === pop || t.closest('.ipv-pop-x')) {
      if (t === pop) send('preventivo_popup_close', { form_name: `lead_${key}`, modo: 'fuori' });
      close();
    }
  });
  bindPreventivo(pop.querySelector<HTMLElement>('[data-inft-preventivo]')!);
  pop.querySelector<HTMLButtonElement>('.ipv-pop-x')!.focus();
  send('preventivo_popup_open', { form_name: `lead_${key}`, lead_type: 'brand' });
  return close;
}

/** Programma il popup dopo `delay` ms (60 s). Restituisce la funzione che lo annulla. */
export function schedulePreventivoPopup(container: HTMLElement, o: PreventivoOpts, delay = 60000) {
  if (!popupAllowed()) return () => undefined;
  let close: (() => void) | null = null;
  const t = window.setTimeout(() => {
    if (popupAllowed()) close = openPreventivoPopup(container, o);
  }, delay);
  return () => {
    window.clearTimeout(t);
    close?.();
  };
}
