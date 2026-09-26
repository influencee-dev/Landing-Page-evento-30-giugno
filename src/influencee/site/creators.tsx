import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BadgeCheck, Check, MapPin, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Button, Card, Container, GAP, Pill, Section, SectionHeader, TYPE, reveal, type Tone } from '../ds';
import { CtaBand } from '../rows/footer';
import { CREATORS_DB, NICHE_INFO, NICHE_SLUGS, REELS, fmtEr, fmtFollowers, type Creator } from './data';
import { Breadcrumbs } from './shell';
import { HeroReels, ReelCard } from '../rows/reels';

/* ─── Card creator (usata in listing, nicchie, home, correlati) ─── */
export function CreatorCard({ c }: { c: Creator; key?: React.Key }) {
  return (
    <motion.a layout href={`#creator.${c.slug}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="group block overflow-hidden rounded-3xl bg-paper ring-1 ring-line/70 transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={c.cover} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink">{NICHE_INFO[c.niche].name}</span>
        <span className="absolute right-3 top-3 rounded-full bg-acid px-2.5 py-1 text-xs font-semibold text-ink">{c.match}% match</span>
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 text-white">
          <img src={c.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
          <div className="min-w-0 leading-tight">
            <p className="flex items-center gap-1 truncate font-heading font-semibold">
              {c.name} <BadgeCheck className="h-4 w-4 shrink-0 fill-brand text-white" />
            </p>
            <p className="truncate text-xs text-white/80">{c.handle}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-line px-2 py-3 text-center">
        <div>
          <p className="font-heading font-semibold">{fmtFollowers(c.followers)}</p>
          <p className="text-[11px] text-mute">follower</p>
        </div>
        <div>
          <p className="font-heading font-semibold">{fmtEr(c.er)}</p>
          <p className="text-[11px] text-mute">engagement</p>
        </div>
        <div>
          <p className="truncate px-1 font-heading font-semibold">{c.city}</p>
          <p className="text-[11px] text-mute">città</p>
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Filtri + griglia ──────────────────────────────────────────── */
const SIZES = [
  { id: 'all', label: 'Tutte le dimensioni', min: 0, max: Infinity },
  { id: 'micro', label: 'Micro · 10–50K', min: 0, max: 50000 },
  { id: 'mid', label: 'Mid · 50–150K', min: 50000, max: 150000 },
  { id: 'macro', label: 'Macro · 150K+', min: 150000, max: Infinity },
];
const PLATFORMS = ['Tutte', 'Instagram', 'TikTok', 'YouTube', 'Twitch', 'Facebook'];
const SORTS = [
  { id: 'match', label: 'Più affini' },
  { id: 'er', label: 'Engagement più alto' },
  { id: 'followers', label: 'Più follower' },
];

function Select({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.14em] text-mute">
      {label}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 h-11 w-full rounded-full bg-white px-4 text-sm font-medium normal-case tracking-normal text-ink outline-none ring-1 ring-line focus:ring-brand">
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CreatorExplorer({ fixedNiche }: { fixedNiche?: string }) {
  const [q, setQ] = useState('');
  const [niche, setNiche] = useState(fixedNiche ?? 'all');
  const [size, setSize] = useState('all');
  const [platform, setPlatform] = useState('Tutte');
  const [city, setCity] = useState('Tutte');
  const [sort, setSort] = useState('match');
  const [showFilters, setShowFilters] = useState(false);
  const cities = ['Tutte', ...Array.from(new Set(CREATORS_DB.map((c) => c.city))).sort()];

  const list = useMemo(() => {
    const s = SIZES.find((x) => x.id === size)!;
    const n = q.trim().toLowerCase();
    return CREATORS_DB.filter(
      (c) =>
        (niche === 'all' || c.niche === niche) &&
        c.followers >= s.min &&
        c.followers < s.max &&
        (platform === 'Tutte' || c.platforms.includes(platform)) &&
        (city === 'Tutte' || c.city === city) &&
        (!n || `${c.name} ${c.handle} ${c.city} ${NICHE_INFO[c.niche].name}`.toLowerCase().includes(n)),
    ).sort((a, b) => (sort === 'er' ? b.er - a.er : sort === 'followers' ? b.followers - a.followers : b.match - a.match));
  }, [q, niche, size, platform, city, sort]);

  const reset = () => {
    setQ('');
    if (!fixedNiche) setNiche('all');
    setSize('all');
    setPlatform('Tutte');
    setCity('Tutte');
  };

  return (
    <Section tone="white" pad="none" className="py-10 sm:py-14">
      <Container>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="creator-search" className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-paper px-5 ring-1 ring-line focus-within:ring-brand">
            <Search className="h-4 w-4 text-mute" />
            <input id="creator-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca per nome, handle, città…" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-mute" />
          </label>
          <button type="button" onClick={() => setShowFilters((v) => !v)} className="flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filtri
          </button>
        </div>

        {!fixedNiche && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => setNiche('all')}>
              <Pill active={niche === 'all'}>Tutte le nicchie</Pill>
            </button>
            {NICHE_SLUGS.map((s) => (
              <button key={s} type="button" onClick={() => setNiche(s)}>
                <Pill active={niche === s}>{NICHE_INFO[s].name}</Pill>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className={`${showFilters ? 'block' : 'hidden'} space-y-5 rounded-3xl bg-paper p-5 lg:block lg:self-start`}>
            <Select id="f-size" label="Dimensione" value={size} onChange={setSize} options={SIZES} />
            <Select id="f-platform" label="Piattaforma" value={platform} onChange={setPlatform} options={PLATFORMS.map((p) => ({ id: p, label: p }))} />
            <Select id="f-city" label="Città" value={city} onChange={setCity} options={cities.map((c) => ({ id: c, label: c }))} />
            <Select id="f-sort" label="Ordina per" value={sort} onChange={setSort} options={SORTS} />
            <button type="button" onClick={reset} className="text-sm font-semibold text-brand hover:underline">
              Azzera filtri
            </button>
          </aside>
          <div>
            <p className="text-sm text-mute">
              <b className="text-ink">{list.length}</b> creator trovati · dati di esempio
            </p>
            {list.length ? (
              <motion.div layout className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                <AnimatePresence>
                  {list.map((c) => (
                    <CreatorCard key={c.slug} c={c} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="mt-4 rounded-3xl bg-paper p-10 text-center">
                <p className="font-heading text-lg font-semibold">Nessun creator con questi filtri</p>
                <p className="mt-1 text-sm text-mute">Prova ad allargare la dimensione o a togliere la città.</p>
                <button type="button" onClick={reset} className="mt-4 text-sm font-semibold text-brand">
                  Azzera filtri
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Pagina: elenco creator ────────────────────────────────────── */
export function CreatorsPage() {
  return (
    <>
      <HeroReels
        crumbs={<Breadcrumbs center items={[{ label: 'Creator' }]} />}
        eyebrow="Database creator"
        title={'Trova i creator\n*giusti per il tuo brand*'}
        lead="Filtra per nicchia, dimensione, piattaforma e città. Ogni profilo mostra audience, engagement e affinità con il tuo pubblico."
        actions={
          <>
            <Button href="#contatti">Richiedi una shortlist</Button>
            <Button href="#diventa-creator" variant="secondary">
              Sei un creator? Candidati
            </Button>
          </>
        }
      />
      <CreatorExplorer />
      <CtaBand title={'Non hai tempo di cercare?\n*Lo facciamo noi*'} lead="Raccontaci obiettivi e budget: in 48 ore ricevi una shortlist di creator verificati." />
    </>
  );
}

/* ─── Pagina categoria: nicchia ─────────────────────────────────── */
export function NichePage({ slug }: { slug: string }) {
  const info = NICHE_INFO[slug];
  const list = CREATORS_DB.filter((c) => c.niche === slug);
  const reach = list.reduce((s, c) => s + c.followers, 0);
  const er = list.length ? list.reduce((s, c) => s + c.er, 0) / list.length : 0;
  return (
    <>
      <HeroReels
        crumbs={<Breadcrumbs center items={[{ label: 'Creator', href: '#creator' }, { label: info.name }]} />}
        eyebrow="Nicchia"
        title={`Creator *${info.name}*`}
        lead={info.lead}
        reels={REELS.filter((r) => r.sector === info.name)}
        actions={<Button href="#contatti">Richiedi creator {info.name}</Button>}
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3">
          {[
            [String(list.length), 'creator'],
            [fmtFollowers(reach), 'reach totale'],
            [fmtEr(Math.round(er * 10) / 10), 'ER medio'],
          ].map(([v, l], i) => (
            <div key={l} className={`rounded-2xl p-4 ${i === 2 ? 'bg-acid text-ink' : 'bg-white/8 text-white ring-1 ring-white/10'}`}>
              <p className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{v}</p>
              <p className="mt-1 text-xs opacity-70">{l}</p>
            </div>
          ))}
        </div>
      </HeroReels>
      <Section tone="white" pad="none" className="pt-10">
        <Container>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-2 py-1.5 text-sm text-mute">Altre nicchie:</span>
            {NICHE_SLUGS.filter((s) => s !== slug).map((s) => (
              <a key={s} href={`#nicchia.${s}`}>
                <Pill>{NICHE_INFO[s].name}</Pill>
              </a>
            ))}
          </div>
        </Container>
      </Section>
      <CreatorExplorer key={slug} fixedNiche={slug} />
      <CtaBand title={`Campagne ${info.name}\n*che funzionano*`} lead={`Ti proponiamo i creator ${info.name.toLowerCase()} più adatti al tuo pubblico, con stima dei risultati.`} />
    </>
  );
}

