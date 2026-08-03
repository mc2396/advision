import type { Campaign } from '../types/campaign';
import { StatusBadge } from './StatusBadge';
import { BudgetBar } from './BudgetBar';
import { RowActions } from './RowActions';

interface CampaignsTableProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => Promise<void>;
}

export function CampaignsTable({
  campaigns,
  onEdit,
  onDelete,
}: CampaignsTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface px-5 py-10 text-center">
        <p className="font-display text-sm text-chalk">
          Nessuna campagna ancora
        </p>
        <p className="mt-1 font-body text-xs text-ash">
          Crea la prima campagna con il pulsante in alto.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-ash">
              Campagna
            </th>
            <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-ash">
              Stato
            </th>
            <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-ash">
              Budget utilizzato
            </th>
            <th className="px-5 py-3 text-right font-body text-xs font-medium uppercase tracking-wide text-ash">
              CTR
            </th>
            <th className="px-5 py-3 text-right font-body text-xs font-medium uppercase tracking-wide text-ash">
              Azioni
            </th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr
              key={campaign.id}
              className="border-b border-border last:border-b-0 hover:bg-surface-hover"
            >
              <td className="px-5 py-4 font-display text-sm font-medium text-chalk">
                {campaign.name}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={campaign.status} />
              </td>
              <td className="px-5 py-4">
                <div className="max-w-[220px]">
                  <BudgetBar
                    budget={campaign.budget}
                    spend={campaign.spend}
                    status={campaign.status}
                  />
                </div>
              </td>
              <td className="px-5 py-4 text-right font-mono text-sm text-chalk">
                {campaign.ctr.toFixed(1)}%
              </td>
              <td className="px-5 py-4">
                <RowActions
                  onEdit={() => onEdit(campaign)}
                  onDelete={() => onDelete(campaign.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
