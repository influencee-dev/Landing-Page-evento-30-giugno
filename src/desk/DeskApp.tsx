import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  Bot,
  Gauge,
  Layers,
  Loader2,
  QrCode,
  RotateCcw,
  Search,
  Wallet,
} from 'lucide-react';
import { connect, type DeskClient } from './client';
import type { DeskState } from './core/types';
import { AdsManager } from './components/AdsManager';
import { AiBuilder } from './components/AiBuilder';
import { BarterDesk } from './components/BarterDesk';
import { CampaignPlan } from './components/CampaignPlan';
import { ClearingHouse } from './components/ClearingHouse';
import { Discovery } from './components/Discovery';

export type View = 'plan' | 'manager' | 'builder' | 'discovery' | 'barter' | 'clearing';

interface Ctx {
  client: DeskClient;
  state: DeskState;
  /** Esegue un'azione che restituisce il nuovo stato, con gestione errori. */
  run: (fn: (c: DeskClient) => Promise<DeskState>, ok?: string) => Promise<boolean>;
  notify: (msg: string, tone?: 'ok' | 'err') => void;
  go: (v: View, focus?: string) => void;
  focus: string | null;
}

const DeskCtx = createContext<Ctx | null>(null);
export const useDesk = () => useContext(DeskCtx)!;

const NAV: { id: View; label: string; icon: typeof Gauge; hint: string }[] = [
  { id: 'plan', label: 'Campaign Plan', icon: Gauge, hint: 'God Mode' },
  { id: 'manager', label: 'Ads Manager', icon: Layers, hint: 'Campagna › Ad Set › Task' },
  { id: 'builder', label: 'AI Builder', icon: Bot, hint: 'Setup conversazionale' },
  { id: 'discovery', label: 'Open Discovery', icon: Search, hint: 'Ricerca creator' },
  { id: 'barter', label: 'Smart Barter', icon: QrCode, hint: 'QR check-in & OCR' },
  { id: 'clearing', label: 'Clearing House', icon: Wallet, hint: 'Wallet & webhook' },
];

export default function DeskApp() {
  const [client, setClient] = useState<DeskClient | null>(null);
  const [state, setState] = useState<DeskState | null>(null);
  const [view, setView] = useState<View>('plan');
  const [focus, setFocus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; tone: 'ok' | 'err' } | null>(null);

  useEffect(() => {
    connect().then(async (c) => {
      setClient(c);
      setState(await c.load());
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = useCallback((msg: string, tone: 'ok' | 'err' = 'ok') => setToast({ msg, tone }), []);

  const run = useCallback<Ctx['run']>(
    async (fn, ok) => {
      if (!client) return false;
      try {
        setState(await fn(client));
        if (ok) notify(ok);
        return true;
      } catch (e) {
        notify((e as Error).message, 'err');
        return false;
      }
    },
    [client, notify],
  );

  const go = useCallback((v: View, f?: string) => {
    setView(v);
    setFocus(f ?? null);
  }, []);

  if (!client || !state) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0b0b0f] text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <DeskCtx.Provider value={{ client, state, run, notify, go, focus }}>
      <div className="flex min-h-screen bg-[#0b0b0f] font-sans text-zinc-200">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-black/40 md:flex">
          <div className="px-5 py-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-400">Socialee</div>
            <div className="text-base font-bold text-white">Creator Trading Desk</div>
          </div>
          <nav className="flex-1 space-y-0.5 px-2">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition ${
                  view === n.id ? 'bg-fuchsia-600/15 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <n.icon className={`mt-0.5 h-4 w-4 ${view === n.id ? 'text-fuchsia-400' : ''}`} />
                <span>
                  <span className="block text-sm font-medium">{n.label}</span>
                  <span className="block text-[11px] text-zinc-500">{n.hint}</span>
                </span>
              </button>
            ))}
          </nav>
          <div className="space-y-2 border-t border-white/10 p-4 text-[11px] text-zinc-500">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${client.mode === 'api' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {client.mode === 'api' ? `API collegata${client.llm ? ' · LLM attivo' : ''}` : 'Modalità demo (browser)'}
            </div>
            <button
              onClick={() => run((c) => c.reset(), 'Dati demo ripristinati')}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" /> Reset dati demo
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {/* Nav mobile */}
          <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-white/10 bg-black/80 px-3 py-2 backdrop-blur md:hidden">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs ${
                  view === n.id ? 'bg-fuchsia-600/20 text-white' : 'text-zinc-400'
                }`}
              >
                <n.icon className="h-3.5 w-3.5" /> {n.label}
              </button>
            ))}
          </div>
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
            {view === 'plan' && <CampaignPlan />}
            {view === 'manager' && <AdsManager />}
            {view === 'builder' && <AiBuilder />}
            {view === 'discovery' && <Discovery />}
            {view === 'barter' && <BarterDesk />}
            {view === 'clearing' && <ClearingHouse />}
          </div>
        </main>

        {toast && (
          <div
            className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm shadow-xl ${
              toast.tone === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.msg}
          </div>
        )}
      </div>
    </DeskCtx.Provider>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
