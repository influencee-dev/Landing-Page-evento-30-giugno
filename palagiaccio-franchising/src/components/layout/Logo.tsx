import { site } from '../../data/content';

interface LogoProps {
  variant?: 'color' | 'white';
  className?: string;
}

/** Logo ufficiale (PNG 400×200 estratto da palagiaccio.com). */
export function Logo({ variant = 'color', className = '' }: LogoProps) {
  const src = variant === 'white' ? '/brand/logo-palagiaccio-white.png' : '/brand/logo-palagiaccio.png';
  return (
    <img
      src={src}
      alt={`${site.brand} — Storica fattoria, bontà dal Mugello`}
      width={400}
      height={200}
      className={`w-auto max-w-none ${className}`}
      decoding="async"
    />
  );
}
