export default function ContradictionsPanel({ state, onScan, onClose }) {
  if (state.status === 'idle') {
    return (
      <div className="max-w-5xl mx-auto mb-6">
        <button
          type="button"
          onClick={onScan}
          className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
        >
          🧭 Audit past rejections for contradictions
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto mb-12 animate-rise-in">
      <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">🧭 Rejection audit</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600">
            Close ✕
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Claude cross-checks each rejected candidate's stated reason against their full current role list.
        </p>

        {state.status === 'loading' && (
          <div className="flex items-center gap-2 text-violet-700 text-sm py-6 justify-center">
            <span className="animate-spin text-lg">⚙️</span> Checking past rejections with enrichment
            data for contradictions… this runs one Claude call per candidate, so it can take a minute.
          </div>
        )}

        {state.status === 'error' && (
          <p className="text-sm text-rose-600 py-4 text-center">
            Couldn't complete the audit — check the backend connection and try again.
          </p>
        )}

        {state.status === 'done' && (
          <>
            <p className="text-xs font-mono text-slate-400 mb-4">
              {state.checked} checked · {state.flagged} flagged
            </p>
            {state.results.filter((r) => r.isContradiction).length === 0 ? (
              <p className="text-sm text-slate-500 italic py-6 text-center">
                No contradictions found — every past rejection reason still holds up.
              </p>
            ) : (
              <div className="space-y-3">
                {state.results
                  .filter((r) => r.isContradiction)
                  .map((r) => (
                    <div key={r.candidateId} className="rounded-xl border border-amber-200 bg-white p-4">
                      <h3 className="font-semibold text-slate-800 mb-1">{r.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">
                        <span className="font-medium text-rose-600">We said:</span> "{r.rejectionReason}"
                      </p>
                      <p className="text-xs text-slate-500 mb-2">
                        <span className="font-medium text-emerald-600">Reality:</span> {r.currentSummary}
                      </p>
                      <p className="text-sm text-slate-700 bg-amber-50 rounded-lg p-2">{r.explanation}</p>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
