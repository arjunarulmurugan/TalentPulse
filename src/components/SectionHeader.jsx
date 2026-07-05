export default function SectionHeader({ tier, count }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-slate-800">
        {tier.emoji} {tier.title}{' '}
        <span className="text-sm font-normal text-slate-400 font-mono">({count})</span>
      </h2>
      <p className="text-sm text-slate-500 mt-0.5">{tier.description}</p>
    </div>
  );
}
