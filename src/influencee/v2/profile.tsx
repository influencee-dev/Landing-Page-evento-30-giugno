import React from 'react';
import { BadgeCheck, Instagram, MapPin, Users } from 'lucide-react';
import { Button } from '../ds';
import { CATEGORIES, MARKET, REGIONS, TIERS, cityPath, regionPath, type QA } from './data';
import { CreatorList } from './creators';
import { ENV } from './env';
import { FaqSeo, HeroPlatform, type Crumb } from './rows';
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
  where: string; // città, altrimenti regione, altrimenti Italia
  updated: string;
}

/** Profilo con i segnaposto: serve solo alla build del plugin. */
export const TOKENS: Profile = Object.fromEntries(
  ['id', 'name', 'handle', 'instagram', 'image', 'bio', 'category', 'categoryUrl', 'city', 'cityUrl', 'region', 'regionUrl', 'citySlug', 'regionSlug', 'catTerms', 'followers', 'tier', 'tierRange', 'tierEr', 'tierCost', 'price', 'updated', 'where'].map((k) => [k, `{{${k}}}`]),
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
  const stat = (k: string, v: string, accent = false) => (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-acid text-ink' : 'bg-paper text-ink'}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-60">{k}</p>
      <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">{v}</p>
    </div>
  );
  return (
    <>
      <HeroPlatform
        crumbs={crumbs}
        eyebrow={`Influencer ${p.category}`}
        title={`*${p.name}*\ninfluencer a ${p.where}`}
        lead={p.bio || `${p.name} è un creator ${p.category.toLowerCase()} su Instagram con ${p.followers} follower.`}
        actions={
          <>
            <Button href="#lead-creator_profilo">Vuoi collaborare? Scrivici</Button>
            <Button href={p.instagram} variant="secondary">
              Profilo Instagram
            </Button>
          </>
        }
        note={`Dati dal profilo Instagram pubblico, aggiornati il ${p.updated}.`}
        visual={
          <div className="mx-auto max-w-[460px] rounded-[28px] bg-white p-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-4">
              <Opt when="image" value={p.image}>
                <img src={p.image} alt={p.name} width={80} height={80} className="h-20 w-20 flex-none overflow-hidden rounded-full bg-acid-soft object-cover text-[0px] ring-4 ring-acid" />
              </Opt>
              <div className="min-w-0">
                <p className="truncate font-heading text-2xl font-semibold tracking-tight">{p.name}</p>
                <a href={p.instagram} rel="nofollow noopener" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
                  <Instagram className="h-4 w-4" /> @{p.handle}
                </a>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
                  <a href={p.categoryUrl} className="rounded-full bg-paper px-2.5 py-1">
                    {p.category}
                  </a>
                  <Opt when="city" value={p.city}>
                    <a href={p.cityUrl} className="inline-flex items-center gap-1 rounded-full bg-paper px-2.5 py-1">
                      <MapPin className="h-3 w-3" /> {p.city}
                    </a>
                  </Opt>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {stat('Follower', p.followers, true)}
              {stat('Fascia', p.tier)}
              <Opt when="price" value={p.price}>
                {stat('Prezzo indicato', p.price)}
              </Opt>
              {stat(`Costo medio ${p.tier}`, p.tierCost)}
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-mute">
              <Users className="mt-0.5 h-3.5 w-3.5 flex-none" /> Fascia {p.tier}: {p.tierRange} follower · engagement medio su Instagram {p.tierEr} · costo medio di un post {p.tierCost} (DeRev)
            </p>
          </div>
        }
      />
      <ToolLead
        tool="creator_profilo"
        context={`Creator: ${p.name} (@${p.handle}) · ${p.category} · ${p.where}`}
        eyebrow="Collaborazione"
        title={`Vuoi collaborare\ncon *${p.name}*?`}
        lead="Lasciaci i contatti e due righe sul progetto: il team verifica disponibilità e condizioni e ti propone anche creator simili."
        bullets={['Disponibilità e prezzo del creator', 'Creator simili della stessa zona', 'Nessun impegno']}
        cta="Chiedi una collaborazione"
      />
      <CreatorList title={`Altri creator\n*a ${p.where}*`} lead="Altri profili della stessa zona presenti nel sito." filter={{ city: p.citySlug, region: p.regionSlug, limit: 8, exclude: p.id }} />
      <FaqSeo items={profileFaq(p)} aside={<div className="flex items-center gap-3 rounded-3xl bg-acid-soft p-5 text-sm"><BadgeCheck className="h-5 w-5 flex-none" /> Sei {p.name}? Puoi chiedere di modificare o togliere il profilo scrivendoci su WhatsApp.</div>} />
    </>
  );
}
