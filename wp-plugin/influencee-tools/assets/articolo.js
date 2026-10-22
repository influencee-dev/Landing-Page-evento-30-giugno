/* Influencee Tools · articoli. JavaScript minimo: il testo è già tutto nell'HTML.
   Eventi GA4 con gli stessi nomi delle altre pagine (ANALYTICS-PIANO.md) e invio del modulo lead
   (lo script tandem del sito raccoglie il form data-tandem; qui si mostra la conferma). */
(function () {
  var root = document.getElementById('ia');
  if (!root) return;
  var debug = /[?&]debug_analytics/.test(location.search);
  var base = { page_path: location.pathname, page_type: 'articolo', audience: 'misto' };
  function track(ev, p) {
    var o = {}, k;
    for (k in base) o[k] = base[k];
    for (k in p || {}) if (p[k] !== undefined && p[k] !== '') o[k] = p[k];
    if (debug) console.info('[GA4]', ev, o);
    if (typeof window.gtag === 'function') window.gtag('event', ev, o);
  }
  function where(el) {
    var s = el.closest('.ia-hero,.ia-toc,.ia-cta,.ia-content,.ia-faq,.ia-author,.ia-leadsec,.ia-related');
    var map = { 'ia-hero': 'testata', 'ia-toc': 'indice', 'ia-cta': 'box_laterale', 'ia-content': 'testo', 'ia-faq': 'faq', 'ia-author': 'autore', 'ia-leadsec': 'modulo_lead', 'ia-related': 'correlati' };
    var c = s ? s.className.split(' ')[0] : '';
    return map[c] || 'articolo';
  }
  function kind(h) {
    if (/wa\.me|whatsapp/i.test(h)) return ['whatsapp_click', 'whatsapp'];
    if (/^tel:/.test(h)) return ['phone_click', 'telefono'];
    if (/^mailto:/.test(h)) return ['email_click', 'email'];
    if (/app\.influencee\.it\/iscriviti/.test(h)) return ['signup_choice_click', 'iscrizione'];
    if (/app\.influencee\.it|campaign\.influencee\.it/.test(h)) return ['app_link_click', 'app_altro'];
    if (/^#/.test(h)) return ['ui_click', 'ancora'];
    var a = document.createElement('a'); a.href = h;
    return a.host === location.host ? ['internal_link_click', 'interno'] : ['outbound_click', 'esterno'];
  }

  // clic su link e pulsanti dell'articolo
  root.addEventListener('click', function (e) {
    var el = e.target.closest('a,button');
    if (!el || el.type === 'submit') return;
    var h = el.getAttribute('href') || '';
    var k = h ? kind(h) : ['ui_click', 'interfaccia'];
    var p = { link_text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80), link_url: h, link_type: k[1], cta_location: where(el), section_name: where(el) };
    track(k[0], p);
    if (k[0] === 'whatsapp_click' || k[0] === 'phone_click' || k[0] === 'email_click') track('generate_lead', { lead_source: k[1], currency: 'EUR', value: 0, cta_location: p.cta_location });
  });

  // copia il link
  var copy = root.querySelector('[data-ia-copy]');
  if (copy) copy.addEventListener('click', function () {
    var done = function () { copy.textContent = 'Link copiato'; setTimeout(function () { copy.textContent = 'Copia il link'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(location.href.split('#')[0]).then(done, function () {});
    track('share', { method: 'copia_link', content_type: 'articolo' });
  });

  // FAQ aperte
  root.querySelectorAll('.ia-faq details').forEach(function (d, i) {
    d.addEventListener('toggle', function () { if (d.open) track('faq_open', { faq_question: d.querySelector('summary').textContent.slice(0, 100), faq_index: i + 1 }); });
  });

  // modulo lead: tandem lo ha già raccolto (ascolta prima, in fase di cattura); qui niente ricarica e conferma
  root.querySelectorAll('form[data-inft-lead]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var name = f.getAttribute('data-form') || 'lead_articolo';
      track('form_submit', { form_name: name, cta_location: 'modulo_lead' });
      track('generate_lead', { lead_source: name, currency: 'EUR', value: 0, cta_location: 'modulo_lead' });
      f.classList.add('is-sent');
      var ok = f.querySelector('.ia-ok'); if (ok) ok.hidden = false;
    });
  });

  // profondità di lettura e sezione dell'indice in vista
  var marks = [25, 50, 75, 90], sent = {}, art = root.querySelector('.ia-content');
  var toc = root.querySelectorAll('.ia-toc a');
  var heads = art ? art.querySelectorAll('h2[id]') : [];
  var tick = false;
  function onScroll() {
    tick = false;
    if (!art) return;
    var r = art.getBoundingClientRect(), seen = Math.min(100, Math.max(0, (innerHeight - r.top) / r.height * 100));
    marks.forEach(function (m) { if (seen >= m && !sent[m]) { sent[m] = 1; track('scroll_depth', { percent_scrolled: m }); } });
    var cur = '';
    for (var i = 0; i < heads.length; i++) if (heads[i].getBoundingClientRect().top < 140) cur = heads[i].id;
    toc.forEach(function (a) { if (a.getAttribute('href') === '#' + cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
})();
