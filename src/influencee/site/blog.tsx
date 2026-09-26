import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, Link2, Quote } from 'lucide-react';
import { Button, Card, Container, GAP, Pill, Section, SectionHeader, TYPE, reveal, type Tone } from '../ds';
import { Newsletter } from '../rows/saas';
import { ARTICLES, BLOG_CATEGORIES, type Article } from './data';
import { Breadcrumbs, PageHero } from './shell';

export function ArticleCard({ a, big = false }: { a: Article; big?: boolean }) {
  return (
    <motion.a href={`#articolo.${a.slug}`} {...reveal()} className={`group block ${big ? 'grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center' : ''}`}>
      <div className="overflow-hidden rounded-3xl">
        <img src={a.cover} alt="" loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-105 ${big ? 'aspect-[16/10]' : 'aspect-[4/3]'}`} />
      </div>
      <div className={big ? '' : 'mt-5'}>
        <div className="flex items-center gap-3 text-sm text-mute">
          <Pill active className="px-2.5 py-1 text-xs">
            {BLOG_CATEGORIES[a.category].name}
          </Pill>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {a.read} min
          </span>
        </div>
        <h3 className={`mt-3 ${big ? TYPE.h2 : TYPE.h3} transition group-hover:text-brand`}>{a.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">{a.excerpt}</p>
        <p className="mt-4 flex items-center gap-2 text-sm">
          <img src={a.authorPhoto} alt="" className="h-7 w-7 rounded-full object-cover" />
          {a.author} · <span className="text-mute">{a.date}</span>
        </p>
      </div>
    </motion.a>
  );
}

function CategoryChips({ current }: { current?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a href="#blog">
        <Pill active={!current}>Tutti</Pill>
      </a>
      {Object.entries(BLOG_CATEGORIES).map(([s, c]) => (
        <a key={s} href={`#categoria.${s}`}>
          <Pill active={current === s}>{c.name}</Pill>
        </a>
      ))}
    </div>
  );
}

