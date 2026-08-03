import type { CampaignStatus } from '../types/campaign';

const FILL_COLOR: Record<CampaignStatus, string> = {
  ACTIVE: 'bg-active',
  PAUSED: 'bg-ash',
  ARCHIVED: 'bg-archived',
};

export function BudgetBar({
  budget,
  spend,
  status,
}: {
  budget: number;
  spend: number;
  status: CampaignStatus;
}) {
  const ratio = budget > 0 ? spend / budget : 0;
  const pct = Math.min(ratio, 1) * 100;
  const overBudget = ratio > 1;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className={overBudget ? 'text-alert' : 'text-chalk'}>
          €{spend.toLocaleString('it-IT')}
        </span>
        <span className="text-ash">/ €{budget.toLocaleString('it-IT')}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${overBudget ? 'bg-alert' : FILL_COLOR[status]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
