import './widget.css';
import { initPreventivi } from './widget';

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
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
