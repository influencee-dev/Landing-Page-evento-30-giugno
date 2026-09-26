import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Menu, Star, X } from 'lucide-react';
import { BRAND, NAV, CTA } from './content';

/* ════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM INFLUENCEE
   Regole (valgono per TUTTE le row):
   · Layout   → ogni row è un <Section>: fascia a tutta larghezza, senza
                riquadri né margini esterni; il contenuto sta in <Container>
                (max 1200px, gutter 20/32/40px). Due fasce consecutive dello
                stesso tono si fondono (la seconda perde il padding superiore).
   · Ritmo    → padding verticale 80/112px; header→contenuto 48/64px;
                gap griglie 16/20px; padding card 24/32px.
   · Colori   → bianco predominante, nero (ink) per testo e sezioni scure;
                accenti: FUCSIA (brand) su fondo chiaro, VERDE ACIDO (acid)
                su fondo nero e nei pannelli statement. Solo token.
   · Font     → titoli Inter Tight semibold con tracking stretto; testo Inter.
                Niente corsivi: la parola evidenziata (tra *asterischi*)
                cambia solo colore, nello stesso font.
   · Scala    → display / h2 / h3 / lead / body / label / number (vedi TYPE).
   · Raggi    → card 24, media 16, controlli pill (le fasce non hanno raggio).
   · Motion   → reveal: y 24 → 0, 0.6s, easing [.22,1,.36,1], stagger 0.06.
   ════════════════════════════════════════════════════════════════════ */

export type Tone = 'white' | 'paper' | 'muted' | 'soft' | 'ink' | 'brand';

const TONE_BG: Record<Tone, string> = {
  white: 'bg-white text-ink',
  paper: 'bg-paper text-ink',
  muted: 'bg-muted text-ink',
  soft: 'bg-acid text-ink', // pannello statement verde acido
  ink: 'bg-ink text-white',
  brand: 'bg-brand text-white',
};

const ToneCtx = createContext<Tone>('white');
export const useTone = () => useContext(ToneCtx);
export const isDark = (t: Tone) => t === 'ink' || t === 'brand';

/** Classi di colore che dipendono dal tono del pannello. */
export function useInk() {
  const t = useTone();
  const dark = isDark(t);
  return {
    dark,
    heading: dark ? 'text-white' : 'text-ink',
    lead: t === 'brand' ? 'text-white/80' : dark ? 'text-white/65' : 'text-mute',
    meta: dark ? 'text-white/55' : 'text-mute',
    line: dark ? 'border-white/12' : 'border-line',
    accent: t === 'brand' ? 'text-ink' : t === 'ink' ? 'text-acid' : t === 'soft' ? 'mt-2 inline-block rounded-2xl bg-ink px-3 pb-1 text-acid' : 'text-brand',
    card:
      t === 'white'
        ? 'bg-paper ring-1 ring-line/70'
        : t === 'ink'
          ? 'bg-ink-2 ring-1 ring-white/10'
          : t === 'brand'
            ? 'bg-white/10 ring-1 ring-white/15'
            : 'bg-white shadow-card',
    surface: dark ? 'bg-white/8' : t === 'white' ? 'bg-paper' : 'bg-white',
  };
}

/* ─── Tipografia ─────────────────────────────────────────────────── */
export const TYPE = {
  display: 'font-heading font-semibold tracking-[-0.035em] leading-[1] text-[2.6rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem]',
  h2: 'font-heading font-semibold tracking-[-0.03em] leading-[1.04] text-[2.1rem] sm:text-5xl lg:text-[3.5rem]',
  h3: 'font-heading font-semibold tracking-[-0.02em] leading-tight text-xl sm:text-2xl',
  lead: 'text-base sm:text-lg leading-relaxed',
  body: 'text-[15px] leading-relaxed',
  label: 'text-xs font-semibold uppercase tracking-[0.14em]',
  number: 'font-heading font-semibold tracking-[-0.04em] leading-none text-5xl sm:text-6xl',
  numberXL: 'font-heading font-semibold tracking-[-0.04em] leading-none text-6xl sm:text-8xl',
};

