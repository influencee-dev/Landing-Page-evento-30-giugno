import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { MobileStickyCta } from './components/layout/MobileStickyCta';
import { Advantages } from './components/sections/Advantages';
import { Audience } from './components/sections/Audience';
import { Contact } from './components/sections/Contact';
import { Format } from './components/sections/Format';
import { Hero } from './components/sections/Hero';
import { Journey } from './components/sections/Journey';
import { Opportunity } from './components/sections/Opportunity';
import { Products } from './components/sections/Products';
import { Story } from './components/sections/Story';
import { Support } from './components/sections/Support';
import { useRevealObserver } from './hooks/useRevealObserver';

export default function App() {
  useRevealObserver();

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Story />
        <Format />
        <Advantages />
        <Products />
        <Opportunity />
        <Support />
        <Audience />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
