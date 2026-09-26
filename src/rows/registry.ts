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
];
