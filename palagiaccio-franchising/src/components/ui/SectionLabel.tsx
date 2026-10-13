import type { ReactNode } from 'react';

export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`t-label section-label ${className}`}>{children}</p>;
}
