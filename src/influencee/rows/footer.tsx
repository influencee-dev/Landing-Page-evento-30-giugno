import React from 'react';
import { Instagram, Linkedin, Music2 } from 'lucide-react';
import { Button, Container, Heading, Lead, Logo, Section, SocialProof, type Tone } from '../ds';
import { BRAND, CTA, NAV } from '../content';

/* ─── 42 · Fascia CTA finale ────────────────────────────────────── */
export function CtaBand({ tone = 'ink', title = 'Pronto a lavorare con\n*i creator giusti?*', lead = 'Raccontaci il tuo brand: in 48 ore ricevi una shortlist di creator e una proposta di campagna.' }: { tone?: Tone; title?: string; lead?: string }) {
  return (
    <Section tone={tone} id="contatti">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgba(108,60,255,0.45),transparent_70%)]" />
      <Container className="text-center">
        <Heading text={title} size="display" className="mx-auto max-w-4xl" />
        <Lead className="mx-auto mt-6 max-w-lg">{lead}</Lead>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={CTA.campaign.href}>{CTA.campaign.label}</Button>
          <Button href={CTA.creator.href} variant="secondary">
            {CTA.creator.label}
          </Button>
        </div>
        <SocialProof className="mt-8 justify-center" />
      </Container>
    </Section>
  );
}

/* ─── 43 · Footer ───────────────────────────────────────────────── */
export function Footer({ tone = 'white' }: { tone?: Tone }) {
  const cols = [
    { title: 'Soluzioni', links: NAV.slice(0, 4) },
    { title: 'Risorse', links: [{ label: 'Casi studio', href: '#casi' }, { label: 'FAQ', href: '#faq' }, { label: 'Newsletter', href: '#' }] },
    { title: 'Legale', links: [{ label: 'Privacy', href: '#' }, { label: 'Cookie', href: '#' }, { label: 'Termini', href: '#' }] },
  ];
  return (
    <Section tone={tone} pad="none" className="pb-3">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Logo />
          <Lead className="mt-4 max-w-xs !text-base">Il ponte tra brand e creator: selezione, campagne e risultati misurabili.</Lead>
          <div className="mt-6 flex gap-2">
            {[Instagram, Music2, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social" className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink transition hover:bg-brand hover:text-white">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mute">{c.title}</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="transition hover:text-brand">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-mute">
          <span>
            © {new Date().getFullYear()} {BRAND.domain} · Influencee SRL
          </span>
          <a href={`mailto:${BRAND.email}`} className="hover:text-ink">
            {BRAND.email}
          </a>
        </div>
      </Container>
    </Section>
  );
}
