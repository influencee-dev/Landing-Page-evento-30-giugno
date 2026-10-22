/* Influencee Articoli · solo interfaccia: l'indice segue la lettura.
   Il tracciamento (clic, lettura, FAQ, modulo lead, copia link) è in Influencee Core (inft-track.js). */
(function () {
  var art = document.querySelector('#ia .ia-content');
  if (!art) return;
  var toc = document.querySelectorAll('#ia .ia-toc a'), heads = art.querySelectorAll('h2[id]'), tick = false;
  addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      tick = false;
      var cur = '';
      for (var i = 0; i < heads.length; i++) if (heads[i].getBoundingClientRect().top < 140) cur = heads[i].id;
      toc.forEach(function (a) { if (a.getAttribute('href') === '#' + cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    });
  }, { passive: true });
})();
