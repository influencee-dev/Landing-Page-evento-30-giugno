import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button, Container, Heading, Lead, Logo, Section } from '../ds';
import { APP, FACTS, MENU, PLANS, SITE, WHATSAPP } from './data';
import { resolve, type Meta } from './pages';
import { FooterV2, WaIcon, WhatsAppFab } from './rows';
import { initAnalytics, pageView, readConsent, setConsent } from './analytics';

/* ════════════════════════════════════════════════════════════════════
   APP v2 — router con gli URL definitivi del sito (#/percorso/).
   In produzione gli stessi percorsi diventano URL reali con pagine
   prerenderizzate (SSG): il router a hash serve solo all'anteprima.
   ════════════════════════════════════════════════════════════════════ */

function readPath() {
  const h = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return h.startsWith('/') ? h : '/';
}
function usePath() {
  const [path, setPath] = useState(readPath);
  useEffect(() => {
    const on = () => setPath(readPath());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return path;
}

/* ─── Metadati e dati strutturati (SEO, GEO, AEO) ───────────────── */
function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}
export function jsonLd(meta: Meta) {
  const url = SITE.url + meta.path;
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': `${SITE.url}/#org`, name: SITE.name, legalName: SITE.company, url: SITE.url, logo: `${SITE.url}/logo.png`, contactPoint: { '@type': 'ContactPoint', telephone: WHATSAPP.tel, contactType: 'sales', areaServed: 'IT', availableLanguage: 'Italian' } },
    { '@type': 'WebSite', '@id': `${SITE.url}/#site`, name: SITE.name, url: SITE.url, inLanguage: 'it-IT', publisher: { '@id': `${SITE.url}/#org` } },
    { '@type': 'WebPage', '@id': url, url, name: meta.title, description: meta.description, inLanguage: 'it-IT', isPartOf: { '@id': `${SITE.url}/#site` } },
  ];
  if (meta.type === 'home' || meta.type === 'software' || meta.type === 'pricing')
    graph.push({
      '@type': 'SoftwareApplication',
      name: SITE.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: APP.base,
      description: 'Piattaforma italiana di influencer marketing: ricerca creator italiani, campagne, contratti e link tracciati.',
      offers: PLANS.map((p) => ({ '@type': 'Offer', name: p.name, price: p.price.replace(/[^\d,]/g, '').replace(',', '.') || '0', priceCurrency: 'EUR' })),
    });
  if (meta.crumbs?.length)
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [{ label: 'Home', href: '#/' }, ...meta.crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: SITE.url + c.href.replace('#', '') } : {}) })),
    });
  if (meta.faq?.length) graph.push({ '@type': 'FAQPage', mainEntity: meta.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}
function useHead(meta: Meta) {
  useEffect(() => {
    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', SITE.url + meta.path, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:locale', 'it_IT', 'property');
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = SITE.url + meta.path;
    let s = document.getElementById('ld-json') as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement('script');
      s.id = 'ld-json';
      s.type = 'application/ld+json';
      document.head.appendChild(s);
    }
    s.textContent = JSON.stringify(jsonLd(meta));
  }, [meta]);
}

