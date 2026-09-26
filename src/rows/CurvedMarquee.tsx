import React, { useId } from 'react';

/**
 * Nastro di testo che scorre lungo una curva (ref. Signal / Shinta).
 * Usato come decorazione dentro le hero; `path` è in un viewBox 1200x300.
 */
export interface CurvedMarqueeProps {
  items: string[];
  /** Tracciato SVG in coordinate 1200x300. */
  path?: string;
  bg?: string;
  color?: string;
  separator?: string;
  duration?: number;
  className?: string;
  thickness?: number;
  fontClass?: string;
}

export const CURVES = {
  smile: 'M-50 260 C 300 120, 900 120, 1250 40',
  wave: 'M-50 120 C 200 300, 400 300, 600 180 S 1000 20, 1250 160',
};

export default function CurvedMarquee({
  items,
  path = CURVES.smile,
  bg = '#ff5a1f',
  color = '#fff',
  separator = '✳',
  duration = 30,
  className = '',
  thickness = 40,
  fontClass = 'font-mono',
}: CurvedMarqueeProps) {
  const id = useId().replace(/:/g, '');
  const text = Array.from({ length: 8 }, () => items.join(`  ${separator}  `)).join(`  ${separator}  `);

  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className={`pointer-events-none ${className}`} aria-hidden>
      <path id={`cm-${id}`} d={path} fill="none" stroke={bg} strokeWidth={thickness} />
      <text className={fontClass} fontSize={thickness * 0.5} fill={color} dy={thickness * 0.17} letterSpacing="1">
        <textPath href={`#cm-${id}`} startOffset="0%">
          <animate attributeName="startOffset" from="0%" to="-100%" dur={`${duration}s`} repeatCount="indefinite" />
          {text}
        </textPath>
      </text>
    </svg>
  );
}
