import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CreatorData } from '../data/types';
import { contactHref } from '../lib/format';

export type NavItem = { id: string; label: string };

type Props = { creator: CreatorData; items: NavItem[] };

export function Navbar({ creator, items }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < window.innerHeight * 0.5) setActive(null);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Evidenzia la sezione visibile.
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && window.scrollY > window.innerHeight * 0.5 && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // Menu mobile: blocca lo scroll e si chiude con Esc.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const external = !creator.contact.email;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? 'border-b border-line/60 bg-night/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="container-x flex h-[4.5rem] items-center justify-between gap-6" aria-label="Navigazione principale">
        <a href="#top" className="group flex items-center gap-3" aria-label={`${creator.name}, torna all'inizio`}>
          <span className="relative block h-9 w-9 overflow-hidden rounded-full ring-1 ring-cyan/50 transition group-hover:ring-cyan">
            <img src="/images/avatar-192.webp" alt="" width={36} height={36} className="h-full w-full object-cover" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide text-ink">
            Funny<span className="text-cyan">Game</span>Rick
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors hover:text-ink ${
                  active === item.id ? 'text-ink' : 'text-muted'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-cyan transition-transform duration-500 ${
                    active === item.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contatti"
            className="btn btn-primary hidden min-h-10 px-5 text-xs sm:inline-flex"
          >
            Collaboriamo
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition hover:border-cyan/60 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100dvh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line/60 bg-night/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pt-6">
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line/40 py-4 font-display text-2xl font-semibold tracking-wide text-ink uppercase"
                  >
                    {item.label}
                    <span className="h-px w-6 bg-line" aria-hidden="true" />
                  </a>
                </motion.li>
              ))}
              <li className="pt-8">
                <a
                  href={contactHref(creator)}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Proponi una collaborazione
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
