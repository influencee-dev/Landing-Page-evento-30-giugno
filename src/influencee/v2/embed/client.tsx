import React, { startTransition, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initEmbedAnalytics, setEmbedContext } from '../analytics';
import { MOTION } from '../../ds';
import { ENV } from '../env';
import { resolve } from '../pages';
import { CreatorProfile } from '../profile';
import { animaSezioniSotto } from './boot-anim';
import { wpHref } from './routes';
import './embed.css';
import '../v2.css';

/* Bundle del plugin WordPress: sostituisce l'HTML pre-renderizzato con la
   versione interattiva della stessa pagina (calcolatori, filtri, FAQ, lead).
   Il contenitore è <div id="influencee-tools" data-route="/percorso/">.
   Lo carica il caricatore leggero (boot.ts) dopo la prima schermata: tracciamento e
   dissolvenze li ha già avviati lui. Caricato da solo (HTML vecchio in cache) fa tutto come prima. */

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

/** Avvisa il caricatore appena React ha sostituito l'HTML statico (prima che il browser disegni). */
function Committed({ root, children }: { root: HTMLElement; children: React.ReactNode }) {
  useLayoutEffect(() => {
    window.__inftBoot?.done(root);
    requestAnimationFrame(() => requestAnimationFrame(() => animaSezioniSotto(root)));
  }, [root]);
  return <>{children}</>;
}

function boot() {
  const root = document.getElementById('influencee-tools');
  if (!root) return;
  const path = root.getAttribute('data-route') || window.location.pathname;
  const profile = window.INFLUENCEE_TOOLS?.profile;
  const el = path.startsWith('/creator/') && profile ? <CreatorProfile p={profile} /> : resolve(path)?.el;
  if (!el) return;
  const assets = window.INFLUENCEE_TOOLS?.assets ?? '';
  const loader = window.__inftBoot;
  if (loader) setEmbedContext(path); // ascoltatori GA4 già attivi nel caricatore
  else initEmbedAnalytics(root, path);
  fixLinks(root, assets);
  MOTION.embed = true; // niente dissolvenze di motion: non deve sparire niente di ciò che è già sullo schermo
  loader?.before(root);
  const reactRoot = createRoot(root);
  // render a pezzi (transition): l'HTML statico resta visibile e la pagina risponde ai tocchi mentre React lavora
  startTransition(() => reactRoot.render(<Committed root={root}>{el}</Committed>));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
