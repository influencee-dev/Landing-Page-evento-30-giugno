import React from 'react';
import { createRoot } from 'react-dom/client';
import { initEmbedAnalytics } from '../analytics';
import { MOTION } from '../../ds';
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

/** Dissolvenza leggera (CSS) per le sezioni sotto la prima schermata, quando ci si arriva scorrendo. */
function animaSezioniSotto(root: HTMLElement) {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in-anim-on');
        io.unobserve(e.target);
      }
    }),
    { rootMargin: '0px 0px -60px 0px' },
  );
  root.querySelectorAll<HTMLElement>('section.in-section').forEach((s) => {
    if (s.getBoundingClientRect().top > window.innerHeight) {
      s.classList.add('in-anim');
      io.observe(s);
    }
  });
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
  MOTION.embed = true; // niente dissolvenze di motion: non deve sparire niente di ciò che è già sullo schermo
  createRoot(root).render(el);
  requestAnimationFrame(() => requestAnimationFrame(() => animaSezioniSotto(root)));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
