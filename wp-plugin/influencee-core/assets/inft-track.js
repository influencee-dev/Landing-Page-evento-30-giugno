/* Influencee Core · tracciamento GA4 leggero per le pagine HTML5 dei plugin (Articoli, Annunci…).
   Contenitore: [data-inft-track data-page-type="…"]. Eventi con gli stessi nomi del piano (ANALYTICS-PIANO.md).
   Sezioni: [data-section="nome"] su un antenato dà cta_location/section_name. Moduli lead: form[data-inft-lead].
   API per i plugin: window.inftTrack(evento, parametri). Debug: ?debug_analytics stampa gli eventi in console. */
(function () {
  var roots = document.querySelectorAll('[data-inft-track]');
  if (!roots.length) return;
  var debug = /[?&]debug_analytics/.test(location.search);
  var base = { page_path: location.pathname, page_type: roots[0].getAttribute('data-page-type') || 'altro', audience: roots[0].getAttribute('data-audience') || 'misto' };
  function track(ev, p) {
    var o = {}, k;
    for (k in base) o[k] = base[k];
    for (k in p || {}) if (p[k] !== undefined && p[k] !== '' && p[k] !== null) o[k] = p[k];
    if (debug) console.info('[GA4]', ev, o);
    if (typeof window.gtag === 'function') window.gtag('event', ev, o);
  }
  window.inftTrack = track;
  function where(el) { var s = el.closest('[data-section]'); return s ? s.getAttribute('data-section') : base.page_type; }
  function kind(h) {
    if (/wa\.me|whatsapp/i.test(h)) return ['whatsapp_click', 'whatsapp'];
    if (/^tel:/.test(h)) return ['phone_click', 'telefono'];
    if (/^mailto:/.test(h)) return ['email_click', 'email'];
    if (/app\.influencee\.it\/iscriviti\/brand/.test(h)) return ['signup_brand_click', 'iscrizione_brand'];
    if (/app\.influencee\.it\/iscriviti\/creator/.test(h)) return ['signup_creator_click', 'iscrizione_creator'];
    if (/app\.influencee\.it\/iscriviti/.test(h)) return ['signup_choice_click', 'iscrizione_scelta'];
    if (/app\.influencee\.it\/annunci/.test(h)) return ['app_tool_click', 'annunci_app'];
    if (/app\.influencee\.it|campaign\.influencee\.it/.test(h)) return ['app_link_click', 'app_altro'];
    if (/^#/.test(h)) return ['ui_click', 'ancora'];
    var a = document.createElement('a'); a.href = h;
    return a.host === location.host ? ['internal_link_click', 'interno'] : ['outbound_click', 'esterno'];
  }
  roots.forEach(function (root) {
    // clic su link e pulsanti
    root.addEventListener('click', function (e) {
      var el = e.target.closest('a,button');
      if (!el || el.type === 'submit' || el.hasAttribute('data-track-ignore')) return;
      var h = el.getAttribute('href') || '';
      var k = h ? kind(h) : ['ui_click', 'interfaccia'];
      var ev = el.getAttribute('data-track') || k[0];
      var p = { link_text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80), link_url: h, link_type: k[1], cta_location: where(el), section_name: where(el) };
      track(ev, p);
      if (/^(signup_brand_click|signup_creator_click|signup_choice_click)$/.test(k[0])) track('begin_sign_up', { signup_audience: k[0].indexOf('brand') > 0 ? 'brand' : k[0].indexOf('creator') > 0 ? 'creator' : 'da_scegliere', cta_location: p.cta_location });
      if (/^(whatsapp_click|phone_click|email_click)$/.test(k[0])) track('generate_lead', { lead_source: k[1], currency: 'EUR', value: 0, cta_location: p.cta_location });
    });
    // copia il link
    root.querySelectorAll('[data-inft-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(location.href.split('#')[0]).then(function () { b.textContent = 'Link copiato'; setTimeout(function () { b.textContent = t; }, 2000); }, function () {});
        track('share', { method: 'copia_link', content_type: base.page_type });
      });
    });
    // FAQ aperte (details nativi)
    root.querySelectorAll('details').forEach(function (d, i) {
      d.addEventListener('toggle', function () { if (d.open) track('faq_open', { faq_question: (d.querySelector('summary') || d).textContent.trim().slice(0, 100), faq_index: i + 1 }); });
    });
    // moduli lead semplici: tandem li ha già raccolti (ascolta prima, in cattura); qui conferma senza ricaricare
    root.querySelectorAll('form[data-inft-lead]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!f.checkValidity()) { f.reportValidity(); return; }
        var name = f.getAttribute('data-form') || 'lead';
        track('form_submit', { form_name: name, cta_location: where(f) });
        track('generate_lead', { lead_source: name, currency: 'EUR', value: 0, cta_location: where(f) });
        f.classList.add('is-sent');
        var ok = f.querySelector('.inf-ok'); if (ok) ok.hidden = false;
      });
    });
  });
  // profondità di lettura (sul contenuto principale, se indicato)
  var main = document.querySelector('[data-inft-read]') || roots[0];
  var marks = [25, 50, 75, 90], sent = {}, tick = false;
  addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      tick = false;
      var r = main.getBoundingClientRect(), seen = Math.min(100, Math.max(0, (innerHeight - r.top) / r.height * 100));
      marks.forEach(function (m) { if (seen >= m && !sent[m]) { sent[m] = 1; track('scroll_depth', { percent_scrolled: m }); } });
    });
  }, { passive: true });
})();
