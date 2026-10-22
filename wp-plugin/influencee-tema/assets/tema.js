/* Influencee Tema · menu: un solo sottomenu aperto, chiusura con clic fuori o Esc, menu da telefono. Senza jQuery. */
(function () {
  var header = document.querySelector('.it-header');
  if (!header) return;
  var groups = [].slice.call(header.querySelectorAll('.it-group details'));
  var nav = document.getElementById('it-nav');
  var burger = header.querySelector('.it-burger');
  var desktop = window.matchMedia('(min-width: 1024px)');
  function closeAll(except) { groups.forEach(function (d) { if (d !== except) d.open = false; }); }
  groups.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) closeAll(d); });
    // su desktop il sottomenu si apre passando sopra col mouse e si chiude con un piccolo ritardo,
    // così si può scendere sulle voci senza che sparisca
    var timer = null;
    d.parentNode.addEventListener('mouseenter', function () {
      if (!desktop.matches) return;
      clearTimeout(timer); d.open = true;
    });
    d.parentNode.addEventListener('mouseleave', function () {
      if (!desktop.matches) return;
      clearTimeout(timer); timer = setTimeout(function () { d.open = false; }, 300);
    });
    // il clic sulla voce non richiude il sottomenu appena aperto col mouse
    var top = d.querySelector('summary');
    if (top) top.addEventListener('click', function (e) { if (desktop.matches && d.open && d.parentNode.matches(':hover')) e.preventDefault(); });
  });
  document.addEventListener('click', function (e) { if (!header.contains(e.target)) closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAll();
    if (nav.classList.contains('is-open')) { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
  });
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  });
})();
