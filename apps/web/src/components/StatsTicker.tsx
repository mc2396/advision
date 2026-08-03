import type { Campaign } from '../types/campaign';

function computeStats(campaigns: Campaign[]) {
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const avgCtr =
    campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length
      : 0;

  return { totalBudget, totalSpend, activeCount, avgCtr };
}

export function StatsTicker({ campaigns }: { campaigns: Campaign[] }) {
  const { totalBudget, totalSpend, activeCount, avgCtr } =
    computeStats(campaigns);

  const items = [
    { label: 'Campagne attive', value: `${activeCount} / ${campaigns.length}` },
    { label: 'Budget totale', value: `€${totalBudget.toLocaleString('it-IT')}` },
    { label: 'Spesa totale', value: `€${totalSpend.toLocaleString('it-IT')}` },
    { label: 'CTR medio', value: `${avgCtr.toFixed(2)}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-surface px-5 py-4">
          <div className="font-body text-xs uppercase tracking-wide text-ash">
            {item.label}
          </div>
          <div className="mt-1 font-mono text-2xl font-medium text-chalk">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
