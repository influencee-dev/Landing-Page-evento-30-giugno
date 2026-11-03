import type { Job } from './data';
import type { Profile } from './profile';

/* Ambiente di esecuzione: sito v2 (anteprima) oppure plugin WordPress. */
export const ENV = {
  /** true quando la pagina gira dentro il plugin WordPress */
  embed: false,
  /** true durante il pre-rendering in HTML (build del plugin) */
  ssr: false,
};

declare global {
  interface Window {
    /** Dati passati dal plugin WordPress (offerte reali da WP Job Manager, URL delle immagini). */
    INFLUENCEE_TOOLS?: { jobs?: Job[]; assets?: string; bundle?: string; path?: string; creators?: Record<string, string>; profile?: Profile; directory?: import('./creators').DirItem[] };
  }
}

/** Offerte da mostrare: quelle reali di WordPress se ci sono, altrimenti quelle di esempio. */
export function liveJobs(fallback: Job[]): Job[] {
  if (typeof window !== 'undefined' && Array.isArray(window.INFLUENCEE_TOOLS?.jobs)) return window.INFLUENCEE_TOOLS!.jobs!;
  return fallback;
}

/** Immagine della cartella del plugin. Nel bundle WordPress un percorso relativo ("reel-x.webp") farebbe partire
 *  una richiesta a WordPress (pagina 404 costruita dal server) prima che il link venga corretto.
 *  Nel pre-rendering e nel sito v2 il percorso resta com'è. */
export function asset(src: string): string {
  if (!ENV.embed || ENV.ssr || typeof window === 'undefined') return src;
  const base = window.INFLUENCEE_TOOLS?.assets;
  return base && /^(?:\.\/|\/)?[a-z0-9_-]+\.(?:webp|png|jpg|svg)$/i.test(src) ? `${base}/img/${src.replace(/^\.?\//, '')}` : src;
}
