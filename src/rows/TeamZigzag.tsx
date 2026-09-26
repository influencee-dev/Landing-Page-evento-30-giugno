import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { TEAM_MEMBERS } from '../data';

/**
 * Row 20 — Team a zig-zag (ref. Looped "The power behind our success")
 * Titolo condensato, due colonne sfalsate verticalmente; una card su tre
 * evidenziata col colore accento.
 */
export interface ZigzagMember {
  name: string;
  role: string;
  photo: string;
  links?: { instagram?: string; linkedin?: string; email?: string };
}

export interface TeamZigzagProps {
  title?: string;
  subtitle?: string;
  members?: ZigzagMember[];
  accent?: string;
  ink?: string;
}

const title = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const DEFAULTS: Required<TeamZigzagProps> = {
  title: 'Le persone dietro\nil nostro successo',
  subtitle: 'Competenza, passione e dedizione in ogni progetto: lavoriamo insieme per far crescere la tua attività.',
  members: TEAM_MEMBERS.slice(0, 6).map((m) => ({
    name: m.nome,
    role: title(m.ruolo),
    photo: m.fotoUrl ?? '',
    links: { instagram: '#', linkedin: '#', email: '#' },
  })),
  accent: '#9ee26b',
  ink: '#083d36',
};

export default function TeamZigzag(props: TeamZigzagProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-[#f6f5ee] px-4 py-20 font-work sm:px-6" style={{ color: p.ink }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="whitespace-pre-line font-anton text-5xl uppercase leading-[1.05] sm:text-7xl">{p.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm">{p.subtitle}</p>
      </div>
      <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2">
        {p.members.map((m, i) => {
          const hl = i % 4 === 1;
          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-6 ${i % 2 ? 'sm:mt-28' : ''} ${i % 2 && i > 1 ? 'sm:-mb-28' : ''}`}
              style={{ background: hl ? p.accent : '#fff' }}
            >
              <img src={m.photo} alt={m.name} className="aspect-[12/13] w-full rounded-lg object-cover" />
              <p className="mt-5 font-anton text-2xl uppercase">{m.name}</p>
              <p className="text-sm">{m.role}</p>
              <div className="mt-3 flex gap-3">
                {m.links?.instagram && (
                  <a href={m.links.instagram} aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {m.links?.linkedin && (
                  <a href={m.links.linkedin} aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {m.links?.email && (
                  <a href={m.links.email} aria-label="Email">
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
