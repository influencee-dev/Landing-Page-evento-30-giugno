import { siFacebook, siInstagram, siTelegram, siTiktok, siTwitch, siYoutube } from 'simple-icons';
import type { PlatformId } from '../../data/types';

const ICONS: Record<PlatformId, { path: string; hex: string; title: string }> = {
  youtube: siYoutube,
  tiktok: siTiktok,
  instagram: siInstagram,
  facebook: siFacebook,
  twitch: siTwitch,
  telegram: siTelegram,
};

/** Colore d'accento per piattaforma, calibrato per restare leggibile sul blu notte. */
export const PLATFORM_ACCENT: Record<PlatformId, string> = {
  youtube: '#FF4E45',
  tiktok: '#5EF2EC',
  instagram: '#FF5FA2',
  facebook: '#4D8DFF',
  twitch: '#A77BFF',
  telegram: '#4FC3F7',
};

type Props = { id: PlatformId; className?: string; colored?: boolean; title?: string };

export function PlatformIcon({ id, className = 'h-5 w-5', colored = false, title }: Props) {
  const icon = ICONS[id];
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={colored ? PLATFORM_ACCENT[id] : 'currentColor'}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d={icon.path} />
    </svg>
  );
}
