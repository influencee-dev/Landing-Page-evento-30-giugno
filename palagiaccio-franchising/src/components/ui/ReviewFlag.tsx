/**
 * Contrassegno interno sui dati da validare prima della pubblicazione.
 * Visibile solo in sviluppo o con VITE_SHOW_REVIEW_FLAGS=true; mai in produzione.
 */
const SHOW = import.meta.env.DEV || import.meta.env.VITE_SHOW_REVIEW_FLAGS === 'true';

export function ReviewFlag({ show, note }: { show: boolean; note?: string }) {
  if (!SHOW || !show) return null;
  return (
    <span className="review-flag" title={note} aria-hidden="true">
      Da validare
    </span>
  );
}