/** Rende `*testo*` come parola accento (stesso font, colore d'accento del tono) e `\n` come a capo. */
export function Rich({ text, accentClass }: { text: string; accentClass?: string }) {
  const { accent } = useInk();
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <span key={i} className={accentClass ?? accent}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

export function Heading({
  as = 'h2',
  size = 'h2',
  text,
  className = '',
}: {
  as?: 'h1' | 'h2' | 'h3';
  size?: 'display' | 'h2' | 'h3';
  text: string;
  className?: string;
}) {
  const { heading } = useInk();
  const Tag = as;
  return (
    <Tag className={`whitespace-pre-line ${TYPE[size]} ${heading} ${className}`}>
      <Rich text={text} />
    </Tag>
  );
}

export function Lead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { lead } = useInk();
  return <p className={`${TYPE.lead} ${lead} ${className}`}>{children}</p>;
}

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { dark } = useInk();
  const t = useTone();
  const bg = dark ? 'bg-white/10 text-white' : t === 'soft' ? 'bg-white text-brand-ink' : 'bg-brand-soft text-brand-ink';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${TYPE.label} ${bg} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-acid' : 'bg-brand'}`} />
      {children}
    </span>
  );
}

/** Intestazione standard di sezione: eyebrow + titolo + lead. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'center',
  aside,
  size = 'h2',
  as = 'h2',
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'center' | 'left' | 'split';
  aside?: React.ReactNode;
  size?: 'display' | 'h2';
  as?: 'h1' | 'h2';
}) {
  if (align === 'split')
    return (
      <div className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Heading as={as} size={size} text={title} className="mt-5" />
        </div>
        <div className="lg:justify-self-end">
          {lead && <Lead className="max-w-md">{lead}</Lead>}
          {aside}
        </div>
      </div>
    );
  const center = align === 'center';
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading as={as} size={size} text={title} className="mt-5" />
      {lead && <Lead className={`mt-5 max-w-xl ${center ? 'mx-auto' : ''}`}>{lead}</Lead>}
      {aside && <div className={`mt-8 ${center ? 'flex justify-center' : ''}`}>{aside}</div>}
    </div>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────── */
export function Section({
  tone = 'white',
  id,
  children,
  className = '',
  pad = 'default',
}: {
  tone?: Tone;
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** default = padding verticale standard, hero = navbar in alto, none = gestito dalla row */
  pad?: 'default' | 'hero' | 'none';
  key?: React.Key;
}) {
  const padding = pad === 'default' ? 'py-20 sm:py-28' : pad === 'hero' ? 'pb-20 sm:pb-28' : '';
  return (
    <section id={id} data-tone={tone} className={`in-section relative overflow-hidden font-sans ${TONE_BG[tone]} ${padding} ${className}`}>
      <ToneCtx.Provider value={tone}>{children}</ToneCtx.Provider>
    </section>
  );
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>;
}

/** Distanza standard tra intestazione e contenuto. */
export const GAP = { header: 'mt-12 sm:mt-16', grid: 'gap-4 sm:gap-5' };

/* ─── Controlli ──────────────────────────────────────────────────── */
type BtnVariant = 'primary' | 'secondary' | 'contrast';
export function Button({
  href = '#',
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  onClick,
  type,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: 'sm' | 'md';
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  key?: React.Key;
}) {
  const t = useTone();
  const dark = isDark(t);
  const styles: Record<BtnVariant, string> = {
    primary:
      t === 'brand'
        ? 'bg-ink text-white hover:bg-ink-2'
        : t === 'ink'
          ? 'bg-acid text-ink hover:brightness-95'
          : t === 'soft'
            ? 'bg-ink text-acid hover:bg-ink-2'
            : 'bg-brand text-white hover:bg-brand-ink shadow-[0_8px_24px_-8px_rgba(255,31,143,0.55)]',
    secondary: dark ? 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/30',
    contrast: dark ? 'bg-white text-ink hover:bg-white/90' : 'bg-ink text-white hover:bg-ink-2',
  };
  const sz = size === 'sm' ? 'h-10 px-5 text-sm' : 'h-12 px-6 text-[15px]';
  const cls = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 ${sz} ${styles[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowUpRight className="h-4 w-4" />}
    </>
  );
  if (type || onClick)
    return (
      <button type={type ?? 'button'} onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  return (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}

export function Card({ children, className = '', as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'article' | 'li'; key?: React.Key }) {
  const { card } = useInk();
  return <Tag className={`rounded-3xl ${card} ${className}`}>{children}</Tag>;
}

export function Pill({ children, active = false, className = '' }: { children: React.ReactNode; active?: boolean; className?: string; key?: React.Key }) {
  const { dark } = useInk();
  const base = active ? 'bg-brand text-white' : dark ? 'bg-white/10 text-white' : 'bg-white text-ink ring-1 ring-line';
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ${base} ${className}`}>{children}</span>;
}

export function IconBadge({ icon: Icon, className = '' }: { icon: React.ComponentType<{ className?: string }>; className?: string; key?: React.Key }) {
  const { dark } = useInk();
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${dark ? 'bg-white/10 text-white' : 'bg-brand-soft text-brand'} ${className}`}>
      <Icon className="h-5 w-5" />
    </span>
  );
}

