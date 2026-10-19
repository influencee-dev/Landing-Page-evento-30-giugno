import type { CreatorData, FeaturedItem, Metric, Platform } from '../data/types';

const compact = new Intl.NumberFormat('it-IT', { notation: 'compact', maximumFractionDigits: 1 });
const full = new Intl.NumberFormat('it-IT');

/**
 * 75200 → "75,2K". Sotto i 10.000 il numero è scritto per esteso ("6.412"),
 * tranne se `approximate`: un dato arrotondato resta in forma breve ("6,6K") per non suggerire precisione.
 */
export function formatNumber(value: number, approximate = false): string {
  const v = Math.round(value);
  if (Math.abs(v) < 1000 || (!approximate && Math.abs(v) < 10000)) return full.format(v);
  value = v;
  // Intl it-IT usa "Mln"/"Mrd" e nessun suffisso per le migliaia: lo uniformiamo allo stile social.
  if (Math.abs(value) < 1_000_000) {
    return `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(value / 1000)}K`;
  }
  return compact.format(value).replace(/\s?Mln/, 'M');
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export const hasValue = (m: Metric): m is Metric & { value: number } =>
  typeof m.value === 'number' && Number.isFinite(m.value) && m.value > 0;

export const primaryMetric = (p: Platform) => p.metrics.find((m) => m.primary) ?? p.metrics[0];

/** Piattaforme con almeno un numero reale. */
export const platformsWithData = (c: CreatorData) =>
  c.platforms.filter((p) => p.showInStats !== false && p.metrics.some(hasValue));

/** Piattaforme attive ma senza numeri ancora forniti: mostrate come presenza, senza cifre. */
export const platformsWithoutData = (c: CreatorData) =>
  c.platforms.filter((p) => p.showInStats !== false && !p.metrics.some(hasValue));

export const hasAudienceData = (c: CreatorData) => {
  const a = c.audience;
  return (
    a.ageRanges.length + a.gender.length + a.topCountries.length + a.platformSplit.length + a.engagement.length > 0
  );
};

const isHttpUrl = (u: string) => /^https?:\/\//i.test(u);
export const validFeatured = (c: CreatorData) => c.featuredContent.filter((f) => isHttpUrl(f.url) && f.title.trim());

/** Ricava l'ID di un video YouTube per costruire la miniatura in automatico. */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/live\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function thumbnailFor(item: FeaturedItem): string | null {
  if (item.thumbnail) return item.thumbnail;
  if (item.platform === 'youtube') {
    const id = youtubeId(item.url);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
}

export const contactHref = (c: CreatorData) =>
  c.contact.email
    ? `mailto:${c.contact.email}?subject=${encodeURIComponent(c.contact.emailSubject)}`
    : c.contact.fallbackUrl;

/** Elenco dei dati ancora da fornire: stampato in console solo in sviluppo. */
export function missingData(c: CreatorData): string[] {
  const out: string[] = [];
  if (!c.contact.email) out.push('contact.email (email professionale)');
  c.platforms.forEach((p) =>
    p.metrics.filter((m) => !hasValue(m)).forEach((m) => out.push(`${p.label}: ${m.label}`)),
  );
  c.aggregateMetrics.filter((m) => !hasValue(m)).forEach((m) => out.push(m.label));
  if (!hasAudienceData(c)) out.push('audience (età, genere, paesi, piattaforme, engagement)');
  if (!c.featuredContent.length) out.push('featuredContent (video in evidenza)');
  if (!c.images.aboutPhoto) out.push('images.aboutPhoto (foto reale per "Dietro il controller")');
  c.partnerships.filter((p) => !p.logo).forEach((p) => out.push(`Logo: ${p.name}`));
  return out;
}
