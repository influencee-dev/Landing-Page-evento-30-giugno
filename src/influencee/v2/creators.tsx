import React from 'react';
import { Container, GAP, Section, SectionHeader, type Tone } from '../ds';
import { WHATSAPP } from './data';
import { ENV } from './env';

/* ════════════════════════════════════════════════════════════════════
   PROFILI DEI CREATOR (dal sito WordPress, tipo di contenuto "creator")
   Sulle pagine città, regione, categoria, hub e home le ricerche sono
   di tipo "lista" ("influencer napoletani", "creator italiani"): servono
   i profili veri. Li inserisce il plugin WordPress nell'HTML (segnaposto
   <!--INFLUENCEE_CREATORS:filtro-->) con il dato strutturato ItemList.
   Nell'anteprima v2 si vedono solo schede vuote: nessun profilo inventato.
   Mostriamo nome, handle, città, categoria e foto: mai email o telefoni
   presenti nelle bio.
   ════════════════════════════════════════════════════════════════════ */

export interface CreatorFilter {
  city?: string; // slug tassonomia creator_city
  region?: string; // slug creator_region (o regione per riempire la città)
  cat?: string[]; // slug creator_category
  limit?: number;
  exclude?: number | string; // id del profilo da non ripetere (pagina profilo)
}

export const creatorKey = (f: CreatorFilter) =>
  [f.city && `city=${f.city}`, f.region && `region=${f.region}`, f.cat?.length && `cat=${f.cat.join(',')}`, `limit=${f.limit ?? 12}`, f.exclude && `exclude=${f.exclude}`].filter(Boolean).join('&');

export function CreatorList({ title, lead, filter, tone = 'white' }: { title: string; lead?: string; filter: CreatorFilter; tone?: Tone }) {
  const key = creatorKey(filter);
  const live = typeof window !== 'undefined' ? window.INFLUENCEE_TOOLS?.creators?.[key] : undefined;
  let body: React.ReactNode;
  if (ENV.embed && ENV.ssr) body = <div dangerouslySetInnerHTML={{ __html: `<!--INFLUENCEE_CREATORS:${key}-->` }} />;
  else if (ENV.embed && live !== undefined) body = <div dangerouslySetInnerHTML={{ __html: live }} />;
  else
    body = (
      // anteprima v2: stesse classi delle card generate da WordPress (così il CSS le contiene)
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: Math.min(filter.limit ?? 12, 8) }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
            <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-paper font-heading text-sm font-semibold text-mute">··</span>
            <span className="min-w-0">
              <span className="block h-3 w-24 rounded bg-paper" />
              <span className="mt-2 block h-2.5 w-16 rounded bg-paper" />
            </span>
          </div>
        ))}
        <p className="col-span-full text-xs text-mute">Anteprima: su influencee.it qui compaiono i profili dei creator.</p>
      </div>
    );
  return (
    <Section tone={tone} id="creator">
      <Container>
        <SectionHeader align="left" eyebrow="Creator" title={title} lead={lead} />
        <div className={GAP.header}>{body}</div>
        <p className="mt-6 text-xs text-mute">
          Sei uno di questi creator? Puoi chiedere di modificare o togliere il tuo profilo:{' '}
          <a href={WHATSAPP.href} className="font-semibold text-brand-ink underline">
            scrivici
          </a>
          .
        </p>
      </Container>
    </Section>
  );
}

/* Classi usate dalle card generate in PHP (wp-plugin/influencee-tools): elencate qui perché Tailwind le includa nel CSS. */
export const CREATOR_CARD_CLASSES =
  'group flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand h-12 w-12 flex-none overflow-hidden rounded-full bg-acid object-cover font-heading text-sm font-semibold min-w-0 block truncate text-[15px] text-xs text-mute text-brand-ink grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 col-span-full p-8 text-center';
