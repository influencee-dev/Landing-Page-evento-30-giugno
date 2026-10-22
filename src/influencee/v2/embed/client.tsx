import React from 'react';
import { createRoot } from 'react-dom/client';
import { initEmbedAnalytics } from '../analytics';
import { ENV } from '../env';
import { resolve } from '../pages';
import { CreatorProfile } from '../profile';
import { wpHref } from './routes';
import './embed.css';
import '../v2.css';

/* Bundle del plugin WordPress: sostituisce l'HTML pre-renderizzato con la
   versione interattiva della stessa pagina (calcolatori, filtri, FAQ, lead).
   Il contenitore è <div id="influencee-tools" data-route="/percorso/">. */

ENV.embed = true;

/** Converte link e immagini della v2 nei percorsi di WordPress, anche dopo ogni aggiornamento. */
function fixLinks(root: HTMLElement, assets: string) {
  const fix = () => {
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]').forEach((a) => a.setAttribute('href', wpHref(a.getAttribute('href')!)));
    root.querySelectorAll<HTMLImageElement>('img[src]').forEach((img) => {
      const src = img.getAttribute('src')!;
      if (/^(?:\.\/|\/)?[a-z0-9_-]+\.(?:webp|png|jpg|svg)$/i.test(src)) img.setAttribute('src', `${assets}/img/${src.replace(/^\.?\//, '')}`);
    });
  };
  fix();
  new MutationObserver(fix).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['href', 'src'] });
}

function boot() {
  const root = document.getElementById('influencee-tools');
  if (!root) return;
  const path = root.getAttribute('data-route') || window.location.pathname;
  const profile = window.INFLUENCEE_TOOLS?.profile;
  const el = path.startsWith('/creator/') && profile ? <CreatorProfile p={profile} /> : resolve(path)?.el;
  if (!el) return;
  const assets = window.INFLUENCEE_TOOLS?.assets ?? '';
  initEmbedAnalytics(root, path);
  fixLinks(root, assets);
  createRoot(root).render(<React.StrictMode>{el}</React.StrictMode>);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
