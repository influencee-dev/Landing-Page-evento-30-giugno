import React from 'react';
import { BadgeCheck, Instagram, MapPin } from 'lucide-react';
import { Button, Container, Pill, Section, TYPE } from '../ds';
import { CATEGORIES, MARKET, REGIONS, TIERS, cityPath, regionPath, type QA } from './data';
import { CreatorList } from './creators';
import { ENV } from './env';
import { Crumbs, FaqSeo, type Crumb } from './rows';
import { ToolLead } from './tools';

/* ════════════════════════════════════════════════════════════════════
   PAGINA PROFILO CREATOR (/creator/<slug>/) con la grafica del sito
   I dati arrivano dal plugin dei profili del sito (igm, /wp-json/igm/v1/creators).
   · Plugin WordPress: la build genera un modello HTML con segnaposto {{campo}}
     e blocchi facoltativi <!--IF:campo-->…<!--/IF:campo-->; PHP li riempie per
     ognuno dei 325 profili (testo leggibile da Google senza JavaScript).
   · Nel browser la stessa pagina si ridisegna con i dati veri (window.INFLUENCEE_TOOLS.profile).
   La bio arriva già senza email e telefoni.
   ════════════════════════════════════════════════════════════════════ */

export interface Profile {
  id: number | string;
  name: string;
  handle: string;
  instagram: string;
  image: string;
  bio: string;
  category: string; // etichetta italiana
  categoryUrl: string;
  city: string;
  cityUrl: string;
  region: string;
  regionUrl: string;
  citySlug: string;
  regionSlug: string;
  catTerms: string;
  followers: string; // es. 52,2K
  tier: string; // Nano, Micro…
  tierRange: string;
  tierEr: string;
  tierCost: string;
  price: string; // fascia di prezzo indicata dal creator, può essere vuota
  cta: string; // link alla campagna su campaign.influencee.it, può essere vuoto
  where: string; // città, altrimenti regione, altrimenti Italia
  updated: string;
}

/** Profilo con i segnaposto: serve solo alla build del plugin. */
export const TOKENS: Profile = Object.fromEntries(
  ['id', 'name', 'handle', 'instagram', 'image', 'bio', 'category', 'categoryUrl', 'city', 'cityUrl', 'region', 'regionUrl', 'citySlug', 'regionSlug', 'catTerms', 'followers', 'tier', 'tierRange', 'tierEr', 'tierCost', 'price', 'updated', 'where', 'cta'].map((k) => [k, `{{${k}}}`]),
) as unknown as Profile;

/** Blocco facoltativo: nel modello è racchiuso tra commenti che PHP toglie se il dato manca. */
function Opt({ when, value, children }: { when: keyof Profile; value: string; children: React.ReactNode }) {
  const tokens = ENV.ssr && value === `{{${when}}}`;
  if (!tokens) return value ? <>{children}</> : null;
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: `<!--IF:${when}-->` }} />
      {children}
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: `<!--/IF:${when}-->` }} />
    </>
  );
}

/** Dati di contorno per PHP: fasce, categorie e città (stessi valori del sito). */
export function profileData() {
  const cats: Record<string, { name: string; url: string; terms: string }> = {};
  CATEGORIES.forEach((c) => c.wp.forEach((t) => (cats[t] = { name: c.name, url: `/${c.slug}/`, terms: c.wp.join(',') })));
  const cities: Record<string, { name: string; region: string; regionSlug: string; url: string; regionUrl: string }> = {};
  const regions: Record<string, { name: string; url: string }> = {};
  REGIONS.forEach((r) => {
    regions[r.slug] = { name: r.name, url: regionPath(r) };
    r.cities.forEach((ct) => (cities[ct.slug] = { name: ct.name, region: r.name, regionSlug: r.slug, url: cityPath(r, ct), regionUrl: regionPath(r) }));
  });
  const tiers: Record<string, { name: string; range: string; er: string; cost: string }> = {};
  TIERS.forEach((t, i) => (tiers[t.id] = { name: t.name, range: t.range, er: `${String(MARKET.erIG[i].v).replace('.', ',')}%`, cost: `${String(MARKET.costIG[i].v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €` }));
  return { cats, cities, regions, tiers, faq: profileFaq(TOKENS) };
}

/** Frase facoltativa nei testi: nel modello è racchiusa tra [[IF:campo]] e [[/IF:campo]]. */
const optText = (p: Profile, k: keyof Profile, text: string) => (ENV.ssr && p[k] === `{{${k}}}` ? `[[IF:${k}]]${text}[[/IF:${k}]]` : p[k] ? text : '');

