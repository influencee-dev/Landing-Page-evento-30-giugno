import React from 'react';
import { motion } from 'motion/react';
import { Target, PenLine, CalendarDays, Send, Sparkles, FileText, Image, Share2, BarChart3, Users } from 'lucide-react';

/**
 * Row 22 — Processo in 3 step, dark con gradiente arancio (ref. "From strategy to execution")
 * Ogni card ha una mini-illustrazione diversa: orbita di icone, griglia azioni, grafico a barre.
 */
export interface ProcessStepsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  steps?: { title: string; text: string }[];
  actions?: string[];
  bars?: { label: string; value: number }[];
}

const DEFAULTS: Required<ProcessStepsProps> = {
  badge: 'Come funziona',
  title: 'Dalla strategia ai risultati,\nsenza fatica',
  subtitle: 'Pianifichiamo, creiamo e lanciamo campagne che portano engagement e clienti in modo costante.',
  steps: [
    { title: 'Analisi & strategia', text: 'Studiamo la tua attività e il tuo pubblico per costruire un piano vincente.' },
    { title: 'Contenuti & campagne', text: 'Creiamo contenuti coinvolgenti e lanciamo campagne su tutti i canali.' },
    { title: 'Ottimizza & scala', text: 'Misuriamo i risultati e scaliamo quello che funziona davvero.' },
  ],
  actions: ['Crea', 'Pianifica', 'Pubblica', 'Analizza'],
  bars: [
    { label: 'Gen', value: 84 },
    { label: 'Feb', value: 46 },
    { label: 'Mar', value: 68 },
    { label: 'Apr', value: 58 },
    { label: 'Mag', value: 85 },
    { label: 'Giu', value: 50 },
  ],
};

const GRAD = 'bg-gradient-to-b from-[#ff3d1f] to-[#ff9a3d]';
const ORBIT = [FileText, Users, Image, Share2, BarChart3, Sparkles];
const ACTION_ICONS = [PenLine, CalendarDays, Send, BarChart3];

function Orbit() {
  return (
    <div className="relative mx-auto h-44 w-44">
      <div className="absolute inset-4 rounded-full border border-white/15" />
      <div className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl ${GRAD}`}>
        <Target className="h-6 w-6 text-white" />
      </div>
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
        {ORBIT.map((Icon, i) => {
          const a = (i / ORBIT.length) * Math.PI * 2;
          return (
            <span
              key={i}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#1c1c1c]"
              style={{ left: `${50 + Math.cos(a) * 40}%`, top: `${50 + Math.sin(a) * 40}%` }}
            >
              <Icon className="h-3.5 w-3.5 text-white/80" />
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function ProcessSteps(props: ProcessStepsProps) {
  const p = { ...DEFAULTS, ...props };

  const visuals = [
    <Orbit key="o" />,
    <div key="a" className="grid grid-cols-2 gap-2">
      {p.actions.map((a, i) => {
        const Icon = ACTION_ICONS[i % ACTION_ICONS.length];
        return (
          <div key={a} className="flex flex-col items-center gap-2 rounded-lg bg-[#262626] py-5 text-xs text-white">
            <Icon className="h-5 w-5" />
            {a}
          </div>
        );
      })}
    </div>,
    <div key="b" className="flex h-44 items-end justify-center gap-2">
      {p.bars.map((b, i) => (
        <div key={b.label} className="flex flex-col items-center gap-1.5">
          <div className="relative flex h-36 w-7 items-end rounded-md bg-[#2a2a2a]">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${b.value}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className={`w-full rounded-md ${GRAD}`}
            >
              <span className="block pt-1 text-center text-[8px] font-bold text-white">{b.value}%</span>
            </motion.div>
          </div>
          <span className="text-[9px] text-white/70">{b.label}</span>
        </div>
      ))}
    </div>,
  ];

  return (
    <section className="bg-black px-4 py-20 font-tight text-white sm:px-6">
      <div className="text-center">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs">{p.badge}</span>
        <h2 className="mt-5 whitespace-pre-line text-4xl font-medium leading-tight tracking-[-0.03em] sm:text-5xl">{p.title}</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/65">{p.subtitle}</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
        {p.steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-[#161616] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="relative rounded-xl bg-[#1c1c1c] p-5 pt-10">
              <span className={`absolute left-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-semibold ${GRAD}`}>Step 0{i + 1}</span>
              {visuals[i]}
            </div>
            <div className="p-4">
              <h3 className="text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-white/60">{s.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