/* ─── Pagina: profilo creator ───────────────────────────────────── */
function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-brand" />
      </div>
    </div>
  );
}

export function CreatorProfile({ slug }: { slug: string }) {
  const c = CREATORS_DB.find((x) => x.slug === slug);
  const [saved, setSaved] = useState(false);
  if (!c) return null;
  const similar = CREATORS_DB.filter((x) => x.niche === c.niche && x.slug !== c.slug).concat(CREATORS_DB.filter((x) => x.niche !== c.niche)).slice(0, 3);
  return (
    <>
      <Section tone="ink" pad="none" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(255,31,143,0.28),transparent_65%)]" />
        <Container className="text-center">
          <Breadcrumbs center items={[{ label: 'Creator', href: '#creator' }, { label: NICHE_INFO[c.niche].name, href: `#nicchia.${c.niche}` }, { label: c.name }]} />
          <img src={c.avatar} alt="" className="mx-auto mt-10 h-28 w-28 rounded-full object-cover ring-4 ring-acid ring-offset-4 ring-offset-ink" />
          <h1 className={`mt-6 flex items-center justify-center gap-2 ${TYPE.display}`}>
            {c.name} <BadgeCheck className="h-8 w-8 shrink-0 fill-brand text-ink sm:h-10 sm:w-10" />
          </h1>
          <p className="mt-2 text-lg text-white/60">{c.handle}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Pill active>{NICHE_INFO[c.niche].name}</Pill>
            <Pill>
              <MapPin className="h-3.5 w-3.5" /> {c.city}
            </Pill>
            {c.platforms.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
          <p className={`mx-auto mt-6 max-w-xl ${TYPE.lead} text-white/70`}>{c.bio}</p>
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
            {[
              [fmtFollowers(c.followers), 'follower'],
              [fmtEr(c.er), 'engagement'],
              [`${c.match}%`, 'match brand'],
            ].map(([v, l], i) => (
              <div key={l} className={`rounded-2xl p-4 ${i === 2 ? 'bg-acid text-ink' : 'bg-white/8 ring-1 ring-white/10'}`}>
                <p className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{v}</p>
                <p className="mt-1 text-xs opacity-70">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setSaved((s) => !s)}>
              {saved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {saved ? 'In shortlist' : 'Aggiungi alla shortlist'}
            </Button>
            <Button href="#contatti" variant="secondary">
              Proponi una collaborazione
            </Button>
          </div>
          <p className="mt-3 text-xs text-white/45">Profilo di esempio: dati e immagini segnaposto.</p>
        </Container>
        <Container className="mt-14">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {c.gallery.slice(0, 4).map((g, i) => (
              <motion.div key={i} {...reveal(i)} className={i % 2 ? 'lg:mt-10' : ''}>
                <ReelCard c={{ ...c, cover: g }} delay={i * 0.7} />
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-white/55">Formati disponibili: {c.formats.join(' · ')}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeader align="left" eyebrow="Audience" title="Chi segue *questo creator*" />
          <div className={`${GAP.header} grid ${GAP.grid} md:grid-cols-3`}>
            <Card className="p-7">
              <p className="font-heading text-lg font-semibold">Genere</p>
              <div className="mt-6 flex h-4 overflow-hidden rounded-full">
                <div className="bg-brand" style={{ width: `${c.women}%` }} />
                <div className="bg-ink" style={{ width: `${100 - c.women}%` }} />
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand" /> Donne {c.women}%
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink" /> Uomini {100 - c.women}%
                </span>
              </div>
            </Card>
            <Card className="space-y-4 p-7">
              <p className="font-heading text-lg font-semibold">Età</p>
              {c.ages.map(([l, v]) => (
                <Bar key={l} label={l} value={v} />
              ))}
            </Card>
            <Card className="space-y-4 p-7">
              <p className="font-heading text-lg font-semibold">Città principali</p>
              {c.cities.map(([l, v]) => (
                <Bar key={l} label={l} value={v} />
              ))}
            </Card>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeader align="split" eyebrow="Simili" title="Creator *simili*" aside={<Button href={`#nicchia.${c.niche}`} variant="secondary" size="sm" arrow>{`Tutti i creator ${NICHE_INFO[c.niche].name}`}</Button>} />
          <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-3`}>
            {similar.map((s) => (
              <CreatorCard key={s.slug} c={s} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

/* ─── Row: creator in evidenza (home) ───────────────────────────── */
export function FeaturedCreators({ tone = 'white' }: { tone?: Tone }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="split" eyebrow="Creator" title={'Alcuni volti\n*del nostro network*'} lead="Profili verificati in tutte le nicchie. Apri una scheda per vedere audience e contenuti." aside={<div className="mt-6"><Button href="#creator" variant="contrast" arrow>Esplora tutti i creator</Button></div>} />
        <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-4`}>
          {CREATORS_DB.slice(0, 8).map((c) => (
            <CreatorCard key={c.slug} c={c} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

