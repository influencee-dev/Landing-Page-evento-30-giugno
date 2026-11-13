import './widget.css';
import { initPreventivi, schedulePreventivoPopup } from './widget';

/* Calcolatore per articoli e pagine WordPress (Core: assets/inft-preventivo.js + .css).
   Il PHP scrive <div data-inft-preventivo-mount data-page=… data-origin=…>; qui si disegna e si collega. */
import { preventivoHTML } from './widget';

function start() {
  document.querySelectorAll<HTMLElement>('[data-inft-preventivo-mount]').forEach((m) => {
    const d = m.dataset;
    m.innerHTML = preventivoHTML({ page: d.page || 'sito', origin: d.origin || document.title, variant: d.variant === 'full' ? 'full' : 'compact', city: d.city, sector: d.sector, title: d.title });
    m.removeAttribute('data-inft-preventivo-mount');
  });
  initPreventivi();
  // popup dopo un minuto (articoli): <div data-inft-preventivo-popup data-page data-origin data-delay>
  const pop = document.querySelector<HTMLElement>('[data-inft-preventivo-popup]');
  if (pop) schedulePreventivoPopup(document.body, { page: pop.dataset.page || 'popup', origin: pop.dataset.origin || document.title }, (Number(pop.dataset.delay) || 60) * 1000);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
