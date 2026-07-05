const STAT_DOT = {
  urgent: 'bg-amber-400',
  active: 'bg-sky-400',
  dormant: 'bg-slate-400',
};

function StatPill({ label, count, tone }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
      <span className={`h-1.5 w-1.5 rounded-full ${STAT_DOT[tone]}`} />
      {count} {label}
    </div>
  );
}

function timeAgo(date) {
  if (!date) return 'never';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default function Header({ stats, isRefreshing, lastRefreshedAt, onRefresh, onToggleInfo, infoOpen }) {
  return (
    <header className="signal-scan-bg bg-[var(--color-ink)] px-8 py-7 rounded-3xl mb-8 shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">TalentPulse</h1>
            <button
              type="button"
              onClick={onToggleInfo}
              aria-label="What does this app do?"
              aria-expanded={infoOpen}
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                infoOpen ? 'bg-emerald-400 text-emerald-950' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              i
            </button>
          </div>
          <p className="text-slate-400 mt-1 text-sm">
            The interface reorganizes itself around what candidates are doing right now.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <StatPill label="urgent" count={stats.urgent} tone="urgent" />
            <StatPill label="active" count={stats.active} tone="active" />
            <StatPill label="dormant" count={stats.dormant} tone="dormant" />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-emerald-500 ${isRefreshing ? 'animate-pulse' : ''}`}
            />
            <span className="text-sm font-bold text-slate-800">
              {isRefreshing ? 'Scanning Crustdata…' : 'Refresh Signals'}
            </span>
          </button>
          <span className="font-mono text-[11px] text-slate-500">
            last refreshed: {timeAgo(lastRefreshedAt)}
          </span>
        </div>
      </div>
    </header>
  );
}
