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
    INFLUENCEE_TOOLS?: { jobs?: Job[]; assets?: string; path?: string; creators?: Record<string, string>; profile?: Profile; directory?: import('./creators').DirItem[] };
  }
}

/** Offerte da mostrare: quelle reali di WordPress se ci sono, altrimenti quelle di esempio. */
export function liveJobs(fallback: Job[]): Job[] {
  if (typeof window !== 'undefined' && Array.isArray(window.INFLUENCEE_TOOLS?.jobs)) return window.INFLUENCEE_TOOLS!.jobs!;
  return fallback;
}
