export type PlatformId = 'youtube' | 'tiktok' | 'instagram' | 'twitch' | 'facebook' | 'telegram';

export interface ImageAsset {
  src: string;
  srcSet?: string;
  alt: string;
  width: number;
  height: number;
}

export interface Metric {
  label: string;
  /** Intero. null = dato non disponibile (non viene mostrato). */
  value: number | null;
  /** Il valore è arrotondato (es. letto come "75,2K" sulla piattaforma). */
  approximate?: boolean;
  /** Metrica principale della piattaforma (es. iscritti / follower). */
  primary?: boolean;
  unit?: string;
}

export interface Platform {
  id: PlatformId;
  label: string;
  handle: string;
  url: string;
  metrics: Metric[];
  /** false = il canale compare solo tra i link social, non nella sezione numeri. */
  showInStats?: boolean;
}

export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: 'gamepad' | 'zap' | 'laugh' | 'sparkles';
  size: 'large' | 'tall' | 'regular';
}

export type PartnershipKind = 'creator-program' | 'game-access' | 'commercial' | 'affiliate';

export interface Partnership {
  name: string;
  kind: PartnershipKind;
  description: string;
  /** Percorso di un logo ufficiale utilizzabile, oppure null. */
  logo: string | null;
  highlight?: string;
}

export interface Datum {
  label: string;
  /** Percentuale 0–100. */
  value: number;
}

export interface AudienceData {
  source: string | null;
  ageRanges: Datum[];
  gender: Datum[];
  topCountries: Datum[];
  platformSplit: Datum[];
  /** Metriche di engagement già formattate, es. { label: 'Engagement rate YouTube', value: '6,2%' } */
  engagement: { label: string; value: string }[];
}

export interface CollaborationFormat {
  id: string;
  title: string;
  description: string;
  icon:
    | 'smartphone'
    | 'layers'
    | 'monitor-play'
    | 'package'
    | 'scan-search'
    | 'network'
    | 'map-pin';
}

export interface FeaturedItem {
  title: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitch';
  url: string;
  thumbnail?: string;
  meta?: string;
}

export interface CreatorData {
  name: string;
  realName: string;
  handle: string;
  claim: string;
  bannerTagline: string;
  heroEyebrow: string[];
  heroSubtitle: string;
  heroIntro: string;
  heroLabels: string[];
  images: {
    avatar: ImageAsset;
    banner: ImageAsset;
    aboutPhoto: ImageAsset | null;
  };
  highlights: { value: string; label: string }[];
  about: {
    paragraphs: string[];
    pillars: { title: string; description: string }[];
  };
  /** Data ISO (AAAA-MM-GG) dell'ultimo aggiornamento delle metriche. */
  metricsUpdatedAt: string;
  metricsSource: string;
  platforms: Platform[];
  aggregateMetrics: Metric[];
  contentPillars: ContentPillar[];
  partnerships: Partnership[];
  affiliatePrograms: { note: string; names: string[] } | null;
  audience: AudienceData;
  communityNote: string;
  collaborationFormats: CollaborationFormat[];
  collaborationNote: string;
  eventsNote: string;
  featuredContent: FeaturedItem[];
  contact: {
    email: string | null;
    fallbackUrl: string;
    fallbackLabel: string;
    /** Riga di testo sotto la CTA quando manca l'email. */
    fallbackNote?: string;
    emailSubject: string;
    extraLinks: { label: string; url: string }[];
  };
  seo: { title: string; description: string };
}
