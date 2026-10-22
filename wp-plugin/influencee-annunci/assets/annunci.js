/* Influencee Annunci · percorso "Pubblica un'offerta" in 5 passi.
   Controlli uguali all'app; il lead lo raccoglie tandem (data-tandem) all'invio; la bozza va a
   /wp-json/influencee-annunci/v1/bozza. Eventi GA4 con window.inftTrack (Influencee Core). */
(function () {
  var f = document.getElementById('lead-form-pubblica-offerta');
  if (!f) return;
  var track = window.inftTrack || function () {};
  var steps = [].slice.call(f.querySelectorAll('.infn-step'));
  var dots = [].slice.call(document.querySelectorAll('[data-step-dot]'));
  var bar = f.querySelector('.infn-progress span');
  var prev = f.querySelector('[data-prev]'), next = f.querySelector('[data-next]'), submit = f.querySelector('[data-submit]');
  var errBox = f.querySelector('[data-err]');
  var cur = 0;
  f.classList.add('is-js');
  f.addEventListener('input', function () { errBox.hidden = true; });

  function show(i) {
    cur = i;
    steps.forEach(function (s, k) { s.hidden = k !== i; });
    dots.forEach(function (d, k) { if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); d.classList.toggle('is-done', k < i); });
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
    prev.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
    errBox.hidden = true;
    if (i === steps.length - 1) summary();
    var first = steps[i].querySelector('input:not([type=hidden]),textarea,select');
    if (window.scrollY > f.getBoundingClientRect().top + window.scrollY - 20) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (first && i > 0) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
  }

  // campo obbligatorio che cambia col tipo di offerta (come nell'app)
  function kind() { var k = f.querySelector('input[name=kind]:checked'); return k ? k.value : ''; }
  function syncKind() {
    var k = kind();
    f.querySelectorAll('[data-kind]').forEach(function (el) {
      var on = el.getAttribute('data-kind') === k;
      el.hidden = !on;
      var main = { paid_fee: 'fee_amount', product_gifting: 'product_desc', affiliate_commission: 'commission_pct' }[el.getAttribute('data-kind')];
      var inp = el.querySelector('[name=' + main + ']');
      if (inp) inp.required = on;
    });
  }
  f.querySelectorAll('input[name=kind]').forEach(function (r) { r.addEventListener('change', syncKind); });
  syncKind();
  // partita IVA oppure codice fiscale (brand senza partita IVA)
  function syncFiscale() {
    var t = (f.querySelector('input[name=tipo_fiscale]:checked') || {}).value || 'piva';
    f.querySelectorAll('[data-fiscale]').forEach(function (el) { el.hidden = el.getAttribute('data-fiscale') !== t; });
    f.querySelector('[name=piva]').required = t === 'piva';
    f.querySelector('[name=codice_fiscale]').required = t === 'cf';
    var rs = f.querySelector('[name=ragione_sociale]');
    rs.required = t === 'piva';
    f.querySelector('[data-rs-label]').innerHTML = t === 'piva' ? 'Ragione sociale *' : 'Nome dell’attività <small>(facoltativo)</small>';
  }
  f.querySelectorAll('input[name=tipo_fiscale]').forEach(function (r) { r.addEventListener('change', syncFiscale); });
  syncFiscale();
  // la piattaforma del contenuto segue la prima piattaforma scelta
  f.querySelectorAll('input[name="platforms[]"]').forEach(function (c) {
    c.addEventListener('change', function () {
      var first = f.querySelector('input[name="platforms[]"]:checked');
      if (first) f.querySelector('[name=contenuto_piattaforma]').value = first.value;
    });
  });
  // il sito diventa la pagina del prodotto se non indicata
  f.querySelector('[name=sito]').addEventListener('change', function () {
    var d = f.querySelector('[name=destination_url]');
    if (!d.value) d.value = this.value;
  });

  function pivaOk(v) {
    v = v.replace(/\s+/g, '').replace(/^IT/i, '');
    if (!/^\d{11}$/.test(v)) return false;
    var s = 0;
    for (var i = 0; i < 11; i++) { var d = +v[i]; if (i % 2) { d *= 2; if (d > 9) d -= 9; } s += d; }
    return s % 10 === 0;
  }
  function cfOk(v) {
    v = v.replace(/\s+/g, '').toUpperCase();
    if (/^\d{11}$/.test(v)) return pivaOk(v);
    if (!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(v)) return false;
    var odd = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23], s = 0;
    for (var i = 0; i < 15; i++) { var c = v[i], n = /\d/.test(c) ? +c : c.charCodeAt(0) - 65; s += i % 2 === 0 ? odd[n] : n; }
    return String.fromCharCode(65 + s % 26) === v[15];
  }
  function fail(el, msg) {
    errBox.textContent = msg; errBox.hidden = false;
    if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); }, { once: true }); }
    return false;
  }
  function check(i) {
    var s = steps[i];
    var fields = s.querySelectorAll('input,textarea,select');
    for (var k = 0; k < fields.length; k++) {
      var el = fields[k];
      if (el.closest('[hidden]') || el.type === 'hidden') continue;
      if (el.type === 'radio') {
        if (el.required && !s.querySelector('input[name="' + el.name + '"]:checked')) return fail(el, 'Scegli un’opzione.');
        continue;
      }
      if (!el.checkValidity()) {
        var lab = (s.querySelector('label[for="' + el.id + '"]') || el.closest('label') || {}).textContent || 'Questo campo';
        return fail(el, (lab.replace(/\*|\(.*\)/g, '').trim() || 'Questo campo') + ': ' + (el.validity.valueMissing ? 'da compilare.' : 'controlla il valore.'));
      }
    }
    var group = s.querySelector('[data-min]');
    if (group && !group.querySelector('input:checked')) return fail(group.querySelector('input'), 'Scegli almeno una piattaforma.');
    var cf = s.querySelector('[name=codice_fiscale]');
    if (cf && !cf.closest('[hidden]') && !cfOk(cf.value)) return fail(cf, 'Il codice fiscale non è valido: controlla i 16 caratteri.');
    var piva = s.querySelector('[name=piva]');
    if (piva && !piva.closest('[hidden]') && f.querySelector('[name=paese]').value === 'IT' && !pivaOk(piva.value)) return fail(piva, 'La partita IVA non è valida: controlla le 11 cifre.');
    return true;
  }
  next.addEventListener('click', function () {
    if (!check(cur)) return;
    track('post_job_step', { step: cur + 1, step_name: steps[cur].querySelector('legend').textContent.replace(/^\d di \d\s*/, '').trim(), compenso: cur === 2 ? kind() : undefined });
    show(cur + 1);
  });
  prev.addEventListener('click', function () { show(cur - 1); });

  function val(n) { var el = f.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; }
  function label(n) { var el = f.querySelector('[name="' + n + '"]'); return el && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : ''; }
  function summary() {
    var k = kind(), off = k === 'paid_fee' ? '€ ' + val('fee_amount') + ' + IVA per creator' : k === 'product_gifting' ? 'Cambio merce: ' + val('product_desc') : val('commission_pct') + '% sulle vendite';
    var pl = [].map.call(f.querySelectorAll('input[name="platforms[]"]:checked'), function (c) { return c.nextElementSibling.textContent; }).join(', ');
    var box = f.querySelector('[data-summary]');
    box.innerHTML = '';
    var t = document.createElement('p'); t.className = 'infn-sum-t'; t.textContent = val('title'); box.appendChild(t);
    [[val('azienda') + ' · ' + val('citta_sede')], [off], [val('contenuto_qty') + ' ' + label('contenuto_tipo') + ' su ' + label('contenuto_piattaforma') + ' · consegna ' + val('contenuto_giorni') + ' giorni'], [pl + (val('citta') ? ' · creator a ' + val('citta') : '')], ['Candidature entro il ' + val('apply_by').split('-').reverse().join('/')]].forEach(function (r) {
      var p = document.createElement('p'); p.textContent = r[0]; box.appendChild(p);
    });
  }

  function data() {
    var o = {};
    new FormData(f).forEach(function (v, k) {
      if (k === 'platforms[]') { (o.platforms = o.platforms || []).push(v); return; }
      o[k] = v;
    });
    return o;
  }
  // tandem ha già letto il modulo (ascolta in fase di cattura); qui niente ricarica
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check(cur)) return;
    submit.disabled = true; submit.dataset.t = submit.textContent; submit.textContent = 'Invio in corso…';
    fetch(window.INFN.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data()), credentials: 'same-origin' })
      .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (res) {
        if (!res.j || !res.j.ok) {
          var campi = (res.j && res.j.campi) || {};
          var nome = Object.keys(campi)[0];
          var el = nome && f.querySelector('[name="' + nome + '"],[name="' + nome + '[]"]');
          if (el) show(steps.indexOf(el.closest('.infn-step')));
          fail(el, (res.j && res.j.errore) || 'Invio non riuscito: riprova tra poco.');
          return;
        }
        track('form_submit', { form_name: 'lead_pubblica_offerta', cta_location: 'modulo' });
        track('generate_lead', { lead_source: 'lead_pubblica_offerta', currency: 'EUR', value: 0, cta_location: 'modulo', compenso: kind() });
        track('post_job_done', { collegata_app: res.j.collegata ? 'si' : 'no' });
        steps.forEach(function (s) { s.hidden = true; });
        f.querySelector('.infn-nav').hidden = true;
        f.querySelector('.infn-progress').hidden = true;
        var done = f.querySelector('[data-done]');
        if (res.j.claim_url) done.querySelector('[data-claim]').href = res.j.claim_url;
        done.hidden = false;
        dots.forEach(function (d) { d.classList.add('is-done'); d.removeAttribute('aria-current'); });
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () { fail(null, 'Connessione non riuscita: riprova tra poco.'); })
      .then(function () { submit.disabled = false; if (submit.dataset.t) submit.textContent = submit.dataset.t; });
  });

  show(0);
})();
