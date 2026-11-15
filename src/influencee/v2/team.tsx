import React from 'react';
import { motion } from 'motion/react';
import { Camera, Handshake, Heart, Search } from 'lucide-react';
import { Button, Container, GAP, Section, SectionHeader, TYPE, reveal } from '../ds';
import { SITE, WHATSAPP, type QA } from './data';
import { asset } from './env';
import { AnswerBox, CtaDual, FaqSeo, HeroPlatform, Related } from './rows';
import { PreventivoBand } from './tools';

/* /team/ — le persone di Influencee e dello studio Socialee (stessa società, stesso team).
   Foto: quelle del sito socialee.it (settembre 2026), ridimensionate in public/team-*.webp.
   La foto di Fabrizia Marra è quella mandata da Giorgia (15/11/2026), già nello stesso stile. */

type Persona = { name: string; role: string; text: string; photo?: string; tag?: string };

const TEAM: Persona[] = [
  { name: 'Giorgia Palazzo', role: 'CEO e co-founder', tag: 'Founder', photo: 'team-giorgia-palazzo.webp', text: 'Ha voluto Influencee per far lavorare brand e creator con regole chiare. Legge ogni richiesta di preventivo e risponde di persona.' },
  { name: 'Manuel Arlotti', role: 'CIO e co-founder', tag: 'Founder', photo: 'team-manuel-arlotti.webp', text: 'Growth hacker e anima tecnica: costruisce gli strumenti che usiamo ogni giorno e trasforma i numeri in decisioni.' },
  { name: 'Giuseppe Bonaccorso', role: 'COO e co-founder', tag: 'Founder', photo: 'team-giuseppe-bonaccorso.webp', text: 'Tiene insieme progetti, tempi e persone. Se una campagna parte puntuale, di solito c’è il suo zampino.' },
  { name: 'Fabrizia Marra', role: 'Growth & Influencer Manager', tag: 'Creator', photo: 'team-fabrizia-marra.webp', text: 'È la persona dei creator: li conosce, li segue e costruisce con loro progetti che durano più di un post.' },
  { name: 'Carlo Baldassini', role: 'Sales Director', photo: 'team-carlo-baldassini.webp', text: 'Il primo che ascolta le aziende: capisce cosa serve davvero e lo traduce in un progetto con un budget sensato.' },
  { name: 'Noemi Vitone', role: 'Social Media Manager e Account', photo: 'team-noemi-vitone.webp', text: 'Segue i brand giorno per giorno: piano editoriale, contenuti dei creator, community.' },
  { name: 'Marika Malaspina', role: 'Graphic Designer e Project', photo: 'team-marika-malaspina.webp', text: 'Dà forma alle idee: grafiche, brand book e tutto quello che deve essere bello e riconoscibile.' },
  { name: 'Simona Pancia', role: 'Fotografa e Videomaker', photo: 'team-simona-pancia.webp', text: 'Racconta prodotti e persone con la macchina fotografica: shooting per i brand e per i creator.' },
  { name: 'Stefano Tornese', role: 'Videomaker', photo: 'team-stefano-tornese.webp', text: 'Riprese e montaggio: reel, video per le inserzioni e contenuti UGC curati fino all’ultimo frame.' },
  { name: 'Khristof', role: 'Regista e Video Production', photo: 'team-khristof.webp', text: 'Dirige le produzioni più grandi, dagli spot ai video di campagna, con un occhio da cinema.' },
];

