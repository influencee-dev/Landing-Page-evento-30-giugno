import { footer, nav, site } from '../../data/content';
import { ExternalArrow } from '../ui/Icons';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-cantina pb-28 pt-20 text-[#cfc6b8] md:pb-12 lg:pt-24">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo variant="white" className="h-24 opacity-95 lg:h-28" />
            <p className="t-label mt-8 text-gold">{footer.title}</p>
            <p className="mt-4 max-w-sm font-serif text-lg italic leading-relaxed text-[#e8e1d4]">{footer.text}</p>
          </div>

          <nav aria-label="Sezioni" className="lg:col-span-3 lg:col-start-7">
            <p className="t-label text-gold">{footer.franchising}</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="t-label text-gold">{site.brand}</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <a
                  href={site.officialUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  {footer.officialSite} — {site.officialUrlLabel}
                  <ExternalArrow />
                  <span className="sr-only">(si apre in una nuova scheda)</span>
                </a>
              </li>
              <li>
                <a
                  href={site.privacyUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  {footer.privacy}
                  <ExternalArrow />
                  <span className="sr-only">(si apre in una nuova scheda)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/12 pt-8 text-xs tracking-wide text-[#a8a29a] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.company} · {site.vat}
          </p>
          <p>
            © {year} {site.brand}. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