/* ─── Header ────────────────────────────────────────────────────── */
function activeGroup(path: string) {
  if (path.startsWith('/funzionalita') || path === '/piattaforma-influencer/' || path === '/benchmark-engagement-rate/') return 'Piattaforma';
  if (['/influencer-marketing-aziende/', '/piattaforma-agenzie/', '/micro-influencer/', '/diventa-creator/', '/ugc-creator/', '/annunci-collaborazioni/'].includes(path)) return 'Soluzioni';
  if (path.startsWith('/influencer-italiani') || path.endsWith('-influencers/')) return 'Influencer italiani';
  if (path === '/prezzi/') return 'Prezzi';
  if (path === '/blog/') return 'Blog';
  return '';
}

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mg, setMg] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const active = activeGroup(path);
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [path]);
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  return (
    <div ref={ref} className="sticky top-0 z-50">
      <div className="border-b border-line bg-white/90 font-sans text-ink backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
            <a href="#/" aria-label="Influencee, home">
              <Logo />
            </a>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu principale">
              {MENU.map((g) => {
                const base = `flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${active === g.label ? 'bg-ink text-white' : 'text-ink/75 hover:bg-paper hover:text-ink'}`;
                if (!g.items)
                  return (
                    <a key={g.label} href={g.href} data-menu-group={g.label} className={base}>
                      {g.label}
                    </a>
                  );
                return (
                  <div key={g.label} data-menu-group={g.label} className="relative" onMouseEnter={() => setOpen(g.label)} onMouseLeave={() => setOpen(null)}>
                    <button type="button" className={base} aria-expanded={open === g.label} onClick={() => setOpen(open === g.label ? null : g.label)}>
                      {g.label} <ChevronDown className={`h-3.5 w-3.5 transition ${open === g.label ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {open === g.label && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }} className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 ${g.wide ? 'w-[520px]' : 'w-[340px]'}`}>
                          <div className={`grid gap-1 rounded-3xl bg-white p-3 shadow-float ring-1 ring-line ${g.wide ? 'grid-cols-3' : ''}`}>
                            {g.items.map((it, i) => (
                              <a key={it.href} href={it.href} className={`rounded-2xl px-4 py-3 transition hover:bg-paper ${g.wide && i === 0 ? 'col-span-3 bg-brand-soft hover:bg-brand-soft/70' : ''}`}>
                                <span className="block font-heading text-[15px] font-semibold tracking-tight">{it.label}</span>
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
              <a href={APP.login} className="hidden px-3 text-sm font-medium text-ink/75 hover:text-ink xl:block">
                Accedi
              </a>
              <span className="hidden sm:block">
                <Button href={APP.signup} size="sm">
                  Inizia gratis
                </Button>
              </span>
              <button type="button" aria-label="Apri il menu" onClick={() => setMobile((m) => !m)} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper lg:hidden">
                {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {mobile && (
              <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden" aria-label="Menu mobile">
                <div className="max-h-[75vh] space-y-1 overflow-y-auto border-t border-line py-3">
                  {MENU.map((g) =>
                    g.items ? (
                      <div key={g.label} data-menu-group={g.label}>
                        <button type="button" onClick={() => setMg(mg === g.label ? null : g.label)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3 font-heading font-semibold">
                          {g.label} <ChevronDown className={`h-4 w-4 transition ${mg === g.label ? 'rotate-180' : ''}`} />
                        </button>
                        {mg === g.label && (
                          <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                            {g.items.map((it) => (
                              <a key={it.href} href={it.href} className="rounded-xl bg-paper px-3 py-2.5 text-sm">
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
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a href={APP.brand} className="rounded-2xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white">
                      Sono un’azienda
                    </a>
                    <a href={APP.creator} className="rounded-2xl bg-acid px-4 py-3 text-center text-sm font-semibold">
                      Sono un creator
                    </a>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </Container>
      </div>
    </div>
  );
}

function NotFoundV2() {
  return (
    <Section tone="white">
      <Container className="text-center">
        <Heading as="h1" size="display" text={'Pagina\n*non trovata*'} />
        <Lead className="mx-auto mt-5 max-w-md">L’indirizzo non esiste. Torna alla home o cerca gli influencer per categoria.</Lead>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="#/">Home</Button>
          <Button href="#/influencer-italiani/" variant="secondary">
            Influencer italiani
          </Button>
        </div>
      </Container>
    </Section>
  );
}

const NOT_FOUND: Meta = { path: '/404/', label: 'Pagina non trovata', kw: '', title: 'Pagina non trovata | Influencee', description: 'La pagina cercata non esiste.' };

/* ─── Banner cookie (Consent Mode v2) ───────────────────────────── */
function ConsentBanner() {
  const [show, setShow] = useState(() => readConsent() === null);
  if (!show) return null;
  const choose = (v: 'granted' | 'denied') => {
    setConsent(v);
    setShow(false);
  };
  return (
    <div data-track-zone="banner_cookie" className="fixed inset-x-3 bottom-24 z-[60] mx-auto max-w-xl rounded-3xl bg-ink p-5 text-white shadow-float sm:bottom-6 lg:left-6 lg:right-auto">
      <p className="text-sm leading-relaxed text-white/80">Usiamo cookie di analisi per capire come viene usato il sito e migliorarlo. Nessun cookie pubblicitario. Puoi accettare o rifiutare.</p>
      <div className="mt-4 flex gap-2">
        <button type="button" data-track-ignore="" onClick={() => choose('granted')} className="h-10 flex-1 rounded-full bg-acid text-sm font-semibold text-ink">
          Accetta
        </button>
        <button type="button" data-track-ignore="" onClick={() => choose('denied')} className="h-10 flex-1 rounded-full bg-white/10 text-sm font-semibold ring-1 ring-white/20">
          Rifiuta
        </button>
      </div>
    </div>
  );
}

type Phase = 'idle' | 'cover' | 'reveal';

export default function SiteV2() {
  const path = usePath();
  const [shown, setShown] = useState(path);
  const [phase, setPhase] = useState<Phase>('idle');
  const reduce = useReducedMotion();
  const page = resolve(shown);
  const meta = page?.meta ?? NOT_FOUND;
  const next = resolve(path)?.meta.label ?? 'Pagina';
  useHead(meta);
  useEffect(() => {
    initAnalytics();
  }, []);
  useEffect(() => {
    pageView(shown, meta.title);
  }, [shown]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (path !== shown) setPhase('cover');
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    } catch {
      /* ignorato */
    }
    const top = () => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    top();
    const t = setTimeout(top, 300);
    return () => clearTimeout(t);
  }, []);

  const onDone = () => {
    if (phase === 'cover') {
      setShown(path);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setPhase('reveal');
    } else if (phase === 'reveal') setPhase('idle');
  };
  const slide = { idle: { y: '100%' }, cover: { y: '0%' }, reveal: { y: '-100%' } };
  const fade = { idle: { opacity: 0 }, cover: { opacity: 1 }, reveal: { opacity: 0 } };
  const isCreator = ['/diventa-creator/', '/ugc-creator/'].includes(shown);

  return (
    <div className="min-h-screen bg-white font-sans text-ink antialiased">
      <Header path={shown} />
      <main key={shown}>{page ? page.el : <NotFoundV2 />}</main>
      <FooterV2 />
      <WhatsAppFab />
      <ConsentBanner />
      <div className="h-20 lg:hidden" aria-hidden />
      <div data-track-zone="barra_mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="flex gap-2">
          <a href={isCreator ? APP.creator : APP.brand} className="flex h-12 flex-1 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white">
            {isCreator ? 'Iscriviti gratis' : `Prova ${FACTS.trialDays} giorni gratis`}
          </a>
          <a href={isCreator ? APP.brand : APP.creator} className="flex h-12 items-center justify-center rounded-full bg-paper px-5 text-[15px] font-semibold">
            {isCreator ? 'Aziende' : 'Creator'}
          </a>
          <a href={WHATSAPP.href} target="_blank" rel="noopener" aria-label="Preventivo su WhatsApp" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-ink">
            <WaIcon className="h-6 w-6" />
          </a>
        </div>
      </div>
      <motion.div
        aria-hidden
        initial={false}
        animate={phase}
        variants={reduce ? fade : slide}
        transition={phase === 'idle' ? { duration: 0 } : { duration: phase === 'cover' ? 0.32 : 0.42, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={onDone}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink ${phase === 'idle' ? 'pointer-events-none' : ''}`}
      >
        <motion.div animate={{ opacity: phase === 'cover' ? 1 : 0, y: phase === 'cover' ? 0 : -20 }} transition={{ duration: 0.2, delay: phase === 'cover' ? 0.08 : 0 }} className="px-6 text-center">
          <span className="mx-auto mb-5 block h-1.5 w-12 rounded-full bg-acid" />
          <p className="font-heading text-4xl font-semibold tracking-[-0.035em] text-white sm:text-6xl">{next}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