const FAQ_TEAM: QA[] = [
  { q: 'Chi c’è dietro Influencee?', a: `Influencee è un marchio di ${SITE.company}. Il team è lo stesso dello studio Socialee: founder, account, sales, grafica, fotografia, video e una persona dedicata ai creator.` },
  { q: 'Che rapporto c’è tra Influencee e Socialee?', a: 'Sono due anime dello stesso team. Influencee è la piattaforma e il servizio di campagne con i creator italiani; Socialee è lo studio che segue social, contenuti, foto e video dei brand. Quando una campagna ha bisogno di produzione, lo studio è già in casa.' },
  { q: 'Con chi parlo se chiedo un preventivo?', a: 'Con una persona del team, non con un risponditore automatico. La richiesta arriva a Giorgia e al team commerciale, che costruiscono il progetto sul tuo budget e trattano con i creator.' },
  { q: 'Sono un creator: a chi posso scrivere?', a: 'A Fabrizia Marra, che segue i creator e i progetti costruiti insieme a loro. Puoi anche iscriverti gratis a Influencee e candidarti alle offerte dei brand.' },
];

function Initials({ name }: { name: string }) {
  const ini = name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-[#160812]">
      <span className="absolute -left-10 top-6 h-48 w-48 rounded-full bg-brand/50 blur-3xl" />
      <span className="absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-[#ffe500]/30 blur-3xl" />
      <span className="relative font-heading text-7xl font-semibold tracking-tight text-white">{ini}</span>
    </div>
  );
}

function TeamCollage() {
  const pics = TEAM.filter((p) => p.photo).slice(0, 6);
  return (
    <div className="mx-auto grid max-w-[480px] grid-cols-3 gap-2.5">
      {pics.map((p, i) => (
        <img key={p.name} src={asset(p.photo!)} alt={p.name} loading={i < 3 ? 'eager' : 'lazy'} className={`aspect-[3/4] w-full rounded-2xl object-cover ${i % 2 ? 'translate-y-5' : ''}`} />
      ))}
    </div>
  );
}