/* ─── Pagina: blog (listing) ────────────────────────────────────── */
export function BlogPage() {
  const [featured, ...rest] = ARTICLES;
  return (
    <>
      <PageHero crumbs={[{ label: 'Blog' }]} eyebrow="Blog" title={'Idee e guide per il\n*creator marketing*'} lead="Strategie, casi studio e consigli pratici per brand, agenzie e creator. Articoli di esempio.">
        <CategoryChips />
      </PageHero>
      <Section tone="white">
        <Container>
          <ArticleCard a={featured} big />
          <div className={`mt-16 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3`}>
            {rest.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </Container>
      </Section>
      <Newsletter />
    </>
  );
}

/* ─── Pagina categoria del blog ─────────────────────────────────── */
export function BlogCategoryPage({ slug }: { slug: string }) {
  const cat = BLOG_CATEGORIES[slug];
  const list = ARTICLES.filter((a) => a.category === slug);
  const others = ARTICLES.filter((a) => a.category !== slug).slice(0, 3);
  return (
    <>
      <PageHero crumbs={[{ label: 'Blog', href: '#blog' }, { label: cat.name }]} eyebrow="Categoria" title={`*${cat.name}*`} lead={cat.lead}>
        <CategoryChips current={slug} />
      </PageHero>
      <Section tone="white">
        <Container>
          <p className="text-sm text-mute">
            <b className="text-ink">{list.length}</b> {list.length === 1 ? 'articolo' : 'articoli'} in {cat.name}
          </p>
          <div className="mt-6 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <SectionHeader align="split" title="Leggi anche" aside={<Button href="#blog" variant="secondary" size="sm" arrow>Tutti gli articoli</Button>} />
          <div className={`${GAP.header} grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3`}>
            {others.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

/* ─── Pagina articolo ───────────────────────────────────────────── */
const anchor = (i: number) => `sezione-${i + 1}`;

export function ArticlePage({ slug }: { slug: string }) {
  const a = ARTICLES.find((x) => x.slug === slug);
  const [copied, setCopied] = useState(false);
  if (!a) return null;
  const cat = BLOG_CATEGORIES[a.category];
  const related = ARTICLES.filter((x) => x.slug !== a.slug).sort((x, y) => Number(y.category === a.category) - Number(x.category === a.category)).slice(0, 3);
  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <>
      <Section tone="white" pad="none" className="py-12 sm:py-16">
        <Container>
          <Breadcrumbs items={[{ label: 'Blog', href: '#blog' }, { label: cat.name, href: `#categoria.${a.category}` }, { label: a.title }]} />
          <div className="mx-auto mt-10 max-w-3xl text-center">
            <a href={`#categoria.${a.category}`}>
              <Pill active>{cat.name}</Pill>
            </a>
            <h1 className={`mt-6 ${TYPE.h2} sm:!text-6xl`}>{a.title}</h1>
            <p className={`mx-auto mt-5 max-w-xl ${TYPE.lead} text-mute`}>{a.excerpt}</p>
            <p className="mt-6 flex items-center justify-center gap-3 text-sm">
              <img src={a.authorPhoto} alt="" className="h-9 w-9 rounded-full object-cover" />
              <span>
                <b>{a.author}</b> · <span className="text-mute">{a.date} · {a.read} min di lettura</span>
              </span>
            </p>
          </div>
          <img src={a.cover} alt="" className="mt-12 aspect-[21/9] w-full rounded-3xl object-cover" />

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_280px]">
            <article className="mx-auto w-full max-w-[68ch]">
              {a.sections.map((s, i) => (
                <section key={s.h} id={anchor(i)} className="scroll-mt-28">
                  <h2 className={`${TYPE.h3} sm:!text-3xl ${i ? 'mt-12' : ''}`}>{s.h}</h2>
                  {s.p.map((p, k) => (
                    <p key={k} className="mt-4 text-[17px] leading-[1.75] text-ink/85">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="mt-5 space-y-2.5">
                      {s.list.map((l) => (
                        <li key={l} className="flex gap-3 text-[17px] leading-relaxed text-ink/85">
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand" /> {l}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.quote && (
                    <blockquote className="mt-8 rounded-3xl bg-acid p-7">
                      <Quote className="h-6 w-6 fill-current" />
                      <p className="mt-3 font-heading text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{s.quote}</p>
                    </blockquote>
                  )}
                </section>
              ))}
              <div className="mt-14 flex items-center gap-4 rounded-3xl bg-paper p-6">
                <img src={a.authorPhoto} alt="" className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-heading text-lg font-semibold">{a.author}</p>
                  <p className="text-sm text-mute">Team Influencee · scrive di strategia e creator marketing.</p>
                </div>
              </div>
            </article>
            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <Card className="p-6">
                <p className={`${TYPE.label} text-mute`}>In questo articolo</p>
                <ol className="mt-4 space-y-2.5 text-sm">
                  {a.sections.map((s, i) => (
                    <li key={s.h}>
                      <a href={`#${anchor(i)}`} onClick={(e) => go(e, anchor(i))} className="flex gap-2 hover:text-brand">
                        <span className="tabular-nums text-mute">{i + 1}.</span> {s.h}
                      </a>
                    </li>
                  ))}
                </ol>
                <button type="button" onClick={copy} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-semibold ring-1 ring-line">
                  <Link2 className="h-4 w-4" /> {copied ? 'Link copiato' : 'Copia il link'}
                </button>
              </Card>
              <div className="rounded-3xl bg-ink p-6 text-white">
                <p className="font-heading text-xl font-semibold leading-tight">Vuoi applicarlo alla tua campagna?</p>
                <p className="mt-2 text-sm text-white/70">Ricevi una shortlist di creator in 48 ore.</p>
                <a href="#contatti" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-acid py-2.5 text-sm font-semibold text-ink">
                  Parliamone <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
      <RelatedArticles items={related} />
      <Newsletter />
    </>
  );
}

function RelatedArticles({ items, tone = 'white' }: { items: Article[]; tone?: Tone }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="split" title="Articoli *correlati*" aside={<Button href="#blog" variant="secondary" size="sm" arrow>Vai al blog</Button>} />
        <div className={`${GAP.header} grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3`}>
          {items.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Row: ultimi articoli (home) ───────────────────────────────── */
export function LatestArticles({ tone = 'white' }: { tone?: Tone }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader align="split" eyebrow="Blog" title="Dal nostro *blog*" lead="Guide e casi studio per lavorare meglio con i creator." aside={<div className="mt-6"><Button href="#blog" variant="secondary" arrow>Tutti gli articoli</Button></div>} />
        <div className={`${GAP.header} grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3`}>
          {ARTICLES.slice(0, 3).map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
