import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowRight(props: IconProps) {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true" {...props}>
      <path d="M0 5h16.5M12.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true" {...props}>
      <path d="M5 0v14.5M1 10.5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function ExternalArrow(props: IconProps) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" {...props}>
      <path d="M1.5 8.5l7-7M3 1.5h5.5V7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Ornamento a volute ispirato al filetto del logo. */
export function Flourish(props: IconProps) {
  return (
    <svg width="56" height="12" viewBox="0 0 56 12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M28 6c-3-4-8-4-8 0s5 4 6 1M28 6c3-4 8-4 8 0s-5 4-6 1M0 6h17M39 6h17"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" {...props}>
      <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 3.5v4.2M7 9.6v.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CheckLine(props: IconProps) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true" {...props}>
      <path d="M1 6.5l5 4.5L17 1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
