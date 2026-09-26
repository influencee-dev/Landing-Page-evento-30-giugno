import type React from 'react';
import HeroBoldPill from './HeroBoldPill';
import HeroVideo from './HeroVideo';
import HeroStoryCards from './HeroStoryCards';
import TeamCards from './TeamCards';
import HeroSplitPortrait from './HeroSplitPortrait';
import TestimonialDark from './TestimonialDark';
import HeroPhoneNotifications from './HeroPhoneNotifications';
import TeamBento from './TeamBento';
import HeroProductShowcase from './HeroProductShowcase';
import HeroFanCards from './HeroFanCards';
import HeroPhoneWidgets from './HeroPhoneWidgets';
import HeroUGC from './HeroUGC';
import MediaTrio from './MediaTrio';
import ProjectsBento from './ProjectsBento';
import StatVideo from './StatVideo';
import IndustryPills from './IndustryPills';
import TestimonialCarousel from './TestimonialCarousel';
import CaseCards from './CaseCards';
import AboutValues from './AboutValues';
import TeamZigzag from './TeamZigzag';
import CaseStudyFeature from './CaseStudyFeature';
import ProcessSteps from './ProcessSteps';
import StatsBento from './StatsBento';
import HeroCalendar from './HeroCalendar';
import ServicesAccordion from './ServicesAccordion';
import ResultsList from './ResultsList';
import HeroImpacta from './HeroImpacta';
import FeatureCardsUI from './FeatureCardsUI';
import HeroDashboard from './HeroDashboard';
import VelocityCarousel from './VelocityCarousel';
import FluidVideoCarousel from './FluidVideoCarousel';
import EditorialVideoStack from './EditorialVideoStack';
import TestimonialSwipe from './TestimonialSwipe';
import CustomerStorywell from './CustomerStorywell';
import { BenefitsGrid, StepsHighlight, LogoGrid, FaqAccordion, FeatureRows, Newsletter, Comparison } from './CelestBlocks';

export interface RowEntry {
  id: string;
  num: string;
  name: string;
  ref: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  props?: Record<string, unknown>;
}

