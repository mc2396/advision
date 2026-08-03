import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Campaign } from '../types/campaign';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function SpendChart({ campaigns }: { campaigns: Campaign[] }) {
  const data = {
    labels: campaigns.map((c) => c.name),
    datasets: [
      {
        label: 'Budget',
        data: campaigns.map((c) => c.budget),
        backgroundColor: '#262F42',
        borderRadius: 4,
      },
      {
        label: 'Spesa',
        data: campaigns.map((c) => c.spend),
        backgroundColor: '#F2A93B',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="font-display text-sm font-medium text-chalk">
        Budget vs spesa
      </h2>
      <div className="mt-4 h-64">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: '#8A93A6', font: { family: 'Inter' } },
              },
            },
            scales: {
              x: {
                ticks: { color: '#8A93A6', font: { family: 'Inter' } },
                grid: { display: false },
              },
              y: {
                ticks: { color: '#8A93A6', font: { family: 'JetBrains Mono' } },
                grid: { color: '#262F42' },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
