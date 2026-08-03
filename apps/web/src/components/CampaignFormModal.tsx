import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Campaign, CampaignStatus, CreateCampaignInput } from '../types/campaign';

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Attiva' },
  { value: 'PAUSED', label: 'In pausa' },
  { value: 'ARCHIVED', label: 'Archiviata' },
];

interface CampaignFormModalProps {
  campaign?: Campaign; // se presente: modalità modifica, altrimenti creazione
  onClose: () => void;
  onSubmit: (input: CreateCampaignInput) => Promise<void>;
}

export function CampaignFormModal({
  campaign,
  onClose,
  onSubmit,
}: CampaignFormModalProps) {
  const isEditing = Boolean(campaign);

  const [name, setName] = useState(campaign?.name ?? '');
  const [status, setStatus] = useState<CampaignStatus>(
    campaign?.status ?? 'ACTIVE',
  );
  const [budget, setBudget] = useState(String(campaign?.budget ?? ''));
  const [spend, setSpend] = useState(String(campaign?.spend ?? '0'));
  const [ctr, setCtr] = useState(String(campaign?.ctr ?? '0'));

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const budgetNum = Number(budget);
    const spendNum = Number(spend);
    const ctrNum = Number(ctr);

    if (!name.trim()) {
      setError('Il nome della campagna è obbligatorio.');
      return;
    }
    if (Number.isNaN(budgetNum) || budgetNum < 0) {
      setError('Il budget deve essere un numero maggiore o uguale a 0.');
      return;
    }
    if (Number.isNaN(spendNum) || spendNum < 0) {
      setError('La spesa deve essere un numero maggiore o uguale a 0.');
      return;
    }
    if (Number.isNaN(ctrNum) || ctrNum < 0 || ctrNum > 100) {
      setError('Il CTR deve essere un numero tra 0 e 100.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        status,
        budget: budgetNum,
        spend: spendNum,
        ctr: ctrNum,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-chalk">
            {isEditing ? 'Modifica campagna' : 'Nuova campagna'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="text-ash hover:text-chalk"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-medium text-ash">Nome</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Natale 2026"
              className="rounded-md border border-border bg-ink px-3 py-2 font-body text-sm text-chalk outline-none focus:border-amber"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-medium text-ash">Stato</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CampaignStatus)}
              className="rounded-md border border-border bg-ink px-3 py-2 font-body text-sm text-chalk outline-none focus:border-amber"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs font-medium text-ash">
                Budget (€)
              </span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="rounded-md border border-border bg-ink px-3 py-2 font-mono text-sm text-chalk outline-none focus:border-amber"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs font-medium text-ash">
                Spesa (€)
              </span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                className="rounded-md border border-border bg-ink px-3 py-2 font-mono text-sm text-chalk outline-none focus:border-amber"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs font-medium text-ash">
                CTR (%)
              </span>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={ctr}
                onChange={(e) => setCtr(e.target.value)}
                className="rounded-md border border-border bg-ink px-3 py-2 font-mono text-sm text-chalk outline-none focus:border-amber"
              />
            </label>
          </div>

          {error && (
            <p className="font-body text-xs text-alert">{error}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 font-body text-sm text-ash hover:text-chalk"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-amber px-4 py-2 font-body text-sm font-medium text-ink hover:bg-amber/90 disabled:opacity-60"
            >
              {saving ? 'Salvataggio...' : isEditing ? 'Salva modifiche' : 'Crea campagna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
