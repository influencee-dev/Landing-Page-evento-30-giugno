import { MotionConfig } from 'motion/react';
import { useMemo } from 'react';
import { About } from './components/About';
import { Audience } from './components/Audience';
import { Contact } from './components/Contact';
import { ContentUniverse } from './components/ContentUniverse';
import { Featured } from './components/Featured';
import { Footer } from './components/Footer';
import { Formats } from './components/Formats';
import { Hero } from './components/Hero';
import { Navbar, type NavItem } from './components/Navbar';
import { Partnerships } from './components/Partnerships';
import { Stats } from './components/Stats';
import { creator } from './data/creator';
import { validFeatured } from './lib/format';

export default function App() {
  const hasFeatured = validFeatured(creator).length > 0;
  const hasPartnerships = creator.partnerships.length > 0;

  // Le voci di menu seguono le sezioni effettivamente presenti.
  const nav = useMemo<NavItem[]>(
    () =>
      [
        { id: 'numeri', label: 'Numeri' },
        { id: 'chi-sono', label: 'Chi sono' },
        { id: 'contenuti', label: 'Contenuti' },
        hasPartnerships && { id: 'partnership', label: 'Partnership' },
        { id: 'community', label: 'Community' },
        { id: 'collaborazioni', label: 'Collaborazioni' },
        hasFeatured && { id: 'video', label: 'Video' },
      ].filter(Boolean) as NavItem[],
    [hasFeatured, hasPartnerships],
  );

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-cyan px-5 py-3 font-display text-sm font-semibold text-night transition focus:translate-y-0"
      >
        Vai al contenuto
      </a>
      <Navbar creator={creator} items={nav} />
      <main id="main">
        <Hero creator={creator} />
        <Stats creator={creator} />
        <About creator={creator} />
        <ContentUniverse creator={creator} />
        {hasPartnerships && <Partnerships creator={creator} />}
        <Audience creator={creator} />
        <Formats creator={creator} />
        {hasFeatured && <Featured creator={creator} />}
        <Contact creator={creator} />
      </main>
      <Footer creator={creator} />
    </MotionConfig>
  );
}
