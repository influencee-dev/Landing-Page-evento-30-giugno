import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from './Icons';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'gold' | 'light' | 'ghost';
  block?: boolean;
  arrow?: boolean;
  children: ReactNode;
}

export function ButtonLink({
  variant = 'primary',
  block = false,
  arrow = true,
  className = '',
  children,
  ...rest
}: ButtonLinkProps) {
  const variantClass = variant === 'primary' ? '' : `btn--${variant}`;
  return (
    <a className={`btn ${variantClass} ${block ? 'btn--block' : ''} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && <ArrowRight className="btn-arrow" />}
    </a>
  );
}
