import { useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import { PageHeader, useDesk } from '../DeskApp';
import { MODULE_LABELS } from '../core/planner';
import type { CreatorOrigin, CreatorTier } from '../core/types';
import { Button, Card, eur, num, Pill } from '../ui';

const TIERS: CreatorTier[] = ['NANO', 'MICRO', 'MID', 'MACRO', 'VIP'];
const ORIGIN_TONE: Record<CreatorOrigin, string> = {
  AUTHENTICATED: 'bg-emerald-500/10 text-emerald-300',
  SCRAPED: 'bg-sky-500/10 text-sky-300',
  IMPORTED: 'bg-amber-500/10 text-amber-300',
};

export function Discovery() {
  const { state, run } = useDesk();
  const [q, setQ] = useState('');
  const [tiers, setTiers] = useState<Set<CreatorTier>>(new Set());
  const [minEr, setMinEr] = useState(0);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const targets = state.adSets.filter((a) => a.module_type !== 'SMART_BARTER');
  const [target, setTarget] = useState(targets.find((a) => a.module_type === 'OPEN_DISCOVERY')?.id ?? targets[0]?.id ?? '');

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    return state.creators
      .filter(
        (c) =>
          (!term ||
            c.display_name.toLowerCase().includes(term) ||
            c.city.toLowerCase().includes(term) ||
            c.categories.some((x) => x.includes(term)) ||
            Object.values(c.social_handles).some((h) => h?.toLowerCase().includes(term))) &&
          (!tiers.size || tiers.has(c.tier)) &&
          c.metrics.engagement_rate_real >= minEr,
      )
      .sort((a, b) => b.metrics.engagement_rate_real - a.metrics.engagement_rate_real);
  }, [state.creators, q, tiers, minEr]);

  const toggle = <T,>(set: Set<T>, v: T) => {
    const n = new Set(set);
    n.has(v) ? n.delete(v) : n.add(v);
    return n;
  };

  return (
    <>
      <PageHeader
        title="Open Discovery"
        subtitle="Motore di ricerca sul database creator alimentato da scraping (SERP, directory agenzie), import e onboarding. Seleziona i target e avvia l'outreach automatico con link di onboarding."
      />
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca per nome, handle, città, categoria…"
            className="min-w-[220px] flex-1 rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-fuchsia-500 focus:outline-none"
          />
          <div className="flex gap-1">
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => setTiers(toggle(tiers, t))}
                className={`rounded-md px-2 py-1 text-[11px] font-medium ${tiers.has(t) ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            ER min {minEr}%
            <input type="range" min={0} max={10} step={0.5} value={minEr} onChange={(e) => setMinEr(Number(e.target.value))} className="accent-fuchsia-500" />
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="w-8 pb-2" />
                <th className="pb-2 font-medium">Creator</th>
                <th className="pb-2 font-medium">Tier</th>
                <th className="pb-2 font-medium">Origine</th>
                <th className="pb-2 font-medium">Categorie</th>
                <th className="pb-2 text-right font-medium">Follower</th>
                <th className="pb-2 text-right font-medium">Reach media</th>
                <th className="pb-2 text-right font-medium">ER reale</th>
                <th className="pb-2 text-right font-medium">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.map((c) => (
                <tr key={c.id} className={sel.has(c.id) ? 'bg-fuchsia-500/5' : ''}>
                  <td className="py-2">
                    <input type="checkbox" checked={sel.has(c.id)} onChange={() => setSel(toggle(sel, c.id))} className="accent-fuchsia-500" />
                  </td>
                  <td>
                    <div className="text-zinc-100">{c.display_name}</div>
                    <div className="text-[11px] text-zinc-500">
                      {[c.social_handles.ig, c.social_handles.tiktok && `TT ${c.social_handles.tiktok}`, c.city, c.agency].filter(Boolean).join(' · ')}
                    </div>
                  </td>
                  <td className="text-xs text-zinc-300">{c.tier}</td>
                  <td>
                    <Pill className={ORIGIN_TONE[c.origin]}>{c.origin.toLowerCase()}</Pill>
                  </td>
                  <td className="text-xs text-zinc-400">{c.categories.join(', ')}</td>
                  <td className="text-right font-mono tabular-nums">{num(c.metrics.follower_count)}</td>
                  <td className="text-right font-mono tabular-nums">{num(c.metrics.avg_reach)}</td>
                  <td className="text-right font-mono tabular-nums">{c.metrics.engagement_rate_real}%</td>
                  <td className="text-right font-mono tabular-nums">{eur(c.base_fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
          <span className="text-xs text-zinc-400">{sel.size} selezionati → Ad Set</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="max-w-xs rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-zinc-200"
          >
            {targets.map((a) => (
              <option key={a.id} value={a.id}>
                {state.campaigns.find((c) => c.id === a.campaign_id)?.name} › {MODULE_LABELS[a.module_type]}
              </option>
            ))}
          </select>
          <Button
            disabled={!sel.size || !target}
            onClick={async () => {
              if (await run((c) => c.invite(target, [...sel]), 'Outreach avviato: email con link di onboarding in coda')) setSel(new Set());
            }}
          >
            <Send className="h-3.5 w-3.5" /> Avvia outreach
          </Button>
        </div>
      </Card>
    </>
  );
}
