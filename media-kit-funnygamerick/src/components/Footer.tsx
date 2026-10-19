import type { CreatorData } from '../data/types';
import { PlatformIcon } from './ui/PlatformIcon';

export function Footer({ creator }: { creator: CreatorData }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/60 bg-night py-10">
      <div className="container-x flex flex-col items-center justify-between gap-6 text-sm text-muted md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="font-display text-lg font-bold tracking-wide text-ink">
            Funny<span className="text-cyan">Game</span>Rick
          </span>
          <span className="text-xs">
            © {year} {creator.realName} · {creator.name}. Tutti i diritti riservati.
          </span>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-1" aria-label="Social">
          {creator.platforms.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-surface hover:text-cyan"
              >
                <PlatformIcon id={p.id} className="h-4 w-4" />
                <span className="sr-only">{p.label} (si apre in una nuova scheda)</span>
              </a>
            </li>
          ))}
          {creator.contact.extraLinks.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 rounded-full px-3 py-2 text-xs tracking-wide uppercase transition hover:text-cyan"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
