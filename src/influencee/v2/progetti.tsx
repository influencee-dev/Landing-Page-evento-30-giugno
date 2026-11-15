import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, CreditCard, Heart, LayoutTemplate, MessageCircle, Repeat, Smartphone, X } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../ds';
import { WHATSAPP, type QA } from './data';
import { asset } from './env';
import { CardGrid, CtaDual, FaqSeo, HeroPlatform } from './rows';

/* /progetti-creator/ — offerta «Costruisci un progetto con noi» per i creator (modello Creator Infrastructure
   Partner, documento interno dei soci del 15/11/2026). Pubblico: creator di nicchia 15–150k follower
   (finanza, business, carriera, tech, fitness, professioni). Tono a risposta diretta: promessa, problema,
   meccanismo, regole chiare, per chi è / non è, posti limitati, contatto diretto con Fabrizia su WhatsApp.
   Nessun dato interno (proiezioni, percentuali) e nessun numero non verificabile. */

/** WhatsApp per i creator: arriva a Fabrizia. Se Fabrizia avrà un numero suo, basta cambiare `tel`. */
export const FABRIZIA = {
  name: 'Fabrizia Marra',
  role: 'Growth & Influencer Manager',
  photo: 'team-fabrizia-marra.webp',
  tel: WHATSAPP.tel.replace('+', ''),
  wa(msg = 'Ciao Fabrizia, sono un creator e vorrei costruire un progetto con Influencee. Il mio profilo è: ') {
    return `https://wa.me/${this.tel}?text=${encodeURIComponent(msg)}`;
  },
};

/* ─── Il «video»: come funziona la collaborazione, in 5 scene che scorrono da sole ─── */
const SCENES = [
  { icon: Smartphone, t: 'Pubblichi un contenuto', x: 'Un reel utile per la tua community, che finisce con «Commenta SISTEMA».', screen: 'post' },
  { icon: MessageCircle, t: 'Il messaggio parte da solo', x: 'Chi commenta riceve subito un DM con una o due domande: capiamo chi è pronto a comprare.', screen: 'dm' },
  { icon: LayoutTemplate, t: 'Arriva sulla tua pagina', x: 'Una pagina semplice, con un tuo video che spiega l’offerta. La costruiamo noi.', screen: 'page' },
  { icon: CreditCard, t: 'Paga, e l’incasso si divide', x: 'Il pagamento si divide in automatico tra te e Influencee, nel momento stesso in cui entra.', screen: 'pay' },
  { icon: Repeat, t: 'Il cliente resta', x: 'Email e WhatsApp automatici per rinnovi e nuovi prodotti: il valore cresce nel tempo.', screen: 'loop' },
] as const;

