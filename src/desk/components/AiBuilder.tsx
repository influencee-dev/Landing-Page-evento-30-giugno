import { useEffect, useRef, useState } from 'react';
import { Bot, Braces, Check, RotateCcw, Send, User } from 'lucide-react';
import { PageHeader, useDesk } from '../DeskApp';
import { isStepSatisfied, STEPS, type Step, type StepId } from '../core/nlu';
import { MODULE_LABELS, OBJECTIVE_LABELS } from '../core/planner';
import type { BuilderAnswers, MediaPlanPayload } from '../core/types';
import { Button, Card, eur, MODULE_COLORS, num } from '../ui';

interface Msg {
  from: 'ai' | 'user';
  text: string;
}

const FIRST = STEPS[0];

export function AiBuilder() {
  const { client, run, go, notify } = useDesk();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'ai', text: FIRST.question }]);
  const [step, setStep] = useState<Step | null>(FIRST);
  const [answers, setAnswers] = useState<Partial<BuilderAnswers>>({ categories: [] });
  const [answered, setAnswered] = useState<StepId[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState<MediaPlanPayload | null>(null);
  const [showJson, setShowJson] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), [msgs, plan]);

  const restart = () => {
    setMsgs([{ from: 'ai', text: FIRST.question }]);
    setStep(FIRST);
    setAnswers({ categories: [] });
    setAnswered([]);
    setPlan(null);
  };

  const send = async (text: string) => {
    if (!step || !text.trim() || busy) return;
    setInput('');
    setMsgs((m) => [...m, { from: 'user', text }]);
    setBusy(true);
    try {
      const res = await client.step(step.id, text, answers, answered);
      const merged = { ...answers, ...res.patch };
      if (!isStepSatisfied(step.id, merged)) {
        setMsgs((m) => [...m, { from: 'ai', text: `Non ho capito bene. ${step.question}` }]);
        return;
      }
      setAnswers(merged);
      setAnswered((a) => [...a, step.id]);
      if (res.next) {
        setStep(res.next);
        setMsgs((m) => [...m, { from: 'ai', text: res.next!.question }]);
      } else {
        setStep(null);
        const p = await client.plan({ categories: [], brandName: '', objective: 'REACH', cashBudget: 0, hasBarter: false, ...merged });
        setPlan(p);
        setMsgs((m) => [
          ...m,
          { from: 'ai', text: `Ecco il media plan che ti propongo. Controlla la preview e confermala: creo Campagna, ${p.ad_sets.length} Ad Set e le bozze dei brief.` },
        ]);
      }
    } catch (e) {
      notify((e as Error).message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (status: 'DRAFT' | 'ACTIVE') => {
    if (!plan) return;
    if (await run((c) => c.createCampaign(plan, status), status === 'ACTIVE' ? 'Campagna lanciata' : 'Bozza salvata')) {
      go('manager');
    }
  };

  return (
    <>
      <PageHeader
        title="AI Campaign Builder"
        subtitle={`Setup conversazionale: rispondi alle domande e l'AI compone il media plan mixando VIP, Discovery, Barter e UGC. Motore: ${
          client.llm ? 'LLM (Gemini) con fallback a regole' : 'parser a regole (imposta GEMINI_API_KEY sul server per l\'LLM)'
        }.`}
        action={
          <Button variant="ghost" onClick={restart}>
            <RotateCcw className="h-3.5 w-3.5" /> Ricomincia
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="flex flex-col">
          <div className="max-h-[60vh] min-h-[360px] space-y-3 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : ''}`}>
                {m.from === 'ai' && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-fuchsia-600/20 text-fuchsia-300">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === 'ai' ? 'rounded-tl-sm bg-white/5 text-zinc-200' : 'rounded-tr-sm bg-fuchsia-600 text-white'
                  }`}
                >
                  {m.text}
                </div>
                {m.from === 'user' && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-zinc-300">
                    <User className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}
            {busy && <div className="pl-9 text-xs text-zinc-500">Sto elaborando…</div>}
            <div ref={endRef} />
          </div>
          {step?.suggestions && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {step.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300 hover:border-fuchsia-500 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!step || busy}
              placeholder={step ? 'Scrivi la tua risposta…' : 'Piano pronto: conferma a destra'}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-fuchsia-500 focus:outline-none"
            />
            <Button type="submit" disabled={!step || busy || !input.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </Card>

        <Card
          title="Preview media plan"
          action={
            plan && (
              <button onClick={() => setShowJson(!showJson)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white">
                <Braces className="h-3.5 w-3.5" /> {showJson ? 'Vista piano' : 'JSON payload'}
              </button>
            )
          }
        >
          {!plan ? (
            <AnswersSoFar answers={answers} />
          ) : showJson ? (
            <pre className="max-h-[60vh] overflow-auto rounded-lg bg-black p-3 font-mono text-[11px] leading-relaxed text-emerald-200">
              {JSON.stringify(plan, null, 2)}
            </pre>
          ) : (
            <PlanPreview plan={plan} onConfirm={confirm} />
          )}
        </Card>
      </div>
    </>
  );
}

function AnswersSoFar({ answers }: { answers: Partial<BuilderAnswers> }) {
  const rows: [string, string | undefined][] = [
    ['Brand', answers.brandName],
    ['Obiettivo', answers.objective && OBJECTIVE_LABELS[answers.objective]],
    ['Budget cash', answers.cashBudget !== undefined ? eur(answers.cashBudget) : undefined],
    [
      'Cambio merci',
      answers.hasBarter === undefined
        ? undefined
        : answers.hasBarter
          ? answers.barterUnits
            ? `${answers.barterUnits} × ${answers.barterProduct} (${eur(answers.barterUnitValue ?? 0)})`
            : 'Sì'
          : 'No',
    ],
    ['Città', answers.city],
    ['Verticali', answers.categories?.length ? answers.categories.join(', ') : undefined],
  ];
  return (
    <dl className="divide-y divide-white/5 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between py-2">
          <dt className="text-zinc-500">{k}</dt>
          <dd className={v ? 'text-zinc-100' : 'text-zinc-700'}>{v ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

function PlanPreview({ plan, onConfirm }: { plan: MediaPlanPayload; onConfirm: (s: 'DRAFT' | 'ACTIVE') => void }) {
  const reach = plan.ad_sets.reduce((s, a) => s + a.estimated_reach, 0);
  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold text-white">{plan.campaign.name}</div>
        <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-zinc-400">
          <span>{OBJECTIVE_LABELS[plan.campaign.objective]}</span>
          <span>Cash {eur(plan.campaign.total_cash_budget)}</span>
          <span>Merce {eur(plan.campaign.total_barter_value)}</span>
          <span>Reach stimata {num(reach)}</span>
        </div>
      </div>
      <div className="space-y-2">
        {plan.ad_sets.map((a) => (
          <div key={a.name} className="rounded-lg border border-white/10 p-3">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${MODULE_COLORS[a.module_type].dot}`} />
              <span className="text-sm font-medium text-zinc-100">{a.name}</span>
              <span className="ml-auto font-mono text-xs text-zinc-300 tabular-nums">
                {a.module_type === 'SMART_BARTER'
                  ? `${a.barter_inventory_count} × ${eur(a.barter_unit_value ?? 0)}`
                  : eur(a.budget_allocation)}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-zinc-500">
              {MODULE_LABELS[a.module_type]} · ~{a.estimated_creators} creator · {a.deliverable_type.replace('_', ' ')}
              {a.estimated_reach ? ` · reach ~${num(a.estimated_reach)}` : ' · asset per Ads'}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-zinc-400">{a.brief}</p>
          </div>
        ))}
      </div>
      {plan.rationale.length > 0 && (
        <ul className="space-y-1 text-xs text-zinc-400">
          {plan.rationale.map((r) => (
            <li key={r} className="flex gap-2">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-fuchsia-400" /> {r}
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Button onClick={() => onConfirm('ACTIVE')}>Conferma e lancia</Button>
        <Button variant="ghost" onClick={() => onConfirm('DRAFT')}>
          Salva come bozza
        </Button>
      </div>
    </div>
  );
}
