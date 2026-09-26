import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, QrCode, ScanLine, Smartphone, Store } from 'lucide-react';
import { PageHeader, useDesk } from '../DeskApp';
import type { RedeemTicket } from '../client';
import { SAMPLE_OCR, ProofForm } from './AdsManager';
import { Button, Card, eur, TaskPill } from '../ui';

export function BarterDesk() {
  const { state, run, client, notify, focus } = useDesk();
  const barterSets = state.adSets.filter((a) => a.module_type === 'SMART_BARTER');
  const barterTasks = useMemo(
    () => state.tasks.filter((t) => barterSets.some((a) => a.id === t.ad_set_id) && ['ACCEPTED', 'IN_PROGRESS', 'REVIEW', 'APPROVED'].includes(t.status)),
    [state, barterSets],
  );
  const [taskId, setTaskId] = useState<string>(focus ?? barterTasks.find((t) => t.status === 'ACCEPTED')?.id ?? barterTasks[0]?.id ?? '');
  const [ticket, setTicket] = useState<RedeemTicket | null>(null);
  const [scanned, setScanned] = useState('');
  const [left, setLeft] = useState(0);
  const [ocr, setOcr] = useState(SAMPLE_OCR);

  const task = state.tasks.find((t) => t.id === taskId);
  const adSet = task && state.adSets.find((a) => a.id === task.ad_set_id);
  const creator = task && state.creators.find((c) => c.id === task.creator_id);
  const campaign = adSet && state.campaigns.find((c) => c.id === adSet.campaign_id);

  useEffect(() => {
    setTicket(null);
    setScanned('');
  }, [taskId]);

  useEffect(() => {
    if (!ticket) return;
    const tick = () => setLeft(Math.max(0, ticket.expiresAt - Math.floor(Date.now() / 1000)));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [ticket]);

  const redeem = async () => {
    try {
      setTicket(await client.redeem(taskId));
    } catch (e) {
      notify((e as Error).message, 'err');
    }
  };

  const verify = async (token: string) => {
    const ok = await run((c) => c.verify(token.trim()), 'Check-in valido: inventory scalato e transazione registrata');
    if (ok) {
      setTicket(null);
      setScanned('');
    }
  };

  return (
    <>
      <PageHeader
        title="Smart Barter"
        subtitle="Cambio merci in Programmatic Guaranteed: il creator accetta one-tap, genera un QR firmato (JWT, TTL 5 minuti), il negoziante lo scansiona e l'inventory dell'Ad Set scala in automatico. Poi la Proof of Work passa dall'OCR anti-frode."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-zinc-200"
        >
          {barterTasks.length === 0 && <option value="">Nessuna task barter accettata</option>}
          {barterTasks.map((t) => {
            const c = state.creators.find((x) => x.id === t.creator_id);
            return (
              <option key={t.id} value={t.id}>
                {c?.display_name} — {t.status.toLowerCase()}
              </option>
            );
          })}
        </select>
        {task && <TaskPill status={task.status} />}
        {adSet && (
          <span className="text-xs text-zinc-400">
            Inventory <span className="font-mono text-white">{adSet.barter_inventory_count}</span>/{adSet.barter_inventory_initial} ·{' '}
            {eur(adSet.barter_unit_value)} per unità · {campaign?.name}
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* App creator */}
        <Card title={<span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-fuchsia-400" /> App creator</span>}>
          <div className="mx-auto w-full max-w-[300px] rounded-[2rem] border border-white/15 bg-black p-4">
            <div className="text-center text-[11px] text-zinc-500">{creator?.social_handles.ig ?? '—'}</div>
            <div className="mt-3 rounded-xl bg-white/5 p-3 text-xs text-zinc-300">{adSet?.brief ?? 'Seleziona una task barter.'}</div>
            <div className="mt-4 grid min-h-[260px] place-items-center">
              {ticket && left > 0 ? (
                <div className="text-center">
                  <img src={ticket.qr} alt="QR check-in" className="mx-auto h-52 w-52 rounded-lg bg-white p-1" />
                  <div className="mt-2 font-mono text-sm text-white">
                    {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-zinc-500">Mostralo in cassa</div>
                </div>
              ) : task?.status === 'ACCEPTED' ? (
                <Button onClick={redeem} className="px-6 py-3 text-sm">
                  <QrCode className="h-4 w-4" /> {ticket ? 'QR scaduto: rigenera' : 'Redeem'}
                </Button>
              ) : task?.redeemed_at ? (
                <div className="text-center text-sm text-emerald-300">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8" />
                  Riscattato il {new Date(task.redeemed_at).toLocaleString('it-IT')}
                </div>
              ) : (
                <div className="text-xs text-zinc-500">Nessuna azione disponibile</div>
              )}
            </div>
          </div>
        </Card>

        {/* POS negoziante */}
        <Card title={<span className="flex items-center gap-2"><Store className="h-4 w-4 text-emerald-400" /> App negoziante · /api/barter/verify</span>}>
          <div className="space-y-3">
            <Button variant="ghost" disabled={!ticket || left <= 0} onClick={() => ticket && verify(ticket.token)} className="w-full py-3 text-sm">
              <ScanLine className="h-4 w-4" /> Scansiona QR mostrato dal creator
            </Button>
            <div className="text-center text-[11px] text-zinc-500">oppure incolla il token letto dalla fotocamera</div>
            <textarea
              value={scanned}
              onChange={(e) => setScanned(e.target.value)}
              rows={4}
              placeholder="eyJhbGciOiJIUzI1NiIs…"
              className="w-full rounded-md border border-white/10 bg-black p-2 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-700"
            />
            <Button disabled={!scanned.trim()} onClick={() => verify(scanned)}>
              Verifica token
            </Button>
            {ticket && (
              <details className="text-[11px] text-zinc-500">
                <summary className="cursor-pointer">Payload JWT</summary>
                <pre className="mt-2 overflow-x-auto rounded bg-black p-2 text-zinc-400">
                  {JSON.stringify(JSON.parse(atob(ticket.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2)}
                </pre>
              </details>
            )}
          </div>
        </Card>
      </div>

      {task?.status === 'IN_PROGRESS' && (
        <Card title="Proof of Work · validazione OCR" className="mt-6">
          <ProofForm
            isUgc={false}
            ocr={ocr}
            setOcr={setOcr}
            onSubmit={(url, img) => run((c) => c.proof(task.id, url, ocr, img), 'Proof inviata al motore OCR')}
          />
        </Card>
      )}
      {task && (task.status === 'REVIEW' || task.status === 'APPROVED') && (
        <Card title="Metriche estratte" className="mt-6">
          <pre className="overflow-x-auto font-mono text-xs text-zinc-300">{JSON.stringify(task.performance_metrics, null, 2)}</pre>
          {task.status === 'REVIEW' && (
            <p className="mt-2 text-xs text-amber-300">OCR non conclusivo: la task resta in review manuale nell'Ads Manager.</p>
          )}
        </Card>
      )}
    </>
  );
}