/** Badge flottante bianco (sopra foto/mockup). */
export function Float({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`absolute z-10 rounded-2xl bg-white px-4 py-3 text-sm text-ink shadow-float ${className}`}>{children}</div>;
}

export function Media({ src, alt = '', className = '', ratio = 'aspect-[4/5]' }: { src: string; alt?: string; className?: string; ratio?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={`w-full rounded-2xl bg-muted object-cover ${ratio} ${className}`} />;
}

export function AvatarStack({ src, size = 'h-8 w-8' }: { src: string[]; size?: string }) {
  const { dark } = useInk();
  return (
    <span className="flex -space-x-2">
      {src.map((s, i) => (
        <img key={i} src={s} alt="" className={`${size} rounded-full object-cover ring-2 ${dark ? 'ring-ink' : 'ring-white'}`} />
      ))}
    </span>
  );
}

export function Stars({ value = 5, className = 'h-4 w-4' }: { value?: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-star" aria-label={`${value} su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(value) ? 'fill-current' : 'opacity-30'}`} strokeWidth={0} />
      ))}
    </span>
  );
}

/** Riprova sociale standard: avatar + stelle + etichetta. */
export function SocialProof({ className = '' }: { className?: string }) {
  const { meta, heading } = useInk();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AvatarStack src={BRAND.proof.avatars} />
      <div className="text-left leading-tight">
        <div className="flex items-center gap-1.5">
          <Stars />
          <span className={`text-sm font-semibold ${heading}`}>{BRAND.proof.rating}</span>
        </div>
        <p className={`text-xs ${meta}`}>{BRAND.proof.label}</p>
      </div>
    </div>
  );
}

/* ─── Navbar & logo ──────────────────────────────────────────────── */
export function Logo({ className = '' }: { className?: string }) {
  const { heading, dark } = useInk();
  return (
    <a href="#home" className={`flex items-center gap-2 font-heading text-xl font-semibold tracking-[-0.03em] ${heading} ${className}`}>
      <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${dark ? 'bg-white' : 'bg-brand'}`}>
        <span className={`h-3 w-3 rounded-full ${dark ? 'bg-brand' : 'bg-white'}`} />
        <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ${dark ? 'bg-acid ring-ink' : 'bg-ink ring-white'}`} />
      </span>
      {BRAND.name}
    </a>
  );
}

export function Navbar() {
  const { lead, heading, dark } = useInk();
  const [open, setOpen] = useState(false);
  return (
    <Container className="relative z-20">
      <div className="flex h-16 items-center justify-between sm:h-20">
        <Logo />
        <nav className={`hidden items-center gap-8 text-sm font-medium lg:flex ${lead}`}>
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className={`transition ${dark ? 'hover:text-white' : 'hover:text-ink'}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden md:block">
            <Button href={CTA.creator.href} variant="secondary" size="sm">
              {CTA.creator.label}
            </Button>
          </span>
          <span className="hidden sm:block">
            <Button href={CTA.demo.href} size="sm">
              {CTA.demo.label}
            </Button>
          </span>
          <button type="button" aria-label="Menu" onClick={() => setOpen((o) => !o)} className={`ml-1 flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${heading} ${dark ? 'bg-white/10' : 'bg-ink/5'}`}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-5 top-16 rounded-2xl bg-white p-3 text-ink shadow-float lg:hidden">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-medium hover:bg-paper">
              {l.label}
            </a>
          ))}
          <a href={CTA.demo.href} onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-brand px-4 py-3 text-center font-semibold text-white">
            {CTA.demo.label}
          </a>
        </motion.nav>
      )}
    </Container>
  );
}

/* ─── Motion ─────────────────────────────────────────────────────── */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: EASE, delay: i * 0.06 },
});

export function useCountUp(to: number, duration = 1300) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      setV(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return { ref, value: v };
}

export function CountUp({ to, decimals = 0, prefix = '', suffix = '' }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const { ref, value } = useCountUp(to);
  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Nastro orizzontale infinito (loghi, nicchie, card). */
export function Marquee({ children, speed = 'animate-marquee', className = '' }: { children: React.ReactNode; speed?: string; className?: string }) {
  return (
    <div className={`overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}>
      <div className={`flex w-max ${speed} hover:[animation-play-state:paused]`}>
        <div className="flex shrink-0 items-center gap-4 pr-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
