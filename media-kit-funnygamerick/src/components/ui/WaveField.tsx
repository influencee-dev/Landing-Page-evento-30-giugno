import { useMemo } from 'react';

type Props = {
  className?: string;
  lines?: number;
  /** Variante della curva, per non ripetere lo stesso disegno in ogni sezione. */
  variant?: 'hero' | 'soft';
};

/**
 * Nastri di linee curve ispirati al banner del canale, disegnati in SVG (nessuna immagine).
 * Il gruppo di linee "respira" lentamente via CSS; con movimento ridotto resta fermo.
 */
export function WaveField({ className = '', lines = 34, variant = 'hero' }: Props) {
  const paths = useMemo(() => {
    const out: { d: string; o: number }[] = [];
    for (let i = 0; i < lines; i++) {
      const t = i / (lines - 1);
      const o = 0.06 + Math.sin(t * Math.PI) * 0.22;
      if (variant === 'hero') {
        // Nastro che sale da sinistra, si avvita al centro e ridiscende a destra.
        const y0 = 760 - t * 140;
        const c1y = 120 + t * 260;
        const c2y = 980 - t * 420;
        const y1 = 180 + t * 150;
        out.push({ d: `M -80 ${y0} C 420 ${c1y}, 980 ${c2y}, 1680 ${y1}`, o });
      } else {
        const y0 = 420 + t * 60;
        out.push({ d: `M -80 ${y0} C 380 ${120 + t * 140}, 1120 ${700 - t * 120}, 1680 ${260 + t * 90}`, o });
      }
    }
    return out;
  }, [lines, variant]);

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`wf-${variant}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#1165A3" stopOpacity="0" />
          <stop offset="0.35" stopColor="#3E8FD0" />
          <stop offset="0.65" stopColor="#63DFF7" />
          <stop offset="1" stopColor="#1165A3" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="origin-center animate-drift" fill="none" stroke={`url(#wf-${variant})`} strokeWidth="1.1">
        {paths.map((p, i) => (
          <path key={i} d={p.d} strokeOpacity={p.o} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
