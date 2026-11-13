import { BUDGET, FASCE, UGC, range } from './listino';

/* ════════════════════════════════════════════════════════════════════
   CALCOLATORE DEL PREVENTIVO A PASSI (un solo componente per tutto il sito)
   Senza React e con CSS proprio (classi .ipv-*): lo stesso codice gira
   · nelle pagine nuove (React: PreventivoWidget in tools.tsx),
   · negli articoli e nelle pagine WordPress (Core: assets/inft-preventivo.js + .css).
   Il visitatore sceglie influencer o UGC, fascia, tipo di creator, quantità, città e budget,
   vede la fascia di prezzo indicativa, lascia i contatti e preme «Calcola il preventivo»:
   «Grazie, ti contatteremo al più presto per inviarti il preventivo».
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
  const fasce = FASCE.map((f) => card('fascia', f.l, f.l, `<b data-ipv-price="${f.lo}|${f.hi ?? ''}">${range(f.lo, f.hi, false)}</b> a contenuto`)).join('') + card('fascia', 'Non lo so, consigliatemi voi', 'Non lo so', 'Ti consigliamo noi la fascia giusta');
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
<p class="ipv-hint">Più follower ha il creator, più sale il prezzo: con 10.000 follower si parte da circa 300 €, verso gli 80.000 si va sui 900–1.000 € a contenuto.</p></div>
<div data-ipv-only="ugc" hidden><p class="ipv-q">Video UGC</p><p class="ipv-hint ipv-hint--box">Un video UGC costa di solito <b data-ipv-price="${UGC.lo}|${UGC.hi}">${range(UGC.lo, UGC.hi, false)}</b>. Conta poco la community del creator: conta saper girare video che funzionano sui tuoi canali.</p></div>
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
<div class="ipv-row">${field('nome', 'Nome', 'text', true, 'given-name')}${field('azienda', 'Azienda', 'text', false, 'organization')}</div>
<div class="ipv-row">${field('email', 'Email', 'email', true, 'email')}${field('telefono', 'Telefono', 'tel', true, 'tel')}</div>
<label class="ipv-field" for="${id('ctx')}"><span>Riepilogo della richiesta</span><textarea id="${id('ctx')}" name="risultato_tool" rows="3" readonly></textarea></label>
<label class="ipv-check"><input type="checkbox" name="consenso_marketing" value="Sì"> Voglio ricevere novità e guide di Influencee (facoltativo)</label>
<input class="ipv-hp" type="text" name="sito_web" tabindex="-1" autocomplete="off" aria-hidden="true">
<p class="ipv-small">Usiamo i tuoi dati solo per mandarti il preventivo e la guida. <a href="/privacy-policy/">Informativa privacy</a></p>
<p class="ipv-err" data-ipv-err hidden>Controlla nome, email e telefono.</p></fieldset>

<div class="ipv-nav"><button type="button" class="ipv-back" data-ipv-back hidden>Indietro</button><button type="button" class="ipv-next" data-ipv-next>Avanti →</button><button type="submit" class="ipv-next ipv-submit" data-ipv-submit hidden>Calcola il preventivo →</button></div>
<textarea name="pagina_origine" class="ipv-hp" tabindex="-1" aria-hidden="true" readonly>${esc(o.origin)}</textarea>
</form>
${full ? `<aside class="ipv-side" aria-live="polite"><p class="ipv-side-k">Il tuo preventivo</p>
<dl class="ipv-sum"><div><dt>Cosa</dt><dd data-ipv-sum="tipo">—</dd></div><div><dt>Creator</dt><dd data-ipv-sum="creator">—</dd></div><div><dt>Prezzo indicativo</dt><dd data-ipv-sum="prezzo">—</dd></div><div><dt>Progetto</dt><dd data-ipv-sum="progetto">—</dd></div><div><dt>Zona e budget</dt><dd data-ipv-sum="zona">—</dd></div></dl>
<p class="ipv-side-x">Il prezzo finale dipende dai creator che scegli con noi. Ti mandiamo un progetto completo e trattiamo noi con i creator il prezzo migliore per te.</p></aside>` : `<p class="ipv-inline" aria-live="polite" data-ipv-inline hidden></p>`}
</div>
<div class="ipv-wait" data-ipv-wait hidden role="status"><span class="ipv-spin"></span><p>Sto calcolando il tuo preventivo…</p></div>
<div class="ipv-done" data-ipv-done hidden role="status"><p class="ipv-done-t">Grazie, <span data-ipv-name></span>!</p><p>Ti contatteremo al più presto per inviarti il preventivo.</p><p class="ipv-done-x">Intanto ti abbiamo scritto un’email con una guida su come funzionano le campagne con influencer: puoi partire da solo con la piattaforma o lasciare che la gestiamo noi.</p><p class="ipv-done-a"><a class="ipv-next" href="https://app.influencee.it/iscriviti/brand/">Prova la piattaforma gratis</a></p></div>
</div>`;
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
      prezzo: prezzo(),
      progetto: `${n} creator × ${c} contenuti al mese · ${val('durata')}`,
      zona,
    };
    root.querySelectorAll<HTMLElement>('[data-ipv-sum]').forEach((el) => (el.textContent = s[el.dataset.ipvSum as keyof typeof s]));
    const inline = $<HTMLElement>('[data-ipv-inline]');
    if (inline) {
      inline.hidden = cur < 2 || s.prezzo === '—';
      inline.innerHTML = `Prezzo indicativo: <b>${s.prezzo}</b>. Il progetto completo te lo mandiamo noi.`;
    }
    const sector = val('settore');
    const ctx = root.querySelector<HTMLTextAreaElement>('textarea[name="risultato_tool"]');
    if (ctx) ctx.value = `Pagina di origine: ${val('pagina_origine')} · ${s.tipo} · ${s.creator} · prezzo indicativo ${s.prezzo} · ${s.progetto} · zona: ${val('citta') || 'tutta Italia'}${sector ? ` · settore: ${sector}` : ''} · budget: ${val('budget') || 'non indicato'}`;
    // prezzi delle carte con o senza maggiorazione di nicchia
    root.querySelectorAll<HTMLElement>('[data-ipv-price]').forEach((el) => {
      const [lo, hi] = el.dataset.ipvPrice!.split('|');
      el.textContent = range(Number(lo), hi ? Number(hi) : null, nicchia());
    });
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
    if (!tracked) {
      send('form_submit', { form_name: formName, lead_type: 'brand' });
      send('generate_lead', { lead_source: formName, form_name: formName, lead_type: 'brand', currency: 'EUR', value: 0 });
    }
    const endpoint = root.dataset.endpoint;
    if (endpoint && !data.sito_web) {
      try {
        void fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, modulo: key, pagina: location.pathname }), keepalive: true, credentials: 'omit' }).catch(() => undefined);
      } catch {
        /* nessun invio: il lead arriva comunque a Tandem */
      }
    }
    // effetto «sto calcolando», poi il grazie
    $<HTMLElement>('.ipv-grid')!.hidden = true;
    const wait = $<HTMLElement>('[data-ipv-wait]')!;
    wait.hidden = false;
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
