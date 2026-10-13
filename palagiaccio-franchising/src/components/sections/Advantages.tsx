import { advantages } from '../../data/content';
import { stagger } from '../../lib/stagger';
import { SectionLabel } from '../ui/SectionLabel';

export function Advantages() {
  return (
    <section aria-labelledby="vantaggi-title" className="on-dark section bg-cantina text-[#cfc6b8]">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div data-reveal>
                <SectionLabel>{advantages.label}</SectionLabel>
              </div>
              <h2 id="vantaggi-title" data-reveal style={stagger(1)} className="t-h2 mt-6 text-white">
                {advantages.title}
              </h2>
              <div data-reveal style={stagger(2)} className="mt-10 hidden h-px w-24 bg-gold lg:block" aria-hidden="true" />
            </div>
          </div>

          <ol className="grid gap-x-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {advantages.items.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={stagger(i % 2)}
                className="border-t border-white/15 pb-12 pt-7 sm:pb-14"
              >
                <span className="font-serif text-[2.5rem] leading-none text-gold" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="t-h4 mt-6 text-white">{item.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
