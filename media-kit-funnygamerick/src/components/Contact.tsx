import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CreatorData } from '../data/types';
import { contactHref } from '../lib/format';
import { PlatformIcon } from './ui/PlatformIcon';
import { Reveal } from './ui/Reveal';
import { WaveField } from './ui/WaveField';

export function Contact({ creator }: { creator: CreatorData }) {
  const { email } = creator.contact;
  const href = contactHref(creator);

  return (
    <section id="contatti" aria-labelledby="contatti-title" className="relative isolate overflow-hidden py-28 sm:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-night via-deep to-night" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,rgba(17,101,163,0.45),transparent_70%)]" />
        <div className="bg-grid absolute inset-0 opacity-50" />
        <WaveField variant="soft" lines={28} className="opacity-45" />
      </div>

      <div className="container-x text-center">
        <Reveal>
          <p className="eyebrow">Contatti</p>
          <h2 id="contatti-title" className="display mx-auto mt-6 max-w-5xl text-[clamp(3rem,10vw,8rem)]">
            Ready to <span className="glow-text">level up?</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Hai un progetto, un prodotto o una campagna in mente? Costruiamo insieme qualcosa che lasci il segno.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={href}
              {...(email ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="btn btn-primary group min-h-14 px-6 text-xs tracking-[0.08em] sm:px-8 sm:text-sm sm:tracking-[0.12em]"
            >
              {email ? <Mail className="h-4.5 w-4.5" aria-hidden="true" /> : null}
              Proponi una collaborazione
              <ArrowUpRight className="h-4.5 w-4.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              {!email && <span className="sr-only">({creator.contact.fallbackLabel}, si apre in una nuova scheda)</span>}
            </a>
            {email && <CopyEmail email={email} />}
          </div>
          {!email && creator.contact.fallbackNote && <p className="mt-4 text-sm text-muted">{creator.contact.fallbackNote}</p>}
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3" aria-label="Profili social">
            {creator.platforms.map((p) => (
              <li key={p.id}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 items-center gap-2.5 rounded-full border border-line bg-night/60 px-4 text-sm text-muted backdrop-blur transition hover:border-cyan/60 hover:text-ink"
                >
                  <PlatformIcon id={p.id} className="h-4 w-4 transition group-hover:text-cyan" />
                  {p.label}
                  <span className="sr-only">(si apre in una nuova scheda)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback per browser senza Clipboard API (o contesti non sicuri).
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      if (!ok) return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button type="button" onClick={copy} className="btn btn-ghost min-h-14 normal-case tracking-normal">
      {copied ? <Check className="h-4 w-4 text-cyan" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span className="font-sans text-sm font-medium">{copied ? 'Email copiata' : email}</span>
      <span className="sr-only">{copied ? '' : ' — copia indirizzo email'}</span>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Indirizzo email copiato negli appunti' : ''}
      </span>
    </button>
  );
}
