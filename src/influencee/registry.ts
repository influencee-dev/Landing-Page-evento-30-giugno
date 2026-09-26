import type React from 'react';
import { HeroPill, HeroVideo, HeroStories, HeroPortrait, HeroNotifications, HeroShowcase } from './rows/heroes-a';
import { HeroFan, HeroWidgets, HeroUGC, HeroCalendar, HeroCentered, HeroDashboard } from './rows/heroes-b';
import { TeamCards, TeamBento, TeamZigzag } from './rows/team';
import { TestimonialFeature, TestimonialCarousel, StatsBento, ResultsList } from './rows/proof';
import { MediaTrio, ProjectsBento, StatVideo, CaseCards, CaseStudyFeature } from './rows/work';
import { NichePills, AboutValues, ProcessSteps, ServicesAccordion, FeatureCardsUI } from './rows/services';
import { VelocityCarousel, FluidCarousel, EditorialStack, TestimonialSwipe, Storywell } from './rows/carousels';
import { BenefitsGrid, StepsHighlight, PlatformsGrid, Faq, FeatureRows, Newsletter, Comparison } from './rows/saas';
import { CtaBand, Footer } from './rows/footer';
import { FeaturedCreators, CreatorExplorer } from './site/creators';
import { LatestArticles } from './site/blog';
import { PlatformTour } from './site/platform';
import { PageHero } from './site/shell';
import { HeroHome, HeroReels, ReelWall, ReelsStrip } from './rows/reels';

export type Family = 'Hero' | 'Reel' | 'Team' | 'Social proof' | 'Lavori' | 'Servizi' | 'Interattivi' | 'Piattaforma' | 'Sito' | 'Chiusura';

export interface Row {
  id: string;
  num: string;
  name: string;
  family: Family;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  props?: Record<string, unknown>;
}

