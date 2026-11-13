/* ════════════════════════════════════════════════════════════════════
   PREZZI INDICATIVI DEL CALCOLATORE A PASSI (richiesta di Giorgia, 13/11/2026)
   Compenso del creator per un contenuto (reel o post), gestione esclusa.
   Punti fissi dati da Giorgia: ~10.000 follower → circa 300 €; ~80.000 → 900–1.000 €;
   creator di nicchia e professionisti (nutrizionisti, notai, medici…) costano di più.
   Le altre soglie e la maggiorazione di nicchia sono stime da confermare con lei.
   Il preventivo vero lo manda il team: qui il visitatore vede solo la fascia.
   ════════════════════════════════════════════════════════════════════ */

export interface Fascia {
  k: string;
  l: string;
  lo: number;
  /** null = su misura */
  hi: number | null;
}

export const FASCE: Fascia[] = [
  { k: 'nano', l: 'Fino a 10.000 follower', lo: 150, hi: 300 },
  { k: 'micro', l: 'Da 10.000 a 50.000', lo: 300, hi: 600 },
  { k: 'medi', l: 'Da 50.000 a 100.000', lo: 800, hi: 1200 },
  { k: 'macro', l: 'Oltre 100.000', lo: 1500, hi: null },
];

/** Video UGC: il creator gira il video per i tuoi canali, senza pubblicarlo sul suo profilo. */
export const UGC = { lo: 150, hi: 300 };

/** Creator di nicchia e professionisti: fascia più alta (stima da confermare). */
export const NICCHIA = { lo: 1.3, hi: 1.6 };

export const BUDGET = ['Fino a 1.000 €', 'Da 1.000 a 3.000 €', 'Da 3.000 a 10.000 €', 'Oltre 10.000 €', 'Non lo so, consigliatemi voi'];

const r50 = (n: number) => Math.round(n / 50) * 50;
export const euro = (n: number) => `${n.toLocaleString('it-IT')} €`;

/** Fascia di prezzo per contenuto, già con la maggiorazione di nicchia. */
export function range(lo: number, hi: number | null, nicchia: boolean): string {
  const a = nicchia ? r50(lo * NICCHIA.lo) : lo;
  if (hi === null) return `da ${euro(a)}, su misura`;
  const b = nicchia ? r50(hi * NICCHIA.hi) : hi;
  return `${euro(a)} – ${euro(b)}`;
}