function Screen({ kind }: { kind: (typeof SCENES)[number]['screen'] }) {
  if (kind === 'post')
    return (
      <div className="flex h-full flex-col">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <img src={asset(FABRIZIA.photo)} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-x-3 bottom-3 rounded-xl bg-black/60 px-3 py-2 text-[12px] font-semibold text-white backdrop-blur">3 errori che ti fanno perdere clienti</span>
        </div>
        <div className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-[12px] text-white/80">
          <b className="text-white">marco_finanza</b> SISTEMA 🔥
        </div>
        <div className="mt-1.5 rounded-xl bg-white/10 px-3 py-2 text-[12px] text-white/80">
          <b className="text-white">giulia.career</b> SISTEMA
        </div>
      </div>
    );
  if (kind === 'dm')
    return (
      <div className="flex h-full flex-col justify-end gap-2 text-[12px]">
        <p className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-white">Ciao! Ecco il sistema 👇 Prima una domanda: lo usi per te o per la tua azienda?</p>
        <p className="max-w-[70%] self-end rounded-2xl rounded-br-md bg-[#e6007e] px-3 py-2 text-white">Per la mia azienda</p>
        <p className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-white">Perfetto: qui trovi come lavorarci insieme →</p>
      </div>
    );
  if (kind === 'page')
    return (
      <div className="flex h-full flex-col gap-2.5">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
          <img src={asset(FABRIZIA.photo)} alt="" className="h-full w-full object-cover opacity-70" />
          <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#c8ff00] text-ink">▶</span>
        </div>
        <p className="font-heading text-[15px] font-semibold leading-tight text-white">Il workshop in 4 settimane</p>
        <div className="space-y-1.5">
          {['Live ogni settimana', 'Community privata', 'Posti limitati'].map((x) => (
            <p key={x} className="flex items-center gap-2 text-[12px] text-white/75">
              <Check className="h-3.5 w-3.5 text-[#c8ff00]" /> {x}
            </p>
          ))}
        </div>
        <span className="mt-auto rounded-full bg-[#c8ff00] py-2 text-center text-[12px] font-bold text-ink">Iscriviti</span>
      </div>
    );
  if (kind === 'pay')
    return (
      <div className="flex h-full flex-col justify-center gap-3">
        <p className="text-center text-[11px] uppercase tracking-[0.14em] text-white/55">Pagamento ricevuto</p>
        <p className="text-center font-heading text-3xl font-semibold text-white">100%</p>
        <div className="flex h-3 overflow-hidden rounded-full">
          <span className="w-[60%] bg-[#c8ff00]" />
          <span className="w-[40%] bg-[#e6007e]" />
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-[#c8ff00]">Al creator</span>
          <span className="text-[#ff5fb5]">A Influencee</span>
        </div>
        <p className="text-center text-[11px] text-white/55">Diviso in automatico, senza rendiconti a mano</p>
      </div>
    );
  return (
    <div className="flex h-full flex-col justify-center gap-2 text-[12px]">
      {['Email: benvenuto nel workshop', 'WhatsApp: la live parte tra 1 ora', 'Email: il prossimo livello è aperto'].map((x, i) => (
        <motion.p key={x} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.35 }} className="rounded-xl bg-white/10 px-3 py-2 text-white">
          {x}
        </motion.p>
      ))}
    </div>
  );
}

