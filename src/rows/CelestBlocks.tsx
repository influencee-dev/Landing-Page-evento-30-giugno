import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CalendarClock,
  Sparkles,
  Plug,
  Workflow,
  Timer,
  UserCircle,
  UserPlus,
  Monitor,
  Link2,
  Rocket,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ListChecks,
  Zap,
} from 'lucide-react';

/**
 * Row 35–41 — Blocchi "Celest" (SaaS blu pulito)
 * Famiglia coerente: eyebrow blu, titolo con parola evidenziata in blu,
 * card bianche con bordo sottile e icone in cerchio blu.
 */

const BLUE = '#1f5eff';

function Heading({ eyebrow, title, highlight, subtitle, align = 'center' }: { eyebrow: string; title: string; highlight?: string; subtitle?: string; align?: 'center' | 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: BLUE }}>
        {align === 'left' && '▪ '}
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
        {title} {highlight && <span style={{ color: BLUE }}>{highlight}</span>}
      </h2>
      {subtitle && <p className={`mt-2 text-sm text-zinc-500 ${align === 'center' ? 'mx-auto' : ''} max-w-md`}>{subtitle}</p>}
    </div>
  );
}

function IconDot({ Icon, invert = false }: { Icon: React.ComponentType<{ className?: string }>; invert?: boolean }) {
  return (
    <span className={`flex h-9 w-9 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(31,94,255,0.35)] ${invert ? 'bg-white/20' : ''}`} style={invert ? undefined : { background: BLUE }}>
      <Icon className="h-4 w-4 text-white" />
    </span>
  );
}

const fade = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d } });

/* ---------- 35 Benefits grid ---------- */
export interface BenefitsGridProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  items?: { title: string; text: string }[];
}
const BENEFIT_ICONS = [CalendarClock, Sparkles, Plug, Workflow, Timer, UserCircle];

