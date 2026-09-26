import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { Button, Card, Container, GAP, Section, SectionHeader, TYPE, reveal, useInk, type Tone } from '../ds';
import { BRAND, IMG, STATS, TEAM } from '../content';

export interface TeamProps {
  tone?: Tone;
  eyebrow?: string;
  title?: string;
  lead?: string;
  members?: typeof TEAM;
}

function Socials({ className = '' }: { className?: string }) {
  const { dark } = useInk();
  return (
    <div className={`flex gap-2 ${className}`}>
      {[Instagram, Linkedin, Mail].map((Icon, i) => (
        <a key={i} href="#" aria-label="Social" className={`flex h-8 w-8 items-center justify-center rounded-full transition hover:-translate-y-0.5 ${dark ? 'bg-white/10 text-white' : 'bg-white text-ink shadow-card hover:text-brand'}`}>
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  );
}

/* ─── 04 · Team a card ──────────────────────────────────────────── */
export function TeamCards({ tone = 'white', eyebrow = 'Il team', title = 'Le persone dietro\n*ogni campagna*', lead = 'Strategia, relazione con i creator e creatività: un team che conosce il mercato italiano.', members = TEAM }: TeamProps) {
  return (
    <Section tone={tone} id="team">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} grid ${GAP.grid} sm:grid-cols-2 lg:grid-cols-3`}>
          {members.map((m, i) => (
            <motion.div key={m.name} {...reveal(i % 3)}>
              <Card className="p-3 pt-7 text-center">
                <img src={m.photo} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
                <Socials className="mt-4 justify-center" />
                <div className="mt-5 rounded-2xl bg-paper px-4 py-4">
                  <p className={TYPE.h3.replace('sm:text-2xl', 'sm:text-xl')}>{m.name}</p>
                  <p className="text-sm text-mute">{m.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <Card className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="font-heading font-semibold">Vuoi lavorare con noi?</p>
            <p className="text-sm text-mute">Mandaci la tua candidatura</p>
          </div>
          <Button href={`mailto:${BRAND.email}`} size="sm">
            Scrivici
          </Button>
        </Card>
      </Container>
    </Section>
  );
}

/* ─── 08 · Team bento ───────────────────────────────────────────── */
export function TeamBento({ tone = 'white', eyebrow = 'Chi siamo', title = 'Il team dietro *influencee*', lead = 'Le persone che ogni giorno mettono in contatto brand e creator.', members = TEAM }: TeamProps) {
  const [a, b, c, d, , f] = members;
  const Bio = ({ m }: { m: (typeof TEAM)[number] }) => (
    <Card className="flex aspect-square flex-col justify-between p-6">
      <div>
        <p className="font-heading text-lg font-semibold">{m.role}</p>
        <p className="mt-4 text-sm leading-relaxed text-mute">{m.bio}</p>
      </div>
      <p className="font-medium">{m.name}</p>
    </Card>
  );
  const Photo = ({ src, tall = false }: { src: string; tall?: boolean }) => <img src={src} alt="" className={`w-full rounded-3xl object-cover ${tall ? 'aspect-[3/5]' : 'aspect-square'}`} />;
  const s = STATS[0];
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className={`${GAP.header} mx-auto grid max-w-5xl ${GAP.grid} sm:grid-cols-3`}>
          <div className={`flex flex-col ${GAP.grid}`}>
            <motion.div {...reveal(0)}><Bio m={a} /></motion.div>
            <motion.div {...reveal(1)}><Photo src={b.photo} /></motion.div>
            <motion.div {...reveal(2)}><Bio m={f} /></motion.div>
          </div>
          <div className={`flex flex-col ${GAP.grid}`}>
            <motion.div {...reveal(1)}><Photo src={a.photo} /></motion.div>
            <motion.div {...reveal(2)}><Bio m={c} /></motion.div>
            <motion.div {...reveal(3)}><Photo src={d.photo} /></motion.div>
          </div>
          <div className={`flex flex-col ${GAP.grid}`}>
            <motion.div {...reveal(2)} className="flex min-h-[240px] flex-col justify-between rounded-3xl bg-ink p-7 text-white">
              <p className="text-sm text-white/70">Selezioniamo i creator guardando i dati, non solo i follower.</p>
              <div>
                <p className={TYPE.number}>5.000+</p>
                <p className="mt-2 text-sm text-white/80">{s.label}</p>
              </div>
            </motion.div>
            <motion.div {...reveal(3)}><Photo src={IMG.event} tall /></motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── 20 · Team a zig-zag ───────────────────────────────────────── */
export function TeamZigzag({ tone = 'white', title = 'Chi rende possibile\n*il nostro lavoro*', lead = 'Competenza, passione e metodo: lavoriamo insieme per far crescere il tuo brand con i creator.', members = TEAM }: TeamProps) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader title={title} lead={lead} />
        <div className={`${GAP.header} mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 sm:gap-8`}>
          {members.map((m, i) => {
            const hl = i % 4 === 1;
            return (
              <motion.div key={m.name} {...reveal()} className={i % 2 ? 'sm:mt-28' : ''}>
                <div className={`rounded-3xl p-5 sm:p-6 ${hl ? 'bg-brand text-white' : 'bg-paper ring-1 ring-line/70'}`}>
                  <img src={m.photo} alt={m.name} className="aspect-[12/13] w-full rounded-2xl object-cover" />
                  <p className={`mt-5 ${TYPE.h3}`}>{m.name}</p>
                  <p className={`text-sm ${hl ? 'text-white/80' : 'text-mute'}`}>{m.role}</p>
                  <div className="mt-4 flex gap-3">
                    {[Instagram, Linkedin, Mail].map((Icon, k) => (
                      <a key={k} href="#" aria-label="Social" className="opacity-80 transition hover:opacity-100">
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

