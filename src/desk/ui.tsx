import type { ReactNode } from 'react';
import type { CampaignStatus, ModuleType, TaskStatus } from './core/types';

export const eur = (n: number) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: n % 1 ? 2 : 0 });
export const num = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

export const MODULE_COLORS: Record<ModuleType, { dot: string; bar: string; text: string }> = {
  PREMIUM_VIP: { dot: 'bg-amber-400', bar: 'bg-amber-400', text: 'text-amber-300' },
  OPEN_DISCOVERY: { dot: 'bg-sky-400', bar: 'bg-sky-400', text: 'text-sky-300' },
  SMART_BARTER: { dot: 'bg-emerald-400', bar: 'bg-emerald-400', text: 'text-emerald-300' },
  UGC_FACTORY: { dot: 'bg-fuchsia-500', bar: 'bg-fuchsia-500', text: 'text-fuchsia-300' },
};

const TASK_TONE: Record<TaskStatus, string> = {
  PENDING_ACCEPTANCE: 'bg-zinc-800 text-zinc-300',
  ACCEPTED: 'bg-sky-500/15 text-sky-300',
  IN_PROGRESS: 'bg-amber-500/15 text-amber-300',
  REVIEW: 'bg-violet-500/15 text-violet-300',
  APPROVED: 'bg-emerald-500/15 text-emerald-300',
  REJECTED: 'bg-red-500/15 text-red-300',
};

const CAMPAIGN_TONE: Record<CampaignStatus, string> = {
  DRAFT: 'bg-zinc-800 text-zinc-300',
  ACTIVE: 'bg-emerald-500/15 text-emerald-300',
  PAUSED: 'bg-amber-500/15 text-amber-300',
  COMPLETED: 'bg-zinc-700 text-zinc-200',
};

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {children}
    </span>
  );
}

export const TaskPill = ({ status }: { status: TaskStatus }) => (
  <Pill className={TASK_TONE[status]}>{status.replace('_', ' ').toLowerCase()}</Pill>
);

export const CampaignPill = ({ status }: { status: CampaignStatus }) => (
  <Pill className={CAMPAIGN_TONE[status]}>{status.toLowerCase()}</Pill>
);

export function Kpi({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </div>
  );
}

export function Card({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-white/10 bg-white/[0.02] ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const styles = {
    primary: 'bg-fuchsia-600 text-white hover:bg-fuchsia-500',
    ghost: 'border border-white/15 text-zinc-200 hover:bg-white/5',
    danger: 'border border-red-500/30 text-red-300 hover:bg-red-500/10',
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