export function BenefitsGrid({
  eyebrow = 'Vantaggi',
  title = 'Più risultati,',
  highlight = 'meno fatica',
  subtitle = 'Cosa cambia quando la tua attività ha gli strumenti giusti.',
  items = [
    { title: 'Piano editoriale', text: 'Sai cosa pubblicare ogni settimana, senza improvvisare all’ultimo minuto.' },
    { title: 'Idee con l’AI', text: 'Trasformi un’offerta in locandina, post e messaggio WhatsApp in pochi minuti.' },
    { title: 'Strumenti collegati', text: 'Canva, ChatGPT, Meta e WhatsApp che lavorano insieme, non separati.' },
    { title: 'Automazioni', text: 'Risposte, prenotazioni e promemoria che partono da soli.' },
    { title: 'Tempo misurato', text: 'Capisci dove perdi ore e come recuperarle ogni settimana.' },
    { title: 'Supporto del team', text: 'Un gruppo Socialee a cui chiedere quando ti blocchi.' },
  ],
}: BenefitsGridProps) {
  return (
    <section className="bg-[#f6f7f9] px-4 py-20 font-work text-zinc-900 sm:px-6">
      <Heading eyebrow={eyebrow} title={title} highlight={highlight} subtitle={subtitle} />
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div key={it.title} {...fade((i % 3) * 0.06)} className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex justify-center">
              <IconDot Icon={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} />
            </div>
            <h3 className="mt-4 font-medium">{it.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{it.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 36 Steps highlight ---------- */
export interface StepsHighlightProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  text?: string;
  cta?: { label: string; href: string };
  steps?: { title: string; text: string }[];
}
const STEP_ICONS = [UserPlus, Monitor, Link2, Rocket];

export function StepsHighlight({
  eyebrow = 'Come iniziare',
  title = 'Operativo in',
  highlight = 'una sera',
  text = 'Nessuna competenza tecnica. Quattro passi semplici tra te e una comunicazione che lavora per te.',
  cta = { label: 'Prenota il posto', href: '#iscrizione' },
  steps = [
    { title: 'Iscriviti', text: 'Prenota il posto in pochi secondi: nome, email e sei dentro.' },
    { title: 'Porta la tua attività', text: 'Arriva con un’offerta, un menu o una promo da migliorare.' },
    { title: 'Collega gli strumenti', text: 'Ti mostriamo come usare AI, Canva e WhatsApp insieme.' },
    { title: 'Esci con i contenuti', text: 'Torni a casa con materiali pronti e un metodo da ripetere.' },
  ],
}: StepsHighlightProps) {
  const [hl, setHl] = useState(0);
  return (
    <section className="bg-[#f6f7f9] px-4 py-20 font-work text-zinc-900 sm:px-6">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col">
          <Heading eyebrow={eyebrow} title={title} highlight={highlight} align="left" />
          <p className="mt-3 text-sm text-zinc-600">{text}</p>
          <a href={cta.href} className="mt-6 self-start rounded-lg px-4 py-2.5 text-sm text-white md:mt-auto" style={{ background: BLUE }}>
            {cta.label}
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => {
            const on = i === hl;
            return (
              <motion.div
                key={s.title}
                {...fade(i * 0.06)}
                onMouseEnter={() => setHl(i)}
                className={`rounded-2xl p-6 transition-colors duration-300 ${on ? 'text-white shadow-[0_12px_30px_rgba(31,94,255,0.35)]' : 'border border-zinc-200 bg-white'}`}
                style={on ? { background: BLUE } : undefined}
              >
                <IconDot Icon={STEP_ICONS[i % STEP_ICONS.length]} invert={on} />
                <h3 className="mt-8 font-medium">{s.title}</h3>
                <p className={`mt-1 text-sm ${on ? 'text-white/85' : 'text-zinc-500'}`}>{s.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- 37 Logo grid ---------- */
export interface LogoGridProps {
  label?: string;
  logos?: { name: string; color?: string }[];
}
export function LogoGrid({
  label = 'Strumenti che usiamo',
  logos = [
    { name: 'Instagram', color: '#e1306c' },
    { name: 'Meta Ads', color: '#1877f2' },
    { name: 'WhatsApp', color: '#25d366' },
    { name: 'Canva', color: '#00c4cc' },
    { name: 'ChatGPT', color: '#10a37f' },
    { name: 'Claude', color: '#d97757' },
    { name: 'TikTok', color: '#111111' },
    { name: 'Google', color: '#4285f4' },
  ],
}: LogoGridProps) {
  return (
    <section className="bg-[#f6f7f9] px-4 py-16 font-work sm:px-6">
      <p className="text-center text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 overflow-hidden rounded-xl border border-zinc-200 bg-white sm:grid-cols-4">
        {logos.map((l) => (
          <div key={l.name} className="flex items-center justify-center gap-2 border-b border-r border-zinc-100 py-6 text-lg font-semibold text-zinc-800 grayscale transition hover:grayscale-0">
            <span className="h-4 w-4 rounded" style={{ background: l.color }} />
            {l.name}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 38 FAQ ---------- */
export interface FaqProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  items?: { q: string; a: string }[];
}
export function FaqAccordion({
  eyebrow = 'FAQ',
  title = 'Hai',
  highlight = 'domande?',
  subtitle = 'Tutte le risposte, dall’iscrizione a cosa portare.',
  items = [
    { q: 'Servono competenze tecniche?', a: 'No. L’evento è pensato per chi non ha mai usato l’AI: si parte da zero e si lavora sulla tua attività.' },
    { q: 'Quanto costa partecipare?', a: 'La partecipazione è gratuita, con aperitivo di benvenuto offerto. I posti sono limitati.' },
    { q: 'Devo portare il computer?', a: 'Consigliato ma non obbligatorio: puoi seguire anche dallo smartphone.' },
    { q: 'Posso venire con un socio?', a: 'Sì, basta che entrambi vi registriate con il modulo di iscrizione.' },
  ],
}: FaqProps) {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[#f6f7f9] px-4 py-20 font-work text-zinc-900 sm:px-6">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_1.6fr]">
        <div>
          <Heading eyebrow={eyebrow} title={title} highlight={highlight} align="left" />
          <p className="mt-3 text-sm text-zinc-600">{subtitle}</p>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={it.q} className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between px-3 py-2.5 text-left font-medium">
                {it.q}
                <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="flex h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: BLUE, color: BLUE }}>
                  <ChevronDown className="h-3 w-3" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="m-1 rounded-xl bg-zinc-100 p-3 text-sm text-zinc-600">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 39 Feature rows (alternate) ---------- */
export interface FeatureRowsProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  rows?: { title: string; text: string; bullets: string[]; image: string; cta?: { label: string; href: string } }[];
}
export function FeatureRows({
  eyebrow = 'Cosa impari',
  title = 'Strumenti che fanno',
  highlight = 'lavorare meglio',
  subtitle = 'Semplifica la comunicazione senza rinunciare alla qualità.',
  rows = [
    { title: 'Assistente per i contenuti', text: 'L’AI si occupa delle parti ripetitive: idee, testi e varianti, così tu ti concentri sull’attività.', bullets: ['Idee per i post', 'Testi per WhatsApp', 'Varianti per le promo', 'Calendario settimanale'], image: 'spiegazione.png', cta: { label: 'Scopri di più', href: '#programma' } },
    { title: 'Locandine e menu in minuti', text: 'Dal testo alla grafica pronta da stampare o pubblicare, con uno stile coerente al tuo brand.', bullets: ['Template su misura', 'Menu leggibili', 'Formati social', 'Stampa e digitale'], image: 'card2.png', cta: { label: 'Scopri di più', href: '#programma' } },
    { title: 'Risultati sotto controllo', text: 'Capisci cosa funziona, cosa no e dove investire tempo e budget.', bullets: ['Metriche semplici', 'Confronto promo', 'Avvisi utili', 'Suggerimenti AI'], image: 'card3.png' },
  ],
}: FeatureRowsProps) {
  const icons = [Sparkles, ListChecks, Zap];
  return (
    <section className="bg-[#f6f7f9] px-4 py-20 font-work text-zinc-900 sm:px-6">
      <Heading eyebrow={eyebrow} title={title} highlight={highlight} subtitle={subtitle} />
      <div className="mx-auto mt-14 max-w-4xl space-y-16">
        {rows.map((r, i) => (
          <motion.div key={r.title} {...fade()} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <div className="rounded-2xl border-2 bg-white p-3 shadow-[0_20px_50px_rgba(31,94,255,0.12)]" style={{ borderColor: `${BLUE}55` }}>
              <img src={r.image} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
            </div>
            <div>
              <IconDot Icon={icons[i % icons.length]} />
              <h3 className="mt-4 text-2xl font-medium">{r.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{r.text}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {r.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" style={{ color: BLUE }} /> {b}
                  </li>
                ))}
              </ul>
              {r.cta && (
                <a href={r.cta.href} className="mt-5 inline-block rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm">
                  {r.cta.label}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 40 Newsletter / waitlist ---------- */
export interface NewsletterProps {
  title?: string;
  text?: string;
  button?: string;
  proof?: { avatars: string[]; label: string };
  perks?: string[];
}
export function Newsletter({
  title = 'Resta aggiornato.',
  text = 'Consigli pratici, novità sugli eventi e risorse esclusive direttamente nella tua casella.',
  button = 'Iscriviti alla newsletter',
  proof = { avatars: ['giorgia.png', 'giuseppe.png', 'noemi.png'], label: 'Unisciti a 1.100+ imprenditori' },
  perks = ['Accesso anticipato agli eventi', 'Risorse esclusive', 'Zero spam'],
}: NewsletterProps) {
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-[#f6f7f9] px-4 py-20 text-center font-work text-zinc-900 sm:px-6">
      <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-zinc-500">{text}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="mt-6 space-y-3"
        >
          <input type="email" required placeholder="La tua email" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-blue-400" />
          <button type="submit" className="w-full rounded-xl py-3 text-sm font-medium text-white shadow-[0_8px_20px_rgba(31,94,255,0.35)]" style={{ background: BLUE }}>
            {sent ? 'Grazie! Controlla la tua email ✓' : button}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span className="flex -space-x-2">
            {proof.avatars.map((a) => (
              <img key={a} src={a} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-white" />
            ))}
          </span>
          {proof.label}
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-zinc-700">
          {perks.map((p) => (
            <li key={p} className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" style={{ color: BLUE }} /> {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 41 Comparison old vs new ---------- */
export interface ComparisonProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  brand?: string;
  rows?: { topic: string; old: string; next: string }[];
}
export function Comparison({
  eyebrow = 'Perché noi',
  title = 'Un’alternativa',
  highlight = 'più intelligente',
  subtitle = 'Pensata per farti risparmiare tempo e crescere con metodo.',
  brand = 'Metodo Socialee',
  rows = [
    { topic: 'Contenuti', old: 'Post improvvisati la sera prima, grafiche diverse ogni volta, nessun piano.', next: 'Un calendario chiaro e contenuti coerenti creati in anticipo con l’AI.' },
    { topic: 'Promozioni', old: 'Volantini generici e offerte che nessuno nota.', next: 'Promo mirate, testi persuasivi e locandine che si fanno notare.' },
    { topic: 'Prenotazioni', old: 'Telefonate perse e messaggi a cui rispondi a fine turno.', next: 'Chatbot e automazioni che rispondono e prenotano al posto tuo.' },
  ],
}: ComparisonProps) {
  return (
    <section className="bg-[#f6f7f9] px-4 py-20 font-work text-zinc-900 sm:px-6">
      <Heading eyebrow={eyebrow} title={title} highlight={highlight} subtitle={subtitle} />
      <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
        {rows.map((r, i) => (
          <motion.div key={r.topic} {...fade(i * 0.08)} className="rounded-2xl border border-zinc-200 bg-[#fafbfc] p-4">
            <p className="flex items-center gap-2 font-medium">
              <IconDot Icon={[ListChecks, Zap, CalendarClock][i % 3]} /> {r.topic}
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase text-zinc-500">
              <XCircle className="h-3.5 w-3.5" /> Il vecchio metodo
            </p>
            <p className="mt-1 text-sm text-zinc-500 line-through decoration-zinc-300">{r.old}</p>
            <div className="mt-4 rounded-xl bg-white p-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase" style={{ color: BLUE }}>
                <CheckCircle2 className="h-3.5 w-3.5" /> {brand}
              </p>
              <p className="mt-1 text-sm">{r.next}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
