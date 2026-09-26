import React from 'react';
import { BadgeCheck, BarChart3, Bookmark, Heart, LayoutDashboard, Lock, Megaphone, MessageCircle, Search, Send, SlidersHorizontal, Users } from 'lucide-react';
import { BRAND, CREATORS } from './content';

/* Mockup riutilizzabili: stessi raggi, colori e font del design system. */

export function BrowserFrame({ children, url = `app.${BRAND.domain}`, className = '' }: { children: React.ReactNode; url?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-line ${className}`}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-full bg-paper px-5 py-1 text-[11px] text-mute">
          <Lock className="h-3 w-3" /> {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Schermata della piattaforma Influencee: ricerca creator con filtri e match. */
export function PlatformMock({ rows = 5, compact = false }: { rows?: number; compact?: boolean }) {
  return (
    <div className="grid bg-white text-left text-ink md:grid-cols-[176px_1fr]">
      <aside className="hidden border-r border-line p-4 text-xs md:block">
        <p className="font-heading text-sm font-semibold tracking-tight">{BRAND.name}</p>
        <ul className="mt-5 space-y-1 text-mute">
          {[
            [LayoutDashboard, 'Dashboard'],
            [Users, 'Creator'],
            [Megaphone, 'Campagne'],
            [BarChart3, 'Report'],
          ].map(([Icon, label], i) => {
            const I = Icon as typeof Users;
            return (
              <li key={label as string} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${i === 1 ? 'bg-brand-soft font-medium text-brand-ink' : ''}`}>
                <I className="h-3.5 w-3.5" /> {label as string}
              </li>
            );
          })}
        </ul>
      </aside>
      <div className="min-w-0 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-paper px-3 py-2 text-xs text-mute">
            <Search className="h-3.5 w-3.5" /> Cerca per nicchia, città, follower…
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          {['Food', 'Beauty', '10K–250K', 'Italia', 'ER > 4%'].map((f, i) => (
            <span key={f} className={`rounded-full px-2.5 py-1 ${i < 2 ? 'bg-brand text-white' : 'bg-paper text-mute'}`}>
              {f}
            </span>
          ))}
        </div>
        {!compact && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ['Creator trovati', '1.284'],
              ['Reach stimata', '2,4M'],
              ['ER medio', '5,6%'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-paper p-3">
                <p className="text-[10px] text-mute">{k}</p>
                <p className="font-heading text-lg font-semibold tracking-tight">{v}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 divide-y divide-line text-xs">
          {CREATORS.slice(0, rows).map((c) => (
            <div key={c.handle} className="flex items-center gap-3 py-2.5">
              <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="flex items-center gap-1 font-medium">
                  {c.handle} <BadgeCheck className="h-3.5 w-3.5 text-brand" />
                </p>
                <p className="text-[11px] text-mute">
                  {c.niche} · {c.followers}
                </p>
              </div>
              <span className="hidden w-14 text-right text-mute sm:block">ER {c.er}</span>
              <span className="w-12 rounded-full bg-brand-soft py-1 text-center text-[11px] font-semibold text-brand-ink">{c.match}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[9/19] overflow-hidden rounded-[2.6rem] border-[7px] border-ink bg-ink shadow-float ${className}`}>
      <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      {children}
    </div>
  );
}

/** Card verticale stile Stories/Reel con header creator e badge views. */
export function StoryCard({ image, avatar, handle, meta, badge, className = '' }: { image: string; avatar?: string; handle: string; meta?: string; badge?: string; className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-muted ring-4 ring-white ${className}`}>
      <img src={image} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" />
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/55 to-transparent p-3 text-xs text-white">
        {avatar && <img src={avatar} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-white/70" />}
        <span className="font-semibold">{handle}</span>
        <BadgeCheck className="h-4 w-4 fill-brand text-white" />
        {meta && <span className="ml-auto text-white/75">{meta}</span>}
      </div>
      {badge && <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">{badge}</span>}
    </div>
  );
}

/** Post in stile feed con azioni. */
export function PostCard({ image, avatar, handle, meta }: { image: string; avatar?: string; handle: string; meta?: string }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-ink shadow-float">
      <div className="flex items-center gap-2 p-3">
        {avatar && <img src={avatar} alt="" className="h-7 w-7 rounded-full object-cover" />}
        <div className="leading-tight">
          <p className="text-[11px] font-semibold">{handle}</p>
          {meta && <p className="text-[10px] text-mute">{meta}</p>}
        </div>
      </div>
      <img src={image} alt="" draggable={false} className="min-h-0 flex-1 select-none object-cover" />
      <div className="flex items-center gap-2.5 p-3">
        <Heart className="h-4 w-4 fill-brand text-brand" />
        <MessageCircle className="h-4 w-4" />
        <Send className="h-4 w-4" />
        <Bookmark className="ml-auto h-4 w-4" />
      </div>
    </div>
  );
}
