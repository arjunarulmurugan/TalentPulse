export default function EmptyState() {
  return (
    <div className="max-w-5xl mx-auto text-center py-20 animate-fade-in">
      <p className="text-4xl mb-3">📭</p>
      <h2 className="text-lg font-semibold text-slate-700">No candidates on file yet</h2>
      <p className="text-sm text-slate-500 mt-1">
        Check that the backend is running at <code className="font-mono">localhost:4000</code> and has seed
        data loaded.
      </p>
    </div>
  );
}