export function profileFaq(p: Profile): QA[] {
  return [
    { q: `Quanto costa una collaborazione con ${p.name}?`, a: `${optText(p, 'price', `${p.name} indica una fascia di prezzo di ${p.price} a contenuto. `)}Per i creator della fascia ${p.tier} (${p.tierRange} follower) il costo medio di un post Instagram in Italia è di circa ${p.tierCost} (fonte DeRev). Il prezzo finale dipende da formato, numero di contenuti e diritti d’uso.` },
    { q: `Come contattare ${p.name} per una collaborazione?`, a: `Compila il modulo in questa pagina: il team di Influencee verifica disponibilità e condizioni e ti risponde. In alternativa puoi cercare creator simili con i filtri della piattaforma.` },
    { q: `Da dove vengono i dati di questo profilo?`, a: `Dal profilo Instagram pubblico del creator, aggiornati il ${p.updated}. I numeri possono cambiare: nella piattaforma i creator che collegano l’account mostrano dati aggiornati e il badge Verificato.` },
  ];
}

export function CreatorProfile({ p }: { p: Profile }) {
  const crumbs: Crumb[] = [{ label: 'Influencer italiani', href: '#/influencer-italiani/' }];
  if (p.region) crumbs.push({ label: `Influencer ${p.region}`, href: p.regionUrl, opt: 'region' });
  if (p.city) crumbs.push({ label: `Influencer ${p.city}`, href: p.cityUrl, opt: 'city' });
  crumbs.push({ label: p.name });
  const stat = (v: string, l: string, accent = false) => (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-acid text-ink' : 'bg-white/8 ring-1 ring-white/10'}`}>
      <p className="truncate font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{v}</p>
      <p className="mt-1 text-xs opacity-70">{l}</p>
    </div>
  );
  return (
    <>
      <Section tone="ink" pad="none" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(255,31,143,0.28),transparent_65%)]" />
        <Container className="relative text-center">
          <Crumbs center items={crumbs} />
          <Opt when="image" value={p.image}>
            <img src={p.image} alt={p.name} width={112} height={112} className="mx-auto mt-10 h-28 w-28 overflow-hidden rounded-full bg-white/10 object-cover text-[0px] ring-4 ring-acid ring-offset-4 ring-offset-ink" />
          </Opt>
          <h1 className={`mt-6 ${TYPE.display}`}>{p.name}</h1>
          <p className="mt-3 text-lg text-white/60">
            Influencer {p.category.toLowerCase()} a {p.where} ·{' '}
            <a href={p.instagram} rel="nofollow noopener" className="font-semibold text-white hover:text-acid">
              @{p.handle}
            </a>
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a href={p.categoryUrl}>
              <Pill active>{p.category}</Pill>
            </a>
            <Opt when="city" value={p.city}>
              <a href={p.cityUrl}>
                <Pill>
                  <MapPin className="h-3.5 w-3.5" /> {p.city}
                </Pill>
              </a>
            </Opt>
            <Pill>Fascia {p.tier}</Pill>
            <Pill>
              <Instagram className="h-3.5 w-3.5" /> Instagram
            </Pill>
            <Opt when="price" value={p.price}>
              <Pill>Prezzo indicato: {p.price}</Pill>
            </Opt>
          </div>
          <p className={`mx-auto mt-6 max-w-xl ${TYPE.lead} text-white/70`}>{p.bio}</p>
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
            {stat(p.followers, 'follower')}
            {stat(p.tier, 'fascia')}
            {stat(p.tierCost, `costo medio post ${p.tier}`, true)}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="#lead-creator_profilo">Proponi una collaborazione</Button>
            <Opt when="cta" value={p.cta}>
              <Button href={p.cta} variant="secondary">
                Invitalo a una campagna
              </Button>
            </Opt>
            <Button href={p.instagram} variant="secondary">
              <Instagram className="h-4 w-4" /> Profilo Instagram
            </Button>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-xs text-white/45">
            Profilo reale da influencee.it, dati dal profilo Instagram pubblico aggiornati il {p.updated}. Fascia {p.tier} ({p.tierRange} follower): engagement medio su Instagram {p.tierEr}, costo medio di un post {p.tierCost} (fonti ONIM e DeRev).
          </p>
        </Container>
      </Section>
      <ToolLead
        tool="creator_profilo"
        context={`Creator: ${p.name} (@${p.handle}) · ${p.category} · ${p.where}`}
        eyebrow="Collaborazione"
        title={`Vuoi collaborare\ncon *${p.name}*?`}
        lead="Lasciaci i contatti e due righe sul progetto: il team verifica disponibilità e condizioni e ti propone anche creator simili."
        bullets={['Disponibilità e prezzo del creator', 'Creator simili della stessa zona', 'Nessun impegno']}
        cta="Chiedi una collaborazione"
      />
      <CreatorList title={'Creator\n*simili*'} lead={`Altri creator della stessa zona su influencee: apri la scheda per vedere follower, fascia e costo medio.`} filter={{ city: p.citySlug, region: p.regionSlug, limit: 8, exclude: p.id }} />
      <FaqSeo items={profileFaq(p)} aside={<div className="flex items-center gap-3 rounded-3xl bg-acid-soft p-5 text-sm"><BadgeCheck className="h-5 w-5 flex-none" /> Sei {p.name}? Puoi chiedere di modificare o togliere il profilo scrivendoci su WhatsApp.</div>} />
    </>
  );
}
