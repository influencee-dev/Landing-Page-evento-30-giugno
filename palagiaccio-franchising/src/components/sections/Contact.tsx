import { contact, ctas } from '../../data/content';
import { startingInvestment } from '../../data/franchise';
import { stagger } from '../../lib/stagger';
import { ImageSlot } from '../ui/ImageSlot';
import { LeadForm } from '../ui/LeadForm';
import { ReviewFlag } from '../ui/ReviewFlag';
import { SectionLabel } from '../ui/SectionLabel';

export function Contact() {
  return (
    <section
      id={ctas.formAnchor}
      aria-labelledby="contatti-title"
      className="on-bordeaux relative bg-bordeaux-deep pb-[var(--space-section)] text-[#f1e7da]"
    >
      <ImageSlot
        image="finalCta"
        tone="dark"
        sizes="100vw"
        className="aspect-[4/3] w-full sm:aspect-[21/9] lg:aspect-[24/9]"
      />

      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="pt-14 lg:col-span-5 lg:pt-20">
            <div data-reveal>
              <SectionLabel>{contact.label}</SectionLabel>
            </div>
            <h2
              id="contatti-title"
              data-reveal
              style={stagger(1)}
              className="t-display mt-6 text-[clamp(2.25rem,1.7rem+2.6vw,4rem)] uppercase tracking-[0.01em] text-white"
            >
              {contact.title}
            </h2>
            <p data-reveal style={stagger(2)} className="t-kicker mt-6 text-gold-light">
              {contact.subtitle}
            </p>
            <p data-reveal style={stagger(3)} className="mt-7 leading-relaxed">
              {contact.text}
            </p>

            <div data-reveal style={stagger(4)} className="mt-10 border-y border-white/20 py-7">
              <p className="t-label text-gold-light">
                {contact.investmentLabel}
                <ReviewFlag show={startingInvestment.needsReview} note={startingInvestment.reviewNote} />
              </p>
              <p className="t-figure mt-2 text-[clamp(2.25rem,1.8rem+1.6vw,3.25rem)] text-white">
                {startingInvestment.value}
              </p>
            </div>

            <p data-reveal style={stagger(5)} className="mt-8 text-[0.9375rem] leading-relaxed text-[#e6d9c8]">
              {contact.invite}
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div
              data-reveal
              className="relative -mx-[var(--space-gutter)] bg-white px-[var(--space-gutter)] py-10 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] sm:mx-0 sm:px-10 sm:py-12 lg:-mt-40 lg:px-12 lg:py-14"
            >
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
