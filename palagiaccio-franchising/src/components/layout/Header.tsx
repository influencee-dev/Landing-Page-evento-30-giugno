import { useEffect, useRef, useState } from 'react';
import { ctas, nav } from '../../data/content';
import { useScrolled } from '../../hooks/useScrolled';
import { ButtonLink } from '../ui/Button';
import { Logo } from './Logo';

export function Header() {
  const scrolled = useScrolled(24);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Menu mobile: blocco scroll, chiusura con Esc, focus gestito.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1200 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open
          ? 'border-hairline bg-white/95 shadow-[0_6px_24px_-18px_rgba(31,31,31,0.35)] backdrop-blur-md'
          : 'border-transparent bg-white/85 backdrop-blur-sm'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm"
      >
        Vai al contenuto
      </a>
      <div className="container-wide flex items-center justify-between gap-6">
        <a
          href="#top"
          onClick={close}
          className={`block shrink-0 transition-[padding] duration-300 ${scrolled ? 'py-1.5' : 'py-2.5 lg:py-3'}`}
          aria-label="Il Palagiaccio Franchising — torna all'inizio"
        >
          <Logo
            className={`transition-[height] duration-300 ${scrolled ? 'h-12 lg:h-14' : 'h-14 lg:h-[4.5rem]'}`}
          />
        </a>

        <nav aria-label="Sezioni della pagina" className="hidden min-[1200px]:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="t-label relative py-2 text-[0.6875rem] text-ink transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-bordeaux after:transition-transform after:duration-300 hover:text-bordeaux hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            href={`#${ctas.formAnchor}`}
            className="!hidden !min-h-11 !px-5 !py-3 !text-[0.6875rem] md:!inline-flex"
            arrow={false}
          >
            {ctas.header}
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center text-bordeaux min-[1200px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-[5px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="max-h-[calc(100dvh-4.9rem)] overflow-y-auto border-t border-hairline bg-white min-[1200px]:hidden"
      >
        <nav aria-label="Menu" className="container-site flex flex-col gap-10 py-8">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.id} className="border-b border-hairline">
                <a
                  href={`#${item.id}`}
                  onClick={close}
                  className="flex items-baseline gap-5 py-4 font-serif text-2xl text-ink transition-colors hover:text-bordeaux"
                >
                  <span className="t-label w-6 text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href={`#${ctas.formAnchor}`} onClick={close} block>
            {ctas.header}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
