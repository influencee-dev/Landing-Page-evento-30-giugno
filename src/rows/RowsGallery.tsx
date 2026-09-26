import React from 'react';
import { ROWS } from './registry';

/**
 * Pagina di anteprima di tutte le row: apri /?rows
 * Filtra con /?rows=hero (match sul nome/id).
 */
export default function RowsGallery() {
  const q = new URLSearchParams(window.location.search).get('rows')?.toLowerCase() ?? '';
  const rows = ROWS.filter((r) => !q || r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q));

  return (
    <div className="min-h-screen bg-zinc-200">
      <nav className="sticky top-0 z-50 flex gap-2 overflow-x-auto border-b border-zinc-300 bg-white/90 px-4 py-2 text-xs backdrop-blur">
        <b className="shrink-0 py-1 pr-2">Row gallery · {rows.length}</b>
        {rows.map((r) => (
          <a key={r.id} href={`#${r.id}`} className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 hover:bg-zinc-200">
            {r.num} {r.name}
          </a>
        ))}
      </nav>
      {rows.map(({ id, num, name, ref, Component, props }) => (
        <div key={id} id={id} className="scroll-mt-12">
          <div className="flex items-baseline gap-3 bg-zinc-900 px-4 py-2 font-mono text-xs text-white">
            <span className="text-fuchsia-400">{num}</span>
            <span>{name}</span>
            <span className="text-white/40">ref. {ref}</span>
          </div>
          <Component {...(props ?? {})} />
        </div>
      ))}
    </div>
  );
}
