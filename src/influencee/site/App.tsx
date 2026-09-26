import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Footer } from '../rows/footer';
import { NotFound, SiteHeader, useRoute } from './shell';
import { AgenciesPage, BrandPage, CasesPage, ContactPage, CreatorJoinPage, FeaturesPage, HomePage, LegalPage, LibraryPage, PlatformPage } from './pages';
import { CreatorProfile, CreatorsPage, NichePage } from './creators';
import { ArticlePage, BlogCategoryPage, BlogPage } from './blog';
import { ARTICLES, BLOG_CATEGORIES, CREATORS_DB, NICHE_INFO } from './data';

/** Mappa route → pagina. */
function Page({ route }: { route: string }) {
  const [head, ...rest] = route.split('.');
  const arg = rest.join('.');
  switch (head) {
    case 'home':
      return <HomePage />;
    case 'brand':
      return <BrandPage />;
    case 'agenzie':
      return <AgenciesPage />;
    case 'piattaforma':
      return <PlatformPage />;
    case 'funzionalita':
      return <FeaturesPage />;
    case 'casi-studio':
      return <CasesPage />;
    case 'diventa-creator':
      return <CreatorJoinPage />;
    case 'contatti':
      return <ContactPage />;
    case 'libreria':
      return <LibraryPage />;
    case 'privacy':
    case 'cookie':
    case 'termini':
      return <LegalPage kind={head} />;
    case 'creator':
      if (!arg) return <CreatorsPage />;
      return CREATORS_DB.some((c) => c.slug === arg) ? <CreatorProfile slug={arg} /> : <NotFound />;
    case 'nicchia':
      return NICHE_INFO[arg] ? <NichePage slug={arg} /> : <NotFound />;
    case 'blog':
      return <BlogPage />;
    case 'categoria':
      return BLOG_CATEGORIES[arg] ? <BlogCategoryPage slug={arg} /> : <NotFound />;
    case 'articolo':
      return ARTICLES.some((a) => a.slug === arg) ? <ArticlePage slug={arg} /> : <NotFound />;
    default:
      return <NotFound />;
  }
}

/** Nome leggibile della pagina (sipario di transizione e titolo della scheda). */
export function pageLabel(route: string) {
  const [head, ...rest] = route.split('.');
  const arg = rest.join('.');
  const fixed: Record<string, string> = {
    home: 'Home',
    brand: 'Per i brand',
    agenzie: 'Per le agenzie',
    piattaforma: 'Piattaforma',
    funzionalita: 'Funzionalità',
    'casi-studio': 'Casi studio',
    'diventa-creator': 'Per i creator',
    contatti: 'Contatti',
    libreria: 'Libreria row',
    privacy: 'Privacy',
    cookie: 'Cookie',
    termini: 'Termini',
    blog: 'Blog',
  };
  if (head === 'creator') return arg ? CREATORS_DB.find((c) => c.slug === arg)?.name ?? 'Creator' : 'Creator';
  if (head === 'nicchia') return `Creator ${NICHE_INFO[arg]?.name ?? ''}`;
  if (head === 'categoria') return BLOG_CATEGORIES[arg]?.name ?? 'Blog';
  if (head === 'articolo') return 'Articolo';
  return fixed[head] ?? 'Pagina';
}

type Phase = 'idle' | 'cover' | 'reveal';

export default function SiteApp() {
  const route = useRoute();
  const [shown, setShown] = useState(route);
  const [phase, setPhase] = useState<Phase>('idle');
  const reduce = useReducedMotion();

  // Nuova route → il sipario copre la pagina attuale
  useEffect(() => {
    if (route !== shown) setPhase('cover');
  }, [route]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.title = `${pageLabel(shown)} · influencee`;
  }, [shown]);

  // All'apertura la pagina parte sempre dall'alto: niente ripristino dello
  // scroll del browser o del visualizzatore (causava l'apertura sulle FAQ).
  useEffect(() => {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    } catch {
      /* ignorato */
    }
    const top = () => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    top();
    const t1 = setTimeout(top, 120);
    const t2 = setTimeout(top, 600);
    window.addEventListener('pageshow', top);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('pageshow', top);
    };
  }, []);

  const onDone = () => {
    if (phase === 'cover') {
      // a schermo coperto: cambio pagina e torno in cima senza scroll visibile
      setShown(route);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setPhase('reveal');
    } else if (phase === 'reveal') setPhase('idle');
  };

  const slide = { idle: { y: '100%' }, cover: { y: '0%' }, reveal: { y: '-100%' } };
  const fade = { idle: { opacity: 0 }, cover: { opacity: 1 }, reveal: { opacity: 0 } };

  return (
    <div className="min-h-screen bg-white font-sans text-ink antialiased">
      <SiteHeader route={shown} />
      <main key={shown}>
        <Page route={shown} />
      </main>
      <Footer />
      <div className="h-20 lg:hidden" aria-hidden />

      {/* Barra CTA fissa su mobile: l'azione principale sempre a portata di pollice */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="flex gap-2">
          <a href="#contatti" className="flex h-12 flex-1 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white">
            Richiedi una demo
          </a>
          <a href="#creator" className="flex h-12 items-center justify-center rounded-full bg-paper px-5 text-[15px] font-semibold text-ink">
            Creator
          </a>
        </div>
      </div>

      {/* Sipario di cambio pagina */}
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
          <p className="font-heading text-4xl font-semibold tracking-[-0.035em] text-white sm:text-6xl">{pageLabel(route)}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
