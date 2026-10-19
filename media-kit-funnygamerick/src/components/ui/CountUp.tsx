import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
};

/**
 * Anima un numero da 0 al valore reale quando entra nel viewport.
 * Il valore finale è sempre presente per screen reader e utenti con movimento ridotto.
 */
export function CountUp({ value, format, duration = 1.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() => format(reduce ? value : 0));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(format(value));
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration, format]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {display}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
