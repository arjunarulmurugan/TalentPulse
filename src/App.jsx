import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import SectionHeader from './components/SectionHeader';
import CandidateCard from './components/CandidateCard';
import CardSkeleton from './components/CardSkeleton';
import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ContradictionsPanel from './components/ContradictionsPanel';
import { tierForScore, TIER_META } from './lib/signalMeta';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api';

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [search, setSearch] = useState({ query: null, results: [], isSearching: false });
  const [contradictions, setContradictions] = useState({ status: 'idle' });

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/candidates`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setCandidates(data.candidates || data);
      setLoadError(false);
    } catch (error) {
      console.error('Failed to load candidates:', error);
      setLoadError(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleRefreshSignals = async () => {
    setIsRefreshing(true);
    try {
      await fetch(`${API_BASE}/refresh`, { method: 'POST' });
      await fetchCandidates();
      setLastRefreshedAt(new Date());
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setIsRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearch({ query, results: [], isSearching: true });
    try {
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setSearch({ query, results: data.results ?? [], isSearching: false });
    } catch (error) {
      console.error('Search failed:', error);
      setSearch({ query, results: [], isSearching: false });
    }
  };

  const handleClearSearch = () => setSearch({ query: null, results: [], isSearching: false });

  const handleScanContradictions = async () => {
    setContradictions({ status: 'loading' });
    try {
      const response = await fetch(`${API_BASE}/contradictions`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setContradictions({ status: 'done', ...data });
    } catch (error) {
      console.error('Contradiction scan failed:', error);
      setContradictions({ status: 'error' });
    }
  };

  const buckets = { urgent: [], active: [], dormant: [] };
  for (const candidate of candidates) {
    buckets[tierForScore(candidate.urgencyScore).key].push(candidate);
  }
  for (const key of Object.keys(buckets)) {
    buckets[key].sort((a, b) => b.urgencyScore - a.urgencyScore);
  }

  const stats = {
    urgent: buckets.urgent.length,
    active: buckets.active.length,
    dormant: buckets.dormant.length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <Header
          stats={stats}
          isRefreshing={isRefreshing}
          lastRefreshedAt={lastRefreshedAt}
          onRefresh={handleRefreshSignals}
          onToggleInfo={() => setInfoOpen((v) => !v)}
          infoOpen={infoOpen}
        />
      </div>

      {infoOpen && <InfoPanel />}

      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isSearching={search.isSearching} />
      <ContradictionsPanel
        state={contradictions}
        onScan={handleScanContradictions}
        onClose={() => setContradictions({ status: 'idle' })}
      />

      {search.query && !search.isSearching && (
        <SearchResults query={search.query} results={search.results} />
      )}

      {!search.query && (
        <main className="max-w-5xl mx-auto space-y-12">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && loadError && (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">⚠️</p>
              <h2 className="text-lg font-semibold text-slate-700">Couldn't reach the backend</h2>
              <p className="text-sm text-slate-500 mt-1">
                Make sure it's running at <code className="font-mono">{API_BASE}</code>, then refresh the page.
              </p>
            </div>
          )}

          {!isLoading && !loadError && candidates.length === 0 && <EmptyState />}

          {!isLoading &&
            !loadError &&
            candidates.length > 0 &&
            Object.values(TIER_META).map((tier) => {
              const list = buckets[tier.key];
              if (list.length === 0) return null;
              return (
                <section key={tier.key} className="animate-fade-in">
                  <SectionHeader tier={tier} count={list.length} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((c) => (
                      <CandidateCard key={c.id} candidate={c} />
                    ))}
                  </div>
                </section>
              );
            })}
        </main>
      )}
    </div>
  );
}
