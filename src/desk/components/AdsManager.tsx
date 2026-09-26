import { Fragment, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronRight, QrCode, Send, Upload, UserPlus, X } from 'lucide-react';
import { PageHeader, useDesk } from '../DeskApp';
import { committedBudget, matchCreators } from '../core/engine';
import { MODULE_LABELS, OBJECTIVE_LABELS } from '../core/planner';
import type { AdSet, TaskAd } from '../core/types';
import { Button, CampaignPill, eur, MODULE_COLORS, num, Pill, TaskPill } from '../ui';

export const SAMPLE_OCR = 'Account raggiunti 3.412\nVisualizzazioni 4,1K\nMi piace: 212';

export function AdsManager() {
  const { state, focus } = useDesk();
  const [open, setOpen] = useState<Set<string>>(() => new Set(focus ? [focus] : state.campaigns.slice(0, 1).map((c) => c.id)));
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <>
      <PageHeader
        title="Ads Manager"
        subtitle="Gerarchia Meta-like: Campagna (strategia e budget CBO) › Ad Set (modulo d'acquisto e targeting) › Task (brief, creator, deliverable)."
      />
      <div className="space-y-3">
        {state.campaigns.map((c) => {
          const sets = state.adSets.filter((a) => a.campaign_id === c.id);
          const isOpen = open.has(c.id);
          return (
            <div key={c.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <button onClick={() => toggle(c.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03]">
                {isOpen ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Campagna</span>
                <span className="font-semibold text-white">{c.name}</span>
                <CampaignPill status={c.status} />
                <span className="ml-auto flex gap-4 text-xs text-zinc-400">
                  <span>{OBJECTIVE_LABELS[c.objective]}</span>
                  <span className="font-mono">{eur(c.total_cash_budget)} cash</span>
                  {c.total_barter_value > 0 && <span className="font-mono">{eur(c.total_barter_value)} merce</span>}
                </span>
              </button>
              {isOpen && (
                <div className="space-y-2 border-t border-white/10 bg-black/20 p-3">
                  {sets.map((a) => (
                    <AdSetRow key={a.id} adSet={a} defaultOpen={focus === a.id} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function AdSetRow({ adSet, defaultOpen }: { adSet: AdSet; defaultOpen?: boolean }) {
  const { state } = useDesk();
  const [open, setOpen] = useState(!!defaultOpen);
  const [picking, setPicking] = useState(false);
  const tasks = state.tasks.filter((t) => t.ad_set_id === adSet.id);
  const committed = committedBudget(state, adSet.id);
  const isBarter = adSet.module_type === 'SMART_BARTER';
  const color = MODULE_COLORS[adSet.module_type];

  return (
    <div className="rounded-lg border border-white/10 bg-[#101015]">
      <button onClick={() => setOpen(!open)} className="flex w-full flex-wrap items-center gap-3 px-3 py-2.5 text-left">
        {open ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
        <span className={`h-2 w-2 rounded-full ${color.dot}`} />
        <span className="text-sm font-medium text-zinc-100">{adSet.name}</span>
        <Pill className={`bg-white/5 ${color.text}`}>{MODULE_LABELS[adSet.module_type]}</Pill>
        <span className="ml-auto flex gap-4 font-mono text-xs text-zinc-400 tabular-nums">
          {isBarter ? (
            <span>
              {adSet.barter_inventory_count}/{adSet.barter_inventory_initial} unità · {eur(adSet.barter_unit_value)}/u
            </span>
          ) : (
            <span>
              {eur(committed)} / {eur(adSet.budget_allocation)}
            </span>
          )}
          <span>{tasks.length} task</span>
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-white/10 p-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">Brief</div>
              <p className="mt-1 text-sm text-zinc-300">{adSet.brief}</p>
              <TargetingSummary adSet={adSet} />
            </div>
            <div className="flex items-start">
              <Button variant="ghost" onClick={() => setPicking(!picking)}>
                <UserPlus className="h-3.5 w-3.5" /> {picking ? 'Chiudi' : 'Trova creator'}
              </Button>
            </div>
          </div>

          {picking && <CreatorPicker adSet={adSet} onDone={() => setPicking(false)} />}

          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="pb-2 font-medium">Creator</th>
                    <th className="pb-2 font-medium">Deliverable</th>
                    <th className="pb-2 text-right font-medium">Fee</th>
                    <th className="pb-2 font-medium">Stato</th>
                    <th className="pb-2 text-right font-medium">Reach</th>
                    <th className="pb-2 text-right font-medium">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tasks.map((t) => (
                    <TaskRow key={t.id} task={t} adSet={adSet} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">Nessuna task: usa "Trova creator" per inviare il brief.</p>
          )}
        </div>
      )}
    </div>
  );
}

function TargetingSummary({ adSet }: { adSet: AdSet }) {
  const r = adSet.targeting_rules;
  const chips = [
    r.tiers?.length && `Tier ${r.tiers.join('/')}`,
    r.min_followers && `≥ ${num(r.min_followers)} follower`,
    r.min_er && `ER ≥ ${r.min_er}%`,
    r.radius_km && `raggio ${r.radius_km} km`,
    r.min_barter_score && `barter score ≥ ${r.min_barter_score}`,
    r.categories?.length && r.categories.join(', '),
  ].filter(Boolean) as string[];
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <Pill key={c} className="bg-white/5 text-zinc-400">
          {c}
        </Pill>
      ))}
    </div>
  );
}

function CreatorPicker({ adSet, onDone }: { adSet: AdSet; onDone: () => void }) {
  const { state, run } = useDesk();
  const taken = new Set(state.tasks.filter((t) => t.ad_set_id === adSet.id).map((t) => t.creator_id));
  const matches = useMemo(() => matchCreators(state.creators, adSet).filter((c) => !taken.has(c.id)), [state, adSet]);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const cost = matches.filter((c) => sel.has(c.id)).reduce((s, c) => s + c.base_fee, 0);
  const isBarter = adSet.module_type === 'SMART_BARTER';
  const cta = {
    PREMIUM_VIP: 'Invia RFP alle agenzie',
    OPEN_DISCOVERY: 'Avvia cold outreach',
    SMART_BARTER: 'Invia push ai creator locali',
    UGC_FACTORY: 'Invia brief di produzione',
  }[adSet.module_type];

  return (
    <div className="rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/[0.03] p-3">
      <div className="mb-2 text-xs text-zinc-400">
        {matches.length} creator eleggibili secondo il targeting{isBarter ? ' (registrati, nel raggio)' : ''}
      </div>
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {matches.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-white/5">
            <input
              type="checkbox"
              checked={sel.has(c.id)}
              onChange={() =>
                setSel((s) => {
                  const n = new Set(s);
                  n.has(c.id) ? n.delete(c.id) : n.add(c.id);
                  return n;
                })
              }
              className="accent-fuchsia-500"
            />
            <span className="min-w-0 flex-1">
              <span className="text-sm text-zinc-100">{c.display_name}</span>{' '}
              <span className="text-xs text-zinc-500">
                {c.social_handles.ig} · {c.city}
                {c.agency ? ` · ${c.agency}` : ''}
              </span>
            </span>
            <span className="font-mono text-xs text-zinc-400 tabular-nums">
              {num(c.metrics.follower_count)} · ER {c.metrics.engagement_rate_real}%
            </span>
            <span className="w-16 text-right font-mono text-xs text-zinc-300 tabular-nums">
              {isBarter ? `score ${c.barter_eligibility_score}` : eur(c.base_fee)}
            </span>
          </label>
        ))}
        {matches.length === 0 && <p className="px-2 text-xs text-zinc-500">Nessun creator disponibile con questo targeting.</p>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-400">
          {sel.size} selezionati{!isBarter && ` · ${eur(cost)} (residuo ${eur(adSet.budget_allocation - committedBudget(state, adSet.id))})`}
        </span>
        <Button
          disabled={!sel.size}
          onClick={async () => {
            if (await run((cl) => cl.invite(adSet.id, [...sel]), `${cta}: fatto`)) onDone();
          }}
        >
          <Send className="h-3.5 w-3.5" /> {cta}
        </Button>
      </div>
    </div>
  );
}

function TaskRow({ task, adSet }: { task: TaskAd; adSet: AdSet }) {
  const { state, run, go } = useDesk();
  const [proofOpen, setProofOpen] = useState(false);
  const [ocr, setOcr] = useState(SAMPLE_OCR);
  const creator = state.creators.find((c) => c.id === task.creator_id);
  const isBarter = adSet.module_type === 'SMART_BARTER';
  const isUgc = adSet.module_type === 'UGC_FACTORY';
  const t = (to: TaskAd['status'], msg: string) => run((c) => c.transition(task.id, to), msg);

  return (
    <Fragment>
      <tr>
        <td className="py-2">
          <div className="text-zinc-100">{creator?.display_name}</div>
          <div className="text-[11px] text-zinc-500">
            {creator?.tier} · {creator?.social_handles.ig}
          </div>
        </td>
        <td className="text-xs text-zinc-400">{task.deliverable_type.replace('_', ' ')}</td>
        <td className="text-right font-mono text-xs tabular-nums">{isBarter ? eur(adSet.barter_unit_value) + ' merce' : eur(task.agreed_fee)}</td>
        <td>
          <TaskPill status={task.status} />
          {task.performance_metrics.ocr_validated && <Pill className="ml-1 bg-emerald-500/10 text-emerald-300">OCR ✓</Pill>}
        </td>
        <td className="text-right font-mono text-xs tabular-nums">{task.performance_metrics.reach ? num(task.performance_metrics.reach) : '—'}</td>
        <td className="py-2">
          <div className="flex justify-end gap-1.5">
            {task.status === 'PENDING_ACCEPTANCE' && (
              <>
                <Button variant="ghost" onClick={() => t('ACCEPTED', isBarter ? 'Accettata one-tap' : 'Accettata: fee in escrow')}>
                  <Check className="h-3 w-3" /> Simula accettazione
                </Button>
                <Button variant="danger" onClick={() => t('REJECTED', 'Task rifiutata')}>
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
            {task.status === 'ACCEPTED' &&
              (isBarter ? (
                <Button onClick={() => go('barter', task.id)}>
                  <QrCode className="h-3 w-3" /> QR check-in
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => t('IN_PROGRESS', 'Produzione avviata')}>
                  Avvia produzione
                </Button>
              ))}
            {task.status === 'IN_PROGRESS' && (
              <Button variant="ghost" onClick={() => setProofOpen(!proofOpen)}>
                <Upload className="h-3 w-3" /> {isUgc ? 'Consegna .mp4' : 'Proof of Work'}
              </Button>
            )}
            {task.status === 'REVIEW' && (
              <>
                <Button onClick={() => t('APPROVED', isUgc ? 'Asset approvato: pagamento rilasciato, push a Meta BM' : 'Approvata')}>
                  <Check className="h-3 w-3" /> Approva
                </Button>
                <Button variant="danger" onClick={() => t('REJECTED', 'Rifiutata: escrow stornato')}>
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>
      {proofOpen && task.status === 'IN_PROGRESS' && (
        <tr>
          <td colSpan={6} className="pb-3">
            <ProofForm
              isUgc={isUgc}
              ocr={ocr}
              setOcr={setOcr}
              onSubmit={async (url, img) => {
                const ok = await run(
                  (c) => c.proof(task.id, url, isUgc ? '' : ocr, img),
                  isUgc ? 'File consegnato: in attesa di approvazione' : 'Proof inviata al motore OCR',
                );
                if (ok) setProofOpen(false);
              }}
            />
          </td>
        </tr>
      )}
    </Fragment>
  );
}

export function ProofForm({
  isUgc,
  ocr,
  setOcr,
  onSubmit,
}: {
  isUgc: boolean;
  ocr: string;
  setOcr: (s: string) => void;
  onSubmit: (url: string, imageBase64?: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const submit = async () => {
    let img: string | undefined;
    if (file && !isUgc && file.type.startsWith('image/')) {
      img = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.readAsDataURL(file);
      });
    }
    onSubmit(file ? `upload://${file.name}` : isUgc ? 'upload://hook_v1.mp4' : 'upload://insights.png', img);
  };
  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-black/30 p-3 md:grid-cols-2">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">{isUgc ? 'File video (.mp4)' : 'Screenshot insight'}</div>
        <input
          type="file"
          accept={isUgc ? 'video/mp4' : 'image/*'}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-zinc-200"
        />
        <p className="mt-2 text-[11px] text-zinc-500">
          {isUgc
            ? "Con l'approvazione il creator cede i diritti (whitelisting / dark posting) e l'asset viene inviato al Business Manager."
            : 'Con Cloud Vision configurato sul server lo screenshot viene letto via OCR; altrimenti usa il testo qui a fianco.'}
        </p>
      </div>
      {!isUgc && (
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">Testo OCR (simulato)</div>
          <textarea
            value={ocr}
            onChange={(e) => setOcr(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-md border border-white/10 bg-black p-2 font-mono text-xs text-zinc-200"
          />
        </div>
      )}
      <div className="md:col-span-2">
        <Button onClick={submit}>
          <Upload className="h-3.5 w-3.5" /> {isUgc ? 'Consegna asset' : 'Invia e valida'}
        </Button>
      </div>
    </div>
  );
}
