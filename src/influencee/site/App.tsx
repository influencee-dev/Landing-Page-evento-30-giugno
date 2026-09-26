import React from 'react';
import { Footer } from '../rows/footer';
import { NotFound, SiteHeader, useRoute } from './shell';
import { AgenciesPage, BrandPage, CasesPage, ContactPage, CreatorJoinPage, HomePage, LegalPage, LibraryPage, PlatformPage } from './pages';
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

export default function SiteApp() {
  const route = useRoute();
  return (
    <div className="min-h-screen bg-canvas pb-3 font-sans text-ink antialiased">
      <SiteHeader route={route} />
      <main key={route}>
        <Page route={route} />
      </main>
      <Footer />
    </div>
  );
}
