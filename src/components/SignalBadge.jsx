import { SIGNAL_META } from '../lib/signalMeta';

export default function SignalBadge({ signal }) {
  const meta = SIGNAL_META[signal.type];
  if (!meta) return null;

  return (
    <div className="relative p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-100">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
          {meta.icon}
        </span>
        {meta.label}
        <span className="group/tip relative ml-auto cursor-help text-emerald-500" tabIndex={0}>
          ⓘ
          <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-56 rounded-lg bg-slate-900 px-3 py-2 text-xs font-normal normal-case tracking-normal text-slate-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100">
            {meta.hint}
          </div>
        </span>
      </p>
      <p className="text-sm text-slate-700">{signal.description}</p>
    </div>
  );
}
