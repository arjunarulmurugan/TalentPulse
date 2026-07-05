import React, { useState, useEffect } from 'react';

// Change this if your mate's server is on a different port!
const API_BASE = 'http://localhost:4000/api'; 

function CandidateCard({ candidate }) {
  const { id, name, currentRole, currentCompany, status, lastContactedDaysAgo, urgencyScore, recentSignal } = candidate;
  
  const [draftMessage, setDraftMessage] = useState(null);
  const [isDrafting, setIsDrafting] = useState(false);

  // 1. Determine Card Styling based on Urgency Score
  let cardStyles = "bg-white border border-slate-200 shadow-sm";
  let badgeStyles = "bg-slate-100 text-slate-600";
  let badgeText = "Dormant";

  if (urgencyScore >= 85) {
    cardStyles = "bg-amber-50/50 border-2 border-amber-200 shadow-md ring-4 ring-amber-100/50";
    badgeStyles = "bg-amber-100 text-amber-800 animate-pulse";
    badgeText = "Urgent Pulse";
  } else if (urgencyScore >= 50) {
    cardStyles = "bg-sky-50/30 border border-sky-200 shadow-sm";
    badgeStyles = "bg-sky-100 text-sky-800";
    badgeText = "Active Tracking";
  }

  // --- HOUR 3: Fetch the Claude Draft ---
  const handleGenerateDraft = async () => {
    if (draftMessage) return; // Don't fetch twice
    setIsDrafting(true);
    try {
      const response = await fetch(`${API_BASE}/draft-outreach/${id}`);
      const data = await response.json();
      setDraftMessage(data.draft || data.message || "Hey, saw you've been doing great things...");
    } catch (error) {
      console.error("Draft failed:", error);
      setDraftMessage("Error generating draft. Please check backend connection.");
    }
    setIsDrafting(false);
  };

  return (
    <div 
      className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${cardStyles}`}
      onClick={handleGenerateDraft}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{currentRole} at <span className="font-medium text-slate-600">{currentCompany}</span></p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeStyles}`}>
          {badgeText}
        </span>
      </div>

      {recentSignal && (
        <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">⚡ {recentSignal.type}</p>
          <p className="text-sm text-slate-700">{recentSignal.description}</p>
        </div>
      )}

      {/* HOUR 3: The Expanding Draft Panel */}
      {(isDrafting || draftMessage) && (
        <div className="mt-4 p-4 bg-slate-800 rounded-xl text-slate-100 text-sm animate-fade-in">
          {isDrafting ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="animate-spin text-lg">⚙️</span> GStack Agent drafting...
            </div>
          ) : (
            <div>
              <p className="font-semibold text-emerald-400 mb-2">Suggested Outreach:</p>
              <p className="whitespace-pre-wrap">{draftMessage}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4 mt-4">
        <div>Status: <span className="font-medium text-slate-600 capitalize">{status}</span></div>
        <div>Last Contact: <span className="font-medium text-slate-600">{lastContactedDaysAgo} days ago</span></div>
      </div>
    </div>
  );
}

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- HOUR 3: Connect to Live API ---
  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_BASE}/candidates`);
      const data = await response.json();
      // Adjust this based on your mate's exact JSON shape!
      setCandidates(data.candidates || data); 
    } catch (error) {
      console.error("Failed to load candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // --- HOUR 3: The Pulse Refresh Button ---
  const handleRefreshSignals = async () => {
    setIsRefreshing(true);
    try {
      await fetch(`${API_BASE}/refresh`, { method: 'POST' });
      await fetchCandidates(); // Re-fetch the newly sorted list
    } catch (error) {
      console.error("Refresh failed:", error);
    }
    setIsRefreshing(false);
  };

  const sortedCandidates = [...candidates].sort((a, b) => b.urgencyScore - a.urgencyScore);
  const urgentCandidates = sortedCandidates.filter(c => c.urgencyScore >= 85);
  const activeCandidates = sortedCandidates.filter(c => c.urgencyScore >= 50 && c.urgencyScore < 85);
  const dormantCandidates = sortedCandidates.filter(c => c.urgencyScore < 50);

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <header className="max-w-5xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">TalentPulse</h1>
          <p className="text-slate-500 mt-1">Dynamic Recruiter Interface Practice</p>
        </div>
        
        {/* The Live Action Button */}
        <button 
          onClick={handleRefreshSignals}
          disabled={isRefreshing}
          className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <span className={`h-3 w-3 rounded-full bg-emerald-400 ${isRefreshing ? 'animate-pulse' : 'animate-ping'}`}></span>
          <span className="text-sm font-bold text-slate-700">
            {isRefreshing ? 'Scanning Crustdata...' : 'Refresh Signals'}
          </span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto space-y-12">
        {urgentCandidates.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">🔥 Live Pulse</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentCandidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
            </div>
          </section>
        )}

        {activeCandidates.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">📈 Active Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCandidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
            </div>
          </section>
        )}

        {dormantCandidates.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">❄️ Dormant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dormantCandidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}