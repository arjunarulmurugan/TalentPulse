export const SIGNAL_META = {
  left_job: {
    label: 'Left their company',
    icon: '→',
    hint: 'They’re no longer at the company we last had on file — highest-value moment to re-engage.',
  },
  promoted: {
    label: 'Got promoted',
    icon: '↑',
    hint: 'Same company, more senior title — worth checking if the new scope changes their interest.',
  },
  new_company: {
    label: 'New venture or board seat',
    icon: '+',
    hint: 'Picked up an additional role alongside their current one.',
  },
};

export const TIER_META = {
  urgent: {
    key: 'urgent',
    title: 'Live Pulse',
    emoji: '\u{1F525}',
    description: 'A signal landed today. These candidates want a reply before someone else gets there first.',
    threshold: 85,
  },
  active: {
    key: 'active',
    title: 'Active Pipeline',
    emoji: '\u{1F4C8}',
    description: 'Worth a check-in — either a smaller signal, or it’s been a while since last contact.',
    threshold: 50,
  },
  dormant: {
    key: 'dormant',
    title: 'Dormant',
    emoji: '❄️',
    description: 'No news. Nothing to act on until the next signal comes in.',
    threshold: 0,
  },
};

export function tierForScore(score) {
  if (score >= TIER_META.urgent.threshold) return TIER_META.urgent;
  if (score >= TIER_META.active.threshold) return TIER_META.active;
  return TIER_META.dormant;
}

export function formatStatus(status) {
  return status.replace(/-/g, ' ');
}
