import React from 'react';
import { renderToString } from 'react-dom/server';
import { jsonLd } from '../App';
import { ENV } from '../env';
import { allPaths, resolve } from '../pages';
import { EXCLUDED, groupOf, slugOf, wpHref } from './routes';

/* Pre-rendering delle pagine tool in HTML statico per il plugin WordPress.
   L'HTML contiene tutto il testo (H1, risposte "In breve", FAQ con le risposte,
   link interni già convertiti), così Google e i motori AI lo leggono senza JavaScript. */

ENV.embed = true;
ENV.ssr = true;

/** Rende visibili gli elementi animati (nell'HTML statico partirebbero trasparenti). */
function unhide(html: string) {
  return html.replace(/style="([^"]*)"/g, (_m, css: string) => {
    const out = css
      .replace(/opacity:\s*0(?![.\d])/g, 'opacity:1')
      .replace(/transform:\s*translate[XY]?\([^)]*\)( scale\([^)]*\))?;?/g, '')
      .replace(/transform:\s*none;?/g, '');
    return out.trim() ? `style="${out}"` : '';
  });
}

/** Link #/percorso/ → percorso reale su influencee.it; immagini → cartella del plugin. */
function rewrite(html: string) {
  return html
    .replace(/href="(#\/[^"]*)"/g, (_m, h: string) => `href="${wpHref(h)}"`)
    .replace(/src="(?:\.\/|\/)?([a-z0-9_-]+\.(?:webp|png|jpg|svg))"/gi, 'src="{{ASSETS}}/img/$1"');
}

export function renderAll() {
  return allPaths().filter((p) => !EXCLUDED.has(p)).map((path) => {
    const r = resolve(path);
    if (!r) throw new Error(`Route senza pagina: ${path}`);
    const body = renderToString(<React.Fragment>{r.el}</React.Fragment>);
    const html = rewrite(unhide(body));
    const images = [...html.matchAll(/\{\{ASSETS\}\}\/img\/([^"]+)"/g)].map((m) => m[1]);
    return { path, group: groupOf(path), slug: slugOf(path), meta: r.meta, ld: jsonLd(r.meta), html, images: [...new Set(images)] };
  });
}
