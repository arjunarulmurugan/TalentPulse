import { useState } from 'react';

export default function SearchBar({ onSearch, onClear, isSearching }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mb-6 flex gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask GBrain — e.g. “who do we know with CEO experience”"
          className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-shadow focus:ring-2 focus:ring-emerald-200"
        />
      </div>
      <button
        type="submit"
        disabled={isSearching || !value.trim()}
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-transform active:scale-95 disabled:opacity-40"
      >
        {isSearching ? 'Searching…' : 'Search'}
      </button>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 hover:bg-slate-50"
        >
          Clear
        </button>
      )}
    </form>
  );
}
