import React from 'react';
import { Container, GAP, Section, SectionHeader, type Tone } from '../ds';
import { CASES, CREATORS, CTA, TESTIMONIALS } from '../content';
import VelocityCarouselBase from '../../rows/VelocityCarousel';
import FluidVideoCarouselBase from '../../rows/FluidVideoCarousel';
import EditorialVideoStackBase from '../../rows/EditorialVideoStack';
import TestimonialSwipeBase from '../../rows/TestimonialSwipe';
import CustomerStorywellBase from '../../rows/CustomerStorywell';

/* I componenti interattivi riusano la logica della libreria di reference
   in modalità `embedded`, con colori, raggi e font presi dai token. */

const HEADINGS = '[&_h3]:font-heading [&_h3]:tracking-[-0.02em]';
const BRAND_HEX = '#6c3cff';
const INK_HEX = '#0e0e14';

interface Head {
  tone?: Tone;
  eyebrow?: string;
  title?: string;
  lead?: string;
}

/* ─── 30 · Velocity Carousel ────────────────────────────────────── */
export function VelocityCarousel({ tone = 'paper', eyebrow = 'Portfolio', title = 'Campagne che\n*catturano l’attenzione*', lead = 'Scorri, trascina o usa le frecce: ogni card è una campagna reale.' }: Head) {
  const slides = [...CASES, ...CASES.slice(0, 2)].map((c) => ({ image: c.image, title: c.tag, text: c.title, cta: { label: 'Scopri', href: CTA.cases.href } }));
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
      </Container>
      <div className={`${GAP.header} ${HEADINGS}`}>
        <VelocityCarouselBase embedded slides={slides} radius={32} borderWidth={5} indicatorColor={INK_HEX} overlayColor={INK_HEX} overlayOpacity={0.35} shadow={0.7} />
      </div>
    </Section>
  );
}

/* ─── 31 · Fluid Video Carousel ─────────────────────────────────── */
export function FluidCarousel({ tone = 'white', eyebrow = 'Creator', title = 'Contenuti in *movimento continuo*', lead = 'Trascina, usa la rotella o clicca per aprire. Passa sopra per dare colore.' }: Head) {
  const items = CREATORS.map((c, i) => ({ poster: c.cover, title: c.handle, tag: `${c.niche} · ${c.followers}`, height: [1.1, 0.8, 0.95, 1.2, 0.85, 1][i], width: [1, 1.1, 1.3, 0.9, 1, 0.95][i] }));
  return (
    <Section tone={tone} id="creator">
      <Container>
        <SectionHeader align="split" eyebrow={eyebrow} title={title} lead={lead} />
      </Container>
      <div className={GAP.header}>
        <FluidVideoCarouselBase embedded items={items} monochrome showModeToggle={false} radius={20} titleClass="font-heading font-semibold tracking-tight" />
      </div>
    </Section>
  );
}

/* ─── 32 · Editorial Video Card ─────────────────────────────────── */
export function EditorialStack({ tone = 'muted', eyebrow = 'Storie', title = 'Ogni creator,\n*una storia da raccontare*' }: Head) {
  const items = CREATORS.slice(0, 5).map((c, i) => ({ poster: c.cover, title: ['Un piatto, trenta secondi', 'Allenarsi senza scuse', 'La routine della sera', 'Weekend fuori porta', 'Il look del giorno'][i], text: `${c.name} racconta il brand con il suo stile, per la sua community di ${c.followers} follower.`, category: c.niche, year: '2026', cta: i === 2 ? { label: 'Vedi la campagna', href: CTA.cases.href } : undefined }));
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
      </Container>
      <div className={`${GAP.header} ${HEADINGS}`}>
        <EditorialVideoStackBase embedded items={items} radius={24} />
      </div>
    </Section>
  );
}

/* ─── 33 · Testimonial Swipe ────────────────────────────────────── */
export function TestimonialSwipe({ tone = 'brand', eyebrow = 'Storie di successo', title = 'Risultati che si\n*toccano con mano*' }: Head) {
  const stories = TESTIMONIALS.map((t) => ({ headline: t.headline, quote: t.quote, name: t.name, role: t.role, image: t.image, avatar: t.avatar }));
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className={`${GAP.header} text-ink [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:tracking-[-0.03em]`}>
          <TestimonialSwipeBase embedded stories={stories} accent={BRAND_HEX} panelBg="#ffffff" radius={20} />
        </div>
      </Container>
    </Section>
  );
}

/* ─── 34 · Customer Storywell ───────────────────────────────────── */
export function Storywell({ tone = 'paper', eyebrow = 'Storie dei clienti', title = 'Numeri veri,\n*persone vere*' }: Head) {
  const stories = TESTIMONIALS.map((t) => ({
    name: t.name,
    role: t.role,
    avatar: t.avatar,
    photo: t.image,
    logo: t.tag.toUpperCase(),
    metric: t.metric,
    metricSuffix: t.metricSuffix,
    metricDecimals: t.metricDecimals,
    metricLabel: t.metricLabel,
    quote: t.quote,
    tag: t.tag,
  }));
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className={`${GAP.header} text-ink`}>
          <CustomerStorywellBase embedded stories={stories} heading="Storie" accent={BRAND_HEX} quoteClass="font-accent" transition="iris" />
        </div>
      </Container>
    </Section>
  );
}
