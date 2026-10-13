import type { CSSProperties } from 'react';

/** Indice per lo stagger delle animazioni (variabile CSS --i). */
export const stagger = (i: number): CSSProperties => ({ '--i': i }) as CSSProperties;