/** Catalogo di tutte le row. L'ordine qui è l'ordine della gallery. */
export const ROWS: RowEntry[] = [
  { id: 'hero-bold-pill', num: '01', name: 'Hero bold + pillola', ref: 'AdCrew', Component: HeroBoldPill },
  { id: 'hero-video-dark', num: '02a', name: 'Hero VSL · dark', ref: 'SaaS Growth', Component: HeroVideo, props: { theme: 'dark' } },
  { id: 'hero-video-light', num: '02b', name: 'Hero VSL · light', ref: 'Meta Ads VSL', Component: HeroVideo, props: { theme: 'light' } },
  { id: 'hero-story-cards', num: '03', name: 'Hero story cards', ref: 'Sociwave', Component: HeroStoryCards },
  { id: 'team-cards', num: '04', name: 'Team a card', ref: 'Sociwave', Component: TeamCards },
  { id: 'hero-split-portrait', num: '05', name: 'Hero split ritratto', ref: 'Digiket', Component: HeroSplitPortrait },
  { id: 'testimonial-dark', num: '06', name: 'Testimonianze dark', ref: 'Digiket', Component: TestimonialDark },
  { id: 'hero-phone-notifications', num: '07', name: 'Hero telefono notifiche', ref: 'AdScale', Component: HeroPhoneNotifications },
  { id: 'team-bento', num: '08', name: 'Team bento', ref: 'AdScale', Component: TeamBento },
  { id: 'hero-product-showcase', num: '09', name: 'Hero + showcase prodotto', ref: 'Machina', Component: HeroProductShowcase },
  { id: 'hero-fan-signal', num: '10a', name: 'Hero card a ventaglio · signal', ref: 'Signal', Component: HeroFanCards, props: { variant: 'signal' } },
  { id: 'hero-fan-looped', num: '10b', name: 'Hero card a ventaglio · looped', ref: 'Looped', Component: HeroFanCards, props: { variant: 'looped' } },
  { id: 'hero-phone-widgets', num: '11', name: 'Hero telefono + widget', ref: 'Performance verde', Component: HeroPhoneWidgets },
  { id: 'hero-ugc', num: '12', name: 'Hero UGC 3 colonne', ref: 'Shinta', Component: HeroUGC },
  { id: 'media-trio', num: '13', name: 'Storytelling 3 media', ref: 'Bima', Component: MediaTrio },
  { id: 'projects-bento', num: '14', name: 'Progetti bento', ref: 'Shinta', Component: ProjectsBento },
  { id: 'stat-video', num: '15', name: 'Video UGC + stat', ref: 'Shinta', Component: StatVideo },
  { id: 'industry-pills', num: '16', name: 'Settori a pillole', ref: 'Industry expertise', Component: IndustryPills },
  { id: 'testimonial-carousel', num: '17', name: 'Carosello testimonianze', ref: 'Knowing your name', Component: TestimonialCarousel },
  { id: 'case-cards', num: '18', name: 'Casi studio a card', ref: 'Solutions drive success', Component: CaseCards },
  { id: 'about-values', num: '19', name: 'About / valori + stat', ref: 'Flexio', Component: AboutValues },
  { id: 'team-zigzag', num: '20', name: 'Team zig-zag', ref: 'Looped', Component: TeamZigzag },
  { id: 'case-study-feature', num: '21', name: 'Case study in evidenza', ref: 'Kyan', Component: CaseStudyFeature },
  { id: 'process-steps', num: '22', name: 'Processo 3 step dark', ref: 'How it works', Component: ProcessSteps },
  { id: 'stats-bento', num: '23', name: 'Mission + bento numeri', ref: 'Funnelz', Component: StatsBento },
  { id: 'hero-calendar', num: '24', name: 'Hero calendario', ref: 'Funnelz', Component: HeroCalendar },
  { id: 'services-accordion', num: '25', name: 'Servizi accordion dark', ref: 'Funnelz', Component: ServicesAccordion },
  { id: 'results-list', num: '26', name: 'Risultati con contatori', ref: 'Impacta', Component: ResultsList },
  { id: 'hero-impacta-marquee', num: '27a', name: 'Hero Impacta · marquee', ref: 'Impacta', Component: HeroImpacta, props: { variant: 'marquee' } },
  { id: 'hero-impacta-work', num: '27b', name: 'Hero Impacta · lavori', ref: 'Impacta', Component: HeroImpacta, props: { variant: 'work' } },
  { id: 'hero-impacta-contact', num: '27c', name: 'Hero Impacta · contatti', ref: 'Impacta', Component: HeroImpacta, props: { variant: 'contact' } },
  { id: 'feature-cards-ui', num: '28', name: 'Feature con mini-UI', ref: 'Alytics', Component: FeatureCardsUI },
  { id: 'hero-dashboard', num: '29', name: 'Hero + dashboard', ref: 'Alytics', Component: HeroDashboard },
  { id: 'velocity-carousel', num: '30', name: 'Velocity Carousel', ref: 'Framer', Component: VelocityCarousel },
  { id: 'fluid-video-carousel', num: '31', name: 'Fluid Video Carousel', ref: 'Framer', Component: FluidVideoCarousel, props: { monochrome: true } },
  { id: 'editorial-video-stack', num: '32', name: 'Editorial Video Card', ref: 'Framer', Component: EditorialVideoStack },
  { id: 'testimonial-swipe', num: '33', name: 'Testimonial Swipe', ref: 'Framer', Component: TestimonialSwipe },
  { id: 'customer-storywell', num: '34', name: 'Customer Storywell', ref: 'Framer', Component: CustomerStorywell },
  { id: 'benefits-grid', num: '35', name: 'Griglia vantaggi', ref: 'Celest', Component: BenefitsGrid },
  { id: 'steps-highlight', num: '36', name: 'Step con card evidenziata', ref: 'Celest', Component: StepsHighlight },
  { id: 'logo-grid', num: '37', name: 'Griglia strumenti/loghi', ref: 'Celest', Component: LogoGrid },
  { id: 'faq', num: '38', name: 'FAQ accordion', ref: 'Celest', Component: FaqAccordion },
  { id: 'feature-rows', num: '39', name: 'Feature alternate', ref: 'Celest', Component: FeatureRows },
  { id: 'newsletter', num: '40', name: 'Newsletter / waitlist', ref: 'Celest', Component: Newsletter },
  { id: 'comparison', num: '41', name: 'Vecchio metodo vs nuovo', ref: 'Celest', Component: Comparison },
];
