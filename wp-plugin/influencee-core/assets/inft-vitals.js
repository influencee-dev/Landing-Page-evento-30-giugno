/* Influencee Core · tempi reali degli utenti (Core Web Vitals) come evento GA4 «web_vitals».
   Un evento per metrica per pagina: LCP, INP, CLS, FCP, TTFB, con metric_name, metric_value (ms arrotondati;
   CLS con 3 decimali), metric_rating (good / needs-improvement / poor, soglie di Google), page_type, page_path.
   Senza librerie: PerformanceObserver nativo (INP con Event Timing e interactionId, come la libreria web-vitals).
   Si registra a pagina caricata (buffered: le misure precedenti non si perdono) e invia tutto una volta sola
   quando la pagina viene nascosta o chiusa (visibilitychange / pagehide): nessun lavoro durante il caricamento.
   Passa da gtag come gli altri eventi, quindi rispetta il Consent Mode impostato in includes/ga4.php.
   Debug: ?debug_analytics stampa gli eventi in console. */
(function () {
  var PO = window.PerformanceObserver, perf = window.performance;
  if (!PO || !perf || !perf.getEntriesByType) return;
  var debug = /[?&]debug_analytics/.test(location.search);
  var LIMITI = { LCP: [2500, 4000], INP: [200, 500], CLS: [0.1, 0.25], FCP: [1800, 3000], TTFB: [800, 1800] };
  var val = {}, sent = false;
  var nav = perf.getEntriesByType('navigation')[0];
  var act = (nav && nav.activationStart) || 0; // pagine prerenderizzate: si conta da quando diventano visibili
  // una pagina aperta in background non ha LCP/FCP confrontabili: si misurano solo se era visibile all'inizio
  var hiddenAt = document.visibilityState === 'hidden' ? 0 : Infinity;
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && hiddenAt === Infinity) hiddenAt = perf.now(); }, true);

  function obs(type, cb, opt) {
    try {
      if (PO.supportedEntryTypes && PO.supportedEntryTypes.indexOf(type) < 0) return;
      var o = new PO(function (l) { l.getEntries().forEach(cb); });
      var p = { type: type, buffered: true }, k;
      for (k in opt || {}) p[k] = opt[k];
      o.observe(p);
      return o;
    } catch (e) {}
  }

  function pageType() {
    var r = [].filter.call(document.querySelectorAll('[data-inft-track][data-page-type]'), function (el) { return !/^(header|footer)$/.test(el.getAttribute('data-section') || ''); })[0]
      || document.querySelector('[data-inft-track][data-page-type]');
    if (r) return r.getAttribute('data-page-type');
    var b = document.body ? document.body.className : '';
    if (/\bhome\b/.test(b)) return 'home';
    if (/\bsingle-creator\b/.test(b)) return 'creator';
    if (/\bsingle-post\b/.test(b)) return 'articolo';
    if (/\b(archive|category|tag|blog)\b/.test(b)) return 'elenco';
    if (/\bpage\b/.test(b)) return 'pagina';
    return 'altro';
  }

  function inviaTutto() {
    if (sent) return;
    sent = true;
    if (lcpObs) lcpObs.takeRecords && lcpObs.takeRecords().forEach(onLcp);
    if (clsObs) clsObs.takeRecords && clsObs.takeRecords().forEach(onShift);
    if (evObs) evObs.takeRecords && evObs.takeRecords().forEach(onEvent);
    stopLcp();
    val.CLS = cls;
    var inp = inpValue();
    if (inp !== null) val.INP = inp;
    var pt = pageType();
    ['TTFB', 'FCP', 'LCP', 'CLS', 'INP'].forEach(function (m) {
      var v = val[m];
      if (typeof v !== 'number' || !isFinite(v) || v < 0) return;
      var t = LIMITI[m];
      var p = {
        metric_name: m,
        metric_value: m === 'CLS' ? Math.round(v * 1000) / 1000 : Math.round(v),
        metric_rating: v <= t[0] ? 'good' : v <= t[1] ? 'needs-improvement' : 'poor',
        page_type: pt,
        page_path: location.pathname
      };
      if (typeof window.inftTrack === 'function') { window.inftTrack('web_vitals', p); return; } // aggiunge audience; stampa in debug
      if (debug) console.info('[GA4]', 'web_vitals', p);
      if (typeof window.gtag === 'function') window.gtag('event', 'web_vitals', p);
    });
  }

  /* LCP: l'ultimo candidato prima della prima interazione o di quando la pagina viene nascosta */
  var lcpObs, lcpStop = false;
  function onLcp(e) {
    if (lcpStop || e.startTime >= hiddenAt) return;
    val.LCP = Math.max(e.startTime - act, 0);
  }
  function stopLcp() { lcpStop = true; }

  /* CLS: la finestra di spostamenti peggiore (spostamenti a meno di 1 s l'uno dall'altro, finestra di massimo 5 s) */
  var clsObs, cls = 0, win = 0, winFirst = 0, winLast = 0;
  function onShift(e) {
    if (e.hadRecentInput) return;
    if (win && e.startTime - winLast < 1000 && e.startTime - winFirst < 5000) { win += e.value; }
    else { win = e.value; winFirst = e.startTime; }
    winLast = e.startTime;
    if (win > cls) cls = win;
  }

  /* INP: per ogni interazione (interactionId) la durata più lunga; il valore è circa il 98° percentile
     (con meno di 50 interazioni la peggiore, poi si scarta una delle peggiori ogni 50) */
  var evObs, inter = {}, nInter = 0;
  function onEvent(e) {
    var id = e.interactionId;
    if (!id) return;
    if (!(id in inter)) nInter++;
    if (!(id in inter) || e.duration > inter[id]) inter[id] = e.duration;
  }
  function inpValue() {
    var d = Object.keys(inter).map(function (k) { return inter[k]; }).sort(function (a, b) { return b - a; });
    if (d.length) return d[Math.min(d.length - 1, Math.floor(nInter / 50))];
    return firstInput; // browser senza interactionId: ritardo della prima interazione (FID) come ripiego
  }
  var firstInput = null;

  function avvia() {
    if (nav) val.TTFB = Math.max(nav.responseStart - act, 0);
    obs('paint', function (e) { if (e.name === 'first-contentful-paint' && e.startTime < hiddenAt) val.FCP = Math.max(e.startTime - act, 0); });
    lcpObs = obs('largest-contentful-paint', onLcp);
    clsObs = obs('layout-shift', onShift);
    evObs = obs('event', onEvent, { durationThreshold: 40 });
    obs('first-input', function (e) { onEvent(e); if (firstInput === null) firstInput = e.processingStart - e.startTime; });
    ['keydown', 'pointerdown'].forEach(function (t) { addEventListener(t, stopLcp, { once: true, capture: true, passive: true }); });
    addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') inviaTutto(); });
    addEventListener('pagehide', inviaTutto);
  }

  if (document.readyState === 'complete') setTimeout(avvia, 0);
  else addEventListener('load', function () { setTimeout(avvia, 0); });
})();
