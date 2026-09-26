import { PageHeader, useDesk } from '../DeskApp';
import type { TransactionStatus, TransactionType } from '../core/types';
import { Card, eur, Kpi, Pill } from '../ui';

const TYPE_TONE: Record<TransactionType, string> = {
  CASH_PAYMENT: 'bg-sky-500/10 text-sky-300',
  BARTER_REDEEM: 'bg-emerald-500/10 text-emerald-300',
  PENALTY_FEE: 'bg-red-500/10 text-red-300',
};
const STATUS_TONE: Record<TransactionStatus, string> = {
  HOLD: 'bg-amber-500/10 text-amber-300',
  CLEARED: 'bg-emerald-500/10 text-emerald-300',
  FAILED: 'bg-zinc-700 text-zinc-300',
};

export function ClearingHouse() {
  const { state } = useDesk();
  const sum = (f: (w: (typeof state.wallet)[number]) => boolean) => state.wallet.filter(f).reduce((s, w) => s + w.amount, 0);
  const creatorOf = (taskId: string | null) => {
    const t = state.tasks.find((x) => x.id === taskId);
    return state.creators.find((c) => c.id === t?.creator_id)?.display_name ?? '—';
  };

  return (
    <>
      <PageHeader
        title="Clearing House"
        subtitle="Wallet e escrow: il cash va in HOLD all'accettazione e viene liquidato a delivery approvata; ogni check-in barter genera una transazione BARTER_REDEEM. Gli eventi webhook.* e meta.* vengono inoltrati a Spoki e Meta."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="In escrow (HOLD)" value={eur(sum((w) => w.transaction_type === 'CASH_PAYMENT' && w.status === 'HOLD'))} />
        <Kpi label="Liquidato" value={eur(sum((w) => w.transaction_type === 'CASH_PAYMENT' && w.status === 'CLEARED'))} />
        <Kpi label="Merce erogata" value={eur(sum((w) => w.transaction_type === 'BARTER_REDEEM'))} />
        <Kpi label="Stornato" value={eur(sum((w) => w.status === 'FAILED'))} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card title="wallet_transactions">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="pb-2 font-medium">Data</th>
                  <th className="pb-2 font-medium">Tipo</th>
                  <th className="pb-2 font-medium">Creator</th>
                  <th className="pb-2 text-right font-medium">Importo</th>
                  <th className="pb-2 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {state.wallet.map((w) => (
                  <tr key={w.id} title={w.note}>
                    <td className="py-2 text-xs text-zinc-500">{new Date(w.created_at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>
                      <Pill className={TYPE_TONE[w.transaction_type]}>{w.transaction_type.toLowerCase()}</Pill>
                    </td>
                    <td className="text-xs text-zinc-300">{creatorOf(w.task_id)}</td>
                    <td className="text-right font-mono tabular-nums">{eur(w.amount)}</td>
                    <td>
                      <Pill className={STATUS_TONE[w.status]}>{w.status.toLowerCase()}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Event log & webhook">
          <ul className="max-h-[520px] space-y-2 overflow-y-auto">
            {state.events.map((e) => {
              const outbound = e.type.startsWith('webhook.') || e.type.startsWith('meta.');
              return (
                <li key={e.id} className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs ${outbound ? 'text-fuchsia-300' : 'text-zinc-300'}`}>{e.type}</span>
                    {outbound && <Pill className="bg-fuchsia-500/10 text-fuchsia-300">out</Pill>}
                    <span className="ml-auto text-[10px] text-zinc-600">{new Date(e.at).toLocaleTimeString('it-IT')}</span>
                  </div>
                  <div className="mt-1 truncate font-mono text-[10px] text-zinc-500">{JSON.stringify(e.payload)}</div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
