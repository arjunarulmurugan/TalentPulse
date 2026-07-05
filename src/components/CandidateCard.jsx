import { useState } from 'react';
import ScoreDial from './ScoreDial';
import SignalBadge from './SignalBadge';
import { tierForScore, formatStatus } from '../lib/signalMeta';

const TIER_CARD_STYLES = {
  urgent: 'bg-amber-50/60 border-2 border-amber-200 shadow-md hover:shadow-lg hover:shadow-amber-100',
  active: 'bg-sky-50/40 border border-sky-200 shadow-sm hover:shadow-md hover:shadow-sky-100',
  dormant: 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
};

const STATUS_STYLES = {
  rejected: 'bg-rose-50 text-rose-700',
  ghosted: 'bg-slate-100 text-slate-600',
  'in-process': 'bg-violet-50 text-violet-700',
};

export default function CandidateCard({ candidate }) {
  const { name, currentRole, currentCompany, status, lastContactedDaysAgo, urgencyScore, recentSignal } =
    candidate;

  const [draftMessage, setDraftMessage] = useState(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftError, setDraftError] = useState(false);
  const tier = tierForScore(urgencyScore);

  const handleGenerateDraft = async (event) => {
    event.stopPropagation();
    if (draftMessage || isDrafting) return;
    setIsDrafting(true);
    setDraftError(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api'}/draft-outreach/${candidate.id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setDraftMessage(data.draft || data.message || 'No draft returned.');
    } catch (error) {
      console.error('Draft failed:', error);
      setDraftError(true);
    }
    setIsDrafting(false);
  };

  return (
    <div
      className={`group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${TIER_CARD_STYLES[tier.key]} ${
        tier.key === 'urgent' ? 'animate-glow-pulse' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-1 gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 truncate">{name}</h3>
          <p className="text-sm text-slate-500 truncate">
            {currentRole ? (
              <>
                {currentRole} at <span className="font-medium text-slate-600">{currentCompany}</span>
              </>
            ) : (
              <span className="italic text-slate-400">No enrichment data yet</span>
            )}
          </p>
        </div>
        <ScoreDial score={urgencyScore} tierKey={tier.key} />
      </div>

      <span
        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize mb-4 ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}
      >
        {formatStatus(status)}
      </span>

      {recentSignal && <SignalBadge signal={recentSignal} />}

      {!draftMessage && !isDrafting && !draftError && (
        <button
          type="button"
          onClick={handleGenerateDraft}
          className="w-full mb-1 rounded-xl border border-slate-200 bg-white/70 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          ✍️ Draft outreach message
        </button>
      )}

      {(isDrafting || draftMessage || draftError) && (
        <div className="mt-1 p-4 bg-slate-800 rounded-xl text-slate-100 text-sm animate-rise-in">
          {isDrafting ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="animate-spin text-lg">⚙️</span> Drafting with Claude…
            </div>
          ) : draftError ? (
            <p className="text-rose-300">Couldn't generate a draft — check the backend connection and try again.</p>
          ) : (
            <div>
              <p className="font-semibold text-emerald-400 mb-2">Suggested Outreach</p>
              <p className="whitespace-pre-wrap leading-relaxed">{draftMessage}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4 mt-4">
        <span>
          Last contact:{' '}
          <span className="font-medium text-slate-600">
            {lastContactedDaysAgo === null ? 'never' : `${lastContactedDaysAgo}d ago`}
          </span>
        </span>
        <span className="font-mono text-[10px] text-slate-300">{candidate.id}</span>
      </div>
    </div>
  );
}
