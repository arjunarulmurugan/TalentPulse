import { SIGNAL_META, TIER_META } from '../lib/signalMeta';

export default function InfoPanel() {
  return (
    <div className="max-w-5xl mx-auto mb-8 animate-rise-in">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">How this works</h2>
        <p className="text-slate-700 leading-relaxed mb-5">
          Most recruiter tools wait for you to check in on a candidate. TalentPulse checks the world instead:
          every refresh, it asks <span className="font-medium text-slate-900">Crustdata</span> whether anything
          changed for each person on file — a new job, a promotion, a new venture — and re-ranks the list
          around whoever needs a reply <span className="italic">today</span>. Click a card's
          <span className="font-medium text-slate-900"> Draft outreach </span>
          button and <span className="font-medium text-slate-900">GBrain</span> pulls their history so the
          message acknowledges what actually happened, instead of a generic "checking in!"
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Signal types
            </h3>
            <ul className="space-y-2">
              {Object.entries(SIGNAL_META).map(([key, meta]) => (
                <li key={key} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                    {meta.icon}
                  </span>
                  <span>
                    <span className="font-medium text-slate-800">{meta.label}</span> — {meta.hint}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Section thresholds
            </h3>
            <ul className="space-y-2">
              {Object.values(TIER_META).map((tier) => (
                <li key={tier.key} className="flex items-start gap-2 text-sm text-slate-600">
                  <span>{tier.emoji}</span>
                  <span>
                    <span className="font-medium text-slate-800">{tier.title}</span>{' '}
                    <span className="font-mono text-xs text-slate-400">
                      (score ≥ {tier.threshold})
                    </span>
                    {' — '}
                    {tier.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
