import ScoreDial from './ScoreDial';
import { tierForScore } from '../lib/signalMeta';

export default function SearchResults({ query, results }) {
  return (
    <section className="max-w-5xl mx-auto mb-12 animate-rise-in">
      <h2 className="text-lg font-bold text-slate-800 mb-1">
        Results for <span className="text-emerald-700">“{query}”</span>{' '}
        <span className="text-sm font-normal text-slate-400">({results.length})</span>
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Semantic search over every candidate's GBrain notes, powered by <code className="font-mono">gbrain search</code>.
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-slate-400 italic py-8 text-center">
          No candidate notes matched that query. Try different wording — it searches history and notes,
          not job titles directly.
        </p>
      ) : (
        <div className="space-y-3">
          {results.map((r) => {
            const tier = tierForScore(r.urgencyScore);
            return (
              <div
                key={r.id}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <ScoreDial score={r.urgencyScore} tierKey={tier.key} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{r.name}</h3>
                    <span className="font-mono text-[10px] text-slate-400">
                      relevance {r.relevance.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">
                    {r.currentRole ? `${r.currentRole} at ${r.currentCompany}` : 'No enrichment data yet'}
                  </p>
                  <p className="text-xs text-slate-400 whitespace-pre-wrap font-mono bg-slate-50 rounded-lg p-2">
                    {r.snippet}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
