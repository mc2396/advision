import type { CampaignStatus } from '../types/campaign';

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; dot: string; text: string }
> = {
  ACTIVE: { label: 'Attiva', dot: 'bg-active', text: 'text-active' },
  PAUSED: { label: 'In pausa', dot: 'bg-paused', text: 'text-ash' },
  ARCHIVED: { label: 'Archiviata', dot: 'bg-archived', text: 'text-archived' },
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-xs font-medium">
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span className={config.text}>{config.label}</span>
    </span>
  );
}
