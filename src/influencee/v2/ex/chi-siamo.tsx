import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../../ds';
import { APP, FACTS, SITE, WHATSAPP, type QA } from '../data';
import { CollabMock, KitMock, SearchMock, TrustMock } from '../mocks';
import { AnswerBox, AudienceRow, CtaDual, FaqSeo, FeatureSplit, HeroPlatform, Related } from '../rows';
import { ToolLead } from '../tools';
import type { ExPage } from './types';

/* /chi-siamo/ — pagina ex Elementor rifatta nel template v2 (testo originale: copia del 22/10/2026).
   Si cerca il brand (posizione media 1,9): la pagina resta "Chi siamo" di Influencee.
   Storia, valori e founders sono quelli del vecchio testo; le foto dei founders sono quelle
   già pubblicate su influencee.it/wp-content. Nessun numero oltre a FACTS. */

const FOUNDERS = [
  { name: 'Giorgia Palazzo', role: 'Geek manager, digital e founder', photo: `${SITE.url}/wp-content/uploads/2022/04/WhatsApp-Image-2022-03-16-at-23.39.34.jpeg` },
  { name: 'Manuel Arlotti', role: 'General nerd, growth hacker e sales addicted', photo: `${SITE.url}/wp-content/uploads/2024/04/MANU-FULL.jpg` },
  { name: 'Giuseppe Bonaccorso', role: 'Project manager, content e gamer dal 1983', photo: `${SITE.url}/wp-content/uploads/2022/04/unnamed-2-e1648815637334.jpg` },
  { name: 'Pietro Palazzo', role: 'Innovation manager e full stack developer', photo: `${SITE.url}/wp-content/uploads/2022/04/1592688509279.jpg` },
];

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/influencee.it/', icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/influencee-it/', icon: Linkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/influencee.it', icon: Facebook },
];

const FAQ_CHI: QA[] = [
  { q: 'Chi ha fondato Influencee?', a: 'Influencee è stata fondata da Giorgia Palazzo, Manuel Arlotti, Giuseppe Bonaccorso e Pietro Palazzo: un team di appassionati di digital, comunicazione e tool online con esperienza in advertising e social media.' },
  { q: 'Quale società c’è dietro Influencee?', a: `Influencee è un marchio di ${SITE.company}.` },
  { q: 'Influencee è un’agenzia o una piattaforma?', a: 'Tutte e due. Influencee è una piattaforma italiana di influencer marketing che brand e agenzie usano in autonomia, e il team può anche gestire per te l’intera campagna con i creator, come un’agenzia.' },
  { q: 'Cosa significa trasparenza per Influencee?', a: 'Che ogni numero di un creator dice da dove arriva (dichiarato, autenticato, osservato o stimato) e quando è stato aggiornato, che il badge Verificato arriva solo da un account collegato e che ricerca e categorie seguono regole chiare, senza intelligenza artificiale.' },
  { q: 'Come contatto il team di Influencee?', a: `Scrivici su WhatsApp al ${WHATSAPP.number} o via email a info@influencee.it, oppure lascia i tuoi contatti nel modulo di questa pagina: ti ricontatta una persona del team.` },
];

