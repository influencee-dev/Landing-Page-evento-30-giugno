import type { PointerEvent } from 'react';

/** Aggiorna le variabili CSS --mx/--my usate dalla classe .spotlight. */
export function onSpotlightMove(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
