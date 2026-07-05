const TIER_COLORS = {
  urgent: { ring: '#d97706', track: '#fde8cc' },
  active: { ring: '#0284c7', track: '#d6ecfb' },
  dormant: { ring: '#94a3b8', track: '#e2e8f0' },
};

export default function ScoreDial({ score, tierKey }) {
  const { ring, track } = TIER_COLORS[tierKey];
  const circumference = 2 * Math.PI * 16;
  const offset = circumference * (1 - score / 99);

  return (
    <div className="relative h-11 w-11 shrink-0" title={`Urgency score: ${score}/99`}>
      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
        <circle cx="20" cy="20" r="16" fill="none" stroke={track} strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={ring}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold"
        style={{ color: ring }}
      >
        {score}
      </span>
    </div>
  );
}