/* ─── Visual hero: il team in una card (foto già pubblicate sul sito) ─ */
function TeamCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-[28px] bg-white p-5 text-ink shadow-float sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-semibold">Il team di Influencee</p>
        <span className="rounded-full bg-acid px-2.5 py-1 text-[11px] font-semibold">Founders</span>
      </div>
      <ul className="mt-4 divide-y divide-line">
        {FOUNDERS.map((f, i) => (
          <li key={f.name} className="flex items-center gap-3 py-3">
            <img src={f.photo} alt={f.name} loading={i < 2 ? 'eager' : 'lazy'} className="h-12 w-12 flex-none rounded-full object-cover object-top" />
            <div className="min-w-0">
              <p className="font-heading text-[15px] font-semibold">{f.name}</p>
              <p className="truncate text-xs text-mute">{f.role}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-1.5 rounded-2xl bg-paper px-3 py-2.5 text-xs text-mute">
        <BadgeCheck className="h-4 w-4 text-brand" /> Influencee è un marchio di {SITE.company}
      </p>
    </div>
  );
}

/* ─── Visual: come ci siamo trovati (Rimini) ─────────────────────── */
function OriginCard() {
  return (
    <div className="mx-auto max-w-[460px] rounded-[28px] bg-ink p-6 text-white shadow-float sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-acid text-ink">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">Dove ci siamo incontrati</p>
          <p className="font-heading text-2xl font-semibold">Rimini</p>
        </div>
      </div>
      <p className="mt-6 text-sm text-white/70">Le passioni in comune:</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {['Digital', 'Comunicazione', 'Tool online', 'Advertising', 'Social media', 'Smanettoni'].map((t, i) => (
          <span key={t} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${i % 3 === 0 ? 'bg-acid text-ink' : i % 3 === 1 ? 'bg-brand text-white' : 'bg-white/10 text-white'}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Visual: mission e vision ───────────────────────────────────── */
function MissionCard() {
  return (
    <div className="mx-auto grid max-w-[460px] gap-3">
      <div className="rounded-[26px] bg-brand p-6 text-white">
        <p className={`${TYPE.label} text-white/75`}>Mission</p>
        <p className="mt-3 font-heading text-2xl font-semibold leading-tight tracking-tight">Aiutare chi investe a capire davvero i creator con cui lavora</p>
      </div>
      <div className="rounded-[26px] bg-acid p-6 text-ink">
        <p className={`${TYPE.label} text-ink/60`}>Vision</p>
        <p className="mt-3 font-heading text-2xl font-semibold leading-tight tracking-tight">Un mondo digitale trasparente, basato sui dati</p>
      </div>
    </div>
  );
}

/* ─── Founders: griglia con foto e ruolo ─────────────────────────── */
function FoundersRow() {
  return (
    <Section tone="white">
      <Container>
        <SectionHeader eyebrow="Il team" title={'I *founders*'} lead="Quattro profili diversi, una passione in comune: rendere il lavoro tra brand e creator più semplice e più chiaro." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} sm:grid-cols-2 lg:grid-cols-4`}>
          {FOUNDERS.map((f, i) => (
            <motion.figure key={f.name} {...reveal(i)} className="overflow-hidden rounded-3xl bg-paper">
              <img src={f.photo} alt={f.name} loading="lazy" className="aspect-[4/5] w-full object-cover object-top" />
              <figcaption className="p-6">
                <p className={TYPE.h3}>{f.name}</p>
                <p className="mt-1 text-sm text-mute">{f.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Contatti: WhatsApp, email, social ──────────────────────────── */
function ContactCards() {
  const cards = [
    { icon: MessageCircle, t: 'WhatsApp', x: WHATSAPP.number, href: WHATSAPP.href, c: 'bg-[#25d366] text-ink' },
    { icon: Mail, t: 'Email', x: 'info@influencee.it', href: 'mailto:info@influencee.it', c: 'bg-brand text-white' },
    { icon: ArrowRight, t: 'Pagina contatti', x: 'Demo, aiuto e preventivi', href: '#/contatti-influencee/', c: 'bg-ink text-white' },
  ];
  return (
    <Section tone="paper">
      <Container>
        <SectionHeader eyebrow="Contatti" title={'Vuoi fare\n*due chiacchiere* con noi?'} lead="Se ti serve una consulenza o vuoi vedere la piattaforma con il tuo settore, scrivici: ti risponde una persona del team." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} sm:grid-cols-3`}>
          {cards.map((c, i) => (
            <motion.a key={c.t} href={c.href} {...reveal(i)} className="group flex items-center gap-4 rounded-3xl bg-white p-6 ring-1 ring-line transition hover:-translate-y-1">
              <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${c.c}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-lg font-semibold tracking-tight">{c.t}</span>
                <span className="block truncate text-sm text-mute">{c.x}</span>
              </span>
            </motion.a>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold ring-1 ring-line transition hover:bg-brand-soft">
              <s.icon className="h-4 w-4" /> {s.label}
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ChiSiamo() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Chi siamo' }]}
        eyebrow="Chi siamo"
        title={'Nerd del digitale,\n*dalla parte dei dati*'}
        lead="Siamo il team di Influencee: esperti di advertising e social media che da anni aiutano i clienti a raggiungere i loro risultati online. Oggi lo facciamo con una piattaforma italiana di influencer marketing in cui ogni numero dice da dove arriva."
        actions={
          <>
            <Button href="#/contatti-influencee/">Contattaci</Button>
            <Button href={APP.creator} variant="secondary">
              Iscriviti gratis
            </Button>
          </>
        }
        visual={<TeamCard className="mx-auto max-w-[440px]" />}
        note={`Influencee è un marchio di ${SITE.company}`}
      />
      <AnswerBox
        q="Chi c’è dietro Influencee?"
        a={`Influencee è un marchio di ${SITE.company}, fondato da Giorgia Palazzo, Manuel Arlotti, Giuseppe Bonaccorso e Pietro Palazzo. È una piattaforma italiana di influencer marketing: aziende e agenzie trovano creator italiani con numeri verificabili e gestiscono le collaborazioni, i creator si iscrivono gratis e ricevono proposte. Se preferisci delegare, il team gestisce la campagna per te.`}
        points={['Un team di nerd del digitale', 'Solo creator italiani', 'Numeri con la loro fonte', 'Piattaforma e servizio gestito']}
      />
      <FeatureSplit
        tone="white"
        eyebrow="La nostra storia"
        title={'Amici *sin da subito*'}
        lead="Abbiamo unito le nostre forze costruendo un team davvero unico."
        items={[
          {
            eyebrow: 'Come ci siamo trovati',
            title: 'Le nostre strade si sono incrociate a Rimini',
            text: 'Alcune storie iniziano ancora prima che le persone si conoscano. Noi ci siamo ritrovati quasi per caso a condividere lo stesso percorso: appassionati di digital, comunicazione e tool online, smanettoni e super nerd. Da quando ci siamo incontrati a Rimini non ci siamo più divisi.',
            bullets: ['Esperienza in advertising e social media', 'Ruoli tecnici, creativi e commerciali nello stesso team', 'Passione per i dati e per i tool online'],
            visual: <OriginCard />,
            href: '#/contatti-influencee/',
            cta: 'Scrivici',
          },
        ]}
      />
      <FeatureSplit
        tone="paper"
        eyebrow="In cosa crediamo"
        title={'La trasparenza\n*prima di tutto*'}
        lead="Vogliamo aiutare gli inserzionisti a capire i creator con cui investono, e costruire un mondo digitale trasparente basato sui dati."
        items={[
          {
            eyebrow: 'Mission e vision',
            title: 'Capire i creator prima di investire',
            text: 'Chi investe in influencer marketing deve sapere con chi lavora: chi è il creator, che pubblico ha, quanto coinvolge la sua community e con quali brand ha già collaborato. Per questo abbiamo costruito Influencee.',
            bullets: ['Solo creator italiani', 'Engagement confrontato con la fascia di follower', 'Brand citati con #adv nei contenuti recenti'],
            visual: <MissionCard />,
          },
          {
            eyebrow: 'Trasparenza nei fatti',
            title: 'Ogni dato dice da dove arriva',
            text: 'Nella scheda di ogni creator i numeri sono dichiarati, autenticati, osservati o stimati, sempre con la data dell’ultimo aggiornamento. Il badge Verificato arriva solo da un account collegato con il login ufficiale o dalla verifica dello staff.',
            bullets: ['Niente intelligenza artificiale: regole chiare', 'Social collegati in sola lettura', 'Contatti solo se il creator è contattabile'],
            visual: <TrustMock />,
            href: '#/creator-verificati/',
            cta: 'Come verifichiamo i creator',
          },
        ]}
      />
      <FoundersRow />
      <AudienceRow
        tone="paper"
        items={[
          { tag: 'Piattaforma', title: 'Fai da te, con i dati', text: 'Cerca i creator, pubblica un annuncio, gestisci la collaborazione e conta i click. Senza commissioni sul brand.', href: '#/piattaforma-influencer/', cta: 'Scopri la piattaforma', visual: <SearchMock locked={false} /> },
          { tag: 'Agenzia', title: 'La campagna la gestiamo noi', text: 'Il team sceglie i creator con te, prepara brief e accordi, segue i contenuti e misura i risultati.', href: '#/agenzia-influencer/', cta: 'Agenzia influencer', visual: <CollabMock />, dark: true },
          { tag: 'Creator', title: 'Il tuo lavoro in ordine', text: 'Media kit aggiornato, proposte dai brand, contratti e scadenze in un posto solo. Iscrizione gratuita.', href: '#/diventa-creator/', cta: 'Per i creator', visual: <KitMock /> },
        ]}
      />
      <ContactCards />
      <ToolLead
        tool="chi_siamo"
        tone="white"
        context="Pagina: Chi siamo"
        eyebrow="Scrivici"
        title={'Ti richiamiamo\n*noi*'}
        lead="Lascia nome ed email: una persona del team ti ricontatta per una consulenza o una demo con il tuo settore, senza impegno."
        bullets={['Consulenza gratuita', `Demo con creator del tuo settore`, `${FACTS.trialDays} giorni di Premium in prova`]}
        cta="Contattatemi"
      />
      <FaqSeo items={FAQ_CHI} />
      <Related
        links={[
          { label: 'Piattaforma influencer', text: 'Ricerca, campagne, contratti e link', href: '#/piattaforma-influencer/' },
          { label: 'Agenzia influencer', text: 'La campagna gestita dal team', href: '#/agenzia-influencer/' },
          { label: 'Come funziona', text: 'Il tutorial della piattaforma', href: '#/tutorial-piattaforma-influencee/' },
          { label: 'Contatti', text: 'WhatsApp, email e demo', href: '#/contatti-influencee/' },
        ]}
      />
      <CtaDual />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/chi-siamo/',
  ready: true,
  titles: ['Chi siamo: il team e la storia di Influencee', 'Chi siamo: il team di Influencee', 'Chi siamo'],
  meta: {
    label: 'Chi siamo',
    type: 'page',
    kw: 'influencee chi siamo',
    description: `Chi siamo: il team di Influencee, marchio di ${SITE.company}. La nostra storia, i founders e perché crediamo in un influencer marketing trasparente.`,
    crumbs: [{ label: 'Chi siamo' }],
    faq: FAQ_CHI,
  },
  el: () => <ChiSiamo />,
};
