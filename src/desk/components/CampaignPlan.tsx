import { useMemo, useState } from 'react';
import { Bot, Pause, Play } from 'lucide-react';
import { PageHeader, useDesk } from '../DeskApp';
import { aggregate } from '../core/engine';
import { MODULE_LABELS, OBJECTIVE_LABELS } from '../core/planner';
import type { ModuleType } from '../core/types';
import { Button, CampaignPill, Card, eur, Kpi, MODULE_COLORS, num } from '../ui';

const MODULES: ModuleType[] = ['PREMIUM_VIP', 'OPEN_DISCOVERY', 'SMART_BARTER', 'UGC_FACTORY'];

export function CampaignPlan() {
  const { state, run, go } = useDesk();
  const [selected, setSelected] = useState<string>('all');
  const campaignId = selected === 'all' ? undefined : selected;
  const m = useMemo(() => aggregate(state, campaignId), [state, campaignId]);
  const totalAllocated = MODULES.reduce((s, k) => s + m.byModule[k].budget, 0) || 1;

  return (
    <>
      <PageHeader
        title="Campaign Plan"
        subtitle="Orchestratore omnicanale: VIP, Discovery, Barter e UGC sotto un unico budget CBO. Le metriche sono aggregate dalla Clearing House e dalle Proof of Work validate."
        action={
          <div className="flex items-center gap-2">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-zinc-200"
            >
              <option value="all">Tutte le campagne</option>
              {state.campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button onClick={() => go('builder')}>
              <Bot className="h-3.5 w-3.5" /> Nuova con AI
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Total Spend" value={eur(m.committedSpend)} hint={`${eur(m.clearedSpend)} liquidati · budget ${eur(m.totalCashBudget)}`} />
        <Kpi label="Barter Media Value" value={eur(m.barterMediaValue)} hint={`erogati su ${eur(m.barterBudgetValue)} in merce`} />
        <Kpi label="Blended CPA" value={m.blendedCpa !== null ? eur(m.blendedCpa) : '—'} hint={`${m.conversions} conversioni · cash + merce`} />
        <Kpi label="Total Reach" value={num(m.totalReach)} hint={m.blendedCpm !== null ? `CPM blended ${eur(m.blendedCpm)}` : 'in attesa di Proof of Work'} />
      </div>

      <Card title="Allocazione budget per modulo" className="mt-6">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
          {MODULES.map((k) =>
            m.byModule[k].budget ? (
              <div
                key={k}
                className={MODULE_COLORS[k].bar}
                style={{ width: `${(m.byModule[k].budget / totalAllocated) * 100}%` }}
                title={MODULE_LABELS[k]}
              />
            ) : null,
          )}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((k) => {
            const b = m.byModule[k];
            const isBarter = k === 'SMART_BARTER';
            const used = isBarter ? m.barterMediaValue : b.committed;
            return (
              <div key={k} className="rounded-lg border border-white/10 p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                  <span className={`h-2 w-2 rounded-full ${MODULE_COLORS[k].dot}`} />
                  {MODULE_LABELS[k]}
                </div>
                <div className="mt-2 font-mono text-lg text-white tabular-nums">{eur(b.budget)}</div>
                <div className="text-[11px] text-zinc-500">
                  {isBarter ? 'valore merce allocata' : 'budget cash'} · {Math.round((b.budget / totalAllocated) * 100)}%
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className={`h-full ${MODULE_COLORS[k].bar}`} style={{ width: `${b.budget ? Math.min(100, (used / b.budget) * 100) : 0}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-zinc-500">
                  <span>{isBarter ? 'erogato' : 'impegnato'} {eur(used)}</span>
                  <span>{b.tasks} task</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Campagne" className="mt-6">
        {state.campaigns.length === 0 ? (
          <p className="text-sm text-zinc-500">Nessuna campagna. Creane una con l'AI Builder.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="pb-2 font-medium">Campagna</th>
                  <th className="pb-2 font-medium">Obiettivo</th>
                  <th className="pb-2 text-right font-medium">Cash</th>
                  <th className="pb-2 text-right font-medium">Merce</th>
                  <th className="pb-2 text-right font-medium">Ad Set</th>
                  <th className="pb-2 pl-6 font-medium">Stato</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {state.campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5">
                      <button onClick={() => go('manager', c.id)} className="text-left font-medium text-white hover:text-fuchsia-300">
                        {c.name}
                      </button>
                    </td>
                    <td className="text-zinc-400">{OBJECTIVE_LABELS[c.objective]}</td>
                    <td className="text-right font-mono tabular-nums">{eur(c.total_cash_budget)}</td>
                    <td className="text-right font-mono tabular-nums">{eur(c.total_barter_value)}</td>
                    <td className="text-right font-mono tabular-nums">{state.adSets.filter((a) => a.campaign_id === c.id).length}</td>
                    <td className="pl-6">
                      <CampaignPill status={c.status} />
                    </td>
                    <td className="text-right">
                      {c.status === 'ACTIVE' ? (
                        <Button variant="ghost" onClick={() => run((cl) => cl.setCampaignStatus(c.id, 'PAUSED'), 'Campagna in pausa')}>
                          <Pause className="h-3 w-3" /> Pausa
                        </Button>
                      ) : c.status !== 'COMPLETED' ? (
                        <Button variant="ghost" onClick={() => run((cl) => cl.setCampaignStatus(c.id, 'ACTIVE'), 'Campagna attiva')}>
                          <Play className="h-3 w-3" /> Attiva
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
