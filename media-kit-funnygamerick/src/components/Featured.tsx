import { Play } from 'lucide-react';
import type { CreatorData, FeaturedItem } from '../data/types';
import { thumbnailFor, validFeatured } from '../lib/format';
import { PlatformIcon } from './ui/PlatformIcon';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';

const PLATFORM_LABEL: Record<FeaturedItem['platform'], string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  twitch: 'Twitch',
};

/** Sezione "Press play": viene renderizzata solo se ci sono video configurati (vedi App). */
export function Featured({ creator }: { creator: CreatorData }) {
  const items = validFeatured(creator).slice(0, 4);
  if (!items.length) return null;
  const [main, ...rest] = items;

  return (
    <section id="video" aria-labelledby="video-title" className="section">
      <div className="container-x">
        <SectionHeader
          id="video-title"
          index="08"
          label="Featured content"
          title={
            <>
              Press <span className="glow-text">play.</span>
            </>
          }
        />
        <div className={`mt-14 grid gap-5 ${rest.length ? 'lg:grid-cols-[1.6fr_1fr]' : ''}`}>
          <Reveal>
            <VideoCard item={main} large />
          </Reveal>
          {rest.length > 0 && (
            <ul className="grid gap-5">
              {rest.map((item, i) => (
                <Reveal as="li" key={item.url} delay={0.1 + i * 0.08}>
                  <VideoCard item={item} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ item, large = false }: { item: FeaturedItem; large?: boolean }) {
  const thumb = thumbnailFor(item);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card card-hover group flex h-full overflow-hidden ${large ? 'flex-col' : 'flex-row items-stretch'}`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-deep ${large ? 'aspect-video w-full' : 'aspect-video w-2/5'}`}>
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div aria-hidden="true" className="bg-grid absolute inset-0" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
        <span
          aria-hidden="true"
          className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan text-night shadow-[0_0_40px_-5px_rgba(53,217,255,0.8)] transition group-hover:scale-110 ${
            large ? 'h-16 w-16' : 'h-10 w-10'
          }`}
        >
          <Play className={large ? 'h-6 w-6 translate-x-0.5' : 'h-4 w-4 translate-x-px'} fill="currentColor" />
        </span>
      </div>
      <div className={`flex flex-col justify-center ${large ? 'p-7' : 'p-5'}`}>
        <span className="flex items-center gap-2 text-xs text-muted">
          <PlatformIcon id={item.platform} colored className="h-3.5 w-3.5" />
          {PLATFORM_LABEL[item.platform]}
          {item.meta && <span aria-hidden="true">·</span>}
          {item.meta}
        </span>
        <h3 className={`mt-2 font-display font-semibold tracking-wide text-ink ${large ? 'text-2xl' : 'text-base leading-snug'}`}>
          {item.title}
        </h3>
        <span className="sr-only">Apri il contenuto su {PLATFORM_LABEL[item.platform]} in una nuova scheda</span>
      </div>
    </a>
  );
}