function TeamGrid() {
  return (
    <Section tone="white">
      <Container>
        <SectionHeader eyebrow="Il team" title={'Dieci persone,\n*una sola direzione*'} lead="Founder, sales, account, grafica, foto, video e una persona tutta per i creator. Sono le persone con cui parlerai davvero, dal primo messaggio all’ultimo report." />
        <div className={`${GAP.header} grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5`}>
          {TEAM.map((p, i) => (
            <motion.figure key={p.name} {...reveal(i % 5)} className="group overflow-hidden rounded-3xl bg-paper">
              <div className="relative">
                {p.photo ? <img src={asset(p.photo)} alt={`${p.name}, ${p.role}`} loading="lazy" width={480} height={640} className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <Initials name={p.name} />}
                {p.tag && <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.tag === 'Creator' ? 'bg-[#ffe500] text-ink' : 'bg-acid text-ink'}`}>{p.tag}</span>}
              </div>
              <figcaption className="p-4 sm:p-5">
                <p className="font-heading text-[17px] font-semibold tracking-tight">{p.name}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-brand">{p.role}</p>
                <p className="mt-2 hidden text-[13px] leading-relaxed text-mute sm:block">{p.text}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

const DOING = [
  { icon: Search, t: 'Troviamo le persone giuste', x: 'Solo creator italiani, scelti guardando i numeri veri e i contenuti, non solo i follower. Una piattaforma per farlo da soli, un team per farlo insieme.' },
  { icon: Handshake, t: 'Trattiamo come se fosse nostro', x: 'Il budget di un’azienda è fatto di sacrifici. Lo trattiamo così: costruiamo il progetto su quello che puoi spendere e negoziamo con i creator il prezzo migliore.' },
  { icon: Camera, t: 'Produciamo in casa', x: 'Fotografia, video, regia e grafica sono nello stesso team. Quando serve un contenuto fatto bene, non lo passiamo a qualcun altro.' },
  { icon: Heart, t: 'Cresciamo con i creator', x: 'I creator non sono un listino. Li seguiamo, li facciamo lavorare con brand coerenti e costruiamo con loro progetti che li fanno crescere.' },
];

function DoingRow() {
  return (
    <Section tone="ink">
      <Container>
        <SectionHeader eyebrow="Cosa facciamo" title={'Mettiamo in contatto le persone,\n*e ci restiamo dentro*'} lead="Non siamo un elenco di contatti né un’agenzia che sparisce dopo la firma. Ogni giorno stiamo in mezzo tra brand e creator, perché il lavoro venga bene a tutti e due." />
        <div className={`${GAP.header} grid grid-cols-1 ${GAP.grid} sm:grid-cols-2 lg:grid-cols-4`}>
          {DOING.map((d, i) => (
            <motion.div key={d.t} {...reveal(i)} className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-acid text-ink">
                <d.icon className="h-5 w-5" />
              </span>
              <p className="mt-5 font-heading text-xl font-semibold tracking-tight text-white">{d.t}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{d.x}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Letter() {
  return (
    <Section tone="paper">
      <Container className="max-w-3xl">
        <motion.div {...reveal()} className="rounded-[32px] bg-white p-7 ring-1 ring-line sm:p-12">
          <p className={`${TYPE.label} text-brand`}>Perché lo facciamo</p>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/85">
            <p>Abbiamo visto troppe aziende spendere soldi in collaborazioni scelte a occhio, e troppi creator bravi lavorare senza un contratto, senza tempi chiari, a volte senza essere pagati.</p>
            <p>Influencee nasce da lì: dalla voglia di mettere ordine e trasparenza in un mestiere che amiamo. Ogni numero dice da dove arriva, ogni accordo è scritto, ogni contenuto ha il suo link per capire se ha funzionato.</p>
            <p>Siamo un team piccolo, e ne siamo orgogliosi. Ci permette di conoscere i brand che seguiamo per nome e di rispondere ai creator di persona. Se ci scrivi, ti risponde uno di noi.</p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <img src={asset('team-giorgia-palazzo.webp')} alt="Giorgia Palazzo" loading="lazy" className="h-14 w-14 rounded-full object-cover object-top" />
            <div>
              <p className="font-heading font-semibold">Giorgia Palazzo</p>
              <p className="text-sm text-mute">CEO e co-founder, a nome di tutto il team</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export function TeamPage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Team' }]}
        eyebrow="Il team di Influencee"
        title={'Le persone dietro\n*ogni campagna*'}
        lead="Siamo un team italiano di founder, account, creativi, fotografi e videomaker. Mettiamo d’accordo brand e creator, e restiamo al loro fianco finché il lavoro non è fatto bene."
        actions={
          <>
            <Button href="#/preventivo-campagne/">Richiedi un preventivo</Button>
            <Button href={WHATSAPP.href} variant="secondary">Scrivici su WhatsApp</Button>
          </>
        }
        visual={<TeamCollage />}
      />
      <AnswerBox q="Chi lavora in Influencee?" a={`Un team di dieci persone, lo stesso dello studio Socialee: i founder Giorgia Palazzo, Manuel Arlotti e Giuseppe Bonaccorso, Fabrizia Marra per i creator, Carlo Baldassini per le aziende, e poi account, grafica, foto, video e regia. Influencee è un marchio di ${SITE.company}.`} points={['Persone vere, non un risponditore', 'Studio foto e video in casa', 'Una referente dedicata ai creator', 'Solo creator italiani']} />
      <TeamGrid />
      <DoingRow />
      <Letter />
      <PreventivoBand page="team" origin="Team" title={'Vuoi lavorare con noi?\n*Calcola il preventivo*'} lead="Rispondi a 4 domande: il team costruisce il progetto sul tuo budget e tratta con i creator per te." />
      <FaqSeo items={FAQ_TEAM} />
      <Related
        links={[
          { label: 'Chi siamo', text: 'La storia di Influencee', href: '#/chi-siamo/' },
          { label: 'Campagna gestita da noi', text: 'Scegliamo i creator e trattiamo il prezzo', href: '#/agenzia-influencer/' },
          { label: 'Sei un creator?', text: 'Iscriviti gratis e ricevi proposte', href: '#/diventa-creator/' },
          { label: 'Socialee', text: 'Lo studio di social, foto e video del team', href: 'https://socialee.it/chi-siamo/' },
        ]}
      />
      <CtaDual />
    </>
  );
}

