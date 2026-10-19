import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import type { CreatorData } from '../data/types';
import { formatNumber, hasValue, primaryMetric } from '../lib/format';
import { PlatformIcon } from './ui/PlatformIcon';
import { WaveField } from './ui/WaveField';

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ creator }: { creator: CreatorData }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const yWaves = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);

  const yt = creator.platforms.find((p) => p.id === 'youtube');
  const ytMetric = yt ? primaryMetric(yt) : undefined;
  // "Non solo un gamer." → "Non solo" / "un gamer." : le prime due parole sulla prima riga.
  const words = creator.claim.replace(/\.$/, '').split(' ');
  const lines = [words.slice(0, 2), words.slice(2)].filter((l) => l.length);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-32 lg:min-h-[100svh] lg:pt-36 lg:pb-28">
      {/* Sfondo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_35%,rgba(17,101,163,0.38),transparent_70%),radial-gradient(ellipse_50%_40%_at_10%_90%,rgba(53,217,255,0.10),transparent_70%)]" />
        <div className="bg-grid absolute inset-0 opacity-60" />
        <motion.div
          style={{ y: yWaves }}
          className="absolute inset-0 opacity-70 [mask-image:linear-gradient(to_right,transparent_30%,#000_75%)] max-lg:[mask-image:linear-gradient(to_bottom,#000_20%,transparent_45%)]"
        >
          <WaveField />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {/* Testo */}
        <div className="relative z-10 order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan-bright" aria-hidden="true" />
            {creator.heroEyebrow.map((w, i) => (
              <span key={w} className="flex items-center gap-3">
                {i > 0 && <span className="text-line" aria-hidden="true">•</span>}
                {w}
              </span>
            ))}
          </motion.p>

          <h1 id="hero-title" className="display mt-7 text-[clamp(3rem,11.5vw,7.25rem)]">
            <span className="sr-only">{creator.claim}</span>
            {lines.map((line, li) => (
              <span key={li} aria-hidden="true" className="block whitespace-nowrap">
                {line.map((w, wi) => {
                  const i = li * 2 + wi;
                  const last = i === words.length - 1;
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: '0.6em', filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.9, delay: 0.12 + i * 0.09, ease }}
                      className={`inline-block ${wi < line.length - 1 ? 'mr-[0.22em]' : ''} ${last ? 'glow-text' : 'text-ink'}`}
                    >
                      {w}
                      {last && <span className="text-cyan-bright">.</span>}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            className="mt-7 max-w-xl text-xl leading-snug font-medium text-ink sm:text-[1.4rem]"
          >
            {creator.heroSubtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease }}
            className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted"
          >
            {creator.heroIntro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#contatti" className="btn btn-primary group">
              Collaboriamo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href="#numeri" className="btn btn-ghost group">
              Scopri il media kit
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-line/60 pt-7"
          >
            {creator.highlights.map((h) => (
              <div key={h.label} className="flex flex-col">
                <dt className="order-2 mt-1.5 text-sm leading-snug text-muted">{h.label}</dt>
                <dd className="order-1 font-display text-2xl font-bold text-ink sm:text-3xl">{h.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual */}
        <motion.div
          style={{ y: yVisual }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease }}
          className="relative order-1 mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:order-2 lg:max-w-[29rem]"
        >
          <HeroVisual creator={creator} subscribers={ytMetric && hasValue(ytMetric) ? ytMetric.value : null}
            approximate={!!ytMetric?.approximate} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroVisual({
  creator,
  subscribers,
  approximate,
}: {
  creator: CreatorData;
  subscribers: number | null;
  approximate: boolean;
}) {
  const { avatar } = creator.images;
  const positions = [
    'left-[-6%] top-[14%] sm:left-[-10%]',
    'right-[-4%] top-[4%] sm:right-[-8%]',
    'right-[-2%] bottom-[22%] sm:right-[-10%]',
  ];
  return (
    <div className="relative aspect-square">
      {/* Bagliore */}
      <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-gaming/40 blur-[60px]" />
      {/* Anelli HUD */}
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow">
        <circle cx="200" cy="200" r="196" fill="none" stroke="#234663" strokeWidth="1" />
        <circle cx="200" cy="200" r="196" fill="none" stroke="#63DFF7" strokeWidth="2" strokeDasharray="60 560" strokeLinecap="round" />
        <circle cx="200" cy="200" r="196" fill="none" stroke="#35D9FF" strokeWidth="2" strokeDasharray="14 600" strokeDashoffset="-300" strokeLinecap="round" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        {[0, 90, 180, 270].map((deg) => (
          <line key={deg} x1="200" y1="0" x2="200" y2="12" stroke="#63DFF7" strokeOpacity="0.8" strokeWidth="1.5" transform={`rotate(${deg} 200 200)`} />
        ))}
      </svg>
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-[5%] h-[90%] w-[90%] animate-spin-slower">
        <circle cx="200" cy="200" r="196" fill="none" stroke="#63DFF7" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 9" />
      </svg>

      {/* Avatar */}
      <div className="absolute inset-[11%] overflow-hidden rounded-full border-2 border-cyan/50 bg-surface">
        <img
          src={avatar.src}
          srcSet={avatar.srcSet}
          sizes="(min-width: 1024px) 460px, 300px"
          alt={avatar.alt}
          width={avatar.width}
          height={avatar.height}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Etichette flottanti */}
      {creator.heroLabels.slice(0, 3).map((label, i) => (
        <motion.span
          key={label}
          aria-hidden="true"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + i * 0.15, duration: 0.7 }}
          className={`absolute ${positions[i]} `}
        >
          <span
            className="block animate-float rounded-md border border-line bg-night px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-cyan uppercase"
            style={{ animationDelay: `${i * -2.3}s` }}
          >
            {label}
          </span>
        </motion.span>
      ))}

      {/* Badge iscritti: compare solo con un dato reale */}
      {subscribers !== null && (
        <motion.a
          href="#numeri"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="card absolute bottom-[2%] left-[-4%] flex items-center gap-3 px-4 py-3 transition hover:border-cyan/50 sm:left-[-8%]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF4E45]/15">
            <PlatformIcon id="youtube" colored className="h-4.5 w-4.5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-ink">{formatNumber(subscribers, approximate)}</span>
            <span className="block text-[13px] text-muted">iscritti su YouTube</span>
          </span>
        </motion.a>
      )}
    </div>
  );
}
