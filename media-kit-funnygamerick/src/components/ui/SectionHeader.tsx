import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  subtitle?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
};

export function SectionHeader({ index, label, title, subtitle, id, align = 'left' }: Props) {
  const center = align === 'center';
  return (
    <Reveal className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <div className={`mb-6 flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
        <span className="section-index">{index}</span>
        <span className="h-px w-8 bg-line" aria-hidden="true" />
        <span className="eyebrow">{label}</span>
      </div>
      <h2 id={id} className="display text-[clamp(2.4rem,6vw,4.75rem)] text-ink">
        {title}
      </h2>
      {subtitle && <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{subtitle}</p>}
    </Reveal>
  );
}
