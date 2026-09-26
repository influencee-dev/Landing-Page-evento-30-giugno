import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { Button, Container, Eyebrow, Heading, Lead, Logo, Section, TYPE, type Tone } from '../ds';
import { CTA } from '../content';
import { MENU } from './data';

/* ─── Router a hash (solo token semplici: funzionano anche nell'artifact) ─
   Esempi: #home · #creator · #nicchia.food · #creator.giulia-eats
           #blog · #categoria.guide · #articolo.micro-o-macro-influencer        */
export function readRoute() {
  const h = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return h || 'home';
}

export function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute());
      // dopo il render della nuova pagina torna in cima
      requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

/** Il gruppo di menu attivo per la route corrente (per evidenziarlo). */
function activeGroup(route: string) {
  const head = route.split('.')[0];
  if (['brand', 'agenzie', 'diventa-creator'].includes(head)) return 'Soluzioni';
  if (['creator', 'nicchia'].includes(head)) return 'Creator';
  if (['blog', 'categoria', 'articolo'].includes(head)) return 'Blog';
  if (head === 'piattaforma') return 'Piattaforma';
  if (head === 'casi-studio') return 'Casi studio';
  return '';
}

/* ─── Header globale con mega-menu ──────────────────────────────── */
export function SiteHeader({ route }: { route: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const active = activeGroup(route);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [route]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div ref={ref} className="sticky z-50 px-2 pt-2 sm:px-3 sm:pt-3" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="rounded-[24px] bg-white/95 font-sans text-ink shadow-card backdrop-blur sm:rounded-[32px]">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
            <Logo />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu principale">
              {MENU.map((g) => {
                const isActive = active === g.label;
                const base = `flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-ink text-white' : 'text-ink/75 hover:bg-paper hover:text-ink'}`;
                if (!g.items)
                  return (
                    <a key={g.label} href={g.href} className={base}>
                      {g.label}
                    </a>
                  );
                return (
                  <div key={g.label} className="relative" onMouseEnter={() => setOpen(g.label)} onMouseLeave={() => setOpen(null)}>
                    <button type="button" className={base} aria-expanded={open === g.label} onClick={() => setOpen(open === g.label ? null : g.label)}>
                      {g.label} <ChevronDown className={`h-3.5 w-3.5 transition ${open === g.label ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {open === g.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 ${g.wide ? 'w-[520px]' : 'w-[320px]'}`}
                        >
                          <div className={`grid gap-1 rounded-3xl bg-white p-3 shadow-float ring-1 ring-line ${g.wide ? 'grid-cols-2' : ''}`}>
                            {g.items.map((it, i) => (
                              <a key={it.href + it.label} href={it.href} className={`rounded-2xl px-4 py-3 transition hover:bg-paper ${g.wide && i === 0 ? 'col-span-2 bg-brand-soft hover:bg-brand-soft/70' : ''}`}>
                                <span className="block font-heading text-[15px] font-semibold tracking-tight text-ink">{it.label}</span>
                                {it.text && <span className="mt-0.5 block text-xs text-mute">{it.text}</span>}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <Button href={CTA.demo.href} size="sm">
                  {CTA.demo.label}
                </Button>
              </span>
              <button type="button" aria-label="Apri il menu" onClick={() => setMobile((m) => !m)} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink lg:hidden">
                {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {mobile && (
              <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden" aria-label="Menu mobile">
                <div className="space-y-1 border-t border-line py-3">
                  {MENU.map((g) =>
                    g.items ? (
                      <div key={g.label}>
                        <button type="button" onClick={() => setMobileGroup(mobileGroup === g.label ? null : g.label)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3 font-heading font-semibold">
                          {g.label} <ChevronDown className={`h-4 w-4 transition ${mobileGroup === g.label ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileGroup === g.label && (
                          <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                            {g.items.map((it) => (
                              <a key={it.href + it.label} href={it.href} className="rounded-xl bg-paper px-3 py-2.5 text-sm">
                                {it.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <a key={g.label} href={g.href} className="block rounded-2xl px-4 py-3 font-heading font-semibold">
                        {g.label}
                      </a>
                    ),
                  )}
                  <a href={CTA.demo.href} className="mt-2 block rounded-2xl bg-brand px-4 py-3 text-center font-semibold text-white">
                    {CTA.demo.label}
                  </a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </Container>
      </div>
    </div>
  );
}

/* ─── Breadcrumb ────────────────────────────────────────────────── */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Percorso" className="flex flex-wrap items-center gap-1.5 text-sm text-mute">
      <a href="#home" className="hover:text-ink">
        Home
      </a>
      {items.map((it) => (
        <React.Fragment key={it.label}>
          <ChevronRight className="h-3.5 w-3.5" />
          {it.href ? (
            <a href={it.href} className="hover:text-ink">
              {it.label}
            </a>
          ) : (
            <span className="text-ink">{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ─── Hero standard delle pagine interne ────────────────────────── */
export function PageHero({
  tone = 'white',
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  tone?: Tone;
  crumbs: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <Section tone={tone} pad="none" className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs items={crumbs} />
        <div className={`mt-10 grid gap-10 ${aside ? 'lg:grid-cols-[1.4fr_1fr] lg:items-end' : ''}`}>
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Heading as="h1" size="display" text={title} className="mt-5" />
            {lead && <Lead className="mt-6 max-w-xl">{lead}</Lead>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside}
        </div>
      </Container>
    </Section>
  );
}

export function NotFound() {
  return (
    <Section tone="white">
      <Container className="text-center">
        <p className={`${TYPE.numberXL} text-brand`}>404</p>
        <Heading as="h1" text="Pagina *non trovata*" className="mt-6" />
        <Lead className="mx-auto mt-4 max-w-md">Il link potrebbe essere cambiato. Torna alla home o cerca tra i creator.</Lead>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="#home">Torna alla home</Button>
          <Button href="#creator" variant="secondary">
            Cerca creator
          </Button>
        </div>
      </Container>
    </Section>
  );
}
