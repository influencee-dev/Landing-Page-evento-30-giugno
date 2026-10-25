import type React from 'react';
import type { Meta } from '../pages';

/** Pagina ex Elementor rifatta nel template nuovo, stesso URL.
 *  titles: possibili title SENZA « | Influencee», dal migliore al più corto: si usa il primo che resta entro 60 caratteri.
 *  description ≤ 155 caratteri. Lo stato `ready: false` tiene la pagina fuori dal plugin finché non è finita. */
export interface ExPage {
  path: string;
  ready: boolean;
  titles: string[];
  meta: Omit<Meta, 'path' | 'title'>;
  el: () => React.ReactNode;
}
