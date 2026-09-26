import React from 'react';
import { Star, StarHalf } from 'lucide-react';

/** Link di navigazione condiviso dalle navbar delle row. */
export interface NavLink {
  label: string;
  href: string;
}

export interface Cta {
  label: string;
  href: string;
}

/** Riga di stelle con supporto per mezza stella (es. 4.5). */
export function Stars({
  value = 5,
  className = 'h-4 w-4',
  color = 'text-amber-400',
}: {
  value?: number;
  className?: string;
  color?: string;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className={`inline-flex items-center gap-0.5 ${color}`} aria-label={`${value} stelle su 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className={`${className} fill-current`} strokeWidth={0} />
      ))}
      {half && <StarHalf className={`${className} fill-current`} strokeWidth={0} />}
    </span>
  );
}

/** Pila di avatar sovrapposti. */
export function AvatarStack({
  src,
  size = 'h-7 w-7',
  ring = 'ring-white',
}: {
  src: string[];
  size?: string;
  ring?: string;
}) {
  return (
    <span className="flex -space-x-2">
      {src.map((s, i) => (
        <img key={i} src={s} alt="" className={`${size} rounded-full object-cover ring-2 ${ring}`} />
      ))}
    </span>
  );
}