export function CollabVideo() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    if (reduce || !play) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SCENES.length), 3600);
    return () => clearTimeout(t);
  }, [i, play, reduce]);
  const s = SCENES[i];
  return (
    <Section tone="ink" id="come-funziona">
      <Container>
        <SectionHeader eyebrow="Come funziona" title={'La collaborazione\n*in 20 secondi*'} lead="Dal tuo contenuto all’incasso: tu fai quello che sai fare, il resto lo facciamo girare noi." />
        <div className={`${GAP.header} grid grid-cols-1 items-center gap-10 lg:grid-cols-[360px_1fr] lg:gap-16`}>
          <div className="relative mx-auto w-full max-w-[320px]" onMouseEnter={() => setPlay(false)} onMouseLeave={() => setPlay(true)}>
            <div className="rounded-[40px] bg-[#111] p-3 shadow-float ring-1 ring-white/10">
              <div className="flex gap-1 px-2 pt-1">
                {SCENES.map((x, k) => (
                  <span key={x.t} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                    <motion.span key={`${k}-${i}`} className="block h-full bg-white" initial={{ width: k < i ? '100%' : '0%' }} animate={{ width: k < i ? '100%' : k === i ? '100%' : '0%' }} transition={{ duration: k === i && !reduce ? 3.6 : 0, ease: 'linear' }} />
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 px-2">
                <img src={asset(FABRIZIA.photo)} alt="" className="h-7 w-7 rounded-full object-cover" />
                <p className="text-[12px] font-semibold text-white">{s.t}</p>
              </div>
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-3 h-[380px] rounded-[28px] bg-gradient-to-b from-[#1d0a16] to-[#0b0b0b] p-4">
                <Screen kind={s.screen} />
              </motion.div>
            </div>
          </div>
          <ol className="space-y-3">
            {SCENES.map((x, k) => (
              <li key={x.t}>
                <button type="button" data-track-ignore="" onClick={() => setI(k)} className={`flex w-full items-start gap-4 rounded-3xl p-5 text-left transition ${k === i ? 'bg-white text-ink' : 'bg-white/[0.05] text-white hover:bg-white/10'}`}>
                  <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-2xl ${k === i ? 'bg-acid text-ink' : 'bg-white/10 text-white'}`}>
                    <x.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-heading text-lg font-semibold tracking-tight">
                      {k + 1}. {x.t}
                    </span>
                    <span className={`mt-1 block text-[15px] leading-relaxed ${k === i ? 'text-mute' : 'text-white/65'}`}>{x.x}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Fabrizia: card con foto e WhatsApp ─── */
export function FabriziaCard({ className = '' }: { className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[400px] overflow-hidden rounded-[32px] bg-white text-ink shadow-float ${className}`}>
      <div className="relative">
        <img src={asset(FABRIZIA.photo)} alt={`${FABRIZIA.name}, ${FABRIZIA.role} di Influencee`} width={480} height={640} className="aspect-[4/4] w-full object-cover object-top" />
        <span className="absolute left-4 top-4 rounded-full bg-[#ffe500] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">Per i creator</span>
      </div>
      <div className="p-6">
        <p className="font-heading text-xl font-semibold">{FABRIZIA.name}</p>
        <p className="text-sm font-semibold text-brand">{FABRIZIA.role}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">«Scrivimi chi sei e di cosa parli. Ti rispondo io, e se c’è un progetto da costruire lo capiamo insieme in una call.»</p>
        <a href={FABRIZIA.wa()} target="_blank" rel="noopener" data-lead-type="progetto_creator" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3.5 font-semibold text-white transition hover:brightness-95">
          <MessageCircle className="h-5 w-5" /> Scrivi a Fabrizia su WhatsApp
        </a>
      </div>
    </div>
  );
}

const PROGETTI_FAQ: QA[] = [
  { q: 'Quanto costa partire?', a: 'Niente. Non ci sono costi di avvio per il creator: costruiamo noi offerta, pagine, automazioni e pagamenti. Guadagniamo una quota sui ricavi netti del progetto, scritta nel contratto prima di partire. Se non vendi, non guadagniamo nemmeno noi.' },
  { q: 'Quanti follower servono?', a: 'Funziona meglio con creator tra 15.000 e 150.000 follower in una nicchia utile: finanza, business, carriera, tecnologia, fitness, professioni. Più della quantità conta la fiducia della tua community.' },
  { q: 'Cosa devo fare io?', a: 'Metterci la faccia e i contenuti: di solito da 4 a 8 contenuti al mese pensati per portare persone verso l’offerta, più le live o le call previste dal progetto. Tutto il resto lo facciamo girare noi.' },
  { q: 'Il mio profilo resta mio?', a: 'Sì. Il personal brand, il profilo e la community restano tuoi. Influencee costruisce e gestisce la parte tecnica: pagine, automazioni, database e pagamenti.' },
  { q: 'Come vengo pagato?', a: 'Ogni pagamento si divide in automatico nel momento in cui entra, tra te e Influencee. Niente fatture a fine mese da rincorrere e niente rendiconti fatti a mano.' },
  { q: 'Che tipo di prodotto vendiamo?', a: 'Dipende da te e dalla tua community. Di solito partiamo da un workshop live a numero chiuso o da una consulenza premium: si vende prima e si costruisce dopo, così nessuno lavora mesi su qualcosa che non interessa.' },
  { q: 'Quanto dura la collaborazione?', a: 'È un progetto pensato per crescere: di solito l’accordo dura almeno 12 mesi, il tempo giusto per lanciare, imparare e far crescere le vendite.' },
];

export function ProgettiPage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Creator', href: '#/diventa-creator/' }, { label: 'Progetti con i creator' }]}
        eyebrow="Novità · Costruisci un progetto con noi"
        title={'Hai la community.\n*Noi costruiamo il business dietro.*'}
        lead="Tu ci metti la faccia e i contenuti. Noi costruiamo l’offerta, le pagine, le automazioni e i pagamenti. Zero costi per partire: guadagniamo solo quando guadagni tu."
        actions={
          <>
            <Button href={FABRIZIA.wa()}>Scrivi a Fabrizia</Button>
            <Button href="#come-funziona" variant="secondary">
              Guarda come funziona
            </Button>
          </>
        }
        note="Per creator di nicchia tra 15.000 e 150.000 follower · posti limitati"
        visual={<FabriziaCard />}
      />
      <CardGrid
        tone="white"
        eyebrow="Il problema"
        title={'Non sei tu il problema.\n*È il modello.*'}
        lead="Molti creator di nicchia hanno un pubblico che li ascolta davvero, ma guadagnano solo una piccola parte di quello che potrebbero."
        items={[
          { tag: '01', t: 'Collaborazioni a singhiozzo', x: 'Un brand questo mese, forse un altro tra tre. Il tuo reddito dipende da chi ti scrive, non da te.' },
          { tag: '02', t: 'Il valore lo prende qualcun altro', x: 'Porti fiducia e attenzione, ma il prodotto, i clienti e i margini restano al brand.' },
          { tag: '03', t: 'Costruire da soli costa troppo', x: 'Pagine, automazioni, pagamenti, vendite: servono competenze, tempo e soldi che un creator di solito non ha.' },
        ]}
      />
      <Section tone="paper">
        <Container>
          <SectionHeader eyebrow="La soluzione" title={'Due ruoli chiari,\n*un progetto insieme*'} lead="Ognuno fa quello che sa fare meglio. È così che lavorano, da anni, gli studi che costruiscono business con i creator negli Stati Uniti." />
          <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} lg:grid-cols-2`}>
            {[
              { who: 'Tu, il creator', tone: 'bg-white ring-1 ring-line', tag: 'bg-acid text-ink', list: ['Ci metti la faccia e la tua autorevolezza', 'Pubblichi 4–8 contenuti al mese pensati per l’offerta', 'Fai le live o le call previste dal progetto', 'Il tuo profilo e la tua community restano tuoi'] },
              { who: 'Influencee, dietro le quinte', tone: 'bg-ink text-white', tag: 'bg-brand text-white', list: ['Progettiamo l’offerta con te: cosa vendere e a che prezzo', 'Costruiamo pagine, video di presentazione e automazioni dei DM', 'Gestiamo pagamenti, email e WhatsApp ai clienti', 'Misuriamo tutto e miglioriamo ogni mese'] },
            ].map((c, k) => (
              <motion.div key={c.who} {...reveal(k)} className={`rounded-[32px] p-7 sm:p-9 ${c.tone}`}>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c.tag}`}>{c.who}</span>
                <ul className="mt-6 space-y-3">
                  {c.list.map((x) => (
                    <li key={x} className="flex gap-3 text-[16px] leading-relaxed">
                      <Check className={`mt-1 h-5 w-5 flex-none ${k ? 'text-acid' : 'text-brand'}`} /> {x}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
      <CollabVideo />
      <CardGrid
        tone="white"
        eyebrow="Cosa vendiamo insieme"
        title={'Tre formati,\n*prima si vende poi si costruisce*'}
        lead="Partiamo dal formato che incassa più in fretta, senza mesi di lavoro al buio. Il prodotto lo scegliamo insieme in base alla tua nicchia."
        items={[
          { tag: 'In 7 giorni', t: 'Workshop live a numero chiuso', x: 'Un percorso di alcune settimane con live e community privata. Si vende prima, si registra dopo: per esempio a 247 € a persona.' },
          { tag: 'In 10 giorni', t: 'Consulenza o servizio premium', x: 'Per chi parla ad aziende e professionisti: le persone giuste arrivano a una call di qualifica. Ticket alti, per esempio da 1.500 €.' },
          { tag: 'Dopo i primi incassi', t: 'Strumento in abbonamento', x: 'Una directory o un piccolo strumento utile alla tua nicchia, con abbonamento mensile. Lo sviluppiamo solo quando le vendite hanno dimostrato che funziona.' },
        ]}
      />
      <Section tone="paper">
        <Container>
          <SectionHeader eyebrow="Ci siamo capiti?" title={'Per chi è,\n*e per chi no*'} lead="Preferiamo dirlo subito: prendiamo pochi creator, e solo quelli con cui possiamo davvero costruire qualcosa." />
          <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} lg:grid-cols-2`}>
            <div className="rounded-[32px] bg-white p-7 ring-1 ring-line sm:p-9">
              <p className={`${TYPE.label} text-brand`}>È per te se</p>
              <ul className="mt-5 space-y-3">
                {['Parli di una nicchia utile: soldi, lavoro, business, tecnologia, salute, sport', 'La tua community ti chiede consigli, non solo intrattenimento', 'Hai tra 15.000 e 150.000 follower, o un pubblico piccolo ma molto fedele', 'Vuoi un’entrata che dipenda da te, non dal prossimo brand'].map((x) => (
                  <li key={x} className="flex gap-3 text-[16px] leading-relaxed">
                    <Check className="mt-1 h-5 w-5 flex-none text-[#16a34a]" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] bg-white p-7 ring-1 ring-line sm:p-9">
              <p className={`${TYPE.label} text-mute`}>Non è per te se</p>
              <ul className="mt-5 space-y-3">
                {['Cerchi solo una sponsorizzazione pagata a contenuto', 'Non vuoi metterci la faccia con costanza ogni mese', 'Vuoi risultati in una settimana senza lavorarci', 'Non ti senti a tuo agio a vendere qualcosa alla tua community'].map((x) => (
                  <li key={x} className="flex gap-3 text-[16px] leading-relaxed text-mute">
                    <X className="mt-1 h-5 w-5 flex-none text-[#dc2626]" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
      <CardGrid
        tone="white"
        cols={4}
        eyebrow="Le regole"
        title={'Chiare dal primo giorno,\n*scritte nel contratto*'}
        items={[
          { tag: 'Costi', t: 'Zero per partire', x: 'Nessun costo fisso di avvio per il creator: l’investimento iniziale è nostro.' },
          { tag: 'Guadagni', t: 'Una quota sui ricavi', x: 'Ci dividiamo i ricavi netti con una percentuale concordata prima di partire.' },
          { tag: 'Pagamenti', t: 'Divisi in automatico', x: 'Ogni incasso si divide da solo nel momento in cui entra. Nessun rendiconto a mano.' },
          { tag: 'Proprietà', t: 'Il tuo brand è tuo', x: 'Profilo, volto e community restano tuoi. Noi gestiamo la parte tecnica del progetto.' },
        ]}
      />
      <Section tone="ink">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#ffe500] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-ink">
              <Heart className="h-3.5 w-3.5" /> Primi 3 progetti pilota
            </p>
            <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
              Stiamo scegliendo adesso <span className="text-acid">i primi creator</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">Partiamo con tre progetti, per seguirli da vicino uno per uno. Scrivi a Fabrizia: guardiamo insieme il tuo profilo e ti diciamo con sincerità se c’è un progetto da costruire.</p>
            <a href={FABRIZIA.wa()} target="_blank" rel="noopener" data-lead-type="progetto_creator" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-4 text-[17px] font-semibold text-white transition hover:brightness-95">
              <MessageCircle className="h-5 w-5" /> Scrivi a Fabrizia su WhatsApp <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <FabriziaCard />
        </Container>
      </Section>
      <FaqSeo items={PROGETTI_FAQ} />
      <CtaDual />
    </>
  );
}