/** Catalogo completo delle row Influencee (stessa numerazione della libreria di reference). */
export const ROWS: Row[] = [
  { id: 'hero-pill', num: '01', name: 'Hero titolo + pillola', family: 'Hero', Component: HeroPill },
  { id: 'hero-video-dark', num: '02a', name: 'Hero video · scuro', family: 'Hero', Component: HeroVideo },
  { id: 'hero-video-light', num: '02b', name: 'Hero video · chiaro', family: 'Hero', Component: HeroVideo, props: { tone: 'white' } },
  { id: 'hero-stories', num: '03', name: 'Hero story card', family: 'Hero', Component: HeroStories },
  { id: 'team-cards', num: '04', name: 'Team a card', family: 'Team', Component: TeamCards },
  { id: 'hero-portrait', num: '05', name: 'Hero split ritratto', family: 'Hero', Component: HeroPortrait },
  { id: 'testimonial-feature', num: '06', name: 'Testimonianza scura', family: 'Social proof', Component: TestimonialFeature },
  { id: 'hero-notifications', num: '07', name: 'Hero telefono notifiche', family: 'Hero', Component: HeroNotifications },
  { id: 'team-bento', num: '08', name: 'Team bento', family: 'Team', Component: TeamBento },
  { id: 'hero-showcase', num: '09', name: 'Hero + piattaforma', family: 'Hero', Component: HeroShowcase },
  { id: 'hero-fan-stories', num: '10a', name: 'Hero ventaglio · stories', family: 'Hero', Component: HeroFan, props: { variant: 'stories' } },
  { id: 'hero-fan-posts', num: '10b', name: 'Hero ventaglio · post', family: 'Hero', Component: HeroFan, props: { variant: 'posts' } },
  { id: 'hero-widgets', num: '11', name: 'Hero telefono + widget', family: 'Hero', Component: HeroWidgets },
  { id: 'hero-ugc', num: '12', name: 'Hero UGC 3 colonne', family: 'Hero', Component: HeroUGC },
  { id: 'media-trio', num: '13', name: 'Storytelling 3 media', family: 'Lavori', Component: MediaTrio },
  { id: 'projects-bento', num: '14', name: 'Progetti bento', family: 'Lavori', Component: ProjectsBento },
  { id: 'stat-video', num: '15', name: 'Video UGC + stat', family: 'Lavori', Component: StatVideo },
  { id: 'niche-pills', num: '16', name: 'Nicchie a pillole', family: 'Servizi', Component: NichePills },
  { id: 'testimonial-carousel', num: '17', name: 'Carosello testimonianze', family: 'Social proof', Component: TestimonialCarousel },
  { id: 'case-cards', num: '18', name: 'Casi studio a card', family: 'Lavori', Component: CaseCards },
  { id: 'about-values', num: '19', name: 'About / valori', family: 'Servizi', Component: AboutValues },
  { id: 'team-zigzag', num: '20', name: 'Team zig-zag', family: 'Team', Component: TeamZigzag },
  { id: 'case-study-feature', num: '21', name: 'Case study in evidenza', family: 'Lavori', Component: CaseStudyFeature },
  { id: 'process-steps', num: '22', name: 'Processo a step', family: 'Servizi', Component: ProcessSteps },
  { id: 'stats-bento', num: '23', name: 'Mission + numeri', family: 'Social proof', Component: StatsBento },
  { id: 'hero-calendar', num: '24', name: 'Hero calendario', family: 'Hero', Component: HeroCalendar },
  { id: 'services-accordion', num: '25', name: 'Servizi accordion', family: 'Servizi', Component: ServicesAccordion },
  { id: 'results-list', num: '26', name: 'Risultati con contatori', family: 'Social proof', Component: ResultsList },
  { id: 'hero-centered-marquee', num: '27a', name: 'Hero centrata · marquee', family: 'Hero', Component: HeroCentered, props: { variant: 'marquee' } },
  { id: 'hero-centered-work', num: '27b', name: 'Hero centrata · lavori', family: 'Hero', Component: HeroCentered, props: { variant: 'work' } },
  { id: 'hero-centered-contact', num: '27c', name: 'Hero centrata · contatti', family: 'Hero', Component: HeroCentered, props: { variant: 'contact' } },
  { id: 'feature-cards-ui', num: '28', name: 'Feature con mini-UI', family: 'Piattaforma', Component: FeatureCardsUI },
  { id: 'hero-dashboard', num: '29', name: 'Hero + dashboard', family: 'Hero', Component: HeroDashboard },
  { id: 'velocity-carousel', num: '30', name: 'Velocity Carousel', family: 'Interattivi', Component: VelocityCarousel },
  { id: 'fluid-carousel', num: '31', name: 'Fluid Carousel', family: 'Interattivi', Component: FluidCarousel },
  { id: 'editorial-stack', num: '32', name: 'Editorial Video Card', family: 'Interattivi', Component: EditorialStack },
  { id: 'testimonial-swipe', num: '33', name: 'Testimonial Swipe', family: 'Interattivi', Component: TestimonialSwipe },
  { id: 'storywell', num: '34', name: 'Customer Storywell', family: 'Interattivi', Component: Storywell },
  { id: 'benefits-grid', num: '35', name: 'Griglia vantaggi', family: 'Piattaforma', Component: BenefitsGrid },
  { id: 'steps-highlight', num: '36', name: 'Step con evidenza', family: 'Piattaforma', Component: StepsHighlight },
  { id: 'platforms-grid', num: '37', name: 'Griglia piattaforme', family: 'Piattaforma', Component: PlatformsGrid },
  { id: 'faq', num: '38', name: 'FAQ', family: 'Piattaforma', Component: Faq },
  { id: 'feature-rows', num: '39', name: 'Feature alternate', family: 'Piattaforma', Component: FeatureRows },
  { id: 'newsletter', num: '40', name: 'Newsletter', family: 'Chiusura', Component: Newsletter },
  { id: 'comparison', num: '41', name: 'Vecchio metodo vs nuovo', family: 'Piattaforma', Component: Comparison },
  { id: 'cta-band', num: '42', name: 'Fascia CTA finale', family: 'Chiusura', Component: CtaBand },
  { id: 'footer', num: '43', name: 'Footer', family: 'Chiusura', Component: Footer },
  { id: 'page-hero', num: '44', name: 'Hero pagina interna + breadcrumb', family: 'Sito', Component: PageHero, props: { crumbs: [{ label: 'Sezione', href: '#home' }, { label: 'Pagina' }], eyebrow: 'Pagina interna', title: 'Titolo della *pagina*', lead: 'Hero standard per tutte le pagine interne: breadcrumb, etichetta, titolo e testo.' } },
  { id: 'featured-creators', num: '45', name: 'Creator in evidenza', family: 'Sito', Component: FeaturedCreators },
  { id: 'creator-explorer', num: '46', name: 'Elenco creator con filtri', family: 'Sito', Component: CreatorExplorer },
  { id: 'platform-tour', num: '47', name: 'Tour piattaforma a schede', family: 'Sito', Component: PlatformTour },
  { id: 'latest-articles', num: '48', name: 'Ultimi articoli', family: 'Sito', Component: LatestArticles },
  { id: 'reels-strip', num: '49', name: 'Strip di reel', family: 'Reel', Component: ReelsStrip },
  { id: 'reel-wall', num: '50', name: 'Muro di reel + numeri', family: 'Reel', Component: ReelWall },
  { id: 'hero-reels', num: '51', name: 'Hero reel su nero (pagine creator)', family: 'Hero', Component: HeroReels },
  { id: 'hero-home', num: '52', name: 'Hero home: messaggio + reel + doppio ingresso', family: 'Hero', Component: HeroHome },
];

/** Numero di row distinte (le varianti 02a/02b ecc. contano come una). */
export const ROW_COUNT = new Set(ROWS.map((r) => r.num.replace(/[a-z]$/, ''))).size;
