import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { TEAM_MEMBERS } from '../data';

/**
 * Row 04 — Team a card (ref. Sociwave)
 * Eyebrow con pallino, titolo, griglia di card con avatar tondo,
 * icone social flottanti e box nome/ruolo; card "lavora con noi" in fondo.
 */
export interface TeamCardMember {
  name: string;
  role: string;
  photo: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
}

export interface TeamCardsProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  members?: TeamCardMember[];
  join?: { title: string; text: string; cta: { label: string; href: string } } | null;
}

const toTitle = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const DEFAULTS: Required<TeamCardsProps> = {
  eyebrow: 'Il nostro team',
  title: 'Conosci il team Socialee',
  subtitle: 'Un gruppo appassionato che fa crescere il tuo brand con strategie social concrete.',
  members: TEAM_MEMBERS.map((m) => ({
    name: toTitle(m.nome),
    role: toTitle(m.ruolo),
    photo: m.fotoUrl ?? '',
    instagram: '#',
    linkedin: '#',
    email: '#',
  })),
  join: {
    title: 'Vuoi entrare nel team?',
    text: 'Invia la tua candidatura via email',
    cta: { label: 'Scrivici', href: 'mailto:info@socialee.it' },
  },
};

function SocialBtn({ href, children, label }: { href?: string; children: React.ReactNode; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-900 shadow-md transition hover:-translate-y-0.5 hover:text-[#ff6a3d]"
    >
      {children}
    </a>
  );
}

export default function TeamCards(props: TeamCardsProps) {
  const p = { ...DEFAULTS, ...props };

  return (
    <section className="bg-[#fdf6f2] px-4 py-20 font-tight text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className="h-2 w-2 rounded-full bg-[#ff6a3d]" />
          {p.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{p.title}</h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-500">{p.subtitle}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {p.members.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.08 }}
            className="rounded-2xl bg-white/50 p-3 pt-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
          >
            <img src={m.photo} alt={m.name} className="mx-auto h-20 w-20 rounded-full object-cover" />
            <div className="mt-4 flex justify-center gap-2">
              <SocialBtn href={m.instagram} label="Instagram">
                <Instagram className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href={m.linkedin} label="LinkedIn">
                <Linkedin className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href={m.email} label="Email">
                <Mail className="h-3.5 w-3.5" />
              </SocialBtn>
            </div>
            <div className="mt-5 rounded-xl bg-white px-4 py-4 text-center shadow-sm">
              <p className="text-lg font-medium">{m.name}</p>
              <p className="text-sm text-zinc-500">{m.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {p.join && (
        <div className="mx-auto mt-10 flex max-w-md items-center justify-between gap-4 rounded-2xl bg-white/70 px-5 py-4 shadow-sm">
          <div>
            <p className="font-medium">{p.join.title}</p>
            <p className="text-sm text-zinc-500">{p.join.text}</p>
          </div>
          <a
            href={p.join.cta.href}
            className="shrink-0 rounded-full bg-[#ff6a3d] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30"
          >
            {p.join.cta.label}
          </a>
        </div>
      )}
    </section>
  );
}
