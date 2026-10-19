import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section';
} & Omit<HTMLMotionProps<'div'>, 'children'>;

/** Entrata progressiva allo scroll. Con "riduci movimento" attivo, MotionConfig la rende istantanea. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div', ...rest }: Props) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
