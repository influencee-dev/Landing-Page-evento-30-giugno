import { ArrowUpRight } from 'lucide-react';
import { useCallback } from 'react';
import type { CreatorData, Metric, Platform } from '../data/types';
import { formatDate, formatNumber, hasValue, platformsWithData, platformsWithoutData } from '../lib/format';
import { CountUp } from './ui/CountUp';
import { PLATFORM_ACCENT, PlatformIcon } from './ui/PlatformIcon';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';
import { onSpotlightMove } from './ui/useSpotlight';

const fmtApprox = (n: number) => formatNumber(n, true);
const fmtExact = (n: number) => formatNumber(n);

export function Stats({ creator }: { creator: CreatorData }) {
  const withData = platformsWithData(creator);
  const withoutData = platformsWithoutData(creator);
  const aggregates = creator.aggregateMetrics.filter(hasValue);
  const listFullWidth = withData.length + aggregates.length !== 1;
  const anyApprox = withData.some((p) => p.metrics.some((m) => hasValue(m) && m.approximate));

  return (
    <section id="numeri" aria-labelledby="numeri-title" className="section">
      <div className="container-x">
        <SectionHeader
          id="numeri-title"
          index="02"
          label="Social reach"
          title={
            <>
              Il mio universo, <span className="glow-text">in numeri.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {withData.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className={i === 0 ? 'md:col-span-2' : ''}>
              <PlatformCard platform={p} featured={i === 0} />
            </Reveal>
          ))}
          {aggregates.map((m, i) => (
            <Reveal key={m.label} delay={(withData.length + i) * 0.08}>
              <AggregateCard metric={m} />
            </Reveal>
          ))}

          {withoutData.length > 0 && (
            <Reveal delay={0.16} className={listFullWidth ? 'md:col-span-2 lg:col-span-3' : ''}>
              <div className="card h-full p-6 sm:p-7">
                <p className="eyebrow text-muted">Presente anche su</p>
                <ul className={`mt-5 grid gap-2.5 ${listFullWidth ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-1'}`}>
                  {withoutData.map((p) => (
                    <li key={p.id}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-line/60 bg-deep/50 px-4 py-3 transition hover:border-cyan/50"
                      >
                        <PlatformIcon id={p.id} colored className="h-4.5 w-4.5 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink">{p.label}</span>
                          <span className="block truncate text-xs text-muted">{p.handle}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" aria-hidden="true" />
                        <span className="sr-only">(si apre in una nuova scheda)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted/80">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan/70" aria-hidden="true" />
            Dati aggiornati al <time dateTime={creator.metricsUpdatedAt}>{formatDate(creator.metricsUpdatedAt)}</time>
            <span aria-hidden="true">·</span> {creator.metricsSource}
            {anyApprox && (
              <>
                <span aria-hidden="true">·</span> I valori con ≈ sono arrotondati come mostrati dalla piattaforma.
              </>
            )}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PlatformCard({ platform, featured }: { platform: Platform; featured: boolean }) {
  const metrics = platform.metrics.filter(hasValue);
  const [main, ...rest] = [...metrics].sort((a, b) => Number(!!b.primary) - Number(!!a.primary));
  const accent = PLATFORM_ACCENT[platform.id];

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={onSpotlightMove}
      className="card card-hover spotlight hud group flex h-full flex-col overflow-hidden p-7 sm:p-9"
    >
      {featured && (
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-[0.16] blur-3xl" style={{ background: accent }} />
      )}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line/70 bg-deep/70">
            <PlatformIcon id={platform.id} colored className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-base font-semibold tracking-wide text-ink">{platform.label}</span>
            <span className="block text-xs text-muted">{platform.handle}</span>
          </span>
        </span>
        <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" aria-hidden="true" />
      </div>

      <div className={`mt-auto grid gap-8 pt-12 ${featured && rest.length ? 'sm:grid-cols-[1.4fr_1fr] sm:items-end' : ''}`}>
        {main && (
          <div>
            <p className={`display text-ink ${featured ? 'text-[clamp(4rem,10vw,7.5rem)]' : 'text-6xl'}`}>
              {main.approximate && <span className="mr-1 align-top text-[0.4em] text-cyan" aria-hidden="true">≈</span>}
              <CountUp value={main.value} format={main.approximate ? fmtApprox : fmtExact} />
            </p>
            <p className="mt-3 text-sm tracking-wide text-muted uppercase">{main.label}</p>
          </div>
        )}
        {rest.length > 0 && (
          <dl className="grid gap-5 border-t border-line/60 pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
            {rest.map((m) => (
              <div key={m.label}>
                <dt className="text-xs tracking-wide text-muted uppercase">{m.label}</dt>
                <dd className="mt-1 font-display text-3xl font-bold text-ink">
                  {m.approximate && <span className="mr-1 text-lg text-cyan" aria-hidden="true">≈</span>}
                  <CountUp value={m.value!} format={m.approximate ? fmtApprox : fmtExact} />
                  {m.unit}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <span className="sr-only">Apri il profilo {platform.label} in una nuova scheda</span>
    </a>
  );
}

function AggregateCard({ metric }: { metric: Metric & { value: number } }) {
  const fmt = useCallback(
    (n: number) => (metric.unit === '%' ? n.toLocaleString('it-IT', { maximumFractionDigits: 1 }) : formatNumber(n, metric.approximate)),
    [metric.unit, metric.approximate],
  );
  return (
    <div className="card card-hover hud flex h-full flex-col justify-end p-7 sm:p-9">
      <p className="display text-6xl text-ink">
        {metric.approximate && <span className="mr-1 align-top text-[0.4em] text-cyan" aria-hidden="true">≈</span>}
        <CountUp value={metric.value} format={fmt} />
        {metric.unit && <span className="text-cyan">{metric.unit}</span>}
      </p>
      <p className="mt-3 text-sm tracking-wide text-muted uppercase">{metric.label}</p>
    </div>
  );
}
