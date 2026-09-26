import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, CheckCircle2, Clock3, FileText, MessageSquare, Search, UserRound } from 'lucide-react';
import { Container, GAP, Section, SectionHeader, TYPE, type Tone } from '../ds';
import { BrowserFrame, PlatformMock } from '../mocks';
import { CREATORS_DB, NICHE_INFO, fmtEr, fmtFollowers } from './data';

/* Schermate della piattaforma ricostruite in HTML (dati di esempio). */

function ProfileMock() {
  const c = CREATORS_DB[2];
  return (
    <div className="grid gap-4 bg-white p-5 text-left text-ink md:grid-cols-[220px_1fr]">
      <div className="rounded-2xl bg-paper p-4 text-center">
        <img src={c.avatar} alt="" className="mx-auto h-20 w-20 rounded-full object-cover" />
        <p className="mt-3 font-heading font-semibold">{c.name}</p>
        <p className="text-xs text-mute">{c.handle}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1">
          {[NICHE_INFO[c.niche].name, c.city, ...c.platforms].map((t) => (
            <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[10px]">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-acid py-2 text-sm font-semibold">{c.match}% match</p>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Follower', fmtFollowers(c.followers)],
            ['Engagement', fmtEr(c.er)],
            ['Post / mese', '14'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-paper p-3">
              <p className="text-[10px] text-mute">{k}</p>
              <p className="font-heading text-lg font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-paper p-3">
          <p className="text-[11px] text-mute">Età dell’audience</p>
          <div className="mt-2 flex h-24 items-end gap-3">
            {c.ages.map(([l, v]) => (
              <div key={l} className="flex flex-1 flex-col items-center gap-1">
                <motion.div initial={{ height: 0 }} animate={{ height: `${v * 1.6}%` }} transition={{ duration: 0.6 }} className="w-full rounded-md bg-brand" />
                <span className="text-[10px] text-mute">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {c.gallery.slice(0, 3).map((g, i) => (
            <img key={i} src={g} alt="" className="aspect-square w-full rounded-lg object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
}

const COLUMNS = [
  { title: 'Brief inviato', icon: FileText, items: [CREATORS_DB[0], CREATORS_DB[8]] },
  { title: 'In revisione', icon: MessageSquare, items: [CREATORS_DB[2], CREATORS_DB[4]] },
  { title: 'Approvato', icon: CheckCircle2, items: [CREATORS_DB[1]] },
  { title: 'Pubblicato', icon: Clock3, items: [CREATORS_DB[3], CREATORS_DB[10]] },
];

function CampaignMock() {
  return (
    <div className="bg-white p-5 text-left text-ink">
      <div className="flex items-center justify-between">
        <p className="font-heading font-semibold">Campagna Estate · 7 creator</p>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-ink">In corso</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title} className="rounded-2xl bg-paper p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-mute">
              <col.icon className="h-3.5 w-3.5" /> {col.title}
            </p>
            <div className="mt-3 space-y-2">
              {col.items.map((c, i) => (
                <motion.div key={c.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl bg-white p-2.5 shadow-card">
                  <div className="flex items-center gap-2">
                    <img src={c.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                    <span className="truncate text-[11px] font-medium">{c.handle}</span>
                  </div>
                  <img src={c.cover} alt="" className="mt-2 aspect-[4/3] w-full rounded-lg object-cover" />
                  <p className="mt-1.5 text-[10px] text-mute">{c.formats[0]} · 30 giu</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportMock() {
  const bars = [32, 48, 41, 66, 58, 80, 92];
  return (
    <div className="bg-white p-5 text-left text-ink">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          ['Reach', '1,2M', '+18%'],
          ['Engagement', '5,8%', '+1,2 pt'],
          ['Click', '3.420', '+34%'],
          ['Vendite da codice', '612', '4,1x ROI'],
        ].map(([k, v, d], i) => (
          <div key={k} className={`rounded-2xl p-3 ${i === 3 ? 'bg-ink text-white' : 'bg-paper'}`}>
            <p className={`text-[10px] ${i === 3 ? 'text-white/60' : 'text-mute'}`}>{k}</p>
            <p className="font-heading text-xl font-semibold">{v}</p>
            <p className={`text-[10px] font-semibold ${i === 3 ? 'text-acid' : 'text-brand'}`}>{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl bg-paper p-4">
          <p className="text-[11px] text-mute">Reach giornaliera · ultimi 7 giorni</p>
          <div className="mt-3 flex h-36 items-end gap-2">
            {bars.map((v, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.05, duration: 0.5 }} className={`flex-1 rounded-t-lg ${i === bars.length - 1 ? 'bg-brand' : 'bg-ink/15'}`} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-paper p-4">
          <p className="text-[11px] text-mute">Top creator per vendite</p>
          <div className="mt-3 space-y-2">
            {CREATORS_DB.slice(0, 4).map((c, i) => (
              <div key={c.slug} className="flex items-center gap-2 text-[11px]">
                <span className="w-3 tabular-nums text-mute">{i + 1}</span>
                <img src={c.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                <span className="flex-1 truncate font-medium">{c.handle}</span>
                <span className="font-semibold tabular-nums">{[214, 168, 131, 99][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'ricerca', label: 'Ricerca creator', icon: Search, text: 'Filtri per nicchia, città, dimensione ed engagement, con punteggio di affinità.', screen: <PlatformMock /> },
  { id: 'profilo', label: 'Profilo creator', icon: UserRound, text: 'Audience, contenuti e dati di performance in una scheda.', screen: <ProfileMock /> },
  { id: 'campagne', label: 'Campagne', icon: FileText, text: 'Brief, revisioni e pubblicazioni di tutti i creator in una bacheca.', screen: <CampaignMock /> },
  { id: 'report', label: 'Report', icon: BarChart3, text: 'Reach, click e vendite tracciate, pronti da condividere.', screen: <ReportMock /> },
];

/** Row: tour della piattaforma a schede. */
export function PlatformTour({ tone = 'white', eyebrow = 'Tour della piattaforma', title = 'Dalla ricerca al report,\n*in un unico posto*' }: { tone?: Tone; eyebrow?: string; title?: string }) {
  const [tab, setTab] = useState(TABS[0].id);
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className={`${GAP.header} flex flex-wrap justify-center gap-2`} role="tablist">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-muted'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
        <p className={`mx-auto mt-5 max-w-md text-center ${TYPE.body} text-mute`}>{current.text}</p>
        <div className="mt-8 rounded-[28px] bg-gradient-to-br from-acid-soft via-white to-brand-soft p-3 ring-1 ring-line sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <BrowserFrame className="mx-auto max-w-5xl">{current.screen}</BrowserFrame>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
